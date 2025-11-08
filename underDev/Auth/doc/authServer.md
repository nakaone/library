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
| cf | ⭕ | [authServerConfig](authServerConfig.md#authserverconfig_internal) | null | 動作設定変数(config) |  | 
| prop | ⭕ | [authScriptProperties](authScriptProperties.md#authscriptproperties_internal) | null | 鍵ペア等を格納 |  | 
| crypto | ⭕ | [cryptoServer](cryptoServer.md#cryptoserver_internal) | null | 暗号化・復号用インスタンス |  | 
| member | ⭕ | [Member](Member.md#member_internal) | null | 対象メンバのインスタンス |  | 
| audit | ⭕ | [authAuditLog](authAuditLog.md#authauditlog_internal) | null | 監査ログのインスタンス |  | 
| error | ⭕ | [authErrorLog](authErrorLog.md#autherrorlog_internal) | null | エラーログのインスタンス |  | 
| pv | ⭕ | Object | {} | authServer内共通変数 |  | 


🧱 <span id="authserver_method">authServer メソッド一覧</span>

| メソッド名 | 型 | 内容 |
| :-- | :-- | :-- |
| [constructor](#authserver_constructor) | private | コンストラクタ |
| [callFunction](#authserver_callfunction) | public | authServerConfig.funcを参照し、該当関数を実行 |
| [exec](#authserver_exec) | public | doPostから呼ばれ、authClientからの要求を処理 |
| [listNotYetDecided](#authserver_listnotyetdecided) | static | 加入認否未定メンバのリストアップと認否入力 |
| [loginTrial](#authserver_logintrial) | public | ログイン要求を処理し、試行結果をMemberTrialに記録 |
| [membershipRequest](#authserver_membershiprequest) | public | 新規メンバ加入要求を登録、管理者へメール通知。 |
| [notifyAcceptance](#authserver_notifyacceptance) | public | 加入審査状況の問合せへの回答 |
| [resetSPkey](#authserver_resetspkey) | static | 【緊急時用】authServerの鍵ペアを更新 |
| [responseSPkey](#authserver_responsespkey) | public | クライアントからのSPkey要求への対応 |
| [setupEnvironment](#authserver_setupenvironment) | static | GAS初回実行時の権限確認を含む初期環境の整備 |
| [updateCPkey](#authserver_updatecpkey) | public | CPkey更新処理 |

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
    | cf | authServerConfig | null | **new [authServerConfig](authServerConfig.md#authserverconfig_constructor)(config)** |
    | prop | authScriptProperties | null | **new [authScriptProperties](authScriptProperties.md#authscriptproperties_constructor)(config)** |
    | crypto | cryptoServer | null | **new [cryptoServer](cryptoServer.md#cryptoserver_constructor)(config)** |
    | member | Member | null | **new [Member](Member.md#member_constructor)(config)** |
    | audit | authAuditLog | null | — |
    | error | authErrorLog | null | — |
    | pv | Object | {} | **空オブジェクト** |

### <span id="authserver_constructor_returns">📤 戻り値</span>

  - [authServer](authServer.md#authserver_internal): サーバ側auth中核クラス
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | cf | authServerConfig | null | — |
    | prop | authScriptProperties | null | — |
    | crypto | cryptoServer | null | — |
    | member | Member | null | — |
    | audit | authAuditLog | null | — |
    | error | authErrorLog | null | — |
    | pv | Object | {} | — |

## <span id="authserver_callfunction">🧱 <a href="#authserver_method">authServer.callFunction()</a></span>

authServerConfig.funcを参照し、該当関数を実行

### <span id="authserver_callfunction_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authserver_callfunction_process">🧾 処理手順</span>



### <span id="authserver_callfunction_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

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

- ログ出力準備
  - インスタンス変数"audit"に監査ログインスタンスを作成(audit = new [authAuditLog()](authAuditLog.md#authauditlog_constructor))
  - インスタンス変数"error"にエラーログインスタンスを作成(error = new [authErrorLog()](authErrorLog.md#autherrorlog_constructor))

■ 中核処理(coreブロック)

- 復号・署名検証
  - "v.dr = [crypto.decrypt](cryptoServer.md#cryptoserver_decrypt)(request)"を実行
  - "v.dr.result === 'normal'の場合、"v.request = v.dr.request"を実行
  - "v.dr.result === 'fatal'"の場合、'throw new Error(v.dr.message)'を実行
  - "v.dr.result === 'warning' && v.dr.message === 'maybe CPkey'"の場合、SPkey発行処理を実行
    - 'v.response = [responseSPkey](#authserver_responsespkey)'を実行
    - "v.response.result === 'normal'"の場合、中核処理を抜ける
    - "v.response.result === 'fatal'"の場合、'throw new Error(v.response.message)'を実行

- 重複リクエストチェック
  - authScriptProperties.requestLogで重複リクエストをチェック いまここ
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
- [audit.log](authAuditLog.md#authauditlog_log)で監査ログ出力

■ 異常終了時処理(catch句内の処理)
- [error.log](authErrorLog.md#autherrorlog_log)でエラーログ出力

### <span id="authserver_exec_returns">📤 戻り値</span>

  - [encryptedResponse](encryptedResponse.md#encryptedresponse_internal): 暗号化された処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | ciphertext | string | 【必須】 | — |

## <span id="authserver_listnotyetdecided">🧱 <a href="#authserver_method">authServer.listNotYetDecided()</a></span>

加入認否未定メンバのリストアップと認否入力

### <span id="authserver_listnotyetdecided_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authserver_listnotyetdecided_process">🧾 処理手順</span>

- ログ出力準備
  - インスタンス変数"audit"に監査ログインスタンスを作成(audit = new [authAuditLog()](authAuditLog.md#authauditlog_constructor))
  - インスタンス変数"error"にエラーログインスタンスを作成(error = new [authErrorLog()](authErrorLog.md#autherrorlog_constructor))

■ 正常終了時処理
- [audit.log](authAuditLog.md#authauditlog_log)で監査ログ出力

■ 異常終了時処理(catch句内の処理)
- [error.log](authErrorLog.md#autherrorlog_log)でエラーログ出力

### <span id="authserver_listnotyetdecided_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

## <span id="authserver_logintrial">🧱 <a href="#authserver_method">authServer.loginTrial()</a></span>

ログイン要求を処理し、試行結果をMemberTrialに記録

### <span id="authserver_logintrial_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authserver_logintrial_process">🧾 処理手順</span>



### <span id="authserver_logintrial_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

## <span id="authserver_membershiprequest">🧱 <a href="#authserver_method">authServer.membershipRequest()</a></span>

新規メンバ加入要求を登録、管理者へメール通知。

Member.setMember()に代替？

### <span id="authserver_membershiprequest_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authserver_membershiprequest_process">🧾 処理手順</span>



### <span id="authserver_membershiprequest_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

## <span id="authserver_notifyacceptance">🧱 <a href="#authserver_method">authServer.notifyAcceptance()</a></span>

加入審査状況の問合せへの回答

### <span id="authserver_notifyacceptance_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authserver_notifyacceptance_process">🧾 処理手順</span>



### <span id="authserver_notifyacceptance_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

## <span id="authserver_resetspkey">🧱 <a href="#authserver_method">authServer.resetSPkey()</a></span>

【緊急時用】authServerの鍵ペアを更新

### <span id="authserver_resetspkey_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authserver_resetspkey_process">🧾 処理手順</span>

- ログ出力準備
  - インスタンス変数"audit"に監査ログインスタンスを作成(audit = new [authAuditLog()](authAuditLog.md#authauditlog_constructor))
  - インスタンス変数"error"にエラーログインスタンスを作成(error = new [authErrorLog()](authErrorLog.md#autherrorlog_constructor))

■ 正常終了時処理
- [audit.log](authAuditLog.md#authauditlog_log)で監査ログ出力

■ 異常終了時処理(catch句内の処理)
- [error.log](authErrorLog.md#autherrorlog_log)でエラーログ出力

### <span id="authserver_resetspkey_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

## <span id="authserver_responsespkey">🧱 <a href="#authserver_method">authServer.responseSPkey()</a></span>

クライアントからのSPkey要求への対応

### <span id="authserver_responsespkey_caller">📞 呼出元</span>

- [authServer.exec()](authServer.md#authserver_responsespkey)

### <span id="authserver_responsespkey_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authserver_responsespkey_process">🧾 処理手順</span>



### <span id="authserver_responsespkey_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

## <span id="authserver_setupenvironment">🧱 <a href="#authserver_method">authServer.setupEnvironment()</a></span>

GAS初回実行時の権限確認を含む初期環境の整備

- 「インストール型トリガー」認可トークン失効時も本メソッドを実行

### <span id="authserver_setupenvironment_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authserver_setupenvironment_process">🧾 処理手順</span>

- ログ出力準備
  - インスタンス変数"audit"に監査ログインスタンスを作成(audit = new [authAuditLog()](authAuditLog.md#authauditlog_constructor))
  - インスタンス変数"error"にエラーログインスタンスを作成(error = new [authErrorLog()](authErrorLog.md#autherrorlog_constructor))

■ 正常終了時処理
- [audit.log](authAuditLog.md#authauditlog_log)で監査ログ出力

■ 異常終了時処理(catch句内の処理)
- [error.log](authErrorLog.md#autherrorlog_log)でエラーログ出力

### <span id="authserver_setupenvironment_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |

## <span id="authserver_updatecpkey">🧱 <a href="#authserver_method">authServer.updateCPkey()</a></span>

CPkey更新処理

### <span id="authserver_updatecpkey_param">📥 引数</span>


| 項目名 | 任意 | データ型 | 既定値 | 説明 |
| :-- | :--: | :-- | :-- | :-- |
| arg | ⭕ | Object | {} | ユーザ指定の設定値 | 

### <span id="authserver_updatecpkey_process">🧾 処理手順</span>



### <span id="authserver_updatecpkey_returns">📤 戻り値</span>

  - [authResponse](authResponse.md#authresponse_internal): 暗号化前の処理結果
    | 項目名 | データ型 | 生成時 | 正常終了 |
    | :-- | :-- | :-- | :-- |
    | timestamp | number | Date.now() | — |
    | result | string | normal | — |
    | message | string | 【任意】 | — |
    | request | authRequest | 【任意】 | — |
    | response | any | 【任意】 | — |