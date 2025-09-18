//::$lib/devTools/1.0.1/core.js::
//::$lib/toLocale/1.2.0/core.js::
//::$lib/whichType/1.0.1/core.js::
//::$prj/core.js::

const dev = devTools();
const test = () => {
  const util = GASutil();

  // fileId指定
  const fId = '13J2Yvzc6QPCxnevxyiy70oCEislV-Y3T';  // 電子証憑2024
  console.log(JSON.stringify(util.listFiles(fId)));

  // fileId無指定 ⇒ スプレッドシートが存在するフォルダ
  console.log(JSON.stringify(util.listFiles()));

  // 不正fileId指定
  console.log(JSON.stringify(util.listFiles('fuga')));
}