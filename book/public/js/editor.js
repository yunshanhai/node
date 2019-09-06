var editor = {
  width: 500,
  height: 300
};

//阻止右键菜单
window.onload = function(){
  document.oncontextmenu = function(){
    event.preventDefault();
  }
}

var data = {
  config : config,
  basebooks: [],
  basepages: [],
  newBook: {
    theme: 0,
    basebook_id: 0,
    name: '',
    author: '',
    show_page_num: 1,
    fascicule: 0,
    fascicule_type: 0
  },
  createBookMsg: '',
  // book: {},
  currentPageIndex: -1,
  //currentPage
  //currentPageSize
  //viewport
  currentPageModified: false,
  currentElementIndex: -1,
  //currentElement
  menu: {
    showList: false,
    currentList: 0,
    viewGrid: true
  },
  editor: editor,
  //当前选中的页面类型
  currentPagetype: 0,
  currentPagegroup: 0,
  addPageMsg: '',
  
  createPagePanelLayerIndex: 0,
  pagesContainerLeft: 0,
  pagesContainerMove: false,
  //是否生成手机端显示二维码
  initQrcode: false,
  //当前选中的工具
  currentSelectedTools: 'pointer',
  //剪切或复制的元素
  sourceElement: null,
  selectObj: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  contextMenu: {
    show: false,
    //右键菜单相对于浏览器的左和上
    left: 0,
    top: 0,
    //右键菜单在canvas_editor中的坐标
    x: 0,
    y: 0,
    //剪切或复制
    isCut: false,
    source: null //page or element
  },
  //0：书籍，1：页面，2：元素
  rightPanelIndex: 0 ,
  pickColorFlag: null,
  fileImages: [],
  uploaded: 0,
  images: []
};
var app;

