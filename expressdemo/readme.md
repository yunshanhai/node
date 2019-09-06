1.npm init --yes
2.npm install express --save
3.touch index.js
4.index.js加入

var express = require('express'); //引入
var app = new express();          //实例
app.get('/', function(req, res){  //添加路由
  res.send('你好 express');
});
app.listen(3000, '127.0.0.1');    //设置监听端口和域名

5.启动服务node index.js，在浏览器输入http://127.0.0.1:3000

6.安装ejs： npm install ejs --save
配置express的模板引擎
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
res.render('xx', {
  parameter1: 'xxx',
  ...
});

7.ejs引用公共部分
<%- include public/header.ejs %>

8.app.use('/static', express.static('public'));//配置虚拟目录的静态目录

9.应用中间件
app.use(function(req, res, next){
  
  next();//继续向下匹配
});

10.安装body-parser：npm install body-parser --save
使用：
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
获取表单数据
req.body.xxx

body-parser只能解析普通数据，不能解析上传的文件

11.安装cookie-parser：npm install cookie-parser --save

12.安装session: npm install express-session --save

12.安装multiparty: npm install multiparty --save