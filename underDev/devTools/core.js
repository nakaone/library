/** devTools: 開発支援関係メソッド集
 * @param {Object} opt - 動作設定オプション
 * @param {string} [opt.mode='dev'] - 出力範囲指定
 * @param {number} [opt.digit=4] - 処理順(seq)の桁数
 * 
 * - 出力モード
 *   | mode | エラー | 開始・終了 | dump/step |
 *   | "none" | ❌ | ❌ | ❌ | 出力無し(pipe処理等) |
 *   | "error" | ⭕ | ❌ | ❌ | エラーのみ出力 |
 *   | "normal" | ⭕ | ⭕ | ❌ | 本番用 |
 *   | "dev" | ⭕ | ⭕ | ⭕ | 開発用 |
 */
function devTools(opt){
  class functionInfo {
    constructor(v){
      this.whois = v.whois || ''; // {string} 関数名またはクラス名.メソッド名
      this.seq = seq++; // {number} 実行順序
      this.arg = v.arg || {}; // {any} 起動時引数。{変数名：値}形式
      this.v = v || null; // {Object} 汎用変数
      this.stack = [];  // {string[]} 実行順に並べたdev.step
      this.rv = v.rv || null; // {any} 戻り値

      this.start = new Date();  // {Date} 開始時刻
      this.end = 0; // {Date} 終了時刻
      this.elaps = 0; // {number} 所要時間(ミリ秒)
    }
  }

  class szError extends Error {
    constructor(fi,...e){
      super(...e);

      // 独自追加項目を個別に設定(Object.keysではstackが空欄等、壊れる)
      ['whois','seq','arg','rv','start','end','elaps']
      .forEach(x => this[x] = fi[x]);
    }
  }

  opt = Object.assign({mode:'dev',digit:4},opt);
  let seq = 0;  // 関数の呼出順(連番)
  const stack = []; // {functionInfo[]} 呼出元関数スタック
  let fi; // 現在処理中の関数に関する情報
  return {start,step,end,error};

  /** start: 呼出元関数情報の登録＋開始メッセージの表示
   * @param {Object} v - 汎用変数。whois,arg,rvを含める
   */
  function start(v){
    fi = new functionInfo(v);
    // ログ出力
    if( opt.mode === 'normal' || opt.mode === 'dev' ){
      console.log(`${toLocale(fi.start)} [${
        ('0'.repeat(opt.digit)+fi.seq).slice(-opt.digit)
      }] ${fi.whois} start`);
    }
    stack.push(fi); // 呼出元関数スタックに保存
  }

  /** step: 関数内の進捗状況管理＋変数のダンプ */
  function step(label,val=null){
    // fi.stackにstepを追加
    fi.stack.push(label);
    // valをJSON表示
    if( opt.mode === 'dev' ){
      console.log(`${fi.whois} step.${label} ${formatObject(val)}`);
    }
  }

  /** end: 正常終了時処理 */
  function end(){

    fi.end = new Date();
    fi.elaps = fi.end - fi.start;

    // ログ出力
    if( opt.mode === 'normal' || opt.mode === 'dev' ){
      console.log(`${toLocale(fi.end)} [${
        ('0'.repeat(opt.digit)+fi.seq).slice(-opt.digit)
      }] ${fi.whois} normal end`);
    }

    stack.pop();  // 呼出元関数スタックから削除
    fi = stack[stack.length-1];
  }

  function error(e){
    const rv = new szError(fi,e);
    console.error('l.49',rv);
    return rv;
  }

  /** ログ出力用時刻文字列整形 */
  function toLocale(date){
    const pad = (num, length = 2) => String(num).padStart(length, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${
      pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
  }

  /**
   * オブジェクトの各メンバーを「メンバ名: 値 // データ型」の形式で再帰的に整形する
   * @param {any} obj - 整形対象のオブジェクトまたは配列
   * @param {number} indentLevel - 現在のインデントレベル
   * @returns {string} 整形された文字列
   */
  function formatObject(obj, indentLevel = 0) {
    const indent = '  '.repeat(indentLevel); // インデント文字列

    if (obj === null) {
      return `${indent}null // null`;
    }

    const type = typeof obj;

    // プリミティブ型 (number, string, boolean, null, undefined)
    if (type !== 'object' && type !== 'function') {
      // 文字列は二重引用符で囲む
      const value = type === 'string' ? `"${obj}"` : obj;
      return `${indent}${value}, // ${type}`;
    }
    
    // 関数 (function)
    if (type === 'function') {
      // 関数は文字列化してデータ型を表示しない
      // toLocalISOString の例から、関数の値は引用符なしで表示します
      return `${indent}${obj.toString()},`;
    }

    // オブジェクト型 (Array, Object)
    
    // Array の場合
    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return `${indent}[ /* Array, length 0 */ ], // object`;
      }
      
      const elements = obj.map(item => 
        // Arrayの要素は名前がないため、インデントと値のみを返す
        formatObject(item, indentLevel + 1)
      ).join('\n');
      
      // Arrayの要素はカンマではなく改行で区切ります
      return `${indent}[\n${elements}\n${indent}], // Array`;
    }
    
    // 標準の Object の場合
    const keys = Object.keys(obj);
    if (keys.length === 0) {
      return `${indent}{ /* Object, empty */ }, // object`;
    }

    const members = keys.map(key => {
      const value = obj[key];
      const memberType = typeof value;
      const nextIndent = '  '.repeat(indentLevel + 1);
      
      // オブジェクト/配列/関数は再帰呼び出し
      if (memberType === 'object' && value !== null || memberType === 'function') {
        // 複合型の場合は、キーと値の開始のみを記載
        const formattedValue = formatObject(value, indentLevel + 1);
        return `${nextIndent}${key}:${formattedValue}`;
      }
      
      // プリミティブ型は一行で表示
      const formattedValue = memberType === 'string' ? `"${value}"` : value;
      return `${nextIndent}${key}:${formattedValue}, // ${memberType}`;
    }).join('\n');

    return `${indent}{\n${members}\n${indent}}`;
  }
}

const dev = devTools();
const t02 = () => {
  const v = {whois:'t02',arg:null,rv:null};
  dev.start(v);
  try {
    v.hoge = {fuga:[1,true]};
    dev.step(1,v.hoge);
    dev.end();
  } catch(e) { return dev.error(e); }
}
const t01 = (x) => {
  const v = {whois:'t01',arg:{x},rv:null};
  // vのメンバ：whois, arg, rv
  dev.start(v);
  try {
    dev.step(1.1,v);
    //console.log('in t01: ',v);
    for( v.i=0 ; v.i<2 ; v.i++ ) t02();
    dev.end();
    return v.rv;
  } catch(e) { return dev.error(e); }
}
t01('abc');