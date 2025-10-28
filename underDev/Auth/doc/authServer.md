<div style="text-align: right;">

[総説](spec.md) | [authClient](authClient.md) | [authServer](authServer.md) | [cryptoClient](cryptoClient.md) | [cryptoServer](cryptoServer.md) | [Member](Member.md) | [データ型](typedef.md) | [内発処理](internalProcessing.md)

</div>

# authServer クラス仕様書

## <a name="summary">🧭 概要</a>

authServerは、クライアント(authClient)からの暗号化通信リクエストを復号・検証し、
メンバ状態と要求内容に応じてサーバ側処理を適切に振り分ける中核関数です。

### <a name="policy">設計方針</a>

- staticメソッドを利用するため、クラスとする
- doGetからは`authServer.exec`を呼び出す

### 🧩 <a name="internal">内部構成</a>

- 項目名末尾に「()」が付いているのはメソッド<br>
  (static:クラスメソッド、public:外部利用可、private:内部専用)

| 項目名 | データ型 | 内容 |
| :-- | :-- | :-- |
| cf | [authServerConfig](typedef.md#authserverconfig) | 動作設定変数(config) |
| sp | [authScriptProperties](typedef#authscriptproperties) | ScriptPropertiesに格納された設定値 |
| pv | Object | 汎用authServer内共有変数 |
| pv.crypto | [cryptoServer](typedef#cryptoserver) | サーバ用暗号化関係インスタンス |
| pv.member | [Member](typedef#member) | 処理対象メンバのMemberインスタンス |
| pv.audit | [authAuditLog](typedef#authauditlog) | 監査ログオブジェクト |
| pv.error | [authErrorLog](typedef#autherrorlog) | エラーログオブジェクト |
| [constructor()](#constructor) | private | コンストラクタ |
| [exec()](#exec) | public | doGetから呼ばれ、authClientからの要求を処理 |
| [membershipRequest()](#membershipRequest) | private | 新規メンバ加入要求を登録＋管理者へメール通知 |
| [notifyAcceptance()](#notifyAcceptance) | private | 加入審査状況の問合せへの回答 |
| [loginTrial()](#loginTrial) | private | ログイン要求を処理し、試行結果をMemberTrialに記録 |
| [callFunction()](#callFunction) | private | authServerConfig.funcを参照し、該当関数を実行 |
| [updateCPkey()](#updateCPkey) | private | CPkey更新処理 |
| [responseSPkey()](#responseSPkey) | private | クライアントからのSPkey要求への対応 |
| [setupEnvironment()](#setupEnvironment) | static | GAS初回実行時の権限確認を含む初期環境の整備 |
| [resetSPkey()](#resetSPkey) | static | 緊急時用。authServerの鍵ペアを更新 |
| [listNotYetDecided()](#listNotYetDecided) | static | 加入認否未定メンバのリストアップと認否入力 |

## <a name="constructor" href="#internal">🧱 constructor()</a>

### <a name="constructor-param">📥 引数</a>

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | config | ❌ | [authServerConfig](typedef.md#authserverconfig) | — | 動作設定変数(config) |

### <a name="constructor-returns">📤 戻り値</a>

- [authServer](#internal)

### <a name="constructor-process">🧾 処理手順</a>

- authServer内共有用の変数`pv`オブジェクトを用意
- `pv.crypto`にcryptoServerインスタンスを作成
- 監査ログ用に`pv.audit`に[authAuditLog](typedef.md#authAuditLog)インスタンスを作成
- エラーログ用に`pv.error`に[authErrorLog](typedef.md#authErrorLog)インスタンスを作成

## <a name="exec" href="#internal">🧱 exec()</a>

doGetから呼ばれ、authClientからの要求を処理。<br>
authClientからのencryptedRequestを受け、復号後メソッドに処理を依頼、結果がfatalでなければ暗号化してauthClientに返す。<br>
結果がfatalの場合はログに出力して何も返さない。

### <a name="exec-param">📥 引数</a>

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | request | ❌ | [encryptedRequest](typedef.md#encryptedrequest) | — | 暗号化された処理要求 |

### <a name="exec-returns">📤 戻り値</a>

- [encryptedResponse](typedef.md#encryptedresponse)

### <a name="exec-process">🧾 処理手順</a>

※ 「事前準備」後、pv.rvがセットされたら「戻り値の暗号化」手順までの処理はスキップ

- 1. 復号・署名検証
  - encryptedRequestを渡して[cryptoServer.decrypt](cryptoServer.md#decrypt)を呼び出し
  - 戻り値を`pv.decryptedRequest`に保存(後述「cryptoServer.decryptの処理結果」参照)
  - `pv.decryptedRequest.result === 'fatal'`なら`Error('decrypt failed')`をthrow
  - `pv.audit.reset`,`pv.error.reset`を実行、各インスタンス内のmemberId/deviceIdを確定
  - 復号したauthRequestを共通変数にセット(`pv.authRequest = pv.decryptedRequest.request`)
  - `pv.decryptedRequest.result === 'warning'`なら
    - `pv.rv = responseSPkey(pv.authRequest)`メソッドを呼び出し
    - `pv.rv.result === 'fatal'`なら`Error('Invalid CPkey')`をthrow
- 2. 重複リクエストチェック
  - authScriptProperties.requestLogで重複リクエストをチェック
  - エラーならエラーログに出力
    - `authErrorLog.result` = 'fatal'
    - `authErrorLog.message` = 'Duplicate requestId'
  - authServerConfig.requestIdRetention以上経過したリクエスト履歴は削除
  - Errorをthrowして終了
- 3. authClient内発処理判定
  - `authRequest.func`が以下に該当するなら内発処理としてメソッドを呼び出し、その戻り値を`pv.rv`にセット
    |  | authRequest.func | authServer.method |
    | :-- | :-- | :-- |
    | CPkey更新 | ::updateCPkey:: | updateCPkey() |
    | パスコード入力 | ::passcode:: | loginTrial() |
    | 新規登録要求 | ::newMember:: | Member.setMember() |
    | パスコード再発行 | ::reissue:: | Member.reissuePasscode() |
- 4. サーバ側関数の存否チェック
  - `authServerConfig.func`のメンバ名に処理要求関数名(`authRequest.func`)が無ければ`Error('no func:'+authRequest.func)`をthrow
- 5. サーバ側関数の権限要否を判定
  - `authServerConfig.func[処理要求関数名].authority === 0`ならcallFunctionメソッドを呼び出し、その戻り値を`pv.rv`にセット
- 6. メンバ・デバイスの状態により処理分岐
  - 当該メンバの状態を確認(`Member.getStatus()`)
  - 以下の表に従って処理分岐、呼出先メソッドの戻り値を`pv.rv`にセット
    No | 状態 | 動作
    :-- | :-- | :--
    1 | 未加入 | memberList未登録<br>⇒ `membershipRequest()`メソッドを呼び出し
    2 | 未審査 | memberList登録済だが、管理者による加入認否が未決定(=加入審査状況の問合せ)<br>⇒ `notifyAcceptance()`メソッドを呼び出し
    3 | 審査済 | 管理者による加入認否が決定済<br>⇒ `notifyAcceptance()`メソッドを呼び出し
    4.1 | 未認証 | 認証(ログイン)不要の処理しか行えない状態。<br>無権限で行える処理 ⇒ `callFunction()`メソッドを呼び出し<br>無権限では行えない処理 ⇒ `loginTrial()`メソッドを呼び出し
    4.2 | 試行中 | パスコードによる認証を試行している状態<br>⇒ `loginTrial()`メソッドを呼び出し
    4.3 | 認証中 | 認証が通り、ログインして認証が必要な処理も行える状態<br>⇒ `callFunction()`メソッドを呼び出し
    4.4 | 凍結中 | 規定の試行回数連続して認証に失敗し、再認証要求が禁止された状態<br>⇒ `loginTrial()`メソッドを呼び出し
    5 | 加入禁止 | 管理者により加入が否認された状態<br>⇒ `notifyAcceptance()`メソッドを呼び出し

#### cryptoServer.decryptの処理結果

No | 署名 | 復号 | 時差 | result | message | response
:--: | :-- | :-- | :-- | :-- | :-- | :--
1 | 一致 | 成功 | 誤差内 | normal | — | authRequest
2 | 一致 | 成功 | 誤差超 | fatal | Timestamp difference too large | —
3 | 一致 | 失敗 | — | fatal | decrypt failed | —
4 | 不一致 | 成功 | 誤差内 | warning | Signature unmatch | authRequest
5 | 不一致 | 成功 | 誤差超 | fatal | Timestamp difference too large | —
6 | 不一致 | 失敗 | — | fatal | decrypt failed | —

- 「時差」：`abs(Date.now() - request.timestamp) > allowableTimeDifference` ⇒ 誤差超
- No.4は加入申請(SPkey取得済・CPkey未登録)時を想定

#### エラー処理

- エラー発生時は必ず catch できるよう全体を try,catch で囲む
- catch句に渡されたErrorオブジェクトを[authErrorLog](typedef.md#authErrorLog)(pv.error.log)に渡してシートに出力

## <a name="membershipRequest" href="#internal">🧱 membershipRequest()</a>

<!-- Member.setMember()に代替？ -->

新規メンバ加入要求を登録。管理者へメール通知。

### <a name="membershipRequest-param">📥 引数</a>

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | request | ❌ | [authRequest](typedef.md#authrequest) | — | クライアント側からの処理要求オブジェクト |

### <a name="membershipRequest-returns">📤 戻り値</a>

- [authResponse](typedef.md#authresponse)<br>
  `={result:'warning',message:'registerd'}`<br>
    ⇒ authClientでメンバに「加入申請しました。管理者による加入認否結果は後程メールでお知らせします」表示

### <a name="membershipRequest-process">🧾 処理手順</a>

## <a name="notifyAcceptance" href="#internal">🧱 notifyAcceptance()</a>

加入審査状況の問合せへの回答

### <a name="notifyAcceptance-param">📥 引数</a>

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | request | ❌ | [authRequest](typedef.md#authrequest) | — | クライアント側からの処理要求オブジェクト |

### <a name="notifyAcceptance-returns">📤 戻り値</a>

- [authResponse](typedef.md#authresponse)

### <a name="notifyAcceptance-process">🧾 処理手順</a>

- 審査結果が未決定の場合(Member.log.approval/denialが両方0)、戻り値は`{result:'warning',message:'under review'}`<br>
  ⇒ authClientでメンバに「現在審査中です。今暫くお待ちください」表示
- 審査の結果加入不可の場合(Member.log.denial>0)、戻り値は`{result:'warning',message:'denial'}`<br>
  ⇒ authClientでメンバに「残念ながら加入申請は否認されました」表示

※ 審査結果が「加入OK」となっていた場合、Member.getStatus==='未認証'となるので、このメソッドは呼ばれない

## <a name="loginTrial" href="#internal">🧱 loginTrial()</a>

ログイン要求を処理し、試行結果をMemberTrialに記録

### <a name="loginTrial-param">📥 引数</a>

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | request | ❌ | [authRequest](typedef.md#authrequest) | — | クライアント側からの処理要求オブジェクト |

### <a name="loginTrial-returns">📤 戻り値</a>

- [authResponse](typedef.md#authresponse)

### <a name="loginTrial-process">🧾 処理手順</a>

- メンバが「未認証」の場合(=新たなログイン試行の場合)
  - 認証要求日時を設定(`Member.log.loginRequest = Date.now()`)
  - `Member.trial.log`の先頭に試行ログ(MemberTrialLogオブジェクト)を追加
  - パスコード通知メールをメンバに送信
  - 戻り値は`{result:'warning',message:'send passcode'}`<br>⇒ authClientはこれを受けパスコード再入力画面を表示
- メンバが「試行中」の場合、入力されたパスコードが正しいか検証
  - 正しかった場合
    - 認証成功日時を設定(`Member.log.loginSuccess = Date.now()`)
    - 認証有効期限を設定(`Member.log.loginExpiration = Date.now() + authServerConfig.loginLifeTime`)
  - 正しくなかった場合
    - 試行回数上限(authServerConfig.maxTrial)以下の場合
      - 戻り値は`{result:'warning',message:'unmatch'}`<br>⇒ authClientはこれを受けパスコード再入力画面を表示
    - 試行回数が上限に達した場合は「凍結中」に遷移
      - 認証失敗日時を設定(`Member.log.loginFailure = Date.now()`)
      - 認証無効期限を設定(`Member.log.unfreezeLogin = Date.now() + authServerConfig.loginFreeze`)
      - 戻り値は`{result:'warning',message:'freezing'}`<br>⇒ authClientはこれを受け「パスコードが連続して不一致だったため、現在アカウントは凍結中です。時間をおいて再試行してください」表示

## <a name="callFunction" href="#internal">🧱 callFunction()</a>

authServerConfig.funcを参照し、該当関数を実行

### <a name="callFunction-param">📥 引数</a>

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | request | ❌ | [authRequest](typedef.md#authrequest) | — | クライアント側からの処理要求オブジェクト |

### <a name="callFunction-returns">📤 戻り値</a>

- [authResponse](typedef.md#authresponse)
  |  | 正常時 | 異常時 |
  | :-- | :-- | :-- |
  | result | normal | fatal |
  | message | — | Error.message |
  | request | authRequest | authRequest |
  | response | 呼出先関数の戻り値 | — |

### <a name="callFunction-process">🧾 処理手順</a>

- 呼出先関数の戻り値がErrorオブジェクト
  - エラーログに結果を出力(`pv.error.log(呼出先関数の戻り値)`)
  - callFunctionの戻り値は上表の「異常時」
- 呼出先関数の戻り値がErrorオブジェクト以外
  - 監査ログに結果を出力(`pv.audit.log('responseSPkey')`)
  - callFunctionの戻り値は上表の「正常時」

## <a name="updateCPkey" href="#internal">🧱 updateCPkey()</a>

CPkey更新処理

### <a name="updateCPkey-param">📥 引数</a>

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | request | ❌ | [authRequest](typedef.md#authrequest) | — | CPkey更新要求 |

### <a name="updateCPkey-returns">📤 戻り値</a>

- [authResponse](typedef.md#authresponse)

### <a name="updateCPkey-process">🧾 処理手順</a>

- memberList上の該当するmemberId/deviceIdのCPkeyをauthRequest.signatureの値で更新する<br>
- 未更新のMember.CPkeyでencryptedResonseを作成し、authClientに返す<br>
- authClientはencryptedResonse受信時点では旧CPkeyで復号・署名検証を行い、サーバ側更新成功を受けてIndexedDBの更新を行う

<!-- Review: CPkey更新時に同時アクセスを防止するロック管理を追加検討。
⇒ ロック管理手順が複雑になりそうなこと、また運用上必要性が高いとは考えにくいことから見送り。
-->

## <a name="responseSPkey" href="#internal">🧱 responseSPkey()</a>

クライアントからのSPkey要求への対応

### <a name="responseSPkey-param">📥 引数</a>

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | request | ❌ | [authRequest](typedef.md#authrequest) | — | クライアント側から送られたSPkey要求 |

### <a name="responseSPkey-returns">📤 戻り値</a>

- [authResponse](typedef.md#authresponse)
  |  | 正常時 | 異常時 |
  | :-- | :-- | :-- |
  | result | normal | fatal |
  | message | — | Invalid public key |
  | request | authRequest | authRequest |
  | response | authScriptProperties.SPkey | — |

### <a name="responseSPkey-process">🧾 処理手順</a>

- クライアントからの受信内容が(encryptedRequestではなく)CPkey文字列と推定される場合は「正常時」のオブジェクトを返す
- 公開鍵として不適切な文字列の場合は[authErrorLog](typedef.md#authErrorLog)でエラー出力後、「異常時」のオブジェクトを返す
- 監査ログに結果を出力(`pv.audit.log('responseSPkey')`)

## <a name="setupEnvironment" href="#internal">🧱 setupEnvironment()</a>

GAS初回実行時の権限確認を含む初期環境の整備。「インストール型トリガー」認可トークン失効時も本メソッドを実行

### <a name="setupEnvironment-param">📥 引数</a>

無し

### <a name="setupEnvironment-returns">📤 戻り値</a>

無し

### <a name="setupEnvironment-process">🧾 処理手順</a>

- ScriptProperties未設定なら設定
- memberListへのアクセス(ダミー)
- admin宛テストメールの送信

## <a name="resetSPkey" href="#internal">🧱 resetSPkey()</a>

緊急時用。authServerの鍵ペアを更新

### <a name="resetSPkey-param">📥 引数</a>

無し

### <a name="resetSPkey-returns">📤 戻り値</a>

無し

### <a name="resetSPkey-process">🧾 処理手順</a>

## <a name="listNotYetDecided" href="#internal">🧱 listNotYetDecided()</a>

加入認否未定メンバのリストアップと認否入力

### <a name="listNotYetDecided-param">📥 引数</a>

無し

### <a name="listNotYetDecided-returns">📤 戻り値</a>

無し

### <a name="listNotYetDecided-process">🧾 処理手順</a>

- 加入否認が未定のメンバをリストアップ、順次認否入力のダイアログを表示
- 入力された認否をmemberListに記入(Member.log.approval/denial)
- 認否が確定したメンバに対して結果通知メールを発行

<!--
## <a name="">⏰ メンテナンス処理</a>

## <a name="">🔐 セキュリティ仕様</a>

## <a name="">🧾 エラーハンドリング仕様</a>
-->
