#!/bin/sh
# -x  つけるとverbose

cat /Users/ena.kaon/Desktop/GitHub/private/camp2024/src/public/home/1.0.0/summary.html \
| node core.js -key:'code'

cat /Users/ena.kaon/Desktop/GitHub/private/camp2024/src/public/home/1.0.0/summary.html \
| node core.js -a -key:'li'
