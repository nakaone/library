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
