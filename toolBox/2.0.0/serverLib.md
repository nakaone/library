<a name="whichType"></a>

## whichType(arg, [is]) ⇒ <code>string</code> \| <code>boolean</code>
変数の型を判定

- 引数"is"が指定された場合、判定対象が"is"と等しいかの真偽値を返す。

**Kind**: global function  
**Returns**: <code>string</code> \| <code>boolean</code> - - 型の名前。is指定有りなら判定対象が想定型かの真偽値  

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>any</code> | 判定対象の変数 |
| [is] | <code>string</code> | 想定される型(型名の大文字小文字は意識不要) |

**Example**  
```
let a = 10;
whichType(a);  // 'Number'
whichType(a,'string'); // false
```

<b>確認済戻り値一覧</b>

オブジェクトは型名が返るので、限定列挙は困難。以下は確認済みの戻り値のみ記載。

| 型名 | 戻り値 | 備考 |
| :-- | :-- | :-- |
| 文字列 | String |  |
| 数値 | Number |  |
| NaN | NaN |  |
| 長整数 | BigInt |  |
| 論理値 | Boolean |  |
| シンボル | Symbol |  |
| undefined | Undefined | 先頭大文字 |
| Null | Null |  |
| オブジェクト | Object |  |
| 配列 | Array |  |
| 関数 | Function |  |
| アロー関数 | Arrow |  |
| エラー | Error | RangeError等も'Error' |
| Date型 | Date |  |
| Promise型 | Promise |  |

- Qiita [JavaScriptの型などの判定いろいろ](https://qiita.com/amamamaou/items/ef0b797156b324bb4ef3)

## source

```
/* ======================================
サーバ側で使用するライブラリ
====================================== */

/** 変数の型を判定
 * 
 * - 引数"is"が指定された場合、判定対象が"is"と等しいかの真偽値を返す。
 *
 * @param {any} arg - 判定対象の変数
 * @param {string} [is] - 想定される型(型名の大文字小文字は意識不要)
 * @returns {string|boolean} - 型の名前。is指定有りなら判定対象が想定型かの真偽値
 *
 * @example
 * ```
 * let a = 10;
 * whichType(a);  // 'Number'
 * whichType(a,'string'); // false
 * ```
 *
 * <b>確認済戻り値一覧</b>
 *
 * オブジェクトは型名が返るので、限定列挙は困難。以下は確認済みの戻り値のみ記載。
 *
 * | 型名 | 戻り値 | 備考 |
 * | :-- | :-- | :-- |
 * | 文字列 | String |  |
 * | 数値 | Number |  |
 * | NaN | NaN |  |
 * | 長整数 | BigInt |  |
 * | 論理値 | Boolean |  |
 * | シンボル | Symbol |  |
 * | undefined | Undefined | 先頭大文字 |
 * | Null | Null |  |
 * | オブジェクト | Object |  |
 * | 配列 | Array |  |
 * | 関数 | Function |  |
 * | アロー関数 | Arrow |  |
 * | エラー | Error | RangeError等も'Error' |
 * | Date型 | Date |  |
 * | Promise型 | Promise |  |
 *
 * - Qiita [JavaScriptの型などの判定いろいろ](https://qiita.com/amamamaou/items/ef0b797156b324bb4ef3)
 *
 */

function whichType(arg,is){
  let rv = String(Object.prototype.toString.call(arg).slice(8,-1));
  switch(rv){
    case 'Number': if(Number.isNaN(arg)) rv = 'NaN'; break;
    case 'Function': if(!('prototype' in arg)) rv = 'Arrow'; break;
  }
  if( typeof is === 'string' ){
    return rv.toLowerCase() === is.toLowerCase();
  } else {
    return rv;
  }
}
```
