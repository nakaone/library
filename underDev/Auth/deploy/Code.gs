// 2026/01/22 16:15:54
// スプレッドシートメニュー定義
function onOpen(e){
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('道具箱')
    .addItem('加入認否入力', 'menu10')
    .addSeparator()
    .addSubMenu(ui.createMenu("システム関係")
      .addItem('実行環境の初期化', 'menu21')
      .addItem("【緊急】鍵ペアの更新", "menu22")
    )
    .addToUi();
}
const menu10 = () => asv.listNotYetDecided();
const menu21 = () => authServer.setupEnvironment(config);
const menu22 = () => authServer.resetSPkey();
// 開発用ツール(コンソールで実行、メニュー化対象外)
const menu91 = () => authServer.dumpProperties();

// ライブラリ関数定義
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
/** 渡された変数内のオブジェクト・配列を再帰的にマージ
 * - pri,subともデータ型は不問。次項のデシジョンテーブルに基づき、結果を返す
 *
 * @param {any} pri - 優先される変数(priority)
 * @param {any} sub - 劣後する変数(subordinary)
 * @param {Object} opt - オプション
 * @param {string} opt.array - 配列の扱いを指定
 * @returns {any|Error}
 *
 * #### デシジョンテーブル
 *
 * | 優先(pri) | 劣後(sub) | 結果 | 備考 |
 * | :--: | :--: | :--: | :-- |
 * |  A  |  -  |  A  | 優先(A)のみ存在するメンバはそのまま |
 * |  A  |  B  |  A  | |
 * |  A  | [B] |  A  | |
 * |  A  | {B} |  A  | |
 * | [A] |  -  | [A] | |
 * | [A] |  B  | [A] | |
 * | [A] | [B] | [X] | 配列はopt.arrayによる |
 * | [A] | {B} | [A] | |
 * | {A} |  -  | {A} | |
 * | {A} |  B  | {A} | |
 * | {A} | [B] | {A} | |
 * | {A} | {B} | {A+B} | オブジェクトも置換ではなく結合する |
 * |  -  |  -  |  -  | |
 * |  -  |  B  |  B  | |
 * |  -  | [B] | [B] | |
 * |  -  | {B} | {B} | |
 *
 * #### opt.array : pri,sub双方配列の場合の処理方法を指定
 *
 * 例 pri:[1,2,{x:'a'},{a:10,b:20}], sub:[1,3,{x:'a'},{a:30,c:40}]
 *
 * - pri(priority): 単純にpriをセット。subは全て廃棄 ⇒ [1,2,{x:'a'},{a:10,b:20}]
 * - add: 値の重複に拘わらず、pri+subを返す ⇒ [1,2,{x:'a'},{a:10,b:20},1,3,{x:'a'},{a:30,c:40}]
 * - set: priに無いsubの要素をpriに追加 ⇒ [1,2,3,{x:'a'},{x:'a'},{a:10,b:20},{a:30,c:40}]
 *   ※`{x:'a'}`は別オブジェクトなので、重複排除されない事に注意。関数、Date等のオブジェクトも同様。
 * - str(strict): 【既定値】priに無いsubの要素をpriに追加。setと異なり、内容が同値なら重複排除<br>
 *   ⇒ [1,2,3,{x:'a'},{a:10,b:20},{a:30,c:40}]
 * - cmp(未実装): pri[n]とsub[n]を比較(comparison)。原則pri優先だが、例外として両方がObj or Arrならマージ<br>
 *   ⇒ [1,2,{x:'a'},{a:10,b:20,c:40}]
 *
 * @history
 * - rev.2.0.0 : 2026/01/16
 *   - pri,subの順番をObject.assignに合わせる
 *   - devToolsアップデート対応(2系->3.0.0)
 * - rev.1.2.0 : 2025/09/14
 *   - priまたはsubがErrorならそのままエラーとして返すよう修正(複数変数統合対応)
 *   - devTool対応
 * - rev.1.1.0 : 2024/02/17
 *   - deepcopyと統合
 *   - 配列の統合方法を整理、オプションとして指定可能に変更
 * - rev.1.0.0 : 2023/10/21 初版
 */
