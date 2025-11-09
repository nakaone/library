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

/**
 * 文字列の中にevaluateタグがあれば、evalの評価結果で置換
 * @param {string} str 
 */
function evaluate(str){

  return str.replace(
    /^([ \t]*)<evaluate>([\s\S]*?)<\/evaluate>/gm,
    (_, indent, code) => {
      try {
        // その場で評価（comparisonTableが使えるスコープ）
        const result = eval(code);  // 戻り値は{string[]}
        return (typeof result === 'string' ? result : result.join('\n'));
      } catch (e) {
        console.error('Error evaluating block:', e);
        return `[EVAL ERROR: ${e.message}]`;
      }
    }
  );

}

/**
 * @typedef {Object} classDef
 * @prop {string} typeName - 対象元(投入先)となるclassdef(cdef)上のクラス名
 * @prop {Object.<string,string>} [default] - 各パターンの共通設定値。表記方法はassignと同じ
 * @prop {Object} pattern - 設定パターン集
 * @prop {Object.<string,string>} pattern.assign - 当該パターンの設定値
 *   // ex. pattern: {'正常時':{assign:{result:'normal'}},'異常時':{assign:{result:'fatal'}}}
 *   //     patternの孫要素に'assign'が無い場合、子要素=assignでcondition/noteは省略と看做す。
 *   // ex. pattern: {'正常時':{result:'normal'},'異常時':{result:'fatal'}}
 * @prop {string} [pattern.condition] - 該当条件(trimIndent対象)
 * @prop {string} [pattern.note] - 備忘(trimIndent対象)
 */
/** comparisonTable: 原本となるクラスの各要素と、それぞれに設定する値の対比表を作成
 * @param {classDef} arg - 原本となるデータ型(クラス)の情報オブジェクト
 * @param {string} [indent=''] - 各行の先頭に付加するインデント文字列
 */
function comparisonTable(arg,indent=''){
  const rv = [];
  const dataLabels = Object.keys(arg.pattern);
  const header = ['項目名','データ型','生成時', ...dataLabels];

  if( typeof cdef[arg.typeName] !== 'undefined' ){
    ['',  // ヘッダー行
      `${indent}- [${arg.typeName}](${arg.typeName}.md#${arg.typeName.toLowerCase()}_internal): ${cdef[arg.typeName].label}`,
      `${indent+'  '}| ${header.join(' | ')} |`,
      `${indent+'  '}| ${header.map(() => ':--').join(' | ')} |`,
    ].forEach(x => rv.push(x));

    // 各メンバ行
    cdef[arg.typeName].members._list.forEach(x => {  // 戻り値データ型のメンバ名を順次呼出
      const m = cdef[arg.typeName].members[x];
      const cells = [
        m.name,
        m.type,
        m.default !== '—' ? m.default : (m.isOpt ? '【任意】' : '【必須】'),
        ...dataLabels.map(label => typeof arg.pattern[label].assign[x] === 'undefined'
          ? ( typeof arg.default !== 'undefined' && typeof arg.default[x] !== 'undefined'
          ? arg.default[x] : '—' ) : `**${arg.pattern[label].assign[x]}**`)
      ];
      rv.push(`${indent+'  '}| ${cells.join(' | ')} |`);
    });
  } else {
    console.error(`comparisonTable error: cdef[arg.typeName]=${cdef[arg.typeName]}\narg=${JSON.stringify(arg,null,2)}`);
  }

  return rv;

}

