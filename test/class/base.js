class Base{
  constructor() {
      // this.name = 'base';
  }
}

Base.prototype.age = 1;

Base.prototype.showName = function(){
  console.log(this.name);
}

module.exports = Base;