var id = location.href.getQuery('id');
if(id!=null){
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
          
          checkElement(page.elements)
          // //计算封面、内页、内页前置、后置当前的页面数，已删除不计
          // if(page.is_deleted===0){
          //   book.basepages[page.page_type].total_page++;
          // }
        }
      }
      
      //生成页面类型的像素大小
      for(let i in book.basepages){
        let basepage = book.basepages[i];
        basepage.width_px = mm2px(basepage.width, config.dpi);
        basepage.height_px = mm2px(basepage.height, config.dpi);
      }
      
      data.book = book;
    }
    
    app = new Vue({
      el: '#app',
      data: data,
      computed: {
        //当前页数据
        currentPage: function(){
          if(this.book==null || this.book.pages.length === 0){
            return null;
          }
          
          return this.book.pages[this.currentPageIndex];
        },
        
        //当前选中的元素
        currentElement: function(){
          if(this.currentElementIndex > -1){
            return this.currentPage.elements[this.currentElementIndex];
          }
          return null;
        },
        //最后一个元素（新建的元素）
        lastElement: function(){
          if(this.currentPage.elements.length > 0){
            return this.currentPage.elements[this.currentPage.elements.length - 1];
          }
          return null;
        },
        lastElementIndex: function(){
          return this.currentPage.elements.length - 1;
        },
        //拖动层对象
        dragObj: function(){
          let obj = {
            panel: { 
              x: 0, 
              y: 0, 
              width: 0, 
              height: 0,
              tl: { x: 0, y: 0 },
              tr: { x:0, y: 0 },
              bl: { x:0, y:0 },
              br: { x:0, y:0 },
              center: {x: 0, y: 0}
            },
            line: { x1: 0, y1: 0, x2: 0, y2: 0},
            circle:{ cx:0, cy: 0},
            t: { x: 0, y: 0 },
            tr: { x: 0, y: 0 },
            r: { x: 0, y: 0 },
            br: { x: 0, y: 0 },
            b: { x: 0, y: 0 },
            bl: { x: 0, y: 0 },
            l: { x: 0, y: 0 },
            tl: { x: 0, y: 0 },
            //
            transform: ''
          };
          if(this.currentElementIndex>-1){
            let element = this.currentElement;
            let halfDragPointSize = this.config.dragPointSize / 2;
  
            obj.panel.x = element.x;
            obj.panel.y = element.y;
            obj.panel.width = element.width;
            obj.panel.height = element.height;
            obj.panel.tl.x = element.x;
            obj.panel.tl.y = element.y;
            obj.panel.tr.x = element.x + element.width;
            obj.panel.tr.y = element.y;
            obj.panel.bl.x = element.x;
            obj.panel.bl.y = element.y + element.height;
            obj.panel.br.x = obj.panel.tr.x;
            obj.panel.br.y = obj.panel.bl.y;
            obj.panel.center.x = element.x + element.width / 2;
            obj.panel.center.y = element.y + element.height / 2;
            
            obj.line.x1 = obj.panel.center.x;
            obj.line.y1 = element.y - this.config.dragPointSize * 3;
            obj.line.x2 = obj.line.x1;
            obj.line.y2 = element.y;
            
            obj.circle.cx = obj.line.x1;
            obj.circle.cy = obj.line.y1;
            
            obj.tl.x = element.x - halfDragPointSize;
            obj.tl.y = element.y - halfDragPointSize;
            
            obj.t.x = obj.panel.center.x - halfDragPointSize;
            obj.t.y = obj.tl.y;
            
            obj.tr.x = element.x + element.width - halfDragPointSize;
            obj.tr.y = obj.t.y;
            
            obj.r.x = obj.tr.x;
            obj.r.y = obj.panel.center.y - halfDragPointSize;
            
            obj.br.x = obj.tr.x;
            obj.br.y = obj.tr.y + element.height;
            
            obj.b.x = obj.t.x;
            obj.b.y = obj.br.y;
            
            obj.bl.x = obj.tl.x;
            obj.bl.y = obj.br.y;
            
            obj.l.x = obj.tl.x;
            obj.l.y = obj.r.y;
            
            if(element.angle !== 0){
              obj.transform += "rotate({0}, {1} {2})".format(element.angle, obj.panel.center.x, obj.panel.center.y);
            }
          }
          return obj;
        },
        // selectObj: function(){
        //   let obj = {
        //     x: 0,
        //     y: 0,
        //     width: 0,
        //     height: 0
        //   };
        //   
        //   return obj;
        // },
        //当前页像素尺寸：宽高和出血线
        currentPageSize: function(){
          
          let basepage = null;
          
          if(this.currentPage != null){
            basepage = this.book.basepages[this.currentPage.page_type];
          }else{
            basepage = this.book.basepages[1];
          }
          
          let viewbox_height = basepage.height_px;
          let viewbox_width = this.editor.width / this.editor.height * viewbox_height;
          let scale = this.editor.width / viewbox_width;
          let translate_x =(this.editor.width - basepage.width_px * scale) / 2;
          //让页面在画布居中，需要将viewbox的x值往0的左方移动
          let viewbox_x = -1 * (viewbox_width - basepage.width_px) / 2;
          
          let pageSize = {
            width: basepage.width_px,
            height: basepage.height_px,
            bleed_top: mm2px(basepage.bleed_top, config.dpi),
            bleed_right: basepage.width_px - mm2px(basepage.bleed_right, config.dpi),
            bleed_bottom: basepage.height_px - mm2px(basepage.bleed_bottom, config.dpi),
            bleed_left: mm2px(basepage.bleed_left, config.dpi),
            single_page: basepage.single_page,
            viewbox_width: viewbox_width,
            viewbox_height: viewbox_height,
            viewbox_x: viewbox_x,
            viewbox_value: '{0} 0 {1} {2}'.format(viewbox_x, viewbox_width, viewbox_height),
            // show_width: this.editor.width / this.editor.height * height,
            // show_height: this.editor.height,
            translate_value: "translate("+translate_x+",0)"
          };
          
          return pageSize;
        },
        //出血线路径
        bleedPath: function(){
          let points = [
            [this.currentPageSize.bleed_left, this.currentPageSize.bleed_top],
            [this.currentPageSize.bleed_right, this.currentPageSize.bleed_top],
            [this.currentPageSize.bleed_right, this.currentPageSize.bleed_bottom],
            [this.currentPageSize.bleed_left, this.currentPageSize.bleed_bottom]
          ]
          let line = d3.svg.line()
            .x(function(d) {
              return d[0]
            })
            .y(function(d) {
              return d[1]
            })
            .interpolate('linear-closed');
          return line(points);
        },
        //中线
        midPath: function(){
          let points = [
            [this.currentPageSize.width / 2, this.currentPageSize.bleed_top],
            [this.currentPageSize.width / 2, this.currentPageSize.bleed_bottom]
          ];
          let line = d3.svg.line()
            .x(function(d) {
              return d[0]
            })
            .y(function(d) {
              return d[1]
            })
            // .interpolate('linear-closed');
          return line(points);
        },
        //中线-上标记
        midPathTop: function(){
          let points = [
            [this.currentPageSize.width / 2, this.currentPageSize.bleed_top - 30],
            [this.currentPageSize.width / 2, this.currentPageSize.bleed_top + 30]
          ];
          let line = d3.svg.line()
            .x(function(d) {
              return d[0]
            })
            .y(function(d) {
              return d[1]
            })
            // .interpolate('linear-closed');
          return line(points);
        },
        //中线-下标记
        midPathBottom: function(){
          let points = [
            [this.currentPageSize.width / 2, this.currentPageSize.bleed_bottom - 30],
            [this.currentPageSize.width / 2, this.currentPageSize.bleed_bottom + 30]
          ];
          let line = d3.svg.line()
            .x(function(d) {
              return d[0]
            })
            .y(function(d) {
              return d[1]
            })
            // .interpolate('linear-closed');
          return line(points);
        },
        pagesContainerWidth: function(){
          
          let width = 0;
          for(let i in this.book.pages){
            let page = this.book.pages[i];
            let basepage = this.book.basepages[page.page_type];
            width += basepage.width_px / basepage.height_px * config.pageContainerHeight;
            width += 5;
          }
          
          return width;
        }
      },
      watch: {
        currentElement(newValue, oldValue){
          if(newValue==null || oldValue == null){
            return;
          }
          // console.log('currentElement');
          // console.log(newValue == oldValue);
          // console.log(oldValue);
        }
      },
      created: function () {
        // console.log('---created');
      },
      mounted: mounted,
      beforeUpdate: function(){
        // console.log('---beforeUpdate');
      },
      updated: function(){
        // console.log('---updated');
      },
      methods: {
        getSize: function(page, height){
          let basepage = this.book.basepages[page.page_type];
          
          let pageSize = {
            width: basepage.width_px / basepage.height_px * height,
            height: height,
            viewbox_value: '0 0 ' + basepage.width_px + ' ' + basepage.height_px
          };
          
          return pageSize;
        },
        //显示顶部菜单的下拉菜单
        showMenuList: function(index){
          event.stopPropagation()
          
          this.menu.currentList = index;
          if(arguments.length==2){
            this.menu.showList = arguments[1];
          }
        },
        //显示、隐藏网格
        viewGrid: function(){
          this.menu.viewGrid = !this.menu.viewGrid;
        },
        //新建book
        showCreateBookPanel: function(){
          new Promise(function(resolve, reject){
            if(app.basebooks.length == 0){
              $.ajax({
                url: '/basebook/list',
                dataType: 'json',
                success: function(result){
                  if(result.statusCode == 200){
                    app.basebooks = app.basebooks.concat(result.data);
                    resolve();
                  }else{
                    reject(result.message);
                  }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                  reject('未知错误');
                }
              })
            }else{
              resolve();
            }
          }).then(function(){
            this.createPagePanelLayerIndex = layer.open({
              title: "新建BOOK",
              type: 1,
              skin: 'layui-layer-rim', //加上边框
              area: '520px', //宽高
              shadeClose: true,
              content: $('#createBookPanel')
            });
          })
          .catch(function(err){
            layer.msg(err)
          });
          
        },
        createBook: function(){
          this.createBookMsg = '';
          
          if(this.newBook.basebook_id==0){
            this.createBookMsg = '请选择规格类型';
            return;
          }
          if(this.newBook.name == ''){
            this.createBookMsg = '请输入书名';
            return;
          }
          if(this.newBook.author == ''){
            this.createBookMsg = '请输入作者';
            return;
          }
          
          $.ajax({
            type: 'post',
            url: '/book/add',
            data: JSON.stringify(app.newBook),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(result){
              if(result.statusCode == 200){
                location.href = '/index.html?id=' + result.data;
              }
              // layer.close(app.createPagePanelLayerIndex);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
              app.createBookMsg = '创建失败，未知错误';
            }
          });
        },
        //显示新增页
        showCreatePagePanel: function(){
          this.createPagePanelLayerIndex = layer.open({
            title: "请选择新增页面类型",
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            area: '520px', //宽高
            shadeClose: true,
            content: $('#createPagePanel')
          });
        },
        //新增页
        createPage: function(){
          let total = this.getTotalPageNumByPageType(this.currentPagetype);
          let basepage = this.book.basepages[this.currentPagetype];
          
          if(total>=basepage.max_pages){
            this.addPageMsg = '{0}可添加{1}页，已添加{2}页，已达上限'.format(basepage.name, basepage.max_pages, total) ;
            return;
          }
          let page_group = this.currentPagetype === 2 ? this.currentPagegroup : 0;
          $.ajax({
            type: "post",
            url: "/book/page/add",
            data: JSON.stringify({
              book_id: this.book.id,
              page_type: this.currentPagetype,
              page_group: page_group,
              flag: 2,
              background: JSON.stringify({image: ""}),
              elements: JSON.stringify([]),
              sort: total
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function(res){
              if(res.statusCode === 200){
                layer.msg('新建成功');
                let page = {
                  id: res.data,
                  page_type: app.currentPagetype,
                  page_group: page_group,
                  flag: 2,
                  background: {image: ""},
                  elements: [],
                  sort: total,
                  is_deleted: 0
                };
                app.book.pages.push(page);
                
                app.currentPageIndex = app.book.pages.length - 1;
              }else{
                console.log(res);
              }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
              layer.msg('保存出错');
              console.log("请求数据异常：" + errorThrown);
            },
            complete: function(){
              layer.close(app.createPagePanelLayerIndex);
            }
          });
        },
        //根据页面类型获取相应的总页数
        getTotalPageNumByPageType(page_type){
          let total = 0;
          for(let i in this.book.pages){
            if(this.book.pages[i].page_type === page_type){
              total++;
            }
          }
          
          return total;
        },
        //保存
        save: function(){
          
        },
        //保存当前页
        savePage: function(pageIndex){
          let page = this.book.pages[pageIndex];
          $.ajax({
            type: "post",
            url: "/book/page/" + page.id,
            data: JSON.stringify({
              background: JSON.stringify(page.background),
              elements: JSON.stringify(page.elements)
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function(res){
              if(res.statusCode === 200){
                console.log('保存成功');
                this.currentPageModified = false;
              }else{
                console.log(res);
              }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
              layer.msg('保存出错');
              console.log("请求数据异常：" + errorThrown);
            }
          });
        },
        goPage: function(index){
          // cl('gopage')
          if(this.pagesContainerMove){
            this.pagesContainerMove = false;
            return;
          }
          if(this.currentPageIndex!=index){
            this.savePage(this.currentPageIndex);
            this.currentElementIndex = -1;
            this.currentPageIndex = index;
          }
        },
        //上一页
        prePage: function(){
          let index = this.currentPageIndex;
          while(index>0){
            index--;
            if(this.book.pages[index].is_deleted===0){
              break;
            }
          }
          if(this.currentPageIndex!=index){
            this.savePage(this.currentPageIndex);
            this.currentElementIndex = -1;
            this.currentPageIndex = index;
          }else{
            layer.msg('没有更多了');
          }
        },
        //下一页
        nextPage: function(){
          let index = this.currentPageIndex;
          let lastIndex = this.book.pages.length - 1;
          while(index < lastIndex){
            index++;
            if(this.book.pages[index].is_deleted===0){
              break;
            }
          }
          if(this.currentPageIndex!=index){
            this.savePage(this.currentPageIndex);
            this.currentElementIndex = -1;
            this.currentPageIndex = index;
          }else{
            layer.msg('没有更多了');
          }
        },
        //书脊区域，左线和右线
        spinePath: function(page, position = 'left'){
          let basepage = this.book.basepages[page.page_type];
          let spine_width = 360;
          let points = [
            [basepage.width_px / 2 + (position === 'left' ? 0 - spine_width / 2 : spine_width / 2), mm2px(basepage.bleed_top, config.dpi)],
            [basepage.width_px / 2 + (position === 'left' ? 0 - spine_width / 2 : spine_width / 2), basepage.height_px - mm2px(basepage.bleed_bottom, config.dpi)]
          ];
          
          let line = d3.svg.line()
            .x(function(d) {
              return d[0]
            })
            .y(function(d) {
              return d[1]
            })
            // .interpolate('linear-closed');
          return line(points);
        },
        //书脊
        spineBookName: function(page){
          
          // if(page.page_type === 0 || page.page_type === 1){
            let basepage = this.book.basepages[page.page_type];
          // }
          let fontSizePt = 36;
          let fontSize = px2px(fontSizePt, 72, 300);
          let x = basepage.width_px / 2;
          let y = basepage.height_px / 7;
          
          return {
            x: x,
            y: y,
            fontSize: fontSize,
            fontFamily: '微软雅黑'
          };
        },
        spineBookAuthor: function(page){
          
          // if(page.page_type === 0 || page.page_type === 1){
            let basepage = this.book.basepages[page.page_type];
          // }
          let fontSizePt = 16;
          let fontSize = px2px(fontSizePt, 72, 300);
          let x = basepage.width_px / 2;
          let y = basepage.height_px / 3 * 2;
          
          return {
            x: x,
            y: y,
            fontSize: fontSize,
            fontFamily: '微软雅黑'
          };
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
        },
        //点击选中当前元素
        selectElement: function(index, switchPanel = true){
          event.stopPropagation();
          this.currentElementIndex = index;
          if(switchPanel){
            this.rightPanelIndex = 2;
          }
        },
        //画布点击
        canvasClick: function(){
          event.stopPropagation();
          this.currentElementIndex = -1;
          this.rightPanelIndex = 1;
        },
        //打印预览
        preview: function(type){
          window.open('/preview.html?id={0}&view=print&type={1}'.format(this.book.id, type), '_blank')
        },
        //弹出手机端显示
        showQrcode: function(){
          if(!this.initQrcode){
            let url = location.origin + '/preview.html?id={0}&view=mobile'.format(this.book.id);
            new QRCode(document.getElementById("qrcodePanel"), url);
            this.initQrcode = true;
          }
          layer.open({
            title: "请使用手机扫描二维码查看",
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            // area: '520px', //宽高
            shadeClose: true,
            content: $('#qrcodePanel')
          });
        },
        //选中当前侧边栏工具
        selectTools: function(tools){
          this.currentSelectedTools = tools;
        },
        //复制元素
        copyElement: function(source){
          if(source === 'page'){
            return;
          }
          this.contextMenu.isCut = false;
          this.sourceElement = deepCopy(this.currentElement);
          this.currentElementIndex = -1;
        },
        //剪切元素
        cutElement: function(source){
          if(source === 'page'){
            return;
          }
          
          this.contextMenu.isCut = true;
          this.sourceElement = this.currentPage.elements.splice(this.currentElementIndex, 1)[0];
          this.currentElementIndex = -1;
        },
        //粘贴元素
        pasteElement: function(source){
          if(source === 'element'){
            return;
          }
          
          if(this.sourceElement == null){
            return;
          }
          
          if(source === 'page'){
            //右键菜单粘贴，使用右键菜单位置
            this.sourceElement.x = this.contextMenu.x - this.sourceElement.width / 2;
            this.sourceElement.y = this.contextMenu.y - this.sourceElement.height / 2 ;
          }else{
            //快捷键粘贴，使用元素原位置+错位
            this.sourceElement.x += 100;
            this.sourceElement.y += 100;
          }
          
          if(this.contextMenu.isCut){
            this.currentPage.elements.push(this.sourceElement);
            this.sourceElement = null;
          }else{
            this.currentPage.elements.push(deepCopy(this.sourceElement));
          }
          //粘贴后选中
          this.currentElementIndex = this.lastElementIndex;
        },
        //删除元素
        deleteElement: function(source){
          if(source === 'page'){
            return;
          }
          this.currentPage.elements.splice(this.currentElementIndex, 1);
          this.currentElementIndex = -1;
        },
        //置顶元素
        setElementTop: function(source){
          if(source === 'page'){
            return;
          }
          if(this.currentElementIndex !== this.lastElementIndex){
            this.currentPage.elements.push(this.currentPage.elements.splice(this.currentElementIndex, 1)[0]);
            this.currentElementIndex = this.lastElementIndex;
          }else{
            layer.msg('已经置于顶层');
          }
        },
        //置底元素
        setElementBack: function(source){
          if(source === 'page'){
            return;
          }
          
          if(this.currentElementIndex !== 0){
            this.currentPage.elements.unshift(this.currentPage.elements.splice(this.currentElementIndex, 1)[0]);
            this.currentElementIndex = 0;
          }else{
            layer.msg('已经置于底层');
          }
        },
        //置于上一层元素
        setElementUp: function(source){
          if(source === 'page'){
            return;
          }
          
          if(this.currentElementIndex !== this.lastElementIndex){
            [
              this.currentPage.elements[this.currentElementIndex+1], 
              this.currentPage.elements[this.currentElementIndex]] = [
              this.currentPage.elements[this.currentElementIndex], 
              this.currentPage.elements[this.currentElementIndex + 1]
            ];
            this.currentElementIndex++;
          }else{
            layer.msg('已经置于顶层');
          }
        },
        //置于下一层元素
        setElementDown: function(source){
          if(source === 'page'){
            return;
          }
          
          if(this.currentElementIndex !== 0){
            [
              this.currentPage.elements[this.currentElementIndex-1], 
              this.currentPage.elements[this.currentElementIndex]] = [
              this.currentPage.elements[this.currentElementIndex], 
              this.currentPage.elements[this.currentElementIndex - 1]
            ];
            this.currentElementIndex--;
          }else{
            layer.msg('已经置于底层');
          }
        },
        // addImage: function(){
        //   addImage(this.currentElement);
        // },
        showUploadPanel: function(){
          this.createPagePanelLayerIndex = layer.open({
            title: "上传图片",
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            // area: '520px', //宽高
            shadeClose: true,
            content: $('#uploadPanel')
          });
        },
        showSelectImagePanel: function(){
          this.createPagePanelLayerIndex = layer.open({
            title: "选择图片",
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            // area: '520px', //宽高
            shadeClose: true,
            content: $('#selectImagePanel')
          });
        },
        selectImage: function(image){
          if(this.currentElement.type == 'image'){
            this.currentElement.image.url = image.url;
          }else{
            this.currentElement.type = 'image';
            this.currentElement.is_fill = false;
            this.currentElement.image = {
              translate_x: 0,
              translate_y: 0,
              width_scale: 1,
              height_scale: 1,
              url: image.url
            }
          }
          
        },
        selectedRightPanel: function(index){
          this.rightPanelIndex = index;
        },
        fasciculeNumToText: function(num, fascicule_type){
          return fasciculeNumToText(num, fascicule_type);
        },
        uploadChanged: function(){
          this.fileImages.splice(0,this.fileImages.length);
          let input = document.getElementById('files');
          for(let i = 0; i < input.files.length; i++ ){
            this.fileImages.push(
              {
                url: getObjectURL(input.files[i]),
                status: 0
              }
            );
          }
        },
        upload: function(){
          this.uploaded = 0;
          let input = document.getElementById('files');
          if(input.files.length>0){
            for(let i=0; i<input.files.length; i++){
              let formData = new FormData();
              formData.append('photos', input.files[i]);
              formData.append('book_id', this.book.id);
              formData.append('index', i);
              $.ajax({
                  type: 'post',
                  url: '/upload/image',
                  data: formData,
                  contentType: false,
                  processData: false,
                  cache: false,
                  success: function(result) {
                      if(result.statusCode == 200){
                        app.images.push(result.data);
                        app.uploaded++;
                      }
                  },
                  error: function (XMLHttpRequest, textStatus, errorThrown) {
                      console.log(errorThrown);
                  }
              });
            }
          }
        }
      },
      filters: {
        
      }
    })
    // initBook(book)
  })
  
  $.getJSON('/book/' + id + '/images', function(result) {
    if(result.statusCode==200){
      for(let i = 0; i < result.data.length; i++){
        data.images.push(result.data[i]);
      }
    }else{
      console.log(result.message);
    }
  })
  // d3.select('body').on('click', function(){
  //   data.menu.showList = false;
  // })
  document.body.addEventListener("click",function(event){
    if(data.menu.showList)
      data.menu.showList = false;
      data.contextMenu.show = false;
  },true);
}



