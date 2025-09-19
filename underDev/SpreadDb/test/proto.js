//::$lib/devTools/1.0.1/core.js::
//::$lib/mergeDeeply/1.2.0/core.js::
//::$lib/toLocale/1.2.0/core.js::
//::$lib/whichType/1.0.1/core.js::
//::$lib/Schema/1.1.0/core.js::
//::$lib/AlaSQLonGAS/1.7.2/alasql.min.js::
//::$prj/core.js::

const dev = devTools();
const test = () => {
  const v = {whois:'test'};
  dev.start(v.whois);
  try {

    dev.step(1);

    dev.end();  // 終了処理
  } catch (e) { dev.error(e); return e; }
}