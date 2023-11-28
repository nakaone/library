#!/bin/sh
# -x  つけるとverbose

# =======================================================
#   関数定義
# =======================================================

# -------------------------------------------------------
# makeModule: CommonJS/ECMAScript用のモジュール作成
#   useage: makeModule モジュール名 ファイル名
#     ex. makeModule analyzeArg core
# -------------------------------------------------------
makeModule(){
  # CommonJS(require)用モジュールを作成
  sed "s/function $1/module.exports = function $1/" $2.js > $2.cjs
  # ECMAScript(import)用モジュールを作成
  cp $2.js $2.mjs
  echo "\nexport { $1 };" >> $2.mjs
}

# -------------------------------------------------------
# makeJSDoc: GASのウェブアプリから仕様書(JSDoc)を作成
#
#   useage: makeJSDoc ベースファイル名 タイプ 入力フォルダ名 出力フォルダ名
#     タイプ = [gs|html|css] 既定値=gs
#     入力・出力フォルダの既定値はカレントディレクトリ
#     ex. makeJSDoc clientLib gs 財務諸表 doc
#
#   [参考]querySelector : HTML文書から指定CSSセレクタの情報を抽出
#    -i:入力ファイル名
#    -o:出力ファイル名
#    -f:出力形式
#       text -> 指定CSSセレクタ文字列に適合した全要素のinnerTextを結合して出力
#       html -> 同innerHTMLを結合して出力(既定値)
#       content -> 同textContentを結合して出力
#    aaa bbb ... : CSSセレクタ文字列
#    -f: 'text'(タグ出力無し、内部テキストのみ出力。既定値)
#        'html'(タグ出力有り。innerHTMLとして使用可)
#        'json'(JSONとして出力)
# -------------------------------------------------------

makeJSDoc(){
  base=$1
  type=$2
  if [ $3 ]; then # 入力フォルダ名指定あり
    iFile=$3/$base
  else               # 入力フォルダ名指定なし
    iFile=$base
  fi
  if [ $4 ]; then # 出力フォルダ名指定あり
    oFile=$4/$base
  else               # 出力フォルダ名指定なし
    oFile=$base
  fi
  echo "makeJSDoc start: base='$base' type='$type' in='$iFile' out='$oFile'"

  if [ $type = "css" ]; then
    # CSSはJSDocにかけない
    cp $iFile.html tmp/src.txt
    echo > tmp/$base.md
  else
    if [ $type = "html" ]; then
      # htmlの場合、scriptタグ内部を抽出
      node ../../../library/querySelector/1.1.0/querySelector.js \
        -i:$iFile.html -o:tmp/$base.js -f:content "script"
      cp $iFile.html tmp/src.txt
    else
      # gsの場合、そのままコピー
      cp $iFile.js tmp/$base.js
      cp $iFile.js tmp/src.txt
    fi
    # JSDocを作成
    jsdoc2md tmp/$base.js > tmp/$base.md
  fi

  # ソースを末尾に追加
  cp tmp/$base.md $oFile.md
  echo "\n## source\n\n\`\`\`" >> $oFile.md
  cat tmp/src.txt >> $oFile.md
  echo "\n\`\`\`" >> $oFile.md

  echo "makeJSDoc end"
}

# -------------------------------------------------------
# makeSPA: 外部ファイルを埋め込み、SPAととして動作するhtmlを作成
#
#  [参考]nised : 指定文字列を指定ファイルの内容で置換する(偽sed)
#     -i: 入力ファイルのパス(input)
#     -o: 出力ファイルのパス(output)。無指定の場合、verbose=0でコンソールに出力
#     -r: 変換元の文字列(replace)
#     -s: 変換先の文字列を格納したファイル(ソースファイル)のパス(source)
#     -p: 変換時、sourceの前につけるテキスト(prefix)
#     -x: 変換時、sourceの後につけるテキスト(suffix)
#     -m: ソースがMarkdownの場合、htmlに 0:変換しない、1:変換する(既定値)
#     -j: ソースがJavaScriptの場合、コメントを 0:削除しない、1:削除する(既定値)
#     -v: ログ出力を 0:しない 1:start/endのみ出力 2:1+結果も出力
# -------------------------------------------------------
makeSPA(){
  # 【以下は未完成】
  # BasePageの埋め込み
  node ../../nised/1.0.0/node.js -log:1 -task:"${TASK}: embed BasePage" \
    -i:"webApp.html" -o:"tmp/spa01.html" -s:"../../BasePage/1.0.0/core.js" \
    -r:'<script type="text/javascript" src="../../BasePage/1.0.0/core.js"></script>' \
    -p:'<script type="text/javascript">' \
    -x:'</script>' \
    -j:1

  # RasterImage.coreの埋め込み
  node ../../nised/1.0.0/node.js -log:1 -task:"${TASK}: embed RasterImage.core" \
    -i:"tmp/spa01.html" -o:"tmp/spa02.html" -s:"core.js" \
    -r:'<script type="text/javascript" src="core.js"></script>' \
    -p:'<script type="text/javascript">' \
    -x:'</script>' \
    -j:1
}

# =======================================================
#   メイン処理
# =======================================================

iDir="" # 入力ファイルが存在するフォルダ
dDir="" # ドキュメントを保存するフォルダ
mkdir tmp

# makeJSDoc ベースファイル名 タイプ 入力フォルダ名 出力フォルダ名
makeJSDoc css css $iDir $dDir
makeJSDoc htmlTable html $iDir $dDir
list=( # type=gsは複数なのでループ処理
  clientLib
  serverLib
  toolbox
)
for file in ${list[@]}; do
  makeJSDoc $file gs $iDir $dDir
done

rm tmp/*
rmdir tmp