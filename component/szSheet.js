/* コアスクリプト */
/** GASLib.szSheet: Google Spread操作に関する擬似クラス */

/**
 * @typedef {object} szSheetObj - szSheetの戻り値
 * @prop {string} sheetName - シート名
 * @prop {string} spreadId - スプレッドシートID。外部シートの場合のみ設定
 * @prop {object} sheet - getSheetで取得したシートのオブジェクト
 * @prop {number} headerRow - ヘッダ行番号
 * @prop {number} lastRow - データが存在する最下行の行番号(>0)
 * @prop {string[]} key - キー項目名。引数＞シート上の「primary key」指定項目
 * @prop {string[]} keys - ヘッダ行の一次元配列
 * @prop {Object.<string, number>} colIdx - 項目名:列番号(自然数)
 * @prop {any[][]} raw - 取得した生データ(二次元配列)
 * @prop {Array.Object.<string, any>} data - データ行を[{ラベル1:値, ラベル2:値, ..},{..},..]形式にした配列
 * @prop {Object.<string, any>} members - 本オブジェクト内の各メンバ。メソッドへの受渡用
 * @prop {Object.<string, number>} default - 指定項目の既定値
 * @prop {Object.<string, FormResponse>} formObj - defaultで指定されたフォームのオブジェクト。キーはタイムスタンプのgetTime(文字列)
 * [Class FormResponse]{@link https://developers.google.com/apps-script/reference/forms/form-response?hl=ja}
 * @prop {function} isEqual - メソッド。変数とシート上の値が等価か判断する。search等のメソッドで使用
 * @prop {function} complement - メソッド。主キーおよび既定値未設定項目の補完を行う
 * @prop {function} search - メソッド。行の検索。主に内部利用を想定
 * @prop {function} lookup - メソッド。search結果を基に項目名'key'の値がvalueである行Objを返す
 * @prop {function} update - メソッド。行の更新
 * @prop {function} append - メソッド。行の追加
 * @prop {function} delete - メソッド。行の削除
 * @prop {function} objectize - メソッド。階層形式のシートをオブジェクト化
 */

/** szSheet: Googleスプレッドでデータ/行のCRUDを行う擬似クラス
 * @desc GAS用擬似クラス。CRUD用メソッドを持つオブジェクトを生成する。
 * 
 * 1. isEqual: 引数とシート上の値が等価か判断
 * 1. complement: 主キー及び既定値設定項目の補完を行う
 * 1. search: 項目名'key'の値がvalueである行Objを全て検索する
 * 1. lookup: 項目名'key'の値がvalueである最初の行Objを返す
 * 1. update: 該当する行の値を変更する
 * 1. append: 行の追加
 * 1. delete: 行の削除
 * 1. objectize: 階層形式のシートをオブジェクト化
 * 
 * @function
 * @param {object|string} arg - 文字列の場合「コンテナのシートでヘッダ行は1行目」と看做す
 * @param {string} arg.spreadId - 外部スプレッドシートのID
 * @param {string} arg.sheetName - シート名
 * @param {number} arg.headerRow - ヘッダ行の行番号(>0)。既定値1。項目名は重複不可
 * @param {string} [key=null] - プライマリキーとなる項目名
 * @returns {szSheetObj} 取得したシートのデータ
 * 
 * @desc <caption>シート記述時の注意</caption>
 * 
 * 1. 引数のキー指定は「primary key」のメモより優先される
 * 2. 「default:〜」はcomplement・append時、空欄に「〜」を設定。実データだけでなく算式も可。<br>
 *    例：「default: =indirect("RC[-1]",false)」は一列左の値が設定される<br>
 *    また「default: =editFormId(〜).xxx」とした場合、フォームからurl/id/email/timestampが引用される。
 * 3. フォーム連動項目・arrayformula設定項目・メモ付き項目(primary key/default設定項目)は
 * update/append/complementの対象にしない。∵GAS側で書き換えると不正動作を誘引する
 */
