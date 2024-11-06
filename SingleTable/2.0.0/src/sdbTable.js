/** sdbTable: シート上の対象範囲(テーブル) */
this.sdbTable = class {
  /** @constructor
   * @param table {Object}
   * @param table.spread {SpreadSheet} - スプレッドシート
   * @param table.range {string} - A1記法の範囲指定
   * @param table.schema {sdbSchema[]} - 新規作成シートの項目定義オブジェクトの配列
   * @param table.values {Object[]|Array[]} - 新規作成シートに書き込む初期値
   * @returns
   */
  constructor(range,opt={}){
    const v = {whois:'sdbTable.constructor',step:0,rv:null,
      getDataRange:null, getValues:null, getNotes:null,
      colNo: table => { // 列記号を列番号に変換
        let rv=0;
        for( let b='a'.charCodeAt(0)-1,s=table.toLowerCase(),i=0 ; i<table.length ; i++ ){
          rv = rv * 26 + s.charCodeAt(i) - b;
        }
        return rv;
      },
    };
    console.log(`${v.whois} start.\nrange=${range}\nopt=${stringify(opt)}`);
    try {

      // ----------------------------------------------
      v.step = 1; // メンバの初期化、既定値設定
      // ----------------------------------------------
      this.range = null; // {string} A1記法の範囲指定
      this.sheetName = null; // {string} シート名。this.rangeから導出
      this.sheet = null; // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
      this.schema = null; // {sdbSchema[]} シートの項目定義
      this.values = null; // {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
      this.top = null; // {number} ヘッダ行の行番号(自然数)。データ領域は次行から。
      this.left = null; // {number} データ領域左端の列番号(自然数)
      this.right = null; // {number} データ領域右端の列番号(自然数)
      this.bottom = null; // {number} データ領域下端の行番号(自然数)


      // ----------------------------------------------
      v.step = 2; // 引数'range'から対象範囲絞り込み
      // ----------------------------------------------
      // range(対象データ範囲のA1記法)から指定範囲を特定、メンバに保存
      // ※ この段階では"a2:c"(⇒bottom不明)等、未確定部分が残る
      v.m = range.match(/^'?(.+?)'?!([A-Za-z]*)([0-9]*):?([A-Za-z]*)([0-9]*)$/);
      if( v.m ){  // rangeがA1記法で指定された場合
        this.sheetName = v.m[1];
        this.left = v.m[2] ? v.colNo(v.m[2]) : 1;
        this.top = v.m[3] ? Number(v.m[3]) : 1;
        this.right = v.m[4] ? v.colNo(v.m[4]) : Infinity;
        this.bottom = v.m[5] ? Number(v.m[5]) : Infinity;
        if( this.left > this.right ) [this.left, this.right] = [this.right, this.left];
        if( this.top > this.bottom ) [this.top, this.bottom] = [this.bottom, this.top];
      } else {    // rangeが非A1記法 ⇒ range=シート名
        this.sheetName = range;
        this.top = this.left = 1;
        this.bottom = this.right = Infinity;
      }

      // ----------------------------------------------
      v.step = 3; // シートの存否確認、データ取得
      // ----------------------------------------------
      this.sheet = (table.spread || SpreadsheetApp.getActiveSpreadsheet()).getSheetByName(this.sheetName);
      v.isExist = this.sheet !== null ? true : false;
      if( v.isExist ){
        v.step = 2.11; // シートイメージの読み込み
        v.getDataRange = this.sheet.getDataRange();
        v.getValues = v.getDataRange.getValues();

        v.step = 2.12; // 範囲確定。A1記法とデータ範囲のどちらか小さい方
        this.right = Math.min(this.right, v.getValues[0].length);
        this.bottom = Math.min(this.bottom, v.getValues.length);

        v.step = 2.13; // 項目定義メモの読み込み
        v.getNotes  = v.getRange(this.top,this.left,1,this.right-this.left+1).getNotes()[0];
      } else if( table.values === null ){
        throw new Error(`シートも初期化データも存在しません`);
      }

      // ----------------------------------------------
      v.step = 4; // this.schema, this.valuesの作成
      // ----------------------------------------------
      this.schema = new sdbSchema({cols: table.schema,values:table.values,notes:v.getNotes});
      if( this.schema instanceof Error ) throw this.schema;

      if( v.getValues !== null ){
        this.values = [];
        v.header = this.schema.cols.map(x => x.name);
        for( v.i=1 ; v.i<this.bottom ; v.i++ ){
          this.values[v.i-1] = {};
          for( v.j=0 ; v.j<v.header.length ; v.j++ ){
            if( v.getValues[v.i][v.j] ){
              this.values[v.i-1][v.header[v.j]] = v.getValues[v.i][v.j];
            }
          }
        }
      } else {
        this.values = table.values;
      }

      // ----------------------------------------------
      v.step = 5; // その他メンバの設定
      // ----------------------------------------------
      this.primaryKey = null;
      this.unique = {};
      this.auto_increment = {};
      this.defaultRow = {};
      for( v.i=0 ; v.i<this.schema.cols.length ; v.i++ ){
        v.col = this.schema.cols[v.i];

        if( v.col.primaryKey === true ){
          this.primaryKey = v.col.name;
          this.unique[v.col.name] = [];
        }

        if( v.col.unique === true ){
          this.unique[v.col.name] = [];
        }

        if( v.col.auto_increment !== false ){
          this.auto_increment[v.col.name] = v.col.auto_increment;
          this.auto_increment[v.col.name].current = this.auto_increment[v.col.name].base;
        }

        if( v.col.default !== null ){
          this.defaultRow[v.col.name] = v.col.default;
        }
      }

      for( v.i=0 ; v.i<this.values.length ; v.i++ ){
        // this.schema.uniqueに設定されている値をMapに追加
        Object.keys(this.unique).forEach(x => {
          if( this.unique[x].indexOf(this.values[v.i][x]) < 0 ){
            this.unique[x].push(this.values[v.i][x]);
          } else {
            throw new Error(`${x}の値${this.values[v.i][x]}は重複しています`);
          }
        });

        // this.schema.auto_incrementの最大(小)値をcurrentにセット
        Object.keys(this.auto_increment).forEach(x => {
          if( (this.auto_increment[x].step > 0 &&
            this.values[v.i][x] > this.auto_increment[x].current)
            || (this.auto_increment[x].step < 0 &&
            this.values[v.i][x] < this.auto_increment[x].current) ){
            this.auto_increment[x].current = this.values[v.i][x];
          }
        });
      }

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
    const v = {whois:this.constructor.name+'.append',step:0,rv:{success:[],failure:[],log:[]},
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
    const v = {whois:this.constructor.name+'.update',step:0,rv:{success:[],failure:[],log:[]},
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
    const v = {whois:this.constructor.name+'.delete',step:0,rv:{success:[],failure:[],log:[]},
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