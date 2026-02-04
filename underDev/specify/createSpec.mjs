#!/usr/bin/env node
import path from 'path';
import process from 'process';
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { devTools } from '../../../library/devTools/3.0.0/core.mjs';

/** createSpec概要
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
 * - グローバル関数・クラス・データ型定義の名称は重複不可
 *   ∵ リンクを張る場合、リンク先を特定できない
 * - 以下はエラーとなる
 *   - ＠class未定義で＠constructorやメソッドにJSDoc記述
 *   - グローバル関数未定義で内部関数にJSDoc記述
 * - JSDoc開始の「／**」以降に続く文字列は＠descとして扱われる
 * - コンストラクタには「＠constructor」必須
 * - 「＠history」を独自タグとして定義
 * - 説明文(=Markdownとして出力する説明)
 *   - 「＠name (説明文のタイトル)」＋「＠desc」で開始
 *   - 「＠name」がない説明文は出力されない(廃棄)
 *   - ＠name使用時「／**」以降に続く文字列は廃棄される(上記の例外)
 *   - ＠desc以降はMarkdownとして扱われ、共通する先頭の空白は削除される
 * - ＠typedefでfunctionの定義は不可
 * - ＠interfaceではfunction型メンバの定義は可能だが、分離する
 *   ```
 *   ／**
 *     * ＠interface User
 *     * ＠property {string} name
 *     * ＠property {number} age
 *     * ＠property {boolean} isAdmin
 *     *／
 *   ／**
 *     * ＠function ※ここには記述不可
 *     * ＠name User#test ※ここには記述不可
 *     * ＠desc オブジェクト内関数の説明
 *     * ＠param {string} arg
 *     * ＠returns {boolean|Error}
 *     * ＠example オブジェクト内関数の使用例
 *     *／
 *   ```
 *   なお変数がinterfaceで定義されたデータ型であることは以下のように示す
 *   ```
 *   ／** ＠type {User}*／
 *   const user = {...}
 *   ```
 * 
 * # 用語集
 * 
 * - DocLet : JSDoc上「／** 〜 *／」までの部分。通常一つのファイルに複数存在。
 *   `jsdoc -X`の出力はArray.<Doclet>形式のJSONとなる。
 * - シンボル : クラス・関数・データ型定義。Markdownの仕様書上、最上位の分類
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
/** 開発課題
 * @name 開発課題
 * @desc
 * - undocumentedチェックを追加
 * - Objectからの一覧表作成機能(ex. properties -> Markdownの表)
 * - シンボル・メソッドと一致する文字列にはリンクを自動生成
 * - 和文の他、英文のテンプレートも追加
 * - シンボル内の説明文を当該シンボル内に記載
 *   現状、記載すべき箇所を特定する事が困難なため、全てグローバル領域になっている。
 *   案：＠descの後に記載箇所特定文字列を入れる(ex."authLog.constructor")
 * - 重複シンボルがあればエラーメッセージ
 * - 文法チェック
 *   - ＠class の後に余計な文字列があればエラー
 */
console.log(JSON.stringify(createSpec(),null,2));

/** createSpec: JavaScriptソース内のJSDocを基に、Markdown形式の仕様書を生成
 * @param {void}
 * @returns {void}
 * 
 * @prop {Object} pv - createSpec内の共有変数(public variables。class定義のメンバに相当)
 * @prop {Object} cf - createSpec動作設定情報(config)
 * @prop {sourceFile[]} sourceFile - 入力ファイル情報
 * @prop {DocLet[]} doclet - DocLet型にしたオブジェクトを保存
 */
