<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="member">Member クラス仕様書</span>

<div style="text-align:right">

[状態遷移図](#member_policy_statediagram) | [状態一覧](#member_policy_statelist) | [状態決定表](#member_policy_decisiontable) | [メンバ一覧](#member_internal) | [メソッド一覧](#member_method)

</div>

## <span id="member_summary">🧭 概要</span>

メンバ一覧シートに対応したメンバ単位の管理情報

- 'Member'はGoogle SpreadSheet上でメンバ(アカウント)情報・状態を一元的に管理するためのクラスです。
- 加入・ログイン・パスコード試行・デバイス別公開鍵(CPkey)管理などの状態を統一的に扱います。
- マルチデバイス利用を前提とし、memberListスプレッドシートの1行を1メンバとして管理します。

### <span id="member_policy">設計方針</span>

- [クラス図](classes.md#member_classdiagram)

#### <span id="member_policy_statediagram">状態遷移図</span>

```mermaid
%% メンバ状態遷移図

stateDiagram-v2
  [*] --> 不使用
  不使用 --> 未加入 : 処理要求
  不使用 --> 未審査 : 処理要求
  不使用 --> 加入禁止 : 処理要求
  不使用 --> 加入中 : 処理要求
  未加入 --> 未審査 : 加入要求
  未審査 --> 加入中 : 加入承認
  加入中 --> 未審査 : 加入失効
  未審査 --> 加入禁止: 加入否認
  加入禁止 --> 未審査 : 加入解禁
  state 加入中 {
    [*] --> 未認証
    未認証 --> 試行中 : 認証要求
    試行中 --> 未認証 : CPkey更新
    試行中 --> 認証中 : 認証成功
    試行中 --> 試行中 : 再試行
    認証中 --> 未認証 : 認証失効 or CPkey更新
    試行中 --> 凍結中 : 認証失敗
    凍結中 --> 凍結中 : CPkey更新
    凍結中 --> 未認証 : 凍結解除
  }
```

#### <span id="member_policy_statelist">状態一覧</span>

| No | 状態 | 説明 | SPkey | CPkey | memberId/メンバ名 | 無権限関数 | 要権限関数 |
| --: | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | 不使用 | Auth不使用のコンテンツのみ表示 | 未取得 | 未生成(※1) | 未登録(※1) | 実行不可 | 実行不可 |
| 2 | 未加入 | memberListにUUIDのmemberId/メンバ名で仮登録 | 取得済 | 生成済 | 仮登録(UUID) | 実行可 | 実行不可 |
| 3 | 未審査 | memberListに本来のmemberId/メンバ名で登録済だが管理者による加入認否が未決定 | 取得済 | 生成済 | 本登録 | 実行可 | 実行不可 |
| 4 | 加入中 | 管理者により加入が承認された状態 | 取得済 | 生成済 | 本登録 | 実行可 | 実行不可 |
| 4.1 | 未認証 | 未認証(未ログイン)で権限が必要な処理は行えない状態 | 取得済 | 生成済 | 本登録 | 実行可 | 実行不可 |
| 4.2 | 試行中 | パスコードによる認証を試行している状態 | 取得済 | 生成済 | 本登録 | 実行可 | 実行不可 |
| 4.3 | 認証中 | 認証が通り、ログインして認証が必要な処理も行える状態 | 取得済 | 生成済 | 本登録 | 実行可 | 実行可 |
| 4.4 | 凍結中 | 規定の試行回数連続して認証に失敗し、再認証要求が禁止された状態 | 取得済 | 生成済 | 本登録 | 実行可 | 実行不可 |
| 5 | 加入禁止 | 管理者により加入が否認された状態 | 取得済 | 生成済 | 本登録 | 実行可 | 実行不可 |

#### <span id="member_policy_decisiontable">状態決定表</span>

| ①シート | ②memberId | ③加入禁止 | ④未審査 | **メンバ状態** | ⑤認証中 | ⑥凍結中 | ⑦未認証 | **デバイス状態** |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| 未登録 | — | — | — | **不使用** |  |  |  |  |
| 登録済 | UUID | — | — | **未加入** |  |  |  |  |
| 登録済 | e-mail | 該当 | — | **加入禁止** |  |  |  |  |
| 登録済 | e-mail | 非該当 | 該当 | **未審査** |  |  |  |  |
| 登録済 | e-mail | 非該当 | 非該当 | **加入中** | 該当 | — | — | **認証中** |
|  |  |  |  | **加入中** | 非該当 | 該当 | — | **凍結中** |
|  |  |  |  | **加入中** | 非該当 | 非該当 | 該当 | **未認証** |
|  |  |  |  | **加入中** | 非該当 | 非該当 | 非該当 | **試行中** |

※下表内の変数名はMemberLogのメンバ名

- ①シート：memberListシートに登録されているか
- ②memberId：メンバ識別子(文字列)の形式
- ③加入禁止：加入禁止されている<br>
  `0 < denial && Date.now() <= unfreezeDenial`
- ④未審査：管理者の認否が未決定<br>
  `approval === 0 && denial === 0`
- ⑤認証中：パスコード認証に成功し認証有効期間内<br>
  `0 < approval && Date.now() ≦ loginExpiration`
- ⑥凍結中：凍結期間内<br>
  `0 < approval && 0 < loginFailure && loginFailure < Date.now() && Date.now() <= unfreezeLogin`
- ⑦未認証：加入承認後認証要求されたことが無い<br>
  `0 < approval && loginRequest === 0`

### 🧩 <span id="member_internal">内部構成</span>

🔢 Member メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| memberId | ⭕ | string | UUID | メンバの識別子 | メールアドレス | 
| name | ⭕ | string | "dummy" | メンバの氏名 |  | 
| status | ⭕ | string | "未加入" | メンバの状態 | 未加入,未審査,審査済,加入中,加入禁止 | 
| log | ⭕ | [MemberLog](MemberLog.md#memberlog_internal) | new MemberLog() | メンバの履歴情報 | シート上はJSON文字列 | 
| profile | ⭕ | [MemberProfile](MemberProfile.md#memberprofile_internal) | new MemberProfile() | メンバの属性情報 | シート上はJSON文字列 | 
| device | ⭕ | [MemberDevice](MemberDevice.md#memberdevice_internal)[] | 空配列 | デバイス情報 | マルチデバイス対応のため配列。シート上はJSON文字列 | 
| note | ⭕ | string | 空文字列 | 当該メンバに対する備考 |  | 


🧱 <span id="member_method">Member メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#member_constructor) | private | コンストラクタ |
| [addTrial](#member_addtrial) | public | 新しい試行を登録し、メンバにパスコード通知メールを発信 |
| [checkPasscode](#member_checkpasscode) | public | 認証時のパスコードチェック |
| [getMember](#member_getmember) | public | 指定メンバの情報をmemberListシートから取得 |
| [judgeMember](#member_judgemember) | static | 加入審査画面から審査結果入力＋結果通知 |
| [judgeStatus](#member_judgestatus) | public | 指定メンバ・デバイスの状態を[状態決定表](#member_policy_decisiontable)により判定 |
| [reissuePasscode](#member_reissuepasscode) | public | パスコードを再発行する |
| [removeMember](#member_removemember) | static | 登録中メンバをアカウント削除、または加入禁止にする |
| [restoreMember](#member_restoremember) | static | 加入禁止(論理削除)されているメンバを復活させる |
| [setMember](#member_setmember) | public | 指定メンバ情報をmemberListシートに保存 |
| [unfreeze](#member_unfreeze) | static | 指定されたメンバ・デバイスの「凍結中」状態を強制的に解除 |
| [updateCPkey](#member_updatecpkey) | public | 対象メンバ・デバイスの公開鍵を更新する |

## <span id="member_constructor">🧱 <a href="#member_method">Member.constructor()</a></span>

コンストラクタ

### <span id="member_constructor_caller">📞 呼出元</span>

- [authServer.constructor()](authServer.md#member_constructor)

### <span id="member_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| config | ❌ | [authServerConfig](authServerConfig.md#authserverconfig_internal) | — | ユーザ指定の設定値 | 

### <span id="member_constructor_process">🧾 処理手順</span>

- [authServerConfig.memberList](authServerConfig.md#internal)シートが存在しなければシートを新規作成
  - シート上の項目名はMemberクラスのメンバ名
  - 各項目の「説明」を項目名セルのメモとしてセット
- this.log = new [MemberLog()](MemberLog.md#memberlog_constructor)
- this.profile = new [MemberProfile()](MemberProfile.md#memberprofile_constructor)

### <span id="member_constructor_returns">📤 戻り値</span>

  - [Member](Member.md#member_internal): メンバ一覧シートに対応したメンバ単位の管理情報
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | memberId | string | UUID | — |
    | name | string | "dummy" | — |
    | status | string | "未加入" | — |
    | log | MemberLog | new MemberLog() | — |
    | profile | MemberProfile | new MemberProfile() | — |
    | device | [MemberDevice](MemberDevice.md#memberdevice_internal)[] | 空配列 | — |
    | note | string | 空文字列 | — |

## <span id="member_addtrial">🧱 <a href="#member_method">Member.addTrial()</a></span>

新しい試行を登録し、メンバにパスコード通知メールを発信

### <span id="member_addtrial_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| request | ❌ | [authRequest](authRequest.md#authrequest_internal) | — | 処理要求 | 

### <span id="member_addtrial_process">🧾 処理手順</span>

- 状態チェック
  - request.memberIdを基に[getMemberメソッド](#member_getmember)でMemberインスタンスを取得
  - request.deviceIdで指定されたデバイスの状態が「未認証」でなければ戻り値「不適格」を返して終了
- 新しい試行を生成、Member.trialの先頭に追加<br>
  ("Member.trial.unshift(new [MemberTrial](MemberTrial.md#membertrial_internal)())")
- MemberLog.loginRequestに現在日時(UNIX時刻)を設定
- ログイン試行履歴の最大保持数を超えた場合、古い世代を削除<br>
  (Member.trial.length >= [authServerConfig](authServerConfig.md#authserverconfig_internal).generationMax)
- 更新後のMemberを引数に[setMember](#member_setmember)を呼び出し、memberListシートを更新
- メンバに[sendmail](JSLib.md#sendmail)でパスコード通知メールを発信<br>
  但し[authServerConfig](authServerConfig.md#authserverconfig_internal).underDev.sendPasscode === falseなら発信を抑止(∵開発中)
- 戻り値「正常終了」を返して終了

### <span id="member_addtrial_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 不適格 | 正常終了 |
    | :-- | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — | — |
    | result | string | normal | **"fatal"** | — |
    | message | string | 【任意】 | **"invalid status"** | — |
    | request | authRequest | 【任意】 | 引数"request" | 引数"request" |
    | response | any | 【任意】 | **Member(更新前)** | **Member(更新後)** |

## <span id="member_checkpasscode">🧱 <a href="#member_method">Member.checkPasscode()</a></span>

認証時のパスコードチェック

入力されたパスコードをチェック、Member内部の各種メンバの値を更新の上、チェック結果を返す。

### <span id="member_checkpasscode_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| request | ❌ | [authRequest](authRequest.md#authrequest_internal) | — | 処理要求オブジェクト | 

### <span id="member_checkpasscode_process">🧾 処理手順</span>

- 引数チェック。"func"が指定以外、またはパスコードの形式不正の場合、戻り値「不正形式」を返して終了

  - [authRequest](authRequest.md#authrequest_internal): 暗号化前の処理要求
    | 項目名 | データ型 | 生成時 | 確認内容 |
    | :-- | :-- | :-- | :-- |
    | memberId | string | idb.memberId | — |
    | deviceId | string | idb.deviceId | — |
    | signature | string | idb.CPkey | — |
    | requestId | string | UUID | — |
    | timestamp | number | Date.now() | — |
    | func | string | 【必須】 | **"::passcode::"** |
    | arguments | any[] | 【必須】 | **入力されたパスコード** |
- デバイス状態チェック
  - request.memberIdを基に[getMemberメソッド](#member_getmember)でMemberインスタンスを取得
  - request.deviceIdで対象デバイスを特定、「試行中」以外は戻り値「非試行中」を返して終了
- パスコードをチェック、結果を先頭に追加(Member.trial.unshift(new [MemberTrialLog](MemberTrialLog.md#membertriallog_constructor)()))
- パスコードチェック
  - パスコードが一致 ⇒ 「一致時」をセット
  - パスコードが不一致
    - 試行回数が上限未満(`MemberTrial.log.length < [authServerConfig](authServerConfig.md#authserverconfig_internal).trial.maxTrial`)<br>
      ⇒ 変更すべき項目無し
    - 試行回数が上限以上(`MemberTrial.log.length >= [authServerConfig](authServerConfig.md#authserverconfig_internal).trial.maxTrial`)<br>
      ⇒ 「凍結時」をセット
  - 設定項目と値は以下の通り。

  - [MemberLog](MemberLog.md#memberlog_internal): メンバの各種要求・状態変化の時刻
    | 項目名 | データ型 | 生成時 | 一致時 | 上限到達 |
    | :-- | :-- | :-- | :-- | :-- |
    | joiningRequest | number | Date.new() | — | — |
    | approval | number | 【必須】 | — | — |
    | denial | number | 【必須】 | — | — |
    | loginRequest | number | 【必須】 | — | — |
    | loginSuccess | number | 【必須】 | **現在日時(UNIX時刻)** | — |
    | loginExpiration | number | 【必須】 | **現在日時＋[loginLifeTime](authServerConfig.md#authserverconfig_internal)** | — |
    | loginFailure | number | 【必須】 | — | **現在日時(UNIX時刻)** |
    | unfreezeLogin | number | 【必須】 | — | **現在日時＋[loginFreeze](authServerConfig.md#authserverconfig_internal)** |
    | joiningExpiration | number | 【必須】 | — | — |
    | unfreezeDenial | number | 【必須】 | — | — |
- 更新後のMemberを引数に[setMemberメソッド](#member_setmember)を呼び出し、memberListシートを更新<br>
  ※ setMember内でjudgeStatusメソッドを呼び出しているので、状態の最新化は担保
- 戻り値「正常終了」を返して終了(後続処理は戻り値(authResponse.message)で分岐先処理を判断)

### <span id="member_checkpasscode_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 不正形式 | 非試行中 | 正常終了 |
    | :-- | :-- | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — | — | — |
    | result | string | normal | **"fatal"** | **"fatal"** | — |
    | message | string | 【任意】 | **"invalid request"** | **"invalid status"** | **デバイスの状態(MemberDevice.status)** |
    | request | authRequest | 【任意】 | request | request | request |
    | response | any | 【任意】 | — | — | **更新後のMember** |

## <span id="member_getmember">🧱 <a href="#member_method">Member.getMember()</a></span>

指定メンバの情報をmemberListシートから取得

### <span id="member_getmember_caller">📞 呼出元</span>

- [Member.addTrial()](Member.md#member_getmember)
- [Member.checkPasscode()](Member.md#member_getmember)
- [Member.judgeMember()](Member.md#member_getmember)
- [Member.judgeStatus()](Member.md#member_getmember)
- [Member.reissuePasscode()](Member.md#member_getmember)
- [Member.removeMember()](Member.md#member_getmember)
- [Member.restoreMember()](Member.md#member_getmember)
- [Member.updateCPkey()](Member.md#member_getmember)

### <span id="member_getmember_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| memberId | ❌ | string | — | ユーザ識別子(メールアドレス) | 

### <span id="member_getmember_process">🧾 処理手順</span>

- JSON文字列の項目はオブジェクト化(Member.log, Member.profile, Member.device)
- memberIdがmemberListシート登録済なら「登録済」、未登録なら「未登録」パターンを返す

### <span id="member_getmember_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 登録済 | 未登録 |
    | :-- | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — | — |
    | result | string | normal | **"normal"** | **"fatal"** |
    | message | string | 【任意】 | — | **not exists** |
    | request | authRequest | 【任意】 | {memberId:引数のmemberId} | {memberId:引数のmemberId} |
    | response | any | 【任意】 | **Member(シート)** | — |

## <span id="member_judgemember">🧱 <a href="#member_method">Member.judgeMember()</a></span>

加入審査画面から審査結果入力＋結果通知

- 加入審査画面を呼び出し、管理者が記入した結果をmemberListに登録、審査結果をメンバに通知する。
- memberListシートのGoogle Spreadのメニューから管理者が実行することを想定。

### <span id="member_judgemember_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| memberId | ❌ | string | — | メンバ識別子 | 

### <span id="member_judgemember_process">🧾 処理手順</span>

- [getMemberメソッド](#member_getmember)で当該メンバのMemberを取得
- memberListシート上に存在しないなら、戻り値「不存在」を返して終了
- 状態が「未審査」ではないなら、戻り値「対象外」を返して終了
- シート上にmemberId・氏名と「承認」「否認」「取消」ボタンを備えたダイアログ表示
- 取消が選択されたら戻り値「キャンセル」を返して終了
- MemberLogの以下項目を更新

  - [MemberLog](MemberLog.md#memberlog_internal): メンバの各種要求・状態変化の時刻
    | 項目名 | データ型 | 生成時 | 承認時 | 否認時 |
    | :-- | :-- | :-- | :-- | :-- |
    | joiningRequest | number | Date.new() | — | — |
    | approval | number | 【必須】 | **現在日時(Date.now())** | **0** |
    | denial | number | 【必須】 | **0** | **現在日時** |
    | loginRequest | number | 【必須】 | — | — |
    | loginSuccess | number | 【必須】 | — | — |
    | loginExpiration | number | 【必須】 | — | — |
    | loginFailure | number | 【必須】 | — | — |
    | unfreezeLogin | number | 【必須】 | — | — |
    | joiningExpiration | number | 【必須】 | **現在日時＋[memberLifeTime](authServerConfig.md#authserverconfig_internal)** | **0** |
    | unfreezeDenial | number | 【必須】 | **0** | **現在日時＋[prohibitedToJoin](authServerConfig.md#authserverconfig_internal)** |
- [setMemberメソッド](#member_setmember)にMemberを渡してmemberListを更新
- 戻り値「正常終了」を返して終了

### <span id="member_judgemember_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 不存在 | 対象外 | キャンセル | 正常終了 |
    | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — | — | — | — |
    | result | string | normal | **"fatal"** | **"warning"** | **"warning"** | **"normal"** |
    | message | string | 【任意】 | **"not exists"** | **"not unexamined"** | **"examin canceled"** | — |
    | request | authRequest | 【任意】 | memberId | memberId | memberId | memberId |
    | response | any | 【任意】 | — | **更新前のMember** | **更新前のMember** | **更新<span style="color:red">後</span>のMember** |

## <span id="member_judgestatus">🧱 <a href="#member_method">Member.judgeStatus()</a></span>

指定メンバ・デバイスの状態を[状態決定表](#member_policy_decisiontable)により判定

### <span id="member_judgestatus_caller">📞 呼出元</span>

- [Member.setMember()](Member.md#member_judgestatus)

### <span id="member_judgestatus_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ❌ | [Member](Member.md#member_internal) \| string | — | Memberオブジェクトまたはユーザ識別子 | 

### <span id="member_judgestatus_process">🧾 処理手順</span>

- 引数がargが文字列(memberId)だった場合[getMemberメソッド](#member_getmember)でMemberを取得、戻り値の"request"にセット
- [状態決定表](#member_policy_decisiontable)に基づき、引数で指定されたメンバおよびデバイス全ての状態を判断・更新

### <span id="member_judgestatus_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | **Member(更新前)** |
    | response | any | 【任意】 | **Member(更新後)** |

## <span id="member_reissuepasscode">🧱 <a href="#member_method">Member.reissuePasscode()</a></span>

パスコードを再発行する

### <span id="member_reissuepasscode_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| request | ❌ | [authRequest](authRequest.md#authrequest_internal) | — | 処理要求オブジェクト | 

### <span id="member_reissuepasscode_process">🧾 処理手順</span>

- 引数チェック。"func"が指定以外の場合、戻り値「不正形式」を返して終了

  - [authRequest](authRequest.md#authrequest_internal): 暗号化前の処理要求
    | 項目名 | データ型 | 生成時 | 確認内容 |
    | :-- | :-- | :-- | :-- |
    | memberId | string | idb.memberId | — |
    | deviceId | string | idb.deviceId | — |
    | signature | string | idb.CPkey | — |
    | requestId | string | UUID | — |
    | timestamp | number | Date.now() | — |
    | func | string | 【必須】 | **"::reissue::"** |
    | arguments | any[] | 【必須】 | — |
- デバイス状態チェック
  - request.memberIdを基に[getMemberメソッド](#member_getmember)でMemberインスタンスを取得
  - request.deviceIdで対象デバイスを特定、「試行中」以外は戻り値「非試行中」を返して終了
- 現在試行中のMemberTrialについて、パスコードを書き換え<br>
  ※ 試行回数他、状態管理変数は書き換えない(MemberDevice.status,MemberTrial.log,MemberLog.loginRequest)

  - [MemberTrial](MemberTrial.md#membertrial_internal): ログイン試行情報の管理・判定
    | 項目名 | データ型 | 生成時 | 設定内容 |
    | :-- | :-- | :-- | :-- |
    | passcode | string | 【必須】 | **新パスコード** |
    | created | number | Date.now() | **現在日時** |
    | log | MemberTrialLog[] |  | — |
- 更新後のMemberを引数に[setMemberメソッド](#member_setmember)を呼び出し、memberListシートを更新<br>
  ※ setMember内でjudgeStatusメソッドを呼び出しているので、状態の最新化は担保
- メンバにパスコード通知メールを発信<br>
  但し[authServerConfig](authServerConfig.md#authserverconfig_internal).underDev.sendPasscode === falseなら発信を抑止(∵開発中)
- パスコード再発行を監査ログに記録([authAuditLog.log](authAuditLog.md#authauditlog_log))

  - [authAuditLog](authAuditLog.md#authauditlog_internal): authServerの監査ログ
    | 項目名 | データ型 | 生成時 | 設定内容 |
    | :-- | :-- | :-- | :-- |
    | timestamp | string | Date.now() | — |
    | duration | number | 【必須】 | — |
    | memberId | string | 【必須】 | — |
    | deviceId | string | 【任意】 | — |
    | func | string | 【必須】 | **"reissuePasscode"** |
    | result | string | normal | — |
    | note | string | 【必須】 | **旧パスコード -> 新パスコード** |
- 戻り値「正常終了」を返して終了(後続処理は戻り値(authResponse.message)で分岐先処理を判断)

### <span id="member_reissuepasscode_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 不正形式 | 非試行中 | 正常終了 |
    | :-- | :-- | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — | — | — |
    | result | string | normal | **"fatal"** | **"fatal"** | — |
    | message | string | 【任意】 | **"invalid request"** | **"invalid status"** | — |
    | request | authRequest | 【任意】 | request | request | request |
    | response | any | 【任意】 | — | — | **更新後のMember** |

## <span id="member_removemember">🧱 <a href="#member_method">Member.removeMember()</a></span>

登録中メンバをアカウント削除、または加入禁止にする

- memberListシートのGoogle Spreadのメニューから管理者が実行することを想定

### <span id="member_removemember_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| memberId | ❌ | string | — | ユーザ識別子 | 
| physical | ⭕ | boolean | false | 物理削除ならtrue、論理削除ならfalse | 

### <span id="member_removemember_process">🧾 処理手順</span>

- 処理開始日時を記録("const start = Date.now()")
- [getMember](#member_getmember)で当該メンバのMemberを取得
- 物理削除の場合("physical === true")
  - シート上に確認のダイアログを表示、OKが選択されたら当該メンバの行をmemberListから削除
  - 監査ログに「物理削除」を記録([authAuditLog.log](authAuditLog.md#authauditlog_log))
  - 戻り値「物理削除」を返して終了
- 論理削除の場合("physical === false")
  - 既に「加入禁止」なら戻り値「加入禁止」を返して終了
  - シート上に確認のダイアログを表示、キャンセルが選択されたら戻り値「キャンセル」を返して終了
  - [MemberLog.prohibitJoining](MemberLog.md#memberlog_prohibitjoining)で加入禁止状態に変更
  - [setMember](#member_setmember)にMemberを渡してmemberListを更新
  - 監査ログに「論理削除」を記録([authAuditLog.log](authAuditLog.md#authauditlog_log))
  - 戻り値「論理削除」を返して終了
- 監査ログ出力項目

  - [authAuditLog](authAuditLog.md#authauditlog_internal): authServerの監査ログ
    | 項目名 | データ型 | 生成時 | 物理削除 | 論理削除 |
    | :-- | :-- | :-- | :-- | :-- |
    | timestamp | string | Date.now() | — | — |
    | duration | number | 【必須】 | Date.now() - start | Date.now() - start |
    | memberId | string | 【必須】 | this.memberId | this.memberId |
    | deviceId | string | 【任意】 | — | — |
    | func | string | 【必須】 | **"remove(physical)"** | **"remove(logical)"** |
    | result | string | normal | — | — |
    | note | string | 【必須】 | 削除前Member(JSON) | 削除前Member(JSON) |

### <span id="member_removemember_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 物理削除 | 加入禁止 | キャンセル | 論理削除 |
    | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — | — | — | — |
    | result | string | normal | **"normal"** | **"warning"** | **"warning"** | **"normal"** |
    | message | string | 【任意】 | **"physically removed"** | **"already banned from joining"** | **"logical remove canceled"** | **"logically removed"** |
    | request | authRequest | 【任意】 | {memberId, physical} | {memberId, physical} | {memberId, physical} | {memberId, physical} |
    | response | any | 【任意】 | — | **更新前のMember** | **更新前のMember** | **更新<span style="color:red">後</span>のMember** |

## <span id="member_restoremember">🧱 <a href="#member_method">Member.restoreMember()</a></span>

加入禁止(論理削除)されているメンバを復活させる

memberListシートのGoogle Spreadのメニューから管理者が実行することを想定

### <span id="member_restoremember_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| memberId | ❌ | string | — | ユーザ識別子 | 
| examined | ⭕ | boolean | true | 「(審査済)未認証」にするならtrue、「未審査」にするならfalse。なお未審査にするなら改めて審査登録が必要 | 

### <span id="member_restoremember_process">🧾 処理手順</span>

- [getMemberメソッド](#member_getmember)で当該メンバのMemberを取得
- memberListシート上に存在しないなら、戻り値「不存在」を返して終了
- 状態が「加入禁止」ではないなら、戻り値「対象外」を返して終了
- シート上に確認のダイアログを表示、キャンセルが選択されたら「キャンセル」を返して終了
- Memberの以下項目を更新

  - [MemberLog](MemberLog.md#memberlog_internal): メンバの各種要求・状態変化の時刻
    | 項目名 | データ型 | 生成時 | 更新内容 |
    | :-- | :-- | :-- | :-- |
    | joiningRequest | number | Date.new() | — |
    | approval | number | 【必須】 | **examined === true ? Date.now() : 0** |
    | denial | number | 【必須】 | **0** |
    | loginRequest | number | 【必須】 | — |
    | loginSuccess | number | 【必須】 | — |
    | loginExpiration | number | 【必須】 | — |
    | loginFailure | number | 【必須】 | — |
    | unfreezeLogin | number | 【必須】 | — |
    | joiningExpiration | number | 【必須】 | **現在日時(UNIX時刻)＋authServerConfig.memberLifeTime** |
    | unfreezeDenial | number | 【必須】 | **0** |
- [setMember](#member_setmember)にMemberを渡してmemberListを更新
- 戻り値「正常終了」を返して終了

### <span id="member_restoremember_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 不存在 | 対象外 | キャンセル | 正常終了 |
    | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — | — | — | — |
    | result | string | normal | **"fatal"** | **"warning"** | **"warning"** | **"normal"** |
    | message | string | 【任意】 | **"not exists"** | **"not logically removed"** | **"restore canceled"** | — |
    | request | authRequest | 【任意】 | {memberId, examined} | {memberId, examined} | {memberId, examined} | {memberId, examined} |
    | response | any | 【任意】 | — | **更新前のMember** | **更新前のMember** | **更新<span style="color:red">後</span>のMember** |

## <span id="member_setmember">🧱 <a href="#member_method">Member.setMember()</a></span>

指定メンバ情報をmemberListシートに保存

登録済メンバの場合は更新、未登録の場合は新規登録(追加)を行う

### <span id="member_setmember_caller">📞 呼出元</span>

- [Member.addTrial()](Member.md#member_setmember)
- [Member.checkPasscode()](Member.md#member_setmember)
- [Member.judgeMember()](Member.md#member_setmember)
- [Member.reissuePasscode()](Member.md#member_setmember)
- [Member.removeMember()](Member.md#member_setmember)
- [Member.restoreMember()](Member.md#member_setmember)
- [Member.unfreeze()](Member.md#member_setmember)
- [Member.updateCPkey()](Member.md#member_setmember)

### <span id="member_setmember_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ❌ | [Member](Member.md#member_internal) \| [authRequest](authRequest.md#authrequest_internal) | — | 既存メンバ(Member)または新規登録要求 | 

### <span id="member_setmember_process">🧾 処理手順</span>

いまここ：Member.log/profile/deviceのメソッドにリンクが張られるよう修正
- 引数がMember型の場合、既存メンバの更新と看做して以下の処理を行う
  1. memberListシートに存在しない場合(エラー)、以下の戻り値①を返して終了
  2. [judgeStatus](Member.md#member_judgestatus)でstatusを最新にしておく
  3. JSON文字列の項目は文字列化した上でmemberListシートの該当者を更新(Member.log/profile/device)
  4. 戻り値②を返して終了
- 引数がauthRequestの場合、新規登録要求と看做して以下の処理を行う
  1. memberListシートに存在する場合(エラー)、戻り値③を返して終了
  2. authRequestが新規登録要求か確認
    - 確認項目
      - authRequest.func ==== '::newMember::'
      - authRequest.arguments[0]にメンバの氏名(文字列)が入っている
      - memberId, deviceId, signatureが全て設定されている
    - 確認項目の全条件が満たされ無かった場合(エラー)、戻り値④を返して終了
  3. Memberの新規作成
    - Member.memberId = authRequest.memberId
    - Member.name = authRequest.arguments[0]
    - Member.device = [new MemberDevice](MemberDevice.md#memberdevice_constructor)({deviceId:authRequest.deviceId, CPkey:authRequest.signature})
    - Member.log = [new MemberLog](MemberLog.md#memberlog_constructor)()
    - [judgeStatus](Member.md#member_judgestatus)にMemberを渡し、状態を設定
  4. JSON文字列の項目は文字列化した上でmemberListシートに追加(Member.log/profile/device)
  5. 本番運用中なら加入要請メンバへの通知<br>
    [authServerConfig.underDev.sendInvitation](authServerConfig.md#authserverconfig_internal) === falseなら開発中なので通知しない
  6. 戻り値⑤を返して終了

### <span id="member_setmember_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | ① | ② | ③ | ④ | ⑤ |
    | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — | — | — | — | — |
    | result | string | normal | **"fatal"** | **"normal"** | **"fatal"** | **"fatal"** | **"normal"** |
    | message | string | 【任意】 | **"not exist"** | **"updated"** | **"already exist"** | **"Invalid registration request"** | **"appended"** |
    | request | authRequest | 【任意】 | arg | arg | arg | arg | arg |
    | response | any | 【任意】 | — | **Member(更新済)** | — | — | **Member(新規作成)** |

## <span id="member_unfreeze">🧱 <a href="#member_method">Member.unfreeze()</a></span>

指定されたメンバ・デバイスの「凍結中」状態を強制的に解除

- 引数でmemberIdが指定されなかった場合、**凍結中デバイス一覧の要求**と看做す
- deviceIdの指定が無い場合、memberIdが使用する凍結中デバイス全てを対象とする
- memberListシートのGoogle Spreadのメニューから管理者が実行することを想定

### <span id="member_unfreeze_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| memberId | ⭕ | string | null | メンバ識別子 | 
| deviceId | ⭕ | string | — | デバイス識別子 | 

### <span id="member_unfreeze_process">🧾 処理手順</span>

- memberListシート全件を読み込み、`[MemberDevice.status](MemberDevice.md#memberdevice_internal) === '凍結中'`のデバイス一覧を作成
- memberId無指定(=null)の場合、戻り値「一覧」を返して終了
- 引数で渡されたmemberId, deviceIdがマッチするメンバ・デバイスを検索
- 対象デバイスが存在しない場合、戻り値「該当無し」を返して終了
- 凍結解除：対象デバイスそれぞれについて以下項目を更新

  - [MemberDevice](MemberDevice.md#memberdevice_internal): メンバのデバイス情報
    | 項目名 | データ型 | 生成時 | 更新内容 |
    | :-- | :-- | :-- | :-- |
    | deviceId | string | 【必須】 | — |
    | status | string | 未認証 | **"未認証"** |
    | CPkey | string | 【必須】 | — |
    | CPkeyUpdated | number | Date.now() | — |
    | trial | MemberTrial[] |  | **空配列** |


  - [MemberLog](MemberLog.md#memberlog_internal): メンバの各種要求・状態変化の時刻
    | 項目名 | データ型 | 生成時 | 更新内容 |
    | :-- | :-- | :-- | :-- |
    | joiningRequest | number | Date.new() | — |
    | approval | number | 【必須】 | — |
    | denial | number | 【必須】 | — |
    | loginRequest | number | 【必須】 | — |
    | loginSuccess | number | 【必須】 | — |
    | loginExpiration | number | 【必須】 | — |
    | loginFailure | number | 【必須】 | — |
    | unfreezeLogin | number | 【必須】 | **現在日時** |
    | joiningExpiration | number | 【必須】 | — |
    | unfreezeDenial | number | 【必須】 | — |
- [setMemberメソッド](#member_setmember)にMemberを渡してmemberListを更新
- 戻り値「正常終了」を返して終了

### <span id="member_unfreeze_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 一覧 | 該当無し | 正常終了 |
    | :-- | :-- | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — | — | — |
    | result | string | normal | **"normal"** | **"warning"** | **"normal"** |
    | message | string | 【任意】 | — | **no frozen devices** | **no frozen devices** |
    | request | authRequest | 【任意】 | **list freezing** | **{memberId,deviceId:[引数で渡されたdeviceId]}** | **{memberId,deviceId:[凍結解除したdeviceId]}** |
    | response | any | 【任意】 | **MemberDevice.status=="凍結中"とそのMember** | **更新前のMember** | **更新<span style="color:red">後</span>のMember** |

## <span id="member_updatecpkey">🧱 <a href="#member_method">Member.updateCPkey()</a></span>

対象メンバ・デバイスの公開鍵を更新する

### <span id="member_updatecpkey_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| request | ❌ | [authRequest](authRequest.md#authrequest_internal) | — | 処理要求オブジェクト | 

### <span id="member_updatecpkey_process">🧾 処理手順</span>

- 引数チェック

  - [authRequest](authRequest.md#authrequest_internal): 暗号化前の処理要求
    | 項目名 | データ型 | 生成時 | 確認内容 |
    | :-- | :-- | :-- | :-- |
    | memberId | string | idb.memberId | — |
    | deviceId | string | idb.deviceId | — |
    | signature | string | idb.CPkey | — |
    | requestId | string | UUID | — |
    | timestamp | number | Date.now() | — |
    | func | string | 【必須】 | **"::updateCPkey::"** |
    | arguments | any[] | 【必須】 | **更新後CPkey** |
  - 更新後CPkeyがRSAの公開鍵形式か(PEMフォーマットなど)チェック、不適合なら戻り値「鍵形式不正」を返して終了
- メンバの状態チェック
  - request.memberIdを基に[getMemberメソッド](#member_getmember)を実行
  - メンバの状態が「不使用("result === fatal")」だった場合、[getMemberの戻り値](#member_getmember_returns)をそのまま戻り値として返して終了
  - **取得したMemberインスタンスをupdateCPkey内部のみのローカル変数**に格納。以下操作はローカル変数のMemberに対して行う。
- デバイス存否チェック<br>
  request.deviceId(=現在登録済のCPkey)で対象デバイスを特定。特定不能なら戻り値「機器未登録」を返して終了
- 管理情報の書き換え
  - CPkeyは書き換え

    - [MemberDevice](MemberDevice.md#memberdevice_internal): メンバのデバイス情報
      | 項目名 | データ型 | 生成時 | 更新項目 |
      | :-- | :-- | :-- | :-- |
      | deviceId | string | 【必須】 | — |
      | status | string | 未認証 | — |
      | CPkey | string | 【必須】 | 更新後CPkey |
      | CPkeyUpdated | number | Date.now() | 現在日時 |
      | trial | MemberTrial[] |  | — |
  - デバイスの状態は、未認証・凍結中はそのまま、試行中・認証中は未認証に戻す

    - [MemberLog](MemberLog.md#memberlog_internal): メンバの各種要求・状態変化の時刻
      | 項目名 | データ型 | 生成時 | 未認証 | 試行中 | 認証中 | 凍結中 |
      | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
      | joiningRequest | number | Date.new() | — | — | — | — |
      | approval | number | 【必須】 | — | — | — | — |
      | denial | number | 【必須】 | — | — | — | — |
      | loginRequest | number | 【必須】 | — | **0** | **0** | — |
      | loginSuccess | number | 【必須】 | — | — | — | — |
      | loginExpiration | number | 【必須】 | — | **0** | **0** | — |
      | loginFailure | number | 【必須】 | — | — | — | — |
      | unfreezeLogin | number | 【必須】 | — | — | — | — |
      | joiningExpiration | number | 【必須】 | — | — | — | — |
      | unfreezeDenial | number | 【必須】 | — | — | — | — |
- 更新後のMemberを引数に[setMemberメソッド](#member_setmember)を呼び出し、memberListシートを更新<br>
  ※ setMember内でjudgeStatusメソッドを呼び出しているので、状態の最新化は担保
- **CPkeyを更新するのはmemberListシートのみ**。インスタンス化された'Member.device'以下は更新しない<br>
  ※ authServer->authClientに送るencryptedResponseの暗号化は旧CPkeyで行い、authClient側ではauthServer側での処理結果を確認の上、新CPkeyへの置換を行うため
- CPkey更新を監査ログに記録([authAuditLog.log](authAuditLog.md#authauditlog_log))

  - [authAuditLog](authAuditLog.md#authauditlog_internal): authServerの監査ログ
    | 項目名 | データ型 | 生成時 | 設定内容 |
    | :-- | :-- | :-- | :-- |
    | timestamp | string | Date.now() | — |
    | duration | number | 【必須】 | — |
    | memberId | string | 【必須】 | — |
    | deviceId | string | 【任意】 | — |
    | func | string | 【必須】 | **"updateCPkey"** |
    | result | string | normal | — |
    | note | string | 【必須】 | **旧CPkey -> 新CPkey** |
- 戻り値「正常終了」を返して終了(後続処理は戻り値(authResponse.message)で分岐先処理を判断)

### <span id="member_updatecpkey_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 鍵形式不正 | 機器未登録 | 正常終了 |
    | :-- | :-- | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — | — | — |
    | result | string | normal | **"fatal"** | **"fatal"** | — |
    | message | string | 【任意】 | **"invalid public key"** | **"no matching key"** | — |
    | request | authRequest | 【任意】 | request | request | request |
    | response | any | 【任意】 | — | — | **更新<span style="color:red">前</span>のMember** |