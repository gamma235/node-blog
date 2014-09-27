var fs = require('fs');

// render functions
exports.renderHome = function (request, response) {
  var homeHTML = fs.readFileSync('views/home.html');
  response.writeHead(200, {
    'content-type': 'text/html; charset=utf-8'
  });
  response.end(homeHTML);
}

exports.sendCSS = function(request, response) {
  var CSS = fs.readFileSync('styles/master.css');
  response.writeHead(200, {
    'content-type': 'text/css; charset=utf-8'
  });
  response.end(CSS);
}

exports.sendTokyo = function(request, response) {
  var tokyo = fs.readFileSync('resources/images/tokyo.jpg');
  response.writeHead(200, {
    'content-type': 'text/css; charset=utf-8'
  });
  response.end(tokyo);
}
