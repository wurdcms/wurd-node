# Wurd CMS client for NodeJS
Wurd is a service that lets you integrate a CMS into any website or app in minutes.  This client makes it easy to load content for rendering pages on the server.


## Examples
### General example
```javascript
const wurd = require('wurd');

wurd.connect('myApp', {
  editMode: true  // Edit mode always on
});

wurd.load('homepage')
  .then(content => {
    console.log(content.get('homepage.title')); // 'Hello world'
  });
```

### Express example
`index.js`
```javascript
const app = require('express')();
const wurd = require('wurd');

// App middleware can be used to trigger editing mode
app.use(wurd.connect('myApp'), {
  editMode: 'querystring'     // Activate edit mode when the URL has an 'edit' query parameter
});

// Route middleware loads content onto the response
app.use('/', wurd.mw('homepage'), (req, res, next) => {
  res.render('homepage.ejs');     // In the template file you can access content with <%= wurd.get('homepage.title') %>
});
```

`homepage.ejs`
```html
<h1><%- wurd.el('homepage.title') %></h1>
```

See more in the [examples](https://github.com/wurdcms/wurd-node/tree/master/examples) folder or run them with `npm run example`.


## Installation
Using NPM:
```
npm install wurd
```

## Usage
1. Create a Wurd account and app.
2. Connect to a Wurd app with `wurd.connect('appName', { editMode: true })`. 
3. Load top level 'sections' of content you'll be using with `wurd.load('section')` (or use middleware: `wurd.mw('section')`).
4. In your views/templates etc., get content with `wurd.get('section.item')`.
5. To make regions editable, simply add the `data-wurd` attributes to the HTML.  For example (using EJS style template tags):

```html
<h1 data-wurd="homepage.title"><%= wurd.get('homepage.title') %></h1>
```

## Other modules
If loading content in the browser, check out these other packages:
- [wurd-web](https://github.com/wurdcms/wurd-web): For general client side Javascript apps
- [wurd-react](https://github.com/wurdcms/wurd-react): Easy integration for React apps
