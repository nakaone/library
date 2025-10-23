# authServer 関数 仕様書

## 🧭 概要

authServerは、クライアント(authClient)からの暗号化通信リクエストを復号・検証し、
メンバ状態と要求内容に応じてサーバ側処理を適切に振り分ける中核関数です。

## ■ 設計方針

- クロージャ関数とする

## 🧩 内部構成(クラス変数)

<details><summary>authScriptProperties</summary>
<a name="authScriptProperties"></a>

キー名は`authConfig.system.name`、データは以下のオブジェクトをJSON化した文字列。

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | keyGeneratedDateTime | ❌ | number |  | UNIX時刻 |
| 2 | SPkey | ❌ | string |  | PEM形式の公開鍵文字列 |
| 3 | SSkey | ❌ | string |  | PEM形式の秘密鍵文字列(暗号化済み) |
| 4 | oldSPkey | ❌ | string |  | cryptoServer.reset実行前にバックアップした公開鍵 |
| 5 | oldSSkey | ❌ | string |  | cryptoServer.reset実行前にバックアップした秘密鍵 |
| 6 | requestLog | ⭕ | authRequestLog[] |  | 重複チェック用のリクエスト履歴 |
</details>

<details><summary>Member</summary>
<a name="Member"></a>

メンバ一覧(アカウント管理表)上のメンバ単位の管理情報

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | memberId | ❌ | string |  | メンバの識別子(=メールアドレス) |
| 2 | name | ❌ | string |  | メンバの氏名 |
| 3 | status | ⭕ | string | 未加入 | メンバの状態。未加入,未審査,審査済,加入中,加入禁止 |
| 4 | log | ⭕ | string | new MemberLog() | メンバの履歴情報(MemberLog)を保持するJSON文字列 |
| 5 | profile | ⭕ | string | new MemberProfile() | メンバの属性情報(MemberProfile)を保持するJSON文字列 |
| 6 | device | ❌ | string |  | マルチデバイス対応のためのデバイス情報(MemberDevice[])を保持するJSON文字列 |
| 7 | note | ⭕ | string |  | 当該メンバに対する備考 |
</details>

## 🧱 メイン処理

- classのconstructor()に相当
- 引数はauthServer内共有用の変数`pv`に保存

### 📤 入力項目

<details><summary>encryptedRequest</summary>

<a name="encryptedRequest"></a>

- authClientからauthServerに送られる、暗号化された処理要求オブジェクト
- ciphertextはauthRequestをJSON化、RSA-OAEP暗号化＋署名付与した文字列
- memberId,deviceIdは平文

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | memberId | ❌ | string |  | メンバの識別子(=メールアドレス) |
| 2 | deviceId | ❌ | string |  | デバイスの識別子 |
| 3 | ciphertext | ❌ | string |  | 暗号化した文字列 |

</details>

### 📥 出力項目

<details><summary>encryptedResponse</summary>

<a name="encryptedResponse"></a>

- authServerからauthClientに返される、暗号化された処理結果オブジェクト
- ciphertextはauthResponseをJSON化、RSA-OAEP暗号化＋署名付与した文字列

| No | 項目名 | 任意 | データ型 | 既定値 | 説明 |
| --: | :-- | :--: | :-- | :-- | :-- |
| 1 | ciphertext | ❌ | string |  | 暗号化した文字列 |

</details>

### 処理手順

<details><summary>シーケンス図</summary>

