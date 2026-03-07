import { utils } from '../../utils/1.0.0/core.mjs';

/** Schema: DB・データ型構造定義オブジェクト
 * - 各種アプリで使用するテーブル・データ型を宣言
 * - 各種アプリでは本クラスを拡張し、configとすることを想定
 * 
 * @class
 * @property {string} name - Schemaの論理名
 * @property {string} [version='0.0.0'] - Schemaのバージョン識別子(例:'1.2.0')
 * @property {string} [dbName] - 物理DB名。省略時はnameを流用
 * @property {string} [desc=''] - Schema全体に関する概要説明
 * @property {string} [note=''] - Schema全体に関する備考
 * @property {Object.<string, TableDef>} types - 論理テーブル名をキーとするテーブル定義
 * @property {string} original - Schemaインスタンス生成時の引数(JSON)。自動生成、設定不可
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
 * - 2.2.0 2026/03/07
 *   - TableDef, ColumnDefをクラス化
 *   - isObjectをutilsに移管
 *   - sanitizeArgが使われていなかったので削除
 *   - factoryをSchemaからTableDefに移動
 * - 2.1.0 2026-01-24
 *   - defaultのデータ型として関数利用を可能に変更
 * - 2.0.0 2026-01-13
 *   - configの親クラスを念頭に書き換え。factoryメソッド追加
 *   - 【欠番】2025-12-21 構造簡潔化＋Adapterと役割分担
 * - 1.2.0 2025-09-21 AlaSQLの予約語とSpreadDb.schemaの重複排除
 *   - SpreadDb.schema.tables -> tableMap
 *   - SpreadDb.schema.tables.cols -> colMap(∵予約語columnsと紛らわしい)
 * - 1.1.0 2025-09-15
 *   - 構造の見直し、メンバ名の修正
 * - 1.0.0 2025-09-15 初版
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
        if( !utils.isObject(arg[v.i]) )
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

        dev.step(4);  // 子要素(TableDef)の設定
        if( utils.isObject(arg[v.i].types) ){
          // arg[v.i].types定義分を追加。同名なら上書き
          Object.keys(arg[v.i].types).forEach(x => {
            this.types[x] = new TableDef(x,arg[v.i].types[x]);
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
}

/** TableDef: 論理テーブル構造定義
 * - name~colsはインスタンス生成時に指定、header以下は自動生成
 * 
 * @class
 * @property {string} name - 論理的な識別名（TableDef のキー）
 *   - クラス・API・ログで使用。例: 'Member', 'AuthAuditLog'
 *   - constructorに渡す定義オブジェクトでは省略(メンバ名を引用)
 * @property {string} [desc=''] - テーブルに関する概要説明
 * @property {string} [note=''] - テーブルに関する備考
 * @property {string[]} [primaryKey=[]] - 主キー項目名
 * @property {string[]} [unique=[]] - 主キー以外の一意制約
 * @property {ColumnDef[]} cols - 項目定義（順序を考慮するため配列）
 * 
 * @property {string[]} header - 項目名の一覧(引数不可、自動生成)
 * @property {Object.<string, ColumnDef>} map - 項目名をキーとする項目定義集(引数不可、自動生成)
 * 
 * @history
 * - rev.1.0.0: 2026/03/07 初版
 */
export class TableDef {

