<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="authclientconfig">authClientConfig クラス仕様書</span>

## <span id="authclientconfig_summary">🧭 概要</span>

authClient専用の設定値

authConfigを継承

### 🧩 <span id="authclientconfig_internal">内部構成</span>

🔢 authClientConfig メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| api | ❌ | string | — | サーバ側WebアプリURLのID | `https://script.google.com/macros/s/(この部分)/exec` | 
| timeout | ⭕ | number | 300000 | サーバからの応答待機時間 | これを超えた場合はサーバ側でfatalとなったと解釈する。既定値は5分 | 
| CPkeyGraceTime | ⭕ | number | 600000 | CPkey期限切れまでの猶予時間 | CPkey有効期間がこれを切ったら更新処理実行。既定値は10分 | 


🧱 <span id="authclientconfig_method">authClientConfig メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authclientconfig_constructor) | private | コンストラクタ |

## <span id="authclientconfig_constructor">🧱 <a href="#authclientconfig_method">authClientConfig.constructor()</a></span>

コンストラクタ

### <span id="authclientconfig_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authclientconfig_constructor_process">🧾 処理手順</span>



### <span id="authclientconfig_constructor_returns">📤 戻り値</span>

- [authClientConfig](authClientConfig.md#internal): authClient専用の設定値
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  | api | string | [必須] | — |
  | timeout | number | 300000 | — |
  | CPkeyGraceTime | number | 600000 | — |