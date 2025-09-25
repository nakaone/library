//::$lib/devTools/1.0.1/core.js::
//::$lib/mergeDeeply/1.2.0/core.js::
//::$lib/toLocale/1.2.0/core.js::
//::$lib/whichType/1.0.1/core.js::
//:xxx:$lib/Schema/1.1.0/core.js::
//::$dev/Schema/core.js::
//::$lib/AlaSQLonGAS/1.7.2/alasql.min.js::
//::$prj/core.js::

const dev = devTools();
const testArg = {
  schema: {
    dbName: 'GASutil',
    tableDef: {
      'ファイル一覧': {
        primaryKey:'id',
        colDef:[
          {name:'id', label:'ファイルID', type:'string', note:'ファイルID'},
          {name:'name', label:'ファイル名', type:'string', note:'ファイル名'},
          {name:'mime', label:'MIME', type:'string', note:'MIMEタイプ'},
          {name:'desc', label:'説明', type:'string', note:'説明'},
          {name:'url', label:'URL', type:'string', note:'ファイルを開くURL'},
          {name:'viewers', label:'閲覧者', type:'string', note:'閲覧者・コメント投稿者(e-mail)のリスト。カンマ区切り'},
          {name:'editors', label:'編集者', type:'string', note:'編集者(e-mail)のリスト。カンマ区切り'},
          {name:'created', label:'作成日時', type:'string', note:'ファイルの作成(アップロード)日付。拡張ISO8601形式の文字列'},
          {name:'updated', label:'更新日時', type:'string', note:'ファイルの最終更新日付。拡張ISO8601形式の文字列'},
          {name:'before', label:'修正前', type:'string', note:''},
          {name:'after', label:'修正後', type:'string', note:''},
          {name:'result', label:'結果', type:'string', note:''},
          {name:'note', label:'備考', type:'string', note:''},
        ]
      },
    },
    tableMap: {'ファイル一覧':{data:[]}},
    custom: {},
  },
  opt: {},  // 現状無し
};

const test = () => {
  const v = {whois:'test'};
  dev.start(v.whois);
  try {

    dev.step(1);
    v.db = SpreadDb(testArg.schema,testArg.opt);

    // -------------------------------------------------------------
    dev.step(2);  // SpreadDb.upsertテスト
    // -------------------------------------------------------------
    dev.step(2.1);  // テストデータのセット
    v.sql
    // ①テストデータをinsert
    = 'insert into `ファイル一覧` (id,name) values (1,"f01"),(2,"f02"),(3,"f03");'
    // ②一部を削除
    + 'delete from `ファイル一覧` where id=2;'
    // ③既存レコードの更新と新規レコード追加
    + 'delete from `ファイル一覧` where id in(3,4);'  // 追加・更新対象を削除
    + 'insert into `ファイル一覧` (id,name) values (3,"f03"),(4,"f04");'
    ;
    v.r = v.db.exec(v.sql);
    // ④：残っているのが①＋②−③になっていることを確認
    dev.dump(v.r,v.db.exec('select * from `ファイル一覧`;'));

    /* テストOKにつきコメントアウト
    dev.step(2.2);  // 存在しないテーブル ⇒ エラー
    v.r = v.db.upsert('hoge');
    dev.dump(v.r.message);
    */
    
    dev.step(2.3);  // テスト実施
    v.r = v.db.upsert('ファイル一覧',[
      {id:5,name:'f05'},  // insert(id有り)
      {name:'f06',mime:'json'},  // insert(id無し)
      {id:4,mime:'text'},  // update。nameは更新対象外
    ]);

    dev.end();  // 終了処理
  } catch (e) { dev.error(e); return e; }
}