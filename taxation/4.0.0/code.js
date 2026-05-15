function doGet() {
  return getBuiltHtml()
  .setTitle('税務作業・確認用')
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// HTML側から呼び出されるデータ取得関数
function exportJSON() {
  try {
    const rv = JSON.parse(JSON.stringify({
      files: getFileList(),
      ee: getSheetDataAsObjects('電子証憑'),
      transport: getSheetDataAsObjects('交通費'),
      reference: getSheetDataAsObjects('参考資料'),
      topix: getSheetDataAsObjects('特記事項'),
    }));
    return rv;
  } catch(e) {
    console.error(e);
    throw new Error(e.message);
  }
}

/** getSheetDataAsObjects: 指定したシートの全データをオブジェクトの配列として取得
 * @param {string} sheetName シート名
 * @return {Object[]} オブジェクトの配列
 */
function getSheetDataAsObjects(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if(!sheet) throw new Error(`Could not found "${sheetName}"`);

  const range = sheet.getDataRange();
  if( range.getNumRows() < 1 ) return [];

  const data = range.getValues();
  const cols = data.shift();
  return data.map(row => {
    const obj = {};
    cols.forEach((col, index) => {
      if(col) obj[col] = row[index];
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

/** getBuiltHtml: データ埋め込み済みのHTMLを生成する
 */
function getBuiltHtml() {
  const data = exportJSON(); // 既存のデータ取得関数
  const template = HtmlService.createTemplateFromFile('index');
  template.data = data; // テンプレート変数にデータをセット
  
  // 評価（evaluate）してHTMLコンテンツを取得
  return template.evaluate();
}

/** downloadPrintableHtml: 提出用HTMLの作成＋DL */
/**
 * HTMLをBase64エンコードして、ブラウザ側で復元・ダウンロードさせる
 * これにより、文字列内の特殊記号によるJSの構文エラーを完全に防ぎます。
 */
function downloadPrintableHtml() {
  // 1. 共通ロジックから、データ埋め込み済みのHTMLコンテンツを取得[cite: 2]
  const htmlContent = getBuiltHtml().getContent();
  
  // 2. 特殊文字対策として、HTML全文をBase64エンコードする
  const base64Content = Utilities.base64Encode(htmlContent, Utilities.Charset.UTF_8);
  
  // 3. ファイル名を作成
  const fileName = "tax_report_" + Utilities.formatDate(new Date(), "JST", "yyyyMMdd") + ".html";

  // 4. ダウンロード実行用スクリプト（Base64をデコードしてBlob化）
  const script = `
    <script>
      (function() {
        try {
          const b64 = '${base64Content}';
          // Base64からバイナリデータに復元
          const bin = atob(b64);
          const buf = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
          
          const blob = new Blob([buf], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = url;
          a.download = '${fileName}';
          document.body.appendChild(a);
          a.click();
          
          setTimeout(function() {
            URL.revokeObjectURL(url);
            google.script.host.close();
          }, 1500);
        } catch (e) {
          alert('ダウンロードに失敗しました: ' + e.message);
        }
      })();
    </script>
  `;

  // 5. ダイアログの表示
  const output = HtmlService.createHtmlOutput(
    '<html><body style="font-family:sans-serif;text-align:center;padding:20px;">' +
    '<p>レポートを安全にエンコード中...<br>まもなく保存されます。</p>' +
    script +
    '</body></html>'
  ).setWidth(350).setHeight(150);

  SpreadsheetApp.getUi().showModalDialog(output, 'レポートのダウンロード');
}