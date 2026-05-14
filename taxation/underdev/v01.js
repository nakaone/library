function test(){
  exportJSON({
    files: getFileList(),
    ee: getSheetDataAsObjects('電子証憑'),
    transport: getSheetDataAsObjects('交通費'),
    reference: getSheetDataAsObjects('参考資料'),
    topix: getSheetDataAsObjects('特記事項'),
  });
}

/**
 * 指定したシートの全データをオブジェクトの配列として取得する
 * @param {string} sheetName シート名
 * @return {Object[]} オブジェクトの配列
 */
function getSheetDataAsObjects(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error("シート「" + sheetName + "」が見つかりません");
  }

  // シートの全データを二次元配列で取得
  const data = sheet.getDataRange().getValues();
  
  if (data.length < 1) return []; // データがない場合

  // 1行目（ヘッダー）を取得
  const headers = data.shift();

  // 2行目以降のデータをオブジェクトに変換
  return data.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      // 1行目の値をキー、その列の値をバリューとしてセット
      obj[header] = row[index];
    });
    return obj;
  });
}

/** getFileList : カレントディレクトリ直下のファイル一覧を取得
 * @param {void}
 * @returns {FileInfoObj[]} "FileInfoObj"はconfig.schema.master参照
 */
function getFileList() {
  const v = {rv:[]};

  // 本スプレッドシートのIDを取得
  v.spread = SpreadsheetApp.getActiveSpreadsheet();
  v.spreadId = v.spread.getId();

  // 親フォルダおよび直下のファイルを取得
  v.parent = DriveApp.getFileById(v.spreadId).getParents();
  v.folderId = v.parent.next().getId();
  v.folder = DriveApp.getFolderById(v.folderId);
  v.files = v.folder.getFiles();

  while (v.files.hasNext()) {
    // ファイルを取得、その属性をオブジェクト化
    v.file = v.files.next();
    if( v.file.getMimeType() === "application/pdf"){
      v.rv.push({
        id: v.file.getId(), // ID
        name: v.file.getName(), // ファイル名
        url: v.file.getUrl(), // ファイルを開くURL
      });
    }
  }
  return v.rv;
}

/** exportJSON: 引数をJSON化、ダウンロード
 * @param {Object} obj - ダウンロードするデータ
 * @returns {void}
 */
function exportJSON(obj) {
  // HTMLをコード内で定義
  const html = HtmlService.createHtmlOutput(`
    <html>
      <head><base target="_top"></head>
      <body>
        <p>JSONファイルのダウンロードを開始しています...</p>
        <script>
          const data = ${JSON.stringify(obj)};

          // JSONとしてファイルを生成して自動ダウンロード
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'data.json';
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);

          // ダイアログを自動的に閉じる（少し待ってから）
          setTimeout(() => {
            google.script.host.close();
          }, 1000);
        </script>
      </body>
    </html>
  `).setWidth(300).setHeight(100);

  // ダイアログの表示
  SpreadsheetApp.getUi().showModalDialog(html, 'JSONをダウンロード中');
}
