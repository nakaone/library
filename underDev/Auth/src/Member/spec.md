<!--::$src/common/header.md::-->

# Member クラス 仕様書

## 🧭 概要

- 'Member'はGoogle SpreadSheet上でメンバ(アカウント)情報・状態を一元的に管理するためのクラスです。
- 加入・ログイン・パスコード試行・デバイス別公開鍵(CPkey)管理などの状態を統一的に扱います。
- マルチデバイス利用を前提とし、memberListスプレッドシートの1行を1メンバとして管理します。
- 日時は全てUNIX時刻(number型)。比較も全てミリ秒単位で行う

## 🧩 内部構成(クラス変数)

<details><summary>クラス図</summary>
<!--::$tmp/Member.classDiagram.svg::-->
</details>

<details><summary>Member</summary>
<!--::$tmp/Member.md::-->
</details>

<details><summary>MemberLog</summary>
<!--::$tmp/MemberLog.md::-->
</details>

<details><summary>MemberProfile</summary>
<!--::$tmp/MemberProfile.md::-->
</details>

<details><summary>MemberDevice</summary>
<!--::$tmp/MemberDevice.md::-->
</details>

<details><summary>MemberTrial</summary>
<!--::$tmp/MemberTrial.md::-->
</details>

<details><summary>MemberTrialLog</summary>
<!--::$tmp/MemberTrialLog.md::-->
</details>

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

- 引数は`memberId`
- 戻り値は`authResponse`
  - `authResponse.request` = `{memberId:引数のmemberId}`
  - `authResponse.response` = memberListシートから取得した`Member`
- memberIdがmemberListシート未登録<br>
  ⇒ `{result:'fatal',message:'not exists',response:undefined}`
- JSON文字列の項目はオブジェクト化(Member.log, Member.profile, Member.device)

## 🧱 setMember()

- 指定メンバ情報をmemberListシートに保存。
- 登録済メンバの場合は更新、未登録の場合は新規登録(追加)を行う

### 登録済メンバの更新

引数が`Member`の場合、以下の処理を行う。

1. memberListシートに存在しない場合、以下の`authResponse`を返して終了
  - `authResponse.result` = 'fatal'
  - `authResponse.message` = 'not exist'
  - `authResponse.request` = 引数で渡された`Member`
  - `authResponse.response` = 'undefined'
2. judgeStatusでstatusを最新にしておく
3. JSON文字列の項目は文字列化した上でmemberListシートの該当者を更新(`Member.log/profile/device`)
4. 以下の`authResponse`を返して終了
  - `authResponse.result` = 'normal'
  - `authResponse.message` ='updated'
  - `authResponse.request` = 引数で渡された`Member`
  - `authResponse.response` = judgeStatusでstatusをチェック済の`Member`

### 新規登録メンバの追加

引数が`authRequest`の場合、新規登録要求と看做して以下の処理を行う。

1. memberListシートに存在する場合、以下の`authResponse`を返して終了
  - `authResponse.result` = 'fatal'
  - `authResponse.message` = 'already exist'
  - `authResponse.request` = 引数で渡された`authRequest`
  - `authResponse.response` = 'undefined'
2. authRequestが新規登録要求か確認
  - 確認項目
    - `authRequest.func ==== '::newMember::'`
    - `authRequest.arguments[0]`にメンバの氏名(文字列)が入っている
    - `memberId, deviceId, signature`が全て設定されている
  - 確認項目の全条件が満たされ無かった場合、以下の`authResponse`を返して終了
    - `authResponse.result` = 'fatal'
    - `authResponse.message` = 'Invalid registration request'
    - `authResponse.request` = 引数で渡された`authRequest`
    - `authResponse.response` = 'undefined'
