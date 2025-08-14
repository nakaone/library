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