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

[総説](../readme.md) | [CL/SV共通](../common/index.md) | [CL側](../client/index.md) | [SV側](../server/index.md) | [暗号化](../crypto.md) | [メンバ](../Member.md) | [独自Lib](../lib/index.md) | [開発](../dev.md)

</div>

<p id="top" class="l1">"auth"クライアント側仕様書</p>

# 実装イメージ

```html
<input type="text" id="testval" value="設定値" />
<button onclick="getValue()">実行</button>
<div id="testResult"></div>

<script type="text/javascript">
  // ライブラリ関数定義
  function devTools(){...}; // (中略)

  // authClient関係クラス定義
  class authClient{...}
  class authConfig{...}
  class authClientConfig{...} // (中略)

  // グローバル変数定義
  const dev = devTools();
  const config = {...}; // authClient/Server共通設定情報
  let auth;  // authClient。HTML要素のイベント対応のためグローバル領域で宣言

  // 処理要求を発行するローカル関数
  function getValue(){
    try {
      const request = document.getElementById('testval').value;

      // サーバ側関数'trans01'にrequestを渡して処理要求
      const response = auth.exec('trans01',request);
      if( response instance of Error ) throw resopnse;

      document.getElementById('testResult').innerText = response;

    } catch(e) { dev.error(e); return e; }
  }

  // onLoad処理は"async"で宣言
  window.addEventListener('DOMContentLoaded', async () => {
    const v = { whois: 'DOMContentLoaded', rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      // IndexedDBからの読み込み等、非同期処理を実行
      auth = await authClient.initialize({
        // プロジェクト毎の独自パラメータ
      });

      dev.end(); // 終了処理
      return v.rv;
    } catch (e) { dev.error(e); return e; }
  });
</script>
```

# クライアント側処理分岐先決定手順

<style>#xf618826c-114a-4294-9d5a-164c9ad7c0aa td {vertical-align: top;}</style>
<table id="xf618826c-114a-4294-9d5a-164c9ad7c0aa">
  <tr class="r1">
    <th class="c1">No</th>
    <th class="c2">SPkey</th>
    <th class="c3">func</th>
    <th class="c4">as戻り値</th>
    <th class="c5">後続処理</th>
    <th class="c6">再帰func</th>
    <th class="c7">ac戻り値</th>
  </tr>
  <tr class="r2">
    <td class="c1">1</td>
    <td class="c2" rowspan="2">不保持</td>
    <td class="c3" rowspan="2">—</td>
    <td class="c4">[W01]SPkey配布</td>
    <td class="c5">SPkey格納</td>
    <td class="c6">サーバ関数名</td>
    <td class="c7">再帰呼出先の戻り値</td>
  </tr>
  <tr class="r3">
    <td class="c1">2</td>
    <td class="c4">[E01]CPkey重複</td>
    <td class="c5">—</td>
    <td class="c6">—</td>
    <td class="c7">[E01]CPkey重複</td>
  </tr>
  <tr class="r4">
    <td class="c1">3</td>
    <td class="c2" rowspan="18">保持</td>
    <td class="c3">::updateCPkey::</td>
    <td class="c4">[W02]CPkey更新</td>
    <td class="c5">CPkey置換</td>
    <td class="c6">サーバ関数名</td>
    <td class="c7">再帰呼出先の戻り値</td>
  </tr>
  <tr class="r5">
    <td class="c1">4</td>
    <td class="c3" rowspan="4">::passcode::</td>
    <td class="c4">[W03]一致</td>
    <td class="c5">—</td>
    <td class="c6">サーバ関数名</td>
    <td class="c7">再帰呼出先の戻り値</td>
  </tr>
  <tr class="r6">
    <td class="c1">5</td>
    <td class="c4" rowspan="2">[W07]要再試行</td>
    <td class="c5" rowspan="2">PC入力ダイアログ</td>
    <td class="c6">::passcode::</td>
    <td class="c7">再帰呼出先の戻り値</td>
  </tr>
  <tr class="r7">
    <td class="c1">6</td>
    <td class="c6">::reissue::</td>
    <td class="c7">再帰呼出先の戻り値</td>
  </tr>
  <tr class="r8">
    <td class="c1">7</td>
    <td class="c4">[E08]凍結中</td>
    <td class="c5">—</td>
    <td class="c6">—</td>
    <td class="c7">[E08]凍結中</td>
  </tr>
  <tr class="r9">
    <td class="c1">8</td>
    <td class="c3" rowspan="2">::reissue::</td>
    <td class="c4" rowspan="2">[W04]再発行</td>
    <td class="c5" rowspan="2">PC入力ダイアログ</td>
    <td class="c6">::passcode::</td>
    <td class="c7">再帰呼出先の戻り値</td>
  </tr>
  <tr class="r10">
    <td class="c1">9</td>
    <td class="c6">::reissue::</td>
    <td class="c7">再帰呼出先の戻り値</td>
  </tr>
  <tr class="r11">
    <td class="c1">10</td>
    <td class="c3" rowspan="11">サーバ関数名</td>
    <td class="c4">[E02]メンバ未登録</td>
    <td class="c5">—</td>
    <td class="c6">—</td>
    <td class="c7">[E02]メンバ未登録</td>
  </tr>
  <tr class="r12">
    <td class="c1">11</td>
    <td class="c4">[E03]デバイス未登録</td>
    <td class="c5">—</td>
    <td class="c6">—</td>
    <td class="c7">[E03]デバイス未登録</td>
  </tr>
  <tr class="r13">
    <td class="c1">12</td>
    <td class="c4">[E04]CPkey未登録</td>
    <td class="c5">—</td>
    <td class="c6">—</td>
    <td class="c7">[E04]CPkey未登録</td>
  </tr>
  <tr class="r14">
    <td class="c1">13</td>
    <td class="c4">[E05]加入禁止</td>
    <td class="c5">—</td>
    <td class="c6">—</td>
    <td class="c7">[E05]加入禁止</td>
  </tr>
  <tr class="r15">
    <td class="c1">14</td>
    <td class="c4">[E06]仮登録</td>
    <td class="c5">—</td>
    <td class="c6">—</td>
    <td class="c7">[E06]仮登録</td>
  </tr>
  <tr class="r16">
    <td class="c1">15</td>
    <td class="c4">[E07]未審査</td>
    <td class="c5">—</td>
    <td class="c6">—</td>
    <td class="c7">[E07]未審査</td>
  </tr>
  <tr class="r17">
    <td class="c1">16</td>
    <td class="c4">[E08]凍結中</td>
    <td class="c5">—</td>
    <td class="c6">—</td>
    <td class="c7">[E08]凍結中</td>
  </tr>
  <tr class="r18">
    <td class="c1">17</td>
    <td class="c4">[N01]処理結果</td>
    <td class="c5">—</td>
    <td class="c6">—</td>
    <td class="c7">[N01]処理結果</td>
  </tr>
  <tr class="r19">
    <td class="c1">18</td>
    <td class="c4">[W06]要CPkey更新</td>
    <td class="c5">CPkey更新</td>
    <td class="c6">::updateCPkey::</td>
    <td class="c7">再帰呼出先の戻り値</td>
  </tr>
  <tr class="r20">
    <td class="c1">19</td>
    <td class="c4" rowspan="2">[W05]通知メール送信</td>
    <td class="c5" rowspan="2">PC入力ダイアログ</td>
    <td class="c6">::passcode::</td>
    <td class="c7">再帰呼出先の戻り値</td>
  </tr>
  <tr class="r21">
    <td class="c1">20</td>
    <td class="c6">::reissue::</td>
    <td class="c7">再帰呼出先の戻り値</td>
  </tr>
