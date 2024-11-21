function test(){
  const v = {whois:'test',step:0,rv:null,
    tables:{
      target: { // "target"シート
        name: 'target',
        range: 'target!c3:f',
        raw: [
          ['string','boolean','date','number'],
          ['a',undefined,'1965/9/5',-1],
          ['tRue',null,'12:34',Infinity],
          ['{"a":10}',false,Date.now(),0],
          ['d',true,new Date(),1.23e+4],
        ],
        cols: null,
      },
      master: { // "master"シート
        name: 'master',
        // range指定は無し
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
          {name:'entryNo',type:'number',primaryKey:true,auto_increment:[10,1]},
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
      },
    },
    spread: SpreadsheetApp.getActiveSpreadsheet(),
    deleteSheet: (sheetName) => {  // テスト用シートの削除
      v.sheet = v.spread.getSheetByName(sheetName);
      if( v.sheet !== null ) v.spread.deleteSheet(v.sheet);
    },
    setupData: (sheetName,whichData=0) => { // whichData 0:初期データ不使用, 1:シートイメージ, 2:行オブジェクト
      console.log(`setupData start. sheetName=${sheetName}, whichData=${whichData}`);

      v.step = 1; // テストデータにパターン設定
      v.table = Object.assign({
        // spread: v.spread,
        name: null,
        cols:null,
      },v.tables[sheetName]);

      switch(whichData){
        case 0: v.step = 2; // 初期データ(values)を使用しない
          break;
        case 1: v.step = 3; // シートイメージを初期データとする
          if( v.tables[sheetName].raw ){
            v.table.values = v.tables[sheetName].raw;
          } else {
            // 行オブジェクトをシートイメージに変換
            v.table.values = [v.tables[sheetName].cols.map(x => x.name)];
            for( v.i=0 ; v.i<v.tables[sheetName].data.length ; v.i++ ){
              v.table.values[v.i+1] = [];
              for( v.j=0 ; v.j<v.table.values[0].length ; v.j++ ){
                v.table.values[v.i+1].push(v.tables[sheetName].data[v.table.values[0][v.j]] || null);
              }
            }
          }
          break;
        case 2: v.step = 4; // 行オブジェクトを初期データとする
          if( v.tables[sheetName].data ){
            v.table.values = v.tables[sheetName].data;
          } else {
            // シートイメージを行オブジェクトに変換
            v.table.values = [];
            for( v.i=1 ; v.i<v.tables[sheetName].raw.length ; v.i++ ){
              v.table.values[v.i-1] = {};
              for( v.j=0 ; v.j<v.tables[sheetName].raw[v.i].length ; v.j++ ){
                if( v.tables[sheetName].raw[v.i][v.j] ){
                  v.table.values[v.i-1][v.tables[sheetName].raw[0][v.j]] = v.tables[sheetName].raw[v.i][v.j];
                }
              }
            }
          }
          break;
      }
      console.log(`setupData end. v.table=${stringify(v.table)}`);
      v.table.spread = v.spread; // ログ表示の際に不要なSpreadsheetオブジェクトは後から追加
      return v.table;
    },
    appendSample: [
      {
        タイムスタンプ: toLocale(new Date()),
        メールアドレス: `x${Date.now()}@gmail.com`,
        // 申込者氏名: ,
        // 申込者カナ: ,
        // 申込者の参加: ,
        // 宿泊、テント: ,
        // 引取者氏名: ,
        // 参加者01氏名: ,
        // 参加者01カナ: ,
        // 参加者01所属: ,
        // 参加者02氏名: ,
        // 参加者02カナ: ,
        // 参加者02所属: ,
        // 参加者03氏名: ,
        // 参加者03カナ: ,
        // 参加者03所属: ,
        // 参加者04氏名: ,
        // 参加者04カナ: ,
        // 参加者04所属: ,
        // 参加者05カナ: ,
        // 参加者05氏名: ,
        // 参加者05所属: ,
        // 緊急連絡先: ,
        // ボランティア募集: ,
        // 備考: ,
        // キャンセル: ,
        // authority: ,
        // CPkey: ,
        // entryNo: ,
        // trial: ,
        // editURL: ,
        // entryTime: ,
        // receptionist: ,
        // fee00: ,
        // fee01: ,
        // fee02: ,
        // fee03: ,
        // fee04: ,
        // fee05: ,
        // memo: ,
      },
    ],
    updateSample: [
      {where:'1',data:{authority:3}},
    ],
  };
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; v.tests = [ // テストパターンの定義
      () => { // pattren.0 : "target"シートをシートイメージから新規作成
        ['target','master','log'].forEach(x => v.deleteSheet(x));
        return new SpreadDB(v.setupData('target',1));
      },
      () => { // pattren.1 : "master"シートをシートイメージから新規作成
        ['target','master','log'].forEach(x => v.deleteSheet(x));
        return new SpreadDB(v.setupData('master',1));
      },
      () => { // pattren.2 : "target","master"シートを行オブジェクトから新規作成
        ['target','master','log'].forEach(x => v.deleteSheet(x));
        new SpreadDB([v.setupData('target',2),v.setupData('master',2)]);
      },
      () => { // pattern.3 : 既存シートのスキーマ他、各種属性設定状況を確認
        // spread {Spreadsheet} スプレッドシートオブジェクト
        // name {string} テーブル名
        // range {string} A1記法の範囲指定
        // sheetName {string} シート名
        // sheet {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
        // schema {sdbSchema} シートの項目定義
        //    cols {sdbColumn[]} 項目定義オブジェクトの配列
        //       name {string} 項目名
        //       type {string} データ型。string,number,boolean,Date,JSON,UUID
        //       format {string} 表示形式。type=Dateの場合のみ指定
        //       options {string} 取り得る選択肢(配列)のJSON表現。ex. ["未入場","既収","未収","無料"]
        //       default {any} 既定値
        //       primaryKey {boolean}=false 一意キー項目ならtrue
        //       unique {boolean}=false primaryKey以外で一意な値を持つならtrue
        //       auto_increment {bloolean|null|number|number[]}=false 自動採番項目。
        //         null ⇒ 自動採番しない
        //         boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない
        //         number ⇒ 自動採番する(基数=指定値,増減値=1)
        //         number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)
        //       suffix {string} "not null"等、上記以外のSQLのcreate table文のフィールド制約
        //       note {string} 本項目に関する備考。create table等では使用しない
        //    primaryKey {string}='id' 一意キー項目名
        //    unique {Object.<string, any[]>} primaryKeyおよびunique属性項目の管理情報。メンバ名はprimaryKey/uniqueの項目名
        //    auto_increment {Object.<string,Object>} auto_increment属性項目の管理情報。メンバ名はauto_incrementの項目名
        //      base {number} 基数
        //      step {number} 増減値
        //      current {number} 現在の最大(小)値。currentはsdbTableインスタンスで操作する。
        //    defaultRow {Object} 既定値項目で構成されたオブジェクト。appendの際のプロトタイプ
        // values {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
        // top {number} ヘッダ行の行番号(自然数)。通常header+1
        // left {number} データ領域左端の列番号(自然数)
        // right {number} データ領域右端の列番号(自然数)
        // bottom {number} データ領域下端の行番号(自然数)
        v.r = new SpreadDB([{name:'target',range:'target!c3:f'},'master']);
        return JSON.parse(JSON.stringify(v.r.tables.target));
        //v.rv = Object.keys(v.r);
        //v.rv = {schema:v.r.target.schema,values:v.r.target.values};
      },
      () => { // pattern.4 : 既存シートのスキーマ他、各種属性設定状況を確認
        v.r = new SpreadDB('master');
        v.r = JSON.parse(JSON.stringify(v.r.tables.master));
        v.log = {};
        ['name','range','sheetName','top','left','right','bottom'].forEach(x => v.log[x] = v.r[x]);
        console.log(JSON.stringify(v.log));
        console.log(stringify(v.r.values[0]));
        // schema: ログに出力しきれないので分割
        v.log = JSON.parse(JSON.stringify(v.r.schema));
        delete v.log.cols;
        console.log(JSON.stringify(v.log));
        v.r.schema.cols.forEach(col => console.log(JSON.stringify(col)));
      },
      () => { // pattern.5 : 項目定義メモを編集、結果が反映されていることの確認
        v.r = new SpreadDB('master');
        return v.r.tables.master.schema.cols.find(x => x.name === '申込者氏名').unique;
      },
      () => { // pattern.6 : appendテスト
        // auto_increment - entryNo欄で確認
        // default - authority欄で確認
        v.sdb = new SpreadDB('master',{account:'hoge'});
        return v.sdb.tables.master.append(v.appendSample[0]);
      },
      () => { // pattern.7 : appendテスト - unique項目の重複
        v.sdb = new SpreadDB('master',{account:'hoge'});
        return v.sdb.tables.master.append(Object.assign(v.appendSample[0],{'メールアドレス':'nakaone.kunihiro@gmail.com'}));
      },
      () => { // pattern.8 : updateテスト
        v.deleteSheet('master');  // masterシートは再作成
        v.sdb = new SpreadDB(v.setupData('master',1));
        return v.sdb.tables.master.update(v.updateSample[0]);
      },
      () => { // pattern.9 : 
      },
      () => { // pattern.10 : 
      },
      () => { // pattern.11 : 
      },
    ];

    v.step = 2; // テスト実行
    v.rv = v.tests[8]();

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}