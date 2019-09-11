var express = require('express');
// var bodyParser = require('body-parser');
var router = express.Router();
var db = require('../data/db');

/**
 * url /basebinding/list
 * 获取全部可用basebinding
 */
router.get('/list', (req, res) => {
  $sql = "select * from basebindings where enable=1 order by sort";
  db.query($sql, (err, result) => {
    if(err){
      res.send({
        statusCode: 500,
        message: 'internal error'
      })
      .end();
    }
    
    res.send({
      statusCode: 200,
      message: 'success',
      data: result
    })
    .end();
  });
});

module.exports = router;