# Wurd CMS client for NodeJS
Wurd is a service that lets you integrate a CMS into any website or app in minutes.  This client makes it easy to load content for rendering pages on the server.


## Example
```javascript
const wurd = require('wurd');

wurd.connect('myApp');

wurd.load('homepage,common')
  .then(content => {
    console.log(content); // { homepage: { title: 'Hello world' }, common: {...} }

    console.log(wurd.get('homepage.title')); // 'Hello world'
  });
```

See more in the [examples](https://github.com/wurdcms/wurd-node-v3/tree/master/examples) folder or run them with `npm run example`.


## Installation
Using NPM:
```
npm install wurd
```

## Usage
1. Create a Wurd account and app.
2. Connect to a Wurd app with `wurd.connect('appName', {editMode: true})`. 
3. Load top level 'sections' of content you'll be using with `wurd.load('section')`.
4. In your views/templates etc., get content with `wurd.get('section.item')`.
5. To make regions editable, simply add the `data-wurd` attributes to the HTML.  For example (using EJS style template tags):

```html
<h1 data-wurd="homepage.title"><%= wurd.get('homepage.title') %></h1>
```

## Other modules
If loading content in the browser, check out these other packages:
- [wurd-web](https://github.com/wurdcms/wurd-web): For general client side Javascript apps
- [wurd-react](https://github.com/wurdcms/wurd-react): Easy integration for React apps
