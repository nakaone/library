<a name="postMails"></a>

## postMails(arg, attachments, bcc, cc, inlineImages, name, noReply, replyTo) ⇒ <code>null</code> \| <code>Error</code>
postMails: GAS上の管理局等の発信局でメールを発信、通数制限を超える場合は配信局を変更

**Kind**: global function  
**Returns**: <code>null</code> \| <code>Error</code> - 配信結果。正常ならnull  

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>arg</code> | 発信するメールの情報 |
| [arg.from] | <code>string</code> | 送信者名(発信元メールアドレスではない) |
| arg.to | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>object</code> \| <code>Array.&lt;object&gt;</code> | 受信者のe-mailアドレスまたは受信者情報の配列 |
| arg.to.address | <code>string</code> | 受信者のe-mailアドレス |
| [arg.to.data] | <code>Object.&lt;string, string&gt;</code> | 「変数名:文字列」形式の差込データ |
| arg.subject | <code>string</code> | 件名 |
| [arg.body] | <code>string</code> | メールの本文(テンプレート)。arg.htmlが存在する場合は代替テキスト。 指定されていない場合、sendMail()でarg.htmlからタグを除いた文字列とする。 |
| [arg.html] | <code>string</code> | 存在するならHTMLメールとして扱う |
| attachments | <code>Array.&lt;BlobSource&gt;</code> | メールで送信するファイルの配列 |
| bcc | <code>String</code> | BCC 宛てのメールアドレスのカンマ区切りリスト |
| cc | <code>String</code> | Cc に含めるメールアドレスのカンマ区切りリスト |
| inlineImages | <code>Object</code> | 画像キーから画像データへのマッピングを含むオブジェクト |
| name | <code>String</code> | メールの送信者の名前。デフォルトは送信者のユーザー名。 |
| noReply | <code>Boolean</code> | 受信者からの発信元メールアドレスへの返信を抑止 |
| replyTo | <code>String</code> | デフォルトの返信先アドレス。noReply=trueなら無視される |


## source

