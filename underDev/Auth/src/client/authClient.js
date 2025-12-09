class authClient {

  constructor(arg) {
    const v = {whois:`${this.constructor.name}.constructor`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      // -------------------------------------------------------------
      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------
      this.pv = {}; // クラス内共用の汎用インスタンス変数

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  exec(arg) {
    const v = {whois:`${this.constructor.name}.exec`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      // -------------------------------------------------------------
      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------
      v.rv = arg;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}