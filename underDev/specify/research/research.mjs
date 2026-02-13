import { stdin } from 'process';

/** research.mjs: JSONを加工
 * - `jsdoc -X`の出力結果等から必要なメンバのみリストアップ等を想定
 */

const readStdin = async () => {
  let data = '';
  for await (const chunk of stdin) {
    data += chunk;
  }
  return data;
};

try {
  const input = await readStdin();
  console.log(research(JSON.parse(input)));
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}

function research(arg){
  /*
  {
    "test":{
      "jsdoc": //::$tmp/test.json::
      ,"doc":  //::$tmp/test.doc.json::
    },
    "createSpec":{
      "jsdoc": //::$tmp/createSpec.json::
      ,"doc":  //::$tmp/createSpec.doc.json::
    },
  }
  const doc = { // 全体管理
    source: null, // {SourceFile}
    doclet: [],   // {DocletEx[]}
    map: {},      // {Object.<string, DocletEx>} DocletEx.idをキーとするマップ
    unique: [],   // {string[]} 固有パス一覧
  };
  */
  const v = {j:arg.test.jsdoc,d:arg.test.doc.doclet,rv:{}};

  // データ件数
  v.rv.jLen = v.j.length;
  v.rv.dLen = v.d.length;

  ['j','d'].forEach(jd => {
    //v.rv[`${jd}longname`] = v[jd].map(x => x.longname);
    v.rv[`${jd}class01`] = JSON.stringify(
    v[jd].filter(x => x.longname === 'class01')
    .filter(x => x.meta?.code?.type === "ClassDeclaration"),null,2);
  })

  /*
以下①②でグルーピングする際、片方range有り・もう片方がrange無しとなることは考えられるか？
①path, filename, range[0], kind, longname が全て一致
②path, filename, lineno, columnno, kind, longname が全て一致
  v.rv.jlongname = v.j.map(x => x.longname);
  v.rv.dlongname = v.d.map(x => x.longname);
  v.rv.list = json
  //.filter(x => x.longname === 'class01')
  //.
  .map(x => {return {
    longname: x.longname,
    //id: x.id,
    //comment: x.comment,
    //meta: JSON.stringify((x.meta ?? 'undef'),null,2),
  };});
  */
  return v.rv;
}
