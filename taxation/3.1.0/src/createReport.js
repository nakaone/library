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
    dev.step(1.1);  // cf.schemaからプロトタイプ作成
    v.data = JSON.parse(JSON.stringify(cf.schema));
    v.data.created = toLocale();  // 作成日時を付記

    dev.step(1.2);  // 各テーブルのデータをセット
    v.data.tables.forEach(table => {
      // 出力定義(exportDef)に既定値設定
      table.exportDef = Object.assign({select:[],where:''},table.exportDef||{},);
      // 抽出用SQL文の作成・実行
      v.sql = 'select '
      + (table.exportDef.select.length === 0 ? '*'
        : table.exportDef.select.map(x => '`'+x+'`').join(','))
      + ` from \`${table.name}\``
      + (table.exportDef.where ? ` where ${table.exportDef.where}` : '')
      + ';';
      v.r = db.exec(v.sql);
      if( v.r instanceof Error ) throw v.r;
      table.data = v.r;
    });

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
