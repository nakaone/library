class SpreadDB {
  /** @constructor
   * @param tables {Object|Object[]} 対象領域情報(sdbTable.constructor()の引数オブジェクト)の配列
   * @param opt {Object}={}
   * @param opt.outputLog {boolean}=true ログ出力しないならfalse
   * @param opt.logSheetName {string}='log' 更新履歴シート名
   * @param opt.account {number|string}=null 更新者のアカウント
   * @param opt.maxTrial {number}=5 シート更新時、ロックされていた場合の最大試行回数
   * @param opt.interval {number}=2500 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
   * @returns {SpreadDB|Error}
   */
  constructor(tables,opt={}){
    const v = {whois:this.constructor.name+'.constructor',step:0,rv:null};
    console.log(`${v.whois} start.`);
    try {
  
      // -------------------------------------------------------------
      // 1. 事前準備
      // -------------------------------------------------------------
      v.step = 1; // メンバの初期化
      // spread {Spreadsheet} スプレッドシートオブジェクト(=ファイル。シートの集合)
      this.spread = SpreadsheetApp.getActiveSpreadsheet();
      // tables {Object.<string,sdbTable>} 操作対象シートの情報。メンバ名はテーブル名。
      this.tables = {};
  
      v.step = 2; // 引数tablesが配列でない場合、配列に変換(以降で統一的に処理するため)
      v.tables = Array.isArray(tables) ? tables : [tables];
      for( v.i=0 ; v.i<v.tables.length ; v.i++ ){
        // 文字列ならname属性指定と看做す
        if(whichType(v.tables[v.i],'String')){
          v.tables[v.i] = {name: v.tables[v.i]};
        };
      }
  
      v.step = 3; // 引数「opt」の設定値をメンバとして登録
      v.opt = mergeDeeply(opt,{
        outputLog: true,
        logSheetName: 'log',
        account: null,
        maxTrial: 5,
        interval: 2500,
        values: null,
        schema: null,
      });
      Object.keys(v.opt).forEach(x => this[x] = v.opt[x]);
  
      v.step = 4; // 更新履歴を残す場合、変更履歴シートを他シートに先行して準備
      if( this.outputLog === true ){
        this.log = this.tables[this.logSheetName] = new sdbTable({
          spread: this.spread,
          name: this.logSheetName,
          cols: sdbLog.typedef(),
        });
        if( this.log instanceof Error ) throw this.log;
      } else {
        this.log = null;
      }
  
      v.step = 5; // 対象テーブルのインスタンス化
      v.tables.forEach(x => {
        // sdbTableインスタンス生成時、spreadが必要になるので追加しておく
        x.spread = this.spread;
        x.log = this.log;
        x.account = this.account;
        v.r = new sdbTable(x);
        if( v.r instanceof Error ) throw v.r;
        this.tables[x.name] = v.r;
      });
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** transact: シートの操作
   *
   * @param trans {Object|Object[]} - 以下のメンバを持つオブジェクト(の配列)
   * @param trans.name {string} - 更新対象範囲名
   * @param trans.action {string} - 操作内容。"append", "update", "delete"のいずれか
   * @param trans.arg {Object|Object[]} - append/update/deleteの引数
   * @param opt={} {Object} - オプション
   * @param opt.getLogFrom=null {string|number|Date} - 取得する更新履歴オブジェクトの時刻指定
   * @param opt.getLogOption={} {Object} - getLogFrom≠nullの場合、getLogメソッドのオプション
   * @returns {Object|Object[]} opt.getLogForm=nullの場合、更新履歴オブジェクトの配列。≠nullの場合、{result:更新履歴オブジェクトの配列,data:getLogの戻り値}
   *
   * - GAS公式 Class LockService [getDocumentLock()](https://developers.google.com/apps-script/reference/lock/lock-service?hl=ja#getDocumentLock())
   * - Qiita [GASの排他制御（ロック）の利用方法を調べた](https://qiita.com/kyamadahoge/items/f5d3fafb2eea97af42fe)
   */
  transact(trans,opt={}){
    const v = {whois:this.constructor.name+'.transact',step:0,rv:[]};
    console.log(`${v.whois} start.\ntrans(${whichType(trans)})=${stringify(trans)}\nopt=${stringify(opt)}`);
    try {
  
      v.step = 1; // 事前準備
      v.step = 1.1; // 引数transを配列化
      if( !Array.isArray(trans) ) trans = [trans];
      v.step = 1.2; // オプションに既定値を設定
      v.opt = Object.assign({
        getLogFrom: null,
        getLogOption: {},
      },opt);
  
      v.step = 2; // スプレッドシートをロックして更新処理
      v.lock = LockService.getDocumentLock();
  
      for( v.tryNo=this.maxTrial ; v.tryNo > 0 ; v.tryNo-- ){
        if( v.lock.tryLock(this.interval) ){
    
          v.step = 2.1; // シートの更新処理
          for( v.i=0 ; v.i<trans.length ; v.i++ ){
            if( ['append','update','delete'].find(x => x === trans[v.i].action) ){
              v.r = this.tables[trans[v.i].name][trans[v.i].action](trans[v.i].arg);
              if( v.r instanceof Error ) throw v.r;
              v.rv = [...v.rv, ...v.r];
            }
          }
    
          v.step = 2.2; // 更新履歴の取得
          if( v.opt.getLogFrom !== null ){
            v.r = this.getLog(v.opt.getLogFrom,v.opt.getLogOption);
            if( v.r instanceof Error ) throw v.r;
            v.rv = {result:v.rv,data:v.r};
          }
    
          v.step = 2.3; // ロック解除
          v.lock.releaseLock();
          v.tryNo = 0;
        }
      }
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** getLog: 指定時刻以降の変更履歴を取得
   * @param datetime=null {string} - Date型に変換可能な日時文字列
   * @param opt={} {Object} - オプション
   * @param opt.cols=null {boolean} 各項目の定義集も返す
   * @param opt.excludeErrors=true {boolean} エラーログを除く
   * @param opt.simple=true {boolean} 戻り値のログ情報の項目を絞り込む
   * @returns {Object} {success:[],failure:[]}形式
   */
  getLog(datetime=null,opt={}){
    const v = {whois:this.constructor.name+'.delete',step:0,rv:{}};
    console.log(`${v.whois} start.\ndatetime(${whichType(datetime)})=${stringify(datetime)}\nopt(${whichType(opt)})=${stringify(opt)}`);
    try {
  
      v.step = 1; // 事前準備
      v.datetime = datetime === null ? -Infinity : new Date(datetime).getTime();
      v.opt = Object.assign({
        cols: datetime === null ? true : false,
        excludeErrors: true,
        simple: true,
      },opt);
  
      v.step = 2; // 戻り値lastReferenceの設定
      v.rv.lastReference = toLocale(new Date());
  
      v.step = 3; // 戻り値colsの設定
      if( v.opt.cols ){
        v.rv.cols = {};
        for( v.table in this.tables ){
          // colsの未定義項目(値がnullの項目)は削除
          v.rv.cols[v.table] = [];
          for( v.i=0 ; v.i<this.tables[v.table].schema.cols.length ; v.i++ ){
            v.o = {};
            Object.keys(this.tables[v.table].schema.cols[v.i]).forEach(x => {
              if( this.tables[v.table].schema.cols[v.i][x] !== (x === 'auto_increment' ? false : null) ){
                v.o[x] = this.tables[v.table].schema.cols[v.i][x];
              }
            });
            v.rv.cols[v.table].push(v.o);
          }          
        }
      }
  
      v.step = 4; // 戻り値logの設定
      v.rv.log = [];
      for( v.i=0 ; v.i<this.log.values.length ; v.i++ ){
        v.l = this.log.values[v.i];
        if( new Date(v.l.timestamp).getTime() > v.datetime ){
          if( v.l.result === false && v.opt.excludeErrors === true ) continue;
          if( v.opt.simple ){
            v.rv.log.push({
              range: v.l.range,
              action: v.l.action,
              record: v.l.after || v.l.before,
            });
          } else {
            v.rv.log.push(v.l);
          }
        }
      }
  
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
/** sdbTable: シート上の対象範囲(テーブル) */
class sdbTable {
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
      this.spread = arg.spread; // || SpreadsheetApp.getActiveSpreadsheet();
      this.name = arg.name; // {string} テーブル名
      this.range = arg.range || arg.name; // {string} A1記法の範囲指定
      this.log = arg.log || null; // {sdbTable} 変更履歴シート
      this.account = arg.account || null; // {string} 更新者のアカウント
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
  
        v.step = 3.12; // 範囲絞り込み(未確定)。A1記法とデータ範囲のどちらか小さい方
        this.right = Math.min(this.right, v.getValues[0].length);
        this.bottom = Math.min(this.bottom, v.getValues.length);
  
        v.step = 3.13; // ヘッダ行のシートイメージ(項目一覧)
        v.schemaArg.header = v.getValues[this.top-1].slice(this.left-1,this.right);
  
        v.step = 3.14; // 項目定義メモの読み込み
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
      v.convert = o => { // top,left,right,bottomは全てシートベースの行列番号(自然数)で計算
        // 先頭〜末尾の途中に全項目が空欄の行があれば、空オブジェクトを作成するが、
        // 末尾行以降の全項目空欄行はスキップする
        v.obj = []; v.flag = false;
        for( v.i=o.bottom-1 ; v.i>=o.top ; v.i-- ){
          v.o = {};
          for( v.j=o.left-1 ; v.j<o.right ; v.j++ ){
            if( o.data[v.i][v.j] ){
              v.o[o.data[o.top-1][v.j]] = o.data[v.i][v.j];
              v.flag = true;
            }
          }
          if( v.flag === true ) v.obj.unshift(v.o);
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
              top   : 1,  // シート上に展開した場合の先頭行番号
              left  : 1,  // 同、左端列番号
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
          right : this.right,
          bottom: this.bottom,
        });
      }
      v.step = 4.6; // 末尾行番号の確定
      this.bottom = this.top + this.values.length;
      vlog(this,['name','top','left','right','bottom','values'],v)
  
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
      v.step = 6; // unique,auto_incrementの作成
      // ------------------------------------------------
      v.step = 6.1; // unique項目の値を洗い出し
      this.values.forEach(vObj => {
        Object.keys(this.schema.unique).forEach(unique => {
          if( vObj[unique] ){
            if( this.schema.unique[unique].indexOf(vObj[unique]) < 0 ){
              this.schema.unique[unique].push(vObj[unique]);
            } else {
              throw new Error(`${v.whois}:「${unique}」欄の値"${vObj[unique]}"は重複しています`);
            }
          }
        });
  
        v.step = 6.2; // auto_increment項目の値を洗い出し
        Object.keys(this.schema.auto_increment).forEach(ai => {
          v.c = this.schema.auto_increment[ai].current;
          v.s = this.schema.auto_increment[ai].step;
          v.v = Number(vObj[ai]);
          if( (v.s > 0 && v.c < v.v) || (v.s < 0 && v.c > v.v) ){
            this.schema.auto_increment[ai].current = v.v;
          }
        });
      });
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** append: 領域に新規行を追加
   * @param {Object|Object[]} record=[] - 追加するオブジェクトの配列
   * @returns {sdbLog[]}
   */
  append(record){
    const v = {whois:'sdbTable.append',step:0,rv:[],argument:JSON.stringify(record)};
    console.log(`${v.whois} start.\nrecord(${whichType(record)})=${stringify(record)}`);
    try {
  
      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------
      if( !Array.isArray(record)) record = [record];
      v.target = [];  // 対象領域のシートイメージを準備
      v.log = []; // 更新履歴のシートイメージを準備
  
      // ------------------------------------------------
      v.step = 2; // 追加レコードをシートイメージに展開
      // ------------------------------------------------
      v.header = this.schema.cols.map(x => x.name);
      for( v.i=0 ; v.i<record.length ; v.i++ ){
  
        v.logObj = new sdbLog({account: this.account,range: this.name,
          action:'append',argument:v.argument});
  
        v.step = 2.1; // auto_increment項目の設定
        // ※ auto_increment設定はuniqueチェックに先行
        for( v.ai in this.schema.auto_increment ){
          if( !record[v.i][v.ai] ){
            this.schema.auto_increment[v.ai].current += this.schema.auto_increment[v.ai].step;
            record[v.i][v.ai] = this.schema.auto_increment[v.ai].current;
          }
        }
  
        v.step = 2.2; // 既定値の設定
        record[v.i] = Object.assign({},this.schema.defaultRow,record[v.i]);
  
        v.step = 2.3; // 追加レコードの正当性チェック(unique重複チェック)
        for( v.unique in this.schema.unique ){
          if( this.schema.unique[v.unique].indexOf(record[v.i][v.unique]) >= 0 ){
            // 登録済の場合はエラーとして処理
            v.logObj.result = false;
            // 複数項目のエラーメッセージに対応するため配列化を介在させる
            v.logObj.message = v.logObj.message === null ? [] : v.logObj.message.split('\n');
            v.logObj.message.push(`${v.unique}欄の値「${record[v.i][v.unique]}」が重複しています`);
            v.logObj.message = v.logObj.message.join('\n');
          } else {
            // 未登録の場合this.sdbSchema.uniqueに値を追加
            this.schema.unique[v.unique].push(record[v.i][v.unique]);
          }
        }
  
        v.step = 2.4; // 正当性チェックOKの場合の処理
        if( v.logObj.result ){
          v.step = 2.41; // シートイメージに展開して登録
          v.row = [];
          for( v.j=0 ; v.j<v.header.length ; v.j++ ){
            v.row[v.j] = record[v.i][v.header[v.j]];
          }
          v.target.push(v.row);
  
          v.step = 2.42; // this.valuesへの追加
          this.values.push(record[v.i]);
  
          v.step = 2.43; // ログに追加レコード情報を記載
          v.logObj.after = v.logObj.diff = JSON.stringify(record[v.i]);
        }
  
        v.step = 2.5; // 成否に関わらずログ出力対象に保存
        v.log.push(v.logObj);
      }
  
      // ------------------------------------------------
      v.step = 3; // 対象シート・更新履歴に展開
      // ------------------------------------------------
      v.step = 3.1; // 対象シートへの展開
      if( v.target.length > 0 ){
        this.sheet.getRange(
          this.bottom+1,
          this.left,
          v.target.length,
          v.target[0].length
        ).setValues(v.target);
      }
      // this.sdbTable.bottomの書き換え
      this.bottom += v.target.length;
  
      v.step = 3.2; // 変更履歴追記対象なら追記(変更履歴シートは追記対象外)
      if( this.log !== null ){
        v.r = this.log.append(v.log);
        if( v.r instanceof Error ) throw v.r;
      }
  
      v.step = 9; // 終了処理
      v.rv = v.log;
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** update: 領域に新規行を追加
   * @param {Object|Object[]} trans=[] - 更新するオブジェクトの配列
   * @param {Object|Function|any} trans.where - 対象レコードの判定条件
   * @param {Object|Function} trans.record - 更新する値
   * @returns {sdbLog[]}
   *
   * - where句の指定方法
   *   - Object ⇒ {key:キー項目名, value: キー項目の値}形式で、key:valueに該当するレコードを更新
   *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
   *   - その他 ⇒ 項目定義で"primaryKey"指定された項目の値で、primaryKey項目が指定値なら更新
   * - record句の指定方法
   *   - Object ⇒ {更新対象項目名:セットする値}
   *   - Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
   *     【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
   */
  update(trans=[]){
    const v = {whois:'sdbTable.update',step:0,rv:[],log:[],target:[],
      top:Infinity,left:Infinity,right:0,bottom:0,argument:JSON.stringify(trans),
      header: this.schema.cols.map(x => x.name), // 項目一覧
    };
    console.log(`${v.whois} start.\ntrans(${whichType(trans)})=${stringify(trans)}`);
    try {
  
      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------
  
      if( !Array.isArray(trans)) trans = [trans];
  
      // 対象となる行オブジェクト判定式の作成
      for( v.i=0 ; v.i<trans.length ; v.i++ ){
  
        v.step = 1.1; // where,recordの存否確認
        v.msg = `${v.whois}: _が指定されていません(${JSON.stringify(trans[v.i])})`;
        if( !trans[v.i].where ) throw new Error(v.msg.replace('_','位置指定(where)'));
        if( !trans[v.i].record ) throw new Error(v.msg.replace('_','更新データ(record)'));
  
        v.step = 1.2; // whereがオブジェクトまたは文字列指定なら関数化
        v.where = this.functionalize(trans[v.i].where);
        if( v.where instanceof Error ) throw v.where;
  
        v.step = 1.3; // recordがオブジェクトなら関数化
        v.record = typeof trans[v.i].record === 'function' ? trans[v.i].record
        : new Function('o',`return ${JSON.stringify(trans[v.i].record)}`);
  
        // 対象レコードか一件ずつチェック
        for( v.j=0 ; v.j<this.values.length ; v.j++ ){
  
          v.step = 2.1; // 対象外判定ならスキップ
          if( v.where(this.values[v.j]) === false ) continue;
  
          v.step = 2.2; // v.before: 更新前の行オブジェクトのコピー
          [v.before,v.after,v.diff] = [Object.assign({},this.values[v.j]),{},{}];
  
          v.step = 2.3; // v.rObj: 更新指定項目のみのオブジェクト
          v.rObj = v.record(this.values[v.j]);
  
          v.step = 2.4; // シート上の項目毎にチェック
          v.header.forEach(x => {
            if( v.rObj.hasOwnProperty(x) && !isEqual(v.before[x],v.rObj[x]) ){
              v.step = 2.41; // 変更指定項目かつ値が変化していた場合、afterとdiffに新しい値を設定
              v.after[x] = v.diff[x] = v.rObj[x];
              v.colNo = v.header.findIndex(y => y === x);
              v.left = Math.min(v.left,v.colNo);
              v.right = Math.max(v.right,v.colNo);
            } else {
              v.step = 2.42; // 非変更指定項目または変更指定項目だが値の変化が無い場合、beforeの値をセット
              v.after[x] = v.before[x];
            }
          })
  
          v.step = 2.5; // 更新履歴オブジェクトを作成
          v.logObj = new sdbLog({account:this.account,range:this.name,
            action:'update',argument:v.argument,before:v.before,after:v.after,diff:v.diff});
  
          v.step = 2.6; // 更新レコードの正当性チェック(unique重複チェック)
          for( v.unique in this.schema.unique ){
            if( this.schema.unique[v.unique].indexOf(trans[v.i][v.unique]) >= 0 ){
              v.step = 2.61; // 登録済の場合はエラーとして処理
              v.logObj.result = false;
              // 複数項目のエラーメッセージに対応するため場合分け
              v.logObj.message = (v.logObj.message === null ? '' : '\n')
              + `${v.unique}欄の値「${trans[v.i][v.unique]}」が重複しています`;
            } else {
              v.step = 2.62; // 未登録の場合this.sdbSchema.uniqueに値を追加
              this.schema.unique[v.unique].push(trans[v.i][v.unique]);
            }
          }
  
          v.step = 2.7; // 正当性チェックOKの場合の処理
          if( v.logObj.result === true ){
            v.top = Math.min(v.top, v.j);
            v.bottom = Math.max(v.bottom, v.j);
            this.values[v.j] = v.after;
          }
  
          v.step = 2.8; // 成否に関わらずログ出力対象に保存
          v.log.push(v.logObj);
        }
      }
  
      // ------------------------------------------------
      v.step = 3; // 対象シート・更新履歴に展開
      // ------------------------------------------------
      v.step = 3.1; // シートイメージ(二次元配列)作成
      for( v.i=v.top ; v.i<=v.bottom ; v.i++ ){
        v.row = [];
        for( v.j=v.left ; v.j<=v.right ; v.j++ ){
          v.row.push(this.values[v.i][v.header[v.j]] || null);
        }
        v.target.push(v.row);
      }
      vlog(v,['target','top','left'],1022)
  
      v.step = 3.2; // シートに展開
      // v.top,bottom: 最初と最後の行オブジェクトの添字(≠行番号) ⇒ top+1 ≦ row ≦ bottom+1
      // v.left,right: 左端と右端の行配列の添字(≠列番号) ⇒ left+1 ≦ col ≦ right+1
      if( v.target.length > 0 ){
        this.sheet.getRange(
          this.top + v.top +1,  // +1(添字->行番号)
          this.left + v.left,
          v.target.length,
          v.target[0].length
        ).setValues(v.target);
      }
  
      v.step = 3.3; // 変更履歴追記対象なら追記(変更履歴シートは追記対象外)
      if( this.log !== null && v.log.length > 0 ){
        v.r = this.log.append(v.log);
        if( v.r instanceof Error ) throw v.r;
      }
  
      v.step = 9; // 終了処理
      v.rv = v.log;
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** delete: 領域から指定行を物理削除
   * @param {Object|Function|any} where=[] - 対象レコードの判定条件
   * @returns {sdbLog[]}
   *
   * - where句の指定方法
   *   - Object ⇒ {key:キー項目名, value: キー項目の値}形式で、key:valueに該当するレコードを更新
   *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
   *   - その他 ⇒ 項目定義で"primaryKey"指定された項目の値で、primaryKey項目が指定値なら更新
   */
  delete(where){
    const v = {whois:'sdbTable.delete',step:0,rv:[],log:[],where:[],argument:JSON.stringify(where)};
    console.log(`${v.whois} start.\nwhere(${whichType(where)})=${stringify(where)}`);
    try {
  
      // 削除指定が複数の時、上の行を削除後に下の行を削除しようとすると添字や行番号が分かりづらくなる。
      // そこで対象となる行の添字(行番号)を洗い出した後、降順にソートし、下の行から順次削除を実行する
  
      v.step = 1.1; // 事前準備 : 引数を配列化
      if( !Array.isArray(where)) where = [where];
  
      v.step = 1.2; // 該当レコードかの判別用関数を作成
      for( v.i=0 ; v.i<where.length ; v.i++ ){
        where[v.i] = this.functionalize(where[v.i]);
        if( where[v.i] instanceof Error ) throw where[v.i];
      }
      v.step = 1.3; // 引数argのいずれかに該当する場合trueを返す関数を作成
      v.cond = o => {let rv = false;where.forEach(w => {if(w(o)) rv=true});return rv};
  
      v.step = 2; // 対象レコードか一件ずつチェック
      for( v.i=this.values.length-1 ; v.i>=0 ; v.i-- ){
  
        v.step = 2.1; // 対象外判定ならスキップ
        if( v.cond(this.values[v.i]) === false ) continue;
  
        v.step = 2.2; // 更新履歴オブジェクトを作成
        v.logObj = new sdbLog({account:this.account,range:this.name,
          action:'delete',argument:v.argument,before:this.values[v.i]});
        v.logObj.diff = v.logObj.before;
        v.log.push(v.logObj);
  
        v.step = 2.3; // 削除レコードのunique項目をthis.schema.uniqueから削除
        // this.schema.auto_incrementは削除の必要性が薄いので無視
        // ※必ずしも次回採番時に影響するとは限らず、影響したとしても欠番扱いで問題ないと判断
        for( v.unique in this.schema.unique ){
          if( this.values[v.i][v.unique] ){
            v.idx = this.schema.unique[v.unique].indexOf(this.values[v.i][v.unique]);
            if( v.idx >= 0 ) this.schema.unique[v.unique].splice(v.idx,1);
          }
        }
  
        v.step = 2.4; // this.valuesから削除
        this.values.splice(v.i,1);
  
        v.step = 2.5; // シートのセルを削除
        v.range = this.sheet.getRange(
          this.top + v.i + 1,  // +1(添字->行番号)
          this.left,
          1,
          this.right - this.left + 1,
        );
        v.range.deleteCells(SpreadsheetApp.Dimension.ROWS);
  
        v.step = 2.6; // this.bottomを書き換え
        this.bottom = this.bottom - 1;
  
      }
  
      v.step = 3; // 変更履歴追記対象なら追記(変更履歴シートは追記対象外)
      if( this.log !== null && v.log.length > 0 ){
        v.r = this.log.append(v.log);
        if( v.r instanceof Error ) throw v.r;
      }
  
      v.step = 9; // 終了処理
      v.rv = v.log;
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** functionalize: where句のオブジェクト・文字列を関数化(update/deleteで使用) */
  functionalize(arg){
    const v = {whois:'sdbTable.functionalize',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {
  
  
      switch( typeof arg ){
        case 'function': v.step = 2.1;  // 関数指定ならそのまま利用
          v.rv = arg;
          break;
        case 'object':
          v.step = 2.2;
          v.keys = Object.keys(arg);
          if( v.keys.length === 2 && v.keys.includes('key') && v.keys.includes('value') ){
            v.step = 2.3; // {key:〜,value:〜}形式での指定の場合
            v.rv = new Function('o',`return isEqual(o['${arg.key}'],'${arg.value}')`);
          } else {
            v.step = 2.4; // {キー項目名:値}形式での指定の場合
            v.c = [];
            for( v.j=0 ; v.j<v.keys.length ; v.j++ ){
              v.c.push(`isEqual(o['${v.keys[v.j]}'],'${arg[v.keys[v.j]]}')`);
            }
            v.rv = new Function('o',`return (${v.c.join(' && ')})`);
          }
          break;
        default: v.step = 2.5; // primaryKeyの値指定
          v.rv = new Function('o',`return isEqual(o['${this.schema.primaryKey}'],${arg})`);
      }
  
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
/** sdbSchema: シート上の対象範囲(テーブル)の構造定義 */
class sdbSchema {
  /** @constructor
   * @param arg {Object}
   * @param [arg.cols] {sdbColumn[]} - 項目定義オブジェクトの配列
   * @param [arg.header] {string[]} - ヘッダ行のシートイメージ(=項目名一覧)
   * @param [arg.notes] {string[]} - 項目定義メモの配列
   * @param [arg.values] {Object[]} - 初期データとなる行オブジェクトの配列
   * @returns {sdbSchema|Error}
   */
  constructor(arg={}){
    const v = {whois:'sdbSchema.constructor',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 1; // 事前準備
      v.arg = mergeDeeply(arg,{cols:null,header:null,notes:null,values:null});

      // -----------------------------------------------
      v.step = 2; // 項目定義オブジェクト(this.cols)の作成
      // -----------------------------------------------
      v.step = 2.1; // v.cols: sdbColumns.constructor()への引数
      if( Array.isArray(v.arg.notes) && v.arg.notes.join('').length > 0 ){
        v.cols = v.arg.notes;
      } else if( v.arg.cols !== null ){
        v.cols = v.arg.cols;
      } else if( Array.isArray(v.arg.header) && v.arg.header.join('').length > 0 ){
        v.cols = v.arg.header;
      } else if( v.arg.values !== null ){
        // 行オブジェクトの配列から項目名リストを作成
        v.obj = {};
        v.arg.values.forEach(o => Object.assign(v.obj,o));
        v.cols = Object.keys(v.obj);
      } else {
        throw new Error('必要な引数が指定されていません');
      }

      v.step = 2.2; // this.colsにsdbColumnsインスタンスを項目毎に生成
      this.cols = [];
      v.cols.forEach(o => {
        v.r = new sdbColumn(o);
        if( v.r instanceof Error ) throw v.r;
        this.cols.push(v.r);
      })

      // -----------------------------------------------
      v.step = 3; // this.cols以外のメンバ作成
      // -----------------------------------------------
      this.primaryKey = null;
      this.unique = {};
      this.auto_increment = {};
      this.defaultRow = {};
      v.bool = arg => {  // 引数を真偽値として評価。真偽値として評価不能ならnull
        let rv={"true":true,"false":false}[String(arg).toLowerCase()];
        return typeof rv === 'boolean' ? rv : null
      };
      for( v.i=0 ; v.i<this.cols.length ; v.i++ ){

        v.step = 3.1; // primaryKey
        if( v.bool(this.cols[v.i].primaryKey) === true ){
          this.primaryKey = this.cols[v.i].name;
          this.unique[this.cols[v.i].name] = [];
        }

        v.step = 3.2; // unique
        if( v.bool(this.cols[v.i].unique) === true ){
          this.unique[this.cols[v.i].name] = [];
        }

        v.step = 3.3; // auto_increment
        // ※sdbColumnでauto_incrementなら配列、違うならfalse設定済
        if( this.cols[v.i].auto_increment !== false ){
          this.auto_increment[this.cols[v.i].name] = this.cols[v.i].auto_increment;
          this.auto_increment[this.cols[v.i].name].current = this.auto_increment[this.cols[v.i].name].base;
        }

        v.step = 3.4; // default
        if( String(this.cols[v.i].default).toLowerCase() !== 'null' ){
          this.defaultRow[this.cols[v.i].name] = this.cols[v.i].default;
        }
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
}
/** sdbColumn: 項目定義オブジェクト */
class sdbColumn {

  static typedef(){return [
    {name:'name',type:'string',note:'項目名'},
    {name:'type',type:'string',note:'データ型。string,number,boolean,Date,JSON,UUID'},
    {name:'format',type:'string',note:'表示形式。type=Dateの場合のみ指定'},
    {name:'options',type:'number|string|boolean|Date',note:'取り得る選択肢(配列)のJSON表現。ex.["未入場","既収","未収","無料"]'},
    {name:'default',type:'number|string|boolean|Date',note:'既定値'},
    {name:'primaryKey',type:'boolean',note:'一意キー項目ならtrue'},
    {name:'unique',type:'boolean',note:'primaryKey以外で一意な値を持つならtrue'},
    {name:'auto_increment',type:'null|bloolean|number|number[]',note:'自動採番項目'
      + '\n// null ⇒ 自動採番しない'
      + '\n// boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない'
      + '\n// number ⇒ 自動採番する(基数=指定値,増減値=1)'
      + '\n// number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)'
    },
    {name:'suffix',type:'string',note:'"not null"等、上記以外のSQLのcreate table文のフィールド制約'},
    {name:'note',type:'string',note:'本項目に関する備考。create table等では使用しない'},
  ]};

  /** @constructor
   * @param arg {sdbColumn|string} - 項目定義オブジェクト、または項目定義メモまたは項目名
   * @returns {sdbColumn|Error}
   */
  constructor(arg={}){
    const v = {whois:'sdbColumn.constructor',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 1; // 引数が項目定義メモまたは項目名の場合、オブジェクトに変換
      if( whichType(arg,'String') ) arg = this.str2obj(arg);
      if( arg instanceof Error ) throw arg;

      v.step = 2; // メンバに格納
      sdbColumn.typedef().map(x => x.name).forEach(x => {
        this[x] = arg.hasOwnProperty(x) ? arg[x] : null;
      });

      v.step = 3; // auto_incrementをオブジェクトに変換
      if( this.auto_increment !== null && String(this.auto_increment).toLowerCase() !== 'false' ){
        switch( whichType(this.auto_increment) ){
          case 'Array': this.auto_increment = {
            base: this.auto_increment[0],
            step: this.auto_increment[1],
          }; break;
          case 'Number': this.auto_increment = {
            base: Number(this.auto_increment),
            step: 1,
          }; break;
          default: this.auto_increment = {
            base: 1,
            step: 1,
          };
        }
      } else {
        this.auto_increment = false;
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** str2obj: 項目定義メモの文字列(または項目名)から項目定義オブジェクトを作成
   * @param arg {string} 項目定義メモの文字列、または項目名
   * @returns {Object} 項目定義オブジェクト
   */
  str2obj(arg){
    const v = {whois:'sdbColumn.str2obj',step:0,rv:null,
      rex: /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, // コメント削除の正規表現
      isJSON: (str) => {let r;try{r=JSON.parse(str)}catch(e){r=null} return r},
    };
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 1; // コメントの削除
      arg = arg.replace(v.rex,'');

      v.step = 2; // JSONで定義されていたらそのまま採用
      v.rv = v.isJSON(arg);

      if( v.rv === null ){
        v.step = 3; // 非JSON文字列だった場合、改行で分割
        v.lines = arg.split('\n');

        v.step = 4; // 一行毎に属性の表記かを判定
        v.rv = {};
        v.lines.forEach(prop => {
          v.m = prop.trim().match(/^["']?(.+?)["']?\s*:\s*["']?(.+)["']?$/);
          if( v.m ) v.rv[v.m[1]] = v.m[2];
        });

        v.step = 5; // 属性項目が無ければ項目名と看做す
        if( Object.keys(v.rv).length === 0 ){
          v.rv = {name:arg.trim()};
        }
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** getNote: 項目定義メモの文字列を作成
   * @param opt {Object}
   * @param opt.undef=true {boolean} - 未定義の項目もコメントとして記載
   * @param opt.defined=false {boolean} - 定義済項目もデータ型・説明文をコメントとして記載
   * @returns {string} 項目定義メモの文字列
   */
  getNote(opt={}){
    const v = {whois:'sdbColumn.getNote',step:0,rv:[],prop:{}};
    console.log(`${v.whois} start.\nthis=${stringify(this)}\nopt(${whichType(opt)})=${stringify(opt)}`);
    try {

      v.step = 1; // オプションの既定値を設定
      v.opt = Object.assign({undef:true,defined:false},opt);

      v.step = 2; // 項目定義の属性を順次チェック
      v.typedef = sdbColumn.typedef();
      for( v.i=0 ; v.i<v.typedef.length ; v.i++ ){
        v.typedef[v.i] = Object.assign({type:'',note:''},v.typedef[v.i]);
        if( this[v.typedef[v.i].name] !== null ){
          // auto_incrementは配列型で記載されるよう変換
          v.val = v.typedef[v.i].name === 'auto_increment' && whichType(this.auto_increment,'Object')
          ? JSON.stringify([this.auto_increment.base,this.auto_increment.step]) : this[v.typedef[v.i].name];
          v.l = `${v.typedef[v.i].name}: ${v.val}`
            + ( v.opt.defined ? ` // {${v.typedef[v.i].type}} - ${v.typedef[v.i].note}` : '');
        } else if( v.opt.undef ){
          // 説明文をコメントとして出力する場合
          v.l = `// ${v.typedef[v.i].name}:undefined {${v.typedef[v.i].type}} - ${v.typedef[v.i].note}`;
        }
        v.rv.push(v.l);
      }

      v.step = 9; // 終了処理
      v.rv = v.rv.join('\n');
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
}
/** sdbLog: 更新履歴オブジェクトを管理、生成 */
class sdbLog {

  /** colDefs: 更新履歴シートの項目定義。sdbLog.colsDefs()で外部から参照可 */
  static typedef(){return [
    {name:'id',type:'UUID',note:'ログの一意キー項目',primaryKey:true,default:()=>Utilities.getUuid()},
    {name:'timestamp',type:'Date',note:'更新日時。yyyy-MM-ddThh:mm:ss.nnn+hh:mm形式',default:()=>toLocale(new Date())},
    {name:'account',type:'string|number',note:'更新者の識別子',default:(o={})=>o.account||null},
    {name:'range',type:'string',note:'更新対象となった範囲名(テーブル名)',default:(o={})=>o.range||null},
    {name:'action',type:'string',note:'操作内容。append/update/delete/getLogのいずれか',default:(o={})=>o.action||null},
    {name:'argument',type:'string',note:'操作関数に渡された引数',default:(o={})=>
      o.hasOwnProperty('argument')?(typeof o.argument === 'string' ? o.argument : JSON.stringify(o.argument)):null},
    {name:'result',type:'boolean',note:'true:追加・更新が成功',default:(o={})=>o.hasOwnProperty('result')?o.result:true},
    {name:'message',type:'string',note:'エラーメッセージ',default:(o={})=>o.message||null},
    {name:'before',type:'JSON',note:'更新前の行データオブジェクト',default:(o={})=>o.hasOwnProperty('before')?JSON.stringify(o.before):null},
    {name:'after',type:'JSON',note:'更新後の行データオブジェクト',default:(o={})=>o.hasOwnProperty('after')?JSON.stringify(o.after):null},
    {name:'diff',type:'JSON',note:'追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式',
      default:(o={})=>o.hasOwnProperty('diff')?JSON.stringify(o.diff):null},
  ]};

  /** @constructor
   * @param arg {Object}
   * @param arg.account {string|number} - 更新者の識別子
   * @param arg.range {string} - 更新対象となった範囲名(テーブル名)
   * @param arg.result {boolean} - true:追加・更新が成功
   * @param arg.message {string} - エラーメッセージ
   * @param arg.before {JSON} - 更新前の行データオブジェクト
   * @param arg.after {JSON} - 更新後の行データオブジェクト
   * @param arg.diff {JSON} - 追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式
   * @returns {sdbLog|Error}
   */
  constructor(arg={}){
    const v = {whois:'sdbLog.constructor',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 1;
      sdbLog.typedef().forEach(col => this[col.name] = col.default(arg));

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
}

