# auth

## 2025/11/25

### 目標

- 旧版移行：authClientConfig.md
- 旧版移行：authClientKeys.md
- 旧版移行：authConfig.md
- 旧版移行：authErrorLog.md
- 旧版移行：authIndexedDB.md
- 旧版移行：authRequest.md
- 旧版移行：authRequestLog.md
- 旧版移行：authResponse.md
- 旧版移行：authScriptProperties.md
- 旧版移行：authServer.md
- 旧版移行：authServerConfig.md
- 旧版移行：classes.md
- 旧版移行：cryptoClient.md
- 旧版移行：cryptoServer.md
- 旧版移行：decryptedRequest.md
- 旧版移行：decryptedResponse.md
- 旧版移行：encryptedRequest.md
- 旧版移行：encryptedResponse.md
- 旧版移行：JSLib.md
- 旧版移行：LocalRequest.md
- 旧版移行：LocalResponse.md
- 旧版移行：Member.md
- 旧版移行：MemberDevice.md
- 旧版移行：MemberLog.md
- 旧版移行：MemberProfile.md
- 旧版移行：MemberTrial.md
- 旧版移行：MemberTrialLog.md
- 旧版移行：spec.md
- 旧版移行：authClient.md

### 対応済

- 旧版移行：authAuditLog.md
- LocalRequest: エラー時の戻り値が未評価
- Error: unregistered type

## ToDo

- 必要そうなクラスとメソッドを置く(引数・戻り値・処理は後工程で)
- `archives/20251108_IO変更前/src/authClient/spec.md`からの移行
- サーバ側仕様書作成・レビュー
  - cryptoServerクラス
  - Memberクラス
  - authServer(クロージャ関数)仕様書のレビュー(サーバ側のフロント)
- クライアント側仕様書作成・レビュー
  - cryptoClientクラス仕様書のレビュー(cryptoServerと対になるクライアント側署名・暗号化・復号・検証機能)
  - authClientクラス仕様書のレビュー(クライアント側のフロント)
- spec.mdの再レビュー(サーバ側・クライアント側仕様変更を反映した後の、全体的な整合性チェック)
- パーツとなるクラスの実装(MemberLog,MemberProfile等)
- 主要クラス(cryptoClient/Server,authClient/Server,Member)のスケルトン作成
- テスト仕様・ツールの作成
- 主要クラスの実装
