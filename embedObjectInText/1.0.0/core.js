/** embedObjectInText: テキストの指定位置にオブジェクトメンバの値を埋め込む
 * 
 * @param {string} source - テキスト
 * @param {string} rex - 位置指定文字列。文字列部分は括弧で囲む。ex.`::(.+?)::`
 * @param {Object} data - 埋め込むオブジェクト
 * @returns {string}
 * 
 * - オブジェクトメンバに存在しない位置指定文字列は変換しない
 * - 埋め込むオブジェクトが階層化している場合、ピリオドで区切る
 * - オブジェクトメンバは、配列には非対応
 */
function embedObjectInText(source,rex,data){
  const v = {whois:'embedObjectInText',step:0,rv:source};
  console.log(`${v.whois} start.`);
  try {

    // テキストから位置指定文字列を抽出
    v.map = Array.from(new Set(source.match(new RegExp(rex,'g'))));
    vlog(v,'map');

    for( v.i=0 ; v.i<v.map.length ; v.i++ ){
      v.m = v.map[v.i].match(new RegExp(rex))[1];
      vlog(v,'m')
      console.log(v.map[v.i],data[v.m]);
      v.rv = v.rv.replaceAll(new RegExp(v.map[v.i],'g'),data[v.m]);
    }

    // オブジェクトメンバと比較し、存在するもののみ抽出
    // 全件置換を実行

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
