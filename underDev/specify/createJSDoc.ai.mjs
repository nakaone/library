#!/usr/bin/env node

/**
 * node createJSDoc.mjs [入力ファイル...] -o 出力フォルダ [-x 除外パターン ...]
 * - ワイルドカードはクォートすると展開されない("src/*.js"は不展開)
 * - *.js # 任意文字列
 * - ?.js # 1文字
 * - [a-z].js # 文字クラス
 * - **\/*.js # 再帰glob(src/a.js, src/lib/x.js, test/foo.js)
 * - src/**\/*.js~src/**\/*.test.js # 除外glob(左例はtestを除外したjs)
 */

import path from 'path';
import process from 'process';

// ------------------------------
// 引数パース
// ------------------------------
const args = process.argv.slice(2);

const inputs = [];
const excludes = [];
let outDir = null;

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '-o') {
    outDir = args[++i];
  } else if (a === '-x') {
    excludes.push(args[++i]);
  } else {
    inputs.push(a);
  }
}

if (!outDir) {
  console.error('output directory (-o) is required');
  process.exit(1);
}

// ------------------------------
// 除外判定（glob風）
// ------------------------------
const match = (file, pattern) => {
  // zsh 展開後なので minimatch なしの簡易対応
  // *.test.js / foo/*/bar.js 程度を想定
  const re = new RegExp(
    '^' +
      pattern
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.') +
      '$'
  );
  return re.test(file);
};

// ------------------------------
// 処理対象ファイル抽出
// ------------------------------
const targets = [];

for (const file of inputs) {
  const base = path.basename(file);
  const excluded = excludes.some(pat => match(base, pat));
  if (!excluded) {
    targets.push(path.resolve(file)); // resolve:相対パス->絶対パス
  }
}

// ------------------------------
// 結果表示
// ------------------------------
console.log('output dir :', path.resolve(outDir));
console.log('targets:');
for (const f of targets) {
  console.log('  ' + f);
}