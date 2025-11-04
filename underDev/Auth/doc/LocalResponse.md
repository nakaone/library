<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="localresponse">LocalResponse クラス仕様書</span>

## <span id="localresponse_summary">🧭 概要</span>

ローカル関数への処理結果

authClientからクライアント側関数に返される処理結果オブジェクト

### 🧩 <span id="localresponse_internal">内部構成</span>

🔢 LocalResponse メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| result | ❌ | string | — | 処理結果。fatal/warning/normal |  | 
| message | ⭕ | string | — | エラーメッセージ | normal時は`undefined` | 
| response | ⭕ | any | — | 要求された関数の戻り値 | fatal/warning時は`undefined`。`JSON.parse(authResponse.response)` | 


🧱 <span id="localresponse_method">LocalResponse メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#localresponse_constructor) | private | コンストラクタ |

## <span id="localresponse_constructor">🧱 <a href="#localresponse_method">LocalResponse.constructor()</a></span>

コンストラクタ

### <span id="localresponse_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="localresponse_constructor_returns">📤 戻り値</span>

- [LocalResponse](LocalResponse.md#internal): ローカル関数への処理結果
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  | result | string | [必須] | — |
  | message | string | [任意] | — |
  | response | any | [任意] | — |

### <span id="localresponse_constructor_process">🧾 処理手順</span>

