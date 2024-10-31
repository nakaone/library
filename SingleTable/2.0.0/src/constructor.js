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
      primaryKey:null, cols:null, raw:null, data:null, header:null,
      account:null, defaultObj:{},maxTrial:5, interval:2500,
      unique:{cols:[],map:{}},
      auto_increment:{cols:[],map:{}},
      log:{
        sheetName: 'log',
        primaryKey: 'uuid',
        cols: [
          {name:'uuid',type:'string',note:'ログの一意キー項目'},
          {name:'timestamp',type:'string',note:'更新日時。yyyy-MM-ddThh:mm:ss.nnnZ形式'},
          {name:'account',type:'string',note:'更新者の識別子'},
          {name:'range',type:'string',note:'更新対象となった範囲名(テーブル名)'},
          {name:'result',type:'boolean',note:'true:追加・更新が成功'},
          {name:'message',type:'string',note:'エラーメッセージ'},
          {name:'before',type:'JSON',note:'更新前の行データオブジェクト'},
          {name:'after',type:'JSON',note:'更新後の行データオブジェクト'},
          {name:'diff',type:'JSON',note:'追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式'},
        ],
      }, 
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
    this.spread = SpreadsheetApp.getActiveSpreadsheet();
    this.range = range;
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

      v.step = 2.12; // 範囲確定
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
            this.data[v.r] = {};
            for( v.c=0 ; v.c<this.raw[0].length ; v.c++ ){
              if( this.raw[v.r][v.c] !== undefined ){
                // 対象セルが0,null,false等のfalsyな値でもセットされるよう、undefined以外ならコピーする
                this.data[v.r][this.raw[0][v.c]] = this.raw[v.r][v.c];
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
            useage: [
              '- name {string} 項目名',
              '- type {string} データ型。使用可能なデータ型はAlaSQL"Data Types"に準拠',
              '- format {string} 表示形式。日付の場合のみ指定',
              '- options {string} 取り得る選択肢(配列)のJSON表現',
              '    ex. ["未入場","既収","未収","無料"]',
              '- default {any} 既定値',
              '- unique {boolean}=false true:一意な値を持つ',
              '- auto_increment {bloolean|null|number|number[]}=false 自動採番項目',
              '    null ⇒ 自動採番しない',
              '    boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない',
              '    number ⇒ 自動採番する(基数=指定値,増減値=1)',
              '    number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)',
              '- suffix {string} "not null"等、上記以外のSQLのcreate table文のフィールド制約',
              '- note {string} 本項目に関する備考。create table等では使用しない',
              '- useage {string} 本メモの記入方法',
              '',
              '【注意事項】',
              '1. 項目定義以外の部分は「//」をつける(「/* 〜 */」は非対応)',
              '2. 各項目はカンマでは無く改行で区切る(視認性の向上)',
              '3. JSON.stringifyでの処理を前提とした書き方にする',
              '   ※各項目をjoin(',')、両端に"{〜}"を加えてJSON.parseしたらオブジェクトになるように記載'
            ].join('\n'),
          }
        }
      } else {

        // getNotesからcolsを作成
        v.notes = v.getNotes[this.top-1].slice(this.left-1,this.right);
        for( v.i=0 ; v.i<v.notes.length ; v.i++ ){
          v.lines = v.notes[v.i].split('\n');
          for( v.j=0 ; v.j<v.lines.length ; v.j++ ){
            // コメントは削除
            if( v.lines[v.j].indexOf('//') >= 0 ){
              v.lines[v.j] = v.lines[v.j].slice(v.lines[v.j].indexOf('//'));
            }
          };
          this.cols[v.i] = JSON.parse(`{${v.lines.join(',')}}`);
        }
      }
    }

    // ----------------------------------------------
    v.step = 4; // this.colsからの導出項目の計算
    // ----------------------------------------------
    v.step = 4.1; // 項目定義メモ(this.notes)の作成
    if( v.getNotes !== null ){
      this.notes = v.getNotes[this.top-1].slice(this.left-1,this.right);
    } else {
      this.notes = [];
      // colsからnote作成
      for( v.i=0 ; v.i<this.cols.length ; v.i++ ){
        this.notes[v.i] = '';
        ['name','type','format','options','default','unique','auto_increment','suffix','note','useage'].forEach(x => {
          if( this.cols[v.i].hasOwnProperty(x) ){
            this.notes[v.i] += `"${x}": "${this.cols[v.i][x]}"\n`;
          }
        });
      }
    }

    v.step = 4.2; // ヘッダ項目一覧(this.header)の作成
    this.header = this.cols.map(x => x.name);

    v.step = 4.3; // 項目定義関係の導出項目の計算
    if( this.primaryKey ) this.unique.cols.push(this.primaryKey);
    this.cols.forEach(col => {

      v.step = 4.31; // append時の既定値Objの作成
      if( col.hasOwnProperty('default') ) this.defaultObj[col.name] = col.default;

      v.step = 4.32; // primaryKeyとunique指定のある項目のリストを作成
      if( col.unique === true ) this.unique.cols.push(col.name);

      v.step = 4.33; // auto_increment指定のある項目のリストを作成
      if( col.hasOwnProperty('auto_increment') ) this.auto_increment.cols.push(col.name);
    });

    v.step = 4.4; // this.dataをthis.cols.typeに従って属性変更
    // JSON -> オブジェクト化
    // date -> format指定が有れば、指定に沿って文字列化
    // 【不要】colsがあれば、必要に応じてクライアント側で属性変更可能
    
    // ----------------------------------------------
    v.step = 5; // シートの作成、項目定義メモの作成
    // ----------------------------------------------
    if( this.sheet === null ){  // シート未作成なら作成
      this.sheet = this.spread.insertSheet();
      this.sheet.setName(this.sheetName);
      this.sheet.getRange(this.top,this.left,this.raw.length,this.header.length).setValues(this.raw);  
    }
    if( v.getNotes === null ){  // シート上に項目定義メモが未作成ならthis.notesをセット
      this.sheet.getRange(this.top,this.left,1,this.header.length).setNotes([this.notes]);  
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

/*
constructor(range,opt={}){
  const v = {whois:this.constructor.name+'.constructor',step:1,rv:null,default:{
    primaryKey:null, cols:[], raw:[], data:[], header:[], log:{
      sheetName: 'log',
      primaryKey: 'uuid',
      cols: [
        {name:'uuid',type:'string',note:'ログの一意キー項目'},
        {name:'timestamp',type:'string',note:'更新日時。yyyy-MM-ddThh:mm:ss.nnnZ形式'},
        {name:'account',type:'string',note:'更新者の識別子'},
        {name:'range',type:'string',note:'更新対象となった範囲名(テーブル名)'},
        {name:'result',type:'boolean',note:'true:追加・更新が成功'},
        {name:'message',type:'string',note:'エラーメッセージ'},
        {name:'before',type:'JSON',note:'更新前の行データオブジェクト'},
        {name:'after',type:'JSON',note:'更新後の行データオブジェクト'},
        {name:'diff',type:'JSON',note:'追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式'},
      ],
    }, unique:{cols:[],map:{}}, auto_increment:{cols:[],map:{}},account:null, defaultObj:{},
    maxTrial:5, interval:2500,
  }};
  console.log(`${v.whois} start.\nrange(${whichType(range)})=${range}\nopt(${whichType(opt)})=${stringify(opt)}`);
  try {

    // -----------------------------------------
    // 1. 引数の既定値設定＋メンバ化、導出項目の計算
    // -----------------------------------------
    v.step = 1.1; // 引数をメンバ化
    v.opt = mergeDeeply(opt,v.default);
    if( v.opt instanceof Error ) throw v.opt;
    Object.keys(v.opt).forEach(x => this[x] = v.opt[x]);

    v.step = 1.2; // 導出項目の計算(項目定義関係以外)
    this.spread = SpreadsheetApp.getActiveSpreadsheet();
    this.range = range;
    this.log.header = this.log.cols.map(x => x.name); // 更新履歴シートの項目名一覧

    v.step = 1.3; // 項目定義関係の導出項目の計算
    if( this.primaryKey ) this.unique.cols.push(this.primaryKey);
    this.cols.forEach(col => {

      v.step = 1.31; // append時の既定値Objの作成
      if( col.hasOwnProperty('default') ) this.defaultObj[col.name] = col.default;

      v.step = 1.32; // primaryKeyとunique指定のある項目のリストを作成
      if( col.unique === true ) this.unique.cols.push(col.name);

      v.step = 1.33; // auto_increment指定のある項目のリストを作成
      if( col.hasOwnProperty('auto_increment') ) this.auto_increment.cols.push(col.name);
    });

    v.step = 1.4; // シート名およびデータ領域の推定
    // range(対象データ範囲のA1記法)から指定範囲を特定、メンバに保存
    // ※ この段階では"a2:c"(⇒bottom不明)等、未確定部分が残る可能性あり
    v.m = range.match(/^'?(.+?)'?!([A-Za-z]*)([0-9]*):?([A-Za-z]*)([0-9]*)$/);
    if( v.m ){  // rangeがA1記法で指定された場合
      this.sheetName = v.m[1];
      this.left = convertNotation(v.m[2]);
      this.top = v.m[3] ? Number(v.m[3]) : 1;
      this.right = convertNotation(v.m[4]);
      this.bottom = v.m[5] ? Number(v.m[5]) : Infinity;
    } else {    // rangeが非A1記法 ⇒ range=シート名
      this.sheetName = range;
      this.top = this.left = 1;
      this.bottom = this.right = Infinity;
    }

    // -----------------------------------------
    v.step = 2; // 操作対象シートの読み込み
    // -----------------------------------------
    //::$src/constructor.genSheet.js::

    // -----------------------------------------
    v.step = 3; // 指定有効範囲の特定
    // -----------------------------------------
    this.raw = []; this.data = [];  // 引数があっても一度クリア

    v.step = 3.1; // 範囲行・列番号がデータの存在する範囲外だった場合、存在範囲内に変更
    v.dataRange = this.sheet.getDataRange();
    v.top = v.dataRange.getRow();
    v.bottom = v.dataRange.getLastRow();
    v.left = v.dataRange.getColumn();
    v.right = v.dataRange.getLastColumn();
    this.top = this.top < v.top ? v.top : this.top;
    // 最終行が先頭行以上、または範囲外の場合は存在範囲に変更
    this.bottom = this.bottom > v.bottom ? v.bottom : this.bottom;
    this.left = this.left < v.left ? v.left : this.left;
    this.right = this.right > v.right ? v.right : this.right;

    v.step = 3.2; // ヘッダ行番号以下の有効範囲(行)をv.rawに取得
    v.range = [this.top, this.left, this.bottom - this.top + 1, this.right - this.left + 1];
    v.raw = this.sheet.getRange(...v.range).getValues();

    v.step = 3.3; // ヘッダ行と項目定義の突き合わせ
    if( this.cols.length > 0 ){
      v.step = 3.31; // 項目定義が存在していた場合
      // 「シートが存在 and 項目定義が存在 and 項目が不一致」ならエラー
      if( this.cols.length !== v.raw[0].length ){
        throw new Error(`ヘッダ行と項目定義の項目数が一致しません\nheader=${stringify(v.raw[0])}\ncols=${stringify(this.cols)}`);
      } else {
        for( v.i=0 ; v.i<this.cols.length ; v.i++ ){
          if( this.cols[v.i].name != v.raw[0][v.i] ){
            throw new Error(`ヘッダ行と項目定義が一致しません\nheader=${stringify(v.raw[0])}\ncols=${stringify(this.cols)}`);
          } else {
            this.header.push(v.raw[0][v.i]);
          }
        }
      }
    } else {
      v.step = 3.32; // 項目定義が不存在の場合
      // ヘッダ行の空白セルに'ColN'を補完
      for( v.i=0 ; v.i<v.raw[0].length ; v.i++ ){
        if( v.raw[0][v.i] === '' ) v.raw[0][v.i] = 'Col' + (v.i+1);
        this.header.push(v.raw[0][v.i]);
      }
    }

    v.step = 3.4; // 指定有効範囲の末端行を検索(中間の空行は残すが、末尾の空行は削除)
    for( v.r=(this.bottom-this.top) ; v.r>=0 ; v.r-- ){
      if( v.raw[v.r].join('').length > 0 ){
        this.bottom = this.top + v.r;
        break;
      }
    }

    v.step = 3.5; // this.raw/dataにデータをセット
    this.raw[0] = v.raw[0]; // ヘッダ行
    for( v.r=1 ; v.r<=(this.bottom-this.top) ; v.r++ ){
      this.raw.push(v.raw[v.r]);
      v.o = {};
      for( v.c=0 ; v.c<this.header.length ; v.c++ ){
        if( v.raw[v.r][v.c] !== '' ){
          v.o[this.header[v.c]] = v.raw[v.r][v.c];
        }
      }
      this.data.push(v.o);
    }

    // -----------------------------------------
    v.step = 4; // "log"シート不在なら作成
    // -----------------------------------------
    this.log.sheet = this.spread.getSheetByName(this.log.sheetName);
    if( this.log.sheet === null ){
      this.log.sheet = this.spread.insertSheet();
      this.log.sheet.setName(this.log.sheetName);

      v.name = []; v.note = [];
      this.log.cols.forEach(x => {
        v.name.push(x.name);
        v.note.push(x.note || null);
      });
      v.range = this.log.sheet.getRange(1,1,1,this.log.cols.length);
      v.range.setValues([v.name]);
      v.range.setNotes([v.note]);

    }

    // -----------------------------------------
    // 5. this.data取得後に導出可能になる項目の計算
    // -----------------------------------------
    v.step = 5.1; // this.uniqueの作成
    this.unique.cols.forEach(col => {
      this.unique.map[col] = this.data.map(x => x[col]);
    });
    v.step = 5.2; // this.auto_incrementの作成
    this.auto_increment.cols.forEach(col => {
      // null ⇒ 自動採番しない
      // boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない
      // number ⇒ 自動採番する(基数=指定値,増減値=1)
      // number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)
      v.base = false;
      v.ai = this.cols.find(x => x.name === col).auto_increment;
      switch( whichType(v.ai) ){
        case 'Boolean':
          if( v.ai ) [v.base,v.val] = [1,1]; break;
        case 'Number':
          [v.base,v.val] = [v.ai,1]; break;
        case 'Array':
          [v.base,v.val] = [v.ai[0],(v.ai[1] || 1)];
      }
      this.auto_increment.map[col] = {
        max: Math.max(this.data.map(x => x[col])) || v.base,
        val: v.val
      };
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
*/