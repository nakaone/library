/** sdbTable: シート上の対象範囲(テーブル) */
const sdbTable = class {
  /** @constructor
   * @param arg {Object}
   * @param arg.spread {SpreadSheet} - スプレッドシート
   * @param arg.name {string} - 範囲名。スプレッドシート内で一意
   * @param [arg.range] {string} - 対象データ範囲のA1記法。省略時はnameを流用、セル範囲指定は無しと看做す
   * @param [arg.cols] {sdbColumn[]} - 新規作成シートの項目定義オブジェクトの配列
   * @param [arg.values] {Object[]|Array[]} - 新規作成シートに書き込む初期値
   * @returns
   */
  constructor(arg){
    const v = {whois:'sdbTable.constructor',step:0,rv:null,
      getDataRange:null, getValues:null, getNotes:null,
      colNo: arg => { // 列記号を列番号に変換
        let rv=0;
        for( let b='a'.charCodeAt(0)-1,s=arg.toLowerCase(),i=0 ; i<arg.length ; i++ ){
          rv = rv * 26 + s.charCodeAt(i) - b;
        }
        return rv;
      },
    };
    console.log(`${v.whois} start.\narg=${JSON.stringify(arg)}`);
    try {

      // ----------------------------------------------
      v.step = 1; // メンバの初期化、既定値設定
      // ----------------------------------------------
      this.spread = arg.spread || SpreadsheetApp.getActiveSpreadsheet();
      this.name = arg.name; // {string} テーブル名
      this.range = arg.range || arg.name; // {string} A1記法の範囲指定
      this.sheetName = null; // {string} シート名。this.rangeから導出
      this.sheet = null; // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
      this.schema = null; // {sdbSchema[]} シートの項目定義
      this.values = null; // {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
      this.top = null; // {number} ヘッダ行の行番号(自然数)。データ領域は次行から。
      this.left = null; // {number} データ領域左端の列番号(自然数)
      this.right = null; // {number} データ領域右端の列番号(自然数)
      this.bottom = null; // {number} データ領域下端の行番号(自然数)


      // ----------------------------------------------
      v.step = 2; // 引数name,rangeから対象範囲絞り込み
      // ----------------------------------------------
      // range(対象データ範囲のA1記法)から指定範囲を特定、メンバに保存
      // ※ この段階では"a2:c"(⇒bottom不明)等、未確定部分が残る
      v.m = this.range.match(/^'?(.+?)'?!([A-Za-z]*)([0-9]*):?([A-Za-z]*)([0-9]*)$/);
      if( v.m ){  // rangeがA1記法で指定された場合
        this.sheetName = v.m[1];
        this.left = v.m[2] ? v.colNo(v.m[2]) : 1;
        this.top = v.m[3] ? Number(v.m[3]) : 1;
        this.right = v.m[4] ? v.colNo(v.m[4]) : Infinity;
        this.bottom = v.m[5] ? Number(v.m[5]) : Infinity;
        if( this.left > this.right ) [this.left, this.right] = [this.right, this.left];
        if( this.top > this.bottom ) [this.top, this.bottom] = [this.bottom, this.top];
      } else {    // rangeが非A1記法 ⇒ range=シート名
        this.sheetName = this.range;
        this.top = this.left = 1;
        this.bottom = this.right = Infinity;
      }
      vlog(this,['sheetName','top','left','right','bottom'],v)

      // ----------------------------------------------
      v.step = 3; // this.schemaの作成
      // ----------------------------------------------
      v.schemaArg = { // sdbSchema用の引数
        cols: arg.cols || null,
        header: null,
        notes: null,
        values: arg.values || null,
      };
      this.sheet = this.spread.getSheetByName(this.sheetName);
      if( this.sheet !== null ){

        v.step = 3.11; // シートイメージの読み込み
        v.getDataRange = this.sheet.getDataRange();
        v.getValues = v.getDataRange.getValues();

        v.step = 3.12; // 範囲確定。A1記法とデータ範囲のどちらか小さい方
        this.right = Math.min(this.right, v.getValues[0].length);
        this.bottom = Math.min(this.bottom, v.getValues.length);

        v.step = 3.13; // 項目定義メモの読み込み
        v.schemaArg.notes = this.sheet.getRange(this.top,this.left,1,this.right-this.left+1).getNotes()[0];

      } else {

        v.step = 3.21; // シートも項目定義も初期データも無いならエラー
        if( !arg.cols && !arg.values ){
          throw new Error(`シートも項目定義も初期データも存在しません`);
        }
        v.step = 3.22; // arg.valuesがシートイメージなら先頭行をheaderとする
          if( arg.values && Array.isArray(arg.values[0]) ){
          v.schemaArg.header = arg.values[0];
        }
      }

      v.step = 3.3; // スキーマをインスタンス化、右端列番号の確定
      this.schema = new sdbSchema(v.schemaArg);
      if( this.schema instanceof Error ) throw this.schema;
      this.right = this.left - 1 + this.schema.cols.length;

      // ----------------------------------------------
      v.step = 4; // this.valuesの作成
      // ----------------------------------------------
      v.step = 4.1; // シートイメージから行オブジェクトへ変換関数を定義
      v.convert = o => {
        v.obj = [];
        for( v.i=o.top+1,v.cnt=0 ; v.i<o.bottom ; v.i++,v.cnt++ ){
          v.obj[v.cnt] = {};
          for( v.j=o.left ; v.j<o.right ; v.j++ ){
            if( o.data[v.i][v.j] ){
              v.obj[v.cnt][o.data[o.top][v.j]] = o.data[v.i][v.j];
            }
          }
        }
        return v.obj;
      }

      if( this.sheet === null ){
        if( arg.values ){
          if( whichType(arg.values[0],'Object') ){
            v.step = 4.2; // シート不在で初期データが行オブジェクト
            this.values = arg.values;
          } else {
            v.step = 4.3; // シート不在で初期データがシートイメージ
            this.values = v.convert({
              data  : arg.values,
              top   : 0,
              left  : 0,
              right : arg.values[0].length,
              bottom: arg.values.length,
            });
          }
        } else {
          v.step = 4.4; // シート不在で初期データ無し
          this.values = [];
        }
      } else {
        v.step = 4.5; // シートが存在
        this.values = v.convert({
          data  : v.getValues,
          top   : this.top,
          left  : this.left,
          right : this.right + 1, // 等号無しで判定するので+1
          bottom: this.bottom + 1, // 同上
        });
      }

      v.step = 4.6; // 末尾行番号の確定
      this.bottom = this.top + this.values.length;
      vlog(this,['values','top','left','right','bottom'],v);

      // ----------------------------------------------
      v.step = 5; // シート未作成の場合、追加
      // ----------------------------------------------
      if( this.sheet === null ){

        v.step = 5.1; // this.schema.colsからヘッダ行作成
        v.sheetImage = [this.schema.cols.map(x => x.name)];

        v.step = 5.2; // this.valuesをシートイメージに変換
        for( v.i=0 ; v.i<this.values.length ; v.i++ ){
          v.row = [];
          for( v.j=0 ; v.j<v.sheetImage[0].length ; v.j++ ){
            v.row[v.j] = this.values[v.i][v.sheetImage[0][v.j]]
          }
          v.sheetImage.push(v.row);
        }

        v.step = 5.3; // シートの追加
        this.sheet = this.spread.insertSheet();
        this.sheet.setName(this.sheetName);

        v.step = 5.4; // シートイメージのセット
        this.sheet.getRange(
          this.top,
          this.left,
          this.bottom - this.top + 1,
          this.right - this.left + 1
        ).setValues(v.sheetImage);

        v.step = 5.5; // 項目定義メモの追加
        v.notes = [];
        this.schema.cols.forEach(x => {
          v.r = x.getNote();
          if( v.r instanceof Error ) throw v.r;
          v.notes.push(v.r);
        });
        this.sheet.getRange(this.top,this.left,1,v.notes.length).setNotes([v.notes]);      
      }

      // ------------------------------------------------
      v.step = 6; // this.schema.unique,auto_incrementに
      // データスキャンの結果を反映
      // ------------------------------------------------
      v.unique = Object.keys(this.schema.unique);
      v.auto_increment = Object.keys(this.schema.auto_increment);
      for( v.i=0 ; v.i<this.values.length ; v.i++ ){

        v.step = 6.1; // this.schema.uniqueに設定されている値をMapに追加
        for( v.j=0 ; v.j<v.unique.length ; v.j++ ){
          v.map = this.schema.unique[v.unique[v.j]];
          v.val = this.values[v.i][v.unique[v.j]];
          if( v.map.indexOf(v.val) < 0 ){
            v.map.push(v.val);
          } else {
            throw new Error(`「${v.unique[v.j]}」欄の値"${v.val}"は重複しています`);
          }
        }

        v.step = 6.2; // this.schema.auto_incrementの最大(小)値をcurrentにセット
        for( v.j=0 ; v.j<v.auto_increment.length ; v.j++ ){
          v.obj = this.schema.auto_increment[v.auto_increment[v.j]];
          v.val = this.values[v.i][v.auto_increment[v.j]];
          if( v.obj.step > 0 && v.obj.current < v.val
            || v.obj.step < 0 && v.obj.current > v.val ){
            v.obj.current = v.val;
          }
        }
      }
      vlog(this,['unique','auto_increment'],v)

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** append: 領域に新規行を追加
   * @param {Object|Object[]} records=[] - 追加するオブジェクトの配列
   * @returns {Object} {success:[],failure:[]}形式
   */
  append(records){
    const v = {whois:'sdbTable.append',step:0,rv:{success:[],failure:[],log:[]},
      cols:[],sheet:[]};
    console.log(`${v.whois} start.\nrecords(${whichType(records)})=${stringify(records)}`);
    try {

      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** update: 領域に新規行を追加
   * @param {Object|Object[]} records=[] - 追加するオブジェクトの配列
   * @returns {Object} {success:[],failure:[]}形式
   */
  update(records){
    const v = {whois:'sdbTable.update',step:0,rv:{success:[],failure:[],log:[]},
      cols:[],sheet:[]};
    console.log(`${v.whois} start.\nrecords(${whichType(records)})=${stringify(records)}`);
    try {

      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** delete: 領域に新規行を追加
   * @param {Object|Object[]} records=[] - 追加するオブジェクトの配列
   * @returns {Object} {success:[],failure:[]}形式
   */
  delete(records){
    const v = {whois:'sdbTable.delete',step:0,rv:{success:[],failure:[],log:[]},
      cols:[],sheet:[]};
    console.log(`${v.whois} start.\nrecords(${whichType(records)})=${stringify(records)}`);
    try {

      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
}
