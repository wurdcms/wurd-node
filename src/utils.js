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

  return text.replace(/{{([\w.-]+)}}/g, (_, key) => vars[key] || '');
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
