<div style="text-align: right;">

[総説](../spec.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>

# <span id="authresult">authResult クラス仕様書</span>

auth内メソッドの標準的な戻り値

authServer内の処理等、"warning"(処理継続)時の使用を想定。

## <span id="authresult_members">🔢 authResult メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| responseTime | number | Date.now() | 処理終了日時 |  |
| status | string | "normal" | 終了状態 | "normal"or"fatal"or警告メッセージ(warning) |
| response | any
[authError](authError.md#autherror_members) | 任意 | 処理結果 | @returns {void}ならundefined。fatal時はauthError |

## <span id="authresult_methods">🧱 authResult メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#authresult_constructor) | private | コンストラクタ |  |

### <span id="authresult_constructor"><a href="#authresult_methods">🧱 authResult.constructor()</a></span>

#### <span id="authresult_constructor_referrer">📞 呼出元</span>

#### <span id="authresult_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

#### <span id="authresult_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定

#### <span id="authresult_constructor_returns">📤 戻り値</span>

- [authResult](#authresult_members)インスタンス