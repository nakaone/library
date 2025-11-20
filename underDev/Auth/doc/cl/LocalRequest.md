<div style="text-align: right;">

[総説](../spec.md) | [クライアント側クラス一覧](../cl/list.md) | [サーバ側クラス一覧](../sv/list.md)

<!--
[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)
-->
</div>

# <span id="localrequest">LocalRequest クラス仕様書</span>

ローカル関数からの処理要求

クライアント側関数からauthClientに渡す内容を確認、オブジェクト化する

## <span id="localrequest_members">🔢 LocalRequest メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| func | string | 任意 | サーバ側関数名 |  |
| arguments | any[] | [] | サーバ側関数に渡す引数の配列 | プリミティブ値、及びプリミティブ値で構成された配列・オブジェクト |

## <span id="localrequest_methods">🧱 LocalRequest メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#localrequest_constructor) | private | コンストラクタ |  |

### <span id="localrequest_constructor">🧱 LocalRequest.constructor()</span>

#### <span id="localrequest_constructor_caller">📞 呼出元</span>

#### <span id="localrequest_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| func | string | 任意 | サーバ側関数名 |  |
| arguments | any[] | [] | サーバ側関数に渡す引数の配列 | 引数が一つでも配列として指定 |

#### <span id="localrequest_constructor_process">🧾 処理手順</span>

- メンバと引数両方にある項目は、引数の値をメンバとして設定
- "func"は関数名として使用可能な文字種であることを確認<br>
  `^[A-Za-z_$][A-Za-z0-9_$]*$`<br>
  上記正規表現にマッチしなければ戻り値「func不正」を返して終了
- "arguments"は関数を排除するため、一度JSON化してからオブジェクト化<br>
  `JSON.parse(JSON.stringify(arguments))`

#### <span id="localrequest_constructor_returns">📤 戻り値</span>

- [LocalRequest](LocalRequest.md#localrequest_members) : 正常時の戻り値

  | 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
  | :-- | :-- | :-- | :-- | :-- |
  | func | string | 任意 | サーバ側関数名 |  |
  | arguments | any[] | [] | サーバ側関数に渡す引数の配列 | プリミティブ値、及びプリミティブ値で構成された配列・オブジェクト |

- エラー時の戻り値

  | 項目名 | データ型 | 要否/既定値 | 説明 | func不正 |
  | :-- | :-- | :-- | :-- | :-- |
  | responseTime | number | Date.now() | エラー発生日時 | — |
  | errorType | string | Error.name | エラーの型(ex."ReferenceError") | — |
  | function | string | v.whois | エラーが起きたクラス・メソッド名 | — |
  | step | string | v.step | エラーが起きたメソッド内の位置 | — |
  | variable | string | JSON.stringify(v) | エラー時のメソッド内汎用変数(JSON文字列) | — |
  | message | string | Error.message | エラーメッセージ | **"invalid func"** |
  | stack | string | Error.stack | エラー時のスタックトレース | — |