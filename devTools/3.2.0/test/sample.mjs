import { readFileSync } from 'node:fs';
import { devTools } from '../core.mjs';
sample();

function sample(arg) {
  const v = {whois:`sample`, arg:{arg}, rv:null};
  const dev = new devTools(v,{mode:'dev'});
  try {

    dev.step(1);  // テストファイルの読み込み
    v.iFile = JSON.parse(readFileSync('./DocletTree.json',{encoding:'utf-8'}));
    v.sample01 = JSON.parse(readFileSync('./sample01.json',{encoding:'utf-8'}));

    dev.step(2);  // テストパターンの定義
    v.pattern = [
      {
        title: 'classのlongname',
        data: v.iFile.doclet,
        cond: '{longname}',
      },
      {
        title: 'classのlongname＋meta.lineno, columnno',
        data: v.iFile.doclet,
        // 抽出条件は戻り値booleanの関数として記述
        cond: `[x => Object.hasOwn(x,'kind') && x.kind === 'class']:{`
        + `longname,meta:{lineno,columnno}}`,
      },
      {
        title: 'classのlongname＋properties.type.names',
        data: v.iFile.doclet,
        cond: `[x => Object.hasOwn(x,'kind') && x.kind === 'class']:{`
        + `longname,properties:{type:{names}}}`,
      },
      {
        title: '項目の抽出',
        data: v.sample01,
        cond: `[x => x.type === 'a']:{name,`
        + `prop}`,
      },
    ];

    dev.step(3);  // テスト実行
    v.min = 0; v.max = v.pattern.length;
    v.min = 3; v.max = v.min + 1;
    for( v.i=v.min ; v.i<v.max ; v.i++ ){
      console.log(`== pattern.${v.i} : ${v.pattern[v.i].title} ${'='.repeat(20)}`);
      v.rv = dev.extract(v.pattern[v.i].data,v.pattern[v.i].cond);
      //console.log(JSON.stringify(v.rv,null,2));
    }

    dev.end(); // 終了処理
    return null;

  } catch (e) { return dev.error(e); }
}
