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
function test {
  jsdoc -X sample/test.js > $tmp/test.json
  node core.mjs sample/test.js -o $doc/test \
  > $tmp/test.result.txt 2> $tmp/test.error.txt
}

# 2. createSpec本体
function createSpec {
  # jsdocの出力結果(JSON)
  cp core.mjs $tmp/createSpec.js
  jsdoc -X $tmp/createSpec.js > $tmp/createSpec.json
  rm $tmp/createSpec.js
  #jsdoc -X createSpec.mjs > $tmp/createSpec.json
  node core.mjs core.mjs -o $doc/createSpec \
  > $tmp/createSpec.result.txt 2> $tmp/createSpec.error.txt
}

# 3. 引数無しでの起動(useage表示)
function noarg {
  msg="\n=== no argument"; echo $msg > $tmp/noarg.result.txt; echo $msg > $tmp/noarg.error.txt
  node core.mjs >> $tmp/noarg.result.txt 2>> $tmp/noarg.error.txt
  msg="\n=== arg = --help"; echo $msg >> $tmp/noarg.result.txt; echo $msg >> $tmp/noarg.error.txt
  node core.mjs --help >> $tmp/noarg.result.txt 2>> $tmp/noarg.error.txt
  msg="\n=== arg = -H"; echo $msg >> $tmp/noarg.result.txt; echo $msg >> $tmp/noarg.error.txt
  node core.mjs -H >> $tmp/noarg.result.txt 2>> $tmp/noarg.error.txt
}

# --- 開発用サンプル

# a. underDev/Auth　※フォルダ以下全JSソースの一括指定
function auth {
  node core.mjs ../Auth/src/**/*.(js|mjs) -o $doc/Auth \
  > $tmp/auth.result.txt 2> $tmp/auth.error.txt
}

# b. sample/Schema.js
function Schema {
  jsdoc -X sample/Schema.js > $tmp/Schema.json
  node core.mjs sample/Schema.js -o $doc/Schema \
  > $tmp/Schema.result.txt 2> $tmp/Schema.error.txt
}

#test
createSpec
#noarg
#auth
#Schema

# --- 備忘

# import/export文の削除
#sed '/^import /d; s/^export //' core.mjs > $tmp/createSpec.js
