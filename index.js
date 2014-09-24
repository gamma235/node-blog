var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    qs = require('querystring'),
    pg = require('pg').native;


// change this according to your db specs
var conString = "postgres://xucaccygtojehx:-0iTWi-fqnlB2JDC1vyYKct-ho@ec2-107-21-226-77.compute-1.amazonaws.com:5432/d2v320pb6k9spn";

// render functions
function renderHome(request, response) {
  var homeHTML = fs.readFileSync('views/get/home.html');
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

// This function writes to the database then renders a thank you message
function addNewPost(request, response) {
  var postsHTML = fs.readFileSync('views/get/posts.html');
  response.writeHead(200, {
    'content-type': 'text/html; charset=utf-8'
  });
  parseBody(request, function(body) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('CREATE TABLE IF NOT EXISTS subscriber (name varchar(64), email varchar(64))', function(err, result) {
        client.query("INSERT INTO subscriber (name, email) values($1, $2)", [body.name, body.email]);
        done();
        if(err) {
          return console.error('error running query', err);
        }
        console.log(result.rows);
      });
    });
  });
  response.end(postsHTML);
}

// errors
function error404(request, response) {
  response.writeHead(404);
  response.end("404 File not found!");
}

// utils
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

server.listen(3000);

// on startup
console.log("listening on port http://127.0.0.1:3000");
