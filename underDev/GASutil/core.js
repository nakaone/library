function GASutil() {
  const pv = { whois: 'GASutil', rv: null};

  /** listFiles : カレントディレクトリ直下のファイル一覧を取得
   * @param {void}
   * @returns {FileInfoObj[]} "FileInfoObj"はconfig.schema.master参照
   */
  function listFiles(folderId=null) {
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

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  /** getFileProperties: Fileオブジェクトから属性情報を取得、オブジェクト化
   * @param {File} file - Fileオブジェクト
   * @returns {Object}
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

  dev.start(pv.whois);
  try {

    dev.step(1);
    pv.rv = {
      listFiles,
      // overLimit: 最大起動時間を超えた場合、再試行するトリガーを生成
    };

    dev.end(); // 終了処理
    return pv.rv;

  } catch (e) { dev.error(e); return e; }
}
