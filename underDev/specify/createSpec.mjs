import path from 'path';
import process from 'process';
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { devTools } from '../../../library/devTools/3.0.0/core.mjs';

console.log(JSON.stringify(createSpec(),null,2));

/** createSpec: JavaScriptソース内のJSDocを基に、Markdown形式の仕様書を生成
 * @param {void}
 * @returns {void}
 * 
 * @prop {Object} cf - createSpec動作設定情報(config)
 * @prop {sourceFile[]} sourceFile - 入力ファイル情報
 */
async function createSpec() {
  const pv = {whois:`createSpec`, arg:{}, rv:null};
  const cf = {
    // jsdocコマンド動作環境整備関係。詳細はlistSource step.1参照
    jsdocJson: `jsdoc.json`,  // jsdocコマンド設定ファイル名
    //jsdocJson: `jsdoc.${Date.now()}.json`,  // jsdocコマンド設定ファイル名
    dummyDir: './dummy',  // jsdoc用の空フォルダ
    jsdocTarget: ".+\\.(js|mjs|gs|txt)$", // jsdocの動作対象となるファイル名
  };
  /**　sourceFile: 入力ファイル(JSソース)情報
   * @interface sourceFile
   * @prop {string} common - フルパスの共通部分
   * @prop {string} outDir - 出力先フォルダ名(フルパス)
   * @prop {number} sourceNum - 対象ファイルの個数
   * @prop {Object[]} source - {full:フルパス,unique:固有部分}形式のファイル名
   * @prop {Object[]} doclet - `jsdoc -X`で返されるJSONをオブジェクト化、配列として格納
   */
  const sourceFile = {common:'',outDir:'',sourceNum:0,source:[]};
  const doclet = [];

  /** listSource: 事前準備、対象ファイルリスト作成
   * jsdoc動作環境整備後、シェルの起動時引数から対象となるJSソースファイルのリストを作成。
   * 処理結果はメンバ"sourceFile"に保存。
   * @param {void}
   * @returns {void}
   */
  function listSource() {
    const v = {whois:`${pv.whois}.listSource`, arg:{}, rv:null};
    const dev = new devTools(v);
    try {

      /** step.1 : jsdoc動作環境整備
       * @name jsdoc動作環境整備
       * @description
       * ①設定ファイル(JSON)を作成して"includePattern"を指定しないと
       *   ".mjs"他を処理できない
       * ②"includePattern"を指定した場合、"include"も併せて指定しないと
       *   "There are no input files to process."エラーが発生
       * ③"include"にカレントディレクトリを指定すると、対象をフルパスで指定しても
       *   指定外のカレントディレクトリ配下のjs/mjsも対象にされてしまう
       * ④③を回避するため、以下の措置を行う
       *   - 設定ファイル(jsdoc.json)を作成、終了時に廃棄
       *     - includeではダミーディレクトリを指定
       *     - includepatternではJSDocを記述する全拡張子を対象に指定
       *   - 空のダミーディレクトリを作成、終了時に廃棄
       */

      dev.step(1.1);  // jsdoc設定ファイルの作成
      if( !existsSync(cf.jsdocJson) ){
        writeFileSync(cf.jsdocJson,JSON.stringify({source:{
          include:[cf.dummyDir],
          includePattern: cf.jsdocTarget // 対象ファイル名の正規表現
        }}));
      }

      dev.step(1.2);  // ダミーディレクトリを作成
      if( !existsSync(cf.dummyDir) ) mkdirSync(cf.dummyDir);

      /** step.2 : 入力・出力・除外リスト作成
       * @name 入力・出力・除外リスト作成
       * @description
       * 
       * 起動時パラメータは以下の通り。
       * `node createSpec.mjs [入力ファイル...] -o 出力フォルダ [-x 除外パターン ...]`
       * シェル側でワイルドカードを展開して配列が渡されるので、以下のように判断する。
       * ①最初の2つは全体とコマンド名、不要なので削除
       * ②3番目以降'-o'までは入力ファイル
       * ③'-o'の次は出力フォルダ名
       * ④'-x'の次からは除外ファイル
       */

      dev.step(2.1,existsSync(cf.dummyDir));  // 結果を格納する領域を準備
      v.iList = [],  // 入力ファイルリスト
      v.xList = [],  // 除外ファイルリスト

      dev.step(2.2);  // シェルの起動時引数を取得、順次処理
      v.argv = process.argv.slice(2);

      for( v.i=0, v.mode='i' ; v.i<v.argv.length ; v.i++ ){
        v.x = path.resolve(v.argv[v.i]);  // 相対->絶対パス
        switch(v.argv[v.i]){
          case '-o':
            v.mode = 'o'; break;
          case '-x':
            v.mode = 'x'; break;
          default:
            switch( v.mode ){
              case 'i': v.iList.push(v.x); break;
              case 'o': sourceFile.outDir = v.x; break;
              case 'x': v.xList.push(v.x); break;
            }
        }
      }

      dev.step(2.3);  // 対象 = 入力 − 除外
      for( v.i=0 ; v.i<v.iList.length ; v.i++ ){
        if( !v.xList.includes(v.iList[v.i]) ){
          sourceFile.source.push({full:v.iList[v.i]});
        }
      }
      sourceFile.sourceNum = sourceFile.source.length;

      dev.step(2.4);  // 共通部分を抽出
      sourceFile.common = sourceFile.source[0].full;
      for( v.i=1 ; v.i<sourceFile.source.length ; v.i++ ){
        while( !sourceFile.source[v.i].full.startsWith(sourceFile.common) ){
          sourceFile.common = sourceFile.common.slice(0,-1);
          if( sourceFile.common === '' ) break;
        }
      }

      dev.step(2.5);  // 固有部分を作成
      sourceFile.source.map(x => x.unique = x.full.slice(sourceFile.common.length));

      dev.end(sourceFile); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
  
  async function execJsdoc(){
    const v = {whois:`${pv.whois}.execJsdoc`, arg:{}, rv:null};
    const dev = new devTools(v);
    try {

      for( v.i=0 ; v.i<sourceFile.source.length ; v.i++ ){

        dev.step(1);  // jsdocを実行、結果をdocletに格納
        v.r = await runJsdoc(sourceFile.source[v.i].full);
        if( typeof v.r === 'string' ) throw new Error(v.r);
        doclet.push(v.r);
      }

      dev.end(doclet); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** runJSDoc: jsdocコマンドを実行し、対象ファイル(単一)のJSDocをJSON形式で取得
   * @param {string} fn - 対象ファイル名
   * @returns {object|string} JSON化できない(=エラー)の場合はテキスト
   */
  async function runJsdoc(fn) {
    return new Promise((resolve, reject) => {
      const v = {whois:`${pv.whois}.runJsdoc`, arg:{fn,resolve, reject}, rv:null};
      const dev = new devTools(v);

      dev.step(1);  // jsdoc -X を子プロセスとして起動
      v.p = spawn("jsdoc", [fn,'--configure',cf.jsdocJson,'-X'], {
        stdio: ["ignore", "pipe", "pipe"], // stdin 無視、stdout/stderr を受け取る
        encoding: "utf8"
      });

      dev.step(2);  // jsdoc の出力(JSON文字列)を蓄積するバッファ
      v.output = "";
      v.errorOutput = "";

      dev.step(3);  // stdout（標準出力）にデータが届くたびに呼ばれる
      v.p.stdout.on("data", chunk => {
        v.output += chunk; // JSON の断片をつなげる
      });

      dev.step(4);  // stderr（標準エラー）も蓄積しておく
      v.p.stderr.on("data", chunk => {
        v.errorOutput += chunk;
      });

      dev.step(5);  // 子プロセスが終了したときに呼ばれる
      // code === 0 なら正常終了、JSON をパースして resolve
      v.p.on("close", code => {
        if (code !== 0) {
          reject(new Error(`jsdoc exited with code ${code}\n${v.errorOutput}`));
          return;
        }

        try {
          v.json = JSON.parse(v.output);
          resolve(v.json); // await の戻り値になる
        } catch (err) {
          reject(new Error("Failed to parse JSON: " + err.message));
        } finally {
          dev.end();
        }
      });
    });
  }

  // -------------------------------------------------------------
  // メイン処理
  // -------------------------------------------------------------
  const dev = new devTools(pv);
  try {

    dev.step(1);  // sourceFileに対象ファイルリスト作成
    pv.r = listSource();
    if( pv.r instanceof Error) throw pv.r;

    dev.step(2);  // 対象ファイルについて順次jsdocを実行
    pv.r = execJsdoc();
    if( pv.r instanceof Error) throw pv.r;

  } catch (e) { dev.error(e); return e; } finally {
    // jsdoc動作定義ファイルを削除
    //if( existsSync(cf.jsdocJson) )
      //unlinkSync(cf.jsdocJson);
    // ダミーディレクトリを削除
    //if( existsSync(cf.dummyDir) )
      //rmSync(cf.dummyDir, { recursive: true, force: true });
  }
}
