class SpreadProperties {
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
  
  /** spreadProperties: フォルダ・ファイル関連、スプレッドシート関連の属性情報取得
   * @param {void}
   * @returns {Object.<string,string>} 属性名：値形式
   */
  spreadProperties(){
    const v = {whois:this.constructor.name+'.spreadProperties',step:0,rv:null};
    console.log(`${v.whois} start.`);
    try {
  
      this.srcFile = DriveApp.getFileById(this.spread.getId());
      v.rv = {
        // フォルダ・ファイル関連情報
        Ancestors: (()=>{ // マイドライブ〜所属するフォルダまでのツリー
          v.folderNames = [];
          v.folder = this.srcFile.getParents().next();
          while (v.folder) {
            v.folderNames.unshift(v.folder.getName());
            v.parents = v.folder.getParents();
            v.folder = v.parents.hasNext() ? v.parents.next() : null;
          }
          return v.folderNames;
        })(),
        Description: this.srcFile.getDescription(), // ファイルの説明文
        DateCreated: toLocale(this.srcFile.getDateCreated()), // ファイル作成日時
        LastUpdated: toLocale(this.srcFile.getLastUpdated()),
        Size: this.srcFile.getSize(),
  
        // スプレッドシート関連情報
        Id: this.spread.getId(),
        Name: this.spread.getName(),
        NamedRange: (()=>{  // 名前付き範囲
          v.a = []; this.spread.getNamedRanges().forEach(o => {
            v.r = o.getRange();
            v.a.push({
              Name: o.getName(),
              sheetName: v.r.getSheet().getName(),
              Range: v.r.getA1Notation(),
            });
          }); return v.a;
        })(),
        Owner: this.spread.getOwner().getEmail(),
        SpreadsheetLocale: this.spread.getSpreadsheetLocale(), // 言語/地域
        SpreadsheetTimeZone: this.spread.getSpreadsheetTimeZone(), // スプレッドシートのタイムゾーン
        Url: this.spread.getUrl(),
        Viewers: (()=>{  // 閲覧者とコメント投稿者のリスト
          v.a = [];
          this.spread.getViewers().forEach(x => v.a.push(x.getEmail()));
          return v.a;
        })(),
  
        SavedDateTime: toLocale(new Date(this.conf.start)),  // 本メソッド実行日時
        Sheets: [], // シート情報
      };
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  
  /** scan: 属性情報が二次元の場合、一行毎に制限時間をチェックしながら文字列化
   * @param arg {Object}
   * @param arg.src {any[][]} - scanの呼出元で取得したソースとなる二次元配列
   * @param arg.dst {any[][]} - 処理結果。前回作成途中の二次元配列
   * @param arg.func {function} - セルに設定する値を導出する関数
   * @param [arg.default] {any} - セルの既定値。存在する場合のみ指定
   */
  scan(arg){
    const v = {whois:this.constructor.name+'.scan',step:0,rv:null};
    try {
  
      while( this.conf.next.row < arg.src.length && this.overLimit === false ){
        if( arg.src[this.conf.next.row] ){
          // 一行分のデータを作成
          for( v.i=0 ; v.i<arg.src[this.conf.next.row].length ; v.i++ ){
            if( !arg.src[this.conf.next.row][v.i] ) continue;  // null等なら処理対象外
            v.r = arg.func(arg.src[this.conf.next.row][v.i]);
            if( !arg.hasOwnProperty('default') || arg.default !== v.r ){
              arg.dst[this.conf.next.row][v.i] = v.r;
            }
          }
        }
        // カウンタを調整
        this.conf.next.row++;
        // 制限時間チェック
        if( (Date.now() - this.conf.start) > this.elapsLimit ) this.overLimit = true;
      }
      v.ratio = Math.round((this.conf.next.row/arg.src.length)*10000)/100;
  
      v.step = 9; // 終了処理
      console.log(`scan: ${this.sheetName}.${this.propName} row=${this.conf.next.row}(${v.ratio}%) end.`);
      return arg.dst;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`
      + `\narg=${JSON.stringify(arg)}`
      + `\nthis.conf.next=${JSON.stringify(this.conf.next)}`
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  
  /** getSheet: 指定されたシートの属性情報を取得
   * @param arg {string}=this.spread.getActiveSheet() - 取得対象となるシート名。未指定の場合表示中のシート
   * @returns {void} this.data.Sheet[取得対象シート名]
   */
  getSheet(arg=null){
    const v = {whois:this.constructor.name+'.getSheet',step:0,rv:null};
    console.log(`${v.whois} start.\narg=${arg}`);
    try {
  
      this.sheetName = arg === null ? this.spread.getActiveSheet().getName() : arg;
      this.conf.next = {sheet:this.conf.sheetList.findIndex(x => x === this.sheetName),prop:0,row:0};
      this.sheet = this.spread.getSheetByName(this.sheetName);
      this.range = this.sheet.getDataRange();
      while( this.conf.next.prop < this.conf.propList.length && this.overLimit === false ){
        v.step = 4.1; // 属性毎の情報取得
        this.propName = this.conf.propList[this.conf.next.prop];
        console.log(`${this.sheetName}.${this.propName} start.`
        + ` (sheet=${this.conf.next.sheet+1}/${this.conf.sheetList.length},`
        + ` prop=${this.conf.next.prop+1}/${this.conf.propList.length})`);
        v.step = 4.2; // 引数を作成
        v.arg = {sheet:this.sheet,range: this.range,dst:this.data.Sheets.find(x => x.Name === this.sheetName)};
        if( !v.arg.dst ) v.arg.dst = this.data.Sheets[this.sheetName] = {};
  
        v.step = 4.3; // 属性取得の実行
        v.r = this.sheetProperties[this.conf.propList[this.conf.next.prop]].get(v.arg);
        if( v.r instanceof Error ) throw v.r;
        this.data.Sheets.find(x => x.Name === this.sheetName)[this.propName] = v.r;
        v.step = 4.4; // カウンタを調整
        if(!this.overLimit){
          this.conf.next.prop++;
          this.conf.next.row = 0;
        }
        v.step = 4.5; // 制限時間チェック
        if( (Date.now() - this.conf.start) > this.elapsLimit ) this.overLimit = true;
      }
  
      v.step = 9; // 終了処理
      v.rv = this.data.Sheets.find(x => x.Name === this.sheetName);
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** range2html: 選択範囲をHTML化
   * @param arg {Object}
   * @param arg.guide {boolean}=false - 行列記号を付ける場合はtrue
   * @returns {Object}
   */
  range2html(arg){
    const v = {whois:this.constructor.name+'.range2html',step:0,rv:null,className:'x'+Utilities.getUuid()};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {
  
      v.step = 1.1; // 引数の既定値設定
      v.arg = Object.assign({guide:false},arg);
  
      v.step = 1.2; // 現在のシート・選択範囲をメンバに保存
      this.sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      console.log(this.sheet.getName())
      this.range = this.sheet.getActiveRange();
      v.A1Notation = this.range.getA1Notation();
  
      v.step = 1.3; // 選択範囲をv.top/left/right/bottomに【添字ベース】で保存
      v.m = v.A1Notation.match(/([A-Z]+)(\d+):?([A-Z]*)(\d*)/);
      v.top = Number(v.m[2]) - 1;
      v.left = convertNotation(v.m[1]) - 1;
      v.right = v.m[3] === '' ? v.left : (convertNotation(v.m[3]) - 1);
      v.bottom = v.m[4] === '' ? v.top : (Number(v.m[4]) - 1);
      v.colnum = v.right - v.left + 1;
      v.rownum = v.bottom - v.top + 1;
  
      v.step = 1.4; // シートから情報取得
      v.sheet = this.getSheet(this.sheet.getName());
  
      v.step = 2; // v.element: セル毎の情報オブジェクトを作成
      // - tag {string} : htmlのタグ。ex.'td'
      // - attr {Object.<string,string>} 属性。ex.{'colspan':2}
      // - style {Object.<string,string>} セル特有のCSS。ex.{'font-color':'#ff0000'}
      // - text {string} セルに表示する文字列
      // - children {v.element[]} 子要素の情報オブジェクト
      v.step = 2.1; // v.elementを空(null)の配列として作成
      v.element = Array.from({length:v.rownum},()=>Array.from({length:v.colnum},()=>null));
  
      v.step = 2.2; // 属性毎にチェック
      for( v.prop in this.sheetProperties ){
        if( this.sheetProperties[v.prop].hasOwnProperty('css') ){
          // CSSの定義が無いシートの属性はスキップ ex.Name, SheetId
          if( Array.isArray(v.sheet[v.prop][0]) ){
  
            v.step = 2.3; // Backgroundのように、データが二次元の場合は行×列で処理
            for( v.r=0 ; v.r<v.rownum ; v.r++ ){
              for( v.c=0 ; v.c<v.colnum ; v.c++ ){
                if( v.sheet[v.prop][v.r+v.top][v.c+v.left] ){
                  // シートの定義値優先で、既存の定義オブジェクトをマージ
                  v.element[v.r][v.c] = mergeDeeply(
                    this.sheetProperties[v.prop].css(v.sheet[v.prop][v.r+v.top][v.c+v.left]),
                    v.element[v.r][v.c]
                  );
                }
              }
            }
  
          } else {
  
            v.step = 2.4; // ColumnWidthのように、データが一次元の場合は1行目のみ設定
            for( v.c=0 ; v.c<v.colnum ; v.c++ ){
              if( v.sheet[v.prop][v.c+v.left] ){
                v.element[0][v.c] = mergeDeeply(
                  this.sheetProperties[v.prop].css(v.sheet[v.prop][v.c+v.left]),
                  v.element[0][v.c]
                );
              }
            }
          }
        }
      }
  
      v.step = 2.5; // attrの初期値を設定
      for( v.r=0 ; v.r<v.element.length ; v.r++ ){
        for( v.c=0 ; v.c<v.element[v.r].length ; v.c++ ){
          if( !v.element[v.r][v.c] ) continue;
          // セル幅を指定するクラスを設定。この段階では添字(数値)を設定、クラス文字列にはv.tdで変換
          console.log(`l.837 v.element[${v.r}][${v.c}]=${JSON.stringify(v.element[v.r][v.c])}`)
          if( !v.element[v.r][v.c].hasOwnProperty('attr') ) v.element[v.r][v.c].attr = {};
          v.element[v.r][v.c].attr = mergeDeeply({class:v.c},v.element[v.r][v.c].attr);
  
          // title属性はメモ＋数式なので配列として保存されている。これを文字列に変換
          if( v.element[v.r][v.c] && v.element[v.r][v.c].attr.hasOwnProperty('title'))
            v.element[v.r][v.c].attr.title = v.element[v.r][v.c].attr.title.join('\n');
        }
      }
  
      v.step = 2.6; // 結合セル対応
      v.sheet.MergedRanges.forEach(x => { // x:結合セル範囲のA1記法文字列
  
        v.step = 2.61; // 範囲を数値化
        // v.mrXXX : アクティブな範囲の右上隅を(0,0)とするアドレス
        v.m = x.match(/([A-Z]+)(\d+):?([A-Z]*)(\d*)/);
        v.mrTop = Number(v.m[2]) - (v.top + 1);
        v.mrLeft = convertNotation(v.m[1]) - (v.left + 1);
        v.mrRight = v.m[3] === '' ? v.mrLeft : (convertNotation(v.m[3]) - (v.left+1));
        v.mrBottom = v.m[4] === '' ? v.mrTop : Number(v.m[4]) - (v.top + 1);
  
        v.step = 2.62; // 範囲の先頭行左端セルは残す
        v.element[v.mrTop].splice(v.mrLeft+1,(v.mrRight-v.mrLeft));
        for( v.r=v.mrTop+1 ; v.r<=v.mrBottom ; v.r++ )
          v.element[v.r].splice(v.mrLeft,(v.mrRight-v.mrLeft+1));
  
        v.step = 2.63; // colspan, rowspanの設定
        if( v.mrLeft < v.mrRight )
          v.element[v.mrTop][v.mrLeft].attr.colspan = v.mrRight - v.mrLeft + 1;
        if( v.mrTop < v.mrBottom )
          v.element[v.mrTop][v.mrLeft].attr.rowspan = v.mrBottom - v.mrTop + 1;
      });
  
      v.step = 3.1; // スタイルシートの作成
      v.html = [
        '<style type="text/css">',
        `.${v.className} `+'th,td {',
        '  position: relative;',
        '  height: 20px;',
        '  background: #ffffff;',
        '  font-size: 10pt;',
        '  border-right: solid 1px #e1e1e1;',
        '  border-bottom: solid 1px #e1e1e1;',
        '  word-break: break-all;',
        '}',
        `.${v.className} `+'th {',
        '  font-family: sans-serif;',
        '  text-align: center;',
        '  vertical-align: middle;',
        '  font-weight: 900;',
        '  background: #dddddd;',
        '  border-top: solid 1px #e1e1e1;',
        '  border-left: solid 1px #e1e1e1;',
        '  width: 50px;',
        '}',
        `.${v.className} `+'td {',
        '  width: 100px;',
        '  font-family: arial,sans,sans-serif;',
        '  vertical-align: bottom;',
        '  overflow: hidden; /* 折り返しは隠す */',
        '}',
        `.${v.className} `+'.noteIcon {',
        '  position: absolute; top:0; right: 0;',
        '  width: 0px;',
        '  height: 0px;',
        '  border-top: 4px solid black;',
        '  border-right: 4px solid black;',
        '  border-bottom: 4px solid transparent;',
        '  border-left: 4px solid transparent;',
        '}',
      ];
  
      v.step = 3.2; // ColumnWidth
      for( v.i=v.left ; v.i<=v.right ; v.i++ ){
        v.width = (v.sheet.ColumnWidth[v.i] || this.sheetProperties.ColumnWidth.default) + 'px';
        v.html.push(`.${v.className} td:nth-Child(${v.i-v.left+1}),`
        + ` .${v.className} td.col${v.i-v.left+1} {width: ${v.width};}`);
      }
      v.html.push('</style>');
  
      v.step = 4; // body部分の作成
      v.step = 4.1; // セル単位のtd要素(ソース)生成関数を定義
      v.td = o => { 
        if( o === null ) return '<td></td>';
        let rv = '<td';
        if( o.hasOwnProperty('attr') ){
          if( o.attr.hasOwnProperty('title') ){
            // メモの存在を示す右上隅の黒い三角マークを追加
            o.text = '<div class="noteIcon"></div>' + (o.text||'');
          }
  
          // 結合セルの影響で列がズレたセルはセル幅指定用のクラスを設定
          if( o.attr.hasOwnProperty('colspan') || o.attr.hasOwnProperty('rowspan') || o.attr.class === v.c ){
            delete o.attr.class;
          } else {
            o.attr.class = `col${o.attr.class+1}`;
          }
  
          // tdの属性を指定
          for( let p in o.attr ) rv += ` ${p}="${o.attr[p]}"`;
        }
        if( o.hasOwnProperty('style') ){
          rv += ' style="';
          for( let p in o.style ) rv += `${p}:${o.style[p]};`
          rv += '"';
        }
        rv += `>${o.text||''}</td>`;
        return rv;
      };
  
      v.step = 4.2; // tableタグ内のソース作成
      v.html.push(`<table class="${v.className}"><tr>`);
      if( v.arg.guide === true ){ // 列記号の追加
        v.html.push('  <th></th>');
        for( v.c=v.left ; v.c<=v.right ; v.c++ )
          v.html.push(`  <th>${convertNotation(v.c+1)}</th>`)
        v.html.push('</tr><tr>');
      }
      for( v.r=0 ; v.r<v.element.length ; v.r++ ){
        if( v.arg.guide === true ) v.html.push(`<th>${v.top+v.r+1}</th>`) // 行番号の追加
        for( v.c=0 ; v.c<v.element[v.r].length ; v.c++ ){
          v.html.push('  '+v.td(v.element[v.r][v.c]))
        }
        v.html.push('</tr><tr>');
      }
      v.html.push('</tr></table>');
      v.rv = v.html.join('\n');
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  
  /** getRange: 現在選択中の範囲の属性情報を取得
   * @returns {Object}
   */
  getRange(){  // いまここ作成中
    const v = {whois:this.constructor.name+'.saveSheet',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  
  /** saveSpread() : 指定スプレッドシートから各種属性情報を取得、Google Diverのスプレッドシートと同じフォルダにzip形式圧縮されたJSONとして保存
   * @param arg {string} - 呼出元の関数名
   * @returns {Object.<string,any>} 属性名：設定値形式のオブジェクト
   * 
   * - 仕様は[workflowy](https://workflowy.com/#/415ca4c2d194)参照
   */
  saveSpread(arg=null){
    const v = {whois:'saveSpread',step:0,rv:null};
    console.log(`${v.whois} start.`);
    try {
  
      // --------------------------------------------------
      v.step = 4; // シート毎の情報取得
      // --------------------------------------------------
      while( this.conf.next.sheet < this.conf.sheetList.length && this.overLimit === false ){
        this.sheetName = this.conf.sheetList[this.conf.next.sheet];
        this.sheet = this.spread.getSheetByName(this.sheetName);
        this.range = this.sheet.getDataRange();
        while( this.conf.next.prop < this.conf.propList.length && this.overLimit === false ){
          v.step = 4.1; // 属性毎の情報取得
          this.propName = this.conf.propList[this.conf.next.prop];
          console.log(`${this.sheetName}.${this.propName} start.`
          + ` (sheet=${this.conf.next.sheet+1}/${this.conf.sheetList.length},`
          + ` prop=${this.conf.next.prop+1}/${this.conf.propList.length})`);
          v.step = 4.2; // 前回結果をクリア
          v.arg = {};
          //['src','dst','func'].forEach(x => delete v.arg[x]);
          v.step = 4.3; // 属性取得の実行
          v.r = this.sheetProperties[this.conf.propList[this.conf.next.prop]](v.arg);
          if( v.r instanceof Error ) throw v.r;
          this.data.Sheets.find(x => x.Name === this.sheetName)[this.propName] = v.r;
          v.step = 4.4; // カウンタを調整
          if(!this.overLimit){
            this.conf.next.prop++;
            this.conf.next.row = 0;
          }
          v.step = 4.5; // 制限時間チェック
          if( (Date.now() - this.conf.start) > this.elapsLimit ) this.overLimit = true;
        }
        v.step = 4.6; // カウンタを調整
        if(!this.overLimit){
          this.conf.next.sheet++;
          [this.conf.next.prop,this.conf.next.row] = [0,0]
        };
        v.step = 4.7; // 制限時間チェック
        if( (Date.now() - this.conf.start) > this.elapsLimit ) this.overLimit = true;
      }
  
      // --------------------------------------------------
      v.step = 5; // this.dataの内容を作業用ファイルに書き込む
      // --------------------------------------------------
      v.step = 5.1; // 圧縮対象のファイル名に日本語が入っていると"Illegal byte sequence"になるので英文字指定
      v.blob = Utilities.newBlob(JSON.stringify(this.data),'application/json',`${this.overLimit?'uncomplete':'data'}.json`);
      v.zip = Utilities.zip([v.blob],`${this.data.Name}.${toLocale(new Date(this.conf.start),'yyyyMMdd-hhmmss')}.zip`);
      this.dstFile = this.srcFile.getParents().next().createFile(v.zip);
      this.conf.fileId = this.dstFile.getId();
  
      v.step = 5.2; // ScriptPropertiesを削除
      if( v.ScriptProperties ){
        PropertiesService.getScriptProperties().deleteProperty(this.propKey);
      }
      this.conf.count += 1;  // 実行回数をインクリメント
      if( this.overLimit ){  // タイムアウト時
        v.step = 5.3;
        if( this.conf.count > this.executionLimit && this.conf.complete === false ){ // 実行回数の制限を超えた場合
          throw new Error(`最大実行回数(${this.executionLimit}回)を超えたので、処理を中断しました`);
        } else {
          // ScriptPropertiesを更新
          PropertiesService.getScriptProperties().setProperty(this.propKey, JSON.stringify(this.conf));
          // 1分後に自分自身を起動するよう、タイマーをセット
          ScriptApp.newTrigger(arg).timeBased().after(1000 * 60).create();
        }
      }
  
      v.step = 9; // 終了処理
      v.rv = this.conf;
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${JSON.stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }
  
}

