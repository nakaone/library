<p id="top" class="l1">"auth"総説</p>

<div class="submenu">

[要求仕様](#require) | [用語](#dictionary) | [処理手順概要](#protocol)

</div>

"Auth"とは利用者(メンバ)がブラウザからサーバ側処理要求を発行、サーバ側は二要素認証を行ってメンバの権限を確認の上サーバ側の処理結果を返す、クライアント・サーバにまたがるシステムである。

```mermaid
sequenceDiagram
  autonumber
  participant dv as device
  participant cl as authClient
  participant sv as authServer
  participant ap as server

  dv->>+cl: 処理要求
  cl->>+sv: 認証要求
  sv->>-dv: パスコード通知メール
  dv->>cl: パスコード入力
  cl->>+sv: パスコード
  sv->>cl: 認証OK
  cl->>sv: 処理要求
  sv->>sv: ユーザの権限確認
  sv->>+ap: 処理要求
  ap->>-sv: 処理結果
  sv->>-cl: 処理結果
  cl->>-dv: 処理結果
```

なおメンバがserverのどの機能を使用可能か(権限)は、管理者が事前にメンバ一覧(Google Spread)上で設定を行う。

## <span id="require"><a href="#top">要求仕様</a></span>

- 本システムは限られた人数のサークルや小学校のイベント等での利用を想定する。<br>
  よってセキュリティ上の脅威は極力排除するが、一定水準の安全性・恒久性を確保した上で導入時の容易さ・技術的ハードルの低さ、運用の簡便性を重視する。
- 「セキュリティ上の脅威」として以下を想定、対策する。逆に想定外の攻撃は対策対象としない。
  - 想定する攻撃：盗聴、中間者攻撃、端末紛失、リプレイ、誤設定
  - 想定外の攻撃：高度持続的攻撃（APT）、大規模DoS、root化端末での攻撃、端末・サーバへの物理侵入
- サーバ側(以下authServer)はスプレッドシートのコンテナバインドスクリプト、クライアント側(以下authClient)はHTMLのJavaScript
- サーバ側・クライアント側とも鍵ペアを使用
- サーバ側の動作環境設定・鍵ペアはScriptProperties、クライアント側はIndexedDBに保存
- 原則として通信は受信側公開鍵で暗号化＋発信側秘密鍵で署名
- クライアントの識別(ID)はメールアドレスで行う
- 日時は特段の注記が無い限り、UNIX時刻でミリ秒単位で記録(`new Date().getTime()`)
- [メンバ情報](sv/Member.md#member_members)はスプレッドシートに保存
- 定義したクラスのインスタンス変数は、セキュリティ強度向上のため特段の記述がない限りprivateとする
- 日時は特段の指定が無い限り全てUNIX時刻(number型)。比較も全てミリ秒単位で行う

## <span id="dictionary"><a href="#top">用語</a></span>

- メンバ、デバイス：「メンバ」とは利用者を、「デバイス」とは利用者が使用する端末を指す。マルチデバイス対応のためメンバ：デバイスは"1:n"対応となる。<br>
  メンバはメールアドレスで識別し、デバイスはauthClient呼出時に自動設定されるUUIDで識別する。
- SPkey, SSkey：サーバ側の公開鍵(Server side Public key)と秘密鍵(Server side Secret key)
- CPkey, CSkey：クライアント側の公開鍵(Client side Public key)と秘密鍵(Client side Secret key)
- パスフレーズ：クライアント側鍵ペア作成時のキー文字列。JavaScriptで自動的に生成
- パスワード：運用時、クライアント(人間)がブラウザ上で入力する本人確認用の文字列
- パスコード：二段階認証実行時、サーバからクライアントに送られる6桁※の数字<br>
  ※既定値。実際の桁数はauthConfig.trial.passcodeLengthで規定
- 内発処理：ローカル関数からの要求に基づかない、authClientでの処理の必要上発生するauthServerへの問合せ

## <span id="protocol"><a href="#top">処理手順概要</a></span>

authでは概ね以下のような手順でクライアント(ブラウザ)からのサーバ側処理要求に対応する。

1. [CL]ローカル関数からの処理要求受付(authClient.exec)
1. [CL]SPkeyが無ければサーバ側から取得・格納
1. [CL]署名・暗号化を実施、処理要求をauthServerに転送
1. [SV]メンバ・デバイスの状態に応じて処理分岐
1. [CL]サーバ側処理結果を受けて処理分岐
   - 正常終了ならローカル関数に結果を返す
   - 異常終了(fatal)ならエラーメッセージ表示
   - 上記以外の場合
     1. 後続処理を実行(ex.SPkeyの格納)
     1. authClient.execを再帰呼出(ex.処理要求)
     1. 再帰呼出先の結果を戻り値として返す

例としてCPkeyが有効期限切れの場合の手順を示す(CL0~2は再帰呼出されたauthClient.exec)。

```mermaid
sequenceDiagram
  autonumber
  participant c0 as CL0
  participant c1 as CL1
  participant c2 as CL2
  participant sv as SV

  c0->>sv: 処理要求
  sv->>c0: [W06]要CPkey更新
  c0->>c0: CPkey更新処理
  c0->>c1: ::updateCPkey::
  c1->>sv: ::updateCPkey::
  sv->>c1: [W02]CPkey更新
  c1->>c2: 処理要求
  c2->>sv: 処理要求
  sv->>c2: [N01]処理結果
  c2->>c1: 処理結果
  c1->>c0: 処理結果
```

### クライアント側処理分岐先決定手順

<!--::$src/doc/decisionTable.client.md::-->

### サーバ側処理分岐先決定手順

<!--::$src/doc/decisionTable.server.md::-->
