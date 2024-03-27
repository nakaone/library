#!/bin/sh
# -x  つけるとverbose

# JSDocの作成
jsdoc2md core.js > core.md
jsdoc2md GAS.js > GAS.md
