//::$test/material.js::
//::$prj/core.js::
//::$lib/devTools/1.0.1/core.js::
//::$lib/isEqual/1.1.0/core.js::
//::$lib/mergeDeeply/1.2.0/core.js::
//::$lib/toLocale/1.2.0/core.js::
//::$lib/whichType/1.0.1/core.js::
//::$lib/AlaSQLonGAS/1.7.2/alasql.min.js::

const dev = devTools();
function SchemaTest() {
  const v = { whois: 'SchemaTest', rv: null};
  dev.start(v.whois);
  try {

    dev.step(1);
    v.r = Schema(kzConfig.schema);
    console.log('\n\n\n===== result\n\n');
    dev.dump(v.r);

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}
SchemaTest();