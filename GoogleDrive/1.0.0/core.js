function GoogleDrive(arg={}) {
  const pv = {whois: 'GoogleDrive',cols:[  // シートの項目定義
    {name:'id', type:'string', note:'', primaryKey:true},
    {name:'name', type:'string', note:''},
    {name:'mime', type:'string', note:'ファイルのMIMEタイプ'},
    {name:'desc', type:'string', note:'ファイルの説明'},
    {name:'url', type:'string', note:'ファイルを開く際に使用するURL'},
    {name:'download', type:'string', note:'ファイルをダウンロードする際に使用するURL'},
    {name:'viewers', type:'string[]', note:'閲覧者・コメント投稿者のリスト'},
    {name:'editors', type:'string[]', note:'編集者(e-mail)のリスト'},
    {name:'created', type:'string', note:'ファイルの作成日付。拡張ISO8601形式の文字列 '},
    {name:'updated', type:'string', note:'ファイルの最終更新日付。拡張ISO8601形式の文字列 '},
    {name:'isDeleted', type:'string', note:'削除済ならtrue', default: '()=>{return false}'},
  ]};
  const v = { whois: `${pv.whois}.main`, rv: null};
  dev.start(v.whois, [...arguments]);
  try {

    // -------------------------------------------------------------
    dev.step(1); // 引数をメンバに格納
    // -------------------------------------------------------------
    v.r = constructor(arg);
    if( v.r instanceof Error ) throw v.r;

    // フォルダ内の全てのファイルを取得。但し子フォルダ内は取得対象外
    v.r = listFiles(pv.folder);
    if( v.r instanceof Error ) throw v.r;

    // listシートの内容を取得、ファイル一覧と比較してシートを更新し、結果を行オブジェクトの配列として返す
    v.r = updateList(v.r,pv.data);
    if( v.r instanceof Error ) throw v.r;
    v.rv = JSON.stringify(v.r);

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }

  function constructor(arg) {
    const v = { whois: `${pv.whois}.constructor`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1); // メンバ設定、Google Driveシート・フォルダ取得
      // -------------------------------------------------------------
      dev.step(1.1);  // メンバ設定
      v.default = {
        root: 'current',
        children: false,
        type: null,
        table: 'list',
        json: true,
      };
      for( let k in v.default ){
        pv[k] = arg[k] || v.default[k]
      }

      dev.step(1.2);  // 本スプレッドシートのIDを取得
      pv.spread = SpreadsheetApp.getActiveSpreadsheet();
      pv.spreadId = pv.spread.getId();

      dev.step(1.3);  // 親フォルダを取得
      v.parent = DriveApp.getFileById(pv.spreadId).getParents();
      pv.folderId = v.parent.next().getId();
      pv.folder = DriveApp.getFolderById(pv.folderId);

      // -------------------------------------------------------------
      dev.step(2);  // シート情報
      // -------------------------------------------------------------
      dev.step(2.1);  // 対象シート作成
      v.r = SpreadDb([
        {command: 'create', table: pv.table, cols: pv.cols,},
        {command: 'select', table: pv.table, where:true}, // 全件抽出
      ], { userId: 'Administrator' });
      if (v.r instanceof Error) return v.r;
      pv.data = v.r[1].result;  // シート上に保存されているデータ
      dev.dump(pv.data,79);

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  function listFiles(folder) {
    const v = { whois: `${pv.whois}.listFiles`, rv: []};
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // フォルダ内のファイルを取得
      v.files = folder.getFiles();

      dev.step(2);  // 各ファイルの情報をオブジェクト化
      while( v.files.hasNext() ){
        v.file = v.files.next();
        v.obj = {
          id: v.file.getId(), // ID
          name: v.file.getName(), // ファイル名
          mime: v.file.getMimeType(),
          desc: v.file.getDescription(),  // 説明
          url: v.file.getUrl(), // ファイルを開くURL
          download : v.file.getDownloadUrl(),  // ダウンロードに使用するURL
          viewers : [], // {string[]} 閲覧者・コメント投稿者のリスト
          editors : [], // {string[]} 編集者(e-mail)のリスト
          created : toLocale(v.file.getDateCreated()), // {string} ファイルの作成(アップロード)日付。拡張ISO8601形式の文字列
          updated : toLocale(v.file.getLastUpdated()), // {string} ファイルの最終更新日付。拡張ISO8601形式の文字列
        };
        // Userからe-mailを抽出
        // class User: https://developers.google.com/apps-script/reference/drive/user?hl=ja
        v.file.getViewers().forEach(x => v.obj.viewers.push(x.getEmail()));
        v.file.getEditors().forEach(x => v.obj.editors.push(x.getEmail()));
        v.rv.push(v.obj);
        dev.dump(v.obj,99);
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  function updateList(drive,table) {
    const v = { whois: `${pv.whois}.updateList`, rv: null, drive:[],table:[],query:[]};
    dev.start(v.whois, [...arguments]);
    try {
      /*
      drive - Google Drive上のファイル情報
      table - listシートに記録されたファイル情報

      drive有・table有 : 作成・更新日時が異なったらdriveの値で更新
      drive有・table無 : tableにdriveの行オブジェクトを追加
      drive無・table有 : table.isDeletedにtrueをセット
      */

      // -------------------------------------------------------------
      dev.step(1); // 事前準備
      // -------------------------------------------------------------  
      v.drive = JSON.parse(JSON.stringify(drive));
      v.table = JSON.parse(JSON.stringify(table));

      // -------------------------------------------------------------
      dev.step(2); // Google Drive上のファイル情報を順次反映
      // -------------------------------------------------------------  
      for( v.i=0 ; v.i<v.drive.length ; v.i++ ){
        v.idx = v.table.findIndex(x => x.id === v.drive[v.i].id);
        if( v.idx < 0){
          dev.step(2.1);  // drive有・table無 : tableにdriveの行オブジェクトを追加
          v.query.push({
            command: 'append',
            table: pv.table,
            set: v.drive[v.i],
          });
        } else if( new Date(drive[v.i].created).getTime() !== new Date(table[v.indexOf].created).getTime()
          || new Date(drive[v.i].updated).getTime() !== new Date(table[v.indexOf].updated).getTime() ){
          dev.step(2.2); // drive有・table有 : 作成・更新日時が異なったらdriveの値で更新
          v.query.push({
            command: 'update',
            table: pv.table,
            where: {id: v.drive[v.i].id},
            set: {created:v.drive[v.i].created, updated:v.drive[v.i].updated},
          });
          dev.step(2.3);  // driveにも存在する要素はtableから削除
          v.table.splice(v.idx,1);
        }
      }

      dev.step(2.4); // fdrive無・table有 : table.isDeletedにtrueをセット
      v.table.forEach(x => {
        v.query.push({
          command: 'update',
          table: pv.table,
          where: {id: x.id},
          set: {isDeleted: true},
        })
      });
      dev.dump(v.query,175);

      // -------------------------------------------------------------  
      dev.step(3);  // listシートを更新
      // -------------------------------------------------------------  
      dev.step(3.1);  // 更新後のlistシートを取得
      v.query.push({command: 'select', table: pv.table, where:()=>true});
      dev.step(3.2);  // 更新実行
      v.r = SpreadDb(v.query, { userId: 'Administrator' });
      if (v.r instanceof Error) return v.r;
      v.rv = v.r[v.query.length-1].result;  // シート上に保存されているデータ
      dev.dump(v.r[v.query.length-1],194);
      dev.end(); // 終了処理
      return v.rv;
  
    } catch (e) { dev.error(e); return e; }
  }
  
}