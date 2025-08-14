/*
async function getFolderId() {
  // スプレッドシートのIDを取得
  var ssId = SpreadsheetApp.getActiveSpreadsheet().getId();
  
  // スプレッドシートのファイルを取得
  var file = DriveApp.getFileById(ssId);
  
  // 親フォルダを取得
  var parentFolder = file.getParents().next();
  
  // フォルダIDを取得
  var folderId = parentFolder.getId();
  
  // フォルダIDをログに出力
  Logger.log(folderId);

  await mergePDFs(["1dpS_E7PbJYv-FfVGHIMxlfnZzLw5lbLF","1lkDFoTaOMbcjcFgv3gXOf8gYu4PnTqm0"],folderId,'YFP202502.pdf');
}
*/

/** mergePDFs: GoogleDrive上の複数のPDFファイルを結合
 * @param {string[]} ids=[] - 結合したいPDFファイルのID
 * @param {string} folderId - 格納先のフォルダID
 * @param {string} fileName - 結合後のPDFファイル名
 * @returns {void}
 * - Felo 「GASでGoogle Drive上の複数のPDFを結合する」
 */
async function mergePDFs(ids,folderId,fileName="merged.pdf") {
  const data = ids.map((id) => new Uint8Array(DriveApp.getFileById(id).getBlob().getBytes()));
  
  // PDF-libを読み込む
  const cdnjs = "https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js";
  eval(UrlFetchApp.fetch(cdnjs).getContentText().replace(/setTimeout\(.*?,.*?(\d*?)\)/g, "Utilities.sleep(\$1);return t();"));
  
  // PDFドキュメントを作成
  const pdfDoc = await PDFLib.PDFDocument.create();
  for (let i = 0; i < data.length; i++) {
    const pdfData = await PDFLib.PDFDocument.load(data[i]);
    const pages = await pdfDoc.copyPages(pdfData, [...Array(pdfData.getPageCount()).keys()]);
    pages.forEach(page => pdfDoc.addPage(page));
  }
  
  const bytes = await pdfDoc.save();
  // 結合したPDFファイルを作成
  const mergedFile = DriveApp.createFile(Utilities.newBlob([...new Int8Array(bytes)], MimeType.PDF, fileName));

  // 結合したPDFを同じフォルダに移動
  const mergedFileId = mergedFile.getId();
  const mergedFileInFolder = DriveApp.getFileById(mergedFileId);
  DriveApp.getFolderById(folderId).addFile(mergedFileInFolder);
  DriveApp.getRootFolder().removeFile(mergedFileInFolder); // ルートフォルダから削除

  return mergedFileInFolder;  // 結合したPDFファイルを戻り値とする
}