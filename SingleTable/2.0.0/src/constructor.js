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
