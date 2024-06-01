/** data-menu属性の文字列をオブジェクトに変換
 * authMenu専用として、以下の制限は許容する
 * - メンバ名は英小文字に限定
 * - カンマは区切記号のみで、id,label,func,hrefの値(文字列)内には不存在
 * 
 * @param {string} arg - data-menuにセットされた文字列
 * @returns {Object|null|Error} 引数がnullまたは空文字列ならnullを返す
 */
#objectize(arg){
  const v = {whois:this.constructor.name+'.objectize',rv:{},step:0};
  console.log(`${v.whois} start.\narg=${stringify(arg)}`);
  try {

    v.step = 1; // nullまたは空文字列にはnullを返す
    if( !arg || arg.length === 0 ) return null;

    v.step = 2; // カンマで分割
    v.p = arg.split(',');

    v.step = 3; // 各値をオブジェクト化
    for( v.i=0 ; v.i<v.p.length ; v.i++ ){
      v.m = v.p[v.i].match(/^([a-z]+):['"]?(.+?)['"]?$/);
      if( v.m ){
        v.rv[v.m[1]] = v.m[2];
      } else {
        throw new Error('data-menuの設定値が不適切です\n'+arg);
      }
    }

    v.step = 4.1; // idの存否チェック
    if( !v.rv.hasOwnProperty('id') )
      throw new Error('data-menuの設定値にはidが必須です\n'+arg);
    v.step = 4.2; // ラベル不在の場合はidをセット
    if( !v.rv.hasOwnProperty('label') )
      v.rv.label = v.rv.id;
    v.step = 4.3; // allowの既定値設定
    v.rv.allow = v.rv.hasOwnProperty('allow') ? Number(v.rv.allow) : this.allow;
    v.step = 4.4; // func,href両方有ればhrefを削除
    if( v.rv.hasOwnProperty('func') && v.rv.hasOwnProperty('href') )
      delete v.rv.href;
    v.step = 4.5; // from/toの既定値設定
    v.rv.from = v.rv.hasOwnProperty('from')
      ? new Date(v.rv.from).getTime() : 0;  // 1970/1/1(UTC)
    v.rv.to = v.rv.hasOwnProperty('to')
      ? new Date(v.rv.from).getTime() : 253402182000000; // 9999/12/31(UTC)

    v.step = 5; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
