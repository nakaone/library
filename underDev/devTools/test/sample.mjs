import { readFileSync } from 'node:fs';
import { devTools } from '../core.mjs';
sample();

function sample(arg) {
  const v = {whois:`sample`, arg:{arg}, rv:null};
  const dev = new devTools(v,{mode:'dev'});
  try {

    dev.step(1);  // テストファイルの読み込み
    v.iFile = readFileSync('./DocletTree.json',{encoding:'utf-8'});
    v.rv = v.iFile;

    dev.end(v.rv); // 終了処理
    return v.rv;

  } catch (e) { return dev.error(e); }
}
