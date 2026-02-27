/** Schema: DB・データ型構造定義オブジェクト
 * - 各種アプリで使用するテーブル・データ型を宣言
 * - 各種アプリでは本クラスを拡張し、configとすることを想定
 * 
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
 * 2.1.0 2026-01-24 defaultのデータ型として関数利用を可能に変更
 * 2.0.0 2026-01-13 configの親クラスを念頭に書き換え。factoryメソッド追加
 * 【欠番】2025-12-21 構造簡潔化＋Adapterと役割分担
 * 1.2.0 2025-09-21 AlaSQLの予約語とSpreadDb.schemaの重複排除
 *   - SpreadDb.schema.tables -> tableMap
 *   - SpreadDb.schema.tables.cols -> colMap(∵予約語columnsと紛らわしい)
 * 1.1.0 2025-09-15 構造の見直し、メンバ名の修正
 * 1.0.0 2025-09-15 初版
 */
export class Schema {
  /**
   * @constructor
   * @memberof Schema
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
   * @memberof Schema
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
   * @memberof Schema
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
  /** typedef: TypeDef型オブジェクトを生成
   * @memberof Schema
   * @param {string} name - オブジェクト名(TypeDef.name設定値)
   * @param {Object} obj - 生成するオブジェクトに設定される値(値指定) 
   * @returns {TypeDef|Error}
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
   *   - データ型が関数の場合、引数はfactoryメソッドに渡されるargと看做す
   * 
   * 【datetimeが固定値ではない場合の記述方法】
   * ex. factoryメソッドで生成するオブジェクトに生成日時を設定したい
   *   ColumnDef.default = "Date.now()"
   * ex. 有効期間として1日(24時間)後を設定したい
   *   ColumnDef.default = "new Date(Date.now()+24*3600*1000)"
   * - 【注意】引数は使用不可
   * - factoryメソッドではこれを new Function('x',`return ${default}`) として関数化し、実行結果を返す
   */
  /** columndef: ColumnDef型オブジェクトを生成
   * @memberof Schema
   * @param {Object} obj - 生成するオブジェクトに設定される値(値指定) 
   * @returns {ColumnDef|Error}
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
   * @memberof Schema
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

      dev.step(2,arg);  // 判定・変換ロジックの定義
      v.trueValues = [1, '1', -1, '-1', 'true', 'TRUE', true];
      v.falseValues = [0, '0', 'false', 'FALSE', false];
      v.eval = x => { return typeof x === 'function' ? (x(arg) ?? null) : null };
      v.checkers = {
        string: x => typeof x === 'string' ? x : v.eval(x),
        number: x => {
          v.num = Number(x);
          return isNaN(v.num) ? v.eval(x) : v.num;
        },
        boolean: x => v.trueValues.includes(x) ? true
          : (v.falseValues.includes(x) ? false : v.eval(x)),
        object: x => this.isObject(x) ? x : v.eval(x),
        array: x => Array.isArray(x) ? x : v.eval(x),
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
   * @memberof Schema
   * @param {*} value - チェック対象の変数
   * @param {string} path='$' - エラーメッセージ用にオブジェクト内の階層を保持
   * @returns {Object|Error}
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
