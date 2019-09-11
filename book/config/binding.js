module.exports = {
  bleed:{                         //出血，毫米
    top: 3,
    right: 3,
    bottom: 3,
    left: 3
  },
  // page_types: {
  //   '0': '护封',
  //   '1': '封面',
  //   '2': '内页',
  //   '3': '自定义页'
  // },
  paper: {
    tongbanzhi_128g: 0.12,        //铜版纸128g厚度
    tezhongzhi_128g: 0.105,       //特种纸128g厚度
    tongbanzhi_200g: 0.13,        //铜版纸200g厚度
    tezhongzhi_200g: 0.105        //特种纸200g厚度
  },
  hardcover: {                    //精装
    spine_min_width: 15,          //精装书脊最小宽度
    cover_thickness: 1.5,         //封面厚度 
    cover_extend_width: 1 * 2 + 1.5 * 2 + 20 * 2,   //封面扩展宽度，书脊凹陷宽度*2 + 封面厚度*2 + 折回包边宽度*2
    cover_extend_height: 1.5 * 2 + 20 * 2,          //封面扩展高度，封面厚度*2 + 折回包边宽度*2
    binding: {
      jiaozhuang: {               //胶装
        is_cross: false,
        min_pages: 20,
        max_pages: 800
      },
      suoxian: {                  //锁线
        is_cross: true,
        min_pages: 20,
        max_pages: 40
      },
      duibiao: {                  //对裱
        is_cross: true,
        min_pages: 10,
        max_pages: 800
      },
      duibiao_simple: {           //对裱无衬纸
        is_cross: true,
        min_pages: 20,
        max_pages: 800
      }
    }
  },
  simplecover: {                  //简装
    binding: {
      jiaozhuang: {               //胶装
        is_cross: false,
        min_pages: 20,
        max_pages: 800,
        spine_min_pages: 80       //简装胶装显示书脊最少实际页数
      },
      qimading: {                 //骑马钉
        is_cross: true,
        min_pages: 10,
        max_pages: 20
      }
    }
  }
}