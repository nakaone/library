#!/usr/bin/env zsh

node createSpec.mjs sample/test.js -o ./ > result.txt 2> error.txt
#node createSpec.mjs ../Auth/src/**/*.(js|mjs) -o ../Auth/tmp > result.txt 2> error.txt

# sample
jsdoc -X sample/test.js > sample/test.json
jsdoc -X sample/Schema.js > sample/Schema.json
#jsdoc -X sample/test.js > result.txt 2> error.txt

# auth系
#node createSpec.mjs ../Auth/src/**/*.(js|mjs) -o ../Auth/tmp
#node createSpec.mjs ../Auth/src/**/*.(js|mjs) ../Auth/src/**/*.md -o ../Auth/tmp -x ../Auth/src/server/*