<svg aria-roledescription="sequence" role="graphics-document document" viewBox="-50 -10 929 945" style="max-width: 929px; background-color: white;" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="100%" id="my-svg"><g><rect class="actor actor-bottom" ry="3" rx="3" name="cryptoServer" height="65" width="150" stroke="#666" fill="#eaeaea" y="859" x="679"/><text style="text-anchor: middle; font-size: 16px; font-weight: 400;" class="actor actor-box" alignment-baseline="central" dominant-baseline="central" y="891.5" x="754"><tspan dy="0" x="754">cryptoServer</tspan></text></g><g><rect class="actor actor-bottom" ry="3" rx="3" name="memberList" height="65" width="150" stroke="#666" fill="#eaeaea" y="859" x="479"/><text style="text-anchor: middle; font-size: 16px; font-weight: 400;" class="actor actor-box" alignment-baseline="central" dominant-baseline="central" y="891.5" x="554"><tspan dy="0" x="554">memberList</tspan></text></g><g><rect class="actor actor-bottom" ry="3" rx="3" name="authServer" height="65" width="150" stroke="#666" fill="#eaeaea" y="859" x="259"/><text style="text-anchor: middle; font-size: 16px; font-weight: 400;" class="actor actor-box" alignment-baseline="central" dominant-baseline="central" y="891.5" x="334"><tspan dy="0" x="334">authServer</tspan></text></g><g><rect class="actor actor-bottom" ry="3" rx="3" name="authClient" height="65" width="150" stroke="#666" fill="#eaeaea" y="859" x="0"/><text style="text-anchor: middle; font-size: 16px; font-weight: 400;" class="actor actor-box" alignment-baseline="central" dominant-baseline="central" y="891.5" x="75"><tspan dy="0" x="75">authClient</tspan></text></g><g><line name="cryptoServer" stroke="#999" stroke-width="0.5px" class="actor-line 200" y2="859" x2="754" y1="5" x1="754" id="actor3"/><g id="root-3"><rect class="actor actor-top" ry="3" rx="3" name="cryptoServer" height="65" width="150" stroke="#666" fill="#eaeaea" y="0" x="679"/><text style="text-anchor: middle; font-size: 16px; font-weight: 400;" class="actor actor-box" alignment-baseline="central" dominant-baseline="central" y="32.5" x="754"><tspan dy="0" x="754">cryptoServer</tspan></text></g></g><g><line name="memberList" stroke="#999" stroke-width="0.5px" class="actor-line 200" y2="859" x2="554" y1="5" x1="554" id="actor2"/><g id="root-2"><rect class="actor actor-top" ry="3" rx="3" name="memberList" height="65" width="150" stroke="#666" fill="#eaeaea" y="0" x="479"/><text style="text-anchor: middle; font-size: 16px; font-weight: 400;" class="actor actor-box" alignment-baseline="central" dominant-baseline="central" y="32.5" x="554"><tspan dy="0" x="554">memberList</tspan></text></g></g><g><line name="authServer" stroke="#999" stroke-width="0.5px" class="actor-line 200" y2="859" x2="334" y1="5" x1="334" id="actor1"/><g id="root-1"><rect class="actor actor-top" ry="3" rx="3" name="authServer" height="65" width="150" stroke="#666" fill="#eaeaea" y="0" x="259"/><text style="text-anchor: middle; font-size: 16px; font-weight: 400;" class="actor actor-box" alignment-baseline="central" dominant-baseline="central" y="32.5" x="334"><tspan dy="0" x="334">authServer</tspan></text></g></g><g><line name="authClient" stroke="#999" stroke-width="0.5px" class="actor-line 200" y2="859" x2="75" y1="5" x1="75" id="actor0"/><g id="root-0"><rect class="actor actor-top" ry="3" rx="3" name="authClient" height="65" width="150" stroke="#666" fill="#eaeaea" y="0" x="0"/><text style="text-anchor: middle; font-size: 16px; font-weight: 400;" class="actor actor-box" alignment-baseline="central" dominant-baseline="central" y="32.5" x="75"><tspan dy="0" x="75">authClient</tspan></text></g></g><style>#my-svg{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;fill:#333;}#my-svg .error-icon{fill:#552222;}#my-svg .error-text{fill:#552222;stroke:#552222;}#my-svg .edge-thickness-normal{stroke-width:1px;}#my-svg .edge-thickness-thick{stroke-width:3.5px;}#my-svg .edge-pattern-solid{stroke-dasharray:0;}#my-svg .edge-thickness-invisible{stroke-width:0;fill:none;}#my-svg .edge-pattern-dashed{stroke-dasharray:3;}#my-svg .edge-pattern-dotted{stroke-dasharray:2;}#my-svg .marker{fill:#333333;stroke:#333333;}#my-svg .marker.cross{stroke:#333333;}#my-svg svg{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;}#my-svg p{margin:0;}#my-svg .actor{stroke:hsl(259.6261682243, 59.7765363128%, 87.9019607843%);fill:#ECECFF;}#my-svg text.actor&gt;tspan{fill:black;stroke:none;}#my-svg .actor-line{stroke:hsl(259.6261682243, 59.7765363128%, 87.9019607843%);}#my-svg .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#333;}#my-svg .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#333;}#my-svg #arrowhead path{fill:#333;stroke:#333;}#my-svg .sequenceNumber{fill:white;}#my-svg #sequencenumber{fill:#333;}#my-svg #crosshead path{fill:#333;stroke:#333;}#my-svg .messageText{fill:#333;stroke:none;}#my-svg .labelBox{stroke:hsl(259.6261682243, 59.7765363128%, 87.9019607843%);fill:#ECECFF;}#my-svg .labelText,#my-svg .labelText&gt;tspan{fill:black;stroke:none;}#my-svg .loopText,#my-svg .loopText&gt;tspan{fill:black;stroke:none;}#my-svg .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:hsl(259.6261682243, 59.7765363128%, 87.9019607843%);fill:hsl(259.6261682243, 59.7765363128%, 87.9019607843%);}#my-svg .note{stroke:#aaaa33;fill:#fff5ad;}#my-svg .noteText,#my-svg .noteText&gt;tspan{fill:black;stroke:none;}#my-svg .activation0{fill:#f4f4f4;stroke:#666;}#my-svg .activation1{fill:#f4f4f4;stroke:#666;}#my-svg .activation2{fill:#f4f4f4;stroke:#666;}#my-svg .actorPopupMenu{position:absolute;}#my-svg .actorPopupMenuPanel{position:absolute;fill:#ECECFF;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#my-svg .actor-man line{stroke:hsl(259.6261682243, 59.7765363128%, 87.9019607843%);fill:#ECECFF;}#my-svg .actor-man circle,#my-svg line{stroke:hsl(259.6261682243, 59.7765363128%, 87.9019607843%);fill:#ECECFF;stroke-width:2px;}#my-svg :root{--mermaid-font-family:"trebuchet ms",verdana,arial,sans-serif;}</style><g/><defs><symbol height="24" width="24" id="computer"><path d="M2 2v13h20v-13h-20zm18 11h-16v-9h16v9zm-10.228 6l.466-1h3.524l.467 1h-4.457zm14.228 3h-24l2-6h2.104l-1.33 4h18.45l-1.297-4h2.073l2 6zm-5-10h-14v-7h14v7z" transform="scale(.5)"/></symbol></defs><defs><symbol clip-rule="evenodd" fill-rule="evenodd" id="database"><path d="M12.258.001l.256.004.255.005.253.008.251.01.249.012.247.015.246.016.242.019.241.02.239.023.236.024.233.027.231.028.229.031.225.032.223.034.22.036.217.038.214.04.211.041.208.043.205.045.201.046.198.048.194.05.191.051.187.053.183.054.18.056.175.057.172.059.168.06.163.061.16.063.155.064.15.066.074.033.073.033.071.034.07.034.069.035.068.035.067.035.066.035.064.036.064.036.062.036.06.036.06.037.058.037.058.037.055.038.055.038.053.038.052.038.051.039.05.039.048.039.047.039.045.04.044.04.043.04.041.04.04.041.039.041.037.041.036.041.034.041.033.042.032.042.03.042.029.042.027.042.026.043.024.043.023.043.021.043.02.043.018.044.017.043.015.044.013.044.012.044.011.045.009.044.007.045.006.045.004.045.002.045.001.045v17l-.001.045-.002.045-.004.045-.006.045-.007.045-.009.044-.011.045-.012.044-.013.044-.015.044-.017.043-.018.044-.02.043-.021.043-.023.043-.024.043-.026.043-.027.042-.029.042-.03.042-.032.042-.033.042-.034.041-.036.041-.037.041-.039.041-.04.041-.041.04-.043.04-.044.04-.045.04-.047.039-.048.039-.05.039-.051.039-.052.038-.053.038-.055.038-.055.038-.058.037-.058.037-.06.037-.06.036-.062.036-.064.036-.064.036-.066.035-.067.035-.068.035-.069.035-.07.034-.071.034-.073.033-.074.033-.15.066-.155.064-.16.063-.163.061-.168.06-.172.059-.175.057-.18.056-.183.054-.187.053-.191.051-.194.05-.198.048-.201.046-.205.045-.208.043-.211.041-.214.04-.217.038-.22.036-.223.034-.225.032-.229.031-.231.028-.233.027-.236.024-.239.023-.241.02-.242.019-.246.016-.247.015-.249.012-.251.01-.253.008-.255.005-.256.004-.258.001-.258-.001-.256-.004-.255-.005-.253-.008-.251-.01-.249-.012-.247-.015-.245-.016-.243-.019-.241-.02-.238-.023-.236-.024-.234-.027-.231-.028-.228-.031-.226-.032-.223-.034-.22-.036-.217-.038-.214-.04-.211-.041-.208-.043-.204-.045-.201-.046-.198-.048-.195-.05-.19-.051-.187-.053-.184-.054-.179-.056-.176-.057-.172-.059-.167-.06-.164-.061-.159-.063-.155-.064-.151-.066-.074-.033-.072-.033-.072-.034-.07-.034-.069-.035-.068-.035-.067-.035-.066-.035-.064-.036-.063-.036-.062-.036-.061-.036-.06-.037-.058-.037-.057-.037-.056-.038-.055-.038-.053-.038-.052-.038-.051-.039-.049-.039-.049-.039-.046-.039-.046-.04-.044-.04-.043-.04-.041-.04-.04-.041-.039-.041-.037-.041-.036-.041-.034-.041-.033-.042-.032-.042-.03-.042-.029-.042-.027-.042-.026-.043-.024-.043-.023-.043-.021-.043-.02-.043-.018-.044-.017-.043-.015-.044-.013-.044-.012-.044-.011-.045-.009-.044-.007-.045-.006-.045-.004-.045-.002-.045-.001-.045v-17l.001-.045.002-.045.004-.045.006-.045.007-.045.009-.044.011-.045.012-.044.013-.044.015-.044.017-.043.018-.044.02-.043.021-.043.023-.043.024-.043.026-.043.027-.042.029-.042.03-.042.032-.042.033-.042.034-.041.036-.041.037-.041.039-.041.04-.041.041-.04.043-.04.044-.04.046-.04.046-.039.049-.039.049-.039.051-.039.052-.038.053-.038.055-.038.056-.038.057-.037.058-.037.06-.037.061-.036.062-.036.063-.036.064-.036.066-.035.067-.035.068-.035.069-.035.07-.034.072-.034.072-.033.074-.033.151-.066.155-.064.159-.063.164-.061.167-.06.172-.059.176-.057.179-.056.184-.054.187-.053.19-.051.195-.05.198-.048.201-.046.204-.045.208-.043.211-.041.214-.04.217-.038.22-.036.223-.034.226-.032.228-.031.231-.028.234-.027.236-.024.238-.023.241-.02.243-.019.245-.016.247-.015.249-.012.251-.01.253-.008.255-.005.256-.004.258-.001.258.001zm-9.258 20.499v.01l.001.021.003.021.004.022.005.021.006.022.007.022.009.023.01.022.011.023.012.023.013.023.015.023.016.024.017.023.018.024.019.024.021.024.022.025.023.024.024.025.052.049.056.05.061.051.066.051.07.051.075.051.079.052.084.052.088.052.092.052.097.052.102.051.105.052.11.052.114.051.119.051.123.051.127.05.131.05.135.05.139.048.144.049.147.047.152.047.155.047.16.045.163.045.167.043.171.043.176.041.178.041.183.039.187.039.19.037.194.035.197.035.202.033.204.031.209.03.212.029.216.027.219.025.222.024.226.021.23.02.233.018.236.016.24.015.243.012.246.01.249.008.253.005.256.004.259.001.26-.001.257-.004.254-.005.25-.008.247-.011.244-.012.241-.014.237-.016.233-.018.231-.021.226-.021.224-.024.22-.026.216-.027.212-.028.21-.031.205-.031.202-.034.198-.034.194-.036.191-.037.187-.039.183-.04.179-.04.175-.042.172-.043.168-.044.163-.045.16-.046.155-.046.152-.047.148-.048.143-.049.139-.049.136-.05.131-.05.126-.05.123-.051.118-.052.114-.051.11-.052.106-.052.101-.052.096-.052.092-.052.088-.053.083-.051.079-.052.074-.052.07-.051.065-.051.06-.051.056-.05.051-.05.023-.024.023-.025.021-.024.02-.024.019-.024.018-.024.017-.024.015-.023.014-.024.013-.023.012-.023.01-.023.01-.022.008-.022.006-.022.006-.022.004-.022.004-.021.001-.021.001-.021v-4.127l-.077.055-.08.053-.083.054-.085.053-.087.052-.09.052-.093.051-.095.05-.097.05-.1.049-.102.049-.105.048-.106.047-.109.047-.111.046-.114.045-.115.045-.118.044-.12.043-.122.042-.124.042-.126.041-.128.04-.13.04-.132.038-.134.038-.135.037-.138.037-.139.035-.142.035-.143.034-.144.033-.147.032-.148.031-.15.03-.151.03-.153.029-.154.027-.156.027-.158.026-.159.025-.161.024-.162.023-.163.022-.165.021-.166.02-.167.019-.169.018-.169.017-.171.016-.173.015-.173.014-.175.013-.175.012-.177.011-.178.01-.179.008-.179.008-.181.006-.182.005-.182.004-.184.003-.184.002h-.37l-.184-.002-.184-.003-.182-.004-.182-.005-.181-.006-.179-.008-.179-.008-.178-.01-.176-.011-.176-.012-.175-.013-.173-.014-.172-.015-.171-.016-.17-.017-.169-.018-.167-.019-.166-.02-.165-.021-.163-.022-.162-.023-.161-.024-.159-.025-.157-.026-.156-.027-.155-.027-.153-.029-.151-.03-.15-.03-.148-.031-.146-.032-.145-.033-.143-.034-.141-.035-.14-.035-.137-.037-.136-.037-.134-.038-.132-.038-.13-.04-.128-.04-.126-.041-.124-.042-.122-.042-.12-.044-.117-.043-.116-.045-.113-.045-.112-.046-.109-.047-.106-.047-.105-.048-.102-.049-.1-.049-.097-.05-.095-.05-.093-.052-.09-.051-.087-.052-.085-.053-.083-.054-.08-.054-.077-.054v4.127zm0-5.654v.011l.001.021.003.021.004.021.005.022.006.022.007.022.009.022.01.022.011.023.012.023.013.023.015.024.016.023.017.024.018.024.019.024.021.024.022.024.023.025.024.024.052.05.056.05.061.05.066.051.07.051.075.052.079.051.084.052.088.052.092.052.097.052.102.052.105.052.11.051.114.051.119.052.123.05.127.051.131.05.135.049.139.049.144.048.147.048.152.047.155.046.16.045.163.045.167.044.171.042.176.042.178.04.183.04.187.038.19.037.194.036.197.034.202.033.204.032.209.03.212.028.216.027.219.025.222.024.226.022.23.02.233.018.236.016.24.014.243.012.246.01.249.008.253.006.256.003.259.001.26-.001.257-.003.254-.006.25-.008.247-.01.244-.012.241-.015.237-.016.233-.018.231-.02.226-.022.224-.024.22-.025.216-.027.212-.029.21-.03.205-.032.202-.033.198-.035.194-.036.191-.037.187-.039.183-.039.179-.041.175-.042.172-.043.168-.044.163-.045.16-.045.155-.047.152-.047.148-.048.143-.048.139-.05.136-.049.131-.05.126-.051.123-.051.118-.051.114-.052.11-.052.106-.052.101-.052.096-.052.092-.052.088-.052.083-.052.079-.052.074-.051.07-.052.065-.051.06-.05.056-.051.051-.049.023-.025.023-.024.021-.025.02-.024.019-.024.018-.024.017-.024.015-.023.014-.023.013-.024.012-.022.01-.023.01-.023.008-.022.006-.022.006-.022.004-.021.004-.022.001-.021.001-.021v-4.139l-.077.054-.08.054-.083.054-.085.052-.087.053-.09.051-.093.051-.095.051-.097.05-.1.049-.102.049-.105.048-.106.047-.109.047-.111.046-.114.045-.115.044-.118.044-.12.044-.122.042-.124.042-.126.041-.128.04-.13.039-.132.039-.134.038-.135.037-.138.036-.139.036-.142.035-.143.033-.144.033-.147.033-.148.031-.15.03-.151.03-.153.028-.154.028-.156.027-.158.026-.159.025-.161.024-.162.023-.163.022-.165.021-.166.02-.167.019-.169.018-.169.017-.171.016-.173.015-.173.014-.175.013-.175.012-.177.011-.178.009-.179.009-.179.007-.181.007-.182.005-.182.004-.184.003-.184.002h-.37l-.184-.002-.184-.003-.182-.004-.182-.005-.181-.007-.179-.007-.179-.009-.178-.009-.176-.011-.176-.012-.175-.013-.173-.014-.172-.015-.171-.016-.17-.017-.169-.018-.167-.019-.166-.02-.165-.021-.163-.022-.162-.023-.161-.024-.159-.025-.157-.026-.156-.027-.155-.028-.153-.028-.151-.03-.15-.03-.148-.031-.146-.033-.145-.033-.143-.033-.141-.035-.14-.036-.137-.036-.136-.037-.134-.038-.132-.039-.13-.039-.128-.04-.126-.041-.124-.042-.122-.043-.12-.043-.117-.044-.116-.044-.113-.046-.112-.046-.109-.046-.106-.047-.105-.048-.102-.049-.1-.049-.097-.05-.095-.051-.093-.051-.09-.051-.087-.053-.085-.052-.083-.054-.08-.054-.077-.054v4.139zm0-5.666v.011l.001.02.003.022.004.021.005.022.006.021.007.022.009.023.01.022.011.023.012.023.013.023.015.023.016.024.017.024.018.023.019.024.021.025.022.024.023.024.024.025.052.05.056.05.061.05.066.051.07.051.075.052.079.051.084.052.088.052.092.052.097.052.102.052.105.051.11.052.114.051.119.051.123.051.127.05.131.05.135.05.139.049.144.048.147.048.152.047.155.046.16.045.163.045.167.043.171.043.176.042.178.04.183.04.187.038.19.037.194.036.197.034.202.033.204.032.209.03.212.028.216.027.219.025.222.024.226.021.23.02.233.018.236.017.24.014.243.012.246.01.249.008.253.006.256.003.259.001.26-.001.257-.003.254-.006.25-.008.247-.01.244-.013.241-.014.237-.016.233-.018.231-.02.226-.022.224-.024.22-.025.216-.027.212-.029.21-.03.205-.032.202-.033.198-.035.194-.036.191-.037.187-.039.183-.039.179-.041.175-.042.172-.043.168-.044.163-.045.16-.045.155-.047.152-.047.148-.048.143-.049.139-.049.136-.049.131-.051.126-.05.123-.051.118-.052.114-.051.11-.052.106-.052.101-.052.096-.052.092-.052.088-.052.083-.052.079-.052.074-.052.07-.051.065-.051.06-.051.056-.05.051-.049.023-.025.023-.025.021-.024.02-.024.019-.024.018-.024.017-.024.015-.023.014-.024.013-.023.012-.023.01-.022.01-.023.008-.022.006-.022.006-.022.004-.022.004-.021.001-.021.001-.021v-4.153l-.077.054-.08.054-.083.053-.085.053-.087.053-.09.051-.093.051-.095.051-.097.05-.1.049-.102.048-.105.048-.106.048-.109.046-.111.046-.114.046-.115.044-.118.044-.12.043-.122.043-.124.042-.126.041-.128.04-.13.039-.132.039-.134.038-.135.037-.138.036-.139.036-.142.034-.143.034-.144.033-.147.032-.148.032-.15.03-.151.03-.153.028-.154.028-.156.027-.158.026-.159.024-.161.024-.162.023-.163.023-.165.021-.166.02-.167.019-.169.018-.169.017-.171.016-.173.015-.173.014-.175.013-.175.012-.177.01-.178.01-.179.009-.179.007-.181.006-.182.006-.182.004-.184.003-.184.001-.185.001-.185-.001-.184-.001-.184-.003-.182-.004-.182-.006-.181-.006-.179-.007-.179-.009-.178-.01-.176-.01-.176-.012-.175-.013-.173-.014-.172-.015-.171-.016-.17-.017-.169-.018-.167-.019-.166-.02-.165-.021-.163-.023-.162-.023-.161-.024-.159-.024-.157-.026-.156-.027-.155-.028-.153-.028-.151-.03-.15-.03-.148-.032-.146-.032-.145-.033-.143-.034-.141-.034-.14-.036-.137-.036-.136-.037-.134-.038-.132-.039-.13-.039-.128-.041-.126-.041-.124-.041-.122-.043-.12-.043-.117-.044-.116-.044-.113-.046-.112-.046-.109-.046-.106-.048-.105-.048-.102-.048-.1-.05-.097-.049-.095-.051-.093-.051-.09-.052-.087-.052-.085-.053-.083-.053-.08-.054-.077-.054v4.153zm8.74-8.179l-.257.004-.254.005-.25.008-.247.011-.244.012-.241.014-.237.016-.233.018-.231.021-.226.022-.224.023-.22.026-.216.027-.212.028-.21.031-.205.032-.202.033-.198.034-.194.036-.191.038-.187.038-.183.04-.179.041-.175.042-.172.043-.168.043-.163.045-.16.046-.155.046-.152.048-.148.048-.143.048-.139.049-.136.05-.131.05-.126.051-.123.051-.118.051-.114.052-.11.052-.106.052-.101.052-.096.052-.092.052-.088.052-.083.052-.079.052-.074.051-.07.052-.065.051-.06.05-.056.05-.051.05-.023.025-.023.024-.021.024-.02.025-.019.024-.018.024-.017.023-.015.024-.014.023-.013.023-.012.023-.01.023-.01.022-.008.022-.006.023-.006.021-.004.022-.004.021-.001.021-.001.021.001.021.001.021.004.021.004.022.006.021.006.023.008.022.01.022.01.023.012.023.013.023.014.023.015.024.017.023.018.024.019.024.02.025.021.024.023.024.023.025.051.05.056.05.06.05.065.051.07.052.074.051.079.052.083.052.088.052.092.052.096.052.101.052.106.052.11.052.114.052.118.051.123.051.126.051.131.05.136.05.139.049.143.048.148.048.152.048.155.046.16.046.163.045.168.043.172.043.175.042.179.041.183.04.187.038.191.038.194.036.198.034.202.033.205.032.21.031.212.028.216.027.22.026.224.023.226.022.231.021.233.018.237.016.241.014.244.012.247.011.25.008.254.005.257.004.26.001.26-.001.257-.004.254-.005.25-.008.247-.011.244-.012.241-.014.237-.016.233-.018.231-.021.226-.022.224-.023.22-.026.216-.027.212-.028.21-.031.205-.032.202-.033.198-.034.194-.036.191-.038.187-.038.183-.04.179-.041.175-.042.172-.043.168-.043.163-.045.16-.046.155-.046.152-.048.148-.048.143-.048.139-.049.136-.05.131-.05.126-.051.123-.051.118-.051.114-.052.11-.052.106-.052.101-.052.096-.052.092-.052.088-.052.083-.052.079-.052.074-.051.07-.052.065-.051.06-.05.056-.05.051-.05.023-.025.023-.024.021-.024.02-.025.019-.024.018-.024.017-.023.015-.024.014-.023.013-.023.012-.023.01-.023.01-.022.008-.022.006-.023.006-.021.004-.022.004-.021.001-.021.001-.021-.001-.021-.001-.021-.004-.021-.004-.022-.006-.021-.006-.023-.008-.022-.01-.022-.01-.023-.012-.023-.013-.023-.014-.023-.015-.024-.017-.023-.018-.024-.019-.024-.02-.025-.021-.024-.023-.024-.023-.025-.051-.05-.056-.05-.06-.05-.065-.051-.07-.052-.074-.051-.079-.052-.083-.052-.088-.052-.092-.052-.096-.052-.101-.052-.106-.052-.11-.052-.114-.052-.118-.051-.123-.051-.126-.051-.131-.05-.136-.05-.139-.049-.143-.048-.148-.048-.152-.048-.155-.046-.16-.046-.163-.045-.168-.043-.172-.043-.175-.042-.179-.041-.183-.04-.187-.038-.191-.038-.194-.036-.198-.034-.202-.033-.205-.032-.21-.031-.212-.028-.216-.027-.22-.026-.224-.023-.226-.022-.231-.021-.233-.018-.237-.016-.241-.014-.244-.012-.247-.011-.25-.008-.254-.005-.257-.004-.26-.001-.26.001z" transform="scale(.5)"/></symbol></defs><defs><symbol height="24" width="24" id="clock"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.848 12.459c.202.038.202.333.001.372-1.907.361-6.045 1.111-6.547 1.111-.719 0-1.301-.582-1.301-1.301 0-.512.77-5.447 1.125-7.445.034-.192.312-.181.343.014l.985 6.238 5.394 1.011z" transform="scale(.5)"/></symbol></defs><defs><marker orient="auto-start-reverse" markerHeight="12" markerWidth="12" markerUnits="userSpaceOnUse" refY="5" refX="7.9" id="arrowhead"><path d="M -1 0 L 10 5 L 0 10 z"/></marker></defs><defs><marker refY="4.5" refX="4" orient="auto" markerHeight="8" markerWidth="15" id="crosshead"><path style="stroke-dasharray: 0, 0;" d="M 1,2 L 6,7 M 6,2 L 1,7" stroke-width="1pt" stroke="#000000" fill="none"/></marker></defs><defs><marker orient="auto" markerHeight="28" markerWidth="20" refY="7" refX="15.5" id="filled-head"><path d="M 18,7 L9,13 L14,7 L9,1 Z"/></marker></defs><defs><marker orient="auto" markerHeight="40" markerWidth="60" refY="15" refX="15" id="sequencenumber"><circle r="6" cy="15" cx="15"/></marker></defs><g><rect class="activation0" height="730" width="10" stroke="#666" fill="#EDF2AE" y="109" x="329"/></g><g><line class="loopLine" y2="533" x2="765" y1="533" x1="254"/><line class="loopLine" y2="785" x2="765" y1="533" x1="765"/><line class="loopLine" y2="785" x2="765" y1="785" x1="254"/><line class="loopLine" y2="785" x2="254" y1="533" x1="254"/><line style="stroke-dasharray: 3, 3;" class="loopLine" y2="657" x2="765" y1="657" x1="254"/><polygon class="labelBox" points="254,533 304,533 304,546 295.6,553 254,553"/><text style="font-size: 16px; font-weight: 400;" class="labelText" alignment-baseline="middle" dominant-baseline="middle" text-anchor="middle" y="546" x="279">alt</text><text style="font-size: 16px; font-weight: 400;" class="loopText" text-anchor="middle" y="551" x="534.5"><tspan x="534.5">[authResponse.result === 'fatal']</tspan></text><text style="font-size: 16px; font-weight: 400;" class="loopText" text-anchor="middle" y="675" x="509.5">[authResponse.result !== 'fatal']</text></g><g><line class="loopLine" y2="295" x2="775" y1="295" x1="182.5"/><line class="loopLine" y2="795" x2="775" y1="295" x1="775"/><line class="loopLine" y2="795" x2="775" y1="795" x1="182.5"/><line class="loopLine" y2="795" x2="182.5" y1="295" x1="182.5"/><line style="stroke-dasharray: 3, 3;" class="loopLine" y2="419" x2="775" y1="419" x1="182.5"/><polygon class="labelBox" points="182.5,295 232.5,295 232.5,308 224.1,315 182.5,315"/><text style="font-size: 16px; font-weight: 400;" class="labelText" alignment-baseline="middle" dominant-baseline="middle" text-anchor="middle" y="308" x="208">alt</text><text style="font-size: 16px; font-weight: 400;" class="loopText" text-anchor="middle" y="313" x="503.75"><tspan x="503.75">[復号・署名検証失敗]</tspan></text><text style="font-size: 16px; font-weight: 400;" class="loopText" text-anchor="middle" y="437" x="478.75">[復号・署名検証成功]</text></g><text style="font-size: 16px; font-weight: 400;" dy="1em" class="messageText" alignment-baseline="middle" dominant-baseline="middle" text-anchor="middle" y="80" x="201">処理要求(encryptedRequest)</text><line style="fill: none;" marker-end="url(#arrowhead)" stroke="none" stroke-width="2" class="messageLine0" y2="109" x2="326" y1="109" x1="76"/><text style="font-size: 16px; font-weight: 400;" dy="1em" class="messageText" alignment-baseline="middle" dominant-baseline="middle" text-anchor="middle" y="124" x="445">memberId, deviceId</text><line style="fill: none;" marker-end="url(#arrowhead)" stroke="none" stroke-width="2" class="messageLine0" y2="153" x2="550" y1="153" x1="339"/><text style="font-size: 16px; font-weight: 400;" dy="1em" class="messageText" alignment-baseline="middle" dominant-baseline="middle" text-anchor="middle" y="168" x="448">Memberインスタンス</text><line style="fill: none;" marker-end="url(#arrowhead)" stroke="none" stroke-width="2" class="messageLine0" y2="197" x2="342" y1="197" x1="553"/><text style="font-size: 16px; font-weight: 400;" dy="1em" class="messageText" alignment-baseline="middle" dominant-baseline="middle" text-anchor="middle" y="212" x="545">復号・検証要求(encryptedRequest)</text><line style="fill: none;" marker-end="url(#arrowhead)" stroke="none" stroke-width="2" class="messageLine0" y2="241" x2="750" y1="241" x1="339"/><text style="font-size: 16px; font-weight: 400;" dy="1em" class="messageText" alignment-baseline="middle" dominant-baseline="middle" text-anchor="middle" y="256" x="548">decryptedRequest</text><line style="fill: none;" marker-end="url(#arrowhead)" stroke="none" stroke-width="2" class="messageLine0" y2="285" x2="342" y1="285" x1="753"/><text style="font-size: 16px; font-weight: 400;" dy="1em" class="messageText" alignment-baseline="middle" dominant-baseline="middle" text-anchor="middle" y="345" x="339">responseSPkey()実行</text><path style="fill: none;" marker-end="url(#arrowhead)" stroke="none" stroke-width="2" class="messageLine0" d="M 339,374 C 399,364 399,404 339,394"/><text style="font-size: 16px; font-weight: 400;" dy="1em" class="messageText" alignment-baseline="middle" dominant-baseline="middle" text-anchor="middle" y="464" x="339">処理分岐(decryptedRequest-&gt;authResponse)</text><path style="fill: none;" marker-end="url(#arrowhead)" stroke="none" stroke-width="2" class="messageLine0" d="M 339,493 C 399,483 399,523 339,513"/><text style="font-size: 16px; font-weight: 400;" dy="1em" class="messageText" alignment-baseline="middle" dominant-baseline="middle" text-anchor="middle" y="583" x="339">ログ出力</text><path style="fill: none;" marker-end="url(#arrowhead)" stroke="none" stroke-width="2" class="messageLine0" d="M 339,612 C 399,602 399,642 339,632"/><text style="font-size: 16px; font-weight: 400;" dy="1em" class="messageText" alignment-baseline="middle" dominant-baseline="middle" text-anchor="middle" y="702" x="545">署名・暗号化要求(authResponse)</text><line style="fill: none;" marker-end="url(#arrowhead)" stroke="none" stroke-width="2" class="messageLine0" y2="731" x2="750" y1="731" x1="339"/><text style="font-size: 16px; font-weight: 400;" dy="1em" class="messageText" alignment-baseline="middle" dominant-baseline="middle" text-anchor="middle" y="746" x="548">encryptedResponse</text><line style="fill: none;" marker-end="url(#arrowhead)" stroke="none" stroke-width="2" class="messageLine0" y2="775" x2="342" y1="775" x1="753"/><text style="font-size: 16px; font-weight: 400;" dy="1em" class="messageText" alignment-baseline="middle" dominant-baseline="middle" text-anchor="middle" y="810" x="204">encryptedResponse</text><line style="fill: none;" marker-end="url(#arrowhead)" stroke="none" stroke-width="2" class="messageLine0" y2="839" x2="79" y1="839" x1="329"/></svg>

