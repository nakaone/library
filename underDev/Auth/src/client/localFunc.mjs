/** localFunc: テスト用：処理要求発行
 * @param {void}
 * @returns 
 */
export function localFunc(){
  const v = { whois: 'localFunc', rv: null};
  dev.start(v);
  try {

    dev.step(1);  // execテスト
    v.exec = globalThis.auth.exec({fuga:'hoge'});
    if( v.exec instanceof Error ) throw v.exec;
    dev.step(99.9,v.exec);  // ブラウザ上でのテスト結果確認

    dev.end(); // 終了処理
    return v;

  } catch (e) { return dev.error(e); }
}
