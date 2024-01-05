#!/bin/sh
# -x  つけるとverbose

echo "\n\n\n\n\nSingleTable/1.1.0/build.sh start"

# .DS_storeの全削除
find .. -name '.DS_Store' -type f -ls -delete
rm -rf tmp              # tmpの用意
mkdir tmp
tmp="tmp"

lib="/Users/ena.kaon/Desktop/GitHub/library"
nised="$lib/nised/1.0.0/pipe.cjs"
#minimize="/Users/ena.kaon/Desktop/GitHub/tools/yuicompressor-2.4.8.jar"
#minimize="$lib/minimize/1.0.0/pipe.js"

# ----------------------------------------------
# proto.jsにメソッドを追加
# ----------------------------------------------
# libraryの関数をメソッドに修正(functionの削除)
cat $lib/deepcopy/1.0.0/core.js | awk 1 | \
sed -E 's/function deepcopy/deepcopy/' > $tmp/deepcopy.js
cat $lib/convertNotation/1.0.0/core.js | awk 1 | \
sed -E 's/function convertNotation/convertNotation/' > $tmp/convertNotation.js

# プロトタイプにメソッドを追加
cat proto.js | awk 1 \
| node $nised -f"// -:: constructor ::-" -r:../methods/constructor/1.0.0/core.js \
| node $nised -f:"// -:: select ::-" -r:../methods/select/1.0.0/core.js \
| node $nised -f:"// -:: update ::-" -r:../methods/update/1.0.0/core.js \
| node $nised -f:"// -:: insert ::-" -r:../methods/insert/1.0.0/core.js \
| node $nised -f:"// -:: delete ::-" -r:../methods/delete/1.0.0/core.js \
| node $nised -f:"// -:: clog ::-" -r:../methods/clog/1.0.0/core.js \
| node $nised -f:"// -:: lib.deepcopy ::-" -r:$tmp/deepcopy.js \
| node $nised -f:"// -:: lib.convertNotation ::-" -r:$tmp/convertNotation.js \
> core.js

# minimize
# java -jar $minimize core.js core.min.js


# ----------------------------------------------
# 仕様書の作成
# ----------------------------------------------
jsdoc2md core.js > $tmp/core.md
cat proto.md | awk 1 \
| node $nised -f:"<!--:: JSDoc.md ::-->" -r:$tmp/core.md \
| node $nised -f:"// -:: source ::-" -r:core.js \
> ../readme.md