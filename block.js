const marked = require('marked');
const getValue = require('get-property-value');

const {replaceVars} = require('./utils');


module.exports = class Block {

  constructor(app, path, content, options = {}) {
    this.app = app;
    this.path = path;
    this.content = content;
    this.options = options;

    this.lang = options.lang;
    this.editMode = options.editMode;
    this.draft = options.draft;

    // Ensure this is bound properly, required for when using object destructuring
    // E.g. wurd.with('user', ({text}) => text('age'));
    this.get = this.get.bind(this);
    this.text = this.text.bind(this);
    this.map = this.map.bind(this);
    this.block = this.block.bind(this);
    this.markdown = this.markdown.bind(this);
    this.el = this.el.bind(this);
  }

  /**
   * Gets a content item by path (e.g. `section.item`).
   * Will return both text and/or objects, depending on the contents of the item
   *
   * @param {String} path       Item path e.g. `section.item`
   *
   * @return {Mixed}
   */
  get(path) {
    return getValue(this.content, path);
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
  text(path, vars) {
    let text = this.get(path);

    if (typeof text === 'undefined') {
      return (this.draft) ? `[${path}]` : '';
    }

    if (typeof text !== 'string') {
      console.warn(`Tried to get object as string: ${path}`);

      return (this.draft) ? `[${path}]` : '';
    }

    if (vars) {
      text = replaceVars(text, vars);
    }

    return text;
  }

  /**
   * Iterates over a collection / list object with the given callback.
   *
   * @param {String} path
   * @param {Function} fn     Callback function with signature ({Function} itemBlock, {Number} index)
   */
  map(path, fn) {
    // Get list content, defaulting to backup with the template
    const listContent = this.get(path) || { [Date.now()]: {} };
    let index = 0;

    const keys = Object.keys(listContent).sort();

    return keys.map(key => {
      const item = listContent[key];
      const currentIndex = index;

      index++;

      const itemPath = [path, key].join('.');
      const itemBlock = this.block(itemPath);

      return fn.call(undefined, itemBlock, currentIndex);
    });
  }

  /**
   * Creates a new Block scoped to the child content
   *
   * @param {String} path
   * @param {Function} [fn]     Optional callback that receives the child block object
   */
  block(path, fn) {
    const blockPath = (this.path) ? [this.path, path].join('.') : path;
    const blockContent = this.get(path);

    const childBlock = new Block(this.app, blockPath, blockContent, this.options);

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
  markdown(path, vars) {
    return marked(this.text(path, vars));
  }

  /**
   * Creates an editable element; this is a shortcut for writing out the HTML tag
   * with the wurd editor attributes and the text content.
   * 
   * Use this or create a similar helper to avoid having to type out the item paths twice.
   *
   * @param {String} path
   * @param {Object} [vars]               Optional variables to replace in the text
   * @param {Object} [options]
   * @param {Boolean} [options.markdown]  Parses text as markdown
   * @param {String} [options.type]       HTML node type, defaults to 'span'
   */
  el(path, vars, options = {}) {
    const fullPath = (this.path) ? [this.path, path].join('.') : path;
    const text = options.markdown ? this.markdown(path, vars) : this.text(path, vars);
    const editor = (vars || options.markdown) ? 'data-wurd-md' : 'data-wurd';

    if (this.draft) {
      const type = options.type || 'span';
      
      return `<${type} ${editor}="${fullPath}">${text}</${type}>`;
    } else {
      return text;
    }
  }

};