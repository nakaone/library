function test(){
  const v = {whois:'test',step:0,rv:null};
  console.log(`${v.whois} start.`);
  try {

    // テスト用シートの削除
    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.sheet = v.spread.getSheetByName('master');
    if( v.sheet !== null ) v.spread.deleteSheet(v.sheet);

    // constructor: dataにてテストデータ生成
    v.rv = new SingleTable('master',{
      primaryKey: 'entryNo',
      cols: [
        {name:'タイムスタンプ',type:'Date'},
        {name:'メールアドレス',type:'string',unique:true},
        {name:'申込者氏名',type:'string'},
        {name:'申込者カナ',type:'string'},
        {name:'申込者の参加',type:'string'},
        {name:'宿泊、テント',type:'string'},
        {name:'引取者氏名',type:'string'},
        {name:'参加者01氏名',type:'string'},
        {name:'参加者01カナ',type:'string'},
        {name:'参加者01所属',type:'string'},
        {name:'参加者02氏名',type:'string'},
        {name:'参加者02カナ',type:'string'},
        {name:'参加者02所属',type:'string'},
        {name:'参加者03氏名',type:'string'},
        {name:'参加者03カナ',type:'string'},
        {name:'参加者03所属',type:'string'},
        {name:'参加者04氏名',type:'string'},
        {name:'参加者04カナ',type:'string'},
        {name:'参加者04所属',type:'string'},
        {name:'参加者05カナ',type:'string'},
        {name:'参加者05氏名',type:'string'},
        {name:'参加者05所属',type:'string'},
        {name:'緊急連絡先',type:'string'},
        {name:'ボランティア募集',type:'string'},
        {name:'備考',type:'string'},
        {name:'キャンセル',type:'string'},
        {name:'authority',type:'number'},
        {name:'CPkey',type:'string'},
        {name:'entryNo',type:'number',auto_increment:[1,2]},
        {name:'trial',type:'string'},
        {name:'editURL',type:'string'},
        {name:'entryTime',type:'Date'},
        {name:'receptionist',type:'number'},
        {name:'fee00',type:'string',default:'未入場'},
        {name:'fee01',type:'string',default:'未入場'},
        {name:'fee02',type:'string',default:'未入場'},
        {name:'fee03',type:'string',default:'未入場'},
        {name:'fee04',type:'string',default:'未入場'},
        {name:'fee05',type:'string',default:'未入場'},
        {name:'memo',type:'string'},
      ],
      data: [{"タイムスタンプ":"2024-10-06T10:51:06.427Z","メールアドレス":"nakaone.kunihiro@gmail.com","申込者氏名":"島津　邦浩","申込者カナ":"シマヅ　クニヒロ","申込者の参加":"スタッフとして申込者のみ参加(おやじの会メンバ)","宿泊、テント":"宿泊しない","authority":2,"CPkey":"jZiM1isJ+1AZoVZ9NnWTvCoeghCm+FY05eb6jhz8wpT3DwqJbNnszW8PWDd3sq0N5mjN/Nshh+RGGrdkm7CC+sO32js+wm1YmYGr0FMaFxvMBDrWzyJ7qrPI4unbx2IkrPkXSmSEbw91n/LOu0x7br106XeJ9TXJbJS16rV0nzs=","entryNo":1,"trial":"{\"passcode\":920782,\"created\":1728874149915,\"result\":0,\"log\":[{\"timestamp\":1728874165893,\"enterd\":920782,\"status\":1},{\"timestamp\":1728768131564,\"enterd\":46757,\"status\":1},{\"timestamp\":1728768105236,\"enterd\":46747,\"status\":0},{\"timestamp\":1728731037700,\"enterd\":456044,\"status\":1},{\"timestamp\":1728711888082,\"enterd\":485785,\"status\":1},{\"timestamp\":1728709250994,\"enterd\":425862,\"status\":1},{\"timestamp\":1728701179073,\"enterd\":259177,\"status\":1},{\"timestamp\":1728646863938,\"enterd\":530072,\"status\":1},{\"timestamp\":1728646839729,\"enterd\":null,\"status\":1}]}","editURL":"https://docs.google.com/forms/d/e/1FAIpQLSfKJ5aUz4h6lTGlz6c3NjPyWMnViVQxHqwRkCnzJsRKfz9ULQ/viewform?edit2=2_ABaOnuePpXliGgMlVVUYiSKgwX6SXBNrnwozwTMF09Ml1py7Ocp1N7_w5F7uqf52Ak63zBE"},{"タイムスタンプ":"2024-09-15T03:47:03.578Z","メールアドレス":"via1315r@yahoo.co.jp","申込者氏名":"檜垣　素直","申込者カナ":"ヒガキ　スナオ","申込者の参加":"参加予定(宿泊なし)","宿泊、テント":"宿泊しない","引取者氏名":"宿泊予定なので不要","参加者01氏名":"檜垣　若菜","参加者01カナ":"ヒガキ　ワカナ","参加者01所属":"1年生","緊急連絡先":"09013357002","ボランティア募集":"できる","備考":"食事以外でも、お手伝い出来る事があれば。","authority":1,"entryNo":2,"editURL":"https://docs.google.com/forms/d/e/1FAIpQLSfKJ5aUz4h6lTGlz6c3NjPyWMnViVQxHqwRkCnzJsRKfz9ULQ/viewform?edit2=2_ABaOnudWLvuoT6Wq0Hu-4tqFl5OyTK-Z7EwdMDEQGS1jKJVIa41Dh8nNJPtpFyPu8cyZYGo"},{"タイムスタンプ":"2024-09-15T04:51:37.346Z","メールアドレス":"kousuke.murata4690@gmail.com","申込者氏名":"阿部　晃祐","申込者カナ":"アベ　コウスケ","申込者の参加":"参加予定(宿泊あり)","宿泊、テント":"宿泊する(テントあり)","引取者氏名":"宿泊予定なので不要","参加者01氏名":"阿部　涼","参加者01カナ":"アベ　リョウ","参加者01所属":"6年生","ボランティア募集":"できる","authority":1,"entryNo":3,"editURL":"https://docs.google.com/forms/d/e/1FAIpQLSfKJ5aUz4h6lTGlz6c3NjPyWMnViVQxHqwRkCnzJsRKfz9ULQ/viewform?edit2=2_ABaOnufKjD-xj5FN0GnTNIILVeJVwYJajCP8bZphy1zyleVl8UDLWqzUjDDFWZf7uMA0qtk"},{"タイムスタンプ":"2024-09-15T05:18:01.813Z","メールアドレス":"nakaone2001@gmail.com","申込者氏名":"島津　弘子","申込者カナ":"シマヅ　ヒロコ","申込者の参加":"参加予定(宿泊なし)","宿泊、テント":"宿泊しない","参加者01氏名":"島津　悠奈","参加者01カナ":"シマヅ　ユウナ","参加者01所属":"4年生","authority":2,"CPkey":"k5lfKMj3ybfMF6jocHPln98lLJIBIxKrrpLc4RhPenBIEg6OfgdXYQAVh907SoCg0MEBazhWic2oFaKNFJu9pa4prXWvTzYjRWw5XkmC9a7AdNQ0judVMATii7Xqp6drowisY6+Rul2zwrF2UKY8epoYP8ZkX9RyH6OFyglYQL8=","entryNo":4,"trial":"{\"passcode\":65698,\"created\":1729076868102,\"result\":0,\"log\":[{\"timestamp\":1728729400367,\"enterd\":119192,\"status\":1},{\"timestamp\":1728708771586,\"enterd\":254267,\"status\":1},{\"timestamp\":1728708701693,\"enterd\":254263,\"status\":0},{\"timestamp\":1728708634458,\"enterd\":null,\"status\":1}]}","editURL":"https://docs.google.com/forms/d/e/1FAIpQLSfKJ5aUz4h6lTGlz6c3NjPyWMnViVQxHqwRkCnzJsRKfz9ULQ/viewform?edit2=2_ABaOnueGXR29gyuz_kc4UMghOrIa_iNPhrkHdrW4zVI8KFW5aB2jsVCtjq79aasCFBWgTvI"}],
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

/*
    // テスト用シートの削除
    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.sheet = v.spread.getSheetByName('target');
    if( v.sheet !== null ) v.spread.deleteSheet(v.sheet);

    // constructor: シートイメージで生成、シート≠範囲
    v.rv = new SingleTable('target',{
      primaryKey: 'D3',
      raw: [
        ['','','タイトル','','','','',''],
        ['','','','','','','',''],
        ['','','','D3','E3','','',''],
        ['','','','','','','',''],
        ['','','5','4','','','',''],
        ['','','5','6','7','8','',''],
        ['','','4','3','hoge','fuga','',''],
        ['','','','','','','',''],
        ['','','','','','','','dummy'],
        ['','','','','','','',''],
      ]
    });
*/

/** 単一スプレッドシートまたはデータオブジェクト配列のCRUDを行う
 * - [仕様書](https://workflowy.com/#/91d73fc35411)
 */
class SingleTable {
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
  /** append: 領域に新規行を追加
   * @param {Object|Object[]} records=[] - 追加するオブジェクトの配列
   * @returns {Object} {success:[],failure:[]}形式
   */
  append(records){
    const v = {whois:this.constructor.name+'.append',step:0,rv:{success:[],failure:[],log:[]},
      cols:[],sheet:[]};
    console.log(`${v.whois} start.\nrecords(${whichType(records)})=${stringify(records)}`);
    try {
  
      v.step = 1; // 引数がオブジェクトなら配列に変換
      if( !Array.isArray(records) ) records = [records];
  
      v.step = 2; // 追加レコードを順次チェック
      for( v.i=0 ; v.i<records.length ; v.i++ ){
  
        v.log = {
          uuid: Utilities.getUuid(),
          timestamp: toLocale(new Date()),
          account: this.account,
          range: this.range,
          result: true,
          message: [],
          diff: JSON.stringify(records[v.i]),
        };
  
        v.step = 2.1; // pkey or uniqueの単一値チェック
        this.unique.cols.forEach(col => {
          if( records[v.i].hasOwnProperty(col) ){
            if( this.unique.map[col].indexOf(records[v.i][col]) >= 0 ){
              v.log.message.push(`unique error: col="${col}", value="${records[v.i][col]}"`);
            }
          }
        });
  
        v.step = 2.2; // auto_increment属性の項目について採番
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
  
  
        if( v.log.message.length === 0 ){ // エラーが無かった場合
  
          v.step = 2.3; // defaultの値をセット
          Object.assign(records[v.i],this.defaultObj);
  
          v.log.result = true;
          v.log.after = JSON.stringify(records[v.i]);
  
          v.rv.success.push(records[v.i]);
  
        } else {  // エラーが有った場合
  
          v.log.result = false;
          v.rv.failure.push(records[v.i]);
        }
        // エラーの有無にかかわらず、ログに追加
        v.log.push(v.rv.log);
      }
  
      v.step = 3; // レコードの追加
      v.step = 2.5; // 追加するレコードをシートイメージ(二次元配列)に追加
      for( v.j=0,v.row=[] ; v.j<this.header.length ; v.j++ ){
        v.row.push(records[this.header[v.j]] || null);
      }
      v.sheet.push(v.row);
  
      v.step = 3.1; // テーブルに排他制御をかける
      v.lock = LockService.getDocumentLock();
      v.cnt = this.maxTrial;
      while( v.cnt > 0 ){
        if( v.lock.tryLock(this.interval) ){
  
          v.step = 3.2; // 追加実行
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
          v.cnt--;
        }
      }
  
      // リトライしても排他不能だった場合、成功レコードを全て失敗に変更
      if( v.cnt === 0 ){
  
        v.rv.failure = [...v.rv.success,...v.rv.failure];
        v.rv.success = [];
  
        v.rv.log.forEach(log => {
          log.result = false;
          log.message.push(`lock error`);
          delete log.after;
        });
        throw new Error(`could not get lock ${this.maxTrial} times.`);
      }
  
  
      v.step = 4; // ログに記録
      v.rv.log.forEach(log => {
        // エラーメッセージを配列から文字列に変換
        if( log.message.length === 0 ){
          delete log.message;
        } else {
          log.message = log.message.join('\n');
        }
  
        // オブジェクトからシートイメージに変換
        v.row = [];
        this.log.header.forEach(col => {
          v.row.push(log[col] || null);
        });
  
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


/** 列記号<->列番号(数値)の相互変換
 * @param {string|number} arg - 列記号または列番号(自然数)
 */
function convertNotation(arg){
  const v = {rv:null,map: new Map([
    // 26進数 -> 列記号
    ['0','A'],['1','B'],['2','C'],['3','D'],['4','E'],
    ['5','F'],['6','G'],['7','H'],['8','I'],['9','J'],
    ['a','K'],['b','L'],['c','M'],['d','N'],['e','O'],
    ['f','P'],['g','Q'],['h','R'],['i','S'],['j','T'],
    ['k','U'],['l','V'],['m','W'],['n','X'],['o','Y'],
    ['p','Z'],
    // 列記号 -> 26進数
    ['A',1],['B',2],['C',3],['D',4],['E',5],
    ['F',6],['G',7],['H',8],['I',9],['J',10],
    ['K',11],['L',12],['M',13],['N',14],['O',15],
    ['P',16],['Q',17],['R',18],['S',19],['T',20],
    ['U',21],['V',22],['W',23],['X',24],['Y',25],
    ['Z',26],
  ])};
  try {

    if( typeof arg === 'number' ){
      v.step = 1; // 数値の場合
      // 1未満はエラー
      if( arg < 1 ) throw new Error('"'+arg+'" is lower than 1.');
      v.rv = '';
      v.str = (arg-1).toString(26); // 26進数に変換
      // 26進数 -> 列記号に変換
      for( v.i=0 ; v.i<v.str.length ; v.i++ ){
        v.rv += v.map.get(v.str.slice(v.i,v.i+1));
      }
    } else if( typeof arg === 'string' ){
      v.step = 2; // 文字列の場合
      arg = arg.toUpperCase();
      v.rv = 0;
      for( v.i=0 ; v.i<arg.length ; v.i++ )
        v.rv = v.rv * 26 + v.map.get(arg.slice(v.i,v.i+1));
    } else {
      v.step = 3; // 数値でも文字列でもなければエラー
      throw new Error('"'+JSON.stringify(arg)+'" is invalid argument.');
    }

    v.step = 4; // 終了処理
    return v.rv;

  } catch(e) {
    e.message = 'convertNotation: ' + e.message;
    return e;
  }
}
/** 渡された変数内のオブジェクト・配列を再帰的にマージ
 * - pri,subともデータ型は不問。次項のデシジョンテーブルに基づき、結果を返す
 *
 * @param {any} pri - 優先される変数(priority)
 * @param {any} sub - 劣後する変数(subordinary)
 * @param {Object} opt - オプション
 * @returns {any|Error}
 *
 * #### デシジョンテーブル
 *
 * | 優先(pri) | 劣後(sub) | 結果 | 備考 |
 * | :--: | :--: | :--: | :-- |
 * |  A  |  -  |  A  | 優先(A)のみ存在するメンバはそのまま |
 * |  A  |  B  |  A  | |
 * |  A  | [B] |  A  | |
 * |  A  | {B} |  A  | |
 * | [A] |  -  | [A] | |
 * | [A] |  B  | [A] | |
 * | [A] | [B] | [X] | 配列はopt.arrayによる |
 * | [A] | {B} | [A] | |
 * | {A} |  -  | {A} | |
 * | {A} |  B  | {A} | |
 * | {A} | [B] | {A} | |
 * | {A} | {B} | {A+B} | オブジェクトも置換ではなく結合する |
 * |  -  |  -  |  -  | |
 * |  -  |  B  |  B  | |
 * |  -  | [B] | [B] | |
 * |  -  | {B} | {B} | |
 *
 * #### opt.array : pri,sub双方配列の場合の処理方法を指定
 *
 * 例 pri:[1,2,{x:'a'},{a:10,b:20}], sub:[1,3,{x:'a'},{a:30,c:40}]
 *
 * - pri(priority): 単純にpriをセット。subは全て廃棄 ⇒ [1,2,{x:'a'},{a:10,b:20}]
 * - add: 値の重複に拘わらず、pri+subを返す ⇒ [1,2,{x:'a'},{a:10,b:20},1,3,{x:'a'},{a:30,c:40}]
 * - set(既定値): priに無いsubの要素をpriに追加 ⇒ [1,2,3,{x:'a'},{x:'a'},{a:10,b:20},{a:30,c:40}]
 *   ※`{x:'a'}`は別オブジェクトなので、重複排除されない事に注意。関数、Date等のオブジェクトも同様。
 * - str(strict): priに無いsubの要素をpriに追加。setと異なり、内容が同値なら重複排除<br>
 *   ⇒ [1,2,3,{x:'a'},{a:10,b:20},{a:30,c:40}]
 * - cmp(未実装): pri[n]とsub[n]を比較(comparison)。原則pri優先だが、例外として両方がObj or Arrならマージ<br>
 *   ⇒ [1,2,{x:'a'},{a:10,b:20,c:40}]
 */
function mergeDeeply(pri,sub,opt={}){
  const v = {whois:'mergeDeeply',rv:null,step:0,
    isObj: arg => arg && String(Object.prototype.toString.call(arg).slice(8,-1)) === 'Object',
    isArr: arg => arg && Array.isArray(arg),
  };
  //console.log(`${v.whois} start.`+`\npri=${stringify(pri)}`+`\nsub=${stringify(sub)}`+`\nopt=${stringify(opt)}`);
  try {

    v.step = 1; // 既定値の設定
    if( !opt.hasOwnProperty('array') ) opt.array = 'set';

    if( v.isObj(pri) && v.isObj(sub) ){
      v.step = 2; // sub,pri共にハッシュの場合
      v.rv = {};
      v.step = 2.1; // 優先・劣後Obj両方のハッシュキー(文字列)を、重複しない形でv.keysに保存
      v.keys = new Set([...Object.keys(pri),...Object.keys(sub)]);
      for( v.key of v.keys ){
        if( pri.hasOwnProperty(v.key) && sub.hasOwnProperty(v.key) ){
          v.step = 2.2; // pri,sub両方がキーを持つ
          if( v.isObj(pri[v.key]) && v.isObj(sub[v.key]) || v.isArr(pri[v.key]) && v.isArr(sub[v.key]) ){
            v.step = 2.21; // 配列またはオブジェクトの場合は再帰呼出
            v.rv[v.key] = mergeDeeply(pri[v.key],sub[v.key],opt);
          } else {
            v.step = 2.22; // 配列でもオブジェクトでもない場合は優先変数の値をセット
            v.rv[v.key] = pri[v.key];
          }
        } else {
          v.step = 2.3; // pri,subいずれか片方しかキーを持っていない
          v.rv[v.key] = pri.hasOwnProperty(v.key) ? pri[v.key] : sub[v.key];
        }
      }
    } else if( v.isArr(pri) && v.isArr(sub) ){
      v.step = '3 '+opt.array; // sub,pri共に配列の場合
      switch( opt.array ){
        case 'pri':
          // pri: 単純にpriをセット。subは全て廃棄 ⇒ [1,2,{x:'a'},{a:10,b:20}]
          v.rv = pri;
          break;
        case 'add':
          // add: 値の重複に拘わらず、pri+subを返す ⇒ [1,2,{x:'a'},{a:10,b:20},1,3,{x:'a'},{a:30,c:40}]
          v.rv = [...pri, ...sub];
          break;
        case 'str':
          // str(strict): priに無いsubの要素をpriに追加。setと異なり、内容が同値なら重複排除<br>
          // ⇒ [1,2,3,{x:'a'},{a:10,b:20},{a:30,c:40}]
          v.rv = [];
          pri.forEach(x => v.rv.push(x));
          sub.forEach(s => {
            v.flag = false;
            pri.forEach(p => v.flag = v.flag || isEqual(s,p));
            if( v.flag === false ) v.rv.push(s);
          });
          break;
        default:
          // set(既定値): priに無いsubの要素をpriに追加 ⇒ [1,2,{x:'a'},{a:10,b:20},3,{x:'a'},{a:30,c:40}]
          v.rv = [...new Set([...pri,...sub])];
      }
    } else {
      v.step = 4; // subとpriのデータ型が異なる ⇒ priを優先してセット
      v.rv = whichType(pri,'Undefined') ? sub : pri;
      //console.log(`l.228 pri=${stringify(pri)}, sub=${stringify(sub)} -> rv=${stringify(v.rv)}`)
    }
    v.step = 5;
    //console.log(`${v.whois} normal end.`+`\npri=${stringify(pri)}`+`\nsub=${stringify(sub)}`+`\nopt=${stringify(opt)}`+`\nv.rv=${stringify(v.rv)}`)
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\npri=${JSON.stringify(pri)}`
    + `\nsub=${JSON.stringify(sub)}`
    + `\nopt=${JSON.stringify(opt)}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
/** 関数他を含め、変数を文字列化
 * - JSON.stringifyでは文字列化されない関数、シンボル、undefinedも文字列化して表示
 * - 関数はtoString()で文字列化
 * - シンボルは`Symbol(xxx)`という文字列とする
 * - undefinedは'undefined'(文字列)とする
 *
 * @param {Object} variable - 文字列化対象変数
 * @param {Object|boolean} opt - booleanの場合、opt.addTypeの値とする
 * @param {boolean} opt.addType=false - 文字列化の際、元のデータ型を追記
 * @returns {string}
 * @example
 *
 * ```
 * console.log(`l.424 v.td=${stringify(v.td,true)}`)
 * ⇒ l.424 v.td={
 *   "children":[{
 *     "attr":{"class":"[String]th"}, // opt.addType=trueなら[データ型名]がつく
 *     "text":"[String]タグ"
 *   },{
 *     "attr":{"class":"[String]td"},
 *     "text":"[String]#md"
 *   }],
 *   "style":{"gridColumn":"[String]1/13"},
 *   "attr":{"name":"[String]tag"}
 * }
 * ```
 */
function stringify(variable,opt={addType:false}){
  const v = {whois:'stringify',rv:null,step:0};
  const conv = arg => {
    const w = {type:whichType(arg)};
    w.pre = opt.addType ? `[${w.type}]` : '';
    switch( w.type ){
      case 'Function': case 'Arrow': case 'Symbol':
        w.rv = w.pre + arg.toString(); break;
      case 'BigInt':
        w.rv = w.pre + parseInt(arg); break;
      case 'Undefined':
        w.rv = w.pre + 'undefined'; break;
      case 'Object':
        w.rv = {};
        for( w.i in arg ){
          // 自分自身(stringify)は出力対象外
          if( w.i === 'stringify' ) continue;
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      case 'Array':
        w.rv = [];
        for( w.i=0 ; w.i<arg.length ; w.i++ ){
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      default:
        w.rv = w.pre + arg;
    }
    return w.rv;
  };
  //console.log(`${v.whois} start.\nvariable=${variable}\nopt=${JSON.stringify(opt)}`);
  try {

    v.step = 1; // 事前準備
    if( typeof opt === 'boolean' ) opt={addType:opt};

    v.step = 2; // 終了処理
    //console.log(`${v.whois} normal end.`);
    return JSON.stringify(conv(variable));

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
/** 日時を指定形式の文字列にして返す
 * @param {string|Date} arg - 変換元の日時
 * @param {string} [format='yyyy-MM-ddThh:mm:ss.nnnZ'] - 日時を指定する文字列。年:y,月:M,日:d,時:h,分:m,秒:s,ミリ秒:n,タイムゾーン:Z
 * @returns {string} 指定形式に変換された文字列。無効な日付なら長さ0の文字列
 *
 * @example
 * ```
 * "1965/9/5"[yy/MM/dd hh:mm:ss.nnn] ⇒ "65/09/05 00:00:00.000"
 * "1965/9/5"[yyyy-MM-dd] ⇒ "1965-09-05"
 * "1965/9/5"[hh:mm] ⇒ "00:00"
 * "1977-03-04"[yy/MM/dd hh:mm:ss.nnn] ⇒ "77/03/04 09:00:00.000"
 * "1977-03-04"[yyyy-MM-dd] ⇒ "1977-03-04"
 * "1977-03-04"[hh:mm] ⇒ "09:00"
 * 1688189258262[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:27:38.262"
 * 1688189258262[yyyy-MM-dd] ⇒ "2023-07-01"
 * 1688189258262[hh:mm] ⇒ "14:27"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:16:30.000"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yyyy-MM-dd] ⇒ "2023-07-01"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[hh:mm] ⇒ "14:16"
 * "12:34"[yy/MM/dd hh:mm:ss.nnn] ⇒ ""
 * "12:34"[yyyy-MM-dd] ⇒ ""
 * "12:34"[hh:mm] ⇒ ""
 * ```
 */

function toLocale(arg,format='yyyy-MM-ddThh:mm:ss.nnnZ'){
  const v = {rv:format};
  try {

    let dObj = whichType(arg,'Date') ? arg : new Date(arg);
    //dObj = String(Object.prototype.toString.call(arg).slice(8,-1)) !== 'Date' ? arg : new Date(arg);

    v.step = 1; // 無効な日付なら空文字列を返して終了
    if( isNaN(dObj.getTime()) ) return '';

    v.local = { // 地方時ベース
      y: dObj.getFullYear(),
      M: dObj.getMonth()+1,
      d: dObj.getDate(),
      h: dObj.getHours(),
      m: dObj.getMinutes(),
      s: dObj.getSeconds(),
      n: dObj.getMilliseconds(),
      Z: Math.abs(dObj.getTimezoneOffset())
    }
    // タイムゾーン文字列の作成
    v.local.Z = v.local.Z === 0 ? 'Z'
    : ((dObj.getTimezoneOffset() < 0 ? '+' : '-')
    + ('0' + Math.floor(v.local.Z / 60)).slice(-2)
    + ':' + ('0' + (v.local.Z % 60)).slice(-2));

    v.step = 2; // 日付文字列作成
    for( v.x in v.local ){
      v.m = v.rv.match(new RegExp(v.x+'+'));
      if( v.m ){
        v.str = v.m[0].length > 1
          ? ('000'+v.local[v.x]).slice(-v.m[0].length)
          : String(v.local[v.x]);
        v.rv = v.rv.replace(v.m[0],v.str);
      }
    }

    v.step = 3; // 終了処理
    return v.rv;

  } catch(e){
    console.error(e,v);
    return e;
  }
}
/** vlog: デバッグ用コンソール出力
 * @param {Object} o - 出力対象Object
 * @param {string|string[]} m - メンバ名
 * @param {number|Object} l=null - 数値なら行番号、Objectならwhois,stepをメンバに持つ変数('v'を想定)
 * @returns {void}
 * 
 * - ver.1.1.0 2024/09/12
 *   - v以外の変数(ex.this)でもstep表示を可能に(lにObjectを追加)
 *   - 階層化オブジェクトメンバの指定を可能に(v.convの追加)
 */
const vlog = (o,m,l=null) => {
  // return; // デバッグ用。本番時はコメントを外す
  const v = {
    lType: whichType(l),  // 引数lのデータ型
    conv: (o,s) => {s.split('.').forEach(x => o = o[x]);return o},
  };

  switch( v.lType ){
    case 'Object': v.whois = l.whois; v.step = l.step; v.line = null; break;
    case 'Null'  : // Numberと同じ
    case 'Number': v.whois = o.whois; v.step = o.step; v.line = l; break;
  }
  v.msg = new Date().toLocaleTimeString()
    + (v.whois ? ` ${v.whois}` : '')
    + (v.step ? ` step.${v.step}` : '')
    + (v.line ? ` l.${v.line}` : '');

  if( whichType(m,'string') ) m = [m];
  m.forEach(str => {
    v.val = v.conv(o,str);
    v.msg += `\n${str}(${whichType(v.val)})=${stringify(v.val)}`
  });

  console.log(v.msg);
}
/** 変数の型を判定
 * 
 * - 引数"is"が指定された場合、判定対象が"is"と等しいかの真偽値を返す。
 *
 * @param {any} arg - 判定対象の変数
 * @param {string} [is] - 想定される型(型名の大文字小文字は意識不要)
 * @returns {string|boolean} - 型の名前。is指定有りなら判定対象が想定型かの真偽値
 *
 * @example
 * ```
 * let a = 10;
 * whichType(a);  // 'Number'
 * whichType(a,'string'); // false
 * ```
 *
 * <b>確認済戻り値一覧</b>
 *
 * オブジェクトは型名が返るので、限定列挙は困難。以下は確認済みの戻り値のみ記載。
 *
 * | 型名 | 戻り値 | 備考 |
 * | :-- | :-- | :-- |
 * | 文字列 | String |  |
 * | 数値 | Number |  |
 * | NaN | NaN |  |
 * | 長整数 | BigInt |  |
 * | 論理値 | Boolean |  |
 * | シンボル | Symbol |  |
 * | undefined | Undefined | 先頭大文字 |
 * | Null | Null |  |
 * | オブジェクト | Object |  |
 * | 配列 | Array |  |
 * | 関数 | Function |  |
 * | アロー関数 | Arrow |  |
 * | エラー | Error | RangeError等も'Error' |
 * | Date型 | Date |  |
 * | Promise型 | Promise |  |
 *
 * - Qiita [JavaScriptの型などの判定いろいろ](https://qiita.com/amamamaou/items/ef0b797156b324bb4ef3)
 *
 */
function whichType(arg,is){
  let rv = String(Object.prototype.toString.call(arg).slice(8,-1));
  switch(rv){
    case 'Number': if(Number.isNaN(arg)) rv = 'NaN'; break;
    case 'Function': if(!('prototype' in arg)) rv = 'Arrow'; break;
  }
  if( typeof is === 'string' ){
    return rv.toLowerCase() === is.toLowerCase();
  } else {
    return rv;
  }
}

