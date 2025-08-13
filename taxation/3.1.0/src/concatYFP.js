/** concatYFP: YFP関係証憑の結合 */
function concatYFP() {
  const v = { whois: 'concatYFP', rv: null};
  dev.start(v.whois);
  try {

    // -------------------------------------------------------------
    dev.step(1); // カレントディレクトリ直下のファイル一覧を取得
    // -------------------------------------------------------------
    v.r = getFileList();
    if( v.r instanceof Error ) throw v.r;
    dev.dump(v.r);

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}
