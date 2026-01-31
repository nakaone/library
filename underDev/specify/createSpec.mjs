#!/usr/bin/env node
/**
 * @name createSpec概要
 * @desc
 * 
 * JavaScriptソース内のJSDocを基に、Markdown形式の仕様書を生成する。
 * 
 * - クラス・グローバル関数毎に別ファイル化
 * - typedef,interfaceはまとめて"readme.md"としてフォルダ毎に作成
 * - 出力フォルダは入力ファイルのフォルダと同じ構成(パスの共通部分を出力フォルダで置換)
 *   ```
 *   /Users/xxx/〜/library/yyy/src/common/z01.js <- class a01,function a02
 *   /Users/xxx/〜/library/yyy/src/client/z02.js <- class a03
 *   /Users/xxx/〜/library/yyy/src/server/z03.js <- class a04
 * 
 *   出力先フォルダが"../doc"の場合
 *   ../doc/common/a01.md
 *   ../doc/common/a02.md ※a01,a02は別ファイル
 *   ../doc/common/readme.md ※typedef,interface集
 *   ../doc/client/a03.md
 *   ../doc/client/readme.md
 *   ../doc/server/a04.md
 *   ../doc/server/readme.md
 *   ```
 * 
 * # 使用方法
 * 
 * ```
 * node createSpec.mjs [入力ファイル...] -o 出力フォルダ [-x 除外パターン ...]
 * ```
 * 
 * - 処理対象は'.js','.mjs','.gs','.txt'
 * - ワイルドカード関係の注意
 *   - クォートすると展開されない(src/*.jsはOKだが"src/*.js"は不展開)
 *   - *.js # 任意文字列
 *   - ?.js # 1文字
 *   - [a-z].js # 文字クラス
 *   - **\/*.js # 再帰glob(src/a.js, src/lib/x.js, test/foo.js)
 *   - 【不採用】src/**\/*.js~src/**\/*.test.js # 除外glob(左例はtestを除外したjs)
 * 
 * # JSDoc記述上の注意
 * 
 * - JSDoc開始の「／**」以降に続く文字列は＠descとして扱われる
 * - コンストラクタには「＠constructor」必須
 * - 「＠history」を独自タグとして定義
 * - 説明文(=Markdownとして出力する説明)
 *   - 「＠name (説明文のタイトル)」＋「＠desc」で開始
 *   - 「＠name」がない説明文は出力されない(廃棄)
 *   - ＠name使用時「／**」以降に続く文字列は廃棄される(上記の例外)
 *   - ＠desc以降はMarkdownとして扱われ、共通する先頭の空白は削除される
 * - ＠interface内での＠function定義は可能だが、＠typedef内では不可とする
 *   ```
 *   ＠interface User
 *   ＠property {string} name
 *   ＠property {number} age
 *   ＠property {boolean} isAdmin
 *   ＠function ※ここには記述不可
 *   ＠name User#test ※ここには記述不可
 *   ＠desc オブジェクト内関数の説明
 *   ＠param {string} arg
 *   ＠returns {boolean|Error}
 *   ＠example オブジェクト内関数の使用例
 *   ```
 * 
 * # 参考資料
 * 
 * - [データ型判定](https://docs.google.com/spreadsheets/d/1X_1u2xpCOHV2oeZxSvFVAxUNx2ast1JWLWOIT0sQpuU/edit?gid=0#gid=0)(Google Spread)
 * 
 * @example
 * node createSpec.mjs
 *   ../Auth/src/**／*.(js|mjs) ../Auth/src/**／*.md \
 *   -o ../Auth/tmp \
 *   -x ../Auth/src/server/*
 * 
 * @history
 * - rev.1.0.0 : 2026/01/31
 *   specify.mjsを継承し、初版作成
 */
