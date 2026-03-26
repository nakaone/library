#!/usr/bin/env node
import readline from "readline";
import { createHash, randomUUID } from 'crypto';
import { devTools } from '../../devTools/3.2.0/core.mjs';
const v = {lines:[],rl:readline.createInterface({input: process.stdin})};
v.rl.on("line", line => v.lines.push(line));
v.rl.on("close", () => {
  createSpec(v.lines.join("\n"));
});

/** createSpec: メソッド(またはグローバル/内部関数)のテンプレート
 * @param {string} arg - `jsdoc -X`の実行結果(テキスト)
 * @returns {null|Error} 戻り値
 */
function createSpec(arg) {
  const v = {whois:`createSpec`, arg:{arg}, rv:null};
  const dev = new devTools(v,{mode:'pipe'});
  try {

    dev.step(1);
    v.r = new DocletTree(arg);
    if( v.r instanceof Error ) throw v.r;

    dev.step(99,{
      doclets:v.r.doclets.filter(x=>x.comment !== '')
        .map(x => {return {comment:x.comment,path:x.meta?.path}}),
      commonPath:v.r.commonPath,
    });

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { return dev.error(e); }
}

/** DocletColRow: データ項目一覧作成用追加情報
 * @typedef {Object} DocletColRow
 * @memberof createSpec
 * @prop {string} name - 項目名
 * @prop {string} type - データ型
 * @prop {string} value - 要否/既定値
 * @prop {string} desc - 説明
 * @prop {string} note - 備考
 */
/** DocletColDef: Doclet.properties/params/returnsの要素(メンバ)定義情報
 * @typedef {Object} DocletColDef
 * @memberof createSpec
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
 * @prop {DocletColRow} row - DocletEx.addRowToColumnで追加される項目情報
 */
/** Doclet: `jsdoc -X`で配列で返されるオブジェクト
 * @typedef {Object} Doclet
 * @memberof createSpec
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
 * @prop {string}   meta.path - ソースファイルが存在するディレクトリのフルパス。ファイル名は含まず
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
 */
/** meta.code.typeの内容
 * @name values of meta.code.type
 * @memberof Doclet
 * @desc
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
 */
/** 「完全修飾名」の構造
 * @name structure of fully qualified name
 * @memberof Doclet
 * @desc
 * # 基本構造
 * 
 * `[トップレベル] (区切り記号 [子要素])*`
 * 
 * 例：
 * - `User#test`
 * - `module:auth~Config#timeout`
 * - `foo.age`
 * 
 * # 主な区切り記号と意味
 * 
 * | 記号 | 意味 | 用途 |
 * | :-- | :-- | :-- |
 * | . | 名前空間 / 静的・構造的所属 | オブジェクト・typedef |
 * | # | インスタンスメンバ | クラスの instance |
 * | ~ | 内部（inner）要素 | クロージャ・内部関数 |
 * | : | モジュール修飾子 | module 指定 |
 */
/** 調査：meta.path, meta.filenameが存在しない場合とは？ ⇒ kind="package"のみ
 * @name case of no meta.path/filename
 * @description
 * 
 * dev.step(99.01,v.doclets.filter(x => !x.meta?.filename || !x.meta?.path ))
 * 
 * == [0001]createSpec step.99.01 [
 *   {
 *     kind:"package", // string
 *     longname:"package:undefined", // string
 *     files:    [
 *       "/Users/ena.kaon/Desktop/GitHub/library/createSpec/1.0.0/sample/Schema.js", // string
 *       "/Users/ena.kaon/Desktop/GitHub/library/createSpec/1.0.0/sample/test.js", // string
 *       "/Users/ena.kaon/Desktop/GitHub/library/underDev/Auth/src/doc/jsrsasign-all-min.js", // string
 *       "/Users/ena.kaon/Desktop/GitHub/library/underDev/Auth/src/server/code.js", // string
 *       "/Users/ena.kaon/Desktop/GitHub/library/underDev/Auth/src/server/onOpen.js", // string
 *       "/Users/ena.kaon/Desktop/GitHub/library/underDev/Auth/src/server/serverFunc.js", // string
 *     ], // Array
 *   }
 * ], // Array
 */
/** commentが出力されないdoclet
 * @name patterns of no comment doclet
 * @description
 * - コードに JSDoc コメントが付いていない場合
 * - JSDoc が内部的に生成(ex. "module:",exportsの別名, etc)
 * - タグだけで生成されるdoclet(コメント本文が無い)
 *   ```
 *   ＠typedef {Object} User
 *   ＠property {string} name
 *   ```
 */


/** DocletEx: jsdocから出力されるDocletに情報を付加したもの
 * @class DocletEx
 * @desc メンバ各値の設定箇所は以下の通り。
 * - opt    ~ returns   : DocletEx.constructor()
 * - parent ~ familyTree: DocletTree.linkage()
 * - unique ~ commentId : DocletTree.registration()
 *   なおrangeId,linenoId,commentIdは同一Docletの重複登録回避に使用
 * 
 * @prop {string} uuid - DocletExを一意に識別するためのUUID
 * @prop {string} docletType - Docletの種類。下記「docletTypeの判定ロジック」参照
 * @prop {Object.<string, string>} parsed - Doclet内で定義されたタグの値
 *   例： parsed: {
 *     description:"method01: メソッドテスト", // string
 *     memberof:"class01", // string
 *     param:"{number} arg - method01の引数", // string
 *     returns:"{{qId:number,name:string}} NG: qId,name指定無しのObjectになる", // string
 *   }
 * @prop {string} label - 1行で簡潔に記述された概要説明
 *   ① JSDoc先頭の「/**」に続く文字列
 *   ② constructorは「(memberof.)constructor」
 *   ③ "＠name"に続く文字列
 *   ④ typdef, interface
 *   ⑤ description, classdescの先頭行(=concatenatedの先頭行)
 *   ⑥ v.doclet.longname
 *   ※ 上記に該当が無い場合、「(ラベル未設定)」
 * @prop {string} concatenated - description,classdesc,exmapleを出現順に結合。MD出力用
 * 
 * @prop {string} [parent=null] - 親要素のDocletEx.uuid
 * @prop {string[]} [children=[]] - 子要素(メソッド・内部関数)のDocletEx.uuid
 * @prop {string} familyTree - DocletEx.nameを連結した系図(親子関係)
 * 
 * @prop {string} [unique] - 固有パス
 *   ルートは'/'、子孫が有る場合先頭の'/'無し・末尾'/'有り(ex."common/subtest/")
 * 
 * @prop {string} [rangeId] - 固有パス＋ファイル名＋':R'＋meta.range[0]
 *   ※ Doclet以外のファイル情報が必要なため、DocletTree側で追加される項目
 * @prop {string} [linenoId] - 固有パス＋ファイル名＋':N'＋meta.lineno ※同上
 * @prop {string} [commentId] - 「固有パス＋ファイル名＋comment」のSHA256
 *   同一commentが同一ファイル内に複数有った場合は設定しない
 * 
 * === 以下削除分
 * @prop {string} name - 【書換】constructorの場合のみ固定値"constructor"に変更
 * @prop {string} longname - 【書換】constructorの場合のみ"#constructor"を追加
 * @prop {Object} opt - DocletExインスタンス作成時のオプション
 *   現状未使用
 * @prop {DocletColDef[]} [properties] - メンバ一覧
 * @prop {DocletColDef[]} [params] - 引数。クラスの場合はconstructorの引数(※同上)
 * @prop {DocletColDef[]} [returns=[]] - 戻り値(※同上)
 * @prop {string} [basename] - ファイル名
 * @prop {string} [prefix] - 固有パス＋ファイル名
 *   以下の各種IDの共通部分(固有パスの先頭・末尾の'/'有無処理済)
 */
class DocletEx {
  /** docletTypeの判定ロジック
   * @name decision logic of docletType
   * @memberof createSpec
   * @desc
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
   * - objectFunc(interface内function定義)　※書き方に関しては冒頭の記述例参照
   *   なおあくまでinterfaceなので、関数と同時にpropertiesも含む
   *   kind === 'function'
   *   && scope === 'instance'
   * - unknown(上記で判定不能)
   */
  /** docletType毎のlongname命名規則
   * @name "longname" naming rules
   * @memberof createSpec
   * @desc
   * 
   * - class: longnameそのまま使用
   *   "class: authClient"
   * - constructor: 
   *   - [モジュール名].exports.[エクスポート名]#[メンバー名]
   *     "constructor: authClient.exports.authClient#constructor"
   *     "constructor: Schema.exports.Schema#constructor"
   *   - [モジュール名]#[エクスポート名]#[メンバー名]
   *     "constructor: cryptoClient#cryptoClient#constructor"
   *   - [エクスポート名]#[メンバー名]
   *     "constructor: DocletEx#constructor"
   * - description: @nameの文字列。英文表記が望ましい。longnameは空白ありだがanchorは'%20'に要変更
   *   "description: config information"
   *   "description: 開発工程・残課題"
   * - function: longnameそのまま使用
   *   "function: localFunc"
   * - innerFunc: 親関数~関数名
   *   "innerFunc: createSpec~listSource"
   * - method: クラス名[#\.]メソッド名(通常'#',staticは'.')
   *   "method: authClient#_withStore"
   *   "method: authClient#exec"
   * - objectFunc: 後掲「メソッド・内部関数内関数」参照
   *   ＠memberof 無し -> "innerFunc: <anonymous>~dummyFunc"
   *   ＠memberof encrypt -> "objectFunc: encrypt.dummyFunc"
   *   ＠memberof cryptoClient#encrypt -> "objectFunc: cryptoClient#encrypt.dummyFunc"
   * - typedef: [所属クラス名.]データ型名
   *   "typedef: authClientConfig"
   *   "typedef: Schema.TypeDef"
   * 
   * # メソッド・内部関数内関数
   * 
   * - ＠memberof指定が無いと"<anonymous>"となる
   * - 適切に＠memberofを指定する
   * 
   * ```
   * class cryptoClient {
   *   /** ＠memberof cryptoClient *／
   *   encrypt(request) {
   *     /** ＠memberof cryptoClient#encrypt *／  <- クラス名#メソッド名
   *     const dummyFunc = (a,b) => a + b;
   * (中略)
   * function createSpec(){
   *   /** ＠memberof createSpec *／
   *   function determineType(){
   *     /** ＠memberof createSpec~determineType *／ <- クロージャ関数名~内部関数名
   *     const dummyFunc = (a,b) => a + b;
   * ```
   */

  /**
   * @constructor
   * @memberof DocletEx
   * @param {Doclet} doclet - 引数
   * @returns {DocletEx|{}|Error} 戻り値
   *   {}: kind="package"等、DocletTree登録対象外のdoclet
   */
  constructor(doclet) {
    const v = {whois:`DocletEx.constructor`, arg:{doclet}, rv:{}};
    const dev = new devTools(v,{mode:'pipe'});
    try {

      dev.step(1.1);  // 処理対象のdocletか判定
      if( doclet.kind === 'package' ) return v.rv;

      dev.step(1.2);  // comment, meta.path, meta.filename の存否チェック
      v.errorMsg = [];  // 個別チェック項目を一通りチェックしてからエラーを出せるよう配列化
      if( typeof doclet.meta?.path !== 'string' ) v.errorMsg.push(`Invalid meta.path`);
      if( typeof doclet.meta?.filename !== 'string' ) v.errorMsg.push(`Invalid meta.filename`);
      if( typeof doclet.meta?.lineno !== 'number' ) v.errorMsg.push(`Invalid meta.lineno`);
      if( typeof doclet.comment !== 'string' ) v.errorMsg.push(`Invalid comment`);
      if( typeof doclet.longname !== 'string' ) v.errorMsg.push(`Invalid longname`);

      if( v.errorMsg.length > 0 ){
        // チェック項目のいずれかでエラーが有った場合、後続処理はスキップ
        throw new Error(v.errorMsg.join('\n')+JSON.stringify(doclet,null,2));
      }

      dev.step(2.1);  // docletTypeを判定
      v.r = this.determineType(doclet);
      if( v.r instanceof Error ) throw v.r;
      if( v.r === 'unknown' ) return v.rv;

      dev.step(2.2);  // UUIDを採番
      doclet.uuid = randomUUID();

      // label(1行で簡潔に記述された概要説明)を作成

      // concatenatedを作成
      // description,classdesc,exmapleを出現順に結合。MD出力用

      dev.step(2);  // docletをDocletExのメンバとして登録
      v.cloneValue = value => {
        if (Array.isArray(value)) {
          return value.map(x => v.cloneValue(x));
        } else if (value !== null && typeof value === "object") {
          const obj = {};
          for (const k of Object.keys(value)) {
            obj[k] = v.cloneValue(value[k]);
          }
          return obj;
        } else {
          // 開発時にダンプした際の視認性向上のため、改行を'\\n'に置換
          return typeof value !== 'string' ? value :
            value.trim().replaceAll(/\n/g,'\\n');
        }
      }

      for( v.key of Object.keys(doclet) ){
        this[v.key] = v.cloneValue(doclet[v.key]);
      }

      dev.end(); // 終了処理
    } catch (e) { return dev.error(e); }
  }

  /** determineType: Docletの型を判定
   * @memberof DocletEx
   * @param {Object} doclet - 判定対象のdoclet
   * @returns {string|Error}
   */
  determineType(doclet) {
    const v = {whois:`${this.constructor.name}.determineType`, arg:{doclet}, rv:'unknown'};
    const dev = new devTools(v,{mode:'pipe'});
    try {

      dev.step(1);  // 原文が無い場合は判定不能
      // 原文が無い場合については「commentが出力されないdoclet」参照
      // これらは使用する可能性がほぼ無いので'unknown'とする。
      if( typeof doclet.comment === 'undefined' || doclet.comment.length === 0 )
        return 'unknown';

      dev.step(2);  // 「docletTypeの判定ロジック」参照
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

class DocletTree {
  /**
   * @constructor
   * @memberof DocletTree
   * @param {string} arg - `jsdoc -X`の実行結果(テキスト)
   * @returns {DocletTree|Error} 戻り値
   */
  constructor(arg) {
    const v = {whois:`DocletTree.constructor`, arg:{arg}, rv:null};
    const dev = new devTools(v,{mode:'pipe'});
    try {

      dev.step(1);
      v.doclets = JSON.parse(arg);
      this.doclets = [];
      this.commonPath = null;
      v.commonPrefix = (a, b) => { // 文字列a,bの先頭から一致する部分文字列を返す
        if( b === null ) return a;
        const len = Math.min(a.length, b.length);
        let i = 0; while (i < len && a[i] === b[i]) i++;
        return a.slice(0, i);
      }

      dev.step(2);  // DocletExインスタンス作成
      v.errorLog = [];  // 全docletsを一通りチェックしてからエラーを出せるよう配列化
      for( v.i=0 ; v.i<v.doclets.length ; v.i++ ){
        v.r = new DocletEx(v.doclets[v.i]);
        if( v.r instanceof Error ) v.errorLog.push(v.r.message);
        else if( Object.keys(v.r).length > 0 ){
          this.doclets.push(v.r);
          // パスの共通部分を更新
          this.commonPath = v.commonPrefix(v.r.meta.path,this.commonPath);
        }
      }
      if( v.errorLog.length > 0 ) throw new Error(v.errorLog.join('\n'));

      dev.end(); // 終了処理
    } catch (e) { return dev.error(e); }
  }

}