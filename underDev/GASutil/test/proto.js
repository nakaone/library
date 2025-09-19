//::$lib/devTools/1.0.1/core.js::
//::$lib/mergeDeeply/1.2.0/core.js::
//::$lib/toLocale/1.2.0/core.js::
//::$lib/whichType/1.0.1/core.js::
//::$lib/Schema/1.1.0/core.js::
//::$lib/SpreadDb/2.1.0/core.js::
//::$lib/AlaSQLonGAS/1.7.2/alasql.min.js::
//::$prj/core.js::

const dev = devTools();
const test = () => {
  const v = {whois:'test'};
  dev.start(v.whois);
  try {

    const config = {
      db: {
        schema: {
          dbName: 'GASutil',
          tableDef: {
            'ファイル一覧': {
              colDef: [
                {name:'id',label:'ファイルID',type:'string',note:''},
                {name:'name',label:'ファイル名',type:'string',note:''},
                {name:'mime',label:'MIME',type:'string',note:''},
                {name:'desc',label:'説明',type:'string',note:''},
                {name:'url',label:'URL',type:'string',note:''},
                {name:'viewers',label:'閲覧者',type:'string',note:''},
                {name:'editors',label:'編集者',type:'string',note:''},
                {name:'created',label:'作成日時',type:'string',note:''},
                {name:'updated',label:'更新日時',type:'string',note:''},
              ]
            }
          },
          tables: {
            'ファイル一覧': {},
          }
        }
      },
      //FileListSheetName: 'ファイル一覧',
    };
    const util = GASutil(config);

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