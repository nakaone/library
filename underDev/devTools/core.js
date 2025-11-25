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

  opt = Object.assign({mode:'dev',digit:4},opt);
  let seq = 0;  // 関数の呼出順(連番)
  const stack = []; // {szError[]} 呼出元関数情報のスタック
  let current;  // 現在処理中の関数に関する情報
  return {start,end};

  /** start: 呼出元関数情報の登録＋開始メッセージの表示
   * @param {string} whois - 関数名
   * @param {Object.<string,any>} [arg={}] - {変数名：値}形式の引数
   * @param {any} [v={}] - 関数内汎用変数
   */
  function start(whois,arg,v){
    current = {
      start: Date.now(),  // {number} 開始時刻(UNIX時刻)
      startStr: '', // {string} 開始時刻(ISO8601拡張形式)
      elaps: -1, // {number} 所要時間(ミリ秒)
      end: -1,  // {number} 終了時刻
      endStr: '',
      whois: whois || '', // {string} 関数名またはクラス名.メソッド名
      seq: seq++, // {number} 実行順序
      sSeq: null, // {string} 連番(seq)を"[000n]"形式にした文字列
      arg: arg || {}, // {any} 起動時引数。{変数名：値}形式
      v: v || {}, // {Object} 汎用変数
      stack: [],  // {string[]} dev.stepの実行順
      rv: null, // {any} 戻り値
    };
    current.startStr = toLocale(new Date(current.start));
    current.sSeq = `[${('0'.repeat(opt.digit)+current.seq).slice(-opt.digit)}]`;
    stack.push(current);

    // ログ出力
    if( opt.mode === 'normal' || opt.mode === 'dev' ){
      console.log(`${current.startStr} ${current.sSeq} ${current.whois} start`);
    }
  }

  /** end: 正常終了時の呼出元関数情報の抹消＋終了メッセージの表示
   * @param {any} [rv=null] - 戻り値
   */
  function end(rv={}){
    current.end = Date.now();
    current.endStr = toLocale(new Date(current.end));
    current.elaps = current.end - current.start;
    current.rv = rv;
    stack.pop();

    // ログ出力
    if( opt.mode === 'normal' || opt.mode === 'dev' ){
      console.log(`${current.endStr} ${current.sSeq} ${current.whois} normal end`);
    }
  }

  /** toLocale: ローカル時刻に基づいたISO 8601形式の文字列を生成する
   * 例: "2025-11-25T17:24:50.000"
   * @param {Date} date - Dateオブジェクト
   * @returns {string} ローカルISO形式の文字列
   */
  function toLocale(date){
    const pad = (num, length = 2) => String(num).padStart(length, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // getMonth() は 0-11
    const day = pad(date.getDate());
    
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    
    // getMilliseconds() は最大3桁
    const milliseconds = pad(date.getMilliseconds(), 3);

    // 'YYYY-MM-DDTHH:mm:ss.sss' の形式で結合
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  }
}

const dev = devTools(); // 本番時はdevTools({mode:'normal'})
const f0 = () => {
  const v = {};
  dev.start('f0',null,v);
  console.log('f0 transactions...');
  dev.end(true);
}
f0();