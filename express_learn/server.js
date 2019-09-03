//https://blog.csdn.net/hust_cxl/article/details/79929093 教程学习
var express = require('express');
var mysql = require('mysql');
var app = express();

var connection = mysql.createConnection({
  // host: '127.0.0.1',
  // port: '3306',
  // user: 'root',
  // password: 'root',
  // database: 'symfony'
  
  host: '192.168.31.31',
  port: '3301',
  user: 'xiaofandiy',
  password: 'xiaofandiy',
  database: 'xiaofandiy'
});

connection.connect();

var sql = "SELECT left(create_time, 10) date, COUNT(id) amount FROM tbl_new_user " +
"WHERE source_id in ('xiaofanbp','xiaofantk','xiaofanks','xiaofanbn','xiaofanup') " +
"and create_time>='2019-07-01' and create_time<'2019-08-01' " +
"GROUP BY left(create_time, 10) ORDER BY date";

connection.query(sql,function(err,result){
  if(err){
    console.log('[SELECT ERROR]:', err.message);
    return;
  }
  str = JSON.stringify(result);
  console.log(result);
});
// var sql_add = 'insert into test(name) values(?)';
// var sql_add_params = ['test'];
// connection.query(sql_add, sql_add_params, function(err, result){
//   if(err){
//     console.log('[INSERT ERROR]:', err.message);
//     return;
//   }
//   console.log('insert id:', result);
// });
// 
// var sql = 'select * from test';
// var str = '';
// connection.query(sql, function(err, result){
//   if(err){
//     console.log('[SELECT ERROR]:', err.message);
//     return;
//   }
//   str = JSON.stringify(result);
//   console.log(result);
// });

app.get('/', function(req, res){
    res.send(JSON.stringify(req)); 
});


connection.end();
app.listen(3000,function(){
    console.log("Server running at 3000 port");
});