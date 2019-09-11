let mysql = require('mysql');

let db = mysql.createPool({host: 'localhost', user: 'root', password: 'root', database: 'book'});

//异步的方式-------------------------------------------------------------
// db.query('select * from basebooks', (err, result) => {
//   console.log(result);
// });

//Promise--------------------------------------------------------------
//promise的then里面传两个方法，第一个方法执行resolve，第二个方法执行reject
// let promise = new Promise((resolve, reject) => {
//   db.query('select * from basebooks', (err, result) => {
//     if(err){
//       reject();
//     }
//     resolve(result);
//   })
// });
// 
// promise.then((resolve) => {
//   console.log(resolve);
// },(reject) => {
//   console.log(reject);
// });

//Promise--------------------------------------------------------------
// let promise = new Promise((resolve, reject) => {
//   db.query('select * from basebooks2', (err, result) => {
//     // if(err){
//     //   reject(err);
//     // }
//     reject(err);
//     // resolve(result);
//   })
// });
// 
// promise
// //then接收两个function，第一个为resolve，第二个为reject，当只提供一个时则只能处理resolve，但是还能继续返回Promise
// .then((resolve) => {      //1   1和2，1和3可以搭配使用，1执行resolve，2或者3执行reject
//   console.log(resolve);
// })
// //此处第一个function为null，第二个function执行reject，reject之后不再返回Promise，所以下面的catch是执行不到的
// .then(null, (reject)=>{   //2   2或者3只使用一个来执行reject
//   console.log('拒绝了')
// })
// //使用catch可以捕获reject，所以，如果使用catch时，就应该删掉2
// .catch((err)=>{
//   console.log('出错了')    //3
//   console.log(err);
// });

//Promise.all--------------------------------------------------------------
//Promise.all([promise1, promise2...]).then(function(err){ success }, function(err){ error });
// let p1 = new Promise((resolve, reject) => {
//   db.query('select * from basebooks', (err, result) => {
//     if(err){
//       reject(err);
//     }
//     resolve(result);
//   })
// });
// 
// let p2 = new Promise((resolve, reject) => {
//   db.query('select * from books', (err, result) => {
//     if(err){
//       reject(err);
//     }
//     resolve(result);
//   })
// });
// 
// Promise.all([
//   p1,p2
// ]).then((arr)=>{
//   console.log(arr);
// }, (err)=>{
//   console.log(err);
// })

// async and await--------------------------------------------------------------
// 
// async function getData(){
//   console.log('1111111111111');
//   let books = await new Promise((resolve, reject) => {
//     db.query('select * from books', (err, result) => {
//       if(err){
//         reject(err);
//       }
//       resolve(result);
//     });
//   })
//   console.log(books);
//   console.log('22222222222222222222');
//   let books2 = await new Promise((resolve, reject) => {
//     db.query('select * from books', (err, result) => {
//       // if(err){
//       //   reject(err);
//       // }
//       reject('假装失败了')
//       // resolve(result);
//     })
//   });
//   console.log(books2 + '123333');
//   console.log('3333333333333333333');
//   return [books, books2];
// }
// 
// let result = getData();
// 
// result.then((resolve)=>{
//   console.log(resolve);
// })
// .catch((err)=>{
//   console.log(err+'aaaa');
// })
// console.log('执行完毕');

// async and await--------------------------------------------------------------

// let promise1 = new Promise((resolve, reject) => {
//     db.query('select * from books', (err, result) => {
//       if(err){
//         reject(err);
//       }
//       resolve(result);
//     });
//   });
// 
// let promise2 = new Promise((resolve, reject) => {
//     db.query('select * from books', (err, result) => {
//       // if(err){
//       //   reject(err);
//       // }
//       reject('假装失败了')
//       // resolve(result);
//     })
//   });
// 
// async function getData(){
//   console.log('1111111111111');
//   let books = await promise1;
//   console.log(books);
//   console.log('22222222222222222222');
//   let books2 = await promise2;
//   console.log(books2 + '123333');
//   console.log('3333333333333333333');
//   return [books, books2];
// }
// 
// let result = getData();
// 
// result.then((resolve)=>{
//   console.log(resolve);
// })
// .catch((err)=>{
//   console.log(err+'aaaa');
// })
// console.log('执行完毕');

//--------------------------------------------------------------------------------
db.query('select * from basebooks where id=?', 0, (err,result)=>{
  if(result){
    console.log(result);
  }else{
    console.log('bucunzai')
  }
  
});