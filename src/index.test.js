const test = require('assert');
const sinon = require('sinon');

const Wurd = require('./index').Wurd;
const Block = require('./block');

const same = test.deepStrictEqual;


describe('Wurd', function () {
  beforeEach(function () {
    sinon.stub(Wurd.prototype, '_fetch').resolves();
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
  });


  describe('#load()', function () {
    let wurd;

    beforeEach(function () {
      wurd = new Wurd();
      wurd.connect('foo');

      let cacheData = {
        lorem: { title: 'Lorem' },
        ipsum: undefined,
        dolor: { title: 'Dolor' },
        amet: undefined
      };

      let fetchPromise = Promise.resolve({
        ipsum: { title: 'Ipsum' },
        amet: { title: 'Amet' }
      });

      sinon.stub(wurd, '_loadFromCache').returns(cacheData);
      sinon.stub(wurd, '_loadFromServer').returns(fetchPromise);
    });

    it('returns a promise', function () {
      let promise = wurd.load('a');

      test.ok(promise instanceof Promise);
    });

    it('errors if connect was not called first', function () {
      wurd = new Wurd();

      test.throws(() => wurd.load('foo'), {
        message: 'Use wurd.connect(appName) before wurd.load()'
      });
    })

    it('loads content from cache and server', async function () {
      const content = await wurd.load('lorem,ipsum,dolor,amet')

      let expectedContent = {
        lorem: { title: 'Lorem' },
        ipsum: { title: 'Ipsum' },
        dolor: { title: 'Dolor' },
        amet: { title: 'Amet' }
      };

      same(content.content, expectedContent);
    });

    it('accepts options that override defaults', async function () {
      const content = await wurd.load('lorem', { log: true, lang: 'es' });

      let optionsArg = wurd._loadFromServer.args[0][1];

      same(optionsArg.log, true);
      same(optionsArg.lang, 'es');
    });

    it('checks cache when NOT in draft mode', async function () {
      const content = await wurd.load('lorem', { draft: false });

      same(wurd._loadFromCache.callCount, 1);
      same(wurd._loadFromServer.callCount, 1);
    });

    it('does not check cache when in draft mode', async function () {
      const content = await wurd.load('lorem', { draft: true });

      same(wurd._loadFromCache.callCount, 0);
      same(wurd._loadFromServer.callCount, 1);
    });

    it('forces draft to true if editMode is true', async function () {
      const content = await wurd.load('test', { editMode: true });

      same(content.editMode, true);
      same(content.draft, true);

      same(wurd._loadFromCache.callCount, 0);
      same(wurd._loadFromServer.callCount, 1);

      let optionsArg = wurd._loadFromServer.args[0][1];

      same(optionsArg.draft, true);
      same(optionsArg.editMode, true);
    });

    it('returns a Block', async function () {
      const block = await wurd.load('test');

      test.ok(block instanceof Block);

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
    });

    it('returns a Block, with custom options', async function () {
      const block = await wurd.load('test', { editMode: true, lang: 'es' });

      test.ok(block instanceof Block);

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
    });

    it('caches fetched content');
  });


  describe('#mw()', function () {
    let wurd, block;

    beforeEach(function () {
      wurd = new Wurd();
      block = new Block();
      sinon.stub(wurd, 'load').resolves(block);
    });

    it('with editMode === "querystring" option: sets editMode if edit query parameter is available', function (done) {
      let mw = wurd.connect('test', {
        editMode: 'querystring'
      }).mw();

      let req = {
        query: { edit: '' }
      };

      let res = {};

      mw(req, res, function () {
        same(wurd.load.args[0][1], {
          draft: true,
          editMode: true,
          lang: undefined
        });

        done();
      });
    });

    it('with langMode === "querystring" option: sets lang if lang query parameter is available', function (done) {
      let mw = wurd.connect('test', {
        langMode: 'querystring'
      }).mw();

      let req = {
        query: { lang: 'pt' }
      };

      let res = {};

      mw(req, res, function () {
        same(wurd.load.args[0][1], {
          lang: 'pt',
          editMode: false,
          draft: false,
        });

        done();
      });
    });
  });


  describe('#_saveToCache()', function () {
    let wurd;

    beforeEach(function () {
      wurd = new Wurd();
      wurd.connect('foo');
    });

    it('saves content to the cache - with default language', async function () {
      let content = {
        foo: { title: 'Foo' },
        bar: { title: 'Bar' }
      };

      await wurd._saveToCache(content);

      same(wurd.cache.get('/foo'), { title: 'Foo' });
      same(wurd.cache.get('/bar'), { title: 'Bar' });
    });

    it('saves content to the cache - with specified language', async function () {
      let content = {
        foo: { title: 'Foo' },
        bar: { title: 'Bar' }
      };

      await wurd._saveToCache(content, { lang: 'fr' });

      same(wurd.cache.get('fr/foo'), { title: 'Foo' });
      same(wurd.cache.get('fr/bar'), { title: 'Bar' });
    });
  });


  describe('#_loadFromCache()', function () {
    let wurd;

    beforeEach(function () {
      wurd = new Wurd();
      wurd.connect('foo');
    });

    describe('without specified language (uses default)', function () {
      beforeEach(function () {
        wurd.cache.set('/lorem', { title: 'Lorem' });
        wurd.cache.set('/ipsum', { title: 'Ipsum' });
        wurd.cache.set('/dolor', { title: 'Dolor' });
      });

      it('returns items that are in the cache - with default language', async function () {
        const content = await wurd._loadFromCache(['lorem', 'dolor', 'bla']);

        same(content.lorem, { title: 'Lorem' });
        same(content.dolor, { title: 'Dolor' });

        same(content.bla, undefined);
      });
    });

    describe('WITH specified language', function () {
      beforeEach(function () {
        wurd.cache.set('fr/lorem', { title: 'Lorem' });
        wurd.cache.set('fr/ipsum', { title: 'Ipsum' });
        wurd.cache.set('fr/dolor', { title: 'Dolor' });
      });

      it('returns items that are in the cache - with default language', async function () {
        const content = await wurd._loadFromCache(['lorem', 'dolor', 'bla'], { lang: 'fr' });

        same(content.lorem, { title: 'Lorem' });
        same(content.dolor, { title: 'Dolor' });

        same(content.bla, undefined);
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

    it('fetches sections from the server', async function () {
      const content = await wurd._loadFromServer(['foo', 'bar'], {});

      same(content, {
        foo: { title: 'Foo' },
        bar: { title: 'Bar' }
      });

      same(wurd._fetch.callCount, 1);
      same(wurd._fetch.args[0][0], 'https://api-v3.wurd.io/apps/foo/content/foo,bar?');
    });

    it('passes draft and lang options', async function () {
      const content = await wurd._loadFromServer(['foo', 'bar'], { draft: true, lang: 'fr' });

      same(wurd._fetch.callCount, 1);
      same(wurd._fetch.args[0][0], 'https://api-v3.wurd.io/apps/foo/content/foo,bar?draft=1&lang=fr');
    });
  });


  describe('#_fetch()', function () {
    it('fetches from the server');
  });

});
