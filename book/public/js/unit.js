/**
 * cl:consoel.log的函数缩写
 * @param {Object} message
 */
function cl(message) {
  console.log(message)
}

/**
 * 输出信息到页面 console message to page
 * @param {Object} message 要输出的信息
 * @param {Object} position 0为插入到body的最前面，1为append到body最后一个元素
 */
function c2p(message, position = 0) {
  var c2p

  if (position === 0) {
    c2p = d3.select('body').select('#c2p0')
    if (c2p.empty()) {
      c2p = d3.select('body').insert('div', '*:first-child').attr('id', 'c2p0')
    }

  } else {
    c2p = d3.select('body').select('#c2p1')
    if (c2p.empty()) {
      c2p = d3.select('body').append('div').attr('id', 'c2p1')
    }
  }
  c2p.append('p').text(message)
}

/**
 * '{0}{1}'.format('0', '1')
 * '{key0, key1}'.format({key0:'value0', key1:'value1'})
 * @param {Object} args
 */
String.prototype.format = function(args) {
  var result = this
  if (arguments.length > 0) {
    if (arguments.length == 1 && typeof(args) == "object") {
      for (var key in args) {
        if (args[key] != undefined) {
          var reg = new RegExp("({" + key + "})", "g")
          result = result.replace(reg, args[key])
        }
      }
    } else {
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] != undefined) {
          var reg = new RegExp("({)" + i + "(})", "g")
          result = result.replace(reg, arguments[i])
        }
      }
    }
  }
  return result
}

/**
 * 查询地址栏参数，location.href.getQuery('')
 * @param {String} name
 */
String.prototype.getQuery = function(name) {  
　　var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  
　　var r = this.substr(this.indexOf("?")+1).match(reg);  
　　if (r!=null) {
      return unescape(r[2]); 
    }
    return null;  
} 

String.prototype.colorHex = function(){
    var that = this;
    //十六进制颜色值的正则表达式
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是rgb颜色表示
    if (/^(rgb|RGB)/.test(that)) {
        var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        var strHex = "#";
        for (var i=0; i<aColor.length; i++) {
            var hex = Number(aColor[i]).toString(16);
            if (hex.length < 2) {
                hex = '0' + hex;    
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = that;    
        }
        return strHex;
    } else if (reg.test(that)) {
        var aNum = that.replace(/#/,"").split("");
        if (aNum.length === 6) {
            return that;    
        } else if(aNum.length === 3) {
            var numHex = "#";
            for (var i=0; i<aNum.length; i+=1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    }
    return that;
};

/**
 * 像素转毫米，默认96dpi
 * @param {Integer} px 像素
 * @param {Integer} dpi 
 */
function px2mm(px, dpi = 96) {
  return px * 25.4 / dpi
}

/**
 * 毫米转像素，默认96dpi
 * @param {Integer} px 像素
 * @param {Integer} dpi 
 */
function mm2px(mm, dpi = 96) {
  return mm / 25.4 * dpi
}

/**
 * 不同dpi下像素转换，默认300dpi的像素转化为96dpi的像素
 * @px {Integer} px 像素
 * @fromDpi {Integer} 默认300dpi
 * @toDpi {Integer} 默认96dpi
 */
function px2px(px, fromDpi = 300, toDpi = 96) {
  return px * toDpi / fromDpi
}

/**
 * 计算一个点相对于中心点顺时针方向的角度0°-360°，12点方向为0°
 * @param {Object} centerX 中心坐标x
 * @param {Object} centerY 中心坐标y
 * @param {Object} moveX 要计算的点x坐标
 * @param {Object} moveY 要计算的点y坐标
 */
function getAngle(centerX, centerY, moveX, moveY) {
  
  var x = Math.abs(centerX - moveX);
  var y = Math.abs(centerY - moveY);
  var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  var cos = y / z;
  var radina = Math.acos(cos); //用反三角函数求弧度
  var angle = Math.floor(180 / (Math.PI / radina)); //将弧度转换成角度

  if (moveX > centerX && moveY > centerY) { //鼠标在第四象限
    angle = 180 - angle;
  }

  if (moveX == centerX && moveY > centerY) { //鼠标在y轴负方向上
    angle = 180;
  }

  if (moveX > centerX && moveY == centerY) { //鼠标在x轴正方向上
    angle = 90;
  }

  if (moveX < centerX && moveY > centerY) { //鼠标在第三象限
    angle = 180 + angle;
  }

  if (moveX < centerX && moveY == centerY) { //鼠标在x轴负方向
    angle = 270;
  }

  if (moveX < centerX && moveY < centerY) { //鼠标在第二象限
    angle = 360 - angle;
  }

  return angle;
}

function deepCopy(obj){
    if(typeof obj != 'object' || obj == null){
        return obj;
    }
    
    var newobj = {};
    for (var attr in obj) {
        newobj[attr] = deepCopy(obj[attr]);
    }
    return newobj;
}



function fasciculeNumToText(num, fascicule_type){
  num = parseInt(num);
  fascicule_type = parseInt(fascicule_type);
  
  if(num>10 || num < 1){
    return "";
  }
  if(fascicule_type<0 || fascicule_type > 3){
    return "";
  }
  
  let fasciculeNum = {
    type0 : ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
    type1 : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    type2 : ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'],
    type3 : ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ']
  };
  
  return fasciculeNum['type' + fascicule_type][num - 1];
}


function getObjectURL(file) {
  var url = null ;
  if (window.createObjectURL!=undefined) { // basic
      url = window.createObjectURL(file) ;
  } else if (window.URL!=undefined) { // mozilla(firefox)
      url = window.URL.createObjectURL(file) ;
  } else if (window.webkitURL!=undefined) { // webkit or chrome
      url = window.webkitURL.createObjectURL(file) ;
  }
  return url ;
}