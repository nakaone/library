/** devTools: 開発支援関係メソッド集
 * @class
 * @classdesc 開発支援関係メソッド集
 * @prop {string} whois='' - 関数名またはクラス名.メソッド名
 * @prop {number} seq - 関数・メソッドの呼出順
 * @prop {Object.<string, any>} arg={} - 起動時引数。{変数名：値}形式
 * @prop {Object} v={} - 関数・メソッド内汎用変数
 * @prop {string} stepNo=1 - 関数・メソッド内の現在位置
 * @prop {string[]} log=[] - {string[]} 実行順に並べたdev.stepNo
 * @prop {number} startTime=Date.now() - 開始時刻
 * @prop {number} endTime - 終了時刻
 * @prop {number} elaps - 所要時間(ミリ秒)
 * 
 * - 変更履歴
 *   - rev.3.0.0 : 2025/12/19
 *     - 非同期(平行)処理だとグローバル変数dev内でスタックが混乱、step()で別処理のwhoisを表示
 *       ⇒ グローバル変数内スタックでの呼出・被呼出管理を断念、「関数・メソッド内で完結」に方針転換
 *     - 呼出元との関係(スタック)は断念、標準Errorのstack表示を利用
 *     - クロージャ関数 ⇒ クラス化(∵多重呼出による使用メモリ量増大を抑制)
 *   - rev.2.1.1 : 2025/12/18
 *     - error():ブラウザの開発モードでエラー時message以外が出力されないバグを修正
 *     - end():引数があればダンプ出力を追加
 *   - rev.2.1.0 : 2025/12/12
 *     - ES module対応のため、build.sh作成
 *     - 原本をcore.jsからcore.mjsに変更
 *   - rev.2.0.0 : 2025/12/08
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
 * 
 * @example
 * function xxx(o){
 *   const v = {whois:'xxx',arg:{o},rv:null};
 *   const dev = new devTools(v); // 従来のdev.startを代替
 *   try {
 *     dev.step(1);
 *     ...
 *     dev.end(); // 省略可
 *   } catch(e) {
 *     return dev.error(e);
 *   }
 * }
 * 
 */
class devTools {

  /** constructor
   * @constructor
   * @param {Object} v={} - 関数・メソッド内汎用変数
   * @param {Object} opt={}
   * @param {string} [opt.mode]='dev' - 出力モード
   * @param {number} [opt.digit=4] - 処理順(seq)をログ出力する際の桁数
   * @param {boolean} [opt.footer=false] - 実行結果(startTime,endTime,elaps)を出力するならtrue
	 * - 出力モード
	 *   | mode     | エラー | 開始・終了 | dump/step | 用途・備考          |
   *   | :--      | :--:  | :--:     | :--:      | :--               |
	 *   | "none"   | ❌    | ❌        | ❌        | 出力無し(pipe処理等) |
	 *   | "error"  | ⭕    | ❌        | ❌        | エラーのみ出力       |
	 *   | "normal" | ⭕    | ⭕        | ❌        | 本番用              |
	 *   | "dev"    | ⭕    | ⭕        | ⭕        | 開発用              |
   */
  constructor(v={},opt={}){

    // 状態管理変数の初期値設定
		this.whois = v.whois ?? '';
    this.seq = devTools.sequence++;
		this.arg = v.arg ?? {};
    this.v = v ?? {};
		this.stepNo = 1;
		this.log = [];
		this.startTime = new Date();
		this.endTime = 0;
		this.elaps = 0;

    // オプションの既定値設定
    this.opt = {
      mode: opt.mode ?? 'dev',
      digit: opt.digit ?? 4,
      footer: opt.footer ?? false,
    };

    // 開始ログ出力
    if( this.opt.mode === 'normal' || this.opt.mode === 'dev' ){
      console.log(`${this.toLocale(this.startTime,'hh:mm:ss.nnn')} [${
        ('000'+this.seq).slice(-this.opt.digit)}]${this.whois} start`);
    }
  }

  /** devToolsError: devTools専用拡張エラークラス */
  static devToolsError(dtObj,...e){
    const rv = new Error(...e);

    // 独自追加項目を個別に設定
    ['whois','seq','arg','stepNo','log','startTime','endTime','elaps','v']
    .forEach(x => rv[x] = dtObj[x] ?? null);

    rv.name = 'devToolsError';
    return rv;
  }

