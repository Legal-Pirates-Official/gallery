const mysql = require('mysql');

const mysqlconnection = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
})

mysqlconnection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Mysql database connected");
    }
})

module.export = mysqlconnection;