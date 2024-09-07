/** onFormSubmit: 申込フォームの入力を受け、シートの更新＋受付メールの発信を行う
 * @param {Object} e - [イベント](https://developers.google.com/apps-script/guides/triggers/events?hl=ja#form-submit)オブジェクト
 * @returns {void}
 * 
 * ## 使用上の注意
 * 
 * このソースはDocumentPropertiesの'config'に、実行上必要な設定値が全て格納されていることを前提とする。
 * 
 * ## 処理概要
 * 
 * 1. フォームから渡されるオブジェクトから以下の情報を取得
 *    1. "range"から書き込まれた行(e.range.getRow())
 *    2. "namedValues"からメールアドレス(e.namedValues["メールアドレス"][0])
 * 2. フォームの情報を取得
 *    1. 全回答情報を取得(FormApp.openById(v.formId).getResponses())
 *    2. {UNIX時刻:editURL}のマップを作成
 * 3. シート"master"に追加情報を記入
 *    1. 要既定値設定項目(entryNo/editURL/authority)の空欄に既定値を設定
 *    2. "range"から書き込まれた行の情報はメール送信用に保存
 * 4. 回答者にメールを送信
 * 
 * ## 参考
 * 
 * - [GASでGoogleフォームの値を取得する](https://walking-elephant.blogspot.com/2021/01/gas.formapp.html)
 * - GAS公式 [Class FormApp](https://developers.google.com/apps-script/reference/forms/form-app?hl=ja)
 * - GAS公式 [Class Form](https://developers.google.com/apps-script/reference/forms/form?hl=ja)
 * 
 * メール送信については以下を参照。
 * 
 * - [Google App Script メモ（メール送信制限 回避術）](https://zenn.dev/tatsuya_okzk/articles/259203cc416328)
 * - GAS公式[createDraft](https://developers.google.com/apps-script/reference/gmail/gmail-app?hl=ja#createdraftrecipient,-subject,-body,-options)
 */
function onFormSubmit(e){
  const v = {whois:'onFormSubmit',step:0,rv:null,form:{},
    conf: JSON.parse(PropertiesService.getDocumentProperties().getProperty('config')),
    // フォームとシートの関連付けとなるキー文字列を作成(email+timestamp)
    genKey: (ml,dt) => ml.replaceAll(/@/g,'').replaceAll(/\./g,'')+dt.getTime(),
  };
  console.log(`${v.whois} start.`);
  try {

    (()=>{  v.step = 1; // フォーム全件の情報を取得、対象フォームの行番号を特定

      v.step = 1.1;  // フォームから渡されるオブジェクトから行番号とメアドを取得
      v.lineNum = e.range.getRow(); // range: 編集されたセルまたはセル範囲
      v.email = e.namedValues["メールアドレス"][0];
      vlog(v,['lineNum','email']);

      v.step = 1.2; // フォームの情報を取得、マップを作成
      v.responses = FormApp.openById(v.conf.entry.formId).getResponses();
      for( v.i=0 ; v.i<v.responses.length ; v.i++ ){
        v.step = 1.3;
        v.o = {
          timestamp: v.responses[v.i].getTimestamp(),
          email: v.responses[v.i].getRespondentEmail(),
          editURL: v.responses[v.i].getEditResponseUrl()
        }
        v.form[v.genKey(v.o.email,v.o.timestamp)] = v.o;
      }
      vlog(v,['form']);
    })();

    (()=>{  v.step = 2; // シート"master"にentryNo等の追加情報を記入

      v.step = 2.1;
      v.sheet = new SingleTable('master');

      for( v.i=0 ; v.i<v.sheet.data.length ; v.i++ ){
        v.d = v.sheet.data[v.i];

        v.step = 2.2; // 空白行はスキップ
        if( v.d['タイムスタンプ'] === '' ) continue;

        v.step = 2.3; // entryNo,editURL,authorityのいずれかが空欄の行があれば更新
        if( !v.d[v.conf.master.cols.id] || !v.d.editURL || !v.d.authority ){
          v.key = v.genKey(v.d['メールアドレス'],v.d['タイムスタンプ']);
          v.r = v.sheet.update({
            entryNo: v.i+1,
            editURL: v.form[v.key].editURL || '(undefined)',
            authority: 1, // 0:閲覧者(非参加者) 1:参加者 2:スタッフ
          },{where:o => // タイムスタンプとメールアドレスの一致で検索、更新する
            o['タイムスタンプ'] === v.d['タイムスタンプ']
            && o['メールアドレス'] === v.d['メールアドレス']});
          if( v.r instanceof Error ) throw v.r;
        }

        v.step = 2.4; // 対象フォームはv.entryDataとして保存
        if( v.i === (v.lineNum - 2) ){
          v.entryData = v.sheet.data[v.i];
          vlog(v,'entryData');
        }
      }
    })();

    (()=>{  v.step = 3; // メールの送信

      v.step = 3.1; // メールのテンプレートを定義。埋込指定文字列は"::〜::"形式で指定(〜はシートの欄名)
      v.template = v.conf.entry.receiptMail;

      v.step = 3.2; // 埋込指定文字列をリストアップ
      v.embed = [];
      v.template.match(/::.+?::/g).forEach(x => v.embed.push({
        col: x.match(/::(.+?)::/)[1],
        rex: new RegExp(x,'g'),
      }));
  
      v.step = 3.3; // 埋込指定文字列を置換
      v.embed.forEach(x => v.template = v.template.replaceAll(x.rex,v.entryData[x.col]));
      v.mail = JSON.parse(v.template);

      v.step = 3.4; // 送信実行
      v.draft = GmailApp.createDraft(v.mail.recipient,v.mail.subject,v.mail.body,v.mail.options);
      v.draftId = v.draft.getId();
      GmailApp.getDraft(v.draftId).send();

    })();

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
