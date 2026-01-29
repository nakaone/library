#!/usr/bin/env node
/**
 * node createSpec.mjs [入力ファイル...] -o 出力フォルダ [-x 除外パターン ...]
 * - ワイルドカードはクォートすると展開されない("src/*.js"は不展開)
 * - *.js # 任意文字列
 * - ?.js # 1文字
 * - [a-z].js # 文字クラス
 * - **\/*.js # 再帰glob(src/a.js, src/lib/x.js, test/foo.js)
 * - src/**\/*.js~src/**\/*.test.js # 除外glob(左例はtestを除外したjs)
 * 
 * @example
 * node createSpec.mjs
 *   ../Auth/src/**／*.(js|mjs) ../Auth/src/**／*.md \
 *   -o ../Auth/tmp \
 *   -x ../Auth/src/server/*
 */
import path from 'path';
import process from 'process';
import {devTools} from '../../../library/devTools/3.0.0/core.mjs';
console.log(JSON.stringify(createSpec(),null,2));

function createSpec() {
  const pv = {whois:`createSpec`, arg:{}, rv:null};

  function listSource() {
    const v = {whois:`${pv.whois}.listSource`, arg:{}, rv:null};
    const dev = new devTools(v);
    try {

      // -------------------------------------------------------------
      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------

      v.argv = process.argv.slice(2);
      console.log(JSON.stringify(v.argv,null,2));

      v.iList = [];
      v.xList = [];
      for( v.i=0, v.mode='i' ; v.i<v.argv.length ; v.i++ ){
        v.x = v.argv[v.i];
        console.log(`l.21 v.x=${v.x}, v.mode=${v.mode}`);

        switch(v.x){
          case '-o':
            v.mode = 'o'; break;
          case '-x':
            v.mode = 'x'; break;
          default:
            //console.log(`${v.i}${v.mode}: ${path.resolve(v.x)}`);
            switch( v.mode ){
              case 'i': v.iList.push(v.x); break;
              case 'o': v.outDir = path.resolve(v.x); break;
              case 'x': v.xList.push(v.x); break;
            }
        }
      }

      v.rv = v.iList;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  const dev = new devTools(pv);
  try {

    dev.step(1);
    pv.rv = listSource();
    dev.step(99.71,pv.rv);

    dev.end(); // 終了処理
    return pv.rv;

  } catch (e) { dev.error(e); return e; }
}
