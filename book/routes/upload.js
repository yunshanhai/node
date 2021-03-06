var express = require('express');
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var db = require('../data/db');
var images = require('images');

var router = express.Router();
var upload = multer({dest: './public/upload/'})

router.post('/image', upload.single('photos'), (req, res) => {
  // { fieldname: 'photos',
  //   originalname: 'psb (4).jpg',
  //   encoding: '7bit',
  //   mimetype: 'image/jpeg',
  //   destination: './public/upload/',
  //   filename: '4707564669b99ca5e5d76ccc0aef8224',
  //   path: 'public\\upload\\4707564669b99ca5e5d76ccc0aef8224',
  //   size: 697283 }
  
  let pathObj = path.parse(req.file.originalname);
  const movedir = './public/upload/'+req.body.book_id + '/'
  const movepath = movedir + req.file.filename + pathObj.ext
  
  //书籍目录不存在则创建
  if(!fs.existsSync(movedir)){
    fs.mkdirSync(movedir);
  }
  
  async function run(){
    new Promise((resolve, reject)=>{
      
      fs.rename(req.file.path, movepath, function(err){
        if(err){
          reject('重命名失败');
        }
        
        //生成缩略图
        images(movepath)
          .size(200)
          .save(movedir + req.file.filename + '_s' + pathObj.ext, {
            quality:60
          });
        images(movepath)
          .size(600)
          .save(movedir + req.file.filename + '_m' + pathObj.ext, {
            quality:50
          });
        images(movepath)
          .size(1280)
          .save(movedir + req.file.filename + '_l' + pathObj.ext, {
            quality:50
          });
        
        resolve();
      });
    });
    
    let name = pathObj.name;
    if(name.length>32){
      name = name.substr(0,32);
    }
    let url = `/upload/${req.body.book_id}/${req.file.filename + pathObj.ext}`; 
    
    let result = await new Promise((resolve, reject) => {
      $sql = `insert into images (url,name,mime,size,width,height,book_id,user_id,type)
              values (?,?,?,?,?,?,?,?,?)`;
      $sqlParams = [url,name,pathObj.ext,req.file.size,0,0,req.body.book_id,0,req.body.type];
      db.query($sql, $sqlParams, (err, result)=>{
        console.log(err);
        console.log(result);
        if(err){
          reject('数据库异常');
        }
        resolve({
          id: result.insertId,
          url,
          name,
          mime: pathObj.ext,
          size: req.file.size,
          width: 0,
          height: 0,
          book_id: req.body.book_id,
          user_id: 0,
          type: req.body.type
        });
      });
    });
    
    return result;
  }
  
  run().then((resolve)=>{
    res.send({
      statusCode: 200,
      message: 'success',
      data: resolve,
      index: req.body.index
    })
    .end();
  }).catch((err)=>{
    res.send({
      statusCode: 500,
      message: err
    })
    .end();
  });
  
});

module.exports = router;