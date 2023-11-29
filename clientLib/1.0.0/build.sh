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
  if [ -n $3 ]; then # 入力フォルダ名指定あり
    iFile=$3/$base
  else               # 入力フォルダ名指定なし
    iFile=$base
  fi
  if [ -n $4 ]; then # 出力フォルダ名指定あり
    oFile=$4/$base
  else               # 出力フォルダ名指定なし
    oFile=$base
  fi
  # 前工程で作成された同一ベースファイル名の作業用ファイルをクリア
  rm tmp/$base.*
  # 前回作成された出力先ファイルを削除
  rm $oFile.md
  echo "makeJSDoc start: base='$base' type='$type' in='$iFile' out='$oFile'"

  if [ $type = "css" ]; then
    # CSSはJSDocにかけない
    touch tmp/$base.md
    cp $iFile.html tmp/$base.js
  else
    if [ $type = "html" ]; then
      # htmlの場合、scriptタグ内部を抽出
      node ../../../library/querySelector/1.1.0/querySelector.js \
        -i:$iFile.html -o:tmp/$base.js -f:content "script"
      # JSDocを作成
      jsdoc2md tmp/$base.js > tmp/$base.md
      # ソースはhtmlを使用
      cp $iFile.html tmp/$base.js
    else
      # gsの場合、そのままコピー
      cp $iFile.js tmp/$base.js
      # JSDocを作成
      jsdoc2md tmp/$base.js > tmp/$base.md
    fi
  fi

  # ソースを末尾に追加
  cp tmp/$base.md $oFile.md
  echo "## source\n\n\`\`\`\n" >> $oFile.md
  cat tmp/$base.js >> $oFile.md
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

# -------------------------------------------------------
# minimizeSource: パイプ処理でコメントを削除
# -------------------------------------------------------
minimizeSource(){
  iDir=$1
  type="all"
  if [ $3 ]; then
    type=$2
  fi
  if [[ $iDir =~ ([a-zA-Z]+)/([0-9\.]+) ]]; then
    base=${BASH_REMATCH[1]}
    ver=${BASH_REMATCH[2]}  # 組み込む関数のバージョン。不使用の参考値
    echo "minimizeSource: in='$iDir' type='$type' base='$base'"

    # パイプ処理でコメントを削除したソースをclientLib.htmlに追加
    cat $iDir/core.js | node ../../minimize/1.0.0/pipe.js >> clientLib.html
  fi

}

# =======================================================
#   メイン処理
# =======================================================

#mkdir tmp
echo "<script>" > clientLib.html
list=(
  "changeScreen/1.0.0"
  "convertNotation/1.0.0"
  "createElement/1.2.0"
  "doGAS/1.0.0"
  "toLocale/1.0.0"
  "whichType/1.0.1"
)
for file in ${list[@]}; do
  minimizeSource $file all
done
echo "</script>" >> clientLib.html

#rm tmp/*
#rmdir tmp