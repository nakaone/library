/** devTools: 開発支援関係メソッド集
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
 * @history
 *   - rev.3.2.0 : 2026/02/25
 *     - extract()を追加
 *     - modeの既定値をdev->pipeに変更
 *     - seq表示時の0パディング不足について修正
 *   - rev.3.1.0 : 2026/02/11
 *     - modeに"pipe"追加
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
 */
/** devToolsOpt: オプション設定値
 * @typedef {Object} devToolsOpt
 * @prop {string} [mode='pipe'] - 出力モード
 *   | mode     | エラー | 開始・終了 | dump/step | 用途・備考    |
 *   | :--      | :--:  | :--:     | :--:      | :--          |
 *   | "none"   | ❌    | ❌        | ❌        | 出力無し      |
 *   | "error"  | ⭕    | ❌        | ❌        | エラーのみ出力 |
 *   | "normal" | ⭕    | ⭕        | ❌        | 本番用        |
 *   | "dev"    | ⭕    | ⭕        | ⭕        | 開発用        |
 *   | "pipe"   | ⭕    | ❌        | ⭕        | パイプ処理用   |
 * @prop {number} [digit=4] - 処理順(seq)をログ出力する際の桁数
 * @prop {boolean} [footer=false] - 実行結果(startTime,endTime,elaps)を出力するならtrue
 * @prop {number} [maxDepth=10] - 再帰呼出時の最深階層数
 */
/**
 * @class
 * @prop {string} whois='' - 関数名またはクラス名.メソッド名
 * @prop {number} seq - 関数・メソッドの呼出順
 * @prop {Object.<string, any>} arg={} - 起動時引数。{変数名：値}形式
 * @prop {Object} v={} - 関数・メソッド内汎用変数
 * @prop {string} stepNo=1 - 関数・メソッド内の現在位置
 * @prop {string[]} log=[] - {string[]} 実行順に並べたdev.stepNo
 * @prop {number} startTime=Date.now() - 開始時刻
 * @prop {number} endTime - 終了時刻
 * @prop {number} elaps - 所要時間(ミリ秒)
 * @prop {devToolsOpt} opt - オプション設定値
 */
export class devTools {

  /** constructor
   * @constructor
   * @memberof devTools
   * @param {Object} v={} - 関数・メソッド内汎用変数
   * @param {devToolsOpt} opt={}
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
      mode: opt.mode ?? 'pipe',
      digit: opt.digit ?? 4,
      footer: opt.footer ?? false,
      maxDepth: opt.maxDepth ?? 10,
    };

    // 開始ログ出力
    if( ['normal','dev'].includes(this.opt.mode) ){
      console.log(`${this.toLocale(this.startTime,'hh:mm:ss.nnn')} [${
        ('0'.repeat(this.opt.digit)+this.seq)
        .slice(-this.opt.digit)}]${this.whois} start`);
    }
  }

  /** devToolsError: devTools専用拡張エラークラス
   * @memberof devTools
   */
  static devToolsError(dtObj,...e){
    const rv = new Error(...e);

    // 独自追加項目を個別に設定
    ['whois','seq','arg','stepNo','log','startTime','endTime','elaps','v']
    .forEach(x => rv[x] = dtObj[x] ?? null);

    rv.name = 'devToolsError';
    return rv;
  }

  /** end: 正常終了時処理
   * @memberof devTools
   * @param {any} [arg] - 終了時ダンプする変数
   * @returns {void}
   */
  end(arg){
    // 終了時に確定する項目に値設定
    this.finisher();

    // ログ出力
    if( ['normal','dev'].includes(this.opt.mode) ){
      let msg = `${this.toLocale(this.endTime,'hh:mm:ss.nnn')} [${
        ('0'.repeat(this.opt.digit)+this.seq).slice(-this.opt.digit)
      }]${this.whois} normal end`;
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

  /** error: 異常終了時処理
   * @memberof devTools
   * @param {Error} e
   * @returns {Error}
   */
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
      if( this.opt.mode !== 'none' ){
        console.error(`[${
          ('0'.repeat(this.opt.digit)+e.seq).slice(-this.opt.digit)
        }]${e.whois} step.${e.stepNo}\n${
          e.message}\n${
          this.formatObject(e)}`
        );
      }
      return e;
    }
  }

