/** パラメータを確認、表示ページを振り分ける
 * @param {Event} e - GASから渡されるイベントオブジェクト。
 * @returns {HtmlOutput}
 * - GAS公式 ウェブアプリ - [リクエストパラメータ](https://developers.google.com/apps-script/guides/web?hl=ja)
 * - [Webページからデータを送信する](https://www2.kobe-u.ac.jp/~tnishida/programming/GAS-02.html#senddata)
 * 
 * @example
 * 
 * `https://〜/dev?hoge=fuga&a=10&b=true`
 * ⇒ `{"b":"true","hoge":"fuga","a":"10"}`
 */
function doGet(e){
  const template = HtmlService.createTemplateFromFile('index');
  template.userId = e.parameter.id;
  const htmlOutput = template.evaluate();
  htmlOutput.setTitle(config.programId);
  return htmlOutput;
}
