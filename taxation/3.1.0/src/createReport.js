/** createReport : download.htmlから呼ばれ、税理士提出用のindex.htmlを生成する */
function createReport() {
  const v = { whois: 'createReport', rv: null};
  dev.start(v.whois);
  try {

    // -------------------------------------------------------------
    dev.step(1);  // 事前準備
    // -------------------------------------------------------------
    v.spread = SpreadsheetApp.getActiveSpreadsheet();

    // -------------------------------------------------------------
    dev.step(2);  // masterシートの内容出力
    // -------------------------------------------------------------
    v.master = [];
    v.data = v.spread.getSheetByName('master').getDataRange().getDisplayValues();
    for( v.r=1 ; v.r<v.data.length ; v.r++ ){
      if( !v.data[v.r][0] ) continue; // 空白行(id未設定行)は飛ばす
      // 行オブジェクトの作成
      v.row = {};
      for( v.c=0 ; v.c<v.data[0].length ; v.c++ ){
        if( v.data[v.r][v.c] !== '' ){
          v.row[v.data[0][v.c]] = v.data[v.r][v.c];
        }
      }
      // 必要な項目に絞り込んで出力
      v.o = {};
      ['id','name','type','label','date','price','payby','note'].forEach(x => {
        if( v.row[x] ) v.o[x] = v.row[x];
      });
      v.master.push(v.o);
    }

    // -------------------------------------------------------------
    dev.step(3);  // 交通費シートの内容出力
    // -------------------------------------------------------------
    v.data = v.spread.getSheetByName('交通費').getDataRange().getDisplayValues();
    for( v.r=1 ; v.r<v.data.length ; v.r++ ){
      if( !v.data[v.r][6] ) continue; // 金額未入力は飛ばす
      // 行オブジェクトの作成
      v.row = {type:'交通費'};
      for( v.c=0 ; v.c<v.data[0].length ; v.c++ ){
        if( v.data[v.r][v.c] !== '' ){
          v.row[v.data[0][v.c]] = v.data[v.r][v.c];
        }
      }
      v.master.push(v.row);
    }

    // -------------------------------------------------------------
    dev.step(4);  // index.htmlシートにmaster, notesを埋め込む
    // -------------------------------------------------------------
    v.notes = []; // 「特記事項」シートから全件読み込み、セパレータ無しで結合する
    v.data = v.spread.getSheetByName('特記事項').getDataRange().getDisplayValues();
    v.data.forEach(line => v.notes.push(line.join('')));

    v.rv = HtmlService.createTemplateFromFile("index").evaluate().getContent()
    .replace(
      'id="master">',
      `id="master">const data = ${JSON.stringify(v.master,null,2)};`
    ).replace(
      'id="notes">',
      `id="notes">${v.notes.join('')};`
    );
    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}
