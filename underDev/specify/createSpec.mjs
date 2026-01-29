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
import { execFile } from "node:child_process";
import { writeFileSync, unlinkSync } from 'node:fs';
import {devTools} from '../../../library/devTools/3.0.0/core.mjs';
import {mergeDeeply} from '../../../library/mergeDeeply/2.0.0/core.mjs';
console.log(JSON.stringify(createSpec(),null,2));

async function createSpec() {
  const pv = {whois:`createSpec`, arg:{}, rv:null};

  /** listSource: 対象ファイルリスト作成 */
  function listSource() {
    const v = {whois:`${pv.whois}.listSource`, arg:{}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1);  // 事前処理
      v.argv = process.argv.slice(2);  // シェルの起動時引数取得
      v.rv = {
        iList: [],  // 入力ファイルリスト
        xList: [],  // 除外ファイルリスト
        outDir: null, // 出力先フォルダ
        list: [], // 対象ファイルリスト(入力−除外)
      }

      dev.step(2);  // 入力・出力・除外リスト作成
      for( v.i=0, v.mode='i' ; v.i<v.argv.length ; v.i++ ){
        v.x = path.resolve(v.argv[v.i]);  // 相対->絶対パス

        switch(v.argv[v.i]){
          case '-o':
            v.mode = 'o'; break;
          case '-x':
            v.mode = 'x'; break;
          default:
            //console.log(`${v.i}${v.mode}: ${path.resolve(v.x)}`);
            switch( v.mode ){
              case 'i': v.rv.iList.push(v.x); break;
              case 'o': v.rv.outDir = v.x; break;
              case 'x': v.rv.xList.push(v.x); break;
            }
        }
      }

      dev.step(3);  // 対象 = 入力 − 除外
      for( v.i=0 ; v.i<v.rv.iList.length ; v.i++ ){
        if( !v.rv.xList.includes(v.rv.iList[v.i]) ){
          v.rv.list.push(v.rv.iList[v.i]);
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** runJSDoc: jsdocコマンドを実行し、対象ファイルのJSDocをJSON形式で取得
   * @param {string} fn - 対象ファイル名
   * @returns {Object}
   */
  function runJSDoc(fn) {
    return new Promise((resolve,reject) => {
      execFile('jsdoc',[fn,'--configure',pv.jsdocJson,'-X'],{encoding:'utf8'},(err,stdout,stderr)=>{
        if(err){
          reject(new Error(stderr || err.message));
          return;
        }
        resolve(JSON.parse(stdout));
      });
    });
  }

  const dev = new devTools(pv);
  try {

    dev.step(1);
    pv.r = listSource();
    if( pv.r instanceof Error ) throw pv.r;
    pv.list = pv.r.list;
    pv.map = {};  // 「ファイル名＋(ファイル内)行番号」を識別子とするマップ
    pv.idList = []; // 登録済IDリスト

    // mjsも処理対象とするため、jsdoc動作定義ファイルを作成
    pv.jsdocJson = 'jsdoc.json';
    writeFileSync(pv.jsdocJson,JSON.stringify({source:{includePattern:".+\\.mjs$"}}));

    for( pv.i=0 ; pv.i<1 ; pv.i++ ){
      // JSDocを取得
      pv.arr = await runJSDoc(pv.list[pv.i]);
      if( pv.arr instanceof Error ) throw pv.arr;

      // pv.mapの作成
      pv.arr.forEach(o => {
        // 【備忘】
        // ①"meta.code.id"は存在しない場合があるので使用を断念。
        // ②'kind:"package"'
        //   -> プロジェクトのメタ情報（name, version, description など）
        //   "meta.lineno"を持たないが、仕様書作成に使用しないのでmap登録対象外とする
        if( o.meta && o.meta.lineno ){
          pv.id = `${pv.list[pv.i]}-${o.meta.lineno}`;
          if( pv.idList.includes(pv.id) ){
            // 登録済なら結合
            o = mergeDeeply(pv.map[pv.id],o);
          } else {
            pv.idList.push(pv.id);  // 未登録なら登録済IDリストに追加
          }
          pv.map[pv.id] = o;
        }
      });
    }

    // jsdoc動作定義ファイルを削除
    unlinkSync(pv.jsdocJson);

    pv.rv = pv.map;
    dev.end(pv.rv); // 終了処理
    return pv.rv;

  } catch (e) { dev.error(e); return e; }
}
