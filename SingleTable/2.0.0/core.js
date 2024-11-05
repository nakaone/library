/** 単一スプレッドシートまたはデータオブジェクト配列のCRUDを行う
 * - [仕様書](https://workflowy.com/#/91d73fc35411)
 */
class SingleTable {
  /** @constructor
   * @param range {string} 対象データ範囲のA1記法。1シート1テーブルとなっていない場合、範囲を特定するために使用。1シート1テーブルならシート名
   * @param opt {Object}={}
   * @param opt.outputLog {boolean}=true ログ出力しないならfalse
   * @param opt.logSheetName {string}='log' 更新履歴シート名
   * @param opt.account {number|string}=null 更新者のアカウント
   * @param opt.maxTrial {number}=5 シート更新時、ロックされていた場合の最大試行回数
   * @param opt.interval {number}=2500 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
   * @param opt.values {number|string|boolean|Date[][]} - 初期シートイメージ
   * @param opt.primaryKey {string} - 初期データの一意キー項目名
   * @returns {Object} setupSheet()のv.rv参照
   */
  constructor(range,opt){
    const v = {whois:this.constructor.name+'.prototype',step:0,rv:null};
    console.log(`${v.whois} start.`);
    try {
  
      this.stSheet = class {
        constructor(range,opt={}){
          const v = {whois:this.constructor.name+'.constructor',step:0,rv:null};
          console.log(`${v.whois} start.\nrange=${range}\nopt=${stringify(opt)}`);
          try {
  
            v.step = 1; // メンバの初期化、既定値設定
            this.range = null; // {string} A1記法の範囲指定
            this.sheetName = null; // {string} シート名。this.rangeから導出
            this.sheet = null; // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
            this.schema = null; // {stSchema[]} シートの項目定義
            this.values = null; // {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
            this.header = null; // {number} ヘッダ行の行番号(自然数)
            this.top = null; // {number} データ領域先頭の行番号(自然数)。通常header+1
            this.left = null; // {number} データ領域左端の列番号(自然数)
            this.right = null; // {number} データ領域右端の列番号(自然数)
            this.bottom = null; // {number} データ領域下端の行番号(自然数)
            this.primaryKey = null; // {string}='id' 一意キー項目名
            this.unique = null; // {Object} primaryKeyおよびunique属性が付いた項目の一覧
            this.cols = null; // {string[]} 項目名のリスト
            this.map = null; // {Object} {項目名:値リスト配列}形式
            this.auto_increment = null; // {Object} auto_increment属性が付いた項目の最大値を管理するオブジェクト
            this.cols = null; // {string[]} 項目名のリスト
            this.map = null; // {Object} 項目名をラベルとし、以下形式のオブジェクトを値とするオブジェクト
            this.max = null; // {number} 最大値
            this.val = null; // {number} 増減値
            this.defaultObj = null; // {Object} 既定値項目で構成されたオブジェクト。appendの際のプロトタイプ
  
            v.step = 2; // 引数'range'から対象範囲絞り込み
            // range(対象データ範囲のA1記法)から指定範囲を特定、メンバに保存
            // ※ この段階では"a2:c"(⇒bottom不明)等、未確定部分が残る可能性あり
            v.m = range.match(/^'?(.+?)'?!([A-Za-z]*)([0-9]*):?([A-Za-z]*)([0-9]*)$/);
            if( v.m ){  // rangeがA1記法で指定された場合
              this.sheetName = v.m[1];
              this.left = v.m[2] ? this.colNo(v.m[2]) : 1;
              this.top = v.m[3] ? Number(v.m[3]) : 1;
              this.right = v.m[4] ? this.colNo(v.m[4]) : Infinity;
              this.bottom = v.m[5] ? Number(v.m[5]) : Infinity;
              if( this.left > this.right ) [this.left, this.right] = [this.right, this.left];
              if( this.top > this.bottom ) [this.top, this.bottom] = [this.bottom, this.top];
            } else {    // rangeが非A1記法 ⇒ range=シート名
              this.sheetName = range;
              this.top = this.left = 1;
              this.bottom = this.right = Infinity;
            }
  
            v.step = 3; // spread読み込みテスト
            this.sheet = this.spread.getSheetByName(this.sheetName);
  
            v.step = 9; // 終了処理
            console.log(`${v.whois} normal end.`);
        
          } catch(e) {
            e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
            console.error(`${e.message}\nv=${stringify(v)}`);
            return e;
          }
        }
  
        /** colNo: 列記号を列番号に変換
         * @param {string} arg - 列番号
         * @returns {number} 列番号。自然数
         */
        colNo(arg){
          let rv=0;
          for( let b='a'.charCodeAt(0)-1,s=arg.toLowerCase(),i=0 ; i<arg.length ; i++ ){
            rv *= 26;
            rv += s.charCodeAt(i) - b;
          }
          return rv;
        }
      };
  
      this.stSchema = class {
        constructor(arg){
          const v = {whois:this.constructor.name+'.constructor',step:0,rv:null};
          console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
          try {
  
            this.name = null; // {string} 項目名
            this.type = null; // {string} データ型。string,number,boolean,Date,JSON,UUID
            this.format = null; // {string} 表示形式。type=Dateの場合のみ指定
            this.options = null; // {string} 取り得る選択肢(配列)のJSON表現。ex.["未入場","既収","未収","無料"]
            this.default = null; // {any} 既定値
            this.primaryKey = null; // {boolean}=false 一意キー項目ならtrue
            this.unique = null; // {boolean}=false primaryKey以外で一意な値を持つならtrue
            this.auto_increment = null; // {bloolean|null|number|number[]}=false 自動採番項目
              // null ⇒ 自動採番しない
              // boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない
              // number ⇒ 自動採番する(基数=指定値,増減値=1)
              // number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)
            this.suffix = null; // {string} "not null"等、上記以外のSQLのcreate table文のフィールド制約
            this.note = null; // {string} 本項目に関する備考。create table等では使用しない
  
            v.step = 9; // 終了処理
            console.log(`${v.whois} normal end.`);
        
          } catch(e) {
            e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
            console.error(`${e.message}\nv=${stringify(v)}`);
            return e;
          }
        }
      };
  
      this.target = new this.stSheet(range);
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** insertSheet: シートの新規作成＋項目定義メモのセット
   * @param arg {Object}
   * @param arg.sheetName {string} - 作成するシート名
   * @param arg.left=1 {number} - 左端列番号(自然数)
   * @param arg.top=1 {number} - 上端行番号(自然数)
   * @param arg.cols {Object[]} - 項目定義オブジェクトの配列
   * @param [arg.rows] {Array[]|Object[]} - 行データ
   * @returns {Sheet} 作成されたシートオブジェクト
   */
  insertSheet(arg){
    const v = {whois:this.constructor.name+'.insertSheet',step:0,rv:null,range:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {
  
      v.step = 1; // 既定値の設定
      v.arg = mergeDeeply(arg,{sheetName:null,left:1,top:1,cols:null,rows:null});
      if( v.arg instanceof Error ) throw v.arg;
  
      v.step = 2; // シートの存否確認、不在なら追加
      v.rv = this.spread.getSheetByName(v.arg.sheetName);
      v.addNew = v.rv === null ? true : false;
      if( v.addNew ){
        v.step = 2.1; // 新規シートを追加
        v.rv = this.spread.insertSheet();
        v.rv.setName(v.arg.sheetName);
  
        v.step = 2.2; // ヘッダ行の範囲をrangeとして設定
        v.range = v.rv.getRange(v.arg.top,v.arg.left,1,v.arg.cols.length);
  
        v.step = 2.3; // ヘッダ行に項目名をセット
        v.range.setValues([v.arg.cols.map(x => x.name)]);
      }
  
      v.step = 3; // 項目定義メモの存否確認、不在なら追加
      // v.range: 項目定義メモを貼付する領域(=ヘッダ行の範囲)
      v.range = v.rv.getRange(v.arg.top,v.arg.left,1,v.arg.cols.length);
      // v.notes: setNotes()用のメモの配列
      v.notes = v.addNew ? [] : v.range.getNotes();
      // v.colsDefNote: 項目定義編集時の注意事項
      v.colsDefNote = [''];
      this.colsDefNote.forEach(l => v.colsDefNote.push('// '+l));
      v.colsDefNote = v.colsDefNote.join('\n');
  
      v.step = 3.1; // 列毎にメモを作成
      for( v.i=0 ; v.i<v.arg.cols.length ; v.i++ ){
        v.step = 3.2; // 作成済みならスキップ
        if( v.notes[v.i] !== undefined ) continue;
  
        v.step = 3.3; // 項目定義メモの内容(文字列)を作成
        v.note = [];
        for( v.j=0 ; v.j<this.colsDef.length ; v.j++ ){
          v.step = 3.4; // nameはヘッダ行のセルから取得可能なので省略
          if( this.colsDef[v.j].name === 'name' ) continue;
  
          if( v.arg.cols[v.i].hasOwnProperty(this.colsDef[v.j].name) ){
            v.step = 3.5; // 対象シートの項目定義(arg.cols)に該当定義内容が存在する場合、「定義項目名：値」
            v.note.push(`${this.colsDef[v.j].name}: ${v.arg.cols[v.i][this.colsDef[v.j].name]}`);
          } else {
            v.step = 3.6; // 存在しない場合、「// 定義項目名：{データ型} - 説明」
            v.note.push(`// ${this.colsDef[v.j].name}: {${(this.colsDef[v.j].type || '')}} - ${(this.colsDef[v.j].note || '')}`)
          }
        }
  
        v.step = 3.7; // 注意事項を追加して行を結合
        v.note.push(v.colsDefNote);
        v.notes[v.i] = v.note.join('\n');
      }
  
      v.step = 3.8; // メモを貼付
      v.range.setNotes([v.notes]);
  
      v.step = 4; // 新規作成シートの場合、データを追加
      if( v.addNew && v.arg.rows !== null ){
        v.sheet = []; // シートイメージ
        v.header = v.arg.cols.map(x => x.name); // ヘッダ行
  
        v.step = 4.1; // 項目の並びが異なる可能性があるので、シートイメージの場合は行オブジェクト化
        if( whichType(v.arg.rows[0],'Object') ){
          v.step = 4.11;
          v.data = v.arg.rows;
        } else {
          v.step = 4.12;
          v.data = [];
          for( v.i=1 ; v.i<v.arg.rows.length ; v.i++ ){
            v.row = {};
            for( v.j=0 ; v.j<v.arg.rows[v.i].length ; v.j++ ){
              if( v.arg.rows[v.i].hasOwnProperty(v.header[v.j]) ){
                v.row[v.header[v.j]] = v.arg.rows[v.i][v.j];
              }
            }
            v.data.push(v.row);
          }
        }
  
        v.step = 4.2; // 行オブジェクトをシートイメージに変換
        v.data.forEach(row => {
          v.row = [];
          Object.keys(row).forEach(key => {
            v.row[v.header.indexOf(key)] = row[key];
          });
          v.sheet.push(v.row);
        });
  
        v.step = 4.3; // 作成したシートイメージをセット
        v.rv.getRange(v.arg.top+1,v.arg.left,v.sheet.length,v.sheet[0].length).setValues(v.sheet);
      }
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  
  /** objectizeNote: 項目定義メモをオブジェクト化
   * @param arg {string} 項目定義メモの文字列
   * @returns {Object} 項目定義オブジェクト
   */
  objectizeNote(arg){
    const v = {whois:this.constructor.name+'.objectizeNote',step:0,rv:[]};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {
  
      v.step = 1; // JSON化する際、クォーテーションで囲む必要が無い項目のマップを作成
      v.quote = {};
      this.colsDef.forEach(x => {
        v.type = (x.type || '').toLowerCase();
        v.quote[x.name] = (v.type === 'number' || v.type === 'boolean') ? false : true;
      })
  
      v.step = 2; // 改行で分割、一行毎にチェック
      arg.split('\n').forEach(line => {
        // コメントの削除
        v.l = line.indexOf('//');
        v.line = v.l < 0 ? line : line.slice(0,v.l);
        
        // 「項目名：値」形式の行はメンバとして追加
        v.m = v.line.trim().match(/^["']?([a-zA-Z0-9_\$]+)["']?\s*:\s*["']?(.+)["']?$/);
        if( v.m ){
          v.rv.push(`"${v.m[1]}":`+(v.quote[v.m[1]] ? `"${v.m[2]}"` : v.m[2]))
        }
      });
  
      v.step = 3; // オブジェクト化
      v.rv = v.rv.length === 0 ? {} : JSON.parse(`{${v.rv.join(',')}}`);
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
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
      // 引数がオブジェクトなら配列に変換
      if( !Array.isArray(records) ) records = [records];
  
      // ------------------------------------------------
      v.step = 2; // 追加レコードを順次チェック
      // ------------------------------------------------
      for( v.i=0 ; v.i<records.length ; v.i++ ){
  
        v.step = 2.1; // ログオブジェクトのプロトタイプ生成
        v.log = {
          uuid: Utilities.getUuid(),
          timestamp: toLocale(new Date()),
          account: this.account,
          range: this.range,
          result: true,
          message: [],
          diff: JSON.stringify(records[v.i]),
        };
        vlog(v,['log'],v);
  
        v.step = 2.2; // pkey or uniqueの単一値チェック
        this.unique.cols.forEach(col => {
          console.log(`l.399 this.unique.map[${col}]=${stringify(this.unique.map[col])}, records[${v.i}]=${stringify(records[v.i])}`);
          if( records[v.i].hasOwnProperty(col) ){
            if( this.unique.map[col].indexOf(records[v.i][col]) >= 0 ){
              v.log.message.push(`unique error: col="${col}", value="${records[v.i][col]}"`);
            }
          }
        });
        vlog(v,['log'],v);
  
        v.step = 2.3; // auto_increment属性の項目について採番
        this.auto_increment.cols.forEach(col => {
          // あるべき値を計算
          v.tobe = this.auto_increment.map[col].max + this.auto_increment.map[col].val;
          if( records[v.i].hasOwnProperty(col) ){
            // 引数で指定されていた場合、計算値と引数が不一致ならエラー
            if( records[v.i][col] !== v.tobe ){
              v.log.message.push(`auto increment error: col="${col}", arg="${records[v.i][col]}", tobe="${v.tobe}"`);
            } else {
              // 計算値と引数が一致していた場合、this.auto_incrementを更新
              this.auto_increment.map[col].max = v.tobe;
            }
          } else {
            // 引数で指定されていなかった場合、項目とthis.auto_incrementを更新
            records[v.i][col] = v.tobe;
            this.auto_increment.map[col].max = v.tobe;
          }
        });
  
        v.step = 2.4; // エラー有無によって変わる値の設定
        if( v.log.message.length === 0 ){ // エラーが無かった場合
  
          v.step = 2.41; // 追加する行オブジェクトに既定値を補足(this.defaultObjの値をセット)
          Object.assign(records[v.i],this.defaultObj);
  
          v.step = 2.42; // ログオブジェクトに結果設定
          v.log.result = true;
          v.log.after = JSON.stringify(records[v.i]);
  
          v.step = 2.43; // 追加するレコードをシートイメージ(二次元配列)に追加
          for( v.j=0,v.row=[] ; v.j<this.header.length ; v.j++ ){
            v.row.push(records[v.i][this.header[v.j]] || null);
          }
          v.sheet.push(v.row);
  
          v.step = 2.44; // 戻り値への格納
          v.rv.success.push(records[v.i]);
  
        } else { // エラーが有った場合
  
          v.step = 2.45; // ログオブジェクトに結果設定
          v.log.result = false;
  
          v.step = 2.46; // 戻り値への格納
          v.rv.failure.push(records[v.i]);
        }
  
        v.step = 2.5; // エラーの有無にかかわらず、ログに追加
        v.rv.log.push(v.log);
      }
      vlog(v,['rv','log'],v);
  
      // ------------------------------------------------
      v.step = 3; // 正常レコードのシートへの追加
      // ------------------------------------------------
      if( v.sheet.length > 0 ){
        v.step = 3.1; // テーブルに排他制御をかける
        v.lock = LockService.getDocumentLock();
        v.cnt = this.maxTrial;
        while( v.cnt > 0 ){
          if( v.lock.tryLock(this.interval) ){
  
            v.step = 3.2; // 追加実行
            vlog(v,['cnt','sheet'],v);
            this.sheet.getRange(
              this.bottom + 1,
              this.left,
              v.rv.success.length,
              this.header.length
            ).setValues(v.sheet);
  
            v.step = 3.3; // テーブルの排他制御を解除、末端行番号を書き換え
            v.lock.releaseLock();
            this.bottom += v.sheet.length;
            v.cnt = -1;
          } else {
            v.step = 3.4; // 排他できなかった場合、試行回数を-1
            v.cnt--;
          }
        }
  
        v.step = 3.5; // リトライしても排他不能だった場合の処理
        if( v.cnt === 0 ){
          // 成功レコードを全て失敗に変更
          v.rv.failure = [...v.rv.success,...v.rv.failure];
          v.rv.success = [];
  
          v.rv.log.forEach(log => {
            log.result = false;
            log.message.push(`lock error`);
            delete log.after;
          });
          throw new Error(`could not get lock ${this.maxTrial} times.`);
        }
  
        v.step = 3.6; // this.data/rawに追加
        // ※シートへの書き込み後に実行のこと
        this.data = [...this.data,...v.rv.success];
        this.raw = [...this.raw,...v.sheet];
      }
  
  
      // ------------------------------------------------
      v.step = 4; // ログに記録
      // ------------------------------------------------
      v.rv.log.forEach(log => {
  
        v.step = 4.1; // エラーメッセージを配列から文字列に変換
        if( log.message.length === 0 ){
          delete log.message;
        } else {
          log.message = log.message.join('\n');
        }
        log.result = log.result ? 'OK' : 'NG';
  
        v.step = 4.2; // オブジェクトからシートイメージに変換
        v.row = [];
        this.log.header.forEach(col => {
          // log.result(boolean) === false だと空欄になる。∵falseと判定されているため
          // [falsyな値](https://mosa-architect.gitlab.io/frontend-techs/js/variable/falsy-values.html)
          // 0: 数字のゼロ
          // "": 長さゼロの文字列
          // false: booleanのfalse
          // null: null(明示的なnull)
          // undefined: 未定義(または何も代入されていない状態)
          // NaN: 数字ではない
          if( log[col] ){
            v.value = log[col];
          } else {
            if( log[col] === 0 ) v.value = '0';
            else if( log[col] === '' ) v.value = '';
            else if( log[col] === false ) v.value = 'false';
            else if( log[col] === null ) v.value = 'null';
            else if( log[col] === undefined ) v.value = 'undefined';
            else if( isNaN(log[col]) ) v.value = 'NaN';
            else v.value = null;
          }
          v.row.push(v.value);
        });
        v.tmp = log; vlog(v,['tmp','row'],v);
  
        v.step = 4.3; // ログに行追加
        this.log.sheet.appendRow(v.row);
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
}