3. `Member`の新規作成
  - `Member.memberId = authRequest.memberId`
  - `Member.name = authRequest.arguments[0]`
  - `Member.device = new MemberDevice({deviceId:authRequest.deviceId, CPkey:authRequest.signature})`
  - `Member.log.joiningRequest`に現在日時を設定
  - judgeStatusメソッドにMemberを渡し、状態を設定
4. JSON文字列の項目は文字列化した上でmemberListシートに追加(`Member.log/profile/device`)
5. 本番運用中なら加入要請メンバへの通知<br>
  `authServerConfig.underDev.sendInvitation === false`なら開発中なので通知しない
6. 以下の`authResponse`を返して終了
  - `authResponse.result` = 'normal'
  - `authResponse.message='appended'`
  - `authResponse.request` = 引数で渡された`authRequest`
  - `authResponse.response` = 新規作成した`Member`

## 🧱 removeMember()

- 登録中メンバをアカウント削除、または加入禁止にする。
- memberListシートのGoogle Spreadのメニューから管理者が実行することを想定。

```js
/**
 * @param {string} memberId
 * @param {boolean} [physical=false] - 物理削除ならtrue、論理削除ならfalse
 * @returns {authResponse}
 */
```

### 物理削除

- auditLogにメンバ削除を記録
  - `authAuditLog.func` = 'physical remove'
  - `authAuditLog.note` = 削除対象メンバの`Member`(JSON)
- シート上に確認のダイアログを表示、OKが選択されたら当該メンバの行をmemberListから削除
- 以下の`authResponse`を返して終了
  - `authResponse.result` = 'normal'
  - `authResponse.message` = 'physically removed'
  - `authResponse.request` = `{memberId, physical}`
  - `authResponse.response` = undefined

### 論理削除

- getMemberメソッドで当該メンバの`Member`を取得
- 既に「加入禁止」なら以下を返して終了
  - `authResponse.result` = 'warning'
  - `authResponse.message` = 'already logically removed'
  - `authResponse.request` = `{memberId, physical}`
  - `authResponse.response` = 更新前の`Member`
- シート上に確認のダイアログを表示、キャンセルが選択されたら以下を返して終了
  - `authResponse.result` = 'warning'
  - `authResponse.message` = 'logically remove canceled'
  - `authResponse.request` = `{memberId, physical}`
  - `authResponse.response` = 更新前の`Member`
- `Member`の以下項目を更新
  - `Member.status` = '加入禁止'
  - `MemberLog.joiningExpiration` = 現在日時(UNIX時刻)
  - `MemberLog.unfreezeDenial` = 現在日時(UNIX時刻)＋authServerConfig.prohibitedToJoin
- setMemberに`Member`を渡してmemberListを更新
- 以下の`authResponse`を返して終了
  - `authResponse.result` = 'normal'
  - `authResponse.message` = 'logically removed'
  - `authResponse.request` = `{memberId, physical}`
  - `authResponse.response` = 更新後の`Member`

## 🧱 restoreMember()

- 加入禁止(論理削除)されているメンバを復活させる。
- memberListシートのGoogle Spreadのメニューから管理者が実行することを想定。

```js
/**
 * @param {string} memberId
 * @param {boolean} [examined=true] - 「(審査済)未認証」にするならtrue「未審査」ならfalse。なお未審査なら改めて審査登録が必要
 * @returns {authResponse}
 */
```

- getMemberメソッドで当該メンバの`Member`を取得
- 状態が「加入禁止」ではないなら以下を返して終了
  - `authResponse.result` = 'warning'
  - `authResponse.message` = 'not logically removed'
  - `authResponse.request` = `{memberId, examined}`
  - `authResponse.response` = 更新前の`Member`
- シート上に確認のダイアログを表示、キャンセルが選択されたら以下を返して終了
  - `authResponse.result` = 'warning'
  - `authResponse.message` = 'restore canceled'
  - `authResponse.request` = `{memberId, examined}`
  - `authResponse.response` = 更新前の`Member`
