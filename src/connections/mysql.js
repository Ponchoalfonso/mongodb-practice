const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : '172.17.0.1',
  user     : 'poncho',
  password : 'yourpassword',
  database : 'CPremier'
});
 
connection.connect();
 
module.exports = connection;
