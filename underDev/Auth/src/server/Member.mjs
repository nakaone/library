export class Member {

  static _XXX = null;

  /**
   * @constructor
   * @param {authServerConfig} config - ユーザ指定の設定値
   */
  constructor(arg) {
    const v = {whois:`Member.constructor`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      // -------------------------------------------------------------
      // -------------------------------------------------------------
      /*
        処理手順
        memberListシートが存在しなければシートを新規作成
          シート上の項目名はMemberクラスのメンバ名
          各項目の「説明」を項目名セルのメモとしてセット
        this.log = new MemberLog()
        this.profile = new MemberProfile()
      */

      dev.end(); // 終了処理

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

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}