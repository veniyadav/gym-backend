// local server

//const mysql = require('mysql2/promise');

//const db = mysql.createPool({
//    host: '127.0.0.1',
//    port: 3306,
//    user: 'root',
//    password: '',
//    database: 'gym',
//    multipleStatements: true
//});

 

//console.warn('Connected');

//module.exports = db;

// live server

const mysql = require('mysql2/promise');

// Update the connection details with your URL
const db = mysql.createPool({
    host: 'gondola.proxy.rlwy.net',  // Use the provided host URL
    port: 30796,                     // Use the provided port
    user: 'root',                    // Your MySQL username
    password: 'EtshGFvMuFoUkIcswQouzTAYNxISRJzM',  // Your MySQL password
    database: 'railway',             // Use the provided database name
    multipleStatements: true        // Allow multiple statements if needed
});

console.warn('Connected');

module.exports = db;



