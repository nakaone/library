function test(){
  const v = {whois:'test',step:0,rv:null};
  console.log(`${v.whois} start.`);
  try {

    // テストデータの準備
    tData = [
      {
        data: [],
        raw: [
          ['string','boolean','date','number'],
          ['a',undefined,'1965/9/5',-1],
          ['tRue',null,'12:34',Infinity],
          ['{"a":10}',false,Date.now(),0],
          ['d',true,new Date(),1.23e+4],  
        ],
        cols: null,
      },{
        data: [],
        raw: [
          ['タイムスタンプ','メールアドレス','申込者氏名','申込者カナ','申込者の参加','宿泊、テント','引取者氏名','参加者01氏名','参加者01カナ','参加者01所属','参加者02氏名','参加者02カナ','参加者02所属','参加者03氏名','参加者03カナ','参加者03所属','参加者04氏名','参加者04カナ','参加者04所属','参加者05カナ','参加者05氏名','参加者05所属','緊急連絡先','ボランティア募集','備考','キャンセル','authority','CPkey','entryNo','trial','editURL','entryTime','receptionist','fee00','fee01','fee02','fee03','fee04','fee05','memo'],
          ['2024/10/06 19:51:06','nakaone.kunihiro@gmail.com','島津　邦浩','シマヅ　クニヒロ','スタッフとして申込者のみ参加(おやじの会メンバ)','宿泊しない','','','','','','','','','','','','','','','','','','','','','2','jZiM1isJ+1AZoVZ9NnWTvCoeghCm+FY05eb6jhz8wpT3DwqJbNnszW8PWDd3sq0N5mjN/Nshh+RGGrdkm7CC+sO32js+wm1YmYGr0FMaFxvMBDrWzyJ7qrPI4unbx2IkrPkXSmSEbw91n/LOu0x7br106XeJ9TXJbJS16rV0nzs=','1','{"passcode":920782,"created":1728874149915,"result":0,"log":[{"timestamp":1728874165893,"enterd":920782,"status":1},{"timestamp":1728768131564,"enterd":46757,"status":1},{"timestamp":1728768105236,"enterd":46747,"status":0},{"timestamp":1728731037700,"enterd":456044,"status":1},{"timestamp":1728711888082,"enterd":485785,"status":1},{"timestamp":1728709250994,"enterd":425862,"status":1},{"timestamp":1728701179073,"enterd":259177,"status":1},{"timestamp":1728646863938,"enterd":530072,"status":1},{"timestamp":1728646839729,"enterd":null,"status":1}]}','https://docs.google.com/forms/d/e/ULQ/viewform?edit2=2_ePpXliGgMlVVUYiSKgwX6SXBNrnwozwTMF09Ml1py7Ocp1N7_w5F7uqf52Ak63zBE','','','','','','','','',''],
          ['2024/09/15 12:47:04','via1315r@yahoo.co.jp','前田　素直','マエダ　スナオ','参加予定(宿泊なし)','宿泊しない','宿泊予定なので不要','前田　若菜','マエダ　ワカナ','1年生','','','','','','','','','','','','','9013357002','できる','食事以外でも、お手伝い出来る事があれば。','','1','','2','','https://docs.google.com/forms/d/e/ULQ/viewform?edit2=2_dWLvuoT6Wq0Hu-4tqFl5OyTK-Z7EwdMDEQGS1jKJVIa41Dh8nNJPtpFyPu8cyZYGo','','','','','','','','',''],
          ['2024/09/15 13:51:37','kousuke.murata4690@gmail.com','小早川　晃祐','コバヤカワ　コウスケ','参加予定(宿泊あり)','宿泊する(テントあり)','宿泊予定なので不要','小早川　涼','コバヤカワ　リョウ','6年生','','','','','','','','','','','','','','できる','','','1','','3','','https://docs.google.com/forms/d/e/ULQ/viewform?edit2=2_fKjD-xj5FN0GnTNIILVeJVwYJajCP8bZphy1zyleVl8UDLWqzUjDDFWZf7uMA0qtk','','','','','','','','',''],
          ['2024/09/15 14:18:02','nakaone2001@gmail.com','島津　弘子','シマヅ　ヒロコ','参加予定(宿泊なし)','宿泊しない','','島津　悠奈','シマヅ　ユウナ','4年生','','','','','','','','','','','','','','','','','2','k5lfKMj3ybfMF6jocHPln98lLJIBIxKrrpLc4RhPenBIEg6OfgdXYQAVh907SoCg0MEBazhWic2oFaKNFJu9pa4prXWvTzYjRWw5XkmC9a7AdNQ0judVMATii7Xqp6drowisY6+Rul2zwrF2UKY8epoYP8ZkX9RyH6OFyglYQL8=','4','{"passcode":65698,"created":1729076868102,"result":0,"log":[{"timestamp":1728729400367,"enterd":119192,"status":1},{"timestamp":1728708771586,"enterd":254267,"status":1},{"timestamp":1728708701693,"enterd":254263,"status":0},{"timestamp":1728708634458,"enterd":null,"status":1}]}','https://docs.google.com/forms/d/e/ULQ/viewform?edit2=2_eGXR29gyuz_kc4UMghOrIa_iNPhrkHdrW4zVI8KFW5aB2jsVCtjq79aasCFBWgTvI','','','','','','','','',''],
        ],
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
          {name:'entryNo',type:'number',primaryKey:true},
          {name:'trial',type:'JSON'},
          {name:'editURL',type:'string'},
          {name:'entryTime',type:'string'},
          {name:'receptionist',type:'string'},
          {name:'fee00',type:'string'},
          {name:'fee01',type:'string'},
          {name:'fee02',type:'string'},
          {name:'fee03',type:'string'},
          {name:'fee04',type:'string'},
          {name:'fee05',type:'string'},
          {name:'memo',type:'string'},
        ],
      }
    ];

    v.pattern = 0;  // テストデータのパターン指定
    for( v.i=1 ; v.i<tData[v.pattern].raw.length ; v.i++ ){
      tData[v.pattern].data[v.i-1] = {};
      for( v.j=0 ; v.j<tData[v.pattern].raw[0].length ; v.j++ ){
        if( tData[v.pattern].raw[v.i][v.j] ){
          tData[v.pattern].data[v.i-1][tData[v.pattern].raw[0][v.j]] = tData[v.pattern].raw[v.i][v.j];
        }
      }
    }

    // テスト用シートの再作成
    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.sheet = v.spread.getSheetByName('target');
    v.sheet.getRange(3,3,1,1).setNote('type: UUID');

    // ①constructor: シートイメージで生成、シート≠範囲
    v.rv = new SpreadDB({range:'target!c3:f',values:tData[0].raw});

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
    // メールアドレスの重複 : {name:'メールアドレス',type:'string',unique:true},
    //v.rv = v.st.append({'タイムスタンプ':toLocale(new Date()),'メールアドレス':'nakaone.kunihiro@gmail.com'});

    // 複数レコードの一括追加 : {name:'entryNo',type:'number',auto_increment:[1,2]},

    // シートまたはログが使用中

    // --------------------------------------------------------------------
    // ①テスト用シートの削除
    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.sheet = v.spread.getSheetByName('target');
    if( v.sheet !== null ) v.spread.deleteSheet(v.sheet);
    v.sheet = v.spread.getSheetByName('log');
    if( v.sheet !== null ) v.spread.deleteSheet(v.sheet);

    // --------------------------------------------------------------------
    // ③appendテスト　※テスト②を先行、シート生成のこと
    v.st = new SingleTable('master',{
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
    });
    // 単純な追加(自動採番、既定値の設定)
    v.rv = v.st.append({'タイムスタンプ':toLocale(new Date())});

    // ②テスト用シートの削除
    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.sheet = v.spread.getSheetByName('master');
    if( v.sheet !== null ) v.spread.deleteSheet(v.sheet);

    // --------------------------------------------------------------------

    // ②constructor: dataにてテストデータ生成
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

    // --------------------------------------------------------------------
    // ①テスト用シートの削除
    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.sheet = v.spread.getSheetByName('target');
    if( v.sheet !== null ) v.spread.deleteSheet(v.sheet);

    // ①constructor: シートイメージで生成、シート≠範囲
    v.rv = new SingleTable('target!C3:F',{
      primaryKey: 'D3',
      raw: [
        ['','','タイトル','','','','',''],
        ['','','','','','','',''],
        ['','','C3','D3','E3','F3','',''],
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

