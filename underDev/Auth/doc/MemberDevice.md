<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [cryptoClient](cryptoClient.md) | [authServer](authServer.md) |  [cryptoServer](cryptoServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="memberdevice">MemberDevice クラス仕様書</span>

## <span id="memberdevice_summary">🧭 概要</span>

メンバのデバイス情報

メンバが使用する通信機器の情報(マルチデバイス対応)

### <span id="memberdevice_policy">設計方針</span>

- [状態遷移図](Member.md#member_policy_statediagram)
- [クラス図](classes.md#member_classdiagram)

### 🧩 <span id="memberdevice_internal">内部構成</span>

🔢 MemberDevice メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| deviceId | ❌ | string | — | デバイスの識別子。UUID |  | 
| status | ⭕ | string | 未認証 | デバイスの状態 | 未認証,認証中,試行中,凍結中 | 
| CPkey | ❌ | string | — | メンバの公開鍵 |  | 
| CPkeyUpdated | ⭕ | number | Date.now() | 最新のCPkeyが登録された日時 |  | 
| trial | ⭕ | MemberTrial[] | [] | ログイン試行関連情報オブジェクト | シート上はJSON文字列 | 


🧱 <span id="memberdevice_method">MemberDevice メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#memberdevice_constructor) | private | コンストラクタ |

## <span id="memberdevice_constructor">🧱 <a href="#memberdevice_method">MemberDevice.constructor()</a></span>

コンストラクタ

### <span id="memberdevice_constructor_caller">📞 呼出元</span>

- [Member.setMember()](Member.md#memberdevice_constructor)

### <span id="memberdevice_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="memberdevice_constructor_process">🧾 処理手順</span>



### <span id="memberdevice_constructor_returns">📤 戻り値</span>

  - [MemberDevice](MemberDevice.md#memberdevice_internal): メンバのデバイス情報
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | deviceId | string | 【必須】 | — |
    | status | string | 未認証 | — |
    | CPkey | string | 【必須】 | — |
    | CPkeyUpdated | number | Date.now() | — |
    | trial | MemberTrial[] |  | — |