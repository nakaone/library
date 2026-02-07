#!/usr/bin/env node
import path from 'path';
import process from 'process';
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { devTools } from '../../../library/devTools/3.0.0/core.mjs';

/** Article: Markdownの単一記事(タイトル＋本文)用データオブジェクト
 * - `<!--::記事のID::-->`で他記事も埋め込み可とする
 * - アンカーのidは識別子を小文字変換したものとする
 * 
 * @class Article
 * @prop {string} [title=''] - 記事のタイトル
 * @prop {string} [icon=''] - アイコンを付ける場合に設定
 * @prop {boolean} [anchor=false] - アンカーを設定する場合に設定(`<span id="〜">`)
 * @prop {string} [link=''] - タイトルにリンクを張る場合の参照先URL
 * @prop {string} [top=''] - タイトルの前に挿入する文字列(固定メニュー等)
 * @prop {string} [middle=''] - タイトルの後・記事の前に〃
 * @prop {string} [bottom=''] - 記事の後に〃
 * @prop {string} [content=''] - 記事本文
 */
class Article {
  /**
   * @constructor
   * @param {Object} arg 
   * @returns {Article}
   */
  constructor(arg){
    this.title = arg.title ?? '';
    this.icon = arg.icon ?? '';
    this.anchor = arg.anchor ?? false;
    this.link = arg.link ?? '';
    this.top = arg.top ?? '';
    this.middle = arg.middle ?? '';
    this.bottom = arg.bottom ?? '';
    this.content = arg.content ?? '';
  }
}

/** PropList: 属性一覧に表示する項目
 * - 戻り値(returns)の場合、項目名・要否/既定値は無効な値となる
 * @class
 * @prop {string}   type - 'properties' or 'params'
 * @prop {object[]} list - 項目一覧
 * @prop {string}   list.name - 項目名
 * @prop {string}   list.type - データ型。複数なら' | 'で区切って並記
 * @prop {string}   list.value - 要否/既定値。「必須」「任意」または既定値
 * @prop {string}   list.desc - 1行の簡潔な項目説明
 * @prop {string}   list.note - 備考
 */
class PropList {
  /** 属性一覧表示用のオブジェクトを作成
   * @constructor
   * @param {DocletColDef} doclet - Docletの項目定義オブジェクト
   * @param {object} [opt={}] - オプション
   * @param {string} [opt.lang=ロケール] - ラベルに使用する言語(ex.'ja-JP')
   * @param {object} [opt.label] - 項目のメンバ名->Markdown作成時のラベル文字列への変換マップ
   *   既定値に統合するので、変更・追加項目のみ指定すれば可。
   *   例：valueを「要否/既定値」から「値」に変更 ⇒ {value:'値'}
   *   　　独自項目'foo'を追加 ⇒ {foo:'ダミー'}
   * @param {string} [opt.order=['name','type','value','desc','note']] - 項目の並び順
   *   記載されていない項目はMarkdownで表を作成する際、非表示になる。
   *   既定値を置換するので、変更する場合は全項目を指定する。
   *   例：value,noteは表示不要、独自項目fooを追加 ⇒ ['name','type','desc','foo']
   * @param {object} [opt.value] - 項目の値->Markdown作成時の表示への変換マップ
   * @returns {PropList|{}|Error} 処理対象属性が無い場合は{}
   */
  constructor(doclet,opt={}){
    const v = {whois:`PropList.constructor`, arg:{doclet,opt}, rv:{}};
    const dev = new devTools(v);
    try {

      dev.step(1.1);  // 項目チェック
      if( typeof doclet === 'undefined'       // docletに無い
        || doclet.length === 0                // 要素が無い
      ){
        dev.end();
        return v.rv;  // 空要素(!v.rv instance of PropList)
      } else if( !Array.isArray(doclet) )     // 対象項目が配列では無い
        throw new Error(`not an array.`);
      
      dev.step(1.2);  // 初期値設定
      this.list = [];
      this.opt = {
        lang: opt.lang ?? Intl.DateTimeFormat().resolvedOptions().locale,
        label: opt.label ?? {},
        order: opt.order ?? ['name','type','value','desc','note'],
        value: opt.value ?? {},
      };
      this.opt.label = Object.assign((this.opt.lang === 'ja-JP'
        ? {name:'項目名',type:'データ型',value:'要否/既定値',desc:'説明',note:'備考'}
        : {name:'name',type:'type',value:'value',desc:'desc',note:'note'}
      ),this.opt.label);
      this.opt.value = Object.assign((this.opt.lang === 'ja-JP'
        ? {undef:'未定義',optional:'任意',required:'必須'}
        : {undef:'undefined',optional:'optional',required:'required'}
      ),this.opt.value);

      dev.step(2);  // this.listの作成
      doclet.forEach(col => {
        v.desc = (col.description ?? '').split('\n');
        v.o = {
          name: col.name,
          type: col.type.names
            .map(x => x.replace(/^Array\.<\s*(.+?)\s*>$/, '$1[]').trim())
            .join(' | '),
          value: typeof col.defaultvalue !== 'undefined' ? col.defaultvalue
            : (col.optional === true ? this.opt.value.optional : this.opt.value.required),
          desc: v.desc[0],
          note: v.desc.slice(1).join('\n').trim(),  // 2行目以降。先頭・末尾の空行は削除
        };
        this.list.push(v.o);
      });

      dev.step(99.118,this.makeTable());

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }

  }

