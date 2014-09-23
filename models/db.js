var pg = require('pg');

var conString = "postgres://xucaccygtojehx:-0iTWi-fqnlB2JDC1vyYKct-ho@ec2-107-21-226-77.compute-1.amazonaws.com:5432/d2v320pb6k9spn";

exports.subscribe = function (name, email) {
  client.query("INSERT INTO subscriber (name, email) values($1, $2)", [name.toString(), email.toString()]);
}

exports.connectUser = pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('CREATE TABLE IF NOT EXISTS subscriber (name varchar(64), email varchar(64))', function(err, result) {
    done();

    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows);
  });
});