/**  */
class ClassDef {
  constructor(className,arg){
    this.className = className;  // {string} クラス名
    this.label = arg.label || ''; // {string} 端的なクラスの説明。ex.'authServer監査ログ'
    this.note = trimIndent(arg.note || ''); // {string} クラスとしての補足説明。概要欄に記載
    this.policy = trimIndent(arg.policy || ``); // {string} 設計方針欄(trimIndent対象)
    this.inherit = arg.inherit || ''; // {string} 親クラス名
    this.defaultVariableName = arg.defaultVariableName || ''; // {string} 変数名の既定値。ex.(pv.)"audit"
    this.example = trimIndent(arg.example || ''); // {string} 想定する実装・使用例(Markdown,trimIndent対象)
    this.members = new Members(className,arg.members); // メンバ(インスタンス変数)定義
    this.methods = new Methods(className,arg.methods); // メソッド定義
    this.navi = arg.navi || ''; // {string} クラス内ナビ
    this.implement = arg.implement || {client:false,server:false};  // 実装の有無
  }

  /** Markdownの作成 */
  md(){
    const rv = [];
    const cn = this.className.toLowerCase();

    // 1.概要
    [
      `# <span id="${cn}">${this.className} クラス仕様書</span>`,
      ...(this.navi.length > 0 ? ['',this.navi] : []),
      '',`## <span id="${cn}_summary">🧭 概要</span>`,
      '',this.label
    ].forEach(x => rv.push(x));
    if( this.note.length > 0 ){
      ['',this.note].forEach(x => rv.push(x));
    }

    // 1.1 設計方針
    if( this.policy.length > 0 ){
      [
        '',`### <span id="${cn}_policy">設計方針</span>`,'',
        this.policy
      ].forEach(x => rv.push(x));
    }

    // 1.2 実装例
    if( this.example.length > 0 ){
      [
        '',`### <span id="${cn}_example">実装・使用例</span>`,'',
        this.example
      ].forEach(x => rv.push(x));
    }

    // 1.3 内部構成
    // 1.3.1 メンバ一覧
    ['',`### 🧩 <span id="${cn}_internal">内部構成</span>`,
      ...this.members.md()].forEach(x => rv.push(x));

    // 1.3.2 メソッド一覧
    this.methods.list().forEach(x => rv.push(x));

    // 2.メソッド
    this.methods.md().forEach(x => rv.push(x));

    // 3.メンテナンス処理
    // 4.セキュリティ仕様
    // 5.エラーハンドリング仕様
    // 6.ログ出力仕様

    return rv.join('\n');
  }

  /** 二次設定項目 */
  secondary(){
    this.methods.secondary();
  }
}

/** メンバ(集合)の定義 */
class Members {
  constructor(className,arg){
    this.className = className;
    this._list = []; // {string[]} 定義順のメンバ名一覧
    arg.forEach(x => {
      this._list.push(x.name);
      this[x.name] = new Member(className,x);
    });
  }

  /** Markdown形式のメンバ一覧作成 */
  md(){
    /*
    ### 🧩 <span="membertrial_internal">内部構成</span>

    🔢 メンバ一覧

    🧱 <span id="membertrial_method">メソッド一覧</span>
    */
    const rv = [];
    if( this._list.length > 0 ){
      ['',`🔢 ${this.className} メンバ一覧`,'',
        '| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |',
        '| :-- | :-- | :-- | :-- | :-- | :-- |'
      ].forEach(x => rv.push(x));
      this._list.forEach(x => rv.push(this[x].md()));
    }
    rv.push('');
    return rv;
  }
}

/** メンバ(単体)の定義 */
class Member {
  constructor(className,arg){
    this.className = className;
    this.name = arg.name || ''; // {string} メンバ名(変数名)。英数字表記
    this.type = arg.type || 'string'; // {string} データ型
    this.label = arg.label || ''; // {string} 端的な項目説明。ex."サーバ側処理結果"
    this.note = arg.note || '';
      // {string|string[]} 当該項目に関する補足説明。ex."fatal/warning/normal"
    this.default = arg.default || '—';
      // {any} 関数の場合'=Date.now()'のように記述
    this.isOpt = this.default !== '—' ? true  : (arg.isOpt || false);
      // {boolean} 任意項目はtrue。defaultが設定されたら強制的にtrue
  }

