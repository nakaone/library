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
      dev.step(3.1);  // ファイルを取得、その属性をオブジェクト化
      v.file = v.files.next();
      v.obj = getFileProperties(v.file);

      dev.step(3.2);  // 指定日時以前に作成されたファイルを出力(old.json作成用)
      if (v.file.getDateCreated().getTime() < v.base) {
        v.rv.push(v.obj);
      }
    }

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}