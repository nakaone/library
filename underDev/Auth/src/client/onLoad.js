// 例: localFunc.mjs の冒頭付近
let _mockDB = null;
let _mockAuthExec = null;

export function __setMockDB(db) { _mockDB = db; }
export function __setAuthExec(fn) { _mockAuthExec = fn; }

export async function localFunc(opt) {
  const db = _mockDB ?? realIndexedDB;      // モック優先
  const execFn = _mockAuthExec ?? authClient.exec;
}


// ライブラリ関数定義
//::$lib/devTools/2.1.0/core.js::

// authClient関係クラス定義
//::$src/client/authClient.js::
//::$src/client/authConfig.js::
//::$src/client/authClientConfig.js::

// グローバル変数定義
const dev = devTools();
let auth;  // authClient。HTML要素のイベント対応のためグローバル領域で宣言

// 処理要求を発行するローカル関数
async function localFunc(){
  const v = { whois: 'localFunc', rv: null};
  dev.start(v);
  try {

    dev.step(1);  // authClientインスタンス作成
    auth = await authClient.initialize();

    dev.step(2);  // execテスト
    v.rv = auth.exec({fuga:'hoge'});
    if( v.rv instanceof Error ) throw v.rv;

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}

// onLoad処理は"async"で宣言
async function onLoad(){
  auth = new authClient();
  console.log('onLoad running');
}
