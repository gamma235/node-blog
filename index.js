var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    qs = require('querystring'),
    pg = require('pg').native;

var css = fs.readFileSync('styles/master.css');

// change this according to your db specs
//var conString = "postgres://xucaccygtojehx:-0iTWi-fqnlB2JDC1vyYKct-ho@ec2-107-21-226-77.compute-1.amazonaws.com:5432/d2v320pb6k9spn";

// render functions
function renderHome(request, response) {
  var homeHTML = fs.readFileSync('views/home.html');
  response.writeHead(200, {
    'content-type': 'text/html; charset=utf-8'
  });
  response.end(homeHTML);
}

function sendCSS (request, response) {
  var CSS = fs.readFileSync('styles/master.css');
  response.writeHead(200, {
    'content-type': 'text/css; charset=utf-8'
  });
  response.end(CSS);
}

function sendTokyo (request, response) {
  var tokyo = fs.readFileSync('resources/images/tokyo.jpg');
  response.writeHead(200, {
    'content-type': 'text/css; charset=utf-8'
  });
  response.end(tokyo);
}

// errors
function error404(request, response) {
  response.writeHead(404);
  response.end("404 File not found!");
}

// utils
function parseBody(request, callback) {
  var body = '';
  request.on('data', function(data) {
    console.log(data.toString());
    body += data.toString();
  });
  request.on('end', function() {
    console.log('about to parse body');
    callback(qs.parse(body));
  });
}

// This function writes to the database then renders a thank you message
function addNewPost(request, response) {
  var postsHTML = fs.readFileSync('views/posts.html');
  response.writeHead(200, {
    'content-type': 'text/html ; charset=utf-8'
  });
  parseBody(request, function(body) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('CREATE TABLE IF NOT EXISTS subscribers (name varchar(64), email varchar(64))', function(err, result) {
        if(err){
          console.error('error setting up table');
        }
        console.log('table successfully primed');
        client.query("INSERT INTO subscribers (name, email) values($1, $2)", [body.name, body.email], function(err, result) {
          if(err) {
            console.error('error adding user');
          }
          console.log('user info added successfully');
        });;

        done();
      });
    });
  });
  response.end(postsHTML);
}

// routes
var homeREGEX = new RegExp('^/?$');
var postsREGEX = new RegExp('^/posts/?$');
var cssREGEX = new RegExp('^/styles/master.css/?$');
var tokyoREGEX = new RegExp('^/resources/images/tokyo.jpg/?$');

// server
var server = http.createServer(function(request, response){
  var pathname = url.parse(request.url).pathname;

  if (homeREGEX.test(pathname)) {
    renderHome(request, response);

  } else if (postsREGEX.test(pathname)) {
    addNewPost(request, response);

  } else if (cssREGEX.test(pathname)) {
    sendCSS(request, response);
  }
  else if (tokyoREGEX.test(pathname)) {
    sendTokyo(request, response);
  } else {
    error404(request, response);
  }
});

server.listen(process.env.PORT || 5000);

// on startup in dev mode
//console.log("listening on port http://127.0.0.1:5000");
