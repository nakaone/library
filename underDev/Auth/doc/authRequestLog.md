<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md) | [JSLib](JSLib.md)

</div>

<p style="text-align:right;"><a href="classList.md">クラス一覧</a></p>

# <span id="authrequestlog">authRequestLog クラス仕様書</span>

## <span id="authrequestlog_summary">🧭 概要</span>

重複チェック用のリクエスト履歴

ScriptPropertiesに保存

### 🧩 <span id="authrequestlog_internal">内部構成</span>

🔢 authRequestLog メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| timestamp | ⭕ | number | Date.now() | リクエストを受けたサーバ側日時 |  | 
| requestId | ❌ | string | — | クライアント側で採番されたリクエスト識別子 | UUID | 


🧱 <span id="authrequestlog_method">authRequestLog メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authrequestlog_constructor) | private | コンストラクタ |

## <span id="authrequestlog_constructor">🧱 <a href="#authrequestlog_method">authRequestLog.constructor()</a></span>

コンストラクタ

### <span id="authrequestlog_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authrequestlog_constructor_returns">📤 戻り値</span>

- [authRequestLog](authRequestLog.md#internal): 重複チェック用のリクエスト履歴
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  | timestamp | number | Date.now() | — |
  | requestId | string | [必須] | — |

### <span id="authrequestlog_constructor_process">🧾 処理手順</span>

