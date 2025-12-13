export class LocalRequest {
  constructor(func,arg=[]) {
    const v = {whois:`LocalRequest.constructor`, arg:{func,arg}, rv:null};
    dev.start(v);
    try {

      dev.step(1); // funcが関数名として有効かチェック
      if( !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(func) ){
        throw new Error('Invalid function');
      }
      this.func = func;

      dev.step(2);  // 引数は関数を排除するため、一度JSON化してからオブジェクト化
      this.arg = JSON.parse(JSON.stringify(arg));

      dev.end(); // 終了処理

    } catch (e) { return dev.error(e); }
  }
}