const BaseClass = require('./base.class');

class Basepage extends BaseClass{
  constructor(){
    super('basepages', 'id');
  }
  
  getBasepagesByBasebookId(basebook_id){
    let sql = `select * from ${this.tableName} where basebook_id=? and enable=1 order by sort`;
    return this.query(sql, basebook_id);
  }
}

module.exports = Basepage;