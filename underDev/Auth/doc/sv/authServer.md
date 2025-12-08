<div style="text-align: right;">

[総説](../specification.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>
<style>
  td {white-space:nowrap;}
</style>

# <span id="authserver">authServer クラス仕様書</span>

サーバ側auth中核クラス

authServerは、クライアント(authClient)からの暗号化通信リクエストを復号・検証し、
メンバ状態と要求内容に応じてサーバ側処理を適切に振り分ける中核関数です。

## <span id="authserver_summary">🧭 authServer クラス 概要</span>

- staticメソッドを利用するため、クラスとする
- doPostからはauthServer.execを呼び出す

#### <a name="outputLog">🗒️ ログ出力仕様</a>

| 種別 | 保存先 | 内容 |
| :-- | :-- | :-- |
| requestLog | ScriptProperties (TTL短期) | [authRequestLog](typedef.md#authrequestlog)記載項目 |
| errorLog | Spreadsheet(authServerConfig.errorLog) | [authErrorLog](typedef.md#autherrorlog)記載項目 |
| auditLog | Spreadsheet(authServerConfig.auditLog) | [authAuditLog](typedef.md#authauditlog)記載項目 |

■ ログ出力のタイミング

| ログ種別 | タイミング | 理由 |
| :-- | :-- | :-- |
| **auditLog** | authServer各メソッド完了時 | イベントとして記録。finallyまたはreturn前に出力 |
| **errorLog** | authServer各メソッドからの戻り値がfatal、または予期せぬエラー発生時 | 原因箇所特定用。catch句内に記載 |

## <span id="authserver_members">🔢 authServer メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| cf | [authServerConfig](authServerConfig.md#authserverconfig_members) | null | 動作設定変数(config) |  |
| prop | [authScriptProperties](authScriptProperties.md#authscriptproperties_members) | null | 鍵ペア等を格納 |  |
| crypto | [cryptoServer](cryptoServer.md#cryptoserver_members) | null | 暗号化・復号用インスタンス |  |
| member | [Member](Member.md#member_members) | null | 対象メンバのインスタンス |  |
| audit | [authAuditLog](authAuditLog.md#authauditlog_members) | null | 監査ログのインスタンス |  |
| error | [authErrorLog](authErrorLog.md#autherrorlog_members) | null | エラーログのインスタンス |  |
| pv | Object | {} | authServer内共通変数 |  |

## <span id="authserver_methods">🧱 authServer メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authserver_constructor) | private |  |  |

### <span id="authserver_constructor"><a href="#authserver_methods">🧱 authServer.constructor()</a></span>

#### <span id="authserver_constructor_params">📥 引数</span>

- 引数無し(void)

#### <span id="authserver_constructor_process">🧾 処理手順</span>

#### <span id="authserver_constructor_returns">📤 戻り値</span>

- [authServer](#authserver_members)インスタンス