- `Member`の以下項目を更新
  - `Member.status` = '加入済'
  - `MemberLog.approval` = `examined === true ? Date.now() : 0`
  - `MemberLog.denial` = 0
  - `MemberLog.joiningExpiration` = 現在日時(UNIX時刻)＋authServerConfig.memberLifeTime
  - `MemberLog.unfreezeDenial` = 0
- setMemberに`Member`を渡してmemberListを更新
- 以下の`authResponse`を返して終了
  - `authResponse.result` = 'normal'
  - `authResponse.request` = `{memberId, examined}`
  - `authResponse.response` = 更新後の`Member`

## 🧱 judgeMember()

- 加入審査画面を呼び出し、管理者が記入した結果をmemberListに登録、審査結果をメンバに通知する。
- memberListシートのGoogle Spreadのメニューから管理者が実行することを想定。

```js
/**
 * @param {string} memberId
 * @returns {authResponse}
 */
```

- getMemberメソッドで当該メンバの`Member`を取得
- 状態が「未審査」ではないなら以下を返して終了
  - `authResponse.result` = 'warning'
  - `authResponse.message` = 'not unexamined'
  - `authResponse.request` = memberId
  - `authResponse.response` = 更新前の`Member`
- シート上にmemberId・氏名と「承認」「否認」「取消」ボタンを表示、取消が選択されたら以下を返して終了
  - `authResponse.result` = 'warning'
  - `authResponse.message` = 'examin canceled'
  - `authResponse.request` = memberId
  - `authResponse.response` = 更新前の`Member`
- 「承認」時は`Member`の以下項目を更新
  - `Member.status` = '加入済'
  - `MemberLog.approval` = 現在日時
  - `MemberLog.denial` = 0
  - `MemberLog.joiningExpiration` = 現在日時(UNIX時刻)＋authServerConfig.memberLifeTime
  - `MemberLog.unfreezeDenial` = 0
- 「否認」時は`Member`の以下項目を更新
  - `Member.status` = '加入禁止'
  - `MemberLog.approval` = 0
  - `MemberLog.denial` = 現在日時
  - `MemberLog.joiningExpiration` = 0
  - `MemberLog.unfreezeDenial` = 現在日時＋authServerConfig.prohibitedToJoin
- setMemberに`Member`を渡してmemberListを更新
- 以下の`authResponse`を返して終了
  - `authResponse.result` = 'normal'
  - `authResponse.request` = memberId
  - `authResponse.response` = 更新後の`Member`

## 🧱 unfreeze()

- 指定されたメンバ・デバイスの「凍結中」状態を強制的に解除
- 引数でmemberIdが指定されなかった場合、凍結中デバイス一覧の要求と看做す
- memberListシートのGoogle Spreadのメニューから管理者が実行することを想定

```js
/**
 * @param {string} [memberId]
 * @param {boolean} [deviceId]
 * @returns {authResponse}
 */
```

### 凍結解除

deviceIdの指定が無い場合、memberIdが使用する凍結中デバイス全てを対象とする

- getMemberメソッドで当該メンバの`Member`を取得、対象デバイスが存在しない場合は以下を返す
  - `authResponse.result` = 'warning'
  - `authResponse.message` = 'no frozen devices'
  - `authResponse.request` = memberId
  - `authResponse.response` = 更新前の`Member`
- 対象デバイスそれぞれについて以下項目を更新
  - `MemberDevice.status` = '未認証'
  - `MemberDevice.trial` = 空配列
  - `MemberLog.unfreezeLogin` = 現在日時
- setMemberに`Member`を渡してmemberListを更新
- 以下の`authResponse`を返して終了
  - `authResponse.result` = 'normal'
  - `authResponse.request` = `{memberId,deviceId:[凍結解除したdeviceIdの配列]}`
  - `authResponse.response` = 更新後の`Member`

### 凍結中デバイス一覧

