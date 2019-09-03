let mounted = function() {
  console.log('---mounted');
  let that = this;
  
  //选择层
  let dragSelectCount = 0;
  let startX = 0;
  let startY = 0;
  let dragSelectPanel = d3.behavior.drag()
    .on('dragstart', function(){
      dragSelectCount = 0;
    })
    .on('drag', function(){
      if(dragSelectCount === 0){
        startX = d3.event.x;
        startY = d3.event.y;
        
        if(that.currentSelectedTools === 'select'){//初始选择框
          that.selectObj.width = 0;
          that.selectObj.height = 0;
          that.selectObj.x = startX;
          that.selectObj.y = startY;
        } else if(that.currentSelectedTools === 'rect' || that.currentSelectedTools === 'circle' || that.currentSelectedTools === 'ellipse'){//初始创建元素
          let element = createElement();
          element.x = startX;
          element.y = startY;
          that.currentPage.elements.push(element);
        }
        
      }else{
        let width = d3.event.x - startX;
        let height = d3.event.y - startY;
        if(width<0){
          width = 0;
        }
        if(height<0){
          height = 0;
        }
        
        if(that.currentSelectedTools === 'select'){//选择框
          that.selectObj.width = width;
          that.selectObj.height = height;
        } else if (that.currentSelectedTools === 'rect' || that.currentSelectedTools === 'circle' || that.currentSelectedTools === 'ellipse'){
          that.lastElement.width = width;
          that.lastElement.height = height;
        }
      }
      
      dragSelectCount++;
      // if(that.currentSelectedTools !== 'select'){
        
      // }
    })
    .on('dragend', function(){
      if(that.currentSelectedTools === 'select'){//选择框
        that.selectObj.width = 0;
        that.selectObj.height = 0;
      } else if (that.currentSelectedTools === 'rect' || that.currentSelectedTools === 'circle' || that.currentSelectedTools === 'ellipse'){
        if(that.lastElement.width < 10){
          //太小的形状判定为误加，移除
          that.currentPage.elements.pop(that.lastElement);
        }else{
          that.currentElementIndex = that.lastElementIndex;
        }
      }
      
      that.currentSelectedTools = 'pointer';
    });
  d3.select('#selectPanel')
    .on('click', function(){
      event.stopPropagation();
    })
    .call(dragSelectPanel);
  
  //拖动层
  let dragPanel = d3.behavior.drag()
    .origin(function(d) {
      return that.dragObj.panel.tl;
    })
    .on("drag", function(d) {
      let element = that.currentElement;
      let dx = Math.round(d3.event.dx);
      let dy = Math.round(d3.event.dy);
      
      element.x += dx;
      element.y += dy;
      
      if (element.hasOwnProperty('image') && element.image != null) {
        element.image.x += dx;
        element.image.y += dy;
      }
    });
  // let dragPanelElement = d3.select('#dragPanel');
  d3.select('#dragPanel')
    .on('click', function() {
      event.stopPropagation();
    })
    .on('mousedown', function(){
      if(d3.event.button === 2){
        that.contextMenu.show = true;
        that.contextMenu.left = d3.event.clientX;
        that.contextMenu.top = d3.event.clientY;
        that.contextMenu.source = 'element';
      }
      event.stopPropagation();
    })
    .call(dragPanel);
  
  d3.select('#canvas_page').on('mousedown', function(){
    if(d3.event.button === 2){
      that.contextMenu.show = true;
      that.contextMenu.left = d3.event.clientX;
      that.contextMenu.top = d3.event.clientY;
      
      //计算右键点击点在svg中的坐标
      let target;
      if(event.target.tagName != 'svg'){
        target = event.target.ownerSVGElement.ownerSVGElement;
      }else{
        target = event.target.ownerSVGElement;
      }
      let x = event.offsetX, 
          y = event.offsetY,
          width = target.width.baseVal.value,
          height = target.height.baseVal.value;
      if(target.viewBox.baseVal.width !== 0){
        x = x * target.viewBox.baseVal.width / width + target.viewBox.baseVal.x;
      }
      if(target.viewBox.baseVal.height !== 0){
        y = y * target.viewBox.baseVal.height / height + target.viewBox.baseVal.y;
      }
      that.contextMenu.x = x;
      that.contextMenu.y = y;
      
      that.contextMenu.source = 'page';
    }
  })

  //角度控制点
  let rotateFlag = null;
  let dragCount = 0;
  let dragCircle = d3.behavior.drag()
    // .origin(function(d) {
    //   return {x: that.dragObj.circle.cx, y: that.dragObj.circle.cy };
    // })
    .on("dragstart",function(){
      
    })
    .on("drag", function(d) {
      
      if(dragCount > 0){
        let element = that.currentElement;
        
        let angle = getAngle(that.dragObj.panel.center.x, that.dragObj.panel.center.y, d3.event.x, d3.event.y);
        cl(d3.event);
        cl("中心点:{0},{1};移动点：{2},{3};角度：{4};偏移：{5},{6}".format(
          that.dragObj.panel.center.x,
          that.dragObj.panel.center.y,
          d3.event.x,
          d3.event.y,
          angle,
          d3.event.x,
          d3.event.y)
        );
        
        if(rotateFlag){
          clearTimeout(rotateFlag);
        }
        rotateFlag = setTimeout(()=>{
          element.angle = angle;
        },10);
      }
      
      dragCount++;
    })
    .on('dragend', function(){
      dragCount = 0;
    });
  d3.select('#dragCircle')
    .on('click',function() {
      event.stopPropagation();
    })
    .call(dragCircle);

  //左上拖动点
  let dragTL = d3.behavior.drag()
    .origin(function(d) {
      return that.dragObj.panel.tl;
    })
    .on("drag", function(d) {
      let element = that.currentElement;
      let dx = Math.round(d3.event.dx);
      let dy = Math.round(d3.event.dy);
      
      element.x += dx;
      element.y += dy;
      element.width -= dx;
      element.height -= dy;
    });
  d3.select('#dragPointTL')
    .on('click',function() {
      event.stopPropagation();
    })
    .call(dragTL);
  
  //上拖动点
  let dragT = d3.behavior.drag()
    .origin(function(d) {
      return that.dragObj.panel.tl;
    })
    .on("drag", function(d) {
      let element = that.currentElement;
      let dy = Math.round(d3.event.dy);
      
      element.y += dy;
      element.height -= dy;
      
      if (element.hasOwnProperty('image') && element.image != null) {
        element.image.y += dy;
        element.image.height -= dy;
      }
    });
  d3.select('#dragPointT')
    .on('click',function() {
      event.stopPropagation();
    })
    .call(dragT);
  
  //右上拖动点
  let dragTR = d3.behavior.drag()
    .origin(function(d) {
      return that.dragObj.panel.tl;
    })
    .on("drag", function(d) {
      let element = that.currentElement;
      let dx = Math.round(d3.event.dx);
      let dy = Math.round(d3.event.dy);
      
      element.y += dy;
      element.width += dx;
      element.height -= dy;
      
    });
  d3.select('#dragPointTR')
    .on('click',function() {
      event.stopPropagation();
    })
    .call(dragTR);
  
  //右拖动点
  let dragR = d3.behavior.drag()
    .origin(function(d) {
      return that.dragObj.panel.tl;
    })
    .on("drag", function(d) {
      let element = that.currentElement;
      let dx = Math.round(d3.event.dx);
      
      element.width += dx;
    });
  d3.select('#dragPointR')
    .on('click',function() {
      event.stopPropagation();
    })
    .call(dragR);
  
  //右下拖动点
  let dragBR = d3.behavior.drag()
    .origin(function(d) {
      return that.dragObj.panel.tl;
    })
    .on("drag", function(d) {
      let element = that.currentElement;
      let dx = Math.round(d3.event.dx);
      let dy = Math.round(d3.event.dy);
      
      element.width += dx;
      element.height += dy;
    });
  d3.select('#dragPointBR')
    .on('click',function() {
      event.stopPropagation();
    })
    .call(dragBR);
  
  //下拖动点
  let dragB = d3.behavior.drag()
    .origin(function(d) {
      return that.dragObj.panel.tl;
    })
    .on("drag", function(d) {
      let element = that.currentElement;
      let dy = Math.round(d3.event.dy);
      
      element.height += dy;
      
      if (element.hasOwnProperty('image') && element.image != null) {
        element.image.height += dy;
      }
    });
  d3.select('#dragPointB')
    .on('click',function() {
      event.stopPropagation();
    })
    .call(dragB);
  
  //左下拖动点
  let dragBL = d3.behavior.drag()
    .origin(function(d) {
      return that.dragObj.panel.tl;
    })
    .on("drag", function(d) {
      let element = that.currentElement;
      let dx = Math.round(d3.event.dx);
      let dy = Math.round(d3.event.dy);
      
      element.x += dx;
      element.width -= dx;
      element.height += dy;
    });
  d3.select('#dragPointBL')
    .on('click',function() {
      event.stopPropagation();
    })
    .call(dragBL);
  
  //左拖动点
  let dragL = d3.behavior.drag()
    .origin(function(d) {
      return that.dragObj.panel.tl;
    })
    .on("drag", function(d) {
      let element = that.currentElement;
      let dx = Math.round(d3.event.dx);
      
      element.x += dx;
      element.width -= dx;
    });
  
  //底部页面左右拖拽
  let dragPageContainerMove = false;
  d3.select('#dragPointL')
    .on('click',function() {
      event.stopPropagation();
    })
    .call(dragL);
  
  let pagesContainerLeftLimit = 0
  let dragPagesContainer = d3.behavior.drag()
    .on("dragstart", function(){
      pagesContainerLeftLimit = that.pagesContainerWidth - that.editor.width
    })
    .on("drag", function(d){
      if(d3.event.dx!=0){
        that.pagesContainerMove = true;
      }
      
      //页面区域超出显示区域才可拖动
      if(pagesContainerLeftLimit>0){
        
        if(that.pagesContainerLeft + d3.event.dx >= 0){//向右移动到left值超过0时设置为0
          that.pagesContainerLeft = 0;
        }else if(that.pagesContainerLeft + d3.event.dx + pagesContainerLeftLimit < 0 ){ //向左移，最右侧完全漏出后，left设为pagesContainerLeftLimit的负数
          that.pagesContainerLeft = (-pagesContainerLeftLimit)
        }else{//其他情况正常移动
           that.pagesContainerLeft += d3.event.dx;
        }
      }
      
    });
    
  d3.select('#pagesContainer')
  .call(dragPagesContainer);
  
  document.onkeydown = function(){
    if(app.currentPageIndex > -1){
      if(event.ctrlKey){
        if(app.currentElementIndex > -1){
          if(event.keyCode === 67){
            // cl('复制元素');
            app.copyElement('hotkey');
          }else if(event.keyCode === 88){
            // cl('剪切');
            app.cutElement('hotkey');
          }else if(event.shiftKey){
            if(event.keyCode === 38){
              // cl('置顶')
              app.setElementTop('hotkey');
            }else if(event.keyCode === 40){
              // cl('置底')
              app.setElementBack('hotkey');
            }
          }else if(event.keyCode === 38){
            // cl('置上')
            app.setElementUp('hotkey');
          }else if(event.keyCode === 40){
            // cl('置下')
            app.setElementDown('hotkey');
          }
        }
        
        if(event.keyCode === 86){
          // cl('粘贴');
          app.pasteElement('hotkey');
        }
      }else if(event.keyCode === 46 && app.currentElementIndex > -1){
        // cl('删除')
        app.deleteElement('hotkey');
      }
    }
    
  }
}