</table>

- 再帰func「サーバ関数名」とはローカル関数から渡された関数名(authRequest.func)
- [W07]要再試行：ダイアログで「パスコード不一致」表示、ダイアログでパスコード再発行が選択された場合は::reissue::(パスコード再発行)
- [W04]再発行：ダイアログで「パスコード再発行済」表示
- [E02]メンバ未登録：SPkey配布時に仮IDは登録済⇒不正操作
- [E03]デバイス未登録：SPkey配布時に仮IDは登録済⇒不正操作
- [E04]CPkey未登録：SPkey配布時にCPkeyは登録済。期限切れなら「CPkey更新」⇒不正操作
- [W05]通知メール送信：ダイアログで「メールでパスコード送付済」表示
# グローバル関数・クラス一覧

| クラス/関数名 | 概要 |
| :-- | :-- |
| [authClient](authClient.md) | クライアント側中核クラス |
| [clearAuthEnvironment](clearAuthEnvironment.md) | 【開発用】IndexedDBの"Auth"データベースを削除し、環境をリセットする |
| [cryptoClient](cryptoClient.md) | クライアント側の暗号化・署名検証 |
| [localFunc](localFunc.md) | 【開発用】処理要求発行 |


# <span id="typedefList">データ型定義一覧</span>

| No | データ型名 | 概要 |
| --: | :-- | :-- |
| 1 | [authClientConfig](#authClientConfig) | 共通設定情報にauthClient特有項目を追加 |
| 2 | [authIndexedDB](#authIndexedDB) | IndexedDBに保存する内容(=this.idb) |

# 個別データ型定義


## <a href="#typedefList"><span id="authClientConfig">"authClientConfig" データ型定義</span></a>

authClientConfig: 共通設定情報にauthClient特有項目を追加

| 項目名 | データ型 | 要否/既定値 | 説明 | 備考 |
| :-- | :-- | :-- | :-- | :-- |
| api | string | 必須 | サーバ側WebアプリURLのID | https://script.google.com/macros/s/(この部分)/exec |
| timeout | number | 300000 | サーバからの応答待機時間 | これを超えた場合はサーバ側でfatalとなったと解釈する。既定値は5分 |
| storeName | string | "config" | IndexedDBのストア名 |  |
| dbVersion | number | 1 | IndexedDBのバージョン |  |


## <a href="#typedefList"><span id="authIndexedDB">"authIndexedDB" データ型定義</span></a>

authIndexedDB: IndexedDBに保存する内容(=this.idb)

| 項目名 | データ型 | 要否/既定値 | 説明 |
| :-- | :-- | :-- | :-- |
| memberId | string | 'dummyMemberID' | メンバ識別子(メールアドレス。初期値は固定文字列) |
| memberName | string | 'dummyMemberName' | メンバの氏名(初期値は固定文字列) |
| deviceId | string | 'dummyDeviceID' | サーバ側で生成(UUIDv4。初期値は固定文字列) |
| CSkeySign | CryptoKey | 必須 | 署名用秘密鍵 |
| CPkeySign | CryptoKey | 必須 | 署名用公開鍵 |
| CSkeyEnc | CryptoKey | 必須 | 暗号化用秘密鍵 |
| CPkeyEnc | CryptoKey | 必須 | 暗号化用公開鍵 |
| keyGeneratedDateTime | string | 必須 | 鍵ペア生成日時(UNIX時刻) |
| SPkeySign | string | null | サーバ側署名用公開鍵 |
| SPkeyEnc | string | null | サーバ側暗号化用公開鍵 |
