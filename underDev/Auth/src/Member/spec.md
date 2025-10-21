# Member クラス 仕様書

## 🧭 概要

- 'Member'はGoogle SpreadSheet上でメンバ(アカウント)情報・状態を一元的に管理するためのクラスです。
- 加入・ログイン・パスコード試行・デバイス別公開鍵(CPkey)管理などの状態を統一的に扱います。
- マルチデバイス利用を前提とし、memberListスプレッドシートの1行を1メンバとして管理します。
- 日時は全てUNIX時刻(number型)。比較も全てミリ秒単位で行う

## 🧩 内部構成(クラス変数)

```mermaid
classDiagram
  class Member {
    string memberId
    string name
    string status
    MemberLog log
    MemberProfile profile
    MemberDevice[] device
  }

  class MemberDevice {
    string deviceId
    string status
    string CPkey
    number CPkeyUpdated
    MemberTrial[] trial
  }

  class MemberTrial {
    string passcode
    number created
    MemberTrialLog[] log
  }

  class MemberTrialLog {
    string entered
    number result
    string message
    number timestamp
  }

  Member --> MemberLog
  Member --> MemberProfile
  Member --> MemberDevice
  MemberDevice --> MemberTrial
  MemberTrial --> MemberTrialLog
```

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

- 引数は`authServerConfig`
- `authServerConfig.memberList`シートが存在しなければシートを新規作成
  - 項目名はMemberクラスのメンバ名
  - 各項目の「説明」を項目名セルのメモとしてセット

#### authConfig

<!--::$tmp/authConfig.md::-->

#### authServerConfig

<!--::$tmp/authServerConfig.md::-->

## 🧱 getMember()

指定メンバの情報をmemberListシートから取得

- 引数は`memberId`、戻り値は当該メンバの`Member`オブジェクト
- JSON文字列の項目はオブジェクト化(Member.log, Member.profile, Member.device)

## 🧱 judgeStatus()

指定メンバ・デバイスの状態を判定

- 後述「状態遷移」に基づき、引数で指定されたメンバ・デバイスの状態を判断
- 引数は`Member`、任意項目として`deviceId`
- 戻り値は`MemberJudgeStatus`
- memberList上のstatusは judgeStatus() の評価結果を反映して自動更新

<!--::$tmp/MemberJudgeStatus.md::-->

### 状態遷移

- メンバの状態遷移
- 下表内の変数名は`MemberLog`のメンバ名

<!--::$src/Member/stateTransition.md::-->

状態 | 判定式
:-- | :--
未加入 | 加入要求をしたことが無い、または加入期限切れ(失効)<br>joiningRequest === 0 || (0 < approval &&　0 < joiningExpiration && joiningExpiration < Date.now())
加入禁止 | 加入禁止されている<br>0 < denial && Date.now() <= unfreezeDenial
未審査 | 管理者の認否が未決定<br>approval === 0 && denial === 0
認証中 | 加入承認済かつパスコード認証に成功し認証有効期間内の状態<br>0 < approval && Date.now() ≦ loginExpiration
凍結中 | 加入承認済かつ凍結期間内<br>0 < approval && 0 < loginFailure && loginFailure < Date.now() && Date.now() <= unfreezeLogin
未認証 | 加入承認後認証要求されたことが無い<br>0 < approval && loginRequest === 0
試行中 | 加入承認済かつ認証要求済(かつ認証中でも凍結中でもない)<br>0 < approval && 0 < loginRequest && !(0 < loginFailure && loginFailure < Date.now() && Date.now() <= unfreezeLogin)


- 上から順に判定する(下順位の状態は上順位の何れにも該当しない)
- 試行中は「凍結中」「認証中」いずれにも該当しない場合にのみ成立

## 🧱 setMember()

指定メンバ・デバイス情報をmemberListシートに保存

- arg.deviceが配列だった場合
  - arg.deviceをMemberに設定(Member.device=arg.device)
- arg.deviceが配列では無い場合
  - memberList.deviceにarg.device.deviceIdが存在する場合<br>
    => memberList.device内のdevice.deviceIdをarg.deviceで置換
  - memberList.deviceにarg.device.deviceIdが存在しない場合<br>
    => memberList.deviceにarg.deviceを追加
