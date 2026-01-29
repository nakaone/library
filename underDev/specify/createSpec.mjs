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

  /** runJSDoc: jsdocコマンドを実行し、対象ファイル(単一)のJSDocをJSON形式で取得
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
        const rv = (arg=>{try{return JSON.parse(arg)}catch{return null}})(stdout);
        resolve(rv);
      });
    });
  }

  /** makeMap: 「ファイル名＋行番号」を識別子とするマップを作成 */
  async function makeMap(list){
    const v = {whois:`${pv.whois}.makeMap`, arg:{list}, rv:{}};
    const dev = new devTools(v);
    try {

      dev.step(1);  // 事前処理

      for( v.i=0 ; v.i<list.length ; v.i++ ){
        dev.step(2,list[v.i]);  // JSDocを取得
        v.arr = await runJSDoc(list[v.i]);
        if( v.arr instanceof Error ) throw v.arr;

        dev.step(3,Array.isArray(v.arr));  // v.mapの作成
        if( Array.isArray(v.arr) ){
          v.arr.forEach(o => {
            // 【備忘】
            // ①"meta.code.id"は存在しない場合があるので使用を断念。
            // ②'kind:"package"'
            //   -> プロジェクトのメタ情報（name, version, description など）
            //   "meta.lineno"を持たないが、仕様書作成に使用しないのでmap登録対象外とする
            if( typeof o.meta !== 'undefined' && typeof o.meta.lineno === 'number'){
              dev.step(3.1);
              v.id = `${list[v.i]}-${o.meta.lineno}`;
              if( pv.idList.includes(v.id) ){
                dev.step(3.2);  // 登録済なら結合
                o = mergeDeeply(pv.map[v.id],o);
              } else {
                dev.step(3.3);  // 未登録なら登録済IDリストに追加
                pv.idList.push(v.id);
              }
              dev.step(3.4);
              pv.map[v.id] = o;
            }
          });
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** trimCommonIndent: 文字列の配列から全要素に共通する先頭の空白を削除
   * @param {string[]} lines
   * @returns {string[]}
   */
  function trimCommonIndent(lines) {
    // 空行を除いた行の先頭空白数を調べる
    const indents = lines
      .filter(line => line.trim().length > 0)
      .map(line => line.match(/^[ \t]*/)[0].length);

    // 共通の最小インデント
    const minIndent = Math.min(...indents);

    // 各行から共通インデントを削除
    return lines.map(line => line.slice(minIndent));
  }

  /** propObj: 項目(property)のデータ型
   * @typedef {Object} propObj
   * @prop {string} name - 項目名(メンバ名。英数字)
   * @prop {string} type - データ型欄の文字列。ex. "string | number"
   * @prop {string} value - 「要否/既定値」欄の文字列。「任意」「必須」または既定値
   * @prop {string} desc - 項目の簡潔な説明
   * @prop {string} note - 補足説明。＠propの2行目以降の部分
   */
  /** typedefObj: typedefの戻り値
   * @typedef {Object} typedefObj
   * @prop {string} filename - 当該typedefの存在するファイル名
   * @prop {string} path - ファイルが存在するパス
   * @prop {string} typename - データ型定義名(ex.authAuditLog)
   * @prop {string} desc - データ型定義に関する説明
   * @prop {propObj[]} properties - 各項目説明の配列
   */
  /** typedef: データ型定義をMarkdown出力用オブジェクトに変換
   * @param {Object} arg - JSDocオブジェクト。以下の【出力JSON】にサンプル掲載
   * @returns {typedefObj}
   * 
   * @example kind:"typedef"型オブジェクトサンプル
   * 
   * 【入力ソース】
   ／** globalDef: テスト用定義①
   * - typedef前の補足説明
   *   - サブ項目
   * ＠typedef {Object} globalDef
   * - typedef後の補足説明
   * ＠property {typeDef[]|columnDef[]} main=[] - グローバル領域にあるJSDoc
   * ＠property {Object} class - クラス定義にかかるJSDoc
   * ＠property {columnDef[]} [class.method] - 任意項目確認用
   * 
   * - 末尾にある補足説明
   *／
   *
   * 【出力JSON】
   * {
   *     "comment": "/** globalDef: テスト用定義①\n * - typedef前の補足説明\n *   - サブ項目\n * @typedef {Object} globalDef\n * - typedef後の補足説明\n * @property {typeDef[]|columnDef[]} main=[] - グローバル領域にあるJSDoc\n * @property {Object} class - クラス定義にかかるJSDoc\n * @property {columnDef[]} [class.method] - 任意項目確認用\n * \n * - 末尾にある補足説明\n *／",
   *     "meta": {
   *         "filename": "test.js",
   *         "lineno": 10,
   *         "columnno": 0,
   *         "path": "/Users/ena.kaon/Desktop/GitHub/library/underDev/specify/test",
   *         "code": {}
   *     },
   *     "description": "globalDef: テスト用定義①\n- typedef前の補足説明\n  - サブ項目",
   *     "kind": "typedef",
   *     "name": "globalDef",
   *     "type": {
   *         "names": [
   *             "Object"
   *         ]
   *     },
   *     "properties": [
   *         {
   *             "type": {
   *                 "names": [
   *                     "Array.<typeDef>",
   *                     "Array.<columnDef>"
   *                 ]
   *             },
   *             "defaultvalue": "[",
   *             "description": "グローバル領域にあるJSDoc",
   *             "name": "main"
   *         },
   *         {
   *             "type": {
   *                 "names": [
   *                     "Object"
   *                 ]
   *             },
   *             "description": "クラス定義にかかるJSDoc",
   *             "name": "class"
   *         },
   *         {
   *             "type": {
   *                 "names": [
   *                     "Array.<columnDef>"
   *                 ]
   *             },
   *             "optional": true,
   *             "description": "任意項目確認用\n\n- 末尾にある補足説明",
   *             "name": "class.method"
   *         }
   *     ],
   *     "longname": "globalDef",
   *     "scope": "global"
   * },
   */
  function typedef(arg=null) {
    const v = {whois:`${pv.whois}.typedef`, arg:{arg}, rv:{}};
    const dev = new devTools(v);
    try {

      dev.step(1);  // 事前処理
      if( arg === null || arg.kind !== 'typedef' )
        return null;

      dev.step(2);  // typedefObjの作成
      v.rv = {
        filename: arg.meta.filename ?? '',
        path: arg.meta.path ?? '',
        typename: arg.longname ?? '',
        desc: arg.description ?? '',
        properties: []
      };

      dev.step(3);  // 項目(propObj)の作成
      arg.properties.forEach(o => {
        v.desc = o.description.split('\n') ?? [];
        v.prop = {
          name: o.name,
          type: o.type.names.join(' | '),
          value: o.defaultvalue ? o.defaultvalue
            : (typeof o.optional !== 'undefined' && o.optional ? "任意" : "必須"),
          desc: v.desc[0],
          note: trimCommonIndent(v.desc.slice(1)).join('\\n')
        };
        v.rv.properties.push(v.prop);
      });

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  const dev = new devTools(pv);
  try {

    dev.step(1);  // mjsも処理対象とするため、jsdoc動作定義ファイルを作成
    pv.jsdocJson = 'jsdoc.json';
    writeFileSync(pv.jsdocJson,JSON.stringify({source:{includePattern:".+\\.mjs$"}}));

    dev.step(2);  // 対象ファイルリスト作成
    pv.r = listSource();
    if( pv.r instanceof Error ) throw pv.r;

    dev.step(3);  // 「ファイル名＋(ファイル内)行番号」を識別子とするマップを作成
    pv.map = {};
    pv.idList = [];
    await makeMap(pv.r.list);

    dev.step(4);  // データ型定義をMarkdown出力用オブジェクトに変換
    pv.typedef = [];
    pv.idList.forEach(x => {
      pv.r = typedef(pv.map[x]);
      if( pv.r !== null ) pv.typedef.push(pv.r);
    });
    
    // jsdoc動作定義ファイルを削除
    unlinkSync(pv.jsdocJson);

    pv.rv = pv.typedef;
    dev.end(pv.rv); // 終了処理
    return pv.rv;

  } catch (e) { dev.error(e); return e; }
}
