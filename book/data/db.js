var mysql = require('mysql');
var option = require('../config/mysql');

exports.getConnnection = function(){
  var connection = mysql.createConnection(option);
  return connection;
}