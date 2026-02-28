<style>
  .l1 { /* トップレベル(level.1)のタイトル */
    padding: 1rem 2rem;
    border-left: 5px solid #000;
    background: #f4f4f4;
    font-size: 2.4rem;
    font-weight: 900;
  }
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

[総説](../readme.md) | [共通仕様](../common/index.md) | [クライアント側仕様](../client/index.md) | [サーバ側仕様](../server/index.md) | [開発仕様](../dev.md)

</div>

# <span id="/server/Member.mjs::Member_top">🧩 Memberクラス仕様書</span>

## <a href="#/server/Member.mjs::Member_top"><span id="/server/Member.mjs::Member_func">🧱 Member メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#/server/Member.mjs::Member#Member#constructor_top">constructor</a> | constructor: 該当メンバのMemberインスタンス作成 |
| 2 | <a href="#/server/Member.mjs::Member#addTrial_top">addTrial</a> | addTrial: 新しい試行を登録し、メンバにパスコード通知メールを発信 |
| 3 | <a href="#/server/Member.mjs::Member#checkPasscode_top">checkPasscode</a> | checkPasscode: 認証時のパスコードチェック |
| 4 | <a href="#/server/Member.mjs::Member#getMember_top">getMember</a> | getMember: 指定メンバの情報をmemberListシートから取得 |
| 5 | <a href="#/server/Member.mjs::Member.judgeMember_top">judgeMember</a> | judgeMember: 加入審査画面から審査結果入力＋結果通知 |
| 6 | <a href="#/server/Member.mjs::Member#judgeStatus_top">judgeStatus</a> | judgeStatus: 指定メンバ・デバイスの状態を状態決定表により判定 |
| 7 | <a href="#/server/Member.mjs::Member#MemberDevice_top">MemberDevice</a> | MemberDevice: デバイス情報の初期オブジェクト生成 |
| 8 | <a href="#/server/Member.mjs::Member#MemberLog_top">MemberLog</a> | MemberLog: メンバ履歴情報初期化 |
| 9 | <a href="#/server/Member.mjs::Member#MemberProfile_top">MemberProfile</a> | MemberProfile: メンバ属性情報初期化 |
| 10 | <a href="#/server/Member.mjs::Member#reissuePasscode_top">reissuePasscode</a> | reissuePasscode: パスコードを再発行する |
| 11 | <a href="#/server/Member.mjs::Member.removeMember_top">removeMember</a> | removeMember: 登録中メンバをアカウント削除、または加入禁止にする |
| 12 | <a href="#/server/Member.mjs::Member.restoreMember_top">restoreMember</a> | restoreMember: 加入禁止(論理削除)されているメンバを復活させる |
| 13 | <a href="#/server/Member.mjs::Member#setMember_top">setMember</a> | setMember: 指定メンバ情報をmemberListシートに保存 |
| 14 | <a href="#/server/Member.mjs::Member.unfreeze_top">unfreeze</a> | unfreeze: 指定されたメンバ・デバイスの「凍結中」状態を強制的に解除 |
| 15 | <a href="#/server/Member.mjs::Member#updateCPkey_top">updateCPkey</a> | updateCPkey: 対象メンバ・デバイスの公開鍵を更新 |

## <a href="#/server/Member.mjs::Member_top"><span id="/server/Member.mjs::Member_desc">🧾 Member 概説</span></a>

<br>
## <span id="/server/Member.mjs::Member#Member#constructor_top">🧩 constructor()</span>

constructor: 該当メンバのMemberインスタンス作成

### <a href="#/server/Member.mjs::Member#Member#constructor_top"><span id="/server/Member.mjs::Member#Member#constructor_desc">🧾 constructor 概説</span></a>

constructor: 該当メンバのMemberインスタンス作成
- 新規メンバ(SPkey要求時)は新規作成<br>

### <a href="#/server/Member.mjs::Member#Member#constructor_top"><span id="/server/Member.mjs::Member#Member#constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | <a href="../server/index.md#authServerConfig">authServerConfig</a> | 必須 | authServerの設定値 |  |
| request | <a href="../common/index.md#authRequest">authRequest</a> | 必須 | 処理要求 |  |
## <span id="/server/Member.mjs::Member#addTrial_top">🧩 addTrial()</span>

addTrial: 新しい試行を登録し、メンバにパスコード通知メールを発信

### <a href="#/server/Member.mjs::Member#addTrial_top"><span id="/server/Member.mjs::Member#addTrial_desc">🧾 addTrial 概説</span></a>

addTrial: 新しい試行を登録し、メンバにパスコード通知メールを発信<br>

### <a href="#/server/Member.mjs::Member#addTrial_top"><span id="/server/Member.mjs::Member#addTrial_param">▶️ addTrial 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | <a href="../common/index.md#authRequest">authRequest</a> | 必須 | 処理要求 |  |

