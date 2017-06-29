const test = require('assert');
const async = require('async');
const sinon = require('sinon');
const Wurd = require('./index').Wurd;

const same = test.strictEqual;

describe('Wurd', function() {
  beforeEach(function() {
    this.sinon = sinon.sandbox.create();

    //Stub fetch()
    let fetchPromise = new Promise((resolve, reject) => resolve({}));

    this.sinon.stub(Wurd.prototype, '_fetch').returns(fetchPromise);
  });

  afterEach(function() {
    this.sinon.restore();
  });


  describe('#connect()', function() {
    it('sets up the instance, with default options', function() {
      let wurd = new Wurd();

      wurd.connect('myApp');

      same(wurd.app, 'myApp');
      same(wurd.draft, false);
    });
  });


  describe('#load()', function() {
    let wurd;

    beforeEach(function() {
      wurd = new Wurd();
      wurd.connect('foo');

      let cachePromise = new Promise((resolve, reject) => resolve({
        lorem: { title: 'Lorem' },
        ipsum: undefined,
        dolor: { title: 'Dolor' },
        amet: undefined
      }));

      let fetchPromise = new Promise((resolve, reject) => resolve({
        ipsum: { title: 'Ipsum' },
        amet: { title: 'Amet' }
      }));

      this.sinon.stub(wurd, '_loadFromCache').returns(cachePromise);
      this.sinon.stub(wurd, '_loadFromServer').returns(fetchPromise);
    });

    it('returns a promise', function() {
      let promise = wurd.load('a');
      
      test.ok(promise instanceof Promise);
    });

    it('errors if connect was not called first', function(done) {
      wurd = new Wurd();

      wurd.load('foo')
        .then(content => done(new Error('Expected an error')))
        .catch(err => {
          same(err.message, 'Use wurd.connect(appName) before wurd.load()');

          done();
        });
    })

    it('loads content from cache and server', function(done) {
      wurd.load('lorem,ipsum,dolor,amet')
        .then(content => {
          let expectedContent = {
            lorem: { title: 'Lorem' },
            ipsum: { title: 'Ipsum' },
            dolor: { title: 'Dolor' },
            amet: { title: 'Amet' }
          };

          test.deepEqual(content, expectedContent);
          test.deepEqual(wurd.content, expectedContent);

          done();
        })
        .catch(done);
    });
  });


  describe('#_saveToCache()', function() {
    let wurd;

    beforeEach(function() {
      wurd = new Wurd();
      wurd.connect('foo');
    });

    it('returns a promise', function() {
      let content = {
        foo: { title: 'Foo' }
      };

      let promise = wurd._saveToCache(content);
      
      test.ok(promise instanceof Promise);
    });

    it('saves content to the cache, keyed by section ID', function(done) {
      let content = {
        foo: { title: 'Foo' },
        bar: { title: 'Bar' }
      };

      wurd._saveToCache(content)
        .then(() => {
          async.auto({
            foo: cb => wurd.cache.get('foo', cb),
            bar: cb => wurd.cache.get('bar', cb)
          }, (err, results) => {
            if (err) return done(err);

            test.deepEqual(results.foo, {title: 'Foo'});
            test.deepEqual(results.bar, {title: 'Bar'});

            done();
          });
        })
        .catch(done);
    });
  });


  describe('#_loadFromCache()', function() {
    let wurd;

    beforeEach(function(done) {
      wurd = new Wurd();
      wurd.connect('foo');

      async.auto({
        lorem: cb => wurd.cache.set('lorem', { title: 'Lorem' }, cb),
        ipsum: cb => wurd.cache.set('ipsum', { title: 'Ipsum' }, cb),
        dolor: cb => wurd.cache.set('dolor', { title: 'Dolor' }, cb),
      }, done);
    });

    it('returns a promise', function() {
      let promise = wurd._loadFromCache(['a']);
      
      test.ok(promise instanceof Promise);
    });

    it('returns items that are in the cache', function(done) {
      wurd._loadFromCache(['lorem', 'dolor', 'bla'])
        .then(content => {
          test.deepEqual(content.lorem, { title: 'Lorem' });
          test.deepEqual(content.dolor, { title: 'Dolor' });

          same(content.bla, undefined);

          done();
        })
        .catch(done);
    });
  });


  describe('#_loadFromServer()', function() {
    let wurd;

    beforeEach(function() {
      wurd = new Wurd();
      wurd.connect('foo');

      let fetchedContent = {
        foo: { title: 'Foo' },
        bar: { title: 'Bar' }
      };

      let fetchPromise = new Promise((resolve, reject) => resolve(fetchedContent));

      Wurd.prototype._fetch.returns(fetchPromise);

      this.sinon.stub(wurd, '_saveToCache');
    });

    it('returns a promise', function() {
      let promise = wurd._loadFromServer(['a']);
      
      test.ok(promise instanceof Promise);
    });

    it('fetches sections from the server', function(done) {
      wurd._loadFromServer(['foo', 'bar'])
        .then(content => {
          test.deepEqual(content, {
            foo: { title: 'Foo' },
            bar: { title: 'Bar' }
          });

          same(wurd._fetch.callCount, 1);
          same(wurd._fetch.args[0][0], 'https://api-v3.wurd.io/apps/foo/content/foo,bar?');

          done();
        })
        .catch(done);
    });

    it('caches fetched content', function(done) {
      wurd._loadFromServer(['foo'])
        .then(content => {
          same(wurd._saveToCache.callCount, 1);
          same(wurd._saveToCache.args[0][0], content);

          done();
        })
        .catch(done);
    });
  });


  describe('#_fetch()', function() {
    it('fetches from the server');
  });

});
