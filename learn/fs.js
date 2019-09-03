var fs = require('fs');
fs.stat('server.js', function(err, stat){
  if(err){
    congsole.log(err);
    return false;
  }
  console.log(stat.isFile());
  console.log(stat.isDirectory());
});

//fs.mkdir('css', function(err){
  
});