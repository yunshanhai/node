const BaseClass = require('./base.class');

class Basebinding extends BaseClass{
  constructor(){
    super('basebindings', 'id');
  }
}

module.exports = Basebinding;