```
/* コアスクリプト */
/** postMails: GAS上の管理局等の発信局でメールを発信、通数制限を超える場合は配信局を変更
 * @param {arg} arg - 発信するメールの情報
 * @param {string} [arg.from] - 送信者名(発信元メールアドレスではない)
 * @param {string|string[]|object|object[]} arg.to - 受信者のe-mailアドレスまたは受信者情報の配列
 * @param {string} arg.to.address - 受信者のe-mailアドレス
 * @param {Object.<string, string>} [arg.to.data] - 「変数名:文字列」形式の差込データ
 * @param {string} arg.subject - 件名
 * @param {string} [arg.body] - メールの本文(テンプレート)。arg.htmlが存在する場合は代替テキスト。
 * 指定されていない場合、sendMail()でarg.htmlからタグを除いた文字列とする。
 * @param {string} [arg.html] - 存在するならHTMLメールとして扱う
 * @param {BlobSource[]} attachments - メールで送信するファイルの配列
 * @param {String} bcc - BCC 宛てのメールアドレスのカンマ区切りリスト
 * @param {String} cc - Cc に含めるメールアドレスのカンマ区切りリスト
 * @param {Object} inlineImages - 画像キーから画像データへのマッピングを含むオブジェクト
 * @param {String} name - メールの送信者の名前。デフォルトは送信者のユーザー名。
 * @param {Boolean} noReply - 受信者からの発信元メールアドレスへの返信を抑止
 * @param {String} replyTo - デフォルトの返信先アドレス。noReply=trueなら無視される
 * @returns {null|Error} 配信結果。正常ならnull 
 */
 function postMails(arg){
  const v = {whois:'GAS.postMails',arg:arg,rv:null,post:[],to:[]};
  try {
    console.log(v.whois+' start.\n',arg);

    // 1.事前準備
    v.step = '1.1'; // 引数をMailApp.sendEMailsの引数の形に変換
    v.template = {
      recipient: undefined,
      subject: arg.subject,
      body: arg.body || undefined,
      options: {
        attachments: arg.attachments || undefined,
        bcc: arg.bcc || undefined,
        cc: arg.cc || undefined,
        htmlBody:	arg.html || undefined,
        inlineImages: arg.inlineImages || undefined,
        name: arg.from || undefined,
        noReply: arg.noReply || false,
        replyTo: arg.replyTo || undefined
      }
    }

    v.step = '1.2'; // bodyが未設定の場合、タグを除いたテキストを設定
    if( typeof v.template.body === 'undefined' ){
      v.m = arg.html.match(/<body[^>]*>([\s\S]+?)<\/body>/); // body内部のみ抽出
      v.template.body = v.m ? v.m[1] : arg.html;
      v.template.body = v.template.body
      .replace(/<a href="([^"]+?)".*?>([^<]+?)<\/a>/g,'$2($1)') // hrefはアドレス表示
      .replace(/<[^<>]+?>/g,'');  // HTMLのタグは削除
    }

    v.step = '1.3'; // テンプレートを文字列化
    v.template = JSON.stringify(v.template);

    v.step = '1.4'; // 配信先(arg.to)を配列に変形
    if( whichType(arg.to) === 'Array' ){
      if( typeof arg.to[0] === 'string' ){  // string[]
        for( v.i=0 ; v.i<arg.to.length ; v.i++ ){
          v.to.push({address:arg.to[v.i],data:{}});
        }
      } else {  // object[]
        v.to = arg.to;
      }
    } else {
      if( typeof arg.to === 'string' ){ // string
        v.to = [{address:arg.to,data:{}}];
      } else {  // object
        v.to = [arg.to];
      }
    }

    v.step = '1.5'; // 内部関数定義：プレースホルダを差込データで置換
    v.merge = (p,str,data) => {
      const v = {whois:p.whois+'.v.merge',rv:null};
      try{
        v.rv = str;
        for( v.x in data ){
          v.rex = new RegExp('::' + v.x + '::','g');
          v.rv = v.rv.replaceAll(v.rex,String(data[v.x]));
        }
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n'+JSON.stringify(v));
        v.rv = e;
      } finally {
        return v.rv;
      }
    }

    v.step = '2'; // 宛先ごとにデータを作成、postに格納
    for( v.i=0 ; v.i<v.to.length ; v.i++ ){
      v.step = '2.1'; // 一通分のデータをv.mailとして作成
      v.mail = JSON.parse(v.template);
      v.step = '2.2'; // 宛先(recipient)の設定
      v.mail.recipient = v.to[v.i].address;
      v.step = '2.3'; // subjectの仮引数を差込データで置換
      v,v.mail.subject = v.merge(v,v.mail.subject,v.to[v.i].data);
      if( v,v.mail.subject instanceof Error ) throw v,v.mail.subject;
      v.step = '2.4'; // bodyの仮引数を差込データで置換
      v.mail.body = v.merge(v,v.mail.body,v.to[v.i].data);
      if( v.mail.body instanceof Error ) throw v.mail.body;
      v.step = '2.5'; // htmlBodyの仮引数を差込データで置換
      if( typeof v.mail.options.htmlBody !== 'undefined' ){
        v.mail.options.htmlBody = v.merge(v,v.mail.options.htmlBody,v.to[v.i].data);
        if( v.mail.options.htmlBody instanceof Error ) throw v.mail.options.htmlBody;
      }
      v.step = '2.6'; // v.mailをv.postに保存
      v.post.push(v.mail);
    }

    v.step = '3';  // 残通数=0になるまでsendMailsを呼び出し
    while( v.to.length > 0 ){
      v.step = '3.1'; // 送信実行
      v.r = sendMails(v.post);
      /* 以下、テスト用。コメントアウトを外した上でconfig.dummyCounter設定時のみ稼働
      if( typeof config.dummyCounter !== 'undefined' && config.dummyCounter === 0 ){
        config.dummyCounter++;
        v.r = { // 1度目に呼ばれた時は残通数0を返す
          remain:0,
          NG:[{address:'nakaone.kunihiro@gmail.com',data:{aaa:'111',bbb:'333'}}]
        };
      } else {
        v.r = {remain:98,NG:[]} // 2度目に呼ばれた時は正常終了を返す
      }*/
      if( v.r instanceof Error ) throw v.r;
      v.step = '3.2'; // 不成功分を次回送信対象に
      v.to = v.r.NG;
      if( v.r.remain === 0 || v.r.NG.length > 0 ){
        // 4.使用した配信局が通数オーバーした
        // ⇒ configシートのsendOverに記録し、現在稼働中の郵便局(config.mail)を再取得
        v.step = '4.1'; // 現状の配信局の登録状況を取得
        v.oldMail = config.mail;
        v.sheet = szSheet({spreadId:config.master.spreadId,sheetName:'config'});
        if( v.sheet instanceof Error ) throw v.sheet;

        // 通数オーバーした配信局(=config.mail)を特定し、sendOverの値を更新
        v.step = '4.2'; // 行番号付きでGASLib.configをv.confとして取得
        v.rowNumber = 'rowNumber' + Date.now();
        v.conf = v.sheet.objectize('lv01','lv03',['value',v.rowNumber]);
        if( v.conf instanceof Error ) throw v.conf;
        v.step = '4.3'; // 修正対象となるlist上のsendOverの行番号をtNumとして取得
        for( v.x in v.conf.list ){
          if( v.conf.list[v.x].endpoint.value == config.mail.endpoint ){
            v.tNum = v.conf.list[v.x].sendOver[v.rowNumber] - 1;
            break;
          }
        }
        v.step = '4.4'; // sendOverのvalue欄に現在時刻文字列をセット
        v.r = v.sheet.update({value:getJPDateTime()},{num:v.tNum});
        if( v.r instanceof Error ) throw v.r;
        v.step = '4.5'; // configを取得し直し、Mailにセットされるlistを更新
        config = setSzConf();
        v.step = '4.6'; // メール配信局の交代をAdministratorに通知
        v.newMail = config.mail;
        MailApp.sendEmail(
          config.public.Administrator,
          '[おまつり奉行]メール通数制限超過に伴う配信局交代通知',
          getJPDateTime()
          + '\n\nold=' + JSON.stringify(v.oldMail)
          + '\n\nnew=' + JSON.stringify(v.newMail)
        );

      }
    }

    v.step = '5'; // 終了処理    
    console.log(v.whois+' normal end.\n',arg);
  } catch(e) {
    console.error(v.whois+' abnormal end.\n'+e.stack+'\n'+JSON.stringify(v));
    v.rv = e;
  } finally {
    return v.rv;
  }
}
```