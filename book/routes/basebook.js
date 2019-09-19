var express = require('express');
// var bodyParser = require('body-parser');
var router = express.Router();
const Basebook = require('../models/basebook.class');
const bookConfig = require('../config/book');

/**
 * url /basebook/list
 * 获取全部可用basebook
 */
router.get('/list', async (req, res) => {
  
  const basebookModek = new Basebook();
  $sql = "select * from basebooks where enable=1 order by sort";
  basebookModek.query($sql)
    .then(result=>{
      res.send({
        statusCode: 200,
        message: 'success',
        data: result,
        crafts: bookConfig.crafts
      })
      .end();
    })
    .catch(err=>{
      res.send({
        statusCode: 500,
        message: 'internal error'
      })
      .end();
    });
});

module.exports = router;