function mergeDeeply(sub,pri,opt={}){
  const v = {whois:`mergeDeeply`, arg:{sub,pri,opt}, rv:null,
    isObj: arg => arg && String(Object.prototype.toString.call(arg).slice(8,-1)) === 'Object',
    isArr: arg => arg && Array.isArray(arg),
  };
  const dev = new devTools(v);
  try {

    dev.step(1.1);  // 引数チェック
    if( pri instanceof Error ) throw pri;
    if( sub instanceof Error ) throw sub;

    dev.step(1.2);  // 既定値の設定
    if( !opt.hasOwnProperty('array') ) opt.array = 'str';

    if( v.isObj(pri) && v.isObj(sub) ){
      dev.step(2); // sub,pri共にハッシュの場合
      v.rv = {};
      dev.step(2.1); // 優先・劣後Obj両方のハッシュキー(文字列)を、重複しない形でv.keysに保存
      v.keys = new Set([...Object.keys(pri),...Object.keys(sub)]);
      for( v.key of v.keys ){
        if( pri.hasOwnProperty(v.key) && sub.hasOwnProperty(v.key) ){
          dev.step(2.2); // pri,sub両方がキーを持つ
          if( v.isObj(pri[v.key]) && v.isObj(sub[v.key]) || v.isArr(pri[v.key]) && v.isArr(sub[v.key]) ){
            dev.step(2.21); // 配列またはオブジェクトの場合は再帰呼出
            v.rv[v.key] = mergeDeeply(pri[v.key],sub[v.key],opt);
          } else {
            dev.step(2.22); // 配列でもオブジェクトでもない場合は優先変数の値をセット
            v.rv[v.key] = pri[v.key];
          }
        } else {
          dev.step(2.3); // pri,subいずれか片方しかキーを持っていない
          v.rv[v.key] = pri.hasOwnProperty(v.key) ? pri[v.key] : sub[v.key];
        }
      }
    } else if( v.isArr(pri) && v.isArr(sub) ){
      dev.step(3); // sub,pri共に配列の場合
      switch( opt.array ){
        case 'pri':
          dev.step(3.1);  // pri: 単純にpriをセット。subは全て廃棄 ⇒ [1,2,{x:'a'},{a:10,b:20}]
          v.rv = pri;
          break;
        case 'add':
          dev.step(3.2);  // add: 値の重複に拘わらず、pri+subを返す ⇒ [1,2,{x:'a'},{a:10,b:20},1,3,{x:'a'},{a:30,c:40}]
          v.rv = [...pri, ...sub];
          break;
        case 'str':
          dev.step(3.3);
          // str(strict): priに無いsubの要素をpriに追加。setと異なり、内容が同値なら重複排除<br>
          // ⇒ [1,2,3,{x:'a'},{a:10,b:20},{a:30,c:40}]
          v.rv = [];
          pri.forEach(x => v.rv.push(x));
          sub.forEach(s => {
            v.flag = false;
            pri.forEach(p => v.flag = v.flag || isEqual(s,p));
            if( v.flag === false ) v.rv.push(s);
          });
          break;
        default:
          dev.step(3.4);
          // set(既定値): priに無いsubの要素をpriに追加 ⇒ [1,2,{x:'a'},{a:10,b:20},3,{x:'a'},{a:30,c:40}]
          v.rv = [...new Set([...pri,...sub])];
      }
    } else {
      dev.step(4); // subとpriのデータ型が異なる ⇒ priを優先してセット
      v.rv = whichType(pri,'Undefined') ? sub : pri;
    }

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { return dev.error(e); }
}
/** Schema: DB・データ型構造定義オブジェクト
 * @class
 * @classdesc DB構造定義オブジェクト
 *
 * @property {string} name - Schemaの論理名
 * @property {string} [version='0.0.0'] - Schemaのバージョン識別子(例:'1.2.0')
 * @property {string} [dbName] - 物理DB名。省略時はnameを流用
 * @property {string} [desc=''] - Schema全体に関する概要説明
 * @property {string} [note=''] - Schema全体に関する備考
 * @property {Object.<string, TypeDef>} types - 論理テーブル名をキーとするテーブル定義
 * @property {string} original - Schemaインスタンス生成時の引数(JSON)。自動生成、設定不可
 * @property {string[]} allowedColumnTypes - 許容するColumnのデータ型のリスト。自動生成、設定不可
 *   - 'string' | 'number' | 'boolean' | 'object' | 'array' | 'datetime' | 'function'
 *
 * - 各種アプリで使用するテーブル・データ型を宣言
 * - 各種アプリでは本クラスを拡張し、configとすることを想定
 *
 * @example
 * ```
 * {
 *   name: 'camp2025',
 *   types: {
 *     master: {
 *       cols:[
 *         {name:'タイムスタンプ',type:'string'},
 *         {name:'メールアドレス',type:'string'},
 *         // (中略)
 *       ],
 *     },
 *   },
 * },
 * ```
 *
 * @history
 * 2.0.0 2026-01-13 configの親クラスを念頭に書き換え。factoryメソッド追加
 * 【欠番】2025-12-21 構造簡潔化＋Adapterと役割分担
 * 1.2.0 2025-09-21 AlaSQLの予約語とSpreadDb.schemaの重複排除
 *   - SpreadDb.schema.tables -> tableMap
 *   - SpreadDb.schema.tables.cols -> colMap(∵予約語columnsと紛らわしい)
 * 1.1.0 2025-09-15 構造の見直し、メンバ名の修正
 * 1.0.0 2025-09-15 初版
 */
class Schema {
  /**
   * @constructor
   * @param {Schema[]} arg=[{}] - 設定情報集。後順位優先。共通設定を先頭に特有設定の追加を想定
   * @returns {Schema|Error}
   */
  constructor(arg=[{}]){
    const v = {whois:'Schema.constructor',arg:{arg},rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1);  // 引数argが配列では無い場合、強制的に配列に変更
      if( !Array.isArray(arg) ) arg = [arg];

      for( v.i=0 ; v.i<arg.length ; v.i++ ){

        dev.step(2);  // 引数argの型チェック
        if( !this.isObject(arg[v.i]) )
          throw new Error(`argument must be object.`);

        dev.step(3);  // 既定値・初期値の設定
        this.name = arg[v.i].name ?? this.name ?? null;
        this.version = arg[v.i].version ?? this.version ?? '0.0.0';
        this.dbName = arg[v.i].db ?? this.dbName ?? this.name;
        this.desc = arg[v.i].desc ?? this.desc ?? '';
        this.note = arg[v.i].note ?? this.note ?? '';
        // 既に存在するthis.typesはarg[v.i].typesで上書きしない
        this.types = this.types ?? {};
        // 引数argのバックアップも上書きしない
        this.original = this.original ?? JSON.stringify(arg);
        this.allowedColumnTypes
          = ['string','number','boolean','object','array','datetime','function'];

        dev.step(4);  // 子要素(TypeDef)の設定
        if( this.isObject(arg[v.i].types) ){
          // arg[v.i].types定義分を追加。同名なら上書き
          Object.keys(arg[v.i].types).forEach(x => {
            this.types[x] = this.typedef(x,arg[v.i].types[x]);
          })
        }
      }

      dev.step(5);  // 必須指定項目の存在チェック
      // 引数argの要素の何れかで指定が有ればOKとするため、存在チェックは全arg設定後に行う
      if( this.name === null )
        throw new Error(`"${x}" is not specified.`);

      dev.end();
    } catch(e) {
      return dev.error(e);
    }
  }

  /** isObject: 引数がオブジェクトであるか判定
   * @param {any} arg - 判定対象
   * @returns {boolean} オブジェクトならtrue
   */
  isObject(arg){
    return typeof arg !== 'undefined'
      && arg !== null
      && typeof arg === 'object'
      && !Array.isArray(arg)
      && arg.constructor === Object;
  }

  /** TypeDef: 論理テーブル構造定義
   * @typedef {Object} TypeDef - 論理テーブル構造定義
   * @property {string} name - 論理的な識別名（TypeDef のキー）
   *   - クラス・API・ログで使用。例: 'Member', 'AuthAuditLog'
   *   - constructorに渡す定義オブジェクトでは省略(メンバ名を引用)
   * @property {string} [typeName='TypeDef'] - データ型名
   *   - 同一データ型のテーブル・インスタンスを複数使用する場合、instanceofの代わりに使用
   * @property {string} [desc=''] - テーブルに関する概要説明
   * @property {string} [note=''] - テーブルに関する備考
   * @property {string[]} [primaryKey=[]] - 主キー項目名
   * @property {string[]} [unique=[]] - 主キー以外の一意制約
   * @property {ColumnDef[]} cols - 項目定義（順序を考慮するため配列）
   * @property {string[]} header - 項目名の一覧(引数不可、自動生成)
   * @property {Object.<string, ColumnDef>} map - 項目名をキーとする項目定義集(引数不可、自動生成)
   */
  typedef(name,obj){
    const v = {whois:this.constructor.name+'.typedef',arg:{name,obj},rv:{}};
    const dev = new devTools(v);
    try {

      dev.step(1.1);  // 引数の型チェック
      if( typeof name !== 'string' )
        throw new Error(`argument "name" must be string.`);
      if( !this.isObject(obj) )
        throw new Error(`argument "obj" must be object.`);

      dev.step(1.2);  // 必須指定項目の存在チェック
      if( typeof obj.cols === 'undefined' || !Array.isArray(obj.cols) )
        throw new Error(`cols must be array of length 1 or greater.`);

      dev.step(2);  // 既定値・初期値の設定
      v.rv.name = name;
      v.rv.typeName = 'TypeDef';  // instanceofの代替
      v.rv.desc = obj.desc ?? '';
      v.rv.note = obj.note ?? '';
      v.rv.primaryKey = obj.primaryKey ?? [];
      v.rv.unique = obj.unique ?? [];
      v.rv.cols = [];
      v.rv.header = []; // 自動生成項目
      v.rv.map = {};    // 自動生成項目

      dev.step(3);  // 子要素(ColumnDef)の設定
      obj.cols.forEach(x => {
        v.col = this.columndef(x);
        if( v.col instanceof Error ) throw v.col;

        v.rv.cols.push(v.col);
        v.rv.header.push(v.col.name);
        v.rv.map[v.col.name] = v.col;
      })

      dev.end();
      return v.rv;
    } catch(e) {
      return dev.error(e);
    }
  }

  /** ColumnDef: 項目定義
   * @typedef {Object} ColumnDef - 項目定義
   * @property {string} name - 項目名（英数字・システム用）
   * @property {string} [label] - 表示用ラベル（省略時は name)
   * @property {string} [desc=''] - 項目に関する概要説明
   * @property {string} [note=''] - 項目に関する備考・意味説明
   * @property {string} [type='string'] - 論理データ型
   *   - 'string' | 'number' | 'boolean' | 'object' | 'array' | 'datetime' | 'function'
   * @property {boolean} [nullable=true] - null を許可するか
   * @property {any} [default=null] - 既定値
   *   - 関数の場合は toString() 化された文字列
   *
   * 【datetimeが固定値ではない場合の記述方法】
   * ex. factoryメソッドで生成するオブジェクトに生成日時を設定したい
   *   ColumnDef.default = "Date.now()"
   * ex. 有効期間として1日(24時間)後を設定したい
   *   ColumnDef.default = "new Date(Date.now()+24*3600*1000)"
   * - 【注意】引数は使用不可
   * - factoryメソッドではこれを new Function('x',`return ${default}`) として関数化し、実行結果を返す
   */
  columndef(obj){
    const v = {whois:this.constructor.name+'.columndef',arg:{obj},rv:{}};
    const dev = new devTools(v);
    try {

      dev.step(1.1);  // 引数の型チェック
      if( !this.isObject(obj) )
        throw new Error(`argument "obj" must be object.`);

      dev.step(1.2);  // 必須指定項目の存在チェック
      ['name'].forEach(x => {
        if( !obj.hasOwnProperty(x) )
          throw new Error(`"${x}" is not specified.`);
      });

      dev.step(2);  // 既定値・初期値の設定
      v.rv.name = obj.name;
      v.rv.label = obj.label ?? obj.name;
      v.rv.desc = obj.desc ?? '';
      v.rv.note = obj.note ?? '';
      v.rv.type = obj.type ?? 'string';
      v.rv.nullable = obj.nullable ?? true;
      v.rv.default = obj.default ?? null;

      dev.step(3);  // データ型のチェック
      if( !this.allowedColumnTypes.includes(v.rv.type) )
        throw new Error(`"${v.rv.name}" is invalid type.`);

      dev.end();
      return v.rv;
    } catch(e) {
      return dev.error(e);
    }
  }

  /** factory: 指定TypeDef型のオブジェクトを生成
   * @param {string} name - データ型名。TypeDef.name
   * @param {Object.<string, any>} [arg={}] - 各メンバの設定値
   * @returns {Object} TypeDefで指定したデータ型のオブジェクト
   */
  factory(name,arg={}){
    const v = {whois:this.constructor.name+'.factory',arg:{name,arg},rv:{}};
    const dev = new devTools(v);
    try {

      dev.step(1);  // 引数のチェック
      if( typeof name !== 'string' )
        throw new Error(`argument "name" must be string.`);
      if( !Object.keys(this.types).includes(name) ) // 未定義のtypeならエラー
        throw new Error(`"${name}" is not defined.`);
      if( !this.isObject(arg) )
        throw new Error(`argument "arg" must be object.`);

      dev.step(2);  // 判定・変換ロジックの定義
      v.trueValues = [1, '1', -1, '-1', 'true', 'TRUE', true];
      v.falseValues = [0, '0', 'false', 'FALSE', false];
      v.checkers = {
        string: x => typeof x === 'string' ? x : null,
        number: x => {
          v.num = Number(x);
          return v.num !== null && v.num !== '' && !isNaN(v.num) ? v.num : null;
        },
        boolean: x => v.trueValues.includes(x) ? true
          : (v.falseValues.includes(x) ? false : null),
        object: x => this.isObject(x) ? x : null,
        array: x => Array.isArray(x) ? x : null,
        datetime: x => {  // 日付型
          if( x === null ) return null; // null指定は無効
          v.dt = new Date(x);
          if( isNaN(v.dt.getTime()) ){  // 日付型に変換できなかった場合
            try { // 引数無しの関数として実行結果を返す
              v.f = new Function('',`return ${x}`);
              return v.f();
            } catch(e) { return null; } // 関数化不能の場合は無効とする
          } else {  // 日付型に変換できた場合
            return v.dt;
          }
        },
        function: x => {
          if( typeof x === 'function' ) return x;
          if (Array.isArray(x) && x.every(item => typeof item === 'string')) {
            try {
              // 配列の最後を本体、それ以外を引数として展開
              v.func = new Function(...x);
              return v.func;
            } catch (e) {
              return null;
            }
          }
        }
      };

      // オブジェクトの項目毎に値を設定
      this.types[name].cols.forEach(col => {
        if( arg.hasOwnProperty(col.name) ){
          dev.step(3.1); // 引数arg(設定値の指定)に有った場合
          v.rv[col.name] = v.checkers[col.type](arg[col.name]);
          dev.step(3.2); // 指定が有るのに指定データ型に変換できなかった場合はエラー
          if( arg[col.name] !== null && v.rv[col.name] === null)
            throw new Error(`The value specified for "${col.name}=${arg[col.name]}" is incorrect`);
        } else {
          dev.step(4);  // 引数arg(設定値の指定)に無かった場合
          if ( col.default === null ){
            dev.step(4.1);
            if( col.nullable === false ){
              dev.step(4.11); // 既定値の指定が無く、nullが許されない場合はエラー
              throw new Error(`No setting value is specified`);
            } else {
              dev.step(4.12); // 既定値の指定が無く、nullが許される場合はnull
              v.rv[col.name] = null;
            }
          } else {
            dev.step(4.21); // 既定値の指定が有った場合は既定値をセット
            v.rv[col.name] = v.checkers[col.type](col.default);
            dev.step(4.22); // 戻り値がnull(不適切な設定値)でnullが許されない場合はエラー
            if( v.rv[col.name] === null && col.nullable === false )
              throw new Error(`The default of "${col.name}" is incorrect`);
          }
        }
      });

      dev.end();
      return v.rv;
    } catch(e) {
      return dev.error(e);
    }
  }

  /** sanitizeArg: プリミティブ型のみで構成されるよう無毒化
   * @param {*} value - チェック対象の変数
   * @param {string} path='$' - エラーメッセージ用にオブジェクト内の階層を保持
   * @returns
   */
  sanitizeArg(value, path = '$') {
    const v = {whois:this.constructor.name+'.sanitizeArg',arg:{value,path},rv:null};
    const dev = new devTools(v);
    try {

      main: {
        dev.step(1);
        if( value === null ||
          typeof value === 'string' ||
          (typeof value === 'number' && Number.isFinite(value)) ||
          typeof value === 'boolean'
        ){
          v.rv = value;
          break main;
        };

        if (Array.isArray(value)) {
          v.rv = value.map((v, i) => this.sanitizeArg(v, `${path}[${i}]`));
          break main;
        }

        if (typeof value === 'object') {
          // 明示的に禁止したい型
          if (
            value instanceof CryptoKey ||
            value instanceof Date ||
            value instanceof Error ||
            value instanceof Map ||
            value instanceof Set
          ) {
            throw new Error(`Unsupported argument type at ${path}`);
          }

          const obj = {};
          for (const [k, v] of Object.entries(value)) {
            if (typeof v === 'function') {
              throw new Error(`Function not allowed in arg at ${path}.${k}`);
            }
            obj[k] = this.sanitizeArg(v, `${path}.${k}`);
          }
          v.rv = obj;
        }
      }
      dev.end();
      return v.rv;
    } catch(e) {
      return dev.error(e);
    }

    throw new Error(`Unsupported value type at ${path}`);
  }
}
/** 日時を指定形式の文字列にして返す
 * @param {string|Date} arg=null - 変換元の日時。nullなら現在日時
 * @param {Object} opt - オプション。文字列型ならformat指定と看做す
 * @param {boolean} opt.verbose=false - falseなら開始・終了時のログ出力を抑止
 * @param {string} opt.format='yyyy-MM-ddThh:mm:ss.nnnZ' - 日時を指定する文字列
 *   年:y,月:M,日:d,時:h,分:m,秒:s,ミリ秒:n,タイムゾーン:Z
 * @param {boolean} opt.undecimber=false - "yyyy/13"を期末日として変換するならtrue
 * @param {string} opt.fyEnd="3/31" - 期末日。opt.undecimber=trueなら必須。"\d+\/\d+"形式
 * @param {string} opt.errValue='empty' - 変換不能時の戻り値。※不測のエラーはErrorオブジェクト。
 *   empty:空文字列, error:Errorオブジェクト, null:null値, arg:引数argを無加工で返す
 * @returns {string} 指定形式に変換された文字列。無効な日付なら長さ0の文字列
 *
 * - arg無指定なら現在日時と看做す
 * - optが文字列ならformatと看做す
 * - 「yyyy/13」は期末日に置換
 * - 和暦なら西暦に変換
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
function toLocale(arg=null,opt={}) {
  const v = { whois: 'toLocale', rv: null, arg:{arg,opt},
    wareki:{  // 元号の開始年定義
      '明治':1867,'大正':1911,'昭和':1925,'平成':1988,'令和':2018,
      M:1867,T:1911,S:1925,H:1988,R:2018,
    },
    errValues:{ // 変換不能時の戻り値定義
      empty:'',
      error:new Error(`Couldn't convert "${arg}" to date.`),
      null: null,
      arg: arg,
    }
  };
  opt = Object.assign({
    verbose: false,
    format: 'yyyy-MM-ddThh:mm:ss.nnnZ',
    undecimber : false,
    fyEnd: '03/31',
    errValue: 'empty'
  },( typeof opt === 'string' ? {format:opt} : opt));
  const dev = new devTools(v);
  try {

    // -------------------------------------------------------------
    dev.step(1);  // 処理対象をDate型に変換
    // -------------------------------------------------------------
    if( arg === null ){
      dev.step(1.1);  // 無指定なら現在日時
      v.dObj = new Date();
    } else if( arg instanceof Date ){
      dev.step(1.2);  // 日付型はそのまま採用
      v.dObj = arg;
    } else {
      dev.step(1.3);  // その他。和暦は修正(時分秒は割愛)した上でDate型に
      arg = String(arg).replace(/元/,'1');
      v.m = arg.match(/^([^\d]+)(\d+)[^\d]+(\d+)[^\d]+(\d+)/);
      if( v.m ){
        dev.step(1.4);  // 和暦
        v.dObj = new Date(
          v.wareki[v.m[1]] + Number(v.m[2]),
          Number(v.m[3]) - 1,
          Number(v.m[4])
        );
      } else {
        dev.step(1.5);  // その他
        v.dObj = opt.undecimber // trueなら「yyyy/13」は期末日に置換
          ? new Date(arg.replace(/^(\d+)\/13$/,"$1/"+opt.fyEnd))
          : new Date(arg);
      }
      dev.step(1.6);  // 無効な日付ならエラー値を返して終了
      if( isNaN(v.dObj.getTime()) ) return v.errValues[opt.errValue];
    }

    // -------------------------------------------------------------
    dev.step(2);  // 戻り値(文字列)の作成
    // -------------------------------------------------------------
    v.rv = opt.format;  // 戻り値の書式(テンプレート)
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
    dev.step(2.1);  // タイムゾーン文字列の作成
    v.local.Z = v.local.Z === 0 ? 'Z'
    : ((v.dObj.getTimezoneOffset() < 0 ? '+' : '-')
    + ('0' + Math.floor(v.local.Z / 60)).slice(-2)
    + ':' + ('0' + (v.local.Z % 60)).slice(-2));

    dev.step(2.2);// 日付文字列作成
    for( v.x in v.local ){
      v.m = v.rv.match(new RegExp(v.x+'+'));
      if( v.m ){
        v.str = v.m[0].length > 1
          ? ('000'+v.local[v.x]).slice(-v.m[0].length)
          : String(v.local[v.x]);
        v.rv = v.rv.replace(v.m[0],v.str);
      }
    }

    dev.end({start:opt.verbose}); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}

// auth関係クラス定義・動作設定
/** config: アプリケーションの設定情報
 * - 複数のライブラリを使用可能にするため、第一レベルはアプリ名とする
 * - 秘匿情報はここで設定せず、アプリ側で追加・修正する
 */
