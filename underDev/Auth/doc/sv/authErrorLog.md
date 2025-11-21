<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

<!--
[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)
-->
</div>

# <span id="autherrorlog">authErrorLog クラス仕様書</span>

authServerのエラーログ

- 各メソッドの冒頭でインスタンス化、処理開始時刻等を記録
- 出力時にlogメソッドを呼び出して処理時間を計算、シート出力

## <span id="autherrorlog_members">🔢 authErrorLog メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
|  | string | 任意 |  |  |

## <span id="autherrorlog_methods">🧱 authErrorLog メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#autherrorlog_constructor) | private | コンストラクタ |  |

### <span id="autherrorlog_constructor">🧱 authErrorLog.constructor()</span>

#### <span id="autherrorlog_constructor_caller">📞 呼出元</span>

#### <span id="autherrorlog_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

#### <span id="autherrorlog_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

#### <span id="autherrorlog_constructor_returns">📤 戻り値</span>

- [authErrorLog](#autherrorlog_members)インスタンス