  /** Markdownの作成 */
  md(){
    // 項目名 任意 データ型 既定値 説明 備考
    // データ型が本仕様書内のデータ型の場合はリンクを作成
    return `| ${this.name} | ${this.isOpt?'⭕':'❌'} | ${
      typeof cdef[this.type] === 'undefined'
      ? this.type : `[${this.type}](${this.type}.md#${this.type.toLowerCase()}_internal)`
    } | ${
      typeof this.default === 'object' && this.default !== null
      ? JSON.stringify(this.default) : this.default
    } | ${this.label} | ${this.note} | `;
  }
}

/** メソッド(集合)の定義 */
class Methods {
  constructor(className,arg){
    this.className = className;
    this._list = [];
    this._map = {}; // リンクで使用する小文字のメソッド名から、大文字を含めたメソッド名に変換
    Object.keys(arg).forEach(x => {
      this._list.push(x);
      this._map[x.toLowerCase()] = x;
      this[x] = new Method(className,x,arg[x])
    });
  }

  /** Markdownの作成 */
  md(){
    // メソッドオブジェクト(Method)を順次呼び出し、md()の結果を戻り値に追加
    const rv = [];
    this._list.forEach(x => this[x].md().forEach(l => rv.push(l)));
    return rv;
  }

  /** Markdown形式の一覧作成 */
  list(){
    const rv = ['',`🧱 <span id="${this.className.toLowerCase()}_method">${this.className} メソッド一覧</span>`,''];
    if( this._list.length === 0 ){
      rv.push(`- メソッド無し`);
    } else {
      ['| メソッド名 | 型 | 内容 |','| :-- | :-- | :-- |'].forEach(x => rv.push(x));
      this._list.forEach(x => rv.push(this[x].list()));
    }
    return rv;
  }

  /** 二次設定項目 */
  secondary(){
    this._list.forEach(x => this[x].secondary());
  }
}

/** メソッド(単体)の定義 */
class Method {
  constructor(className,methodName,arg){
    this.className = className; // メソッドが所属するクラス名。引数から自動設定
    this.methodName = methodName; // メソッド名。引数から自動設定
    this.type = arg.type || 'private'; // {string} static:クラスメソッド、public:外部利用可、private:内部専用
    this.label = arg.label || ''; // {string} 端的なメソッドの説明。ex.'authServer監査ログ'
    this.note = trimIndent(arg.note || ''); // {string} 注意事項。markdownで記載
    this.source = trimIndent(arg.source || ''); // {string} 想定するJavaScriptソース
    this.lib = arg.lib || []; // {string[]} 本メソッドで使用するライブラリ
    this.caller = arg.caller || []; // {string[]} 本メソッドを呼び出す"クラス.メソッド名"
    this.rev = arg.rev || 0;  // {number} 0:未着手 1:完了 0<n<1:作成途中

    this.params = new Params(className,methodName,arg.params); // 引数
    this.process = trimIndent(arg.process || '');  // {string} 処理手順。markdownで記載
    this.returns = new Returns(className,methodName,arg.returns);  // 戻り値の定義(パターン別)
  }

  /** Markdownの作成 */
  md(){
    const cn = this.className.toLowerCase();
    const mn = this.methodName.toLowerCase();
    const cc = `${cn}_${mn}`;

    // 概要＋注意事項
    const rv = ['',
      `## <span id="${cc}">🧱 <a href="#${cn}_method">${this.className}.${this.methodName}()</a></span>`,
      '', this.label
    ];
    if( this.note ){
      ['', this.note].forEach(x => rv.push(x));
    }

    // 実装例
    if( this.source ){
      ['',`### <span id="{cc}_source">📄 実装例</span>`,'',this.source].forEach(x => rv.push(x));
    }

    // 引数
    this.params.list().forEach(x => rv.push(x));

    // 処理手順
    ['',`### <span id="${cc}_process">🧾 処理手順</span>`,'',this.process].forEach(x => rv.push(x));

    // 戻り値
    this.returns.md().forEach(x => rv.push(x));

