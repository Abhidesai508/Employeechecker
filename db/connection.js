const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: '',
      database: 'employeechecker_db'
    },
    console.log(`Connected to the employeechecker database.`)
  );
  
    db.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });

  module.exports = db;