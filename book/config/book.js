//纸张
const tbz_128g = {
    id: 1,
    name: '128g铜版纸',
    key: 'tbz_128g',
    thickness: 0.12,
    enable: 1,
    sort: 1
  },
  tzz_128g = {
    id: 2,
    name: '128g特种纸',
    key: 'tzz_128g',
    thickness: 0.105,
    enable: 1,
    sort: 2
  },
  tbz_200g = {
    id: 3,
    name: '200g铜版纸',
    key: 'tbz_200g',
    thickness: 0.13,
    enable: 1,
    sort: 3
  },
  tbz_200g_dbycz = {
    id: 4,
    name: '200g铜版纸对裱有衬纸',
    key: 'tbz_200g_dbycz',
    thickness: 1.5,
    enable: 1,
    sort: 4
  },
  tbz_200g_dbwcz = {
    id: 5,
    name: '200g铜版纸对裱无衬纸',
    key: 'tbz_200g_dbwcz',
    thickness: 0.14,
    enable: 1,
    sort: 5
  };

//工艺
const crafts = [{
    //书脊宽度计算模式：只根据内页厚度
    id: 1,
    name: '简装软皮', //给用户显示的名字
    craft: '软皮胶装', //工艺名字
    is_crosspage: 0, //跨页不可选，单页可选
    has_spine: 1, //有书脊
    spine_base_width: 12, //书脊最少宽度，低于此宽度不在书脊上显示内容
    other_thickness: 0, //其他容差厚度
    papers: [tbz_128g, tzz_128g], //可选纸张类型
    has_jacket: 0, //不能有护封
    sort: 1, //显示顺序
    enable: 1, //是否启用
  },
  {
    //书脊宽度计算模式：
    id: 2,
    name: '精装硬壳', //给用户显示的名字
    craft: '硬壳胶装', //工艺名字
    is_crosspage: 0, //跨页不可选，单页可选
    has_spine: 1, //有书脊
    spine_base_width: 12, //书脊最少宽度，低于此宽度不在书脊上显示内容
    other_thickness: 0, //其他容差厚度
    papers: [tbz_128g, tzz_128g, tbz_200g], //可选纸张类型
    has_jacket: 1, //可以有护封
    sort: 2, //显示顺序
    enable: 1, //是否启用
  },
  {
    id: 3,
    name: '精装对裱册', //给用户显示的名字
    craft: '硬壳对裱', //工艺名字
    is_crosspage: 1, //跨页和单页都可选
    has_spine: 1, //有书脊
    spine_base_width: 12, //书脊最少宽度，低于此宽度不在书脊上显示内容
    spines: [12, 24, 36], //书脊宽度区间
    other_thickness: 0, //其他容差厚度
    papers: [tbz_200g_dbycz, tbz_200g_dbwcz], //可选纸张类型
    has_jacket: 1, //可以有护封
    sort: 3, //显示顺序
    enable: 1, //是否启用
  }
];

const getCraftsByIsCrosspage = function(is_crosspage) {
//   let tmp = null;
//   if (is_crosspage === 0) {
//     tmp = crafts.filter(item => item.enable === 1);
//   } else {
//     tmp = crafts.filter(item => item.enable === 1 && item.is_crosspage === 1);
//   }
// 
//   return tmp.sort((item1, item2) => {
//     return item1.sort > item2.sort;
//   });
  
  return is_crosspage === 0 ? crafts : crafts.filter(item => item.is_crosspage === 1);
}

module.exports = {
  //根据是否跨页获取可用的工艺
  getCraftsByIsCrosspage
}