function szSheet(arg,key=null){
  const v = {whois:'szSheet',rv:{}};
  try {
    console.log(v.whois+' start.\n',arg,key);

    // 1.既定値の設定
    if( typeof arg === 'string' ){  // 文字列のみ ⇒ シート名の指定
      v.step = '1a';
      v.rv.sheetName = arg;
      v.rv.spreadId = null;
      v.rv.sheet = SpreadsheetApp.getActive().getSheetByName(arg);
      v.rv.headerRow = 1; // ヘッダ行は1行目(固定)
    } else {
      v.step = '1b';
      v.rv.sheetName = arg.sheetName;
      v.rv.spreadId = null;
      if( 'spreadId' in arg ){
        v.step = '1ba';
        v.rv.spreadId = arg.spreadId;
        v.rv.sheet = SpreadsheetApp.openById(arg.spreadId).getSheetByName(arg.sheetName);
        if( v.rv.sheet instanceof Error ) throw v.rv.sheet;
      } else {
        v.step = '1bb';
        v.rv.sheet = SpreadsheetApp.getActive().getSheetByName(arg.sheetName);
      }
      v.rv.headerRow = arg.headerRow || 1;  // ヘッダ行の既定値は1行目
      if( v.rv.headerRow < 1 ){
        throw new Error('ヘッダ行は自然数で指定してください');
      }
    }
    if( v.rv.sheet === null ) throw new Error('指定された"'+v.rv.sheetName+'"シートは存在しません');
    v.rv.key = key;
    
    // 2.データの取得・加工
    v.step = '2.1';
    v.dRange = v.rv.sheet.getDataRange();
    v.rv.raw = v.dRange.getValues();
    const raw = JSON.parse(JSON.stringify(v.rv.raw));
    v.rv.keys = raw.splice(v.rv.headerRow-1,1)[0];
    if( v.rv.key !== null && v.rv.keys.findIndex(x => x === v.rv.key ) < 0 ){
      throw new Error('キーとして指定された項目が存在しません');
    }
    v.rv.colIdx = {};
    for( v.i=0 ; v.i<v.rv.keys.length ; v.i++ ){
      v.rv.colIdx[v.rv.keys[v.i]] = v.i + 1;
    }
    v.rv.data = raw.splice(v.rv.headerRow-1).map(row => {
      const obj = {};
      row.map((item, index) => {
        obj[String(v.rv.keys[index])] = String(item);
      });
      return obj;
    });
    v.rv.lastRow = v.rv.raw.length;

    // 2.2.primary key, defaultの取得
    v.step = '2.2';
    v.rv.default = {};
    v.dRange.getNotes()[v.rv.headerRow-1].forEach((x,i) => {
      if( x.match(/primary key/) && v.rv.key === null )
        v.rv.key = v.rv.keys[i];  // "primary key"指定があればkeyとする
      v.m = x.match(/default\s*:?\s*(\S+)/);
      if( v.m ) v.rv.default[v.rv.keys[i]] = v.m[1];
    });
    // 2.3.defaultにFormのeditURLの指定があれば、事前にFormのデータを取得
    v.step = '2.3';
    v.rv.formObj = {m:[]};
    for( v.i in v.rv.default ){
      v.m = v.rv.default[v.i].match(/^=editFormId\((.+?)\)/);
      v.rv.formObj.m.push(v.m);
      if( v.m !== null ){
        v.step = '2.3a';
        // 2.3a.全フォームデータを読み込み、登録日時をキーにformDataに登録
        v.formData = FormApp.openById(v.m[1]).getResponses();
        for( v.j=0 ; v.j<v.formData.length ; v.j++ ){
          v.rv.formObj[String(v.formData[v.j].getTimestamp().getTime())] = v.formData[v.j];
        }
      }
    }

    // 3.内部関数の定義
    /** isEqual: 引数とシート上の値が等価か判断
     * @param {any} a - 引数
     * @param {any} s - シート上の値
     * @returns {boolean} true:等価
     */
    v.rv.isEqual = (a,b) => {
      return a == b || new Date(a).getTime() === new Date(b).getTime()
    }

    /**
     * @typedef {object} complementedRow - 行単位の補完結果
     * @prop {number} dataNum - rv.data上の添字
     * @prop {Object.<string, string|number>} changed - 補完した項目と設定値
     */
    /** complement: 主キー及び既定値設定項目の補完を行う
     * @desc 主キーは数値のみ、空欄は位置に関わらず最大値＋1を設定。既定値はメモにある文字列をセット
     * @param {void} - なし
     * @returns {complementedRow[]} 補完結果の配列
     */
    v.rv.complement = () => {return ((p)=>{
      const v = {whois:p.whois+'.complement',rv:[]};
      try {
        console.log(v.whois+' start.');

        // 1.主キーの最大値を取得
        v.step = '1';
        v.pMax = -999999;
        for( v.i=0 ; v.i<p.data.length ; v.i++ ){
          if( v.pMax < Number(p.data[v.i][p.key]) ){
            v.pMax = Number(p.data[v.i][p.key]);
          }
        }

        // 2.rv.dataを順次検索、主キー・既定値設定項目に空欄があればセット
        v.step = '2';
        v.dMap = Object.keys(p.default);  // 補完項目名のリスト
        for( v.i=0 ; v.i<p.data.length ; v.i++ ){
          // 2.1.行単位更新の事前準備
          v.step = '2.1';
          v.t = String(new Date(p.data[v.i]['タイムスタンプ']).getTime());
          v.obj = {}; // 更新項目：値のオブジェクト
          // 2.2.キー項目が空欄なら最大値をセット
          v.step = '2.2';
          if( p.data[v.i][p.key] == '' ){
            v.obj[p.key] = ++v.pMax;
          }
          // 2.3.既定値項目のセット
          v.step = '2.3';
          for( v.j=0 ; v.j<v.dMap.length ; v.j++ ){
            if( String(p.data[v.i][v.dMap[v.j]]).length === 0 ){
              // 2.3a.要補完項目に未入力(空白セル)が存在した場合
              v.step = '2.3a';
              v.m = p.default[v.dMap[v.j]].match(/^=editFormId\(.+?\)\.([a-z]+)/);
              if( v.m === null ){
                // 2.3aa.要補完項目がFormから引用する項目ではない場合、既定値をそのまま設定
                v.step = '2.3aa';
                v.obj[v.dMap[v.j]] = p.default[v.dMap[v.j]];
              } else {
                // 2.3ab.要補完項目がFormから引用する項目の場合、formObjから引用
                if( typeof p.formObj[v.t] === 'undefined' ){
                  v.step = '2.3aba';  // フォームデータが見つからなければ空白セルのまま
                  v.obj[v.dMap[v.j]] = '';
                } else {
                  v.step = '2.3abb';  // 指定項目をフォームデータから引用してセット
                  switch( v.m[1] ){
                    case 'url':
                      v.obj[v.dMap[v.j]] = p.formObj[v.t].getEditResponseUrl();
                      break;
                    case 'id':
                      v.obj[v.dMap[v.j]] = p.formObj[v.t].getId();
                      break;
                    case 'email':
                      v.obj[v.dMap[v.j]] = p.formObj[v.t].getRespondentEmail();
                      break;
                    case 'timestamp':
                      v.obj[v.dMap[v.j]] = p.formObj[v.t].getTimestamp();
                      break;
                  }
                }
              }
            }
          }
          // 2.4.補完すべき項目があればupdate
          v.step = '2.4';
          if( Object.keys(v.obj).length > 0 ){
            v.r = p.update(v.obj,{num:v.i});
            if( v.r instanceof Error ) throw v.r;
            v.rv.push({dataNum:v.i,changed:v.obj});
          }
        }

        v.step = '3'; // 終了処理
        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members)};  // complement終了

    // 4.メソッドの定義
    /**
     * @typedef {object} szSheetSearch - szSheet.search()の戻り値
     * @prop {Object.<string, any>} obj - 行オブジェクト({項目名1:値1,項目名2:値2,..}形式)
     * @prop {number} dataNum - data上の添字
     * @prop {number} rawNum - raw上の添字
     * @prop {number} rowNum - スプレッドシート上の行番号
     */
    /** search: 項目名'key'の値がvalueである行Objを全て検索する
     * @param {any}    value - キー値
     * @param {string} [key] - キーとなる項目名。既定値はキー項目名(rv.key)
     * @returns {szSheetSearch[]} 検索結果。マッチしなければ空配列
     */
    v.step = '4.1 search';
    v.rv.search = (value,key=v.rv.key) => {return ((p,value,key)=>{
      const v = {whois:p.whois+'.search',rv:[]};
      try {
        console.log(v.whois+' start. value='+value+', key='+key);

        if( p.keys.findIndex(x => x === key) < 0 ){
          throw new Error('指定された欄名がヘッダ行にありません');
        }

        for( v.i=0 ; v.i<p.data.length ; v.i++ ){
          if( p.isEqual(value,p.data[v.i][key]) ){
            v.rv.push({
              obj: p.data[v.i],
              dataNum: v.i,
              rawNum: v.i + p.headerRow,
              rowNum: v.i + p.headerRow + 1,
            });
          }
        }

        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,value,key)};  // search終了

    /** lookup: 項目名'key'の値がvalueである最初の行Objを返す
     * @param {any}    value - キー値
     * @param {string} key   - キーとなる項目名。既定値はキー項目名
     * @returns {szSheetSearch|null} 行オブジェクト({項目名1:値1,項目名2:値2,..}形式)またはnull
     */
    v.step = '4.2 lookup';
    v.rv.lookup = (value,key) => {return ((p,value,key)=>{
      const v = {whois:p.whois+'.lookup',rv:{}};
      try {
        console.log(v.whois+' start. value='+value+', key='+key);

        v.searchResult = p.search(value,key);
        v.rv = v.searchResult.length > 0 ? v.searchResult[0].obj : null;

        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,value,key)};  // lookup終了

    /**
     * @typedef {object} changedColumns - szSheet.update/appendで更新・追加により変化した欄とその値
     * @prop {string} colName - 更新・追加により値が変化した項目名
     * @prop {number} colNum - 同列番号(自然数)
     * @prop {any} before - 修正前の値
     * @prop {any} after - 修正後の値
     */
    /**
     * @typedef {object} szSheetChanged - szSheet.update/appendの一行分の更新・追加結果
     * @prop {string} func - append/update/deleteのいずれか
     * @prop {number} dataNum - 更新・追加行のrv.data上の添字
     * @prop {number} rawNum - 更新・追加行のrv.raw上の添字
     * @prop {number} rowNum - 更新・追加行のスプレッドシート上の行番号
     * @prop {changedColumns[]|Object.<string, any>} changed - 更新・追加により変化した欄とその値。削除の場合は削除行のdata
     */
    /** update: 該当する行の値を変更する
     * @desc key/valueにマッチする行が複数あった場合、最初の行のみ更新。
     * @desc 同一条件・複数変更は対応しているが、複数条件・複数対応は非対応(複数回updateを呼び出す)。
     * 例：「参加="参加する"->"true"」は対応、「"ID"=1->参加="true","ID"=2->参加="false"」は非対応
     * @desc any[]型の更新データには対応しない(修正位置が不明確になるため)
     * @desc <caption>戻り値に関する注意</caption>
     * 引数のkey,valueにマッチするものがなかったら空配列、
     * マッチするものがあったが変更がない場合szSheetChangedオブジェクトの配列が返るが、そのchangedは空配列になる。
     * 
     * @param {Object.<string, any>} data - 更新データ。{項目名：設定値,..}形式
     * @param {object|any} opt - オプション指定。非objならkey=rv.key,value=opt,append=trueと看做す
     * @param {string} [opt.key=rv.key] - キーとなる項目名
     * @param {any}    opt.value - キー値
     * @param {number} [opt.num=null] - 更新対象のrv.data上の添字。complementで使用、key/value指定と排他
     * @param {boolean} opt.append - true(既定値)ならキー値が存在しない場合は追加
     * @returns {szSheetChanged[]} 修正前後の値
     */
    v.step = '4.3 update';
    v.rv.update = (data,opt) => {return ((p,data,opt)=>{
      const v = {whois:p.whois+'.update',rv:[]};
      try {
        console.log(v.whois+' start.\ndata='+JSON.stringify(data)+'\nopt='+JSON.stringify(opt));
        // 1.オプションに既定値セット、検索キー・検索値を明確化
        v.step = '1';
        if( whichType(opt).toLocaleLowerCase() === 'object' ){
          opt.key = typeof opt.key !== 'undefined' ? opt.key : p.key;
          opt.append = typeof opt.append === 'undefined' ? true : opt.append;
          opt.num = typeof opt.num === 'undefined' ? null : opt.num;
        } else {
          opt = {key:p.key,value:opt,append:true,num:null};
        }
        if( opt.num === null && (p.keys.findIndex(x => x === opt.key) < 0) )
          throw new Error('キー項目が不適切です');

        // 2.現状のシートデータ(raw,data)を修正
        //   - 該当なし且つopt.appendの場合、appendメソッドに振る
        //   - 併せて更新範囲の特定、ログ作成を行う
        // 2.1.各種変数の初期化
        v.step = '2.1';
        v.maxRow = v.maxCol = -Infinity;
        v.minRow = v.minCol = Infinity;
        v.isExist = false; // 更新対象行が存在すればtrue。ループ後falseならappend呼び出し
        v.isUpdated = false; // 更新を行なったらtrue。更新対象行が存在しても既に更新済の場合はfalseのまま。ループ後trueならシート更新
        v.map = Object.keys(data); // 更新対象項目名の配列

        // 2.2.行単位に修正対象か判断、対象なら行データを修正
        v.step = '2.2';
        for( v.i=0 ; v.i<p.data.length ; v.i++ ){
          v.step = '2.2.1'; // 修正対象外なら後続処理はスキップ
          // 比較は厳密等価ではない等価で判断
          // opt.numはcomplementで指定されたrv.dataの添字
          if( (opt.num === null && (!p.isEqual(p.data[v.i][opt.key],opt.value)))
           || (opt.num !== null && opt.num !== v.i )) continue;

          v.step = '2.2.2'; // 行単位の処理結果Obj作成(単独のszSheetChanged作成)
          v.isExist = true;
          v.l = p.headerRow + v.i;  // raw上の添字。シートの行番号はこれに＋1
          v.log = {func:'update',dataNum:v.i,rawNum:v.l,rowNum:v.l+1,changed:[]};

          v.step = '2.2.3'; // 更新範囲(行)の更新
          v.a = v.l + 1;  // v.lは添字(0以上の整数)なので行番号(自然数)に変換
          v.maxRow = v.maxRow < v.a ? v.a : v.maxRow;
          v.minRow = v.minRow > v.a ? v.a : v.minRow;

          v.step = '2.2.4'; // 項目(raw,data)の更新
          for( v.j=0 ; v.j<v.map.length ; v.j++ ){
            v.step = '2.2.4.1';
            v.o = {colName: v.map[v.j]};
            v.o.colNum = p.colIdx[v.o.colName];
            v.o.before = p.data[v.i][v.o.colName];
            v.o.after = data[v.o.colName];
            if( v.o.before != v.o.after ){
              v.step = '2.2.4.2';
              p.raw[v.l][v.o.colNum-1] = v.o.after;
              p.data[v.i][v.o.colName] = v.o.after;
              v.maxCol = v.maxCol < v.o.colNum ? v.o.colNum : v.maxCol;
              v.minCol = v.minCol > v.o.colNum ? v.o.colNum : v.minCol;
              v.isUpdated = true;
              v.log.changed.push(v.o);
            }
          }

          v.step = '2.2.5'; // ログに行単位の更新記録を追加
          v.rv.push(v.log);
        }

        // 2.3.該当なし且つopt.appendの場合、appendメソッドに振る
        v.step = '2.3';
        if( v.isExist === false && opt.append ){
          opt.update = false;
          return p.append(data,opt);
        }

        // 3.更新範囲についてシートを更新
        v.step = '3';
        if( v.isUpdated ){
          v.range = p.sheet.getRange(v.minRow, v.minCol, (v.maxRow-v.minRow+1), (v.maxCol-v.minCol+1));
          v.sv = [];
          p.raw.slice(v.minRow-1,v.maxRow).forEach(x => v.sv.push(x.slice(v.minCol-1,v.maxCol)));
          v.range.setValues(v.sv);
        }

        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,data,opt)};  // update終了

    /** append: 行の追加
     * @param {any[]|any[][]|Object.<string, any>|Array.Object.<string, any>} data
     *  - 追加行の一次元配列または{項目名:値}形式のオブジェクト、またはその配列
     * @param {object|any} opt - オプション指定。非objならkey=rv.key,value=opt,append=trueと看做す
     * @param {string} [opt.key=rv.key] - キーとなる項目名
     * @param {any}    opt.value - キー値
     * @param {boolean} [opt.update=true] - trueならキー値が存在するならupdate
     * @returns {szSheetChanged[]} 更新結果
     */
    v.step = '4.4 append';
    v.rv.append = (data,opt) => {return ((p,data,opt)=>{
      const v = {whois:p.whois+'.append',rv:[]};
      try {
        console.log(v.whois+' start.\n',data);

        // 1.事前処理
        // 1.1.パラメータの既定値設定
        v.step = '1.1';
        if( !opt || typeof opt === 'string' ){
          v.opt = {
            key: p.key,
            value: opt,
            update: true,
          }
        } else {
          v.opt = opt;
          v.opt.key = typeof opt.key === 'undefined' ? p.key : opt.key;
          v.opt.update = typeof opt.value === 'undefined' ? true : opt.update;
        }
        // 1.2.追加データを強制的に二次元に変換
        v.step = '1.2';
        switch(whichType(data)){
          case 'Object': v.data = [data]; break;
          case 'Array':
            v.type = whichType(data[0]);
            v.data = v.type !== 'Array' && v.type !== 'Object'? v.data = [data] : data;
            break;
          default: 
            throw new Error('行データの形式が不適切です');
        }

        // 2.追加データが配列ならオブジェクトに変換
        v.step = '2';
        for( v.i=0 ; v.i<v.data.length ; v.i++ ){
          v.obj = v.data[v.i];
          if( whichType(v.obj) === 'Array' ){
            v.obj = {};
            for( v.j=0 ; v.j<v.data[v.i].length ; v.j++ ){
              if( v.data[v.i][v.j] ){ // nullや空文字列は除外
                v.obj[p.keys[v.j]] = v.data[v.i][v.j];
              }
            }
          }

          // 3.既定値設定項目が空なら既定値を追加
          v.step = '3';
          v.dMap = Object.keys(p.default);
          for( v.j=0 ; v.j<v.dMap.length ; v.j++ ){
            if( typeof v.obj[v.dMap[v.j]] === 'undefined' ){
              v.obj[v.dMap[v.j]] = p.default[v.dMap[v.j]];
            }
          }

          // 4.追加データにキー項目が指定されているか判断
          v.step = '4';
          if( v.opt.key === null || typeof v.obj[v.opt.key] === 'undefined' ){
            // 4a.キー項目の値が追加データ(引数'data')に不在
            v.step = '4a';
            // 4aa.rv.key === null -> そのまま追加(何もしない)
            // 4ab.rv.key !== null -> キー項目の値を補完して追加
            if( v.opt.key !== null ){
              v.step = '4ab';
              v.obj[v.opt.key] = 0;
              for( v.j=0 ; v.j<p.data.length ; v.j++ ){
                v.n = Number(p.data[v.j][v.opt.key]);
                if( v.obj[v.opt.key] < v.n ){
                  v.obj[v.opt.key] = v.n;
                }
              }
              v.obj[v.opt.key] += 1;
            }
          } else {
            // 4b.キー項目の値が追加データに存在するかチェック
            v.step = '4b';
            v.flag = false;
            for( v.j=0 ; v.j<p.data.length ; v.j++ ){
              if( v.obj[v.opt.key] == p.data[v.j][v.opt.key] ) v.flag = true;
            }
            if( v.flag ){
              // 4ba.キー項目の値が未登録 -> そのまま追加(何もしない)
              // 4bb.キー項目の値が登録済(シートのキー項目欄に存在)
              v.step = '4bb';
              if( v.opt.update ){
                // 4bba. v.opt.update === true -> updateとして処理
                v.step = '4bba';
                v.opt.value = v.obj[v.opt.key];
                v.opt.append = false;
                if((v.r=p.update(v.obj,v.opt)) instanceof Error) throw v.r;
                v.rv.push(v.r);
                continue;
              } else {
                // 4bbb. v.opt.update === false -> エラー
                v.step = '4bbb';
                throw new Error('指定されたキーで既に登録されています');
              }
            }
          }

          // 5. 作成したオブジェクトを追加
          // 5.1.append用配列を作成、シートに追加
          v.step = '5.1';
          v.arr = [];
          for( v.j=0 ; v.j<p.keys.length ; v.j++ ){
            v.arr.push(v.obj[p.keys[v.j]] || null);
          }
          p.sheet.appendRow(v.arr);
          // 5.2.結果オブジェクト(szSheetChanged)を作成
          v.step = '5.2';
          v.rv.push({
            func: 'append',
            dataNum: p.data.length, // 更新・追加行のrv.data上の添字
            rawNum: p.raw.length, // 更新・追加行のrv.raw上の添字
            rowNum: p.raw.length + p.headerRow + 1, // 更新・追加行のスプレッドシート上の行番号
            changed: ((obj)=>{ // 更新・追加により変化した欄とその値
              const rv = [];
              Object.keys(obj).forEach(x => {
                rv.push({ // changedColumns - szSheet.update/appendで更新・追加により変化した欄とその値
                  colName: x, // 更新・追加により値が変化した項目名
                  colNum: p.colIdx[x],  // 同列番号(自然数)
                  before: '', // 修正前の値
                  after: obj[x],  // 修正後の値
                });
              });
              return rv;
            })(v.obj),
          });
          // 5.3.関連するメンバを更新
          v.step = '5.3';
          p.lastRow += 1;
          p.raw.push(v.arr);
          p.data.push(v.obj);
        }

        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,data,opt)};  // append終了

    /** delete: 行の削除
     * @param {Object.<string, any>} cond - 削除条件。項目名:値が「全て」該当する行を削除
     * @returns {szSheetChanged[]} 更新結果
     */
    v.step = '4.5 delete';
    v.rv.delete = (cond) => {return ((p,cond)=>{
      const v = {whois:p.whois+'.delete',rv:[]};
      try {
        console.log(v.whois+' start.\ncond='+JSON.stringify(cond));

        // 1.事前準備
        v.step = '1';
        v.cond = cond;
        v.map = Object.keys(v.cond);

        // 2.逆順に一件ずつ確認
        for( v.i=p.data.length-1 ; v.i>=0 ; v.i-- ){
          // 2.1.該当するか判断
          v.step = '2.1';
          v.flag = true;
          for( v.j=0 ; v.j<v.map.length ; v.j++ ){
            v.r = p.isEqual(v.cond[v.map[v.j]],p.data[v.i][v.map[v.j]]);
            if( v.r instanceof Error ) throw v.r;
            if( v.r === false ) v.flag = false;
          }
          if( v.flag === true ){
            // 2.2.該当した場合、削除処理
            v.step = '2.2';
            v.rObj = {
              func: 'delete',
              dataNum: v.i,
              rawNum: p.headerRow+v.i,
              rowNum: p.headerRow+v.i+1,
              changed: {...p.data[v.i]}
            }
            v.rv.push(v.rObj);
            p.sheet.deleteRow(v.rObj.rowNum);
            p.lastRow -= 1;
            p.raw.splice(v.rObj.rawNum,1);
            p.data.splice(v.rObj.dataNum,1);
          }
        }

        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,cond)};  // delete終了

    /** objectize: 階層形式のシートをオブジェクト化
     * @param {number|string} stCol - 分類の開始列番号(自然数)、または項目名
     * @param {number|string} edCol - 分類の終了列番号(自然数)、または項目名
     * @param {string|string[]} [valid] - データとして取得したい項目名。省略すると分類範囲列以外の全項目。
     * @returns {Object.<string, any>} 変換結果
     */
    v.step = '4.6 objectize';
    v.rv.objectize = (stCol,edCol,valid) => {return ((p,stCol,edCol,valid)=>{
      const v = {whois:p.whois+'.objectize',rv:{}};
      try {
        console.log(v.whois+' start.\nstCol='+stCol+', edCol='+edCol+', valid='+valid);

        v.arr = [p.keys];
        for( v.i=p.headerRow ; v.i<p.raw.length ; v.i++ ){
          v.arr.push(p.raw[v.i]);
        }
        v.rv = objectize(v.arr,stCol,edCol,valid);
        if( v.rv instanceof Error ) throw v.rv;

        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,stCol,edCol,valid)};  // objectize終了

    // 5.メソッドへの受渡用のメンバ変数のオブジェクトを作成
    v.step = '5';
    const members = {whois:v.whois};
    Object.keys(v.rv).forEach(x => members[x] = v.rv[x]);
    v.rv.members = members;

    console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
  } catch(e) {
    console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
    v.rv = e;
  } finally {
    return v.rv;
  }
}
