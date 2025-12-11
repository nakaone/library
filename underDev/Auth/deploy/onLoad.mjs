// 例: localFunc.mjs の冒頭付近
let _mockDB = null;
let _mockAuthExec = null;

export function __setMockDB(db) { _mockDB = db; }
export function __setAuthExec(fn) { _mockAuthExec = fn; }

export async function localFunc(opt) {
  const db = _mockDB ?? realIndexedDB;      // モック優先
  const execFn = _mockAuthExec ?? authClient.exec;
}


// ライブラリ関数定義
/** devTools: 開発支援関係メソッド集
 * @param {Object} opt - 動作設定オプション
 * @param {string} [opt.mode='dev'] - 出力モード
 * @param {number} [opt.digit=4] - 処理順(seq)をログ出力する際の桁数
 *
 * - 出力モード
 *   | mode | エラー | 開始・終了 | dump/step |
 *   | "none" | ❌ | ❌ | ❌ | 出力無し(pipe処理等) |
 *   | "error" | ⭕ | ❌ | ❌ | エラーのみ出力 |
 *   | "normal" | ⭕ | ⭕ | ❌ | 本番用 |
 *   | "dev" | ⭕ | ⭕ | ⭕ | 開発用 |
 *
 * @example
 *
 * ```js
 * const dev = devTools();  // 本番時は devTools({mode:'normal'}) に変更
 * const t01 = (x) => {
 *   const v = {whois:'t01',arg:{x},rv:null}; // whois,arg,rvは指定推奨
 *   dev.start(v); // 汎用変数を引数とする
 *   try {
 *     dev.step(1.1,v);  // 場所を示す数値または文字列(＋表示したい変数)
 *
 *     dev.end();  // v.rvを戻り値と看做す
 *     return v.rv;
 *   } catch(e) { return dev.error(e); }
 * }
 *
 * - 変更履歴
 *   - rev.2.1.0
 *     - ES module対応のため、build.sh作成
 *   - rev.2.0.0
 *     - errorメソッドの戻り値を独自エラーオブジェクトに変更
 *     - functionInfoクラスを導入、詳細情報を追加
 *     - オプションを簡素化、出力モードに統合
 *     - 機能を簡素化
 *       - メソッドから削除：changeOption, check
 *       - dump を step に統合
 *     - stringify -> formatObject
 *   - rev.1.0.1 : 2025/07/17
 *     start/endでメッセージ表示を抑止するため、引数"rt(run time option)"を追加
 *   - rev.1.0.0 : 2025/01/26
 *     SpreadDb.1.2.0 test.jsとして作成していたのを分離
 */
