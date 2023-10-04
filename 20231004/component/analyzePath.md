## Functions

<dl>
<dt><a href="#analyzePath">analyzePath(arg)</a> ⇒ <code><a href="#AnalyzePath">AnalyzePath</a></code></dt>
<dd><p>パス名文字列から構成要素を抽出</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#AnalyzePath">AnalyzePath</a> : <code>object</code></dt>
<dd><p>パス文字列から構成要素を抽出したオブジェクト</p>
</dd>
</dl>

<a name="analyzePath"></a>

## analyzePath(arg) ⇒ [<code>AnalyzePath</code>](#AnalyzePath)
パス名文字列から構成要素を抽出

**Kind**: global function  
**Returns**: [<code>AnalyzePath</code>](#AnalyzePath) - 構成要素を抽出したオブジェクト  

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>string</code> | パス文字列 |

**Example**  
```
"/Users/ena.kaon/Desktop/GitHub/library/JavaScript/analyzePath.html" ⇒ {
  "path":"/Users/ena.kaon/Desktop/GitHub/library/JavaScript/",
  "file":"analyzePath.html",
  "base":"analyzePath",
  "suffix":"html"
}

"/Users/ena.kaon/Desktop/GitHub/library/JavaScript" ⇒ {
  "path":"/Users/ena.kaon/Desktop/GitHub/library/",
  "file":"JavaScript",
  "base":"JavaScript",
  "suffix":""
}

"./analyzePath.html" ⇒ {
  "path":"./",
  "file":"analyzePath.html",
  "base":"analyzePath",
  "suffix":"html"
}

"analyzePath.html" ⇒ {
  "path":"",
  "file":"analyzePath.html",
  "base":"analyzePath",
  "suffix":"html"
}

"analyzePath.hoge.html" ⇒ {
  "path":"",
  "file":"analyzePath.hoge.html",
  "base":"analyzePath.hoge",
  "suffix":"html"
}

"analyzePath.fuga" ⇒ {
  "path":"",
  "file":"analyzePath.fuga",
  "base":"analyzePath",
  "suffix":"fuga"
}

"https://qiita.com/analyzePath.html" ⇒ {
  "path":"https://qiita.com/",
  "file":"analyzePath.html",
  "base":"analyzePath",
  "suffix":"html"
}

```
<a name="AnalyzePath"></a>

## AnalyzePath : <code>object</code>
パス文字列から構成要素を抽出したオブジェクト

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| full | <code>string</code> | 引数の文字列(フルパス) |
| path | <code>string</code> | ファイル名を除いたパス文字列 |
| file | <code>string</code> | ファイル名 |
| base | <code>string</code> | 拡張子を除いたベースファイル名 |
| suffix | <code>string</code> | 拡張子 |