- memberList.deviceから「凍結中」デバイスがある全メンバを抽出
- 以下の`authResponse`を返して終了
  - `authResponse.result` = 'normal'
  - `authResponse.request` = 'list freezing'
  - `authResponse.response` = 「凍結中」デバイスがある全メンバの`Member`配列

## 🧱 judgeStatus()

指定メンバ・デバイスの状態を判定

- 引数は`Member`またはmemberId(文字列)
- 引数がmemberIdだった場合、getMemberメソッドで`Member`を取得
- 後述「状態遷移」に基づき、引数で指定されたメンバおよびデバイス全ての状態を判断
- 戻り値は`authResponse`
  - `authResponse.request` = `{Member:引数のMember,deviceId:引数のdeviceId}`
  - `authResponse.response` = メンバ・デバイスのstatusを更新後の`Member`

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

## 🧱 addTrial()

新しい試行を登録し、メンバにパスコード通知メールを発信

- 引数は`authRequest`、戻り値は`authResponse`
- 状態チェック
  - authRequest.memberIdを基にgetMember()でMemberインスタンスを取得
  - authRequest.deviceIdで対象デバイスを特定
  - 状態が「未認証」以外はエラーを返して終了
    - `authResponse.result` = 'fatal'
    - `authResponse.message` = 'not qualified'
    - `authResponse.request` = 引数で渡された`authRequest`
    - `authResponse.response` = 対象メンバの`Member`
- 新しい試行を登録するに伴い、以下のメンバの値を更新する
  - MemberDevice.status: 未認証 -> 試行中
  - MemberTrial.passcode: '' -> ゼロパディングされたauthServerConfig.trial.passcodeLength桁の乱数
  - MemberTrial.created: 現在日時(UNIX時刻)
  - MemberTrial.log: [] ※空配列
  - MemberLog.loginRequest: 現在日時(UNIX時刻)
- 新しい試行(`authTrial`)をMember.trialの先頭に追加
- ログイン試行履歴の最大保持数を超えた場合、古い世代を削除<br>
  (`Member.trial.length >= authServerConfig.generationMax`)
- 更新後の`Member`を引数にsetMemberを呼び出し、memberListシートを更新
- メンバにパスコード通知メールを発信<br>
  但し`authServerConfig.underDev.sendPasscode === false`なら発信を抑止(∵開発中)
- 以下の`authResponse`を返して終了
  - `authResponse.result` = 'normal'
  - `authResponse.request` = 引数で渡された`authRequest`
  - `authResponse.response` = 更新後の`Member`

## 🧱 checkPasscode()

入力されたパスコードをチェック、Member内部の各種メンバの値を更新の上、チェック結果を返す。

- 引数は`authRequest`、戻り値は`authResponse`
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
- 更新後の`Member`を引数にsetMemberを呼び出し、memberListシートを更新<br>
  ※ setMember内でjudgeStatusメソッドを呼び出しているので、状態の最新化は担保
- 以下の`authResponse`を返して終了
  - `authResponse.result` = 'normal'
  - `authResponse.message` = MemberDevice.status
  - `authResponse.request` = 引数で渡された`authRequest`
  - `authResponse.response` = 更新後の`Member`
- 後続処理は戻り値(`authResponse.message`)で分岐先処理を判断

## 🧱 reissuePasscode()

パスコードを再発行する

- 引数は`authRequest`、戻り値は`authResponse`
- 状態チェック
  - authRequest.memberIdを基にgetMember()でMemberインスタンスを取得
  - authRequest.deviceIdで対象デバイスを特定
  - 状態が「試行中」かつ`authRequest.func === '::reissue::'`以外はエラーを返して終了
    - `authResponse.result` = 'fatal'
    - `authResponse.message` = 'not qualified'
    - `authResponse.request` = 引数で渡された`authRequest`
    - `authResponse.response` = 対象メンバの`Member`
