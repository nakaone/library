# authClient 関数 仕様書

- クロージャ関数として定義

## 概要

## メイン処理

- classのconstructor()に相当するメイン処理部分
- 鍵ペアの準備：IndexedDBから鍵ペアを取得、authClientのメンバ変数に格納。<br>
  IndexedDBに鍵ペアが無い場合は新たに生成し、生成時刻と共に保存
- IndexedDBからメールアドレスを取得、存在しなければダイアログから入力
- IndexedDBからメンバの氏名を取得、存在しなければダイアログから入力
- SPkey未取得ならサーバ側に要求
- 更新した内容はIndexedDBに書き戻す
- SPkey取得がエラーになった場合、SPkey以外は書き戻す

```js
/**
 * @param {void}
 * @returns {Object.<string,Function>} 使用可能なメソッド
 */
```

## joining() : 加入要求

- 加入申請済かどうかで、以下の①②に分岐<br>
  `IndexedDB.ApplicationForMembership < 0 ⇒ 未申請`
- 加入未申請だった場合
  - 加入要求(`func="membershipRequest"`)としてCPkeyとmemberId(メールアドレス)をSPkeyで暗号化してサーバ側に送信する
  - 待機時間を超えたらError
  - IndexedDBに加入申請日時を記録
  - 処理要求中フラグ=false
- 加入申請済だった場合
  - 加入審査結果問合せ(`func="examinationResultInquiry"`)をサーバ側に送信
  - 加入可否に関わらずIndexedDB・メンバ変数のアカウント有効期限・CPkey有効期限をサーバ側の戻り値で更新
  - 加入NGだった場合はリトライするかダイアログで意思確認

```js
/**
 * @param {void}
 * @returns {null|Error}
 */
```

## requestLogin() : ログイン要求

- authServer.loginTrialに`{func:"loginRequest"}`を送信


<!-- 以降、未チェック -->

## request() : 処理要求

## inCaseOfWarning() : authResponse.result==warningだった場合の処理

authResponse.messageに従い、accountExpired/updateCPkey/loginに処理分岐

## accountExpired() : アカウント有効性確認(アカウント有効期限切れ対応)

## updateCPkey() : 署名有効期限確認(CPkey有効期限切れ対応)

1. 鍵ペアを再作成し、改めて送信
2. CPkey再登録・ログイン終了後、改めて要求を送信

## login() : セッション状態確認(未ログイン)

1. ダイアログを表示、authServerからのパスコード通知メールを待って入力
2. パスコードをauthServerに送信

## reset() : IndexedDBに格納されている情報を再作成

メールアドレス入力ミスの場合を想定。

- 鍵ペアの再作成
- ダイアログからメールアドレス入力。入力済のメールアドレスがあれば、流用も許容
