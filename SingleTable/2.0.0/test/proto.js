function test(){
  const v = {whois:'test',step:0,rv:null};
  console.log(`${v.whois} start.`);
  try {

    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.sheet = v.spread.getSheetByName('target');
    v.sheet.getRange(3,3,1,1).setNote('type: UUID');

    // ①constructor: シートイメージで生成、シート≠範囲
    v.rv = new SingleTable('target!C3:F',{
      primaryKey: 'D3',
      raw: [
        ['string','boolean','date','number'],
        ['a',undefined,'1965/9/5',-1],
        ['tRue',null,'12:34',Infinity],
        ['{"a":10}',false,Date.now(),0],
        ['d',true,new Date(),1.23e+4],
      ]
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

//::SingleTable::$prj/core.js::
//::$lib/mergeDeeply/1.1.0/core.js::
//::$lib/stringify/1.1.1/core.js::
//::$lib/toLocale/1.1.0/core.js::
//::$lib/vlog/1.1.0/core.js::
//::$lib/whichType/1.0.1/core.js::