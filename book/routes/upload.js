var express = require('express');
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var db = require('../data/db');

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
  async function run(){
    await new Promise((resolve, reject)=>{
      fs.rename(req.file.path, req.file.path + pathObj.ext, function(err){
        if(err){
          reject('重命名失败');
        }
        resolve();
      });
    });
    
    let name = pathObj.name;
    if(name.length>32){
      name = name.substr(0,32);
    }
    let url = '/upload/' + req.file.filename + pathObj.ext;
    
    let result = await new Promise((resolve, reject) => {
      $sql = `insert into images (url,name,mime,size,width,height,book_id,user_id)
              values (?,?,?,?,?,?,?,?)`;
      $sqlParams = [url,name,pathObj.ext,req.file.size,0,0,req.body.book_id,0];
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
          user_id: 0
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