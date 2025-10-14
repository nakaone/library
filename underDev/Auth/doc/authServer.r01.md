以下のauthServer仕様書について、加筆すべき部分の案を出して欲しい
- 概要、入出力項目
- 現時点でソースは不要
- 回答IDを付ける(Ans-20251013-nn)

# authServer 関数 仕様書

## 概要

- authRequest.requestId を短期間保存して重複拒否

## プロパティ(インスタンス変数)

- authConfig, authServerConfig, ScriptPropertiesのメンバを包摂したオブジェクト

## authServer内部で定義されるクラス

### class Properties

- ScriptPropertiesに保存される`authScriptProperties`のCRUDを担当

### class Member

ChatGPTへ：これは別途'Member.md'として依頼予定なので割愛

## メイン処理、メソッド

### メイン処理

- 引数無しの場合はsetupEnvironmentを呼び出して環境整備
- decryptRequestで復号
- 復号できた場合、memberId[deviceId]を元に状態取得、以下のように分岐
	| No | 状態 | 要求内容 | 呼出メソッド |
  | --: | :-- | :-- | :-- |
	| 1 | 未加入 | 加入要求 | membershipRequest() |
	| 2 | 審査中 | 加入審査結果問合せ | examinationResultInquiry() |
	| 3 | 加入中 | — | — |
	| 4 | 未ログイン | ログイン要求 | logInRequest() |
	| 5 | ログイン試行中 | 入力されたパスコードの通知 | loginTrial() |
	| 6 | ログイン中 | サーバ側関数の呼び出し | callFunction() |
	| 7 | ログイン期限切れ | ログイン要求 | logInRequest() |
	| 8 | 凍結中 | 呼出先関数が無権限実行可なら呼び出し、それ以外は不可 | — |
	| 9 | 加入期限切れ | 呼出先関数が無権限実行可なら呼び出し、それ以外は不可 | — |
- 復号できなかった場合はCPkeyと推定、公開鍵の形式チェックの上、OKならCPkeyで暗号化したSPkeyを返す
- authServerのメソッド・サーバ側関数共、戻り値としてErrorが帰ってきた場合は何も返さない
- 呼出先からの戻り値がError以外の場合、authResponse形式に変換してauthClientに返す

### setupEnvironment() : 実行環境整備

- memberListが無ければシートを作成
- ScriptPropertiesの作成
- sendMailやシートへのアクセス等、GASでの権限承認が必要な処理をダミーで動かし、必要な権限を一括承認

### responseSPkey() : クライアント側にSPkeyを提供

- 引数argはdecryptRequestで復号できなかった、authClientから渡された文字列
- CPkeyと推定して公開鍵の形式を満たすかチェック

```js
/**
 * @param {string} arg
 * @returns {string|Error} チェックOKならCPkeyで暗号化されたSPkey、NGならErrorを返す
 */
```

### membershipRequest() : 加入要求時処理

- クライアント側からの加入要求を受け、memberListにmemberId,CPkeyを記録
- 加入要求があったことをadminに連絡するため、メール送信

```js
/**
 * @param {string} memberId
 * @param {string} CPkey
 * @returns {null|Error}
 */
```

### notifyAcceptance() : 加入要求の結果連絡

- スプレッドシートのメニュー「加入登録の結果連絡」として使用
- memberList.reportResultが空欄のメンバに対して加入可否検討結果をメールで送信

### examinationResultInquiry() : 加入審査結果問合せへの回答

- 戻り値はアカウント有効期限・CPkey有効期限
  ```js
  authResponse.response = `{
    expireAccount: memberList.CPkeyUpdated + authConfig.decryptRequest.loginLifeTime,
    expireCPkey: memberList.expire,
  }
  ```

```js
/**
 * @param {string} memberId
 * @returns {Object|Error}
 */
```

### loginTrial() : クライアントからのログイン要求に基づくログイン可否判断

- memberIdを元にmemberListから当該メンバの情報を取得
- trial欄の

- memberIdを元に[MemberTrialクラス](class.MemberTrial.md)をインスタンス化(仮に`const atObj = new MemberTrial({memberId:memberId})`とする)。
- 


```js
/**
 * @param {string} memberId
 */
```

### inCaseOfWarning() : 復号時warningだった場合の処理

| **⑧ アカウント有効性確認** | 承認済・有効期間内か | 期限切れ → `warning` |
| **⑨ 署名有効期限確認** | `CPkey` の有効期限をチェック | 切れ → `warning` + 更新誘導 |
| **⑩ セッション状態確認** | ログイン済みか・有効期間内か確認 | 未ログイン → `MemberTrial()` 実行 |

### callFunction() : サーバ側関数の呼び出し