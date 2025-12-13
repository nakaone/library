<style>
  .submenu {  /* MD内のサブメニュー。右寄せ＋文字サイズ小 */
    text-align: right;
    font-size: 0.8rem;
  }
  .nowrap td {white-space:nowrap;} /* 横長な表を横スクロール */
  .nowrap b {background:yellow;}

.popup {color:#084} /* titleに文字列を設定した項目 */
  td {white-space:nowrap;}
</style>
<div style="text-align: right;">

[総説](../specification.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md) | [開発](../dev.md)

</div>

# <span id="membertrial">MemberTrial クラス仕様書</span>

ログイン試行情報の管理・判定

## <span id="membertrial_summary">🧭 MemberTrial クラス 概要</span>

- [メンバ関係状態遷移図](../specification.md#member)
- [デバイス関係状態遷移図](../specification.md#device)
- [Member関係クラス図](Member.md#member_classdiagram)

## <span id="membertrial_members">🔢 MemberTrial メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| passcode | string | <span style="color:red">必須</span> | 設定されているパスコード | 最初の認証試行で作成 |
| created | number | Date.now() | パスコード生成日時 | ≒パスコード通知メール発信日時 |
| log | MemberTrialLog[] | [] | 試行履歴 | 常に最新が先頭(unshift()使用)。保持上限はauthServerConfig.trial.generationMaxに従い、上限超過時は末尾から削除する。 |

## <span id="membertrial_methods">🧱 MemberTrial メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#membertrial_constructor) | private | コンストラクタ |  |
| [loginAttempt()](#membertrial_loginattempt) | public | 入力されたパスコードの判定 |  |

### <span id="membertrial_constructor"><a href="#membertrial_methods">🧱 MemberTrial.constructor()</a></span>

#### <span id="membertrial_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

#### <span id="membertrial_constructor_process">🧾 処理手順</span>

- this.passcode = [authServerConfig.trial.passcodeLength](authServerConfig.md#authserverconfig_internal)で設定された桁数の乱数
- this.created = Date.now()
- this.log = []

#### <span id="membertrial_constructor_returns">📤 戻り値</span>

- [MemberTrial](#membertrial_members)インスタンス
### <span id="membertrial_loginattempt"><a href="#membertrial_methods">🧱 MemberTrial.loginAttempt()</a></span>

#### <span id="membertrial_loginattempt_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | [authRequest](authRequest.md#authrequest_members) | <span style="color:red">必須</span> |  | ユーザが入力したパスコードを含む処理要求 |

#### <span id="membertrial_loginattempt_process">🧾 処理手順</span>

- [MemberTrialLog](MemberTrialLog.md#membertriallog_constructor)を生成、this.logの先頭に保存(unshift())
- `this.log[0].result === true`なら「正答時」を返す
- `this.log[0].result === false`で最大試行回数([maxTrial](authServerConfig.md#authserverconfig_internal))未満なら「誤答・再挑戦可」を返す
- `this.log[0].result === false`で最大試行回数以上なら「誤答・再挑戦不可」を返す
- なお、シートへの保存は呼出元で行う

#### <span id="membertrial_loginattempt_returns">📤 戻り値</span>

- [authResponse](authResponse.md#authresponse_members)

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 | 正答時 | 誤答・再挑戦可 | 誤答・再挑戦不可 |
  | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
  | memberId | string | <span style="color:red">必須</span> | メンバの識別子 | =メールアドレス | — | — | — |
  | deviceId | string | <span style="color:red">必須</span> | デバイスの識別子 | UUIDv4 | — | — | — |
  | memberName | string | <span style="color:red">必須</span> | メンバの氏名 |  | — | — | — |
  | CPkey | string | <span style="color:red">必須</span> | クライアント側署名 |  | — | — | — |
  | requestTime | number | <span style="color:red">必須</span> | 要求日時 | UNIX時刻 | — | — | — |
  | func | string | <span style="color:red">必須</span> | サーバ側関数名 |  | — | — | — |
  | arguments | any[] | <span style="color:red">必須</span> | サーバ側関数に渡す引数の配列 |  | — | — | — |
  | nonce | string | <span style="color:red">必須</span> | 要求の識別子 | UUIDv4 | — | — | — |
  | SPkey | string | SPkey | サーバ側公開鍵 |  | — | — | — |
  | response | any | null | サーバ側関数の戻り値 | Errorオブジェクトを含む | MemberTrialオブジェクト | MemberTrialオブジェクト | MemberTrialオブジェクト |
  | receptTime | number | Date.now() | サーバ側の処理要求受付日時 |  | — | — | — |
  | responseTime | number | 0 | サーバ側処理終了日時 | エラーの場合は発生日時 | — | — | — |
  | status | string | "success" | サーバ側処理結果 | 正常終了時は"success"(文字列)、警告終了の場合はエラーメッセージ、致命的エラーの場合はErrorオブジェクト | **"success"** | **"failed"** | **dev.error("failed")** |
  | message | string | <span style="color:red">必須</span> | メッセージ(statusの補足) |  | — | — | — |
  | decrypt | string | "normal" | クライアント側での復号処理結果 | "success":正常、それ以外はエラーメッセージ | — | — | — |