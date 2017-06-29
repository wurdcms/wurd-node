const cacheManager = require('cache-manager');
const get = require('get-property-value');
const fetch = require('node-fetch');
const {encodeQueryString} = require('./utils');

const WIDGET_URL = 'https://edit-v3.wurd.io/widget.js';
const API_URL = 'https://api-v3.wurd.io';


class Wurd {

  constructor() {
    this.app = null;
    this.draft = false;
    this.lang = null;
    this.log = false;

    // Object to store all content that's loaded
    this.content = {};

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
    this.content = {};
    
    if (options.draft) this.draft = options.draft;
    if (options.lang) this.lang = options.lang;
    if (options.log) this.log = options.log;

    //Return express middleware that detects request-specific options such as edit/draft mode
    return (req, res, next) => {
      let {edit, lang} = req.query;

      let isEditMode = (typeof edit !== 'undefined');

      req.wurd = {
        draft: isEditMode,
        lang: lang
      };

      //Add wurd content helpers to the response so they are available in templates
      res.locals.wurd = this;
      res.locals.wurd.editMode = isEditMode;
      res.locals.wurd.lang = lang;

      next();
    };
  }

  /**
   * Private method, use load(ids) instead.
   * Loads a single section of content.
   *
   * @param {String} id
   */
  _load(id) {
    let {app, draft, lang, log} = this;

    return new Promise((resolve, reject) => {
      // Return cached version if available
      let sectionContent = this.content[path];

      if (sectionContent) {
        log && console.info('from cache: ', path);
        return resolve(sectionContent);
      }

      // No cached version; fetch from server
      const params = {};
      
      if (draft) params.draft = 1;
      if (lang) params.lang = lang;
      
      const url = `${API_URL}/apps/${app}/content/${path}?${encodeQueryString(params)}`;

      log && console.info('from server: ', path, url);

      return fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`Error loading ${path}: ${res.statusText}`);

          return res.json()
            .then(sectionContent => {
              // Cache for next time
              Object.assign(this.content, sectionContent);

              resolve(sectionContent);
            });
        });
    });
  }

  /**
   * Loads a section of content so that it's items are ready to be accessed with #get(id)
   *
   * @param {String|Array} ids     IDs of sections to load content for. Can be an array or comma-separated string of sections to load, e.g. 'main,home'
   */
  load(ids) {
    return new Promise((resolve, reject) => {

      let {app, draft, log} = this;

      if (!app) return reject(new Error('Use wurd.connect(appName) before wurd.load()'));

      //Normalise ids to array
      if (typeof ids === 'string') ids = ids.split(',');

      log && console.log('loading: ', ids);

      this._loadFromCache(ids)
        .then(cachedContent => {
          let uncachedIds = Object.keys(cachedContent).filter(id => {
            return cachedContent[id] === undefined;
          });

          //If all content was cached, return it without a server trip
          if (!uncachedIds.length) {
            return cachedContent;
          }

          log && console.info('from server: ', uncachedIds);

          return this._loadFromServer(uncachedIds)
            .then(fetchedContent => {
              return Object.assign(cachedContent, fetchedContent);
            });
        })
        .then(allContent => {
          Object.assign(this.content, allContent);

          resolve(allContent)
        })
        .catch(err => reject(err));

    });
  }

  /**
   * Gets a content item by path (e.g. `section.item`)
   *
   * @param {String} path       Item path e.g. `section.item`
   * @param {String} [backup]   Backup content to display if there is no item content
   */
  get(path, backup) {
    let {draft, content} = this;

    if (draft) {
      backup = (typeof backup !== 'undefined') ? backup : `[${path}]`;
    }

    return get(content, path) || backup;
  }

  /**
   * Invokes a function on every content item in a list.
   *
   * @param {String} path     Item path e.g. `section.item`
   * @param {Function} fn     Function to invoke
   */
  map(path, fn) {
    let {content} = this;

    // Get list content, defaulting to backup with the template
    let listContent = get(content, path) || { [Date.now()]: {} };
    let index = 0;

    return Object.keys(listContent).map(id => {
      let item = listContent[id];
      let currentIndex = index;

      index++;

      return fn(item, [path, id].join('.'), currentIndex);
    });
  }

  el(path, type = 'span') {
    let {draft} = this;

    let text = this.get(path);

    if (draft) {
      return `<${type} data-wurd="${path}">${text}</${type}>`;
    } else {
      return text;
    }
  }

  /**
   * @param {Object} allContent    Content keyed by section ID (i.e. the response from the Wurd content API)
   *
   * @return {Promise}
   */
  _saveToCache(allContent) {
    let promises = Object.keys(allContent).map(id => {
      let sectionContent = allContent[id];

      return this.cache.set(id, sectionContent);
    });

    return Promise.all(promises);
  }

  /**
   * @param {Array} ids           Section IDs to load content for
   *
   * @return {Promise}
   */
  _loadFromCache(ids) {
    let allContent = {};

    let promises = ids.map(id => {
      return this.cache.get(id).then(sectionContent => allContent[id] = sectionContent);
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
  _loadFromServer(ids) {
    const {app, draft, lang, log} = this;

    const sections = ids.join(',');
    const params = {};
      
    if (draft) params.draft = 1;
    if (lang) params.lang = lang;
    
    const url = `${API_URL}/apps/${app}/content/${sections}?${encodeQueryString(params)}`;

    return this._fetch(url)
      .then(content => {
        this._saveToCache(content);

        return content;
      });
  }

  _fetch(url) {
    return fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Error loading ${url}: ${res.statusText}`);

        return res.json();
      });
  }

};



let singleton = new Wurd();

singleton.Wurd = Wurd;


module.exports = singleton;
