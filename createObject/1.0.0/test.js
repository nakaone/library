const createObjectTest = () => {
  const v = {};
  const src = {
    acArg: [
      {name:'saveUserId',type:'boolean',value:true,note:''},
      {name:'saveEmail',type:'boolean',value:false,note:''},
      {name:'mirror',type:'acMirror',note:''},
    ],
    acMirror: [
      {name:'name',type:'string',value:'',note:'ミラーリングするテーブル名'}, // valueのデータ型はtypeに一致させる
      {name:'func',type:'function',value:()=>true,note:'定期実行ジョブ'},
      {name:'interval',type:'number',value:300000,note:'実行間隔(ミリ秒)'},
    ],
  }
  v.rv = createObject({
    defs: {acArg:src.acArg,acMirror:src.acMirror},
    root: 'acArg',
    val: {saveUserId:false},
    addTo: v.pv
  });
  console.log(JSON.stringify(v.rv,null,2));
  console.log(v.rv.mirror.func.toString());
}

/** createObject: 定義と所与のオブジェクトから新たなオブジェクトを作成 */
function createObject(arg) {
  const v = { whois: 'createObject', types:[  // typeofの戻り値となるデータ型
    'undefined','object','boolean','number','bigint','string','symbol','function']};
  dev.start(v.whois, [...arguments]);
  try {

    dev.step(1.1); // 処理対象となる項目定義名
    v.root = arg.root || Object.keys(arg.defs)[0];
    dev.step(1.2); // 戻り値を設定
    v.rv = arg.addTo || {};
    dev.dump(arg,v.root,v.rv,35);

    for( v.i=0 ; v.i<arg.defs[v.root].length ; v.i++ ){
      dev.step(2);
      v.def = arg.defs[v.root][v.i];  // 単体の項目定義オブジェクト
      v.valType = typeof v.def.value
      if( !v.def.type ) v.def.type = v.valType;
      dev.dump(v.def,v.valType,42);

      if( v.def.type === v.valType ){
        dev.step(3); // typeで指定されたデータ型と設定値の型が一致 ⇒ 設定値を採用
        v.rv[v.def.name] = v.def.value;
      } else {
        dev.step(4); // typeで指定されたデータ型と設定値の型が不一致
        if( v.types.includes(v.def.type) ){
          dev.step(5); // 独自データ型ではない(typeofで返されるデータ型の一つ)
          if( v.def.type === 'function' && v.valType !== 'function' ){
            dev.step(5.11); // type == 'function' && typeof value != 'function' ⇒ valueを関数化
            v.fx = arg.data.match(/^function\s*\w*\s*\(([\w\s,]*)\)\s*\{([\s\S]*?)\}$/); // function(){〜}
            v.ax = arg.data.match(/^\(?([\w\s,]*?)\)?\s*=>\s*\{?(.+?)\}?$/); // arrow関数
            dev.step(5.12);
            if (v.fx || v.ax) {
              dev.step(5.13); // function文字列
              v.a = (v.fx ? v.fx[1] : v.ax[1]).replaceAll(/\s/g, ''); // 引数部分
              v.a = v.a.length > 0 ? v.a.split(',') : [];
              v.b = (v.fx ? v.fx[2] : v.ax[2]).replaceAll(/\s+/g, ' ').trim(); // 論理部分
              v.rv[v.def.name] = new Function(...v.a, v.b);
            } else {
              dev.step(5.14);
              throw new Error('invalid function definition');
            }
          } else if( v.def.type !== 'function' && v.valType === 'function' ){
            dev.step(5.2); // type != 'function' && typeof value == 'function' ⇒ value(関数)の実行結果を設定
            v.rv[v.def.name] = v.def.value();
          } else {
            dev.step(5.3);
            throw new Error('data type of value unmatch type definition');
          }
        } else {
          dev.step(6); // 独自データ型
          v.rv[v.def.name] = createObject({
            defs: arg.defs,
            root: v.def.type,
            val: arg.val[v.def.name],
          });
        }
      }
    }

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}