  /**
   * @typedef {Object} ExtractCondition - devTools.extractメソッドの引数"cond"
   * @prop {string|string[]|function} [keys=()=>false] - 出力対象メンバの指定
   *   string: メンバ名、またはその配列
   *   function: メンバ名を引数に対象かを判断する関数(戻り値はboolean)
   *   無指定の場合は全メンバ不出力
   * @prop {function} [filter=()=>true] - 元データが配列だった場合の抽出条件
   *   元データを引数に、対象となるならtrueを返す。
   * @prop {Object.<string, ExtractCondition>} [children={}] - 子要素に対する抽出条件
   *   keysに記載が無くてもchildrenに存在する場合は出力対象。
   *   両方に記載されている場合、childrenの指定が優先される。
   */
  /** extract: オブジェクトまたはその配列から指定メンバを抽出したオブジェクトを作成
   * @memberof devTools
   * @param {Object|Object[]} data - 抽出元オブジェクト
   * @param {ExtractCondition} cond - 抽出条件
   * @returns {Object|Error} 処理の結果新たに作成されたオブジェクト
   */
  extract(data=null,cond=null){
    const v = {arg:{data,cond},isArray:true,rv:{}};

    // 再帰階層・引数チェック
    if( data === null ) return new Error('no data');
    if( cond === null ) return new Error('no condition');

    v.debug = {original:cond};
    // 抽出条件をオブジェクト化
    v.m = cond.match(/^(.*)\[(.+?)\]\s*:\s*({.+)$/);
    // 1:ラベル(通常空文字列) 2:ルートの抽出条件(フィルタ) 3:抽出項目定義
    v.filter = v.m ? eval(v.m[2]) : null;
    v.def = v.m ? v.m[3] : cond;
    // 元データからの抽出
    if( v.filter !== null ) data = data.filter(v.filter);
    cond = this.parseStructure(v.def);
    v.debug.cond = cond;
    v.debug.len = data.length;
    //v.debug.sample = Array.isArray(data) ? data[0] : data;
    console.log(`l.223 ${JSON.stringify(v.debug,null,2)}`);

    const recursive = (data,cond,depth=0) => {
      if( depth > this.opt.maxDepth ) return new Error(`too deep`);

      // 子要素が無い ⇒ データそのまま使用
      v.propList = Object.keys(cond);
      if( v.propList.length === 0 ) return data;
      v.propHasChild = v.propList.map(x => Object.keys(cond[x]).length > 0);

      const rv = [];

      // 元データは強制的に配列に変換
      let isArray = true;
      if( !Array.isArray(data) ){
        isArray = false;  // 元は配列では無かったことを記録
        data = [data];
      };

      // とりあえず「ラベルに抽出条件が無い」という前提で作成中。
      for( v.i=0 ; v.i<data.length ; v.i++ ){
        v.o = {};
        for( v.j=0 ; v.j<v.propList.length ; v.j++ ){
          v.x = v.propList[v.j];
          // 元データに抽出対象項目が無ければスキップ
          if( !Object.hasOwn(data[v.i],v.propList[v.j]) ) continue;
          if( v.propHasChild[v.j] ){
            // 子要素が有る場合、再帰呼出
            v.o[v.x] = recursive(data[v.i][v.x],cond[v.x],depth+1);
            if( v.o[v.x] instanceof Error ) return v.o[v.x];
          } else {
            // 子要素が無い場合、該当dataをコピー
            v.o[v.x] = data[v.i][v.x];
          }
        }
        rv.push(v.o);
      }

      // 元が配列で無かったなら単体に戻す
      return isArray === false ? rv[0] : rv;
    }

    v.rv = recursive(data,cond);
    if( v.rv instanceof Error ) throw v.rv;
    console.log(`== extract result\n${JSON.stringify({
      len: Array.isArray(v.rv) ? v.rv.length : -1,
      rv: v.rv,
    },null,2)}`);
    return v.rv;
  }

  /** finisher: end/error共通の終了時処理
   * @memberof devTools
   * @param {void}
   * @returns {void}
   */
  finisher(){
    // 終了時に確定する項目に値設定
    if( Array.isArray(this.log) ) this.log = this.log.join(', ');
    this.endTime = new Date();
    this.elaps = `${this.endTime - this.startTime} msec`;
  }

  /** formatObject: オブジェクトの各メンバーを「メンバ名: 値 // データ型」の形式で再帰的に整形する
   * @memberof devTools
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

  /** parseStructure: メンバ名・抽出条件指定文字列をオブジェクト化(extractの前処理)
   * - "{メンバ名＋抽出条件:{子要素}}"
   * - 子要素は上記パターンで再帰的に定義
   * - 親子関係だけに絞る({name,filter,children}形式にしない)
   * - 子要素が存在しない場合は空オブジェクト
   * - 抽出条件はメンバ名の後ろに"[〜]"で付記
   * - メンバ名・抽出条件には空白文字が存在
   * 
   * @memberof devTools
   * @param {string} input 
   * @returns {Object.<string, Object>}
   * 
   * @example
   * 入力(文字列)："{longname,meta[x=>Object.hasOwn(x,'code')]:{range,type:{name}},kind}"
   * 出力(オブジェクト)：
   * {
   *   "longname":{},
   *   "meta[x=>Object.hasOwn(x,'code')]": {
   *     "range": {},
   *     "type": {
   *       "name":{}
   *     }
   *   },
   *   "kind":{}
   * }
   */
  parseStructure(input) {
    let index = 0; // 現在の読み取り位置を示すインデックス

    // 空白文字をスキップする関数
    function skipWhitespace() {
      while (/\s/.test(input[index])) index++;
    }

    // メンバ名（＋抽出条件）をパースする関数
    function parseKey() {
      skipWhitespace();
      let key = '';

      // コロン・カンマ・波括弧が出るまで読み取る
      while (index < input.length && ![':', ',', '{', '}'].includes(input[index])) {
        if (input[index] === '[') {
          // 抽出条件の開始（ネスト対応）
          let start = index;
          let depth = 1;
          index++; // '[' をスキップ

          while (index < input.length && depth > 0) {
            if (input[index] === '[') depth++;
            else if (input[index] === ']') depth--;
            index++;
          }

          // 抽出条件全体を key に含める（例：meta[x=>x.id > 0]）
          key += input.slice(start, index);
        } else {
          // 通常の文字を key に追加
          key += input[index++];
        }
      }

      return key.trim(); // 前後の空白を除いて返す
    }

    // 再帰的にオブジェクトをパースする関数
    function parseObject() {
      skipWhitespace();

      // 最初の文字が '{' であることを確認
      if (input[index] !== '{') {
        throw new Error(`Expected '{' at position ${index}`);
      }

      index++; // '{' をスキップ
      let result = {}; // 結果を格納するオブジェクト

      while (index < input.length) {
        skipWhitespace();

        // 閉じ括弧 '}' に出会ったら終了
        if (input[index] === '}') {
          index++; // '}' をスキップ
          break;
        }

        const key = parseKey(); // メンバ名＋抽出条件を取得
        skipWhitespace();

        let value = {}; // デフォルトは空オブジェクト

        // 子要素がある場合（':' の後に '{' が続く）
        if (input[index] === ':') {
          index++; // ':' をスキップ
          skipWhitespace();

          if (input[index] === '{') {
            value = parseObject(); // 再帰的に子要素をパース
          } else {
            throw new Error(`Expected '{' after ':' at position ${index}`);
          }
        }

        result[key] = value; // 結果に追加

        skipWhitespace();

        // 次の要素がある場合は ',' をスキップ
        if (input[index] === ',') {
          index++;
        } else if (input[index] === '}') {
          // 次のループで閉じ括弧を処理
          continue;
        } else {
          // 想定外の文字が出た場合はエラー
          throw new Error(`Unexpected character '${input[index]}' at position ${index}`);
        }
      }

      return result;
    }

    return parseObject(); // パース開始
  }

  /** step: 関数内の進捗状況管理＋変数のダンプ
   * @memberof devTools
   * @param {number|string} label - dev.start〜end内での位置を特定するマーカー
   * @param {any} [val=null] - ダンプ表示する変数
   * @param {boolean} [cond=true] - 特定条件下でのみダンプ表示したい場合の条件
   * @returns {void}
   * @example 123行目でClassNameが"cryptoClient"の場合のみv.hogeを表示
   *   dev.step(99.123,v.hoge,this.ClassName==='cryptoClient');
   *   ※ 99はデバック、0.123は行番号の意で設定
   */
  step(label, val=null, cond=true){
    this.stepNo = String(label);
    this.log.push(this.stepNo);
    // valが指定されていたらステップ名＋JSON表示
    if( ['dev','pipe'].includes(this.opt.mode) && val && cond ){
      console.log(`== [${
        ('0'.repeat(this.opt.digit)+this.seq).slice(-this.opt.digit)
      }]${this.whois} step.${label} ${this.formatObject(val)}`);
    }
  }

  /** toLocale: ログ出力用時刻文字列整形
   * @memberof devTools
   * @param {Date} date - 整形対象Dateオブジェクト
   * @param {string} template - テンプレート
   * @returns {string} 整形済日時文字列
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
}
devTools.sequence = 1; // 関数・メソッドの呼出順を初期化
