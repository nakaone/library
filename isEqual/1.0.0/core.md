<a name="isEqual"></a>

## isEqual(v1, v2) ⇒ <code>boolean</code> \| <code>Error</code>
二つの引数が同値か判断する
- [等価性の比較と同一性](https://developer.mozilla.org/ja/docs/Web/JavaScript/Equality_comparisons_and_sameness)
- データ型が一致していないと、内容的に一致していても同値では無いと判断(Ex.Number 1 != BigInt 1)。
- 配列は、①長さが一致、かつ②順番に比較した個々の値が同値の場合のみ同値と看做す

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| v1 | <code>any</code> | 変数1 |
| v2 | <code>any</code> | 変数2 |

