<div style="text-align: right;">

[総説](spec.md) | [クライアント側仕様](cl/client.md) | [サーバ側仕様](sv/server.md) | [JavaScriptライブラリ](JSLib.md)

</div>

# <span id="list">JavaScript ライブラリ</span>

| 種別 | 名称 | 概略 |
| :-- | :-- | :-- |
| クライアント・サーバ共通 | [createPassword](#createPassword) | 長さ・文字種指定に基づき、パスワードを生成 |
|  | [devTools](#devTools) | 開発支援関係メソッド集 |
|  | [toLocale](#toLocale) | 日時を指定形式の文字列にして返す |
|  | [whichType](#whichType) | 変数の型を判定 |
| クライアント専用 |  |  |
| サーバ専用 | [sendmail](#sendmail) | GASからメールを発信 |

## クライアント・サーバ共通

### <span id="createpassword"><a href="#list">createPassword</a></span>

```js
/** 長さ・文字種指定に基づき、パスワードを生成
 *
 * @param {number} [len=16] - パスワードの長さ
 * @param {Object} opt
 * @param {boolean} [opt.lower=true] - 英小文字を使うならtrue
 * @param {boolean} [opt.upper=true] - 英大文字を使うならtrue
 * @param {boolean} [opt.symbol=true] - 記号を使うならtrue
 * @param {boolean} [opt.numeric=true] - 数字を使うならtrue
 * @returns {string}
 */
function createPassword(len=16,opt={lower:true,upper:true,symbol:true,numeric:true}){
  const v = {
    whois: 'createPassword',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    symbol: '!#$%&()=~|@[];:+-*<>?_>.,',
    numeric: '0123456789',
    base: '',
    rv: '',
  }
  try {
    Object.keys(opt).forEach(x => {
      if( opt[x] ) v.base += v[x];
    });
    for( v.i=0 ; v.i<len ; v.i++ ){
      v.rv += v.base.charAt(Math.floor(Math.random() * v.base.length));
    }
  } catch(e) {
    console.error(v.whois+' abnormal end.\n'+e.stack+'\n'+JSON.stringify(v));
    v.rv = e;
  } finally {
    return v.rv;
  }
}
```

### <span id="devTools"><a href="#list">devTools</a></span>

```js
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

  /** szError: 独自拡張したErrorオブジェクト */
  class szError extends Error {
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
    const rv = e.constructor.name === 'szError' ? e : new szError(fi,e);

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
```

### <span id="toLocale"><a href="#list">toLocale</a></span>

```js
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
  const v = { whois: 'toLocale', rv: null,
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
  dev.start(v.whois, [...arguments], {start:opt.verbose});
  try {

    // -------------------------------------------------------------
    dev.step(1);  // 処理対象をDate型に変換
    // -------------------------------------------------------------
    if( arg === null ){
      dev.step(1.1);  // 無指定なら現在日時
      v.dObj = new Date();
    } else if( whichType(arg,'Date') ){
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
```

### <span id="whichType"><a href="#list">whichType</a>/span>

```js
/** 変数の型を判定
 *
 * - 引数"is"が指定された場合、判定対象が"is"と等しいかの真偽値を返す。
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
 * - Qiita [JavaScriptの型などの判定いろいろ](https://qiita.com/amamamaou/items/ef0b797156b324bb4ef3)
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
```

## クライアント専用

## サーバ専用

### <span id="sendmail"><a href="#list">sendmail</a></span>

```js
/** GASからメールを発信する
 * 実行に当たっては権限の承認を必要とする。
 *
 * - [Google App Script メモ（メール送信制限 回避術）](https://zenn.dev/tatsuya_okzk/articles/259203cc416328)
 * - GAS公式[createDraft](https://developers.google.com/apps-script/reference/gmail/gmail-app?hl=ja#createdraftrecipient,-subject,-body,-options)
 *
 * @param {String} recipient - 受信者のアドレス
 * @param {String} subject - 件名
 * @param {String} body - メールの本文
 * @param {Object} options - 詳細パラメータを指定する JavaScript オブジェクト（下記を参照）
 * @param {BlobSource[]} options.attachments - メールと一緒に送信するファイルの配列
 * @param {String} options.bcc - Bcc で送信するメールアドレスのカンマ区切りのリスト
 * @param {String} options.cc - Cc に含めるメールアドレスのカンマ区切りのリスト
 * @param {String} options.from - メールの送信元アドレス。getAliases() によって返される値のいずれかにする必要があります。
 * @param {String} options.htmlBody - 設定すると、HTML をレンダリングできるデバイスは、必須の本文引数の代わりにそれを使用します。メール用にインライン画像を用意する場合は、HTML 本文にオプションの inlineImages フィールドを追加できます。
 * @param {Object} options.inlineImages - 画像キー（String）から画像データ（BlobSource）へのマッピングを含む JavaScript オブジェクト。これは、htmlBody パラメータが使用され、<img src="cid:imageKey" /> 形式でこれらの画像への参照が含まれていることを前提としています。
 * @param {String} options.name - メールの送信者の名前（デフォルト: ユーザー名）
 * @param {String} options.replyTo - デフォルトの返信先アドレスとして使用するメールアドレス（デフォルト: ユーザーのメールアドレス）
 * @returns {null|Error}
 */
function sendmail(recipient,subject,body,options){
  const v = {whois:'sendmail',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.draft = GmailApp.createDraft(recipient,subject,body,options);
    v.draftId = v.draft.getId();
    GmailApp.getDraft(v.draftId).send();

    console.log('Mail Remaining Daily Quota:'+MailApp.getRemainingDailyQuota());

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `\n${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\nrecipient=${recipient}`
    + `\nsubject=${subject}`
    + `\nbody=${body}`
    + `\n=options=${JSON.stringify(options)}`;  // 引数
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
```
