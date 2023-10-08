#!/bin/sh
# -x  つけるとverbose

echo "\n\n\n\n\n\n\n\n===== camp2023.sh start ============================"
echo `TZ='Asia/Tokyo' date`

# フォルダ内のpngを減色
# https://blog.kimizuka.org/entry/2020/07/20/151707
# find . -name '*.png' | awk -F '.png' '{print "/Applications/ImageAlpha.app/Contents/MacOS/pngquant 64 " $1 ".png && mv " $1 "-fs8.png " $1 ".png && open -a /Applications/ImageOptim.app " $1 ".png" }' | sh
function compress(){
    mkdir tmp
    cp $1.png tmp/
    cd tmp
    find . -name '*.png' | awk -F '.png' '{print "/Applications/ImageAlpha.app/Contents/MacOS/pngquant 64 " $1 ".png && mv " $1 "-fs8.png " $1 ".png && open -a /Applications/ImageOptim.app " $1 ".png" }' | sh
    base64 -i $1.png -o $1.txt
    mv $1.txt ../
    rm $1.png
    cd ..
    rmdir tmp
}

compress expedition
compress map2023

node ../embedComponent/1.0.0/embedComponent.js \
    -i:template.html -o:camp2023.html -t:html