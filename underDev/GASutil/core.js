/**
 * @typedef {Object} FileProperties - ファイルの属性情報
 * @property {string} id - ファイルID
 * @property {string} name - ファイル名
 * @property {string} mime - MIMEタイプ
 * @property {string} desc - 説明
 * @property {string} url - ファイルを開くURL
 * @property {string[]} viewers - 閲覧者・コメント投稿者(e-mail)のリスト
 * @property {string[]} editors - 編集者(e-mail)のリスト
 * @property {string} created - ファイルの作成(アップロード)日付。拡張ISO8601形式の文字列
 * @property {string} updated - ファイルの最終更新日付。拡張ISO8601形式の文字列
 */

/** GASutil: GAS 関連のユーティリティ集
 * @namespace GASutil
 * @param {Object} arg={}
 * @param {Object} [arg.db] - SpreadDbへの起動時引数
 * @param {schemaDef} [arg.db.schema] - schema
 * @param {Object} [arg.db.opt] - opt。現状無し
 * @param {string} [arg.FileListSheetName=null] - ファイル一覧を保存するシート名
 */
function GASutil(arg={}) {
  const pv = { whois: 'GASutil', rv: null};

  /** getFileProperties: Fileオブジェクトから属性情報を取得し、FilePropertiesオブジェクトとして返す
   * @memberof GASutil
   * @param {GoogleAppsScript.Drive.File} file - DriveのFileオブジェクト
   * @returns {FileProperties} ファイルの属性情報
   */
  function getFileProperties(file){
    const rv = {
      id: file.getId(), // ID
      name: file.getName(), // ファイル名
      mime: file.getMimeType(),
      desc: file.getDescription(),  // 説明
      url: file.getUrl(), // ファイルを開くURL
      //download : file.getDownloadUrl(),  // ダウンロードに使用するURL
      viewers: [], // {string[]} 閲覧者・コメント投稿者のリスト
      editors: [], // {string[]} 編集者(e-mail)のリスト
      created: toLocale(file.getDateCreated()), // {string} ファイルの作成(アップロード)日付。拡張ISO8601形式の文字列
      updated: toLocale(file.getLastUpdated()), // {string} ファイルの最終更新日付。拡張ISO8601形式の文字列
    };

    // Userからe-mailを抽出
    // class User: https://developers.google.com/apps-script/reference/drive/user?hl=ja
    file.getViewers().forEach(x => rv.viewers.push(x.getEmail()));
    file.getEditors().forEach(x => rv.editors.push(x.getEmail()));
    return rv;
  }

  /** listFiles: 指定フォルダ直下のファイル一覧を取得
   * @memberof GASutil
   * @param {string} [folderId=null] - フォルダID。nullの場合は現在のスプレッドシートが存在するフォルダ
   * @param {string} [sheetName=null] - ファイル一覧を保存するシート名
   *   - null: シートに保存しない
   *   - 空文字列: シート名はpv.FileListSheetNameを参照
   * @returns {FileProperties[]} ファイル属性情報の配列
   */
  function listFiles(folderId=null,sheetName=null) {
    const v = { whois: 'listFiles', rv: [], base: new Date().getTime() };
    // base: 開発用にold.jsonを作成する際、リスト化対象日時を指定(ex. new Date('2025/4/1'))
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1);  // 対象フォルダの特定
      // -------------------------------------------------------------
      if( folderId === null ){
        dev.step(1.1);  // 本スプレッドシートのIDを取得
        v.spread = SpreadsheetApp.getActiveSpreadsheet();
        v.spreadId = v.spread.getId();

        dev.step(1.2);  // 親フォルダおよび直下のファイルを取得
        v.parent = DriveApp.getFileById(v.spreadId).getParents();
        folderId = v.parent.next().getId();
      }

      dev.step(1.3);  // 対象フォルダのFolderオブジェクトを取得
      v.folder = DriveApp.getFolderById(folderId);
      if( v.folder instanceof Error ) throw v.folder;

      dev.step(1.4);  // 対象フォルダ直下のファイルオブジェクトを取得
      v.files = v.folder.getFiles();

      // -------------------------------------------------------------
      dev.step(2);  // ファイルを取得、その属性をオブジェクト化
      // -------------------------------------------------------------
      while (v.files.hasNext()) {
        v.file = v.files.next();
        v.rv.push(getFileProperties(v.file));
      }
      dev.dump(v.rv);

      // -------------------------------------------------------------
      dev.step(3);  // シート保存指定が有れば格納
      // -------------------------------------------------------------
      if( typeof sheetName === 'string' ){
        dev.step(3.1);  // 保存先テーブル・シート名の特定
        if( sheetName === '' ){
          if( pv.FileListSheetName ){
            sheetName = pv.FileListSheetName;
          } else {
            throw new Error('Invalid FileListSheetName');
          }
        }

        dev.step(3.2);  // RDBに格納
        v.sql = `insert into ${sheetName} select * from ?;`;
        v.r = pv.db.exec(v.sql,[v.rv]);
        if( v.r instanceof Error ) throw v.r;

        dev.step(3.3);  // シートにセーブ
        v.r = pv.db.save(sheetName);
        if( v.r instanceof Error ) throw v.r;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  dev.start(pv.whois);
  try {

    dev.step(1.1);  // 引数に既定値設定、pvに保存
    arg = mergeDeeply(arg,{
      db: null,
      FileListSheetName: null,
    });
    Object.keys(arg).forEach(x => pv[x]=arg[x]);

    dev.step(1.2);  // SpreadDbを使用する場合、pv.dbとして生成
    if( arg.db !== null ){
      if( typeof arg.db.opt === 'undefined' ) arg.db.opt = {};
      pv.db = SpreadDb(arg.db.schema,arg.db.opt);
      if( pv.db instanceof Error ) throw pv.db;
    }

    dev.end(); // 終了処理
    pv.rv = {
      listFiles,
      // overLimit: 最大起動時間を超えた場合、再試行するトリガーを生成
    };
    return pv.rv;

  } catch (e) { dev.error(e); return e; }
}
