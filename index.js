var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    qs = require('querystring');

// html file cache
var homeHTML = fs.readFileSync('views/post/home.html');
var newHTML = fs.readFileSync('views/post/new.html');
var postsHTML = fs.readFileSync('views/post/posts.html')


// render functions
function renderHome(request, response) {
  response.writeHead(200, {
    'content-type': 'text/html; charset=utf-8'
  });
  response.end(homeHTML);
}

function renderPostForm(request, response) {
  response.writeHead(200, {
    'content-type': 'text/html; charset=utf-8'
  });
  response.end(newHTML);
}

function addNewPost(request, response) {

  response.writeHead(200, {
    'content-type': 'text/html; charset=utf-8'
  });

  parseBody(request, function(body) {
    var post = {
      title: body.title,
      content: body.content
    }
    console.log("Title: " + post.title);
    console.log("Content: " + post.content);
  })
  response.end(postsHTML);
}

// utils
function render404(request, response) {
  response.writeHead(404);
  response.end("404 File not found!");
}

function parseBody(request, callback) {
  var body = " ";

  request.on('data', function(chunk) {
    body += chunk;
  });
  request.on('end', function() {
    callback(qs.parse(body));
  });
}

// routes
var homeREGEX = new RegExp('^/?$');
var newREGEX = new RegExp('^/posts/new/?$');
var postsREGEX = new RegExp('^/posts/?$');

// server
var server = http.createServer(function(request, response){
  var pathname = url.parse(request.url).pathname;

  if (homeREGEX.test(pathname)) {
    renderHome(request, response);
  } else if (newREGEX.test(pathname)) {
    renderPostForm(request, response);
  } else if (postsREGEX.test(pathname)) {
    addNewPost(request, response);
  } else {
    render404(request, response);
  }
});

server.listen(3000);

// on startup
console.log("listening on port http://127.0.0.1:3000");
