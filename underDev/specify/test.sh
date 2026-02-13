#!/usr/bin/env zsh

# doc: Markdown出力先
doc="./doc"
rm -rf $doc
# tmp: 開発用の中間・結果ファイル出力先
tmp="./tmp"
rm -rf $tmp
mkdir $tmp

# 1. sample/test.js
# 開発用に中間ファイル出力
jsdoc -X sample/test.js > $tmp/test.json
node createSpec.mjs sample/test.js -o $doc/test \
  > $tmp/test.result.txt 2> $tmp/test.error.txt

# 2. createSpec本体
#cp createSpec.mjs $tmp/createSpec.js
#jsdoc -X $tmp/createSpec.js > $tmp/createSpec.json
#rm $tmp/createSpec.js
#node createSpec.mjs createSpec.mjs -o $doc/createSpec > $tmp/createSpec.result.txt 2> $tmp/createSpec.error.txt

# 3. 引数無しでの起動時
#msg="\n=== no argument"; echo $msg > $tmp/noarg.result.txt; echo $msg > $tmp/noarg.error.txt
#node createSpec.mjs >> $tmp/noarg.result.txt 2>> $tmp/noarg.error.txt
#msg="\n=== arg = --help"; echo $msg >> $tmp/noarg.result.txt; echo $msg >> $tmp/noarg.error.txt
#node createSpec.mjs --help >> $tmp/noarg.result.txt 2>> $tmp/noarg.error.txt
#msg="\n=== arg = -H"; echo $msg >> $tmp/noarg.result.txt; echo $msg >> $tmp/noarg.error.txt
#node createSpec.mjs -H >> $tmp/noarg.result.txt 2>> $tmp/noarg.error.txt

# --- 開発用サンプル

# a. underDev/Auth　※フォルダ以下全JSソースの一括指定
#node createSpec.mjs ../Auth/src/**/*.(js|mjs) -o $doc/Auth > $tmp/auth.result.txt 2> $tmp/auth.error.txt

# b. sample/Schema.js
#jsdoc -X sample/Schema.js > $tmp/Schema.json
#node createSpec.mjs sample/Schema.js -o $doc/Schema > $tmp/auth.result.txt 2> $tmp/auth.error.txt

# --- 備忘

# import/export文の削除
#sed '/^import /d; s/^export //' createSpec.mjs > $tmp/createSpec.js
