const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
})


db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Mysql database connected");
    }
});

module.exports = db;