var mysql = require('mysql');
var option = require('../config/mysql');
console.log('createPool');

module.exports = mysql.createPool(option);