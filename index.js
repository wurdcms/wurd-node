const _ = require('underscore');
const getPath = require('get-property-value');
const fetch = require('node-fetch');
const querystring = require('querystring');

const config = {
  widgetUrl: process.env.WURD_WIDGET_URL || 'https://edit-v3.wurd.io',
  apiUrl: process.env.WURD_API_URL || 'https://api-v3.wurd.io'
};


exports.connect = function(appName, mainOptions = {}) {
  return {
    load: function(path, fnOptions, cb) {
      //Normalise arguments
      if (arguments.length == 2) { //path, cb
        cb = fnOptions;
        fnOptions = {};
      }

      let options = Object.assign({}, mainOptions, fnOptions);

      exports.load(appName, path, options, cb);
    }
  };
};



/**
 * Loads a given section's content
 *
 * @param {String} appName
 * @param {String} path
 * @param {Object} [options]
 * @param {Boolean} [options.draft]
 * @param {Function} cb               Callback({Error} err, {Object} content, {Function} t)
 */
exports.load = function(appName, path, options = {}, cb) {
  //Normalise arguments
  if (arguments.length === 3) { //appName, path, cb
    cb = options;
    options = {};
  }

  let params = querystring.stringify(options);

  let url = `${config.apiUrl}/apps/${appName}/content/${path}?${params}`;

  fetch(url)
    .then(res => {
      if (!res.ok) return cb(new Error(`Error loading ${path}: ${res.statusText}`));

      res.json()
        .then(content => {
          let helpers = {
            text: exports.createTextHelper(content, options),
            list: exports.createListHelper(content, options)
          };

          cb(null, content, helpers);
        })
        .catch(err => {
          cb(err);
        });
    })
    .catch(err => {
      cb(err);
    });
};


/**
 * Creates the text helper for getting text by path
 *
 * @param {Object} content
 * @param {Object} options
 *
 * @return {Function}
 */
exports.createTextHelper = function(content, options = {}) {
  /**
   * Gets text, falling to backup content if not defined
   *
   * @param {String} path
   * @param {String} [backup]
   */
  return function textHelper(path, backup = '') {
    if (options.draft) {
      backup = backup || `[${path}]`;
    }

    return getPath(content, path) || backup;
    //return content[path] || backup;
  };
};


/**
 * Creates the list helper for iterating over list items
 *
 * @param {Object} content
 *
 * @return {Function}
 */
exports.createListHelper = function(content) {
  /**
   * Runs a function for each item in a list with signature ({ item, id })
   *
   * @param {String} path
   * @param {Object|String[]} template
   * @param {Function} fn
   */
  return function listHelper(path, template, fn) {
    //Create backup content for an empty list, so that inputs are displayed
    let backup;

    //Support passing in an array of child item names as a shortcut
    if (_.isArray(template)) {
      backup = template.reduce((memo, child) => {
        memo[child] = `[${child}]`;
        return memo;
      }, {});
    }

    else {
      backup = template;
    }

    //Get list content, defaulting to backup with a template
    let listContent = getPath(content, path);
    
    if (!listContent) {
      listContent = {
        '0': backup
      };
    }

    let i = 0;
    return _.each(listContent, (item, id) => {
      let itemWithDefaults = Object.assign({}, backup, item);

      fn(itemWithDefaults, [path, id].join('.'), i);

      i++;
    });
  };
};
