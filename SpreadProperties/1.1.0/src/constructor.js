/** @constructor
 * @param {Object} arg 
 * @param {number} arg.elapsLimit=300000 - 一処理当たりの制限時間(5分)
 * @param {number} arg.executionLimit=100 - 処理を分割した場合の最大処理数
 * @returns {SpreadProperties}
 */
constructor(arg){
  const v = {whois:this.constructor.name+'.constructor',step:0,rv:null};
  console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
  try {

    v.step = 1.1; // 引数に既定値設定
    if( typeof arg === 'string' ) arg = {SpreadId:arg};
    v.arg = Object.assign({
      SpreadId: SpreadsheetApp.getActiveSpreadsheet().getId(),  // {string} 本ソースをコンテナバインドしているスプレッドシートのIDを既定値とする
      propKey: 'SpreadProperties', // {string} ScriptPropertyのキー名
      elapsLimit: 300000, // {number}=300000 一処理当たりの制限時間(5分)
      executionLimit: 100, // {number}=100 処理を分割した場合の最大処理数
    },arg);
    Object.keys(v.arg).forEach(x => this[x] = v.arg[x]);

    v.step = 1.2; // メンバの既定値設定
    this.conf = { // {Object} 進捗状況。処理未完の場合、PropertyServiceに保存
      start: Date.now(),  // {number} saveSpread開始日時(UNIX時刻)
      complete: false, // {boolean} 完了したらtrue
      count: 0, // {number} 実行回数。処理時間が5分を超え、分割実行の都度インクリメント
      SpreadId: this.SpreadId, // {string} セーブ対象のスプレッドシートのID
      sheetList: [], // {string[]} セーブ対象スプレッドシートのシート名一覧
      propList: [], // {string[]} 出力するシート属性名の一覧。ex.Values ,Notes 
      next:{sheet:0,prop:0,row:0}, // {Object} 次に処理対象となるsheetList,propList,行の添字(0オリジン)
      fileId: null // {string} 出力先ファイル(zip)のファイルID          
    }
    this.spread = null; // {Spreadsheet} 対象のスプレッドシートオブジェクト
    this.srcFile = null; // {File} 対象スプレッドシートのファイルオブジェクト。spreadProperties()で設定
    this.folder = null; // {Folder} 対象スプレッドシートが存在するフォルダオブジェクト。spreadProperties()で設定
    this.sheet = null; // {Sheet} 現在処理中のシートオブジェクト
    this.sheetName = null; // {string} 現在処理中のシート名
    this.range = null; // {Range} sheetの内、データが存在する範囲(getDataRange())
    this.propName = null; // {string} 現在処理中の属性名
    this.dstFile = null; // {File} 分析結果を保存するJSON(zip)のファイルオブジェクト。saveSpread()で設定
    this.data = {}; // {Object} 分析結果のオブジェクト。{getSpreadの結果＋getPropの結果}
    this.overLimit = false; // {boolean} 処理時間(elapsLimit)を超えたらtrue

    /* sheetProperties {Object.<string,function>} : シートの各属性情報取得関数群
      * 各関数の引数: arg {Object}
      * - [src] {Object[][]} this.scan()に渡す二次元の属性情報。
      *   ex. arg.src = this.range.getFontColorObjects()
      * - [dst] {Object[][]} this.scan()に渡す前回処理結果
      *   前回途中で処理が中断した場合、続きを追加できるようにscanに渡す
      * - [func] {function} this.scan()に渡す個別セルの属性情報取得関数
      */
    v.step = 1.3;
    this.sheetProperties = { // シートの各属性情報取得関数群
      // 1.シート単位の属性
      Name: {get:arg=>{return this.sheet.getName()}},
      SheetId: {get:arg=>{return this.sheet.getSheetId()}},
      A1Notation: {get:arg=>{return this.range.getA1Notation()}},
      ColumnWidth: {
        get:arg=>{
          v.max = this.sheet.getLastColumn();
          v.a = new Array(v.max);
          for( v.i=0 ; v.i<v.max ; v.i++ ){
            v.w = this.sheet.getColumnWidth(v.i+1);
            v.a[v.i] = v.w !== this.sheetProperties.ColumnWidth.default ? v.w : '';
          }
          return v.a;
        },
        default:100,
      },
      /* 実行時間が非常に長いので無効化
      RowHeight: arg=>{
        v.a = this.data.Sheets.find(x => x.Name === this.sheetName).RowHeight || [];
        v.max = this.sheet.getLastRow();
        while( this.conf.next.row < v.max && this.overLimit === false ){
          // 一行分のデータを作成
          v.a.push(this.sheet.getRowHeight(this.conf.next.row+1));
          // カウンタを調整
          this.conf.next.row++;
          // 制限時間チェック
          if( (Date.now() - this.conf.start) > this.elapsLimit ) this.overLimit = true;
        }
        v.ratio = Math.round((this.conf.next.row/v.max)*10000)/100;
        console.log(`scan: ${this.sheetName}.RowHeight row=${this.conf.next.row}(${v.ratio}%) end.`);
        return v.a;
      },*/
      FrozenColumns: {get:arg=>{return this.sheet.getFrozenColumns()}},  // 固定列数
      FrozenRows: {get:arg=>{return this.sheet.getFrozenRows()}},  // 固定行数

      // 2.セル単位の属性
      // 2.1.値・数式・メモ
      DisplayValues: {
        get:arg=>{return this.range.getDisplayValues()},
        default:'',
        css:arg=>{return {text:arg.replaceAll(/\n/g,'<br>')}},
      },
      Values: {get:arg=>{return this.range.getValues()},default:''},
      FormulasR1C1: {
        get:arg=>{return this.range.getFormulasR1C1()},
        default:'',
        css: arg=>{return {attr:{title:[arg]}}},
      },
      Formulas: {
        get:arg=>{return this.range.getFormulas()},
        default:'',
        css: arg=>{return {attr:{title:[arg]}}},
      },
      Notes: {
        get:arg=>{return this.range.getNotes()},
        default:'',
        css: arg=>{return {attr:{title:[arg]}}},
      },
      // 2.2.セルの背景色、罫線
      Backgrounds: {
        get:arg=>{
          v.a = this.range.getBackgrounds();
          if( !arg.dst.hasOwnProperty('Backgrounds') )
            arg.dst.Backgrounds = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
          arg = Object.assign(arg,{
            src: v.a,
            dst: arg.dst.Backgrounds,
            func: o => {return o},
            default: this.sheetProperties.Backgrounds.default,
          });
          return this.scan(arg);
        },
        default:'#ffffff',
        css:arg=>{return {style:{background:arg}}},
      },
      //Borders: JSON.stringify(v.dr.getBorder()),
      FontColorObjects: {
        get:arg=>{
          // asHexString()の戻り値は#aarrggbbなので注意
          // https://developers.google.com/apps-script/reference/base/rgb-color.html?hl=ja#asHexString()
          v.a = this.range.getFontColorObjects();
          if( !arg.dst.hasOwnProperty('FontColorObjects') )
            arg.dst.FontColorObjects = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
          arg = Object.assign(arg,{
            src: v.a,
            dst: arg.dst.FontColorObjects,
            func: o => {return o.asRgbColor().asHexString()},
            default: this.sheetProperties.FontColorObjects.default,
          });
          return this.scan(arg);
        },
        default:'#ff000000',
        css:arg=>{return {style:{'color':arg}}},
      },
      // 2.3.フォント、上下左右寄せ、折り返し、回転
      FontFamilies: {
        get:arg=>{
          v.a = this.range.getFontFamilies();
          if( !arg.dst.hasOwnProperty('FontFamilies') )
            arg.dst.FontFamilies = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
          arg = Object.assign(arg,{
            src: v.a,
            dst: arg.dst.FontFamilies,
            func: o => {return o},
            default: this.sheetProperties.FontFamilies.default,
          });
          return this.scan(arg);
        },
        default:'arial,sans,sans-serif',
        css: arg=>{return {style:{'font-family':arg}}},
      },
      FontLines: { // セルの線のスタイル。'underline','line-through','none'
        get:arg=>{
          v.a = this.range.getFontLines();
          if( !arg.dst.hasOwnProperty('FontLines') )
            arg.dst.FontLines = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
          arg = Object.assign(arg,{
            src: v.a,
            dst: arg.dst.FontLines,
            func: o => {return o},
            default: this.sheetProperties.FontLines.default,
          });
          return this.scan(arg);
        },
        default:'none',
        css: arg=>{return {style:{'text-decoration-line':arg}}},
      },
      FontSizes: {
        get:arg=>{
          v.a = this.range.getFontSizes()
          if( !arg.dst.hasOwnProperty('FontSizes') )
            arg.dst.FontSizes = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
          arg = Object.assign(arg,{
            src: v.a,
            dst: arg.dst.FontSizes,
            func: o => {return o},
            default: this.sheetProperties.FontSizes.default,
          });
          return this.scan(arg);
        },
        default:10,
        css: arg=>{return {style:{'font-size':arg+'pt'}}},
      },
      FontStyles: { // フォントスタイル。'italic'または'normal'
        get:arg=>{
          v.a = this.range.getFontStyles();
          if( !arg.dst.hasOwnProperty('FontStyles') )
            arg.dst.FontStyles = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
          arg = Object.assign(arg,{
            src: v.a,
            dst: arg.dst.FontStyles,
            func: o => {return o},
            default: this.sheetProperties.FontStyles.default,
          });
          return this.scan(arg);
        },
        default:'normal',
        css: arg=>{return {style:{'font-style':arg}}},
      },
      FontWeights: {  // normal, bold, 900, etc. https://developer.mozilla.org/ja/docs/Web/CSS/font-weight
        get:arg=>{
          v.a = this.range.getFontWeights()
          if( !arg.dst.hasOwnProperty('FontWeights') )
            arg.dst.FontWeights = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
          arg = Object.assign(arg,{
            src: v.a,
            dst: arg.dst.FontWeights,
            func: o => {return o},
            default: this.sheetProperties.FontWeights.default,
          });
          return this.scan(arg);
        },
        default:'normal',
        css: arg=>{return {style:{'font-weight':arg}}},
      },
      HorizontalAlignments: {
        get:arg=>{
          v.a = this.range.getHorizontalAlignments();
          if( !arg.dst.hasOwnProperty('HorizontalAlignments') )
            arg.dst.HorizontalAlignments = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
          arg = Object.assign(arg,{
            src: v.a,
            dst: arg.dst.HorizontalAlignments,
            func: o => {return o},
            default: this.sheetProperties.HorizontalAlignments.default,
          });
          return this.scan(arg);
        },
        default:'general',
        css: arg=>{return {style:{'text-align':arg.replace('general-','')}}},
      },
      VerticalAlignments: {
        get:arg=>{
          v.a = this.range.getVerticalAlignments();
          if( !arg.dst.hasOwnProperty('VerticalAlignments') )
            arg.dst.VerticalAlignments = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
          arg = Object.assign(arg,{
            src: v.a,
            dst: arg.dst.VerticalAlignments,
            func: o => {return o},
            default: this.sheetProperties.VerticalAlignments.default,
          });
          return this.scan(arg);
        },
        default:'bottom',
        css: arg=>{return {style:{'vertical-align':arg}}},
      },
      WrapStrategies: {  // テキストの折り返し
        get:arg=>{
          v.a = this.range.getWrapStrategies();
          if( !arg.dst.hasOwnProperty('WrapStrategies') )
            arg.dst.WrapStrategies = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
          arg = Object.assign(arg,{
            src: v.a,
            dst: arg.dst.WrapStrategies,
            func: o => {return JSON.stringify(o).replaceAll('"','')},
            default: this.sheetProperties.WrapStrategies.default,
          });
          return this.scan(arg);
        },
        default:null,
        // html化の際はtdのCSSで「word-break: break-all(全て折り返し)」指定しているので、css関数は定義しない
      },
      TextDirections: {  // 文章方向
        // https://developer.mozilla.org/ja/docs/Web/CSS/text-decoration-line
        // LEFT_TO_RIGHT	Enum	文章方向（左から右へ）。
        // RIGHT_TO_LEFT	Enum	文章方向が右から左。
        get:arg=>{
          v.a = this.range.getTextDirections();
          if( !arg.dst.hasOwnProperty('TextDirections') )
            arg.dst.TextDirections = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
          if( !arg.dst.hasOwnProperty('TextDirections') ) arg.dst.TextDirections = [];
          arg = Object.assign(arg,{
            src: v.a,
            dst: arg.dst.TextDirections,
            func: o => {return JSON.stringify(o).replaceAll('"','')},
            default: this.sheetProperties.TextDirections.default,
          });
          return this.scan(arg);
        },
        default:null,
        // htmlへの反映は未対応
      },
      // 2.4.その他
      MergedRanges: {get:arg=>{  // 結合セル
        v.a = [];
        this.range.getMergedRanges().forEach(x => v.a.push(x.getA1Notation()));
        return v.a;
      }},
      DataValidations: {
        get:arg=>{
          v.a = this.range.getDataValidations();
          if( !arg.dst.hasOwnProperty('DataValidations') )
            arg.dst.DataValidations = Array.from({length:v.a.length},()=>Array.from({length:v.a[0].length},()=>null));
          arg = Object.assign(arg,{
            src: v.a,
            dst: arg.dst.DataValidations,
            func: o => {return { // セルの処理関数
              AllowInvalid: o.getAllowInvalid(),
              CriteriaType: JSON.parse(JSON.stringify(o.getCriteriaType())),
              CriteriaValues: JSON.parse(JSON.stringify(o.getCriteriaValues())),
              HelpText: o.getHelpText(),
            }},
            default: this.sheetProperties.DataValidations.default,
          });
          return this.scan(arg);
        },
        default:null,
        // htmlへの反映は未対応
      },
    };

    // --------------------------------------------------
    v.step = 2; // 進捗管理(this.conf)のセット
    // --------------------------------------------------
    v.step = 2.1; // confをPropertyから取得
    v.ScriptProperties = PropertiesService.getScriptProperties().getProperty(this.propKey);
    if( v.ScriptProperties !== null ){ // 2回目以降の実行時(タイマー起動)

      this.conf = JSON.parse(v.ScriptProperties);
      this.spread = SpreadsheetApp.openById(this.conf.SpreadId);
      this.srcFile = DriveApp.getFileById(this.conf.SpreadId);

      v.step = 2.2; // 作業用ファイルの内容をthis.dataに読み込み
      this.dstFile = DriveApp.getFileById(this.conf.fileId);
      v.unzip = Utilities.unzip(this.dstFile.getBlob());
      this.data = JSON.parse(v.unzip[0].getDataAsString('UTF-8'));
      this.dstFile.setTrashed(true); // 現在のzipをゴミ箱に移動

    } else {  // 強制停止、または初回実行時

      if( arg === false ){ // 強制停止

        v.step = 2.3;
        throw new Error(`次回処理の強制停止指示があったため、処理を終了します`);

      } else {  // 初回実行時

        v.step = 2.41; // 入力元のスプレッドシート・ファイル
        this.spread = SpreadsheetApp.openById(this.conf.SpreadId);
        this.srcFile = DriveApp.getFileById(this.conf.SpreadId);

        v.step = 2.42; // this.dataにスプレッドシート関連情報をセット
        this.data = this.spreadProperties();

        v.step = 2.43; // シート名一覧(this.conf.sheetList)の作成、this.data.Sheetsに初期値設定
        this.spread.getSheets().forEach(x => this.conf.sheetList.push(x.getSheetName()));
        this.conf.sheetList.forEach(x => this.data.Sheets.push({Name:x}));

        v.step = 2.44; // 取得する属性一覧(this.conf.propList)の作成
        this.conf.propList = Object.keys(this.sheetProperties);

      }
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