const config = {
  // -------------------------------------------------------------
  // authClient/Server共通設定情報
  // -------------------------------------------------------------
  adminMail:"ena.kaon@gmail.com",
  adminName:"あどみ",

  // -------------------------------------------------------------
  // authClient専用設定情報
  // -------------------------------------------------------------
  api:"AKfycbw-n_isgCLvAEntGEX5Lpn4AUNaqpp3r1W0nVIGXFjNlEdsRB_ue4b9NRmNH_Em5IxT",

  // -------------------------------------------------------------
  // authServer専用設定情報
  // -------------------------------------------------------------
  func:{
    svFunc: {
      authority: 0,
      do: x => serverFunc(x)
    },
  }
};
/** authConfig: クライアント・サーバ共通設定情報
 * @class
 * @classdesc クライアント・サーバ共通設定情報
 * @prop {string} [systemName="auth"] - システム名
 * @prop {string} adminMail - 管理者のメールアドレス
 * @prop {string} adminName - 管理者氏名
 * @prop {number} [allowableTimeDifference=120000] - クライアント・サーバ間通信時の許容時差既定値は2分
 * @prop {string} [RSAbits=2048] - 鍵ペアの鍵長
 * @prop {number} [maxDepth=10] - 再帰呼出時の最大階層
 * @prop {Object} underDev - テスト時の設定
 * @prop {boolean} underDev.isTest=false - 開発モードならtrue
 */
