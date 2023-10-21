#!/bin/sh
# -x  つけるとverbose

# =======================================================
# RasterImage/*/build.sh :
#   webApp.html -> RasterImage.html(SPA) を作成
# =======================================================

TASK="Raster Image"
mkdir tmp

# BasePageの埋め込み
node ../../nised/1.0.0/core.mjs -log:1 -task:"${TASK}: embed BasePage" \
  -i:"webApp.html" -o:"tmp/spa01.html" -s:"../../BasePage/1.0.0/core.js" \
  -r:'<script type="text/javascript" src="../../BasePage/1.0.0/core.js"></script>' \
  -p:'<script type="text/javascript">' \
  -x:'</script>'

# RasterImage.coreの埋め込み
node ../../nised/1.0.0/core.mjs -log:1 -task:"${TASK}: embed RasterImage.core" \
  -i:"tmp/spa01.html" -o:"tmp/spa02.html" -s:"core.js" \
  -r:'<script type="text/javascript" src="core.js"></script>' \
  -p:'<script type="text/javascript">' \
  -x:'</script>'


# rmdir tmp