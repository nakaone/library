#!/bin/sh
# -x  つけるとverbose

# =======================================================
# RasterImage/*/build.sh :
#   webApp.html -> RasterImage.html(SPA) を作成
# =======================================================

# nised = 偽sed

mkdir tmp

# BasePageの埋め込み
node ../../nised/1.0.0/core.mjs \
  -i:"webApp.html" -o:"tmp/spa01.html" -s:"../../BasePage/1.0.0/core.js" \
  -r:'<script type="text/javascript" src="../../BasePage/1.0.0/core.js"></script>' \
  -p:'<script type="text/javascript">' \
  -x:'</script>'


# rmdir tmp