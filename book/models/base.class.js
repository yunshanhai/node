class BaseClass{
  constructor(table, pk) {
      this.table = table;
      this.pk = pk;
      
      this.db = require('../data/db');
  }
  
  query(sql, params){
    return new Promise((resolve, reject)=>{
      this.db.query(sql, params, (err, result)=>{
        if(err){
          reject(err);
        }
        resolve(result);
      });
    });
  }
  
  all(){
    return new Promise((resolve, reject)=>{
      this.db.query(`select * from ${this.table}`, (err, rows)=>{
        if(err){
          reject(err);
        }
        
        resolve(rows);
      });
    });
  }
  
  find(id){
    return new Promise((resolve, reject)=>{
      this.db.query(`select * from ${this.table} where ${this.pk}=?`, id, (err, rows)=>{
        if(err){
          reject(err);
        }
        if(rows.length>0){
          resolve(rows[0]);
        }
        resolve(null);
      });
    });
  }
}

module.exports = BaseClass;