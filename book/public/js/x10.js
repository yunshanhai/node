var data = {
  config : config,
  // book: {},
};

var app;
var type = parseInt(location.href.getQuery('type'));
var view = location.href.getQuery('view');
var clientWidth = document.getElementById('app').clientWidth;

function dealLayer(layer, type){
  let element_width_px = layer.location.refwidth * layer.location.wscale;
  let element = {
    x: layer.location.refwidth * layer.location.xscale,
    y: layer.location.refwidth * layer.location.yscale,
    width: element_width_px,
    height: element_width_px * layer.location.hwscale,
    shape: 'rect',
    type: 'image',
    angle: Math.abs(parseInt(layer.location.rotation)),
    image: {
      url: dealLayerImage(layer, type),
      translate_x: 0,
      translate_y: 0,
      width_scale: 1,
      height_scale: 1
    },
    rect: {
      rx: 0,
      ry: 0
    },
    is_stroke: false,
    stroke: 'white',
    stroke_width: 1,
    stroke_opacity: 1,
    stroke_dasharray: '',
    is_fill: true,
    fill: 'none',
    fill_opacity: 1,
    display: true,
    fixed: layer.location.fixed == 'false' ? false : true,
    sort: layer.index
  }
  
  return element;
}

function dealLayerImage(layer, type){
  switch (type){
    case 'decorate_layer':
      return layer.image.property.url.replace('com://studio_photo/hudiejingzhuangjiniance12cunshukuan/', '/x10/themes/');
    case 'photo_layer':
      return layer.photo.image.property.url.replace('prj://', '/x10/projects/project1/photos/') + '_l';
    case 'symbol_layer':
      return layer.image.property.url.replace('prj://', '/x10/globalres/assets/');
  }
}

function dealTextLayer(layer, refwidth){
  let element_width_px = refwidth * layer.location.wscale;
  let element = {
    x: refwidth * layer.location.xscale,
    y: refwidth * layer.location.yscale,
    width: element_width_px,
    height: element_width_px * layer.location.hwscale,
    // shape: 'rect',
    type: 'text',
    angle: Math.abs(parseInt(layer.location.rotation)),
    text: {
      content: layer.property.content,
      mode: layer.property.textModel,//text|label
      fontSize: px2px(layer.property.size * layer.property.scaleX, 72, 300),
      lineHeight: layer.property.lineHeight,
      fontFamily: layer.property.font,
      color: layer.property.color,
      fontWeight: layer.property.bold,
      letterSpacing: layer.property.charSpacing,
      fontStyle: layer.property.italic ? 'italic' : 'normal',
      textDecoration: layer.property.underline ? 'underline' : 'none',
      align: layer.property.align,
      scaleX: layer.property.scaleX,
      scaleY: layer.property.scaleY
    },
    display: layer.visible,
    fixed: layer.location.fixed == 'false' ? false : true,
    sort: layer.index
  }
  
  if(element.text.mode === 'text'){
    //text
    let textBox = new TextBox(element.x, element.y, element.width, element.height, {
      fontSize: element.text.fontSize,
      lineHeight: element.text.lineHeight,
      fontFamily: element.text.fontFamily,
      fontWeight: element.text.fontWeight,
      letterSpacing: element.text.letterSpacing,
      textIndext: false,
      align: element.text.align
    });
    element.text.lines = textBox.getLines(element.text.content);
    element.text.drawBox = textBox.getDrawBox();
    // console.log(element.height + ':' + textBox.getHeight());
  }else{
    //label
    let textBox = new TextBox(element.x, element.y, element.width, element.height, {
      fontSize: element.text.fontSize,
      lineHeight: element.text.lineHeight,
      fontFamily: element.text.fontFamily,
      fontWeight: element.text.fontWeight,
      letterSpacing: element.text.letterSpacing,
      textIndext: false,
      align: element.text.align
    });
    
    element.text.lines = textBox.getLines(element.text.content);
    element.text.drawBox = textBox.getDrawBox();
    // console.log(element.height + ':' + textBox.getHeight());
    // element.height = textBox.getHeight();
  }
  
  return element;
}