  /** step: 関数内の進捗状況管理＋変数のダンプ
   * @param {number|string} label - dev.start〜end内での位置を特定するマーカー
   * @param {any} [val=null] - ダンプ表示する変数
   * @param {boolean} [cond=true] - 特定条件下でのみダンプ表示したい場合の条件
   * @example 123行目でClassNameが"cryptoClient"の場合のみv.hogeを表示
   *   dev.step(99.123,v.hoge,this.ClassName==='cryptoClient');
   *   ※ 99はデバック、0.123は行番号の意で設定
   */
  step(label, val=null, cond=true){
    this.stepNo = String(label);
    this.log.push(this.stepNo);
    // valが指定されていたらステップ名＋JSON表示
    if( this.opt.mode === 'dev' && val && cond ){
      console.log(`== [${('000'+this.seq).slice(-this.opt.digit)
        }]${this.whois} step.${label} ${this.formatObject(val)}`);
    }
  }

  /** end: 正常終了時処理
   * @param {any} [arg] - 終了時ダンプする変数
   * @returns {void}
   */
  end(arg){
    // 終了時に確定する項目に値設定
    this.finisher();

    // ログ出力
    if( this.opt.mode === 'normal' || this.opt.mode === 'dev' ){
      let msg = `${this.toLocale(this.endTime,'hh:mm:ss.nnn')} [${
        ('000'+this.seq).slice(-this.opt.digit)}]${this.whois} normal end`;
      // 引数があればダンプ出力
      if( typeof arg !== 'undefined' ) msg += '\n' + this.formatObject(arg)
      // 大本の呼出元ではstart/end/elaps表示
      if( this.opt.footer ){
        msg += '\n' + `\tstart: ${this.toLocale(this.startTime)
        }\n\tend  : ${this.toLocale(this.endTime)
        }\n\telaps: ${this.elaps}`;
      }
      console.log(msg);
    }
  }

  error(e){
    // 終了時に確定する項目に値設定
    this.finisher();
    // エラーログ出力時はISO8601拡張形式
    this.startTime = this.toLocale(this.startTime);
    this.endTime = this.toLocale(this.endTime);

    if( e.name === 'devToolsError' ){
      // 引数がdevToolsError型
      // ⇒ 自関数・メソッドでは無く、呼出先から返されたError
      // ⇒ メッセージを出力せず、そのまま返す
      return e;
    } else {
      // 引数がdevToolsError型ではない
      // ⇒ 自関数・メソッドで発生またはthrowされたError
      // ⇒ メッセージを出力し、devToolsErrorにして情報を付加
      e = devTools.devToolsError(this,e);
      console.error(`[${('000'+e.seq).slice(-this.opt.digit)}]${e.whois
        } step.${e.stepNo}\n${e.message}\n${this.formatObject(e)}`);
      return e;
    }
  }

  /** finisher: end/error共通の終了時処理 */
  finisher(){
    // 終了時に確定する項目に値設定
    if( Array.isArray(this.log) ) this.log = this.log.join(', ');
    this.endTime = new Date();
    this.elaps = `${this.endTime - this.startTime} msec`;
  }

  /** toLocale: ログ出力用時刻文字列整形
   * @param {Date} date - 整形対象Dateオブジェクト
   * @param {string} template - テンプレート
   */
  toLocale(date,template='yyyy-MM-ddThh:mm:ss.nnnZ'){
    const v = {rv:template,dObj:date};
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

  /** formatObject: オブジェクトの各メンバーを「メンバ名: 値 // データ型」の形式で再帰的に整形する
   * @param {any} obj - 整形対象のオブジェクトまたは配列
   * @param {number} indentLevel - 現在のインデントレベル
   * @returns {string} 整形された文字列
   */
  formatObject(obj, indentLevel = 0) {
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
        this.formatObject(item, indentLevel + 1)
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
        const formattedValue = this.formatObject(value, indentLevel + 1);
        return `${nextIndent}${key}:${formattedValue}`;
      }

      // プリミティブ型は一行で表示
      const formattedValue = memberType === 'string' ? `"${value}"` : value;
      return `${nextIndent}${key}:${formattedValue}, // ${memberType}`;
    }).join('\n');

    return `${indent}{\n${members}\n${indent}}`;
  }
}
devTools.sequence = 1; // 関数・メソッドの呼出順を初期化
