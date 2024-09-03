# 処理手順

```mermaid
sequenceDiagram
  autonumber
  participant onload
  participant request
  participant doGet
  participant response
  participant branch
  participant sheet

  Note right of onload : v.clEQ = new encryptedQuery()
  onload ->> request : 引数="x"(ex.{a:10})

  request ->> doGet : https://〜?n=XXX&CPkey=abcdefghi
  Note right of doGet : e.parameger={n:XXX,CPkey:'abcdefghi'}<br>v.svEQ = new encryptedQuery()<br>v.branch = ()=>{...}<br>v.rv = v.eq.response(e.parameter,v.branch);
  doGet ->> response : e.parameger,v.branch

  response ->> sheet : ID(=n),CPkey
  sheet ->> sheet : CPkey登録

  response ->> callback : arg={n=XXX,CPkey:abcdefgh},isPlain=true
  callback ->> func : entryNo,CPkey,master
  Note right of func : auth1()
  func ->> callback : {status:1,message:undefined}
  callback ->> response : {status:1,message:undefined}

  Note right of response : v.json=JSON.stringify({status:1,message:undefined})<br>v.b64=base64Encode(v.json)<br>v.enc=encrypt(v.b64,CPkey,SSkey)
  response ->> doGet : {isOK:true,rv:v.enc.cipher}

  doGet ->> request : CreateTextOutput(JSON.stringify({isOK:true,rv:v.enc.cipher}))

  Note right of request : v.res=v.r.json()<br>v.cipher=v.res.rv<br>v.dec=decrypt(v.cipher,CSkey)<br>署名検証<br>v.json=base64Decode(v.dec.plaintext)
  request ->> onload : objectizeJSON(v.json)
```

- upv='n'とする

<!--
sequenceDiagram
  autonumber
  actor mailer as メーラ
  actor browser as ブラウザ
  participant public as 公開サイト
  participant staff as スタッフ用
  participant master as 管理局

  master ->> master : SPkey(DocumentProperties)
  public ->> browser : 公開サイト表示
  browser ->> browser : 鍵ペア生成
  browser ->> staff : 受付番号＋CPkey
  activate staff
  Note right of staff : auth()
  staff ->> master : 受付番号＋CPkey
  activate master
  Note right of master : auth1()
  master ->> master : CPkey保存＋試行可否判断
  master ->> mailer : パスコード通知メール
  master ->> staff : auth1結果通知
  deactivate master
  staff ->> browser : パスコード入力ダイアログ
  browser ->> staff : パスコード
  staff ->> master : パスコード
  activate master
  Note right of master : auth2()
  master ->> master : パスコード確認
  master ->> staff : auth2結果通知＋SPkey
  deactivate master
  staff ->> browser : 画面情報＋SPkey
  deactivate staff
  browser ->> browser : 画面生成、SPkey保存
-->