  /** makeTable: Markdownのテーブル作成
   * @param {number} [indent=0] - テーブルの左余白桁数
   * @returns {string|Error}
   */
  makeTable(indent=0){
    const v = {whois:`${this.constructor.name}.makeTable`, arg:{}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1);  // ヘッダ部
      v.lines = [[],[]];
      this.opt.order.forEach(x => {
        v.lines[0].push(this.opt.label[x]);
        v.lines[1].push(':--');
      });

      dev.step(2,this.list);  // データ部
      this.list.forEach(l => v.lines.push(this.opt.order.map(x => l[x])));

      dev.step(3,v.lines);  // テキストに変換
      v.rv = v.lines.map(l => `${' '.repeat(indent)}| ${l.join(' | ')} |`).join('\n');

      dev.end(v.rv);
      return v.rv;
    
    } catch (e) { return dev.error(e); }
  }
}

/** DocletColDef: Doclet.properties/params/returnsの要素(メンバ)定義情報
 * @typedef {Object} DocletColDef
 * @prop {object}   type - データ型情報オブジェクト
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
 * @prop {object}   meta - プロパティ定義が存在するソース位置情報
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
 * @prop {object}   meta - Docletが生成されたソース位置情報
 * @prop {number[]} meta.range - ソースコード内での文字位置範囲
 *   桁数単位で、2要素ずつ組み合わせた開始・終了インデックス。
 * @prop {string}   meta.filename - 対象が定義されているソースファイル名
 * @prop {number}   meta.lineno - 対象定義の開始行番号
 * @prop {number}   meta.columnno - 対象定義の開始列番号
 * @prop {string}   meta.path - ソースファイルが存在するディレクトリパス
 * @prop {object}   meta.code - Doclet対象となったコード要素の構造情報
 * @prop {string}   meta.code.id - コード要素の内部識別子(AST由来、存在しない場合あり)
 * @prop {string}   meta.code.name - コード要素の名前（関数名・クラス名・変数名など）
 * @prop {string}   meta.code.type - コード要素の種別
 * @prop {string}   meta.code.value - コード要素のソース表現（代入値や関数本体の文字列表現）
 * @prop {string[]} meta.code.paramnames - 関数・メソッドの引数名一覧
 * @prop {Object.<string, string>} meta.vars - スコープ内で参照される変数名とその値（簡易マップ）
 * @prop {string}   name - 対象の短い名前(関数名・クラス名・プロパティ名など)
 * @prop {DocletColDef[]} params - ＠paramタグから生成された引数情報の配列
 * @prop {DocletColDef[]} properties - ＠propertyタグから生成されたメンバ定義情報
 * @prop {DocletColDef} returns - ＠returns/＠returnタグから生成された戻り値情報
 *   returnsはparams/propertiesと以下の点で異なる。
 *   1. 配列ではない(単一要素)
 *   2. name/optional/defaultvalueは無い
 *   3. nullable,nullableTypeが付くことがある
 * @prop {string}   scope - スコープ種別
 *   global,static,instance,innerなど、メンバの可視性・所属を示す
 * @prop {Object[]} tags - JSDoc上に記述されたタグのうち、専用フィールドに変換されなかった生タグ情報
 *   独自タグ、JSDocが意味解釈しないタグ、情報落ちしないよう保持された生情報
 * @prop {object}   tags.meta - タグが記述されているソース位置情報
 * @prop {string}   tags.originalTitle - ソース上に記述されたタグ名（＠を除いた元の表記）
 * @prop {string}   tags.title - 正規化されたタグ名(＠returns->return,＠History->history)
 * @prop {string}   tags.text - タグ行の生テキスト（タグ名を除いた部分）
 * @prop {string}   tags.value - タグ内容をJSDocが解釈・分解した結果の文字列表現
 *   単純タグではtextと同じになることが多い
 * @prop {object}   type - ＠type/＠param/＠returns/＠property等から得られた型情報
 *   プリミティブ・Union・配列・オブジェクトなど
 * @prop {string[]} type.names - データ型名の配列
 *   `{number|string}`等、'|'で区切られたUnion型の場合は複数になる
 *   {typeDef[]|columnDef[]} ⇒ "names": ["Array.<typeDef>","Array.<columnDef>"]
 * @prop {boolean}  undocumented - JSDoc コメントが存在しない要素かどうか
 *   true の場合、自動抽出されたがコメント未記述
 * @prop {object}   type - ＠type/＠param/＠returns/＠property等から得られた型情報
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
class Doclet {
  constructor(doclet){
    //this = JSON.parse(JSON.stringify(doclet));
    Object.keys(doclet).forEach(x => this[x] = doclet[x]);
  }
}

/** DocletEx: jsdocから出力されるDocletに情報を付加したもの
 * @class
 * @extends Doclet
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
 * @prop {ReturnList} [returns=[]] - 戻り値
 * @prop {Object.<string, Article>} md - 記事名をキーとするマップ
 *   記事名は「一覧文書/クラス・グローバル関数/データ型定義文書の構成」参照
 *   top, list, type, prop, func, desc, param, return, -xxx
 * 
 * @prop {DocletEx} [parent=null] - 親要素のDoclet
 * @prop {Object.<string, Doclet>} [children={}] - メソッド・内部関数
 * 
 * -- 以下備忘
 * @prop {string} title
 * @prop {string} description - 概要・詳細説明、処理手順
 * @prop {Object[]} [innerList=[]] - メソッド・内部関数一覧。項目：No,関数名,ラベル,アンカー
 * -- 備忘ここまで
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
class DocletEx extends Doclet {
  /**
   * @constructor
   * @param {Doclet} doclet 
   * @param {string} unique 
   */
  constructor(doclet,unique='/'){
    super(doclet);
    const v = {whois:`DocletEx.constructor`, arg:{doclet,unique}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1);  // unique
      this.unique = unique;

      dev.step(2);  // docletType
      this.docletType = this.determineType(doclet);
      if( this.determineType instanceof Error) throw this.determineType;

      dev.step(3);  // label
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

      dev.step(4);  // properties
      v.r = new PropList(doclet.properties);
      if( v.r instanceof Error ) throw v.r;
      if( v.r instanceof PropList ) this.properties = v.r;

      dev.step(5);  // params
      v.r = new PropList(doclet.params);
      if( v.r instanceof Error ) throw v.r;
      if( v.r !== null ) this.params = v.r;

      dev.step(6);  // returns

      dev.step(7);  // md - メソッドで対応？

      dev.step(8);  // parent, children は全Docletが揃ってから設定

      dev.end();

    } catch (e) { return dev.error(e); }
  }

  /** determineType: Docletの型を判定
   * @param {Object} doclet
   * @returns {string|Error} 「docletTypeの判定ロジック」参照
   */
  determineType(doclet) {
    const v = {whois:`${this.constructor.name}.determineType`, arg:{doclet}, rv:'unknown'};
    const dev = new devTools(v);
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

  /** determineParent: 対象要素が子要素であるとき親要素を特定
   * メソッド⇒クラス、内部関数⇒グローバル関数、等
   * 1. child.memberof === parent.longname
   * 2. child.rangeが包含されている直近の要素
   */
}

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
 * - Doclet : JSDoc上「／** 〜 *／」までの部分。通常一つのファイルに複数存在。
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
 *   案：rangeで内包関係を調べる
 *       (parant.meta.range[0]<=child.meta.range[0]
 *        && child.meta.range[1] <= parent.meta.range[1])
 * - 重複シンボルがあればエラーメッセージ
 * - 文法チェック
 *   - ＠class の後に余計な文字列があればエラー
 */
