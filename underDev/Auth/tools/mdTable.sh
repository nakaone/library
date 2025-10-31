
#mac上でクリップボードの内容を読み込み、以下のmdTableでの処理結果をクリップボードに出力するzshは？
#const mdTable = str => str.split('\n').map(x => `| ${x.replaceAll(/\t/g,' | ')} |`).join('\n');

#!/bin/zsh

# クリップボードの内容を取得
clip=$(pbpaste)

# Node.jsでmdTableを実行し、結果を生成
result=$(node -e "
const str = \`${clip//\`/\\\`}\`;
const mdTable = str => str.split('\n').map(x => \`| \${x.replaceAll(/\t/g,' | ')} |\`).join('\n');
console.log(mdTable(str));
")

# 結果をクリップボードへコピー
echo "$result" | pbcopy

# 処理完了を通知
echo '✅ Markdownテーブル形式に変換し、クリップボードにコピーしました。'
