const BaseClass = require('./base.class');

class Basebook extends BaseClass{
  constructor(){
    super('basebooks', 'id');
  }
}

module.exports = Basebook;