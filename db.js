const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pranit4311e@",
  database: "Safety",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

module.exports = connection;
