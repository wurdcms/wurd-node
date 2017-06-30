const http = require('http');
const path = require('path');
const express = require('express');
const app = express();
const server = http.createServer(app);

const markdown = require('marked'); // Optional, for Markdown support

//Set up Wurd
const wurd = require('../../index'); // Replace with require('wurd')

//wurd.connect('example', { log: true });


//Basic setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', express.static(path.join(__dirname, 'public')));


//CMS setup
//Set draft mode and language
//Edit mode is indicated by ?edit in the URL;
//Language is also set this way e.g. ?&lang=es
/*app.use((req, res, next) => {
  let {edit, lang} = req.query;

  let isEditMode = (typeof edit !== 'undefined');

  req.wurdOptions = {
    draft: isEditMode,
    lang: lang
  };

  res.locals.editMode = isEditMode;
  res.locals.lang = lang;
  res.locals.markdown = markdown;
  res.locals.wurd = wurd;
  res.locals.t = path => wurd.get(path);

  next();
});*/


app.use(wurd.connect('example', {
  editMode: 'querystring',    // Set editMode to on when the 'edit' query parameter is set on the request URL (e.g. '?edit')
  langMode: 'querystring',    // Set the language when the 'lang' query parameter is set on the request URL (e.g. `?lang=es`)
  log: true
}));

app.use((req, res, next) => {
  res.locals.markdown = markdown;
  next();
});


//Routes
//Simple page
/*app.get('/', (req, res, next) => {
  wurd.load('nav,home', req.wurdOptions).then(content => {
    res.render('index');
  });
});*/

app.get('/', wurd.mw('nav,home'), (req, res, next) => {
  res.render('index');
});

//Blog post: Example of loading content dynamically
app.get('/blog/:slug', (req, res, next) => {
  let {slug} = req.params;

  let postId = `blog_${slug}`;

  wurd.load(`nav,${postId}`, req.wurd)
    .then(content => {
      res.render('blog-post', {
        postId: postId,
        wurd: content
      });
    })
    .catch(next);
});


server.listen(3000, () => {
  console.log("Express server listening on port %d", server.address().port);
});
