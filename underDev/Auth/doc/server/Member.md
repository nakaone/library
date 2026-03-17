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

# <span id="Member_top">🧩 Memberクラス仕様書</span>

<p class="source">source: server/Member.mjs line.4</p>

## <a href="#Member_top"><span id="Member_func">🧱 Member メソッド・内部関数一覧</span></a>

| No | 名前 | 概要 |
| --: | :-- | :-- |
| 1 | <a href="#Member-constructor_top">constructor</a> | constructor |
| 2 | <a href="#Member-addTrial_top">addTrial</a> | Member#addTrial |
| 3 | <a href="#Member-checkPasscode_top">checkPasscode</a> | 入力されたパスコードをチェック、Member内部の各種メンバの値を更新 |
| 4 | <a href="#Member-getMember_top">getMember</a> | Member#getMember |
| 5 | <a href="#Member-judgeMember_top">judgeMember</a> | 加入審査画面を呼び出し、管理者が記入した結果をmemberListに登録、審査結果をメンバに通知 |
| 6 | <a href="#Member-judgeStatus_top">judgeStatus</a> | Member#judgeStatus |
| 7 | <a href="#Member-MemberDevice_top">MemberDevice</a> |  |
| 8 | <a href="#Member-MemberLog_top">MemberLog</a> |  |
| 9 | <a href="#Member-MemberProfile_top">MemberProfile</a> |  |
| 10 | <a href="#Member-reissuePasscode_top">reissuePasscode</a> | Member#reissuePasscode |
| 11 | <a href="#Member-removeMember_top">removeMember</a> | - memberListシートのGoogle Spreadのメニューから管理者が実行することを想定 |
| 12 | <a href="#Member-restoreMember_top">restoreMember</a> | - memberListシートのGoogle Spreadのメニューから管理者が実行することを想定 |
| 13 | <a href="#Member-setMember_top">setMember</a> | - 登録済メンバの場合は更新、未登録の場合は新規登録(追加)を行う |
| 14 | <a href="#Member-unfreeze_top">unfreeze</a> | - 引数でmemberIdが指定されなかった場合、凍結中デバイス一覧の要求と看做す |
| 15 | <a href="#Member-updateCPkey_top">updateCPkey</a> | Member#updateCPkey |
## <span id="Member-constructor_top">🧩 constructor()</span>

constructor

### <a href="#Member-constructor_top"><span id="Member-constructor_desc">🧾 constructor 概説</span></a>

- 新規メンバ(SPkey要求時)は新規作成

### <a href="#Member-constructor_top"><span id="Member-constructor_param">▶️ constructor 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| config | authServerConfig | 必須 | authServerの設定値 |
| request | authRequest | 必須 | 処理要求 |
## <span id="Member-addTrial_top">🧩 addTrial()</span>

Member#addTrial

### <a href="#Member-addTrial_top"><span id="Member-addTrial_param">▶️ addTrial 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| request | authRequest | 必須 | 処理要求 |

### <a href="#Member-addTrial_top"><span id="Member-addTrial_return">◀️ addTrial 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| authResponse \| Error |  |
## <span id="Member-checkPasscode_top">🧩 checkPasscode()</span>

入力されたパスコードをチェック、Member内部の各種メンバの値を更新

### <a href="#Member-checkPasscode_top"><span id="Member-checkPasscode_desc">🧾 checkPasscode 概説</span></a>

入力されたパスコードをチェック、Member内部の各種メンバの値を更新

### <a href="#Member-checkPasscode_top"><span id="Member-checkPasscode_param">▶️ checkPasscode 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| request | authRequest | 必須 | 処理要求 |

### <a href="#Member-checkPasscode_top"><span id="Member-checkPasscode_return">◀️ checkPasscode 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| authResponse \| Error |  |
## <span id="Member-getMember_top">🧩 getMember()</span>

Member#getMember

### <a href="#Member-getMember_top"><span id="Member-getMember_param">▶️ getMember 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| memberId | string | 必須 | ユーザ識別子(メールアドレス) |

### <a href="#Member-getMember_top"><span id="Member-getMember_return">◀️ getMember 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| Member \| Error | いまここ：元は"authResponse"だったが、"Member"の方がベター？ |
## <span id="Member-judgeMember_top">🧩 judgeMember()</span>

加入審査画面を呼び出し、管理者が記入した結果をmemberListに登録、審査結果をメンバに通知

### <a href="#Member-judgeMember_top"><span id="Member-judgeMember_desc">🧾 judgeMember 概説</span></a>

