const BaseClass = require('./base.class');
const Page = require('./page.class');

class Book extends BaseClass{
  constructor(){
    super('books', 'id');
  }
}

module.exports = Book;