const LRU = require('lru-cache');
const fs = require('fs');


/**
 * @param {Object} data
 *
 * @return {String}
 */
exports.encodeQueryString = function (data) {
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
exports.replaceVars = function (text, vars = {}) {
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
exports.getCacheId = function (id, options = {}) {
  let lang = options.lang || ''

  return `${lang}/${id}`;
};

exports.getCache = function (opts = { max: 100, maxAge: 60 * 1000 }) {
  if (typeof localStorage === 'undefined') {
    const lru = new LRU(opts);
    const cacheFile = `/tmp/wurd-content.json`;
    if (fs.existsSync(cacheFile)) {
      try {
        const dump = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));

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
