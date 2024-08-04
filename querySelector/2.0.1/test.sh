#!/bin/sh
# -x  つけるとverbose

#cat test.html | node pipe.js -key:'style[name="Reception"]' > result.txt
#cat test.html | node pipe.js -key:'.Reception[name="wrapper"]' > result.txt
cat test.html | node pipe.js -key:'script[name="Reception"]' > result.txt

#cat $src/管理局/Reception.html | $querySelector -key:'style[name="Reception"]' > tmp/Reception.css
#cat $src/管理局/Reception.html | $querySelector -key:'body' > tmp/Reception.html
#cat $src/管理局/Reception.html | $querySelector -key:'script[name="Reception"]' > tmp/Reception.js
