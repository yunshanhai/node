function createElement() {
  let element = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    type: 'shape',
    shape: app.currentSelectedTools,
    is_stroke: config.shape.is_stroke,
    stroke: config.shape.color,
    stroke_width: config.shape.stroke_width,
    stroke_dasharray: '',
    stroke_opacity: 100,
    is_fill: config.shape.is_fill,
    fill: config.shape.color,
    fill_opacity: 100,
    angle: 0,
    display: true,
    fixed: false,
    rect: {
      r: 0,
      is_square: false
    }
  };
  return element;
}

function createTextElement() {
  let element = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    // shape: 'rect',
    type: 'text',
    angle: 0,
    text: {
      content: 0,
      mode: layer.property.textModel, //text|label
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
}

function addImage(element) {
  element.type = 'image';
  element.is_fill = false;
  element.image = {
    translate_x: 0,
    translate_y: 0,
    width_scale: 1,
    height_scale: 1,
    url: '/images/kc.jpg'
  }
}

function checkElement(elements) {
  for (let i in elements) {
    let element = elements[i];

    //元素类型 shape/image/decorate/

    // if(!element.hasOwnProperty('type')){
    //   if(element.image != null){
    //     element.type = 'image';
    //     let image = {
    //       translate_x: 0,
    //       translate_y: 0,
    //       width_scale: 1,
    //       height_scale: 1,
    //       url: element.image.url
    //     }
    //     delete element.image;
    //     element.image = image;
    //   }else{
    //     element.type = 'shape';
    //   }
    // }
    // 
    // if(!element.hasOwnProperty('stroke_opacity')){
    //   element.stroke_opacity = 1;
    // }
    // 
    // if(!element.hasOwnProperty('fill')){
    //   element.fill = config.themeColor;
    // }
    // 
    // //是否显示填充
    // if(!element.hasOwnProperty('is_fill')){
    //   element.is_fill = true;
    // }
    // 
    // if(!element.hasOwnProperty('fill_opacity')){
    //   element.fill_opacity = 1;
    // }
    // 
    // //是否显示边框
    // if(!element.hasOwnProperty('is_stroke')){
    //   element.is_stroke = true;
    // }
    // 
    // if(!element.hasOwnProperty('rect')){
    //   element.rect = {
    //     rx: 0,
    //     ry: 0
    //   }
    // }
    // 
    // if(!element.hasOwnProperty('display')){
    //   element.display = true;
    // }else{
    //   element.display = true;
    // }
    // 
    // if(!element.hasOwnProperty('fixed')){
    //   element.fixed = true;
    // }else{
    //   if(element.fixed === 1){
    //     element.fixed = true;
    //   }else{
    //     element.fixed = false;
    //   }
    // }
    // 
    // 
    // if(element.hasOwnProperty('image') && element.image != null && Object.keys(element.image).length == 0){
    //   element.image = null;
    // }
  }
}

function getInnerPageCount(pages) {
  let count = 0;
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].page_type > 1) {
      count++;
    }
  }
  return count;
}

function getCraftById(crafts, id) {
  for (let i = 0; i < crafts.length; i++) {
    if (crafts[i].id === id) {
      return crafts[i];
    }
  }
  return null;
}

function getPaperById(papers, id) {
  for (let i = 0; i < papers.length; i++) {
    if (papers[i].id === id) {
      return papers[i];
    }
  }
  return null;
}

//书脊特定宽度计算：1.没有特定宽度返回实际值；2.有特定宽度，返回最合适的值；3.超过了特定宽度最大值，返回实际值
function getSpineWidth(spineWidths, spineWidth) {
  //没有特定宽度，直接返回实际值
  if (spineWidths == null) {
    return spineWidth;
  }

  let i = 0;
  for (i; i < spineWidths.length; i++) {
    if (spineWidth <= spineWidths[i]) {
      break;
    }
  }

  //超过了特定宽度最大值，返回实际值
  if (i == spineWidths.length) {
    return spineWidth;
  }
  return spineWidths[i];
}

function calcPageSize(page, book) {
  let size = {
    width: 0,
    height: 0
  };

  let basebook = book.basebook;

  switch (page.page_type) {
    case 0:
      {
        //护封
        let spineWidth = 0;
        let innerPageCount = getInnerPageCount(book.pages);
        if (book.craft.has_spine) {
          //内页所有页厚度
          let innerPageThickness = book.paper.thickness * innerPageCount;
          //书脊宽度=内页所有页厚度+工艺容差厚度+本书的容差厚度
          spineWidth = innerPageThickness + book.craft.other_thickness + book.other_thickness;
          //书脊特定宽度区间处理
          spineWidth = getSpineWidth(book.craft.spineWidths, spineWidth);

        }
        //护封实际宽度=内页宽度+护封扩展宽度+书脊宽度
        size.width = basebook.width + basebook.jacket_ext_width + spineWidth;
        size.height = basebook.height + basebook.jacket_ext_height;
        size.spine_width = spineWidth;
        break;
      }
    case 1:
      {
        //封面
        let spineWidth = 0;
        let innerPageCount = getInnerPageCount(book.pages);
        if (book.craft.has_spine) {
          //内页所有页厚度
          let innerPageThickness = book.paper.thickness * innerPageCount;
          //书脊宽度=内页所有页厚度+工艺容差厚度+本书的容差厚度
          spineWidth = innerPageThickness + book.craft.other_thickness + book.other_thickness;
          //书脊特定宽度区间处理
          spineWidth = getSpineWidth(book.craft.spineWidths, spineWidth);

        }
        //护封实际宽度=内页宽度+护封扩展宽度+书脊宽度
        size.width = basebook.width + basebook.cover_ext_width + spineWidth;
        size.height = basebook.height + basebook.cover_ext_height;
        size.spine_width = spineWidth;
        break;
      }
    case 2:
      //内页，如果不重写就从basebook继承，如果重写就用自己的
      if (page.resize === 1) {
        size.width = page.resize_width;
        size.height = page.resize_height;
      } else {
        size.width = basebook.width;
        size.height = basebook.height;
      }
      break;
    case 3:
      //自定义页
      size.width = page.width;
      size.height = page.height;
      break;
  }
  
  //统一加出血线宽度
  size.width += book.basebook.bleed * 2
  size.height +=  + book.basebook.bleed * 2
  
  //
  size.width_px = mm2px(size.width, config.dpi);
  size.height_px = mm2px(size.height, config.dpi);
  if(size.hasOwnProperty('spine_width')){
    size.spine_width_px = mm2px(size.spine_width, config.dpi);
  }
  
  if(page.hasOwnProperty('size')){
    page.size.width = size.width;
    page.size.height = size.height;
    page.size.width_px = size.width_px;
    page.size.height_px = size.height_px;
    if(size.hasOwnProperty('spine_width')){
      page.size.spine_width = size.spine_width;
      page.size.spine_width_px = size.spine_width_px;
    }
  }else{
    page.size = size;
  }
  
  // return size;
}
