# 変更履歴

## rev.1.0.0 : 2023/02/28

- [Cryptico](https://wwwtyro.github.io/cryptico/)からダウンロード。

GAS版は動作のために、先頭の`navigator`(ブラウザの動作環境)を追加

## rev.1.1.0 : 2024/08/28

以下を参考に、NPM版からtoJSON(),perse()を抽出、従来のcryptico.min.js/gsに追加

- Qiita [crypticoでPure JavaScriptによる公開鍵暗号を用いるメモ](https://qiita.com/miyanaga/items/8692d0742a49fb37a6da)

### NPM版ソース(抽出部分)

```
(前略)
function RSAToJSON()
{
    return {
        coeff: this.coeff.toString(16),
        d: this.d.toString(16),
        dmp1: this.dmp1.toString(16),
        dmq1: this.dmq1.toString(16),
        e: this.e.toString(16),
        n: this.n.toString(16),
        p: this.p.toString(16),
        q: this.q.toString(16),
    }
}

function RSAParse(rsaString) {
    var json = JSON.parse(rsaString);
    var rsa = new RSAKey();

    rsa.setPrivateEx(json.n, json.e, json.d, json.p, json.q, json.dmp1, json.dmq1, json.coeff);

    return rsa;
}

// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
//function RSAEncryptB64(text) {
//  var h = this.encrypt(text);
//  if(h) return hex2b64(h); else return null;
//}
// protected
RSAKey.prototype.doPublic = RSADoPublic;

// public
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.encrypt = RSAEncrypt;
RSAKey.prototype.toJSON = RSAToJSON;
RSAKey.parse = RSAParse;
(後略)
```

### 実際に追加した箇所

```
(前略)
function RSAEncrypt(a){a=pkcs1pad2(a,this.n.bitLength()+7>>3);if(a==null)return null;a=this.doPublic(a);if(a==null)return null;a=a.toString(16);return(a.length&1)==0?a:"0"+a}
// -- rev 1.1.0 追加ここから
function RSAToJSON(){return {coeff: this.coeff.toString(16),d: this.d.toString(16),dmp1: this.dmp1.toString(16),dmq1: this.dmq1.toString(16),e: this.e.toString(16),n: this.n.toString(16),p: this.p.toString(16),q: this.q.toString(16)}}
function RSAParse(rsaString) {var json=JSON.parse(rsaString);var rsa = new RSAKey();rsa.setPrivateEx(json.n,json.e,json.d,json.p,json.q,json.dmp1,json.dmq1,json.coeff);return rsa;}
RSAKey.prototype.toJSON = RSAToJSON;RSAKey.parse = RSAParse;
// -- rev 1.1.0 追加ここまで
RSAKey.prototype.doPublic=RSADoPublic;RSAKey.prototype.setPublic=RSASetPublic;
(後略)
```
