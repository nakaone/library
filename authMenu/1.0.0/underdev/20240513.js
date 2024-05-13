/** authServer: 必要に応じて引数を復号・署名検証した上で、サーバ側の処理を分岐
 *
 * @param {number|null} userId=null - ユーザID
 * @param {string} arg - 分岐先処理名、分岐先処理に渡す引数オブジェクトのJSON。メンバはparseArg参照
 * @returns {Object} 分岐先処理での処理結果
 */
function  authServer(userId=null,arg=null) {
  // 内部関数で'v'を使用するため、ここでは'w'で定義
  const w = {whois:'authServer',rv:null,step:0,func:{}};
  /** preProcess: 事前準備
   * 
   * 分岐前に順次処理する手順をくくりだしたもの。
   * 
   * 1. "w"に格納するメンバ変数の宣言
   * 2. PropertiesServiceに格納された値をw.propに読み込み
   * 3. シートから全ユーザ情報をw.masterに取得<br>
   * 4. userIdのデータ型チェック
   * 5. 新規ユーザ登録。新規登録した場合、そこで終了
   * 6. (生成しない場合)ユーザ情報の取得
   * 7. 引数argの解析＋オブジェクト化
   * 8. 現在のログイン試行の状態を解析
   */
  w.func.preProcess = function(){
    const v = {whois:w.whois+'.preProcess',step:0,rv:null};
    console.log(`${v.whois} start.`);
    try {

      w.step = 1; // "w"に格納するメンバ変数の宣言
      w.arg = null; // {object} JSON文字列で渡される"arg"をparseArgでオブジェクト化したもの
      w.type = 'null'; // {string} argの種類。null, JSON, encrypt
      w.prop = {}; // {Object} setPropertiesで設定されるauthServerのconfig
      w.isJSON = str => { // {Arrow} JSON文字列か、判定
        try{JSON.parse(str)}
        catch(e){return false}
        return true;
      };

      w.step = 2; // PropertiesServiceに格納された値をw.propに読み込み
      // w.propのメンバについてはserver.setProperties()参照
      w.prop = PropertiesService.getDocumentProperties().getProperties();
      if( !w.prop ) throw new Error('Property service not configured.');

      w.step = 3; // シートから全ユーザ情報の取得
      // マスタシート名が必要なので「w.propの読み込み」が要先行
      w.master = new SingleTable(w.prop.masterSheet);
      if( w.master instanceof Error ) throw w.master;

      w.step = 4; // userIdのデータ型チェック
      if( isNaN(userId) ) throw new Error('Invalid userId');
      w.userId = (userId === null ? null : Number(userId));

      w.step = 5; // 新規ユーザ登録。新規登録した場合、そこで終了
      // 既存メアドはエラーObjが返るので、getUserInfoで拾う
      w.user = w.func.registEmail();

      w.step = 6; // ユーザ情報の取得
      if( w.user instanceof Error ){
        w.user = w.func.getUserInfo();
        if( w.user instanceof Error ) throw w.user;
      }

      w.step = 7; // 引数argの解析＋オブジェクト化
      // 復号にシート上のCPkeyが必要なので「ユーザ情報の取得」が要先行
      w.r = w.func.parseArg();
      if( w.r instanceof Error ) throw w.r;
      [w.arg,w.type] = w.r;

      w.step = 8; // 現在のログイン試行の状態を解析
      // 引数のCPkeyが必要なので、「引数argの解析＋オブジェクト化」が要先行
      w.r = w.func.parseTrial();
      if( w.r instanceof Error ) throw w.r;
      // クライアント側でも使用するので、ユーザ情報の一つとして登録
      w.user.data.trial = w.r;
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  };
  /** registEmail: 新規ユーザ登録
   *
   * @returns {object} 以下のメンバを持つオブジェクト
   * - data {Object} シート上のユーザ情報オブジェクト(除、trial欄)
   * - trial {Object} 現在のログイン試行の状態(parseしたtrial欄のJSON文字列)
   * - isExist {number} 新規採番したユーザID(0は既存なので>0になる)
   */
  w.func.registEmail = function(){
    const v = {whois:w.whois+'.registEmail',step:0,rv:{trial:null}};
    console.log(`${v.whois} start.`);
    try {

      // ---------------------------------------------
      v.step = 1; // 新規登録可否確認
      // ---------------------------------------------
      v.step = 1.1; // 新規ユーザ登録要求なのか、必要な引数が揃っているか検証
      // なお新規ユーザ登録時、クライアントから渡されるargは平文のJSON
      v.arg = JSON.parse(arg);
      if( w.userId !== null
        || arg.func !== 'registEmail'
        || checkFormat(v.arg.email,'email') === false
        || typeof v.arg.CPkey !== 'string' || v.arg.CPkey.length === 0
        || typeof v.arg.updated !== 'string' || v.arg.updated.length === 0
      ) throw new Error('Invalid or missing argument.');

      v.step = 1.2; // 登録済メアドではないか確認
      v.r = w.master.select({where: x => x[w.prop.emailColumn] === v.arg.email});
      if( v.r instanceof Error ) throw v.r;
      if( v.r.length > 0 ) // 登録済はエラー
        throw new Error(`"${v.arg.email}" has already registered.`);

      // ---------------------------------------------
      v.step = 2; // 新規ユーザのデータ作成、シートへの登録
      // ---------------------------------------------

      v.step = 2.1; // userIdの最大値を取得
      if( w.master.data.length === 0 ){
        // 登録済が0件(シート作成直後)の場合
        v.max = w.prop.userIdStartNumber - 1;
      } else {
        v.map = w.master.data.map(x =>
          isNaN(x[w.prop.primatyKeyColumn])
          ? 0 : Number(x[w.prop.primatyKeyColumn]));
        v.max = Math.max(...v.map);
      }

      v.step = 2.2; // シートに初期値を登録
      v.rv.data = {
        userId  : v.max + 1,
        created : toLocale(new Date(),'yyyy/MM/dd hh:mm:ss.nnn'),
        email   : v.arg.email,
        auth    : w.prop.defaultAuth,
        CPkey   : v.arg.CPkey,
        updated : null,
        trial   : '{}',
      };
      v.rv.data.updated = v.rv.data.created;
      v.r = w.master.insert([v.rv.data]);
      if( v.r instanceof Error ) throw v.r;

      v.step = 2.5; // 戻り値を修正
      v.rv.trial = JSON.parse(v.rv.data.trial);
      delete v.rv.data.trial;
      v.rv.isExist = v.rv.data.userId; // 存否フラグを更新

      v.step = 3; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  };
  /** getUserInfo: authClientからの要求を受け、ユーザ情報と状態を返す
   *
   * - IDは自然数の前提、1から順に採番。
   * - 新規採番は途中の欠損は考慮せず、最大値＋1とする
   *
   * @returns {object} 以下のメンバを持つオブジェクト
   * - data {Object} シート上のユーザ情報オブジェクト(除、trial欄)
   * - trial {Object} 現在のログイン試行の状態(parseしたtrial欄のJSON文字列)
   * - isExist=0 {number} 既存メアドなら0、新規登録したなら新規採番したユーザID<br>
   *   ※ isExistはregistMailとの互換性確保用の項目。getUserInfoでは使用しない
   */
  w.func.getUserInfo = function(){
    const v = {whois:w.whois+'.getUserInfo',step:0,rv:{data:null,isExist:0}};
    console.log(`${v.whois} start.\narg(${typeof arg})=${stringify(arg)}`);
    try {

      v.step = 1; // 該当ユーザの検索
      v.r = w.master.select({where: x => x[w.prop.primatyKeyColumn] === w.userId});
      if( v.r instanceof Error ) throw v.r;
      v.step = 1.1; // 0件、または複数件該当 ⇒ エラー
      if( v.r.length !== 1 ){
        throw new Error(v.r.length > 1
        ? 'Multiple target users exist on the sheet.'
        : 'No target user exists on the sheet.');
      }

      v.step = 2; // 戻り値を修正
      v.rv = {
        data: v.r[0],
        trial: JSON.parse(v.rv.data.trial),
        isExist: 0,
      };
      delete v.rv.data.trial;

      v.step = 3; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  };
  /** parseArg: 引数argの解析＋オブジェクト化
   *
   * @param {null|string} arg - 分岐先処理名、分岐先処理に渡す引数オブジェクトのJSON
   * @returns {any[]} 以下のメンバを持つ配列
   * - 添字0 {Object} authServerの引数argのオブジェクト化
   *   - func=null {string} 【必須】分岐先処理名。authServer内で使用し、必ずしもメソッド名と一致しない
   *     - 'registMail' : 新規ユーザ登録
   *   - email=null {string} e-mail。新規ユーザ登録時のみ使用の想定
   *   - CPkey=null {string} 要求があったユーザの公開鍵
   *   - updated=null {string} CPkey生成・更新日時文字列
   * - 添字1 {string}
   *   - 'plain' : 平文で送られたJSON文字列
   *   - 'unsigned' : SPkeyでの暗号化。署名なし
   *   - 'forged' : 署名あり(未検証)でシートのCPkeyと一致
   *   - 'unmatch' : 署名あり(未検証)でシートのCPkeyと不一致
   *   - 'verified' : 署名あり(検証済)
   *
   *
   *   - [没]createIfNotExist=false {boolean} true:メアドが未登録なら作成
   *   - updateCPkey=false {boolean} true:渡されたCPkeyがシートと異なる場合は更新
   *   - returnTrialStatus=true {boolean} true:現在のログイン試行の状態を返す
   */
  w.func.parseArg = function(){
    const v = {whois:w.whois+'.parseArg',step:0,rv:[]};
    console.log(`${v.whois} start.`);
    try {

      v.step = 1; // 引数argが存在し、かつ文字列であることを確認
      if( arg === null
        || typeof arg !== 'string' || arg.length === 0
      ) throw new Error('Invalid arg');

      if( w.isJSON(arg) ){
        v.step = 2; // JSON(平文)
        v.rv = [JSON.parse(arg),'plain'];
      } else {
        v.step = 3; // 暗号化文字列
        // 秘密鍵を生成して復号
        w.prop.SSkey = cryptico.generateRSAKey(w.prop.passPhrase,w.prop.bits);
        v.dec = cryptico.decrypt(arg,w.prop.SSkey);
        if( v.dec.status === 'failure' ) throw new Error('Decrypt failed');

        // 戻り値を作成
        v.rv = [JSON.parse(v.dec.plaintext),v.dec.signature];

        // forged(未検証)の場合、引数とシートのCPkeyを比較
        if( v.dec.signature === 'forged' && w.user.CPkey !== v.rv.v.CPkey )
          v.rv[1] = 'unmatch';
      }

      v.step = 3; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  };
  /** parseTrial: 現在のログイン試行の状態を解析
   *
   * @param {Object.<string,any>} row - trial欄を含む、シート上の1行のユーザ情報
   * @returns {object} 以下のメンバを持つオブジェクト
   * - status {number}
   *   - 0 : 問題なし
   *   - 1〜4 : 要ログイン
   *     - 1 : ①パスコード生成からログインまでの猶予時間を過ぎている
   *     - 2 : ②クライアント側ログイン(CPkey)有効期限切れ
   *             ※シート上のupdatedが空欄ならノーチェック
   *     - 4 : ③引数のCPkeyがシート上のCPkeyと不一致
   *             ※引数にCPkeyが含まれない場合はノーチェック
   *   - 8 : ④凍結中
   * - numberOfLoginAttempts {number} 試行可能回数
   * - loginGraceTime=900,000(15分) {number}<br>
   *   パスコード生成からログインまでの猶予時間(ミリ秒)
   * - remainRetryInterval=0 {number} 再挑戦可能になるまでの時間(ミリ秒)
   * - passcodeDigits=6 {number} : パスコードの桁数
   */
  w.func.parseTrial = function(){
    const v = {whois:w.whois+'.parseTrial',rv:null,step:0};
    console.log(`${v.whois} start.`);
    try {

      // ---------------------------------------------
      v.step = 3; // 現在のログイン試行の状態
      //【シート上のtrial欄(JSON)オブジェクト定義】
      // - passcode {number} パスコード(原則数値6桁)
      // - created {number} パスコード生成日時(UNIX時刻)
      // - log {object[]} 試行の記録。unshiftで先頭を最新にする
      //   - timestamp {number} 試行日時(UNIX時刻)
      //   - entered {number} 入力されたパスコード
      //   - status {number} 失敗した原因(v.trial.statusの値)
      //   - result {number} 0:成功、1〜n:連続n回目の失敗
      // trialオブジェクトはunshiftで常に先頭(添字=0)が最新になるようにする。
      // ---------------------------------------------
      v.step = 3.2; // trial欄のJSONをオブジェクト化
      v.trial = Object.assign({
        passcode: null,
        created: null,
        log: [],
      },w.user.trial);

      // 戻り値の既定値を作成
      v.rv = Object.assign({},{
        status: 0,
        numberOfLoginAttempts: w.prop.numberOfLoginAttempts,
        loginGraceTime: w.prop.loginGraceTime,
        remainRetryInterval: 0,
        passcodeDigits: w.prop.passcodeDigits,
      });

      // ログイン試行の状態に関する項目を戻り値オブジェクトに追加

      v.step = 3.3; // ①パスコード生成からログインまでの猶予時間を過ぎている
      if( ( w.prop.loginGraceTime + v.trial.created) > Date.now() ){
        v.rv.status += 1;
      }

      v.step = 3.4; // ②クライアント側ログイン(CPkey)有効期限切れ
      if( String(w.user.data.updated).length > 0
        && (new Date(w.user.data.updated).getTime() + w.prop.userLoginLifeTime) < Date.now() ){
        v.rv.status += 2;
      }

      v.step = 3.5; // ③引数のCPkeyがシート上のCPkeyと不一致
      if( w.arg.CPkey && (w.arg.CPkey !== w.user.data.CPkey) ){
        v.rv.status += 4;
      }

      if( v.trial.log.length > 0 ){
        v.log = v.trial.log[0];

        v.step = 3.6; // 試行Objがlogに存在するなら残りの試行可能回数を計算
        v.rv.numberOfLoginAttempts = w.prop.numberOfLoginAttempts - v.log.result;

        v.step = 3.7; // ④凍結中(前回ログイン失敗から一定時間経過していない)
        if( v.log.hasOwnProperty('result')
          && v.log.result === w.prop.numberOfLoginAttempts
          && v.log.hasOwnProperty('timestamp')
          && (v.log.timestamp + w.prop.loginRetryInterval) > Date.now()
        ){
          v.rv.status += 8;
          // 再挑戦可能になるまでの時間を計算(ミリ秒)
          v.rv.remainRetryInterval = v.log.timestamp
            + w.prop.loginRetryInterval - Date.now();
        }
      }

      v.step = 4; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  };
  /** verifyPasscode: 入力されたパスコードの検証
   *
   * - 権限有無判断(auth&allow)は授受するデータを減らすため、クライアント側で行う
   *
   * @param {Object} arg
   * @param {number} arg.userId=null - ユーザID
   * @param {string} arg.CPkey=null - 要求があったユーザの公開鍵
   * @param {string} arg.updated=null - CPkey生成・更新日時文字列
   * @param {number} arg.passcode=-1 - 入力されたパスコード
   * @returns {object} 以下のメンバを持つオブジェクト(getUserInfoの戻り値)
   * - data=null {Object} シート上のユーザ情報オブジェクト(除、trial)
   * - status
   *   - 0 : OK(パスコード一致、CPkey他も問題なし) ⇒ OK
   *   - 1〜4 : 要ログイン
   *     - 1 : ①パスコード生成からログインまでの猶予時間を過ぎている ⇒ NG
   *     - 2 : ②クライアント側ログイン(CPkey)有効期限切れ ⇒ (書き換えるから)OK
   *     - 4 : ③引数のCPkeyがシート上のCPkeyと不一致 ⇒ (書き換えるから)OK
   *   - 8 : NG(権限はあるが)凍結中 ⇒ NG
   *   - 16 : パスコード不一致
   */
  w.func.verifyPasscode = function(){
    const v = {whois:w.whois+'.verifyPasscode',step:0,rv:null};
    console.log(`${v.whois} start.\ntypeof arg=${typeof arg}\narg=${stringify(arg)}`);
    try {

      // ---------------------------------------------
      v.step = 1; // パスコード検証
      // ---------------------------------------------
      v.step = 1.1; // 引数の既定値の設定
      v.arg = Object.assign({
        userId: null,
        CPkey: null,
        updated: null,
        passcode: -1,
      },arg);

      v.step = 1.1; // 対象ユーザ情報の取得
      v.rv = this.getUserInfo(v.arg);
      if( v.rv instanceof Error ) throw v.rv;
      v.trial = v.rv.trial;
      delete v.rv.trial;  // trialは戻り値に含めない

      v.step = 1.2; // パスコード不一致 ⇒ statusのフラグを立てる
      if( Number(v.arg.passcode) !== Number(v.trial.passcode) ){
        v.rv.status += 16;
      }

      // ---------------------------------------------
      v.step = 2; // trial更新(検証結果)
      //【trialオブジェクト定義】
      // - passcode {number} パスコード(原則数値6桁)
      // - created {number} パスコード生成日時(UNIX時刻)
      // - log {object[]} 試行の記録。unshiftで先頭を最新にする
      //   - timestamp {number} 試行日時(UNIX時刻)
      //   - entered {number} 入力されたパスコード
      //   - status {number} v.rv.statusの値
      //   - result {number} 0:成功、1〜n:連続n回目の失敗
      // trialオブジェクトはunshiftで常に先頭(添字=0)が最新になるようにする。
      // ---------------------------------------------
      v.step = 2.1; // ログObjを作成、log配列先頭に追加
      v.trial.log.unshift({
        timestamp: Date.now(),
        entered: v.arg.passcode,
        status: v.rv.status,
        result: v.rv.status === 0 ? 0 : (v.trial.log[0].result + 1),
      });

      v.step = 2.2; // シートのtrial欄を更新
      v.obj = {trial:JSON.stringify(v.trial)};
      // パスコードが一致していたらCPkey,updatedも更新
      // 以下の条件を全て満たす場合、CPkey,updatedも更新
      // 1. getUserInfoのstatusが②有効期限切れまたは③不一致
      // 2. 有効なCPkey,updatedが両方引数で渡されている
      if( (v.rv.status & (2+4)) > 0 && arg.CPkey !== null && arg.updated !== null ){
        v.obj.CPkey = v.rv.data.CPkey = arg.CPkey;
        v.obj.updated = v.rv.data.updated = arg.updated;
        // ユーザ情報およびtrial欄に記録するstatusの値が2or4なら0に書き換え
        // 25 = 1 + 8 + 16 (2と4以外のフラグの合計値。2と4は強制的に0にする)
        v.rv.status = v.rv.status & 25;
        v.trial.log[0].status = v.trial.log[0].status & 25;
        v.obj.trial = JSON.stringify(v.trial);
      }
      v.r = v.master.update(v.obj,
        {where: x => x[w.prop.primatyKeyColumn] === arg.userId});
      if( v.r instanceof Error ) throw v.r;

      // ---------------------------------------------
      v.step = 3; // 終了処理
      // ---------------------------------------------
      // OK以外はユーザ情報を戻り値から削除
      if( v.rv.status !== 0 ) delete v.rv.data;
      console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}`
      + `\n${e.message}\narg=${stringify(arg)}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  console.log(`${w.whois} start.`);
  try {

    // ---------------------------------------------
    w.step = 1; // 事前準備
    // ---------------------------------------------
    w.r = w.func.preProcess();
    if( w.r instanceof Error ) throw w.r;

    // ---------------------------------------------
    w.step = 2; // 新規ユーザ登録
    // ---------------------------------------------
    if( w.arg.func === 'registEmail' ){
      w.rv = w.user.data;
    }

    // ---------------------------------------------
    w.step = 3; // 画面要求
    // ---------------------------------------------
    if( w.arg.func === 'changeScreen' ){
      // ログイン要否判断：ログイン不要ならreturnして終了
      // 要ログイン
      // sendPasscode
    }
    if( w.arg.func === 'verifyPasscode' ){
      // sendPasscodeの続き
      // verifyPasscode
      w.rv = w.func.verifyPasscode(w.userId,w.arg);
      if( w.rv instanceof Error ) throw w.rv;
    }
    




    // ---------------------------------------------
    w.step = 5; // 終了処理
    // ---------------------------------------------
    console.log(`${w.whois} normal end.\nw.rv=${stringify(w.rv)}`);
    // 該当処理なしの場合、何も返さず終了
    if( w.rv !== null ) return w.rv;

  } catch(e) {
    e.message = `${w.whois} abnormal end at step.${w.step}`
    + `\n${e.message}\nuserId=${userId}\narg=${arg}`;
    console.error(`${e.message}\nw=${stringify(w)}`);
    return e;
  }
}