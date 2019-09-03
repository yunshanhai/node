var config = require('../config/mysql');
var db = require('./db');

/**
 * 根据id获取书的信息
 * @param {Object} id
 * @param {Object} callback
 */
exports.getBookById = function(id, callback){
  connection = db.getConnnection();
  var sql = "select * from books where id=?";
  connection.query(sql, [id], function(err, rows){
    error_throw(err);
    callback(rows);
  });
  connection.end();
}

/**
 * 新增一本书
 * @param {Object} book
 * @param {Object} callback
 */
exports.addBook = function(book, callback){
  //TODO 对字段的有效性进行校验，尤其theme、basebook_id
  connection = db.getConnnection();
  var sql = "insert into books (theme, basebook_id, name, author, show_page_num, fascicule, fascicule_type, created_at, updated_at)"
    + " values(?,?,?,?,?,?,?,?,?)";
  connection.query(sql, book, function(err, result){
    error_throw(err);
    callback(result)
  });
  connection.end();
}

/**
 * 根据规格尺寸获取页码相关信息
 * @param {int} basebook_id
 * @param {Object} callback
 */
exports.getBasepages = function(basebook_id, callback){
  connection = db.getConnnection();
  var sql = "select * from basepages where basebook_id=? and enable=1 order by sort";
  connection.query(sql, [basebook_id], function(err, rows){
    error_throw(err);
    callback(rows);
  });
  connection.end();
}

/**
 * 获取书的页面信息
 * @param {Object} book_id
 * @param {Object} callback
 */
exports.getPages = function(book_id, callback){
  connection = db.getConnnection();
  var sql = "select * from pages where book_id=? order by page_type,page_group,sort";
  connection.query(sql, [book_id], function(err, rows){
    error_throw(err);
    callback(rows);
  });
  connection.end();
}

/**
 * 添加页面
 * @param {Array} page
 * @param {function} callback
 */
exports.addPage = function(page, callback){
  connection = db.getConnnection();
  var sql = "insert into pages(book_id,page_type,page_group,flag,background,elements,sort) values(?,?,?,?,?,?,?)";
  connection.query(sql, page, function(err, result){
    error_throw(err);
    callback(result);
  });
  connection.end();
}

/**
 * 根据id更新页面的background和elements
 * @param {Number} id
 * @param {Object} page
 * @param {function} callback
 */
exports.updatePageById = function(id, page, callback){
  connection = db.getConnnection();
  var sql = "update pages set background=?,elements=? where id=?";
  connection.query(sql, [
      page.background,
      page.elements,
      id
    ], function(err, result){
    error_throw(err);
    callback(result);
  });
  connection.end();
}

function error_throw(err){
  if(err){
    console.log('[SELECT ERROR] - ',err.message);
    throw err;
    return false;
  }
}