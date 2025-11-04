<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="member">Member クラス仕様書</span>

## <span id="member_summary">🧭 概要</span>

メンバ単位の管理情報

メンバ一覧(アカウント管理表)シート上のメンバ単位の管理情報
### <span id="member_policy">設計方針</span>

#### <span id="member_policy_statediagram">状態遷移図</span>

```mermaid
%% メンバ状態遷移図

stateDiagram-v2
  [*] --> 不使用
  不使用 --> 未加入 : 処理要求
  不使用 --> 未審査 : 処理要求
  不使用 --> 加入禁止 : 処理要求
  不使用 --> 加入中 : 処理要求
  未加入 --> 未審査 : 加入要求
  未審査 --> 加入中 : 加入承認
  加入中 --> 未審査 : 加入失効
  未審査 --> 加入禁止: 加入否認
  加入禁止 --> 未審査 : 加入解禁
  state 加入中 {
    [*] --> 未認証
    未認証 --> 試行中 : 認証要求
    試行中 --> 未認証 : CPkey更新
    試行中 --> 認証中 : 認証成功
    試行中 --> 試行中 : 再試行
    認証中 --> 未認証 : 認証失効 or CPkey更新
    試行中 --> 凍結中 : 認証失敗
    凍結中 --> 凍結中 : CPkey更新
    凍結中 --> 未認証 : 凍結解除
  }
```

| No | 状態 | 説明 | SPkey | CPkey | memberId/メンバ名 | 無権限関数 | 要権限関数 |
| --: | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | 不使用 | Auth不使用のコンテンツのみ表示 | 未取得 | 未生成(※1) | 未登録(※1) | 実行不可 | 実行不可 |
| 2 | 未加入 | memberListにUUIDのmemberId/メンバ名で仮登録 | 取得済 | 生成済 | 仮登録(UUID) | 実行可 | 実行不可 |
| 3 | 未審査 | memberListに本来のmemberId/メンバ名で登録済だが管理者による加入認否が未決定 | 取得済 | 生成済 | 本登録 | 実行可 | 実行不可 |
| 4 | 加入中 | 管理者により加入が承認された状態 | 取得済 | 生成済 | 本登録 | 実行可 | 実行不可 |
| 4.1 | 未認証 | 未認証(未ログイン)で権限が必要な処理は行えない状態 | 取得済 | 生成済 | 本登録 | 実行可 | 実行不可 |
| 4.2 | 試行中 | パスコードによる認証を試行している状態 | 取得済 | 生成済 | 本登録 | 実行可 | 実行不可 |
| 4.3 | 認証中 | 認証が通り、ログインして認証が必要な処理も行える状態 | 取得済 | 生成済 | 本登録 | 実行可 | 実行可 |
| 4.4 | 凍結中 | 規定の試行回数連続して認証に失敗し、再認証要求が禁止された状態 | 取得済 | 生成済 | 本登録 | 実行可 | 実行不可 |
| 5 | 加入禁止 | 管理者により加入が否認された状態 | 取得済 | 生成済 | 本登録 | 実行可 | 実行不可 |

- [クラス図](classes.md#member_classdiagram)

### 🧩 <span id="member_internal">内部構成</span>

🔢 Member メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| memberId | ⭕ | string | UUID | メンバの識別子 | メールアドレス | 
| name | ⭕ | string | "dummy" | メンバの氏名 |  | 
| status | ⭕ | string | "未加入" | メンバの状態 | 未加入,未審査,審査済,加入中,加入禁止 | 
| log | ⭕ | [MemberLog](MemberLog.md#memberlog_internal) | new MemberLog() | メンバの履歴情報 | シート上はJSON文字列 | 
| profile | ⭕ | [MemberProfile](MemberProfile.md#memberprofile_internal) | new MemberProfile() | メンバの属性情報 | シート上はJSON文字列 | 
| device | ⭕ | MemberDevice[] | 空配列 | デバイス情報 | マルチデバイス対応のため配列。シート上はJSON文字列 | 
| note | ⭕ | string | 空文字列 | 当該メンバに対する備考 |  | 


🧱 <span id="member_method">Member メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#member_constructor) | private | コンストラクタ |
| [getMember](#member_getmember) | public | 指定メンバの情報をmemberListシートから取得 |

## <span id="member_constructor">🧱 <a href="#member_method">Member.constructor()</a></span>

コンストラクタ

### <span id="member_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| config | ❌ | [authServerConfig](authServerConfig.md#authserverconfig_internal) | — | ユーザ指定の設定値 | 

### <span id="member_constructor_returns">📤 戻り値</span>

- [Member](Member.md#internal): メンバ単位の管理情報
  | 項目名 | データ型 | 生成時 | 正常終了 |
  | :-- | :-- | :-- | :-- |
  | memberId | string | UUID | — |
  | name | string | "dummy" | — |
  | status | string | "未加入" | — |
  | log | MemberLog | new MemberLog() | — |
  | profile | MemberProfile | new MemberProfile() | — |
  | device | MemberDevice[] | 空配列 | — |
  | note | string | 空文字列 | — |

### <span id="member_constructor_process">🧾 処理手順</span>

- [authServerConfig.memberList](authServerConfig.md#internal)シートが存在しなければシートを新規作成
  - シート上の項目名はMemberクラスのメンバ名
  - 各項目の「説明」を項目名セルのメモとしてセット
- this.log = new [MemberLog()](MemberLog.md#memberlog_constructor)
- this.profile = new [MemberProfile()](MemberProfile.md#memberprofile_constructor)

## <span id="member_getmember">🧱 <a href="#member_method">Member.getMember()</a></span>

指定メンバの情報をmemberListシートから取得

### <span id="member_getmember_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| memberId | ❌ | string | — | ユーザ識別子(メールアドレス) | 

### <span id="member_getmember_returns">📤 戻り値</span>

- [authResponse](authResponse.md#internal): メンバ単位の管理情報
  | 項目名 | データ型 | 生成時 | 登録済 | 未登録 |
  | :-- | :-- | :-- | :-- | :-- |
  | timestamp | number | Date.now() | — | — |
  | result | string | normal | **"normal"** | **"fatal"** |
  | message | string | [任意] | — | **not exists** |
  | request | authRequest | [任意] | {memberId:引数のmemberId} | {memberId:引数のmemberId} |
  | response | any | [任意] | **memberListシートのMemberインスタンス** | — |

### <span id="member_getmember_process">🧾 処理手順</span>

- JSON文字列の項目はオブジェクト化(Member.log, Member.profile, Member.device)
- memberIdがmemberListシート登録済なら「登録済」、未登録なら「未登録」パターンを返す