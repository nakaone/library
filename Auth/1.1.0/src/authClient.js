function authClient(query,option={}) {
  const pv = { whois: 'authClient' };
  const v = { rv: null};
  dev.start(pv.whois, [...arguments]);
  try {

    // -------------------------------------------------------------
    dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
    // -------------------------------------------------------------
    constructor(option);
    pv.query = {table:'accounts',command:'append'};
    v.rv = authPost(pv.query);

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }

  function constructor(option) {
    const v = { whois: `${pv.whois}.constructor`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1);  // URLクエリ・localStorageからuserId/e-mail取得を試行
      // -------------------------------------------------------------
      v.userId = null;
      v.email = null;

      // -------------------------------------------------------------
      dev.step(2); // メンバ(pv)に引数を保存、未指定分には既定値を設定
      // -------------------------------------------------------------
      Object.assign(pv, {
        opt: Object.assign({
          saveUserId: true,
          saveEmail: false,
        },option,authCommon.option),
        userId: v.userId,
        email: v.email,
        CSkey: null,
        CPkey: null,
        SPkey: null,
        mirror: option.mirror || [],
      });
      // オプションとして指定されたミラーリング指定はpv.opt.mirrorではなくpv.mirrorとして保存
      if( Object.hasOwn(option,'mirror') ) delete option.mirror;

      // -------------------------------------------------------------
      dev.step(3); // CSkey/CPkeyを準備
      // -------------------------------------------------------------
      pv.CSkey = cryptico.generateRSAKey(createPassword(),pv.opt.bits);
      pv.CPkey = cryptico.publicKeyString(pv.CSkey);

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }
}