- 新たなパスコードを生成
- auditLogにパスコード再発行を記録
  - `authAuditLog.func` = 'reissuePasscode'
  - `authAuditLog.note` = 旧パスコード + ' -> ' + 新パスコード
- 現在試行中のMemberTrialを書き換え<br>
  ※ `MemberDevice.status`,`MemberTrial.log`,`MemberLog.loginRequest`は書き換えない(継続使用)
  - `Member.trial[0].passcode` = 新パスコード
  - `Member.trial[0].created` = 現在日時
- 更新後の`Member`を引数にsetMemberを呼び出し、memberListシートを更新
- メンバにパスコード通知メールを発信<br>
  但し`authServerConfig.underDev.sendPasscode === false`なら発信を抑止(∵開発中)
- 以下の`authResponse`を返して終了
  - `authResponse.result` = 'normal'
  - `authResponse.request` = 引数で渡された`authRequest`
  - `authResponse.response` = 更新後の`Member`

## 🧱 updateCPkey()

- 対象メンバ・デバイスの公開鍵を更新する
- 引数チェック
  - 引数は`authRequest`で以下を持つ想定
    - `authRequest.func === '::updateCPkey::'`
    - `authRequest.arguments === 更新後CPkey`
  - 引数(CPkey)がRSAの公開鍵形式か(PEMフォーマットなど)チェック、不適合なら以下を返す
    - `authResponse.result` = 'fatal'
    - `authResponse.message` = 'Invalid public key'
    - `authResponse.request` = 引数で渡された`authRequest`
    - `authResponse.response` = undefined
- 状態チェック
  - authRequest.memberIdを基にgetMember()でMemberインスタンスを取得、
    **取得したMemberインスタンスはupdateCPkey内部のみのローカル変数**とし、以下操作はローカル変数のMemberに対して行う
  - authRequest.deviceIdで対象デバイスを特定
  - 状態が「未認証・試行中・認証中・凍結中」以外はエラーを返して終了
- Memberインスタンス配下の各項目の値を更新
  - MemberDevice.CPkey: 更新後CPkey
  - MemberDevice.CPkeyUpdated: 現在日時
- 状態が「未認証」の場合
  - MemberDevice.status: 変化無し(未認証のまま)
- 状態が「試行中」の場合
  - MemberDevice.status: 試行中 -> 未認証
  - CPkeyが更新されても試行回数はリセットしない
- 状態が「認証中」の場合
  - MemberDevice.status: 認証中 -> 未認証
  - 認証中にCPkeyが更新された場合、再ログインを必要とする
- 状態が「凍結中」の場合
  - MemberDevice.status: 変化無し(凍結中のまま)
  - CPkeyが更新されても凍結中の状態は継続
- judgeStatusメソッドに更新後Memberを渡し、状態を更新した上でmemberListシートを更新
- auditLogにCPkey更新を記録
  - `authAuditLog.func` = 'updateCPkey'
  - `authAuditLog.note` = 旧CPkey + ' -> ' + 新CPkey
- CPkeyを更新するのはmemberListシートのみ。インスタンス化された'Member.device'以下は更新しない<br>
  ※ authServer->authClientに送るencryptedResponseの暗号化は旧CPkeyで行い、authClient側ではauthServer側での処理結果を確認の上、新CPkeyへの置換を行うため
- 以下の`authResponse`を返して終了
  - `authResponse.result` = 'normal'
  - `authResponse.request` = 引数で渡された`authRequest`
  - `authResponse.response` = **更新前**の`Member`

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

<!--
## 🧱 decrypt()メソッド
### 📤 入力項目
### 📥 出力項目

```js
new authResponse({
  timestamp: Date.now(),
  result: , // fatal/warning/normal
  message: , // normal時はundefined
  request: undefined, // type:'authRequest',note:'処理要求オブジェクト'
  response: Member, // fatal/warning時は`undefined`
})
-->
<!--
## 🧱 proto()

### 概要

### 📤 入力項目

### 📥 出力項目
-->

