#!/bin/sh
# -x  つけるとverbose

# JSDocを更新
jsdoc2md core.js > core.md

# =======================================================
# RasterImage/*/build.sh :
#   webApp.html -> RasterImage.html(SPA) を作成
#   自作ライブラリを埋め込み(CDNは埋込不要)
# =======================================================
TASK="RasterImage"
mkdir tmp

# BasePageの埋め込み
node ../../nised/1.0.0/core.mjs -log:1 -task:"${TASK}: embed BasePage" \
  -i:"webApp.html" -o:"tmp/spa01.html" -s:"../../BasePage/1.0.0/core.js" \
  -r:'<script type="text/javascript" src="../../BasePage/1.0.0/core.js"></script>' \
  -p:'<script type="text/javascript">' \
  -x:'</script>' \
  -j:1

# RasterImage.coreの埋め込み
node ../../nised/1.0.0/core.mjs -log:1 -task:"${TASK}: embed RasterImage.core" \
  -i:"tmp/spa01.html" -o:"tmp/spa02.html" -s:"core.js" \
  -r:'<script type="text/javascript" src="core.js"></script>' \
  -p:'<script type="text/javascript">' \
  -x:'</script>' \
  -j:1

# SPAとして移動、作業フォルダの削除
mv tmp/spa02.html ./RasterImage.html
rm tmp/*
rmdir tmp