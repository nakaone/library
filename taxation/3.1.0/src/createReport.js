/** createReport : 税理士提出用のreport.htmlをダウンロード
 * @param {void}
 * @returns {void}
 */
function createReport() {
  const v = { whois: 'createReport', rv: null};
  dev.start(v.whois);
  try {

    dev.step(1);  // 使用するデータをテーブルから作成
    v.data = {};
    v.data['files'] = db.do('select id,name from `files`;');
    if( v.data['files'] instanceof Error ) throw v.data['files'];
    v.data['記入用'] = db.do('select id,type,date,label,price,payby,note from `記入用`;');
    if( v.data['記入用'] instanceof Error ) throw v.data['記入用'];
    v.data['交通費'] = db.do('select * from `交通費`;');
    if( v.data['交通費'] instanceof Error ) throw v.data['交通費'];


    // -------------------------------------------------------------
    // --- 1. report.htmlを読み込み ---
    var template = HtmlService.createHtmlOutputFromFile("report").getContent();

    // --- 2. <script>const data=...</script> を埋め込む ---
    var dataScript = `<script>const data = ${JSON.stringify(v.data)};</script>`;
    var reportHtml = template.replace("</body>", dataScript + "\n</body>");

    // ダイアログへ渡すためにエンコード
    var encodedReport = encodeURIComponent(reportHtml);

    // --- 3. ダイアログ用HTMLをソース内で作成 ---
    var dialogHtml = `
      <!DOCTYPE html>
      <html>
      <head><base target="_top"></head>
      <body>
        <h3>report.html を自動ダウンロードしています...</h3>
        <script>
          // サーバーから渡された文字列を復号
          const reportHtml = decodeURIComponent("${encodedReport}");

          // Blobを作成してダウンロード開始
          const blob = new Blob([reportHtml], {type: "text/html"});
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "report.html";
          a.click();
          URL.revokeObjectURL(url);
        </script>
      </body>
      </html>
    `;

    // --- 4. ダイアログを表示 ---
    var htmlOutput = HtmlService.createHtmlOutput(dialogHtml)
      .setWidth(400)
      .setHeight(200);

    SpreadsheetApp.getUi().showModalDialog(htmlOutput, "レポート出力");
    
    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}
