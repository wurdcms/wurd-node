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
  editMode: 'querystring',
  log: true
}));

app.use((req, res, next) => {
  res.locals.markdown = markdown;
  res.locals.t = path => wurd.get(path);
  next();
});


//Routes
//Simple page
app.get('/', (req, res, next) => {
  wurd.load('nav,home', req.wurdOptions).then(content => {
    res.render('index');
  });
});

//Blog post: Example of loading content dynamically
app.get('/blog/:slug', (req, res, next) => {
  let {slug} = req.params;

  let postId = `blog_${slug}`;

  wurd.load(`nav,${postId}`, req.wurdOptions).then(content => {
    res.render('blog-post', {
      postId: postId
    });
  });
});


server.listen(3000, () => {
  console.log("Express server listening on port %d", server.address().port);
});
