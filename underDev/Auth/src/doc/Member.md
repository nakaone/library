# Member クラス 仕様書

## 🧭 概要

- Member は サーバ側 でメンバ情報を一元的に管理するクラスです。
- 加入・ログイン・パスコード試行・デバイス別CPkey管理などの状態を統一的に扱います。
- マルチデバイス利用を前提とし、memberListスプレッドシートの1行を1メンバとして管理します。

### 状態遷移

<!--::$doc/stateTransition.md::-->

※ 下表内の変数名は`Member.log`のメンバ名

状態 | 判定式
:-- | :--
未加入 | 加入要求をしたことが無い<br>joiningRequest === 0
加入禁止 | 加入禁止されている<br>Date.now() <= unfreezeDenial
未審査 | 管理者の認否が未決定<br>approval === 0 && denial === 0
認証中 | 加入承認済かつ認証有効期限内<br>0 < approval && Date.now() ≦ loginExpiration
凍結中 | 加入承認済かつ凍結期間内<br>0 < approval && loginFailure　<= Date.now() && Date.now() <= unfreezeLogin
未認証 | 加入承認後認証要求されたことが無い<br>0 < approval && loginRequest === 0
試行中 | 加入承認済かつ認証要求済(かつ認証中でも凍結中でもない)<br>0 < approval && 0 < loginRequest
審査済 | 加入認否決定済<br>0 < approval || 0 < denial

- 上から順に判定する(下順位の状態は上順位の何れにも該当しない)

## 🧩 内部構成(クラス変数)

### Member

<!--::$tmp/Member.md::-->

### MemberLog

<!--::$tmp/MemberLog.md::-->

### MemberProfile

<!--::$tmp/MemberProfile.md::-->

### MemberDevice

<!--::$tmp/MemberDevice.md::-->

### MemberTrial

<!--::$tmp/MemberTrial.md::-->

### MemberTrialLog

<!--::$tmp/MemberTrialLog.md::-->

## 🧱 constructor()

### 概要


- 指定されたmemberIdのインスタンスを返す
- deviceIdの指定が有った場合は該当しないMemberDeviceオブジェクトは削除

```js
/**
 * @param {string} memberId
 * @param {string} [deviceId]
 * @returns {Member}
 */
```

## 🧱 getStatus()

### 概要



### 📤 入力項目

### 📥 出力項目
