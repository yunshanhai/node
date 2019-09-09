export default class {
  constructor(name, age){
    this.name = name;
    this.age = age;
  }
  
  show(){
    console.log(`我叫${this.name},年龄${this.age}`)
  }
};