### <a href="#/server/Member.mjs::Member#addTrial_top"><span id="/server/Member.mjs::Member#addTrial_return">◀️ addTrial 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| <a href="../common/index.md#authResponse">authResponse</a> \| Error |  |  |
## <span id="/server/Member.mjs::Member#checkPasscode_top">🧩 checkPasscode()</span>

checkPasscode: 認証時のパスコードチェック

### <a href="#/server/Member.mjs::Member#checkPasscode_top"><span id="/server/Member.mjs::Member#checkPasscode_desc">🧾 checkPasscode 概説</span></a>

checkPasscode: 認証時のパスコードチェック
入力されたパスコードをチェック、Member内部の各種メンバの値を更新<br>

### <a href="#/server/Member.mjs::Member#checkPasscode_top"><span id="/server/Member.mjs::Member#checkPasscode_param">▶️ checkPasscode 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | <a href="../common/index.md#authRequest">authRequest</a> | 必須 | 処理要求 |  |

### <a href="#/server/Member.mjs::Member#checkPasscode_top"><span id="/server/Member.mjs::Member#checkPasscode_return">◀️ checkPasscode 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| <a href="../common/index.md#authResponse">authResponse</a> \| Error |  |  |
## <span id="/server/Member.mjs::Member#getMember_top">🧩 getMember()</span>

getMember: 指定メンバの情報をmemberListシートから取得

### <a href="#/server/Member.mjs::Member#getMember_top"><span id="/server/Member.mjs::Member#getMember_desc">🧾 getMember 概説</span></a>

getMember: 指定メンバの情報をmemberListシートから取得<br>

### <a href="#/server/Member.mjs::Member#getMember_top"><span id="/server/Member.mjs::Member#getMember_param">▶️ getMember 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | 必須 | ユーザ識別子(メールアドレス) |  |

### <a href="#/server/Member.mjs::Member#getMember_top"><span id="/server/Member.mjs::Member#getMember_return">◀️ getMember 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| <a href="../server/Member.md">Member</a> \| Error | いまここ：元は"authResponse"だったが、"Member"の方がベター？ |  |
## <span id="/server/Member.mjs::Member.judgeMember_top">🧩 judgeMember()</span>

judgeMember: 加入審査画面から審査結果入力＋結果通知

### <a href="#/server/Member.mjs::Member.judgeMember_top"><span id="/server/Member.mjs::Member.judgeMember_desc">🧾 judgeMember 概説</span></a>

judgeMember: 加入審査画面から審査結果入力＋結果通知
加入審査画面を呼び出し、管理者が記入した結果をmemberListに登録、審査結果をメンバに通知
memberListシートのGoogle Spreadのメニューから管理者が実行することを想定<br>

### <a href="#/server/Member.mjs::Member.judgeMember_top"><span id="/server/Member.mjs::Member.judgeMember_param">▶️ judgeMember 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

### <a href="#/server/Member.mjs::Member.judgeMember_top"><span id="/server/Member.mjs::Member.judgeMember_return">◀️ judgeMember 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |
## <span id="/server/Member.mjs::Member#judgeStatus_top">🧩 judgeStatus()</span>

judgeStatus: 指定メンバ・デバイスの状態を状態決定表により判定

### <a href="#/server/Member.mjs::Member#judgeStatus_top"><span id="/server/Member.mjs::Member#judgeStatus_desc">🧾 judgeStatus 概説</span></a>

judgeStatus: 指定メンバ・デバイスの状態を状態決定表により判定<br>

### <a href="#/server/Member.mjs::Member#judgeStatus_top"><span id="/server/Member.mjs::Member#judgeStatus_param">▶️ judgeStatus 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

### <a href="#/server/Member.mjs::Member#judgeStatus_top"><span id="/server/Member.mjs::Member#judgeStatus_return">◀️ judgeStatus 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |
## <span id="/server/Member.mjs::Member#MemberDevice_top">🧩 MemberDevice()</span>

MemberDevice: デバイス情報の初期オブジェクト生成

### <a href="#/server/Member.mjs::Member#MemberDevice_top"><span id="/server/Member.mjs::Member#MemberDevice_desc">🧾 MemberDevice 概説</span></a>

<br>
## <span id="/server/Member.mjs::Member#MemberLog_top">🧩 MemberLog()</span>

MemberLog: メンバ履歴情報初期化

### <a href="#/server/Member.mjs::Member#MemberLog_top"><span id="/server/Member.mjs::Member#MemberLog_desc">🧾 MemberLog 概説</span></a>

<br>
## <span id="/server/Member.mjs::Member#MemberProfile_top">🧩 MemberProfile()</span>

MemberProfile: メンバ属性情報初期化

### <a href="#/server/Member.mjs::Member#MemberProfile_top"><span id="/server/Member.mjs::Member#MemberProfile_desc">🧾 MemberProfile 概説</span></a>

<br>
## <span id="/server/Member.mjs::Member#reissuePasscode_top">🧩 reissuePasscode()</span>

