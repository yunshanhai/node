var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var dataBook = require('../data/book');
var db = require('../data/db');
const Book = require('../models/book.class');
let Page = require('../models/page.class');
const Basebook = require('../models/basebook.class');
const bookConfig = require('../config/book');


/**
 * url /book/0
 * 获取书籍信息
 */
router.get('/:id', async function(req, res, next) {
  var book_id = req.params.id;

  const bookModel = new Book();
  let book = await bookModel.find(book_id);
  if (book) {

    const basebookModel = new Basebook();
    let basebook = await basebookModel.find(book.basebook_id);
    book.basebook = basebook;
    // book.basebook.spine_widths = bookConfig.spine_widths;
    // book.basebook.spine_base_width = bookConfig.spine_base_width;
    book.crafts = bookConfig.getCraftsByIsCross(basebook.double_page);

    book.pagetypes = bookConfig.pagetypes;

    const pageModel = new Page();
    let page = new Page();
    let pages = await pageModel.getPagesByBookId(book.id);
    book.pages = pages;

    res.send({
      statusCode: 200,
      message: 'ok',
      data: book
    });

  } else {

    res.send({
      statusCode: 404,
      message: '404 Not Found'
    });

  }
});

/**
 * url /book/add
 * 创建书
 * @param {Object} req
 * @param {Object} res
 */
router.post('/add', async function(req, res) {
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
    req.body.craft_id,
    req.body.paper_id,
    req.body.other_thickness,
    timestamp,
    timestamp
  ];

  let sql =
    `insert into books
    (theme, basebook_id, name, author, show_page_num, fascicule, fascicule_type, craft_id, paper_id, other_thickness, created_at, updated_at)
    values(?,?,?,?,?,?,?,?,?,?,?,?)`;

  const bookModel = new Book();
  bookModel.query(sql, sqlParams)
    .then((result) => {
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
