/** 適宜認証を行った上で画面を切り替える
 * @param {string} screenName=null - 切替先の画面名
 * @returns {void}
 */
async changeScreen(screenName=null){
  const v = {whois:this.constructor.name+'.changeScreen',rv:null,step:0};
  console.log(`${v.whois} start.\nscreenName(${typeof screenName})="${screenName}"`);
  try {

    v.step = 1; // ユーザ権限と要求画面の開示範囲を比較
    v.step = 1.1; // 対象画面が未指定の場合、特定
    if( screenName === null ){
      // 変更先画面が無指定 => ホーム画面を表示
      screenName = typeof this.home === 'string' ? this.home : this.home[this.user.auth];
    }

    v.step = 1.2; // 権限と開示範囲の比較
    if ( (this.screenAttr[screenName].allow & this.auth) > 0 ){
      v.step = 1.3; // 画面表示の権限が有る場合、要求画面を表示して終了
      console.log(`${v.whois} normal end.`);
      return changeScreen(screenName);  // 注：このchangeScreenはメソッドでは無くライブラリ関数
    }
  
    // 以降、対象画面の開示権限が無い場合の処理
    v.step = 2; // メアド未登録の場合
    if( !this.user.hasOwnProperty('email') || !this.user.email ){
      v.step = 2.1; // ダイアログでメアドを入力
      v.email = window.prompt('メールアドレスを入力してください');
      if( v.email === null ){
        v.step = 2.2; // 入力キャンセルなら即終了
        console.log(`${v.whois}: email address enter canceled (step ${v.step}).`);
        return v.rv;
      } else {
        v.step = 2.3; // メアドの形式チェック
        if( checkFormat(v.email,'email' ) === false ){
          alert('メールアドレスの形式が不適切です');
          console.log(`${v.whois}: invalid email address (step ${v.step}).`);
          return v.rv;
        }
        v.step = 2.4; // ユーザ情報更新
        v.r = this.storeUserInfo({email:v.email});
        if( v.r instanceof Error ) throw v.r;
      }
    }
  
    v.step = 4.1; // ユーザ情報の取得。ユーザ不在なら新規登録
    v.r = await this.doGAS({  // authServer.changeScreen().argを定義
      func: 'changeScreen',
      email: this.user.email,
      CPkey: this.user.CPkey,
      updated: this.user.updated,
      allow: this.screenAttr[screenName].allow,
      createIfNotExist: true,
      updateCPkey: true,
      returnTrialStatus: true,
    },{type:'JSON'});
    if( v.r instanceof Error ) throw v.r;

    v.step = 5; // ユーザ情報の取得結果に基づき処理分岐
    switch(v.r.response){
      case 'hasAuth':
        v.step = 5.1; // 権限あり ⇒ 要求画面表示
        v.r = this.storeUserInfo(v.r.data);
        if( v.r instanceof Error ) throw v.r;
        v.r = changeScreen(screenName);
        if( v.r instanceof Error ) throw v.r;
        break;
      case 'noAuth':
        v.step = 5.2; // 権限なし ⇒ auth更新後メッセージ表示
        alert(`指定画面(${screenName})の表示権限がありません。`);
        console.log(`${v.whois}: no authority (step ${v.step}).`
          +`\nremainRetryInterval=${v.r}`);
        break;
      case 'freezing':
        v.step = 5.3; // 凍結中 ⇒ メッセージ表示
        break;
      case 'passcode':
        v.step = 5.4; // パスコード入力
        break;
      default: throw new Error('Invalid response');
    }

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}