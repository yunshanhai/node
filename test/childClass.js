const BaseClass = require('./baseClass');

class Child extends BaseClass{
  cc(){
    console.log('ccc');
  }
}

let cc = new Child();
cc.cc();
cc.bb();