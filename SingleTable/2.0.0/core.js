/** 単一スプレッドシートまたはデータオブジェクト配列のCRUDを行う
 * - [仕様書](https://workflowy.com/#/91d73fc35411)
 */
class SingleTable {
  constructor(range,opt={}){
    const v = {whois:this.constructor.name+'.constructor',step:1,rv:null,
      colNo: arg => { // 列記号を列番号(自然数)に変換
        let rv=0;
        for( let b='a'.charCodeAt(0)-1,s=arg.toLowerCase(),i=0 ; i<arg.length ; i++ ){
          rv *= 26;
          rv += s.charCodeAt(i) - b;
        }
        return rv;
      },
      default:{ // メンバの初期値、既定値
        // 未設定かを判断するため、初期値は原則nullとする
  
        // 引数以外の、内部で計算・設定されるメンバ
        range: range, // {string} A1記法の範囲指定。引数range
        sheetName: null, // {string} シート名。this.rangeから導出
        spread: SpreadsheetApp.getActiveSpreadsheet(), // {Spreadsheet} スプレッドシートオブジェクト(=ファイル。シートの集合)
        sheet:null, // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
        header:null, // {string[]} 項目名の配列。ヘッダ行
        notes:null, //  {string[]} ヘッダ行各項目のメモ。項目定義。
        top:null, //  {number} ヘッダ行の行番号(自然数)
        left:null, //  {number} データ領域左端の列番号(自然数)
        right:null, //  {number} データ領域右端の列番号(自然数)
        bottom:null, //  {number} データ領域下端の行番号(自然数)
        log:{ // {Object} 更新履歴シートの定義
          sheetName: opt.logSheetName || 'log', // {string}='log' 更新履歴シート名。
          sheet:null, // {Sheet} 更新履歴シートオブジェクト
          primaryKey:'id', // {string}='id' 一意キー項目名
          header: null, // {string[]} 更新履歴シートの項目名リスト
          cols: [ // {Object[]} 更新履歴シートの項目定義
            {name:'id',type:'UUID',note:'ログの一意キー項目'},
            {name:'timestamp',type:'Date',note:'更新日時。yyyy-MM-ddThh:mm:ss.nnnZ形式'},
            {name:'account',type:'string|number',note:'更新者の識別子'},
            {name:'range',type:'string',note:'更新対象となった範囲名(テーブル名)'},
            {name:'result',type:'boolean',note:'true:追加・更新が成功'},
            {name:'message',type:'string',note:'エラーメッセージ'},
            {name:'before',type:'JSON',note:'更新前の行データオブジェクト'},
            {name:'after',type:'JSON',note:'更新後の行データオブジェクト'},
            {name:'diff',type:'JSON',note:'追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式'},
          ],
        },
        unique:{cols:[],map:{}}, // {Object} primaryKeyおよびunique属性が付いた項目の一覧
        auto_increment:{cols:[],map:{}}, // {Object} auto_increment属性が付いた項目の最大値を管理するオブジェクト
        defaultObj:{},  // {Object} 既定値項目で構成されたオブジェクト
        colsDef: [  // {Object[]} 項目定義オブジェクト(colsの要素)のメンバ一覧(定義内容)
          {name:'name',type:'string',note:'項目名'},
          {name:'type',type:'string',note:'データ型。string|number|boolean|Date|JSON|UUID'},
          {name:'format',type:'string',note:'表示形式。日付の場合のみ有効'},
          {name:'options',type:'any[]',note:'取り得る選択肢(配列)。ex.["未入場","既収","未収","無料"]'},
          {name:'default',type:'any',note:'既定値'},
          {name:'unique',type:'boolean',note:'列内で一意な値とする場合はtrue'},
          {name:'auto_increment',type:'{bloolean|null|number|number[]}=false',note:'自動採番の指定'
            + '\nnull ⇒ 自動採番しない'
            + '\nboolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない'
            + '\nnumber ⇒ 自動採番する(基数=指定値,増減値=1)'
            + '\nnumber[] ⇒ 自動採番する(基数=添字0,増減値=添字1)'},
          {name:'suffix',type:'string',note:'"not null"等、上記以外のSQLフィールド制約'},
          {name:'note',type:'string',note:'本項目に関する備考'},
        ],
        colDefNote: [ // {string[]} シート上で項目定義メモを編集する際の注意事項
          '項目定義以外の部分(コメント)は「//」をつける(単一行のみ。複数行の「/* 〜 */」は非対応)',
          '各項目はカンマでは無く改行で区切る(視認性の向上)',
          'JSON.stringifyでの処理を前提とした書き方。各項目をjoin(',')、両端に"{〜}"を加えてJSON.parseしたらオブジェクトになるように記載',
        ],
  
        // 引数optのメンバとして与えられる項目
        primaryKey:null, // {string}=null 一意キー項目名
        cols:null, // {Object[]} 項目定義。内容は「colDefs」参照
        raw:null, // {any[][]}=[] シート未作成の場合にセットするシートイメージ。添字=0はヘッダ
        data:null, // {Object.<string,any>[]}=[] シート未作成の場合にセットする行オブジェクトの配列
        outputLog:true, // {boolean}=true ログ出力しないならfalse
        logSheetName:null, // {string}='log' 更新履歴シート名
        account:null, // {number|string} 更新者のアカウント
        maxTrial:5, // {number}=5 ロックされていた場合の最大試行回数
        interval:2500, // {number}=2500 ロックされていた場合の試行間隔(ミリ秒)
      },
      getDataRange:null, getValues:null, getNotes:null,
    };
    console.log(`${v.whois} start.\nrange(${whichType(range)})=${range}\nopt(${whichType(opt)})=${stringify(opt)}`);
    try {
  
      // ----------------------------------------------
      v.step = 1; // 事前準備
      // ----------------------------------------------
      v.step = 1.1; // 引数をメンバ化
      v.opt = mergeDeeply(opt,v.default);
      if( v.opt instanceof Error ) throw v.opt;
      Object.keys(v.opt).forEach(x => this[x] = v.opt[x]);
  
      v.step = 1.2; // 導出項目の計算
      this.log.header = this.log.cols.map(x => x.name); // 更新履歴シートの項目名一覧
  
      v.step = 1.3; // 引数'range'から対象範囲絞り込み
      // range(対象データ範囲のA1記法)から指定範囲を特定、メンバに保存
      // ※ この段階では"a2:c"(⇒bottom不明)等、未確定部分が残る可能性あり
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
      v.step = 2; // this.raw, this.data作成、対象範囲確定
      // ----------------------------------------------
      this.sheet = this.spread.getSheetByName(this.sheetName);
      if( this.sheet !== null ){ v.step = 2.1; // 対象シートが存在する場合はシートからraw/data作成
  
        v.step = 2.11; // シートイメージの読み込み
        v.getDataRange = this.sheet.getDataRange();
        v.getValues = v.getDataRange.getValues();
        v.getNotes  = v.getDataRange.getNotes();
  
        v.step = 2.12; // 範囲確定。A1記法とデータ範囲のどちらか小さい方
        this.right = Math.min(this.right, v.getValues[0].length);
        this.bottom = Math.min(this.bottom, v.getValues.length);
  
        v.step = 2.13; // this.rawの設定
        this.raw = [];
        for( v.r=this.top-1 ; v.r<this.bottom ; v.r++ ){
          this.raw.push(v.getValues.slice(this.left-1,this.right));
        }
  
        v.step = 2.14; // this.dataの設定
        this.data = [];
        for( v.r=1 ; v.r<this.raw.length ; v.r++ ){
          this.data[v.r-1] = {};
          for( v.c=0 ; v.c<this.raw[v.r].length ; v.c++ ){
            if( this.raw[v.r][v.c] !== undefined ){
              // 対象セルが0,null,false等のfalsyな値でもセットされるよう、undefined以外ならコピーする
              this.data[v.r-1][this.raw[0][v.c]] = this.raw[v.r][v.c];
            }
          }
        }
  
      } else {  v.step = 2.2; // 対象シートが存在しない場合は引数からraw/data作成
  
        if( this.raw === null && this.data === null ){ v.step = 2.21; // raw,data両方存在しない場合
  
          if( this.cols === null && this.header === null ){ v.step = 2.211; // cols,header両方存在しない場合
  
            throw new Error(`シート未作成で引数opt.cols, header, raw, dataのいずれも指定されてません`);
  
          } else { v.step = 2.212; // cols,headerどちらかまたは両方存在する場合、this.raw[0]のみ作成
  
            // ヘッダ行を cols > header > data の優先順位でthis.raw[0]に作成
            if( this.cols !== null ){
              this.raw[0] = this.cols.map(x => x.name);
            } else {
              this.raw[0] = this.header;
            }
  
            // this.rightの書き換え
            this.right = this.left + this.raw[0].length - 1;
          }
  
        } else { v.step = 2.22; // this.raw, this.dataどちらかまたは両方が存在する場合
  
          if( this.raw !== null ){ v.step = 2.221; // rawが存在する(dataは存否不問)
            // this.raw -> this.dataを作成
            // this.rawとthis.dataが両方与えられていた場合、整合性確保のためdataは破棄
            this.data = [];
            for( v.r=1 ; v.r<this.raw.length ; v.r++ ){
              this.data[v.r-1] = {};
              for( v.c=0 ; v.c<this.raw[0].length ; v.c++ ){
                if( this.raw[v.r][v.c] !== undefined ){
                  // 対象セルが0,null,false等のfalsyな値でもセットされるよう、undefined以外ならコピーする
                  this.data[v.r-1][this.raw[0][v.c]] = this.raw[v.r][v.c];
                }
              }
            }
  
          } else { v.step = 2.222; // rawが存在しない(dataは存在する)場合
            // this.data -> this.rawを作成
  
            v.step = 2.2221; // ヘッダ行を cols > header > data の優先順位で作成、this.raw[0]に格納
            if( this.cols.length > 0 ){
              this.raw[0] = this.cols.map(x => x.name);
            } else if( this.header.length > 0 ){
              this.raw[0] = this.header;
            } else {
              v.obj = {};
              this.data.forEach(o => Object.assign(v.obj,o));
              this.raw[0] = Object.keys(v.obj);
            }
  
            v.step = 2.2222; // this.dataからthis.rawを作成
            for( v.r=0 ; v.r<this.data.length ; v.r++ ){
              this.raw[v.r+1] = [];
              for( v.c=0 ; v.c<this.raw[0].length ; v.c++ ){
                if( this.data[v.r].hasOwnProperty(this.raw[0][v.c]) ){
                  this.raw[v.r+1][v.c] = this.data[v.r][this.raw[0][v.c]];
                }
              }
            }
          }
  
          v.step = 2.223; // this.right,bottomの書き換え
          this.right = this.left + this.raw[0].length - 1;
          this.bottom = this.top + this.raw.length - 1;
        }
      }
  
      // この段階で、
      // ①シート/raw/dataのいずれかにデータが存在した場合、this.rawとdataの両方設定済。
      // ②this.raw[0]に項目一覧が設定済
      // ③シート/raw/data/cols/header全て未設定ならエラー処理に分岐済
  
  
      // ----------------------------------------------
      v.step = 3; // 項目定義(this.cols)の作成
      // ----------------------------------------------
      if( this.cols === null ){
        this.cols = [];
        if( v.getNotes === null ){
          // 両方無し⇒rawから作成
          for( v.i=0 ; v.i<this.raw[0].length ; v.i++ ){
            this.cols[v.i] = {
              name: this.raw[0][v.i],
            }
          }
        } else {
          // メモがあればgetNotesからcolsを作成
          v.notes = v.getNotes[this.top-1].slice(this.left-1,this.right);
          for( v.i=0 ; v.i<v.notes.length ; v.i++ ){
            v.r = this.objectizeNote(v.notes[v.i]);
            if( v.r instanceof Error ) throw v.r;
            v.notes[v.i] = v.r;
            // name属性はメモでは原則省略されているので、追加しておく
            v.notes[v.i].name = this.raw[0][v.i];
          }
        }
      }
  
      // ----------------------------------------------
      v.step = 4; // this.colsからの導出項目の計算
      // ----------------------------------------------
      v.step = 4.1; // ヘッダ項目一覧(this.header)の作成
      this.header = this.cols.map(x => x.name);
  
      v.step = 4.2; // 項目定義関係の導出項目の計算
      if( this.primaryKey ) this.unique.cols.push(this.primaryKey);
      this.cols.forEach(col => {
  
        v.step = 4.21; // append時の既定値Objの作成
        if( col.hasOwnProperty('default') ) this.defaultObj[col.name] = col.default;
  
        v.step = 4.22; // primaryKeyとunique指定のある項目のリストを作成
        if( col.unique === true ) this.unique.cols.push(col.name);
  
        v.step = 4.23; // auto_increment指定のある項目のリストを作成
        if( col.hasOwnProperty('auto_increment') ) this.auto_increment.cols.push(col.name);
      });
  
      v.step = 4.3; // this.dataをthis.cols.typeに従って属性変更
      // JSON -> オブジェクト化
      // date -> format指定が有れば、指定に沿って文字列化
      // 【不要】colsがあれば、必要に応じてクライアント側で属性変更可能
      
      // ----------------------------------------------
      v.step = 5; // シートの作成、項目定義メモの作成
      // ----------------------------------------------
      v.r = this.insertSheet({
        sheetName: this.sheetName,
        left: this.left,
        top: this.top,
        cols: this.cols,
        rows: this.data,
      });
      if( v.r instanceof Error ) throw v.r;
  
      // -----------------------------------------
      v.step = 6; // "log"シート不在なら作成
      // -----------------------------------------
      if( this.outputLog === true ){  // ログ出力する場合
        v.r = this.insertSheet({
          sheetName: this.log.sheetName,
          cols: this.log.cols,
        });
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
      vlog(v,'arg');
  
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
      if( v.range === null )  // 既存シートならヘッダ行の範囲を取得
        v.range = v.rv.getRange(v.arg.top,v.arg.left,1,v.arg.cols.length);
      v.notes = v.range.getNotes();
      if( v.notes === null ){
  
        v.step = 3.1; // 項目定義オブジェクトのメンバ一覧を取得
        v.colsDef = this.colsDef.map(x => x.name);
  
        v.step = 3.2; // 項目定義編集時の注意事項を作成
        v.colsDefNote = [''];
        this.colsDefNote.forEach(l => v.colDefNote.push('// '+l));
        v.colDefNote = v.colDefNote.join('\n');
  
        v.step = 3.3; // 個々の項目についてメモ(文字列)を作成
        v.notes = [];
        for( v.i=0 ; v.i<v.arg.cols.length ; v.i++ ){
          v.notes[v.i] = [];
          for( v.j=0 ; v.j<v.colsDef.length ; v.j++ ){
            if( v.arg.cols[v.i].hasOwnProperty(v.colsDef[v.j]) ){
              v.notes[v.i].push(`${v.colsDef[v.j]}: ${v.arg.cols[v.i][v.colsDef[v.j]]}`)
            }
          }
          v.notes[v.j].push(v.colDefNote);  // 注意事項を追加
          v.notes[v.j] = v.notes[v.j].join('\n');
        }
        v.range.setNotes([v.notes]);
      }
  
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
              vlog(v,['i','j'])
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
        if( v.l >= 0 ) line = line.slice(0,v.l);
  
        // 「項目名：値」形式の行はメンバとして追加
        v.m = line.trim().match(/^["']?([a-zA-Z0-9_\$]+)["']?\s*:\s*["']?(.+)["']?$/);
        if( v.m ){
          v.rv.push(`"${v.m[1]}":`+(v.quote[v.m[1]] ? `"${v.m[2]}"` : v.m[2]))
        }
      });
  
      v.step = 3; // オブジェクト化
      if( v.rv.length === 0 ) throw new Error(`invalid column definition`);
      v.rv = JSON.parse(`{${v.rv.join(',')}}`);
  
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

