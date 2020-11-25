(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('node-fetch'), require('lru-cache'), require('fs')) :
  typeof define === 'function' && define.amd ? define(['node-fetch', 'lru-cache', 'fs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.wurd = factory(global.window.fetch, global.LRU, global.fs));
}(this, (function (require$$0, LRU, fs) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
  var LRU__default = /*#__PURE__*/_interopDefaultLegacy(LRU);
  var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  /**
   * Replaces {{mustache}} style placeholders in text with variables
   *
   * @param {String} text
   * @param {Object} vars
   *
   * @return {String}
   */

  var replaceVars = function replaceVars(text) {
    var vars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (typeof text !== 'string') return text;
    Object.keys(vars).forEach(function (key) {
      var val = vars[key];
      text = text.replace(new RegExp("{{".concat(key, "}}"), 'g'), val);
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


  var getCacheId = function getCacheId(id) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var lang = options.lang || '';
    return "".concat(lang, "/").concat(id);
  };

  var getCache = function getCache() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      max: 100,
      maxAge: 60 * 1000
    };

    if (typeof localStorage === 'undefined') {
      var lru = new LRU__default['default'](opts);
      var cacheFile = "/tmp/wurd-content.json";

      if (fs__default['default'].existsSync(cacheFile)) {
        try {
          var content = JSON.parse(fs__default['default'].readFileSync(cacheFile, 'utf8'));
          lru.load(Object.entries(content).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                k = _ref2[0],
                v = _ref2[1];

            return {
              k: k,
              v: v
            };
          }));
        } catch (_unused) {
          console.warn('[wurd] inconsistent cache file detected and deleted');
          fs__default['default'].unlinkSync(cacheFile);
        }
      }

      return {
        get: function get(key) {
          return lru.get(key);
        },
        set: function set(key, data) {
          return lru.set(key, data);
        },
        snapshot: function snapshot(content) {
          return fs__default['default'].promises.writeFile(cacheFile, content, 'utf8');
        }
      };
    }

    var lsKey = 'wurd-content';
    var store = {};

    if (localStorage.getItem(lsKey)) {
      try {
        store = JSON.parse(localStorage.getItem(lsKey));
      } catch (_unused2) {
        console.warn('[wurd] inconsistent cache file detected and deleted');
        localStorage.removeItem(lsKey);
      }
    }

    return {
      get: function get(key) {
        return store[key];
      },
      set: function set(key, data) {
        store[key] = data;
      },
      snapshot: function snapshot(content) {
        return localStorage.setItem(lsKey, JSON.stringify(content));
      }
    };
  };

  var utils = {
    replaceVars: replaceVars,
    getCacheId: getCacheId,
    getCache: getCache
  };

  function createCommonjsModule(fn, basedir, module) {
  	return module = {
  		path: basedir,
  		exports: {},
  		require: function (path, base) {
  			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
  		}
  	}, fn(module, module.exports), module.exports;
  }

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
  }

  var defaults = createCommonjsModule(function (module) {
    function getDefaults() {
      return {
        baseUrl: null,
        breaks: false,
        gfm: true,
        headerIds: true,
        headerPrefix: '',
        highlight: null,
        langPrefix: 'language-',
        mangle: true,
        pedantic: false,
        renderer: null,
        sanitize: false,
        sanitizer: null,
        silent: false,
        smartLists: false,
        smartypants: false,
        xhtml: false
      };
    }

    function changeDefaults(newDefaults) {
      module.exports.defaults = newDefaults;
    }

    module.exports = {
      defaults: getDefaults(),
      getDefaults: getDefaults,
      changeDefaults: changeDefaults
    };
  });

  /**
   * Helpers
   */
  var escapeTest = /[&<>"']/;
  var escapeReplace = /[&<>"']/g;
  var escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
  var escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
  var escapeReplacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  var getEscapeReplacement = function getEscapeReplacement(ch) {
    return escapeReplacements[ch];
  };

  function escape(html, encode) {
    if (encode) {
      if (escapeTest.test(html)) {
        return html.replace(escapeReplace, getEscapeReplacement);
      }
    } else {
      if (escapeTestNoEncode.test(html)) {
        return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
      }
    }

    return html;
  }

  var unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

  function unescape(html) {
    // explicitly match decimal, hex, and named HTML entities
    return html.replace(unescapeTest, function (_, n) {
      n = n.toLowerCase();
      if (n === 'colon') return ':';

      if (n.charAt(0) === '#') {
        return n.charAt(1) === 'x' ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
      }

      return '';
    });
  }

  var caret = /(^|[^\[])\^/g;

  function edit(regex, opt) {
    regex = regex.source || regex;
    opt = opt || '';
    var obj = {
      replace: function replace(name, val) {
        val = val.source || val;
        val = val.replace(caret, '$1');
        regex = regex.replace(name, val);
        return obj;
      },
      getRegex: function getRegex() {
        return new RegExp(regex, opt);
      }
    };
    return obj;
  }

  var nonWordAndColonTest = /[^\w:]/g;
  var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

  function cleanUrl(sanitize, base, href) {
    if (sanitize) {
      var prot;

      try {
        prot = decodeURIComponent(unescape(href)).replace(nonWordAndColonTest, '').toLowerCase();
      } catch (e) {
        return null;
      }

      if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
        return null;
      }
    }

    if (base && !originIndependentUrl.test(href)) {
      href = resolveUrl(base, href);
    }

    try {
      href = encodeURI(href).replace(/%25/g, '%');
    } catch (e) {
      return null;
    }

    return href;
  }

  var baseUrls = {};
  var justDomain = /^[^:]+:\/*[^/]*$/;
  var protocol = /^([^:]+:)[\s\S]*$/;
  var domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;

  function resolveUrl(base, href) {
    if (!baseUrls[' ' + base]) {
      // we can ignore everything in base after the last slash of its path component,
      // but we might need to add _that_
      // https://tools.ietf.org/html/rfc3986#section-3
      if (justDomain.test(base)) {
        baseUrls[' ' + base] = base + '/';
      } else {
        baseUrls[' ' + base] = rtrim(base, '/', true);
      }
    }

    base = baseUrls[' ' + base];
    var relativeBase = base.indexOf(':') === -1;

    if (href.substring(0, 2) === '//') {
      if (relativeBase) {
        return href;
      }

      return base.replace(protocol, '$1') + href;
    } else if (href.charAt(0) === '/') {
      if (relativeBase) {
        return href;
      }

      return base.replace(domain, '$1') + href;
    } else {
      return base + href;
    }
  }

  var noopTest = {
    exec: function noopTest() {}
  };

  function merge(obj) {
    var i = 1,
        target,
        key;

    for (; i < arguments.length; i++) {
      target = arguments[i];

      for (key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
          obj[key] = target[key];
        }
      }
    }

    return obj;
  }

  function splitCells(tableRow, count) {
    // ensure that every cell-delimiting pipe has a space
    // before it to distinguish it from an escaped pipe
    var row = tableRow.replace(/\|/g, function (match, offset, str) {
      var escaped = false,
          curr = offset;

      while (--curr >= 0 && str[curr] === '\\') {
        escaped = !escaped;
      }

      if (escaped) {
        // odd number of slashes means | is escaped
        // so we leave it alone
        return '|';
      } else {
        // add space before unescaped |
        return ' |';
      }
    }),
        cells = row.split(/ \|/);
    var i = 0;

    if (cells.length > count) {
      cells.splice(count);
    } else {
      while (cells.length < count) {
        cells.push('');
      }
    }

    for (; i < cells.length; i++) {
      // leading or trailing whitespace is ignored per the gfm spec
      cells[i] = cells[i].trim().replace(/\\\|/g, '|');
    }

    return cells;
  } // Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
  // /c*$/ is vulnerable to REDOS.
  // invert: Remove suffix of non-c chars instead. Default falsey.


  function rtrim(str, c, invert) {
    var l = str.length;

    if (l === 0) {
      return '';
    } // Length of suffix matching the invert condition.


    var suffLen = 0; // Step left until we fail to match the invert condition.

    while (suffLen < l) {
      var currChar = str.charAt(l - suffLen - 1);

      if (currChar === c && !invert) {
        suffLen++;
      } else if (currChar !== c && invert) {
        suffLen++;
      } else {
        break;
      }
    }

    return str.substr(0, l - suffLen);
  }

  function findClosingBracket(str, b) {
    if (str.indexOf(b[1]) === -1) {
      return -1;
    }

    var l = str.length;
    var level = 0,
        i = 0;

    for (; i < l; i++) {
      if (str[i] === '\\') {
        i++;
      } else if (str[i] === b[0]) {
        level++;
      } else if (str[i] === b[1]) {
        level--;

        if (level < 0) {
          return i;
        }
      }
    }

    return -1;
  }

  function checkSanitizeDeprecation(opt) {
    if (opt && opt.sanitize && !opt.silent) {
      console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
    }
  }

  var helpers = {
    escape: escape,
    unescape: unescape,
    edit: edit,
    cleanUrl: cleanUrl,
    resolveUrl: resolveUrl,
    noopTest: noopTest,
    merge: merge,
    splitCells: splitCells,
    rtrim: rtrim,
    findClosingBracket: findClosingBracket,
    checkSanitizeDeprecation: checkSanitizeDeprecation
  };

  var noopTest$1 = helpers.noopTest,
      edit$1 = helpers.edit,
      merge$1 = helpers.merge;
  /**
   * Block-Level Grammar
   */

  var block = {
    newline: /^\n+/,
    code: /^( {4}[^\n]+\n*)+/,
    fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
    hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
    heading: /^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(?:\n+|$)/,
    blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
    list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
    html: '^ {0,3}(?:' // optional indentation
    + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
    + '|comment[^\\n]*(\\n+|$)' // (2)
    + '|<\\?[\\s\\S]*?\\?>\\n*' // (3)
    + '|<![A-Z][\\s\\S]*?>\\n*' // (4)
    + '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*' // (5)
    + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
    + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
    + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
    + ')',
    def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
    nptable: noopTest$1,
    table: noopTest$1,
    lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
    // regex template, placeholders will be replaced according to different paragraph
    // interruption rules of commonmark and the original markdown spec:
    _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html)[^\n]+)*)/,
    text: /^[^\n]+/
  };
  block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
  block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
  block.def = edit$1(block.def).replace('label', block._label).replace('title', block._title).getRegex();
  block.bullet = /(?:[*+-]|\d{1,9}\.)/;
  block.item = /^( *)(bull) ?[^\n]*(?:\n(?!\1bull ?)[^\n]*)*/;
  block.item = edit$1(block.item, 'gm').replace(/bull/g, block.bullet).getRegex();
  block.list = edit$1(block.list).replace(/bull/g, block.bullet).replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))').replace('def', '\\n+(?=' + block.def.source + ')').getRegex();
  block._tag = 'address|article|aside|base|basefont|blockquote|body|caption' + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption' + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe' + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option' + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr' + '|track|ul';
  block._comment = /<!--(?!-?>)[\s\S]*?-->/;
  block.html = edit$1(block.html, 'i').replace('comment', block._comment).replace('tag', block._tag).replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
  block.paragraph = edit$1(block._paragraph).replace('hr', block.hr).replace('heading', ' {0,3}#{1,6} ').replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
  .replace('blockquote', ' {0,3}>').replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n').replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)').replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
  .getRegex();
  block.blockquote = edit$1(block.blockquote).replace('paragraph', block.paragraph).getRegex();
  /**
   * Normal Block Grammar
   */

  block.normal = merge$1({}, block);
  /**
   * GFM Block Grammar
   */

  block.gfm = merge$1({}, block.normal, {
    nptable: '^ *([^|\\n ].*\\|.*)\\n' // Header
    + ' *([-:]+ *\\|[-| :]*)' // Align
    + '(?:\\n((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)',
    // Cells
    table: '^ *\\|(.+)\\n' // Header
    + ' *\\|?( *[-:]+[-| :]*)' // Align
    + '(?:\\n *((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)' // Cells

  });
  block.gfm.nptable = edit$1(block.gfm.nptable).replace('hr', block.hr).replace('heading', ' {0,3}#{1,6} ').replace('blockquote', ' {0,3}>').replace('code', ' {4}[^\\n]').replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n').replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)').replace('tag', block._tag) // tables can be interrupted by type (6) html blocks
  .getRegex();
  block.gfm.table = edit$1(block.gfm.table).replace('hr', block.hr).replace('heading', ' {0,3}#{1,6} ').replace('blockquote', ' {0,3}>').replace('code', ' {4}[^\\n]').replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n').replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)').replace('tag', block._tag) // tables can be interrupted by type (6) html blocks
  .getRegex();
  /**
   * Pedantic grammar (original John Gruber's loose markdown specification)
   */

  block.pedantic = merge$1({}, block.normal, {
    html: edit$1('^ *(?:comment *(?:\\n|\\s*$)' + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
    + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))').replace('comment', block._comment).replace(/tag/g, '(?!(?:' + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub' + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)' + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b').getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
    fences: noopTest$1,
    // fences not supported
    paragraph: edit$1(block.normal._paragraph).replace('hr', block.hr).replace('heading', ' *#{1,6} *[^\n]').replace('lheading', block.lheading).replace('blockquote', ' {0,3}>').replace('|fences', '').replace('|list', '').replace('|html', '').getRegex()
  });
  /**
   * Inline-Level Grammar
   */

  var inline = {
    escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
    autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
    url: noopTest$1,
    tag: '^comment' + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
    + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
    + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
    + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
    + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>',
    // CDATA section
    link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
    reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
    nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
    strong: /^__([^\s_])__(?!_)|^\*\*([^\s*])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,
    em: /^_([^\s_])_(?!_)|^\*([^\s*<\[])\*(?!\*)|^_([^\s<][\s\S]*?[^\s_])_(?!_|[^\spunctuation])|^_([^\s_<][\s\S]*?[^\s])_(?!_|[^\spunctuation])|^\*([^\s<"][\s\S]*?[^\s\*])\*(?!\*|[^\spunctuation])|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,
    code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
    br: /^( {2,}|\\)\n(?!\s*$)/,
    del: noopTest$1,
    text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n))|(?= {2,}\n))/
  }; // list of punctuation marks from common mark spec
  // without ` and ] to workaround Rule 17 (inline code blocks/links)

  inline._punctuation = '!"#$%&\'()*+,\\-./:;<=>?@\\[^_{|}~';
  inline.em = edit$1(inline.em).replace(/punctuation/g, inline._punctuation).getRegex();
  inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
  inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
  inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
  inline.autolink = edit$1(inline.autolink).replace('scheme', inline._scheme).replace('email', inline._email).getRegex();
  inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
  inline.tag = edit$1(inline.tag).replace('comment', block._comment).replace('attribute', inline._attribute).getRegex();
  inline._label = /(?:\[[^\[\]]*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
  inline._href = /<(?:\\[<>]?|[^\s<>\\])*>|[^\s\x00-\x1f]*/;
  inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
  inline.link = edit$1(inline.link).replace('label', inline._label).replace('href', inline._href).replace('title', inline._title).getRegex();
  inline.reflink = edit$1(inline.reflink).replace('label', inline._label).getRegex();
  /**
   * Normal Inline Grammar
   */

  inline.normal = merge$1({}, inline);
  /**
   * Pedantic Inline Grammar
   */

  inline.pedantic = merge$1({}, inline.normal, {
    strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
    link: edit$1(/^!?\[(label)\]\((.*?)\)/).replace('label', inline._label).getRegex(),
    reflink: edit$1(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace('label', inline._label).getRegex()
  });
  /**
   * GFM Inline Grammar
   */

  inline.gfm = merge$1({}, inline.normal, {
    escape: edit$1(inline.escape).replace('])', '~|])').getRegex(),
    _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
    url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
    _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
    del: /^~+(?=\S)([\s\S]*?\S)~+/,
    text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?= {2,}\n|[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/
  });
  inline.gfm.url = edit$1(inline.gfm.url, 'i').replace('email', inline.gfm._extended_email).getRegex();
  /**
   * GFM + Line Breaks Inline Grammar
   */

  inline.breaks = merge$1({}, inline.gfm, {
    br: edit$1(inline.br).replace('{2,}', '*').getRegex(),
    text: edit$1(inline.gfm.text).replace('\\b_', '\\b_| {2,}\\n').replace(/\{2,\}/g, '*').getRegex()
  });
  var rules = {
    block: block,
    inline: inline
  };

  var defaults$1 = defaults.defaults;
  var block$1 = rules.block;
  var rtrim$1 = helpers.rtrim,
      splitCells$1 = helpers.splitCells,
      escape$1 = helpers.escape;
  /**
   * Block Lexer
   */

  var Lexer_1 = /*#__PURE__*/function () {
    function Lexer(options) {
      _classCallCheck(this, Lexer);

      this.tokens = [];
      this.tokens.links = Object.create(null);
      this.options = options || defaults$1;
      this.rules = block$1.normal;

      if (this.options.pedantic) {
        this.rules = block$1.pedantic;
      } else if (this.options.gfm) {
        this.rules = block$1.gfm;
      }
    }
    /**
     * Expose Block Rules
     */


    _createClass(Lexer, [{
      key: "lex",

      /**
       * Preprocessing
       */
      value: function lex(src) {
        src = src.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ');
        return this.token(src, true);
      }
    }, {
      key: "token",

      /**
       * Lexing
       */
      value: function token(src, top) {
        src = src.replace(/^ +$/gm, '');
        var next, loose, cap, bull, b, item, listStart, listItems, t, space, i, tag, l, isordered, istask, ischecked;

        while (src) {
          // newline
          if (cap = this.rules.newline.exec(src)) {
            src = src.substring(cap[0].length);

            if (cap[0].length > 1) {
              this.tokens.push({
                type: 'space'
              });
            }
          } // code


          if (cap = this.rules.code.exec(src)) {
            var lastToken = this.tokens[this.tokens.length - 1];
            src = src.substring(cap[0].length); // An indented code block cannot interrupt a paragraph.

            if (lastToken && lastToken.type === 'paragraph') {
              lastToken.text += '\n' + cap[0].trimRight();
            } else {
              cap = cap[0].replace(/^ {4}/gm, '');
              this.tokens.push({
                type: 'code',
                codeBlockStyle: 'indented',
                text: !this.options.pedantic ? rtrim$1(cap, '\n') : cap
              });
            }

            continue;
          } // fences


          if (cap = this.rules.fences.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
              type: 'code',
              lang: cap[2] ? cap[2].trim() : cap[2],
              text: cap[3] || ''
            });
            continue;
          } // heading


          if (cap = this.rules.heading.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
              type: 'heading',
              depth: cap[1].length,
              text: cap[2]
            });
            continue;
          } // table no leading pipe (gfm)


          if (cap = this.rules.nptable.exec(src)) {
            item = {
              type: 'table',
              header: splitCells$1(cap[1].replace(/^ *| *\| *$/g, '')),
              align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
              cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
            };

            if (item.header.length === item.align.length) {
              src = src.substring(cap[0].length);

              for (i = 0; i < item.align.length; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                  item.align[i] = 'right';
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                  item.align[i] = 'center';
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                  item.align[i] = 'left';
                } else {
                  item.align[i] = null;
                }
              }

              for (i = 0; i < item.cells.length; i++) {
                item.cells[i] = splitCells$1(item.cells[i], item.header.length);
              }

              this.tokens.push(item);
              continue;
            }
          } // hr


          if (cap = this.rules.hr.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
              type: 'hr'
            });
            continue;
          } // blockquote


          if (cap = this.rules.blockquote.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
              type: 'blockquote_start'
            });
            cap = cap[0].replace(/^ *> ?/gm, ''); // Pass `top` to keep the current
            // "toplevel" state. This is exactly
            // how markdown.pl works.

            this.token(cap, top);
            this.tokens.push({
              type: 'blockquote_end'
            });
            continue;
          } // list


          if (cap = this.rules.list.exec(src)) {
            src = src.substring(cap[0].length);
            bull = cap[2];
            isordered = bull.length > 1;
            listStart = {
              type: 'list_start',
              ordered: isordered,
              start: isordered ? +bull : '',
              loose: false
            };
            this.tokens.push(listStart); // Get each top-level item.

            cap = cap[0].match(this.rules.item);
            listItems = [];
            next = false;
            l = cap.length;
            i = 0;

            for (; i < l; i++) {
              item = cap[i]; // Remove the list item's bullet
              // so it is seen as the next token.

              space = item.length;
              item = item.replace(/^ *([*+-]|\d+\.) */, ''); // Outdent whatever the
              // list item contains. Hacky.

              if (~item.indexOf('\n ')) {
                space -= item.length;
                item = !this.options.pedantic ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '') : item.replace(/^ {1,4}/gm, '');
              } // Determine whether the next list item belongs here.
              // Backpedal if it does not belong in this list.


              if (i !== l - 1) {
                b = block$1.bullet.exec(cap[i + 1])[0];

                if (bull.length > 1 ? b.length === 1 : b.length > 1 || this.options.smartLists && b !== bull) {
                  src = cap.slice(i + 1).join('\n') + src;
                  i = l - 1;
                }
              } // Determine whether item is loose or not.
              // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
              // for discount behavior.


              loose = next || /\n\n(?!\s*$)/.test(item);

              if (i !== l - 1) {
                next = item.charAt(item.length - 1) === '\n';
                if (!loose) loose = next;
              }

              if (loose) {
                listStart.loose = true;
              } // Check for task list items


              istask = /^\[[ xX]\] /.test(item);
              ischecked = undefined;

              if (istask) {
                ischecked = item[1] !== ' ';
                item = item.replace(/^\[[ xX]\] +/, '');
              }

              t = {
                type: 'list_item_start',
                task: istask,
                checked: ischecked,
                loose: loose
              };
              listItems.push(t);
              this.tokens.push(t); // Recurse.

              this.token(item, false);
              this.tokens.push({
                type: 'list_item_end'
              });
            }

            if (listStart.loose) {
              l = listItems.length;
              i = 0;

              for (; i < l; i++) {
                listItems[i].loose = true;
              }
            }

            this.tokens.push({
              type: 'list_end'
            });
            continue;
          } // html


          if (cap = this.rules.html.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
              type: this.options.sanitize ? 'paragraph' : 'html',
              pre: !this.options.sanitizer && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
              text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape$1(cap[0]) : cap[0]
            });
            continue;
          } // def


          if (top && (cap = this.rules.def.exec(src))) {
            src = src.substring(cap[0].length);
            if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
            tag = cap[1].toLowerCase().replace(/\s+/g, ' ');

            if (!this.tokens.links[tag]) {
              this.tokens.links[tag] = {
                href: cap[2],
                title: cap[3]
              };
            }

            continue;
          } // table (gfm)


          if (cap = this.rules.table.exec(src)) {
            item = {
              type: 'table',
              header: splitCells$1(cap[1].replace(/^ *| *\| *$/g, '')),
              align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
              cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
            };

            if (item.header.length === item.align.length) {
              src = src.substring(cap[0].length);

              for (i = 0; i < item.align.length; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                  item.align[i] = 'right';
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                  item.align[i] = 'center';
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                  item.align[i] = 'left';
                } else {
                  item.align[i] = null;
                }
              }

              for (i = 0; i < item.cells.length; i++) {
                item.cells[i] = splitCells$1(item.cells[i].replace(/^ *\| *| *\| *$/g, ''), item.header.length);
              }

              this.tokens.push(item);
              continue;
            }
          } // lheading


          if (cap = this.rules.lheading.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
              type: 'heading',
              depth: cap[2].charAt(0) === '=' ? 1 : 2,
              text: cap[1]
            });
            continue;
          } // top-level paragraph


          if (top && (cap = this.rules.paragraph.exec(src))) {
            src = src.substring(cap[0].length);
            this.tokens.push({
              type: 'paragraph',
              text: cap[1].charAt(cap[1].length - 1) === '\n' ? cap[1].slice(0, -1) : cap[1]
            });
            continue;
          } // text


          if (cap = this.rules.text.exec(src)) {
            // Top-level should never reach here.
            src = src.substring(cap[0].length);
            this.tokens.push({
              type: 'text',
              text: cap[0]
            });
            continue;
          }

          if (src) {
            throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
          }
        }

        return this.tokens;
      }
    }], [{
      key: "lex",

      /**
       * Static Lex Method
       */
      value: function lex(src, options) {
        var lexer = new Lexer(options);
        return lexer.lex(src);
      }
    }, {
      key: "rules",
      get: function get() {
        return block$1;
      }
    }]);

    return Lexer;
  }();

  var defaults$2 = defaults.defaults;
  var cleanUrl$1 = helpers.cleanUrl,
      escape$2 = helpers.escape;
  /**
   * Renderer
   */

  var Renderer_1 = /*#__PURE__*/function () {
    function Renderer(options) {
      _classCallCheck(this, Renderer);

      this.options = options || defaults$2;
    }

    _createClass(Renderer, [{
      key: "code",
      value: function code(_code, infostring, escaped) {
        var lang = (infostring || '').match(/\S*/)[0];

        if (this.options.highlight) {
          var out = this.options.highlight(_code, lang);

          if (out != null && out !== _code) {
            escaped = true;
            _code = out;
          }
        }

        if (!lang) {
          return '<pre><code>' + (escaped ? _code : escape$2(_code, true)) + '</code></pre>';
        }

        return '<pre><code class="' + this.options.langPrefix + escape$2(lang, true) + '">' + (escaped ? _code : escape$2(_code, true)) + '</code></pre>\n';
      }
    }, {
      key: "blockquote",
      value: function blockquote(quote) {
        return '<blockquote>\n' + quote + '</blockquote>\n';
      }
    }, {
      key: "html",
      value: function html(_html) {
        return _html;
      }
    }, {
      key: "heading",
      value: function heading(text, level, raw, slugger) {
        if (this.options.headerIds) {
          return '<h' + level + ' id="' + this.options.headerPrefix + slugger.slug(raw) + '">' + text + '</h' + level + '>\n';
        } // ignore IDs


        return '<h' + level + '>' + text + '</h' + level + '>\n';
      }
    }, {
      key: "hr",
      value: function hr() {
        return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
      }
    }, {
      key: "list",
      value: function list(body, ordered, start) {
        var type = ordered ? 'ol' : 'ul',
            startatt = ordered && start !== 1 ? ' start="' + start + '"' : '';
        return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
      }
    }, {
      key: "listitem",
      value: function listitem(text) {
        return '<li>' + text + '</li>\n';
      }
    }, {
      key: "checkbox",
      value: function checkbox(checked) {
        return '<input ' + (checked ? 'checked="" ' : '') + 'disabled="" type="checkbox"' + (this.options.xhtml ? ' /' : '') + '> ';
      }
    }, {
      key: "paragraph",
      value: function paragraph(text) {
        return '<p>' + text + '</p>\n';
      }
    }, {
      key: "table",
      value: function table(header, body) {
        if (body) body = '<tbody>' + body + '</tbody>';
        return '<table>\n' + '<thead>\n' + header + '</thead>\n' + body + '</table>\n';
      }
    }, {
      key: "tablerow",
      value: function tablerow(content) {
        return '<tr>\n' + content + '</tr>\n';
      }
    }, {
      key: "tablecell",
      value: function tablecell(content, flags) {
        var type = flags.header ? 'th' : 'td';
        var tag = flags.align ? '<' + type + ' align="' + flags.align + '">' : '<' + type + '>';
        return tag + content + '</' + type + '>\n';
      }
    }, {
      key: "strong",
      // span level renderer
      value: function strong(text) {
        return '<strong>' + text + '</strong>';
      }
    }, {
      key: "em",
      value: function em(text) {
        return '<em>' + text + '</em>';
      }
    }, {
      key: "codespan",
      value: function codespan(text) {
        return '<code>' + text + '</code>';
      }
    }, {
      key: "br",
      value: function br() {
        return this.options.xhtml ? '<br/>' : '<br>';
      }
    }, {
      key: "del",
      value: function del(text) {
        return '<del>' + text + '</del>';
      }
    }, {
      key: "link",
      value: function link(href, title, text) {
        href = cleanUrl$1(this.options.sanitize, this.options.baseUrl, href);

        if (href === null) {
          return text;
        }

        var out = '<a href="' + escape$2(href) + '"';

        if (title) {
          out += ' title="' + title + '"';
        }

        out += '>' + text + '</a>';
        return out;
      }
    }, {
      key: "image",
      value: function image(href, title, text) {
        href = cleanUrl$1(this.options.sanitize, this.options.baseUrl, href);

        if (href === null) {
          return text;
        }

        var out = '<img src="' + href + '" alt="' + text + '"';

        if (title) {
          out += ' title="' + title + '"';
        }

        out += this.options.xhtml ? '/>' : '>';
        return out;
      }
    }, {
      key: "text",
      value: function text(_text) {
        return _text;
      }
    }]);

    return Renderer;
  }();

  /**
   * Slugger generates header id
   */
  var Slugger_1 = /*#__PURE__*/function () {
    function Slugger() {
      _classCallCheck(this, Slugger);

      this.seen = {};
    }
    /**
     * Convert string to unique id
     */


    _createClass(Slugger, [{
      key: "slug",
      value: function slug(value) {
        var slug = value.toLowerCase().trim() // remove html tags
        .replace(/<[!\/a-z].*?>/ig, '') // remove unwanted chars
        .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '').replace(/\s/g, '-');

        if (this.seen.hasOwnProperty(slug)) {
          var originalSlug = slug;

          do {
            this.seen[originalSlug]++;
            slug = originalSlug + '-' + this.seen[originalSlug];
          } while (this.seen.hasOwnProperty(slug));
        }

        this.seen[slug] = 0;
        return slug;
      }
    }]);

    return Slugger;
  }();

  var defaults$3 = defaults.defaults;
  var inline$1 = rules.inline;
  var findClosingBracket$1 = helpers.findClosingBracket,
      escape$3 = helpers.escape;
  /**
   * Inline Lexer & Compiler
   */

  var InlineLexer_1 = /*#__PURE__*/function () {
    function InlineLexer(links, options) {
      _classCallCheck(this, InlineLexer);

      this.options = options || defaults$3;
      this.links = links;
      this.rules = inline$1.normal;
      this.options.renderer = this.options.renderer || new Renderer_1();
      this.renderer = this.options.renderer;
      this.renderer.options = this.options;

      if (!this.links) {
        throw new Error('Tokens array requires a `links` property.');
      }

      if (this.options.pedantic) {
        this.rules = inline$1.pedantic;
      } else if (this.options.gfm) {
        if (this.options.breaks) {
          this.rules = inline$1.breaks;
        } else {
          this.rules = inline$1.gfm;
        }
      }
    }
    /**
     * Expose Inline Rules
     */


    _createClass(InlineLexer, [{
      key: "output",

      /**
       * Lexing/Compiling
       */
      value: function output(src) {
        var out = '',
            link,
            text,
            href,
            title,
            cap,
            prevCapZero;

        while (src) {
          // escape
          if (cap = this.rules.escape.exec(src)) {
            src = src.substring(cap[0].length);
            out += escape$3(cap[1]);
            continue;
          } // tag


          if (cap = this.rules.tag.exec(src)) {
            if (!this.inLink && /^<a /i.test(cap[0])) {
              this.inLink = true;
            } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
              this.inLink = false;
            }

            if (!this.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
              this.inRawBlock = true;
            } else if (this.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
              this.inRawBlock = false;
            }

            src = src.substring(cap[0].length);
            out += this.renderer.html(this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape$3(cap[0]) : cap[0]);
            continue;
          } // link


          if (cap = this.rules.link.exec(src)) {
            var lastParenIndex = findClosingBracket$1(cap[2], '()');

            if (lastParenIndex > -1) {
              var start = cap[0].indexOf('!') === 0 ? 5 : 4;
              var linkLen = start + cap[1].length + lastParenIndex;
              cap[2] = cap[2].substring(0, lastParenIndex);
              cap[0] = cap[0].substring(0, linkLen).trim();
              cap[3] = '';
            }

            src = src.substring(cap[0].length);
            this.inLink = true;
            href = cap[2];

            if (this.options.pedantic) {
              link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

              if (link) {
                href = link[1];
                title = link[3];
              } else {
                title = '';
              }
            } else {
              title = cap[3] ? cap[3].slice(1, -1) : '';
            }

            href = href.trim().replace(/^<([\s\S]*)>$/, '$1');
            out += this.outputLink(cap, {
              href: InlineLexer.escapes(href),
              title: InlineLexer.escapes(title)
            });
            this.inLink = false;
            continue;
          } // reflink, nolink


          if ((cap = this.rules.reflink.exec(src)) || (cap = this.rules.nolink.exec(src))) {
            src = src.substring(cap[0].length);
            link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
            link = this.links[link.toLowerCase()];

            if (!link || !link.href) {
              out += cap[0].charAt(0);
              src = cap[0].substring(1) + src;
              continue;
            }

            this.inLink = true;
            out += this.outputLink(cap, link);
            this.inLink = false;
            continue;
          } // strong


          if (cap = this.rules.strong.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.strong(this.output(cap[4] || cap[3] || cap[2] || cap[1]));
            continue;
          } // em


          if (cap = this.rules.em.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.em(this.output(cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1]));
            continue;
          } // code


          if (cap = this.rules.code.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.codespan(escape$3(cap[2].trim(), true));
            continue;
          } // br


          if (cap = this.rules.br.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.br();
            continue;
          } // del (gfm)


          if (cap = this.rules.del.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.del(this.output(cap[1]));
            continue;
          } // autolink


          if (cap = this.rules.autolink.exec(src)) {
            src = src.substring(cap[0].length);

            if (cap[2] === '@') {
              text = escape$3(this.mangle(cap[1]));
              href = 'mailto:' + text;
            } else {
              text = escape$3(cap[1]);
              href = text;
            }

            out += this.renderer.link(href, null, text);
            continue;
          } // url (gfm)


          if (!this.inLink && (cap = this.rules.url.exec(src))) {
            if (cap[2] === '@') {
              text = escape$3(cap[0]);
              href = 'mailto:' + text;
            } else {
              // do extended autolink path validation
              do {
                prevCapZero = cap[0];
                cap[0] = this.rules._backpedal.exec(cap[0])[0];
              } while (prevCapZero !== cap[0]);

              text = escape$3(cap[0]);

              if (cap[1] === 'www.') {
                href = 'http://' + text;
              } else {
                href = text;
              }
            }

            src = src.substring(cap[0].length);
            out += this.renderer.link(href, null, text);
            continue;
          } // text


          if (cap = this.rules.text.exec(src)) {
            src = src.substring(cap[0].length);

            if (this.inRawBlock) {
              out += this.renderer.text(this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape$3(cap[0]) : cap[0]);
            } else {
              out += this.renderer.text(escape$3(this.smartypants(cap[0])));
            }

            continue;
          }

          if (src) {
            throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
          }
        }

        return out;
      }
    }, {
      key: "outputLink",

      /**
       * Compile Link
       */
      value: function outputLink(cap, link) {
        var href = link.href,
            title = link.title ? escape$3(link.title) : null;
        return cap[0].charAt(0) !== '!' ? this.renderer.link(href, title, this.output(cap[1])) : this.renderer.image(href, title, escape$3(cap[1]));
      }
      /**
       * Smartypants Transformations
       */

    }, {
      key: "smartypants",
      value: function smartypants(text) {
        if (!this.options.smartypants) return text;
        return text // em-dashes
        .replace(/---/g, "\u2014") // en-dashes
        .replace(/--/g, "\u2013") // opening singles
        .replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018") // closing singles & apostrophes
        .replace(/'/g, "\u2019") // opening doubles
        .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C") // closing doubles
        .replace(/"/g, "\u201D") // ellipses
        .replace(/\.{3}/g, "\u2026");
      }
      /**
       * Mangle Links
       */

    }, {
      key: "mangle",
      value: function mangle(text) {
        if (!this.options.mangle) return text;
        var l = text.length;
        var out = '',
            i = 0,
            ch;

        for (; i < l; i++) {
          ch = text.charCodeAt(i);

          if (Math.random() > 0.5) {
            ch = 'x' + ch.toString(16);
          }

          out += '&#' + ch + ';';
        }

        return out;
      }
    }], [{
      key: "output",

      /**
       * Static Lexing/Compiling Method
       */
      value: function output(src, links, options) {
        var inline = new InlineLexer(links, options);
        return inline.output(src);
      }
    }, {
      key: "escapes",
      value: function escapes(text) {
        return text ? text.replace(InlineLexer.rules._escapes, '$1') : text;
      }
    }, {
      key: "rules",
      get: function get() {
        return inline$1;
      }
    }]);

    return InlineLexer;
  }();

  /**
   * TextRenderer
   * returns only the textual part of the token
   */
  var TextRenderer_1 = /*#__PURE__*/function () {
    function TextRenderer() {
      _classCallCheck(this, TextRenderer);
    }

    _createClass(TextRenderer, [{
      key: "strong",
      // no need for block level renderers
      value: function strong(text) {
        return text;
      }
    }, {
      key: "em",
      value: function em(text) {
        return text;
      }
    }, {
      key: "codespan",
      value: function codespan(text) {
        return text;
      }
    }, {
      key: "del",
      value: function del(text) {
        return text;
      }
    }, {
      key: "html",
      value: function html(text) {
        return text;
      }
    }, {
      key: "text",
      value: function text(_text) {
        return _text;
      }
    }, {
      key: "link",
      value: function link(href, title, text) {
        return '' + text;
      }
    }, {
      key: "image",
      value: function image(href, title, text) {
        return '' + text;
      }
    }, {
      key: "br",
      value: function br() {
        return '';
      }
    }]);

    return TextRenderer;
  }();

  var defaults$4 = defaults.defaults;
  var merge$2 = helpers.merge,
      unescape$1 = helpers.unescape;
  /**
   * Parsing & Compiling
   */

  var Parser_1 = /*#__PURE__*/function () {
    function Parser(options) {
      _classCallCheck(this, Parser);

      this.tokens = [];
      this.token = null;
      this.options = options || defaults$4;
      this.options.renderer = this.options.renderer || new Renderer_1();
      this.renderer = this.options.renderer;
      this.renderer.options = this.options;
      this.slugger = new Slugger_1();
    }
    /**
     * Static Parse Method
     */


    _createClass(Parser, [{
      key: "parse",

      /**
       * Parse Loop
       */
      value: function parse(tokens) {
        this.inline = new InlineLexer_1(tokens.links, this.options); // use an InlineLexer with a TextRenderer to extract pure text

        this.inlineText = new InlineLexer_1(tokens.links, merge$2({}, this.options, {
          renderer: new TextRenderer_1()
        }));
        this.tokens = tokens.reverse();
        var out = '';

        while (this.next()) {
          out += this.tok();
        }

        return out;
      }
    }, {
      key: "next",

      /**
       * Next Token
       */
      value: function next() {
        this.token = this.tokens.pop();
        return this.token;
      }
    }, {
      key: "peek",

      /**
       * Preview Next Token
       */
      value: function peek() {
        return this.tokens[this.tokens.length - 1] || 0;
      }
    }, {
      key: "parseText",

      /**
       * Parse Text Tokens
       */
      value: function parseText() {
        var body = this.token.text;

        while (this.peek().type === 'text') {
          body += '\n' + this.next().text;
        }

        return this.inline.output(body);
      }
    }, {
      key: "tok",

      /**
       * Parse Current Token
       */
      value: function tok() {
        var body = '';

        switch (this.token.type) {
          case 'space':
            {
              return '';
            }

          case 'hr':
            {
              return this.renderer.hr();
            }

          case 'heading':
            {
              return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, unescape$1(this.inlineText.output(this.token.text)), this.slugger);
            }

          case 'code':
            {
              return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);
            }

          case 'table':
            {
              var header = '',
                  i,
                  row,
                  cell,
                  j; // header

              cell = '';

              for (i = 0; i < this.token.header.length; i++) {
                cell += this.renderer.tablecell(this.inline.output(this.token.header[i]), {
                  header: true,
                  align: this.token.align[i]
                });
              }

              header += this.renderer.tablerow(cell);

              for (i = 0; i < this.token.cells.length; i++) {
                row = this.token.cells[i];
                cell = '';

                for (j = 0; j < row.length; j++) {
                  cell += this.renderer.tablecell(this.inline.output(row[j]), {
                    header: false,
                    align: this.token.align[j]
                  });
                }

                body += this.renderer.tablerow(cell);
              }

              return this.renderer.table(header, body);
            }

          case 'blockquote_start':
            {
              body = '';

              while (this.next().type !== 'blockquote_end') {
                body += this.tok();
              }

              return this.renderer.blockquote(body);
            }

          case 'list_start':
            {
              body = '';
              var ordered = this.token.ordered,
                  start = this.token.start;

              while (this.next().type !== 'list_end') {
                body += this.tok();
              }

              return this.renderer.list(body, ordered, start);
            }

          case 'list_item_start':
            {
              body = '';
              var loose = this.token.loose;
              var checked = this.token.checked;
              var task = this.token.task;

              if (this.token.task) {
                if (loose) {
                  if (this.peek().type === 'text') {
                    var nextToken = this.peek();
                    nextToken.text = this.renderer.checkbox(checked) + ' ' + nextToken.text;
                  } else {
                    this.tokens.push({
                      type: 'text',
                      text: this.renderer.checkbox(checked)
                    });
                  }
                } else {
                  body += this.renderer.checkbox(checked);
                }
              }

              while (this.next().type !== 'list_item_end') {
                body += !loose && this.token.type === 'text' ? this.parseText() : this.tok();
              }

              return this.renderer.listitem(body, task, checked);
            }

          case 'html':
            {
              // TODO parse inline content if parameter markdown=1
              return this.renderer.html(this.token.text);
            }

          case 'paragraph':
            {
              return this.renderer.paragraph(this.inline.output(this.token.text));
            }

          case 'text':
            {
              return this.renderer.paragraph(this.parseText());
            }

          default:
            {
              var errMsg = 'Token with "' + this.token.type + '" type was not found.';

              if (this.options.silent) {
                console.log(errMsg);
              } else {
                throw new Error(errMsg);
              }
            }
        }
      }
    }], [{
      key: "parse",
      value: function parse(tokens, options) {
        var parser = new Parser(options);
        return parser.parse(tokens);
      }
    }]);

    return Parser;
  }();

  var merge$3 = helpers.merge,
      checkSanitizeDeprecation$1 = helpers.checkSanitizeDeprecation,
      escape$4 = helpers.escape;
  var getDefaults = defaults.getDefaults,
      changeDefaults = defaults.changeDefaults,
      defaults$5 = defaults.defaults;
  /**
   * Marked
   */

  function marked(src, opt, callback) {
    // throw error in case of non string input
    if (typeof src === 'undefined' || src === null) {
      throw new Error('marked(): input parameter is undefined or null');
    }

    if (typeof src !== 'string') {
      throw new Error('marked(): input parameter is of type ' + Object.prototype.toString.call(src) + ', string expected');
    }

    if (callback || typeof opt === 'function') {
      var _ret = function () {
        if (!callback) {
          callback = opt;
          opt = null;
        }

        opt = merge$3({}, marked.defaults, opt || {});
        checkSanitizeDeprecation$1(opt);
        var highlight = opt.highlight;
        var tokens,
            pending,
            i = 0;

        try {
          tokens = Lexer_1.lex(src, opt);
        } catch (e) {
          return {
            v: callback(e)
          };
        }

        pending = tokens.length;

        var done = function done(err) {
          if (err) {
            opt.highlight = highlight;
            return callback(err);
          }

          var out;

          try {
            out = Parser_1.parse(tokens, opt);
          } catch (e) {
            err = e;
          }

          opt.highlight = highlight;
          return err ? callback(err) : callback(null, out);
        };

        if (!highlight || highlight.length < 3) {
          return {
            v: done()
          };
        }

        delete opt.highlight;
        if (!pending) return {
          v: done()
        };

        for (; i < tokens.length; i++) {
          (function (token) {
            if (token.type !== 'code') {
              return --pending || done();
            }

            return highlight(token.text, token.lang, function (err, code) {
              if (err) return done(err);

              if (code == null || code === token.text) {
                return --pending || done();
              }

              token.text = code;
              token.escaped = true;
              --pending || done();
            });
          })(tokens[i]);
        }

        return {
          v: void 0
        };
      }();

      if (_typeof(_ret) === "object") return _ret.v;
    }

    try {
      opt = merge$3({}, marked.defaults, opt || {});
      checkSanitizeDeprecation$1(opt);
      return Parser_1.parse(Lexer_1.lex(src, opt), opt);
    } catch (e) {
      e.message += '\nPlease report this to https://github.com/markedjs/marked.';

      if ((opt || marked.defaults).silent) {
        return '<p>An error occurred:</p><pre>' + escape$4(e.message + '', true) + '</pre>';
      }

      throw e;
    }
  }
  /**
   * Options
   */


  marked.options = marked.setOptions = function (opt) {
    merge$3(marked.defaults, opt);
    changeDefaults(marked.defaults);
    return marked;
  };

  marked.getDefaults = getDefaults;
  marked.defaults = defaults$5;
  /**
   * Expose
   */

  marked.Parser = Parser_1;
  marked.parser = Parser_1.parse;
  marked.Renderer = Renderer_1;
  marked.TextRenderer = TextRenderer_1;
  marked.Lexer = Lexer_1;
  marked.lexer = Lexer_1.lex;
  marked.InlineLexer = InlineLexer_1;
  marked.inlineLexer = InlineLexer_1.output;
  marked.Slugger = Slugger_1;
  marked.parse = marked;
  var marked_1 = marked;

  /*
  eslint
  no-multi-spaces: ["error", {exceptions: {"VariableDeclarator": true}}]
  padded-blocks: ["error", {"classes": "always"}]
  max-len: ["error", 80]
  */
  var is_object = isObject;

  function isObject(val) {
    return !(val == null || _typeof(val) !== 'object' || Array.isArray(val));
  }

  /*
  eslint
  no-multi-spaces: ["error", {exceptions: {"VariableDeclarator": true}}]
  padded-blocks: ["error", {"classes": "always"}]
  max-len: ["error", 80]
  */

  var array_some = some;

  function some(arr, fn) {
    var len = arr.length;
    var i = -1;

    while (++i < len) {
      if (fn(arr[i], i, arr)) {
        return true;
      }
    }

    return false;
  }

  var getPropertyValue_1 = getPropertyValue;

  function getPropertyValue(obj, path) {
    if (!is_object(obj) || typeof path !== 'string') {
      return obj;
    }

    var clone = obj;
    array_some(path.split('.'), procPath);
    return clone;

    function procPath(p) {
      clone = clone[p];

      if (!clone) {
        return true;
      }
    }
  }

  var _temp;
  var replaceVars$1 = utils.replaceVars;
  var block$2 = (_temp = function Block(_path, content) {
    var _this = this;

    var _options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, Block);

    _defineProperty(this, "id", function (path) {
      if (!path) return _this.path;
      return _this.path ? [_this.path, path].join('.') : path;
    });

    _defineProperty(this, "get", function (path) {
      var result = getPropertyValue_1(_this.content, path); //If an item is missing, check that the section has been loaded

      if (typeof result === 'undefined' && _this.draft) {
        var section = path.split('.')[0];
        var loadedSections = Object.keys(_this.content || {});

        if (!loadedSections.includes(section)) {
          console.warn("Tried to access unloaded section: ".concat(section));
        }
      }

      return result;
    });

    _defineProperty(this, "text", function (path, vars) {
      var text = _this.get(path);

      if (typeof text === 'undefined') {
        return _this.draft ? "[".concat(path, "]") : '';
      }

      if (typeof text !== 'string') {
        console.warn("Tried to get object as string: ".concat(path));
        return _this.draft ? "[".concat(path, "]") : '';
      }

      if (vars) {
        text = replaceVars$1(text, vars);
      }

      return text;
    });

    _defineProperty(this, "map", function (path, fn) {
      var listContent = _this.get(path) || _defineProperty({}, Date.now(), {});

      var keys = Object.keys(listContent).sort();
      return keys.map(function (key, index) {
        var itemPath = [path, key].join('.');

        var itemBlock = _this.block(itemPath);

        return fn.call(undefined, itemBlock, index);
      });
    });

    _defineProperty(this, "block", function (path, fn) {
      var blockPath = _this.id(path);

      var blockContent = _this.get(path);

      var childBlock = new Block(blockPath, blockContent, _this.options);

      if (typeof fn === 'function') {
        fn.call(undefined, childBlock);
      }

      return childBlock;
    });

    _defineProperty(this, "markdown", function (path, vars) {
      return marked_1(_this.text(path, vars));
    });

    _defineProperty(this, "el", function (path, vars) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var id = _this.id(path);

      var text = options.markdown ? _this.markdown(path, vars) : _this.text(path, vars);
      var editor = vars || options.markdown ? 'data-wurd-md' : 'data-wurd';

      if (_this.draft) {
        var type = options.type || 'span';
        if (options.markdown) type = 'div';
        return "<".concat(type, " ").concat(editor, "=\"").concat(id, "\">").concat(text, "</").concat(type, ">");
      } else {
        return text;
      }
    });

    this.path = _path;
    this.content = content;
    this.options = _options;
    this.lang = _options.lang;
    this.editMode = _options.editMode;
    this.draft = _options.draft;
  }
  /**
   * Gets the ID of a child content item by path (e.g. id('item') returns `block.item`)
   *
   * @param {String} path       Item path e.g. `section.item`
   *
   * @return {String}
   */
  , _temp);

  var _fetch2 = typeof fetch !== 'undefined' ? fetch : require$$0__default['default'];

  var getCacheId$1 = utils.getCacheId,
      getCache$1 = utils.getCache;
  var API_URL = typeof process !== 'undefined' && process.env.WURD_API_URL || 'https://api-v3.wurd.io';

  var hasEditQueryString = function hasEditQueryString() {
    return typeof location !== 'undefined' && new URLSearchParams(location.search).has('edit');
  };

  var Wurd = /*#__PURE__*/function () {
    function Wurd(options) {
      _classCallCheck(this, Wurd);

      this.app = null;
      this.options = _objectSpread2({
        draft: false,
        editMode: false,
        lang: null,
        log: false
      }, options);
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


    _createClass(Wurd, [{
      key: "connect",
      value: function connect(app, options) {
        this.app = app;
        this.options = _objectSpread2(_objectSpread2({}, this.options), options);

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

    }, {
      key: "load",
      value: function load(_ids, _options) {
        var _this = this;

        //Merge default and request options
        var options = _objectSpread2(_objectSpread2({}, this.options), _options); //Force draft to true if in editMode


        if (options.editMode === true || this.options.editMode === 'querystring' && hasEditQueryString()) {
          options.draft = true;
        }

        if (!this.app) {
          throw new Error('Use wurd.connect(appName) before wurd.load()');
        } //Normalise ids to array


        var ids = typeof _ids === 'string' ? _ids.split(',') : _ids;
        if (options.log) console.log('loading: ', ids, options); //If in draft, skip cache

        if (options.draft) {
          return this._loadFromServer(ids, options).then(function (content) {
            return new block$2(null, content, options);
          });
        } //Otherwise not in draft mode; check for cached versions


        var cachedContent = this._loadFromCache(ids, options);

        var uncachedIds = Object.keys(cachedContent).filter(function (id) {
          return cachedContent[id] == undefined;
        }); //If all content was cached, return it without a server trip

        if (!uncachedIds.length) {
          return new block$2(null, cachedContent, options);
        }

        return this._loadFromServer(uncachedIds, options).then(function (fetchedContent) {
          _this._saveToCache(fetchedContent, options);

          return new block$2(null, _objectSpread2(_objectSpread2({}, cachedContent), fetchedContent), options);
        });
      }
      /**
       * Express middleware that loads section content and makes it available to templates with helpers (get, map, etc.).
       *
       * @param {String|Array} ids      IDs of sections to load content for. Can be an array or comma-separated string of sections to load, e.g. 'main,home'
       * 
       * @return {Function} middleware
       */

    }, {
      key: "mw",
      value: function mw(ids) {
        var _this2 = this;

        return /*#__PURE__*/function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
            var editMode, options;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    // detect request-specific options such as editMode and language
                    editMode = _this2.options.editMode === 'querystring' ? req.query.edit !== undefined : _this2.options.editMode;
                    options = {
                      editMode: editMode,
                      lang: req.query.lang,
                      draft: editMode || _this2.options.draft // Force draft to true if editMode is on

                    };
                    _context.prev = 2;
                    _context.next = 5;
                    return _this2.load(ids, options);

                  case 5:
                    res.locals.cms = _context.sent;
                    res.locals.app = _this2.app;
                    next();
                    _context.next = 13;
                    break;

                  case 10:
                    _context.prev = 10;
                    _context.t0 = _context["catch"](2);
                    next(_context.t0);

                  case 13:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, null, [[2, 10]]);
          }));

          return function (_x, _x2, _x3) {
            return _ref.apply(this, arguments);
          };
        }();
      }
      /**
       * @param {Object} allContent    Content keyed by section ID (i.e. the response from the Wurd content API)
       *
       * @return {Promise}
       */

    }, {
      key: "_saveToCache",
      value: function _saveToCache(allContent, options) {
        var cacheEntries = Object.keys(allContent).map(function (id) {
          return [getCacheId$1(id, options), allContent[id]];
        });

        var _iterator = _createForOfIteratorHelper(cacheEntries),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _step$value = _slicedToArray(_step.value, 2),
                k = _step$value[0],
                v = _step$value[1];

            this.cache.set(k, v);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        this.cache.snapshot(Object.fromEntries(cacheEntries));
      }
      /**
       * @param {Array} ids           Section IDs to load content for
       *
       * @return {Promise}
       */

    }, {
      key: "_loadFromCache",
      value: function _loadFromCache(ids, options) {
        var _this3 = this;

        return Object.fromEntries(ids.map(function (id) {
          return [id, _this3.cache.get(getCacheId$1(id, options))];
        }));
      }
      /**
       * @param {Array} ids           Section IDs to load content for
       *
       * @return {Promise}
       */

    }, {
      key: "_loadFromServer",
      value: function _loadFromServer(ids, options) {
        var app = this.app;
        var sections = ids.join(',');
        var params = {};
        if (options.draft) params.draft = 1;
        if (options.lang) params.lang = options.lang;
        var url = "".concat(API_URL, "/apps/").concat(app, "/content/").concat(sections, "?").concat(new URLSearchParams(params));
        options.log && console.info('from server: ', ids, url);
        return this._fetch(url);
      }
    }, {
      key: "_fetch",
      value: function _fetch(url) {
        return _fetch2(url).then(function (res) {
          if (!res.ok) throw new Error("Error loading ".concat(url, ": ").concat(res.statusText));
          return res.json();
        });
      }
    }]);

    return Wurd;
  }();

  var instance = new Wurd();
  instance.Wurd = Wurd;
  var src = instance;

  return src;

})));