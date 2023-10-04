<a name="Date_toLocale"></a>

## Date\_toLocale([format]) ⇒ <code>string</code>
日時を指定形式の文字列にして返す"toLocale()"メソッドをDate型に追加する。

**Kind**: global function  
**Returns**: <code>string</code> - 指定形式に変換された文字列。無効な日付なら長さ0の文字列  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [format] | <code>string</code> | <code>&quot;&#x27;yyyy/MM/dd&#x27;&quot;</code> | 日時を指定する文字列。年:y,月:M,日:d,時:h,分:m,秒:s,ミリ秒:n |

**Example**  
```
"1965/9/5"[yy/MM/dd hh:mm:ss.nnn] ⇒ "65/09/05 00:00:00.000"
"1965/9/5"[yyyy-MM-dd] ⇒ "1965-09-05"
"1965/9/5"[hh:mm] ⇒ "00:00"
"1977-03-04"[yy/MM/dd hh:mm:ss.nnn] ⇒ "77/03/04 09:00:00.000"
"1977-03-04"[yyyy-MM-dd] ⇒ "1977-03-04"
"1977-03-04"[hh:mm] ⇒ "09:00"
1688189258262[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:27:38.262"
1688189258262[yyyy-MM-dd] ⇒ "2023-07-01"
1688189258262[hh:mm] ⇒ "14:27"
"Sat Jul 01 2023 14:16:30 GMT+0900"[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:16:30.000"
"Sat Jul 01 2023 14:16:30 GMT+0900"[yyyy-MM-dd] ⇒ "2023-07-01"
"Sat Jul 01 2023 14:16:30 GMT+0900"[hh:mm] ⇒ "14:16"
"12:34"[yy/MM/dd hh:mm:ss.nnn] ⇒ ""
"12:34"[yyyy-MM-dd] ⇒ ""
"12:34"[hh:mm] ⇒ ""
```

## source

```
/** 日時を指定形式の文字列にして返す"toLocale()"メソッドをDate型に追加する。
 * @param {string} [format='yyyy/MM/dd'] - 日時を指定する文字列。年:y,月:M,日:d,時:h,分:m,秒:s,ミリ秒:n
 * @returns {string} 指定形式に変換された文字列。無効な日付なら長さ0の文字列
 * 
 * @example
 * ```
 * "1965/9/5"[yy/MM/dd hh:mm:ss.nnn] ⇒ "65/09/05 00:00:00.000"
 * "1965/9/5"[yyyy-MM-dd] ⇒ "1965-09-05"
 * "1965/9/5"[hh:mm] ⇒ "00:00"
 * "1977-03-04"[yy/MM/dd hh:mm:ss.nnn] ⇒ "77/03/04 09:00:00.000"
 * "1977-03-04"[yyyy-MM-dd] ⇒ "1977-03-04"
 * "1977-03-04"[hh:mm] ⇒ "09:00"
 * 1688189258262[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:27:38.262"
 * 1688189258262[yyyy-MM-dd] ⇒ "2023-07-01"
 * 1688189258262[hh:mm] ⇒ "14:27"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:16:30.000"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yyyy-MM-dd] ⇒ "2023-07-01"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[hh:mm] ⇒ "14:16"
 * "12:34"[yy/MM/dd hh:mm:ss.nnn] ⇒ ""
 * "12:34"[yyyy-MM-dd] ⇒ ""
 * "12:34"[hh:mm] ⇒ ""
 * ```
 */

function Date_toLocale(format='yyyy/MM/dd'){
  //console.log('===== Date.toLocale start.');
  const v = {rv:format};
  try {

    // 無効な日付なら空文字列を返して終了
    if( isNaN(this.getTime()) ) return '';

    v.l = { // 地方時ベース
      y: this.getFullYear(),
      M: this.getMonth()+1,
      d: this.getDate(),
      h: this.getHours(),
      m: this.getMinutes(),
      s: this.getSeconds(),
      n: this.getMilliseconds()
    };

    //v.rv = typeof format === 'undefined' ? 'yyyy/MM/dd' : format;
    for( v.x in v.l ){
      v.m = v.rv.match(new RegExp(v.x+'+'));
      if( v.m ){
        v.str = v.m[0].length > 1
          ? ('000'+v.l[v.x]).slice(-v.m[0].length)
          : String(v.l[v.x]);
        v.rv = v.rv.replace(v.m[0],v.str);
      }
    }

    //console.log('v.rv='+JSON.stringify(v.rv));
    //console.log('===== Date.toLocale end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}
Date.prototype.toLocale = Date_toLocale;
```
