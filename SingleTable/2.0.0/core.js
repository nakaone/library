class SpreadDB {

  /** @constructor
   * @param table {Object|Object[]} 対象領域情報(sdbTable.constructor()の引数オブジェクト)の配列
   * @param opt {Object}={}
   * @param opt.outputLog {boolean}=true ログ出力しないならfalse
   * @param opt.logSheetName {string}='log' 更新履歴シート名
   * @param opt.account {number|string}=null 更新者のアカウント
   * @param opt.maxTrial {number}=5 シート更新時、ロックされていた場合の最大試行回数
   * @param opt.interval {number}=2500 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
   * @returns {SpreadDB|Error}
   */
  constructor(table,opt={}){
    const v = {whois:this.constructor.name+'.constructor',step:0,rv:null};
    console.log(`${v.whois} start.`);
    try {
  
      v.step = 1; // サブクラスの定義
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
        /** sdbSchema: シート上の対象範囲(テーブル)の構造定義 */
      this.sdbSchema = class {
        /** @constructor
         * @param arg {Object}
         * @param [arg.cols] {Object.<string,any>[]} - 項目定義オブジェクトの配列
         * @param [arg.values] {string[]} - 行オブジェクトの配列
         * @param [arg.notes] {string[]} - 項目定義メモの配列
         * @returns
         */
        constructor(arg={}){
          const v = {whois:'sdbSchema.constructor',step:0,rv:null};
          console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
          try {
      
            v.step = 1; // 事前準備
            v.arg = mergeDeeply(arg,{cols:null,values:null,notes:null});
      
            v.step = 2; // 項目定義オブジェクト(this.cols)の作成
            v.step = 2.1; // v.cols: sdbColumns.constructor()への引数
            if( v.arg.notes !== null ){
              v.cols = v.arg.notes;
            } else if( v.arg.cols !== null ){
              v.cols = v.arg.cols;
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
      
            v.step = 9; // 終了処理
            console.log(`${v.whois} normal end.`);
      
          } catch(e) {
            e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
            console.error(`${e.message}\nv=${stringify(v)}`);
            return e;
          }
        }
      
        getSchema(){
          const v = {whois:'sdbSchema.getSchema',step:0,rv:null};
          console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
          try {
      
            v.step = 9; // 終了処理
            console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
            return v.rv;
      
          } catch(e) {
            e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
            console.error(`${e.message}\nv=${stringify(v)}`);
            return e;
          }
        }
      
        /** getNext: auto_increment項目の次の値を取得 */
        getNext(arg){
          const v = {whois:'sdbSchema.getNext',step:0,rv:null};
          console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
          try {
      
            v.step = 9; // 終了処理
            console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
            return v.rv;
      
          } catch(e) {
            e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
            console.error(`${e.message}\nv=${stringify(v)}`);
            return e;
          }
        }
      
        /** isUnique: unique項目で、引数が登録済か判定 */
        getNext(arg){
          const v = {whois:'sdbSchema.getNext',step:0,rv:null};
          console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
          try {
      
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
        /** sdbColumn: 項目定義オブジェクト */
      this.sdbColumn = class {
        /** @constructor
         * @param arg {sdbColumn|string} - 項目定義オブジェクト、または項目定義メモまたは項目名
         * @returns {sdbColumn|Error}
         */
        constructor(arg={}){
          const v = {whois:'sdbSchema.constructor',step:0,rv:null};
          console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
          try {
      
            v.step = 1; // 項目定義オブジェクトのプロトタイプ
            this.typedef = [
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
            ];
      
            v.step = 2; // 引数が項目定義メモまたは項目名の場合、オブジェクトに変換
            if( whichType(arg,'String') ) arg = this.str2obj(arg);
            if( arg instanceof Error ) throw arg;
      
            v.step = 3; // メンバに格納
            this.typedef.map(x => x.name).forEach(x => {
              this[x] = arg.hasOwnProperty(x) ? arg[x] : null;
            });
      
            v.step = 4; // auto_incrementをオブジェクトに変換
            if( this.auto_increment !== null && this.auto_increment !== false ){
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
          const v = {whois:'sdbSchema.str2obj',step:0,rv:null,
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
              arg.split('\n').forEach(prop => {
                v.m = prop.trim().match(/^["']?(.+?)["']?\s*:\s*["']?(.+)["']?$/);
                v.rv[v.m[1]] = v.m[2];
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
      
        /** getObj: 項目定義オブジェクトの取得
         * @param {void}
         * @returns {Object} 項目定義オブジェクト
         */
        getObj(){
          const rv = {};
          this.typedef.map(x => x.name).forEach(x => {
            if( this[x] !== null ) rv[x] = this[x];
          });
          return rv;
        }
      
        /** getNote: 項目定義メモの文字列を作成
         * @param opt {Object}
         * @param opt.undef=true {boolean} - 未定義の項目もコメントとして記載
         * @param opt.defined=false {boolean} - 定義済項目もデータ型・説明文をコメントとして記載
         * @returns {string} 項目定義メモの文字列
         */
        getNote(opt){
          const v = {whois:'sdbSchema.getNote',step:0,rv:[]};
          console.log(`${v.whois} start.\nopt(${whichType(opt)})=${stringify(opt)}`);
          try {
      
            v.opt = Object.assign({undef:true,defined:false},opt);
      
            this.typedef.map(x => x.name).forEach(x => {
              if( this[x] !== null ){
                v.rv.push(`${x}: ${this[x]}`
                  + ( v.opt.defined ? ` // {${this.typedef[x].type}} - ${this.typedef[x].note}` : ''));
              } else if( v.opt.undef ){
                v.rv.push(`// ${x} {${this.typedef[x].type}} - ${this.typedef[x].note}`);
              }
            })
      
            v.step = 9; // 終了処理
            console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
            return v.rv.join('\n');
      
          } catch(e) {
            e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
            console.error(`${e.message}\nv=${stringify(v)}`);
            return e;
          }
        }
      };
      
  
      v.step = 2; // メンバの初期化、既定値設定
      this.spread = SpreadsheetApp.getActiveSpreadsheet(); // {Spreadsheet} スプレッドシートオブジェクト(=ファイル。シートの集合)
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
  
      v.step = 3; // 更新履歴シートの項目定義
      // v.tables: 作成対象テーブルリスト。引数tableが単一オブジェクトなら配列に変換
      v.tables = whichType(table,'Object') ? [table] : table;
      // ログは「range=シート名」とし、範囲指定はしない(1シート占有)。
      v.logTable = v.tables.find(x => x.range === this.logSheetName);
      if( this.outputLog && !v.logTable.schema ){
        v.logTable.schema = [  // 更新履歴シートの項目定義
          {name:'id',type:'UUID',note:'ログの一意キー項目'},
          {name:'timestamp',type:'Date',note:'更新日時。yyyy-MM-ddThh:mm:ss.nnnZ形式'},
          {name:'account',type:'string|number',note:'更新者の識別子'},
          {name:'range',type:'string',note:'更新対象となった範囲名(テーブル名)'},
          {name:'result',type:'boolean',note:'true:追加・更新が成功'},
          {name:'message',type:'string',note:'エラーメッセージ'},
          {name:'before',type:'JSON',note:'更新前の行データオブジェクト'},
          {name:'after',type:'JSON',note:'更新後の行データオブジェクト'},
          {name:'diff',type:'JSON',note:'追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式'},
        ];
      }
  
      v.step = 4; // 対象テーブルのインスタンス化
      v.step = 4.1; // 
      if( v.opt.outputLog && v.tables.map(x => x.name).indexOf(v.opt.logSheetName) < 0){
        v.tables.push(v.opt.logSheetName);
      }
      this.tables = {};
      v.tables.forEach(x => {
        x.spread = this.spread;
        v.r = new sdbTable(x);
        if( v.r instanceof Error ) throw v.r;
        this.tables[v.r.range] = v.r;
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

  /** append: 単数または複数のシートに新規行を追加
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
  
  /** update: 単数または複数のシートの行を更新
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
  
  /** delete: 単数または複数のシートから行を削除
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

  /** getDiff: 指定時刻以降の変更履歴を取得
   * @param {Object|Object[]} records=[] - 追加するオブジェクトの配列
   * @returns {Object} {success:[],failure:[]}形式
   */
  getDiff(records){
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

