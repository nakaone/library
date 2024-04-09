<a name="embedRecursively"></a>

## embedRecursively(content, opt) ⇒ <code>string</code>
文書内の挿入指示文字列を指示ファイルの内容で置換(パス指定では変数使用可)

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| content | <code>string</code> |  | 処理対象テキスト |
| opt | <code>Object.&lt;string:string&gt;</code> |  | 「::〜::」で指定されるパス名内の変数'$xxx'を置換 |
| [opt.maxDepth] | <code>number</code> | <code>10</code> | 最深階層(無限ループ抑止) |
| [opt.encoding] | <code>string</code> | <code>&quot;&#x27;utf-8&#x27;&quot;</code> | 入力ファイルのエンコード |
| [opt.depth] | <code>number</code> | <code>0</code> | 現在処理中の文書の階層 |
| [opt.parentLevel] | <code>number</code> | <code>0</code> | 挿入指定文字列が置かれた位置の親要素のレベル |
| [opt.useRoot] | <code>boolean</code> | <code>false</code> | 子文書ルート使用指定   - true : 子文書のルート要素を使用する   - false : 子文書のルート要素は使用しない(呼出元の要素をルート要素として扱う) |

**Example**  
```js
- 呼出元の挿入指示文字列
  - 「::(パス)::」 ⇒ 該当部分をパスで指定されたファイルの内容で置換
  - 「::(メモ[+])::(パス)::」 ⇒ 子文書の内容についてのメモ。あくまで備忘であり、使用されない。<br>
    末尾に'+'が無い場合、子文書のルート要素を削除する。<br>
    '+'が有った場合、子文書のルート要素を挿入場所の1レベル下の要素として挿入する。

「ルート要素」とは、被挿入文書の最高レベルの章題が単一だった場合、その章題。
複数だった場合はルート要素とは看做さない。
```
