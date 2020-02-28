const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'scooby',
    database: 'scooby_brew',
    password: 'Daisy-24',
})

module.exports = pool.promise();
