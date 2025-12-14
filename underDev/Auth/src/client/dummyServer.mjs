export class dummyServer {

  constructor(arg) {
    const v = {whois:`dummyServer.constructor`, arg:{arg}, rv:null};
    dev.start(v);
    try {

      // IndexedDBに'AuthTest'が無ければ作成
      // IndexedDBのAuthTestからRSA鍵ペアをメンバに取得
      //   SSkeySign, SPkeySign, SSkeyEnc, SPkeyEnc
      // 存在しなければ生成してIndexedDBとメンバに保存

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }

  exec(request) {
    const v = {whois:`${this.constructor.name}.exec`, arg:{request}, rv:null};
    dev.start(v);
    try {

      // requestを復号

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { return dev.error(e); }
  }
}