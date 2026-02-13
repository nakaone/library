#!/usr/bin/env node
import path from 'path';
import process from 'process';
import { spawn } from "node:child_process";
import { writeFileSync, unlinkSync, mkdirSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { devTools } from '../../../library/devTools/3.1.0/core.mjs';
createSpec();

async function createSpec(opt={}){
  const pv = {whois:`createSpec`, arg:{}, rv:null};
  const cf = {  // jsdocコマンド動作環境整備関係(config)
    encode: 'utf-8',  // 入力ファイルのエンコード
    command: path.resolve('./node_modules/.bin/jsdoc'), // jsdocコマンド
    jsdocJson: opt.jsdocJson ?? `jsdoc.json`,  // jsdocコマンド設定ファイル名
    dummyDir: opt.dummyDir ?? './dummy',  // jsdoc用の空フォルダ
  };
  const dev = new devTools(pv,{mode:'dev'});

  /** DocletColDef: Doclet.properties/params/returnsの要素(メンバ)定義情報
   * @typedef {Object} DocletColDef
   * @prop {Object}   type - データ型情報オブジェクト
   * @prop {string[]} type.names - データ型名の配列
   *   `{number|string}`等、'|'で区切られたUnion型の場合は複数になる
   *   {typeDef[]|columnDef[]} ⇒ "names": ["Array.<typeDef>","Array.<columnDef>"]
   * @prop {string}   longname - 対象要素の完全修飾名（所属関係・スコープを含む一意な識別子）
   * @prop {string}   scope - 対象要素のスコープ種別
   *   - global : グローバル
   *   - static : クラス静的メンバ
   *   - instance : インスタンスメンバ
   *   - inner : 内部要素
   * @prop {string}   memberof
   * @prop {string}   description - 説明文
   * @prop {string}   name - プロパティ名。階層化されている場合`parent.child`形式になる
   * @prop {Object}   meta - プロパティ定義が存在するソース位置情報
   *   param/returnsには出ないがpropertiesには出ることがある
   * @prop {string}   defaultvalue - 既定値(文字列表現。ex.'[]')
   * @prop {boolean}  optional - trueの場合は任意項目
   */
  /** Doclet: `jsdoc -X`で配列で返されるオブジェクト
   * @typedef {Object} Doclet
   * @prop {string[]} augments - ＠augments/＠extendsによる継承元情報
   *   親クラスや継承対象の一覧
   * @prop {string}   classdesc - ＠classdescタグで指定されたクラス専用の説明文
   *   description とは別枠で保持される
   * @prop {string}   comment - ソース上に記載されたDocletの原文
   * @prop {string}   description - 説明文。タグ以外のcomment内の自由記述部分
   * @prop {string[]} examples - ＠exampleタグの内容。使用例コードを配列で保持
   * @prop {string}   kind - Docletの対象種別
   *   例：function, class, member, typedef, module など
   * @prop {string}   longname - 完全修飾名
   *   `module:foo~bar#baz`のように、モジュール・クラス・スコープを含む一意名
   * @prop {string}   memberof - 所属先（親）を示す完全修飾名
   *   どのクラス・モジュール・名前空間に属するかを示す
   * @prop {Object}   meta - Docletが生成されたソース位置情報
   * @prop {number[]} meta.range - ソースコード内での文字位置範囲
   *   桁数単位で、2要素ずつ組み合わせた開始・終了インデックス。
   * @prop {string}   meta.filename - 対象が定義されているソースファイル名
   * @prop {number}   meta.lineno - 対象定義の開始行番号
   * @prop {number}   meta.columnno - 対象定義の開始列番号
   * @prop {string}   meta.path - ソースファイルが存在するディレクトリパス
   * @prop {Object}   meta.code - Doclet対象となったコード要素の構造情報
   * @prop {string}   meta.code.id - コード要素の内部識別子(AST由来、存在しない場合あり)
   * @prop {string}   meta.code.name - コード要素の名前（関数名・クラス名・変数名など）
   * @prop {string}   meta.code.type - コード要素の種別
   * @prop {string}   meta.code.value - コード要素のソース表現（代入値や関数本体の文字列表現）
   * @prop {string[]} meta.code.paramnames - 関数・メソッドの引数名一覧
   * @prop {Object.<string, string>} meta.vars - スコープ内で参照される変数名とその値（簡易マップ）
   * @prop {string}   name - 対象の短い名前(関数名・クラス名・プロパティ名など)
   * @prop {DocletColDef[]} params - ＠paramタグから生成された引数情報の配列
   * @prop {DocletColDef[]} properties - ＠propertyタグから生成されたメンバ定義情報
   * @prop {DocletColDef[]} returns - ＠returns/＠returnタグから生成された戻り値情報
   *   returnsはparams/propertiesと以下の点で異なる。
   *   1. 配列だが単一
   *   2. name/optional/defaultvalueは無い
   *   3. nullable,nullableTypeが付くことがある
   * @prop {string}   scope - スコープ種別
   *   global,static,instance,innerなど、メンバの可視性・所属を示す
   * @prop {Object[]} tags - JSDoc上に記述されたタグのうち、専用フィールドに変換されなかった生タグ情報
   *   独自タグ、JSDocが意味解釈しないタグ、情報落ちしないよう保持された生情報
   * @prop {Object}   tags.meta - タグが記述されているソース位置情報
   * @prop {string}   tags.originalTitle - ソース上に記述されたタグ名（＠を除いた元の表記）
   * @prop {string}   tags.title - 正規化されたタグ名(＠returns->return,＠History->history)
   * @prop {string}   tags.text - タグ行の生テキスト（タグ名を除いた部分）
   * @prop {string}   tags.value - タグ内容をJSDocが解釈・分解した結果の文字列表現
   *   単純タグではtextと同じになることが多い
   * @prop {Object}   type - ＠type/＠param/＠returns/＠property等から得られた型情報
   *   プリミティブ・Union・配列・オブジェクトなど
   * @prop {string[]} type.names - データ型名の配列
   *   `{number|string}`等、'|'で区切られたUnion型の場合は複数になる
   *   {typeDef[]|columnDef[]} ⇒ "names": ["Array.<typeDef>","Array.<columnDef>"]
   * @prop {boolean}  undocumented - JSDoc コメントが存在しない要素かどうか
   *   true の場合、自動抽出されたがコメント未記述
   * @prop {Object}   type - ＠type/＠param/＠returns/＠property等から得られた型情報
   *   プリミティブ・Union・配列・オブジェクトなど
   * @prop {string[]} type.names - データ型名の配列
   *   `{number|string}`等、'|'で区切られたUnion型の場合は複数になる
   * 
   * 
   * # "meta.code.type"の内容
   * 
   * - 関数・メソッド系
   *   - FunctionDeclaration : `function foo() {}`形式の関数宣言。名前付き・巻き上げ対象
   *   - FunctionExpression : `const f = function() {}`のような関数式。無名／名前付きどちらもあり得る
   *   - ArrowFunctionExpression : `() => {}`形式のアロー関数。this を持たない
   *   - MethodDefinition : クラス内メソッド。`class A { foo() {} }`
   * - クラス系
   *   - ClassDeclaration : `class Foo {}`の宣言。トップレベルで定義されたクラス
   *   - ClassExpression : `const A = class {}`のようなクラス式
   * - 変数・メンバ系
   *   - VariableDeclaration : `var/let/const`による宣言全体。実体は VariableDeclarator に分かれる
   *   - VariableDeclarator : `const a = 10`の`a = 10`部分。JSDoc が member として拾うことが多い
   *   - Property : オブジェクトリテラルのプロパティ。`{ a: 10 }`
   *   - MemberExpression : `obj.prop`や`obj['prop']`。直接 Doclet になることは少ない（解析補助）
   * - オブジェクト・構造系
   *   - ObjectExpression : `{a:10,b:20}`。＠typedef の元になることがある
   *   - ArrayExpression : `[1,2,3]`。型推論や ＠type 補助に使用される
   * - モジュール・エクスポート系（ESM）
   *   - ImportDeclaration : `import x from 'y'`。Doclet 化されることは稀
   *   - ExportNamedDeclaration : `export { foo }`,`export const a = 1`
   *   - ExportDefaultDeclaration : `export default function () {}`,`export default class {}`
   * - その他　※出現頻度低め
   *   - AssignmentExpression : `a = 10`。グローバル代入や static メンバ検出に使用
   *   - Literal : 数値・文字列・真偽値などの即値
   *   - Identifier : 変数名・関数名そのもの。単体で Doclet になることはない
   * 
   * 
   * # 「完全修飾名」の構造
   * 
   * ## 基本構造
   * 
   * `[トップレベル] (区切り記号 [子要素])*`
   * 
   * 例：
   * - `User#test`
   * - `module:auth~Config#timeout`
   * - `foo.age`
   * 
   * ## 主な区切り記号と意味
   * 
   * | 記号 | 意味 | 用途 |
   * | :-- | :-- | :-- |
   * | . | 名前空間 / 静的・構造的所属 | オブジェクト・typedef |
   * | # | インスタンスメンバ | クラスの instance |
   * | ~ | 内部（inner）要素 | クロージャ・内部関数 |
   * | : | モジュール修飾子 | module 指定 |
   */
  /** DocletEx: jsdocから出力されるDocletに情報を付加したもの
   * @class
   * @prop {string} id - 固有パス＋longname
   * @prop {string} unique - ソースファイルの固有パス
   *   固有パス：複数フォルダ対象時、フルパスから共通のパスを除いた部分
   *   unique = 'client/test.js' -> 'client/' ※最後に'/'が付く
   *   unique = 'test.js' -> '/' ※直下の場合'/'
   * @prop {string} docletType - Docletの種類。下記「docletTypeの判定ロジック」参照
   * @prop {string} label - 1行で簡潔に記述された概要説明
   *   ① `／** `に続く文字列
   *   ② description, classdesc があれば先頭行
   *   ③ longname
   *   ※ 上記に該当が無い場合、「(ラベル未設定)」
   * @prop {PropList} [properties] - メンバ一覧
   * @prop {PropList} [params] - 引数。クラスの場合はconstructorの引数
   * @prop {PropList} [returns=[]] - 戻り値
   * 
   * @prop {string} [parent=null] - 親要素のDocletEx.id
   * @prop {string[]} [children=[]] - 子要素(メソッド・内部関数)のDocletEx.id
   * 
   * # docletTypeの判定ロジック
   * 
   * 以下第一レベルがdocletTypeとする文字列
   * 
   * - typedef
   *   kind === 'typedef'
   * - interface
   *   kind === 'interface'
   * - class
   *   kind === 'class'
   *   && (meta.code.type === "ClassDeclaration" || "ClassExpression")
   * - constructor
   *   kind === 'class'
   *   && meta?.code?.type === "MethodDefinition"
   *   && /＠constructor\b/.test(doclet.comment || "")
   * - method
   *   kind === "function"
   *   && meta?.code?.type === "MethodDefinition"
   *   && scope === "instance" または "static"
   * - function(グローバル関数) ※アロー関数を含む
   *   kind === 'function'
   *   && scope === 'global'
   * - innerFunc(関数内関数) ※アロー関数を含む
   *   kind === 'function'
   *   && scope === 'inner'
   * - description(説明文(＠name))
   *   meta.code が空
   *   && meta.code.nameがundefined(プラグインや拡張を考慮する場合には必要)
   *   && kindがtypedef/interface 以外
   *   && nameが存在
   * - objectFunc(interface内function定義)　※書き方に関しては冒頭の記述例参照<br>
   *   なおあくまでinterfaceなので、関数と同時にpropertiesも含む
   *   kind === 'function'
   *   && scope === 'instance'
   * - unknown(上記で判定不能)
   */
  class DocletEx {
    /**
     * @constructor
     * @param {Doclet} doclet 
     * @param {string} unique 
     */
    constructor(doclet,unique='/'){
      const v = {whois:`DocletEx.constructor`, arg:{doclet,unique}, rv:null};
      const dev = new devTools(v,{mode:'pipe'});
      try {

        dev.step(1);  // オリジナルのメンバをコピー
        Object.keys(doclet).forEach(x => this[x] = doclet[x]);

        dev.step(1);  // id
        this.id =unique + doclet.longname;

        dev.step(2);  // unique
        this.unique = unique;

        dev.step(3);  // docletType
        this.docletType = this.determineType(doclet);
        if( this.determineType instanceof Error) throw this.determineType;

        dev.step(4);  // label
        // ①JSDoc先頭の「/**」に続く文字列
        v.m = doclet.comment?.split('\n')[0].match(/^\/\*\*\s*(.+)\n/) ?? null;
        // ②説明文の先頭行
        v.desc = (doclet.description ?? doclet.classdesc ?? doclet.longname)
          .split('\n')[0] ?? '(ラベル未設定)';
        // ③「① > (nameまたはclassなら)longname > ②」で決定
        this.label = v.m !== null ? v.m[1] : (
          this.docletType === 'name' || this.docletType === 'class'
          ? (doclet.longname ?? v.desc) : v.desc
        );
        // 説明文の先頭行をlabelにした場合、説明文から削除
        if( doclet.description && doclet.description.startsWith(this.label) )
          doclet.description.slice(this.label.length).trim();
        if( doclet.classdesc && doclet.classdesc.startsWith(this.label) )
          doclet.classdesc.slice(this.label.length).trim();

        dev.step(5);  // properties
        v.r = new PropList(doclet.properties);
        if( v.r instanceof Error ) throw v.r;
        if( v.r instanceof PropList ) this.properties = v.r;

        dev.step(6);  // params
        v.r = new PropList(doclet.params);
        if( v.r instanceof Error ) throw v.r;
        if( v.r instanceof PropList ) this.params = v.r;

        dev.step(7);  // returns
        v.r = new PropList(doclet.returns
          // name, value は不要なのでorderから削除
          ,{order:['type','desc','note']});
        if( v.r instanceof Error ) throw v.r;
        if( v.r instanceof PropList ){
          this.returns = v.r;
        }

        dev.step(8);  // parent, childrenの初期値設定。実値は全Doclet作成後に設定
        this.parent = null;
        this.children = [];

        // returns他、typedef/interfaceで定義した型を展開

        dev.step(9);  // md - メソッドで対応？

        dev.end();

      } catch (e) { return dev.error(e); }
    }

    /** determineType: Docletの型を判定
     * @param {Object} doclet
     * @returns {string|Error} 「docletTypeの判定ロジック」参照
     */
    determineType(doclet) {
      const v = {whois:`${this.constructor.name}.determineType`, arg:{doclet}, rv:'unknown'};
      const dev = new devTools(v,{mode:'pipe'});
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
  }
  /** DocletTreeSource: 入力ファイル(JSソース)情報
  * @typedef {Object} DocletTreeSource
  * @prop {string} [common=''] - フルパスの共通部分
  * @prop {string} [outDir=''] - 出力先フォルダ名(フルパス)
  * @prop {number} [num=0] - 対象ファイルの個数
  * @prop {Object[]} [files=[]] - 対象ファイルの情報
  * @prop {string} files.full - フルパス＋ファイル名
  * @prop {string} files.unique - 固有パス(フルパス−共通部分)
  * @prop {string} files.content - ファイルの内容
  * @prop {Doclet[]} files.jsdoc - `jsdoc -X`の実行結果オブジェクト
  */
  /** DocletTree: 処理対象ソース・Docletの全体構造を管理
  * @class DocletTree
  * @prop {DocletTreeSource} source - 処理対象となるソースファイル
  * @prop {DocletEx[]} doclet - `jsdoc -X`で返されるJSDocの配列
  * @prop {Object} [opt={}] - オプション設定値
  */
  class DocletTree {
    /**
     * @constructor
     * @param {DocletTreeSource} arg - 入力ファイル(JSソース)情報
     * @param {*} opt 
     * @returns {DocletTree}
     */
    constructor(arg,opt={}){
      const v = {whois:`DocletTree.constructor`, arg:{arg,opt}, rv:null};
      const dev = new devTools(v);
      try {

        this.source = {
          common: arg.common ?? '',
          outDir: arg.outDir ?? '',
          num:    arg.num ?? 0,
          files:  arg.files ?? [],
        };
        this.doclet = [];
        this.opt = opt;

        dev.end(); // 終了処理
      } catch (e) { return dev.error(e); }
    }

    /** execJSDoc: jsdocコマンドを実行し、対象ファイル(単一)のJSDocをJSON形式で取得
     * @memberof DocletTree
     * @param {string} fn - 対象ファイル名
     * @returns {Array.<DocletEx|string>} JSON化できない(=エラー)の場合はテキスト
     */
    async execJSDoc(fn) {

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

      // step.2 : jsdocの実行
      return new Promise((resolve, reject) => {
        const v = {whois:`${this.constructor.name}.promise`, arg:{fn,resolve, reject}, rv:null};
        const dev = new devTools(v,{mode:'pipe'});

        dev.step(2.1);  // jsdoc -X を子プロセスとして起動
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

          dev.step(5.1);  // 異常終了時
          if (code !== 0) {
            reject(new Error(`jsdoc exited with code ${code}\n${v.errorOutput}`));
            return;
          }

          dev.step(5.2);  // JSONをオブジェクト化
          try {
            v.json = JSON.parse(v.output);
            resolve(v.json); // awaitの戻り値
          } catch (err) {
            reject(new Error("Failed to parse JSON: " + err.message));
          } finally {
            dev.end();
          }
        });
      });
    }

    /** initialize: DocletTreeインスタンス作成
     * @memberof DocletTree
     * @param {DocletTreeSource} arg - 入力ファイル(JSソース)情報
     * @returns {DocletTree|Error}
     */
    static async initialize(arg,opt={}){
      const v = {whois:`execJSDoc.initialize`, arg:{arg,opt}, rv:null};
      const dev = new devTools(v);
      try {

        dev.step(1);  // DocletTreeの原型作成
        v.rv = new DocletTree(arg,opt);

        dev.step(2); // ファイル単位にjsdoc実行
        for( v.i=0 ; v.i<v.rv.source.files.length ; v.i++ ){
          dev.step(2.1);
          v.r = await v.rv.execJSDoc(v.rv.source.files[v.i].full);
          if( v.r instanceof Error ) throw v.r;
          dev.step(2.2);
          v.rv.source.files[v.i].jsdoc = v.r;
        }
        
        dev.end(); // 終了処理
        return v.rv;
      } catch (e) { return dev.error(e); }
    }

    proto(){
      const v = {whois:`${this.constructor.name}.constructor`, arg:{arg,opt}, rv:null};
      const dev = new devTools(v);
      try {

        dev.end(); // 終了処理
        return v.rv;
      } catch (e) { return dev.error(e); }
    }

  }

  /** listSource: 事前準備、対象ファイルリスト作成
   * jsdoc動作環境整備後、シェルの起動時引数から対象となるJSソースファイルのリストを作成。
   * @param {void}
   * @returns {DocletTreeSource|Error}
   */
  function listSource(argv) {
    const v = {whois:`${pv.whois}.listSource`, arg:{argv},
      rv:{common:'',outDir:'',num:0,files:[]}};
    const dev = new devTools(v,{mode:'dev'});
    try {

      /**
       * @name 入力・出力・除外リスト作成
       * @description
       * 
       * 起動時パラメータは以下の通り。
       * `node createSpec.mjs [入力ファイル...] -o 出力フォルダ [-x 除外パターン ...] [-r 調査結果ファイル]`
       * 
       * シェル側でワイルドカードを展開して配列が渡されるので、以下のように判断する。
       * ①最初の2つはnodeとコマンド名(createSpec)、不要なので削除
       * ②3番目以降'-o'までは入力ファイル
       * ③'-o'の次は出力フォルダ名
       * ④'-x'の次からは除外ファイル
       * ⑤'-r'の次は調査結果ファイル名
       */

      dev.step(1);  // 結果を格納する領域を準備
      v.iList = [];  // 入力ファイルリスト
      v.xList = [];  // 除外ファイルリスト

      dev.step(2);  // 引数の解釈
      for( v.i=0, v.mode='i' ; v.i<argv.length ; v.i++ ){
        v.x = path.resolve(argv[v.i]);  // 相対->絶対パス
        switch(argv[v.i]){
          case '-o':
            v.mode = 'o'; break;
          case '-x':
            v.mode = 'x'; break;
          case '-r':
            v.mode = 'r'; break;
          default:
            switch( v.mode ){
              case 'i': v.iList.push(v.x); break;
              case 'o': v.rv.outDir = v.x; break;
              case 'x': v.xList.push(v.x); break;
              case 'r': v.rv.research = v.x; break;
            }
        }
      }

      dev.step(3);  // 対象 = 入力 − 除外
      for( v.i=0 ; v.i<v.iList.length ; v.i++ ){
        if( !v.xList.includes(v.iList[v.i]) ){
          v.rv.files.push({full:v.iList[v.i]});
        }
      }
      v.rv.num = v.rv.files.length;

      dev.step(4);  // 共通部分を抽出
      //v.rv.common = path.dirname(v.rv.files[0].full);  末尾'/'無し
      v.rv.common = v.rv.files[0].full.replace(/[^/\\]+$/, "");  // 末尾'/'有り
      for( v.i=1 ; v.i<v.rv.files.length ; v.i++ ){
        while( !v.rv.files[v.i].full.startsWith(v.rv.common) ){
          v.rv.common = v.rv.common.slice(0,-1);
          if( v.rv.common === '' ) break;
        }
      }

      dev.step(5);  // 固有部分を作成
      v.rv.files.map(x => x.unique = 
        path.posix.dirname(x.full.slice(v.rv.common.length))
        .replace(/\/?$/, '/').replace(/^\.\//,'/'));

      dev.step(6);  // ソースを読み込み
      v.rv.files.forEach(f => f.content = readFileSync(f.full,cf.encode));

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  try { // createSpec主処理

    dev.step(1.1);  // 最初の2つは全体とコマンド名、不要なので削除
    pv.argv = process.argv.slice(2);

    dev.step(1.2);  // 起動時パラメータが無指定の場合、useageを表示して終了
    if( pv.argv.length === 0 || /^\-+[h|H]/.test(pv.argv[0]) ){
      //console.log(cf.useage);
      dev.end(); // 終了処理
      return v.rv;
    }

    dev.step(2);  // 対象ファイルの情報を取得
    pv.rv = listSource(pv.argv)
    if( pv.rv instanceof Error ) throw pv.rv;
    const doc = await DocletTree.initialize(pv.rv);

    dev.end(pv.rv);
    return pv.rv;

  } catch (e) { dev.error(e); return e; }
}