$.getJSON('/x10/projects/project1/project.json', function(json) {
  // cl(json);
  let book = {
    basepages: {
    },
    pages: []
  };
  
  let project = json.project;
  
  //------------------------------------封面---------------------------------------
  
  for (let p in project.doc.album.outer_pages.page){
    let outer_page = project.doc.album.outer_pages.page[p];
    if(p == 0){
      //页面尺寸
      let page_width_px = outer_page.location.refwidth * outer_page.location.wscale;
      let basepage = {
        page_type: 1,
        name: outer_page.property.caption,
        width: px2mm(page_width_px, 300),
        height: px2mm(page_width_px * outer_page.location.hwscale, 300),
        bleed_top: outer_page.property.top_bleed,
        bleed_right: outer_page.property.right_bleed,
        bleed_bottom: outer_page.property.bottom_bleed,
        bleed_left: outer_page.property.left_bleed,
        single_page: project.doc.info.compose_type == 2 ? 0 : 1, //compose_type为2是双页设计，对应single_page为0
        min_pages: 1,
        max_pages: 1,
        width_px: page_width_px,
        height_px: page_width_px * outer_page.location.hwscale
      };
      
      if(view === 'print'){
        basepage.width_view = basepage.width + 'mm';
        basepage.height_view = basepage.height + 'mm';
      }else{
        basepage.width_view = clientWidth + 'px';
        basepage.height_view = (basepage.height / basepage.width * clientWidth) + 'px';
      }
      
      book.basepages['1'] = basepage;
    }
    
    //页面
    let page = {
      id: 0,
      page_type: 1,
      page_group: 0,
      flag: 2,
      background: {
        image: outer_page.background.background_layer.image.property.url.replace('com://studio_photo/hudiejingzhuangjiniance12cunshukuan', '/x10/themes')
      },
      elements: [],
      is_deleted: 0,
      sort: 0
    };
    
    //装饰
    for(let i in outer_page.contents.decorate_layer){
      let layer = outer_page.contents.decorate_layer[i];
      let element = dealLayer(layer, 'decorate_layer')
      page.elements.push(element);
    }
    
    //照片
    for(let i in outer_page.contents.photo_layer){
      let layer = outer_page.contents.photo_layer[i];
      let element = dealLayer(layer, 'photo_layer');
      page.elements.push(element);
    }
    
    //条形码、二维码
    for(let i in outer_page.contents.symbol_layer){
      let layer = outer_page.contents.symbol_layer[i];
      let element = dealLayer(layer, 'symbol_layer')
      page.elements.push(element);
    }
    
    //文字
    for(let i in outer_page.contents.text_layer){
      
    }
    
    book.pages.push(page);
  }
  
  //------------------------------------内页---------------------------------------
  for (let p in project.doc.album.inner_pages.page){
    let inner_page = project.doc.album.inner_pages.page[p];
    if(p == 0){
      //页面尺寸
      let page_width_px = inner_page.location.refwidth * inner_page.location.wscale;
      let basepage = {
        page_type: 1,
        name: inner_page.property.caption,
        width: px2mm(page_width_px, 300),
        height: px2mm(page_width_px * inner_page.location.hwscale, 300),
        bleed_top: inner_page.property.top_bleed,
        bleed_right: inner_page.property.right_bleed,
        bleed_bottom: inner_page.property.bottom_bleed,
        bleed_left: inner_page.property.left_bleed,
        single_page: project.doc.info.compose_type == 2 ? 0 : 1, //compose_type为2是双页设计，对应single_page为0
        min_pages: 1,
        max_pages: 1,
        width_px: page_width_px,
        height_px: page_width_px * inner_page.location.hwscale
      };
      
      if(view === 'print'){
        basepage.width_view = basepage.width + 'mm';
        basepage.height_view = basepage.height + 'mm';
      }else{
        basepage.width_view = clientWidth + 'px';
        basepage.height_view = (basepage.height / basepage.width * clientWidth) + 'px';
      }
      
      book.basepages['2'] = basepage;
    }
    
    //页面
    let page = {
      id: 0,
      page_type: 2,
      page_group: 1,
      flag: 2,
      background: {
        image: inner_page.background.background_layer.image.property.url.replace('com://studio_photo/hudiejingzhuangjiniance12cunshukuan', '/x10/themes')
      },
      elements: [],
      is_deleted: 0,
      sort: parseInt(p)
    };
    
    //装饰
    if(inner_page.contents.decorate_layer instanceof Array){
      for(let i in inner_page.contents.decorate_layer){
        let layer = inner_page.contents.decorate_layer[i];
        let element = dealLayer(layer, 'decorate_layer')
        page.elements.push(element);
      }
    }else if(inner_page.contents.decorate_layer != null){
      let layer = inner_page.contents.decorate_layer;
      let element = dealLayer(layer, 'decorate_layer')
      page.elements.push(element);
    }
    
    
    //照片
    for(let i in inner_page.contents.photo_layer){
      let layer = inner_page.contents.photo_layer[i];
      let element = dealLayer(layer, 'photo_layer');
      page.elements.push(element);
    }
    
    let page_width_px = book.basepages[page.page_type].width_px;
    //文字
    for(let i in inner_page.contents.text_layer){
      let layer = inner_page.contents.text_layer[i];
      
      let element = dealTextLayer(layer, page_width_px);
      page.elements.push(element);
    }
    
    page.elements.sort(function(a, b){
      return a.sort - b.sort;
    });
    
    book.pages.push(page);
  }
  
  cl(book);
  data.book = book;
  
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
        let transform = "";
        if(element.angle !== 0){
          let cx = element.x + element.width / 2;
          let cy = element.y + element.height / 2;
          transform = "rotate({0}, {1} {2})".format(element.angle, cx, cy);
        }
        
        // if(element.type === 'text' && element.text.mode === 'label'){
        //   let originX = element.text.drawBox.x + element.text.drawBox.width / 2;
        //   let originY = element.text.drawBox.y + element.text.drawBox.height / 2;
        //   transform += " translate(-{0},-{1}) scale({2}, {3})".format(originX, originY, 2, 2);
        //   // transform += " translate(-{0},-{1}) scale({2}, {3})".format(originX, originY, element.text.scaleX, element.text.scaleY);
        //   // transform += " translate(-{0},-{1})".format(originX, originY);
        // }
        
        return transform;
      }
      
    },
    filters: {
      
    }
  })
  // initBook(book)
})