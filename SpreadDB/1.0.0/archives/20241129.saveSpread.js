function funcTest(){
  const v = {rv:null,propKey:'saveSpread',SpreadId:'1YxHCS_UAQoQ3ElsJFs817vxLZ4xA_GLLGndEEm0hZWY'};
  v.rv = saveSpread(v.SpreadId);
  console.log(`funcTest: v.rv(${whichType(v.rv)})=${typeof v.rv === 'object' ? JSON.stringify(v.rv) : v.rv}`);
}

function saveSpread(SpreadId=null){
  const v = {whois:'saveSpread',step:0,rv:null,propKey:'saveSpread',
    start:Date.now(),elapsLimit:300000,overLimit:false,executionLimit:10,
    getSpread: ()=>{ // フォルダ・ファイル関連、スプレッドシート関連
      v.srcFile = DriveApp.getFileById(v.spread.getId());
      v.SpreadObject = {
        // フォルダ・ファイル関連情報
        Ancestors: (()=>{ // マイドライブ〜所属するフォルダまでのツリー
          v.folderNames = [];
          while (v.folder) {
            v.folderNames.unshift(v.folder.getName());
            v.parents = v.folder.getParents();
            v.folder = v.parents.hasNext() ? v.parents.next() : null;
          }
          return v.folderNames;
        })(),
        Description: v.srcFile.getDescription(), // ファイルの説明文
        DateCreated: toLocale(v.srcFile.getDateCreated()), // ファイル作成日時
        LastUpdated: toLocale(v.srcFile.getLastUpdated()),
        Size: v.srcFile.getSize(),

        // スプレッドシート関連情報
        Id: v.spread.getId(),
        Name: v.spread.getName(),
        NamedRange: (()=>{  // 名前付き範囲
          v.a = []; v.spread.getNamedRanges().forEach(o => {
            v.r = o.getRange();
            v.a.push({
              Name: o.getName(),
              sheetName: v.r.getSheet().getName(),
              Range: v.r.getA1Notation(),
            });
          }); return v.a;
        })(),
        Owner: v.spread.getOwner().getEmail(),
        SpreadsheetLocale: v.spread.getSpreadsheetLocale(), // 言語/地域
        SpreadsheetTimeZone: v.spread.getSpreadsheetTimeZone(), // スプレッドシートのタイムゾーン
        Url: v.spread.getUrl(),
        Viewers: (()=>{  // 閲覧者とコメント投稿者のリスト
          v.a = [];
          v.spread.getViewers().forEach(x => v.a.push(x.getEmail()));
          return v.a;
        })(),

        SavedDateTime: toLocale(new Date()),  // 本メソッド実行日時
        Sheets: [], // シート情報
      };
      return v.SpreadObject;
    },
    /** scan
     * @param arg {Object}
     * @param arg.sheet {Sheet} - シートオブジェクト
     * @param arg.dr {Range} - getDataRangeで取得した範囲
     * @param arg.src {any[][]} - scanの呼出元で取得したソースとなる二次元配列
     * @param arg.dst {any[][]} - 処理結果。前回作成途中の二次元配列
     * @param arg.func {function} - セルに設定する値を導出する関数
     */
    scan: arg => {
      console.log(`scan: arg=${JSON.stringify(arg,null,2)}\narg.sheet=${arg.sheet}\narg.dr=${arg.dr}\narg.src=${arg.src}\narg.dst=${arg.dst}\nfunc=${arg.func.toString()}`);
      // 処理結果が未作成ならソースと同じ形の二次元配列を作成
      if( !arg.hasOwnProperty('dst') ){
        arg.dst = [];
        for( v.i=0 ; v.i<arg.src.length ; v.i++ ){
          arg.dst.push(new Array(arg.src[v.i].length));
        }
      }

      while( v.conf.next.row < arg.src.length && v.overLimit === false ){
        console.log(`scan: ${v.sheetName}.${v.propName} row=${v.conf.next.row} start.`);
        if( arg.src[v.i] ){
          // 一行分のデータを作成
          for( v.j=0 ; v.j<arg.src[v.i].length ; v.j++ ){
            if( arg.src[v.i][v.j] ){
              arg.dst[v.i][v.j] = arg.func(arg.src[v.i][v.j]);
            }
          }
        }
        // カウンタを調整
        v.conf.next.row++;
        // 制限時間チェック
        if( (Date.now() - v.start) > v.elapsLimit ) v.overLimit = true;
      }
      return arg.dst;
    },
    getProp: { // シートの各属性情報取得関数群
      SheetId: arg => {return arg.sheet.getSheetId()},
      ColumnWidth: arg => {
        v.a = []; v.max = arg.sheet.getLastColumn();
        for( v.i=1 ; v.i<=v.max ; v.i++ ){
          v.a.push(arg.sheet.getColumnWidth(v.i));
        }
        return v.a;
      },
      A1Notation: arg => {return arg.dr.getA1Notation()},
      DisplayValues: arg => {return arg.dr.getDisplayValues()},
      Values: arg => {return arg.dr.getValues()},
      Formulas: arg => {return arg.dr.getFormulas()},
      FormulasR1C1: arg => {return arg.dr.getFormulasR1C1()},
      Notes: arg => {return arg.dr.getNotes()},
      /* タイムオーバーが多く、実装ペンディング
      RowHeight: arg => {
        v.a = []; v.max = arg.sheet.getLastRow();
        for( v.i=1 ; v.i<=v.max ; v.i++ ){
          v.a.push(arg.sheet.getRowHeight(v.i));
        }
        return v.a;
      },
      DataValidations: arg => {
        console.log(`DataValidations:arg.sheet=${arg.sheet},arg.dr=${arg.dr}`);
        arg.src = arg.dr.getDataValidations();
        console.log('l.109',arg.src);
        // 作成途中の結果があればarg.dstにセット
        if( v.data.Sheets.find(x => x.Name === v.sheetName).DataValidations )
          arg.dst = v.data.Sheets.find(x => x.Name === v.sheetName).DataValidations;
        console.log('l.113',arg.dst)
        arg.func = o => {return { // セルの処理関数
          AllowInvalid: o.getAllowInvalid(),
          CriteriaType: JSON.parse(JSON.stringify(o.getCriteriaType())),
          CriteriaValues: JSON.parse(JSON.stringify(o.getCriteriaValues())),
          HelpText: o.getHelpText(),
        }};
        console.log('l.120',arg.func.toString())

        return v.scan(arg);
      },
      */
      /*
        v.getSheet = (sheet) => {
          v.dr = sheet.getDataRange();
          v.SheetObject = {
            FrozenColumns: sheet.getFrozenColumns(),  // 固定列数
            FrozenRows: sheet.getFrozenRows(),  // 固定行数
    
    
            Backgrounds: v.dr.getBackgrounds(),
            //Borders: JSON.stringify(v.dr.getBorder()),
            FontColorObjects: (()=>{
              v.fc = v.dr.getFontColorObjects();
              for( v.i=0 ; v.i<v.fc.length ; v.i++ ){
                for( v.j=0 ; v.j<v.fc[v.i].length ; v.j++ ){
                  v.fc[v.i][v.j] = v.fc[v.i][v.j].asRgbColor().asHexString();
                }
              }
              return v.fc;
            })(),
            FontFamilies: v.dr.getFontFamilies(),
            FontLines: v.dr.getFontLines(), // セルの線のスタイル。'underline','line-through','none'など
            FontSizes: v.dr.getFontSizes(),
            FontStyles: v.dr.getFontStyles(), // フォントスタイル。'italic'または'normal'
            FontWeights: v.dr.getFontWeights(),
            HorizontalAlignments: v.dr.getHorizontalAlignments(),
            MergedRanges: (()=>{  // 結合セル
              v.r = [];
              v.dr.getMergedRanges().forEach(x => v.r.push(x.getA1Notation()));
              return v.r;
            })(),
            TextDirections: (()=>{  // セルの方向
              v.td = v.dr.getTextDirections();
              for( v.i=0 ; v.i<v.td.length ; v.i++ ){
                for( v.j=0 ; v.j<v.td[v.i].length ; v.j++ ){
                  if( v.td[v.i][v.j] ) v.td[v.i][v.j] = JSON.stringify(v.td[v.i][v.j]);
                }
              }
              return v.td;
            })(),
            TextRotations: (()=>{ // テキストの回転
              v.tr = v.dr.getTextRotations();
              for( v.i=0 ; v.i<v.tr.length ; v.i++ ){
                for( v.j=0 ; v.j<v.tr[v.i].length ; v.j++ ){
                  if( v.tr[v.i][v.j] ){
                    v.tr[v.i][v.j] = {
                      Degrees: v.tr[v.i][v.j].getDegrees(), // 標準のテキストの向きと現在のテキストの向きとの間の角度
                      Vertical: v.tr[v.i][v.j].isVertical(),  // テキストが縦方向に積み重ねられている場合は true
                    };
                  }
                }
              }
              return v.tr;
            })(),
            VerticalAlignments: v.dr.getVerticalAlignments(),
            WrapStrategies: (()=>{  // テキストの折り返し
              v.ws = v.dr.getWrapStrategies();
              for( v.i=0 ; v.i<v.ws.length ; v.i++ ){
                for( v.j=0 ; v.j<v.ws[v.i].length ; v.j++ ){
                  if( v.ws[v.i][v.j] ){
                    v.ws[v.i][v.j] = JSON.stringify(v.ws[v.i][v.j]).replaceAll('"','');
                  }
                }
              }
              return v.ws;
            })(),
          };
          return v.SheetObject;
        };
    */
    },
  };
  console.log(`${v.whois} start.`);
  try {

    v.step = 1; // 進捗管理(v.conf)のセット
    v.ScriptProperties = PropertiesService.getScriptProperties().getProperty(v.propKey);
    if( v.ScriptProperties !== null ){  // 2回目以降(タイマー起動)

      v.step = 1.1; // confをPropertyから取得
      v.conf = JSON.parse(v.ScriptProperties);
      v.spread = SpreadsheetApp.openById(v.conf.SpreadId);

      v.step = 1.2; // 作業用ファイルの内容をv.dataに読み込み
      v.dstFile = DriveApp.getFileById(v.conf.fileId);
      v.unzip = Utilities.unzip(v.dstFile.getBlob());
      v.data = JSON.parse(v.unzip[0].getDataAsString('UTF-8'));
      //v.data = JSON.parse(v.dstFile.getBlob().getDataAsString('UTF-8'));

    } else { v.step = 2; // 初回実行時

      v.step = 2.1; // confに初期値を設定
      v.conf = {
        count:0,
        SpreadId: SpreadId === null ? SpreadsheetApp.getActiveSpreadsheet().getId() : SpreadId,
        sheetList: [],
        propList: [],
        next: {sheet:0,prop:0,row:0},
        complete: false,
      };

      v.step = 2.2; // 入力元のスプレッドシート・ファイル
      v.spread = SpreadsheetApp.openById(v.conf.SpreadId);
      v.srcFile = DriveApp.getFileById(v.conf.SpreadId);

      v.step = 2.3; // v.dataにスプレッドシート関連情報をセット
      v.data = v.getSpread();

      v.step = 2.4; // 作業用ファイル未作成の場合、新規作成
      v.dstFile = DriveApp.createFile(Utilities.newBlob('{}','application/json',v.data.Name+'.json'));
      v.dstFile.moveTo(v.srcFile.getParents().next());  // スプレッドシートと同じフォルダに移動
      v.conf.fileId = v.dstFile.getId(); // confに登録

      v.step = 2.5; // シート名一覧(v.conf.sheetList)の作成、v.data.Sheetsに初期値設定
      v.spread.getSheets().forEach(x => v.conf.sheetList.push(x.getSheetName()));
      v.conf.sheetList.forEach(x => v.data.Sheets.push({Name:x}));

      v.step = 2.5; // 取得する属性一覧(v.conf.propList)の作成
      v.conf.propList = Object.keys(v.getProp);
    }

    v.arg = {};
    while( v.conf.next.sheet < v.conf.sheetList.length && v.overLimit === false ){
      v.step = 3; // シート毎の情報取得
      v.sheetName = v.conf.sheetList[v.conf.next.sheet];
      v.arg.sheet = v.spread.getSheetByName(v.sheetName);
      v.arg.dr = v.arg.sheet.getDataRange();
      while( v.conf.next.prop < v.conf.propList.length && v.overLimit === false ){
        v.step = 4; // 属性毎の情報取得
        v.propName = v.conf.propList[v.conf.next.prop];
        console.log(`step.${v.step}: ${v.sheetName}.${v.propName} start.`);
        v.step = 4.1; // 前回結果をクリア
        ['src','dst','func'].forEach(x => delete v.arg[x]);
        v.step = 4.2; // 属性取得の実行
        v.r = v.getProp[v.conf.propList[v.conf.next.prop]](v.arg);
        if( v.r instanceof Error ) throw v.r;
        v.data.Sheets.find(x => x.Name === v.sheetName)[v.propName] = v.r;
        v.step = 4.3; // カウンタを調整
        v.conf.next.prop++; v.conf.next.row = 0;
        v.step = 4.4; // 制限時間チェック
        if( (Date.now() - v.start) > v.elapsLimit ) v.overLimit = true;
      }
      v.step = 3.1; // カウンタを調整
      v.conf.next.sheet++; [v.conf.next.prop,v.conf.next.row] = [0,0];
      v.step = 3.2; // 制限時間チェック
      if( (Date.now() - v.start) > v.elapsLimit ) v.overLimit = true;
    }

    v.step = 9.1; // v.dataの内容を作業用ファイルに書き込む
    //v.dstFile.setContent(JSON.stringify(v.data,null,2));
    v.dstFile.setTrashed(true); // 現在のzipをゴミ箱に移動
    v.blob = Utilities.newBlob(JSON.stringify(v.data),'application/json',v.data.Name+'.json');
    v.zip = Utilities.zip([v.blob],v.data.Name+'.zip');
    v.dstFile = v.srcFile.getParents().next().createFile(v.zip);
    v.conf.fileId = v.dstFile.getId();

    v.step = 9.2; // ScriptPropertiesを削除
    if( v.ScriptProperties !== null ){
      PropertiesService.getScriptProperties().deleteProperty(v.propKey);
    }
    v.conf.count += 1;  // 実行回数をインクリメント
    if( v.overLimit ){  // タイムアウト時
      if( v.conf.count > v.executionLimit ){ // 実行回数の制限を超えた場合
        throw new Error(`最大実行回数(${v.executionLimit}回)を超えたので、処理を中断しました`);
      } else {
        // ScriptPropertiesを更新
        PropertiesService.getScriptProperties().setProperty(v.propKey, JSON.stringify(v.conf));
        // 1分後に自分自身を起動するよう、タイマーをセット
        ScriptApp.newTrigger(v.whois).timeBased().after(1000 * 60).create();
      }
    }

    v.step = 9; // 終了処理
    v.rv = v.conf;
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}