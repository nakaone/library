//::$lib/devTools/1.0.1/core.js::
//::$lib/mergeDeeply/1.2.0/core.js::
//::$lib/toLocale/1.2.0/core.js::
//::$lib/whichType/1.0.1/core.js::
//:xxx:$lib/Schema/1.1.0/core.js::
//::$dev/Schema/core.js::
//:xxx:$lib/SpreadDb/2.1.0/core.js::
//::$dev/SpreadDb/core.js::
//::$lib/AlaSQLonGAS/1.7.2/alasql.min.js::
//::$prj/core.js::

const dev = devTools();
const testArg = {
  db: {
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
  },
  FileListSheetName: 'ファイル一覧',
};
const util = GASutil(testArg);

const test = () => {
  const v = {whois:'test'};
  dev.start(v.whois);
  try {

    dev.step(1); // fileId指定
    const fId = '1l83rcHCxdDEFDbFlJlbJY7fa5izVT36r';  // 0.12系
    //const fId = '13J2Yvzc6QPCxnevxyiy70oCEislV-Y3T';  // 電子証憑2024
    v.r = util.listFiles(fId);
    if( v.r instanceof Error ) throw v.r;
    dev.dump(v.r);

    /* 以下はGASutil起動時テスト
    dev.step(2);  // fileId無指定 ⇒ スプレッドシートが存在するフォルダ
    v.r = util.listFiles();
    if( v.r instanceof Error ) throw v.r;
    dev.dump(v.r);

    dev.step(3);  // 不正fileId指定
    v.r = util.listFiles('fuga');
    if( v.r instanceof Error ) throw v.r;
    dev.dump(v.r);
    */

    dev.end();  // 終了処理
  } catch (e) { dev.error(e); return e; }
}