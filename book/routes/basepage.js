var express = require('express');
// var bodyParser = require('body-parser');
var router = express.Router();
var db = require('../data/db');

/**
 * url /basepage/list
 * 获取全部可用basebook
 */
router.get('/list', (req, res) => {
  $sql = "select * from basepages where enable=1 order by basebook_id, sort";
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