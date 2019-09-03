var data = {
  config : config,
  // book: {},
  // printType: ''
};

var app;
var id = location.href.getQuery('id');
var type = parseInt(location.href.getQuery('type'));
var view = location.href.getQuery('view');

if(id==null || !config.views.includes(view)){
  layer.msg('参数错误');
}else if(view === 'print' && !config.types.includes(type)){
  layer.msg('打印参数错误');
}else{
  // data.printType = type;
  
  var clientWidth = document.getElementById('app').clientWidth;
  
  $.getJSON('/book/' + id, function(json) {
    
    if(json.statusCode !== 200){
      layer.msg(json.message);
      data.book = null;
    }else{
      let book = json.data;
      if(book.pages.length>0){
        //当前选中页索引
        let index = -1;
        let lastIndex = book.pages.length - 1;
        while(index < lastIndex){
          index++;
          if(book.pages[index].is_deleted===0){
            break;
          }
        }
        data.currentPageIndex = index;
        
        for(let i in book.pages){
          let page = book.pages[i];
          //解压元素和背景
          page.background = JSON.parse(page.background);
          page.elements = JSON.parse(page.elements);
        }
        
        //生成页面类型的像素大小，视图大小
        for(let i in book.basepages){
          let basepage = book.basepages[i];
          basepage.width_px = mm2px(basepage.width, config.dpi);
          basepage.height_px = mm2px(basepage.height, config.dpi);
          
          if(view === 'print'){
            basepage.width_view = basepage.width + 'mm';
            basepage.height_view = basepage.height + 'mm';
          }else{
            basepage.width_view = clientWidth + 'px';
            basepage.height_view = (basepage.height / basepage.width * clientWidth) + 'px';
          }
        }
      }
      
      data.book = book;
    }
    
    app = new Vue({
      el: '#app',
      data: data,
      computed: {
        viewPages: function(){
          if(view === 'print'){
            return this.book.pages.filter(function(page){
              return page.page_type === type;
            });
          }
          return this.book.pages;
        }
      },
      watch: {
        
      },
      created: function () {
        // console.log('---created');
      },
      // mounted: mounted,
      beforeUpdate: function(){
        // console.log('---beforeUpdate');
      },
      updated: function(){
        // console.log('---updated');
      },
      methods: {
        getSize: function(page, height){
          let pagetype = this.book.pagetypes[page.page_type];
          
          let pageSize = {
            width: pagetype.width_px / pagetype.height_px * config.pageContainerHeight,
            height: config.pageContainerHeight,
            viewbox_value: '0 0 ' + pagetype.width_px + ' ' + pagetype.height_px
          };
          
          return pageSize;
        },
        
        //计算element的內圆属性
        elementCircle: function(element){
          return {
            cx: element.x + element.width / 2,
            cy: element.y + element.height / 2,
            r: (element.width > element.height) ? (element.height / 2) : (element.width / 2)
          };
        },
        //计算element的内椭圆属性
        elementEllipse: function(element){
          return {
            cx: element.x + element.width / 2,
            cy: element.y + element.height / 2,
            rx: element.width / 2,
            ry: element.height / 2
          };
        },
        elementTransform: function(element){
          if(element.angle !== 0){
            let cx = element.x + element.width / 2;
            let cy = element.y + element.height / 2;
            return "rotate({0}, {1} {2})".format(element.angle, cx, cy);
          }
          return "";
        }
        
      },
      filters: {
        
      }
    })
    // initBook(book)
  })
}