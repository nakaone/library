#!/usr/bin/env node
/**
 * node createJSDoc.mjs [入力ファイル...] -o 出力フォルダ [-x 除外パターン ...]
 * - ワイルドカードはクォートすると展開されない("src/*.js"は不展開)
 * - *.js # 任意文字列
 * - ?.js # 1文字
 * - [a-z].js # 文字クラス
 * - **\/*.js # 再帰glob(src/a.js, src/lib/x.js, test/foo.js)
 * - src/**\/*.js~src/**\/*.test.js # 除外glob(左例はtestを除外したjs)
 * 
 * @example
 * node createJSDoc.mjs
 *   ../Auth/src/**／*.(js|mjs) ../Auth/src/**／*.md \
 *   -o ../Auth/tmp \
 *   -x ../Auth/src/server/*
 */


import path from 'path';
import process from 'process';

//console.log(JSON.stringify(process.argv,null,2));
const v = {};
v.argv = process.argv.slice(2);
console.log(JSON.stringify(v.argv,null,2));

for( v.i=0, v.mode='i' ; v.i<v.argv.length ; v.i++ ){
  v.x = v.argv[v.i];
  console.log(`l.21 v.x=${v.x}, v.mode=${v.mode}`);
  /*
  if( v.x === '-o' ) v.mode = 'o';
  else if( v.x === '-x' ) v.mode = 'x';
  else console.log(`${v.i}${v.mode}: ${path.resolve(v.x)}`);
  */
  switch(v.x){
    case '-o':
      v.mode = 'o'; break;
    case '-x':
      v.mode = 'x'; break;
    default:
      console.log(`${v.i}${v.mode}: ${path.resolve(v.x)}`);
  }
}
