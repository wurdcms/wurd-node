const _fetch = typeof fetch !== 'undefined' ? fetch : require('node-fetch');
const { getCacheId, getCache } = require('./utils');
const Block = require('./block');

const API_URL = typeof process !== 'undefined' && process.env.WURD_API_URL || 'https://api-v3.wurd.io';


const hasEditQueryString = () => typeof location !== 'undefined' && new URLSearchParams(location.search).has('edit');


class Wurd {
  constructor(options) {
    this.app = null;

    this.options = {
      draft: false,
      editMode: false,
      lang: null,
      log: false,
      ...options,
    };

    this.cache = getCache();
  }

  /**
   * Sets up the default connection/instance
   *
   * @param {String} app                          The app name
   * @param {Object} [options]
   * @param {Boolean} [options.draft]             If true, loads draft content; otherwise loads published content
   * @param {Boolean|String} [options.editMode]   Options for enabling edit mode: `true` or `'querystring'`
   *
   * @return {Function} middleware
   */
  connect(app, options) {
    this.app = app;

    this.options = { ...this.options, ...options };

    if (this.options.editMode === true || this.options.editMode === 'querystring' && hasEditQueryString()) {
      this.options.draft = true;
    }

    return this;
  }

  /**
   * Loads a section of content so that it's items are ready to be accessed with #get(id)
   *
   * @param {String|Array} ids      IDs of sections to load content for. Can be an array or comma-separated string of sections to load, e.g. 'main,home'
   * @param {Object} [opts]      Options to override the instance defaults.
   * 
   * @return {Promise}
   */
  load(_ids, _options) {
    //Merge default and request options
    const options = { ...this.options, ..._options };

    //Force draft to true if in editMode
    if (options.editMode === true || this.options.editMode === 'querystring' && hasEditQueryString()) {
      options.draft = true;
    }

    if (!this.app) {
      throw new Error('Use wurd.connect(appName) before wurd.load()');
    }

    //Normalise ids to array
    const ids = typeof _ids === 'string' ? _ids.split(',') : _ids;

    if (options.log) console.log('loading: ', ids, options);

    //If in draft, skip cache
    if (options.draft) {
      return this._loadFromServer(ids, options)
        .then(content => {
          return new Block(null, content, options);
        });
    }

    //Otherwise not in draft mode; check for cached versions
    const cachedContent = this._loadFromCache(ids, options);

    const uncachedIds = Object.keys(cachedContent).filter(id => cachedContent[id] == undefined);

    //If all content was cached, return it without a server trip
    if (!uncachedIds.length) {
      return new Block(null, cachedContent, options);
    }

    return this._loadFromServer(uncachedIds, options)
      .then(fetchedContent => {
        this._saveToCache(fetchedContent, options);

        return new Block(null, { ...cachedContent, ...fetchedContent }, options);
      });
  }

  /**
   * Express middleware that loads section content and makes it available to templates with helpers (get, map, etc.).
   *
   * @param {String|Array} ids      IDs of sections to load content for. Can be an array or comma-separated string of sections to load, e.g. 'main,home'
   * 
   * @return {Function} middleware
   */
  mw(ids) {
    return async (req, res, next) => {
      // detect request-specific options such as editMode and language
      const editMode = this.options.editMode === 'querystring'
        ? req.query.edit !== undefined
        : this.options.editMode;

      const options = {
        editMode,
        lang: req.query.lang,
        draft: editMode || this.options.draft, // Force draft to true if editMode is on
      };

      try {
        res.locals.cms = await this.load(ids, options);
        res.locals.app = this.app;

        next();
      } catch (err) {
        next(err);
      }
    };
  }

  /**
   * @param {Object} allContent    Content keyed by section ID (i.e. the response from the Wurd content API)
   *
   * @return {Promise}
   */
  _saveToCache(allContent, options) {
    const cacheEntries = Object.keys(allContent).map(id => [getCacheId(id, options), allContent[id]]);
    for (const [k, v] of cacheEntries) {
      this.cache.set(k, v);
    }
    this.cache.snapshot(Object.fromEntries(cacheEntries));
  }

  /**
   * @param {Array} ids           Section IDs to load content for
   *
   * @return {Promise}
   */
  _loadFromCache(ids, options) {
    return Object.fromEntries(
      ids.map(id => [id, this.cache.get(getCacheId(id, options))])
    );
  }

  /**
   * @param {Array} ids           Section IDs to load content for
   *
   * @return {Promise}
   */
  _loadFromServer(ids, options) {
    const { app } = this;

    const sections = ids.join(',');
    const params = {};

    if (options.draft) params.draft = 1;
    if (options.lang) params.lang = options.lang;

    const url = `${API_URL}/apps/${app}/content/${sections}?${new URLSearchParams(params)}`;

    options.log && console.info('from server: ', ids, url);

    return this._fetch(url);
  }

  _fetch(url) {
    return _fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Error loading ${url}: ${res.statusText}`);

        return res.json();
      });
  }
}



const instance = new Wurd();

instance.Wurd = Wurd;


module.exports = instance;
