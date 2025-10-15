function authServer(arg) {
  const pv = { whois: 'authServer', rv: null};
  dev.start(pv.whois, [...arguments]);

  回答ID：Ans-20251008-02
  try {  // メイン処理

    // -------------------------------------------------------------
    dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
    // -------------------------------------------------------------
    dev.dump(arg,11);

    dev.end(); // 終了処理
    return pv.rv;

  } catch (e) { dev.error(e); return e; }
}
