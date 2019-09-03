function createElement(){
  let element = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    type: 'shape',
    shape: app.currentSelectedTools,
    is_stroke: true,
    stroke: config.themeColor,
    stroke_width: 1,
    stroke_dasharray: '',
    stroke_opacity: 1,
    is_fill: true,
    fill: config.themeColor,
    fill_opacity: 1,
    angle: 0,
    display: true,
    fixed: false,
    rect: {
      rx: 0,
      ry: 0
    }
  };
  return element;
}

function addImage(element){
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

function checkElement(elements){
  for(let i in elements){
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