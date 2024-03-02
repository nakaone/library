/** キーワード文字列の消去＋一覧の再描画
 * @param {void}
 * @returns {null|Error}
 */
clear(){
  const v = {whois:this.className+'.clear',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 入力欄をクリア
    this.wrapper.querySelectorAll('[name="list"] [name="control"] [name="keyword"]')
    .forEach(x => x.value = '');

    v.step = 2; // listで一覧表を再描画
    this.source.data = [];
    v.r = this.listView();
    if( v.r instanceof Error ) throw v.r;

    v.step = 3; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}