import path from 'path';
import process from 'process';
import { execFile } from "node:child_process";
import { writeFileSync, unlinkSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import {devTools} from '../../../library/devTools/3.0.0/core.mjs';
import {mergeDeeply} from '../../../library/mergeDeeply/2.0.0/core.mjs';
console.log(JSON.stringify(createSpec(),null,2));

async function createSpec() {
  const pv = {whois:`createSpec`, arg:{}, rv:null};
  const objectizeJSON = arg=>{try{return JSON.parse(arg)}catch{return arg}};

  /** identifyDoclet: jsdoc -Xで出力されたオブジェクト(DocLet)の型を判定
   * @param {Object} doclet
   * @returns {string|Error}
   */
  function identifyDocletType(doclet) {
    const v = {whois:`${pv.whois}.identifyDocletType`, arg:{doclet}, rv:[]};
    const dev = new devTools(v);
    /**
     * @name DocLetの型判定ロジック
     * @desc
     * 
     * 本メソッドはinvestigateメソッド＋AIとの質疑に基づき作成
     * 
     * 以下第一レベルが戻り値となる文字列、並列表記はand条件
     * 
     * - typedef
     *   - kind === 'typedef'
     * - interface
     *   - kind === 'interface'
     * - innerObj(interface内function定義)
     *   - kind === 'function'
     *   - scope === 'instance'
     * - class
     *   - kind === 'class'
     *   - meta.code.type === "ClassDeclaration" || "ClassExpression"
     * - constructor
     *   - kind === 'class'
     *   - meta?.code?.type === "MethodDefinition"
     *   - /＠constructor\b/.test(doclet.comment || "")
     * - method
     *   - kind === "function"
     *   - scope === "instance" または "static"
     * - function(グローバル関数) ※アロー関数を含む
     *   - kind === 'function'
     *   - scope === 'global'
     * - innerFunc(関数内関数) ※アロー関数を含む
     *   - kind === 'function'
     *   - scope === 'inner'
     * - description(説明文(＠name))
     *   - meta.code が空
     *   - meta.code.nameがundefined(プラグインや拡張を考慮する場合には必要)
     *   - kindがtypedef/interface 以外
     *   - nameが存在
     * 
     */

    try {

      // -------------------------------------------------------------

      dev.end(v.rv);
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** investigate: jsdoc -Xで出力されたオブジェクトの内容を調査
   * @param {void}
   * @returns {Object|Error} データ型はstep 1.1参照
   * @example
   * - コンソールの内容をresult.txt等に保存
   * - "createSpec.investigate normal end"を検索
   * - result欄の内容確認(以下はサンプル)
   *   result:  [
   *     "10: typedef", // string   ※行頭数字はシンボル(関数・クラス・プロパティ)の行番号
   *     "22: interface", // string
   *     "34: global function", // string
   *     "39: inner function(func01~arrow01)", ※括弧内は親関数・クラス
   *     "40: typedef", // string
   *     "46: unknown", // string
   *     "49: typedef", // string
   *     "55: unknown", // string
   *     "65: class", // string
   *     "66: typedef", // string
   *     "77: constructor(class01)", // string
   *     "85: unknown", // string
   *     "92: method(class01#method01)", // string
   *   ], // Array
   */
  function investigate() {
    const v = {whois:`${pv.whois}.investigate`, arg:{}, rv:[]};
    const dev = new devTools(v);
    try {

      // -------------------------------------------------------------
      dev.step(1);  // 事前処理
      // -------------------------------------------------------------
      dev.step(1.1);  // 戻り値の形式定義
      v.rv = {  
        idListLength: pv.idList.length, // 対象JSDoc要素数
        idList: pv.idList,              // 対象JSDoc要素のIDリスト
        result: [],                     // 判定結果
        kindList: [],                   // kind属性に設定されている値のリスト
        scopeList: [],                  // scope 〃
        sampleNum: 0,                   // サンプルの件数
        sample:[],                      // サンプルのダンプ
      };

      dev.step(1.2);  // 抽出条件の定義
      v.ex = {
        all: o => true,
        // ①scope:"global"
        global: o => {return typeof o.scope !== 'undefined' && o.scope === 'global'},
        // ②kind:"typedef"
        typedef: o => {return typeof o.kind !== 'undefined' && o.kind === 'typedef'},
        // ③kind:"function"
        func: o => {return typeof o.kind !== 'undefined' && o.kind === 'function'},
        // ④kind: "class"
        class: o => {return typeof o.kind !== 'undefined' && o.kind === 'class'},
        // ⑤meta.code.type:"MethodDefinition"
        method: o => o.meta?.code?.type === "MethodDefinition",
        // ⑥判定テストで「unknown」
        unknown: o => / unknown$/.test(o.result),
      }

      dev.step(1.3);  // サンプルの表示方法指定
      v.st = {
        all: o => o,  // 全属性表示
        major: o => {const rv = {}; // 主要属性のみ抽出
          ['name','description','kind','memberof','scope']
          .forEach(x => rv[x] = o[x] ?? '');
          return rv;
        },
      }

      dev.step(1.4);  // 適用条件の指定
      v.cond = v.ex.all; // 適用する抽出条件
      v.disp = v.st.all;  // サンプルの表示方法

      // -------------------------------------------------------------
      dev.step(2);  // JSDoc要素毎に検査実施
      // なおテストに伴いJSDoc要素に"id","result"メンバが追加されるので注意
      // -------------------------------------------------------------
      pv.idList.forEach(x => {

        dev.step(2.1);  // idを追加
        v.mObj = Object.assign({id:x},pv.map[x]);

        dev.step(2.2);  // 指定属性の値一覧を作成
        ['kind','scope'].forEach(p => {
          if( v.mObj.hasOwnProperty(p) && !v.rv[`${p}List`].includes(v.mObj[p]) ){
            v.rv[`${p}List`].push(v.mObj[p]);
          }
        });

        dev.step(2.3);  // 判定テスト
        v.mObj.result = v.mObj.meta.lineno + ': ';
        switch( v.mObj.kind ){
          case 'typedef':
            v.mObj.result +=  'typedef';
            break;
          case 'interface':
            v.mObj.result +=  'interface';
            break;
          case 'function':
            switch( v.mObj.scope ){
              case 'global': v.mObj.result +=  'global function'; break;
              case 'inner': v.mObj.result +=  `inner function(${v.mObj.longname})`; break;
              case 'instance': v.mObj.result +=  `method(${v.mObj.longname})`;
                break;
              default: v.mObj.result +=  `unknown`;
            }
            break;
          case 'class':
            switch( v.mObj.meta.code.type ){
              case 'ClassDeclaration': v.mObj.result +=  'class'; break;
              case 'MethodDefinition': v.mObj.result +=  `constructor(${v.mObj.longname})`; break;
              default: v.mObj.result +=  'unknown';
            }
            break;
          default: v.mObj.result +=  `unknown`;
        }
        v.rv.result.push(v.mObj.result);

        dev.step(2.4);  // 抽出条件に従ってサンプルを追加
        if( v.cond(v.mObj) ) v.rv.sample.push(v.disp(v.mObj));

      });

      dev.step(3);  // 終了処理
      // サンプル数を戻り値にセット
      v.rv.sampleNum = v.rv.sample.length;
      dev.end(v.rv);
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

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

  /** makeMap: 「ファイル名＋行番号」を識別子とするマップを作成 */
  async function makeMap(list){
    const v = {whois:`${pv.whois}.makeMap`, arg:{list}, rv:{}};
    const dev = new devTools(v);
    try {

      for( v.i=0 ; v.i<list.length ; v.i++ ){

        dev.step(1.1);  // JSDocを取得
        v.arr = await runJSDoc(list[v.i]);
        if( v.arr instanceof Error ) throw v.arr;

        dev.step(1.2);  // 取得結果のチェック。配列で無い場合はメッセージを出してスキップ
        if( !Array.isArray(v.arr) ){
          dev.step(1.99,`not Array: ${JSON.stringify(v.arr)}`);
          continue;
        }

        dev.step(2);  // v.mapの作成
        v.arr.forEach(o => {
          // 【備忘】
          // ①"meta.code.id"は存在しない場合があるので使用を断念。
          // ②'kind:"package"'
          //   -> プロジェクトのメタ情報（name, version, description など）
          //   "meta.lineno"を持たないが、仕様書作成に使用しないのでmap登録対象外とする
          if( typeof o.meta !== 'undefined' && typeof o.meta.lineno === 'number'){
            dev.step(2.1);  // v.mapのキー文字列(ID)の作成
            //v.id = `${list[v.i]}-${o.meta.lineno}`;
            v.id = `${o.meta.path ?? ''}/${o.meta.filename ?? ''}-${o.meta.lineno}`;

            if( pv.idList.includes(v.id) ){
              dev.step(2.2);  // 登録済なら結合
              o = mergeDeeply(pv.map[v.id],o);
            } else {
              dev.step(2.3);  // 未登録なら登録済IDリストに追加
              pv.idList.push(v.id);
            }

            dev.step(2.4);  // pv.mapへの登録
            pv.map[v.id] = o;
          }
        });
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** makeMarkdown: Markdown形式の仕様書を作成
   * @param 
   */
  function makeMarkdown(arg) {
    const v = {whois:`${pv.whois}.identifyDocletType`, arg:{arg}, rv:[]};
    const dev = new devTools(v);
    /**
     * @name クラス・グローバル関数文書の構成
     * @desc
     * 
     * 1. ヘッダ部("クラス名_top")
     *    1. タイトル(○○クラス仕様書、等)
     *    2. ラベル(一行にまとめた説明)
     *    3. 概要説明(数行程度)
     * 2. 詳細説明("クラス名_desc")
     *    - 
     * 3. 一覧
     *    1. メンバ一覧("クラス名_prop")
     *    2. メソッド一覧("クラス名_func")
     * 4. 個別メソッド("クラス名-メソッド名") ※注意：'_'ではなく'-'
     *    1. タイトル(クラス名.メソッド名)("クラス名-メソッド名_top")
     *    2. ラベル(一行にまとめた説明)
     *    3. 機能概要(数行程度)
     *    4. 詳細説明
     *    5. 引数
     *    6. 戻り値
     */
    /**
     * @name 一覧文書(フォルダ毎)の構成
     * @desc
     * 
     * - 並び順はフォルダ内のデータ型名順(アルファベット順)
     * 
     * 1. ヘッダ部("フォルダ名_top")
     * 2. グローバル関数・クラス一覧("フォルダ名_list")
     * 3. データ型一覧("フォルダ名_type")
     * 4. 個別データ型("フォルダ名-データ型名") ※注意：'_'ではなく'-'
     */
    /**
     * @name 中間データオブジェクトの形式
     * {
     *   パス名: {  ※固有部分のパスについて'/'を'_'に変換したもの
     *     グローバル関数・クラス名: {
     *     },
     *     "readme": {   ※一覧文書(フォルダ毎)
     *     }
     *   }
     * }
     */
    /** articleObj: 単一記事(タイトル＋本文)のデータ型
     * - `<!--::記事のID::-->`で他記事も埋め込み可とする
     * - アンカーのidは識別子を小文字変換したものとする
     * 
     * @interface articleObj
     * @prop {string} id - 記事の識別子
     * @prop {string} title - 記事のタイトル
     * @prop {string} [icon] - アイコンを付ける場合に設定
     * @prop {boolean} [anchor=false] - アンカーを設定する場合に設定(`<span id="〜">`)
     * @prop {string} [link] - タイトルにリンクを張る場合の参照先URL
     * @prop {string} [top] - タイトルの前に挿入する文字列(固定メニュー等)
     * @prop {string} [middle] - タイトルの後・記事の前に〃
     * @prop {string} [bottom] - 記事の後に〃
     * @prop {string} content - 記事本文
     */
    try {

      // -------------------------------------------------------------

      dev.end(v.rv);
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** runJSDoc: jsdocコマンドを実行し、対象ファイル(単一)のJSDocをJSON形式で取得
   * @param {string} fn - 対象ファイル名
   * @returns {object|string} JSON化できない(=エラー)の場合はテキスト
   */
  function runJSDoc(fn) {
    return new Promise((resolve,reject) => {
      execFile('jsdoc',[fn,'--configure',pv.jsdocJson,'-X'],{encoding:'utf8'},(err,stdout,stderr)=>{
        if(err){
          reject(new Error(stderr || err.message));
          return;
        }
        resolve(objectizeJSON(stdout));
      });
    });
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

    dev.step(1);  // jsdoc動作環境整備
    // ①設定ファイル(JSON)を作成して"includePattern"を指定しないと
    //   ".mjs"他を処理できない
    // ②"includePattern"を指定した場合、"include"も併せて指定しないと
    //   "There are no input files to process."エラーが発生
    // ③"include"にカレントディレクトリを指定すると、対象をフルパスで指定しても
    //   指定外のカレントディレクトリ配下のjs/mjsも対象にされてしまう
    // ④③を回避するため、以下の措置を行う
    //   - 設定ファイル(jsdoc.json)を作成、終了時に廃棄
    //     - includeではダミーディレクトリを指定
    //     - includepatternではJSDocを記述する全拡張子を対象に指定
    //   - 空のダミーディレクトリを作成、終了時に廃棄

    dev.step(1.1);  // jsdoc設定ファイルの作成
    pv.jsdocJson = `jsdoc.${Date.now()}.json`;
    if( !existsSync(pv.jsdocJson) ){
      writeFileSync(pv.jsdocJson,JSON.stringify({source:{
        include:["./dummy"],
        includePattern: ".+\\.(js|mjs|gs|txt)$" // 対象拡張子を正規表現
      }}));
    }

    dev.step(1.2);  // ダミーディレクトリを作成
    pv.dummyDir = './dummy';
    if( !existsSync(pv.dummyDir) ) mkdirSync(pv.dummyDir);

    dev.step(2);  // 対象ファイルリスト作成
    pv.r = listSource();
    if( pv.r instanceof Error ) throw pv.r;

    dev.step(3,pv.r);  // 「ファイル名＋(ファイル内)行番号」を識別子とするマップを作成
    pv.map = {};
    pv.idList = [];
    await makeMap(pv.r.list);
    //dev.step(3.99,{list:pv.idList,map:pv.map});

    dev.step(4);  // 出力対象要素(関数・クラス)を抽出
    investigate();

    /*
    dev.step(4);  // データ型定義をMarkdown出力用オブジェクトに変換
    pv.typedef = [];
    pv.idList.forEach(x => {
      pv.r = typedef(pv.map[x]);
      if( pv.r !== null ) pv.typedef.push(pv.r);
    });
    pv.rv = pv.typedef;
    */
    
    dev.end(pv.rv); // 終了処理
    return pv.rv;

  } catch (e) { dev.error(e); return e; } finally {
    // jsdoc動作定義ファイルを削除
    if( existsSync(pv.jsdocJson) )
      unlinkSync(pv.jsdocJson);
    // ダミーディレクトリを削除
    if( existsSync(pv.dummyDir) )
      rmSync(pv.dummyDir, { recursive: true, force: true });
  }
}