    return rv;
  }

  /** Markdown形式の一覧(行)作成 */
  list(){
    return `| [${this.methodName}](#${this.className.toLowerCase()}_${this.methodName.toLowerCase()
      }) | ${this.type} | ${this.label} |`;
  }

  /** 二次設定項目 */
  secondary(){
    const links = [];

    // 外部リンク
    const rexF = /\[([^\]]+)\]\(([^)]+)\.md#([a-z0-9]+)_([a-z0-9]+)\)/gi;
    let m;
    while ((m = rexF.exec(this.process)) !== null) {
      // m[1]=①, m[2]=②, m[3]=③, m[4]=④
      //links.push([m[1], m[2], m[3], m[4]]);
      links.push({
        linkText: m[1],
        className: m[2],  // 参照先のクラス名(大文字含む)
        lowerCase: m[3],  // 参照先のクラス名(小文字のみ)
        methodName: m[4], // 当該クラスのメソッド名(小文字のみ)
      })
    }

    // ローカルリンク
    const rexL = /\[([^\]]+)\]\(#([a-z0-9]+)_([a-z0-9]+)\)/gi;
    while ((m = rexL.exec(this.process)) !== null) {
      // m[1]=①, m[2]=②, m[3]=③, m[4]=④
      //links.push([m[1], m[2], m[3], m[4]]);
      links.push({
        linkText: m[1],
        className: this.className,  // 参照先のクラス名(大文字含む)
        lowerCase: m[2],  // 参照先のクラス名(小文字のみ)
        methodName: m[3], // 当該クラスのメソッド名(小文字のみ)
      })
    }

    // 参照先メソッドのcallerにリンク元メソッドを追加
    if( links.length > 0 ){
      links.forEach(link => {
        const methods = cdef[link.className].methods; // 参照先クラスのメソッド(集合)
        if( typeof methods._map[link.methodName] !== 'undefined' ){
          const methodName = methods._map[link.methodName]; // 大文字含むメソッド名に変換
          const caller = cdef[link.className].methods[methodName].caller;
          if( !(caller.find(x => x.class === this.className && x.method === this.methodName))){
            // caller未登録なら追加登録
            caller.push({class:this.className,method:this.methodName});
          }
        }
      });
    }

    // evaluateタグの処理
    this.process = evaluate(this.process);
  }
}

/** メソッドの引数(集合)定義 */
class Params {
  constructor(className,methodName,arg){
    this.className = className;
    this.methodName = methodName;
    this._list = []; // 定義順の引数名一覧
    arg.forEach(o => {
      this._list.push(o.name);
      this[o.name] = new Param(className,methodName,o)
    });
  }

  /** Markdown形式の引数一覧作成 */
  list(){
    const rv = [];
    const cn = this.className.toLowerCase();
    const mn = this.methodName.toLowerCase();
    const cc = `${cn}_${mn}`;

    // 呼出元関数(メソッド)へのリンク
    if( cdef[this.className].methods[this.methodName].caller.length > 0 ){
      ['',`### <span id="${cc}_caller">📞 呼出元</span>`,''].forEach(x => rv.push(x));
      cdef[this.className].methods[this.methodName].caller.forEach(x => {
        //console.log(JSON.stringify({caller:{class:x.class,method:x.method},callee:{class:this.className,method:this.methodName}},null,2));
        rv.push(`- [${x.class}.${x.method}()](${x.class}.md#${cc})`);
      })
    }

    // 引数一覧
    ['',`### <span id="${cc}_param">📥 引数</span>`,''].forEach(x => rv.push(x));

    if( this._list.length === 0 ){
      ['',`- 無し(void)`].forEach(x => rv.push(x));
    } else {
      ['','| 項目名 | 任意 | データ型 | 既定値 | 説明 |','| :-- | :--: | :-- | :-- | :-- |']
      .forEach(x => rv.push(x));
      this._list.forEach(x => this[x].list().forEach(l => rv.push(l)));
    }
    return rv;
  }
}

