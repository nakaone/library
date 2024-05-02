/** 適宜認証を行った上で画面を切り替える
 * @param {string} screenName=null - 切替先の画面名
 * @returns {void}
 */
async changeScreen(screenName=null){
  const v = {whois:this.constructor.name+'.changeScreen',rv:null,step:0};
  console.log(`${v.whois} start.\nscreenName=${screenName}(${typeof screenName})`);
  try {

    v.step = 1; // 権限と開示範囲の比較
    v.step = 1.1; // 対象画面が未指定の場合、特定
    if( screenName === null ){
      console.log(this.constructor.name+`.changeScreen start.`
      + `\nthis.home=${stringify(this.home)}(${typeof this.home})`
      + `\nthis.user.auth=${this.user.auth}`);
      // 変更先画面が無指定 => ホーム画面を表示
      screenName = typeof this.home === 'string' ? this.home : this.home[this.user.auth];
    }

    if ( (this.screenAttr[screenName].allow & this.auth) > 0 ){
      v.step = 2; // 指定画面の表示、終了処理
      console.log(`${v.whois} normal end.`);
      return changeScreen(screenName);
    }
  
    // 以降、対象画面の開示権限が無い場合の処理
    v.step = 3; // メアド未登録の場合
    if( !this.user.hasOwnProperty('email') || !this.user.email ){
      v.step = 3.1; // ダイアログでメアドを入力
      v.email = window.prompt('メールアドレスを入力してください');
      if( v.email === null ){
        v.step = 3.2; // 入力キャンセルなら即終了
        console.log(`${v.whois}: email address enter canceled (step ${v.step}).`);
        return v.rv;
      } else {
        v.step = 3.3; // メアドの形式チェック
        if( checkFormat(v.email,'email' ) === false ){
          alert('メールアドレスの形式が不適切です');
          console.log(`${v.whois}: invalid email address (step ${v.step}).`);
          return v.rv;
        }
        v.step = 3.4; // ユーザ情報更新
        v.r = this.storeUserInfo({email:v.email});
        if( v.r instanceof Error ) throw v.r;
      }
    }
  
    v.step = 4.1; // ユーザ情報の取得。ユーザ不在なら新規登録
    //【getUserInfoの引数・戻り値】
    // @param {Object} arg
    // @param {string} arg.email - 要求があったユーザのe-mail
    // @param {string} arg.CPkey - 要求があったユーザの公開鍵
    // @returns {object} 以下のメンバを持つオブジェクト
    // 1. SPkey {string} - サーバ側公開鍵
    // 1. isExist {boolean} - 既存メアドならtrue、新規登録ならfalse
    // 1. isEqual {boolean} - 引数のCPkeyがシート上のCPkeyと一致するならtrue
    // 1. isExpired {boolean} - CPkeyが有効期限切れならtrue
    // 1. data {object} - 該当ユーザのシート上のオブジェクト
    v.r = await this.doGAS('getUserInfo',{
      email: this.user.email,
      CPkey: this.user.CPkey,
      updated: this.user.updated,
    });
    if( v.r instanceof Error ) throw v.r;

    v.step = 4.2; // ユーザ情報の更新
    v.r = this.storeUserInfo(Object.assign(v.r.data,{SPkey:v.r.SPkey}));
    if( v.r instanceof Error ) throw v.r;

    v.step = 5; // 権限が無い ⇒ エラーを表示して終了
    if( (v.r.data.auth & w.screenAttr.auth) === 0 ){
      alert(`指定画面(${screenName})の表示権限がありません。`);
      console.log(`${v.whois}: no authority (step ${v.step}).`);
      return v.rv;
    }

    v.step = 6; // 権限あり and CP一致 and CP有効 ⇒ 指定画面の表示、終了処理
    if( ((v.r.data.auth & w.screenAttr.auth) > 0) && v.r.isEqual && v.r.isExpired ){
      console.log(`${v.whois} normal end.`);
      return changeScreen(screenName);
    }

    // 以降【権限あり and (CP不一致 or CP無効) ⇒ パスコード入力】
    v.step = 7.1; // 鍵ペア再生成
    this.user.passphrase = null;
    v.r = this.storeUserInfo(v.r.data);
    if( v.r instanceof Error ) throw v.r;

    v.step = 7.21; // パスコード通知メールの発行要求
    //【sendPasscodeの引数・戻り値】
    // @param {Object} arg
    // @param {number} arg.userId - ユーザID
    // @param {string} arg.CPkey - 要求があったユーザの公開鍵
    // @param {string} arg.updated - CPkey生成・更新日時文字列
    // @returns {object} 以下のメンバを持つオブジェクト
    // - result {number}
    //   - 0 : 成功(パスコード通知メールを送信)
    //   - 1 : パスコード生成からログインまでの猶予時間を過ぎている
    //   - 2 : 凍結中(前回ログイン失敗から一定時間経過していない)
    // - data=null {Object} シート上のユーザ情報オブジェクト(除、trial)
    // - SPkey=null {Object} サーバ側公開鍵
    // - loginGraceTime=900,000(15分) {number}<br>
    //   パスコード生成からログインまでの猶予時間(ミリ秒)
    // - remainRetryInterval {number} 再挑戦可能になるまでの時間(ミリ秒)
    // - passcodeDigits=6 {number} : パスコードの桁数
    v.r = await this.doGAS('sendPasscode',{
      userId: this.user.userId,
      CPkey: this.user.CPkey,
      updated: this.user.updated,
    });
    if( v.r instanceof Error ) throw v.r;
    v.step = 7.22; // エラーメッセージの表示
    if( v.r.result > 0 ){
      switch(v.r.result){
        case 1: v.msg = 'パスコード生成から入力までの時間が長すぎ、'
          + '\n現在のパスコードが無効になりました。'
          + '\n再度メニューを選択すれば、パスコードが再発行されます。'
          + `\n再発行後、${Math.ceil(v.r.loginGraceTime/60000)}分以内にパスコードを入力してください。`;
          break;
        case 2: v.msg = '前回のログイン連続失敗から所定時間を経過していません。'
          + `約${Math.ceil(v.r.remainRetryInterval/60000)}分後、再度ログインしてください。`;
          break;
      }
      console.log(`${v.whois}: rejected by sendPasscode (step ${v.step}).`);
      return v.rv;
    }
    v.step = 7.23; // ユーザ情報更新
    v.a = this.storeUserInfo({email:v.email});
    if( v.a instanceof Error ) throw v.a;

    v.step = 7.3; // パスコード入力
    v.passcode = window.prompt(`メールに記載されたパスコードを入力してください`
      + `(数値${v.r.passcodeDigits}桁)`
      + `\nパスコードを再発行する場合は"-1"を入力してください。`);
    if( v.passcode === null ){
      v.step = 7.31; // 入力キャンセルなら即終了
      console.log(`${v.whois}: passcode enter canceled (step ${v.step}).`);
      return v.rv;
    } else {
      if( isNaN(v.passcode) ){
        v.step = 7.32; // パスコードの形式チェック
        alert('パスコードの形式が不適切です');
        console.log(`${v.whois}: invalid passcode (step ${v.step}).`);
        return v.rv;
      } else {
        v.step = 7.33; // パスコードの数値化
        v.passcode = Number(v.passcode);
        if( v.passcode < 0 ){
          v.step = 7.34; // 再発行要求
          // パスコード再発行はパスコード入力ダイアログに負の数を入力し、
          // changeScreenからsendPasscodeを再度呼び出すことで行う
          v.r = this.changeScreen(screenName);
          if( v.r instanceof Error ) throw v.r;
          return v.r;
        }
      }
    }

    v.step = 7.41; // パスコード検証要求
    //【verifyPasscodeの引数・戻り値】
    v.encrypt = cryptico.encrypt(
      ('0'.repeat(v.r.passcodeDigits) + String(v.passcode)).slice(-v.rpasscodeDigits),
      this.SPkey,this.CSkey);
    v.r = await this.doGAS('verifyPasscode',{
      userId: this.user.userId,
      passcode: v.encrypt,
    });
    if( v.r instanceof Error ) throw v.r;


  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\narg=${stringify(arg)}`;  // 引数
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
