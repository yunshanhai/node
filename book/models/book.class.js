const BaseClass = require('./base.class');
const Page = require('./page.class');
const Basepage = require('./basepage.class');
const Basepage2 = require('./basepage2.class');

class Book extends BaseClass{
  constructor(){
    super('books', 'id');
  }
  
  async getBook(id){
    let book = await this.find(id);
    if(book){
      let basepage = new Basepage();
      let basepages = await basepage.getBasepagesByBasebookId(book.basebook_id);
      book.basepages = {};
      for(let i in basepages){
        let basepage = basepages[i];
        // pagetype.total_page = 0;
        book.basepages[basepage.page_type] = basepage;
      }
      
      let basepage2 = new Basepage2();
      book.basepage2 = basepage2.all();
      
      let page = new Page();
      let pages = await page.getPagesByBookId(book.id);
      book.pages = pages;
      return book;
    }
    
    return null;
  }
}

module.exports = Book;