加入審査画面を呼び出し、管理者が記入した結果をmemberListに登録、審査結果をメンバに通知<br>memberListシートのGoogle Spreadのメニューから管理者が実行することを想定

### <a href="#Member-judgeMember_top"><span id="Member-judgeMember_param">▶️ judgeMember 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |

### <a href="#Member-judgeMember_top"><span id="Member-judgeMember_return">◀️ judgeMember 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| null \| Error | 戻り値 |
## <span id="Member-judgeStatus_top">🧩 judgeStatus()</span>

Member#judgeStatus

### <a href="#Member-judgeStatus_top"><span id="Member-judgeStatus_param">▶️ judgeStatus 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |

### <a href="#Member-judgeStatus_top"><span id="Member-judgeStatus_return">◀️ judgeStatus 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| null \| Error | 戻り値 |
## <span id="Member-MemberDevice_top">🧩 MemberDevice()</span>
## <span id="Member-MemberLog_top">🧩 MemberLog()</span>
## <span id="Member-MemberProfile_top">🧩 MemberProfile()</span>
## <span id="Member-reissuePasscode_top">🧩 reissuePasscode()</span>

Member#reissuePasscode

### <a href="#Member-reissuePasscode_top"><span id="Member-reissuePasscode_param">▶️ reissuePasscode 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |

### <a href="#Member-reissuePasscode_top"><span id="Member-reissuePasscode_return">◀️ reissuePasscode 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| null \| Error | 戻り値 |
## <span id="Member-removeMember_top">🧩 removeMember()</span>

- memberListシートのGoogle Spreadのメニューから管理者が実行することを想定

### <a href="#Member-removeMember_top"><span id="Member-removeMember_desc">🧾 removeMember 概説</span></a>

- memberListシートのGoogle Spreadのメニューから管理者が実行することを想定

### <a href="#Member-removeMember_top"><span id="Member-removeMember_param">▶️ removeMember 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |

### <a href="#Member-removeMember_top"><span id="Member-removeMember_return">◀️ removeMember 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| null \| Error | 戻り値 |
## <span id="Member-restoreMember_top">🧩 restoreMember()</span>

- memberListシートのGoogle Spreadのメニューから管理者が実行することを想定

### <a href="#Member-restoreMember_top"><span id="Member-restoreMember_desc">🧾 restoreMember 概説</span></a>

- memberListシートのGoogle Spreadのメニューから管理者が実行することを想定

### <a href="#Member-restoreMember_top"><span id="Member-restoreMember_param">▶️ restoreMember 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |

### <a href="#Member-restoreMember_top"><span id="Member-restoreMember_return">◀️ restoreMember 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| null \| Error | 戻り値 |
## <span id="Member-setMember_top">🧩 setMember()</span>

- 登録済メンバの場合は更新、未登録の場合は新規登録(追加)を行う

### <a href="#Member-setMember_top"><span id="Member-setMember_desc">🧾 setMember 概説</span></a>

- 登録済メンバの場合は更新、未登録の場合は新規登録(追加)を行う

### <a href="#Member-setMember_top"><span id="Member-setMember_param">▶️ setMember 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |

### <a href="#Member-setMember_top"><span id="Member-setMember_return">◀️ setMember 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| null \| Error | 戻り値 |
## <span id="Member-unfreeze_top">🧩 unfreeze()</span>

- 引数でmemberIdが指定されなかった場合、凍結中デバイス一覧の要求と看做す

### <a href="#Member-unfreeze_top"><span id="Member-unfreeze_desc">🧾 unfreeze 概説</span></a>

- 引数でmemberIdが指定されなかった場合、凍結中デバイス一覧の要求と看做す<br>- deviceIdの指定が無い場合、memberIdが使用する凍結中デバイス全てを対象とする<br>- memberListシートのGoogle Spreadのメニューから管理者が実行することを想定

### <a href="#Member-unfreeze_top"><span id="Member-unfreeze_param">▶️ unfreeze 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |

### <a href="#Member-unfreeze_top"><span id="Member-unfreeze_return">◀️ unfreeze 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| null \| Error | 戻り値 |
## <span id="Member-updateCPkey_top">🧩 updateCPkey()</span>

Member#updateCPkey

### <a href="#Member-updateCPkey_top"><span id="Member-updateCPkey_param">▶️ updateCPkey 引数</span></a>

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| arg | string | 必須 | 引数 |

### <a href="#Member-updateCPkey_top"><span id="Member-updateCPkey_return">◀️ updateCPkey 戻り値</span></a>

| データ型 | 説明 |
| :-- | :-- |
| null \| Error | 戻り値 |