# ドキュメント作成
jsdoc2md core.js > core.md

# CommonJS(require)用モジュールを作成
sed "s/function querySelector/module.exports = function querySelector/" core.js > core.cjs
# ECMAScript(import)用モジュールを作成
cp core.js core.mjs
echo "\nexport { querySelector };" >> core.mjs