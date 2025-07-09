const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'FHQ1Q13M27Ta@#',      // ← replace with your password if set
  database: 'robonics'
});

db.connect((err) => {
  if (err) {
    console.error('DB connection failed:', err);
  } else {
    console.log('✅ MySQL connected.');
  }
});

module.exports = db;