console.log(JSON.stringify(createSpec(),null,2));

/** createSpec: JavaScriptソース内のJSDocを基に、Markdown形式の仕様書を生成
 * @param {object} [opt={}] - オプション設定
 * @returns {void}
 * 
 * @prop {Object} pv - createSpec内の共有変数(public variables。class定義のメンバに相当)
 * @prop {Object} cf - createSpec動作設定情報(config)
 * @prop {sourceFile[]} sourceFile - 入力ファイル情報
 * @prop {Doclet[]} doclet - Doclet型にしたオブジェクトを保存
 */
async function createSpec(opt={}) {

  const pv = {whois:`createSpec`, arg:{}, rv:null};
  const cf = {  // jsdocコマンド動作環境整備関係(config)
    // 詳細はlistSource step.1参照
    jsdocJson: opt.jsdocJson ?? `jsdoc.json`,  // jsdocコマンド設定ファイル名
    //jsdocJson: `jsdoc.${Date.now()}.json`,  // jsdocコマンド設定ファイル名
    dummyDir: opt.dummyDir ?? './dummy',  // jsdoc用の空フォルダ
    jsdocTarget: opt.jsdocTarget ?? ".+\\.(js|mjs|gs|txt)$", // jsdocの動作対象となるファイル名
  };
  const doc = { // 全体管理
    source: null, // {SourceFile}
    doclet: [],   // {DocletEx[]}
  };

  /** getFile: jsdocコマンドを実行し、対象ファイル(単一)のJSDocをJSON形式で取得
   * @param {string} fn - 対象ファイル名
   * @returns {object|string} JSON化できない(=エラー)の場合はテキスト
   */
  async function getFile(fn) {

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

          dev.step(5.3);  // Doclet単位にばらして保存
          v.rv = [];
          for( v.i=0 ; v.i<v.json.length ; v.i++ ){
            v.r = new DocletEx(v.json[v.i],fn.unique);
            if( v.r instanceof Error ) reject(v.r);
            v.rv.push(v.r);
          }

          resolve(v.rv); // awaitの戻り値
        } catch (err) {
          reject(new Error("Failed to parse JSON: " + err.message));
        } finally {
          dev.end();
        }
      });
    });
  }

  /** SourceFile: 入力ファイル(JSソース)情報
   * @typedef {object} SourceFile
   * @prop {string} common - フルパスの共通部分
   * @prop {string} outDir - 出力先フォルダ名(フルパス)
   * @prop {number} num - 対象ファイルの個数
   * @prop {Object[]} source - {full:フルパス,unique:固有部分}形式のファイル名
   * @prop {Object[]} doclet - `jsdoc -X`で返されるJSONをオブジェクト化、配列として格納
   */
  /** listSource: 事前準備、対象ファイルリスト作成
   * jsdoc動作環境整備後、シェルの起動時引数から対象となるJSソースファイルのリストを作成。
   * @param {void}
   * @returns {SourceFile|Error}
   */
  function listSource() {
    const v = {whois:`${pv.whois}.listSource`, arg:{},
      rv:{common:'',outDir:'',num:0,list:[]}};
    const dev = new devTools(v);
    try {

      /**
       * @name 入力・出力・除外リスト作成
       * @description
       * 
       * 起動時パラメータは以下の通り。
       * `node createSpec.mjs [入力ファイル...] -o 出力フォルダ [-x 除外パターン ...]`
       * 
       * シェル側でワイルドカードを展開して配列が渡されるので、以下のように判断する。
       * ①最初の2つは全体とコマンド名、不要なので削除
       * ②3番目以降'-o'までは入力ファイル
       * ③'-o'の次は出力フォルダ名
       * ④'-x'の次からは除外ファイル
       */

      dev.step(1);  // 結果を格納する領域を準備
      v.iList = [],  // 入力ファイルリスト
      v.xList = [],  // 除外ファイルリスト

      dev.step(2);  // シェルの起動時引数を取得、順次処理
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
              case 'o': v.rv.outDir = v.x; break;
              case 'x': v.xList.push(v.x); break;
            }
        }
      }

      dev.step(3);  // 対象 = 入力 − 除外
      for( v.i=0 ; v.i<v.iList.length ; v.i++ ){
        if( !v.xList.includes(v.iList[v.i]) ){
          v.rv.list.push({full:v.iList[v.i]});
        }
      }
      v.rv.num = v.rv.list.length;

      dev.step(4);  // 共通部分を抽出
      //v.rv.common = path.dirname(v.rv.list[0].full);  末尾'/'無し
      v.rv.common = v.rv.list[0].full.replace(/[^/\\]+$/, "");  // 末尾'/'有り
      for( v.i=1 ; v.i<v.rv.list.length ; v.i++ ){
        while( !v.rv.list[v.i].full.startsWith(v.rv.common) ){
          v.rv.common = v.rv.common.slice(0,-1);
          if( v.rv.common === '' ) break;
        }
      }

      dev.step(5);  // 固有部分を作成
      v.rv.list.map(x => x.unique = 
        path.posix.dirname(x.full.slice(v.rv.common.length))
        .replace(/\/?$/, '/').replace(/^\.\//,'/'));

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
  
  // -------------------------------------------------------------
  // メイン処理
  // -------------------------------------------------------------
  const dev = new devTools(pv);
  try {

    dev.step(1,cf);  // sourceFileに対象ファイルリスト作成
    doc.source = listSource();
    if( doc.source instanceof Error) throw doc.source;

    dev.step(2);  // 対象ファイルについて順次Docletを抽出、docletに格納
    for( pv.i=0 ; pv.i<doc.source.list.length ; pv.i++ ){
      dev.step(1.1);  // ファイル単位にjsdocを実行、docletを作成
      pv.r = await getFile(doc.source.list[pv.i]);
      if( pv.r instanceof Error) throw pv.r;
      pv.r.forEach(x => doc.doclet.push(x));
    }

    dev.step(99.644,doc);
    /*
    dev.step(3);  // docletの各要素を階層化してマッピング
    pv.r = mapDoclet();
    if( pv.r instanceof Error) throw pv.r;

    dev.step(4);  // docletを走査、記事毎にArticleを作成
    doclet.forEach(o => {
      pv.r = makeArticle(o);
      if( pv.r instanceof Error) throw pv.r;
    });
    */

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



/** stock: 使用の可能性が高いソースの一時保存 */
function stock(){

  /** dlMap: Docletを構造化してマッピングしたオブジェクト
   * @typedef {Object.<string, Object>} dlMap - メンバ名は固有パス
   *   固有パスが無い場合は"/"(ルート)とする。
   * @prop {Object.<string, Doclet>} global - メンバ名は関数・クラス名
   * @prop {Object.<string, Doclet>} typedef - メンバ名はデータ型定義名
   */
  const dlMap = {};

  /** mapDoclet: docletからdlMapを作成
   * @param {void} - 共有変数docletから作成
   * @returns {null|Error} 処理したDocletはdlMapに格納
   */
  function mapDoclet(){
    const v = {whois:`${pv.whois}.mapDoclet`, arg:{}, rv:null};
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
            dev.step(2.1);
            // typedef配下で親を探す
            v.r = getByTildePath(v.d.origin.longname,dlMap[v.d.unique].typedef);
            // 親が見つからなければエラー
            if( !v.r.obj ) throw new Error(`no parent: ${JSON.stringify(v.d.origin,null,2)}`);
            // 親定義.propertiesに追加
            v.r.obj.properties.push(v.d);
            break;
          case 'constructor': // -> longname区切り記号：無し、name === クラス名
            dev.step(2.2);
            // @constructorに対応する@classの記述がない ⇒ エラー
            if( typeof dlMap[v.d.unique].global[v.d.origin.name] === 'undefined' ){
              throw new Error(`There is no @class description corresponding to @constructor`);
            }
            dlMap[v.d.unique].global[v.d.origin.name].innerFunc.push(v.d);
            break;
          case 'method':  // -> longname区切り記号：'.'
          case 'innerFunc':  // -> longname区切り記号：'~'
            dev.step(2.3);
            // global配下で親を探す
            v.r = getByTildePath(v.d.origin.longname,dlMap[v.d.unique].global);
            // 親が見つからなければエラー
            if( !v.r.obj ) throw new Error(`no parent: ${JSON.stringify(v.d.origin,null,2)}`);
            // 親定義.innerFuncに追加
            v.r.obj.innerFunc.push(v.d);
            break;
          case 'description':  // -> longname区切り記号：無し
            dev.step(2.4);
            break;
        }
      }

      console.log(JSON.stringify(dlMap)); // debug
      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** getByTildePath:パス文字列からオブジェクトを辿って値を取得
   * @param {string} path - 例: "func01~func02~arrow01"
   * @param {object} obj  - 探索対象オブジェクト
   * @returns {{obj:any, label:string} | null}
   */
  function getByTildePath(path, obj) {
    const v = {whois:`${pv.whois}.getByTildePath`, arg:{}, rv:{obj:null,label:''}};;
    const dev = new devTools(v);
    try {

      dev.step(1);  // 引数チェック
      if ( !path || typeof path !== 'string') return null;

      dev.step(2);  // longnameを分解
      v.parts = path.replaceAll(/[\~\.]/g,'#').split('#');

      if (v.parts.length < 1){
        dev.step(3,v.parts);  // 区切り記号無し
        v.rv.label = path[0];
      } else {
        dev.step(4.1);
        v.rv.label = v.parts.at(-1);  // 最後の要素はlabel
        v.keys  = v.parts.slice(0, -1); // それ以外がpath
        dev.step(4.2);
        let cur = obj;
        for (const key of v.keys) {
          if (cur && typeof cur === 'object' && key in cur) {
            cur = cur[key];
          } else {
            return null;
          }
        }
        v.rv.obj = cur;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** getDoclet: Doclet型のオブジェクトを作成、docletに追加
   * @param {Object} obj - `jsdoc -X`で配列で返されたオブジェクト
   * @param {string} unique - objが存在するファイルの固有パス
   * @returns {null|Error} 正常終了ならnull
   */
  function getDoclet(obj,unique){
    const v = {whois:`${pv.whois}.getDoclet`, arg:{obj,unique}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1);  // Docletの型を判定
      v.type = determineType(obj);
      if( v.type instanceof Error ) throw v.type;
      if( v.type === 'unknown' ) return v.rv; // 型不明は対象外

      dev.step(2);  // 必須項目の存否チェック
      if( typeof obj.meta?.lineno === 'undefined' )
        throw new Error(`no lineno: ${obj.comment}`);
      if( typeof obj.longname === 'undefined' )
        throw new Error(`no longname: ${obj.comment}`);

      /*
      dev.step(3);  // labelを抽出
      // ①JSDoc先頭の「/**」に続く文字列
      v.m = obj.comment.split('\n')[0].match(/^\/\*\*\s*(.+)\n/);
      // ②説明文の先頭行
      v.desc = (obj.description ?? obj.classdesc ?? obj.longname)
        .split('\n')[0] ?? '(ラベル未設定)';
      // ① > (nameまたはclassなら)longname > ②
      v.label = v.m !== null ? v.m[1]
      : (v.type === 'name' || v.type === 'class' ? (obj.longname ?? v.desc) : v.desc);
      */

      dev.step(4);  // Doclet型のオブジェクトを作成
      v.doclet = {
        unique: unique,
        type: v.type,
        jsdocId: unique + obj.meta.filename + ':' + obj.meta.lineno,
        innerFunc: [],
        article: {},
        title: obj.longname.replaceAll(/~/g,'#').split('#')[0],
        label: v.label,
        description: obj.description ?? obj.classdesc ?? '',
        properties: [],
        innerList: [],
        params: [],
        returns: [],
        origin: obj,
      };

      dev.step(5);  // 属性項目についてPropList作成
      ['properties','params','returns'].forEach(x => {
        if( typeof obj[x] !== 'undefined' && Array.isArray(obj[x]) && obj[x].length > 0 ){
          for( v.i=0 ; v.i<obj[x].length ; v.i++ ){
            v.r = getPropList(obj[x][v.i],x,obj);
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

  /** makeArticle: docletを走査、記事毎にArticleを作成
   * - 作成したArticleオブジェクトはdoclet.articleに保存
   * @param {Doclet} obj - (単一の)Doclet型オブジェクト
   * @returns {null|Error}
   */
  function makeArticle(obj) {
    const v = {whois:`${pv.whois}.makeArticle`, arg:{obj}, rv:null};
    const dev = new devTools(v);
    /**
     * @name 一覧文書の構成
     * @desc
     * 
     * - フォルダ毎に作成
     * - 並び順はフォルダ内のデータ型名順(アルファベット順)
     * 
     * 1. ヘッダ部("フォルダ名_top")
     * 2. グローバル関数・クラス一覧("フォルダ名_list")
     * 3. データ型一覧("フォルダ名_type")
     * 4. 個別データ型("フォルダ名-データ型名") ※注意：'_'ではなく'-'
     */
    /**
     * @name クラス・グローバル関数文書の構成
     * @desc
     * 
     * 1. ヘッダ部("クラス名_top")
     *    - タイトル(○○クラス仕様書、等)
     *    - ラベル(一行にまとめた説明)
     *    - 概要説明(数行程度)
     * 2. メンバ一覧("クラス名_prop")
     * 3. メソッド一覧("クラス名_func")
     * 4. 詳細説明("クラス名_desc")
     * 5. 引数("クラス名_param")
     * 6. 戻り値("クラス名_return")
     * 7. 個別メソッド("クラス名-メソッド名") ※注意：'_'ではなく'-'
     *    - innerFuncを再帰呼出
     */
    /**
     * @name データ型定義文書の構成
     * @desc
     * 
     * 1. ヘッダ部("データ型名_top")
     *    - タイトル(○○データ型仕様書、等)
     *    - ラベル(一行にまとめた説明)
     *    - データ型説明文
     * 2. メンバ一覧("クラス名_prop")
     * 3. 個別メソッド("クラス名-メソッド名") ※注意：'_'ではなく'-'
     *    - interfaceにfunctionのメンバが含まれる場合、表の外に記述
     */
    try {

      dev.step(1);  // top: タイトル、ラベル、概要説明
      obj.article.top = new Article({
        title: obj.title,
        anchor: 'top',
        content: (obj.label ? `${obj.label}\n\n` : '')
        + (obj.description ? `${obj.description}\n` : ''),
      });

      // list: グローバル関数・クラス一覧
      // type: データ型一覧
      // ※一覧文書用の欄なのでDocletからの作成は無し

      dev.step(2);  // prop: メンバ一覧

      dev.step(5);  // func
      dev.step(6);  // desc
      dev.step(7);  // param
      dev.step(8);  // returns
      dev.step(9);  // -xxx

      dev.end(obj.article);
      return v.rv;

    } catch (e) { return dev.error(e); }
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
            v.jsdocId = `${o.meta.path ?? ''}/${o.meta.filename ?? ''}-${o.meta.lineno}`;

            if( pv.idList.includes(v.jsdocId) ){
              dev.step(2.2);  // 登録済なら結合
              o = mergeDeeply(pv.map[v.jsdocId],o);
            } else {
              dev.step(2.3);  // 未登録なら登録済IDリストに追加
              pv.idList.push(v.jsdocId);
            }

            dev.step(2.4);  // pv.mapへの登録
            pv.map[v.jsdocId] = o;
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
      // なおテストに伴いJSDoc要素に"jsdocId","result"メンバが追加されるので注意
      // -------------------------------------------------------------
      pv.idList.forEach(x => {

        dev.step(2.1);  // idを追加
        v.mObj = Object.assign({jsdocId:x},pv.map[x]);

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

  /** omitKeyDeep: 【開発用】指定キーを再帰的に除外した新しいオブジェクトを作成
   * @param {Object} obj - オブジェクト。dlMap等を想定
   * @param {string|string[]} keys - 除外するキー名（単数または複数）。"origin"等
   * @returns {Object}
   */
  function omitKeyDeep(obj, keys) {
    const keySet = new Set(
      Array.isArray(keys) ? keys : [keys]
    );

    const walk = value => {
      if (Array.isArray(value)) {
        return value.map(walk);
      }
      if (value === null || typeof value !== 'object') {
        return value;
      }

      return Object.fromEntries(
        Object.entries(value)
          .filter(([k]) => !keySet.has(k))
          .map(([k, v]) => [k, walk(v)])
      );
    };

    return walk(obj);
  }

}