function devTools(opt){
  /** functionInfo: 現在実行中の関数に関する情報 */
  class functionInfo {
    constructor(v){
      this.whois = v.whois || ''; // {string} 関数名またはクラス名.メソッド名
      this.seq = seq++; // {number} 実行順序
      this.arg = v.arg || {}; // {any} 起動時引数。{変数名：値}形式
      this.v = v || null; // {Object} 汎用変数
      this.step = v.step || '';
      this.log = [];  // {string[]} 実行順に並べたdev.step
      this.rv = v.rv || null; // {any} 戻り値

      this.start = new Date();  // {Date} 開始時刻
      this.end = 0; // {Date} 終了時刻
      this.elaps = 0; // {number} 所要時間(ミリ秒)
    }
  }

  /** dtError: 独自拡張したErrorオブジェクト */
  class dtError extends Error {
    constructor(fi,...e){
      super(...e);

      // 呼出元関数
      this.caller = trace.map(x => x.whois).join(' > ');

      // 独自追加項目を個別に設定(Object.keysではtraceが空欄等、壊れる)
      ['whois','step','seq','arg','rv','start','end','elaps']
      .forEach(x => this[x] = fi[x]);

      // エラーが起きた関数内でのstep実行順
      this.log = fi.log.join(', ');

    }
  }

  opt = Object.assign({mode:'dev',digit:4},opt);
  let seq = 0;  // 関数の呼出順(連番)
  const trace = []; // {functionInfo[]} 呼出元関数スタック
  let fi; // 現在処理中の関数に関する情報
  return {start,step,end,error};

  /** start: 呼出元関数情報の登録＋開始メッセージの表示
   * @param {Object} v - 汎用変数。whois,arg,rvを含める
   */
  function start(v){
    fi = new functionInfo(v);
    // ログ出力
    if( opt.mode === 'normal' || opt.mode === 'dev' ){
      console.log(`${toLocale(fi.start,'hh:mm:ss.nnn')} [${
        ('0'.repeat(opt.digit)+fi.seq).slice(-opt.digit)
      }] ${fi.whois} start`);
    }
    trace.push(fi); // 呼出元関数スタックに保存
  }

  /** step: 関数内の進捗状況管理＋変数のダンプ
   * @param {number|string} label - dev.start〜end内での位置を特定するマーカー
   * @param {any} [val=null] - ダンプ表示する変数
   * @param {boolean} [cond=true] - 特定条件下でのみダンプ表示したい場合の条件
   * @example 123行目でClassNameが"cryptoClient"の場合のみv.hogeを表示
   *   dev.step(99.123,v.hoge,this.ClassName==='cryptoClient');
   *   ※ 99はデバック、0.123は行番号の意で設定
   */
  function step(label,val=null,cond=true){
    fi.step = String(label);  // stepを記録
    fi.log.push(fi.step); // fi.logにstepを追加
    // valが指定されていたらステップ名＋JSON表示
    if( opt.mode === 'dev' && val && cond ){
      console.log(`== ${fi.whois} step.${label} ${formatObject(val)}`);
    }
  }

  /** end: 正常終了時処理 */
  function end(){
    // 終了時に確定する項目に値設定
    finisher(fi);

    // ログ出力
    if( opt.mode === 'normal' || opt.mode === 'dev' ){
      console.log(`${toLocale(fi.end,'hh:mm:ss.nnn')} [${
        ('0'.repeat(opt.digit)+fi.seq).slice(-opt.digit)
      }] ${fi.whois} normal end`);
      if( fi.seq === 0 ){
        console.log(`\tstart: ${toLocale(fi.start)
        }\n\tend  : ${toLocale(fi.end)
        }\n\telaps: ${fi.elaps}`);
      }
    }

    trace.pop();  // 呼出元関数スタックから削除
    fi = trace[trace.length-1];
  }

  /** finisher: end/error共通の終了時処理 */
  function finisher(fi){
    // 終了時に確定する項目に値設定
    fi.end = new Date();
    fi.elaps = `${fi.end - fi.start} msec`;
  }
  /** error: エラー時処理 */
  function error(e){

    // 終了時に確定する項目に値設定
    finisher(fi);
    fi.start = toLocale(fi.start);  // エラーログ出力時はISO8601拡張形式
    fi.end = toLocale(fi.end);

    // 独自エラーオブジェクトを作成
    const rv = e.constructor.name === 'dtError' ? e : new dtError(fi,e);

    // ログ出力：エラーが発生した関数でのみ出力
    if( opt.mode !== 'none' && fi.seq === rv.seq ){
      console.error(rv);
    }

    trace.pop();  // 呼出元関数スタックから削除
    fi = trace[trace.length-1] || {seq: -1};

    return rv;
  }

  /** ログ出力用時刻文字列整形 */
  function toLocale(date,opt='yyyy-MM-ddThh:mm:ss.nnnZ'){
    const v = {rv:opt,dObj:date};
    if( typeof date === 'string' ) return date;

    v.local = { // 地方時ベース
      y: v.dObj.getFullYear(),
      M: v.dObj.getMonth()+1,
      d: v.dObj.getDate(),
      h: v.dObj.getHours(),
      m: v.dObj.getMinutes(),
      s: v.dObj.getSeconds(),
      n: v.dObj.getMilliseconds(),
      Z: Math.abs(v.dObj.getTimezoneOffset())
    }

    // タイムゾーン文字列の作成
    v.local.Z = v.local.Z === 0 ? 'Z'
    : ((v.dObj.getTimezoneOffset() < 0 ? '+' : '-')
    + ('0' + Math.floor(v.local.Z / 60)).slice(-2)
    + ':' + ('0' + (v.local.Z % 60)).slice(-2));

    // 日付文字列作成
    for( v.x in v.local ){
      v.m = v.rv.match(new RegExp(v.x+'+'));
      if( v.m ){
        v.str = v.m[0].length > 1
          ? ('000'+v.local[v.x]).slice(-v.m[0].length)
          : String(v.local[v.x]);
        v.rv = v.rv.replace(v.m[0],v.str);
      }
    }
    return v.rv;
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

// authClient関係クラス定義
class authClient {

  static _IndexedDB = null; // データベース接続オブジェクトを格納する静的変数

  constructor(arg) {
    const v = {whois:`authClient.constructor`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      dev.step(1); // メンバに値設定
      this.cf = new authClientConfig(arg);
      this.idb = {};

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  exec(arg) {
    const v = {whois:`${this.constructor.name}.exec`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      dev.step(1);
      v.rv = this.idb;  // オンメモリのIndexedDBの内容

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

    /** initialize: IndexedDBの初期化
     * - その他インスタンス生成時に必要な非同期処理があれば、ここで処理する
     * - staticではない一般のメンバへの値セットができないため別途constructorを呼び出す
     */
    static async initialize(arg) {
    const v = {whois:`authClient.initialize`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      dev.step(1);  // インスタンス生成
      // オプション既定値を先にメンバ変数に格納するため、constructorを先行
      v.rv = new authClient(arg);

      dev.step(2);  // DB接続：非同期処理なのでconstructorではなくinitializeで実行
      authClient._IndexedDB = await (()=>{
        return new Promise((resolve, reject) => {
          // 既に接続があればそれを返す
          if (authClient._IndexedDB) {
            return resolve(authClient._IndexedDB);
          }

          const openRequest = indexedDB.open(v.rv.cf.dbName, v.rv.cf.dbVersion);

          openRequest.onerror = (event) => {
            reject(new Error("IndexedDB接続エラー: " + event.target.error.message));
          };

          openRequest.onsuccess = (event) => {
            authClient._IndexedDB = event.target.result;
            resolve(authClient._IndexedDB);
          };

          openRequest.onupgradeneeded = (event) => {
            const db_upgrade = event.target.result;
            if (!db_upgrade.objectStoreNames.contains(v.rv.cf.storeName)) {
              db_upgrade.createObjectStore(v.rv.cf.storeName);
              console.log(`✅ オブジェクトストア '${v.rv.cf.storeName}' を作成しました。`);
            }
          };
        });
      })();

      dev.step(3);  // オプション設定値をIndexedDBに保存
      await v.rv.setIndexedDB({ // 内容はauthIndexedDB
        memberId: 'dummyID',  // 仮IDはサーバ側で生成
        memberName: 'dummyName',
        deviceId: crypto.randomUUID(),
        keyGeneratedDateTime: Date.now(),
        SPkey: 'dummySPkey',
      });

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  async setIndexedDB(arg) {
    const v = {whois:`${this.constructor.name}.setIndexedDB`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      v.db = authClient._IndexedDB;
      if (!v.db) throw new Error("IndexedDBが初期化されていません。");

      // 'readwrite' トランザクション
      const transaction = v.db.transaction([this.cf.storeName], 'readwrite');
      const store = transaction.objectStore(this.cf.storeName);

      // 複数の put リクエストを順番に実行
      for ( [v.key, v.value] of Object.entries(arg)) {
        // this.idbに登録
        this.idb[v.key] = v.value;

        // putリクエストを実行。リクエストの成功/失敗を待つ必要は必ずしもないが、
        // エラーハンドリングのためにPromiseでラップするのが一般的。
        await new Promise((resolve, reject) => {
          const putRequest = store.put(v.value, v.key);

          putRequest.onsuccess = () => {
            resolve();
          };

          putRequest.onerror = (event) => {
            // 個別のリクエストエラーはトランザクション全体のエラーとなる
            reject(new Error(`PUT操作失敗 (Key: ${v.key}): ${event.target.error.message}`));
          };
        });

      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}
class authConfig {

  constructor(arg) {
    const v = {whois:`authConfig.constructor`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      dev.step(1); // メンバの値設定
      this.systemName = arg.systemName || 'Auth'; // {string} システム名
      if( arg.hasOwnProperty('adminMail') ){
        this.adminMail = arg.adminMail;	// {string} 管理者のメールアドレス
      } else {
        throw new Error('"adminMail" is not specified.');
      }
      if( arg.hasOwnProperty('adminName') ){
        this.adminName = arg.adminName;	// {string} 管理者氏名
      } else {
        throw new Error('"adminName" is not specified.');
      }
      this.allowableTimeDifference = arg.allowableTimeDifference || 120000;
      // {number}	クライアント・サーバ間通信時の許容時差	既定値は2分
      this.RSAbits = arg.RSAbits || 2048;	// {number} 鍵ペアの鍵長
      this.underDev = {};	// {Object} テスト時の設定
      this.underDev.isTest = // {boolean} 開発モードならtrue
      ( arg.hasOwnProperty('underDev')
      && arg.underDev.hasOwnProperty('isTest') )
      ? arg.underDev.isTest : false;

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

}
class authClientConfig extends authConfig {

  constructor(arg) {
    const v = {whois:`authClientConfig.constructor`, arg:{arg}, rv:null};
    dev.start(v);
    try {
      super(arg);

      dev.step(1); // メンバの値設定
      if( arg.hasOwnProperty('api') ){
        this.api = arg.api;	// {string} サーバ側WebアプリURLのID
      } else {
        throw new Error('"api" is not specified.');
      }
      this.timeout = arg.timeout || 300000; // {number} サーバからの応答待機時間
      this.storeName = arg.storeName || 'config'; // {string} IndexedDBのストア名
      this.dbVersion = arg.dbVersion || 1;  // {number} IndexedDBのバージョン

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }
}

// グローバル変数定義
const dev = devTools();
let auth;  // authClient。HTML要素のイベント対応のためグローバル領域で宣言

// 処理要求を発行するローカル関数
async function localFunc(){
  const v = { whois: 'localFunc', rv: null};
  dev.start(v);
  try {

    dev.step(1);  // authClientインスタンス作成
    auth = await authClient.initialize();

    dev.step(2);  // execテスト
    v.rv = auth.exec({fuga:'hoge'});
    if( v.rv instanceof Error ) throw v.rv;

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}

// onLoad処理は"async"で宣言
async function onLoad(){
  auth = new authClient();
  console.log('onLoad running');
}

export {devTools,authClient,authClientConfig,authConfig,localFunc};
