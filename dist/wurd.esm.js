import fetch from 'node-fetch';
import LRU from 'lru-cache';
import fs from 'fs';
import marked from 'marked';
import getValue from 'get-property-value';

/**
 * @param {Object} data
 *
 * @return {String}
 */
var encodeQueryString = function (data) {
  let parts = Object.keys(data).map(key => {
    let value = data[key];

    return encodeURIComponent(key) + '=' + encodeURIComponent(value);
  });

  return parts.join('&');
};


/**
 * Replaces {{mustache}} style placeholders in text with variables
 *
 * @param {String} text
 * @param {Object} vars
 *
 * @return {String}
 */
var replaceVars = function (text, vars = {}) {
  if (typeof text !== 'string') return text;

  Object.keys(vars).forEach(key => {
    let val = vars[key];

    text = text.replace(new RegExp(`{{${key}}}`, 'g'), val);
  });

  return text;
};


/**
 * Returns the key for caching a block of content, including the language
 *
 * @param {String} id
 * @param {Object} [options]
 *
 * @return {String} cacheId
 */
var getCacheId = function (id, options = {}) {
  let lang = options.lang || '';

  return `${lang}/${id}`;
};

var getCache = function (opts = { max: 100, maxAge: 60 * 1000 }) {
  if (typeof localStorage === 'undefined') {
    const lru = new LRU(opts);
    const cacheFile = `/tmp/wurd-content.json`;
    if (fs.existsSync(cacheFile)) {
      try {
        const dump = JSON.parse(fs.readFileSync(cacheFile));

        lru.load(dump);
      } catch { }
    }

    return {
      get: (key) => lru.get(key),
      set: (key, data) => lru.set(key, data),
      snapshot: (content) => fs.promises.writeFile(cacheFile, content, 'utf8'),
    }
  }
  return {
    get: (key) => localStorage.getItem(key),
    set: (key, data) => localStorage.setItem(key, data),
    snapshot() { }, // used only for server-side fs storage
  };
};

var utils = {
	encodeQueryString: encodeQueryString,
	replaceVars: replaceVars,
	getCacheId: getCacheId,
	getCache: getCache
};

const { replaceVars: replaceVars$1 } = utils;


