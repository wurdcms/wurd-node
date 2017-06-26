const http = require('http');
const path = require('path');
const express = require('express');
const markdown = require('marked'); // Optional, for Markdown support

const wurd = require('../../index'); // Replace with require('wurd')

const app = express();
const server = http.createServer(app);


//Basic setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', express.static(path.join(__dirname, 'public')));


//CMS setup
//Set draft mode and language
//Edit mode is indicated by ?edit in the URL;
//Language is also set this way e.g. ?&lang=es
app.use((req, res, next) => {
  let {edit, lang} = req.query;

  let isEditMode = (typeof edit !== 'undefined');

  req.wurdOptions = {
    draft: isEditMode,
    lang: lang
  };

  res.locals.editMode = isEditMode;
  res.locals.lang = lang;
  res.locals.markdown = markdown;

  next();
});


//Routes
//Simple page
app.get('/', (req, res, next) => {
  wurd.load('example', 'nav,home', req.wurdOptions, (err, content, helpers) => {
    if (err) return next(err);

    res.render('index', {
      wurd: helpers,
      t: helpers.text
    });
  });
});

//Blog post: Example of loading content dynamically
app.get('/blog/:slug', (req, res, next) => {
  let {slug} = req.params;

  let postId = `blog_${slug}`;

  wurd.load('example', `nav,${postId}`, req.wurdOptions, (err, content, helpers) => {
    if (err) return next(err);

    res.render('blog-post', {
      postId: postId,
      wurd: helpers,
      t: helpers.text
    });
  });
});


server.listen(3000, () => {
  console.log("Express server listening on port %d", server.address().port);
});
