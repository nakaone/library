/** getFileList : カレントディレクトリ直下のファイル一覧を取得
 * @param {void}
 * @returns {FileInfoObj[]} "FileInfoObj"はconfig.schema.master参照
 */
function getFileList() {
  const v = { whois: 'getFileList', rv: [], base: new Date().getTime() };
  // base: 開発用にold.jsonを作成する際、リスト化対象日時を指定(ex. new Date('2025/4/1'))
  dev.start(v.whois);
  try {

    dev.step(1);  // 本スプレッドシートのIDを取得
    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.spreadId = v.spread.getId();

    dev.step(2);  // 親フォルダおよび直下のファイルを取得
    v.parent = DriveApp.getFileById(v.spreadId).getParents();
    v.folderId = v.parent.next().getId();
    v.folder = DriveApp.getFolderById(v.folderId);
    v.files = v.folder.getFiles();

    while (v.files.hasNext()) {
      dev.step(3.1);  // ファイルを取得、戻り値となるFileInfoObjを作成
      v.file = v.files.next();
      v.obj = {
        id: v.file.getId(), // ID
        name: v.file.getName(), // ファイル名
        mime: v.file.getMimeType(),
        desc: v.file.getDescription(),  // 説明
        url: v.file.getUrl(), // ファイルを開くURL
        //download : v.file.getDownloadUrl(),  // ダウンロードに使用するURL
        viewers: [], // {string[]} 閲覧者・コメント投稿者のリスト
        editors: [], // {string[]} 編集者(e-mail)のリスト
        created: toLocale(v.file.getDateCreated()), // {string} ファイルの作成(アップロード)日付。拡張ISO8601形式の文字列
        updated: toLocale(v.file.getLastUpdated()), // {string} ファイルの最終更新日付。拡張ISO8601形式の文字列
        isExist: 'o',
      };

      dev.step(3.2);  // Userからe-mailを抽出
      // class User: https://developers.google.com/apps-script/reference/drive/user?hl=ja
      v.file.getViewers().forEach(x => v.obj.viewers.push(x.getEmail()));
      v.file.getEditors().forEach(x => v.obj.editors.push(x.getEmail()));

      dev.step(3.3);  // 指定日時以前に作成されたファイルを出力(old.json作成用)
      if (v.file.getDateCreated().getTime() < v.base) {
        v.rv.push(v.obj);
      }
    }

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}