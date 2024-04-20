<style>
/*::$lib/CSS/1.3.0/core.css::*/
</style>

<p class="title"><a name="top">modifyMD</a></p>

MarkDown文書の見出しを採番、TOC/足跡リストを作成・追加

# pipeでの使用方法

`node pipe.js -(オプション):(値)`を起動

```
cat $test/test.md | awk 1 \
| node $mod/pipe.js -footprint:'false' > $test/result.md
```

オプションについてはJSDoc参照

<details><summary>参考：build.sh内でpipe.js生成ソース</summary>

```
# 2.1 pipe処理部分の記述
cat << EOS > $mod/pipe.js
process.stdin.resume();
process.stdin.setEncoding('utf8');

var lines = []; ; //標準入力から受け取ったデータを格納する配列
var reader = require('readline').createInterface({　//readlineという機能を用いて標準入力からデータを受け取る
  input: process.stdin,
  output: process.stdout
});
reader.on('line', line => lines.push(line));
reader.on('close', () => {
  console.log(modifyMD(lines.join('\n'),analyzeArg().opt));
});
EOS
# 2.2 modifyMD(core.js)
cat $mod/core.js | awk 1 \
| $esed -x:" *console.log.+\n" -s:"" >> $mod/pipe.js
# 2.3 その他ライブラリ
cat $lib/analyzeArg/1.1.0/core.js | awk 1 \
| $esed -x:" *console.log.+\n" -s:"" >> $mod/pipe.js
cat $lib/stringify/1.1.1/core.js | awk 1 >> $mod/pipe.js
cat $lib/whichType/1.0.1/core.js | awk 1 \
| $esed -x:" *console.log.+\n" -s:"" >> $mod/pipe.js
```

</details>

# <a name="jsdoc" href="#top">仕様(JSDoc)</a>

<!--::$tmp/JSDoc.md::-->

# <a name="source" href="#top">プログラムソース</a>

<!-- タイトル(第一レベル)が存在しない場合、ラベルをタイトルとして設定 -->
<!--::$tmp/source.md::-->

# <a name="revision_history" href="#top">改版履歴</a>

- rev.1.1.0 : 2024/04/20
  - 足跡リストの表現を簡素化
- rev.1.0.0 : 2024/04/01 初版
