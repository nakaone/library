# MemberStateManager クラス仕様書

## 概要

`MemberStateManager` は、クライアント側でメンバ状態（加入、ログイン、鍵状態など）を統一的に管理するためのクラスです。  
暗号処理やサーバ通信とは独立し、`encryptRequest()` などの機能から利用されます。

---

## 状態定義（enum）

```js
const MemberState = Object.freeze({
  UNREGISTERED: 'unregistered',       // 未加入
  PENDING: 'pending',                 // 審査中（加入申請中）
  ACTIVE: 'active',                   // 加入中（有効）
  EXPIRED: 'expired',                 // 加入期限切れ
  CPKEY_UPDATING: 'cpkey_updating',   // CPkey更新中
  FROZEN: 'frozen',                   // 凍結中
  LOGGED_OUT: 'logged_out',           // 未ログイン
  LOGIN_TRIAL: 'login_trial',         // ログイン試行中
  LOGGED_IN: 'logged_in',             // ログイン中
  LOGIN_EXPIRED: 'login_expired'      // ログイン期限切れ
});
```

---

## クラス構造

```js
/**
 * @class MemberStateManager
 * @desc クライアント側でメンバ状態を管理するクラス
 */
class MemberStateManager {
  /**
   * @param {Object} config - authConfig.decryptRequestを想定
   */
  constructor(config) {
    this.config = config;
    this.state = MemberState.UNREGISTERED;
    this.memberInfo = null;      // memberListの該当レコード相当
    this.local = null;           // IndexedDB or localStorageの内容
  }

  /** IndexedDBから最新状態をロード */
  async load() {
    this.local = await this.#getLocalState();
    this.state = this.#determineState();
  }

  /** 現在状態を返す */
  getState() {
    return this.state;
  }

  /** 状態遷移を明示的に更新する */
  async updateState(nextState, extra = {}) {
    console.info(`[StateManager] ${this.state} → ${nextState}`);
    this.state = nextState;

    switch (nextState) {
      case MemberState.PENDING:
        await this.#saveLocal({ ApplicationForMembership: Date.now() });
        break;
      case MemberState.ACTIVE:
        await this.#saveLocal({ expireAccount: Date.now() + this.config.memberLifeTime });
        break;
      case MemberState.CPKEY_UPDATING:
        await this.#saveLocal({ CPkeyUpdateUntil: Date.now() + this.config.loginLifeTime });
        break;
      case MemberState.LOGGED_IN:
        await this.#saveLocal({
          lastLogin: Date.now(),
          expireCPkey: Date.now() + this.config.loginLifeTime
        });
        break;
      case MemberState.FROZEN:
        await this.#saveLocal({ freezingUntil: Date.now() + this.config.trial.freezing });
        break;
      case MemberState.LOGIN_EXPIRED:
        await this.#saveLocal({ expireCPkey: 0 });
        break;
      default:
        break;
    }
  }

  /** 現在の状態を算出 */
  #determineState() {
    const now = Date.now();
    const m = this.memberInfo;
    const l = this.local;

    if (!m) return MemberState.UNREGISTERED;
    if (!m.accepted) return MemberState.PENDING;
    if (m.expire < now) return MemberState.EXPIRED;
    if (l?.freezingUntil && now < l.freezingUntil) return MemberState.FROZEN;
    if (l?.CPkeyUpdateUntil && now < l.CPkeyUpdateUntil) return MemberState.CPKEY_UPDATING;
    if (!l?.expireCPkey) return MemberState.LOGGED_OUT;
    if (now < l.expireCPkey) return MemberState.LOGGED_IN;
    return MemberState.LOGIN_EXPIRED;
  }

  /** IndexedDBから状態取得 */
  async #getLocalState() {
    return await idbKeyval.get(this.config.system.name);
  }

  /** IndexedDBに状態保存 */
  async #saveLocal(data) {
    const merged = { ...(this.local || {}), ...data };
    this.local = merged;
    await idbKeyval.set(this.config.system.name, merged);
  }
}
```

---

## 利用例

```js
const stateMgr = new MemberStateManager(authConfig.decryptRequest);
await stateMgr.load();

switch (stateMgr.getState()) {
  case MemberState.UNREGISTERED:
    showSignupPrompt();
    break;
  case MemberState.PENDING:
    showPendingMessage();
    break;
  case MemberState.ACTIVE:
    promptLogin();
    break;
  case MemberState.LOGGED_IN:
    startSession();
    break;
  case MemberState.LOGIN_EXPIRED:
    await stateMgr.updateState(MemberState.LOGGED_OUT);
    promptReLogin();
    break;
}
```

---

## 拡張予定

- 🔒 `verifyCPkeyExpiry()`：サーバの通知時にクライアントで期限再確認  
- 🔁 `syncWithServer(memberRecord)`：サーバ`memberList`の内容で状態再計算  
- 🧹 `reset()`：強制的にIndexedDBの全状態をクリア（再ログイン用）  
- 📅 `getRemainingLifetime()`：CPkey・アカウント両方の残存期間を返す  

---

## メリット

| 観点 | 効果 |
|:--|:--|
| 状態管理の集中化 | 状態・期限・試行回数・凍結判定が一箇所で制御可能 |
| サーバ同期が容易 | `syncWithServer()`で差分を吸収 |
| UIとの連携 | 状態に応じた画面遷移を容易に切り替えられる |
| テスト容易性 | 状態遷移をユニットテスト化しやすい |
