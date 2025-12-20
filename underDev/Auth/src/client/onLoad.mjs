import { authClient } from "./authClient.mjs";
export async function onLoad(){
  const v = {whois:`onLoad`, rv:null};
  const dev = new devTools(v);
  try {

    dev.step(1);  // authClientインスタンス作成
    const auth = await authClient.initialize({
      adminMail: 'ena.kaon@gmail.com',
      adminName: 'あどみ',
      api: 'AKfycbz5-GZTXzXj8yYb4jzFU5ul2uOeOEHE_NbIUWcwZAXT16vFA2vACg8MVmwMavDJUjsJ',
    });

    dev.step(2);  // authインスタンスをグローバル変数と戻り値(テスト用)にセット
    globalThis.auth = auth;
    v.rv = auth;

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { return dev.error(e); }
}
