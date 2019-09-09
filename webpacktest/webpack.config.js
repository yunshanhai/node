const pathlib = require('path');

module.exports={
  entry: './src/1.js', //入口
  output: {
    path: pathlib.resolve('dest/'),
    filename: 'bundle.js'
  }
}