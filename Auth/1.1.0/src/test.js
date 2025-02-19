/*
  authClient/Server 統合テスト
    「authClient -> authPost(テスト用doGet) -> authServer」のテストを行う。
    authClientへの戻り値はオブジェクトとし、alaSQL(create table)は割愛。
    GASの専用シートを用意、本ソースをコピペしてauthTest()を実行
*/
const dev = devTools();
const authTest = () => doTest('dev',0,1); // 引数はscenario, start, num
//::$src/doTest.js::

//::$src/authCommon.js::

//::$src/authClient.js::

//::$src/authServer.js::

function authPost(arg) {
  const v = { whois: 'authPost', rv: null};
  dev.start(v.whois, [...arguments]);
  try {
    v.rv = authServer(arg);
    dev.end(); // 終了処理
    return v.rv;
  } catch (e) { dev.error(e); return e; }
}

//::$lib/createObject/1.0.0/core.js::
//::$lib/createPassword/1.0.1/core.js::
//::$lib/devTools/1.0.0/core.js::
//::$lib/isEqual/1.1.0/core.js::
//::$lib/SpreadDb/1.2.0/core.js::
//::$lib/toLocale/1.1.0/core.js::
//::$lib/whichType/1.0.1/core.js::