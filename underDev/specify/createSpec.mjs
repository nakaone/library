#!/usr/bin/env node
import path from 'path';
import process from 'process';
import { createHash, randomUUID } from 'crypto';
import { spawn } from "node:child_process";
import { writeFileSync, unlinkSync, mkdirSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { devTools } from '../../../library/devTools/3.1.0/core.mjs';
import { mergeDeeply } from '../../mergeDeeply/2.0.0/core.mjs';
createSpec();

/** 開発工程・残課題
 * @name 開発工程・残課題
 * @desc
 * 
 * - DocletXXX内でcreateSpec.cfを参照している箇所をDocletXXXメンバに書き換え
 * - DocletEx.idの重複確認
 *   - 重複シンボルがあればエラーメッセージ？統合？
 * - [bug] createSpec.output step.3
 *   TypeError: Cannot read properties of undefined (reading 'makeTable')
 *   - 「kind:"package"」がtypedef対象のループで呼ばれている
 *   - docletType='typedef'||'interface'??? ⇒ OK:'unknown'
 *   - typedefに間違って登録されている？ ⇒ false
 *   - doc.map[id]が間違ったdocletを指している？ ⇒ DocletEx.idの重複確認を先行させる
 * - anchor, linkの設定
 * - 固定メニューの追加(ex.フォルダ間のindex.mdの相互参照)
 * - [bug] 説明文が複数回出力される
 * - undocumentedチェックを追加
 * - シンボル・メソッドと一致する文字列にはリンクを自動生成
 * - 和文の他、英文のテンプレートも追加
 * - 文法チェック
 *   - ＠class の後に余計な文字列があればエラー
 * - history対応
 * - createSpecはシェルの起動時パラメータを引数とする関数に変更
 * - class定義をcreateSpec内部に移動
 *   但しインスタンス作成前の宣言が必要
 */

async function createSpec(opt={}){
  const pv = {whois:`createSpec`, arg:{}, rv:null};
  const cf = {  // jsdocコマンド動作環境整備関係(config)
    encode: 'utf-8',  // 入力ファイルのエンコード
    command: path.resolve('./node_modules/.bin/jsdoc'), // jsdocコマンド
    jsdocJson: opt.jsdocJson ?? `jsdoc.json`,  // jsdocコマンド設定ファイル名
    dummyDir: opt.dummyDir ?? './dummy',  // jsdoc用の空フォルダ
    jsdocTarget: opt.jsdocTarget ?? ".+\\.(js|mjs|gs|txt)$", // jsdocの動作対象となるファイル名
  };
  const dev = new devTools(pv,{mode:'dev',footer:true});

  /** PropList: 属性一覧に表示する項目
   * @class
   * @prop {object[]} list - 項目一覧
   * @prop {string}   list.name - 項目名
   * @prop {string}   list.type - データ型。複数なら' | 'で区切って並記
   * @prop {string}   list.value - 要否/既定値。「必須」「任意」または既定値
   * @prop {string}   list.desc - 1行の簡潔な項目説明
   * @prop {string}   list.note - 備考
   * @prop {Object}   opt - オプション。内容はconstructorのparam参照
   */
  class PropList {
    /** 属性一覧表示用のオブジェクトを作成
     * @constructor
     * @param {DocletColDef} doclet - Docletの項目定義オブジェクト
     * @param {Object} [opt={}] - オプション
     * @param {string} [opt.lang=ロケール] - ラベルに使用する言語(ex.'ja-JP')
     * @param {Object} [opt.label] - 項目のメンバ名->Markdown作成時のラベル文字列への変換マップ
     *   既定値に統合するので、変更・追加項目のみ指定すれば可。
     *   例：valueを「要否/既定値」から「値」に変更 ⇒ {value:'値'}
     *   　　独自項目'foo'を追加 ⇒ {foo:'ダミー'}
     * @param {string} [opt.order=['name','type','value','desc','note']] - 項目の並び順
     *   記載されていない項目はMarkdownで表を作成する際、非表示になる。
     *   既定値を置換するので、変更する場合は全項目を指定する。
     *   例：value,noteは表示不要、独自項目fooを追加 ⇒ ['name','type','desc','foo']
     * @param {Object} [opt.value] - 項目の値->Markdown作成時の表示への変換マップ
     * @returns {PropList|{}|Error} 処理対象属性が無い場合は{}
     */
    constructor(doclet,opt={}){
      const v = {whois:`PropList.constructor`, arg:{doclet,opt}, rv:{}};
      const dev = new devTools(v,{mode:'dev'});
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
              .join(' \\| '),
            value: typeof col.defaultvalue !== 'undefined' ? col.defaultvalue
              : (col.optional === true ? this.opt.value.optional : this.opt.value.required),
            desc: v.desc[0],
            note: v.desc.slice(1).join('\n').trim(),  // 2行目以降。先頭・末尾の空行は削除
          };
          this.list.push(v.o);
        });

        dev.end(); // 終了処理

      } catch (e) { return dev.error(e); }

    }

    /** makeTable: Markdownのテーブル作成
     * @param {number} [indent=0] - テーブルの左余白桁数
     * @returns {string|Error}
     */
    makeTable(indent=0){
      const v = {whois:`${this.constructor.name}.makeTable`, arg:{}, rv:null};
      const dev = new devTools(v,{mode:'dev'});
      try {

        dev.step(1);  // ヘッダ部
        v.lines = [[],[]];
        this.opt.order.forEach(x => {
          v.lines[0].push(this.opt.label[x]);
          v.lines[1].push(':--');
        });

        dev.step(2);  // データ部
        this.list.forEach(l => v.lines.push(this.opt.order.map(x => l[x])));

        dev.step(3);  // テキストに変換
        v.rv = v.lines.map(l => `${' '.repeat(indent)}| ${l.join(' | ')} |`).join('\n');

        dev.end();
        return v.rv;
      
      } catch (e) { return dev.error(e); }
    }
  }

  /** DocletTreeFolder: パス毎の所属Doclet管理(フォルダ管理)
   * @class DocletTreeFolder
   * @prop {string} folderName
   * @prop {Object.<string, DocletEx>} funclass - グローバル関数・クラス定義(key=DocletEx.uuid)
   * @prop {Object.<string, DocletEx>} typedef - データ型定義(key=DocletEx.uuid)
   * @prop {DocletTreeFolder[]} children - 子フォルダ
   */
  class DocletTreeFolder {
    constructor(folderName){
      this.folderName = folderName;
      this.funclass = {};
      this.typedef = {};
      this.children = {};
    }

    markdown(){
      const v = {whois:`${this.constructor.name}.markdown`, arg:{}, rv:null};
      const dev = new devTools(v);
      try {

        dev.end(); // 終了処理
        return v.rv;
      } catch (e) { return dev.error(e); }
    }
  }

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
   * @prop {string} uuid - DocletExを一意に識別するためのUUID
   * @prop {string} docletType - Docletの種類。下記「docletTypeの判定ロジック」参照
   * @prop {string} label - 1行で簡潔に記述された概要説明
   *   ① `／** `に続く文字列
   *   ② description, classdesc があれば先頭行
   *   ③ longname
   *   ※ 上記に該当が無い場合、「(ラベル未設定)」
   * @prop {PropList} [properties] - メンバ一覧(※DocletのそれをPropListで置換)
   * @prop {PropList} [params] - 引数。クラスの場合はconstructorの引数(※同上)
   * @prop {PropList} [returns=[]] - 戻り値(※同上)
   * 
   * @prop {string} [parent=null] - 親要素のDocletEx.id
   * @prop {string[]} [children=[]] - 子要素(メソッド・内部関数)のDocletEx.id
   * 
   * @prop {string} [unique] - 固有パス
   *   ルートは'/'、子孫が有る場合先頭の'/'無し・末尾'/'有り(ex."common/subtest/")
   * @prop {string} [basename] - ファイル名
   * @prop {string} [rangeId] - 固有パス＋ファイル名＋meta.range[0]
   *   ※ Doclet以外のファイル情報が必要なため、DocletTree側で追加される項目
   * @prop {string} [linenoId] - 固有パス＋ファイル名＋meta.lineno ※同上
   * @prop {string} [commentId] - 「固有パス＋ファイル名＋comment」のSHA256
   *   同一commentが同一ファイル内に複数有った場合は設定しない
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
     */
    constructor(doclet){
      const v = {whois:`DocletEx.constructor`, arg:{doclet}, rv:null};
      const dev = new devTools(v,{mode:'dev'});
      try {

        dev.step(1);  // オリジナルのメンバをコピー
        Object.keys(doclet).forEach(x => this[x] = doclet[x]);

        dev.step(2);  // 独自ID
        this.uuid = randomUUID();

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

        dev.end();

      } catch (e) { return dev.error(e); }
    }

    /** determineType: Docletの型を判定
     * @param {Object} doclet
     * @returns {string|Error} 「docletTypeの判定ロジック」参照
     */
    determineType(doclet) {
      const v = {whois:`${this.constructor.name}.determineType`, arg:{doclet}, rv:'unknown'};
      const dev = new devTools(v,{mode:'dev'});
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
  /** DocletTreeFile: 個別入力ファイル情報
   * @typedef {Object} DocletTreeFile
   * @prop {string} full - フルパス＋ファイル名
   * @prop {string} unique - 固有パス(フルパス−共通部分)
   *   ルートは'/'、子孫が有る場合先頭の'/'無し・末尾'/'有り(ex."common/subtest/")
   * @prop {string} basename - ファイル名
   * @prop {string} content - ファイルの内容
   * @prop {Doclet[]} jsdoc - `jsdoc -X`の実行結果オブジェクト
   */
  /** DocletTreeSource: 統合版入力ファイル(JSソース)情報
   * @typedef {Object} DocletTreeSource
   * @prop {string} [common=''] - フルパスの共通部分
   * @prop {string} [outDir=''] - 出力先フォルダ名(フルパス)
   * @prop {number} [num=0] - 対象ファイルの個数
   * @prop {DocletTreeFile[]} [files=[]] - 対象ファイルの情報
   */
  /** DocletTree: 処理対象ソース・Docletの全体構造を管理
   * @class DocletTree
   * @prop {DocletTreeSource} source - 処理対象となるソースファイル
   * @prop {DocletEx[]} doclet - 独自情報を付加したDocletExの配列
   * @prop {Object.<string, DocletEx>} map - rangeId/linenoId/commentIdをキーにしたDocletExのマップ
   * @prop {Object.<string, DocletTreeFolder>} folder - パス毎の所属Doclet管理。キーはフォルダ名
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
        this.map = {};
        this.folder = new DocletTreeFolder('/');
        this.opt = opt;

        dev.end(); // 終了処理
      } catch (e) { return dev.error(e); }
    }

    /** dump: 【開発用】指定条件のDocletを抽出、指定メンバのみ抽出したオブジェクトを生成
     * @param {Object} arg
     * @param {string[]} arg.paths - '.'区切りで階層化された、抽出対象となるメンバ
     *   ex. 'longname','meta.range' ⇒ {longname:'xxx',meta:{range:[1,2]}}
     * @param {Object|Object[]} [arg.data=this.doclet] - 抽出元データ
     * @param {Function} [arg.filter=null] - 抽出対象指定関数。nullなら全件
     * @returns {Object[]|Error}
     * 
     * @example
     * doc.dump({paths:['meta.range','longname'],filter:x=>x.kind==='class'})
		 * ⇒ [
		 *   {
		 *     meta:    {
		 *       range:      [
		 *         1879, // number
		 *         2606, // number
		 *       ], // Array
		 *     }
		 *     longname:"class01", // string
		 *   }
		 *   {
		 *     meta:    {
		 *       range:      [
		 *         2180, // number
		 *         2398, // number
		 *       ], // Array
		 *     }
		 *     longname:"class01", // string
		 *   }
		 * ], // Array
     */
    dump(arg){
      const v = {whois:`${this.constructor.name}.dump`, arg:{arg}, rv:[]};
      const dev = new devTools(v);
      try {        

        const pickPaths = (obj, paths) => {
          const result = {};

          for (const path of paths) {
            const keys = path.split('.');
            let src = obj;
            let dst = result;
            let valid = true;

            for (let i = 0; i < keys.length; i++) {
              const key = keys[i];

              if (!(key in src)) {
                valid = false;
                break;
              }

              if (i === keys.length - 1) {
                // 最後のキーなら値をコピー
                dst[key] = src[key];
              } else {
                // 中間ノードを作成または再利用
                if (!(key in dst)) {
                  dst[key] = {};
                }
                src = src[key];
                dst = dst[key];
              }
            }
          }

          return result;
        }

        dev.step(1);  // 既定値設定
        arg = Object.assign({
          data: this.doclet,
          paths: [],
          filter: null,
        },arg);

        dev.step(2);  // 指定条件に合致するDocletを抽出
        v.target = arg.filter !== null ? arg.data.filter(filter) : arg.data;

        dev.step(3);  // 配列なら個別に、オブジェクトならそのまま指定メンバ抽出
        if( Array.isArray(v.target) ){
          v.target.forEach(x => v.rv.push(pickPaths(x,arg.paths)));
        } else {
          v.rv = pickPaths(v.target,arg.paths);
        }

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
        const dev = new devTools(v,{mode:'dev'});

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
     * @returns {DocletTree|Error}
     */
    static async initialize(arg,opt={}){
      const v = {whois:`DocletTree.initialize`, arg:{arg,opt}, rv:null};
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

        dev.end(); // 終了処理
        return v.rv;
      } catch (e) { return dev.error(e); }
    }

    /** registration: DocletEx生成時の重複登録チェック＋マップへの登録
     * @param {DocletEx} doclet - 生成直後のDocletExインスタンス
     * @param {DocletTreeFile} file - doclet抽出元の個別入力ファイル情報
     * @returns {null|Error}
     */
    registration(doclet,file){
      const v = {whois:`DocletTree.registration`, arg:{doclet,file}, rv:null};
      const dev = new devTools(v);
      try {

        dev.step(1);  // 固有パスとファイル名(meta.filenameが無い場合への備え)
        doclet.unique = file.unique;
        doclet.basename = file.basename;

        dev.step(2);  // 重複チェック用のキー作成
        v.dupkey = '';  // 登録済のdocletがあればtrue
        v.fn = `${file.unique}/${file.basename}:`; // 固有パス＋ファイル名

        // 信頼性の低い順にチェックし、より信頼度の高いものが一致すれば置換する
        dev.step(2.1);  // 「固有パス＋ファイル名＋comment」のハッシュ
        // 「/** 〜 */」が同一ファイル内で一箇所のみ
        if( typeof doclet.comment !== 'undefined'
            && file.content.split(doclet.comment).length === 2 ){
          doclet.commentId = createHash('sha256')
            .update(v.fn + doclet.comment).digest('hex');
          if( typeof this.map[doclet.commentId] !== 'undefined' )
            v.dupkey = doclet.commentId;
        }
        dev.step(2.2);  // 固有パス＋ファイル名＋lineno
        if( typeof doclet.meta?.lineno !== 'undefined' ){
          doclet.linenoId = v.fn + `L${doclet.meta.lineno}`;
          if( typeof this.map[doclet.linenoId] !== 'undefined' )
            v.dupkey = doclet.linenoId;
        }
        dev.step(2.3);  // 固有パス＋ファイル名＋range[0]
        if( typeof doclet.meta?.range !== 'undefined' ){
          doclet.rangeId = v.fn + `R${doclet.meta.range[0]}`;
          if( typeof this.map[doclet.rangeId] !== 'undefined' )
            v.dupkey = doclet.rangeId;
        }

        if( v.dupkey.length > 0 ){
          dev.step(3);  // 登録済なら既存DocletExに情報追加
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
                v.folder.children[folderName] = new DocletTreeFolder(folderName);
              }
              v.folder = v.folder.children[folderName];
            });
          }
          // グローバル関数・クラスまたはデータ型定義の場合、登録
          if( ['function','class'].includes(doclet.docletType) )
            v.folder.funclass[doclet.uuid] = doclet;
          else if( ['typedef','interface'].includes(doclet.docletType) )
            v.folder.typedef[doclet.uuid] = doclet;
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

    console.log(writeFileSync('tmp/folder.json',JSON.stringify(doc.folder)));
    dev.end();
    // doc.dump
    // class01重複チェック
    // {path:['rangeId','linenoId','commentId'],filter:x=>x.kind==='class'}
    // meta.range未定義
    // {path:['comment'],filter:x=>typeof x.meta?.range === 'undefined'}
    // ⇒ @name, @typedef, @interface, @function(@name付き)
    // id作成関係メンバ
    // {path:['unique','meta.path','meta.filename','meta.range','meta.lineno','meta.columnno','kind','longname'],filter:x=>x.kind==='class'}
    return pv.rv;

  } catch (e) { dev.error(e); return e; }
}