</details>

#### 「処理分岐」手順詳説

- 戻り値用`authResponse`(pv.rv)と監査ログ用`authAuditLog`(pv.log)を準備
- 重複リクエストチェック
  - authScriptProperties.requestLogで重複リクエストをチェック
  - エラーならエラーログに出力
    - `authErrorLog.result` = 'fatal'
    - `authErrorLog.message` = 'Duplicate requestId'
  - authServerConfig.requestIdRetention以上経過したリクエスト履歴は削除
  - Errorをthrowして終了
- authClient内発処理か判定
  - `authRequest.func`が以下のいずれかの文字列ならauthClient内発処理と判定、メソッドを呼び出し
    | 文字列 | 呼び出すメソッド |
    | :-- | :-- |
    | ::updateCPkey:: | updateCPkey() |
    | ::passcode:: | loginTrial() |
    | ::newMember:: | いまここ |
    | ::reissue:: | いまここ |
  - メソッドの戻り値をauthServerの戻り値として返して終了
- サーバ側関数が定義されているかチェック
  - `authServerConfig.func`のメンバ名に処理要求関数名(`authRequest.func`)が無ければ以下を返して終了
- 権限不要な処理要求か判定
  - `authServerConfig.func[処理要求関数名].authority === 0`ならcallFunctionメソッドを呼び出し
