var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var dataBook = require('../data/book');
var db = require('../data/db');
const Book = require('../models/book.class');

/**
 * url /book/0
 * 获取书籍信息
 */
router.get('/:id', function(req, res, next) {
  var book_id = req.params.id;
  dataBook.getBookById(book_id, function(books) {
    if (books.length > 0) {
      let book = books[0];
      book.basepages = {};
      dataBook.getBasepages(book.basebook_id, function(basepages) {
        for (let i in basepages) {
          basepage = basepages[i];
          // pagetype.total_page = 0;
          book.basepages[basepage.page_type] = basepage;
        }

        dataBook.getPages(book_id, function(pages) {
          book.pages = pages;
          res.send({
            statusCode: 200,
            message: 'ok',
            data: book
          });
        });

      });
    } else {
      res.send({
        statusCode: 404,
        message: '404 Not Found'
      });
    }
  });
});

router.get('/new/:id', function(req, res) {
  const book_id = req.params.id;

  const book = new Book();
  book.getBook(book_id)
    .then((book) => {
      if(book){
        res.send({
          statusCode: 200,
          message: 'ok',
          data: book
        }).end();
      }else{
        res.send({
          statusCode: 404,
          message: '404 Not Found'
        }).end();
      }
      
    })
    .catch((err) => {
      res.send({
          statusCode: 500,
          message: 'internal error'
        })
        .end();
    });
});

/**
 * url /book/add
 * 创建书
 * @param {Object} req
 * @param {Object} res
 */
router.post('/add', function(req, res) {
  //todo 验证字段有效性

  let timestamp = new Date().format('yyyy-MM-dd hh:mm:ss');
  let sqlParams = [
    req.body.theme,
    req.body.basebook_id,
    req.body.name,
    req.body.author,
    req.body.show_page_num,
    req.body.fascicule,
    req.body.fascicule_type,
    timestamp,
    timestamp
  ];

  new Promise((resolve, reject) => {
      $sql =
        `insert into books 
      (theme, basebook_id, name, author, show_page_num, fascicule, fascicule_type, created_at, updated_at)
      values(?,?,?,?,?,?,?,?,?)`;

      db.query($sql, sqlParams, function(err, result) {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(result);
      });
    }).then((result) => {
      res.send({
          statusCode: 200,
          message: 'success',
          data: result.insertId
        })
        .end();
    })
    .catch((err) => {
      res.send({
          statusCode: 500,
          message: 'internal error'
        })
        .end();
    });

  // dataBook.addBook(book, function(result){
  //   res.send({
  //     statusCode: 200,
  //     message: 'success',
  //     data: result.insertId
  //   })
  // });
});

/**
 * url /book/update
 * 修改书籍信息
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
router.post('/update', function(req, res, next) {

});

router.post('/page/add', function(req, res, next) {
  console.log(req.body);
  var page = [
    req.body.book_id,
    req.body.page_type,
    req.body.page_group,
    req.body.flag,
    // JSON.stringify(req.body.background), 
    // JSON.stringify(req.body.elements)
    req.body.background,
    req.body.elements,
    req.body.sort
  ];
  dataBook.addPage(page, function(result) {
    // console.log(result);
    // OkPacket {
    //   fieldCount: 0,
    //   affectedRows: 1,
    //   insertId: 1,
    //   serverStatus: 2,
    //   warningCount: 0,
    //   message: '',
    //   protocol41: true,
    //   changedRows: 0 }
    res.send({
      statusCode: 200,
      message: 'success',
      data: result.insertId
    })
  });
});

router.post('/page/:id', function(req, res, next) {
  var page = {
    background: req.body.background,
    elements: req.body.elements
  };

  dataBook.updatePageById(req.params.id, page, function(result) {
    if (result.affectedRows === 1) {
      res.send({
        statusCode: 200,
        message: 'success'
      });
    } else {
      res.send({
        statusCode: 404,
        message: '404 Not Found'
      });
    }
  });
});

router.get('/:id/images', (req, res) => {
  $sql = "select * from images where book_id=?";
  db.query($sql, [req.params.id], (err, result) => {
    if (err) {
      res.send({
        statusCode: 500,
        message: 'internal error'
      });
    }
    res.send({
      statusCode: 200,
      message: 'ok',
      data: result
    })
  });
});

module.exports = router;
