#!/usr/bin/env zsh

node createSpec.mjs sample/test.js -o ./ > test.result.txt 2> test.error.txt
#node createSpec.mjs ../Auth/src/**/*.(js|mjs) -o ../Auth/tmp > auth.result.txt 2> auth.error.txt

# sample
jsdoc -X sample/test.js > sample/test.json
#jsdoc -X sample/Schema.js > sample/Schema.json

# import/export文の削除
#sed '/^import /d; s/^export //' createSpec.mjs > sample/createSpec.js
#jsdoc -X sample/createSpec.js > sample/createSpec.json
#jsdoc -X sample/test.js > result.txt 2> error.txt

# auth系
#node createSpec.mjs ../Auth/src/**/*.(js|mjs) -o ../Auth/tmp
#node createSpec.mjs ../Auth/src/**/*.(js|mjs) ../Auth/src/**/*.md -o ../Auth/tmp -x ../Auth/src/server/*
