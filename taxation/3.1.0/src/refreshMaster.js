/** refreshMaster : メニュー「ファイル一覧更新」
 * 1. カレントフォルダ直下のファイル一覧をfilesテーブルに格納
 *    ※ 移動したファイルはリストアップ対象外(リストに残っていたら削除)
 * 2. YFPのPDFファイル結合
 * 3. 「記入用」シートの更新
 * @param {void}
 * @returns {void}
 */
function refreshMaster() {
  const v = { whois: 'refreshMaster', rv: null};
  dev.start(v.whois);
  try {

    // -------------------------------------------------------------
    dev.step(1);  // カレントフォルダ直下のファイル一覧をfilesテーブルに格納
    // -------------------------------------------------------------
    dev.step(1.1);  // カレントフォルダ直下のファイル一覧を取得
    v.r = getFileList();
    if( v.r instanceof Error ) throw v.r;
    dev.dump(`num = ${v.r.length}, sample(n=3) = ${JSON.stringify(v.r.slice(0,3),null,2)}`);

    dev.step(1.2);  // filesテーブルの内容を更新
    v.sql = 'drop table if exists `files`;'
    + 'create table `files`;'
    + 'insert into `files` select * from ?;';
    v.r = db.do(v.sql,[v.r]);
    if( v.r instanceof Error ) throw v.r;
    dev.dump(v.r);

    dev.step(1.3);  // filesテーブルをシートに保存
    v.r = db.save('files');
    if( v.r instanceof Error ) throw v.r;
    dev.dump(v.r);

    // YFPのPDFファイル結合
    // 「記入用」シートの更新
    
    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}
