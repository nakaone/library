/** localFunc: テスト用：処理要求発行
 * @param {void}
 * @returns 
 */
export async function localFunc(){
  const v = { whois: 'localFunc', rv: null};
  const dev = new devTools(v);
  try {

    dev.step(1);  // execテスト
    // サーバ側関数名はsrc/server/code.js「グローバル変数定義」参照
    v.exec = await globalThis.auth.exec('svTest');
    if( v.exec instanceof Error ) throw v.exec;
    dev.step(99.9,v.exec);  // ブラウザ上でのテスト結果確認

    dev.end(); // 終了処理
    return v;

  } catch (e) { return dev.error(e); }
}

/**
 * clearAuthEnvironment: IndexedDBの"Auth"データベースを削除し、環境をリセットする
 * @returns {Promise<void>}
 */
async function clearAuthEnvironment() {
  return new Promise((resolve, reject) => {
    const DB_NAME = "Auth";
    
    // データベース削除リクエスト
    const request = indexedDB.deleteDatabase(DB_NAME);

    request.onsuccess = () => {
      console.log(`[localFunc] IndexedDB '${DB_NAME}' を正常に削除しました。環境をリセットしました。`);
      resolve();
    };

    request.onerror = (event) => {
      console.error(`[localFunc] データベースの削除に失敗しました:`, event);
      reject(new Error("IndexedDB deletion failed"));
    };

    request.onblocked = () => {
      // 他のタブやコネクションが残っている場合に発生
      console.warn(`[localFunc] 削除がブロックされました。他のタブを閉じてから再試行してください。`);
      alert("データベースが使用中です。他のタブを閉じてください。");
    };
  });
}