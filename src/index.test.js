const test = require('assert');
const async = require('async');
const sinon = require('sinon');

const Wurd = require('./index').Wurd;
const Block = require('./block');

const same = test.deepStrictEqual;


describe('Wurd', function () {
  beforeEach(function () {
    let fetchPromise = new Promise((resolve, reject) => resolve({}));

    sinon.stub(Wurd.prototype, '_fetch').returns(fetchPromise);
  });

  afterEach(function () {
    sinon.restore();
  });


  describe('#connect()', function () {
    it('sets up the instance, with default options', function () {
      let wurd = new Wurd();

      wurd.connect('myApp');

      same(wurd.app, 'myApp');
      same(wurd.options.draft, false);
      same(wurd.options.editMode, false);
      same(wurd.options.lang, null);
      same(wurd.options.log, false);
    });

    it('accepts options', function () {
      let wurd = new Wurd();

      wurd.connect('foo', {
        draft: true,
        editMode: true,
        lang: 'es',
        log: true
      });

      same(wurd.app, 'foo');
      same(wurd.options.draft, true);
      same(wurd.options.editMode, true);
      same(wurd.options.lang, 'es');
      same(wurd.options.log, true);
    });

    it('sets draft option to true if editMode is true', function () {
      let wurd = new Wurd();

      wurd.connect('myApp', {
        editMode: true
      });

      same(wurd.options.draft, true);
    });

    describe('app middleware', function () {
      it('with editMode === "querystring" option: sets editMode if edit query parameter is available', function (done) {
        let wurd = new Wurd();
        let mw = wurd.connect('test', {
          editMode: 'querystring'
        });

        let req = {
          query: { edit: '' }
        };

        let res = {};

        mw(req, res, function () {
          same(req.wurd, {
            draft: true,
            editMode: true
          });

          done();
        });
      });

      it('with langMode === "querystring" option: sets lang if lang query parameter is available', function (done) {
        let wurd = new Wurd();
        let mw = wurd.connect('test', {
          langMode: 'querystring'
        });

        let req = {
          query: { lang: 'pt' }
        };

        let res = {};

        mw(req, res, function () {
          same(req.wurd, {
            lang: 'pt'
          });

          done();
        });
      });
    });
  });


  describe('#load()', function () {
    let wurd;

    beforeEach(function () {
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

      sinon.stub(wurd, '_loadFromCache').returns(cachePromise);
      sinon.stub(wurd, '_loadFromServer').returns(fetchPromise);
    });

    it('returns a promise', function () {
      let promise = wurd.load('a');

      test.ok(promise instanceof Promise);
    });

    it('errors if connect was not called first', function (done) {
      wurd = new Wurd();

      wurd.load('foo')
        .then(content => done(new Error('Expected an error')))
        .catch(err => {
          same(err.message, 'Use wurd.connect(appName) before wurd.load()');

          done();
        });
    })

    it('loads content from cache and server', function (done) {
      wurd.load('lorem,ipsum,dolor,amet')
        .then(content => {
          let expectedContent = {
            lorem: { title: 'Lorem' },
            ipsum: { title: 'Ipsum' },
            dolor: { title: 'Dolor' },
            amet: { title: 'Amet' }
          };

          same(content.content, expectedContent);

          done();
        })
        .catch(done);
    });

    it('accepts options that override defaults', function (done) {
      wurd.load('lorem', { log: true, lang: 'es' })
        .then(content => {
          let optionsArg = wurd._loadFromServer.args[0][1];

          same(optionsArg.log, true);
          same(optionsArg.lang, 'es');

          done();
        })
        .catch(done);
    });

    it('checks cache when NOT in draft mode', function (done) {
      wurd.load('lorem', { draft: false })
        .then(content => {
          same(wurd._loadFromCache.callCount, 1);
          same(wurd._loadFromServer.callCount, 1);

          done();
        })
        .catch(done);
    });

    it('does not check cache when in draft mode', function (done) {
      wurd.load('lorem', { draft: true })
        .then(content => {
          same(wurd._loadFromCache.callCount, 0);
          same(wurd._loadFromServer.callCount, 1);

          done();
        })
        .catch(done);
    });

    it('forces draft to true if editMode is true', function (done) {
      wurd.load('test', { editMode: true })
        .then(content => {
          same(content.editMode, true);
          same(content.draft, true);

          same(wurd._loadFromCache.callCount, 0);
          same(wurd._loadFromServer.callCount, 1);

          let optionsArg = wurd._loadFromServer.args[0][1];

          same(optionsArg.draft, true);
          same(optionsArg.editMode, true);

          done();
        })
        .catch(done);
    });

    it('returns a Block', function (done) {
      wurd.load('test')
        .then(block => {
          test.ok(block instanceof Block);

          same(block.app, 'foo');
          same(block.path, null);
          same(block.editMode, false);
          same(block.draft, false);
          same(block.lang, null);

          same(block.content, {
            lorem: { title: 'Lorem' },
            ipsum: { title: 'Ipsum' },
            dolor: { title: 'Dolor' },
            amet: { title: 'Amet' }
          });

          same(block.options, {
            draft: false,
            editMode: false,
            lang: null,
            log: false
          });

          done();
        });
    });

    it('returns a Block, with custom options', function (done) {
      wurd.load('test', { editMode: true, lang: 'es' })
        .then(block => {
          test.ok(block instanceof Block);

          same(block.app, 'foo');
          same(block.path, null);
          same(block.editMode, true);
          same(block.draft, true);
          same(block.lang, 'es');

          same(block.content, {
            ipsum: { title: 'Ipsum' },
            amet: { title: 'Amet' }
          });

          same(block.options, {
            draft: true,
            editMode: true,
            lang: 'es',
            log: false
          });

          done();
        });
    });

    it('caches fetched content');
  });


  describe('#mw()', function () {
    it('returns route middleware that loads options from request');
  });


  describe('#_saveToCache()', function () {
    let wurd;

    beforeEach(function () {
      wurd = new Wurd();
      wurd.connect('foo');
    });

    it('returns a promise', function () {
      let content = {
        foo: { title: 'Foo' }
      };

      let promise = wurd._saveToCache(content);

      test.ok(promise instanceof Promise);
    });

    it('saves content to the cache - with default language', function (done) {
      let content = {
        foo: { title: 'Foo' },
        bar: { title: 'Bar' }
      };

      wurd._saveToCache(content)
        .then(() => {
          async.auto({
            foo: cb => wurd.cache.get('/foo', cb),
            bar: cb => wurd.cache.get('/bar', cb)
          }, (err, results) => {
            if (err) return done(err);

            same(results.foo, { title: 'Foo' });
            same(results.bar, { title: 'Bar' });

            done();
          });
        })
        .catch(done);
    });

    it('saves content to the cache - with specified language', function (done) {
      let content = {
        foo: { title: 'Foo' },
        bar: { title: 'Bar' }
      };

      wurd._saveToCache(content, { lang: 'fr' })
        .then(() => {
          async.auto({
            foo: cb => wurd.cache.get('fr/foo', cb),
            bar: cb => wurd.cache.get('fr/bar', cb)
          }, (err, results) => {
            if (err) return done(err);

            same(results.foo, { title: 'Foo' });
            same(results.bar, { title: 'Bar' });

            done();
          });
        })
        .catch(done);
    });
  });


  describe('#_loadFromCache()', function () {
    let wurd;

    beforeEach(function () {
      wurd = new Wurd();
      wurd.connect('foo');
    });

    it('returns a promise', function () {
      let promise = wurd._loadFromCache(['a']);

      test.ok(promise instanceof Promise);
    });

    describe('without specified language (uses default)', function () {
      beforeEach(function (done) {
        async.auto({
          lorem: cb => wurd.cache.set('/lorem', { title: 'Lorem' }, cb),
          ipsum: cb => wurd.cache.set('/ipsum', { title: 'Ipsum' }, cb),
          dolor: cb => wurd.cache.set('/dolor', { title: 'Dolor' }, cb),
        }, done);
      });

      it('returns items that are in the cache - with default language', function (done) {
        wurd._loadFromCache(['lorem', 'dolor', 'bla'])
          .then(content => {
            same(content.lorem, { title: 'Lorem' });
            same(content.dolor, { title: 'Dolor' });

            same(content.bla, undefined);

            done();
          })
          .catch(done);
      });
    });

    describe('WITH specified language', function () {
      beforeEach(function (done) {
        async.auto({
          lorem: cb => wurd.cache.set('fr/lorem', { title: 'Lorem' }, cb),
          ipsum: cb => wurd.cache.set('fr/ipsum', { title: 'Ipsum' }, cb),
          dolor: cb => wurd.cache.set('fr/dolor', { title: 'Dolor' }, cb),
        }, done);
      });

      it('returns items that are in the cache - with default language', function (done) {
        wurd._loadFromCache(['lorem', 'dolor', 'bla'], { lang: 'fr' })
          .then(content => {
            same(content.lorem, { title: 'Lorem' });
            same(content.dolor, { title: 'Dolor' });

            same(content.bla, undefined);

            done();
          })
          .catch(done);
      });
    });
  });


  describe('#_loadFromServer()', function () {
    let wurd;

    beforeEach(function () {
      wurd = new Wurd();
      wurd.connect('foo');

      let fetchedContent = {
        foo: { title: 'Foo' },
        bar: { title: 'Bar' }
      };

      let fetchPromise = new Promise((resolve, reject) => resolve(fetchedContent));

      Wurd.prototype._fetch.returns(fetchPromise);

      sinon.stub(wurd, '_saveToCache');
    });

    it('returns a promise', function () {
      let promise = wurd._loadFromServer(['a'], {});

      test.ok(promise instanceof Promise);
    });

    it('fetches sections from the server', function (done) {
      wurd._loadFromServer(['foo', 'bar'], {})
        .then(content => {
          same(content, {
            foo: { title: 'Foo' },
            bar: { title: 'Bar' }
          });

          same(wurd._fetch.callCount, 1);
          same(wurd._fetch.args[0][0], 'https://api-v3.wurd.io/apps/foo/content/foo,bar?');

          done();
        })
        .catch(done);
    });

    it('passes draft and lang options', function (done) {
      wurd._loadFromServer(['foo', 'bar'], { draft: true, lang: 'fr' })
        .then(content => {
          same(wurd._fetch.callCount, 1);
          same(wurd._fetch.args[0][0], 'https://api-v3.wurd.io/apps/foo/content/foo,bar?draft=1&lang=fr');

          done();
        })
        .catch(done);
    });
  });


  describe('#_fetch()', function () {
    it('fetches from the server');
  });

});
