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

[総説](../specification.md) | [クライアント側仕様](../cl/client.md) | [サーバ側仕様](../sv/server.md) | [JavaScriptライブラリ](../JSLib.md) | [開発](../dev.md)

</div>

# <span id="memberdevice">MemberDevice クラス仕様書</span>

メンバのデバイス情報

メンバが使用する通信機器の情報。マルチデバイスに対応する

## <span id="memberdevice_summary">🧭 MemberDevice クラス 概要</span>

- [メンバ関係状態遷移図](../specification.md#member)
- [デバイス関係状態遷移図](../specification.md#device)
- [Member関係クラス図](Member.md#member_classdiagram)

## <span id="memberdevice_members">🔢 MemberDevice メンバ一覧</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| deviceId | string | <span style="color:red">必須</span> | デバイスの識別子。UUID |  |
| status | string | 未認証 | デバイスの状態 | 未認証,認証中,試行中,凍結中 |
| CPkey | string | <span style="color:red">必須</span> | メンバの公開鍵 |  |
| CPkeyUpdated | number | Date.now() | 最新のCPkeyが登録された日時 |  |
| trial | MemberTrial[] | [] | ログイン試行関連情報オブジェクト | シート上はJSON文字列 |

## <span id="memberdevice_methods">🧱 MemberDevice メソッド一覧</span>

| メソッド名 | 分類 | 内容 | 備考 |
| :-- | :-- | :-- | :-- |
| [constructor()](#memberdevice_constructor) | private | コンストラクタ |  |

### <span id="memberdevice_constructor"><a href="#memberdevice_methods">🧱 MemberDevice.constructor()</a></span>

#### <span id="memberdevice_constructor_referrer">📞 呼出元</span>

- [Member.setMember](Member.md#Member_members)

#### <span id="memberdevice_constructor_params">📥 引数</span>

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| arg | Object | {} |  | ユーザ指定の設定値 |

#### <span id="memberdevice_constructor_process">🧾 処理手順</span>

#### <span id="memberdevice_constructor_returns">📤 戻り値</span>

- [MemberDevice](#memberdevice_members)インスタンス