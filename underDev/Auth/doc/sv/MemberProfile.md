<style>
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

[総説](../specification.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md)

</div>

# <span id="memberprofile">MemberProfile クラス仕様書</span>

メンバの属性情報

## <span id="memberprofile_summary">🧭 MemberProfile クラス 概要</span>

- [メンバ関係状態遷移図](../specification.md#member)
- [デバイス関係状態遷移図](../specification.md#device)
- [Member関係クラス図](Member.md#member_classdiagram)

## <span id="memberprofile_members">🔢 MemberProfile メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| authority | number | <span style="color:red">必須</span> | メンバの持つ権限 | authServerConfig.func.authorityとの論理積>0なら当該関数実行権限ありと看做す |

## <span id="memberprofile_methods">🧱 MemberProfile メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#memberprofile_constructor) | private | コンストラクタ |  |

### <span id="memberprofile_constructor"><a href="#memberprofile_methods">🧱 MemberProfile.constructor()</a></span>

#### <span id="memberprofile_constructor_referrer">📞 呼出元</span>

- [Member.constructor](Member.md#Member_members)

#### <span id="memberprofile_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

#### <span id="memberprofile_constructor_process">🧾 処理手順</span>

#### <span id="memberprofile_constructor_returns">📤 戻り値</span>

- [MemberProfile](#memberprofile_members)インスタンス