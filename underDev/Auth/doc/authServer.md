# authServer 関数 仕様書（改訂版）

## 🧭 概要

authServerは、クライアント（authClient）からの暗号化通信リクエストを復号・検証し、
メンバ状態と要求内容に応じてサーバ側処理を適切に振り分ける中核関数です。

### 主な責務
1. 暗号化リクエストの復号・署名検証（decryptRequest）
2. 重複リクエスト防止（requestIdの短期キャッシュ）
3. メンバ状態管理（Memberクラス連携）
4. サーバ関数実行およびレスポンスの暗号化返却

### セキュリティ要件
- requestIdの再利用禁止
- CPkey/SPkeyペアの有効期限管理
- 署名検証の失敗時は即座に処理中断

### 通信形式
- クライアント→サーバ: JSON文字列をRSA-OAEP暗号化＋署名付与
- サーバ→クライアント: authResponse(JSON)をクライアントCPkeyで暗号化

---

## 📤 入力項目（authClient → authServer）

| 項目名 | 型 | 必須 | 説明 |
| :-- | :-- | :-- | :-- |
| requestId | string | ○ | リクエスト一意識別子。再送防止用。 |
| ciphertext | string | ○ | 暗号化済みのリクエストデータ。 |
| signature | string | ○ | クライアント秘密鍵で署名した署名文字列。 |
| memberId | string | ○ | メンバの識別子（メールアドレス）。 |
| deviceId | string | ○ | デバイスの識別子。 |
| timestamp | number | ○ | クライアント送信時のUNIX時刻。リプレイ攻撃防止。 |

---

## 📥 出力項目（authServer → authClient）

| 項目名 | 型 | 説明 |
| :-- | :-- | :-- |
| result | "success" / "warning" / "error" | 処理結果のステータス |
| message | string | 補足メッセージ（ユーザ通知やデバッグ用） |
| response | any | 呼出先関数の戻り値（暗号化済みJSON文字列） |
| requestId | string | 対応するリクエストID（照合用） |

---

## 🧩 内部構成

### 内部依存クラス・モジュール

| クラス / モジュール | 主な責務 |
| :-- | :-- |
| Properties | ScriptPropertiesのCRUDを抽象化。キーprefix管理とTTL管理を行う。 |
| Member | メンバ状態判定・更新処理。スプレッドシート行の読み書きを担当。 |
| authTrial | ログイン試行情報の履歴管理・失敗回数制御。 |
| decryptRequest() | リクエスト復号・署名検証。authResponseのベース生成。 |
| encryptResponse() | クライアントのCPkeyを用いた応答暗号化。 |

---

## 🔄 状態遷移と呼出マップ

| No | 状態 | 要求内容 | 呼出メソッド |
| --: | :-- | :-- | :-- |
| 1 | 未加入 | 加入要求 | membershipRequest() |
| 2 | 審査中 | 加入審査結果問合せ | examinationResultInquiry() |
| 3 | 加入中 | — | — |
| 4 | 未ログイン | ログイン要求 | logInRequest() |
| 5 | ログイン試行中 | 入力されたパスコードの通知 | loginTrial() |
| 6 | ログイン中 | サーバ側関数の呼び出し | callFunction() |
| 7 | ログイン期限切れ | ログイン要求 | logInRequest() |
| 8 | 凍結中 | 無権限実行可関数なら呼出 | — |
| 9 | 加入期限切れ | 無権限実行可関数なら呼出 | — |

> 状態判定は Member クラスの getStatus() で取得。
> 状態遷移後、必要に応じて Member.updateStatus() を呼び出してmemberListを更新。
> 状態名は「未加入」「審査中」「加入中」「未ログイン」「ログイン中」など Member.md に準拠。

---

## 🧱 メソッド概要

### setupEnvironment()
- 初期環境の整備を行う。GAS初回実行時の権限確認処理も含む。

### responseSPkey(arg)
- クライアントから送られた文字列がCPkeyと推定される場合に、SPkeyを暗号化して返却。

### membershipRequest(memberId, CPkey)
- 新規メンバ加入要求を登録。管理者へメール通知。

### notifyAcceptance()
- 加入結果を通知。未通知のメンバのみ対象。

### examinationResultInquiry(memberId)
- 審査結果を返却。CPkey有効期限や加入期限を含む。

### loginTrial(memberId)
- ログイン要求を処理し、試行結果をauthTrialに記録。

### inCaseOfWarning()
- 各種期限切れなどの警告を分類し、適切なレスポンス生成。

### callFunction()
- authServerConfig.funcを参照し、該当関数を実行。

---

## ⏰ メンテナンス処理

- 定期トリガーで呼び出される `maintenance()` にて以下を実施:
  - CPkey有効期限切れの検出と更新通知
  - 凍結解除日時到来の解除処理
  - 加入期限切れメンバの無効化

---

## 🔐 セキュリティ仕様

| 項目 | 内容 |
| :-- | :-- |
| リプレイ防止 | requestIdの一時保存（TTL 5分） |
| タイミング攻撃対策 | 定数時間比較関数 compareConstantTime(a,b) を使用 |
| 鍵管理 | CPkey: memberList.device[].CPkey に保存。<br>SPkey: ScriptProperties内のみ保持。 |
| 署名方式 | RSA-PSS（SHA-256） |
| 暗号化方式 | RSA-OAEP（SHA-256） |
| 有効期限 | CPkey: 30分〜1時間、SPkey: 1日 |

---

## 🧾 エラーハンドリング仕様

| 種別 | 内容 | authResponse.result | 備考 |
| :-- | :-- | :-- | :-- |
| ValidationError | 不正な入力・形式エラー | "error" | messageに入力箇所を示す |
| AuthError | 認証失敗・署名不一致 | "error" | 再試行不可 |
| ExpireWarning | 鍵またはアカウント期限切れ | "warning" | 更新誘導付き応答 |
| SystemError | 内部例外・想定外エラー | "error" | ログ送信＋空応答返却 |

---

## 🗒️ ログ出力仕様

| 種別 | 保存先 | 内容 |
| :-- | :-- | :-- |
| requestLog | ScriptProperties (TTL短期) | requestId, memberId, timestamp |
| errorLog | Spreadsheetまたはログシート | 発生日時, memberId, errorMessage, stackTrace |
| auditLog | Spreadsheet | 処理種別, 成功／警告／失敗, 対象メンバID |

---

## 💬 改訂要約
> **Ans-20251013-01**  
> authServerは認証通信の中核であるため、「通信仕様」「セキュリティ仕様」「ログ・保守仕様」を明確に区分。  
> 本改訂により、I/O定義・エラーポリシー・定期保守の3章を追加し、クライアント／サーバ間の仕様整合性を確保。
