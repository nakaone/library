/** saveSpread() : 指定スプレッドシートから各種属性情報を取得、Google Diverのスプレッドシートと同じフォルダにzip形式圧縮されたJSONとして保存
 * @param arg {string|boolean} - セーブ対象スプレッドシートのIDまたはfalse(強制停止)
 * @returns {Object.<string,any>} 属性名：設定値形式のオブジェクト
 * 
 * - 仕様は[workflowy](https://workflowy.com/#/415ca4c2d194)参照
 */
function saveSpread(arg=null){
  const v = {whois:'saveSpread',step:0,rv:null,propKey:'saveSpread',
    start:Date.now(),elapsLimit:300000,overLimit:false,executionLimit:100,
    getSpread: ()=>{ // フォルダ・ファイル関連、スプレッドシート関連
      v.srcFile = DriveApp.getFileById(v.spread.getId());
      v.SpreadObject = {
        // フォルダ・ファイル関連情報
        Ancestors: (()=>{ // マイドライブ〜所属するフォルダまでのツリー
          v.folderNames = [];
          v.folder = v.srcFile.getParents().next();
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

        SavedDateTime: toLocale(new Date(v.start)),  // 本メソッド実行日時
        Sheets: [], // シート情報
      };
      return v.SpreadObject;
    },
    /** scan: 属性情報が二次元の場合、一行毎に制限時間をチェックしながら文字列化
     * @param arg {Object}
     * @param arg.sheet {Sheet} - シートオブジェクト
     * @param arg.dr {Range} - getDataRangeで取得した範囲
     * @param arg.src {any[][]} - scanの呼出元で取得したソースとなる二次元配列
     * @param arg.dst {any[][]} - 処理結果。前回作成途中の二次元配列
     * @param arg.func {function} - セルに設定する値を導出する関数
     */
    scan: arg => {
      // 処理結果が未作成ならソースと同じ形の二次元配列を作成
      if( !arg.hasOwnProperty('dst') ){
        arg.dst = [];
        for( v.i=0 ; v.i<arg.src.length ; v.i++ ){
          arg.dst.push(new Array(arg.src[v.i].length));
        }
      }

      while( v.conf.next.row < arg.src.length && v.overLimit === false ){
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
      v.ratio = Math.round((v.conf.next.row/arg.src.length)*10000)/100;
      console.log(`scan: ${v.sheetName}.${v.propName} row=${v.conf.next.row}(${v.ratio}%) end.`);
      return arg.dst;
    },
    getProp: { // シートの各属性情報取得関数群
      // 1.シート単位の属性
      SheetId: arg => {return arg.sheet.getSheetId()},
      A1Notation: arg => {return arg.dr.getA1Notation()},
      ColumnWidth: arg => {
        v.a = []; v.max = arg.sheet.getLastColumn();
        for( v.i=1 ; v.i<=v.max ; v.i++ ){
          v.a.push(arg.sheet.getColumnWidth(v.i));
        }
        return v.a;
      },
      /* 実行時間が非常に長いので無効化
      RowHeight: arg => {
        v.a = v.data.Sheets.find(x => x.Name === v.sheetName).RowHeight || [];
        v.max = arg.sheet.getLastRow();
        while( v.conf.next.row < v.max && v.overLimit === false ){
          // 一行分のデータを作成
          v.a.push(arg.sheet.getRowHeight(v.conf.next.row+1));
          // カウンタを調整
          v.conf.next.row++;
          // 制限時間チェック
          if( (Date.now() - v.start) > v.elapsLimit ) v.overLimit = true;
        }
        v.ratio = Math.round((v.conf.next.row/v.max)*10000)/100;
        console.log(`scan: ${v.sheetName}.RowHeight row=${v.conf.next.row}(${v.ratio}%) end.`);
        return v.a;
      },*/
      FrozenColumns: arg => {return arg.sheet.getFrozenColumns()},  // 固定列数
      FrozenRows: arg => {return arg.sheet.getFrozenRows()},  // 固定行数

      // 2.セル単位の属性
      // 2.1.値・数式・メモ
      DisplayValues: arg => {return arg.dr.getDisplayValues()},
      Values: arg => {return arg.dr.getValues()},
      Formulas: arg => {return arg.dr.getFormulas()},
      FormulasR1C1: arg => {return arg.dr.getFormulasR1C1()},
      Notes: arg => {return arg.dr.getNotes()},
      // 2.2.セルの背景色、罫線
      Backgrounds: arg => {return arg.dr.getBackgrounds()},
      //Borders: JSON.stringify(v.dr.getBorder()),
      FontColorObjects: arg => {
        arg.src = arg.dr.getFontColorObjects();
        // 作成途中の結果があればarg.dstにセット
        if( v.data.Sheets.find(x => x.Name === v.sheetName).FontColorObjects )
          arg.dst = v.data.Sheets.find(x => x.Name === v.sheetName).FontColorObjects;
        arg.func = o => {return o.asRgbColor().asHexString()};  // セルの処理関数
        return v.scan(arg);
      },
      // 2.3.フォント、上下左右寄せ、折り返し、回転
      FontFamilies: arg => {return arg.dr.getFontFamilies()},
      FontLines: arg => {return arg.dr.getFontLines()}, // セルの線のスタイル。'underline','line-through','none'など
      FontSizes: arg => {return arg.dr.getFontSizes()},
      FontStyles: arg => {return arg.dr.getFontStyles()}, // フォントスタイル。'italic'または'normal'
      FontWeights: arg => {return arg.dr.getFontWeights()},
      HorizontalAlignments: arg => {return arg.dr.getHorizontalAlignments()},
      VerticalAlignments: arg => {return arg.dr.getVerticalAlignments()},
      WrapStrategies: arg => {  // テキストの折り返し
        arg.src = arg.dr.getWrapStrategies();
        // 作成途中の結果があればarg.dstにセット
        if( v.data.Sheets.find(x => x.Name === v.sheetName).WrapStrategies )
          arg.dst = v.data.Sheets.find(x => x.Name === v.sheetName).WrapStrategies;
        arg.func = o => {return JSON.stringify(o).replaceAll('"','')};  // セルの処理関数
        return v.scan(arg);
      },
      TextDirections: arg => {  // セルの方向
        arg.src = arg.dr.getTextDirections();
        // 作成途中の結果があればarg.dstにセット
        if( v.data.Sheets.find(x => x.Name === v.sheetName).TextDirections )
          arg.dst = v.data.Sheets.find(x => x.Name === v.sheetName).TextDirections;
        arg.func = o => {return JSON.stringify(o).replaceAll('"','')};  // セルの処理関数
        return v.scan(arg);
      },
      // 2.4.その他
      MergedRanges: arg => {  // 結合セル
        v.a = [];
        arg.dr.getMergedRanges().forEach(x => v.a.push(x.getA1Notation()));
        return v.a;
      },
      DataValidations: arg => {
        arg.src = arg.dr.getDataValidations();
        // 作成途中の結果があればarg.dstにセット
        if( v.data.Sheets.find(x => x.Name === v.sheetName).DataValidations )
          arg.dst = v.data.Sheets.find(x => x.Name === v.sheetName).DataValidations;
        arg.func = o => {return { // セルの処理関数
          AllowInvalid: o.getAllowInvalid(),
          CriteriaType: JSON.parse(JSON.stringify(o.getCriteriaType())),
          CriteriaValues: JSON.parse(JSON.stringify(o.getCriteriaValues())),
          HelpText: o.getHelpText(),
        }};
        return v.scan(arg);
      },
    },
  };
  console.log(`${v.whois} start.`);
  try {

    // --------------------------------------------------
    v.step = 1; // 進捗管理(v.conf)のセット
    // --------------------------------------------------
    v.step = 1.1; // confをPropertyから取得
    v.ScriptProperties = PropertiesService.getScriptProperties().getProperty(v.propKey);
    if( v.ScriptProperties !== null ){ // 2回目以降の実行時(タイマー起動)

      v.conf = JSON.parse(v.ScriptProperties);
      v.spread = SpreadsheetApp.openById(v.conf.SpreadId);
      v.srcFile = DriveApp.getFileById(v.conf.SpreadId);

      v.step = 3.2; // 作業用ファイルの内容をv.dataに読み込み
      v.dstFile = DriveApp.getFileById(v.conf.fileId);
      v.unzip = Utilities.unzip(v.dstFile.getBlob());
      v.data = JSON.parse(v.unzip[0].getDataAsString('UTF-8'));
      v.dstFile.setTrashed(true); // 現在のzipをゴミ箱に移動

    } else {  // 強制停止、または初回実行時

      if( arg === false ){ // 強制停止

        v.step = 1.1;
        throw new Error(`次回処理の強制停止指示があったため、処理を終了します`);

      } else {  // 初回実行時

        v.step = 2.1; // confに初期値を設定
        v.conf = {
          count:0,
          SpreadId: arg === null ? SpreadsheetApp.getActiveSpreadsheet().getId() : arg,
          sheetList: [],
          propList: [],
          next: {sheet:0,prop:0,row:0},
          complete: false,
        };
        if( !v.conf.SpreadId ){
          throw new Error(`対象スプレッドシートのIDが特定できません`);
        }

        v.step = 2.2; // 入力元のスプレッドシート・ファイル
        v.spread = SpreadsheetApp.openById(v.conf.SpreadId);
        v.srcFile = DriveApp.getFileById(v.conf.SpreadId);

        v.step = 2.3; // v.dataにスプレッドシート関連情報をセット
        v.data = v.getSpread();

        v.step = 2.4; // シート名一覧(v.conf.sheetList)の作成、v.data.Sheetsに初期値設定
        v.spread.getSheets().forEach(x => v.conf.sheetList.push(x.getSheetName()));
        v.conf.sheetList.forEach(x => v.data.Sheets.push({Name:x}));

        v.step = 2.5; // 取得する属性一覧(v.conf.propList)の作成
        v.conf.propList = Object.keys(v.getProp);

      }
    }

    // --------------------------------------------------
    v.step = 4; // シート毎の情報取得
    // --------------------------------------------------
    v.arg = {};
    while( v.conf.next.sheet < v.conf.sheetList.length && v.overLimit === false ){
      v.sheetName = v.conf.sheetList[v.conf.next.sheet];
      v.arg.sheet = v.spread.getSheetByName(v.sheetName);
      v.arg.dr = v.arg.sheet.getDataRange();
      while( v.conf.next.prop < v.conf.propList.length && v.overLimit === false ){
        v.step = 4.1; // 属性毎の情報取得
        v.propName = v.conf.propList[v.conf.next.prop];
        console.log(`${v.sheetName}.${v.propName} start. (sheet=${v.conf.next.sheet+1}/${v.conf.sheetList.length}, prop=${v.conf.next.prop+1}/${v.conf.propList.length})`);
        v.step = 4.2; // 前回結果をクリア
        ['src','dst','func'].forEach(x => delete v.arg[x]);
        v.step = 4.3; // 属性取得の実行
        v.r = v.getProp[v.conf.propList[v.conf.next.prop]](v.arg);
        if( v.r instanceof Error ) throw v.r;
        v.data.Sheets.find(x => x.Name === v.sheetName)[v.propName] = v.r;
        v.step = 4.4; // カウンタを調整
        if(!v.overLimit){
          v.conf.next.prop++;
          v.conf.next.row = 0;
        }
        v.step = 4.5; // 制限時間チェック
        if( (Date.now() - v.start) > v.elapsLimit ) v.overLimit = true;
      }
      v.step = 4.6; // カウンタを調整
      if(!v.overLimit){
        v.conf.next.sheet++;
        [v.conf.next.prop,v.conf.next.row] = [0,0]
      };
      v.step = 4.7; // 制限時間チェック
      if( (Date.now() - v.start) > v.elapsLimit ) v.overLimit = true;
    }

    // --------------------------------------------------
    v.step = 5; // v.dataの内容を作業用ファイルに書き込む
    // --------------------------------------------------
    v.step = 5.1; // 圧縮対象のファイル名に日本語が入っていると"Illegal byte sequence"になるので英文字指定
    v.blob = Utilities.newBlob(JSON.stringify(v.data),'application/json',`${v.overLimit?'uncomplete':'data'}.json`);
    v.zip = Utilities.zip([v.blob],`${v.data.Name}.${toLocale(new Date(v.start),'yyyyMMdd-hhmmss')}.zip`);
    v.dstFile = v.srcFile.getParents().next().createFile(v.zip);
    v.conf.fileId = v.dstFile.getId();

    v.step = 5.2; // ScriptPropertiesを削除
    if( v.ScriptProperties ){
      PropertiesService.getScriptProperties().deleteProperty(v.propKey);
    }
    v.conf.count += 1;  // 実行回数をインクリメント
    if( v.overLimit ){  // タイムアウト時
      v.step = 5.3;
      if( v.conf.count > v.executionLimit && v.complete === false ){ // 実行回数の制限を超えた場合
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
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${JSON.stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}