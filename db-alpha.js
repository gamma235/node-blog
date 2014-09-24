// This function writes to the database then renders a thank you message
function addNewPost(request, response) {
  var postsHTML = fs.readFileSync('views/posts.html');
  response.writeHead(200, {
    'content-type': 'text/html; charset=utf-8'
  });
  parseBody(request, function(body) {
  //  pg.connect(conString, function(err, client, done) {
  //    if(err) {
  //      return console.error('error fetching client from pool', err);
  //    }
     // client.query('CREATE TABLE IF NOT EXISTS subscriber (name varchar(64), email varchar(64))', function(err, result) {
     //   client.query("INSERT INTO subscriber (name, email) values($1, $2)", [body.name, body.email]);
     //   done();
     //   if(err) {
     //     return console.error('error running query', err);
     //   }
     //   console.log(result.rows);
     // });
    }
  )};
  response.end(postsHTML);
}