  /**
   * @constructor
   * @memberof TableDef
   * @param {string} name - オブジェクト名(TableDef.name設定値)
   * @param {Object} obj - 初期設定値のオブジェクト(TableDef型の値指定) 
   * @returns {TableDef|Error}
   */
  constructor(name,obj) {
    const v = {whois:`TableDef.constructor`, arg:{name,obj}, rv:null};
    const dev = new devTools(v,{mode:'pipe'});
    try {

      dev.step(1.1);  // 引数の型チェック
      if( typeof name !== 'string' )
        throw new Error(`argument "name" must be string.`);
      if( !utils.isObject(obj) )
        throw new Error(`argument "obj" must be object.`);

      dev.step(1.2);  // 必須指定項目の存在チェック
      if( typeof obj.cols === 'undefined' || !Array.isArray(obj.cols) )
        throw new Error(`argument "cols" must be array of length 1 or greater.`);

      dev.step(2);  // 既定値・初期値の設定
      this.name = name;
      this.desc = obj.desc ?? '';
      this.note = obj.note ?? '';
      this.primaryKey = obj.primaryKey ?? [];
      this.unique = obj.unique ?? [];
      this.cols = [];
      this.header = []; // 自動生成項目
      this.map = {};    // 自動生成項目

      dev.step(3);  // 子要素(ColumnDef)の設定
      obj.cols.forEach(x => {
        v.col = new ColumnDef(x);
        if( v.col instanceof Error ) throw v.col;

        this.cols.push(v.col);
        this.header.push(v.col.name);
        this.map[v.col.name] = v.col;
      })

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  /** factory: 論理テーブル構造定義を基に実オブジェクトを生成
   * @memberof TableDef
   * @param {Object.<string, any>} [arg={}] - 各メンバの設定値
   * @returns {Object} TableDefで指定したデータ型のオブジェクト
   */
  factory(arg) {
    const v = {whois:`${this.constructor.name}.factory`, arg:{arg}, rv:null};
    const dev = new devTools(v,{mode:'pipe'});
    try {

      dev.step(1);  // 引数のチェック
      if( !utils.isObject(arg) )
        throw new Error(`argument "arg" must be object.`);

      dev.step(2);  // 判定・変換ロジックの定義
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
        object: x => utils.isObject(x) ? x : v.eval(x),
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
      this.cols.forEach(col => {
        if( Object.hasOwn(arg,col.name) ){
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

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}

/** ColumnDef: 論理テーブルに於ける項目定義
 * - name~defaultはインスタンス生成時に指定、allowedColumnTypes以下は自動生成
 * 
 * @class
 * @property {string} name - 項目名（英数字・システム用）
 * @property {string} [label] - 表示用ラベル（省略時は name)
 * @property {string} [desc=''] - 項目に関する概要説明
 * @property {string} [note=''] - 項目に関する備考・意味説明
 * @property {string} [type='string'] - 論理データ型。allowedColumnTypesの何れか
 * @property {boolean} [nullable=true] - null を許可するか
 * @property {any} [default=null] - 既定値
 *   - データ型が関数の場合、引数はfactoryメソッドに渡されるargと看做す
 * 
 * @property {string[]} allowedColumnTypes - 許容するColumnのデータ型のリスト。自動生成、設定不可<br>
 *   - 'string' | 'number' | 'boolean' | 'object' | 'array' | 'datetime' | 'function'
 * 
 * @history
 * - rev.1.0.0: 2026/03/07 初版
 */
export class ColumnDef {

  /**
   * @constructor
   * @memberof ColumnDef
   * @param {Object} obj - 生成するオブジェクトに設定される値(値指定) 
   * @returns {ColumnDef|Error}
   */
  constructor(obj) {
    const v = {whois:`ColumnDef.constructor`, arg:{obj}, rv:null};
    const dev = new devTools(v,{mode:'pipe'});
    try {

      dev.step(1.1);  // 引数の型チェック
      if( !utils.isObject(obj) )
        throw new Error(`argument "obj" must be object.`);

      dev.step(1.2);  // 必須指定項目の存在チェック
      ['name'].forEach(x => {
        if( !Object.hasOwn(obj,x) )
          throw new Error(`"${x}" is not specified.`);
      });

      dev.step(2);  // 既定値・初期値の設定
      this.name = obj.name;
      this.label = obj.label ?? obj.name;
      this.desc = obj.desc ?? '';
      this.note = obj.note ?? '';
      this.type = obj.type ?? 'string';
      this.nullable = obj.nullable ?? true;
      this.default = obj.default ?? null;
      this.allowedColumnTypes
        = ['string','number','boolean','object','array','datetime','function'];

      dev.step(3);  // データ型のチェック
      if( !this.allowedColumnTypes.includes(this.type) )
        throw new Error(`"${this.name}" is invalid type.`);

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }
}