1.安装，使用cnpm安装比较快，npm安装有时会出错
cnpm install -g webpack
安装完成后输入webpack，会有一些信息输出

2.编写配置
  默认： webpack.config.js
  改了： webpack --config xx.config.js

3.多入口
  entry: {
    名字： '入口文件地址',
    ...
  },
  output: {
    path: xxx
    filename: '...[name]...'
  }

4.dev-server
1.安装
  cnpm i webpack webpack-cli webpack-dev-server -D
  
-------------------------------------------------
#webpack-cli    命令行工具
npm i -g webpack

#webpack        库
npm i webpack