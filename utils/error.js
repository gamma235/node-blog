// errors
exports.error404 = function(request, response) {
  response.writeHead(404);
  response.end("404 File not found!");
}
