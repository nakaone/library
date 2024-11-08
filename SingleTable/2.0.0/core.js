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
      v.step = 1; // サブクラスの定義
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
                if( arg.values && Array.isArray(arg.values) ){
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
      
        /** sdbSchema: シート上の対象範囲(テーブル)の構造定義 */
      const sdbSchema = class {
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
            if( v.arg.notes !== null ){
              v.cols = v.arg.notes;
            } else if( v.arg.cols !== null ){
              v.cols = v.arg.cols;
            } else if( v.arg.header !== null ){
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
            for( v.i=0 ; v.i<this.cols.length ; v.i++ ){
      
              v.step = 3.1; // primaryKey
              if( this.cols[v.i].primaryKey === true ){
                this.primaryKey = this.cols[v.i].name;
                this.unique[this.cols[v.i].name] = [];
              }
      
              v.step = 3.2; // unique
              if( this.cols[v.i].unique === true ){
                this.unique[this.cols[v.i].name] = [];
              }
      
              v.step = 3.3; // auto_increment
              // ※sdbColumnでauto_incrementなら配列、違うならfalse設定済
              if( this.cols[v.i].auto_increment !== false ){
                this.auto_increment[this.cols[v.i].name] = this.cols[v.i].auto_increment;
                this.auto_increment[this.cols[v.i].name].current = this.auto_increment[this.cols[v.i].name].base;
              }
      
              v.step = 3.4; // default
              if( this.cols[v.i].default !== null ){
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
      const sdbColumn = class {
        /** @constructor
         * @param arg {sdbColumn|string} - 項目定義オブジェクト、または項目定義メモまたは項目名
         * @returns {sdbColumn|Error}
         */
        constructor(arg={}){
          const v = {whois:'sdbColumn.constructor',step:0,rv:null};
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
          const v = {whois:'sdbColumn.getNote',step:0,rv:[]};
          console.log(`${v.whois} start.\nthis=${stringify(this)}\nopt(${whichType(opt)})=${stringify(opt)}`);
          try {
      
            v.step = 1; // オプションの既定値を設定
            v.opt = Object.assign({undef:true,defined:false},opt);
      
            v.step = 2; // 項目定義の属性を順次チェック
            this.typedef.map(x => x.name).forEach(x => {
              v.typedef = Object.assign({type:'',note:''},this.typedef.find(y => y.name === x));
              if( this[x] !== null ){
                v.l = `${x}: ${this[x]}`
                  + ( v.opt.defined ? ` // {${v.typedef.type}} - ${v.typedef.note}` : '');
              } else if( v.opt.undef ){
                // 説明文をコメントとして出力する場合
                v.l = `// ${x} {${v.typedef.type}} - ${v.typedef.note}`;
              }
              v.rv.push(v.l);
            })
      
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
  
      v.step = 2; // メンバの初期化
      // spread {Spreadsheet} スプレッドシートオブジェクト(=ファイル。シートの集合)
      this.spread = SpreadsheetApp.getActiveSpreadsheet();
      // tables {Object.<string,sdbTable>} 操作対象シートの情報。メンバ名はテーブル名。
      this.tables = {};
  
      v.step = 3; // 引数tablesが配列でない場合、配列に変換(以降で統一的に処理するため)
      v.tables = Array.isArray(tables) ? tables : [tables];
  
      v.step = 4; // 引数「opt」の設定値をメンバとして登録
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
  
      v.step = 5; // 更新履歴を残す場合、作成対象テーブルリストに更新履歴シートを追加
      if( this.outputLog === true ){
        // 作成対象テーブルリストに更新履歴が入っていないか確認、入ってなければリストに追加
        if( v.tables.map(x => x.name).indexOf(this.logSheetName) < 0 ){
          v.tables.push({
            name: this.logSheetName,
            cols: [  // 更新履歴シートの項目定義
              {name:'id',type:'UUID',note:'ログの一意キー項目',primaryKey:true},
              {name:'timestamp',type:'Date',note:'更新日時。yyyy-MM-ddThh:mm:ss.nnnZ形式'},
              {name:'account',type:'string|number',note:'更新者の識別子'},
              {name:'range',type:'string',note:'更新対象となった範囲名(テーブル名)'},
              {name:'result',type:'boolean',note:'true:追加・更新が成功'},
              {name:'message',type:'string',note:'エラーメッセージ'},
              {name:'before',type:'JSON',note:'更新前の行データオブジェクト'},
              {name:'after',type:'JSON',note:'更新後の行データオブジェクト'},
              {name:'diff',type:'JSON',note:'追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式'},
            ],
          });
        }
      }
  
      v.step = 6; // 対象テーブルのインスタンス化
  
      v.tables.forEach(x => {
        // sdbTableインスタンス生成時、spreadが必要になるので追加しておく
        x.spread = this.spread;
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

