#!/usr/bin/env zsh

node createSpec.mjs ../Auth/src/**/*.(js|mjs) -o ../Auth/tmp
#node createSpec.mjs ../Auth/src/**/*.(js|mjs) ../Auth/src/**/*.md -o ../Auth/tmp -x ../Auth/src/server/*

#node test.mjs ../Auth/src/**/*.(js|mjs) ../Auth/src/**/*.md -o ../Auth/tmp -x ../Auth/src/server/*

#node createJSDoc.mjs ../Auth/src/**/*.?js~../Auth/src/server/*.* -o ../Auth/tmp
#node createJSDoc.mjs ../Auth/src/*.?js -o ../Auth/tmp -x ../Auth/src/server/*
