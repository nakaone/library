<div style="text-align: right;">

[総説](../specification.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>
<style>
  td {white-space:nowrap;}
</style>

# <span id="member">Member クラス仕様書</span>

メンバ情報をGoogle Spread上で管理

- 'Member'はGoogle SpreadSheet上でメンバ(アカウント)情報・状態を一元的に管理するためのクラスです。
- 加入・ログイン・パスコード試行・デバイス別公開鍵(CPkey)管理などの状態を統一的に扱います。
- マルチデバイス利用を前提とし、memberListスプレッドシートの1行を1メンバとして管理します。

## <span id="member_summary">🧭 Member クラス 概要</span>

- 参考：auth総説 [メンバの状態遷移](../specification.md#member)

## <span id="member_members">🔢 Member メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | UUID | メンバの識別子 | メールアドレス |
| name | string | "dummy" | メンバの氏名 |  |
| status | string | "未加入" | メンバの状態 | 未加入,未審査,審査済,加入中,加入禁止 |
| log | MemberLog | new MemberLog() | メンバの履歴情報 | シート上はJSON文字列 |
| profile | MemberProfile | new MemberProfile() | メンバの属性情報 | シート上はJSON文字列 |
| device | [MemberDevice](MemberDevice.md#memberdevice_internal)[] | 空配列 | デバイス情報 | マルチデバイス対応のため配列。シート上はJSON文字列 |
| note | string | 空文字列 | 当該メンバに対する備考 |  |

## <span id="member_methods">🧱 Member メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#member_constructor) | private | コンストラクタ |  |
| [addTrial()](#member_addtrial) | public | 新しい試行を登録し、メンバにパスコード通知メールを発信 |  |
| [checkPasscode()](#member_checkpasscode) | public | 認証時のパスコードチェック | 入力されたパスコードをチェック、Member内部の各種メンバの値を更新 |
| [getMember()](#member_getmember) | public | 指定メンバの情報をmemberListシートから取得 |  |
| [judgeMember()](#member_judgemember) | static | 加入審査画面から審査結果入力＋結果通知 | 加入審査画面を呼び出し、管理者が記入した結果をmemberListに登録、審査結果をメンバに通知する。<br>memberListシートのGoogle Spreadのメニューから管理者が実行することを想定。 |
| [judgeStatus()](#member_judgestatus) | public | 指定メンバ・デバイスの状態を[状態決定表](../specification.md#member)により判定 |  |
| [reissuePasscode()](#member_reissuepasscode) | public | パスコードを再発行する |  |
| [removeMember()](#member_removemember) | static | 登録中メンバをアカウント削除、または加入禁止にする | memberListシートのGoogle Spreadのメニューから管理者が実行することを想定 |
| [restoreMember()](#member_restoremember) | static | 加入禁止(論理削除)されているメンバを復活させる | memberListシートのGoogle Spreadのメニューから管理者が実行することを想定 |
| [setMember()](#member_setmember) | public | 指定メンバ情報をmemberListシートに保存 | 登録済メンバの場合は更新、未登録の場合は新規登録(追加)を行う |
| [unfreeze()](#member_unfreeze) | static | 指定されたメンバ・デバイスの「凍結中」状態を強制的に解除 | 引数でmemberIdが指定されなかった場合、**凍結中デバイス一覧の要求**と看做す<br>deviceIdの指定が無い場合、memberIdが使用する凍結中デバイス全てを対象とする<br>memberListシートのGoogle Spreadのメニューから管理者が実行することを想定 |
| [updateCPkey()](#member_updatecpkey) | public | 対象メンバ・デバイスの公開鍵を更新 |  |

### <span id="member_constructor"><a href="#member_methods">🧱 Member.constructor()</a></span>

#### <span id="member_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | [authServerConfig](authServerConfig.md#authserverconfig_members) | <span style="color:red">必須</span> | ユーザ指定の設定値 |  |

#### <span id="member_constructor_process">🧾 処理手順</span>

- [memberList](authServerConfig.md#authserverconfig_members)シートが存在しなければシートを新規作成
  - シート上の項目名はMemberクラスのメンバ名
  - 各項目の「説明」を項目名セルのメモとしてセット
- this.log = new [MemberLog()](MemberLog.md#memberlog_constructor)
- this.profile = new [MemberProfile()](MemberProfile.md#memberprofile_constructor)

#### <span id="member_constructor_returns">📤 戻り値</span>

- [Member](#member_members)インスタンス
### <span id="member_addtrial"><a href="#member_methods">🧱 Member.addTrial()</a></span>

#### <span id="member_addtrial_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | [authRequest](authRequest.md#authrequest_members) | <span style="color:red">必須</span> | 処理要求 |  |

#### <span id="member_addtrial_process">🧾 処理手順</span>

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

#### <span id="member_addtrial_returns">📤 戻り値</span>

- [authResponse](authResponse.md#authresponse_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 | 不適格 | 正常終了 |
  | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
  | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス | — | — |
  | deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 | UUID | — | — |
  | CPkey | string | <span style="color:red">必須</span> | クライアント側署名 |  | — | — |
  | requestId | string | <span style="color:red">必須</span> | 要求の識別子 | UUID | — | — |
  | requestTime | number | <span style="color:red">必須</span> | 要求日時 | UNIX時刻 | — | — |
  | func | string | <span style="color:red">必須</span> | サーバ側関数名 |  | — | — |
  | arguments | any[] | <span style="color:red">必須</span> | サーバ側関数に渡す引数の配列 |  | — | — |
  | SPkey | string | SPkey | サーバ側公開鍵 |  | — | — |
  | response | any | null | サーバ側関数の戻り値 | Errorオブジェクトを含む | **Member(更新前)** | **Member(更新後)** |
  | receptTime | number | Date.now() | サーバ側の処理要求受付日時 |  | — | — |
  | responseTime | number | 0 | サーバ側処理終了日時 | エラーの場合は発生日時 | — | — |
  | status | string | "normal" | サーバ側処理結果 | authServerの処理結果。responseとは必ずしも一致しない | **dev.error("invalid status")** | **"success"** |
  | decrypt | string | "normal" | クライアント側での復号処理結果 | "normal":正常、それ以外はエラーメッセージ | — | — |
### <span id="member_checkpasscode"><a href="#member_methods">🧱 Member.checkPasscode()</a></span>

#### <span id="member_checkpasscode_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | [authRequest](authRequest.md#authrequest_members) | <span style="color:red">必須</span> | 処理要求オブジェクト |  |

#### <span id="member_checkpasscode_process">🧾 処理手順</span>

- 引数チェック。"func"が指定以外、またはパスコードの形式不正の場合、戻り値「不正形式」を返して終了
    | 項目名 | データ型 | 要否/既定値 | 説明 | 確認内容 |
    | :-- | :-- | :-- | :-- | :-- |
    | memberId | string | idb.memberId | メンバの識別子 | — |
    | deviceId | string | idb.deviceId | デバイスの識別子 | — |
    | memberName | string | idb.memberName | メンバの氏名 | — |
    | CPkey | string | idb.CPkey | クライアント側署名 | — |
    | requestId | string | UUID | 要求の識別子 | — |
    | requestTime | number | Date.now() | 要求日時 | — |
    | func | string | <span style="color:red">必須</span> | サーバ側関数名 | **"::passcode::"** |
    | arguments | any[] | [] | サーバ側関数に渡す引数の配列 | **入力されたパスコード** |
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
    | 項目名 | データ型 | 要否/既定値 | 説明 | 一致時 | 上限到達 |
    | :-- | :-- | :-- | :-- | :-- | :-- |
    | memberId | string | idb.memberId | メンバの識別子 | — | — |
    | deviceId | string | idb.deviceId | デバイスの識別子 | — | — |
    | memberName | string | idb.memberName | メンバの氏名 | — | — |
    | CPkey | string | idb.CPkey | クライアント側署名 | — | — |
    | requestId | string | UUID | 要求の識別子 | — | — |
    | requestTime | number | Date.now() | 要求日時 | — | — |
    | func | string | <span style="color:red">必須</span> | サーバ側関数名 | — | — |
    | arguments | any[] | [] | サーバ側関数に渡す引数の配列 | — | — |
- 更新後のMemberを引数に[setMemberメソッド](#member_setmember)を呼び出し、memberListシートを更新<br>
  ※ setMember内でjudgeStatusメソッドを呼び出しているので、状態の最新化は担保
- 戻り値「正常終了」を返して終了(後続処理は戻り値(authResponse.message)で分岐先処理を判断)

#### <span id="member_checkpasscode_returns">📤 戻り値</span>

- [authResponse](authResponse.md#authresponse_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 | 不正形式 | 非試行中 | 正常終了 |
  | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
  | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス | — | — | — |
  | deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 | UUID | — | — | — |
  | CPkey | string | <span style="color:red">必須</span> | クライアント側署名 |  | — | — | — |
  | requestId | string | <span style="color:red">必須</span> | 要求の識別子 | UUID | — | — | — |
  | requestTime | number | <span style="color:red">必須</span> | 要求日時 | UNIX時刻 | — | — | — |
  | func | string | <span style="color:red">必須</span> | サーバ側関数名 |  | — | — | — |
  | arguments | any[] | <span style="color:red">必須</span> | サーバ側関数に渡す引数の配列 |  | — | — | — |
  | SPkey | string | SPkey | サーバ側公開鍵 |  | — | — | — |
  | response | any | null | サーバ側関数の戻り値 | Errorオブジェクトを含む | — | — | **更新後のMember** |
  | receptTime | number | Date.now() | サーバ側の処理要求受付日時 |  | — | — | — |
  | responseTime | number | 0 | サーバ側処理終了日時 | エラーの場合は発生日時 | — | — | — |
  | status | string | "normal" | サーバ側処理結果 | authServerの処理結果。responseとは必ずしも一致しない | **dev.error("invalid request")** | **dev.error("invalid status")** | **"success"** |
  | decrypt | string | "normal" | クライアント側での復号処理結果 | "normal":正常、それ以外はエラーメッセージ | — | — | — |
### <span id="member_getmember"><a href="#member_methods">🧱 Member.getMember()</a></span>

#### <span id="member_getmember_referrer">📞 呼出元</span>

- [cryptoServer.decrypt](cryptoServer.md#cryptoServer_members)

#### <span id="member_getmember_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | <span style="color:red">必須</span> | ユーザ識別子(メールアドレス) |  |

#### <span id="member_getmember_process">🧾 処理手順</span>

- JSON文字列の項目はオブジェクト化(Member.log, Member.profile, Member.device)
- memberIdがmemberListシート登録済なら「登録済」、未登録なら「未登録」パターンを返す

#### <span id="member_getmember_returns">📤 戻り値</span>

- [authResponse](authResponse.md#authresponse_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 | 登録済 | 未登録 |
  | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
  | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス | — | — |
  | deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 | UUID | — | — |
  | CPkey | string | <span style="color:red">必須</span> | クライアント側署名 |  | — | — |
  | requestId | string | <span style="color:red">必須</span> | 要求の識別子 | UUID | — | — |
  | requestTime | number | <span style="color:red">必須</span> | 要求日時 | UNIX時刻 | — | — |
  | func | string | <span style="color:red">必須</span> | サーバ側関数名 |  | — | — |
  | arguments | any[] | <span style="color:red">必須</span> | サーバ側関数に渡す引数の配列 |  | — | — |
  | SPkey | string | SPkey | サーバ側公開鍵 |  | — | — |
  | response | any | null | サーバ側関数の戻り値 | Errorオブジェクトを含む | **Member(シート)** | — |
  | receptTime | number | Date.now() | サーバ側の処理要求受付日時 |  | — | — |
  | responseTime | number | 0 | サーバ側処理終了日時 | エラーの場合は発生日時 | — | — |
  | status | string | "normal" | サーバ側処理結果 | authServerの処理結果。responseとは必ずしも一致しない | **"success"** | **dev.error("not exists")** |
  | decrypt | string | "normal" | クライアント側での復号処理結果 | "normal":正常、それ以外はエラーメッセージ | — | — |
### <span id="member_judgemember"><a href="#member_methods">🧱 Member.judgeMember()</a></span>

#### <span id="member_judgemember_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | <span style="color:red">必須</span> | メンバ識別子 |  |

#### <span id="member_judgemember_process">🧾 処理手順</span>

- [getMemberメソッド](#member_getmember)で当該メンバのMemberを取得
- memberListシート上に存在しないなら、戻り値「不存在」を返して終了
- 状態が「未審査」ではないなら、戻り値「対象外」を返して終了
- シート上にmemberId・氏名と「承認」「否認」「取消」ボタンを備えたダイアログ表示
- 取消が選択されたら戻り値「キャンセル」を返して終了
- MemberLogの以下項目を更新
  
- [setMemberメソッド](#member_setmember)にMemberを渡してmemberListを更新
- 戻り値「正常終了」を返して終了

#### <span id="member_judgemember_returns">📤 戻り値</span>

- [authResponse](authResponse.md#authresponse_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 | 不存在 | 対象外 | キャンセル | 正常終了 |
  | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
  | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス | — | — | — | — |
  | deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 | UUID | — | — | — | — |
  | CPkey | string | <span style="color:red">必須</span> | クライアント側署名 |  | — | — | — | — |
  | requestId | string | <span style="color:red">必須</span> | 要求の識別子 | UUID | — | — | — | — |
  | requestTime | number | <span style="color:red">必須</span> | 要求日時 | UNIX時刻 | — | — | — | — |
  | func | string | <span style="color:red">必須</span> | サーバ側関数名 |  | — | — | — | — |
  | arguments | any[] | <span style="color:red">必須</span> | サーバ側関数に渡す引数の配列 |  | — | — | — | — |
  | SPkey | string | SPkey | サーバ側公開鍵 |  | — | — | — | — |
  | response | any | null | サーバ側関数の戻り値 | Errorオブジェクトを含む | — | **更新前のMember** | **更新前のMember** | **更新<span style="color:red">後</span>のMember** |
  | receptTime | number | Date.now() | サーバ側の処理要求受付日時 |  | — | — | — | — |
  | responseTime | number | 0 | サーバ側処理終了日時 | エラーの場合は発生日時 | — | — | — | — |
  | status | string | "normal" | サーバ側処理結果 | authServerの処理結果。responseとは必ずしも一致しない | **dev.error("not exists")** | **"not unexamined"** | **"examin canceled"** | **"success"** |
  | decrypt | string | "normal" | クライアント側での復号処理結果 | "normal":正常、それ以外はエラーメッセージ | — | — | — | — |
### <span id="member_judgestatus"><a href="#member_methods">🧱 Member.judgeStatus()</a></span>

#### <span id="member_judgestatus_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | [Member](Member.md#member_members)\|string | <span style="color:red">必須</span> | Memberオブジェクトまたはユーザ識別子 |  |

#### <span id="member_judgestatus_process">🧾 処理手順</span>

- 引数がargが文字列(memberId)だった場合[getMemberメソッド](#member_getmember)でMemberを取得、戻り値の"request"にセット
- [状態決定表](../specification.md#member)に基づき、引数で指定されたメンバおよびデバイス全ての状態を判断・更新

#### <span id="member_judgestatus_returns">📤 戻り値</span>

- [authResponse](authResponse.md#authresponse_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 | 正常終了 |
  | :-- | :-- | :-- | :-- | :-- | :-- |
  | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス | — |
  | deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 | UUID | — |
  | CPkey | string | <span style="color:red">必須</span> | クライアント側署名 |  | — |
  | requestId | string | <span style="color:red">必須</span> | 要求の識別子 | UUID | — |
  | requestTime | number | <span style="color:red">必須</span> | 要求日時 | UNIX時刻 | — |
  | func | string | <span style="color:red">必須</span> | サーバ側関数名 |  | — |
  | arguments | any[] | <span style="color:red">必須</span> | サーバ側関数に渡す引数の配列 |  | — |
  | SPkey | string | SPkey | サーバ側公開鍵 |  | — |
  | response | any | null | サーバ側関数の戻り値 | Errorオブジェクトを含む | **Member(更新後)** |
  | receptTime | number | Date.now() | サーバ側の処理要求受付日時 |  | — |
  | responseTime | number | 0 | サーバ側処理終了日時 | エラーの場合は発生日時 | — |
  | status | string | "normal" | サーバ側処理結果 | authServerの処理結果。responseとは必ずしも一致しない | — |
  | decrypt | string | "normal" | クライアント側での復号処理結果 | "normal":正常、それ以外はエラーメッセージ | — |
### <span id="member_reissuepasscode"><a href="#member_methods">🧱 Member.reissuePasscode()</a></span>

#### <span id="member_reissuepasscode_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | [authRequest](authRequest.md#authrequest_members) | <span style="color:red">必須</span> | 処理要求オブジェクト |  |

#### <span id="member_reissuepasscode_process">🧾 処理手順</span>

- 引数チェック。"func"が指定以外の場合、戻り値「不正形式」を返して終了
    | 項目名 | データ型 | 要否/既定値 | 説明 | 確認内容 |
    | :-- | :-- | :-- | :-- | :-- |
    | memberId | string | idb.memberId | メンバの識別子 | — |
    | deviceId | string | idb.deviceId | デバイスの識別子 | — |
    | memberName | string | idb.memberName | メンバの氏名 | — |
    | CPkey | string | idb.CPkey | クライアント側署名 | — |
    | requestId | string | UUID | 要求の識別子 | — |
    | requestTime | number | Date.now() | 要求日時 | — |
    | func | string | <span style="color:red">必須</span> | サーバ側関数名 | **"::reissue::"** |
    | arguments | any[] | [] | サーバ側関数に渡す引数の配列 | — |
- デバイス状態チェック
  - request.memberIdを基に[getMemberメソッド](#member_getmember)でMemberインスタンスを取得
  - request.deviceIdで対象デバイスを特定、「試行中」以外は戻り値「非試行中」を返して終了
- 現在試行中のMemberTrialについて、パスコードを書き換え<br>
  ※ 試行回数他、状態管理変数は書き換えない(MemberDevice.status,MemberTrial.log,MemberLog.loginRequest)
  
- 更新後のMemberを引数に[setMemberメソッド](#member_setmember)を呼び出し、memberListシートを更新<br>
  ※ setMember内でjudgeStatusメソッドを呼び出しているので、状態の最新化は担保
- メンバにパスコード通知メールを発信<br>
  但し[authServerConfig](authServerConfig.md#authserverconfig_members).underDev.sendPasscode === falseなら発信を抑止(∵開発中)
- パスコード再発行を監査ログに記録([authAuditLog.log](authAuditLog.md#authauditlog_log))
    | 項目名 | データ型 | 要否/既定値 | 説明 | 設定内容 |
    | :-- | :-- | :-- | :-- | :-- |
    | timestamp | string | Date.now() | 要求日時 | — |
    | duration | number | <span style="color:red">必須</span> | 処理時間 | — |
    | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | — |
    | deviceId | string | 任意 | デバイスの識別子 | — |
    | func | string | <span style="color:red">必須</span> | サーバ側関数名 | **"reissuePasscode"** |
    | result | string | normal | サーバ側処理結果 | — |
    | note | string | <span style="color:red">必須</span> | 備考 | **旧パスコード -> 新パスコード** |
- 戻り値「正常終了」を返して終了(後続処理は戻り値(authResponse.message)で分岐先処理を判断)

#### <span id="member_reissuepasscode_returns">📤 戻り値</span>

- [authResponse](authResponse.md#authresponse_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 | 不正形式 | 非試行中 | 正常終了 |
  | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
  | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス | — | — | — |
  | deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 | UUID | — | — | — |
  | CPkey | string | <span style="color:red">必須</span> | クライアント側署名 |  | — | — | — |
  | requestId | string | <span style="color:red">必須</span> | 要求の識別子 | UUID | — | — | — |
  | requestTime | number | <span style="color:red">必須</span> | 要求日時 | UNIX時刻 | — | — | — |
  | func | string | <span style="color:red">必須</span> | サーバ側関数名 |  | — | — | — |
  | arguments | any[] | <span style="color:red">必須</span> | サーバ側関数に渡す引数の配列 |  | — | — | — |
  | SPkey | string | SPkey | サーバ側公開鍵 |  | — | — | — |
  | response | any | null | サーバ側関数の戻り値 | Errorオブジェクトを含む | — | — | **更新後のMember** |
  | receptTime | number | Date.now() | サーバ側の処理要求受付日時 |  | — | — | — |
  | responseTime | number | 0 | サーバ側処理終了日時 | エラーの場合は発生日時 | — | — | — |
  | status | string | "normal" | サーバ側処理結果 | authServerの処理結果。responseとは必ずしも一致しない | **dev.error("invalid request")** | **dev.error("invalid status")** | **"success"** |
  | decrypt | string | "normal" | クライアント側での復号処理結果 | "normal":正常、それ以外はエラーメッセージ | — | — | — |
### <span id="member_removemember"><a href="#member_methods">🧱 Member.removeMember()</a></span>

#### <span id="member_removemember_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | <span style="color:red">必須</span> |  | ユーザ識別子 |
| physical | boolean | false |  | 物理削除ならtrue、論理削除ならfalse |

#### <span id="member_removemember_process">🧾 処理手順</span>

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
    | 項目名 | データ型 | 要否/既定値 | 説明 | 物理削除 | 論理削除 |
    | :-- | :-- | :-- | :-- | :-- | :-- |
    | timestamp | string | Date.now() | 要求日時 | — | — |
    | duration | number | <span style="color:red">必須</span> | 処理時間 | Date.now() - start | Date.now() - start |
    | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | this.memberId | this.memberId |
    | deviceId | string | 任意 | デバイスの識別子 | — | — |
    | func | string | <span style="color:red">必須</span> | サーバ側関数名 | **"remove(physical)"** | **"remove(logical)"** |
    | result | string | normal | サーバ側処理結果 | — | — |
    | note | string | <span style="color:red">必須</span> | 備考 | 削除前Member(JSON) | 削除前Member(JSON) |

#### <span id="member_removemember_returns">📤 戻り値</span>

- [authResponse](authResponse.md#authresponse_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 | 物理削除 | 加入禁止 | キャンセル | 論理削除 |
  | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
  | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス | — | — | — | — |
  | deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 | UUID | — | — | — | — |
  | CPkey | string | <span style="color:red">必須</span> | クライアント側署名 |  | — | — | — | — |
  | requestId | string | <span style="color:red">必須</span> | 要求の識別子 | UUID | — | — | — | — |
  | requestTime | number | <span style="color:red">必須</span> | 要求日時 | UNIX時刻 | — | — | — | — |
  | func | string | <span style="color:red">必須</span> | サーバ側関数名 |  | — | — | — | — |
  | arguments | any[] | <span style="color:red">必須</span> | サーバ側関数に渡す引数の配列 |  | — | — | — | — |
  | SPkey | string | SPkey | サーバ側公開鍵 |  | — | — | — | — |
  | response | any | null | サーバ側関数の戻り値 | Errorオブジェクトを含む | — | **更新前のMember** | **更新前のMember** | **更新<span style="color:red">後</span>のMember** |
  | receptTime | number | Date.now() | サーバ側の処理要求受付日時 |  | — | — | — | — |
  | responseTime | number | 0 | サーバ側処理終了日時 | エラーの場合は発生日時 | — | — | — | — |
  | status | string | "normal" | サーバ側処理結果 | authServerの処理結果。responseとは必ずしも一致しない | **"success"** | **"already banned from joining"** | **"logical remove canceled"** | **"success"** |
  | decrypt | string | "normal" | クライアント側での復号処理結果 | "normal":正常、それ以外はエラーメッセージ | — | — | — | — |
### <span id="member_restoremember"><a href="#member_methods">🧱 Member.restoreMember()</a></span>

#### <span id="member_restoremember_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | <span style="color:red">必須</span> | ユーザ識別子 |  |
| examined | boolean | true | 修正内容 | 「(審査済)未認証」にするならtrue、「未審査」にするならfalse。なお未審査にするなら改めて審査登録が必要 |

#### <span id="member_restoremember_process">🧾 処理手順</span>

- [getMemberメソッド](#member_getmember)で当該メンバのMemberを取得
- memberListシート上に存在しないなら、戻り値「不存在」を返して終了
- 状態が「加入禁止」ではないなら、戻り値「対象外」を返して終了
- シート上に確認のダイアログを表示、キャンセルが選択されたら「キャンセル」を返して終了
- Memberの以下項目を更新
  
- [setMember](#member_setmember)にMemberを渡してmemberListを更新
- 戻り値「正常終了」を返して終了

#### <span id="member_restoremember_returns">📤 戻り値</span>

- [authResponse](authResponse.md#authresponse_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 | 不存在 | 対象外 | キャンセル | 正常終了 |
  | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
  | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス | — | — | — | — |
  | deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 | UUID | — | — | — | — |
  | CPkey | string | <span style="color:red">必須</span> | クライアント側署名 |  | — | — | — | — |
  | requestId | string | <span style="color:red">必須</span> | 要求の識別子 | UUID | — | — | — | — |
  | requestTime | number | <span style="color:red">必須</span> | 要求日時 | UNIX時刻 | — | — | — | — |
  | func | string | <span style="color:red">必須</span> | サーバ側関数名 |  | — | — | — | — |
  | arguments | any[] | <span style="color:red">必須</span> | サーバ側関数に渡す引数の配列 |  | — | — | — | — |
  | SPkey | string | SPkey | サーバ側公開鍵 |  | — | — | — | — |
  | response | any | null | サーバ側関数の戻り値 | Errorオブジェクトを含む | — | **更新前のMember** | **更新前のMember** | **更新<span style="color:red">後</span>のMember** |
  | receptTime | number | Date.now() | サーバ側の処理要求受付日時 |  | — | — | — | — |
  | responseTime | number | 0 | サーバ側処理終了日時 | エラーの場合は発生日時 | — | — | — | — |
  | status | string | "normal" | サーバ側処理結果 | authServerの処理結果。responseとは必ずしも一致しない | **dev.error("not exists")** | **"not logically removed"** | **"restore canceled"** | **"success"** |
  | decrypt | string | "normal" | クライアント側での復号処理結果 | "normal":正常、それ以外はエラーメッセージ | — | — | — | — |
### <span id="member_setmember"><a href="#member_methods">🧱 Member.setMember()</a></span>

#### <span id="member_setmember_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | [Member](Member.md#member_members)\|[authRequest](authRequest.md#authrequest_members) | <span style="color:red">必須</span> | 既存メンバ(Member)または新規登録要求 |  |

#### <span id="member_setmember_process">🧾 処理手順</span>

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

#### <span id="member_setmember_returns">📤 戻り値</span>

- [authResponse](authResponse.md#authresponse_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 | ① | ② | ③ | ④ | ⑤ |
  | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
  | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス | — | — | — | — | — |
  | deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 | UUID | — | — | — | — | — |
  | CPkey | string | <span style="color:red">必須</span> | クライアント側署名 |  | — | — | — | — | — |
  | requestId | string | <span style="color:red">必須</span> | 要求の識別子 | UUID | — | — | — | — | — |
  | requestTime | number | <span style="color:red">必須</span> | 要求日時 | UNIX時刻 | — | — | — | — | — |
  | func | string | <span style="color:red">必須</span> | サーバ側関数名 |  | — | — | — | — | — |
  | arguments | any[] | <span style="color:red">必須</span> | サーバ側関数に渡す引数の配列 |  | — | — | — | — | — |
  | SPkey | string | SPkey | サーバ側公開鍵 |  | — | — | — | — | — |
  | response | any | null | サーバ側関数の戻り値 | Errorオブジェクトを含む | — | **Member(更新済)** | — | — | **Member(新規作成)** |
  | receptTime | number | Date.now() | サーバ側の処理要求受付日時 |  | — | — | — | — | — |
  | responseTime | number | 0 | サーバ側処理終了日時 | エラーの場合は発生日時 | — | — | — | — | — |
  | status | string | "normal" | サーバ側処理結果 | authServerの処理結果。responseとは必ずしも一致しない | **dev.error("not exist")** | **"success"** | **dev.error("already exist")** | **dev.error("Invalid registration request")** | **"success"** |
  | decrypt | string | "normal" | クライアント側での復号処理結果 | "normal":正常、それ以外はエラーメッセージ | — | — | — | — | — |
### <span id="member_unfreeze"><a href="#member_methods">🧱 Member.unfreeze()</a></span>

#### <span id="member_unfreeze_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | null |  | メンバ識別子 |
| deviceId | string | 任意 |  | デバイス識別子 |

#### <span id="member_unfreeze_process">🧾 処理手順</span>

- memberListシート全件を読み込み、`[MemberDevice.status](MemberDevice.md#memberdevice_members) === '凍結中'`のデバイス一覧を作成
- memberId無指定(=null)の場合、戻り値「一覧」を返して終了
- 引数で渡されたmemberId, deviceIdがマッチするメンバ・デバイスを検索
- 対象デバイスが存在しない場合、戻り値「該当無し」を返して終了
- 凍結解除：対象デバイスそれぞれについて以下項目を更新
  

  
- [setMemberメソッド](#member_setmember)にMemberを渡してmemberListを更新
- 戻り値「正常終了」を返して終了

#### <span id="member_unfreeze_returns">📤 戻り値</span>

- [authResponse](authResponse.md#authresponse_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 | 一覧 | 該当無し | 正常終了 |
  | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
  | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス | — | — | — |
  | deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 | UUID | — | — | — |
  | CPkey | string | <span style="color:red">必須</span> | クライアント側署名 |  | — | — | — |
  | requestId | string | <span style="color:red">必須</span> | 要求の識別子 | UUID | — | — | — |
  | requestTime | number | <span style="color:red">必須</span> | 要求日時 | UNIX時刻 | — | — | — |
  | func | string | <span style="color:red">必須</span> | サーバ側関数名 |  | — | — | — |
  | arguments | any[] | <span style="color:red">必須</span> | サーバ側関数に渡す引数の配列 |  | — | — | — |
  | SPkey | string | SPkey | サーバ側公開鍵 |  | — | — | — |
  | response | any | null | サーバ側関数の戻り値 | Errorオブジェクトを含む | **MemberDevice.status=="凍結中"とそのMember** | **更新前のMember** | **更新<span style="color:red">後</span>のMember** |
  | receptTime | number | Date.now() | サーバ側の処理要求受付日時 |  | — | — | — |
  | responseTime | number | 0 | サーバ側処理終了日時 | エラーの場合は発生日時 | — | — | — |
  | status | string | "normal" | サーバ側処理結果 | authServerの処理結果。responseとは必ずしも一致しない | **"success"** | **"no frozen devices"** | — |
  | decrypt | string | "normal" | クライアント側での復号処理結果 | "normal":正常、それ以外はエラーメッセージ | — | — | — |
### <span id="member_updatecpkey"><a href="#member_methods">🧱 Member.updateCPkey()</a></span>

#### <span id="member_updatecpkey_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | [authRequest](authRequest.md#authrequest_members) | <span style="color:red">必須</span> |  | 処理要求オブジェクト |

#### <span id="member_updatecpkey_process">🧾 処理手順</span>

- 引数チェック
    | 項目名 | データ型 | 要否/既定値 | 説明 | 確認内容 |
    | :-- | :-- | :-- | :-- | :-- |
    | memberId | string | idb.memberId | メンバの識別子 | — |
    | deviceId | string | idb.deviceId | デバイスの識別子 | — |
    | memberName | string | idb.memberName | メンバの氏名 | — |
    | CPkey | string | idb.CPkey | クライアント側署名 | — |
    | requestId | string | UUID | 要求の識別子 | — |
    | requestTime | number | Date.now() | 要求日時 | — |
    | func | string | <span style="color:red">必須</span> | サーバ側関数名 | **"::updateCPkey::"** |
    | arguments | any[] | [] | サーバ側関数に渡す引数の配列 | **更新後CPkey** |
  - 更新後CPkeyがRSAの公開鍵形式か(PEMフォーマットなど)チェック、不適合なら戻り値「鍵形式不正」を返して終了
- メンバの状態チェック
  - request.memberIdを基に[getMemberメソッド](#member_getmember)を実行
  - メンバの状態が「不使用("result === fatal")」だった場合、[getMemberの戻り値](#member_getmember_returns)をそのまま戻り値として返して終了
  - **取得したMemberインスタンスをupdateCPkey内部のみのローカル変数**に格納。以下操作はローカル変数のMemberに対して行う。
- デバイス存否チェック<br>
  request.deviceId(=現在登録済のCPkey)で対象デバイスを特定。特定不能なら戻り値「機器未登録」を返して終了
- 管理情報の書き換え
  - CPkeyは書き換え
    
  - デバイスの状態は、未認証・凍結中はそのまま、試行中・認証中は未認証に戻す
    
- 更新後のMemberを引数に[setMemberメソッド](#member_setmember)を呼び出し、memberListシートを更新<br>
  ※ setMember内でjudgeStatusメソッドを呼び出しているので、状態の最新化は担保
- **CPkeyを更新するのはmemberListシートのみ**。インスタンス化された'Member.device'以下は更新しない<br>
  ※ authServer->authClientに送るencryptedResponseの暗号化は旧CPkeyで行い、authClient側ではauthServer側での処理結果を確認の上、新CPkeyへの置換を行うため
- CPkey更新を監査ログに記録([authAuditLog.log](authAuditLog.md#authauditlog_log))
    | 項目名 | データ型 | 要否/既定値 | 説明 | 設定内容 |
    | :-- | :-- | :-- | :-- | :-- |
    | timestamp | string | Date.now() | 要求日時 | — |
    | duration | number | <span style="color:red">必須</span> | 処理時間 | — |
    | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | — |
    | deviceId | string | 任意 | デバイスの識別子 | — |
    | func | string | <span style="color:red">必須</span> | サーバ側関数名 | **"updateCPkey"** |
    | result | string | normal | サーバ側処理結果 | — |
    | note | string | <span style="color:red">必須</span> | 備考 | **旧CPkey -> 新CPkey** |
- 戻り値「正常終了」を返して終了(後続処理は戻り値(authResponse.message)で分岐先処理を判断)

#### <span id="member_updatecpkey_returns">📤 戻り値</span>

- [authResponse](authResponse.md#authresponse_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 | 鍵形式不正 | 機器未登録 | 正常終了 |
  | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
  | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス | — | — | — |
  | deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 | UUID | — | — | — |
  | CPkey | string | <span style="color:red">必須</span> | クライアント側署名 |  | — | — | — |
  | requestId | string | <span style="color:red">必須</span> | 要求の識別子 | UUID | — | — | — |
  | requestTime | number | <span style="color:red">必須</span> | 要求日時 | UNIX時刻 | — | — | — |
  | func | string | <span style="color:red">必須</span> | サーバ側関数名 |  | — | — | — |
  | arguments | any[] | <span style="color:red">必須</span> | サーバ側関数に渡す引数の配列 |  | — | — | — |
  | SPkey | string | SPkey | サーバ側公開鍵 |  | — | — | — |
  | response | any | null | サーバ側関数の戻り値 | Errorオブジェクトを含む | — | — | **更新<span style="color:red">前</span>のMember** |
  | receptTime | number | Date.now() | サーバ側の処理要求受付日時 |  | — | — | — |
  | responseTime | number | 0 | サーバ側処理終了日時 | エラーの場合は発生日時 | — | — | — |
  | status | string | "normal" | サーバ側処理結果 | authServerの処理結果。responseとは必ずしも一致しない | **dev.error("invalid public key")** | **dev.error("no matching key")** | **"success"** |
  | decrypt | string | "normal" | クライアント側での復号処理結果 | "normal":正常、それ以外はエラーメッセージ | — | — | — |