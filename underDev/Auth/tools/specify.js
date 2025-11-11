/** specify: JavaScriptオブジェクトで定義した内容をMarkdownで出力
 * 
 * @example
 * 1. 定義部分(def.js)
 *    ```js
 *    console.log(JSON.stringify({  // オブジェクトで仕様を定義、JSONを標準出力に出力
 *      authAuditLog: {
 *        label: 'authServerの監査ログ',
 *        note: `
 *          - 監査ログ出力が必要なメソッドの冒頭でインスタンス化、処理開始時刻等を記録
 *          - 出力時にlogメソッドを呼び出して処理時間を計算、シート出力`,
 *        members: [...],
 *        methods: {
 *          constructor: {
 *            type: 'private',
 *            label: 'コンストラクタ',
 *            params: [],
 *            process: `- メンバと引数両方にある項目は、引数の値をメンバとして設定`,
 *            returns: {authAuditLog:{}},
 *          },
 *        },
 *      },
 *    }));
 *    ```
 * 2. 仕様書作成エンジン(specify.js)
 *    ```js
 *    // JSON化された定義を処理、出力先フォルダにMarkdownファイルを作成
 *    const lines = [];
 *    const rl = require('readline').createInterface({input: process.stdin});
 *    rl.on('line', x => lines.push(x)).on('close',() => {
 *      rl.close();
 *      classdef = JSON.parse(lines.join('\n'));
 *      main();
 *    });
 *    ```
 * 3. ビルダー(build.sh)
 *    ```zsh
 *    # クラス別定義
 *    node $src/doc/def.js | node $prj/tools/specify.js -o:$tmp
 *    ```
 * 
 * ■ 凡例
 * - 🔢：導出項目(定義不要)
 */

/**
 * @typedef {Object} ClassesDef - 特定のプロジェクトで使用するクラスの集合
 * @prop {Object.<string,ClassDef>} - クラス定義({クラス名：クラス定義}形式)
 */
class ClassesDef {
  /**
   * @param {ClassesDef} arg 
   */
  constructor(arg){
    Object.keys(arg).forEach(x => this[x] = new ClassDef(arg[x],x));
  }
}

/**
 * @typedef {Object} FunctionsDef - 特定のプロジェクトで使用する関数の集合
 * @prop {Object.<string,FunctionDef>} - 関数定義({関数名：関数定義}形式)
 */
class FunctionsDef {
  constructor(arg){
    Object.keys(arg).forEach(x => this[x] = new FunctionDef(arg[x],x));
  }
}

/**
 * @typedef {Object} ClassDef
 * @prop {string} [extends=''] - 親クラス名 ※JS/TS共単一継承のみ(配列不可)
 * @prop {string} [desc=''] - 端的なクラスの説明。ex.'authServer監査ログ'
 * @prop {string} [note=''] - クラスとしての補足説明。概要欄に記載
 * @prop {string} [policy=''] - 設計方針欄(trimIndent対象)
 * @prop {string} [example=''] - 想定する実装・使用例(Markdown,trimIndent対象)
 * @prop {MembersDef} members - メンバ(インスタンス変数)定義
 * @prop {MethodsDef} methods - メソッド定義
 * @prop {Object.<string,boolean>} implement - 実装の有無(ex.{cl:false,sv:true})
 * @prop {string} name - 🔢クラス名
 */
class ClassDef {
  /**
   * @param {ClassDef} arg 
   * @param {string} className 
   */
  constructor(arg={},className){
    this.extends = arg.extends || '';
    this.desc = arg.desc || '';
    this.note = arg.note || '';
    this.policy = arg.policy || '';
    this.example = arg.example || '';
    this.members = new MembersDef(arg.members,className);
    this.methods = new MethodsDef(arg.methods,className);
    this.implement = arg.implement || {};
    this.name = className;
  }
}

/**
 * @typedef {Object} MembersDef - クラスの内部変数の定義
 * @prop {FieldDef[]} list - 所属するメンバの配列
 * @prop {MarkdownDef} markdown - Markdown文書作成時の定義
 * @prop {string} className - 🔢所属するクラス名
 */
class MembersDef {
  /**
   * @param {MembersDef} arg 
   * @param {string} className 
   */
  constructor(arg,className){
    for( let i=0 ; i<arg.list.length ; i++ ){
      arg.list[i] = new FieldDef(arg.list[i],i,className);
    }
    this.markdown = new MarkdownDef(Object.assign({
      title: `🔢 ${className} メンバ一覧`,
      level: 0,
      anchor: `${className.toLowerCase()}_members`,
      link: ``,
      navi: ``,
      template: ``,
    },(arg.markdown || {})));
    this.className = className;
  }
}

