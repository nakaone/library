/** SPA用のスクリーンの切り替え
 * 
 * - スクリーン(div)は`class="screen" name="xxx"`を指定
 * - 引数の`screenName`は上述のname属性
 * 
 * @param {string} screenName - スクリーン名
 * @returns {void}
 */
function changeScreen(screenName){
  const v = {whois:'changeScreen',rv:null,step:0};
  try {

    v.step = 1; // 全スクリーンを閉じる
    document.querySelectorAll('.screen').forEach(x => x.style.display = 'none');

    v.step = 2; // 対象スクリーンを取得
    v.screen = document.querySelector(`.screen[name="${screenName}"]`);
    if( !v.screen ) throw new Error(`${screenName}が見つかりません`);

    v.step = 3; // 祖先に遡ってスクリーンを表示
    v.i = 100; // 永久ループ防止用
    while( v.screen.tagName !== 'BODY' && v.i > 0){
      if( v.screen.tagName === 'DIV' ){
        v.screen.style.display = '';
      }
      v.screen = v.screen.parentNode;
      v.i--;
    }

    v.step = 4; // 見つからなければエラー
    if( v.i <= 0 ) throw new Error(`${screenName}が見つかりません`);

    v.step = 5; // 終了処理
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\nscreenName=${String(screenName)}`;  // 引数
    console.error(`${e.message}\nv=${JSON.stringify(v,null,2)}`);
    return e;
  }
}