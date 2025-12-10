// ライブラリ関数定義
//::$lib/devTools/2.1.0/core.js::

// authClient関係クラス定義
//::$src/client/authClient.js::

// グローバル変数定義
const dev = devTools();
let auth;  // authClient。HTML要素のイベント対応のためグローバル領域で宣言

// 処理要求を発行するローカル関数
function localFunc(){
  const v = { whois: 'localFunc', rv: null};
  dev.start(v);
  try {

    dev.step(1);  // authClientインスタンス作成
    auth = new authClient();

    // -------------------------------------------------------------
    dev.step(2); // 引数の存否確認、データ型チェック ＋ ワークの準備
    // -------------------------------------------------------------
    v.request = {fuga:'hoge'};

    // サーバ側関数'trans01'にrequestを渡して処理要求
    v.rv = auth.exec(v.request);
    if( v.rv instanceof Error ) throw v.rv;
    dev.step(99.25,v.rv);
    console.log(`l.26 ${typeof v.rv}\n${v.rv instanceof Error}\n${JSON.stringify(v.rv,null,2)}`);

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}

// onLoad処理は"async"で宣言
async function onLoad(){
  auth = new authClient();
  console.log('onLoad running');
}
