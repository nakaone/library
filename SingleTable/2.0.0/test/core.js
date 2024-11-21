function test(){
  const v = {whois:'test',step:0,rv:null,
    // ----- 定数・ユーティリティ関数群
    spread: SpreadsheetApp.getActiveSpreadsheet(),
    deleteSheet: (sheetName) => {  // テスト用シートの削除関数
      v.sheet = v.spread.getSheetByName(sheetName);
      if( v.sheet !== null ) v.spread.deleteSheet(v.sheet);
    },
    raw2obj: sheet => { // シートイメージ(二次元配列)を行オブジェクトに変換
      v.data = JSON.parse(JSON.stringify(v.src[sheet].values));
      v.src[sheet].values = [];
      for( v.i=1 ; v.i<v.data.length ; v.i++ ){
        v.o = {};
        for( v.j=0 ; v.j<v.data[v.i].length ; v.j++ ){
          if( v.data[v.i][v.j] ) v.o[v.data[0][v.j]] = v.data[v.i][v.j];
        }
        v.src[sheet].values.push(v.o);
      }
    },
    // ----- テスト用ソース(サンプルデータ)
    src: {
      target: { // "target"シート
        name: 'target',
        range: 'target!c3:f',
        values: [
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
        account: 'hoge',
        values: [
          ['タイムスタンプ','メールアドレス','申込者氏名','申込者カナ','申込者の参加','宿泊、テント','引取者氏名','参加者01氏名','参加者01カナ','参加者01所属','参加者02氏名','参加者02カナ','参加者02所属','参加者03氏名','参加者03カナ','参加者03所属','参加者04氏名','参加者04カナ','参加者04所属','参加者05カナ','参加者05氏名','参加者05所属','緊急連絡先','ボランティア募集','備考','キャンセル','authority','CPkey','entryNo','trial','editURL','entryTime','receptionist','fee00','fee01','fee02','fee03','fee04','fee05','memo'],
          ['2024/10/06 19:51:06','nakaone.kunihiro@gmail.com','島津　邦浩','シマヅ　クニヒロ','スタッフとして申込者のみ参加(おやじの会メンバ)','宿泊しない','','','','','','','','','','','','','','','','','','','','','2','jZiM1isJ+1AZoVZ9NnWTvCoeghCm+FY05eb6jhz8wpT3DwqJbNnszW8PWDd3sq0N5mjN/Nshh+RGGrdkm7CC+sO32js+wm1YmYGr0FMaFxvMBDrWzyJ7qrPI4unbx2IkrPkXSmSEbw91n/LOu0x7br106XeJ9TXJbJS16rV0nzs=','1','{"passcode":920782,"created":1728874149915,"result":0,"log":[{"timestamp":1728874165893,"enterd":920782,"status":1}]}','https://docs.google.com/forms/d/e/ULQ/viewform?edit2=2_ePpXliGgMlVVUYiSKgwX6SXBNrnwozwTMF09Ml1py7Ocp1N7_w5F7uqf52Ak63zBE','','','','','','','','',''],
          ['2024/09/15 12:47:04','via1315r@yahoo.co.jp','前田　素直','マエダ　スナオ','参加予定(宿泊なし)','宿泊しない','宿泊予定なので不要','前田　若菜','マエダ　ワカナ','1年生','','','','','','','','','','','','','9013357002','できる','食事以外でも、お手伝い出来る事があれば。','','1','','2','','https://docs.google.com/forms/d/e/ULQ/viewform?edit2=2_dWLvuoT6Wq0Hu-4tqFl5OyTK-Z7EwdMDEQGS1jKJVIa41Dh8nNJPtpFyPu8cyZYGo','','','','','','','','',''],
          ['2024/09/15 13:51:37','kousuke.murata4690@gmail.com','小早川　晃祐','コバヤカワ　コウスケ','参加予定(宿泊あり)','宿泊する(テントあり)','宿泊予定なので不要','小早川　涼','コバヤカワ　リョウ','6年生','','','','','','','','','','','','','','できる','','','1','','3','','https://docs.google.com/forms/d/e/ULQ/viewform?edit2=2_fKjD-xj5FN0GnTNIILVeJVwYJajCP8bZphy1zyleVl8UDLWqzUjDDFWZf7uMA0qtk','','','','','','','','',''],
          ['2024/09/15 14:18:02','nakaone2001@gmail.com','島津　弘子','シマヅ　ヒロコ','参加予定(宿泊なし)','宿泊しない','','島津　悠奈','シマヅ　ユウナ','4年生','','','','','','','','','','','','','','','','','2','k5lfKMj3ybfMF6jocHPln98lLJIBIxKrrpLc4RhPenBIEg6OfgdXYQAVh907SoCg0MEBazhWic2oFaKNFJu9pa4prXWvTzYjRWw5XkmC9a7AdNQ0judVMATii7Xqp6drowisY6+Rul2zwrF2UKY8epoYP8ZkX9RyH6OFyglYQL8=','4','{"passcode":65698,"created":1729076868102,"result":0,"log":[{"timestamp":1728729400367,"enterd":119192,"status":1}]}','https://docs.google.com/forms/d/e/ULQ/viewform?edit2=2_eGXR29gyuz_kc4UMghOrIa_iNPhrkHdrW4zVI8KFW5aB2jsVCtjq79aasCFBWgTvI','','','','','','','','',''],
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
      append: [ // appendメソッド用の引数
        // 00: 基本
        {タイムスタンプ: toLocale(new Date()),メールアドレス: `x${Date.now()}@gmail.com`},
      ],
      update: [ // updateメソッド用の引数
        // 00: primaryKeyで更新
        {where:'1',record:{authority:3}},
      ],
      delete: [ // deleteメソッド用の引数
        // 00: primaryKeyで更新
        '2',
      ],
    },
  };
  const pattern = { // テストパターン(関数)の定義
    constructor: [  // constructor関係のテスト
      () => { // "target"シートをシートイメージから新規作成
        ['target','master','log'].forEach(x => v.deleteSheet(x));
        return new SpreadDB(v.src.target);
      },
      () => { // "master"シートをシートイメージから新規作成
        ['target','master','log'].forEach(x => v.deleteSheet(x));
        return new SpreadDB(v.src.master);
      },
      () => { // "target","master"シートを行オブジェクトから新規作成
        ['target','master','log'].forEach(x => v.deleteSheet(x));
        // シートイメージから行オブジェクトへ変換
        ['target','master'].forEach(sheet => v.raw2obj(sheet));
        new SpreadDB([v.src.target,v.src.master]);
      },
      () => { // 既存シートのスキーマ他、各種属性設定状況を確認
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
    ],
    append: [ // sdbTable.append関係のテスト
      () => { // pattern.6 : appendテスト
        // auto_increment - entryNo欄で確認
        // default - authority欄で確認
        //['target','master','log'].forEach(x => v.deleteSheet(x));
        v.sdb = new SpreadDB(v.src.master);
        return v.sdb.tables.master.append(v.src.append[0]);
      },
      () => { // pattern.7 : appendテスト - unique項目の重複エラー
        //['target','master','log'].forEach(x => v.deleteSheet(x));
        v.sdb = new SpreadDB(v.src.master);
        v.src.append[0]['メールアドレス'] = 'nakaone.kunihiro@gmail.com';
        return v.sdb.tables.master.append(v.src.append[0]);
      },
    ],
    update: [ // sdbTable.update()関係のテスト
      () => { // pattern.8 : updateテスト
        ['target','master','log'].forEach(x => v.deleteSheet(x));
        v.sdb = new SpreadDB(v.src.master);
        return v.sdb.tables.master.update(v.src.update[0]);
      },
    ],
    delete: [ // sdbTable.delete関係のテスト
      () => { // pattern.9 : delete
        v.deleteSheet('master');  // masterシートは再作成
        v.sdb = new SpreadDB(v.src.master);
        return v.sdb.tables.master.delete(v.src.delete[0]);
      },
    ],
  };
  console.log(`${v.whois} start.`);
  try {

    v.p = 'append';
    for( v.i=0 ; v.i<pattern[v.p].length ; v.i++ ){
      v.rv = pattern[v.p][v.i]();
      if( v.rv instanceof Error ) throw v.rv;
      console.log(`===== pattern.${v.i} end.\n${stringify(v.rv)}`);
    }

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}