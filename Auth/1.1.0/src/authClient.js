function authClient(query,option={}) {
  const cv = { whois: 'authClient' };
  const v = { rv: null};
  dev.start(cv.whois, [...arguments]);
  try {

    // -------------------------------------------------------------
    dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
    // -------------------------------------------------------------
    constructor(option);
    cv.query = {table:'accounts',command:'append'};
    v.rv = authPost(cv.query);

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }

  function constructor(option) {
    const v = { whois: `${cv.whois}.constructor`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1);  // URLクエリ・localStorageからuserId/e-mail取得を試行
      // -------------------------------------------------------------
      v.userId = null;
      v.email = null;

      // -------------------------------------------------------------
      dev.step(2); // メンバ(cv)に引数を保存、未指定分には既定値を設定
      // -------------------------------------------------------------
      Object.assign(cv, {
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
      // オプションとして指定されたミラーリング指定はcv.opt.mirrorではなくcv.mirrorとして保存
      if( Object.hasOwn(option,'mirror') ) delete option.mirror;

      // -------------------------------------------------------------
      dev.step(3); // CSkey/CPkeyを準備
      // -------------------------------------------------------------
      cv.CSkey = cryptico.generateRSAKey(createPassword(),cv.opt.bits);
      cv.CPkey = cryptico.publicKeyString(cv.CSkey);

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }
}