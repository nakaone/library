function refreshMaster() {
  const v = { whois: 'refreshMaster', rv: null};
  dev.start(v.whois);
  try {
    db = SpreadDB(cf);

    // -------------------------------------------------------------
    dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
    // -------------------------------------------------------------

    // 「記入用」と「files」を full outer join
    v.sql = 'select `files`.id as id, `files`.name as name'
    + ', `記入用`.id as mID, `記入用`.name as mName'
    + ', `記入用`.type as type, `記入用`.date as date'
    + ', `記入用`.label as label, `記入用`.price as price'
    + ', `記入用`.payby as payby, `記入用`.note as note'
    + ' from `files` full outer join `記入用` on `files`.id=`記入用`.id'
    + ' where identifyType(`files`.name)="不明"'
    + ';';
    v.r = db.do(v.sql);
    if( v.r instanceof Error ) throw v.r;
    dev.dump(v.r);

    dev.step(2);
    //   ①両方存在 -> id,nameはfilesから引用、isExist=true、他は記入用を引用
    //   ②記入用のみ存在 -> isExist=false、後は記入用を引用
    //   ③filesのみ存在 -> id,nameはfilesから引用、isExist=true、他は空欄
    v.list = [];
    for( v.i=0 ; v.i<v.r.length ; v.i++ ){
      if( v.r[v.i].mID ){
        if( v.r[v.i].id ){ // ①両方存在
          v.r[v.i].isExist = true;
        } else {  // ②記入用のみ存在
          v.r[v.i].isExist = false;
          v.r[v.i].id = v.r[v.i].mId;
        }
        v.r[v.i].name = v.r[v.i].mName;
        v.list.push(v.r[v.i]);
      } else {  // ③filesのみ存在
        v.r[v.i].isExist = true;
        v.r[v.i].name = `=hyperlink("${cf.previewURL.replace('$1',v.r[v.i].id)}","${v.r[v.i].name}")`;
        v.list.push(v.r[v.i]);
      }
    }
    dev.dump(v.list);

    dev.step(3.1);  // 更新内容を「記入用」テーブルに保存
    v.sql = 'delete from `記入用`;'
    + 'insert into `記入用` select * from ?;';
    v.r = db.do(v.sql,[v.list]);
    if( v.r instanceof Error ) throw v.r;

    dev.step(3.2);  // シートに反映
    v.r = db.save('記入用');
    if( v.r instanceof Error ) throw v.r;

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}
