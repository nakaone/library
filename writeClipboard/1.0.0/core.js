/** クリックされたcode要素の内容をクリップボードにコピー
 * @param {void} - event.targetでクリックされたcode要素を特定
 * @returns {void}
 */
function writeClipboard(){
  const v = {whois:'writeClipboard',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {
    v.step = 1; // ソースの内容を取得
    v.source = event.target.innerText;
    console.log(v.source);

    v.step = 2; // クリップボードへのコピー
    navigator.clipboard.writeText(v.source).then(
      () => alert('ソースをクリップボードへのコピーに成功しました'),
      () => alert('ソースのクリップボードへのコピーに失敗しました')
    );

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    console.error(`${v.whois} abnormal end(step.${v.step})\n`,e,v);
    return e;
  }
}