- メンバ・デバイスの状態により処理分岐
  - 当該メンバの状態を確認(`Member.getStatus()`)
  - 以下の表に従って処理分岐
    No | 状態 | 動作
    :-- | :-- | :--
    1 | 未加入 | memberList未登録<br>⇒ `membershipRequest()`メソッドを呼び出し
    2 | 未審査 | memberList登録済だが、管理者による加入認否が未決定(=加入審査状況の問合せ)<br>⇒ `notifyAcceptance()`メソッドを呼び出し
    3 | 審査済 | 管理者による加入認否が決定済<br>⇒ `notifyAcceptance()`メソッドを呼び出し
    4.1 | 未認証 | 認証(ログイン)不要の処理しか行えない状態。<br>無権限で行える処理 ⇒ `callFunction()`メソッドを呼び出し<br>無権限では行えない処理 ⇒ `loginTrial()`メソッドを呼び出し
    4.2 | 試行中 | パスコードによる認証を試行している状態<br>⇒ `loginTrial()`メソッドを呼び出し
    4.3 | 認証中 | 認証が通り、ログインして認証が必要な処理も行える状態<br>⇒ `callFunction()`メソッドを呼び出し
    4.4 | 凍結中 | 規定の試行回数連続して認証に失敗し、再認証要求が禁止された状態<br>⇒ `loginTrial()`メソッドを呼び出し
    5 | 加入禁止 | 管理者により加入が否認された状態<br>⇒ `notifyAcceptance()`メソッドを呼び出し
