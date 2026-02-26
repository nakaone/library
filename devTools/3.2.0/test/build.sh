#!/bin/sh

# ES Module対応版(core.mjs)から埋込用(core.js)を作成
sed '/^import /d; s/^export //' core.mjs > core.js
