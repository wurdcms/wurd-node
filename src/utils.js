const LRU = require('lru-cache');
const fs = require('fs');


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
        const content = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));

        lru.load(Object.entries(content).map(([k, v]) => ({ k, v })));
      } catch {
        console.warn('[wurd] inconsistent cache file detected and deleted');
        fs.unlinkSync(cacheFile);
      }
    }

    return {
      get: (key) => lru.get(key),
      set: (key, data) => lru.set(key, data),
      snapshot: (content) => fs.promises.writeFile(cacheFile, content, 'utf8'),
    }
  }

  const lsKey = 'wurd-content';
  let store = {};
  if (localStorage.getItem(lsKey)) {
    try {
      store = JSON.parse(localStorage.getItem(lsKey));
    } catch {
      console.warn('[wurd] inconsistent cache file detected and deleted');
      localStorage.removeItem(lsKey);
    }
  }

  return {
    get: (key) => store[key],
    set: (key, data) => { store[key] = data; },
    snapshot: (content) => localStorage.setItem(lsKey, JSON.stringify(content)),
  };
};
