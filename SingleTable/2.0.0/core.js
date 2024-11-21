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
            v.convert = o => { // top,left,right,bottomは全てシートベースの行列番号(自然数)で計算
              v.obj = [];
              for( v.i=o.top,v.cnt=0 ; v.i<o.bottom ; v.i++,v.cnt++ ){
                v.obj[v.cnt] = {};
                for( v.j=o.left-1 ; v.j<o.right ; v.j++ ){
                  if( o.data[v.i][v.j] ){
                    v.obj[v.cnt][o.data[o.top-1][v.j]] = o.data[v.i][v.j];
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
              v.step = 4.5; // 末尾行番号の確定
              this.bottom = this.top + this.values.length;
            } else {
              v.step = 4.6; // シートが存在
              this.values = v.convert({
                data  : v.getValues,
                top   : this.top,
                left  : this.left,
                right : this.right,
                bottom: this.bottom,
              });
            }
            vlog(this,'values',v);
      
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
         * @param {Object|Object[]} records=[] - 追加するオブジェクトの配列
         * @returns {sdbLog[]}
         */
        append(records){
          const v = {whois:'sdbTable.append',step:0,rv:[]};
          console.log(`${v.whois} start.\nrecords(${whichType(records)})=${stringify(records)}`);
          try {
      
            // ------------------------------------------------
            v.step = 1; // 事前準備
            // ------------------------------------------------
            if( !Array.isArray(records)) records = [records];
            v.target = [];  // 対象領域のシートイメージを準備
            v.log = []; // 更新履歴のシートイメージを準備
      
            // ------------------------------------------------
            v.step = 2; // 追加レコードをシートイメージに展開
            // ------------------------------------------------
            v.header = this.schema.cols.map(x => x.name);
            for( v.i=0 ; v.i<records.length ; v.i++ ){
      
              v.logObj = new sdbLog({account: this.account,range: this.name});
              console.log(`l.545 logObj=${stringify(v.logObj)}`)
      
              v.step = 2.1; // auto_increment項目の設定
              // ※ auto_increment設定はuniqueチェックに先行
              for( v.ai in this.schema.auto_increment ){
                if( !records[v.i][v.ai] ){
                  this.schema.auto_increment[v.ai].current += this.schema.auto_increment[v.ai].step;
                  records[v.i][v.ai] = this.schema.auto_increment[v.ai].current;
                }
              }
      
              v.step = 2.2; // 既定値の設定
              records[v.i] = Object.assign({},this.schema.defaultRow,records[v.i]);
      
              v.step = 2.3; // 追加レコードの正当性チェック(unique重複チェック)
              for( v.unique in this.schema.unique ){
                if( this.schema.unique[v.unique].indexOf(records[v.i][v.unique]) >= 0 ){
                  // 登録済の場合はエラーとして処理
                  v.logObj.result = false;
                  // 複数項目のエラーメッセージに対応するため場合分け
                  v.logObj.message = (v.logObj.message === null ? '' : '\n')
                  + `${v.unique}欄の値「${records[v.i][v.unique]}」が重複しています`;
                } else {
                  // 未登録の場合this.sdbSchema.uniqueに値を追加
                  this.schema.unique[v.unique].push(records[v.i][v.unique]);
                }
              }
      
              v.step = 2.4; // 正当性チェックOKの場合の処理
              if( v.logObj.result ){
                v.step = 2.41; // シートイメージに展開して登録
                v.row = [];
                for( v.j=0 ; v.j<v.header.length ; v.j++ ){
                  v.row[v.j] = records[v.i][v.header[v.j]];
                }
                v.target.push(v.row);
      
                v.step = 2.42; // this.valuesへの追加
                this.values.push(records[v.i]);
      
                v.step = 2.43; // ログに追加レコード情報を記載
                v.logObj.after = v.logObj.diff = JSON.stringify(records[v.i]);
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
         * @param {Object|Function|any} where - 対象レコードの判定条件
         * @param {Object|Function} data - 更新する値
         * @returns {sdbLog[]}
         * 
         * - where句の指定方法
         *   - Object ⇒ {key:キー項目名, value: キー項目の値}形式で、key:valueに該当するレコードを更新
         *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
         *   - その他 ⇒ 項目定義で"primaryKey"指定された項目の値で、primaryKey項目が指定値なら更新
         * - data句の指定方法
         *   - Object ⇒ {更新対象項目名:セットする値}
         *   - Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
         *     【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
         */
        update(trans=[]){
          const v = {whois:'sdbTable.update',step:0,rv:[],log:[],target:[],
            top:Infinity,left:Infinity,right:0,bottom:0,
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
      
              v.step = 1.1; // where,dataの存否確認
              v.msg = `${v.whois}: _が指定されていません(${JSON.stringify(trans[v.i])})`;
              if( !trans[v.i].where ) throw new Error(v.msg.replace('_','位置指定(where)'));
              if( !trans[v.i].data ) throw new Error(v.msg.replace('_','更新データ(data)'));
      
              v.step = 1.2; // whereがオブジェクトまたは文字列指定なら関数化
              v.where = typeof trans[v.i].where === 'function' ? trans[v.i].where
              : new Function('o','return isEqual(' + ( typeof trans[v.i].where === 'object'
                ? `o['${trans[v.i].where.key}'],'${trans[v.i].where.value}'`
                : `o['${this.schema.primaryKey}'],'${trans[v.i].where}'`
              ) + ');');
      
              v.step = 1.3; // dataがオブジェクトなら関数化
              v.data = typeof trans[v.i].data === 'function' ? trans[v.i].data
              : new Function('o',`return ${JSON.stringify(trans[v.i].data)}`);
              vlog(v,['where','data'],670);
      
              // 対象レコードか一件ずつチェック
              for( v.j=0 ; v.j<this.values.length ; v.j++ ){
      
                v.step = 2.1; // 対象外判定ならスキップ
                if( v.where(this.values[v.j]) === false ) continue;
      
                v.step = 2.2; // 更新履歴オブジェクトを作成
                v.logObj = new sdbLog({account:this.account,range:this.name,
                  before:JSON.parse(JSON.stringify(this.values[v.j])),after:{},diff:{}});
      
                v.step = 2.3; // v.after: 更新指定項目のみのオブジェクト
                v.after = v.data(this.values[v.j]);
                vlog(v,['logObj','after'],684)
      
                v.step = 2.4; // シート上の項目毎にチェック
                v.header.forEach(x => {
                  //console.log(`l.688 x=${x},v.after=${JSON.stringify(v.after)}\nv.logObj.before[${x}]=${v.logObj.before[x]}\nv.after[${x}]=${v.after[x]}\nisEqual=${isEqual(v.logObj.before[x],v.after[x])}`)
                  if( v.after.hasOwnProperty(x) && !isEqual(v.logObj.before[x],v.after[x]) ){
                    v.step = 2.41; // 変更指定項目かつ値が変化していた場合、afterとdiffに新しい値を設定
                    v.logObj.after[x] = v.logObj.diff[x] = v.after[x];
                    v.colNo = v.header.findIndex(y => y === x);
                    v.left = Math.min(v.left,v.colNo);
                    v.right = Math.max(v.right,v.colNo);
                  } else {
                    v.step = 2.42; // 非変更指定項目または変更指定項目だが値の変化が無い場合、beforeの値をセット
                    v.logObj.after[x] = v.logObj.before[x];
                  }
                })
      
                v.step = 2.5; // 更新レコードの正当性チェック(unique重複チェック)
                for( v.unique in this.schema.unique ){
                  if( this.schema.unique[v.unique].indexOf(trans[v.i][v.unique]) >= 0 ){
                    v.step = 2.51; // 登録済の場合はエラーとして処理
                    v.logObj.result = false;
                    // 複数項目のエラーメッセージに対応するため場合分け
                    v.logObj.message = (v.logObj.message === null ? '' : '\n')
                    + `${v.unique}欄の値「${trans[v.i][v.unique]}」が重複しています`;
                  } else {
                    v.step = 2.52; // 未登録の場合this.sdbSchema.uniqueに値を追加
                    this.schema.unique[v.unique].push(trans[v.i][v.unique]);
                  }
                }
          
                v.step = 2.6; // 正当性チェックOKの場合の処理
                if( v.logObj.result ){
                  v.top = Math.min(v.top, v.j);
                  v.bottom = Math.max(v.bottom, v.j);
                  this.values[v.j] = v.logObj.after;          
                }
          
                v.step = 2.7; // 成否に関わらずログ出力対象に保存
                v.log.push(v.logObj);
              }
            }
      
            // ------------------------------------------------
            v.step = 3; // 対象シート・更新履歴に展開
            // ------------------------------------------------
            vlog(v,['top','left','right','bottom'])
            v.step = 3.1; // シートイメージ(二次元配列)作成
            for( v.i=v.top ; v.i<=v.bottom ; v.i++ ){
              console.log(`l.733 this.values[${v.i}]=${JSON.stringify(this.values[v.i])}`)
              v.row = [];
              for( v.j=v.left ; v.j<=v.right ; v.j++ ){
                v.row.push(this.values[v.i][v.header[v.j]] || null);
              }
              v.target.push(v.row);
            }
            vlog(v,'target')
      
            v.step = 3.2; // シートに展開
            // v.top,bottom: 最初と最後の行オブジェクトの添字(≠行番号) ⇒ top+1 ≦ row ≦ bottom+1
            // v.left,right: 左端と右端の行配列の添字(≠列番号) ⇒ left+1 ≦ col ≦ right+1
            if( v.target.length > 0 ){
              this.sheet.getRange(
                v.top + 2,  // +1(添字->行番号) +1(ヘッダ行分)
                v.left + 1,  // +1(添字->行番号)
                v.target.length,
                v.target[0].length
              ).setValues(v.target);
            }
      
            v.step = 3.3; // 変更履歴追記対象なら追記(変更履歴シートは追記対象外)
            if( this.log !== null ){
              v.r = this.log.append(v.log);
              if( v.r instanceof Error ) throw v.r;
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
      const sdbColumn = class {
      
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
                v.l = `${v.typedef[v.i].name}: ${this[v.typedef[v.i].name]}`
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
      const sdbLog = class {
      
        /** colDefs: 更新履歴シートの項目定義。sdbLog.colsDefs()で外部から参照可 */
        static typedef(){return [
          {name:'id',type:'UUID',note:'ログの一意キー項目',primaryKey:true,default:()=>Utilities.getUuid()},
          {name:'timestamp',type:'Date',note:'更新日時。yyyy-MM-ddThh:mm:ss.nnn+hh:mm形式',default:()=>toLocale(new Date())},
          {name:'account',type:'string|number',note:'更新者の識別子',default:(o={})=>o.account||null},
          {name:'range',type:'string',note:'更新対象となった範囲名(テーブル名)',default:(o={})=>o.range||null},
          {name:'result',type:'boolean',note:'true:追加・更新が成功',default:(o={})=>o.hasOwnProperty('result')?o.result:true},
          {name:'message',type:'string',note:'エラーメッセージ',default:(o={})=>o.message||null},
          {name:'before',type:'JSON',note:'更新前の行データオブジェクト',default:(o={})=>o.before||null},
          {name:'after',type:'JSON',note:'更新後の行データオブジェクト',default:(o={})=>o.after||null},
          {name:'diff',type:'JSON',note:'追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式',default:(o={})=>o.diff||null},
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
  
      v.step = 2; // メンバの初期化
      // spread {Spreadsheet} スプレッドシートオブジェクト(=ファイル。シートの集合)
      this.spread = SpreadsheetApp.getActiveSpreadsheet();
      // tables {Object.<string,sdbTable>} 操作対象シートの情報。メンバ名はテーブル名。
      this.tables = {};
  
      v.step = 3; // 引数tablesが配列でない場合、配列に変換(以降で統一的に処理するため)
      v.tables = Array.isArray(tables) ? tables : [tables];
      for( v.i=0 ; v.i<v.tables.length ; v.i++ ){
        // 文字列ならname属性指定と看做す
        if(whichType(v.tables[v.i],'String')){
          v.tables[v.i] = {name: v.tables[v.i]};
        };
      }
  
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
  
      v.step = 5; // 更新履歴を残す場合、変更履歴シートを他シートに先行して準備
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
  
      v.step = 6; // 対象テーブルのインスタンス化
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

