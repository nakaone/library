/*
var hello = require('./hello');
function callHello() {
  return hello();
}
*/
var hello = require('./hello');
global.callHello = function () { // `global`オブジェクトに関数を代入する
  let msg = hello();
  console.log(`callHello: msg=${msg}`);
  return hello();
}
