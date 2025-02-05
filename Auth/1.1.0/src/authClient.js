function authClient(query,option={}) {
  const cv = { whois: 'authClient' };
  const v = { rv: null};
  dev.start(cv.whois, [...arguments]);
  try {

    // -------------------------------------------------------------
    dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
    // -------------------------------------------------------------
    constructor(query,option);
    cv.query = {table:'accounts',command:'append'};
    v.rv = authPost(cv.query);

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }

  function constructor(arg) {
    const v = { whois: `${cv.whois}.constructor`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------
      v.rv = {query:query,option:option};

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }
}