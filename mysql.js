var mysql = require('mysql');
var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "190220",
  database: "QLCHECK1"
});
 module.exports=conn;


