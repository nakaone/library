<style>
  .l1 { /* トップレベル(level.1)のタイトル */
    padding: 1rem 2rem;
    border-left: 5px solid #000;
    background: #f4f4f4;
    font-size: 2.4rem;
    font-weight: 900;
  }
  .submenu {  /* MD内のサブメニュー。右寄せ＋文字サイズ小 */
    text-align: right;
    font-size: 0.8rem;
  }
  .nowrap td {white-space:nowrap;} /* 横長な表を横スクロール */
  .nowrap b {background:yellow;}

.popup {color:#084} /* titleに文字列を設定した項目 */
  td {white-space:nowrap;}
</style>
<div style="text-align: right;">

[総説](../readme.md) | [共通仕様](../common/index.md) | [クライアント側仕様](../client/index.md) | [サーバ側仕様](../server/index.md) | [開発仕様](../dev.md)

</div>

# <span id="/server/cryptoServer.mjs::cryptoServer_top">🧩 cryptoServerクラス仕様書</span>

cryptoServer: サーバ側の暗号化・署名検証

## <a href="#/server/cryptoServer.mjs::cryptoServer_top"><span id="/server/cryptoServer.mjs::cryptoServer_prop">🔢 cryptoServer メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| cf | authServerConfig | 必須 | authServer設定情報 |  |
| prop | ScriptProperties | 必須 | PropertiesService.getScriptProperties() |  |
| keys | authScriptProperties | 必須 | ScriptPropertiesに保存された鍵ペア情報 |  |
| keyList | string[] | 必須 | ScriptPropertiesに保存された項目名の一覧 |  |

## <a href="#/server/cryptoServer.mjs::cryptoServer_top"><span id="/server/cryptoServer.mjs::cryptoServer_func">🧱 cryptoServer メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/client/authClient.mjs::authClient#exec_top">exec</a> | exec: ローカル関数の処理要求を処理 |
| 2 | <a href="#/common/authConfig.mjs::authConfig_top">authConfig</a> | authConfig: クライアント・サーバ共通設定情報 |
| 3 | <a href="#/server/cryptoServer.mjs::cryptoServer.initialize_top">initialize</a> | initialize: cryptoServerインスタンス作成 |

## <a href="#/server/cryptoServer.mjs::cryptoServer_top"><span id="/server/cryptoServer.mjs::cryptoServer_desc">🧾 cryptoServer 概説</span></a>

サーバ側の暗号化・署名検証
## <span id="/client/authClient.mjs::authClient#exec_top">🧩 exec()</span>

exec: ローカル関数の処理要求を処理

### <a href="#/client/authClient.mjs::authClient#exec_top"><span id="/client/authClient.mjs::authClient#exec_func">🧱 exec メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/server/Member.mjs::Member#getMember_top">getMember</a> | getMember: 指定メンバの情報をmemberListシートから取得 |
| 2 | <a href="#/server/cryptoServer.mjs::cryptoServer#generateKeys_top">generateKeys</a> | generateKeys: PEM形式のRSA鍵ペアを生成 |
| 3 | <a href="#/server/cryptoServer.mjs::cryptoServer#generateAndSave_top">generateAndSave</a> | generateAndSave: 鍵を生成し、直ちにScriptPropertiesに保存する |

### <a href="#/client/authClient.mjs::authClient#exec_top"><span id="/client/authClient.mjs::authClient#exec_desc">🧾 exec 概説</span></a>

exec: ローカル関数の処理要求を処理

### <a href="#/client/authClient.mjs::authClient#exec_top"><span id="/client/authClient.mjs::authClient#exec_param">▶️ exec 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| func | string | 必須 | サーバ側関数名 |  |
| arg | any[] | [ | サーバ側関数に渡す引数 |  |
| depth | number | 0 | 再帰呼出時の階層 |  |

### <a href="#/client/authClient.mjs::authClient#exec_top"><span id="/client/authClient.mjs::authClient#exec_return">◀️ exec 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| any \| Error | 処理結果 |  |
### <span id="/server/Member.mjs::Member#getMember_top">🧩 getMember()</span>

getMember: 指定メンバの情報をmemberListシートから取得

#### <a href="#/server/Member.mjs::Member#getMember_top"><span id="/server/Member.mjs::Member#getMember_desc">🧾 getMember 概説</span></a>

getMember: 指定メンバの情報をmemberListシートから取得

#### <a href="#/server/Member.mjs::Member#getMember_top"><span id="/server/Member.mjs::Member#getMember_param">▶️ getMember 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | 必須 | ユーザ識別子(メールアドレス) |  |

#### <a href="#/server/Member.mjs::Member#getMember_top"><span id="/server/Member.mjs::Member#getMember_return">◀️ getMember 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| Member \| Error | いまここ：元は"authResponse"だったが、"Member"の方がベター？ |  |
### <span id="/server/cryptoServer.mjs::cryptoServer#generateKeys_top">🧩 generateKeys()</span>

generateKeys: PEM形式のRSA鍵ペアを生成

#### <a href="#/server/cryptoServer.mjs::cryptoServer#generateKeys_top"><span id="/server/cryptoServer.mjs::cryptoServer#generateKeys_desc">🧾 generateKeys 概説</span></a>

generateKeys: PEM形式のRSA鍵ペアを生成
- 生成のみ、ScriptPropertiesやメンバ変数への格納は行わない

#### <a href="#/server/cryptoServer.mjs::cryptoServer#generateKeys_top"><span id="/server/cryptoServer.mjs::cryptoServer#generateKeys_param">▶️ generateKeys 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
|  | void | 必須 |  |  |

#### <a href="#/server/cryptoServer.mjs::cryptoServer#generateKeys_top"><span id="/server/cryptoServer.mjs::cryptoServer#generateKeys_return">◀️ generateKeys 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| Object | 生成された鍵ペア |  |
### <span id="/server/cryptoServer.mjs::cryptoServer#generateAndSave_top">🧩 generateAndSave()</span>

generateAndSave: 鍵を生成し、直ちにScriptPropertiesに保存する

#### <a href="#/server/cryptoServer.mjs::cryptoServer#generateAndSave_top"><span id="/server/cryptoServer.mjs::cryptoServer#generateAndSave_desc">🧾 generateAndSave 概説</span></a>

generateAndSave: 鍵を生成し、直ちにScriptPropertiesに保存する
## <span id="/common/authConfig.mjs::authConfig_top">🧩 authConfigクラス仕様書</span>

authConfig: クライアント・サーバ共通設定情報

### <a href="#/common/authConfig.mjs::authConfig_top"><span id="/common/authConfig.mjs::authConfig_prop">🔢 authConfig メンバ一覧</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| systemName | string | "auth" | システム名 |  |
| adminMail | string | 必須 | 管理者のメールアドレス |  |
| adminName | string | 必須 | 管理者氏名 |  |
| allowableTimeDifference | number | 120000 | クライアント・サーバ間通信時の許容時差既定値は2分 |  |
| RSAbits | string | 2048 | 鍵ペアの鍵長 |  |
| maxDepth | number | 10 | 再帰呼出時の最大階層 |  |
| underDev | Object | 必須 | テスト時の設定 |  |
| underDev.isTest | boolean | false | 開発モードならtrue |  |

### <a href="#/common/authConfig.mjs::authConfig_top"><span id="/common/authConfig.mjs::authConfig_func">🧱 authConfig メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/common/authConfig.mjs::authConfig.exports.authConfig#constructor_top">constructor</a> |  |

### <a href="#/common/authConfig.mjs::authConfig_top"><span id="/common/authConfig.mjs::authConfig_desc">🧾 authConfig 概説</span></a>

クライアント・サーバ共通設定情報
### <span id="/common/authConfig.mjs::authConfig.exports.authConfig#constructor_top">🧩 constructor()</span>

#### <a href="#/common/authConfig.mjs::authConfig.exports.authConfig#constructor_top"><span id="/common/authConfig.mjs::authConfig.exports.authConfig#constructor_func">🧱 constructor メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/server/Member.mjs::Member#checkPasscode_top">checkPasscode</a> | checkPasscode: 認証時のパスコードチェック |

#### <a href="#/common/authConfig.mjs::authConfig.exports.authConfig#constructor_top"><span id="/common/authConfig.mjs::authConfig.exports.authConfig#constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | authConfig | 必須 | 設定情報(既定値からの変更部分) |  |
#### <span id="/server/Member.mjs::Member#checkPasscode_top">🧩 checkPasscode()</span>

checkPasscode: 認証時のパスコードチェック

##### <a href="#/server/Member.mjs::Member#checkPasscode_top"><span id="/server/Member.mjs::Member#checkPasscode_desc">🧾 checkPasscode 概説</span></a>

checkPasscode: 認証時のパスコードチェック
入力されたパスコードをチェック、Member内部の各種メンバの値を更新

##### <a href="#/server/Member.mjs::Member#checkPasscode_top"><span id="/server/Member.mjs::Member#checkPasscode_param">▶️ checkPasscode 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | authRequest | 必須 | 処理要求 |  |

##### <a href="#/server/Member.mjs::Member#checkPasscode_top"><span id="/server/Member.mjs::Member#checkPasscode_return">◀️ checkPasscode 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| authResponse \| Error |  |  |
## <span id="/server/cryptoServer.mjs::cryptoServer.initialize_top">🧩 initialize()</span>

initialize: cryptoServerインスタンス作成

### <a href="#/server/cryptoServer.mjs::cryptoServer.initialize_top"><span id="/server/cryptoServer.mjs::cryptoServer.initialize_func">🧱 initialize メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/server/Member.mjs::Member.judgeMember_top">judgeMember</a> | judgeMember: 加入審査画面から審査結果入力＋結果通知 |

### <a href="#/server/cryptoServer.mjs::cryptoServer.initialize_top"><span id="/server/cryptoServer.mjs::cryptoServer.initialize_desc">🧾 initialize 概説</span></a>

initialize: cryptoServerインスタンス作成
- インスタンス作成時に必要な非同期処理をconstructorの代わりに実行
- staticではない一般のメンバへの値セットができないため別途constructorを呼び出す

### <a href="#/server/cryptoServer.mjs::cryptoServer.initialize_top"><span id="/server/cryptoServer.mjs::cryptoServer.initialize_param">▶️ initialize 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| cf | authServerConfig | 必須 | authServer設定値 |  |

### <a href="#/server/cryptoServer.mjs::cryptoServer.initialize_top"><span id="/server/cryptoServer.mjs::cryptoServer.initialize_return">◀️ initialize 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| cryptoServer \| Error |  |  |
### <span id="/server/Member.mjs::Member.judgeMember_top">🧩 judgeMember()</span>

judgeMember: 加入審査画面から審査結果入力＋結果通知

#### <a href="#/server/Member.mjs::Member.judgeMember_top"><span id="/server/Member.mjs::Member.judgeMember_desc">🧾 judgeMember 概説</span></a>

judgeMember: 加入審査画面から審査結果入力＋結果通知
加入審査画面を呼び出し、管理者が記入した結果をmemberListに登録、審査結果をメンバに通知
memberListシートのGoogle Spreadのメニューから管理者が実行することを想定

#### <a href="#/server/Member.mjs::Member.judgeMember_top"><span id="/server/Member.mjs::Member.judgeMember_param">▶️ judgeMember 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

#### <a href="#/server/Member.mjs::Member.judgeMember_top"><span id="/server/Member.mjs::Member.judgeMember_return">◀️ judgeMember 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |