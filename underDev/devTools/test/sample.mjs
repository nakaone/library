import { readFileSync } from 'node:fs';
import { devTools } from '../core.mjs';
sample();

function sample(arg) {
  const v = {whois:`sample`, arg:{arg}, rv:null};
  const dev = new devTools(v,{mode:'dev'});
  try {

    dev.step(1);  // テストファイルの読み込み
    v.iFile = JSON.parse(readFileSync('./DocletTree.json',{encoding:'utf-8'}));

    dev.step(2);  // テストパターンの定義
    v.pattern = [
      {
        title: 'classのlongname',
        data: v.iFile.doclet,
        cond: {
          keys: 'longname',
          filter: x => Object.hasOwn(x,'kind') && x.kind === 'class',
        }
      },
      {
        title: 'classのlongname＋meta.lineno, columnno',
        data: v.iFile.doclet,
        cond: {
          keys: 'longname',
          filter: x => Object.hasOwn(x,'kind') && x.kind === 'class',
          children: {
            meta:{
              keys: ['lineno','columnno'],
            }
          }
        }
      },
      {
        title: 'classのlongname＋properties.type.names',
        data: v.iFile.doclet,
        cond: {
          keys: 'longname',
          filter: x => Object.hasOwn(x,'kind') && x.kind === 'class',
          children: {properties:{children:{type:{keys:'names'}}}}
        }
      },
    ];

    dev.step(3);  // テスト実行
    for( v.i=2 ; v.i<v.pattern.length ; v.i++ ){
      console.log(`== pattern.${v.i} : ${v.pattern[v.i].title} ${'='.repeat(20)}`);
      v.rv = dev.extract(v.pattern[v.i].data,v.pattern[v.i].cond);
      console.log(JSON.stringify(v.rv,null,2));
    }

    dev.end(); // 終了処理
    return null;

  } catch (e) { return dev.error(e); }
}
