const BaseClass = require('./base.class');

class Page extends BaseClass{
  constructor(){
    super('pages', 'id');
  }
  
  getPagesByBookId(book_id){
    let sql = `select * from ${this.tableName} where book_id=? order by page_type,page_group,sort`;
    return this.query(sql, book_id);
  }
}

module.exports = Page;