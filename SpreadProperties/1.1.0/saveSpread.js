/* saveSpreadのサンプル
  1. deleteAllTriggersで残余トリガーをクリア
  2. funcTestで起動(saveSpread初回呼出)
  3. saveSpreadでスプレッドシートと同一フォルダにzipを作成
  4. 終了後ローカルにダウンロード
  5. `unzip download.zip`で解凍
  6. `less data.json`で内容確認
*/

function funcTest(){
  const v = {rv:null,propKey:'saveSpread',SpreadId:'1YxHCS_UAQoQ3ElsJFs817vxLZ4xA_GLLGndEEm0hZWY'};
  PropertiesService.getScriptProperties().deleteProperty(v.propKey);
  v.rv = saveSpread();
  console.log(`funcTest: v.rv(${whichType(v.rv)})=${typeof v.rv === 'object' ? JSON.stringify(v.rv) : v.rv}`);
}

function saveSpread(){
  const v = {rv:null,propKey:'saveSpread',SpreadId:'1YxHCS_UAQoQ3ElsJFs817vxLZ4xA_GLLGndEEm0hZWY'};
  v.sp = new SpreadProperties(v.SpreadId);
  return v.sp.saveSpread('saveSpread') // 自分自身の関数名を引数とする
}

function deleteAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    ScriptApp.deleteTrigger(trigger);
  }
  Logger.log('全てのトリガーが削除されました。');
}