reissuePasscode: パスコードを再発行する

### <a href="#/server/Member.mjs::Member#reissuePasscode_top"><span id="/server/Member.mjs::Member#reissuePasscode_desc">🧾 reissuePasscode 概説</span></a>

reissuePasscode: パスコードを再発行する<br>

### <a href="#/server/Member.mjs::Member#reissuePasscode_top"><span id="/server/Member.mjs::Member#reissuePasscode_param">▶️ reissuePasscode 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

### <a href="#/server/Member.mjs::Member#reissuePasscode_top"><span id="/server/Member.mjs::Member#reissuePasscode_return">◀️ reissuePasscode 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |
## <span id="/server/Member.mjs::Member.removeMember_top">🧩 removeMember()</span>

removeMember: 登録中メンバをアカウント削除、または加入禁止にする

### <a href="#/server/Member.mjs::Member.removeMember_top"><span id="/server/Member.mjs::Member.removeMember_desc">🧾 removeMember 概説</span></a>

removeMember: 登録中メンバをアカウント削除、または加入禁止にする
- memberListシートのGoogle Spreadのメニューから管理者が実行することを想定<br>

### <a href="#/server/Member.mjs::Member.removeMember_top"><span id="/server/Member.mjs::Member.removeMember_param">▶️ removeMember 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

### <a href="#/server/Member.mjs::Member.removeMember_top"><span id="/server/Member.mjs::Member.removeMember_return">◀️ removeMember 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |
## <span id="/server/Member.mjs::Member.restoreMember_top">🧩 restoreMember()</span>

restoreMember: 加入禁止(論理削除)されているメンバを復活させる

### <a href="#/server/Member.mjs::Member.restoreMember_top"><span id="/server/Member.mjs::Member.restoreMember_desc">🧾 restoreMember 概説</span></a>

restoreMember: 加入禁止(論理削除)されているメンバを復活させる
- memberListシートのGoogle Spreadのメニューから管理者が実行することを想定<br>

### <a href="#/server/Member.mjs::Member.restoreMember_top"><span id="/server/Member.mjs::Member.restoreMember_param">▶️ restoreMember 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

### <a href="#/server/Member.mjs::Member.restoreMember_top"><span id="/server/Member.mjs::Member.restoreMember_return">◀️ restoreMember 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |
## <span id="/server/Member.mjs::Member#setMember_top">🧩 setMember()</span>

setMember: 指定メンバ情報をmemberListシートに保存

### <a href="#/server/Member.mjs::Member#setMember_top"><span id="/server/Member.mjs::Member#setMember_desc">🧾 setMember 概説</span></a>

setMember: 指定メンバ情報をmemberListシートに保存
- 登録済メンバの場合は更新、未登録の場合は新規登録(追加)を行う<br>

### <a href="#/server/Member.mjs::Member#setMember_top"><span id="/server/Member.mjs::Member#setMember_param">▶️ setMember 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

### <a href="#/server/Member.mjs::Member#setMember_top"><span id="/server/Member.mjs::Member#setMember_return">◀️ setMember 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |
## <span id="/server/Member.mjs::Member.unfreeze_top">🧩 unfreeze()</span>

unfreeze: 指定されたメンバ・デバイスの「凍結中」状態を強制的に解除

### <a href="#/server/Member.mjs::Member.unfreeze_top"><span id="/server/Member.mjs::Member.unfreeze_desc">🧾 unfreeze 概説</span></a>

unfreeze: 指定されたメンバ・デバイスの「凍結中」状態を強制的に解除
- 引数でmemberIdが指定されなかった場合、凍結中デバイス一覧の要求と看做す
- deviceIdの指定が無い場合、memberIdが使用する凍結中デバイス全てを対象とする
- memberListシートのGoogle Spreadのメニューから管理者が実行することを想定<br>

### <a href="#/server/Member.mjs::Member.unfreeze_top"><span id="/server/Member.mjs::Member.unfreeze_param">▶️ unfreeze 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

### <a href="#/server/Member.mjs::Member.unfreeze_top"><span id="/server/Member.mjs::Member.unfreeze_return">◀️ unfreeze 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |
## <span id="/server/Member.mjs::Member#updateCPkey_top">🧩 updateCPkey()</span>

updateCPkey: 対象メンバ・デバイスの公開鍵を更新

### <a href="#/server/Member.mjs::Member#updateCPkey_top"><span id="/server/Member.mjs::Member#updateCPkey_desc">🧾 updateCPkey 概説</span></a>

updateCPkey: 対象メンバ・デバイスの公開鍵を更新<br>

### <a href="#/server/Member.mjs::Member#updateCPkey_top"><span id="/server/Member.mjs::Member#updateCPkey_param">▶️ updateCPkey 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

### <a href="#/server/Member.mjs::Member#updateCPkey_top"><span id="/server/Member.mjs::Member#updateCPkey_return">◀️ updateCPkey 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |