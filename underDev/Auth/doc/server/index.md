<style> /* 仕様書用共通スタイル定義 */
  .l1 { /* トップレベル(level.1)のタイトル */
    padding: 1rem 2rem;
    border-left: 5px solid #000;
    background: #f4f4f4;
    font-size: 2.4rem;
    font-weight: 900;
  }
  .source { /* 出典元のソースファイル名(リンクは無し) */
    text-align:right; font-size:0.8rem;}
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

[総説](../readme.md) | [CL/SV共通](../common/index.md) | [CL側](../client/index.md) | [SV側](../server/index.md) | [暗号化](../crypto.md) | [メンバ](../Member.md) | [開発](../dev.md)

</div>

<p id="top" class="l1">"auth"サーバ側仕様書</p>

# 実装イメージ

```js
// ライブラリ関数定義
function devTools(){...}; // (中略)

// authServer関係クラス定義
class authServer{...};
class cryptoServer{...};
class Member{...};  // (中略)

// グローバル変数定義
const dev = devTools();
const config = {...}; // authClient/Server共通設定情報
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

# サーバ側処理分岐先決定手順

<style>#xc31d629a-169e-46c9-9712-da993a556ef0 td {vertical-align: top;}</style>
<table id="xc31d629a-169e-46c9-9712-da993a556ef0">
  <tr class="r1">
    <th class="c1">No</th>
    <th class="c2">受信</th>
    <th class="c3">mID</th>
    <th class="c4">dID</th>
    <th class="c5">CPkey</th>
    <th class="c6">メンバ</th>
    <th class="c7">デバイス</th>
    <th class="c8">func</th>
    <th class="c9">処理内容</th>
    <th class="c10">戻り値</th>
  </tr>
  <tr class="r2">
    <td class="c1">1</td>
    <td class="c2" rowspan="2">平文</td>
    <td class="c3" rowspan="2">—</td>
    <td class="c4" rowspan="2">—</td>
    <td class="c5" rowspan="2">—</td>
    <td class="c6" rowspan="2">—</td>
    <td class="c7" rowspan="2">—</td>
    <td class="c8" rowspan="2">—</td>
    <td class="c9" rowspan="2">仮登録処理</td>
    <td class="c10">[W01]SPkey配布</td>
  </tr>
  <tr class="r3">
    <td class="c1">2</td>
    <td class="c10">[E01]CPkey重複</td>
  </tr>
  <tr class="r4">
    <td class="c1">3</td>
    <td class="c2" rowspan="21">暗号文</td>
    <td class="c3">不在</td>
    <td class="c4">—</td>
    <td class="c5">—</td>
    <td class="c6">—</td>
    <td class="c7">—</td>
    <td class="c8">—</td>
    <td class="c9">—</td>
    <td class="c10">[E02]メンバ未登録</td>
  </tr>
  <tr class="r5">
    <td class="c1">4</td>
    <td class="c3" rowspan="20">存在</td>
    <td class="c4">不在</td>
    <td class="c5">—</td>
    <td class="c6">—</td>
    <td class="c7">—</td>
    <td class="c8">—</td>
    <td class="c9">—</td>
    <td class="c10">[E03]デバイス未登録</td>
  </tr>
  <tr class="r6">
    <td class="c1">5</td>
    <td class="c4" rowspan="19">存在</td>
    <td class="c5">不在</td>
    <td class="c6">—</td>
    <td class="c7">—</td>
    <td class="c8">—</td>
    <td class="c9">—</td>
    <td class="c10">[E04]CPkey未登録</td>
  </tr>
  <tr class="r7">
    <td class="c1">6</td>
    <td class="c5" rowspan="2">旧版</td>
    <td class="c6" rowspan="2">—</td>
    <td class="c7" rowspan="2">—</td>
    <td class="c8">::updateCPkey::</td>
    <td class="c9">CPkey更新</td>
    <td class="c10">[W02]CPkey更新</td>
  </tr>
  <tr class="r8">
    <td class="c1">7</td>
    <td class="c8">上記以外</td>
    <td class="c9">—</td>
    <td class="c10">[W06]要CPkey更新</td>
  </tr>
  <tr class="r9">
    <td class="c1">8</td>
    <td class="c5" rowspan="16">存在</td>
    <td class="c6" rowspan="2">加入禁止</td>
    <td class="c7" rowspan="2">—</td>
    <td class="c8" rowspan="2">—</td>
    <td class="c9" rowspan="2">限定処理</td>
    <td class="c10">[N01]処理結果</td>
  </tr>
  <tr class="r10">
    <td class="c1">9</td>
    <td class="c10">[E05]加入禁止</td>
  </tr>
  <tr class="r11">
    <td class="c1">10</td>
    <td class="c6" rowspan="2">仮登録</td>
    <td class="c7" rowspan="2">—</td>
    <td class="c8" rowspan="2">—</td>
    <td class="c9" rowspan="2">限定処理</td>
    <td class="c10">[N01]処理結果</td>
  </tr>
  <tr class="r12">
    <td class="c1">11</td>
    <td class="c10">[E06]仮登録</td>
  </tr>
  <tr class="r13">
    <td class="c1">12</td>
    <td class="c6" rowspan="2">未審査</td>
    <td class="c7" rowspan="2">—</td>
    <td class="c8" rowspan="2">—</td>
    <td class="c9" rowspan="2">限定処理</td>
    <td class="c10">[N01]処理結果</td>
  </tr>
  <tr class="r14">
    <td class="c1">13</td>
    <td class="c10">[E07]未審査</td>
  </tr>
  <tr class="r15">
    <td class="c1">14</td>
    <td class="c6" rowspan="10">加入中</td>
    <td class="c7" rowspan="2">凍結中</td>
    <td class="c8" rowspan="2">—</td>
    <td class="c9" rowspan="2">限定処理</td>
    <td class="c10">[N01]処理結果</td>
  </tr>
  <tr class="r16">
    <td class="c1">15</td>
    <td class="c10">[E08]凍結中</td>
  </tr>
  <tr class="r17">
    <td class="c1">16</td>
    <td class="c7" rowspan="6">試行中</td>
    <td class="c8" rowspan="3">::passcode::</td>
    <td class="c9" rowspan="3">パスコード検証</td>
    <td class="c10">[W03]一致</td>
  </tr>
  <tr class="r18">
    <td class="c1">17</td>
    <td class="c10">[W07]要再試行</td>
  </tr>
  <tr class="r19">
    <td class="c1">18</td>
    <td class="c10">[E08]凍結中</td>
  </tr>
  <tr class="r20">
    <td class="c1">19</td>
    <td class="c8">::reissue::</td>
    <td class="c9">パスコード再発行</td>
    <td class="c10">[W04]再発行</td>
  </tr>
  <tr class="r21">
    <td class="c1">20</td>
    <td class="c8" rowspan="2">サーバ関数名</td>
    <td class="c9" rowspan="2">限定処理</td>
    <td class="c10">[N01]処理結果</td>
  </tr>
  <tr class="r22">
    <td class="c1">21</td>
    <td class="c10">[E08]凍結中</td>
  </tr>
  <tr class="r23">
    <td class="c1">22</td>
    <td class="c7">未認証</td>
    <td class="c8">—</td>
    <td class="c9">試行開始処理</td>
    <td class="c10">[W05]通知メール送信</td>
  </tr>
  <tr class="r24">
    <td class="c1">23</td>
    <td class="c7">認証中</td>
    <td class="c8">—</td>
    <td class="c9">通常処理</td>
    <td class="c10">[N01]処理結果</td>
  </tr>
</table>

- 「受信」欄：平文=encryptedRequest.payloadが存在、暗号文=encryptedRequest.cipherが存在
- mID = memberId(e-mail), dID = deviceId(UUIDv4)
- 限定処理：無権限で実行可能な処理のみ実行し、権限不足の場合はメンバ・デバイスの状態を戻り値とする処理
- [W01]SPkey配布、[E01]CPkey重複の分岐<br>
  CPkeyが申請メンバ・他メンバに登録済ではないかにより判断。<br>
  なおmemberId(e-mail)登録済は考慮不要(∵以前登録されたor他デバイスで登録済)
  | 配布申請メンバ | 他メンバ | 結果 | 備考 |
  | :-- | :-- | :-- | :-- |
  | 未登録 | 未登録 | SPkey配布 | 通常パターン |
  | 未登録 | 登録済 | CPkey重複 | 通常あり得ない。攻撃？ |
  | 登録済 | 未登録 | SPkey配布 | 手違いで二重要求？許容 |
  | 登録済 | 登録済 | CPkey重複 | 通常あり得ない。攻撃？ |
# グローバル関数・クラス一覧

| クラス/関数名 | 概要 |
| :-- | :-- |
| [authServer](authServer.md) | サーバ側中核クラス |
| [cryptoServer](cryptoServer.md) | サーバ側の暗号化・署名検証 |
| [Member](Member.md) |  |

# <span id="typedefList">データ型定義一覧</span>

| No | データ型名 | 概要 |
| --: | :-- | :-- |
| 1 | [authAuditLog](#authAuditLog) | authServerの監査ログをシートに出力 |
| 2 | [authErrorLog](#authErrorLog) | authServerのエラーログをシートに出力 |
| 3 | [authRequestLog](#authRequestLog) | 重複チェック用のリクエスト履歴 |
| 4 | [authScriptProperties](#authScriptProperties) | サーバ側ScriptPropertiesに保存する内容 |
| 5 | [authServerConfig](#authServerConfig) | authServer特有の設定項目 |
| 6 | [authServerFuncDef](#authServerFuncDef) | サーバ側関数設定 |
| 7 | [MemberDevice](#MemberDevice) | メンバが使用する通信機器の情報 |
| 8 | [MemberLog](#MemberLog) | メンバの各種要求・状態変化の時刻 |
| 9 | [MemberProfile](#MemberProfile) | メンバの属性情報 |
| 10 | [MemberTrial](#MemberTrial) | ログイン試行情報の管理・判定 |
| 11 | [MemberTrialLog](#MemberTrialLog) | パスコード入力単位の試行記録 |

# 個別データ型定義


## <a href="#typedefList"><span id="authAuditLog">"authAuditLog" データ型定義</span></a>

authAuditLog: authServerの監査ログをシートに出力

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| timestamp | string | Date.now() | 要求日時(ISO8601拡張形式) |  |
| duration | number | 必須 | 処理時間(ms) |  |
| memberId | string | 必須 | メンバの識別子(メールアドレス) |  |
| deviceId | string | 任意 | デバイスの識別子(UUIDv4) |  |
| func | string | 必須 | サーバ側関数名 |  |
| result | string | 'success' | サーバ側処理結果 |  |
| note | string | 任意 | 備考 |  |


## <a href="#typedefList"><span id="authErrorLog">"authErrorLog" データ型定義</span></a>

authErrorLog: authServerのエラーログをシートに出力

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| timestamp | string | Date.now() | 要求日時ISO8601拡張形式の文字列 |  |
| memberId | string | 必須 | メンバの識別子 |  |
| deviceId | string | 必須 | デバイスの識別子 |  |
| result | string | fatal | サーバ側処理結果fatal/warning/normal |  |
| message | string | 任意 | サーバ側からのエラーメッセージnormal時はundefined |  |
| stack | string | 任意 | エラー発生時のスタックトレース本項目は管理者への通知メール等、シート以外には出力不可 |  |


## <a href="#typedefList"><span id="authRequestLog">"authRequestLog" データ型定義</span></a>

authRequestLog: 重複チェック用のリクエスト履歴

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| timestamp | number | Date.now() | リクエストを受けたサーバ側日時 |  |
| nonce | string | 必須 | クライアント側で採番されたリクエスト識別子UUIDv4 |  |


## <a href="#typedefList"><span id="authScriptProperties">"authScriptProperties" データ型定義</span></a>

authScriptProperties: サーバ側ScriptPropertiesに保存する情報

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| keyGeneratedDateTime | number | 必須 | 鍵ペア生成日時。UNIX時刻 |  |
| SSkeySign | string | 必須 | 署名用秘密鍵(PEM形式) |  |
| SPkeySign | string | 必須 | 署名用公開鍵(PEM形式) |  |
| SSkeyEnc | string | 必須 | 暗号化用秘密鍵(PEM形式) |  |
| SPkeyEnc | string | 必須 | 暗号化用公開鍵(PEM形式) |  |
| oldSSkeySign | string | 必須 | バックアップ用署名用秘密鍵(PEM形式) |  |
| oldSPkeySign | string | 必須 | バックアップ用署名用公開鍵(PEM形式) |  |
| oldSSkeyEnc | string | 必須 | バックアップ用暗号化用秘密鍵(PEM形式) |  |
| oldSPkeyEnc | string | 必須 | バックアップ用暗号化用公開鍵(PEM形式) |  |
| requestLog | string | 必須 | 重複チェック用のリクエスト履歴。{authRequestLog[]}のJSON |  |


## <a href="#typedefList"><span id="authServerConfig">"authServerConfig" データ型定義</span></a>

this.cf(authServerConfig): 共通設定情報にauthServer特有項目を追加

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberList | string | "memberList" | memberListシート名 |  |
| defaultAuthority | number | 1 | 新規加入メンバの権限の既定値 |  |
| memberLifeTime | number | 31536000000 | 加入有効期間<br>  メンバ加入承認後の有効期間。既定値は1年 |  |
| prohibitedToJoin | number | 259200000 | 加入禁止期間<br>  管理者による加入否認後、再加入申請��自動的に却下される期間。既定値は3日 |  |
| loginLifeTime | number | 86400000 | 認証有効時間<br>  ログイン成功後の有効期間、CPkeyの有効期間。既定値は1日 |  |
| loginFreeze | number | 600000 | 認証凍結時間<br>  認証失敗後、再認証要求が禁止される期間。既定値は10分 |  |
| requestIdRetention | number | 300000 | 重複リクエスト拒否となる時間。既定値は5分 |  |
| errorLog | string | "errorLog" | エラーログのシート名 |  |
| storageDaysOfErrorLog | number | 604800000 | エラーログの保存日数<br>  単位はミリ秒。既定値は7日分 |  |
| auditLog | string | "auditLog" | 監査ログのシート名 |  |
| storageDaysOfAuditLog | number | 604800000 | 監査ログの保存日数<br>  単位はミリ秒。既定値は7日分 |  |
| func | authServerFuncDef | {} | サーバ側関数設定<br><br>ログイン試行関係の設定値 |  |
| passcodeLength | number | 6 | パスコードの桁数 |  |
| maxTrial | number | 3 | パスコード入力の最大試行回数 |  |
| passcodeLifeTime | number | 600000 | パスコードの有効期間。既定値は10分 |  |
| maxTrialLog | number | 5 | ログイン試行履歴(MemberTrial)の最大保持数。既定値は5世代<br><br>開発関係の設定値 |  |
| udSendPasscode | boolean | false | 開発中識別フラグパスコード通知メール送信を抑止するならtrue |  |
| udSendInvitation | boolean | false | 開発中の加入承認通知メール送信<br>  開発中に加入承認通知メール送信を抑止するならtrue |  |
| typeDef | schemaDef | 必須 | データ型定義 |  |


## <a href="#typedefList"><span id="authServerFuncDef">"authServerFuncDef" データ型定義</span></a>

authServerFuncDef: サーバ側関数設定オブジェクト

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| func.authority | number | 0 | サーバ側関数の所要権限<br>  サーバ側関数毎に設定される当該関数実行のために必要となるユーザ権限<br>  ex. authServerConfig.func.authority === 0 |  |
| func.do | function | 必須 | 実行するサーバ側関数 |  |


## <a href="#typedefList"><span id="MemberDevice">"MemberDevice" データ型定義</span></a>

MemberDevice: メンバが使用する通信機器の情報

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| deviceId | string | UUIDv4 | デバイスの識別子 |  |
| status | string | "UC" | デバイスの状態<br>  未認証 : UC(uncertified)<br>  認証中 : LI(log in)<br>  試行中 : TR(tring)<br>  凍結中 : FR(freezed) |  |
| CPkeySign | string | 必須 | デバイスの署名用公開鍵 |  |
| CPkeyEnc | string | 必須 | デバイスの暗号化用公開鍵 |  |
| CPkeyUpdated | number | Date.now() | 最新のCPkeyが登録された日時 |  |
| trial | MemberTrial[] | [ | ログイン試行関連情報。オブジェクトシート上はJSON文字列 |  |


## <a href="#typedefList"><span id="MemberLog">"MemberLog" データ型定義</span></a>

MemberLog: メンバの各種要求・状態変化の時刻

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| joiningRequest | number | Date.now() | 仮登録要求日時仮登録要求をサーバ側で受信した日時 |  |
| approval | number | 0 | 加入承認日時<br>  管理者がmemberList上で加入承認処理を行った日時。値設定は加入否認日時と択一 |  |
| denial | number | 0 | 加入否認日時<br>  管理者がmemberList上で加入否認処理を行った日時。値設定は加入承認日時と択一 |  |
| loginRequest | number | 0 | 認証要求日時<br>  未認証メンバからの処理要求をサーバ側で受信した日時 |  |
| loginSuccess | number | 0 | 認証成功日時<br>  未認証メンバの認証要求が成功した最新日時 |  |
| loginExpiration | number | 0 | 認証有効期限<br>  認証成功日時＋認証有効時間 |  |
| loginFailure | number | 0 | 認証失敗日時<br>  未認証メンバの認証要求失敗が確定した最新日時 |  |
| unfreezeLogin | number | 0 | 認証無効期限<br>  認証失敗日時＋認証凍結時間 |  |
| joiningExpiration | number | 0 | 加入有効期限<br>  加入承認日時＋加入有効期間 |  |
| unfreezeDenial | number | 0 | 加入禁止期限<br>  加入否認日時＋加入禁止期間 |  |


## <a href="#typedefList"><span id="MemberProfile">"MemberProfile" データ型定義</span></a>

MemberProfile: メンバの属性情報

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| authority | number | 必須 | メンバの持つ権限<br>  authServerConfig.func.authorityとの論理積>0なら当該関数実行権限ありと看做す |  |


## <a href="#typedefList"><span id="MemberTrial">"MemberTrial" データ型定義</span></a>

MemberTrial: ログイン試行情報の管理・判定

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| passcode | string | 必須 | 設定されているパスコード最初の認証試行で作成<br>  初期値はauthServerConfig.passcodeLengthで指定された桁数の数値 |  |
| created | number | Date.now() | パスコード生成日時≒パスコード通知メール発信日時 |  |
| log | MemberTrialLog[] | [ | 試行履歴常に最新が先頭(unshift()使用)<br>  保持上限はauthServerConfig.trial.generationMaxに従い、上限超過時は末尾から削除する。 |  |


## <a href="#typedefList"><span id="MemberTrialLog">"MemberTrialLog" データ型定義</span></a>

MemberTrialLog: パスコード入力単位の試行記録

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| entered | number | 必須 | 入力されたパスコード |  |
| result | boolean | 必須 | 試行結果正答：true、誤答：false |  |
| timestamp | number | Date.now() | 判定処理日時 |  |
