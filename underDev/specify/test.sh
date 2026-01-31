#!/usr/bin/env zsh

# sample
node createSpec.mjs sample/test.js -o ./ > result.txt 2> error.txt
jsdoc -X sample/test.js > jsdoc.json
#jsdoc -X sample/test.js > result.txt 2> error.txt

# auth系
#node createSpec.mjs ../Auth/src/**/*.(js|mjs) -o ../Auth/tmp
#node createSpec.mjs ../Auth/src/**/*.(js|mjs) ../Auth/src/**/*.md -o ../Auth/tmp -x ../Auth/src/server/*
