<a name="embedRecursively"></a>

## embedRecursively(arg, opt) ⇒ <code>string</code>
文書内の挿入指示文字列を指示ファイルの内容で置換

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arg | <code>string</code> |  | 処理対象テキスト |
| opt | <code>Object.&lt;string:string&gt;</code> |  | 「::〜::」で指定されるパス名内の変数'$xxx'を置換 |
| [opt.maxDepth] | <code>number</code> | <code>10</code> | 最深階層(最大ループ回数) |
| [opt.encoding] | <code>string</code> | <code>&quot;&#x27;utf-8&#x27;&quot;</code> | 入力ファイルのエンコード |

**Example**  
- 読み込まれた文書は一つレベルが下がる(# -> ##)
- 入力内容内の挿入指示文字列
  - 「::(パス)::」 ⇒ 該当部分をパスで指定されたファイルの内容で置換
  - 「::(タイトル)::(パス)::」 ⇒ 同上。タイトルはメモとして無視される
  - 「::(>タイトル)::(パス)::」 ⇒ '>'を除いたタイトルをh1として追加

#### 入力(proto.md)

```
# 開発用メモ

<!--::フォルダ構成::$test/folder.md::-->

<!--::>プログラムソース::$test/source.txt::-->
```

#### 被参照ファイル①：./test/folder.md

```md
# フォルダ構成
- client/ : client(index.html)関係のソース
  - commonConfig.js : client/server共通config
```

#### 被参照ファイル②：./test/source.js

```javascript
function embedRecursively(arg,opt={}){
  const v = {whois:'embedRecursively',rv:arg,step:0,level:1,fs:require('fs')};
(後略)
```

#### 実行するコマンド

```bash
cat << EOS > ./test/source.txt
\`\`\`
`cat ./test/source.js`
\`\`\`
EOS
cat proto.md | awk 1 | node pipe.js -test:"./test"
```

#### 結果

```
# 開発用メモ

## フォルダ構成
- client/ : client(index.html)関係のソース
  - commonConfig.js : client/server共通config

## プログラムソース

\`\`\`
function embedRecursively(arg,opt={}){
  const v = {whois:'embedRecursively',rv:arg,step:0,level:1,fs:require('fs')};
(後略)
\`\`\`
```
