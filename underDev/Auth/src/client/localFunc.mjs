export async function localFunc(){
  const v = { whois: 'localFunc', rv: null};
  dev.start(v);
  try {

    dev.step(1);  // authClientインスタンス作成
    auth = await authClient.initialize();

    dev.step(2);  // execテスト
    v.rv = auth.exec({fuga:'hoge'});
    if( v.rv instanceof Error ) throw v.rv;

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}
