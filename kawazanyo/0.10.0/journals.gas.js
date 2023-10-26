/** 「kz標準」シート作成、出力用勘定科目マスタ作成 */
function setupKzData(){
  const v = {whois:'setupKzData',rv:{journals:[],accounts:[]},step:0,
    activeSheet: SpreadsheetApp.getActiveSpreadsheet(),
    elaps: Date.now(),
  };
  console.log(v.whois+' start.');
  try {

    v.step = 1; // kz標準シートに仕訳帳データを作成する
    v.r = yayoi01();
    if( v.r instanceof Error ) throw v.r;
    v.r = YFP01();
    if( v.r instanceof Error ) throw v.r;
    v.r = kz01();
    if( v.r instanceof Error ) throw v.r;

    v.step = 2; // 勘定科目シートに勘定科目マスタを作成
    v.r = acMaster();
    if( v.r instanceof Error ) throw v.r;

    v.step = 3; // 終了処理
    console.log(v.whois+' normal end. (elaps: %s msec)',Date.now()-v.elaps);
    return v.rv;

  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}

/** 出力用仕訳帳・勘定科目データの作成 */
function getKzData(){
  const v = {whois:'getKzData',rv:{journals:[],accounts:[]},step:0,
    activeSheet: SpreadsheetApp.getActiveSpreadsheet(),
    elaps: Date.now(),
  };
  console.log(v.whois+' start.');
  try {

    v.step = 1; // 仕訳帳の出力データを作成
    v.iData = v.activeSheet.getSheetByName('kz標準').getRange('a5:w').getValues();
    for( v.i=1 ; v.i<v.iData.length ; v.i++ ){
      v.a = arr2obj(v.iData[v.i],v.iData[0]);
      if( Object.keys(v.a).length > 0 ) v.rv.journals.push(v.a);
    }

    v.step = 2; // 勘定科目マスタのデータを作成
    v.iData = v.activeSheet.getSheetByName('勘定科目').getRange('aj5:au').getValues();
    for( v.i=1 ; v.i<v.iData.length ; v.i++ ){
      v.a = arr2obj(v.iData[v.i],v.iData[0]);
      if( Object.keys(v.a).length > 0 ) v.rv.accounts.push(v.a);
    }

    v.step = 3; // 終了処理
    console.log(v.whois+' normal end. (elaps: %s msec)',Date.now()-v.elaps);
    return v.rv;

  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}

/** 出力用仕訳帳・勘定科目データをjsonファイルとして保存
 * 
 * - 2023/10/25 13:00 出力形式をjsソースに変更、ファイル名を'kzData.js'に固定
 */
function downloadKzData(){
  const v = {whois:'downloadKzData',rv:{journals:[],accounts:[]},step:0,
    activeSheet: SpreadsheetApp.getActiveSpreadsheet(),
    elaps: Date.now(),
  };
  console.log(v.whois+' start.');
  try {

    v.step = 1; // 現在のシートが保存されているフォルダのIDを取得
    v.folderId = DriveApp.getFileById(v.activeSheet.getId())
    .getParents().next().getId();

    v.step = 2; // ファイル名の作成
    /*　2023/10/25 13:00
    v.date = new Date();
    v.fileName = v.date.getFullYear()
    + ('0'+(v.date.getMonth()+1)).slice(-2)
    + ('0'+v.date.getDate()).slice(-2)
    + '.js';
    */
    v.fileName = 'kzData.js';

    v.step = 3; // 格納するデータの取得
    v.oData = getKzData();
    if( v.oData instanceof Error ) throw v.oData;
    v.oData = 'const rawjson = ' + JSON.stringify(v.oData) + ';';

    v.step = 4; // ファイルを保存
    v.blob = Utilities.newBlob('','application/json',v.fileName);
    v.file = v.blob.setDataFromString(v.oData,'UTF-8');
    DriveApp.getFolderById(v.folderId).createFile(v.file);

    v.step = 5; // 終了処理
    console.log(v.whois+' normal end. (elaps: %s msec)',Date.now()-v.elaps);
    return v.rv;

  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}

/*
function doGet(e) {
  const json = JSON.stringify(getKzData());
  const type = ContentService.MimeType.JSON;
  return ContentService.createTextOutput(json).setMimeType(type);
}
*/

/** fy2017から「弥生中間」シートを作成
 * @param {void}
 * @returns {null|Error}
 * 
 * 1. 変更内容確認のため、追加・変更する項目は右端に追加
 * 1. 「伝票番号」「行番号」およびを採番し、欄を追加
 * 1. 税区分に基づき、「本体」「区分」「税率」「税額」「合計」を借方/貸方双方に追加<br>
 *    詳細は「仕様」シートの「弥生消費税率・額計算仕様」表を参照
 */
function yayoi01(){
  const v = {whois:'yayoi01',rv:null,step:0,dsum:0,csum:0,lno:1,
    list:['fy2017'],
    activeSheet: SpreadsheetApp.getActiveSpreadsheet(),
    z03: new Date('1989/04/01').getTime(),
    z05: new Date('1997/04/01').getTime(),
    z08: new Date('2014/04/01').getTime(),
    z10: new Date('2019/10/01').getTime(),
  };
  console.log(v.whois+' start.');
  try {

    v.step = 1.1; // 前処理
    v.jno = 1;  // 伝票番号の開始値
    v.oSheet = v.activeSheet.getSheetByName('弥生中間');
    v.oHeader = v.oSheet.getRange('a5:ak5').getValues()[0];
    v.oRange = 'a6:ak';
    v.oData = [];
    v.step = 1.2; // 出力先領域のクリア
    v.oSheet.getRange(v.oRange).clear();
    //console.log('oHeader=%s',JSON.stringify(v.oHeader));

    v.list.forEach(sheetName => {
      v.step = 2; // 入力元シートの各種情報セット
      v.iSheet = v.activeSheet.getSheetByName(sheetName);
      v.iHeader = v.iSheet.getRange('a5:y5').getValues()[0];
      v.iData = v.iSheet.getRange('a6:y').getValues();

      for( v.r=0 ; v.r<v.iData.length ; v.r++ ){
        v.step = 3.1; // 伝票番号が空欄ならスキップ
        if( v.iData[v.r][0] === '' ) continue;

        v.step = 3.2; // 一行分のデータをオブジェクト化
        v.o = arr2obj(v.iData[v.r],v.iHeader);
        v.o['取引日付'] = new Date(v.o['取引日付']);

        v.step = 3.3; // 伝票番号・行番号の再採番
        v.o['伝票番号'] = v.jno;
        v.o['行番号'] = v.lno++;
        v.dsum += Math.round(v.o['借方金額']||0);
        v.csum += Math.round(v.o['貸方金額']||0);
        if( v.dsum === v.csum ){
          v.jno++;
          v.lno = 1;
          v.dsum = v.csum = 0;
        }

        // 「本体」「税率」「税額」を借方/貸方双方に追加する
        // 詳細は「仕様」シートの「弥生消費税率・額計算仕様」参照
        v.kata = ['借方','貸方'];
        for( v.i=0 ; v.i<v.kata.length ; v.i++ ){
          v.step = 3.4; // 税区分が空白ならスキップ
          if( !v.o[v.kata[v.i]+'税区分'] ) continue;

          v.step = 3.5; // 税区分により区分・税率を作成
          v.x = v.kata[v.i];
          v.z = v.o[v.x+'税区分'];
          if( v.z === '対象外' || v.z.slice(0,2) === '非課' ){
            v.step = 3.51; // 非課税取引
            v.o[v.x+'区分'] = '非課税';
            v.o[v.x+'税率'] = 0;
          } else {
            v.step = 3.52; // 課税取引
            v.o[v.x+'区分'] = '課税';
            v.m = v.z.match(/課.+([0-9]+)[%|％]/);
            if( v.m ){
              v.step = 3.53; // 税率付き税区分表記
              v.o[v.x+'税率'] = Number(v.m[1])/100;
            } else {
              v.step = 3.54; // 税区分に税率無しなので取引日から判断
              v.t = new Date(v.o['取引日付']).getTime();
              if( v.t < v.z03 ) v.o[v.x+'税率'] = 0;
              else if( v.t < v.z05 ) v.o[v.x+'税率'] = 0.03;
              else if( v.t < v.z08 ) v.o[v.x+'税率'] = 0.05;
              else if( v.t < v.z10 ) v.o[v.x+'税率'] = 0.08;
              else v.o[v.x+'税率'] = 0.10;
            }
          }
          v.step = 3.6; // 税額・本体・合計を作成
          v.o[v.x+'合計'] = Number(v.o[v.x+'金額']||0);
          v.o[v.x+'税額'] = Math.floor(v.o[v.x+'合計'] * v.o[v.x+'税率']);
          v.o[v.x+'本体'] = v.o[v.x+'合計'] - v.o[v.x+'税額'];
        }

        v.step = 3.9; // オブジェクトを配列に変換
        v.oData.push(obj2arr(v.o,v.oHeader));
      }
    });

    v.step = 4; // 変換結果の書き込み
    v.oSheet.getRange(v.oRange+(v.oData.length+5)).setValues(v.oData);

    console.log(v.whois+' normal end.');
    return v.rv;

  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}

/** fy2018以降のシートから「YFP中間」シートを作成
 * @param {void}
 * @returns {null|Error}
 * 
 * 1. 年度別に微妙に異なる項目の並びを「YFP中間」に事前設定した並びに統一
 * 1. 弥生中間と併せ、伝票番号を通年で一意になるよう「新伝票番号」「新行番号」を追加
 * 1. 不適切な計上日「yyyy/13」を年度末の日付(9/30)に変換、追加する「備考欄」にその旨記載
 * 1. 税区分に基づき、「本体」「区分」「税率」「税額」「合計」を借方/貸方双方に追加<br>
 *    詳細は「仕様」シートの「YFP消費税率・額計算仕様」表を参照
 */
function YFP01(){
  const v = {whois:'YFP01',rv:null,step:0,dsum:0,csum:0,lno:1,
    list:['fy2018','fy2019','fy2020','fy2021'],
    activeSheet: SpreadsheetApp.getActiveSpreadsheet(),
    z03: new Date('1989/04/01').getTime(),
    z05: new Date('1997/04/01').getTime(),
    z08: new Date('2014/04/01').getTime(),
    z10: new Date('2019/10/01').getTime(),
  };
  console.log(v.whois+' start.');
  try {

    v.step = 1.1; // 前処理
    // 伝票番号の開始値
    v.jno = v.activeSheet.getSheetByName('弥生中間').getRange('z3').getValue();
    v.yfpjno = 0; // 一行前の旧「伝票番号」の値
    v.oSheet = v.activeSheet.getSheetByName('YFP中間');
    v.oHeader = v.oSheet.getRange('a5:ao5').getValues()[0];
    v.oRange = 'a6:ao';
    v.oData = [];
    v.step = 1.2; // 出力先領域のクリア
    v.oSheet.getRange(v.oRange).clear();
    //console.log('oHeader=%s',JSON.stringify(v.oHeader));

    v.list.forEach(sheetName => {
      v.step = 2; // 入力元シートの各種情報セット
      v.iSheet = v.activeSheet.getSheetByName(sheetName);
      v.iHeader = v.iSheet.getRange('a5:ac5').getValues()[0];
      v.iData = v.iSheet.getRange('a6:ac').getValues();

      for( v.r=0 ; v.r<v.iData.length ; v.r++ ){
        v.step = 3.1; // 伝票番号が空欄ならスキップ
        if( v.iData[v.r][0] === '' ) continue;

        v.step = 3.2; // 一行分のデータをオブジェクト化
        v.o = arr2obj(v.iData[v.r],v.iHeader);

        v.step = 3.3; // 伝票番号の再採番
        if( v.o['伝票番号'] === v.yfpjno ){
          // 前明細と伝票番号が一致
          v.o['新伝票番号'] = v.jno;
        } else {
          // 前明細と伝票番号が不一致
          v.jno++;
          v.o['新伝票番号'] = v.jno;
          v.yfpjno = v.o['伝票番号'];
        }

        // 「本体」「税率」「税額」を借方/貸方双方に追加する
        // 詳細は「仕様」シートの「弥生消費税率・額計算仕様」参照
        v.kata = ['借方','貸方'];
        for( v.i=0 ; v.i<v.kata.length ; v.i++ ){
          v.step = 3.4; // 科目コード=0ならスキップ
          if( v.o[v.kata[v.i]+'科目コード'] === 0 ) continue;

          v.step = 3.5; // 税区分により区分・税率を作成
          v.x = v.kata[v.i];
          v.z = v.o[v.x+'課税区分コード'];
          if( v.z === 0 ){
            v.step = 3.51; // 非課税取引
            v.o[v.x+'区分'] = '非課税';
            v.o[v.x+'税率'] = 0;
          } else {
            v.step = 3.52; // 課税取引
            v.o[v.x+'区分'] = '課税';
            v.t = new Date(v.o['取引日付']).getTime();
            if( v.t < v.z03 ) v.o[v.x+'税率'] = 0;
            else if( v.t < v.z05 ) v.o[v.x+'税率'] = 0.03;
            else if( v.t < v.z08 ) v.o[v.x+'税率'] = 0.05;
            else if( v.t < v.z10 ) v.o[v.x+'税率'] = 0.08;
            else v.o[v.x+'税率'] = 0.10;
          }
          v.step = 3.6; // 税額・本体・合計を作成
          v.o[v.x+'合計'] = Number(v.o[v.x+'金額']||0);
          v.o[v.x+'税額'] = Math.floor(v.o[v.x+'合計'] * v.o[v.x+'税率']);
          v.o[v.x+'本体'] = v.o[v.x+'合計'] - v.o[v.x+'税額'];
        }

        v.step = 3.7; // 不適切な日付を年度末にする
        v.d = new Date(v.o['伝票日付']);
        if( isNaN(v.d) ){
          v.o['備考'] = '決算用('+v.o['伝票日付']+')';
          v.o['伝票日付'] = new Date(v.o['伝票日付'].slice(0,4)+'/9/30');
        } else {
          v.o['伝票日付'] = v.d;
        }

        v.step = 3.8; // オブジェクトを配列に変換
        v.oData.push(obj2arr(v.o,v.oHeader));
      }
    });

    v.step = 4; // 変換結果の書き込み
    v.oSheet.getRange(v.oRange+(v.oData.length+5)).setValues(v.oData);

    console.log(v.whois+' normal end.');
    return v.rv;

  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}

/** 「弥生中間」「YFP中間」から「kz標準」シートを作成
 * @param {void}
 * @returns {null|Error}
 * 
 * 1. yayoi01(), YFP01()を実行後、本関数を実行
 */
function kz01(){
  const v = {whois:'kz01',rv:null,step:0,dsum:0,csum:0,lno:1,map:{},
    list:['弥生中間','YFP中間'],
    activeSheet: SpreadsheetApp.getActiveSpreadsheet(),
  };
  console.log(v.whois+' start.');
  try {

    v.step = 1.1; // 前処理
    v.oSheet = v.activeSheet.getSheetByName('kz標準');
    v.oHeader = v.oSheet.getRange('a5:w5').getValues()[0];
    // kz標準への項目並べ替え用データ
    v.tHeader = v.oSheet.getRange('a2:w3').getValues();
    v.oRange = 'a6:w';
    v.oData = [];

    v.step = 1.2; // 勘定科目の表記揺れ等、科目名変換マップの準備
    v.activeSheet.getSheetByName('勘定科目').getRange('a6:b')
    .getValues().forEach(l => {
      if( l[0] ){
        v.map[l[0]] = l[1];
      }
    });

    v.step = 1.3; // 出力先領域のクリア
    v.oSheet.getRange(v.oRange).clear();
    //console.log('oHeader=%s',JSON.stringify(v.oHeader));

    for( v.i=0 ; v.i<v.list.length ; v.i++ ){
      v.step = 2; // 入力元シートの各種情報セット
      v.iSheet = v.activeSheet.getSheetByName(v.list[v.i]);
      v.iHeader = v.iSheet.getRange('a5:ao5').getValues()[0];
      v.iData = v.iSheet.getRange('a6:ao').getValues();

      for( v.r=0 ; v.r<v.iData.length ; v.r++ ){
        v.step = 3.1; // 伝票番号が空欄ならスキップ
        if( v.iData[v.r][0] === '' ) continue;

        v.step = 3.2; // 一行分のデータをオブジェクト化
        v.o = arr2obj(v.iData[v.r],v.iHeader);

        v.step = 3.3; // 必要な項目をコピー
        v.p = {};
        for( v.c=0 ; v.c<v.oHeader.length ; v.c++ ){
          v.p[v.oHeader[v.c]] = v.o[v.tHeader[v.i][v.c]]
        }

        v.step = 3.4; // 会計年度を計算
        v.p['会計年度'] = v.p['取引日'].getFullYear()
          - ( v.p['取引日'].getMonth() < 9 ? 1 : 0);

        v.step = 3.5; // 勘定科目を読替
        v.p['借方科目'] = v.map[v.p['借方科目']];
        v.p['貸方科目'] = v.map[v.p['貸方科目']];

        v.step = 3.6; // オブジェクトを配列に変換
        v.oData.push(obj2arr(v.p,v.oHeader));
      }
    }

    v.step = 4; // 変換結果の書き込み
    v.oSheet.getRange(v.oRange+(v.oData.length+5)).setValues(v.oData);

    console.log(v.whois+' normal end.');
    return v.rv;

  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}

/** シート上の一行(配列)をオブジェクト化する */
function arr2obj(arr,header){
  const rv = {};
  for( let i=0 ; i<header.length ; i++ ){
    // 10/23時点： if( header[i].length > 0 ){
    if( header[i].length > 0 && arr[i] ){
      rv[header[i]] = arr[i];
    }
  }
  return rv;
}

/** オブジェクトをシート上の一行に配列化する */
function obj2arr(obj,header){
  const rv = [];
  for( let i=0 ; i<header.length ; i++ ){
    if( obj.hasOwnProperty(header[i]) ){
      rv.push(obj[header[i]]);
    } else {
      rv.push('');  // 空欄にする
    }
  }
  return rv;
}

/** 出力用勘定科目マスタを作成する
 * @param {void}
 * @returns {null|Error}
 */
function acMaster(){
  const v = {whois:'acMaster',rv:null,step:0,mst:{},
    Sheet: SpreadsheetApp.getActiveSpreadsheet().getSheetByName('勘定科目'),
    // 基となる定義の列範囲
    BSFm:'h',BSTo:'q',PLFm:'s',PLTo:'z',
    CFFm:'ab',CFTo:'ah',oFm:'aj',oTo:'au',
    list:['BS','PL','CF'],
  };
  console.log(v.whois+' start.');
  try {

    v.step = 1.1; // 前処理
    v.oHeader = v.Sheet.getRange(v.oFm+'5:'+v.oTo+'5').getValues()[0];
    v.oRange = v.oFm+'6:'+v.oTo;
    v.oData = [];
    v.step = 1.2; // 出力先領域のクリア
    v.Sheet.getRange(v.oRange).clear();
    //console.log('oHeader=%s',JSON.stringify(v.oHeader));

    v.list.forEach(x => {
      v.step = 2; // 入力元シートの各種情報セット
      v.c = x.slice(0,1);
      v.iHeader = v.Sheet.getRange(v[x+'Fm']+'5:'+v[x+'To']+'5').getValues()[0];
      v.iData = v.Sheet.getRange(v[x+'Fm']+'6:'+v[x+'To']).getValues();

      for( v.r=0 ; v.r<v.iData.length ; v.r++ ){

        v.step = 3.1; // 一行分のデータをオブジェクト化
        v.o = arr2obj(v.iData[v.r],v.iHeader);
        if( Object.keys(v.o).length === 0 ) continue;

        if( v.o.hasOwnProperty('SQ') ){
          v.step = 3.2; // 勘定科目
          if( !v.mst.hasOwnProperty(v.o['勘定科目']))
            v.mst[v.o['勘定科目']] = {'名称':v.o['勘定科目'],'本籍':v.o['本籍']};
          v.mst[v.o['勘定科目']][v.c+1] = v.o.L1;
          v.mst[v.o['勘定科目']][v.c+2] = v.o.L2;
          if( v.o.L3 ) v.mst[v.o['勘定科目']][v.c+3] = v.o.L3;
          v.mst[v.o['勘定科目']][v.c+'S'] = v.o.SQ;
          //console.log('v.mst=%s',JSON.stringify(v.mst[v.o['勘定科目']]))
        } else if( v.o.L1 ){
          v.step = 3.3; // 分類
          v.o['名称'] = (v.o['大'] || '') + (v.o['中'] || '') + (v.o['小'] || '');
          v.o[v.c+1] = v.o.L1;
          if( v.o.L2 ) v.o[v.c+2] = v.o.L2;
          if( v.o.L3 ) v.o[v.c+3] = v.o.L3;
          //console.log('v.o=%s',JSON.stringify(v.o));
          v.oData.push(obj2arr(v.o,v.oHeader));
        }
      }
    });

    v.step = 4; // 勘定科目の出力
    Object.keys(v.mst).forEach(x => {
      //console.log('x=%s, mst=%s',x,JSON.stringify(v.mst[x]))
      v.oData.push(obj2arr(v.mst[x],v.oHeader));
    });
    //console.log('v.mst=%s\nv.oData=%s',JSON.stringify(v.mst),JSON.stringify(v.oData));

    v.step = 5; // 変換結果の書き込み
    v.Sheet.getRange(v.oRange+(v.oData.length+5)).setValues(v.oData);

    console.log(v.whois+' normal end.');
    return v.rv;

  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}