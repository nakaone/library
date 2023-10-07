<a name="urlFetch"></a>

## urlFetch(arg) ⇒ <code>object</code>
なおhtml版のarg.callbackはGAS版では存在しない。

**Kind**: global function  
**Returns**: <code>object</code> - 処理先からの返信  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arg | <code>object</code> |  | 引数 |
| [arg.to] | <code>string</code> | <code>&quot;&#x27;front&#x27;&quot;</code> | 被呼出側の局名 |
| arg.fc | <code>string</code> |  | GAS側で処理分岐の際のキー文字列 |
| arg.data | <code>any</code> |  | 処理対象データ |


## source

```
/* コアスクリプト */
/** urlFetch: GAS上で他のwebアプリのdoPostを呼び出す
 * @desc なおhtml版のarg.callbackはGAS版では存在しない。
 * @param {object} arg - 引数
 * @param {string} [arg.to='front'] - 被呼出側の局名
 * @param {string} arg.fc - GAS側で処理分岐の際のキー文字列
 * @param {any} arg.data - 処理対象データ
 * @returns {object} 処理先からの返信
 */
 function urlFetch(arg){
  const v = {whois:'GAS.urlFetch',arg:arg,rv:null,payload:{},endpoint:null};
  try {
    console.log(v.whois+' start.\n',arg);

    v.step = '1.1'; // トークンの作成
    if( !arg.hasOwnProperty('to') ) arg.to = 'front';
    v.token = genToken({to:arg.to,fc:arg.fc});
    if( v.token instanceof Error ) throw v.token;
    v.step = '1.2'; // レスポンスオブジェクトの作成
    v.payload = {token:v.token,data:arg.data};

    v.step = '2'; // endpointの特定
    v.endpoint = config[arg.to].active[0];

    v.step = '3'; // fetch実行
    v.res = UrlFetchApp.fetch(v.endpoint,{
      'method': 'post',
      'contentType': 'application/json',
      'muteHttpExceptions': true, // https://teratail.com/questions/64619
      'payload' : JSON.stringify(v.payload),  
    }).getContentText();
    v.rv = convResObj(JSON.parse(v.res));
    if( v.rv instanceof Error ) throw v.rv;

    console.log(v.whois+' normal end.\n',arg);
  } catch(e) {
    console.error(v.whois+' abnormal end.\n'+e.stack+'\n'+JSON.stringify(v));
    v.rv = e;
  } finally {
    return v.rv;
  }
}
```
