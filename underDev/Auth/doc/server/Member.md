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

[総説](../readme.md) | [CL/SV共通](../common/index.md) | [CL側](../client/index.md) | [SV側](../server/index.md) | [暗号化](../crypto.md) | [メンバ](../Member.md) | [開発](../dev.md)

</div>

# <span id="Member_top">🧩 Memberクラス仕様書</span>

undefined

## <a href="#Member_top"><span id="Member_func">🧱 Member メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#Member-constructor_top">constructor</a> | constructor: 該当メンバのMemberインスタンス作成 |
| 2 | <a href="#Member-addTrial_top">addTrial</a> | addTrial: 新しい試行を登録し、メンバにパスコード通知メールを発信 |
| 3 | <a href="#Member-checkPasscode_top">checkPasscode</a> | checkPasscode: 認証時のパスコードチェック |
| 4 | <a href="#Member-getMember_top">getMember</a> | getMember: 指定メンバの情報をmemberListシートから取得 |
| 5 | <a href="#Member-judgeMember_top">judgeMember</a> | judgeMember: 加入審査画面から審査結果入力＋結果通知 |
| 6 | <a href="#Member-judgeStatus_top">judgeStatus</a> | judgeStatus: 指定メンバ・デバイスの状態を状態決定表により判定 |
| 7 | <a href="#Member-MemberDevice_top">MemberDevice</a> |  |
| 8 | <a href="#Member-MemberLog_top">MemberLog</a> |  |
| 9 | <a href="#Member-MemberProfile_top">MemberProfile</a> |  |
| 10 | <a href="#Member-reissuePasscode_top">reissuePasscode</a> | reissuePasscode: パスコードを再発行する |
| 11 | <a href="#Member-removeMember_top">removeMember</a> | removeMember: 登録中メンバをアカウント削除、または加入禁止にする |
| 12 | <a href="#Member-restoreMember_top">restoreMember</a> | restoreMember: 加入禁止(論理削除)されているメンバを復活させる |
| 13 | <a href="#Member-setMember_top">setMember</a> | setMember: 指定メンバ情報をmemberListシートに保存 |
| 14 | <a href="#Member-unfreeze_top">unfreeze</a> | unfreeze: 指定されたメンバ・デバイスの「凍結中」状態を強制的に解除 |
| 15 | <a href="#Member-updateCPkey_top">updateCPkey</a> | updateCPkey: 対象メンバ・デバイスの公開鍵を更新 |
## <span id="Member-constructor_top">🧩 constructor()</span>

constructor: 該当メンバのMemberインスタンス作成

### <a href="#Member-constructor_top"><span id="Member-constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| config | authServerConfig | 必須 | authServerの設定値 |  |
| request | authRequest | 必須 | 処理要求 |  |
## <span id="Member-addTrial_top">🧩 addTrial()</span>

addTrial: 新しい試行を登録し、メンバにパスコード通知メールを発信

### <a href="#Member-addTrial_top"><span id="Member-addTrial_param">▶️ addTrial 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | authRequest | 必須 | 処理要求 |  |

### <a href="#Member-addTrial_top"><span id="Member-addTrial_return">◀️ addTrial 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| authResponse \| Error |  |  |
## <span id="Member-checkPasscode_top">🧩 checkPasscode()</span>

checkPasscode: 認証時のパスコードチェック

### <a href="#Member-checkPasscode_top"><span id="Member-checkPasscode_param">▶️ checkPasscode 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| request | authRequest | 必須 | 処理要求 |  |

### <a href="#Member-checkPasscode_top"><span id="Member-checkPasscode_return">◀️ checkPasscode 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| authResponse \| Error |  |  |
## <span id="Member-getMember_top">🧩 getMember()</span>

getMember: 指定メンバの情報をmemberListシートから取得

### <a href="#Member-getMember_top"><span id="Member-getMember_param">▶️ getMember 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| memberId | string | 必須 | ユーザ識別子(メールアドレス) |  |

### <a href="#Member-getMember_top"><span id="Member-getMember_return">◀️ getMember 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| Member \| Error | いまここ：元は"authResponse"だったが、"Member"の方がベター？ |  |
## <span id="Member-judgeMember_top">🧩 judgeMember()</span>

judgeMember: 加入審査画面から審査結果入力＋結果通知

### <a href="#Member-judgeMember_top"><span id="Member-judgeMember_param">▶️ judgeMember 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

### <a href="#Member-judgeMember_top"><span id="Member-judgeMember_return">◀️ judgeMember 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |
## <span id="Member-judgeStatus_top">🧩 judgeStatus()</span>

judgeStatus: 指定メンバ・デバイスの状態を状態決定表により判定

### <a href="#Member-judgeStatus_top"><span id="Member-judgeStatus_param">▶️ judgeStatus 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

### <a href="#Member-judgeStatus_top"><span id="Member-judgeStatus_return">◀️ judgeStatus 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |
## <span id="Member-MemberDevice_top">🧩 MemberDevice()</span>

undefined
## <span id="Member-MemberLog_top">🧩 MemberLog()</span>

undefined
## <span id="Member-MemberProfile_top">🧩 MemberProfile()</span>

undefined
## <span id="Member-reissuePasscode_top">🧩 reissuePasscode()</span>

reissuePasscode: パスコードを再発行する

### <a href="#Member-reissuePasscode_top"><span id="Member-reissuePasscode_param">▶️ reissuePasscode 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

### <a href="#Member-reissuePasscode_top"><span id="Member-reissuePasscode_return">◀️ reissuePasscode 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |
## <span id="Member-removeMember_top">🧩 removeMember()</span>

removeMember: 登録中メンバをアカウント削除、または加入禁止にする

### <a href="#Member-removeMember_top"><span id="Member-removeMember_param">▶️ removeMember 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

### <a href="#Member-removeMember_top"><span id="Member-removeMember_return">◀️ removeMember 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |
## <span id="Member-restoreMember_top">🧩 restoreMember()</span>

restoreMember: 加入禁止(論理削除)されているメンバを復活させる

### <a href="#Member-restoreMember_top"><span id="Member-restoreMember_param">▶️ restoreMember 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

### <a href="#Member-restoreMember_top"><span id="Member-restoreMember_return">◀️ restoreMember 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |
## <span id="Member-setMember_top">🧩 setMember()</span>

setMember: 指定メンバ情報をmemberListシートに保存

### <a href="#Member-setMember_top"><span id="Member-setMember_param">▶️ setMember 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

### <a href="#Member-setMember_top"><span id="Member-setMember_return">◀️ setMember 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |
## <span id="Member-unfreeze_top">🧩 unfreeze()</span>

unfreeze: 指定されたメンバ・デバイスの「凍結中」状態を強制的に解除

### <a href="#Member-unfreeze_top"><span id="Member-unfreeze_param">▶️ unfreeze 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

### <a href="#Member-unfreeze_top"><span id="Member-unfreeze_return">◀️ unfreeze 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |
## <span id="Member-updateCPkey_top">🧩 updateCPkey()</span>

updateCPkey: 対象メンバ・デバイスの公開鍵を更新

### <a href="#Member-updateCPkey_top"><span id="Member-updateCPkey_param">▶️ updateCPkey 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |  |

### <a href="#Member-updateCPkey_top"><span id="Member-updateCPkey_return">◀️ updateCPkey 戻り値</span></a>

| データ型 | 説明 | 備考 |
| :-- | :-- | :-- |
| null \| Error | 戻り値 |  |