#!/bin/sh
# -x  つけるとverbose

lib="../.."
key='// add MenuItem here.'

# range2Tableを「道具箱」メニューに追加
echo ".addItem('選択範囲をHTML化','range2TableMenu');\n  $key" \
| node $lib/nised/1.0.0/pipe.cjs -i:core.js -k:"$key" \
> toolbox.js

cat $lib/range2Table/1.2.0/menuFunc.js >> toolbox.js