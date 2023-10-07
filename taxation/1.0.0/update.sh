#!/bin/sh
# -x  つけるとverbose

jsdoc2md GAS.js > doc/GAS.md
jsdoc2md GASLib.js > doc/GASLib.md
