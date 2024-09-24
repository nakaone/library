/** embedObjectInText: テキストの指定位置にオブジェクトメンバの値を埋め込む
 * 
 * @param {string} source - テキスト
 * @param {Object} data - 埋め込むオブジェクト
 * @param {string} rex='::(.+?)::' - 位置指定文字列。文字列部分は括弧で囲む
 * @returns {string}
 * 
 * - オブジェクトメンバに存在しない位置指定文字列は変換しない
 * - 埋め込むオブジェクトが階層化している場合、ピリオドで区切る
 * - dataは配列不可だが、メンバは配列可
 */
function embedObjectInText(source,data,rex='::(.+?)::'){
  const v = {whois:'embedObjectInText',step:0,rv:source};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // テキストから位置指定文字列を抽出
    v.map = Array.from(new Set(source.match(new RegExp(rex,'g'))));
    vlog(v,'map');

    for( v.i=0 ; v.i<v.map.length ; v.i++ ){
      v.step = 2; // オブジェクトのメンバ名を抽出、階層別に分離
      v.m1 = v.map[v.i].match(new RegExp(rex))[1].split('.');
      vlog(v,'m1')

      v.step = 3; // 代入する値を特定
      v.target = data;
      for( v.d=0 ; v.d<v.m1.length ; v.d++ ){
        // 配列か判断
        v.m2 = v.m1[v.d].match(/^(.+?)\[(\d+)\]$/);
        if( v.m2 ){
          // 配列の場合、メンバ名と添字で値を特定
          v.target = v.target[v.m2[1]][Number(v.m2[2])];
        } else {
          // 配列では無い場合、メンバ名で値を特定
          v.target = v.target[v.m1[v.d]];
        }
      }

      v.step = 4; // 全置換を実行
      // 配列添字の鉤括弧は文字列として扱うよう置換
      v.l = v.map[v.i].replaceAll(/\[/g,'\\[').replaceAll(/\]/g,'\\]');
      v.rv = v.rv.replaceAll(new RegExp(v.l,'g'),v.target);
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