- Member.status は judgeStatus().memberStatus の結果を保存
- 各 Member.device[n].status は judgeStatus().deviceStatus の結果を個別に保存
- JSON文字列の項目は文字列化(Member.log, Member.profile, Member.device)

```js
/**
 * @param {Member} arg
 * @returns {Member|Error} 更新後のMemberインスタンスを返す。失敗時はError。
 */
```

<!--
## 🧱 proto()

### 概要

### 📤 入力項目

### 📥 出力項目
-->

## 🧱 addTrial()

新しい試行を登録し、メンバにパスコード通知メールを発信

- 引数は`authRequest`、戻り値は`Member`
- 状態チェック
  - authRequest.memberIdを基にgetMember()でMemberインスタンスを取得
  - authRequest.deviceIdで対象デバイスを特定
  - 状態が「未認証」以外はエラーを返して終了
- 新しい試行を登録するに伴い、以下のメンバの値を更新する
  - MemberDevice.status: 未認証 -> 試行中
  - MemberTrial.passcode: '' -> ゼロパディングされたauthServerConfig.trial.passcodeLength桁の乱数
  - MemberTrial.created: 現在日時(UNIX時刻)
  - MemberTrial.log: [] ※空配列
  - MemberLog.loginRequest: 現在日時(UNIX時刻)
- 新しい試行(`authTrial`)をMember.trialの先頭に追加
- ログイン試行履歴の最大保持数を超えた場合、古い世代を削除<br>
  (`Member.trial.length >= authServerConfig.generationMax`)
- 更新後の`Member`について、memberListシートを更新
- メンバにパスコード通知メールを発信<br>
  但し`authServerConfig.underDev.sendPasscode === false`なら発信を抑止(∵開発中)

## 🧱 checkPasscode()

入力されたパスコードをチェック、Member内部の各種メンバの値を更新の上、チェック結果を返す。

- 引数は`authRequest`、戻り値は`Member`
- `authRequest.func='::passcode::'`,`authRequest.arguments=[入力されたパスコード]`
- 状態チェック
  - authRequest.memberIdを基にgetMember()でMemberインスタンスを取得
  - authRequest.deviceIdで対象デバイスを特定
  - 状態が「試行中」以外はエラーを返して終了
- パスコードをチェック、結果(MemberTrialLog)をMemberTrial.logの先頭に追加(unshift())
- パスコードが一致した場合
  - MemberDevice.status: 試行中 -> 認証中
  - MemberLog.loginSuccess: 現在日時(UNIX時刻)
  - MemberLog.loginExpiration: 現在日時＋authServerConfig.loginLifeTime
- パスコードが不一致だった場合
  - 試行回数の上限未満の場合(`MemberTrial.log.length < authServerConfig.trial.maxTrial`)<br>
    ⇒ 変更すべき項目無し
  - 試行回数の上限に達した場合(`MemberTrial.log.length >= authServerConfig.trial.maxTrial`)
    - MemberDevice.status: 試行中 -> 凍結中
    - MemberLog.loginFailure: 現在日時(UNIX時刻)
    - MemberLog.unfreezeLogin: 現在日時＋authServerConfig.loginFreeze
- judgeStatusメソッドに更新後Memberを渡し、状態を更新した上でmemberListシートを更新
- 後続処理は戻り値(`Member.status`)で分岐先処理を判断

## 🧱 updateCPkey()

- 対象メンバ・デバイスの公開鍵を更新する
- 引数は`authRequest`、戻り値は`Member`
- `authRequest.func='::updateCPkey::'`,`authRequest.signature=更新後CPkey`
- 状態チェック
  - authRequest.memberIdを基にgetMember()でMemberインスタンスを取得
  - authRequest.deviceIdで対象デバイスを特定
  - 状態が「試行中」以外はエラーを返して終了


## 外部ライブラリ

- ソース先頭(グローバル領域)に`const dev=devTools()`を挿入

<details><summary>devTools</summary>

```js
//::$lib/devTools/1.0.1/core.js::
```

</details>

<details><summary>sendMail</summary>

```js
//::$lib/sendMail/1.0.0/core.js::
```

</details>

<details><summary>toLocale</summary>

```js
//::$lib/toLocale/1.2.0/core.js::
```

</details>

<details><summary>whichType</summary>

```js
//::$lib/whichType/1.0.1/core.js::
```

</details>