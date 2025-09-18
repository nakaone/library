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
      if( folderId === null ){
        dev.step(1);  // 本スプレッドシートのIDを取得
        v.spread = SpreadsheetApp.getActiveSpreadsheet();
        v.spreadId = v.spread.getId();

        dev.step(2);  // 親フォルダおよび直下のファイルを取得
        v.parent = DriveApp.getFileById(v.spreadId).getParents();
        folderId = v.parent.next().getId();
      }
      v.folder = DriveApp.getFolderById(folderId);
      v.files = v.folder.getFiles();

      while (v.files.hasNext()) {
        dev.step(3.1);  // ファイルを取得、その属性をオブジェクト化
        v.file = v.files.next();
        v.obj = getFileProperties(v.file);

        dev.step(3.2);  // 指定日時以前に作成されたファイルを出力(old.json作成用)
        //if (v.file.getDateCreated().getTime() < v.base) {
          v.rv.push(v.obj);
        //}
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
    };

    dev.end(); // 終了処理
    return pv.rv;

  } catch (e) { dev.error(e); return e; }
}
