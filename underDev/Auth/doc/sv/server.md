<div style="text-align: right;">

[総説](../specification.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>
<style>
  td {white-space:nowrap;}
</style>

# authサーバ側仕様書

## 実装イメージ

```js
// ライブラリ関数定義
function devTools(){...}; // (中略)

// authServer関係クラス定義
class authServer{...};
class cryptoServer{...};
class Member{...};  // (中略)

// グローバル変数定義
const dev = devTools();
const asv = authServer({
  // プロジェクト毎の独自パラメータ
});

// Webアプリ定義
function doPost(e) {
  const rv = asv.exec(e.postData.contents); // 受け取った本文(文字列)
  if( rv !== null ){ // fatal(無応答)の場合はnullを返す
    return ContentService
      .createTextOutput(rv);
  }
}

// スプレッドシートメニュー定義
const ui = SpreadsheetApp.getUi();
ui.createMenu('追加したメニュー')
  .addItem('加入認否入力', 'menu10')
  .addSeparator()
  .addSubMenu(ui.createMenu("システム関係")
    .addItem('実行環境の初期化', 'menu21')
    .addItem("【緊急】鍵ペアの更新", "menu22")
  )
  .addToUi();
const menu10 = () => asv.listNotYetDecided();
const menu21 = () => asv.setupEnvironment();
const menu22 = () => asv.resetSPkey();
```

## クラス一覧

| No | 名称 | 概要 |
| --: | :-- | :-- |
| 1.00 | [authAuditLog](authAuditLog.md#authauditlog_members) | authServerの監査ログ |
| 1.01 | <span style="padding-left:2rem">[constructor](authAuditLog.md#authauditlog_constructor)</span> | コンストラクタ |
| 1.02 | <span style="padding-left:2rem">[log](authAuditLog.md#authauditlog_log)</span> | 監査ログシートに処理要求を追記 |
| 2.00 | [authConfig](authConfig.md#authconfig_members) | authClient/authServer共通設定値 |
| 2.01 | <span style="padding-left:2rem">[constructor](authConfig.md#authconfig_constructor)</span> | コンストラクタ |
| 3.00 | [authErrorLog](authErrorLog.md#autherrorlog_members) | authServerのエラーログ |
| 3.01 | <span style="padding-left:2rem">[constructor](authErrorLog.md#autherrorlog_constructor)</span> | コンストラクタ |
| 3.02 | <span style="padding-left:2rem">[log](authErrorLog.md#autherrorlog_log)</span> | エラーログシートにエラー情報を追記 |
| 4.00 | [authRequestLog](authRequestLog.md#authrequestlog_members) | 重複チェック用のリクエスト履歴 |
| 4.01 | <span style="padding-left:2rem">[constructor](authRequestLog.md#authrequestlog_constructor)</span> | コンストラクタ |
| 5.00 | [authResponse](authResponse.md#authresponse_members) | サーバ側で復号された処理要求 |
| 5.01 | <span style="padding-left:2rem">[constructor](authResponse.md#authresponse_constructor)</span> | コンストラクタ |
| 6.00 | [authResult](authResult.md#authresult_members) | auth内メソッドの標準的な戻り値 |
| 6.01 | <span style="padding-left:2rem">[constructor](authResult.md#authresult_constructor)</span> | コンストラクタ |
| 7.00 | [authScriptProperties](authScriptProperties.md#authscriptproperties_members) | サーバ側のScriptProperties |
| 7.01 | <span style="padding-left:2rem">[constructor](authScriptProperties.md#authscriptproperties_constructor)</span> | コンストラクタ |
| 7.02 | <span style="padding-left:2rem">[checkDuplicate](authScriptProperties.md#authscriptproperties_checkduplicate)</span> | クライアントからの重複リクエストチェック |
| 7.03 | <span style="padding-left:2rem">[deleteProp](authScriptProperties.md#authscriptproperties_deleteprop)</span> | ScriptPropertiesを消去 |
| 7.04 | <span style="padding-left:2rem">[getProp](authScriptProperties.md#authscriptproperties_getprop)</span> | ScriptPropertiesをインスタンス変数に格納 |
| 7.05 | <span style="padding-left:2rem">[resetSPkey](authScriptProperties.md#authscriptproperties_resetspkey)</span> | SPkeyを更新、ScriptPropertiesに保存 |
| 7.06 | <span style="padding-left:2rem">[setProp](authScriptProperties.md#authscriptproperties_setprop)</span> | インスタンス変数をScriptPropertiesに格納 |
| 8.00 | [authServer](authServer.md#authserver_members) | サーバ側auth中核クラス |
| 8.01 | <span style="padding-left:2rem">[constructor](authServer.md#authserver_constructor)</span> |  |
| 9.00 | [authServerConfig](authServerConfig.md#authserverconfig_members) | authServer専用の設定値 |
| 9.01 | <span style="padding-left:2rem">[constructor](authServerConfig.md#authserverconfig_constructor)</span> | コンストラクタ |
| 10.00 | [cryptoServer](cryptoServer.md#cryptoserver_members) | サーバ側の暗号化・復号処理 |
| 10.01 | <span style="padding-left:2rem">[constructor](cryptoServer.md#cryptoserver_constructor)</span> | コンストラクタ |
| 10.02 | <span style="padding-left:2rem">[decrypt](cryptoServer.md#cryptoserver_decrypt)</span> | authClientからのメッセージを復号＋署名検証 |
| 10.03 | <span style="padding-left:2rem">[encrypt](cryptoServer.md#cryptoserver_encrypt)</span> | authClientへのメッセージを署名＋暗号化 |
| 10.04 | <span style="padding-left:2rem">[generateKeys](cryptoServer.md#cryptoserver_generatekeys)</span> | 新たなサーバ側鍵ペアを作成 |
| 11.00 | [dtError](dtError.md#dterror_members) | 標準Errorの独自拡張 |
| 11.01 | <span style="padding-left:2rem">[constructor](dtError.md#dterror_constructor)</span> | コンストラクタ |
| 12.00 | [encryptedRequest](encryptedRequest.md#encryptedrequest_members) | 暗号化された処理要求 |
| 12.01 | <span style="padding-left:2rem">[constructor](encryptedRequest.md#encryptedrequest_constructor)</span> | コンストラクタ |
| 13.00 | [encryptedResponse](encryptedResponse.md#encryptedresponse_members) | 暗号化された処理結果 |
| 13.01 | <span style="padding-left:2rem">[constructor](encryptedResponse.md#encryptedresponse_constructor)</span> | コンストラクタ |
| 14.00 | [Member](Member.md#member_members) | メンバ情報をGoogle Spread上で管理 |
| 14.01 | <span style="padding-left:2rem">[constructor](Member.md#member_constructor)</span> | コンストラクタ |
| 14.02 | <span style="padding-left:2rem">[addTrial](Member.md#member_addtrial)</span> | 新しい試行を登録し、メンバにパスコード通知メールを発信 |
| 14.03 | <span style="padding-left:2rem">[checkPasscode](Member.md#member_checkpasscode)</span> | 認証時のパスコードチェック |
| 14.04 | <span style="padding-left:2rem">[getMember](Member.md#member_getmember)</span> | 指定メンバの情報をmemberListシートから取得 |
| 14.05 | <span style="padding-left:2rem">[judgeMember](Member.md#member_judgemember)</span> | 加入審査画面から審査結果入力＋結果通知 |
| 14.06 | <span style="padding-left:2rem">[judgeStatus](Member.md#member_judgestatus)</span> | 指定メンバ・デバイスの状態を[状態決定表](../specification.md#member)により判定 |
| 14.07 | <span style="padding-left:2rem">[reissuePasscode](Member.md#member_reissuepasscode)</span> | パスコードを再発行する |
| 14.08 | <span style="padding-left:2rem">[removeMember](Member.md#member_removemember)</span> | 登録中メンバをアカウント削除、または加入禁止にする |
| 14.09 | <span style="padding-left:2rem">[restoreMember](Member.md#member_restoremember)</span> | 加入禁止(論理削除)されているメンバを復活させる |
| 14.10 | <span style="padding-left:2rem">[setMember](Member.md#member_setmember)</span> | 指定メンバ情報をmemberListシートに保存 |
| 14.11 | <span style="padding-left:2rem">[unfreeze](Member.md#member_unfreeze)</span> | 指定されたメンバ・デバイスの「凍結中」状態を強制的に解除 |
| 14.12 | <span style="padding-left:2rem">[updateCPkey](Member.md#member_updatecpkey)</span> | 対象メンバ・デバイスの公開鍵を更新 |