- 監査ログ(pv.log)を出力して「処理分岐」は終了

<!--
#### 参考：メンバの状態遷移

<!-:$src/Member/stateTransition.md:->
-->

## 🧱 membershipRequest()

- 新規メンバ加入要求を登録。管理者へメール通知。
- 引数は`authRequest`型、戻り値は`authResponse`型のオブジェクト
- 戻り値は`{result:'warning',message:'registerd'}`<br>
  ⇒ authClientでメンバに「加入申請しました。管理者による加入認否結果は後程メールでお知らせします」表示

## 🧱 notifyAcceptance()

- 加入審査状況の問合せへの回答
- 引数は`authRequest`型、戻り値は`authResponse`型のオブジェクト
- 審査結果が未決定の場合(Member.log.approval/denialが両方0)、戻り値は`{result:'warning',message:'under review'}`<br>
  ⇒ authClientでメンバに「現在審査中です。今暫くお待ちください」表示
- 審査の結果加入不可の場合(Member.log.denial>0)、戻り値は`{result:'warning',message:'denial'}`<br>
  ⇒ authClientでメンバに「残念ながら加入申請は否認されました」表示

※ 審査結果が「加入OK」となっていた場合、Member.getStatus==='未認証'となるので、このメソッドは呼ばれない

## 🧱 loginTrial()

