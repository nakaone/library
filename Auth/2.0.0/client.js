class authClient {
/** @constructor
 * @param {Object} opt
 * @param {string} opt.programId
 */
constructor(opt){
  const v = {whois:this.constructor.name+'.constructor',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 引数のセット
    for(let x in opt){
      this[x] = opt[x];
    }

    v.step = 2; // ユーザ情報を設定
    this.#setUserInfo();

    v.step = 3; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nopt=${stringify(opt)}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}

  // setUserInfo, doGAS
/** ユーザ情報をメンバに(再)設定する
 * @param {void}
 * @returns {void}
 */
#setUserInfo(){
  const str = sessionStorage.getItem(this.programId);
  this.user = JSON.parse(str);
}

async doGAS(func,...args){
  return await doGAS('authServer',this.user.userId,func,...args);
}

/** ブラウザからの登録要求を受け、IDを返す
 * @param {HTMLElement} arg - ボタン要素
 * @returns {null|Error}
 * 
 * @example
 * 
 * - ボタンは`onclick="g.auth.registMail(this)"`を指定
 * - ボタンとinput要素は兄弟要素とし、それをdivで囲む
 */
async registMail(arg){
  const v = {whois:this.constructor.name+'.registMail',rv:null,step:0};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // メールアドレスのチェック
    v.email = arg.parentNode.querySelector('input[type="email"]').value;
    if( checkFormat(v.email,'email') === false ){
      alert(`"${v.email}"は不適切なメールアドレスです`);
      throw new Error(`"${v.email}" is invalid mail address.`);
    }

    v.step = 2; // authServer.registMailにメアド転送
    v.r = changeScreen('loading');
    if( v.r instanceof Error ) throw v.r;
    v.id = await this.doGAS('registMail',v.email);
    if( v.id instanceof Error ) throw v.id;
    console.log(v.id);

    v.step = 3; // IDをstorageに登録
    v.r = storeUserInfo(this.programId,{userId:v.id});
    if( v.r instanceof Error ) throw v.r;

    v.step = 4; // メニュー再描画、ホーム画面の定義書き換え
    v.r = g.menu.genNavi();
    if( v.r instanceof Error ) throw v.r;
    v.step = 5; // 応募情報修正画面に遷移
    v.r = changeScreen('登録・修正・キャンセル');
    if( v.r instanceof Error ) throw v.r;

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\narg=${arg}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
  //:x:$src/client.login1C.js::
  //:x:$src/client.login2C.js::
}
