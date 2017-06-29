const get = require('get-property-value');
const fetch = require('node-fetch');
const {encodeQueryString} = require('./utils');


const WIDGET_URL = 'https://edit-v3.wurd.io/widget.js';
const API_URL = 'https://api-v3.wurd.io';


class Wurd {

  constructor() {
    this.appName = null;
    this.draft = false;
    this.lang = null;
    this.log = false;

    // Object to store all content that's loaded
    this.content = {};
  }

  /**
   * Sets up the default connection/instance
   *
   * @param {String} appName
   * @param {Object} [options]
   * @param {Boolean} [options.draft]             If true, loads draft content; otherwise loads published content
   * @param {Boolean|String} [options.editMode]   Options for enabling edit mode: `true` or `'querystring'`
   *
   * @return {Function} middleware
   */
  connect(appName, options = {}) {
    this.appName = appName;
    
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
   * Loads a section of content so that it's items are ready to be accessed with #get(id)
   *
   * @param {String} path     Section path e.g. `section`
   */
  load(path) {
    let {appName, draft, lang, log} = this;

    return new Promise((resolve, reject) => {
      if (!appName) {
        return reject('Use wurd.connect(appName) before wurd.load()');
      }

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
      
      const url = `${API_URL}/apps/${appName}/content/${path}?${encodeQueryString(params)}`;

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

};


module.exports = new Wurd();
