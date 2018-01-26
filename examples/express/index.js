const http = require('http');
const path = require('path');
const express = require('express');

const app = express();
const server = http.createServer(app);


//Set up Wurd
const wurd = require('../../index'); // Replace with require('wurd')


//Basic setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//Connect to the 'example' CMS app
app.use(wurd.connect('example', {
  editMode: 'querystring',  //Activate edit mode when the URL has an 'edit' query parameter
}));


//Simple page, using middleware to load content
app.get('/', wurd.mw('nav,home'), (req, res, next) => {
  res.render('index');
});


//Blog post: Example of loading content dynamically
app.get('/blog/:slug', (req, res, next) => {
  let postId = `blog_${req.params.slug}`;

  wurd.load(`nav,${postId}`, req.wurd)
    .then(content => {
      res.render('blog-post', {
        postId: postId,
        wurd: content
      });
    })
    .catch(next);
});


//Start
server.listen(3000, () => {
  console.log("Express server listening on port %d", server.address().port);
});
