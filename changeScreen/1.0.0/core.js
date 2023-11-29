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

    v.step = 1;
    document.querySelectorAll('.screen').forEach(x => {
      x.style.display = x.getAttribute('name') === screenName ? '' : 'none';
    });
  
    v.step = 2; // 終了処理
    return v.rv;

  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
    return e;
  }

}