export class Member {

  /** constructor: 該当メンバのMemberインスタンス作成
   * - 新規メンバ(SPkey要求時)は新規作成
   * @constructor
   * @param {authServerConfig} config - authServerの設定値
   * @param {authRequest} request - 処理要求
   */
  constructor(config,request) {
    const v = {whois:`Member.constructor`, arg:{request}, rv:null};
    dev.start(v);
    try {

      this.cf = config; // authServer設定値をメンバとして格納

      // -------------------------------------------------------------
      dev.step(1);  // memberListシートの準備
      // -------------------------------------------------------------

      dev.step(1.1);  // シートの取得
      v.spread = SpreadsheetApp.getActive();
      v.sheet = v.spread.getSheetByName(this.cf.memberList);

      // memberListシートが存在しなければシートを新規作成
      if( !v.sheet ){

        dev.step(1.2);  // シートを追加
        v.sheet = v.spread.insertSheet(this.cf.memberList);

        dev.step(1.3);  // シート上の項目定義
        v.colsDef = [
          {name:'memberId',type:'string',desc:'メンバの識別子',note:'メールアドレス',default:'UUIDv4'},
          {name:'name',type:'string',desc:'メンバの氏名',note:'',default:'"dummy"'},
          {name:'status',type:'string',desc:'メンバの状態',note:'未加入,未審査,審査済,加入中,加入禁止',default:'"未加入"'},
          {name:'log',type:'MemberLog',desc:'メンバの履歴情報',note:'シート上はJSON文字列',default:'new MemberLog()'},
          {name:'profile',type:'MemberProfile',desc:'メンバの属性情報',note:'シート上はJSON文字列',default:'new MemberProfile()'},
          {name:'device',type:'[MemberDevice](MemberDevice.md#memberdevice_members)[]',desc:'デバイス情報',note:'マルチデバイス対応のため配列。シート上はJSON文字列',default:'空配列'},
          {name:'note',type:'string',desc:'当該メンバに対する備考',note:'',default:'空文字列'},
        ];

        dev.step(1.4);  // 項目名のセット
        v.label = v.colsDef.map(x => x.name);
        v.sheet.appendRow(v.label);

        dev.step(1.5);  // メモのセット
        v.notes = v.colsDef.map(x => x.desc + (x.note ? `\n${x.note}` : ''));
        v.notes.forEach((h,i)=>{
          v.sheet.getRange(1,i+1).setNote(h);
        })
      }

      // -------------------------------------------------------------
      dev.step(2);  // 対象メンバ・デバイスの特定
      // -------------------------------------------------------------

      dev.step(2.1); // memberId で検索
      v.values = v.sheet.getDataRange().getValues();
      v.labels = v.values.shift();

      v.idx = v.labels.indexOf('memberId');
      v.row = v.values.find(r => r[v.idx] === request.memberId);

      if (v.row) {  // シート上にmemberId有り

        // ---------------------------------------------------------
        dev.step(2.2); // 既存メンバ
        // ---------------------------------------------------------
        v.obj = {};
        v.labels.forEach((k, i) => v.obj[k] = v.row[i]);

        this.memberId = v.obj.memberId;
        this.name     = v.obj.name;
        this.status   = v.obj.status;
        this.log      = JSON.parse(v.obj.log || '{}');
        this.profile  = JSON.parse(v.obj.profile || '{}');
        this.device   = JSON.parse(v.obj.device || '{}');
        this.note     = v.obj.note || '';

        // ---------------------------------------------------------
        dev.step(2.3); // デバイス確認
        // ---------------------------------------------------------
        if (!this.device.hasOwnProperty(request.deviceId)) {

          dev.step(2.4); // 未登録デバイス
          v.device = this.MemberDevice();
          this.device[v.device.deviceId] = v.device;
        }

      } else {  // シート上にmemberId無し

        // ---------------------------------------------------------
        dev.step(2.5); // 未登録メンバ
        // ---------------------------------------------------------
        if (request.func === '::initial::') {
          // HTML初回ロード時(SPkey要求)

          dev.step(2.6); // 仮登録
          this.memberId = 'dummyMemberID';
          this.name     = 'dummyMemberName';
          this.status   = 'TR';
          this.log      = this.MemberLog();
          this.profile  = this.MemberProfile();
          this.device   = {};

          v.device = this.MemberDevice();
          this.device[v.device.deviceId] = v.device;

          this.note = '';

        } else {

          // -----------------------------------------------------
          dev.step(2.7); // 不正要求
          // -----------------------------------------------------
          throw new Error('unregistered member access');
        }
      }

      v.rv = this;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** addTrial: 新しい試行を登録し、メンバにパスコード通知メールを発信
   * @param {authRequest} request - 処理要求
   * @returns {authResponse|Error}
   */
  addTrial(arg) {
    const v = {whois:`${this.constructor.name}.addTrial`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      const req = arg;
      const member = this.getMember(req.memberId);
      if (member instanceof Error) {
        v.rv = member;
        return v.rv;
      }

      const devIdx = member.device.findIndex(d=>d.deviceId===req.deviceId);
      if (devIdx === -1 || member.device[devIdx].status !== '未認証') {
        v.rv = dev.error('invalid status');
        return v.rv;
      }

      const trial = new MemberTrial(this.cf.passcodeLength);
      member.device[devIdx].trial.unshift(trial);
      member.log.loginRequest = Date.now();

      if (member.device[devIdx].trial.length > this.cf.maxTrialLog) {
        member.device[devIdx].trial.pop();
      }

      this.setMember(member);

      if (!this.cf.udSendPasscode) {
        sendmail(member.memberId, '認証コード通知', `パスコード: ${trial.passcode}`);
      }

      v.rv = member;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** checkPasscode: 認証時のパスコードチェック
   * 入力されたパスコードをチェック、Member内部の各種メンバの値を更新
   * @param {authRequest} request - 処理要求
   * @returns {authResponse|Error}
   */
  checkPasscode(arg) {
    const v = {whois:`${this.constructor.name}.checkPasscode`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      const req = arg;
      if (req.func !== '::passcode::' || !req.arg?.[0]) {
        v.rv = dev.error('invalid request');
        return v.rv;
      }

      const member = this.getMember(req.memberId);
      if (member instanceof Error) {
        v.rv = member;
        return v.rv;
      }

      const devObj = member.device.find(d=>d.deviceId===req.deviceId);
      if (!devObj || devObj.status !== '試行中') {
        v.rv = dev.error('invalid status');
        return v.rv;
      }

      const trial = devObj.trial[0];
      const entered = req.arg[0];
      const ok = trial.passcode === entered;

      trial.log.unshift(new MemberTrialLog(entered, ok));

      if (ok) {
        devObj.status = '認証中';
        member.log.loginSuccess = Date.now();
        member.log.loginExpiration = Date.now() + this.cf.loginLifeTime;
      } else if (trial.log.length >= this.cf.maxTrial) {
        devObj.status = '凍結中';
        member.log.loginFailure = Date.now();
        member.log.unfreezeLogin = Date.now() + this.cf.loginFreeze;
      }

      this.setMember(member);
      v.rv = member;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** getMember: 指定メンバの情報をmemberListシートから取得
   * @param {string} memberId - ユーザ識別子(メールアドレス)	
   * @returns {Member|Error}  いまここ：元は"authResponse"だったが、"Member"の方がベター？
   */
  getMember(arg) {
    const v = {whois:`${this.constructor.name}.getMember`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      const memberId = arg;
      const sheet = SpreadsheetApp.getActive().getSheetByName(this.cf.memberList);
      const rows = sheet.getDataRange().getValues();

      const idx = rows.findIndex((r,i)=>i>0 && r[0]===memberId);
      if (idx < 0) {
        v.rv = dev.error('not exists');
        return v.rv;
      }

      const r = rows[idx];
      const m = new Member(this.cf);
      [m.memberId,m.name,m.status] = r;
      m.log = JSON.parse(r[3]);
      m.profile = JSON.parse(r[4]);
      m.device = JSON.parse(r[5]);
      m.note = r[6];

      v.rv = m;


      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** judgeMember: 加入審査画面から審査結果入力＋結果通知
   * 加入審査画面を呼び出し、管理者が記入した結果をmemberListに登録、審査結果をメンバに通知
   * memberListシートのGoogle Spreadのメニューから管理者が実行することを想定
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  static judgeMember(arg) {
    const v = {whois:`${this.constructor.name}.judgeMember`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      const memberId = arg;
      const m = new Member(this.cf).getMember(memberId);
      if (m instanceof Error) {
        v.rv = m;
        return v.rv;
      }
      if (m.status !== '未審査') {
        v.rv = 'not unexamined';
        return v.rv;
      }

      const ui = SpreadsheetApp.getUi();
      const res = ui.alert(
        `加入審査: ${m.memberId}`,
        '承認しますか？',
        ui.ButtonSet.YES_NO_CANCEL
      );

      if (res === ui.Button.CANCEL) {
        v.rv = 'examin canceled';
        return v.rv;
      }

      const now = Date.now();
      if (res === ui.Button.YES) {
        m.status = '加入中';
        m.log.approval = now;
        m.log.joiningExpiration = now + this.cf.memberLifeTime;
      } else {
        m.status = '加入禁止';
        m.log.denial = now;
        m.log.unfreezeDenial = now + this.cf.prohibitedToJoin;
      }

      new Member(this.cf).setMember(m);
      v.rv = m;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** judgeStatus: 指定メンバ・デバイスの状態を状態決定表により判定
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  judgeStatus(arg) {
    const v = {whois:`${this.constructor.name}.judgeStatus`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /**
   * MemberDevice: デバイス情報の初期オブジェクト生成
   * @returns {MemberDevice}
   */
  MemberDevice() {
    const v = { whois: 'Member.MemberDevice', arg: {}, rv: null };
    dev.start(v);
    try {

      v.rv = {
        deviceId: Utilities.getUuid(),
        status: 'UC',             // uncertified
        CPkeySign: '',
        CPkeyEnc: '',
        CPkeyUpdated: Date.now(),
        trial: [],
      };

      dev.end();
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /**
   * MemberLog: メンバ履歴情報初期化
   * @returns {MemberLog}
   */
  MemberLog() {
    const v = { whois: 'Member.MemberLog', arg: {}, rv: null };
    dev.start(v);
    try {

      const now = Date.now();
      v.rv = {
        joiningRequest: now,
        approval: 0,
        denial: 0,
        loginRequest: 0,
        loginSuccess: 0,
        loginExpiration: 0,
        loginFailure: 0,
        unfreezeLogin: 0,
        joiningExpiration: 0,
        unfreezeDenial: 0,
      };

      dev.end();
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /**
   * MemberProfile: メンバ属性情報初期化
   * @returns {MemberProfile}
   */
  MemberProfile() {
    const v = { whois: 'Member.MemberProfile', arg: {}, rv: null };
    dev.start(v);
    try {

      v.rv = {
        authority: 0,
      };

      dev.end();
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** reissuePasscode: パスコードを再発行する
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  reissuePasscode(arg) {
    const v = {whois:`${this.constructor.name}.reissuePasscode`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** removeMember: 登録中メンバをアカウント削除、または加入禁止にする
   * - memberListシートのGoogle Spreadのメニューから管理者が実行することを想定
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  static removeMember(arg) {
    const v = {whois:`${this.constructor.name}.removeMember`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      // getMember + 状態更新 + setMember の組み合わせで実装できます。
      // （凍結解除・論理削除・CPkey更新はいずれも Member.device / status / log の更新のみ）

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** restoreMember: 加入禁止(論理削除)されているメンバを復活させる
   * - memberListシートのGoogle Spreadのメニューから管理者が実行することを想定
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  static restoreMember(arg) {
    const v = {whois:`${this.constructor.name}.restoreMember`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      // getMember + 状態更新 + setMember の組み合わせで実装できます。
      // （凍結解除・論理削除・CPkey更新はいずれも Member.device / status / log の更新のみ）

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** setMember: 指定メンバ情報をmemberListシートに保存
   * - 登録済メンバの場合は更新、未登録の場合は新規登録(追加)を行う
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  setMember(arg) {
    const v = {whois:`${this.constructor.name}.setMember`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      const m = arg;
      const sheet = SpreadsheetApp.getActive().getSheetByName(this.cf.memberList);
      const rows = sheet.getDataRange().getValues();
      const idx = rows.findIndex((r,i)=>i>0 && r[0]===m.memberId);

      const row = [
        m.memberId,
        m.name,
        m.status,
        JSON.stringify(m.log),
        JSON.stringify(m.profile),
        JSON.stringify(m.device),
        m.note
      ];

      if (idx < 0) sheet.appendRow(row);
      else sheet.getRange(idx+1,1,1,row.length).setValues([row]);

      v.rv = null;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** unfreeze: 指定されたメンバ・デバイスの「凍結中」状態を強制的に解除
   * - 引数でmemberIdが指定されなかった場合、凍結中デバイス一覧の要求と看做す
   * - deviceIdの指定が無い場合、memberIdが使用する凍結中デバイス全てを対象とする
   * - memberListシートのGoogle Spreadのメニューから管理者が実行することを想定
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  static unfreeze(arg) {
    const v = {whois:`${this.constructor.name}.unfreeze`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      // getMember + 状態更新 + setMember の組み合わせで実装できます。
      // （凍結解除・論理削除・CPkey更新はいずれも Member.device / status / log の更新のみ）

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }

  /** updateCPkey: 対象メンバ・デバイスの公開鍵を更新
   * @param {string} arg - 引数
   * @returns {null|Error} 戻り値
   */
  updateCPkey(arg) {
    const v = {whois:`${this.constructor.name}.updateCPkey`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      // getMember + 状態更新 + setMember の組み合わせで実装できます。
      // （凍結解除・論理削除・CPkey更新はいずれも Member.device / status / log の更新のみ）

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}