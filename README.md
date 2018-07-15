# Wurd CMS client for NodeJS
Wurd is a service that lets you integrate a CMS into any website or app in minutes.  This client makes it easy to load content for rendering pages on the server.


## Example
For a website you might want to load shared content (e.g. header/footer) along with the specific page (e.g. homepage content):

```javascript
const app = require('express')();
const wurd = require('wurd');

wurd.connect('node-example', {
  editMode: true  // Edit mode always on
});

app.get('/', async (req, res) => {
  //Load a content block with accessor methods
  //Content is cached for subsequent requests
  const content = await wurd.load('shared,homepage');
  
  //Use shortcuts for cleaner HTML templates
  const {text, el} = content;
  
  //Use block() for easier access to subsets of content
  const footer = content.block('shared.footer');
  
  res.send(`
    <html>
      <head>
        <!-- use text() to get simple text content -->
        <title>${text('shared.brandName')}</title>
      </head>
      <body>
        <!-- use el() to create editable text regions -->
        <h1>${el('homepage.title')}</h1>
        <h2>${el('homepage.intro', {name: 'John'}, {markdown: true})}</h2>
        
        <footer>
          <a href="privacy">${footer.text('privacy')}</a>
          <a href="terms">${footer.text('terms')}</a>
        </footer>
      </body>
     </html>
  `);
});

app.listen(3000);
```

See more in the [examples](https://github.com/wurdcms/wurd-node/tree/master/examples) folder or run them with `npm run example`.


## Installation & usage
- Create a Wurd account and project at https://manage.wurd.io.
- Install the `wurd` module in your app: `npm install wurd --save`
- Connect to Wurd project with `wurd.connect('my-project', { editMode: true })`. 
- Load top level 'sections' of content you'll be using, e.g.: `await wurd.load('homepage')`. You can load multiple sections at a time: `await wurd.load('shared,homepage')`
- `await wurd.load()` gives you a content block with methods to access the content. See the Content Block API for more details.
- In your views/templates get content with the block methods, such as `content.text('section.item')`. The `content.el(<itemName>)` helper creates text regions that can be edited in the browser.


## Content Block API
`await wurd.load('sectionName')` will resolve to a Content Block with the following API for accessing content.

### .text(path, [variables])
Returns a content item's as text.

Pass a variables object as the second argument and template variables surrounded by `{{}}` are replaced.

```javascript
const content = await wurd.load('homepage');

content.text('homepage.welcome.title');  // 'Welcome'
content.text('homepage.welcome.message', { name: 'John' });  // 'Hi, {{name}}' becomes 'Hi, John'
```

### .markdown(path, [variables])
Returns a content item as text and also parses it as Markdown for formatting.

Pass a variables object as the second argument and template variables surrounded by `{{}}` are replaced.

### .map(path, function)
Iterates over a list of content. The function receives a content block for each item in the list, with their own `.text()`, `.el()` etc. methods.

```javascript
const content = await wurd.load('team');

content.map('team.members', ({text}) => ``
test
``
```


### .el(path, [variables], [options])
A helper method for adding editable text regions to HTML.

Note that the result of this method usually needs to be used in templates unescaped, so you should be careful if using this method where user generated content will be displayed.

```html
<h1><%- content.el('homepage.title') %></h1>
```

### .block(path, [callback])
Returns a new Content Block, with it's own methods for fetching content; this lets you use shorter content item IDs.

```javascript
const content = await wurd.load('shared,homepage');

const shared = content.block('shared');
const page = content.block('homepage');

page.text('title'); // 'Welcome'

const footer = shared.block('footer');
footer.text('privacy'); // 'Privacy policy'
footer.text('terms'); // 'Terms and Conditions'
```

```html
<% content.block('shared.footer', ({el}) => { %>
  <a href="privacy"><%- el('privacy') %></a>
  <a href="terms"><%- el('terms') %></a>
<% }) %>
```

### .get(path)
Returns the content item without converting it to text. This method can be used to check if a content item already exists.

If the content item does not exist, `null` is returned. If it is 

Pass a variables object as the second argument and template variables surrounded by `{{}}` are replaced.

```javascript
const content = await wurd.load('homepage');

content.get('homepage.welcome.title');  // 'Welcome'
content.get('homepage.foo123'); // null (no content exists yet for this item)
content.get('homepage.team.members'); // the section content as a standard object
```

### .id(path)
Returns the full item ID, which is the path from the root content, e.g. `homepage.hero.title`.

This method is usually only used when adding content editors to the page.

```javascript
const content = await wurd.load('homepage');

const hero = content.block('hero');

hero.id('title'); // 'homepage.hero.title'
```

```html
<html>
  <% content.block('hero', ({text, id}) => { %>
    <h1 data-wurd="<%= id('title') %>"><%= text('title') %></h1>
  <% ) %>
</html>
```

## Other modules
If loading content in the browser, check out these other packages:
- [wurd-web](https://github.com/wurdcms/wurd-web): For general client side Javascript apps
- [wurd-react](https://github.com/wurdcms/wurd-react): Easy integration for React apps
