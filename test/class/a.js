const Base = require('./Base');

class A extends Base{
  constructor(){
    super();
    this.name = 'a';
    this.age = 18;
  }
}

module.exports = A;