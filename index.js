var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    qs = require('querystring'),
    db = require('./models/db.js'),
    express = require('express');

var app = express();

// render functions
function renderHome(request, response) {
  var homeHTML = fs.readFileSync('views/post/home.html');
  response.writeHead(200, {
    'content-type': 'text/html; charset=utf-8'
  });
  response.end(homeHTML);
}

function renderPostForm(request, response) {
  var newHTML = fs.readFileSync('views/post/new.html');
  response.writeHead(200, {
    'content-type': 'text/html; charset=utf-8'
  });
  response.end(newHTML);
}

function addNewPost(request, response) {
  var postsHTML = fs.readFileSync('views/post/posts.html');
  response.writeHead(200, {
    'content-type': 'text/html; charset=utf-8'
  });
  parseBody(request, function(body) {
    var post = {
      name: body.name,
      email: body.email
    }
    db.connectUser();
    db.subscribe(post.name, post.email);
  });
  response.end(postsHTML);
}

// utils
function error404(request, response) {
  response.writeHead(404);
  response.end("404 File not found!");
}

function parseBody(request, callback) {
  var body = '';
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
    error404(request, response);
  }
});

server.listen(5432);

// on startup
console.log("listening on port http://127.0.0.1:5432");
