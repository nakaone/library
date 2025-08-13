function refreshMaster() {
  const v = { whois: 'refreshMaster', rv: null};
  dev.start(v.whois);
  try {

    // いまここ：旧版のまま
    // -------------------------------------------------------------

    // -------------------------------------------------------------
    dev.step(1); // 既存masterシートの内容をv.masterに読み込み
    // -------------------------------------------------------------
    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.mSheet = v.spread.getSheetByName('master');
    v.master = {};
    if (v.mSheet) {
      dev.step(1.1);  // masterシートが存在する場合、内容をv.masterに読み込み
      v.raw = v.mSheet.getDataRange().getValues();
      for (v.r = 1; v.r < v.raw.length; v.r++) {  // ヘッダ行(0行目)は飛ばす
        v.o = {};
        for (v.c = 0; v.c < v.cols.length; v.c++) {
          v.o[v.raw[0][v.c]] = v.raw[v.r][v.c];
        }
        v.o.isExist = 'x';  // isExistはこの時点で一度クリア
        delete v.o.fill;  // 記入要否欄もクリア
        v.master[v.o.id] = v.o;
      }
    } else {
      dev.step(1.2);  // masterシートが不在の場合、ヘッダ行のみで新規作成
      v.mSheet = v.spread.insertSheet('master');
      v.mSheet.getRange(1, 1, 1, v.cols.length).setValues(v.cols);
    }

    // ------------------------------------------------------------------
    dev.step(2); // フォルダのファイル一覧をv.currentに読み込み、v.masterに反映
    // ------------------------------------------------------------------
    v.current = getFileList();
    for (v.id in v.current) {
      // v.master,v.currentとも値が空白の項目は削除(∵Object.assignで有効値を空白が上書きするのを回避)
      v.mObj = v.master[v.id] || {};
      [v.mObj, v.current[v.id]].forEach(o => {
        for (v.x in o) if (o[v.x] === '') delete o[v.x];
      });
      v.master[v.id] = Object.assign(
        // 設定値は「既定値設定項目 < 既存シート < 自動取得・設定項目」順に優先する
        determineType(v.current[v.id].name),
        (v.master[v.id] || {}),
        v.current[v.id]
      );
    }

    // ------------------------------------------------------------------
    dev.step(3); // シート「master」の名前を「previous」に変更
    // ------------------------------------------------------------------
    v.pSheet = v.spread.getSheetByName('previous');
    if (v.pSheet) { // 既存のシート「previous」は削除
      v.spread.deleteSheet(v.pSheet);
    }
    v.pSheet = v.spread.getSheetByName('master');
    v.pSheet.setName('previous');

    // ------------------------------------------------------------------
    dev.step(4); // シート「master」を新規作成、v.masterを書き出し
    // ------------------------------------------------------------------
    v.mSheet = v.spread.insertSheet('master');
    v.data = [v.cols];
    for (v.id in v.master) {
      v.row = [];
      for (v.i = 0; v.i < v.cols.length; v.i++) {
        v.row.push(v.master[v.id][v.cols[v.i]] || '');
      }
      v.data.push(v.row);
    }
    v.mSheet.getRange(1, 1, v.data.length, v.cols.length).setValues(v.data);

    // ------------------------------------------------------------------
    dev.step(5);  // 項目"fill"のトップに手動追加要否の判定式をセット
    // ------------------------------------------------------------------
    v.parts = ['=arrayformula(_)',
      'if(isblank(a2:a),"",_)',	// idが空欄なら何も表示しない
      'if(l2:l="不明","o",_)',	// typeが「不明」なら対象
      'if(m2:m="不明","o",_)',	// labelが「不明」なら対象
      'if(l2:l="電子証憑",_,"x")',	// typeが「電子証憑」ではないなら対象外
      'if(isblank(m2:m),"o",_)',	// typeが「電子証憑」でlabelが空欄なら対象
      'if(isblank(n2:n),"o",_)',	// typeが「電子証憑」でdateが空欄なら対象
      'if(isblank(o2:o),"o",_)',	// typeが「電子証憑」でpriceが空欄なら対象
      'if(isblank(p2:p),"o","x")',	// typeが「電子証憑」でpaybyが空欄なら対象
    ];
    for (v.i = 1, v.formula = v.parts[0]; v.i < v.parts.length; v.i++) {
      v.formula = v.formula.replace('_', v.parts[v.i]);
    }
    // 前準備：各項目の列番号をv.colnumに用意
    v.cols.forEach(x => v.colnum[x] = (v.cols.findIndex(y => x === y) + 1));
    v.mSheet.getRange(2, v.colnum['fill']).setValue(v.formula);

    // ------------------------------------------------------------------
    dev.step(6);  // シート「master」を見やすく変更
    // ------------------------------------------------------------------
    dev.step(6.1); // name(ファイル名)欄の幅は入力内容に合わせる
    v.mSheet.autoResizeColumn(v.colnum['name']);
    dev.step(6.2); // mime〜isExist欄は非表示
    v.mSheet.hideColumns(v.colnum['mime'], v.colnum['isExist'] - v.colnum['mime'] + 1);
    dev.step(6.3); // isExist欄はチェックボックスに変更して幅縮小
    // チェックボックスへの変更は保留。isExist〜noteの幅を最適化
    v.mSheet.autoResizeColumns(v.colnum['isExist'], v.colnum['note'] - v.colnum['isExist'] + 1);
    dev.step(6.4); // 見出しとして1行目は固定
    v.mSheet.setFrozenRows(1);
    dev.step(6.5); // フィルタを作成、要編集行のみ表示
    // 既存フィルタがあれば削除
    if (v.mSheet.getFilter() !== null) v.mSheet.getFilter().remove();
    // フィルタを設定
    v.filter = v.mSheet.getDataRange().createFilter();
    // fill==='o'の行だけ表示
    v.filter.setColumnFilterCriteria(11, SpreadsheetApp.newFilterCriteria()
      .whenTextEqualTo('o')
      .build()
    );

    dev.step(6.6); // previousシートは非表示
    v.pSheet.hideSheet();

    
    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}
