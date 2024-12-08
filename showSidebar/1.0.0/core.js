/** showSidebar: 処理結果をサイドバーのtextareaに表示
 * @param {Object} arg
 * @param {string} arg.result - 表示する処理結果
 * @param {string} [arg.content] - サイドバーのhtml
 */
function showSidebar(arg={}){ // 
  if( !arg.content ){
    arg.content = [`<!DOCTYPE html><html><head><base target="_top"><script>`
    , `function copyToClipboard() {`
    , `  const result = document.getElementById('result').value; //innerText;`
    , `  navigator.clipboard.writeText(result).then(() => {`
    , `    alert('クリップボードにコピーしました: ' + result);`
    , `  }).catch(err => {`
    , `    console.error('コピーに失敗しました: ', err);`
    , `  });`
    , `}`
    , `</script></head><body>`
    , `  <h1>処理結果</h1>`
    , `  <button onclick="copyToClipboard()">コピー</button><br><hr>`
    , `  <textarea id="result">::result::</textarea>`
    , `</body>`
    , `</html>`].join('\n');
  }
  arg.content = arg.content.replace('::result::',arg.result);
  console.log(`l.67 arg=${JSON.stringify(arg)}`)
  const html = HtmlService.createHtmlOutput(arg.content).setTitle('処理結果');
  SpreadsheetApp.getUi().showSidebar(html);
}