/** メソッドの引数(単体)定義 */
class Param {
  constructor(className,methodName,arg){
    this.className = className;
    this.methodName = methodName;
    this.name = arg.name || ''; // 引数としての変数名
    this.type = arg.type || ''; // データ型
    this.default = arg.default || '—'; // 既定値
    this.note = arg.note || ''; // 項目の説明
    this.isOpt = this.default !== '—' ? true : (arg.isOpt || false);  // 任意項目ならtrue
  }

  /** Markdown形式の一覧作成 */
  list(){
    // 引数が複数のデータ型の場合、分割して個別に作成(ex.{Member|authRequest})
    const types = [];
    this.type.split('|').forEach(type => {
      type = type.trim();
      const typeName = type.replace(/\[\]/g, ''); // 配列を示す'[]'は削除
      types.push(typeof cdef[typeName] === 'undefined' ? type
        // 定義済のデータ型ならそのメンバ一覧へのリンクを設定
        : `[${type}](${typeName}.md#${typeName.toLowerCase()}_internal)`);
    });

    // 項目名 任意 データ型 既定値 備考
    return [`| ${this.name} | ${this.isOpt?'⭕':'❌'} | ${types.join(' \\| ')} | ${
      typeof this.default === 'object' && this.default !== null
      ? JSON.stringify(this.default) : this.default
    } | ${this.note} | `];
  }
}

/** メソッドの戻り値(集合)定義 */
class Returns {
  constructor(className,methodName,arg){
    this.className = className;
    this.methodName = methodName;
    this._list = [];

    Object.keys(arg).forEach(typeName => {
      this._list.push(typeName);
      this[typeName] = new Return(className,methodName,typeName,arg[typeName]);
    });
  }

  /** Markdownの作成 */
  md(){
    /* 出力サンプル
    ### <span id="authserver_constructor_returns">📤 戻り値</span>
    ※ Return.md()の結果を追加
    */
    const cn = this.className.toLowerCase();
    const mn = this.methodName.toLowerCase();
    const cc = `${cn}_${mn}`;
    const rv = ['',`### <span id="${cc}_returns">📤 戻り値</span>`];

    this._list.forEach(x => this[x].md().forEach(l => rv.push(l)));
    return rv;
  }
}

/** メソッドの戻り値定義(データ型別) */
class Return {
  constructor(className,methodName,typeName,arg){
    this.className = className;
    this.methodName = methodName;
    this.typeName = typeName; // 戻り値のデータ型

    this.default = arg.default || {}; // {Object.<string,string>} 各パターンの共通設定値
    this.condition = trimIndent(arg.condition || '');
      // {string} データ型が複数の場合の選択条件指定(trimIndent対象)
    this.note = trimIndent(arg.note || ''); // {string} 備忘(trimIndent対象)

    const org = {}; // 基となるデータ型からの引用項目として、全項目「—」設定
    if( typeof classdef[typeName] !== 'undefined' ){
      classdef[typeName].members.forEach(x => org[x.name] = '—');
    }

    // パターン指定が無い場合「正常終了」を追加
    if( Object.keys(arg.pattern || {}).length === 0 ){
      arg.pattern = {'正常終了':{assign:{}}};
    }

    // パターン別のオブジェクト作成
    this.pattern = {};
    Object.keys(arg.pattern).forEach(x => {
      if( typeof arg.pattern[x].assign === 'undefined' ){
        arg.pattern[x].assign = {};
      }

      this.pattern[x] = {
        patternName: x,  // パターン名
        assign: arg.pattern[x].assign,
        condition: trimIndent(arg.pattern[x].condition || ''),
        note: trimIndent(arg.pattern[x].note || ''),
      };
    });
  }

  /** Markdownの作成 */
  md(){
    return comparisonTable(this,'  ');
  }
}


const fs = require("fs");
const arg = analyzeArg();
let classdef;
const cdef = {};

/** メイン処理 */
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
