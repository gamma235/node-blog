var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    routes = require('./routes/routes.js'),
    db = require('./models/db.js'),
    render = require('./utils/render.js');

// errors
function error404(request, response) {
  response.writeHead(404);
  response.end("404 File not found!");
}

// server
var server = http.createServer(function(request, response){
  var pathname = url.parse(request.url).pathname;

  if (routes.homeREGEX.test(pathname)) {
    render.renderHome(request, response);

  } else if (routes.postsREGEX.test(pathname)) {
    db.addNewPost(request, response);

  } else if (routes.cssREGEX.test(pathname)) {
    render.sendCSS(request, response);
  }
  else if (routes.tokyoREGEX.test(pathname)) {
    render.sendTokyo(request, response);
  } else {
    error404(request, response);
  }
});

server.listen(process.env.PORT || 5000);

// on startup in dev mode
//server.listen(5000);
//console.log("listening on port http://127.0.0.1:5000");
