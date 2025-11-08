<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [cryptoClient](cryptoClient.md) | [authServer](authServer.md) |  [cryptoServer](cryptoServer.md) |  [Member](Member.md) | [クラス一覧](classes.md#list) | [JSLib](JSLib.md)

</div>

# <span id="authserver">authServer クラス仕様書</span>

<div style="text-align:right">

[設計方針](#authserver_policy) | [実装・使用例](#authserver_example) | [メンバ一覧](#authserver_internal) | [メソッド一覧](#authserver_method)

</div>

## <span id="authserver_summary">🧭 概要</span>

サーバ側auth中核クラス

authServerは、クライアント(authClient)からの暗号化通信リクエストを復号・検証し、
メンバ状態と要求内容に応じてサーバ側処理を適切に振り分ける中核関数です。

### <span id="authserver_policy">設計方針</span>

- staticメソッドを利用するため、クラスとする
- doPostからはauthServer.execを呼び出す

#### <a name="outputLog">🗒️ ログ出力仕様</a>

| 種別 | 保存先 | 内容 |
| :-- | :-- | :-- |
| requestLog | ScriptProperties (TTL短期) | [authRequestLog](typedef.md#authrequestlog)記載項目 |
| errorLog | Spreadsheet(authServerConfig.errorLog) | [authErrorLog](typedef.md#autherrorlog)記載項目 |
| auditLog | Spreadsheet(authServerConfig.auditLog) | [authAuditLog](typedef.md#authauditlog)記載項目 |

■ ログ出力のタイミング

| ログ種別 | タイミング | 理由 |
| :-- | :-- | :-- |
| **auditLog** | authServer各メソッド完了時 | イベントとして記録。finallyまたはreturn前に出力 |
| **errorLog** | authServer各メソッドからの戻り値がfatal、または予期せぬエラー発生時 | 原因箇所特定用。catch句内に記載 |

### <span id="authserver_example">実装・使用例</span>

```js
// ライブラリ関数定義
function devTools(){...}; // (中略)

// authServer関係クラス定義
class authServer{...};
class cryptoServer{...};
class Member{...};  // (中略)

// グローバル変数定義
const dev = devTools();
const asv = authServer({
  // プロジェクト毎の独自パラメータ
});

// Webアプリ定義
function doPost(e) {
  const rv = asv.exec(e.postData.contents); // 受け取った本文(文字列)
  if( rv !== null ){ // fatal(無応答)の場合はnullを返す
    return ContentService
      .createTextOutput(rv);
  }
}

// スプレッドシートメニュー定義
const ui = SpreadsheetApp.getUi();
ui.createMenu('追加したメニュー')
  .addItem('加入認否入力', 'menu10')
  .addSeparator()
  .addSubMenu(ui.createMenu("システム関係")
    .addItem('実行環境の初期化', 'menu21')
    .addItem("【緊急】鍵ペアの更新", "menu22")
  )
  .addToUi();
const menu10 = () => asv.listNotYetDecided();
const menu21 = () => asv.setupEnvironment();
const menu22 = () => asv.resetSPkey();
```

### 🧩 <span id="authserver_internal">内部構成</span>

🔢 authServer メンバ一覧

| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| cf | ❌ | [authServerConfig](authServerConfig.md#authserverconfig_internal) | — | 動作設定変数(config) |  | 
| prop | ❌ | [authScriptProperties](authScriptProperties.md#authscriptproperties_internal) | — | 鍵ペア等を格納 |  | 
| crypto | ❌ | [cryptoServer](cryptoServer.md#cryptoserver_internal) | — | 暗号化・復号用インスタンス |  | 
| member | ❌ | [Member](Member.md#member_internal) | — | 対象メンバのインスタンス |  | 
| audit | ❌ | [authAuditLog](authAuditLog.md#authauditlog_internal) | — | 監査ログのインスタンス |  | 
| error | ❌ | [authErrorLog](authErrorLog.md#autherrorlog_internal) | — | エラーログのインスタンス |  | 
| pv | ❌ | Object | — | authServer内共通変数 |  | 


🧱 <span id="authserver_method">authServer メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authserver_constructor) | private | コンストラクタ |
| [exec](#authserver_exec) | public | doPostから呼ばれ、authClientからの要求を処理 |
| [decodeRequest](#authserver_decoderequest) | private | クライアントからの要求を解読 |

## <span id="authserver_constructor">🧱 <a href="#authserver_method">authServer.constructor()</a></span>

コンストラクタ

### <span id="authserver_constructor_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| config | ⭕ | [authServerConfig](authServerConfig.md#authserverconfig_internal) | {}(空オブジェクト) | authClientの動作設定変数 | 

### <span id="authserver_constructor_process">🧾 処理手順</span>

- インスタンス変数の設定

  - [authServer](authServer.md#authserver_internal): サーバ側auth中核クラス
    | 項目名 | データ型 | 生成時 | 設定内容 |
    | :-- | :-- | :-- | :-- |
    | cf | authServerConfig | 【必須】 | **new [authServerConfig](authServerConfig.md#authserverconfig_constructor)(config)** |
    | prop | authScriptProperties | 【必須】 | **new [authScriptProperties](authScriptProperties.md#authscriptproperties_constructor)(config)** |
    | crypto | cryptoServer | 【必須】 | **new [cryptoServer](cryptoServer.md#cryptoserver_constructor)(config)** |
    | member | Member | 【必須】 | **new [Member](Member.md#member_constructor)(config)** |
    | audit | authAuditLog | 【必須】 | — |
    | error | authErrorLog | 【必須】 | — |
    | pv | Object | 【必須】 | **空オブジェクト** |

### <span id="authserver_constructor_returns">📤 戻り値</span>

  - [authServer](authServer.md#authserver_internal): サーバ側auth中核クラス
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | cf | authServerConfig | 【必須】 | — |
    | prop | authScriptProperties | 【必須】 | — |
    | crypto | cryptoServer | 【必須】 | — |
    | member | Member | 【必須】 | — |
    | audit | authAuditLog | 【必須】 | — |
    | error | authErrorLog | 【必須】 | — |
    | pv | Object | 【必須】 | — |

## <span id="authserver_exec">🧱 <a href="#authserver_method">authServer.exec()</a></span>

doPostから呼ばれ、authClientからの要求を処理

- authClientからの処理要求を受け、復号後サーバ内関数に処理を依頼、結果がfatalでなければ暗号化してauthClientに返す。
- 結果がfatalの場合はログに出力して何も返さない。

### <span id="{cc}_source">📄 実装例</span>

```js
exec(request){
  const v = {whois:pv.whois+'exec',rv:null,
    request: null,  // {authRequest} 平文の処理要求
    response:null,  // {authResponse} 平文の処理結果
  }
  try {
    core: { // 中核処理
      v.dr = crypto.decrypt(request);
      if( v.dr instanceof Error ) throw v.dr; // 復号された要求
      if( v.dr.result === 'warning' && v.dr.message === 'maybe CPkey' ){
        // CPkeyが平文で要求された場合
        v.response = responseSPkey(v.dr.request); // SPkeyを返す
        if ( v.response.result === 'normal' ){
          break core; // 中核処理を抜ける
        } else {
          throw new Error(v.response.message);
        }
      }
      // 中略
    }

    // 正常終了時処理
    v.rv = crypto.encrypt(v.response);  // 処理結果を暗号化
    audit.log(v.response);  // 監査ログ出力
    return v.rv;

  } catch(e) {
    // 異常終了時処理
    error.log(e); // エラーログを出力し、何も返さない
  }
}
```

### <span id="authserver_exec_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| request | ❌ | string | — | CPkeyまたは暗号化された処理要求 | 

### <span id="authserver_exec_process">🧾 処理手順</span>

■ 中核処理(coreブロック)

- 1. 復号・署名検証
  - "v.dr = [crypto.decrypt](cryptoServer.md#cryptoserver_decrypt)(request)"を実行
  - "v.dr.result === 'normal'の場合、"v.request = v.dr.request"を実行
  - "v.dr.result === 'fatal'"の場合、'throw new Error(v.dr.message)'を実行
  - "v.dr.result === 'warning' && v.dr.message === 'maybe CPkey'"の場合、SPkey発行処理を実行
    - 'v.response = [responseSPkey](#authserver_responsespkey)'を実行
    - "v.response.result === 'normal'"の場合、中核処理を抜ける
    - "v.response.result === 'fatal'"の場合、'throw new Error(v.response.message)'を実行

- 2. 重複リクエストチェック
  - authScriptProperties.requestLogで重複リクエストをチェック
  - エラーならエラーログに出力
    - authErrorLog.result = 'fatal'
    - authErrorLog.message = 'Duplicate requestId'
  - authServerConfig.requestIdRetention以上経過したリクエスト履歴は削除
  - Errorをthrowして終了
- 3. authClient内発処理判定
  - authRequest.funcが以下に該当するなら内発処理としてメソッドを呼び出し、その戻り値をpv.rvにセット
    |  | authRequest.func | authServer.method |
    | :-- | :-- | :-- |
    | CPkey更新 | ::updateCPkey:: | updateCPkey() |
    | パスコード入力 | ::passcode:: | loginTrial() |
    | 新規登録要求 | ::newMember:: | Member.setMember() |
    | パスコード再発行 | ::reissue:: | Member.reissuePasscode() |
- 4. サーバ側関数の存否チェック
  - authServerConfig.funcのメンバ名に処理要求関数名(authRequest.func)が無ければError('no func:'+authRequest.func)をthrow
- 5. サーバ側関数の権限要否を判定
  - authServerConfig.func[処理要求関数名].authority === 0ならcallFunctionメソッドを呼び出し、その戻り値をpv.rvにセット
- 6. メンバ・デバイスの状態により処理分岐
  - 当該メンバの状態を確認(Member.getStatus())
  - 以下の表に従って処理分岐、呼出先メソッドの戻り値をpv.rvにセット
    No | 状態 | 動作
    :-- | :-- | :--
    1 | 未加入 | memberList未登録<br>⇒ membershipRequest()メソッドを呼び出し
    2 | 未審査 | memberList登録済だが、管理者による加入認否が未決定(=加入審査状況の問合せ)<br>⇒ notifyAcceptance()メソッドを呼び出し
    3 | 審査済 | 管理者による加入認否が決定済<br>⇒ notifyAcceptance()メソッドを呼び出し
    4.1 | 未認証 | 認証(ログイン)不要の処理しか行えない状態。<br>無権限で行える処理 ⇒ callFunction()メソッドを呼び出し<br>無権限では行えない処理 ⇒ loginTrial()メソッドを呼び出し
    4.2 | 試行中 | パスコードによる認証を試行している状態<br>⇒ loginTrial()メソッドを呼び出し
    4.3 | 認証中 | 認証が通り、ログインして認証が必要な処理も行える状態<br>⇒ callFunction()メソッドを呼び出し
    4.4 | 凍結中 | 規定の試行回数連続して認証に失敗し、再認証要求が禁止された状態<br>⇒ loginTrial()メソッドを呼び出し
    5 | 加入禁止 | 管理者により加入が否認された状態<br>⇒ notifyAcceptance()メソッドを呼び出し




■ 正常終了時処理

■ 異常終了時処理(catch句内の処理)

### <span id="authserver_exec_returns">📤 戻り値</span>

  - [encryptedResponse](encryptedResponse.md#encryptedresponse_internal): 暗号化された処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | ciphertext | string | 【必須】 | — |

## <span id="authserver_decoderequest">🧱 <a href="#authserver_method">authServer.decodeRequest()</a></span>

クライアントからの要求を解読

### <span id="authserver_decoderequest_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| str | ❌ | string | — | クライアント側から送られたCPkey | 

### <span id="authserver_decoderequest_process">🧾 処理手順</span>

- SPkey要求判定：引数"str"のオブジェクト化を試行
  - オブジェクト化失敗の場合
    - strがCPkey文字列として適切か判定
      - 不適切なら戻り値「不正文字列」を返して終了 -> Error
      - 適切ならMember.addMember(仮登録要求)を行い、それを戻り値とする -> authResponse
  - オブジェクト化成功の場合
    - encryptedRequest形式でないなら「形式不正」
    - memberIdから対象者のMemberインスタンスを取得<br>
       "member = member.[getMember](Member.md#member_getmember)(memberId)"
    - 取得不能なら「未登録メンバ」
    - cryptoServer.decrypt -> authRequest
    - 

       

  - [MemberLog](MemberLog.md#memberlog_internal): メンバの各種要求・状態変化の時刻
    | 項目名 | データ型 | 生成時 | 更新内容 |
    | :-- | :-- | :-- | :-- |
    | joiningRequest | number | Date.now() | — |
    | approval | number | 【必須】 | **examined === true ? Date.now() : 0** |
    | denial | number | 【必須】 | **0** |
    | loginRequest | number | 【必須】 | — |
    | loginSuccess | number | 【必須】 | — |
    | loginExpiration | number | 【必須】 | — |
    | loginFailure | number | 【必須】 | — |
    | unfreezeLogin | number | 【必須】 | — |
    | joiningExpiration | number | 【必須】 | **現在日時(UNIX時刻)＋authServerConfig.memberLifeTime** |
    | unfreezeDenial | number | 【必須】 | **0** |

### <span id="authserver_decoderequest_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正答時 | 誤答・再挑戦可 | 誤答・再挑戦不可 |
    | :-- | :-- | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — | — | — |
    | result | string | normal | **normal** | **warning** | **fatal** |
    | message | string | 【任意】 | — | — | — |
    | request | authRequest | 【任意】 | 引数"request" | 引数"request" | 引数"request" |
    | response | any | 【任意】 | — | — | — |