/**
 * @typedef {Object} FieldDef - メンバの定義(Schema.columnDef上位互換)
 * @prop {string} name - 項目(引数)名。原則英数字で構成(システム用)
 * @prop {string} [label=''] - テーブル・シート表示時の項目名。省略時はnameを流用
 * @prop {string[]} [alias=[]] - 複数タイプのCSVを統一フォーマットで読み込む際のnameの別名
 * @prop {string} [desc=''] - 端的なメンバの説明(詳細はnoteに記述)
 * @prop {string} [note=''] - 備考
 * @prop {string} [type='string'] - データ型。'|'で区切って複数記述可
 * @prop {string} [default=''] - 既定値
 *   テーブル定義(columnDef)の場合、行オブジェクトを引数とするtoString()化された文字列も可
 * @prop {boolean} [isOpt=false] - 必須項目ならfalse。defaultが定義されていた場合は強制的にtrue
 * @prop {string} [printf=null] - 表示整形用関数。行オブジェクトを引数とするtoString()化された文字列
 * @prop {number} seq - 🔢左端を0とする列番号。Members.constructor()で設定
 * @prop {string} [className=''] - 🔢メソッドが所属するクラス名(メソッドのみ)
 * @prop {string} [functionName=''] - 🔢関数(メソッド)名(引数・戻り値の場合のみ)
 */
class FieldDef {
  /**
   * @param {FieldDef} arg 
   * @param {number} seq 
   * @param {string} [className='']
   * @param {string} [functionName=''] 
   */
  constructor(arg,seq,className='',functionName=''){
    this.name = arg.name || '';
    this.label = arg.label || '';
    this.alias = arg.alias || [];
    this.desc = arg.desc || '';
    this.note = arg.note || '';
    this.type = arg.type || 'string';
    this.default = arg.default || '';
    this.isOpt = this.default === '' ? true : (arg.isOpt || false);
    this.printf = arg.printf || null;
    this.seq = seq;
    this.className = className;
    this.functionName = functionName;
  }
}

/**
 * @typedef {Object} MethodsDef - クラスのメソッド集
 * @prop {FunctionDef[]} list - 所属するメソッドの配列
 * @prop {MarkdownDef} markdown - Markdown文書作成時の定義
 * @prop {string} className - 🔢所属するクラス名
 */
class MethodsDef {
  /**
   * @param {MethodsDef} arg 
   * @param {string} className 
   */
  constructor(arg,className){
    console.log(`l.202 ${JSON.stringify(arg,null,2)}`);
    for( let i=0 ; i<arg.list.length ; i++ ){
      arg.list[i] = new FunctionDef(arg.list[i],className);
    }
    this.markdown = new MarkdownDef(Object.assign({
      title: `🧱 ${className} メソッド一覧`,
      level: 0,
      anchor: `${className.toLowerCase()}_methods`,
      link: ``,
      navi: ``,
      template: ``,
    },(arg.markdown || {})));
    this.className = className;
  }
}

/**
 * @typedef {Object} FunctionDef - 関数・アロー関数・メソッド定義
 * @prop {string} name - 関数(メソッド)名
 * @prop {string} [type=''] - 関数(メソッド)の分類
 *   public/private, static, async, get/set, accessor, etc
 * @prop {string} [desc=''] - 端的な関数(メソッド)の説明。ex.'authServer監査ログ'
 * @prop {string} [note=''] - 注意事項。Markdownで記載
 * @prop {string} [source=''] - 想定するソースコード
 * @prop {string[]} [lib=[]] - 本関数(メソッド)で使用する外部ライブラリ
 * @prop {number} [rev=0] - 0:未着手 1:完了 0<n<1:作成途中
 * @prop {ParamsDef} params - 引数
 * @prop {string} process - 処理手順。Markdownで記載
 * @prop {ReturnsDef} returns - 戻り値の定義(パターン別)
 * @prop {string} [className=''] - 🔢所属するクラス名(メソッドのみ)
 * @prop {string[]} caller - 🔢本関数(メソッド)の呼出元関数(メソッド)。メソッドの場合"クラス.メソッド名"
 */
class FunctionDef {
  /**
   * @param {FunctionDef} arg 
   * @param {string} className 
   */
  constructor(arg,className){
    this.name = arg.name;
    this.type = arg.type || '';
    this.desc = arg.desc || '';
    this.note = arg.note || '';
    this.source = arg.source || '';
    this.lib = arg.lib || '';
    this.rev = arg.rev || 0;
    this.params = new ParamsDef(arg.params,className,this.name);
    this.process = trimIndent(arg.process) || '';
    this.returns = new ReturnsDef(arg.params,className,this.name);
    this.className = className;
    this.caller = [];
  }
}

