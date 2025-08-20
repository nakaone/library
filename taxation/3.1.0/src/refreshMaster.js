/** refreshMaster: 「記入用」シートの更新
 * @param {void}
 * @returns {void}
 */
function refreshMaster() {
  const v = { whois: 'refreshMaster', rv: null};
  dev.start(v.whois);
  try {

    // -------------------------------------------------------------
    dev.step(1); // 記入用・filesどちらかに存在するファイルをリストアップ
    // -------------------------------------------------------------
    v.sql = 'select `files`.id as id, `files`.name as name'
    + ', `記入用`.id as mID, `記入用`.name as mName'
    + ', `記入用`.type as type, `記入用`.date as date'
    + ', `記入用`.label as label, `記入用`.price as price'
    + ', `記入用`.payby as payby, `記入用`.note as note'
    + ' from `files` full outer join `記入用` on `files`.id=`記入用`.id'
    + ' where identifyType(`files`.name)="不明"'  // 自動判別可能なPDF、対象外は除外
    + ';';
    v.r = db.exec(v.sql);
    if( v.r instanceof Error ) throw v.r;
    dev.dump(v.r);

    // -------------------------------------------------------------
    dev.step(2);  // ファイル存否状態に基づき項目を設定
    // 以下①〜④の存否はfiles/記入用のidの存否
    // ①両方存在 -> isExist=true、id,nameはfilesから引用、他は記入用を引用
    // ②filesのみ存在 -> isExist=true、id,nameはfilesから引用、他は空欄
    // ③記入用のみ存在 -> isExist=false、id,nameを含め他は記入用を引用
    // ④両方不在 -> isExist=false、他は記入用を引用(type=特記事項)
    // -------------------------------------------------------------
    v.list = [];
    for( v.i=0 ; v.i<v.r.length ; v.i++ ){
      v.list.push(Object.assign(v.r[v.i],{
        link: cf.previewURL.replace('$1',v.r[v.i].id),  // プレビュー用URL
        isExist: v.r[v.i].id ? true : false,
        id: v.r[v.i].id || v.r[v.i].mId,
        name: v.r[v.i].name || v.r[v.i].mName,
        type: v.r[v.i].type || (!v.r[v.i].id && !v.r[v.i].mId ? '特記事項' : ''),
      }));
    }
    dev.dump(v.list.length,v.list,1049);

    dev.step(3.1);  // 更新内容を「記入用」テーブルに保存
    v.sql = 'delete from `記入用`;'
    + 'insert into `記入用` select * from ? order by type, date;';
    v.r = db.exec(v.sql,[v.list]);
    if( v.r instanceof Error ) throw v.r;

    dev.step(3.2);  // シートに反映
    v.r = db.save('記入用');
    if( v.r instanceof Error ) throw v.r;

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}