var block = class Block {

  constructor(path, content, options = {}) {
    this.path = path;
    this.content = content;
    this.options = options;

    this.lang = options.lang;
    this.editMode = options.editMode;
    this.draft = options.draft;
  }

  /**
   * Gets the ID of a child content item by path (e.g. id('item') returns `block.item`)
   *
   * @param {String} path       Item path e.g. `section.item`
   *
   * @return {String}
   */
  id = (path) => {
    if (!path) return this.path;

    return this.path ? [this.path, path].join('.') : path;
  }

  /**
   * Gets a content item by path (e.g. `section.item`).
   * Will return both text and/or objects, depending on the contents of the item
   *
   * @param {String} path       Item path e.g. `section.item`
   *
   * @return {Mixed}
   */
  get = (path) => {
    const result = getValue(this.content, path);

    //If an item is missing, check that the section has been loaded
    if (typeof result === 'undefined' && this.draft) {
      const section = path.split('.')[0];
      const loadedSections = Object.keys(this.content || {});

      if (!loadedSections.includes(section)) {
        console.warn(`Tried to access unloaded section: ${section}`);
      }
    }

    return result;
  }

  /**
   * Gets text content of an item by path (e.g. `section.item`).
   * If the item is not a string, e.g. you have passed the path of an object,
   * an empty string will be returned, unless in draft mode in which case a warning will be returned.
   *
   * @param {String} path       Item path e.g. `section.item`
   * @param {Object} [vars]     Variables to replace in the text
   *
   * @return {Mixed}
   */
  text = (path, vars) => {
    let text = this.get(path);

    if (typeof text === 'undefined') {
      return (this.draft) ? `[${path}]` : '';
    }

    if (typeof text !== 'string') {
      console.warn(`Tried to get object as string: ${path}`);

      return (this.draft) ? `[${path}]` : '';
    }

    if (vars) {
      text = replaceVars$1(text, vars);
    }

    return text;
  }

  /**
   * Iterates over a collection / list object with the given callback.
   *
   * @param {String} path
   * @param {Function} fn     Callback function with signature ({Function} itemBlock, {Number} index)
   */
  map = (path, fn) => {
    const listContent = this.get(path) || { [Date.now()]: {} };

    const keys = Object.keys(listContent).sort();

    return keys.map((key, index) => {
      const itemPath = [path, key].join('.');
      const itemBlock = this.block(itemPath);

      return fn.call(undefined, itemBlock, index);
    });
  }

  /**
   * Creates a new Block scoped to the child content.
   * Optionally runs a callback with the block as the argument
   *
   * @param {String} path
   * @param {Function} [fn]     Optional callback that receives the child block object
   *
   * @return {Block}
   */
  block = (path, fn) => {
    const blockPath = this.id(path);
    const blockContent = this.get(path);

    const childBlock = new Block(blockPath, blockContent, this.options);

    if (typeof fn === 'function') {
      fn.call(undefined, childBlock);
    }

    return childBlock;
  }

  /**
   * Gets HTML from Markdown content of an item by path (e.g. `section.item`).
   * If the item is not a string, e.g. you have passed the path of an object,
   * an empty string will be returned, unless in draft mode in which case a warning will be returned.
   *
   * @param {String} path       Item path e.g. `section.item`
   * @param {Object} [vars]     Variables to replace in the text
   *
   * @return {Mixed}
   */
  markdown = (path, vars) => {
    return marked(this.text(path, vars));
  }

  /**
   * Returns an HTML string for an editable element.
   * 
   * This is a shortcut for writing out the HTML tag
   * with the wurd editor attributes and the text content.
   * 
   * Use this or create a similar helper to avoid having to type out the item paths twice.
   *
   * @param {String} path
   * @param {Object} [vars]               Optional variables to replace in the text
   * @param {Object} [options]
   * @param {Boolean} [options.markdown]  Parses text as markdown
   * @param {String} [options.type]       HTML node type, defaults to 'span', or 'div' for markdown content
   * 
   * @return {String}
   */
  el = (path, vars, options = {}) => {
    const id = this.id(path);
    const text = options.markdown ? this.markdown(path, vars) : this.text(path, vars);
    const editor = (vars || options.markdown) ? 'data-wurd-md' : 'data-wurd';

    if (this.draft) {
      let type = options.type || 'span';
      if (options.markdown) type = 'div';

      return `<${type} ${editor}="${id}">${text}</${type}>`;
    } else {
      return text;
    }
  }

};

const { encodeQueryString: encodeQueryString$1, getCacheId: getCacheId$1, getCache: getCache$1 } = utils;


const env = process.env || {};
const API_URL = env.WURD_API_URL || 'https://api-v3.wurd.io';


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

    this.cache = getCache$1();
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
          return new block(null, content, options);
        });
    }

    //Otherwise not in draft mode; check for cached versions
    const cachedContent = this._loadFromCache(ids, options);

    const uncachedIds = Object.keys(cachedContent).filter(id => cachedContent[id] === undefined);

    //If all content was cached, return it without a server trip
    if (!uncachedIds.length) {
      return new block(null, cachedContent, options);
    }

    return this._loadFromServer(uncachedIds, options)
      .then(fetchedContent => {
        this._saveToCache(fetchedContent, options);

        return new block(null, { ...cachedContent, ...fetchedContent }, options);
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
        ? typeof req.query.edit !== 'undefined'
        : this.options.editMode;

      const options = {
        editMode,
        lang: req.query.lang,
        draft: editMode || this.options.draft, // Force draft to true if editMode is on
      };

      try {
        res.locals.wurd = await this.load(ids, options);

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
    const cacheEntries = Object.keys(allContent).map(id => ({ k: getCacheId$1(id, options), v: allContent[id] }));
    for (const { k, v } of cacheEntries) {
      this.cache.set(k, v);
    }
    this.cache.snapshot(cacheEntries);
  }

  /**
   * @param {Array} ids           Section IDs to load content for
   *
   * @return {Promise}
   */
  _loadFromCache(ids, options) {
    return Object.fromEntries(
      ids.map(id => [id, this.cache.get(getCacheId$1(id, options))])
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

    const url = `${API_URL}/apps/${app}/content/${sections}?${encodeQueryString$1(params)}`;

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
}



const instance = new Wurd();

instance.Wurd = Wurd;


var src = instance;

export default src;
