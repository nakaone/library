/**
 * @typedef {object} analyzeArg - コマンドライン引数の分析結果
 * @prop {Object.<string, number>} opt - スイッチを持つ引数について、スイッチ：値形式にしたオブジェクト
 * @prop {string[]} val - スイッチを持たない引数の配列
 */
/**
 * @desc コマンドラインから`node xxx.js aa bb`を実行した場合の引数(`aa`,`bb`)を取得し、オブジェクトにして返す。<br>
 * 
 * @example
 * 
 * ```
 * node xxx.js -i:aaa.html bbb -o:ccc.json ddd eee
 * ⇒ {opt:{i:"aaa.html",o:"ccc.json"},val:["bbb","ddd","eee"]}
 * ```
 * 
 * <caution>注意</caution>
 * 
 * - スイッチは`(\-*)([0-9a-zA-Z]+):*(.*)$`形式であること
 * - スイッチに該当しないものは配列`val`にそのまま格納される
 * 
 * @param {void} - なし
 * @returns {analyzeArg} 分析結果のオブジェクト
 */

function analyzeArg(){
  console.log('===== analyzeArg start.');
  const v = {rv:{opt:{},val:[]}};
  try {

    for( v.i=2 ; v.i<process.argv.length ; v.i++ ){
      // process.argv:コマンドライン引数の配列
      v.m = process.argv[v.i].match(/^(\-*)([0-9a-zA-Z]+):*(.*)$/);
      if( v.m && v.m[1].length > 0 ){
        v.rv.opt[v.m[2]] = v.m[3];
      } else {
        v.rv.val.push(process.argv[v.i]);
      }
    }

    console.log('v.rv='+JSON.stringify(v.rv));
    console.log('===== analyzeArg end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}
/**
 * @typedef {object} analyzePath - パス文字列から構成要素を抽出したオブジェクト
 * @prop {string} full - 引数の文字列(フルパス)
 * @prop {string} path - ファイル名を除いたパス文字列
 * @prop {string} file - ファイル名
 * @prop {string} base - 拡張子を除いたベースファイル名
 * @prop {string} suffix - 拡張子
 */
/**
 * @desc パス名文字列から構成要素を抽出
 * @param {string} arg - パス文字列
 * @returns {analyzePath}　構成要素を抽出したオブジェクト
 * @example
 * 
 * ```
 * "/Users/ena.kaon/Desktop/GitHub/library/JavaScript/analyzePath.html" ⇒ {
 *   "path":"/Users/ena.kaon/Desktop/GitHub/library/JavaScript/",
 *   "file":"analyzePath.html",
 *   "base":"analyzePath",
 *   "suffix":"html"
 * }
 * 
 * "/Users/ena.kaon/Desktop/GitHub/library/JavaScript" ⇒ {
 *   "path":"/Users/ena.kaon/Desktop/GitHub/library/",
 *   "file":"JavaScript",
 *   "base":"JavaScript",
 *   "suffix":""
 * }
 * 
 * "./analyzePath.html" ⇒ {
 *   "path":"./",
 *   "file":"analyzePath.html",
 *   "base":"analyzePath",
 *   "suffix":"html"
 * }
 * 
 * "analyzePath.html" ⇒ {
 *   "path":"",
 *   "file":"analyzePath.html",
 *   "base":"analyzePath",
 *   "suffix":"html"
 * }
 * 
 * "analyzePath.hoge.html" ⇒ {
 *   "path":"",
 *   "file":"analyzePath.hoge.html",
 *   "base":"analyzePath.hoge",
 *   "suffix":"html"
 * }
 * 
 * "analyzePath.fuga" ⇒ {
 *   "path":"",
 *   "file":"analyzePath.fuga",
 *   "base":"analyzePath",
 *   "suffix":"fuga"
 * }
 * 
 * "https://qiita.com/analyzePath.html" ⇒ {
 *   "path":"https://qiita.com/",
 *   "file":"analyzePath.html",
 *   "base":"analyzePath",
 *   "suffix":"html"
 * }
 * 
 * ```
 */

function analyzePath(arg){
  console.log('===== analyzePath start.');
  const v = {rv:{}};
  try {

    v.m1 = arg.match(/^(.*)\/([^\/]+)$/);
    if( v.m1 ){
      v.rv.path = v.m1[1] + '/';
      v.rv.file = v.m1[2];
    } else {
      v.rv.path = '';
      v.rv.file = arg;
    }
    v.m2 = v.rv.file.match(/^(.+)\.([^\.]+?)$/);
    if( v.m2 ){
      v.rv.base = v.m2[1];
      v.rv.suffix = v.m2[2];
    } else {
      v.rv.base = v.rv.file;
      v.rv.suffix = '';
    }

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('===== analyzePath end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}
/**
 * @typedef {object} querySelector
 * @prop {string} tag - タグ名
 * @prop {Object.<string, string>} attr=null - 属性名：属性値となるオブジェクト
 * @prop {string} inner='' - 子要素タグも含む、タグ内のテキスト
 */

/**
 * @desc HTMLの指定CSSセレクタの内容を抽出
 * @param {string} content - エレメント(HTML)の全ソース
 * @param {string|string[]} selectors - 抽出対象となるCSSセレクタ
 * @returns {querySelector[]} 抽出された指定CSSセレクタ内のテキスト
 */

function querySelector(content,selectors){
  console.log('===== querySelector start.');
  const v = {rv:[],
    selectors: [],
    extract: (document,selector) => {
      console.log('----- extract start.');
      v.elements = document.querySelectorAll(selector);
      v.elements.forEach(element => {
        const o = {
          tag: element.tagName.toLowerCase(),
          attr: null,
          inner: '',
        };
        if( element.hasAttributes() ){
          o.attr = {};
          v.attr = element.attributes;
          for( v.i=0 ; v.i<v.attr.length ; v.i++ ){
            o.attr[v.attr[v.i].name] = v.attr[v.i].value;
          }
        }
        v.inner = String(element.innerHTML).trim();
        if( v.inner.length > 0 )  o.inner = v.inner;
        v.rv.push(o);
      });
      console.log('----- extract end.');
    }
  };
  try {

    // 指定CSSセレクタが単一なら配列化
    v.selectors = typeof selectors === 'string' ? [selectors] : selectors;

    if( typeof window === 'undefined' ){
      const { JSDOM } = require("jsdom");
      const { document } = new JSDOM(content).window;
      v.selectors.forEach(x => v.extract(document,x));
    } else {
      v.source = document.createElement('div');
      v.source.innerHTML = content;
      v.selectors.forEach(x => {
        v.extract(v.source,x);
      });
    }

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('===== querySelector end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack);
    console.error(e.stack);
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}
/** 
 * 変数の型を判定し、型名を文字列で返す。なお引数"is"が指定された場合、判定対象が"is"と等しいかの真偽値を返す。
 * 
 * - Qiita [JavaScriptの型などの判定いろいろ](https://qiita.com/amamamaou/items/ef0b797156b324bb4ef3)
 * 
 * @param {any} arg - 判定対象の変数
 * @param {string} [is] - 想定される型(型名の大文字小文字は意識不要)
 * @returns {string|boolean} - 型の名前。is指定有りなら判定対象が想定型かの真偽値
 * 
 * @example
 * ```
 * let a = 10;
 * whichType(a);  // 'Number'
 * whichType(a,'string'); // false
 * ```
 * 
 * <b>確認済戻り値一覧</b>
 * 
 * オブジェクトは型名が返るので、限定列挙は困難。以下は確認済みの戻り値のみ記載。
 * 
 * | 型名 | 戻り値 | 備考 |
 * | :-- | :-- | :-- |
 * | 文字列 | String |  |
 * | 数値 | Number |  |
 * | NaN | NaN |  |
 * | 長整数 | BigInt |  |
 * | 論理値 | Boolean |  |
 * | シンボル | Symbol |  |
 * | undefined | Undefined | 先頭大文字 |
 * | Null | Null |  |
 * | オブジェクト | Object |  |
 * | 配列 | Array |  |
 * | 関数 | Function |  |
 * | アロー関数 | Arrow |  |
 * | エラー | Error | RangeError等も'Error' |
 * | Date型 | Date |  |
 * | Promise型 | Promise |  |
 *  
 */

function whichType(arg,is){
  let rv = String(Object.prototype.toString.call(arg).slice(8,-1));
  switch(rv){
    case 'Number': if(Number.isNaN(arg)) rv = 'NaN'; break;
    case 'Function': if(!('prototype' in arg)) rv = 'Arrow'; break;
  }
  if( typeof is === 'string' ){
    return rv.toLowerCase() === is.toLowerCase();
  } else {
    return rv;
  }
}
/** 日時を指定形式の文字列にして返す"toLocale()"メソッドをDate型に追加する。
 * @param {string} [format='yyyy/MM/dd'] - 日時を指定する文字列。年:y,月:M,日:d,時:h,分:m,秒:s,ミリ秒:n
 * @returns {string} 指定形式に変換された文字列。無効な日付なら長さ0の文字列
 * 
 * @example
 * ```
 * "1965/9/5"[yy/MM/dd hh:mm:ss.nnn] ⇒ "65/09/05 00:00:00.000"
 * "1965/9/5"[yyyy-MM-dd] ⇒ "1965-09-05"
 * "1965/9/5"[hh:mm] ⇒ "00:00"
 * "1977-03-04"[yy/MM/dd hh:mm:ss.nnn] ⇒ "77/03/04 09:00:00.000"
 * "1977-03-04"[yyyy-MM-dd] ⇒ "1977-03-04"
 * "1977-03-04"[hh:mm] ⇒ "09:00"
 * 1688189258262[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:27:38.262"
 * 1688189258262[yyyy-MM-dd] ⇒ "2023-07-01"
 * 1688189258262[hh:mm] ⇒ "14:27"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:16:30.000"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yyyy-MM-dd] ⇒ "2023-07-01"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[hh:mm] ⇒ "14:16"
 * "12:34"[yy/MM/dd hh:mm:ss.nnn] ⇒ ""
 * "12:34"[yyyy-MM-dd] ⇒ ""
 * "12:34"[hh:mm] ⇒ ""
 * ```
 */

function Date_toLocale(format='yyyy/MM/dd'){
  console.log('===== Date.toLocale start.');
  const v = {rv:format};
  try {

    // 無効な日付なら空文字列を返して終了
    if( isNaN(this.getTime()) ) return '';

    v.l = { // 地方時ベース
      y: this.getFullYear(),
      M: this.getMonth()+1,
      d: this.getDate(),
      h: this.getHours(),
      m: this.getMinutes(),
      s: this.getSeconds(),
      n: this.getMilliseconds()
    };

    //v.rv = typeof format === 'undefined' ? 'yyyy/MM/dd' : format;
    for( v.x in v.l ){
      v.m = v.rv.match(new RegExp(v.x+'+'));
      if( v.m ){
        v.str = v.m[0].length > 1
          ? ('000'+v.l[v.x]).slice(-v.m[0].length)
          : String(v.l[v.x]);
        v.rv = v.rv.replace(v.m[0],v.str);
      }
    }

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('===== Date.toLocale end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}
Date.prototype.toLocale = Date_toLocale;