ログイン要求を処理し、試行結果をMemberTrialに記録する

- 引数は`authRequest`型、戻り値は`authResponse`型のオブジェクト
- メンバが「未認証」の場合(=新たなログイン試行の場合)
  - 認証要求日時を設定(`Member.log.loginRequest = Date.now()`)
  - `Member.trial.log`の先頭に試行ログ(MemberTrialLogオブジェクト)を追加
  - パスコード通知メールをメンバに送信
  - 戻り値は`{result:'warning',message:'send passcode'}`<br>⇒ authClientはこれを受けパスコード再入力画面を表示
- メンバが「試行中」の場合、入力されたパスコードが正しいか検証
  - 正しかった場合
    - 認証成功日時を設定(`Member.log.loginSuccess = Date.now()`)
    - 認証有効期限を設定(`Member.log.loginExpiration = Date.now() + authServerConfig.loginLifeTime`)
  - 正しくなかった場合
    - 試行回数上限(authServerConfig.maxTrial)以下の場合
      - 戻り値は`{result:'warning',message:'unmatch'}`<br>⇒ authClientはこれを受けパスコード再入力画面を表示
    - 試行回数が上限に達した場合は「凍結中」に遷移
      - 認証失敗日時を設定(`Member.log.loginFailure = Date.now()`)
      - 認証無効期限を設定(`Member.log.unfreezeLogin = Date.now() + authServerConfig.loginFreeze`)
      - 戻り値は`{result:'warning',message:'freezing'}`<br>⇒ authClientはこれを受け「パスコードが連続して不一致だったため、現在アカウントは凍結中です。時間をおいて再試行してください」表示