class authConfig extends Schema {
  /**
   * @constructor
   * @param {authConfig} arg - 設定情報(既定値からの変更部分)
   */
  constructor(arg) {
    const v = {whois:`authConfig.constructor`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    // Schemaクラスの指定項目＋authClient/Server共用データ型定義
    v.schema = {
      name: arg.systemName ?? 'auth',
      version: '1.0.0',
      types: {
        /** authRequest: authClientからauthServerへの処理要求(平文)
         * @typedef {Object} authRequest
         * @prop {string} memberId=this.idb.memberId - メンバの識別子
         * @prop {string} deviceId=this.idb.deviceId - デバイスの識別子(UUIDv4)
         * @prop {string} memberName=this.idb.memberName - メンバの氏名。管理者が加入認否判断のため使用
         * @prop {string} CPkeySign=this.idb.CPkeySign - クライアント側署名用公開鍵
         * @prop {number} requestTime=Date.now() - 要求日時UNIX時刻
         * @prop {string} func - サーバ側関数名
         * @prop {any[]} arg=[] - サーバ側関数に渡す引数の配列
         * @prop {string} nonce=UUIDv4 - 要求の識別子UUIDv4
         */
        authRequest: {desc: 'クライアント→サーバ要求',
          cols: [
            {name:'memberId',type:'string',desc:'メンバの識別子'},
            {name:'deviceId',type:'string',desc:'デバイスの識別子(UUIDv4)'},
            {name:'memberName',type:'string',desc:'メンバの氏名',note:'管理者が加入認否判断のため使用'},
            {name:'CPkeySign',type:'string',desc:'クライアント側署名用公開鍵'},
            {name:'requestTime',type:'datetime',desc:'要求日時',default:'Date.now()'},
            {name:'func',type:'string',desc:'サーバ側関数名'},
            {name:'arg',type:'array',desc:'サーバ側関数に渡す引数の配列',default:'[]'},
            {name:'nonce',type:'string',desc:'要求の識別子'},
          ],
        },
        /** authResponse: authServerからauthClientへの処理結果(平文)
         * @typedef {Object} authResponse - authServerからauthClientへの処理結果(平文)
         * == authClient設定項目(authRequestからの転記項目)
         * @prop {string} memberId - メンバの識別子
         * @prop {string} deviceId - デバイスの識別子。UUIDv4
         * @prop {string} memberName - メンバの氏名
         * @prop {CryptoKey} CPkeySign=this.idb.CPkeySign - クライアント側署名用公開鍵
         * @prop {number} requestTime - 要求日時UNIX時刻
         * @prop {string} func - サーバ側関数名
         * @prop {any[]} arg - サーバ側関数に渡す引数の配列
         * @prop {string} nonce - 要求の識別子UUIDv4
         *
         * == authServer内での追加項目
         * @prop {string} SPkeySign=this.keys.SPkeySign - サーバ側署名用公開鍵
         * @prop {string} SPkeyEnc=this.keys.SPkeyEnc - サーバ側暗号化用公開鍵
         * @prop {any} response=null - サーバ側関数の戻り値
         * @prop {number} receptTime=Date.now() - サーバ側の処理要求受付日時
         * @prop {number} responseTime=0 - サーバ側処理終了日時
         *   エラーの場合は発生日時
         * @prop {string} status="success" - サーバ側処理結果
         *   正常終了時は"success"(文字列)、警告終了の場合はエラーメッセージ、
         *   致命的エラーの場合はErrorオブジェクト
         * @prop {string} message="" - メッセージ(statusの補足)
         *
         * == authClient設定項目(authServerからの返信を受け、authClient内で追加)
         * @prop {string} decrypt="success" - クライアント側での復号処理結果
         *   "success":正常、それ以外はエラーメッセージ
         */
        authResponse: {desc: 'サーバ→クライアント応答',
          cols: [
            {name:'memberId',type:'string'},
            {name:'deviceId',type:'string'},
            {name:'memberName',type:'string'},
            {name:'CPkeySign',type:'string'},
            {name:'requestTime',type:'datetime'},
            {name:'func',type:'string'},
            {name:'arg',type:'array'},
            {name:'nonce',type:'string'},
            {name:'SPkeySign',type:'string'},
            {name:'SPkeyEnc',type:'string'},
            {name:'response',type:'string',nullable:true,default:null},
            {name:'receptTime',type:'datetime',default:'Date.now()'},
            {name:'responseTime',type:'datetime',default:0 },
            {name:'status',type:'string',default:'success'},
            {name:'message',type:'string',default:''},
            {name:'decrypt',type:'string',default:'success'},
          ],
        },
        /** encryptedRequest: 暗号化された処理要求
         * @typedef {Object} encryptedRequest - 暗号化された処理要求
         * @prop {string} payload=null - 平文のauthRequest
         *   cipherと排他。SPkey要求時(meta.keyProvisioning===true)のみ設定
         * @prop {string} cipher=null - AES-256-GCMで暗号化されたauthRequest。payloadと排他
         * @prop {string} iv=null - AES-GCM 初期化ベクトル
         * @prop {string} signature - authRequestに対するRSA-PSS署名
         * @prop {string} encryptedKey=null - RSA-OAEPで暗号化されたAES共通鍵
         * @prop {Object} meta - メタ情報
         * @prop {boolean} meta.signOnly=false - 暗号化せず署名のみで送信する場合true
         * @prop {string} meta.sym=null - 使用した共通鍵方式"AES-256-GCM"
         * @prop {number} meta.rsabits - 暗号化に使用したRSA鍵長
         * @prop {boolean} meta.keyProvisioning=false - 鍵配布・鍵更新目的ならtrue
         *   「通常業務」ではなく、「鍵を配る／更新するための通信」であることの宣言。
         *   通常signOnlyと一致するが、運用時の利用目的が異なるため別項目とする。
         */
        encryptedRequest: {desc: '暗号化された要求',
          cols: [
            {name:'payload',type:'string',nullable:true },
            {name:'cipher',type:'string',nullable:true },
            {name:'iv',type:'string',nullable:true },
            {name:'signature',type:'string'},
            {name:'encryptedKey',type:'string',nullable:true },
            {name:'meta',type:'object'},
          ],
        },
        /** encryptedResponse: 暗号化された処理結果
         * @typedef {Object} encryptedResponse - 暗号化された処理結果
         * @prop {string} cipher - 暗号化した文字列
         * @prop {string} signature - authResponseに対するRSA-PSS署名
         * @prop {string} encryptedKey - RSA-OAEPで暗号化されたAES共通鍵
         * @prop {string} iv - AES-GCM 初期化ベクトル
         * @prop {string} tag - AES-GCM 認証タグ
         * @prop {Object} meta - メタ情報
         * @prop {number} meta.rsabits - 暗号化に使用したRSA鍵長
         */
        encryptedResponse: {desc: '暗号化された応答',
          cols: [
            {name:'cipher',type:'string'},
            {name:'signature',type:'string'},
            {name:'encryptedKey',type:'string'},
            {name:'iv',type:'string'},
            {name:'tag',type:'string'},
            {name:'meta',type:'object'},
          ],
        },
      }
    };
    // 必須指定項目の一覧
    v.required = ['adminMail','adminName'];
    // 任意指定項目と既定値
    v.option = {
      systemName: 'auth',
      allowableTimeDifference: 120000,
      RSAbits: 2048,
      maxDepth: 10,
      underDev: {isTest:false},
    }
    try {
      dev.step(1);  // スーパークラス(Schema)の生成
      super(mergeDeeply(v.schema,arg));

      dev.step(2);  // 必須項目の設定
      v.required.forEach(x => {
        if( typeof arg[x] === 'undefined' )
          throw new Error(`"${x}" is not specified.`);
        this[x] = arg[x];
      });

      dev.step(3);  // 任意項目の設定
      Object.keys(v.option).forEach(x => {
        this[x] = arg[x] ?? v.option[x];
      });
      if( typeof this.underDev.isTest === 'undefined' )
        this.underDev.isTest = v.option.underDev.isTest;

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }
}
/** authServer: サーバ側中核クラス
 * @class
 * @classdesc サーバ側中核クラス
 * @prop {authServerConfig} cf - authServer設定項目
 * @prop {cryptoServer} cryptoLib - 暗号化・署名検証
 */
class authServer {

  /**
   * @constructor
   * @param {authConfig} config - authClient/Server共通設定値オブジェクト
   */
  constructor(config={}) {
    const v = {whois:`authServer.constructor`, arg:{config}, rv:null};
    const dev = new devTools(v);
    // -------------------------------------------------------------
    // authServer専用設定値・データ型(Schema)定義
    //   ※authClient/Server共用はauthConfigクラスで定義
    // -------------------------------------------------------------
    // Schemaクラスの指定項目＋authClient専用データ型定義
    v.schema = {
      types: {
        /** authAuditLog: authServerの監査ログをシートに出力
         * @typedef {Object} authAuditLog - authServerの監査ログをシートに出力
         * @prop {number} timestamp=Date.now() - 要求日時ISO8601拡張形式の文字列
         * @prop {number} duration - 処理時間ミリ秒単位
         * @prop {string} memberId - メンバの識別子メールアドレス
         * @prop {string} [deviceId] - デバイスの識別子
         * @prop {string} func - サーバ側関数名
         * @prop {string} result=success - サーバ側処理結果
         * @prop {string} note - 備考
         */
        authAuditLog: {desc: 'authServerの監査ログ',
          cols: [
            {name:'timestamp',type:'datetime',desc:'要求日時',default:'Date.now()',note:'ISO8601拡張形式'},
            {name:'duration',type:'number',desc:'処理時間(ms)'},
            {name:'memberId',type:'string',desc:'メンバ識別子(メール)'},
            {name:'deviceId',type:'string',desc:'デバイス識別子(UUIDv4)',nullable:true },
            {name:'func',type:'string',desc:'サーバ関数名'},
            {name:'result',type:'string',desc:'処理結果',default:'success'},
            {name:'note',type:'string',desc:'備考',nullable:true },
          ],
        },
        /** authErrorLog: authServerのエラーログをシートに出力
         * @typedef {Object} authErrorLog - authServerのエラーログをシートに出力
         * @prop {string} timestamp=Date.now() - 要求日時ISO8601拡張形式の文字列
         * @prop {string} memberId - メンバの識別子
         * @prop {string} deviceId - デバイスの識別子
         * @prop {string} result=fatal - サーバ側処理結果fatal/warning/normal
         * @prop {string} [message] - サーバ側からのエラーメッセージnormal時はundefined
         * @prop {string} [stack] - エラー発生時のスタックトレース本項目は管理者への通知メール等、シート以外には出力不可
         */
        authErrorLog: {desc: 'authServerのエラーログ',
          cols: [
            {name:'timestamp',type:'datetime',default:'Date.now()'},
            {name:'memberId',type:'string'},
            {name:'deviceId',type:'string'},
            {name:'result',type:'string',default:'fatal',note:'fatal/warning/normal'},
            {name:'message',type:'string',nullable:true },
            {name:'stack',type:'string',nullable:true,note:'管理者通知専用'},
          ],
        },
        /** authRequestLog: 重複チェック用のリクエスト履歴
         * @typedef {Object[]} authRequestLog - 重複チェック用のリクエスト履歴
         * @prop {number} timestamp=Date.now() - リクエストを受けたサーバ側日時
         * @prop {string} nonce - クライアント側で採番されたリクエスト識別子UUIDv4
         */
        authRequestLog: {desc: '重複チェック用リクエスト履歴',
          cols: [
            {name:'timestamp',type:'datetime',default:'Date.now()'},
            {name:'nonce',type:'string'},
          ],
        },
        /** authScriptProperties: サーバ側ScriptPropertiesに保存する情報
         * @typedef {Object} authScriptProperties - サーバ側ScriptPropertiesに保存する内容
         * @prop {number} keyGeneratedDateTime - 鍵ペア生成日時。UNIX時刻
         * @prop {string} SSkeySign - 署名用秘密鍵(PEM形式)
         * @prop {string} SPkeySign - 署名用公開鍵(PEM形式)
         * @prop {string} SSkeyEnc - 暗号化用秘密鍵(PEM形式)
         * @prop {string} SPkeyEnc - 暗号化用公開鍵(PEM形式)
         * @prop {string} oldSSkeySign - バックアップ用署名用秘密鍵(PEM形式)
         * @prop {string} oldSPkeySign - バックアップ用署名用公開鍵(PEM形式)
         * @prop {string} oldSSkeyEnc - バックアップ用暗号化用秘密鍵(PEM形式)
         * @prop {string} oldSPkeyEnc - バックアップ用暗号化用公開鍵(PEM形式)
         * @prop {string} requestLog - 重複チェック用のリクエスト履歴。{authRequestLog[]}のJSON
         */
        /** authServerFuncDef: サーバ側関数設定オブジェクト
         * @typedef {Object.<string,Function|Arror>} authServerFuncDef - サーバ側関数設定
         * @prop {number} func.authority=0 - サーバ側関数の所要権限
         *   サーバ側関数毎に設定される当該関数実行のために必要となるユーザ権限
         *   ex. authServerConfig.func.authority === 0
         * @prop {Function} func.do - 実行するサーバ側関数
         *
         * @example サーバ側関数マップ(func)の設定例
         *
         * - サーバ側関数(例)
         *   - commonFunc() : 誰でも実行可能なサーバ側処理(掲示板情報の提供など)。必要な権限は'0'(=0b00)
         *   - staffFunc() : 係員のみ実行可能なサーバ関数(受付処理など)。必要な権限は'2'(=0b10)
         * - 設定
         *   ```js
         *   func = {
         *     "commonFunc": {
         *         "authority": 0,
         *         "do": m => commonFunc(...m) // 引数mにはauthRequest.argを渡す
         *     },
         *     "staffFunc": {
         *         "authority": 2,
         *         "do": m => staffFunc(...m)
         *     },
         *   }
         *   ```
         * - 備考
         *   - 上の例ではauthRequest.funcとサーバ側実関数名は一致させているが、
         *     隠蔽等を目的で異なる形にしても問題ない。<br>
         *     例：`cmFunc:{authority:0,do:m=>commonFunc(...m)}`
         */
        /** Member: メンバ情報をGoogle Spread上で管理
         * @class
         * @classdesc メンバ情報をGoogle Spread上で管理
         * @prop {string} memberId="dummyMemberID" - メンバの識別子(メールアドレス)
         * @prop {string} name="dummyMemberName" - メンバの氏名
         * @prop {string} status="TR" - メンバの状態
         *   仮登録 : TR(temporary registrated)
         *   未審査 : NE(not examined)
         *   加入中 : CJ(currentry joining)
         *   加入禁止 : PJ(prohibited to join)
         * @prop {MemberLog} log=new MemberLog() - メンバの履歴情報。シート上はJSON
         * @prop {MemberProfile} profile=new MemberProfile() - メンバの属性情報。シート上はJSON
         * @prop {Object.<string,MemberDevice>} device - デバイス情報。{deviceId:MemberDevice}形式
         *   マルチデバイス対応のため配列。シート上はJSON
         * @prop {string} note='' - 当該メンバに対する備考
         */
        Member: {desc: 'メンバ情報',
          cols: [
            {name:'memberId',type:'string'},
            {name:'name',type:'string'},
            {name:'status',type:'string',default:'TR'},
            {name:'log',type:'object'},
            {name:'profile',type:'object'},
            {name:'device',type:'object'},
            {name:'note',type:'string',default:''},
          ],
        },
        /** MemberDevice: メンバが使用する通信機器の情報
         * @typedef {Object} MemberDevice - メンバが使用する通信機器の情報
         * @prop {string} deviceId=UUIDv4 - デバイスの識別子
         * @prop {string} status="UC" - デバイスの状態
         *   未認証 : UC(uncertified)
         *   認証中 : LI(log in)
         *   試行中 : TR(tring)
         *   凍結中 : FR(freezed)
         * @prop {string} CPkeySign - デバイスの署名用公開鍵
         * @prop {string} CPkeyEnc - デバイスの暗号化用公開鍵
         * @prop {number} CPkeyUpdated=Date.now() - 最新のCPkeyが登録された日時
         * @prop {MemberTrial[]} trial=[] - ログイン試行関連情報。オブジェクトシート上はJSON文字列
         */
        MemberDevice: {desc: 'メンバ端末',
          cols: [
            {name:'deviceId',type:'string'},
            {name:'status',type:'string',default:'UC'},
            {name:'CPkeySign',type:'string'},
            {name:'CPkeyEnc',type:'string'},
            {name:'CPkeyUpdated',type:'datetime',default:'Date.now()'},
            {name:'trial',type:'array',default:'[]'},
          ],
        },
        /** MemberLog: メンバの各種要求・状態変化の時刻
         * @typedef {Object} MemberLog - メンバの各種要求・状態変化の時刻
         * @prop {number} joiningRequest=Date.now() - 仮登録要求日時仮登録要求をサーバ側で受信した日時
         * @prop {number} approval=0 - 加入承認日時
         *   管理者がmemberList上で加入承認処理を行った日時。値設定は加入否認日時と択一
         * @prop {number} denial=0 - 加入否認日時
         *   管理者がmemberList上で加入否認処理を行った日時。値設定は加入承認日時と択一
         * @prop {number} loginRequest=0 - 認証要求日時
         *   未認証メンバからの処理要求をサーバ側で受信した日時
         * @prop {number} loginSuccess=0 - 認証成功日時
         *   未認証メンバの認証要求が成功した最新日時
         * @prop {number} loginExpiration=0 - 認証有効期限
         *   認証成功日時＋認証有効時間
         * @prop {number} loginFailure=0 - 認証失敗日時
         *   未認証メンバの認証要求失敗が確定した最新日時
         * @prop {number} unfreezeLogin=0 - 認証無効期限
         *   認証失敗日時＋認証凍結時間
         * @prop {number} joiningExpiration=0 - 加入有効期限
         *   加入承認日時＋加入有効期間
         * @prop {number} unfreezeDenial=0 - 加入禁止期限
         *   加入否認日時＋加入禁止期間
         */
        MemberLog: {desc: 'メンバ履歴',
          cols: [
            {name:'joiningRequest',type:'datetime',default:'Date.now()'},
            {name:'approval',type:'datetime',default:0 },
            {name:'denial',type:'datetime',default:0 },
            {name:'loginRequest',type:'datetime',default:0 },
            {name:'loginSuccess',type:'datetime',default:0 },
            {name:'loginExpiration',type:'datetime',default:0 },
            {name:'loginFailure',type:'datetime',default:0 },
            {name:'unfreezeLogin',type:'datetime',default:0 },
            {name:'joiningExpiration',type:'datetime',default:0 },
            {name:'unfreezeDenial',type:'datetime',default:0 },
          ],
        },
        /** MemberProfile: メンバの属性情報
         * @typedef {Object} MemberProfile - メンバの属性情報
         * @prop {number} authority - メンバの持つ権限
         *   authServerConfig.func.authorityとの論理積>0なら当該関数実行権限ありと看做す
         */
        MemberProfile: {desc: 'メンバ属性',
          cols: [
            {name:'authority',type:'number'},
          ],
        },
        /** MemberTrial: ログイン試行情報の管理・判定
         * @typedef {Object} MemberTrial - ログイン試行情報の管理・判定
         * @prop {string} passcode - 設定されているパスコード最初の認証試行で作成
         *   初期値はauthServerConfig.passcodeLengthで指定された桁数の数値
         * @prop {number} created=Date.now() - パスコード生成日時≒パスコード通知メール発信日時
         * @prop {MemberTrialLog[]} log=[] - 試行履歴常に最新が先頭(unshift()使用)
         *   保持上限はauthServerConfig.trial.generationMaxに従い、上限超過時は末尾から削除する。
         */
        MemberTrial: {desc: 'ログイン試行',
          cols: [
            {name:'passcode',type:'string'},
            {name:'created',type:'datetime',default:'Date.now()'},
            {name:'log',type:'array',default:'[]'},
          ],
        },
        /** MemberTrialLog: パスコード入力単位の試行記録
         * @typedef {Object} MemberTrialLog - パスコード入力単位の試行記録
         * @prop {number} entered - 入力されたパスコード
         * @prop {boolean} result - 試行結果正答：true、誤答：false
         * @prop {number} timestamp=Date.now() - 判定処理日時
         */
        MemberTrialLog: {desc: '試行履歴',
          cols: [
            {name:'entered',type:'string'},
            {name:'result',type:'boolean'},
            {name:'timestamp',type:'datetime',default:'Date.now()'},
          ],
        },
      }
    };
    // 必須指定項目の一覧
    v.required = ['func'];
    // 任意指定項目と既定値
    v.option = {
      memberList: 'memberList',
      defaultAuthority: 1,
      memberLifeTime: 31536000000,
      prohibitedToJoin: 259200000,
      loginLifeTime: 86400000,
      loginFreeze: 600000,
      requestIdRetention: 300000,
      errorLog: "errorLog",
      storageDaysOfErrorLog: 604800000,
      auditLog: "auditLog",
      storageDaysOfAuditLog: 604800000,
      func: config.func,
      passcodeLength: 6,
      maxTrial: 3,
      passcodeLifeTime: 600000,
      maxTrialLog: 5,
      udSendPasscode: false,
      udSendInvitation: false,
    }
    try {

      /** this.cf(authServerConfig): 共通設定情報にauthServer特有項目を追加
       * @typedef {Object} authServerConfig - authServer特有の設定項目
       * @extends {authConfig}
       * @prop {string} memberList="memberList" - memberListシート名
       * @prop {number} defaultAuthority=1 - 新規加入メンバの権限の既定値
       * @prop {number} memberLifeTime=31536000000 - 加入有効期間
       *   メンバ加入承認後の有効期間。既定値は1年
       * @prop {number} prohibitedToJoin=259200000 - 加入禁止期間
       *   管理者による加入否認後、再加入申請が自動的に却下される期間。既定値は3日
       * @prop {number} loginLifeTime=86400000 - 認証有効時間
       *   ログイン成功後の有効期間、CPkeyの有効期間。既定値は1日
       * @prop {number} loginFreeze=600000 - 認証凍結時間
       *   認証失敗後、再認証要求が禁止される期間。既定値は10分
       * @prop {number} requestIdRetention=300000 - 重複リクエスト拒否となる時間。既定値は5分
       * @prop {string} errorLog="errorLog" - エラーログのシート名
       * @prop {number} storageDaysOfErrorLog=604800000 - エラーログの保存日数
       *   単位はミリ秒。既定値は7日分
       * @prop {string} auditLog="auditLog" - 監査ログのシート名
       * @prop {number} storageDaysOfAuditLog=604800000 - 監査ログの保存日数
       *   単位はミリ秒。既定値は7日分
       *
       * @prop {authServerFuncDef} func={} - サーバ側関数設定
       *
       * ログイン試行関係の設定値
       * @prop {number} passcodeLength=6 - パスコードの桁数
       * @prop {number} maxTrial=3 - パスコード入力の最大試行回数
       * @prop {number} passcodeLifeTime=600000 - パスコードの有効期間。既定値は10分
       * @prop {number} maxTrialLog=5 - ログイン試行履歴(MemberTrial)の最大保持数。既定値は5世代
       *
       * 開発関係の設定値
       * @prop {boolean} udSendPasscode=false - 開発中識別フラグパスコード通知メール送信を抑止するならtrue
       * @prop {boolean} udSendInvitation=false - 開発中の加入承認通知メール送信
       *   開発中に加入承認通知メール送信を抑止するならtrue
       * @prop {schemaDef} typeDef - データ型定義
       */
      dev.step(1.1);  // this.cfの作成
      this.cf = new authConfig(mergeDeeply(v.schema,config));

      dev.step(1.2);  // 必須項目の設定
      v.required.forEach(x => {
        if( typeof config[x] === 'undefined' )
          throw new Error(`"${x}" is not specified.`);
        this.cf[x] = config[x];
      });

      dev.step(1.3);  // 任意項目の設定
      Object.keys(v.option).forEach(x => {
        this.cf[x] = config[x] ?? v.option[x];
      });

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  /** authLogger: 監査ログ／エラーログを自動振り分けで出力
   * - 監査ログ：authAuditLog型
   * - エラーログ：authErrorLog型
   * @param {authResponse} response
   * @returns {authResponse}
   */
  authLogger(response) {
    const v = { whois: `${this.constructor.name}.authLogger`, arg: { response }, rv: null };
    const dev = new devTools(v);
    try {

      // -------------------------------------------------------------
      dev.step(1); // ログ種別判定（normal / warning / fatal）
      // -------------------------------------------------------------
      let level = 'normal';
      if (response.status instanceof Error) {
        level = 'fatal';
      } else if (typeof response.status === 'string' && response.status !== 'success') {
        level = 'warning';
      }

      // -------------------------------------------------------------
      dev.step(2); // 出力先シート名決定
      // -------------------------------------------------------------
      const sheetName =
        level === 'fatal'
          ? this.cf.errorLog
          : this.cf.auditLog;

      const retentionMs =
        level === 'fatal'
          ? this.cf.storageDaysOfErrorLog
          : this.cf.storageDaysOfAuditLog;

      const ss = SpreadsheetApp.getActive();
      let sheet = ss.getSheetByName(sheetName);

      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        sheet.appendRow(
          level === 'fatal'
            ? ['timestamp', 'memberId', 'deviceId', 'result', 'message', 'stack']
            : ['timestamp', 'duration', 'memberId', 'deviceId', 'func', 'result', 'note']
        );
      }

      // -------------------------------------------------------------
      dev.step(3); // ローテーション（保存期限超過行の削除）
      // -------------------------------------------------------------
      if (retentionMs) {
        const now = Date.now();
        const lastRow = sheet.getLastRow();
        if (lastRow > 1) {
          const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
          for (let i = values.length - 1; i >= 0; i--) {
            const t = new Date(values[i][0]).getTime();
            if (!isNaN(t) && now - t > retentionMs) {
              sheet.deleteRow(i + 2);
            }
          }
        }
      }

      // -------------------------------------------------------------
      dev.step(4); // duration / timestamp 算出
      // -------------------------------------------------------------
      response.responseTime = Date.now();
      const duration = response.responseTime - response.receptTime;
      const timestamp = new Date(response.receptTime).toISOString();

      // -------------------------------------------------------------
      dev.step(5); // ログ出力
      // -------------------------------------------------------------
      if (level === 'fatal') {
        sheet.appendRow([
          timestamp,
          response.memberId,
          response.deviceId,
          'fatal',
          response.message,
          response.status?.stack,
        ]);

        // 管理者通知フック（必要なら）
        // MailApp.sendEmail(this.cf.adminMail, 'auth fatal error', response.message);

      } else {
        sheet.appendRow([
          timestamp,
          duration,
          response.memberId,
          response.deviceId,
          response.func,
          level,
          response.message || '',
        ]);
      }

      dev.end();
      return response;

    } catch (e) {
      return dev.error(e);
    }
  }

  /** authResponse: authResponse型のオブジェクトを作成
   * @param {authRequest} request - 処理要求オブジェクト
   * @returns {authResponse}
   */
  authResponse(request){
    return {
      memberId: request.memberId,
      deviceId: request.deviceId,
      memberName: request.memberName,
      CPkeySign: request.CPkeySign,
      requestTime: request.requestTime,
      func: request.func,
      arg: request.arg,
      nonce: request.nonce,

      SPkeySign: this.keys.SPkeySign,
      response: null,
      receptTime: Date.now(),
      responseTime: 0,
      status: 'success',
      message: '',
      // メンバ"decrypt"はクライアント側で付加
    }
  }

  /** dumpProperties: ScriptPropertiesの登録状況をコンソールに表示 (開発用)
   * @returns {null|Error}
   */
  static dumpProperties() {
    const v = { whois: `${this.constructor.name}.dumpProperties`, arg: {}, rv: null };
    const dev = new devTools(v); // 開発支援ツールを使用 [1]
    try {
      dev.step(1); // ScriptPropertiesの全取得 [2], [3]
      v.props = PropertiesService.getScriptProperties().getProperties();
      v.dumpData = ["=== Current ScriptProperties"];

      dev.step(2); // データの整形
      Object.keys(v.props).sort().forEach(key => {
        v.val = v.props[key];
        // RSA鍵ペア（SSkeySign, SPkeySign等）は最初の30文字にカット [4]
        if (typeof v.val === 'string' && (key.includes('keySign') || key.includes('keyEnc'))) {
          v.val = v.val.substring(0, 50) + "...";
        }
        v.dumpData.push(`${key}: "${v.val}"`);
      });

      dev.step(3); // 整形後のデータをダンプ出力 [5]
      console.log(v.dumpData.join('\n'));

      dev.end();
      return null;
    } catch (e) {
      return dev.error(e); // エラー発生時の共通ハンドリング [6]
    }
  }

  /** initialize: authServerインスタンス作成
   * - インスタンス作成時に必要な非同期処理をconstructorの代わりに実行
   * - staticではない一般のメンバへの値セットができないため別途constructorを呼び出す
   * @static
   * @param {authConfig} config - authClient/Server共通設定値オブジェクト
   * @returns {authServer|Error}
   */
  static async initialize(config) {
    const v = {whois:`authServer.initialize`, arg:{config}, rv:null};
    const dev = new devTools(v);
    try {

      // -------------------------------------------------------------
      dev.step(1);  // インスタンス生成
      // オプション既定値を先にメンバ変数に格納するため、constructorを先行
      // -------------------------------------------------------------
      v.rv = new authServer(config);

      // -------------------------------------------------------------
      dev.step(2);  // 暗号化・復号モジュール生成(v.rv.cryptoLib)
      // -------------------------------------------------------------
      v.rv.cryptoLib = await cryptoServer.initialize(v.rv.cf);
      if( v.rv.cryptoLib instanceof Error ) throw v.rv.cryptoLib;

      // -------------------------------------------------------------
      dev.step(3);  // memberListシートの準備(v.rv.member)
      // -------------------------------------------------------------
      v.rv.member = new Member(v.rv.cf);

      // -------------------------------------------------------------
      dev.step(4);  // 監査ログ・エラーログシートの準備(v.rv.audit, v.rv.error)
      // -------------------------------------------------------------
      //v.rv.audit = v.rv.authAuditLog();
      //v.rv.error = v.rv.authErrorLog();

      dev.end({IndexedDB:v.rv.idb}); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** exec: 処理要求に対するサーバ側中核処理
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  async exec(arg) {
    const v = {whois:`${this.constructor.name}.exec`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1.1,arg);  // request存在・最低限チェック
      if( !arg ) throw new Error('invalid request: empty body');
      dev.step(1.2,JSON.parse(arg));  // 処理要求を復号
      v.request = await this.cryptoLib.decrypt(JSON.parse(arg), this.cf.CPkeySign);
      if( v.request instanceof Error ) throw v.request;
      dev.step(1.3,v.request);  // // request.func チェック
      if (!v.request || !v.request.func)
        throw new Error('invalid request: func missing');

      if( v.request.func === '::initial::' ){
        dev.step(2);  // 初回HTMLロード時(SPkey取得要求)の場合
        // ⇒ Member.setMember: 指定メンバ情報をmemberListシートに保存。戻り値はauthResponse型
        v.response = this.member.setMember(v.request);
        if( v.response instanceof Error ) throw v.response;
      } else {
        if( /^::[A-Za-z0-9_]+::$/.test(v.request.func) ){
          dev.step(3);  // 内発処理の要求
          // ⇒ 要求の種類毎に分岐。戻り値はauthResponse型に統一
        } else {
          dev.step(4);  // 一般的処理要求(非内発処理)

          // 該当のメンバ情報を取得
          // メンバ・デバイスの状態・権限確認
          // if 状態・権限OK
            // サーバ側関数を実行、結果をauthResponseに組み込み
          // else 状態・権限NG
            // 状態・権限によりv.responseに値設定
        }
      }

      dev.step(5);  // 処理結果を監査／エラーログに出力
      this.authLogger(v.response);

      dev.step(6);  // encryptedResponseの作成
      v.rv = await this.cryptoLib.encrypt(v.response, v.response.CPkeySign);
      if( v.rv instanceof Error ) throw v.rv;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** resetSPkey: 緊急時、サーバ側鍵ペアを更新
   * - 管理者が Spread メニューから手動実行する
   * @param {void}
   * @returns {null}
   */
  static async resetSPkey() {
    const v = {whois:`${this.constructor.name}.resetSPkey`, arg: {}, rv: null };
    const dev = new devTools(v);
    try {

      dev.step(1); // インスタンスを生成（configはグローバルから参照）
      v.asv = await authServer.initialize(config);
      if (v.asv instanceof Error) throw asv;

      dev.step(2); // cryptoServerに生成と保存を委譲
      v.result = await v.asv.cryptoLib.generateAndSave();
      if (v.result instanceof Error) throw v.result;

      dev.step(3,`[resetSPkey] 鍵の更新が完了しました。\n生成日時: ${
        toLocale(new Date(v.result.keyGeneratedDateTime))}`); // 保存結果の確認ログ

      dev.end();
      return null;

    } catch (e) { return dev.error(e); }
  }

  /** setupEnvironment: 初回実行時に必要なOAuth権限を一括取得
   * - 管理者が Spread メニューから手動実行する
   * @param {Object} config - adminMail設定を含むオブジェクト
   * @returns {null}
   */
  static setupEnvironment(config) {
    const v = {whois:`${this.constructor.name}.setupEnvironment`, arg: {config}, rv: null };
    const dev = new devTools(v);
    try {

      // -------------------------------------------------------------
      dev.step(1); // Spreadsheet 権限
      // -------------------------------------------------------------
      const ss = SpreadsheetApp.getActive();
      const sheet = ss.getActiveSheet();
      sheet.getActiveCell().getValue();

      // -------------------------------------------------------------
      dev.step(2); // PropertiesService 権限
      // -------------------------------------------------------------
      const prop = PropertiesService.getScriptProperties();
      prop.getProperty('dummy');
      prop.setProperty('dummy', Date.now());

      // -------------------------------------------------------------
      dev.step(3); // Utilities / UUID
      // -------------------------------------------------------------
      Utilities.getUuid();

      // -------------------------------------------------------------
      dev.step(4); // Mail 権限（空メール or テスト通知）
      // -------------------------------------------------------------
      if (config.adminMail) {
        MailApp.sendEmail({
          to: config.adminMail,
          subject: '[authServer] OAuth test',
          body: 'OAuth authorization test: ' + new Date().toISOString(),
          noReply: true
        });
      }

      // -------------------------------------------------------------
      dev.step(5); // LockService（将来用）
      // -------------------------------------------------------------
      LockService.getScriptLock().tryLock(1);

      dev.end();
      return null;

    } catch (e) { return dev.error(e); }
  }
}
/** cryptoServer: サーバ側の暗号化・署名検証
 * @class
 * @classdesc サーバ側の暗号化・署名検証
 * @prop {authServerConfig} cf - authServer設定情報
 * @prop {ScriptProperties} prop - PropertiesService.getScriptProperties()
 * @prop {authScriptProperties} keys - ScriptPropertiesに保存された鍵ペア情報
 * @prop {string[]} keyList - ScriptPropertiesに保存された項目名の一覧
 */
class cryptoServer {
  /** constructor
   * @param {authServerConfig} cf - authServer設定値
   */
  constructor(cf) {
    const v = {whois:`cryptoServer.constructor`, arg:{cf}, rv:null};
    const dev = new devTools(v);
    try {
      dev.step(1); // authServer設定情報をメンバに格納
      this.cf = cf;
      dev.step(2); // ScriptPropertiesの内容を読み込み
      this.keys = {};
      this.keyList = [ // ScriptProperties保存項目の内、通常使用する項目のリスト
        'keyGeneratedDateTime',
        'SSkeySign',
        'SPkeySign',
        'SSkeyEnc',
        'SPkeyEnc',
        'requestLog',
      ];
      this.prop = PropertiesService.getScriptProperties();
      this.keyList.forEach(key => {
        this.keys[key] = this.prop.getProperty(key) || null;
      });

      dev.end();  // 終了処理
    } catch (e) { return dev.error(e); }
  }

  /** encrypt: 処理結果を暗号化＋署名
   * @param {authResponse} response - 処理結果
   * @param {string} CPkeySign - クライアント側署名用公開鍵
   * @returns {encryptedResponse}
   */
  async encrypt(response, CPkeySign) {
    const v = {whois:`${this.constructor.name}.encrypt`, arg:{response,CPkeySign}, rv:null};
    const dev = new devTools(v);
    try {

      const payloadStr = JSON.stringify(response);

      dev.step(1); // RSA-PSS署名 (サーバ秘密鍵を使用)
      const sig = new KJUR.crypto.Signature({
        "alg": "SHA256withRSAandPSS",
        "sSaltLength": 32
      });
      sig.init(this.keys.SSkeySign);
      sig.updateString(payloadStr);
      const signature = sig.sign(); // Hex形式

      dev.step(2); // AES共通鍵生成と暗号化 (CryptoJSを使用)
      const aesKey = Array.from(
        Array(32),
        () => Math.floor(Math.random() * 16).toString(16)
      ).join(''); // 256bit相当
      const iv = CryptoJS.lib.WordArray.random(128/8);
      const encryptedPayload = CryptoJS.AES.encrypt(
        payloadStr,
        aesKey,
        { iv: iv }
      );

      dev.step(3); // AES鍵をRSA-OAEPで暗号化 (クライアント公開鍵を使用)
      const pubKeyObj = KEYUTIL.getKey(CPkeySign);
      const encryptedKey = KJUR.crypto.Cipher.encrypt(aesKey, pubKeyObj, "RSAOAEP");

      dev.step(4); // 戻り値作成
      v.rv = {
        cipher: encryptedPayload.toString(),
        encryptedKey: encryptedKey,
        iv: iv.toString(),
        signature: signature,
        meta: {
          rsabits: this.cf.RSAbits,
          sym: "AES-256-CBC" // CryptoJS標準に合わせCBCを使用
        }
      };
      dev.end();
      return v.rv;
    } catch (e) { return dev.error(e); }
  }

  /** decrypt: 暗号化された処理要求を復号・署名検証
   * @param {encryptedRequest} request - 暗号化されたサーバ側処理結果
   * @param {string} CPkeySign - クライアント側署名用公開鍵
   * @returns {authRequest}
   */
  async decrypt(request, CPkeySign) {
    const v = {whois:`${this.constructor.name}.decrypt`, arg:{request,CPkeySign}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1); // RSA-OAEPでAES鍵を復号 (サーバ秘密鍵を使用)
      const prvKeyObj = KEYUTIL.getKey(this.keys.SSkeyEnc);
      const aesKey = KJUR.crypto.Cipher.decrypt(request.encryptedKey, prvKeyObj, "RSAOAEP");

      dev.step(2); // AES-CBCでペイロードを復号
      const decrypted = CryptoJS.AES.decrypt(request.cipher, aesKey, { iv: CryptoJS.enc.Hex.parse(request.iv) });
      const plainStr = decrypted.toString(CryptoJS.enc.Utf8);

      dev.step(3); // RSA-PSS署名検証 (クライアント公開鍵を使用)
      const sig = new KJUR.crypto.Signature({"alg": "SHA256withRSAandPSS", "sSaltLength": 32});
      sig.init(CPkeySign);
      sig.updateString(plainStr);
      const isValid = sig.verify(request.signature);

      if (!isValid) throw new Error("Signature verification failed");
      v.rv = JSON.parse(plainStr);

      /*
      if (request.meta.signOnly === true) {
        // ===== signOnly 判定 =====
        dev.step(1.1); // payload復元
        const payloadBytes = Uint8Array.from(atob(request.payload), c => c.charCodeAt(0));

        dev.step(1.2); // signature復元
        const signature = Uint8Array.from(atob(request.signature), c => c.charCodeAt(0));

        dev.step(1.3); // 署名検証
        const ok = await globalThis.crypto.subtle.verify(
          { name: "RSA-PSS", saltLength: 32 },
          CPkeySign,
          signature,
          payloadBytes
        );
        if (!ok) throw new Error("Signature verification failed (signOnly)");

        dev.step(1.4); // JSON復元
        v.rv = JSON.parse(new TextDecoder().decode(payloadBytes));
      } else {
        // ===== 通常（暗号化＋署名） =====
        dev.step(2.1); // Base64復元
        const cipher = Uint8Array.from(atob(request.cipher), c => c.charCodeAt(0));
        const encryptedKey = Uint8Array.from(atob(request.encryptedKey), c => c.charCodeAt(0));
        const iv = Uint8Array.from(atob(request.iv), c => c.charCodeAt(0));
        const signature = Uint8Array.from(atob(request.signature), c => c.charCodeAt(0));

        dev.step(2.2); // サーバ秘密鍵（復号用）import
        const SSkeyEnc = await globalThis.crypto.subtle.importKey(
          "pkcs8",
          this.pemToArrayBuffer(this.keys.SSkeyEnc),
          { name: "RSA-OAEP", hash: "SHA-256" },
          false,
          ["decrypt"]
        );

        dev.step(2.3); // AES鍵復号
        const rawKey = await globalThis.crypto.subtle.decrypt({ name: "RSA-OAEP" }, SSkeyEnc, encryptedKey);
        const aesKey = await globalThis.crypto.subtle.importKey("raw", rawKey, { name: "AES-GCM" }, false, ["decrypt"]);

        dev.step(2.4); // payload復号
        const plain = await globalThis.crypto.subtle.decrypt({ name: "AES-GCM", iv }, aesKey, cipher);

        dev.step(2.5); // クライアント署名用公開鍵 import
        const CPkey = await globalThis.crypto.subtle.importKey(
          "spki",
          this.pemToArrayBuffer(CPkeySign),
          { name: "RSA-PSS", hash: "SHA-256" },
          false,
          ["verify"]
        );

        dev.step(2.6); // 署名検証
        const ok = await globalThis.crypto.subtle.verify({ name: "RSA-PSS", saltLength: 32 }, CPkey, signature, plain);

        if (!ok) throw new Error("Signature verification failed");

        dev.step(2.7); // JSON復元
        v.rv = JSON.parse(new TextDecoder().decode(plain));
      }
      */
      dev.end();
      return v.rv;
    } catch (e) { return dev.error(e); }
  }

  /** generateKeys: PEM形式のRSA鍵ペアを生成
   * - 生成のみ、ScriptPropertiesやメンバ変数への格納は行わない
   * @param {void}
   * @returns {Object} 生成された鍵ペア
   */
  async generateKeys() {
    const v = {whois:`${this.constructor.name}.generateKeys`, arg:{}, rv:null};
    const dev = new devTools(v);
    try {

      dev.step(1); // jsrsasign (KEYUTIL) を使用した鍵生成
      const keypair = KEYUTIL.generateKeypair("RSA", this.cf.RSAbits);

      v.rv = {
        SSkeySign: KEYUTIL.getPEM(keypair.prvKeyObj, "PKCS8PRV"),
        SPkeySign: KEYUTIL.getPEM(keypair.pubKeyObj),
        SSkeyEnc: KEYUTIL.getPEM(keypair.prvKeyObj, "PKCS8PRV"),
        SPkeyEnc: KEYUTIL.getPEM(keypair.pubKeyObj),
        keyGeneratedDateTime: Date.now()
      };

      dev.end();
      return v.rv;
    } catch (e) { return dev.error(e); }
  }

  /** generateAndSave: 鍵を生成し、直ちにScriptPropertiesに保存する
   * @returns {Object|Error} 生成・保存された鍵情報
   */
  async generateAndSave() {
    const v = {whois:`${this.constructor.name}.generateAndSave`, arg:{}, rv:null};
    const dev = new devTools(v);
    try {
      dev.step(1); // 鍵生成 (jsrsasignを使用)
      v.keys = await this.generateKeys();
      if (v.keys instanceof Error) throw v.keys;

      dev.step(2); // requestLogの初期化
      v.keys.requestLog = JSON.stringify([]);

      dev.step(3); // 保存処理
      this.keyList.forEach(key => {
        if (v.keys[key] !== undefined) {
          this.prop.setProperty(key, v.keys[key]);
          this.keys[key] = v.keys[key]; // インスタンス変数も更新
        }
      });

      dev.end();
      return v.keys;
    } catch (e) { return dev.error(e); }
  }


  /** initialize: cryptoServerインスタンス作成
   * - インスタンス作成時に必要な非同期処理をconstructorの代わりに実行
   * - staticではない一般のメンバへの値セットができないため別途constructorを呼び出す
   * @static
   * @param {authServerConfig} cf - authServer設定値
   * @returns {cryptoServer|Error}
   */
  static async initialize(config) {
    const v = {whois:`cryptoServer.initialize`, arg:{config}, rv:null};
    const dev = new devTools(v);
    try {
      dev.step(1);  // インスタンス生成
      // オプション既定値を先にメンバ変数に格納するため、constructorを先行
      v.rv = new cryptoServer(config);

      dev.step(2); // SPkeySign未生成なら鍵ペアを生成
      if( v.rv.keys.SPkeySign === null ){
        dev.step(2.1);  // 鍵ペアを生成
        v.keys = await v.rv.generateKeys();
        if( v.keys instanceof Error ) throw v.keys;

        dev.step(2.2);  // requestLogは初期値(空配列)とする
        v.keys.requestLog = JSON.stringify([]);

        dev.step(2.3);  // ScriptPropertiesに保存
        v.rv.keyList.forEach(key => {
          v.rv.prop.setProperty(key, v.keys[key]);
        });

        dev.step(2.4);  // 保存結果の確認
        v.savedResult = {
          keyGeneratedDateTime: prop.getProperty('keyGeneratedDateTime'),
          SPkeySign: prop.getProperty('SPkeySign')
            ? prop.getProperty('SPkeySign').substring(0, 50) + "..."
            : "FAILED"
        };
        if (!v.savedResult.SPkeySign || v.savedResult.SPkeySign === "FAILED") {
          throw new Error("鍵ペアの保存に失敗しました。");
        } else {
          dev.step(2.5,v.savedResult);
        }
      }

      dev.end(); // 終了処理
      return v.rv;
    } catch (e) { return dev.error(e); }
  }
}
class Member {

  /** constructor: 該当メンバのMemberインスタンス作成
   * - 新規メンバ(SPkey要求時)は新規作成
   * @constructor
   * @param {authServerConfig} config - authServerの設定値
   * @param {authRequest} request - 処理要求
   */
  constructor(config,request={func:'::initial::'}) {
    const v = {whois:`Member.constructor`, arg:{request}, rv:null};
    const dev = new devTools(v);
    try {

      this.cf = config; // authServer設定値をメンバとして格納

      // -------------------------------------------------------------
      dev.step(1);  // memberListシートの準備
      // -------------------------------------------------------------

      dev.step(1.1);  // シートの取得
      v.spread = SpreadsheetApp.getActive();
      v.sheet = v.spread.getSheetByName(this.cf.memberList);

      // memberListシートが存在しなければシートを新規作成
      if( !v.sheet ){

        dev.step(1.2);  // シートを追加
        v.sheet = v.spread.insertSheet(this.cf.memberList);

        dev.step(1.3);  // シート上の項目定義
        v.colsDef = [
          {name:'memberId',type:'string',desc:'メンバの識別子',note:'メールアドレス',default:'UUIDv4'},
          {name:'name',type:'string',desc:'メンバの氏名',note:'',default:'"dummy"'},
          {name:'status',type:'string',desc:'メンバの状態',note:'未加入,未審査,審査済,加入中,加入禁止',default:'"未加入"'},
          {name:'log',type:'MemberLog',desc:'メンバの履歴情報',note:'シート上はJSON文字列',default:'new MemberLog()'},
          {name:'profile',type:'MemberProfile',desc:'メンバの属性情報',note:'シート上はJSON文字列',default:'new MemberProfile()'},
          {name:'device',type:'[MemberDevice](MemberDevice.md#memberdevice_members)[]',desc:'デバイス情報',note:'マルチデバイス対応のため配列。シート上はJSON文字列',default:'空配列'},
          {name:'note',type:'string',desc:'当該メンバに対する備考',note:'',default:'空文字列'},
        ];

        dev.step(1.4);  // 項目名のセット
        v.label = v.colsDef.map(x => x.name);
        v.sheet.appendRow(v.label);

        dev.step(1.5);  // メモのセット
        v.notes = v.colsDef.map(x => x.desc + (x.note ? `\n${x.note}` : ''));
        v.notes.forEach((h,i)=>{
          v.sheet.getRange(1,i+1).setNote(h);
        })
      }

      // -------------------------------------------------------------
      dev.step(2);  // 対象メンバ・デバイスの特定
      // -------------------------------------------------------------

      dev.step(2.1); // memberId で検索
      v.values = v.sheet.getDataRange().getValues();
      v.labels = v.values.shift();

      v.idx = v.labels.indexOf('memberId');
      v.row = v.values.find(r => r[v.idx] === request.memberId);

      if (v.row) {  // シート上にmemberId有り

        // ---------------------------------------------------------
        dev.step(2.2); // 既存メンバ
        // ---------------------------------------------------------
        v.obj = {};
        v.labels.forEach((k, i) => v.obj[k] = v.row[i]);

        this.memberId = v.obj.memberId;
        this.name     = v.obj.name;
        this.status   = v.obj.status;
        this.log      = JSON.parse(v.obj.log || '{}');
        this.profile  = JSON.parse(v.obj.profile || '{}');
        this.device   = JSON.parse(v.obj.device || '{}');
        this.note     = v.obj.note || '';

        // ---------------------------------------------------------
        dev.step(2.3); // デバイス確認
        // ---------------------------------------------------------
        if (!this.device.hasOwnProperty(request.deviceId)) {

          dev.step(2.4); // 未登録デバイス
          v.device = this.MemberDevice();
          this.device[v.device.deviceId] = v.device;
        }

      } else {  // シート上にmemberId無し

        // ---------------------------------------------------------
        dev.step(2.5); // 未登録メンバ
        // ---------------------------------------------------------
        if ( request.func === '::initial::') {
          // HTML初回ロード時(SPkey要求)

          dev.step(2.6); // 仮登録
          this.memberId = 'dummyMemberID';
          this.name     = 'dummyMemberName';
          this.status   = 'TR';
          this.log      = this.MemberLog();
          this.profile  = this.MemberProfile();
          this.device   = {};

          v.device = this.MemberDevice();
          this.device[v.device.deviceId] = v.device;

          this.note = '';

        } else {

          // -----------------------------------------------------
          dev.step(2.7); // 不正要求
          // -----------------------------------------------------
          throw new Error('unregistered member access');
        }
      }

      v.rv = this;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** addTrial: 新しい試行を登録し、メンバにパスコード通知メールを発信
   * @param {authRequest} request - 処理要求
   * @returns {authResponse|Error}
   */
  addTrial(arg) {
    const v = {whois:`${this.constructor.name}.addTrial`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      const req = arg;
      const member = this.getMember(req.memberId);
      if (member instanceof Error) {
        v.rv = member;
        return v.rv;
      }

      const devIdx = member.device.findIndex(d=>d.deviceId===req.deviceId);
      if (devIdx === -1 || member.device[devIdx].status !== '未認証') {
        v.rv = dev.error('invalid status');
        return v.rv;
      }

      const trial = new MemberTrial(this.cf.passcodeLength);
      member.device[devIdx].trial.unshift(trial);
      member.log.loginRequest = Date.now();

      if (member.device[devIdx].trial.length > this.cf.maxTrialLog) {
        member.device[devIdx].trial.pop();
      }

      this.setMember(member);

      if (!this.cf.udSendPasscode) {
        sendmail(member.memberId, '認証コード通知', `パスコード: ${trial.passcode}`);
      }

      v.rv = member;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** checkPasscode: 認証時のパスコードチェック
   * 入力されたパスコードをチェック、Member内部の各種メンバの値を更新
   * @param {authRequest} request - 処理要求
   * @returns {authResponse|Error}
   */
  checkPasscode(arg) {
    const v = {whois:`${this.constructor.name}.checkPasscode`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      const req = arg;
      if (req.func !== '::passcode::' || !req.arg?.[0]) {
        v.rv = dev.error('invalid request');
        return v.rv;
      }

      const member = this.getMember(req.memberId);
      if (member instanceof Error) {
        v.rv = member;
        return v.rv;
      }

      const devObj = member.device.find(d=>d.deviceId===req.deviceId);
      if (!devObj || devObj.status !== '試行中') {
        v.rv = dev.error('invalid status');
        return v.rv;
      }

      const trial = devObj.trial[0];
      const entered = req.arg[0];
      const ok = trial.passcode === entered;

      trial.log.unshift(new MemberTrialLog(entered, ok));

      if (ok) {
        devObj.status = '認証中';
        member.log.loginSuccess = Date.now();
        member.log.loginExpiration = Date.now() + this.cf.loginLifeTime;
      } else if (trial.log.length >= this.cf.maxTrial) {
        devObj.status = '凍結中';
        member.log.loginFailure = Date.now();
        member.log.unfreezeLogin = Date.now() + this.cf.loginFreeze;
      }

      this.setMember(member);
      v.rv = member;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** getMember: 指定メンバの情報をmemberListシートから取得
   * @param {string} memberId - ユーザ識別子(メールアドレス)
   * @returns {Member|Error}  いまここ：元は"authResponse"だったが、"Member"の方がベター？
   */
  getMember(arg) {
    const v = {whois:`${this.constructor.name}.getMember`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      const memberId = arg;
      const sheet = SpreadsheetApp.getActive().getSheetByName(this.cf.memberList);
      const rows = sheet.getDataRange().getValues();

      const idx = rows.findIndex((r,i)=>i>0 && r[0]===memberId);
      if (idx < 0) {
        v.rv = dev.error('not exists');
        return v.rv;
      }

      const r = rows[idx];
      const m = new Member(this.cf);
      [m.memberId,m.name,m.status] = r;
      m.log = JSON.parse(r[3]);
      m.profile = JSON.parse(r[4]);
      m.device = JSON.parse(r[5]);
      m.note = r[6];

      v.rv = m;


      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** judgeMember: 加入審査画面から審査結果入力＋結果通知
   * 加入審査画面を呼び出し、管理者が記入した結果をmemberListに登録、審査結果をメンバに通知
   * memberListシートのGoogle Spreadのメニューから管理者が実行することを想定
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  static judgeMember(arg) {
    const v = {whois:`${this.constructor.name}.judgeMember`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      const memberId = arg;
      const m = new Member(this.cf).getMember(memberId);
      if (m instanceof Error) {
        v.rv = m;
        return v.rv;
      }
      if (m.status !== '未審査') {
        v.rv = 'not unexamined';
        return v.rv;
      }

      const ui = SpreadsheetApp.getUi();
      const res = ui.alert(
        `加入審査: ${m.memberId}`,
        '承認しますか？',
        ui.ButtonSet.YES_NO_CANCEL
      );

      if (res === ui.Button.CANCEL) {
        v.rv = 'examin canceled';
        return v.rv;
      }

      const now = Date.now();
      if (res === ui.Button.YES) {
        m.status = '加入中';
        m.log.approval = now;
        m.log.joiningExpiration = now + this.cf.memberLifeTime;
      } else {
        m.status = '加入禁止';
        m.log.denial = now;
        m.log.unfreezeDenial = now + this.cf.prohibitedToJoin;
      }

      new Member(this.cf).setMember(m);
      v.rv = m;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** judgeStatus: 指定メンバ・デバイスの状態を状態決定表により判定
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  judgeStatus(arg) {
    const v = {whois:`${this.constructor.name}.judgeStatus`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /**
   * MemberDevice: デバイス情報の初期オブジェクト生成
   * @returns {MemberDevice}
   */
  MemberDevice() {
    const v = { whois: 'Member.MemberDevice', arg: {}, rv: null };
    const dev = new devTools(v);
    try {

      v.rv = {
        deviceId: Utilities.getUuid(),
        status: 'UC',             // uncertified
        CPkeySign: '',
        CPkeyEnc: '',
        CPkeyUpdated: Date.now(),
        trial: [],
      };

      dev.end();
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /**
   * MemberLog: メンバ履歴情報初期化
   * @returns {MemberLog}
   */
  MemberLog() {
    const v = { whois: 'Member.MemberLog', arg: {}, rv: null };
    const dev = new devTools(v);
    try {

      const now = Date.now();
      v.rv = {
        joiningRequest: now,
        approval: 0,
        denial: 0,
        loginRequest: 0,
        loginSuccess: 0,
        loginExpiration: 0,
        loginFailure: 0,
        unfreezeLogin: 0,
        joiningExpiration: 0,
        unfreezeDenial: 0,
      };

      dev.end();
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /**
   * MemberProfile: メンバ属性情報初期化
   * @returns {MemberProfile}
   */
  MemberProfile() {
    const v = { whois: 'Member.MemberProfile', arg: {}, rv: null };
    const dev = new devTools(v);
    try {

      v.rv = {
        authority: 0,
      };

      dev.end();
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** reissuePasscode: パスコードを再発行する
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  reissuePasscode(arg) {
    const v = {whois:`${this.constructor.name}.reissuePasscode`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** removeMember: 登録中メンバをアカウント削除、または加入禁止にする
   * - memberListシートのGoogle Spreadのメニューから管理者が実行することを想定
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  static removeMember(arg) {
    const v = {whois:`${this.constructor.name}.removeMember`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      // getMember + 状態更新 + setMember の組み合わせで実装できます。
      // （凍結解除・論理削除・CPkey更新はいずれも Member.device / status / log の更新のみ）

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** restoreMember: 加入禁止(論理削除)されているメンバを復活させる
   * - memberListシートのGoogle Spreadのメニューから管理者が実行することを想定
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  static restoreMember(arg) {
    const v = {whois:`${this.constructor.name}.restoreMember`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      // getMember + 状態更新 + setMember の組み合わせで実装できます。
      // （凍結解除・論理削除・CPkey更新はいずれも Member.device / status / log の更新のみ）

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** setMember: 指定メンバ情報をmemberListシートに保存
   * - 登録済メンバの場合は更新、未登録の場合は新規登録(追加)を行う
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  setMember(arg) {
    const v = {whois:`${this.constructor.name}.setMember`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      const m = arg;
      const sheet = SpreadsheetApp.getActive().getSheetByName(this.cf.memberList);
      const rows = sheet.getDataRange().getValues();
      const idx = rows.findIndex((r,i)=>i>0 && r[0]===m.memberId);

      const row = [
        m.memberId,
        m.name,
        m.status,
        JSON.stringify(m.log),
        JSON.stringify(m.profile),
        JSON.stringify(m.device),
        m.note
      ];

      if (idx < 0) sheet.appendRow(row);
      else sheet.getRange(idx+1,1,1,row.length).setValues([row]);

      v.rv = null;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** unfreeze: 指定されたメンバ・デバイスの「凍結中」状態を強制的に解除
   * - 引数でmemberIdが指定されなかった場合、凍結中デバイス一覧の要求と看做す
   * - deviceIdの指定が無い場合、memberIdが使用する凍結中デバイス全てを対象とする
   * - memberListシートのGoogle Spreadのメニューから管理者が実行することを想定
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  static unfreeze(arg) {
    const v = {whois:`${this.constructor.name}.unfreeze`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      // getMember + 状態更新 + setMember の組み合わせで実装できます。
      // （凍結解除・論理削除・CPkey更新はいずれも Member.device / status / log の更新のみ）

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** updateCPkey: 対象メンバ・デバイスの公開鍵を更新
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  updateCPkey(arg) {
    const v = {whois:`${this.constructor.name}.updateCPkey`, arg:{arg}, rv:null};
    const dev = new devTools(v);
    try {

      // getMember + 状態更新 + setMember の組み合わせで実装できます。
      // （凍結解除・論理削除・CPkey更新はいずれも Member.device / status / log の更新のみ）

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}

// テスト用サーバ側関数
// テスト用サーバ側関数
function serverFunc(arg){
  const v = {whois:`serverFunc`, arg:{arg}, rv:null};
  dev.start(v);
  try {
    console.log(`${v.whois}: arg=${JSON.stringify(arg,null,2)}`);
    return true;
  } catch (e) { return dev.error(e); }
}

// クライアント側HTML配信・Webアプリ(doGet/Post)
function doGet(e) {
  const tpl = HtmlService.createTemplateFromFile('index');
  tpl.VERSION = toLocale(new Date(),'yyyy/MM/dd hh:mm:ss');
  return tpl.evaluate()
    .setTitle('Auth(test)');
}
async function doPost(e) {
  console.log('doPost called');
  //const asv = await authServer.initialize(globalThis.config);
  //const rv = asv.exec(e.postData.contents); // 受け取った本文(文字列)
  const rv = {msg:'doPost response'};
  if( rv !== null ){ // fatal(無応答)の場合はnullを返す
    return ContentService
      .createTextOutput(JSON.stringify(rv))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