/**
 * @typedef {Object} ParamsDef - 関数(メソッド)引数定義
 * @prop {FieldDef[]} list - 引数
 * @prop {string} [className=''] - 🔢メソッドが所属するクラス名(メソッドのみ)
 * @prop {string} [functionName=''] - 🔢関数(メソッド)名
 */
class ParamsDef {
  /**
   * @param {ParamsDef} arg 
   * @param {string} [className=''] 
   * @param {string} [functionName=''] 
   */
  constructor(arg,className='',functionName=''){
    for( let i=0 ; i<arg.list.length ; i++ ){
      arg.list[i] = new FieldDef(arg.list[i],i,className);
    }
    this.markdown = new MarkdownDef(Object.assign({
      title: `📥 ${className ? className + '.' : ''}${functionName} 引数`,
      level: 0,
      anchor: `${className.toLowerCase()}_${functionName.toLowerCase()}_param`,
      link: ``,
      navi: ``,
      template: ``,
    },(arg.markdown || {})));
    this.className = className;
    this.functionName = functionName;
  }
}

/**
 * @typedef {Object} ReturnsDef - 関数(メソッド)戻り値定義集
 * @prop {ReturnDef[]} list - (データ型別)戻り値定義集
 * @prop {string} [className=''] - 🔢メソッドが所属するクラス名(メソッドのみ)
 * @prop {string} [functionName=''] - 🔢関数(メソッド)名
 */
class ReturnsDef {
  /**
   * @param {ReturnsDef} arg 
   * @param {string} [className=''] 
   * @param {string} [functionName=''] 
   */
  constructor(arg,className='',functionName=''){
    for( let i=0 ; i<arg.list.length ; i++ ){
      arg.list[i] = new ReturnDef(arg.list[i],className,functionName);
    }
    this.markdown = new MarkdownDef(Object.assign({
      title: `📤 ${className ? className + '.' : ''}${functionName} 戻り値`,
      level: 0,
      anchor: `${className.toLowerCase()}_${functionName.toLowerCase()}_return`,
      link: ``,
      navi: ``,
      template: ``,
    },(arg.markdown || {})));
    this.className = className;
    this.functionName = functionName;
  }
}

/**
 * @typedef {Object} ReturnDef - 関数(メソッド)戻り値定義
 * @prop {string} type - 戻り値のデータ型
 * @prop {PatternDef} [default={}] - 全パターンの共通設定値
 * @prop {Object.<string,PatternDef>} [patterns={}] - 特定パターンへの設定値
 * @prop {string} [className=''] - 🔢メソッドが所属するクラス名(メソッドのみ)
 * @prop {string} [functionName=''] - 🔢関数(メソッド)名
 */
/**
 * @typedef {Object.<string,string>} PatternDef - パターンに設定する値
 * @example {name:'fuga'} ⇒ 戻り値のデータ型のメンバ'name'に'fuga'を設定
 */
class ReturnDef {
  /**
   * @param {ReturnDef} arg 
   * @param {string} [className=''] 
   * @param {string} [functionName=''] 
   */
  constructor(arg,className='',functionName=''){
    this.type = arg.type || '';
    this.default = arg.default || {};
    this.patterns = arg.patterns || {};
    this.className = className;
    this.functionName = functionName;
  }
}

/**
 * @typedef {Object} MarkdownDef - Markdown文書作成時の定義
 * @prop {string} [title=''] - タイトル
 * @prop {number} [level=0] - 階層(自然数)。0ならタイトルに'#'を付けない
 * @prop {string} [anchor=''] - タイトルに付けるアンカー
 *   "## <span id="[anchor]">タイトル</span>"
 * @prop {string} [link=''] - タイトルに付けるリンク
 * @prop {string} [navi=''] - ナビゲーション
 * @prop {string} [template=''] - 本文のテンプレート
 * @prop {string} [content=''] - 🔢スペーストリミング＋埋込対応済の本文
 */
class MarkdownDef {
  constructor(arg){
    ['title','anchor','link','navi','template','content'].forEach(x => {
      this[x] = arg[x] || '';
    });
    this.level = arg.level || 0;
  }
}