## 🧱 callFunction()

- authServerConfig.funcを参照し、該当関数を実行。
- 引数は`authRequest`型、戻り値は`authResponse`型のオブジェクト

## 🧱 updateCPkey()

- 引数は`authRequest`型、戻り値は`authResponse`型のオブジェクト
- memberList上の該当するmemberId/deviceIdのCPkeyをauthRequest.signatureの値で更新する<br>
- 未更新のMember.CPkeyでencryptedResonseを作成し、authClientに返す<br>
- authClientはencryptedResonse受信時点では旧CPkeyで復号・署名検証を行い、サーバ側更新成功を受けてIndexedDBの更新を行う

<!-- Review: CPkey更新時に同時アクセスを防止するロック管理を追加検討。
⇒ ロック管理手順が複雑になりそうなこと、また運用上必要性が高いとは考えにくいことから見送り。

## その他のメソッド群
-->

## 🧱 responseSPkey(arg)

- クライアントから送られた文字列がCPkeyと推定される場合に、SPkeyを暗号化して返却。
- 公開鍵として不適切な文字列の場合、`{status:'fatal'}`を返す

## 🧱 setupEnvironment()

- 初期環境の整備を行う。GAS初回実行時の権限確認処理も含む。
- 「インストール型トリガー」認可トークン失効時も本メソッドを実行
- クラスで`static`で定義した関数のように、`authServer.setupEnvironment()`形式での実行を想定
- ScriptProperties未設定なら設定
- memberListへのアクセス(ダミー)
- admin宛テストメールの送信

## 🧱 resetSPkey()

- 緊急時用。authServerの鍵ペアを更新する
- クラスで`static`で定義した関数のように、`authServer.resetSPkey()`形式での実行を想定
- 引数・戻り値共に無し

## 🧱 listNotYetDecided()

- シートのメニューから呼び出す
- 加入否認が未定のメンバをリストアップ、順次認否入力のダイアログを表示
- 入力された認否をmemberListに記入(Member.log.approval/denial)
- 認否が確定したメンバに対して結果通知メールを発行

## ⏰ メンテナンス処理

## 🔐 セキュリティ仕様

## 🧾 エラーハンドリング仕様

<!--
## 🧱 proto()

### 📤 入力項目

<details><summary></summary>

</details>

### 📥 出力項目

<details><summary></summary>

</details>

### 処理手順
-->
