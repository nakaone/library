<style>
  .submenu {
    text-align: right;
    font-size: 0.8rem;
  }
  .nowrap td {white-space:nowrap;} /* 横長な表を横スクロール */

  .chat {
    display: grid;
    grid-template-columns: repeat(5,1fr);
  }
  .header {
    grid-column: 1/6;
    display: grid;
    grid-template-columns: 6rem 1fr;
  }
  .chat .header:nth-child(n+2){
    margin-top: 2rem;
  }
  .event {
    font-weight: 900;
    text-align: center;
    background-color: #888;
    color: white;
    margin-right: 1rem;
  }
  .cl, .sv {
    display: grid;
    margin: 0.5rem;
    padding: 0.5rem;
    border: solid 2px #ddd;
  }
  .cl {
    grid-column: 1/5;
    grid-template-columns: 1fr repeat(5,3rem);
  }
  .sv {
    grid-column: 2/6;
    grid-template-columns: 1fr repeat(4,3rem) 5rem;
  }
  /*
    background-color: rgba(232, 253, 253, 1);
    background-color: rgba(255, 223, 255, 1);
  */
  .mID, .CP, .mName, .dID, .SP, .sts {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .h {
    background-color: white;
    border-top: #aaa;
    border-left: #aaa;
    border-right: #888;
    border-bottom: #888;
    font-weight: 600;
  }
  .b {
    color: red;
  }
  b {color:red;}
</style>

## <span id="status"><a href="#top">メンバの状態遷移</a></span>

### 状態遷移図

```mermaid
%% メンバ状態遷移図

stateDiagram-v2
  direction LR
  [*] --> 仮登録 : 初期化
  仮登録 --> 未審査 : 加入要求
  未審査 --> 加入中 : 加入承認
  加入中 --> 未審査 : 加入失効
  未審査 --> 加入禁止: 加入否認
  加入禁止 --> 未審査 : 加入解禁
```

### 状態一覧

| No | 状態 | 説明 |
| --: | :-- | :-- |
| 1 | 仮登録 | シートに仮のmemberId(UUID)/メンバ名("dummy"固定)が登録され、権限不要な関数のみ実行可能な状態 |
| 2 | 未審査 | シートに正しいmemberId(メアド)/メンバ名(氏名)が登録されているが、管理者からの加入認否が未定で権限不要な関数のみ実行可能な状態 |
| 3 | 加入中 | 管理者により加入が承認された状態。権限不要な関数に加え、ログイン後は付与された範囲内の要権限サーバ側関数も実行可。 |
| 4 | 加入禁止 | 管理者により加入が否認された状態。権限不要な関数のみ実行可能 |

### 状態決定表

| ①シート | ②memberId | ③加入禁止 | ④未審査 | **メンバ状態** |
| :-- | :-- | :-- | :-- | :-- |
| 未登録 | — | — | — | (未使用) |
| 登録済 | UUID | — | — | **仮登録** |
| 登録済 | e-mail | 該当 | — | **加入禁止** |
| 登録済 | e-mail | 非該当 | 該当 | **未審査** |
| 登録済 | e-mail | 非該当 | 非該当 | **加入中** |

※下表内の変数名はMemberLogのメンバ名

- ①シート：memberListシートに登録されているか
- ②memberId：メンバ識別子(文字列)の形式
- ③加入禁止：加入禁止されている<br>
  `0 < denial && Date.now() <= unfreezeDenial`
- ④未審査：管理者の認否が未決定<br>
  `approval === 0 && denial === 0`

### トリガーと処理

- 「🔢」はクライアント側(IndexedDB)の、「🧩」はサーバ側(シート)の項目・格納値
  - mID: memberId
  - CP : CPkey
  - 氏名 : メンバ氏名(ハンドルネーム)
  - dID : deviceId
  - SP : SPkey
  - 状態 : 処理による遷移先の状態名
- シーケンス図の下の表は、シーケンス図上のNoにおける処理終了時点での各変数の状態
- <span style="color:red">赤</span>字は前ステップからの変更点


#### 初回HTMLロード時

「初回HTMLロード時」とは、クライアント側でIndexedDB未作成・サーバ側SPkey未取得の状態を指す。

```mermaid
sequenceDiagram
  autonumber
  %%actor user
  %%participant localFunc
  %%participant clientMail
  %%participant IndexedDB
  %%participant cryptoClient
  participant authClient
  participant authServer
  %%participant cryptoServer
  participant Member
  %%participant serverFunc
  %%actor admin

  authClient->>+authServer: CPkey
  authServer->>+Member: CPkey

  alt CPkeyがMemberに未登録

    Member->>Member: deviceId生成、CPkey登録<br>memberId/氏名はダミーを仮登録
    Note right of Member: 仮登録

  end

  Member->>-authServer: deviceId
  authServer->>-authClient: SPkey,deviceId
  authClient->>authClient: SPkey,deviceId保存
```

| No  | 🔢mID | 🔢CP      | 🔢氏名  | 🔢dID    | 🔢SP | 🧩mID    | 🧩CP | 🧩氏名    | 🧩dID     | 🧩状態 |
| --: | :--   | :--       | :--    | :--     | :--  | :--      | :-- | :--      | :--      | :--   |
| 1   | —     | <b>有</b> | —      | —       | —    | —        | —  |  —       | —         | —     |
| 3   | —     | 有        | —      | —       | —    | <b>仮</b> | 有  | <b>仮</b> | <b>有</b> | 仮登録 |
| 6   |<b>仮</b>| 有      |<b>仮</b>|<b>有</b>|<b>有</b>| 仮     | 有  | 仮        | 有        | 仮登録 |

#### 初回処理要求時

「初回処理要求時」とは、初回HTMLロード時の処理終了後、初めての処理要求を出す状態を指す。

```mermaid
sequenceDiagram
  autonumber
  actor user
  %%participant localFunc
  participant clientMail
  %%participant IndexedDB
  %%participant cryptoClient
  participant authClient
  participant authServer
  %%participant cryptoServer
  participant Member
  participant serverFunc
  actor admin

  Note right of Member: 仮登録

  authClient->>+authServer: encryptedRequest<br>(仮mID+dID)
  authServer->>+Member: メンバ情報要求
  Member->>-authServer: メンバ情報(CPkey)
  authServer->>authServer: 復号、権限要否判断

  alt 権限不要なサーバ側処理要求

    authServer->>+serverFunc: 処理要求
    serverFunc->>-authServer: 処理結果
    authServer->>authClient: 処理結果

  else 権限が必要なサーバ側処理要求

    authServer->>authClient: 「仮登録」
    authClient->>user: ダイアログ表示
    user->>authClient: 氏名・メアド
    authClient->>authClient: IndexedDBに保存
    authClient->>authServer: 氏名・メアド
    authServer->>+Member: 氏名・メアド
    Member->>Member: 氏名・メアド保存
    Note right of Member: 仮登録⇒未審査
    Member->>-admin: 審査要求メール
    admin->>+Member: 審査結果記入
    Note right of Member: 未審査⇒加入中(未認証)<br>or 加入禁止
    Member->>-authServer: 審査結果
    authServer->>clientMail: 審査結果通知メール

    authServer->>-authClient: 審査結果

  end

```

| No  | 🔢mID | 🔢CP | 🔢氏名 | 🔢dID | 🔢SP | 🧩mID | 🧩CP | 🧩氏名 | 🧩dID | 🧩状態 |
| --: | :--   | :-- | :--   | :--   | :--  | :--  | :--  | :--   | :--   | :--   |
| 0   | 仮    | 有   | 仮    | 有    | 有   | 仮    | 有   | 仮    | 有    | 仮登録 |
| 11  |<b>有</b>| 有 |<b>有</b>| 有   | 有   | 仮    | 有   | 仮    | 有    | 仮登録 |
| 14  | 有    | 有   | 有    | 有    | 有   |<b>有</b>| 有 |<b>有</b>| 有    | 仮登録 |

## デバイスの状態遷移

メンバが加入承認後、使用するデバイスの状態遷移

※ 上述の未使用から加入まではメンバ単位の状態遷移。マルチデバイス対応のため、認証状態はデバイス単位で管理。

### 状態遷移図

```mermaid
%% メンバ状態遷移図

stateDiagram-v2
  direction LR
  [*] --> 未認証 : 処理要求
  未認証 --> 試行中 : 認証要求
  試行中 --> 未認証 : CPkey更新
  試行中 --> 認証中 : 認証成功
  試行中 --> 試行中 : 再試行
  試行中 --> 試行中 : パスコード再発行
  認証中 --> 未認証 : 認証失効 or CPkey更新
  試行中 --> 凍結中 : 認証失敗
  凍結中 --> 凍結中 : CPkey更新
  凍結中 --> 未認証 : 凍結解除
```

### 状態一覧

| No | 状態 | 説明 |
| --: | :-- | :-- |
| 1 | 未認証 | 未認証(未ログイン)で権限が必要な処理は行えない状態 |
| 2 | 試行中 | パスコードによる認証を試行している状態 |
| 3 | 認証中 | 認証が通り(ログイン)、権限の範囲内で要権限サーバ側関数も使用できる状態 |
| 4 | 凍結中 | 規定の試行回数連続して認証に失敗し、再認証要求が禁止された状態 |

### 状態決定表

| ⑤認証中 | ⑥凍結中 | ⑦未認証 | デバイス状態 |
| :-- | :-- | :-- | :-- |
| 該当 | — | — | **認証中** |
| 非該当 | 該当 | — | **凍結中** |
| 非該当 | 非該当 | 該当 | **未認証** |
| 非該当 | 非該当 | 非該当 | **試行中** |

※下表内の変数名はMemberLogのメンバ名

- ⑤認証中：パスコード認証に成功し認証有効期間内<br>
  `0 < approval && Date.now() ≦ loginExpiration`
- ⑥凍結中：凍結期間内<br>
  `0 < approval && 0 < loginFailure && loginFailure < Date.now() && Date.now() <= unfreezeLogin`
- ⑦未認証：加入承認後認証要求されたことが無い<br>
  `0 < approval && loginRequest === 0`

### トリガーと処理

以下は初回処理要求後に加入承認されたメンバであることが前提。

```mermaid
sequenceDiagram
  autonumber
  actor user
  %%participant localFunc
  participant clientMail
  %%participant IndexedDB
  %%participant cryptoClient
  participant authClient
  participant authServer
  participant cryptoServer
  participant Member
  participant serverFunc
  actor admin

  authClient->>authServer: encryptedRequest
  authServer->>Member: memberId,deviceId
  Member->>authServer: authResponse

  %% 処理要求の復号

  authServer->>cryptoServer: encryptedRequest
  cryptoServer->>authServer: authRequest

  rect rgb(255,214,214)
    Note over authClient,Member: CPkey更新
    authServer->>authClient: CPkey更新要求
    authClient->>authClient: 新CPkey作成(IndexedDBの変更は保留)
    authClient->>authServer: 新CPkey
    authServer->>Member: 新CPkey
    Member->>Member: CPkey変更
    Member->>authServer: 更新終了通知
    authServer->>authClient: 更新終了通知
    authClient->>authClient: CPkey更新
    authClient->>authServer: encryptedRequest(再送)
  end

  rect rgba(213, 246, 229, 1)
    Note over authClient,Member: パスコード再発行
    authClient->>authServer: パスコード再発行要求
    %% いまここ
  end

  Note over authClient,Member: 一般的処理要求

  alt 凍結中
    Note right of Member: 凍結中
    authServer->>authClient: 「凍結中」
  end

  alt 未認証
    authServer->>Member: 新規試行
    Note right of Member: 未認証⇒試行中
    Member->>authServer: パスコード
    authServer->>clientMail: パスコード通知メール
    authServer->>authClient: 「試行中」
  end

  alt 認証中
    Note right of Member: 認証中
    authServer->>serverFunc: authRequest
    serverFunc->>authServer: authResponse
    authServer->>authClient: authResponse
  end

  alt 試行中
    Note right of Member: 試行中
    authServer->>authClient: 「試行中」
    authClient->>user: パスコード入力ダイアログ
    user->>authClient: パスコード
    authClient->>authServer: パスコード
    authServer->>Member: パスコード
    Note right of Member: 試行中⇒認証中<br>or試行中or凍結中
    Member->>authServer: 「認証中」or「試行中」or「凍結中」
  end
```

- ③authResponse
  - response = 該当者/デバイスのMemberインスタンス
  - status = 通常は"normal"(文字列)。CPkey期限切れならError.message="CPkey expired"
- ⑦新CPkey作成：authClient.IndexedDBの更新はこの時点では無く、authServerからの⑫変更終了通知を待って行う
- ⑲終了後は④に戻って状態別の処理を実行
