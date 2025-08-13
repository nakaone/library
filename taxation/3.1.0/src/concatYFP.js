/** concatYFP: YFP関係証憑の結合 */
async function concatYFP() {
  const v = { whois: 'concatYFP', rv: null};
  dev.start(v.whois);
  try {

    // -------------------------------------------------------------
    dev.step(1); // カレントディレクトリ直下のファイル一覧を取得
    // -------------------------------------------------------------
    v.r = getFileList();
    if( v.r instanceof Error ) throw v.r;
    dev.dump(v.r);

    dev.step(2);  // YFP関係を種類毎にピックアップ
    v.stack = {};
    Object.keys(cf.YFPrex).forEach(x => {
      // 顧問報酬, 記帳代行, 結合済 を順にチェック
      v.stack[x] = [];
      v.r.forEach(file => { // 一覧からファイル名を順次確認
        if( v.m = file.name.match(cf.YFPrex[x]) ){
          v.stack[x].push({
            id:file.id, // ファイルID
            fn:file.name, // ファイル名
            ym:v.m[1]+v.m[2], // 年月
          });
        }
      });
      // RDBに登録
      v.sql = `drop table if exists \`${x}\`;`
      + `create table \`${x}\`;`
      + `insert into \`${x}\` select * from ?;`;
      db.do(v.sql,[v.stack[x]]);
    });
    dev.dump(v.stack);

    dev.step(3);  // 顧問報酬, 記帳代行, 結合済の相互関係をテーブルYFPに保存
    v.sql = 'drop table if exists YFP;'
    + 'create table YFP;'
    + 'insert into YFP select `顧問報酬`.id as id1, `顧問報酬`.fn as fn1, `顧問報酬`.ym as ym1'
    + ', `記帳代行`.id as id2, `記帳代行`.fn as fn2, `記帳代行`.ym as ym2'
    + ', `結合済`.id as id3, `結合済`.fn as fn3, `結合済`.ym as ym3'
    + ' from ? as `顧問報酬`'
    + ' full outer join ? as `記帳代行` on `顧問報酬`.ym = `記帳代行`.ym'
    + ' full outer join ? as `結合済` on `顧問報酬`.ym = `結合済`.ym;'
    + 'select * from YFP;';
    v.r = db.do(v.sql,[v.stack['顧問報酬'],v.stack['記帳代行'],v.stack['結合済']]);
    if( v.r instanceof Error ) throw v.r;
    dev.dump(v.r);

    dev.step(4);  // 顧問報酬と記帳代行いずれか片方のみの場合、エラー
    v.sql = 'select ym1, ym2 from YFP'
    + ' where id1 is null and id2 is not null'
    + ' or id1 is not null and id2 is null';
    v.r = db.do(v.sql);
    if( v.r instanceof Error ) throw v.r;
    if( v.r.length > 0 )
      throw new Error(`顧問報酬/記帳代行の片方しか有りません: ${JSON.stringify(v.r,null,2)}`);

    dev.step(5);  // 顧問報酬に存在し結合済に不存在なら結合対象
    v.sql = 'select id1,id2,ym1 from YFP where id3 is null;';
    v.r = db.do(v.sql);
    if( v.r instanceof Error ) throw v.r;

    if( v.r.length > 0 ){
      dev.step(6.1);  // フォルダIDの取得
      // スプレッドシートのIDを取得
      v.ssId = SpreadsheetApp.getActiveSpreadsheet().getId();
      // スプレッドシートのファイルを取得
      v.file = DriveApp.getFileById(v.ssId);
      // 親フォルダを取得
      v.parentFolder = v.file.getParents().next();
      // フォルダIDを取得
      v.folderId = v.parentFolder.getId();

      dev.step(6.2);  // 結合処理を呼び出し
      for( v.i=0 ; v.i<v.r.length ; v.i++ ){
        await mergePDFs(
          [v.r[v.i].id1,v.r[v.i].id2],  // ids: 結合したいPDFファイルのID
          v.folderId, // 格納先のフォルダID
          `YFP${v.r[v.i].ym1}.pdf`  // 結合後のPDFファイル名
        );
      }
    }

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}
