#!/usr/bin/env node
import path from 'path';
import process from 'process';
import { createHash, randomUUID } from 'crypto';
import { spawn } from "node:child_process";
import { writeFileSync, unlinkSync, mkdirSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { devTools } from '../../../library/devTools/3.1.0/core.mjs';
import { mergeDeeply } from '../../mergeDeeply/2.0.0/core.mjs';
import { basename } from 'node:path';
createSpec();

/** 開発工程・残課題
 * @name 開発工程・残課題
 * @desc
 * 
 * - anchorの設定
 * - 各種一覧「データ型」欄内の独自データ型にリンクを自動設定
 * 
 * - DocletTree.dump -> devTools.dump
 *   要素の現在位置を"xxx.aaa.b[0]"という形の文字列として保持、
 *   正規表現/aaa\.b[[0-9]]/でマッチしたら出力という形にする
 * - DocletXXX内でcreateSpec.cfを参照している箇所をDocletXXXメンバに書き換え
 * - description内の'#'について自動的にレベル設定
 * - 固定メニューの追加(ex.フォルダ間のindex.mdの相互参照)
 * - undocumentedチェックを追加
 * - 和文の他、英文のテンプレートも追加
 * - 文法チェック
 *   - ＠class の後に余計な文字列があればエラー
 * - 独自タグ「history」対応
 * - 独自タグ「setvalue」で戻り値に設定する値を指定可能に
 * - createSpecはシェルの起動時パラメータを引数とする関数に変更
 * - class定義をcreateSpec内部に移動
 *   但しインスタンス作成前の宣言が必要
 * - propList.makeTableをDocletTree.makeTableへ統合
 */

async function createSpec(opt={}){
  const pv = {whois:`createSpec`, arg:{}, rv:null};
  const cf = {  // jsdocコマンド動作環境整備関係(config)
    encode: 'utf-8',  // 入力ファイルのエンコード
    command: path.resolve('./node_modules/.bin/jsdoc'), // jsdocコマンド
    jsdocJson: opt.jsdocJson ?? `jsdoc.json`,  // jsdocコマンド設定ファイル名
    dummyDir: opt.dummyDir ?? './dummy',  // jsdoc用の空フォルダ
    jsdocTarget: opt.jsdocTarget ?? ".+\\.(js|mjs|gs|txt)$", // jsdocの動作対象となるファイル名
    useage: `
      createSpec: JavaScriptソース内のJSDocを基に、Markdown形式の仕様書を生成
      
      useage: \`node createSpec.mjs [入力ファイル...] -o 出力フォルダ [-x 除外パターン ...]\`
      
      - 入力側のフォルダに合わせて出力フォルダを作成
      - 一覧＋データ型定義のindex.md＋クラス・グローバル関数毎のMarkdownを作成
      - 詳細は後掲「入出力イメージ」の項を参照
      
      # 使用上の注意
      
      - 処理対象は'.js','.mjs','.gs','.txt'
      - ワイルドカード関係の注意
        - クォートすると展開されない(src/*.jsはOKだが"src/*.js"は不展開)
        - *.js # 任意文字列
        - ?.js # 1文字
        - [a-z].js # 文字クラス
        - **\/*.js # 再帰glob(src/a.js, src/lib/x.js, test/foo.js)
      - 動作時devTools(3.0.0~)が必要
      
      # JSDoc記述上の注意
      
      - グローバル関数・クラス・データ型定義の名称は重複不可
        ∵ リンクを張る場合、リンク先を特定できない
      - 以下はエラーとなる
        - ＠class未定義で＠constructorやメソッドにJSDoc記述
        - グローバル関数未定義で内部関数にJSDoc記述
      - JSDoc開始の「／**」以降に続く文字列は＠descとして扱われる
      - コンストラクタには「＠constructor」必須
      - 「＠history」を独自タグとして定義
      - 先頭のラベルとそれに続く文字列、および他で出現する＠descは
        まとめて一つの@descとして扱われる
      - 説明文(=Markdownとして出力する説明)
        - 「＠name (説明文のタイトル)」＋「＠desc」で開始
        - 「＠name」がない説明文は出力されない(廃棄)
        - クラス・関数内部に記述する場合、「＠memberof」を指定
        - ＠name使用時「／**」以降に続く文字列は廃棄される(上記の例外)
        - ＠desc以降はMarkdownとして扱われ、共通する先頭の空白は削除される
      - クラス・関数への自動リンクは設定されない(手動で\`[]()\`を記述)
      - リンク先のアンカーは以下の命名規則
        - "top" : ページ内先頭
        - "desc" : 説明文
        - 後略
      - ＠typedefでfunctionの定義は不可
      - ＠interfaceではfunction型メンバの定義は可能だが、分離する
        \`\`\`
        ／**
          * ＠interface User
          * ＠property {string} name
          * ＠property {number} age
          * ＠property {boolean} isAdmin
          *／
        ／**
          * ＠function ※ここには記述不可
          * ＠name User#test ※ここには記述不可
          * ＠desc オブジェクト内関数の説明
          * ＠param {string} arg
          * ＠returns {boolean|Error}
          * ＠example オブジェクト内関数の使用例
          *／
        \`\`\`
        なお変数がinterfaceで定義されたデータ型であることは以下のように示す
        \`\`\`
        ／** ＠type {User}*／
        const user = {...}
        \`\`\`
      
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
   * @desc メンバ各値の設定箇所は以下の通り。
   * - opt ~ returns:       DocletEx.constructor()
   * - parent, children:    DocletTree.determineParent()
   * - unique ~ longnameId: DocletTree.registration()
   * 
   * @prop {Object} opt - DocletExインスタンス作成時のオプション
   *   現状未使用
   * @prop {string} uuid - DocletExを一意に識別するためのUUID
   * @prop {string} docletType - Docletの種類。下記「docletTypeの判定ロジック」参照
   * @prop {Object.<string, string>} parsed - Doclet内で定義されたタグの値
   *   例： parsed: {
   *     label:"method01: メソッドテスト", // string
   *     ＠description:"method01: メソッドテスト", // string
   *     ＠memberof:"class01", // string
   *     ＠param:"{number} arg - method01の引数", // string
   *     ＠returns:"{{qId:number,name:string}} NG: qId,name指定無しのObjectになる", // string
   *   }
   * @prop {string} label - 1行で簡潔に記述された概要説明
   *   ① JSDoc先頭の「/**」に続く文字列
   *   ② "＠name"に続く文字列
   *   ③ typdef, interface
   *   ④ description, classdescの先頭行
   *   ⑤ doclet.longname
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
   * @prop {string} [prefix] - 固有パス＋ファイル名
   *   以下の各種IDの共通部分(固有パスの先頭・末尾の'/'有無処理済)
   * @prop {string} [rangeId] - 固有パス＋ファイル名＋':R'＋meta.range[0]
   *   ※ Doclet以外のファイル情報が必要なため、DocletTree側で追加される項目
   * @prop {string} [linenoId] - 固有パス＋ファイル名＋':N'＋meta.lineno ※同上
   * @prop {string} [commentId] - 「固有パス＋ファイル名＋comment」のSHA256
   *   同一commentが同一ファイル内に複数有った場合は設定しない
   * @prop {string} [longnameId] - 固有パス＋ファイル名＋'::'＋longname
   *   なおlongnameIdはアンカーとしても使用するので、'::'後の英文字は付けない
   *   
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
     * @param {Object} [opt={}] - オプション設定値
     */
    constructor(doclet,opt={}){
      const v = {whois:`DocletEx.constructor`, arg:{doclet,opt}, rv:null};
      const dev = new devTools(v,{mode:'dev'});
      try {

        dev.step(1);  // オリジナルのメンバをコピー
        Object.keys(doclet).forEach(x => this[x] = doclet[x]);

        dev.step(2);  // オプション設定
        this.opt = opt;

        dev.step(3);  // 独自ID
        this.uuid = randomUUID();

        dev.step(4);  // docletType
        this.docletType = this.determineType(doclet);
        if( this.docletType instanceof Error) throw this.docletType;

        dev.step(5);    // label
        dev.step(5.1);  // 原文(comment)からタグの内容を整理
        this.parsed = {label:null};
        if( Object.hasOwn(doclet,'comment') ){

          // "/**"で始まる行はラベルと判断
          v.m = doclet.comment.split('\n')[0].match(/\/\*\*\s+([^@].+)/);
          if( v.m ) this.parsed.label = v.m[1];

          // タグ(@xxx)ごとに分解
          v.m = doclet.comment.matchAll(/(\/\*\*|@[a-zA-Z]+)\s*([^@]+)/g);
          [...v.m].forEach(tag => {

            // タグ単位に{key,val}形式に変換
            // ex.`@name User#test\n` ⇒ {key:"@name",val:"User#test"})
            v.tag = {key:tag[1],val:tag[2]};

            // タグの表記統一
            if( ['/**','@desc'].includes(v.tag.key) )
              v.tag.key = '@description';
            if( v.tag.key === '@prop' )
              v.tag.key = '@property';

            // 不要な余白・コメント指示を削除
            v.tag.val = v.tag.val.replace(/^\* /,'')  // 先頭の"* "
            .replaceAll(/\n \* /g,'\n')  // 行頭の" * "
            .replace(/\*\/?\s*$/,'')  // 末尾の"*/"
            .trim();

            // タグの種類毎に配列に追加
            if( Object.hasOwn(this.parsed,v.tag.key) ){
              // 出現済タグの場合は配列に追加
              this.parsed[v.tag.key].push(v.tag.val);
            } else {
              // 未出現タグの場合、配列を用意した上で格納
              this.parsed[v.tag.key] = [v.tag.val];
            }
          });

          // 各タグの値を結合
          Object.keys(this.parsed).forEach(key => {
            if( Array.isArray(this.parsed[key]) ){
              this.parsed[key] = this.parsed[key].join('\n').trim();
            }
          })
        }

        dev.step(5.2);  // 以下の優先順位でlabelを設定
        // ① JSDoc先頭の「/**」に続く文字列
        // ② "@name"に続く文字列
        // ③ typdef, interface
        // ④ description, classdescの先頭行
        // ⑤ doclet.longname
        if( this.parsed.label !== null ){
          this.label = this.parsed.label;
        } else if( Object.hasOwn(this.parsed,'@name') ){
          this.label = this.parsed['@name'];
        } else if( Object.hasOwn(this.parsed,'@typedef') ){
          // `@typedef {...} xxx - 説明`形式 ⇒ label=説明
          v.m1 = this.parsed['@typedef'].match(/\}\s+[^\-]+\s+\-\s+(.+)$/);
          // `@typedef {...} xxx`形式 ⇒ label=xxx
          v.m2 = this.parsed['@typedef'].match(/\}\s+(.+)$/);
          this.label = v.m1 !== null ? v.m1[1]
            : (v.m2 !== null ? v.m2[1] : '(ラベル未設定)');
        } else if( Object.hasOwn(this.parsed,'@interface') ){
          this.label = this.parsed['@interface'];
        } else if( Object.hasOwn(this.parsed,'@description') ){
          v.m = this.parsed['@description'].split('\n');
          this.label = v.m[0];
          this.parsed['@description'] = doclet.description = v.m.slice(1).join('\n');
        } else if( Object.hasOwn(this.parsed,'@classdesc') ){
          v.m = this.parsed['@classdesc'].split('\n');
          this.label = v.m[0];
          this.parsed['@classdesc'] = doclet.classdesc = v.m.slice(1).join('\n');
        } else if( Object.hasOwn(doclet,'longname') ){
          this.label = doclet.longname;
        } else {
          this.label = '(ラベル未設定)';
        }

        dev.step(6);  // properties
        v.r = new PropList(doclet.properties);
        if( v.r instanceof Error ) throw v.r;
        if( v.r instanceof PropList ) this.properties = v.r;

        dev.step(7);  // params
        v.r = new PropList(doclet.params);
        if( v.r instanceof Error ) throw v.r;
        if( v.r instanceof PropList ) this.params = v.r;

        dev.step(8);  // returns
        v.r = new PropList(doclet.returns
          // name, value は不要なのでorderから削除
          ,{order:['type','desc','note']});
        if( v.r instanceof Error ) throw v.r;
        if( v.r instanceof PropList ){
          this.returns = v.r;
        }

        dev.step(9);  // parent, childrenの初期値設定
        // 実値は全Doclet作成後にDocletTree.determineParentで設定
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
   * @prop {Object} [opt={}] - オプション設定値。設定値はconstructor参照
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


        dev.end(); // 終了処理
      } catch (e) { return dev.error(e); }
    }

    /** article: タイトル行＋記事のMarkdown文字列作成
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
      const dev = new devTools(v);
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
        dev.end(v.rv); // 終了処理
        return v.rv;
      } catch (e) { return dev.error(e); }
    }

    /** determineParent: 対象要素が子要素であるとき親要素を特定
     * メソッド⇒クラス、内部関数⇒グローバル関数、等
     * 1. child.memberof === parent.longname
     * 2. child.rangeが包含されている直近の要素
     */
    determineParent(){
      const v = {whois:`${this.constructor.name}.determineParent`, arg:{}, rv:null};
      const dev = new devTools(v,{mode:'dev'});
      try {

        for( v.i=0 ; v.i<this.doclet.length ; v.i++ ){

          dev.step(1);  // parent, childrenの初期値設定
          v.d = this.doclet[v.i];
          v.d.parent = null;
          v.d.children = [];

          dev.step(2);  // ①：child.memberof === parent.longnameで判定
          if( Object.hasOwn(v.d,'memberof' )){
            v.key = v.d.prefix + v.d.memberof;
            if( Object.hasOwn(this.map,v.key) && this.map[v.key] !== null ){
              // memberof:longnameが一意に親が決定されたらOK
              v.d.parent = this.map[v.key].uuid;
            }
          }

          dev.step(3);  // ②：①で決まらない場合、子要素を包摂する直近の要素
          if( v.d.parent === null && typeof v.d.meta?.range !== 'undefined' ){
            v.minSize = Infinity;
            for( v.t of this.doclet ){
              dev.step(2.1);  // 比較元=比較先またはrangeが無ければスキップ
              if( v.d === v.t || !v.t.meta?.range ) continue;
              dev.step(2.2);  // 比較元の開始・終了位置が比較先の開始・終了位置の範囲内か判定
              if( v.t.meta.range[0] <= v.d.meta.range[0] && v.d.meta.range[1] <= v.t.meta.range[1] ){
                dev.step(2.3);  // 比較先の終了位置−開始位置が最小のものが直近
                v.size = v.t.meta.range[1] - v.t.meta.range[0];
                if( v.size < v.minSize ){
                  v.minSize = v.size;
                  v.d.parent = v.t.uuid; // 比較先を比較元の親要素として設定
                }
              }
            }
          }

          dev.step(4);  // 親要素のchildrenに比較元を登録
          if( v.d.parent !== null )
            this.map[v.d.parent].children.push(v.d.uuid);
        }

        dev.end(); // 終了処理
        return v.rv;

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
      const dev = new devTools(v,{mode:'dev'});
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

        /* 【未使用】正規表現にマッチするキーだけを再帰的に抽出(copilot)
        const input = {
          a01: { b01: { a02: 10, b02: 20 } },
          a03: 30,
          b03: 31,
          b04: { a04: 40, c01: 1 }
        };
        const regex = /^a0.＊/;
        const filtered = filterKeysByRegex(input, regex);
        console.log(filtered);
        */
        const filterKeysByRegex = (obj, regex) => {
          if (typeof obj !== 'object' || obj === null) return undefined;

          const result = Array.isArray(obj) ? [] : {};

          for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
              const value = obj[key];
              const filteredValue = filterKeysByRegex(value, regex);

              if (regex.test(key)) {
                result[key] = filteredValue !== undefined ? filteredValue : value;
              } else if (filteredValue !== undefined) {
                result[key] = filteredValue;
              }
            }
          }

          return Object.keys(result).length > 0 ? result : undefined;
        }

        dev.step(1);  // 既定値設定
        arg = Object.assign({
          data: this.doclet,
          paths: [],
          filter: null,
        },arg);

        dev.step(2);  // 指定条件に合致するDocletを抽出
        v.target = typeof arg.filter === 'function' ? arg.data.filter(arg.filter) : arg.data;

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

        dev.step(4);  // Docletの親子関係関連付け
        v.r = v.rv.determineParent();
        if( v.r instanceof Error ) throw v.r;

        dev.end(); // 終了処理
        return v.rv;
      } catch (e) { return dev.error(e); }
    }

    /** makeDocletMD: 単一DocletExのインスタンスからMarkdownを作成
     * - フォルダ内クラス・グローバル関数一覧＋データ型定義一覧(index.html)は
     *   DocletTreeFolder.markdownで作成
     * @param {string} [uuid=this.uuid] - 対象DocletEx.uuid
     * @param {number} [level=1] - 階層の深さ
     * @returns {string|Error}
     */
    makeDocletMD(uuid,level=1) {
      const v = {whois:`${this.constructor.name}.makeDocletMD`, arg:{uuid,level}, rv:[]};
      const dev = new devTools(v,{mode:'dev'});
      /**
       * @name 文書の構成
       * @memberof makeDocletMD
       * @description
       * 
       * | 項目名      | ①クラス<br>・関数 | ②データ型 | ③説明文 | 識別子 | 備考 |
       * | :--        | :--: | :--: | :--: | :-- | :-- |
       * | ヘッダ部    |    |    |   | _top |  |
       * | — タイトル  | ⭕ | ⭕ | ⭕ |         | ○○クラス(データ型)仕様書、等 |
       * | — ラベル    | ⭕ | ⭕ | ❌ |         | 一行にまとめた説明 |
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
        dev.step(99.1129,v.d);
        v.anchor = v.d.longnameId;

        dev.step(2);  // ヘッダ部
        v.r = this.article({
          title: `🧩 ${this.opt.title[v.d.docletType].replace('_',v.d.name)}`,
          level: level,
          url: '',
          anchor: `${v.anchor}_top`,
          content: v.d.label,
        });
        dev.step(99.1141,{r:v.r,rv:v.rv});
        if( v.r instanceof Error ) throw v.r;
        v.rv.push(v.r);

        dev.step(3,v.rv); // メンバ一覧
        /*
        if( v.d.properties instanceof PropList ){
          v.t = v.d.properties.makeTable();
          if( v.t instanceof Error ) throw v.t;
          v.r = this.article({
            title: `🔢 メンバ一覧`,
            level: level+1,
            url: `#${v.anchor}_top`,
            anchor: `${v.anchor}_prop`,
            content: v.t,
          });
          if( v.r instanceof Error ) throw v.r;
          v.rv.push(v.r);
        }

        dev.step(4); // メソッド一覧
        if( v.d.children && v.d.children.length > 0 ){
          // 一覧用のデータ作成
          v.list = [];
          for( v.i=0 ; v.i<v.d.children.length ; v.i++ ){
            v.c = this.map[v.d.children[v.i].uuid];
            v.list.push({
              no:    v.i+1,
              name:  v.c.name,
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
            title: `🧱 メソッド・内部関数一覧`,
            level: level+1,
            url: `#${v.anchor}_top`,
            anchor: `${v.anchor}_func`,
            content: v.r,
          });
          if( v.r instanceof Error ) throw v.r;
          v.rv.push(v.r);
        }

        dev.step(5); // 説明文
        ['description','classdesc'].forEach(x => {
          // 元データであるdoclet.descriptionは@descが複数有った場合、最後のみ有効
          // ⇒ 複数の@desc結合済のdoclet.parsed.descriptionを使用
          if( v.d[x] && v.d.parsed[`@${x}`].length > 0 )
            v.content += `\n${v.d.parsed[`@${x}`]}`;
        });
        v.desc = [];
        if( v.desc.length > 0 ){
          v.rv.push(...['',`${'#'.repeat(level+1)} 🧾 概説`],...v.desc);
        }

        dev.step(6); // 引数
        if( v.d.params instanceof PropList ){
          v.r = v.d.params.makeTable();
          if( v.r instanceof Error ) throw v.r;
          v.rv.push(...['',`${'#'.repeat(level+1)} ▶️ 引数`,''],v.r)
        }

        dev.step(7); // 戻り値
        if( v.d.returns instanceof PropList ){
          v.r = v.d.returns.makeTable();
          if( v.r instanceof Error ) throw v.r;
          v.rv.push(...['',`${'#'.repeat(level+1)} ◀️ 戻り値`,''],v.r)
        }

        dev.step(8); // 個別メソッド、内部関数
        */

        /*
        dev.step(1);  // ヘッダ部
        v.d = this.map[uuid];
        v.rv = ['#'.repeat(level) + ' 🧩 '
          + this.opt.title[v.d.docletType].replace('_',v.d.name)];  // タイトル
        
        dev.step(2); // ラベル
        if( v.d.label ) v.rv.push(...['',v.d.label]);

        dev.step(3); // 説明文
        v.desc = [];
        ['description','classdesc'].forEach(x => {
          // doclet.descriptionは@descが複数有った場合最後のみ有効
          // ⇒ 複数の@desc結合済のdoclet.parsed.descriptionを使用
          if( v.d[x] && v.d.parsed[`@${x}`].length > 0 )
            v.desc.push('',v.d.parsed[`@${x}`]);
        });
        if( v.desc.length > 0 ){
          v.rv.push(...['',`${'#'.repeat(level+1)} 🧾 概説`],...v.desc);
        }

        dev.step(4); // メンバ一覧
        if( v.d.properties instanceof PropList ){
          v.r = v.d.properties.makeTable();
          if( v.r instanceof Error ) throw v.r;
          v.rv.push(...['',`${'#'.repeat(level+1)} 🔢 メンバ一覧`,''],v.r)
        }

        dev.step(5); // 引数
        if( v.d.params instanceof PropList ){
          v.r = v.d.params.makeTable();
          if( v.r instanceof Error ) throw v.r;
          v.rv.push(...['',`${'#'.repeat(level+1)} ▶️ 引数`,''],v.r)
        }

        dev.step(6); // 戻り値
        if( v.d.returns instanceof PropList ){
          v.r = v.d.returns.makeTable();
          if( v.r instanceof Error ) throw v.r;
          v.rv.push(...['',`${'#'.repeat(level+1)} ◀️ 戻り値`,''],v.r)
        }

        dev.step(7); // メソッド一覧
        if( v.d.children && v.d.children.length > 0 ){
          [v.children,v.num] = [[],1];
          v.d.children.map(uuid => {
            v.o = {
              uuid: uuid,
              no: v.num++,
              name: this.map[uuid].name,
              anchor: ``, // いまここ：アンカーの設定方法
              label: this.map[uuid].label,
            }
          });
        }

        // 🧩 想定する実装
        // 📥 引数
        // 📤 戻り値
        // 🧱 authClient.exec()
        */

        dev.end(v.rv);
        return v.rv.join('\n').trim();

      } catch (e) { return dev.error(e); }
    }

    /** makeIndexMD: フォルダ単位のクラス・グローバル関数一覧＋データ型定義のMarkdownを作成
     * @param {DocletTreeFolder} folder 
     * @returns {string|Error}
     */
    makeIndexMD(folder){
      const v = {whois:`${this.constructor.name}.makeIndexMD`, arg:{folder}, rv:[]};
      const dev = new devTools(v);
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
        v.rv.push('',`# データ型定義一覧`);
        v.data = [];
        dev.step(3.1);  // テーブル用データ作成
        v.list.forEach(doclet => {
          v.data.push({
            name: `[${doclet.name}](#${doclet.name})`,
            label: doclet.label,
          });
        });
        dev.step(3.2);  // Markdownテーブル作成
        v.r = DocletTree.makeTable(v.data,{header:[
          {key:'name',label:'データ型名',align:':--'},
          {key:'label',label:'概要',align:':--'},
        ]});
        if( v.r instanceof Error ) throw v.r;
        v.rv.push('',v.r);

        dev.step(4);  // 個別データ型定義
        v.rv.push('',`# 個別データ型定義`)
        v.list.forEach(doclet => {
          v.rv.push('',`## <span id="${doclet.name}">"${doclet.name}" データ型定義</span>`);
          v.r = doclet.properties.makeTable();
          if( v.r instanceof Error ) throw v.r;
          v.rv.push('',v.r);
        });

        v.rv = v.rv.join('\n');
        dev.end(); // 終了処理
        return v.rv;
      } catch (e) { return dev.error(e); }
    }

    /** makeTable: Markdownのテーブル作成
     * @param {Object.<string, any>[]} data - テーブル作成用データ
     * @param {Object} [opt={}]
     * @param {Object[]} [opt.header=[]] - {key,label,align}形式のオブジェクト
     *   keyは必須。labelの既定値はkey(=dataのメンバ名)
     *   alingはMarkdownテーブルの配置指定文字列(':--'(既定値) or ':--:' or '--:')
     * @param {number} [opt.indent=0] - テーブルの左余白桁数
     * @returns {string|Error}
     */
    static makeTable(data,opt={}){
      const v = {whois:`${this.constructor.name}.makeTable`, arg:{}, rv:[[],[]]};
      const dev = new devTools(v);
      try {

        dev.step(1);  // オプションの既定値設定
        opt.header = opt.header ?? [];
        opt.indent = opt.indent ?? 0;
        if( opt.header.length === 0 ){
          opt.header = [...new Set(data.flatMap(obj => Object.keys(obj)))]
          .map(o => {return {key:o,label:o,align:':--'}});
        } else {
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
        data.forEach(l => v.rv.push(opt.header.map(x => l[x.key])));

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
     * @param {DocletTreeFolder} [folder=this.folder] - 対象フォルダ
     * @param {string} [outDir=this.source.outDir] - 出力先(親)フォルダのパス
     * @returns {null|Error}
     */
    output(folder=this.folder,outDir=this.source.outDir) {
      const v = {whois:`${this.constructor.name}.output`, arg:{}, rv:null};
      const dev = new devTools(v,{mode:'dev'});
      try {

        dev.step(1);  // 出力先フォルダ配下に固有パス毎のフォルダを作成
        v.path = outDir + '/' + folder.folderName;
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
        v.r = this.makeIndexMD(folder);
        if( v.r instanceof Error ) throw v.r;
        writeFileSync(`${v.path}/index.md`,v.r);

        dev.step(4);  // 子フォルダを再帰呼出
        for( v.i=0 ; v.i<folder.children.length ; v.i++ ){
          v.r = this.output(folder.children[v.i],v.path);
          if( v.r instanceof Error ) throw v.r;
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
        dev.step(2.4);  // 固有パス＋ファイル名＋longname
        if( typeof doclet.longname !== 'undefined' ){
          doclet.longnameId = doclet.prefix + `::${doclet.longname}`;
          // longnameは重複判定に使用しないので作成のみ
          // this.mapへの登録は他のIDと異なり
          // 「未登録なら追加、登録済(longname重複)ならnull」
          // とするため、後続ステップではなくここで行う
          this.map[doclet.longnameId] = Object.hasOwn(this.map,doclet.longnameId) ? null : doclet;
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
      console.log(cf.useage);
      dev.end(); // 終了処理
      return v.rv;
    }

    dev.step(2);  // 対象ファイルの情報を取得
    pv.rv = listSource(pv.argv)
    if( pv.rv instanceof Error ) throw pv.rv;
    const doc = await DocletTree.initialize(pv.rv);

    dev.step(3);  // フォルダ作成＋ファイル出力
    pv.rv = doc.output();
    if( pv.rv instanceof Error ) throw pv.rv;

    console.log(writeFileSync('tmp/folder.json',JSON.stringify(doc.folder)));
    dev.end(
      /*
      doc.dump({
        paths:['longname','longnameId','anchor'],
        //filter:x => !Object.hasOwn(x,'longname'),
      })
      */
    );
    // doc.dump
    // labelの設定値確認
    // {paths:['label'],}
    // class01重複チェック
    // {paths:['rangeId','linenoId','commentId'],filter:x=>x.kind==='class'}
    // meta.range未定義
    // {paths:['comment'],filter:x=>typeof x.meta?.range === 'undefined'}
    // ⇒ @name, @typedef, @interface, @function(@name付き)
    // id作成関係メンバ
    // {paths:['unique','meta.path','meta.filename','meta.range','meta.lineno','meta.columnno','kind','longname'],filter:x=>x.kind==='class'}
    return pv.rv;

  } catch (e) { dev.error(e); return e; }
}