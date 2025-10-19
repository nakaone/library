//::$lib/devTools/1.0.1/core.js::
//::$lib/SpreadDb/2.2.0/core.js::
//::$lib/toLocale/1.2.0/core.js::
//::$lib/whichType/1.0.1/core.js::

const dev = devTools();
function authServer(arg) {

  //::$src/typedef/authServerConfig.js::

  const pv = Object.assign(new authServerConfig,{whois:'authServer', rv:null});

  dev.start(pv.whois);
  try {  // メイン処理

    // -------------------------------------------------------------
    dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
    // -------------------------------------------------------------
    dev.dump(pv);

    dev.end(); // 終了処理
    //return pv.rv;

  } catch (e) { dev.error(e); }
}