async function createSpec() {
  const pv = {whois:`createSpec`, arg:{}, rv:null};
  const cf = {
    // jsdocコマンド動作環境整備関係。詳細はlistSource step.1参照
    jsdocJson: `jsdoc.json`,  // jsdocコマンド設定ファイル名
    //jsdocJson: `jsdoc.${Date.now()}.json`,  // jsdocコマンド設定ファイル名
    dummyDir: './dummy',  // jsdoc用の空フォルダ
    jsdocTarget: ".+\\.(js|mjs|gs|txt)$", // jsdocの動作対象となるファイル名
    lang: 'ja', // 表記する言語
    ja: { // 日本語での表記
      undef: '未定義',
      optional: '任意',
      required: '必須',
    },
    en: {
      undef: 'undefined',
      optional: 'optional',
      required: 'required',
    },
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
  /** DocLet: `jsdoc -X`で配列で返されたオブジェクトに情報を付加
   * @interface DocLet
   * @prop {string} unique - 固有パス
   *   unique = 'client/test.js' -> 'client/' ※最後に'/'が付く
   *   unique = 'test.js' -> '/' ※直下の場合'/'
   * @prop {string} type - DocLetの種類。identifyDocletTypeの戻り値
   * @prop {string} id - 固有パス＋ファイル名＋行番号
   * @prop {DocLet[]} [innerFunc=[]] - メソッド・内部関数
   * @prop {Object} origin - 情報付加前のjsdocで吐き出されたdoclet
   * // 以下はMarkdown用項目
   * @prop {string} title
   * @prop {string} label - 1行で簡潔に記述された概要説明
   *   ① `／** `に続く文字列
   *   ② description, classdesc があれば先頭行
   *   ③ longname
   *   ※ 上記に該当が無い場合、「(ラベル未設定)」
   * @prop {string} description - 概要・詳細説明、処理手順
   * @prop {PropRow[]} [properties=[]] - メンバ一覧
   * @prop {Object[]} [innerList=[]] - メソッド・内部関数一覧。項目：No,関数名,ラベル,アンカー
   * @prop {PropRow[]} [params=[]] - 引数。クラスの場合はconstructorの引数
   * @prop {PropRow[]} [returns=[]] - 戻り値
   */
  const doclet = [];
  /** dlMap: DocLetを構造化してマッピングしたオブジェクト
   * @typedef {Object.<string, Object>} dlMap - メンバ名は固有パス
   *   固有パスが無い場合は"/"(ルート)とする。
   * @prop {Object.<string, DocLet>} global - メンバ名は関数・クラス名
   * @prop {Object.<string, DocLet>} typedef - メンバ名はデータ型定義名
   */
  const dlMap = {};
  /** dlMapping: docletからdlMapを作成
   * @param {void} - 共有変数docletから作成
   * @returns {null|Error} 処理したDocLetはdlMapに格納
   */
  function dlMapping(){
    const v = {whois:`${pv.whois}.dlMapping`, arg:{}, rv:null};
    const dev = new devTools(v);
    try {

      for( v.i=0 ; v.i<doclet.length ; v.i++ ){
        v.d = doclet[v.i];

        dev.step(1);  // 固有パスが存在しない場合、プレースホルダを作成
        if( typeof dlMap[v.d.unique] === 'undefined' ){
          dlMap[v.d.unique] = {global:{},typedef:{}};
        }

        dev.step(1.2);  // 受け皿となるグローバル関数・クラスおよびデータ型定義を先行して作成
        switch( v.d.type ){
          case 'typedef':
          case 'interface':
            dlMap[v.d.unique].typedef[v.d.title] = v.d;
            break;
          case 'class':
          case 'function':
            dlMap[v.d.unique].global[v.d.title] = v.d;
            break;
        }
      }

      dev.step(2);
      for( v.i=0 ; v.i<doclet.length ; v.i++ ){
        v.d = doclet[v.i];
        switch( v.d.type ){
          case 'objectFunc':  // -> longname区切り記号：'#'
            // typedef.親定義にメンバとして追加
            break;
          case 'constructor': // -> longname区切り記号：無し、name === クラス名
            // @constructorに対応する@classの記述がない ⇒ エラー
            if( typeof dlMap[v.d.unique].global[v.d.origin.name] === 'undefined' ){
              throw new Error(`There is no @class description corresponding to @constructor`);
            }
            dlMap[v.d.unique].global[v.d.origin.name].innerFunc.push(v.d);
            break;
          case 'method':  // -> longname区切り記号：'.'
          case 'innerFunc':  // -> longname区切り記号：'~'
            // クラス・親関数のメソッドに追加
            v.longname = v.d.origin.longname.replaceAll(/[\.\~]/g,'#').split('#');
            // いまここ
            break;
          case 'description':  // -> longname区切り記号：無し
            break;
        }
      }

      dev.end(dlMap); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** getDocLet: DocLet型のオブジェクトを作成、docletに追加
   * @param {Object} obj - `jsdoc -X`で配列で返されたオブジェクト
   * @param {string} unique - objが存在するファイルの固有パス
   * @returns {null|Error} 正常終了ならnull
   */
  function getDocLet(obj,unique){
    const v = {whois:`${pv.whois}.getDocLet`, arg:{obj,unique}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1);  // DocLetの型を判定
      v.type = identifyDocletType(obj);
      if( v.type instanceof Error ) throw v.type;
      if( v.type === 'unknown' ) return v.rv; // 型不明は対象外

      dev.step(2);  // 必須項目の存否チェック
      if( typeof obj.meta?.lineno === 'undefined' )
        throw new Error(`no lineno: ${obj.comment}`);
      if( typeof obj.longname === 'undefined' )
        throw new Error(`no longname: ${obj.comment}`);

      dev.step(3);  // labelを抽出
      // ①JSDoc先頭の「/**」に続く文字列
      v.m = obj.comment.split('\n')[0].match(/^\/\*\*\s*(.+)\n/);
      // ②説明文の先頭行
      v.desc = (obj.description ?? obj.classdesc ?? obj.longname)
        .split('\n')[0] ?? '(ラベル未設定)';
      // ① > (nameまたはclassなら)longname > ②
      v.label = v.m !== null ? v.m[1]
      : (v.type === 'name' || v.type === 'class' ? (obj.longname ?? v.desc) : v.desc);

      dev.step(4);  // DocLet型のオブジェクトを作成
      v.doclet = {
        unique: unique,
        type: v.type,
        id: unique + obj.meta.filename + ':' + obj.meta.lineno,
        innerFunc: [],
        title: obj.longname.replaceAll(/~/g,'#').split('#')[0],
        label: v.label,
        description: obj.description ?? obj.classdesc ?? '',
        properties: [],
        innerList: [],
        params: [],
        returns: [],
        origin: obj,
      };

      dev.step(5);  // 属性項目についてPropRow作成
      ['properties','params','returns'].forEach(x => {
        if( typeof obj[x] !== 'undefined' && Array.isArray(obj[x]) && obj[x].length > 0 ){
          for( v.i=0 ; v.i<obj[x].length ; v.i++ ){
            v.r = getPropRow(obj[x][v.i],x,obj);
            if( v.r instanceof Error ) throw v.r;
            v.doclet[x].push(v.r);
          }
        }
      });

      dev.step(6);  // docletへの格納
      doclet.push(v.doclet);

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** jsdocColDef: DocLetの項目定義
   * @typedef {Object} jsdocColDef - properties/params/returns
   * @prop {Object} type - データ型に関する定義
   * @prop {string[]} type.names - データ型名
   *   {typeDef[]|columnDef[]} ⇒ "names": ["Array.<typeDef>","Array.<columnDef>"]
   * @prop {string} [description] - 項目に関する説明
   * @prop {string} name - 項目名
   * @prop {string} [defaultvalue] - 既定値(ex.'[]')
   *   NG: `＠prop {string[]} x=[]` <- defaultvalue='[' ※']'が欠ける
   *   OK: `＠prop {string[]} [x=[]]` <- 既定値指定時は必ず'[]'で囲む
   * @prop {boolean} [optional] - 任意項目だとtrue
   */
  /** PropRow: 属性一覧に表示する項目
   * - 戻り値(returns)の場合、項目名・要否/既定値は無効な値となる
   * @typedef {Object} PropRow
   * @prop {string} name - 項目名
   * @prop {string} type - データ型。複数なら' | 'で区切って並記
   * @prop {string} value - 要否/既定値。「必須」「任意」または既定値
   * @prop {string} desc - 1行の簡潔な項目説明
   * @prop {string} note - 備考
   */
  /** getPropRow: 属性一覧表示用のオブジェクトを作成
   * @param {jsdocColDef} arg - 項目定義オブジェクト
   * @param {string} type - 呼出元の属性。'properties','params','returns'
   * @param {Object} obj - 項目定義オブジェクトを含むDocLet全体。エラー箇所特定用
   * @returns {PropRow|Error}
   */
  function getPropRow(arg,type,obj){
    const v = {whois:`${pv.whois}.getPropRow`, arg:{arg,type,obj}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1);  // 必須項目の存否チェック(項目名とデータ型定義)
      v.msg = JSON.stringify(arg) + `\n${obj.comment}`;
      if( typeof arg.type?.names === 'undefined' || !Array.isArray(arg.type?.names) )
        throw new Error(`Type definition are required: ${v.msg}`);
      // returnsの場合は項目名不要
      if( type !== 'returns' && typeof arg.name === 'undefined' )
        throw new Error(`Field name is required: ${v.msg}`);

      const desc = (arg.description ?? '').split('\n');
      v.rv = {
        name: arg.name,
        type: arg.type.names
          .map(x => x.replace(/^Array\.<\s*(.+?)\s*>$/, '$1[]').trim())
          .join(' | '),
        value: typeof arg.defaultvalue !== 'undefined' ? arg.defaultvalue
          : (arg.optional === true ? cf[cf.lang].optional : cf[cf.lang].required),
        desc: desc[0],  // descriptionの先頭行
        note: desc.slice(1).join('\n').trim(),  // 2行目以降。先頭・末尾の空行は削除
      };

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** identifyDoclet: DocLetの型を判定
   * @param {Object} doclet
   * @returns {string|Error}
   */
  function identifyDocletType(doclet) {
    const v = {whois:`${pv.whois}.identifyDocletType`, arg:{doclet}, rv:'unknown'};
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
     * - class
     *   - kind === 'class'
     *   - meta.code.type === "ClassDeclaration" || "ClassExpression"
     * - constructor
     *   - kind === 'class'
     *   - meta?.code?.type === "MethodDefinition"
     *   - /＠constructor\b/.test(doclet.comment || "")
     * - method
     *   - kind === "function"
     *   - meta?.code?.type === "MethodDefinition"
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
     * - objectFunc(interface内function定義)　※書き方に関しては冒頭の記述例参照<br>
     *   なおあくまでinterfaceなので、関数と同時にpropertiesも含む
     *   - kind === 'function'
     *   - scope === 'instance'
     * - unknown(上記で判定不能)
     */

    try {

      dev.step(1);  // 原文が無い場合は判定不能
      if( typeof doclet.comment === 'undefined' || doclet.comment.length === 0 )
        return 'unknown';

      dev.step(2);
      switch( doclet.kind ){
        case 'typedef': case 'interface': v.rv = doclet.kind; break;
        case 'class':
          v.rv = ( doclet.meta?.code?.type ?? null ) === null ? 'unknown' : (
            /^Class(Declaration|Expression)/.test(doclet.meta.code.type) ? 'class' : (
              doclet.meta.code.type === 'MethodDefinition' ? 'constructor' : 'unknown'
            )
          );
          break;
        case 'function':
          switch( doclet.scope ){
            case 'global': v.rv = 'function'; break;
            case 'inner': v.rv = 'innerFunc'; break;
            case 'instance':
            case 'static': v.rv =
              doclet.meta?.code?.type === 'MethodDefinition' ? 'method' : 'objectFunc';
              break;
            default: 'unknown';
          }
          break;
        default:
          v.rv = Object.keys(doclet.meta?.code ?? {}).length === 0
          && (typeof doclet.meta?.code?.name === 'undefined')
          && doclet.name ? 'description' : 'unknown';
      }

      dev.end();
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** investigate: 【開発用】jsdoc -Xで出力されたオブジェクトの内容を調査
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

  /** listSource: 事前準備、対象ファイルリスト作成
   * jsdoc動作環境整備後、シェルの起動時引数から対象となるJSソースファイルのリストを作成。
   * 処理結果はメンバ"sourceFile"に保存。
   * @param {void}
   * @returns {null|Error}
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

      dev.step(2.1);  // 結果を格納する領域を準備
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
      //sourceFile.common = path.dirname(sourceFile.source[0].full);  末尾'/'無し
      sourceFile.common = sourceFile.source[0].full.replace(/[^/\\]+$/, "");  // 末尾'/'有り
      for( v.i=1 ; v.i<sourceFile.source.length ; v.i++ ){
        while( !sourceFile.source[v.i].full.startsWith(sourceFile.common) ){
          sourceFile.common = sourceFile.common.slice(0,-1);
          if( sourceFile.common === '' ) break;
        }
      }

      dev.step(2.5);  // 固有部分を作成
      sourceFile.source.map(x => x.unique = 
        path.posix.dirname(x.full.slice(sourceFile.common.length))
        .replace(/\/?$/, '/').replace(/^\.\//,'/'));

      dev.end(sourceFile); // 終了処理
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

  /** getFile: jsdocコマンドを実行し、対象ファイル(単一)のJSDocをJSON形式で取得
   * @param {string} fn - 対象ファイル名
   * @returns {object|string} JSON化できない(=エラー)の場合はテキスト
   */
  async function getFile(fn) {
    return new Promise((resolve, reject) => {
      const v = {whois:`${pv.whois}.getFile`, arg:{fn,resolve, reject}, rv:null};
      const dev = new devTools(v);

      dev.step(1);  // jsdoc -X を子プロセスとして起動
      v.p = spawn("jsdoc", [fn.full,'--configure',cf.jsdocJson,'-X'], {
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

        dev.step(5.1);  // 異常終了時
        if (code !== 0) {
          reject(new Error(`jsdoc exited with code ${code}\n${v.errorOutput}`));
          return;
        }

        dev.step(5.2);  // JSONをオブジェクト化
        try {
          v.json = JSON.parse(v.output);

          dev.step(5.3);  // DocLet単位にばらして保存
          for( v.i=0 ; v.i<v.json.length ; v.i++ ){
            v.rv = getDocLet(v.json[v.i],fn.unique);
            if( v.rv instanceof Error ) reject(v.rv);
          }

          resolve(v.json); // awaitの戻り値。使用しないが開発時の内容確認のため戻す
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

    dev.step(2);  // 対象ファイルについて順次DocLetを抽出、docletに格納
    for( pv.i=0 ; pv.i<sourceFile.source.length ; pv.i++ ){
      dev.step(1.1);  // ファイル単位にjsdocを実行、docletを作成
      pv.r = await getFile(sourceFile.source[pv.i]);
      if( pv.r instanceof Error) throw pv.r;
    }

    dev.step(3);  // docletの各要素を階層化してマッピング
    pv.r = dlMapping();
    if( pv.r instanceof Error) throw pv.r;

    dev.end();
    return pv.rv;

  } catch (e) { dev.error(e); return e; } finally {
    // jsdoc動作定義ファイルを削除
    //if( existsSync(cf.jsdocJson) )
      //unlinkSync(cf.jsdocJson);
    // ダミーディレクトリを削除
    //if( existsSync(cf.dummyDir) )
      //rmSync(cf.dummyDir, { recursive: true, force: true });
  }
}

/** trash: 過去作成したソースで必要なくなったもの。備忘用 */
function trash(){
  /** makeMap: 「ファイル名＋行番号」を識別子とするマップを作成 */
  async function makeMap(list){
    const v = {whois:`${pv.whois}.makeMap`, arg:{list}, rv:{}};
    const dev = new devTools(v);
    try {

      for( v.i=0 ; v.i<list.length ; v.i++ ){

        dev.step(1.1);  // JSDocを取得
        v.arr = await getFile(list[v.i]);
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

  /** trimCommonIndent: 文字列を行単位に分割、全行に共通する先頭の空白を削除
   * 但し先頭行頭に空白が無かった場合、調査対象から除外する
   * @param {string[]} txt
   * @returns {string[]}
   */
  function trimCommonIndent(txt) {
    const v = {whois:`${pv.whois}.trimCommonIndent`, arg:{}, rv:[]};
    const dev = new devTools(v);
    try {

      dev.step(1,txt);  // 行単位に分割
      v.lines = txt.split('\n');

      dev.step(2);  // 先頭行頭が空白では無い場合、調査対象から除外
      if( !/^\s/.test(v.lines[0]) ) v.lines.slice(1);

      dev.step(3);  // 空行を除いた行の先頭空白数を調べる
      v.indents = v.lines
        .filter(line => line.trim().length > 0) // 空白行は対象外
        .map(line => line.match(/^[ \t]*/)[0].length);

      dev.step(4);  // 共通の最小インデント
      v.minIndent = Math.min(...v.indents);

      dev.step(5);  // 各行から共通インデントを削除
      v.lines.map(line => line.slice(v.minIndent));

      v.rv = v.lines.join('\n');
      dev.end(v.rv);
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}