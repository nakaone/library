<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [cryptoClient](cryptoClient.md) | [authServer](authServer.md) |  [cryptoServer](cryptoServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="memberprofile">MemberProfile クラス仕様書</span>

## <span id="memberprofile_summary">🧭 概要</span>

メンバの属性情報

### <span id="memberprofile_policy">設計方針</span>

- [状態遷移図](Member.md#member_policy_statediagram)
- [クラス図](classes.md#member_classdiagram)

### 🧩 <span id="memberprofile_internal">内部構成</span>

🔢 MemberProfile メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| authority | ❌ | number | — | メンバの持つ権限 | authServerConfig.func.authorityとの論理積>0なら当該関数実行権限ありと看做す | 


🧱 <span id="memberprofile_method">MemberProfile メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#memberprofile_constructor) | private | コンストラクタ |

## <span id="memberprofile_constructor">🧱 <a href="#memberprofile_method">MemberProfile.constructor()</a></span>

コンストラクタ

### <span id="memberprofile_constructor_caller">📞 呼出元</span>

- [Member.constructor()](Member.md#memberprofile_constructor)

### <span id="memberprofile_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="memberprofile_constructor_process">🧾 処理手順</span>



### <span id="memberprofile_constructor_returns">📤 戻り値</span>

  - [MemberProfile](MemberProfile.md#memberprofile_internal): メンバの属性情報
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | authority | number | 【必須】 | — |