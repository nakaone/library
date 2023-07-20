[class Auth README](Auth.readme.md) >

<p style="font-size:2rem;text-shadow:2px 2px 4px #888;">署名・暗号化処理</p>

# トークン

- 各局の秘密鍵は(GASのソースでは無く)RSA(またはconfig)シートに記載

| Name | Type | Description |
| --- | --- | --- |
| fm | <code>string</code> \| <code>number</code> | 発信者名(gateway/front/master)。参加者の場合は受付番号 |
| to | <code>string</code> | 受信者名 |
| fc | <code>string</code> | 受信者側の処理名 |
| ts | <code>number</code> | 発信日時(new Date().getTime()) |

# cryptico

署名および暗号化・復号では、ローカルのjavascriptおよびGASで共通に使える"[cryptico](https://wwwtyro.github.io/cryptico/)"を使用する。

## サンプル

```
const cripticoTest = () => {
  // https://wwwtyro.github.io/cryptico/
  const v = {bits:1024,text:'Hellow, RSA world!',st:Date.now(),
    fm:{pass:'いろはにほへと'},to:{pass:'chiRiNuru_O'}};
  // 秘密鍵(RSA key)の作成
  v.fm.skey = cryptico.generateRSAKey(v.fm.pass,v.bits);
  v.to.skey = cryptico.generateRSAKey(v.to.pass,v.bits);
  // 公開鍵の作成
  v.fm.pkey = cryptico.publicKeyString(v.fm.skey);
  v.to.pkey = cryptico.publicKeyString(v.to.skey);
  // 作成
  v.token = cryptico.encrypt(v.text,v.to.pkey,v.fm.skey);
  console.log(v);
  // 復号
  v.result = cryptico.decrypt(v.token.cipher,v.to.skey);
  v.isFm = v.result.publicKeyString === v.fm.pkey;
  v.elaps = Date.now() - v.st;
  console.log(v); // 署名がfmであることの確認
}
```

## 使用上の注意

[cryptico](https://wwwtyro.github.io/cryptico/)からダウンロードしたものを解凍、中の"cryptico.min.js"をライブラリとして使用するが、中で'navigator'の値を参照しているためGASではそのままでは動作しない。

そこでGASのみライブラリの冒頭に以下を追加する(開発機の環境。適宜変更可)。

```
// navigatorは動作のために追加したブラウザの動作環境
const navigator = {
  appName: "Netscape",
  appVersion: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
};
```