function analyzeArg(){
  const v = {whois:'analyzeArg',rv:{opt:{},val:[]}};
  try {
    for( v.i=2 ; v.i<process.argv.length ; v.i++ ){
      v.m = process.argv[v.i].match(/^(\-*)([0-9a-zA-Z]+):*(.*)$/);
      if( v.m && v.m[1].length > 0 ){
        v.rv.opt[v.m[2]] = v.m[3];
      } else {
        v.rv.val.push(process.argv[v.i]);
      }
    }
    return v.rv;
  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}

/**
 * 与えられた文字列から、先頭末尾の空白行と共通インデントを削除する
 * @param {string} str - 対象文字列（複数行）
 * @returns {string} 加工後の文字列
 */
function trimIndent(str) {
  // 1. 先頭・末尾の空白行削除
  if( !str ) return '';
  const lines = str.replace(/^\s*\n+|\n+\s*$/g, '').split('\n');
  if( lines.length === 0 ) return '';

  // 2. 1行だけの場合、先頭のスペースを削除して終了
  if( lines.length === 1 ) return lines[0].trim();

  // 3. 複数行の場合、各行の共通インデント(スペース・タブ)を取得
  const indents = lines
    .filter(line => line.trim() !== '')
    .map(line => line.match(/^[ \t]*/)[0].length);
  const minIndent = indents.length ? Math.min(...indents) : 0;

  // 4. 共通インデントを削除、各行を結合した文字列を返す
  return lines.map(line => line.slice(minIndent)).join('\n');
}

const fs = require("fs");
const arg = analyzeArg();

/** メイン処理
 * @param {ClassDef} arg
 */
function main(arg){

  const rv = {classes:null,functions:null}
  if( arg.hasOwnProperty('ClassesDef')){
    rv.classes = new ClassesDef(arg.ClassesDef);
  }
  if( arg.hasOwnProperty('FunctionsDef')){
    rv.functions = new FunctionsDef(arg.FunctionsDef);
  }

  console.log(JSON.stringify(rv,null,2));
}

const lines = [];
const rl = require('readline').createInterface({input: process.stdin});
rl.on('line', x => lines.push(x)).on('close',() => {
  rl.close();
  main(JSON.parse(lines.join('\n')));
});

/* classdef.js backup
const fs = require("fs");
const arg = analyzeArg();
let classdef;
const cdef = {};

function main(){
  // データ(cdef)生成
  Object.keys(classdef).forEach(x => cdef[x] = new ClassDef(x,classdef[x]));

  // 二次設定項目(caller)のセット
  //   cdef生成を一次設定としたとき、生成後の状態での検索・設定が必要になる項目のセット
  Object.keys(cdef).forEach(x => cdef[x].secondary());

  // Markdown作成
  const classList = [`※ "constructorは省略"`,'',
    '| No | CL | SV | クラス名 | 概要 |',
    '| --: | :--: | :--: | :-- | :-- |',
  ];
  let cnt = 1;
  Object.keys(cdef).forEach(x => {
    // jsonはデバッグ用に出力、割愛可
    fs.writeFileSync(`${arg.opt.o}/${x}.json`, JSON.stringify(cdef[x],null,2));
    fs.writeFileSync(`${arg.opt.o}/${x}.md`, cdef[x].md());

    // クラス一覧・クラス名追加
    classList.push(`| ${cnt++} | ${
      cdef[x].implement.client ? '⭕' : '❌'} |  ${
      cdef[x].implement.server ? '⭕' : '❌'} | [${x}](${x}.md) | ${cdef[x].label} |`);
    // クラス一覧・メソッド名追加
    Object.keys(cdef[x].methods).filter(m => !/^_/.test(m) && m !== 'className' )
    //.filter( m => m !== 'constructor' )
    .forEach(method => {
      const mn = `<span style="padding-left:2rem">${
        `<span style="color:${cdef[x].methods[method].rev === 0 ? 'red' : (cdef[x].methods[method].rev === 1 ? 'black' : 'orange')}">${cdef[x].methods[method].type}</span> `
        + `<a href="${x}.md#${x.toLowerCase()}_${method.toLowerCase()}">${method}()</a>`
      }</span>`;
      classList.push(`| | | | ${mn} | ${cdef[x].methods[method].label} |`);
      //classList.push(`| | | | <span style="padding-left:2rem"><a href="${x}.md#${x.toLowerCase()}_${method.toLowerCase()}">${method}()</a></span> | ${cdef[x].methods[method].label} |`);
    });
  });
  fs.writeFileSync(`${arg.opt.o}/classList.md`, classList.join('\n'));
}

const lines = [];
const rl = require('readline').createInterface({input: process.stdin});
rl.on('line', x => lines.push(x)).on('close',() => {
  rl.close();
  classdef = JSON.parse(lines.join('\n'));
  main();
});
*/
