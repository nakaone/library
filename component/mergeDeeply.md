<a name="mergeDeeply"></a>

## mergeDeeply(target, source, opts) ⇒ <code>Object</code>
オブジェクトのプロパティを再帰的にマージ
- Qiita [JavaScriptでオブジェクトをマージ（結合）する方法、JSONのマージをする方法](https://qiita.com/riversun/items/60307d58f9b2f461082a)

**Kind**: global function  
**Returns**: <code>Object</code> - 結合されたオブジェクト  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| target | <code>Object</code> |  | 結合対象のオブジェクト1 |
| source | <code>Object</code> |  | 結合対象のオブジェクト2。同名のプロパティはこちらで上書き |
| opts | <code>Object</code> |  | オプション |
| [opts.concatArray] | <code>boolean</code> | <code>false</code> | プロパティの値が配列だった場合、結合するならtrue |

