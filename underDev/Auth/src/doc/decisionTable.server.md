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
