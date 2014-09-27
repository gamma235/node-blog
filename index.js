var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    routes = require('./routes/routes.js'),
    db = require('./models/db.js');

var css = fs.readFileSync('styles/master.css');

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

// server
var server = http.createServer(function(request, response){
  var pathname = url.parse(request.url).pathname;

  if (routes.homeREGEX.test(pathname)) {
    renderHome(request, response);

  } else if (routes.postsREGEX.test(pathname)) {
    db.addNewPost(request, response);

  } else if (routes.cssREGEX.test(pathname)) {
    sendCSS(request, response);
  }
  else if (routes.tokyoREGEX.test(pathname)) {
    sendTokyo(request, response);
  } else {
    error404(request, response);
  }
});

server.listen(process.env.PORT || 5000);

// on startup in dev mode
//server.listen(5000);
//console.log("listening on port http://127.0.0.1:5000");
