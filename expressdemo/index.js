var express = require('express')
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = new express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));//不设置也行，默认从views目录加载
app.set('view engine', 'ejs');
// app.use中间件
app.use(express.static('public'));
// app.use('/static', express.static('public'));//配置虚拟目录的静态目录
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.send('你好 express');
});

//动态路由
app.get('/news/:id', function(req, res){
  //获取动态传值
  console.log(req.params.id);
  //获取get传值
  console.log(req.query)
  res.render('news', {
    id: req.params.id,
    key: req.query.key
  });
  // res.send('动态参数:id的值为' + req.params.id + "\n" + 'get参数key的值为' + req.query.key);
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/dologin', function(req, res){
  console.log(req.body);
  res.send({statusCode: 200, message: 'success'});
});

app.listen(3000, '127.0.0.1');