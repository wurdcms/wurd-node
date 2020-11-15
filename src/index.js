const cacheManager = require('cache-manager');
const fetch = require('node-fetch');

const { encodeQueryString, getCacheId } = require('./utils');
const Block = require('./block');

const env = process.env || {};
const API_URL = env.WURD_API_URL || 'https://api-v3.wurd.io';


class Wurd {

  constructor() {
    this.app = null;

    this.options = {
      draft: false,
      editMode: false,
      lang: null,
      log: false
    };

    this.cache = cacheManager.caching({ store: 'memory', max: 100, ttl: 60 });
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
  connect(app, options = {}) {
    this.app = app;

    this.options = { ...this.options, ...options };

    if (this.options.editMode === true) {
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
    if (options.editMode === true) {
      options.draft = true;
    }

    if (!this.app) return Promise.reject(new Error('Use wurd.connect(appName) before wurd.load()'));

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
    return this._loadFromCache(ids, options)
      .then(cachedContent => {
        const uncachedIds = Object.keys(cachedContent).filter(id => {
          return cachedContent[id] === undefined;
        });

        //If all content was cached, return it without a server trip
        if (!uncachedIds.length) {
          return cachedContent;
        }

        return this._loadFromServer(uncachedIds, options)
          .then(fetchedContent => {
            this._saveToCache(fetchedContent, options);

            return { ...cachedContent, ...fetchedContent };
          });
      })
      .then(allContent => {
        return new Block(null, allContent, options);
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
    return (req, res, next) => {
      // detect request-specific options such as editMode and language
      const editMode = this.options.editMode === 'querystring'
        ? typeof req.query.edit !== 'undefined'
        : this.options.editMode;

      const options = {
        editMode,
        lang: req.query.lang,
        draft: editMode || this.options.draft, // Force draft to true if editMode is on
      };

      this.load(ids, options)
        .then(content => {
          res.locals.wurd = content;

          next();
        })
        .catch(next);
    };
  }

  /**
   * @param {Object} allContent    Content keyed by section ID (i.e. the response from the Wurd content API)
   *
   * @return {Promise}
   */
  _saveToCache(allContent, options = {}) {
    const promises = Object.keys(allContent).map(id => {
      const sectionContent = allContent[id];

      return this.cache.set(getCacheId(id, options), sectionContent);
    });

    return Promise.all(promises);
  }

  /**
   * @param {Array} ids           Section IDs to load content for
   *
   * @return {Promise}
   */
  _loadFromCache(ids, options = {}) {
    const allContent = {};

    const promises = ids.map(id => {
      return this.cache.get(getCacheId(id, options)).then(sectionContent => {
        allContent[id] = sectionContent
      });
    });

    return Promise.all(promises).then(() => {
      return allContent;
    });
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

    const url = `${API_URL}/apps/${app}/content/${sections}?${encodeQueryString(params)}`;

    options.log && console.info('from server: ', ids);

    return this._fetch(url);
  }

  _fetch(url) {
    return fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Error loading ${url}: ${res.statusText}`);

        return res.json();
      });
  }

};



const instance = new Wurd();

instance.Wurd = Wurd;


module.exports = instance;
