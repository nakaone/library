#!/usr/bin/env node
import path from 'path';
import process from 'process';
import { createHash, randomUUID } from 'crypto';
import { spawn } from "node:child_process";
import { writeFileSync, unlinkSync, mkdirSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { devTools } from '../../devTools/3.2.0/core.mjs';
import { mergeDeeply } from '../../mergeDeeply/2.0.0/core.mjs';
createSpec();

/** createSpec: JavaScriptソース内のJSDocを基に、Markdown形式の仕様書を生成
 * - 使用方法はcf.useageに記載(オプション無し起動時にコンソール表示)
 * 
 * @param {Object} [opt={}] - オプション設定
 * @param {string} [opt.encode="utf-8"] - 入力ファイルのエンコード
 * @param {string} [opt.jsdocJson="jsdoc.json"] - jsdocコマンド設定ファイル名
 *   jsdoc.jsonとdummyフォルダはプログラム中で作成・削除される作業用。
 *   詳細はDocletTree.execJSDoc参照
 * @param {string} [opt.dummyDir="./dummy"] - jsdoc用の空フォルダ
 * @returns {void}
 * 
 * @prop {Object} pv - createSpec内の共有変数(public variables。class定義のメンバに相当)
 *   `whois, arg, rv`はdevTools用、`r`他汎用変数は割愛
 * @prop {string[]} pv.argv - `node createSpec`実行時の引数
 * @prop {DocletTree} pv.tree - DocletTreeインスタンス
 * @prop {Object} cf - createSpec動作設定情報(config)
 *   command, useageの他、optのメンバを持つ(encode, jsdocJson, dummyDir)
 * @prop {string} cf.command - jsdocコマンドへのパス文字列
 * @prop {string} cf.useage - createSpec使用方法。起動時引数無しまたは'-h'指定時に表示
 * 
 * @description
 * 
 * # 用語集
 * 
 * - Doclet : JSDoc上「／** 〜 *／」までの部分。通常一つのファイルに複数存在。
 *   `jsdoc -X`の出力はArray.<Doclet>形式のJSONとなる。
 * - シンボル : クラス・関数・データ型定義。Markdownの仕様書上、最上位の分類
 * 
 * # 参考資料
 * 
 * - [データ型判定](https://docs.google.com/spreadsheets/d/1X_1u2xpCOHV2oeZxSvFVAxUNx2ast1JWLWOIT0sQpuU/edit?gid=0#gid=0)(Google Spread)
 * 
 * @history
 * - rev.1.0.0 : 2026/01/31
 *   specify.mjsを継承し、初版作成
 */
async function createSpec(opt={}){

  /** 開発工程・残課題
   * @name Development process and remaining issues
   * @memberof createSpec
   * @desc
   * 
   * - 開発用スクリプトサンプル(test.sh等)
   *   ```
   *   node $createSpec $src/(client|common|server|lib)/**／*.(js|mjs) \
   *                              最後のスラッシュは半角に戻す ^
   *   -o $tmp/createSpec -r $tmp/DocletTree.json \
   *   1> $tmp/createSpec/result.log 2> $tmp/createSpec/error.log
   *   ```
   * - 埋込指示子対応：<!--::command::{JSON}::-->
   *   - setvalue: オブジェクトに設定する値の一覧
   *     {type:データ型名, value:{キー:値,...}}
   *     戻り値への値設定を想定。指定無しならdefaultvalueを表示
   *   - embed: 他ファイルの内容を埋め込み
   *     {file:パス＋ファイル名}
   * - commentをdetailsタグで表示
   * 
   * - undocumentedチェックを追加
   * - 和文の他、英文のテンプレートも追加
   * - 文法チェック
   *   - ＠class の後に余計な文字列があればエラー
   * - createSpecはシェルの起動時パラメータを引数とする関数に変更
   * - 独自タグ「history」対応
   */

  const pv = {whois:`createSpec`, arg:{}, rv:null};
  const cf = {  // jsdocコマンド動作環境整備関係(config)
    encode: opt.encode ?? 'utf-8',  // 入力ファイルのエンコード
    jsdocJson: opt.jsdocJson ?? `jsdoc.json`,  // jsdocコマンド設定ファイル名
    dummyDir: opt.dummyDir ?? './dummy',  // jsdoc用の空フォルダ
    command: path.resolve('./node_modules/.bin/jsdoc'), // jsdocコマンド
    useage: `
      createSpec: JavaScriptソース内のJSDocを基に、Markdown形式の仕様書を生成
      
      useage: \`node createSpec.mjs [入力ファイル...] -o 出力フォルダ [-x 除外パターン ...] [-r 調査結果ファイル]\`
      
      - 入力側のフォルダに合わせて出力フォルダを作成
      - 一覧＋データ型定義のindex.md＋クラス・グローバル関数毎のMarkdownを作成
      - 調査結果ファイル：【開発用】DocletTreeインスタンスのJSON等
        ※ 開発用調査なので、出力内容はcreateSpec.step.4で適宜編集のこと
      - 詳細は後掲「入出力イメージ」の項を参照
      
      # 使用上の注意
      
      - 処理対象は'.js','.mjs','.gs','.txt'
      - ワイルドカード関係の注意
        - クォートすると展開されない(src/*.jsはOKだが"src/*.js"は不展開)
        - *.js # 任意文字列
        - ?.js # 1文字
        - [a-z].js # 文字クラス
        - **\/*.js # 再帰glob(src/a.js, src/lib/x.js, test/foo.js)
      - 動作時devTools(3.0.0~), mergeDeeply(2.0.0~)が必要
      - JSDoc記述上の注意については proto.source.mjs 参照

      # 入出力イメージ
      
      \`\`\`入力側サンプル
      ├── client
      │   ├── authClient.mjs
      │   └── cryptoClient.mjs
      ├── common
      │   ├── authConfig.mjs
      │   └── subtest
      │       └── createSpec.mjs
      └── server
          ├── authServer.mjs
          ├── cryptoServer.mjs
          └── Member.mjs
      \`\`\`
      
      \`\`\` 出力側サンプル
      ├── client
      │   ├── index.md  <- グローバル関数・クラス一覧＋データ型定義
      │   ├── authClient.md
      │   ├── clearAuthEnvironment.md <- authClient.mjs内で宣言されたグローバル関数
      │   └── cryptoClient.md
      ├── common
      │   ├── index.md
      │   ├── authConfig.md
      │   └── subtest
      │       ├── createSpec.md <- クラス毎に別ファイル化
      │       ├── DocletEx.md
      │       └── PropList.md
      └── server
          ├── authServer.md
          ├── cryptoServer.md
          └── Member.md
      \`\`\`
    `.replaceAll(/\n      /g,'\n'),
  };
  const dev = new devTools(pv,{mode:'pipe',footer:true});

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
  /** DocletEx: jsdocから出力されるDocletに情報を付加したもの
   * @class
   * @memberof createSpec
   * @desc メンバ各値の設定箇所は以下の通り。
   * - opt    ~ returns   : DocletEx.constructor()
   * - parent ~ familyTree: DocletTree.linkage()
   * - unique ~ commentId : DocletTree.registration()
   * 
   * @prop {string} name - 【書換】constructorの場合のみ固定値"constructor"に変更
   * @prop {string} longname - 【書換】constructorの場合のみ"#constructor"を追加
   * @prop {Object} opt - DocletExインスタンス作成時のオプション
   *   現状未使用
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
   * @prop {DocletColDef[]} [properties] - メンバ一覧
   * @prop {DocletColDef[]} [params] - 引数。クラスの場合はconstructorの引数(※同上)
   * @prop {DocletColDef[]} [returns=[]] - 戻り値(※同上)
   * 
   * @prop {string} [parent=null] - 親要素のDocletEx.uuid
   * @prop {string[]} [children=[]] - 子要素(メソッド・内部関数)のDocletEx.uuid
   * @prop {string} familyTree - DocletEx.nameを連結した系図(親子関係)
   * 
   * @prop {string} [unique] - 固有パス
   *   ルートは'/'、子孫が有る場合先頭の'/'無し・末尾'/'有り(ex."common/subtest/")
   * @prop {string} [basename] - ファイル名
   * @prop {string} [prefix] - 固有パス＋ファイル名
   *   以下の各種IDの共通部分(固有パスの先頭・末尾の'/'有無処理済)
   * @prop {string} [rangeId] - 固有パス＋ファイル名＋':R'＋meta.range[0]
   *   ※ Doclet以外のファイル情報が必要なため、DocletTree側で追加される項目
   * @prop {string} [linenoId] - 固有パス＋ファイル名＋':N'＋meta.lineno ※同上
   * @prop {string} [commentId] - 「固有パス＋ファイル名＋comment」のSHA256
   *   同一commentが同一ファイル内に複数有った場合は設定しない
   */
  class DocletEx {
    /**
     * @constructor
     * @memberof DocletEx
     * @param {Doclet} doclet
     * @param {Object} [opt={}] - オプション設定値
     */
    constructor(doclet,opt={}){
      const v = {whois:`DocletEx.constructor`,arg:{doclet,opt},rv:null,tag:{},tags:[]};
      const dev = new devTools(v,{mode:'pipe'});
      try {

        dev.step(1);  // オリジナルのメンバをコピー
        Object.keys(doclet).forEach(x => this[x] = doclet[x]);

        dev.step(2);  // オプション設定
        this.opt = opt;

        dev.step(3);  // 独自ID
        this.uuid = randomUUID();

        dev.step(4);  // docletType
        dev.step(4.1);  // docletTypeの判定
        this.docletType = this.determineType(doclet);
        if( this.docletType instanceof Error) throw this.docletType;
        dev.step(4.2);  // 特定docletTypeの対応
        if( this.docletType === 'constructor' ){
          this.name = "constructor"
          this.longname += "#constructor";
        }

        dev.step(5);    // commentをパース、concatenatedを作成
        this.label = '';
        this.parsed = {};
        v.descTags = ['description','classdesc','example'];
        if( Object.hasOwn(doclet,'comment') && doclet.comment.length > 0 ){
          dev.step(5.1);  // ＠タグ毎に分割して{タグ名：内容}形式でv.tags配列に格納
          doclet.comment.match(/^([\s\S]+)\s*\*\//)[1]  // コメント末尾の「＊/」削除
            .trim().split('\n').forEach(l => {          // 行単位に分割して順次処理
            if( v.m = l.match(/^\/\*\*+\s*(.+)/) ){
              dev.step(5.11); // 「／**」に続く文字列はラベルと看做す
              this.label = v.m[1];
              v.tag = {label:'description',text:''};
            } else if( v.m = l.match(/^\s+\*\s+@([a-zA-Z]+)\s*(.*)/) ){
              dev.step(5.12); // 前行と異なる＠タグが出現したら前行までの結果を保存して新たなv.tagを作成
              if( Object.hasOwn(v.tag,'label') && !(v.tag.label === 'description' && v.tag.text === '') ){
                v.tags.push(v.tag); // v.tagに有効な＠タグ情報が入っている場合は格納
              }
              v.tag = {label:v.m[1],text:(v.m[2] ?? '')};
              // 短縮形のタグ名は正式な形に統一
              if( v.tag.label === 'desc' ) v.tag.label = 'description';
              if( v.tag.label === 'prop' ) v.tag.label = 'property';
            } else {
              dev.step(5.13); // 「／**」でも＠タグ行でも無い場合、前行までの結果に追加
              v.tag.text += '\n' + ((v.m = l.match(/^\s+\*\s(.*)/)) === null ? l : v.m[1]);
              // 行頭" * "のマッチでは'*'後のスペースはインデントを崩さないよう1文字のみ
            }
          });
          if( Object.hasOwn(v.tag,'label') && !(v.tag.label === 'description' && v.tag.text === '') ){
            v.tags.push(v.tag); // 最終のタグを登録
          }

          dev.step(5.2);  // 対象タグの説明文は出現順に、concatenatedに順次追加
          this.concatenated = '';
          v.tags.forEach(x => {
            // 出現したタグをthis.parsedに登録
            this.parsed[x.label] = (Object.hasOwn(this.parsed,x.label)
            ? (this.parsed[x.label] + '\n') : '') + x.text;
            // 対象タグはthis.concatenatedにも追加
            if( v.descTags.includes(x.label) ) this.concatenated += `\n${x.text}`;
          });

        } else {
          dev.step(5.3);  // commentが無い場合、存在する@description,@classdesc,@example を設定
          v.descTags.forEach(x => this.concatenated += (doclet[x] ?? ''));
        }
        this.concatenated = this.concatenated.trim();

        dev.step(6);  // labelを設定
        if( this.label !== '' ){
          dev.step(6.1);  // ① JSDoc先頭の「/**」に続く文字列(⇒step.5.11で設定済)
        } else if( this.docletType === 'constructor' ){
          dev.step(6.2);  // ② constructorは「(memberof.)constructor」
          this.label = (this.parsed.memberof ? this.parsed.memberof+'.' : '')
          + 'constructor';
        } else if( Object.hasOwn(this.parsed,'name') ){
          dev.step(6.3);  // ③ "@name"に続く文字列
          this.label = this.parsed.name;
        } else if( Object.hasOwn(this.parsed,'typedef') ){
          dev.step(6.41); // ④ typdef, interface
          // `@typedef {...} xxx - 説明`形式 ⇒ label=説明
          v.m1 = this.parsed.typedef.match(/\}\s+[^\-]+\s+\-\s+(.+)$/);
          // `@typedef {...} xxx`形式 ⇒ label=xxx
          v.m2 = this.parsed.typedef.match(/\}\s+(.+)$/);
          this.label = v.m1 !== null ? v.m1[1]
            : (v.m2 !== null ? v.m2[1] : '(ラベル未設定)');
        } else if( Object.hasOwn(this.parsed,'interface') ){
          dev.step(6.42);
          this.label = this.parsed.interface;
        } else if( this.concatenated.length > 0 ){
          dev.step(6.5);  // ⑤ description, classdescの先頭行(=concatenatedの先頭行)
          this.label = this.concatenated.split(/<br>|\n/)[0];
        } else if( Object.hasOwn(doclet,'longname') ){
          dev.step(6.6);  // ⑥ doclet.longname
          this.label = doclet.longname;
        }
        dev.step(6.7);  // ラベルの先頭に「名称：」が有った場合、nameが重複するので削除
        if( Object.hasOwn(this,'name') ){
          v.rex = new RegExp(`^${this.name}[:：]\s*(.+)`);
          this.label = v.rex.test(this.label) ? this.label.match(v.rex)[1] : this.label;
        }
        this.label = this.label.trim();

        dev.step(7);  // properties
        if( Object.hasOwn(doclet,'properties') && doclet.properties.length > 0 ){
          doclet.properties.forEach(prop => {
            v.r = this.addRowToColumn(prop);
            if( v.r instanceof Error ) throw v.r;
            prop.row = v.r;
          });
        }

        dev.step(8);  // params
        if( Object.hasOwn(doclet,'params') && doclet.params.length > 0 ){
          doclet.params.forEach(prop => {
            v.r = this.addRowToColumn(prop);
            if( v.r instanceof Error ) throw v.r;
            prop.row = v.r;
          });
        }

        dev.step(9);  // returns
        if( Object.hasOwn(doclet,'returns') && doclet.returns.length > 0 ){
          doclet.returns.forEach(prop => {
            v.r = this.addRowToColumn(prop);
            if( v.r instanceof Error ) throw v.r;
            prop.row = v.r;
          });
        }

        dev.end();

      } catch (e) { return dev.error(e); }
    }

    /** addRowToColumn: データ項目情報から一覧作成用情報を作成
     * データ項目情報：Doclet.properties/params/returnsの各要素。配列では無くオブジェクト
     * @memberof DocletEx
     * @param {DocletColDef} prop - データ項目情報
     * @returns {DocletColRow|Error}
     */
    addRowToColumn(prop,opt={}){
      const v = {whois:`${this.constructor.name}.addRowToColumn`, arg:{prop}, rv:{}};
      const dev = new devTools(v,{mode:'pipe'});
      try {

        dev.step(1);  // オプションの既定値設定
        opt = mergeDeeply({
          lang: 'ja-JP',
          value: {
            'ja-JP': {undef:'未定義',optional:'任意',required:'必須'},
            'default': {undef:'undefined',optional:'optional',required:'required'},
          }
        },opt);
        if( opt instanceof Error ) throw opt;

        dev.step(2);  // 項目名
        v.rv.name = prop.name;

        dev.step(3);  // データ型
        v.rv.type = prop.type.names // "Array.<xxx>"は"xxx[]"に変換
          .map(x => x.replace(/^Array\.<\s*(.+?)\s*>$/, '$1[]').trim())
          .join(' \\| ');

        dev.step(4);  // 要否/既定値
        v.rv.value = Object.hasOwn(prop,'defaultvalue')
        ? ( // 既定値指定有り ⇒ prop.defaultvalue
          prop.defaultvalue === null ? 'null' : (
          prop.defaultvalue === false ? 'false' : prop.defaultvalue)
        ) : ( // 既定値指定無し
          prop.optional === true  // 任意項目？
          ? opt.value[opt.lang].optional : opt.value[opt.lang].required);

        dev.step(5);  // 説明・備考
        // 当初「説明(1行目)」「備考(2行目以降)」と分けたが、見づらいので全て説明に統合
        v.rv.desc = (prop.description ?? '').replaceAll(/\n/g,'<br>').replaceAll(/\|/g,'\\|').trim();
        v.rv.note = '';

        dev.end(); // 終了処理
        return v.rv;
      } catch (e) { return dev.error(e); }
    }

    /** determineType: Docletの型を判定
     * @memberof DocletEx
     * @param {Object} doclet
     * @returns {string|Error} 「docletTypeの判定ロジック」参照
     */
    determineType(doclet) {
      const v = {whois:`${this.constructor.name}.determineType`, arg:{doclet}, rv:'unknown'};
      const dev = new devTools(v,{mode:'pipe'});
      try {

        /** dummyFunc: テスト用ダミー関数
         * @memberof determineType
         * @param {number} a 
         * @param {number} b 
         * @returns {number}
         */
        function dummyFunc(a,b){return a+b};
        v.dummyFunc = `l.621 DocletEx.determineType.dummyFunc=${dummyFunc(10,20)}`;

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

  /** DocletTreeFile: 個別入力ファイル情報
   * @typedef {Object} DocletTreeFile
   * @memberof createSpec
   * @prop {string} full - フルパス＋ファイル名
   * @prop {string} unique - 固有パス(フルパス−共通部分)
   *   ルートは'/'、子孫が有る場合先頭の'/'無し・末尾'/'有り(ex."common/subtest/")
   * @prop {string} basename - ファイル名
   * @prop {string} content - ファイルの内容
   * @prop {Doclet[]} jsdoc - `jsdoc -X`の実行結果オブジェクト
   */
  /** DocletTreeSource: 統合版入力ファイル(JSソース)情報
   * @typedef {Object} DocletTreeSource
   * @memberof createSpec
   * @prop {string} [common=''] - フルパスの共通部分
   * @prop {string} [outDir=''] - 出力先フォルダ名(フルパス)
   * @prop {number} [num=0] - 対象ファイルの個数
   * @prop {DocletTreeFile[]} [files=[]] - 対象ファイルの情報
   * @prop {string} [research] - 調査結果ファイル名(=DocletTreeのJSON)
   */
  /** DocletTreeFolder: パス毎の所属Doclet管理(フォルダ管理)
   * @class DocletTreeFolder
   * @memberof createSpec
   * @prop {string} folderName
   * @prop {Object.<string, DocletEx>} funclass - グローバル関数・クラス定義(key=DocletEx.uuid)
   * @prop {Object.<string, DocletEx>} typedef - データ型定義(key=DocletEx.uuid)
   * @prop {Object.<string, DocletTreeFolder>} children - 子フォルダ。キーはフォルダ名
   */
  /** DocletTreeSymbol: クラス・グローバル関数名・データ型定義名から参照先URLへの変換情報
   * - 作成はDocletTree.registration内で行う
   * @interface DocletTreeSymbol
   * @memberof createSpec
   * @prop {string} name - クラス・グローバル関数名・データ型定義名
   * @prop {RegExp} rex - 名称を含むかを判定する正規表現
   * @prop {string} link - 参照先URL(aタグ)を付けた名称
   */
  /** DocletTreeOpt: オプション設定値
   * @typedef {Object} DocletTreeOpt
   * @memberof createSpec
   * @prop {Object.<string, string>} title - Markdown文書のタイトル行
   * @prop {string} [lang='ja-JP'] - 使用言語
   * @prop {string} [indexMd='index.md'] - フォルダ直下の管理ファイル名
   * @prop {Object.<string, Object[]>} [propHeader] - 項目一覧テーブルのヘッダ定義
   *   Object = {key,label,align}
   * @prop {Object.<string, Object[]>} [returnHeader] - 戻り値テーブルのヘッダ定義
   *   Object = {key,label,align}
   * @prop {string} [jsdocJson="jsdoc.json"] - jsdoc設定ファイル名
   * @prop {string} [dummyDir="./dummy"] - ダミーディレクトリ名
   * @prop {string} [jsdocTarget=".+\\.(js|mjs|gs|txt)$"] - jsdoc処理対象ファイル名の正規表現
   */
  /** DocletTree: 処理対象ソース・Docletの全体構造を管理
   * @class DocletTree
   * @memberof createSpec
   * @prop {DocletTreeSource} source - 処理対象となるソースファイル
   * @prop {DocletEx[]} doclet - 独自情報を付加したDocletExの配列
   * @prop {Object.<string, DocletEx>} map - 各種IdをキーにしたDocletExのマップ(命名はregistration()内)
   *   - SHA256: 固有パス＋ファイル名＋commentのハッシュ
   *   - 〜:N〜 : 固有パス＋ファイル名＋linenoId
   *   - 〜:R〜 : 固有パス＋ファイル名＋range[0]
   *   - 〜::〜 : 固有パス＋ファイル名＋longname
   *   - その他 : クラス・グローバル関数名、データ型名
   * @prop {Object.<string, DocletTreeFolder>} folder - パス毎の所属Doclet管理。キーはフォルダ名
   * @prop {Object.<string, DocletTreeSymbol>} symbols - クラス・グローバル関数名・データ型定義名から参照先URLへの変換情報
   * @prop {DocletTreeOpt} [opt={}] - オプション設定値
   */
  class DocletTree {
    static symbols = {};
    /**
     * @constructor
     * @memberof DocletTree
     * @param {DocletTreeSource} arg - 入力ファイル(JSソース)情報
     * @param {*} opt 
     * @returns {DocletTree}
     */
    constructor(arg,opt={}){
      const v = {whois:`DocletTree.constructor`, arg:{arg,opt}, rv:null};
      const dev = new devTools(v,{mode:'pipe'});
      try {

        this.source = {
          common: arg.common ?? '',
          outDir: arg.outDir ?? '',
          num:    arg.num ?? 0,
          files:  arg.files ?? [],
          research: arg.research ?? '',
        };
        this.doclet = [];
        this.map = {};
        this.folder = this.makeFolder('/');
        this.symbols = {};
        this.opt = Object.assign({title:{}},opt);
        // Markdown文書のタイトル行の既定値(deepcopyなので個別)
        this.opt.title = Object.assign({
          // '_'をDocletEx.nameで置換
          typedef: '_データ型定義',
          interface: '_データ型定義',
          class: '_クラス仕様書',
          constructor: 'constructor()',
          method: '_()',
          function: '_()',
          innerFunc: '_()',
          objectFunc: '_()',
          description: '_',
          unknown: '_',
        },(opt.title ?? {}));
        this.opt.lang = opt.lang ?? 'ja-JP'; // 使用言語
        //Intl.DateTimeFormat().resolvedOptions().locale;
        this.opt.indexMd = 'index.md';  // 各フォルダ直下に作成する管理ファイル名
        this.opt.propHeader = {  // 項目一覧テーブルのヘッダ
          'ja': [
            {key:'name',label:'項目名',align:':--'},
            {key:'type',label:'データ型',align:':--'},
            {key:'value',label:'要否/既定値',align:':--'},
            {key:'desc',label:'説明',align:':--'},
            {key:'note',label:'備考',align:':--'},
          ],
          'en': [
            {key:'name',label:'name',align:':--'},
            {key:'type',label:'type',align:':--'},
            {key:'value',label:'value',align:':--'},
            {key:'desc',label:'description',align:':--'},
            {key:'note',label:'note',align:':--'},
          ],
        }[['ja','ja-JP'].includes(this.opt.lang) ? 'ja' : 'en'];
        this.opt.returnHeader = {  // 戻り値テーブルのヘッダ
          'ja': [
            {key:'type',label:'データ型',align:':--'},
            {key:'desc',label:'説明',align:':--'},
            {key:'note',label:'備考',align:':--'},
          ],
          'en': [
            {key:'type',label:'type',align:':--'},
            {key:'desc',label:'description',align:':--'},
            {key:'note',label:'note',align:':--'},
          ],
        }[['ja','ja-JP'].includes(this.opt.lang) ? 'ja' : 'en'];
        this.opt.jsdocJson = opt.jsdocJson ?? "jsdoc.json"; // jsdoc設定ファイル名
        this.opt.dummyDir = opt.dummyDir ?? "./dummy";  // ダミーディレクトリ名
        this.opt.jsdocTarget = opt.jsdocTarget ?? ".+\\.(js|mjs|gs|txt)$"; // jsdocの動作対象となるファイル名

        dev.end(); // 終了処理
      } catch (e) { return dev.error(e); }
    }

    /** article: タイトル行＋記事のMarkdown文字列作成
     * @memberof DocletTree
     * @param {Object} arg
     * @param {string} arg.title - タイトルの文字列
     * @param {number} [arg.level=1] - タイトル行のレベル
     * @param {string} [arg.url] - タイトル行からのリンク(飛び先のURL)
     * @param {string} [arg.anchor] - アンカー文字列
     * @param {string} arg.content - 本文
     * @returns {string|Error}
     */
    article(arg){
      const v = {whois:`${this.constructor.name}.article`, arg:{arg}, rv:[]};
      const dev = new devTools(v,{mode:'pipe'});
      try {

        dev.step(1);  // 事前準備
        if( !arg.title ) throw new Error('no title');
        if( !arg.level ) arg.level = 1;

        dev.step(2);  // アンカーの設定
        if( Object.hasOwn(arg,'anchor') && arg.anchor.length > 0 ){
          arg.title = `<span id="${arg.anchor}">${arg.title}</span>`;
        }

        dev.step(3);  // リンクの設定
        if( Object.hasOwn(arg,'url') && arg.url.length > 0 ){
          arg.title = `<a href="${arg.url}">${arg.title}</a>`;
        }

        dev.step(4);  // タイトルを戻り値に保存
        v.rv.push('',`${'#'.repeat(arg.level)} ${arg.title}`);

        dev.step(5);  // 本文を戻り値に保存
        if( Object.hasOwn(arg,'content') && arg.content.length > 0 ){
          // タイトルのレベルに合わせて記事内のタイトルのレベルをシフト
          v.rv.push('',arg.content
            //.replaceAll(/^#/g,'#'.repeat(arg.level+1))
          );
        }

        v.rv = v.rv.join('\n');
        dev.end(); // 終了処理
        return v.rv;
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
      if( !existsSync(this.opt.jsdocJson) ){
        writeFileSync(this.opt.jsdocJson,JSON.stringify({source:{
          include:[this.opt.dummyDir],
          includePattern: this.opt.jsdocTarget // 対象ファイル名の正規表現
        }}));
      }

      dev.step(1.2);  // ダミーディレクトリを作成
      if( !existsSync(this.opt.dummyDir) ) mkdirSync(this.opt.dummyDir);

      // step.2 : jsdocの実行
      return new Promise((resolve, reject) => {
        const v = {whois:`${this.constructor.name}.promise`, arg:{fn,resolve, reject}, rv:null};
        const dev = new devTools(v,{mode:'pipe'});

        dev.step(2.1);  // jsdoc -X を子プロセスとして起動
        v.p = spawn("jsdoc", [fn,'--configure',this.opt.jsdocJson,'-X'], {
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
            reject(new Error(`Failed to parse JSON: ${err.message}\nfilename: ${fn}\n${v.output}`));
          } finally {
            dev.end();
          }
        });
      });
    }

    /** initialize: DocletTreeインスタンス作成
     * @memberof DocletTree
     * @param {DocletTreeSource} arg - 入力ファイル(JSソース)情報
     * @param {DocletTreeOpt} [opt={}] - オプション
     * @returns {DocletTree|Error}
     */
    static async initialize(arg,opt={}){
      const v = {whois:`DocletTree.initialize`, arg:{arg,opt}, rv:null};
      const dev = new devTools(v,{mode:'pipe'});
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

        dev.step(3);  // DocletExを生成
        for( v.i=0 ; v.i<v.rv.source.files.length ; v.i++ ){
          v.file = v.rv.source.files[v.i];
          for( v.j=0 ; v.j<v.file.jsdoc.length ; v.j++ ){

            dev.step(3.1);  // DocletExインスタンス作成
            v.r = new DocletEx(v.file.jsdoc[v.j]);
            if( v.r instanceof Error ) throw v.r;

            dev.step(3.2);  // 重複登録チェック＋マップ登録
            v.r = v.rv.registration(v.r,v.file);
            if( v.r instanceof Error ) throw v.r;
          }
        }

        dev.step(4);  // Docletの親子関係関連付け
        v.r = v.rv.linkage();
        if( v.r instanceof Error ) throw v.r;

        dev.end(); // 終了処理
        return v.rv;
      } catch (e) { return dev.error(e); }
    }

    /** linkage: Doclet相互間の連携
     * - 要素間の親子関係を特定(parent<->children)
     *   メソッド⇒クラス、内部関数⇒グローバル関数、等
     *   1. child.memberof === parent.longname
     *   2. child.rangeが包含されている直近の要素
     * - 項目一覧のデータ型からindex.md#個別データ型へのリンク作成
     * @memberof DocletTree
     * @param {void}
     * @returns {void}
     */
    linkage(){
      const v = {whois:`${this.constructor.name}.linkage`, arg:{}, rv:null};
      const dev = new devTools(v,{mode:'pipe'});
      try {

        dev.step(1);  // データ型名->個別データ型定義のURLマップ作成
        v.searchTypedef = (folder,rv={}) => {
          Object.keys(folder.typedef).forEach(uuid => {
            // ①URLを作成
            v.url = (this.map[uuid].unique
            + '/' + this.opt.indexMd
            + '#' + this.map[uuid].name)
            .replace(/^\/*/,'');  // 先頭の'/'は削除
            // ②未登録なら新規登録、登録済ならnullを設定
            rv[this.map[uuid].name] = Object.hasOwn(
              rv,this.map[uuid].name) ? null : v.url;
            // ③子フォルダを再帰呼出
            Object.keys(folder.children).forEach(x =>
              v.searchTypedef(folder.children[x],rv));
          });
        }
        v.searchTypedef(this.folder,(v.typedef={}));

        dev.step(1.3);  // データ型定義->リンク付きへの変換用作業マップ
        v.typedefList = Object.keys(v.typedef).map(x => {return {
          name: x, // データ型名
          rex:  new RegExp(x,'g'),  // 正規表現
          url:  `<a href="${v.typedef[x]}">${x}</a>`, // 置換文字列
        }});

        for( v.i=0 ; v.i<this.doclet.length ; v.i++ ){

          v.d = this.doclet[v.i];
          if( v.d.docletType === 'unknown' ) continue;

          // --------------------------------
          // 親子関係関連付け(parent,children)
          // --------------------------------
          dev.step(2);  // parent, childrenの初期値設定
          if( !Object.hasOwn(v.d,'parent') ) v.d.parent = null;
          if( !Object.hasOwn(v.d,'children') ) v.d.children = [];

          dev.step(3);  // ①子要素を包摂する直近の要素
          if( typeof v.d.meta?.range !== 'undefined' ){
            v.minSize = Infinity;
            for( v.t of this.doclet ){
              dev.step(3.1);  // 比較元=比較先またはrangeが無ければスキップ
              if( v.d === v.t || !v.t.meta?.range || v.d.prefix !== v.t.prefix ) continue;
              dev.step(3.2);  // 比較元の開始・終了位置が比較先の開始・終了位置の範囲内か判定
              if( v.t.meta.range[0] <= v.d.meta.range[0] && v.d.meta.range[1] <= v.t.meta.range[1] ){
                dev.step(3.3);  // 比較先の終了位置−開始位置が最小のものが直近
                v.size = v.t.meta.range[1] - v.t.meta.range[0];
                if( v.size < v.minSize ){
                  v.minSize = v.size;
                  v.d.parent = v.t.uuid; // 比較先を比較元の親要素として設定
                }
              }
            }
          }

          dev.step(4);  // ②：①で決まらない場合「child.memberof === parent.nameかつ固有パス一致」で判定
          if( v.d.parent === null && Object.hasOwn(v.d,'memberof') ){
            // memberofは親子のnameが連結されている場合がある
            // ex. "createSpec.DocletEx"
            // ⇒ memberofの最後の部分とparent.nameで比較
            v.m = v.d.memberof.match(/[.#~]([^.#~]+?)$/);
            v.m = v.m === null ? v.d.memberof : v.m[1];
            v.t = this.doclet.find(x => x.name === v.m && x.unique === v.d.unique);
            if( v.t !== undefined ) v.d.parent = v.t.uuid;
          }

          dev.step(5);  // 親要素のchildrenに比較元を登録
          if( v.d.parent !== null ){
            if( Object.hasOwn(this.map[v.d.parent],'children') ){
              this.map[v.d.parent].children.push(v.d.uuid);
            } else {
              this.map[v.d.parent].children = [v.d.uuid];
            }
          }

          // --------------------------------
          // 項目一覧のデータ型から
          // index.md個別データ型定義へのリンク
          // --------------------------------
          dev.step(6);
          ['properties','params','returns'].forEach(prop => {
            if( Object.hasOwn(v.d,prop)){
              v.d[prop].forEach(col => {  // 項目毎の処理
                v.typedefList.forEach(x => {  // 独自定義のデータ型が有れば置換
                  col.row.type = col.row.type.replaceAll(x.rex,x.url);
                });
              });
            }
          });
        }

        // --------------------------------
        // 系図(familyTree)作成
        // ※実行には全ての親子関係確定が前提
        // --------------------------------
        v.searchParent = doclet => {
          dev.step(7.1);  // 親子関係調査(再帰)関数の定義
          if( !Object.hasOwn(doclet,'name') ){
            return new Error(`no "name" property: ${JSON.stringify(doclet)}`);
          }
          dev.step(7.2);
          const rv = [doclet.name];
          if( Object.hasOwn(doclet,'parent') && Object.hasOwn(this.map,doclet.parent) ){
            const r = v.searchParent(this.map[doclet.parent]);
            if( r instanceof Error ) return r;
            if( Array.isArray(r) )  rv.unshift(...r);
          }
          return rv;
        }

        dev.step(7.3);  // 親子関係をfamilyTree属性にセット
        for( v.i=0 ; v.i<this.doclet.length ; v.i++ ){

          v.d = this.doclet[v.i];
          if( v.d.docletType === 'unknown' ) continue;

          v.d.familyTree = v.searchParent(v.d);
          if( v.d.familyTree instanceof Error ) throw v.d.familyTree;
          if( Array.isArray(v.d.familyTree) ){
            v.d.familyTree = v.d.familyTree.join('-');
          }
        }

        dev.end(); // 終了処理
        return v.rv;

      } catch (e) { return dev.error(e); }
    }

    /** makeDocletMD: 単一DocletExのインスタンスからMarkdownを作成
     * @memberof DocletTree
     * @param {string} [uuid=this.uuid] - 対象DocletEx.uuid
     * @param {number} [level=1] - 階層の深さ
     * @returns {string|Error}
     */
    makeDocletMD(uuid,level=1) {
      const v = {whois:`${this.constructor.name}.makeDocletMD`, arg:{uuid,level}, rv:[]};
      const dev = new devTools(v,{mode:'pipe'});
      /**
       * @name 文書の構成
       * @memberof makeDocletMD
       * @description
       * 
       * | 項目名      | ①クラス<br>・関数 | ②データ型 | ③説明文 | 識別子 | 備考 |
       * | :--        | :--: | :--: | :--: | :-- | :-- |
       * | ヘッダ部    |    |    |   | _top |  |
       * | — タイトル  | ⭕ | ⭕ | ⭕ |         | ○○クラス(データ型)仕様書、等 |
       * | — ラベル    | ⭕ | ⭕ | ❌ |         | 一行にまとめた説明。継承が有る場合はここに記載 |
       * | メンバ一覧  | ⭕ | ⭕ | ❌ | _prop    |  |
       * | メソッド一覧 | ⭕ | ❌ | ❌ | _func   |  |
       * | 詳細説明    | ⭕ | ❌ | ❌ | _desc   |  |
       * | 引数       | ⭕ | ❌ | ❌ | _param   |  |
       * | 戻り値      | ⭕ | ❌ | ❌ | _return |  |
       * | 個別メソッド | ⭕ | ⭕ | ❌ | -XXXX   | 注意：'_'ではなく'-' |
       * 
       * ①クラス・(グローバル)関数
       *   docletType = 'class', 'constructor', 'method', 'function', 'innerFunc', 'objectFunc'
       * ②データ型
       *   docletType = 'typedef', 'interface'
       * ③説明文
       *   docletType = 'description'
       */
      try {

        dev.step(1);  // 事前準備
        v.d = this.map[uuid];
        v.anchor = v.d.familyTree;

        dev.step(2);  // ヘッダ部
        v.label = '';
        dev.step(2.1);  // 継承が有った場合、継承元情報を付記
        if( Object.hasOwn(v.d,'augments') ){
          v.augments = [];
          v.d.augments.forEach(augment => {
            // 継承元へのURLを取得
            v.extended = Object.hasOwn(this.map,augment) && this.map[augment] !== null
            ? this.map[augment] : null;
            if( v.extended === null ){
              // URL取得不能の場合はリンクを設定しない
              v.augments.push(augment);
            } else {
              // リンク先URLの作成
              // function or class -> 固有パス＋name.md
              // typedef or interface -> 固有パス＋index.md＋#name
              v.depth = v.extended.unique === '/' ? 1
                : v.extended.unique.replace(/\/$/,'').split('/').length;
              v.url = '../'.repeat(v.depth) + v.extended.unique + (
                ['function','class'].includes(v.extended.docletType)
                ? v.extended.name + '.md'
                : this.opt.indexMd + '#' + v.extended.name
              );
              v.augments.push(`<a href="${v.url}">${augment}</a>`);
            }
          });
          v.label = `継承元：${v.augments.join(', ')}<br>`
        }

        dev.step(2.2);  // 出典(ソースファイルの位置)
        if( ['function','class','typedef','interface'].includes(v.d.docletType) ){
          v.label += `<p class="source">source: ${
            v.d.unique ?? ''}${
            v.d.meta?.filename ?? v.d.basename} ${
            typeof v.d.meta?.lineno === 'number' ? `line.${v.d.meta.lineno}` : ''
          }</p>`;
        }

        dev.step(2.3);  // ラベル文字列
        v.label += v.d.label;

        dev.step(2.4);  // 記事作成
        v.r = this.article({
          title: `🧩 ${this.opt.title[v.d.docletType].replace('_',v.d.name)}`,
          level: level,
          url: '',
          anchor: `${v.anchor}_top`,
          content: v.label.trim(),
        });
        if( v.r instanceof Error ) throw v.r;
        v.rv.push('',v.r);;

        dev.step(3); // メンバ一覧
        if( Object.hasOwn(v.d,'properties') && v.d.properties.length > 0 ){
          v.data = v.d.properties.map(x => x.row);
          v.opt = {header:JSON.parse(JSON.stringify(this.opt.propHeader))};
          // 備考欄が全て空白なら割愛
          if( v.data.map(x => x.note).every(x => x === '') ){
            v.opt.header = v.opt.header.filter(x => x.key !== 'note');
          }
          v.r = DocletTree.makeTable(v.data,v.opt);
          if( v.r instanceof Error ) throw v.r;
          v.r = this.article({
            title: `🔢 ${v.d.name} メンバ一覧`,
            level: level+1,
            url: `#${v.anchor}_top`,
            anchor: `${v.anchor}_prop`,
            content: v.r,
          });
          if( v.r instanceof Error ) throw v.r;
          v.rv.push('',v.r);;
        }

        dev.step(4); // メソッド一覧
        v.methods = (v.d.children ?? [])
        // 解説記事またはdocletType不明はメソッド一覧から外す
        .filter(x => !['description','unknown'].includes(this.map[x].docletType));
        if( v.methods.length > 0 ){
          // 一覧用のデータ作成
          v.list = [];
          for( v.i=0 ; v.i<v.methods.length ; v.i++ ){
            v.c = this.map[v.d.children[v.i]];
            v.list.push({
              no:    v.i+1,
              name:  `<a href="#${v.c.familyTree}_top">${v.c.name}</a>`,
              label: v.c.label
            });
          }
          v.r = DocletTree.makeTable(v.list,{header:[
            {key:'no',label:'No',align:'--:'},
            {key:'name',label:'名前',align:':--'},
            {key:'label',label:'概要',align:':--'},
          ]});
          if( v.r instanceof Error ) throw v.r;

          // 記事の作成
          v.r = this.article({
            title: `🧱 ${v.d.name} メソッド・内部関数一覧`,
            level: level+1,
            url: `#${v.anchor}_top`,
            anchor: `${v.anchor}_func`,
            content: v.r,
          });
          if( v.r instanceof Error ) throw v.r;
          v.rv.push('',v.r);;
        }

        dev.step(5); // 説明文(concatenated)
        v.shiftLevel = str => {
          v.lines = str.split('\n');
          for( v.i=0 ; v.i<v.lines.length ; v.i++ ){
            if( /^#/.test(v.lines[v.i]) ){
              // Markdownのタイトル行のレベルをシフト
              v.lines[v.i] = '#'.repeat(level+1) + v.lines[v.i];
            }
          }
          return v.lines.join('\n').trim();
        }
        if( v.d.concatenated.length > 0 ){
          v.r = this.article({
            title: `🧾 ${v.d.name} 概説`,
            level: level+1,
            url: `#${v.anchor}_top`,
            anchor: `${v.anchor}_desc`,
            content: v.shiftLevel(v.d.concatenated),
          });
          if( v.r instanceof Error ) throw v.r;
          v.rv.push('',v.r);;
        }
        // 解説記事(docletType="description")が子要素としてあれば追加
        if( Object.hasOwn(v.d,'children') && v.d.children.length > 0 ){
          // 一覧用のデータ作成
          v.list = [];
          for( v.i=0 ; v.i<v.d.children.length ; v.i++ ){
            v.c = this.map[v.d.children[v.i]];
            if( v.c.docletType === 'description' ){
              // 記事の作成
              v.r = this.article({
                title: `🧾 ${v.c.label ?? v.c.name}`,
                level: level+1,
                url: `#${v.anchor}_top`,
                anchor: v.c.name ?? '',
                content: v.shiftLevel(v.c.concatenated),
              });
              if( v.r instanceof Error ) throw v.r;
              v.rv.push('',v.r);;
            }
          }
        }

        dev.step(6); // 引数
        if( Object.hasOwn(v.d,'params') && v.d.params.length > 0 ){
          v.data = v.d.params.map(x => x.row);
          v.opt = {header:JSON.parse(JSON.stringify(this.opt.propHeader))};
          // 備考欄が全て空白なら割愛
          if( v.data.map(x => x.note).every(x => x === '') ){
            v.opt.header = v.opt.header.filter(x => x.key !== 'note');
          }
          v.r = DocletTree.makeTable(v.data,v.opt);
          if( v.r instanceof Error ) throw v.r;
          v.r = this.article({
            title: `▶️ ${v.d.name} 引数`,
            level: level+1,
            url: `#${v.anchor}_top`,
            anchor: `${v.anchor}_param`,
            content: v.r,
          });
          if( v.r instanceof Error ) throw v.r;
          v.rv.push('',v.r);;
        }

        dev.step(7); // 戻り値
        if( Object.hasOwn(v.d,'returns') && v.d.params.length > 0 ){
          v.data = v.d.returns.map(x => x.row);
          v.opt = {header:JSON.parse(JSON.stringify(this.opt.returnHeader))};
          // 備考欄が全て空白なら割愛
          if( v.data.map(x => x.note).every(x => x === '') ){
            v.opt.header = v.opt.header.filter(x => x.key !== 'note');
          }
          v.r = DocletTree.makeTable(v.data,v.opt);
          if( v.r instanceof Error ) throw v.r;
          v.r = this.article({
            title: `◀️ ${v.d.name} 戻り値`,
            level: level+1,
            url: `#${v.anchor}_top`,
            anchor: `${v.anchor}_return`,
            content: v.r,
          });
          if( v.r instanceof Error ) throw v.r;
          v.rv.push('',v.r);;
        }

        dev.step(8); // 個別メソッド、内部関数
        if( v.d.children && v.d.children.length > 0 ){
          for( v.i=0 ; v.i<v.d.children.length ; v.i++ ){
            // 解説記事またはdocletType不明は外す
            if( ['description','unknown'].includes(this.map[v.d.children[v.i]].docletType) ) continue;
            v.r = this.makeDocletMD(v.d.children[v.i],level+1);
            if( v.r instanceof Error ) throw v.r;
            v.rv.push('',v.r);;
          }
        }

        dev.end();
        return v.rv.join('\n').replaceAll(/\n\n+/g,'\n\n').trim();

      } catch (e) { return dev.error(e); }
    }

    /** makeFolder: DocletTreeFolder形式のオブジェクトを作成
     * @memberof DocletTree
     * @param {string} folderName - フォルダ名
     * @returns {DocletTreeFolder|Error}
     */
    makeFolder(folderName) {
      const v = {whois:`${this.constructor.name}.makeFolder`, arg:{folderName}, rv:null};
      const dev = new devTools(v,{mode:'pipe'});
      try {

        v.rv = {
          folderName: folderName,
          funclass: {},
          typedef: {},
          children: {},
        };

        dev.end(); // 終了処理
        return v.rv;

      } catch (e) { return dev.error(e); }
    }

    /** makeIndexMD: フォルダ単位のクラス・グローバル関数一覧＋データ型定義のMarkdownを作成
     * @memberof DocletTree
     * @param {DocletTreeFolder} folder
     * @returns {string|Error}
     */
    makeIndexMD(folder){
      const v = {whois:`${this.constructor.name}.makeIndexMD`, arg:{folder}, rv:[]};
      const dev = new devTools(v,{mode:'pipe'});
      try {

        dev.step(1); // グローバル関数・クラス一覧
        v.rv.push(`# グローバル関数・クラス一覧`);
        v.data = [];
        Object.keys(folder.funclass).map(x => this.map[x])  // 配列化して名前順に並べ替え
        .sort((a,b) => {return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })})
        .forEach(doclet => {
          v.data.push({
            name: `[${doclet.name}](${doclet.name}.md)`,
            label: doclet.label,
          });
        });
        // Markdownテーブル作成
        v.r = DocletTree.makeTable(v.data,{header:[
          {key:'name',label:'クラス/関数名',align:':--'},
          {key:'label',label:'概要',align:':--'},
        ]});
        if( v.r instanceof Error ) throw v.r;
        v.rv.push('',v.r);

        dev.step(2);  // データ型定義(folder.typedef)を配列化
        v.list = Object.keys(folder.typedef).map(x => this.map[x])
        .sort((a,b) => {return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })});

        dev.step(3);  // データ型定義一覧
        dev.step(3.1);  // テーブル用データ作成
        v.data = [];
        for( v.i=0 ; v.i<v.list.length ; v.i++ ){
          v.data.push({
            no: v.i+1,
            name: `[${v.list[v.i].name}](#${v.list[v.i].name})`,
            label: v.list[v.i].label,
          });
        }
        dev.step(3.2);  // Markdownテーブル作成
        v.r = DocletTree.makeTable(v.data,{header:[
          {key:'no',label:'No',align:'--:'},
          {key:'name',label:'データ型名',align:':--'},
          {key:'label',label:'概要',align:':--'},
        ]});
        if( v.r instanceof Error ) throw v.r;
        dev.step(3.3);  // 記事作成
        v.r = this.article({
          title: `データ型定義一覧`,
          level: 1,
          url: '',
          anchor: `typedefList`,
          content: v.r,
        });
        if( v.r instanceof Error ) throw v.r;
        v.rv.push('',v.r);;

        dev.step(4);  // 個別データ型定義
        v.rv.push('',`# 個別データ型定義`)
        v.list.forEach(doclet => {
          dev.step(4.1);  // 項目一覧
          v.data = this.map[doclet.uuid].properties.map(x => x.row);
          v.opt = {header:JSON.parse(JSON.stringify(this.opt.propHeader))};
          // 備考欄が全て空白なら割愛
          if( v.data.map(x => x.note).every(x => x === '') ){
            v.opt.header = v.opt.header.filter(x => x.key !== 'note');
          }
          v.r = DocletTree.makeTable(v.data,v.opt);
          if( v.r instanceof Error ) throw v.r;
          dev.step(4.2);  // 説明文を追加
          if( Object.hasOwn(doclet,'description') && doclet.description.length > 0 )
            v.r = doclet.description + '\n\n' + v.r;
          dev.step(4.3);  // 記事作成
          v.r = this.article({
            title: `"${this.map[doclet.uuid].name}" データ型定義`,
            level: 2,
            url: '#typedefList',
            anchor: `${this.map[doclet.uuid].name}`,
            content: v.r,
          });
          if( v.r instanceof Error ) throw v.r;
          v.rv.push('',v.r);
        });

        v.rv = v.rv.join('\n');
        dev.end(); // 終了処理
        return v.rv;
      } catch (e) { return dev.error(e); }
    }

    /** makeTable: Markdownのテーブル作成
     * @memberof DocletTree
     * @param {Object.<string, any[]>} data - テーブル作成用データ
     * @param {Object} [opt={}]
     * @param {Object[]} [opt.header=[]] - {key,label,align}形式のオブジェクト
     *   keyは必須。labelの既定値はkey(=dataのメンバ名)
     *   alingはMarkdownテーブルの配置指定文字列(':--'(既定値) or ':--:' or '--:')
     * @param {number} [opt.indent=0] - テーブルの左余白桁数
     * @param {DocletEx} [opt.doclet=null] - 呼出元のDoclet
     * @returns {string|Error}
     */
    static makeTable(data,opt={}){
      const v = {whois:`${this.constructor.name}.makeTable`, arg:{}, rv:[[],[]]};
      const dev = new devTools(v,{mode:'pipe'});
      try {

        dev.step(1);  // オプションの既定値設定
        opt.indent = opt.indent ?? 0;
        opt.doclet = opt.doclet ?? null;
        // opt.headerについて既定値作成
        opt.header = opt.header ?? [];
        if( opt.header.length === 0 ){
          // 指定が無かった場合、dataから生成
          opt.header = [...new Set(data.flatMap(obj => Object.keys(obj)))]
          .map(o => {return {key:o,label:o,align:':--'}});
        } else {
          // 指定が有った場合は既定値設定
          opt.header = opt.header.map(o => Object.assign({
            key: o.key,
            label: o.label ?? o.key,
            align: o.align ?? ':--'
          },o));
        }

        dev.step(2);  // ヘッダ部
        opt.header.forEach(x => {
          v.rv[0].push(x.label);
          v.rv[1].push(x.align);
        });

        dev.step(3);  // データ部
        data.forEach(d => v.rv.push(opt.header.map(h => {
          if( ['type'].includes(h.key) && opt.doclet !== null ){
            // データ型欄にthis.symbolsに存在するデータ型名があればリンクを設定
            v.str = String(d[h.key]);
            // 呼出元Docletのフォルダ階層の深さ分だけ"../"を付けてルートまで遡上
            v.depth = opt.doclet.unique === '/' ? 1
              : opt.doclet.unique.replace(/\/$/,'').split('/').length;
            for( v.i in DocletTree.symbols ){
              v.str = v.str.replaceAll(
                DocletTree.symbols[v.i].rex,
                '../'.repeat(v.depth) + DocletTree.symbols[v.i].link
              );
            }
            return v.str;
          } else {
            return d[h.key];
          }
        })));

        dev.step(4);  // テキストに変換
        v.rv = v.rv.map(l => `${' '.repeat(opt.indent)}| ${l.join(' | ')} |`).join('\n');

        dev.end(); // 終了処理
        return v.rv;
      } catch (e) { return dev.error(e); }
    }

    /** output: Markdownをファイルとして出力
     * - 出力先配下にフォルダ作成＋index.mdの作成
     * - markdown()を呼び出しDocletEx単位のMarkdownを作成
     * - 出力先フォルダにMarkdownファイルを作成
     * @memberof DocletTree
     * @param {DocletTreeFolder} [folder=this.folder] - 対象フォルダ
     * @param {string} [outDir=this.source.outDir] - 出力先(親)フォルダのパス
     * @returns {null|Error}
     */
    output(folder=this.folder,outDir=this.source.outDir) {
      const v = {whois:`${this.constructor.name}.output`, arg:{}, rv:null};
      const dev = new devTools(v,{mode:'pipe'});
      try {

        dev.step(1);  // 出力先フォルダ配下に固有パス毎のフォルダを作成
        v.path = outDir + (folder.folderName === '/' ? '' : '/') + folder.folderName;
        if( !existsSync(v.path) ) mkdirSync(v.path,{recursive: true});

        dev.step(2);  // グローバル関数・クラス毎に個別ファイル作成
        Object.keys(folder.funclass).map(x => this.map[x])  // 配列化して名前順に並べ替え
        .sort((a,b) => {return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })})
        .forEach(doclet => {
          v.r = this.makeDocletMD(doclet.uuid);
          if( v.r instanceof Error ) throw v.r;
          writeFileSync(`${v.path}/${doclet.name}.md`,v.r);
        });

        dev.step(3);  // トップシート(index.md)の作成
        if( Object.keys(folder.funclass).length > 0 || Object.keys(folder.typedef).length > 0 ){
          v.r = this.makeIndexMD(folder);
          if( v.r instanceof Error ) throw v.r;
          writeFileSync(`${v.path}/${this.opt.indexMd}`,v.r);
        }

        dev.step(4);  // 子フォルダを再帰呼出
        v.children = Object.keys(folder.children);
        for( v.i=0 ; v.i<v.children.length ; v.i++ ){
          v.r = this.output(folder.children[v.children[v.i]],v.path);
          if( v.r instanceof Error ) throw v.r;
        }

        dev.end(); // 終了処理
        return v.rv;

      } catch (e) { return dev.error(e); }
    }

    /** registration: DocletEx生成時の重複登録チェック＋マップへの登録
     * 
     * 重複登録：同一の「／** 〜 *／」から複数のDocletが生成され、
     * 特定のタグ情報が片方にしかない状態。
     * 
     * @memberof DocletTree
     * @param {DocletEx} doclet - 生成直後のDocletExインスタンス
     * @param {DocletTreeFile} file - doclet抽出元の個別入力ファイル情報
     * @returns {null|Error}
     */
    registration(doclet,file){
      const v = {whois:`DocletTree.registration`, arg:{doclet,file}, rv:null};
      const dev = new devTools(v,{mode:'pipe'});
      try {

        dev.step(1);  // 固有パスとファイル名(meta.filenameが無い場合への備え)
        doclet.unique = file.unique;
        doclet.basename = file.basename;

        dev.step(2);  // 重複チェック用のキー作成
        v.dupkey = '';  // 登録済のdocletがあればtrue
        // 固有パス＋ファイル名
        doclet.prefix = `${
          (/^\//.test(file.unique) ? '' : '/')
          + file.unique
          + (/\/$/.test(file.unique) ? '' : '/')}${file.basename}`;

        // 信頼性の低い順にチェックし、より信頼度の高いものが一致すれば置換する
        dev.step(2.1);  // 「固有パス＋ファイル名＋comment」のハッシュ
        // 「/** 〜 */」が同一ファイル内で一箇所のみ
        if( typeof doclet.comment !== 'undefined'
            && file.content.split(doclet.comment).length === 2 ){
          doclet.commentId = createHash('sha256')
            .update(doclet.prefix + doclet.comment).digest('hex');
          if( typeof this.map[doclet.commentId] !== 'undefined' )
            v.dupkey = doclet.commentId;
        }
        dev.step(2.2);  // 固有パス＋ファイル名＋lineno
        if( typeof doclet.meta?.lineno !== 'undefined' ){
          doclet.linenoId = doclet.prefix + `:N${doclet.meta.lineno}`;
          if( typeof this.map[doclet.linenoId] !== 'undefined' )
            v.dupkey = doclet.linenoId;
        }
        dev.step(2.3);  // 固有パス＋ファイル名＋range[0]
        if( typeof doclet.meta?.range !== 'undefined' ){
          doclet.rangeId = doclet.prefix + `:R${doclet.meta.range[0]}`;
          if( typeof this.map[doclet.rangeId] !== 'undefined' )
            v.dupkey = doclet.rangeId;
        }

        if( v.dupkey.length > 0 ){
          dev.step(3);  // DocletEx.mapに登録済なら既存DocletExに情報追加
          this.map[v.dupkey] = mergeDeeply(this.map[v.dupkey],doclet);
        } else {
          // 未登録なので新規追加
          dev.step(4.1);  // DocletTree.doclet
          this.doclet.push(doclet);

          dev.step(4.2);  // DocletTree.map
          ['uuid','rangeId','linenoId','commentId']
            .map(x => this.map[doclet[x]] = doclet);

          dev.step(4.3);  // DocletTree.folder
          // 登録フォルダの特定
          v.folder = this.folder;
          v.path = doclet.unique.split('/').filter(x => x.length>0);
          if( v.path.length > 0 ){
            v.path.forEach(folderName => {
              if( typeof v.folder.children[folderName] === 'undefined' ){
                v.folder.children[folderName] = this.makeFolder(folderName);
              }
              v.folder = v.folder.children[folderName];
            });
          }

          dev.step(5);  // グローバル関数・クラスまたはデータ型定義の場合、登録
          if( ['typedef','interface','class','function'].includes(doclet.docletType) ){
            dev.step(5.1);  // 所属フォルダのfunclass/typedefに登録
            v.f = ['function','class'].includes(doclet.docletType) ? 'funclass' : 'typedef';
            v.folder[v.f][doclet.uuid] = doclet;

            dev.step(5.2);  // シンボル名(クラス・グローバル関数名、データ型名)でDocletTree.mapに登録
            this.map[doclet.name] = Object.hasOwn(this.map,doclet.name) ? null : doclet;

            dev.step(5.3);  // シンボル⇒置換用RegExp+リンク先URLを作成
            // 変換ロジックはDocletTree.makeDocletMD.2参照
            // URLはルートが起点。makeTable等本データを利用する側でルートまで遡上するURLを付加する
            v.url = doclet.unique + (
              ['function','class'].includes(doclet.docletType)
              ? doclet.name + '.md'
              : this.opt.indexMd + '#' + doclet.name
            );
            v.o = {
              name: doclet.name,
              rex: new RegExp(`${doclet.name}\\b`,'g'),
              link: `<a href="${v.url}">${doclet.name}</a>`,
            }
            DocletTree.symbols[doclet.name]
            = Object.hasOwn(DocletTree.symbols,doclet.name) ? null : v.o;
          }
        }

        dev.end(); // 終了処理
        return v.rv;
      } catch (e) { return dev.error(e); }
    }
  }

  /** listSource: 事前準備、対象ファイルリスト作成
   * jsdoc動作環境整備後、シェルの起動時引数から対象となるJSソースファイルのリストを作成。
   * @memberof createSpec
   * @param {void}
   * @returns {DocletTreeSource|string|Error} 入力0件なら文字列"No input file"
   */
  function listSource(argv) {
    const v = {whois:`${pv.whois}.listSource`, arg:{argv},
      rv:{common:'',outDir:'',num:0,files:[]}};
    const dev = new devTools(v,{mode:'pipe'});
    try {

      /**
       * @name 入力・出力・除外リスト作成
       * @memberof listSource
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
      // 入力ファイルが0件なら文字列を返す
      if( v.rv.num === 0 ){
        dev.end();
        return 'No input file';
      }

      dev.step(4);  // 共通パス部分を抽出
      //v.rv.common = path.dirname(v.rv.files[0].full);  末尾'/'無し
      v.rv.common = v.rv.files[0].full.replace(/[^/\\]+$/, "");  // 末尾'/'有り
      for( v.i=1 ; v.i<v.rv.files.length ; v.i++ ){
        while( !v.rv.files[v.i].full.startsWith(v.rv.common) ){
          v.rv.common = v.rv.common.slice(0,-1);
          if( v.rv.common === '' ) break;
        }
      }

      dev.step(5);  // 固有部分とファイル名を作成
      v.rv.files.map(x => {
        x.unique = path.posix.dirname(x.full.slice(v.rv.common.length))
          .replace(/\/?$/, '/').replace(/^\.\//,'/');
        x.basename = path.basename(x.full);
      });

      dev.step(6);  // ソースを読み込み
      v.rv.files.forEach(f => f.content = readFileSync(f.full,cf.encode));

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  try { // createSpec主処理

    dev.step(1.1);  // 最初の2つは全体とコマンド名、不要なので削除
    pv.argv = process.argv.slice(2);

    dev.step(1.2);  // 起動時パラメータが無指定または"-h"の場合、useageを表示して終了
    if( pv.argv.length === 0 || /^\-+[h|H]/.test(pv.argv[0]) ){
      console.log(cf.useage);
      dev.end(); // 終了処理
      return pv.rv;
    }

    dev.step(2);  // 対象ファイルの情報を取得
    pv.r = listSource(pv.argv);
    if( typeof pv.r === 'string' ){
      // 対象ファイルが0件なら終了
      console.log(`Error: ${pv.r}`);
      return null;
    }
    if( pv.r instanceof Error ) throw pv.r;
    pv.tree = await DocletTree.initialize(pv.r,{
      jsdocJson: cf.jsdocJson,
      dummyDir: cf.dummyDir,
    });

    dev.step(3);  // フォルダ作成＋ファイル出力
    pv.r = pv.tree.output();
    if( pv.r instanceof Error ) throw pv.r;

    dev.step(4);  // 【開発用】調査結果ファイルの出力
    /* 例：JSON.stringify(
      pv.tree.doclet
      .filter(x => typeof x.familyTree !== 'undefined')
      //.sort((a,b) => a.docletType < b.docletType ? -1 : 1)
      .map(x => {return {docletType:x.docletType,longname:x.longname,name:x.name,familyTree:x.familyTree}})
      //.filter(x => x.memberof).map(x => x.memberof)
      //.map(x => x.name)
    ,null,2) */
    if( pv.tree.source.research ){
      writeFileSync(pv.tree.source.research,JSON.stringify(pv.tree.doclet,null,2));
    }

    dev.end();
    return pv.rv;

  } catch (e) { dev.error(e); return e; } finally {
    // jsdoc動作定義ファイルを削除
    if( existsSync(cf.jsdocJson) )
      unlinkSync(cf.jsdocJson);
    // ダミーディレクトリを削除
    if( existsSync(cf.dummyDir) )
      rmSync(cf.dummyDir, { recursive: true, force: true });
  }
}