//::$lib/devTools/1.0.1/core.js::
//::$lib/toLocale/1.2.0/core.js::
//::$lib/whichType/1.0.1/core.js::
//::$lib/SpreadDb/2.1.0/core.js::
//::$prj/core.js::

const dev = devTools();
const test = () => {
  const v = {whois:'test'};
  dev.start(v.whois);
  try {

    const util = GASutil();

    dev.step(1); // fileId指定
    const fId = '13J2Yvzc6QPCxnevxyiy70oCEislV-Y3T';  // 電子証憑2024
    v.r = util.listFiles(fId);
    if( v.r instanceof Error ) throw v.r;
    dev.dump(v.r);

    dev.step(2);  // fileId無指定 ⇒ スプレッドシートが存在するフォルダ
    v.r = util.listFiles();
    if( v.r instanceof Error ) throw v.r;
    dev.dump(v.r);

    dev.step(3);  // 不正fileId指定
    v.r = util.listFiles('fuga');
    if( v.r instanceof Error ) throw v.r;
    dev.dump(v.r);

    dev.end();  // 終了処理
  } catch (e) { dev.error(e); return e; }
}