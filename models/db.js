var pg = require('pg'),
    qs = require('querystring'),
    fs = require('fs');


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
exports.addNewPost = function(request, response) {
  var postsHTML = fs.readFileSync('views/posts.html');
  response.writeHead(200, {
    'content-type': 'text/html ; charset=utf-8'
  });
  response.write(postsHTML);
  parseBody(request, function(body) {

    //for prod mode
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {

    // for dev mode
    //pg.connect(conString, function(err, client, done) {

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
      });
      done();
    });
    response.end();
  });
}
