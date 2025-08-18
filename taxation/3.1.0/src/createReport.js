/** createReport : 税理士提出用のreport.htmlをダウンロード
 * @param {void}
 * @returns {void}
 */
function createReport() {
  const v = { whois: 'createReport', rv: null};
  dev.start(v.whois);
  try {

    // -------------------------------------------------------------
    dev.step(1);  // 使用するデータをテーブルから作成
    // -------------------------------------------------------------
    // created: 作成日
    v.data = {created:toLocale(new Date(),{format:'yyyy/MM/dd'})};
    // テーブル名: 必要な項目に絞った行オブジェクトの配列
    v.data['files'] = db.do('select id,name from `files`;');
    if( v.data['files'] instanceof Error ) throw v.data['files'];
    v.data['記入用'] = db.do('select id,type,date,label,price,payby,note from `記入用`;');
    if( v.data['記入用'] instanceof Error ) throw v.data['記入用'];
    v.data['交通費'] = db.do('select * from `交通費`;');
    if( v.data['交通費'] instanceof Error ) throw v.data['交通費'];


    // -------------------------------------------------------------
    dev.step(2);  // report.htmlの生成とダウンロード
    // -------------------------------------------------------------
    dev.step(2.1);  // report.htmlを読み込み
    var template = HtmlService.createHtmlOutputFromFile("report").getContent();

    dev.step(2.2);  // <script>const data=...</script> を埋め込む
    var dataScript = `<script>const data = ${JSON.stringify(v.data)};</script>`;
    var reportHtml = template.replace("</body>", dataScript + "\n</body>");

    dev.step(2.3);  // ダイアログへ渡すためにエンコード
    var encodedReport = encodeURIComponent(reportHtml);

    dev.step(2.4);  // ダイアログ用HTMLをソース内で作成
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
          // ダイアログを自動的に閉じる（少し待ってから）
          setTimeout(() => {
            google.script.host.close();
          }, 1000);
        </script>
      </body>
      </html>
    `;

    dev.step(2.5);  // ダイアログを表示
    var htmlOutput = HtmlService.createHtmlOutput(dialogHtml)
      .setWidth(400)
      .setHeight(200);
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, "レポート出力");
    
    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}
