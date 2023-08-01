lastUpdate: 2023年 8月 1日 火曜日 11時43分07秒 JST

<a name="qrcode"></a>

## qrcode(selector, opt)
指定されたDIV要素にQRコードを作成

作成時オプションについては[公式](https://github.com/davidshimjs/qrcodejs)参照。

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | QRコード作成先Div要素のCSSセレクタ |
| opt | <code>Object</code> \| <code>string</code> | 作成時オプション。文字列の場合、QRコードの内容 |


## source

```
/* コアScript */
/** 指定されたDIV要素にQRコードを作成
 * 
 * 作成時オプションについては[公式](https://github.com/davidshimjs/qrcodejs)参照。
 * 
 * @param {string} selector - QRコード作成先Div要素のCSSセレクタ
 * @param {Object|string} opt - 作成時オプション。文字列の場合、QRコードの内容
 */
function qrcode(selector,opt){
  const v = {rv:null};
  console.log('qrcode start.');
  try {
    // 前回の結果をクリア
    v.element = document.querySelector(selector);
    v.element.innerHTML = '';

    v.opt = {
      text: '(undefined)',
      width: 200,
      height: 200,
      colorDark: "#000",
      colorLight: "#fff",
      correctLevel : QRCode.CorrectLevel.H,
    };
    if( typeof opt === 'string' ){
      v.opt.text = opt;
    } else {
      v.opt = Object.assign(v.opt,opt);
    }
    console.log(v.opt);
    const qr = new QRCode(v.element,v.opt);

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('qrcode end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    //if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止する場合
    v.rv.stack = e.stack; return v.rv; // 処理継続する場合
  }
}
```
