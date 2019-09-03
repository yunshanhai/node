var http = require('http');
var url = require('url');
/**
 * @param {Object} req
 * @param {Object} res
 */
http.createServer(function(req, res){
  
  console.log('请求地址：' + req.url);
  
  res.writeHead(200, {
    "Content-Type": "text/html; charset='utf-8'"
  });
  
  let urlObj = url.parse(req.url, true);
  console.log(urlObj);
  
  res.write('Hello World');
  res.write('你好Nodejs Supervisor');
  
  res.end();
  
  console.log('响应完成');
  
}).listen(8001);
console.log('服务器创建成功');

//node server.js运行,然后再浏览器输入http://localhost:8001/

//打开终端,输入node直接回车会进入node解析模式,可以像在浏览器的Console窗口一样编程,例如:
// $ node
// > let url = require('url');
// > console.log(url);
// { Url: [Function: Url],
//   parse: [Function: urlParse],
//   resolve: [Function: urlResolve],
//   resolveObject: [Function: urlResolveObject],
//   format: [Function: urlFormat],
//   URL: [Function: URL],
//   URLSearchParams: [Function: URLSearchParams],
//   domainToASCII: [Function: domainToASCII],
//   domainToUnicode: [Function: domainToUnicode],
//   pathToFileURL: [Function: pathToFileURL],
//   fileURLToPath: [Function: fileURLToPath] }
// 
// > url.parse('http://www.baidu.com?search=123');
// Url {
//   protocol: 'http:',
//   slashes: true,
//   auth: null,
//   host: 'www.baidu.com',
//   port: null,
//   hostname: 'www.baidu.com',
//   hash: null,
//   search: '?search=123',
//   query: 'search=123',
//   pathname: '/',
//   path: '/?search=123',
//   href: 'http://www.baidu.com/?search=123' }
// 
// > let urlObj = url.parse('http://www.baidu.com/search?key=美女', true)
// > urlObj
// Url {
//   protocol: 'http:',
//   slashes: true,
//   auth: null,
//   host: 'www.baidu.com',
//   port: null,
//   hostname: 'www.baidu.com',
//   hash: null,
//   search: '?key=美女',
//   query: [Object: null prototype] { key: '美女' },
//   pathname: '/search',
//   path: '/search?key=美女',
//   href: 'http://www.baidu.com/search?key=美女' }
// 
// > urlObj.query.key
// '美女'

//安装supervisor
// npm -g install supervisor
// 使用supervisor xx.js代替node xx.js,nodejs代码修改后会自动重启

//npm init
//npm init --yes 在当前目录(强制)生成package.json

// https://www.npmjs.com npm包网站

//npm install xx@version
//npm uninstall xx
//npm info xx 查看模块的信息
//npm list 查看当前目录下安装的模块
//npm install xx --save 安装并写入到package.json的dependencies
//npm install xx --save-dev 安装并写入到package.json的devDependencies

// "dependencies":{
//   "jquery": "1.8.2",      //什么都不加，表示取固定当前版本
//   "ejs": "^2.3.4",        //^表示第一位版本号不变，后两位取最新
//   "express": "~4.13.3",   //~表示前两位不变，最后一个取最新
//   "formidable": "*1.0.17" //*表示全部取最新
// }