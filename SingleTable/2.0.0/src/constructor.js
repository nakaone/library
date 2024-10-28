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
    this.sheet = this.spread.getSheetByName(this.sheetName);

    // 操作対象シート不在の場合、raw/dataから作成
    if( this.sheet === null ){
      if( this.data.length > 0 ){ v.step = 2.1; // 引数に行オブジェクト配列が存在

        v.step = 2.11; // 項目一覧(this.header)の作成  
        if( this.cols.length > 0 ){
          // 項目定義が存在
          this.header = this.cols.map(x => x.name);
        } else {
          // 項目定義が不在
          v.step = 4.1; // 項目一覧をthis.headerに作成
          v.obj = {};
          this.data.forEach(x => Object.assign(v.obj,x));
          this.header = Object.keys(v.obj);
        }
  
        v.step = 2.12; // シートイメージをthis.rawに作成
        this.raw.push(this.header);
        for( v.i=0 ; v.i<this.data.length ; v.i++ ){
          v.row = [];
          for( v.j=0 ; v.j<this.header.length ; v.j++ ){
            v.row[v.j] = this.data[v.i][this.header[v.j]] || '';
          }
          this.raw.push(v.row);
        }
  
        v.step = 2.13; // 新規シートの作成とデータのセット
        this.sheet = this.spread.insertSheet();
        this.sheet.setName(this.sheetName);
        this.sheet.getRange(1,1,this.raw.length,this.header.length).setValues(this.raw);

      } else if( this.raw.length > 0 ){ v.step = 2.2; // 引数にシートイメージが存在
  
        v.step = 2.21; // ヘッダ行の空白セルに'ColN'を補完、項目一覧をthis.headerに作成
        for( v.i=0 ; v.i<this.raw[0].length ; v.i++ ){
          if( this.raw[0][v.i] === '' ) this.raw[0][v.i] = 'Col' + (v.i+1);
          this.header.push(this.raw[0][v.i]);
        }
  
        v.step = 2.22; // 行オブジェクト(this.data)を作成
        for( v.i=1 ; v.i<this.raw.length ; v.i++ ){
          v.obj = {};
          for( v.j=0 ; v.j<this.header.length ; v.j++ ){
            if( this.raw[v.i][v.j] ){
              v.obj[this.header[v.j]] = this.raw[v.i][v.j];
            }
          }
          if( Object.keys(v.obj).length > 0 ){  // 有効な項目があれば登録(空行はスキップ)
            this.data.push(v.obj);
          }
        }

        v.step = 2.23; // 新規シートの作成とデータのセット
        this.sheet = this.spread.insertSheet();
        this.sheet.setName(this.sheetName);
        this.sheet.getRange(1,1,this.raw.length,this.header.length).setValues(this.raw);

      } else { v.step = 2.3; // シートも行オブジェクトもシートイメージも無し ⇒ エラー
        throw new Error(`Couldn't find heet "${this.sheetName}" and no data, no raw.`);
      }
    }

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

    if( this.cols.length > 0 ){
      v.step = 3.3; // 項目定義が存在していた場合
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
      v.step = 3.4; // 項目定義が不存在の場合
      // ヘッダ行の空白セルに'ColN'を補完
      for( v.i=0 ; v.i<v.raw[0].length ; v.i++ ){
        if( v.raw[0][v.i] === '' ) v.raw[0][v.i] = 'Col' + (v.i+1);
        this.header.push(v.raw[0][v.i]);
      }
    }

    v.step = 3.5; // 指定有効範囲の末端行を検索(中間の空行は残すが、末尾の空行は削除)
    for( v.r=(this.bottom-this.top) ; v.r>=0 ; v.r-- ){
      if( v.raw[v.r].join('').length > 0 ){
        this.bottom = this.top + v.r;
        break;
      }
    }

    v.step = 3.6; // this.raw/dataにデータをセット
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