/** descObj: Googleドライブ上のファイル詳細情報内「説明」欄の設定項目
 * @typedef {Object} descObj
 * @property {string} date - 取引日
 * @property {string} summary - 品名(摘要)
 * @property {string} price - 価格
 * @property {string} method - 支払方法。AMEX, 役員借入金, SMBCから振込, 等
 * @property {string} note - 備考 
 */

/** fileInfo: ファイル属性情報のオブジェクト
 * @typedef {Object} fileInfo
 * @property {string} name - ファイル名
 * @property {string} id - ファイルID
 * @property {string} url - URL
 * @property {string} created - 生成日時(UNIX時刻)
 * @property {string} updated - 最終変更日時(UNIX時刻)
 * @property {string} status - 前回提出分からの状態変化。append/update/delete/steady
 * @property {descObj} desc - 「説明」に設定されたJSON文字列
 */

 function doGet() {
  const data = main();
  const response = ContentService.createTextOutput();
  response.setMimeType(MimeType.JSON);
  response.setContent(JSON.stringify(data));
  return response;  
}

/** main: 主処理
 * @desc 引数・戻り値ともに無し。結果はシートに出力
 * 【事前準備】
 * 対象フォルダ配下の各ファイルは事前に「詳細 > 説明欄」にJSON形式で情報を追加しておく。
 * テンプレート：{"date":"2023//","summary":"","price":0,"method":"役員借入金"}
 * 
 * 証憑台帳「履歴」シート上で不要な行は削除しておく
 */
function main(){
  console.log('main start.');
  const v = {
    sheet:{ // シート関係の定義、オブジェクト
      spread: SpreadsheetApp.getActiveSpreadsheet(), 
      list: ['folder','log','transport'], // 作業対象シート名のリスト
      folder:{name:'フォルダ',range:'a3:j',obj:null,
        isReg: 8,id: 9  // 規則、フォルダID列の配列上の添字
      },
      log:{name:'履歴',range:'a2:b',obj:null,
        current: null,  // 履歴シート上で処理日のデータがあった場合の行番号
      },
      transport: {name:'交通費',range:'a2:h',obj:null,map:{
        0:'date'       , date       :0,  // A列：日付
        1:'perpose'    , perpose    :1,  // B列：目的
        2:'destination', destination:2,  // C列：行先
        3:'sub'        , sub        :3,  // D列：補助
        4:'path'       , path       :4,  // E列：経路
        5:'number'     , number     :5,  // F列：人数
        6:'amount'     , amount     :6,  // G列：金額
        7:'note'       , note       :7,  // H列：備考
      }},
    },
    folder: null, // フォルダのシートイメージ(二次元配列)
    log: null, // 履歴のシートイメージ
    transport: null, // 交通費のシートイメージ
    last:{  // 前回送信データ
      files:{}, // {ファイルID:ファイル情報オブジェクト}
      transport:{}, // {ID:交通費行データ}
    }, 
    // 今回送信分current:{range:null,data:[]}, 
    current: { // main()の戻り値＝今回送信データ
      fy: null, // 処理対象の会計年度
      last: null, // 前回送信日
      files: [],      // Google Drive上のファイル情報
      transport: [],  // 交通費明細
    },
    today: dateStr(), // 今日(処理日)の日付。yyyy/MM/dd形式の文字列
    getFY: (arg=new Date()) => {
      const v = {ymd:dateStr(arg)};
      if( v.ymd === null ) return null;
      v.m = v.ymd.match(/(\d{4})\/(\d{2}\/\d{2})/);
      // 10月末日までは前年、11月以降は当年
      return Number(v.m[1]) - (v.m[2]<'11/01'?1:0);
    },
  };

  try {
    // 事前準備
    preparation(v);

    // 前回送信データの特定、v.lastへのセット
    setLast(v);
    console.log('l.78',v.current.last,v.sheet.log.current);

    // ファイル情報の取得
    setFiles(v);
    console.log('l.82',v.current.files.length,v.current.files[0])

    // 交通費の取得
    setTransport(v);
    console.log('l.86',v.current.transport.length,v.current.transport[0])

    // 今回送信結果の記録
    v.range = 'a' + v.sheet.log.current + ':b' + v.sheet.log.current;
    v.data = [v.today, JSON.stringify(v.current)];
    v.sheet.log.obj.getRange(v.range).setValues([v.data]);
    
    console.log('main end.');
    return v.current;
  } catch(e) {
    console.error(e.stack);
  }
}

/** dateStr: 日付Objを文字列に変換 */
function dateStr(date=new Date()){
  const v = new Date(date);
  // 日付にできない引数はnullを返す
  if( isNaN(v.getTime()) ) return null;
  const rv = v.getFullYear()
  + '/' + ('0'+(v.getMonth()+1)).slice(-2)
  + '/' + ('0'+v.getDate()).slice(-2);
  return rv;
}

/** preparation: 事前準備 */
function preparation(mainV){
  console.log('preparation start.');
  const v = {};

  // シートデータの一括読み込み
  mainV.sheet.list.forEach(n => {
    mainV.sheet[n].obj = mainV.sheet.spread.getSheetByName(mainV.sheet[n].name);
    mainV.range = mainV.sheet[n].range + mainV.sheet[n].obj.getLastRow();
    mainV[n] = mainV.sheet[n].obj.getRange(mainV.range).getValues();
  });

  // 会計年度の計算
  mainV.current.fy = mainV.getFY();

  console.log('preparation end.');
}

/** setLast: 前回送信日および送信内容の取得 */
function setLast(mainV){
  console.log('setLast start.');
  const v = {last:null,data:null};
  try {
    // 履歴シート上で追加する場合の行番号
    mainV.sheet.log.current = mainV.sheet.log.obj.getLastRow() + 1;

    // 本日より前の最新の作成日を持つ行のデータを取得
    mainV.log.forEach((o,i) => {
      v.date = dateStr(o[0]); // 作成日をyyyy/MM/dd形式に変換
      // 前回送信日の判定
      if( v.date < mainV.today && ( v.last === null || v.last < v.date )){
        mainV.current.last = v.date;  // 前回更新日
        v.data = JSON.parse(o[1]);
      } else if( v.date === mainV.today ){
        // 履歴シート上で処理日のデータがあった場合の行番号
        mainV.sheet.log.current = i + 2;
      }
    });

    // 前回のファイル情報
    v.data.files.forEach(o => {
      // 前回送信のファイル情報内で、前回時点で削除済だったものは除外
      if( !o.hasOwnProperty('status') || o.status !== 'delete' ){
        v.id = o.url.match(/drive.google.com\/file\/d\/(.+?)\//)[1];
        mainV.last.files[v.id] = o;  // {ID:ファイル情報オブジェクト}
      }
    });

    // 前回の交通費
    v.data.transport.forEach(o => {
      v.fy = mainV.getFY(o.date);
      // 会計年度が異なる行は除外
      if( v.fy === mainV.current.fy ){
        // 前回送信のファイル情報内で、前回時点で削除済だったものは除外
        if( !o.hasOwnProperty('status') || o.status !== 'delete' ){
          console.log(o);
          v.md5 = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, JSON.stringify(o));
          //v.md5 = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, o.join());
          mainV.last.transport[v.md5] = o;  // {ID:交通費行データ}
        }
      }
    });

    console.log('setLast end.');
  } catch(e){throw e;}
}

/** setFiles: 指定フォルダ配下のファイル情報を取得
 * @param {*} mainV 
 * @returns {void}

 * 【参考】
 * GoogleドライブのファイルID・ファイル名・URLを一括で取得する
 *   https://tetsuooo.net/gas/42/
 * GAS googleドライブ内のファイルの説明を取得する
 *   https://mebee.info/2022/11/08/post-79806/
 */
function setFiles(mainV){
  console.log('setFiles start.');
  const v = {current:[] /* 今回送信されるファイルIDの配列 */};
  try {
    mainV.folder.forEach(x => {
      v.isReg = x[mainV.sheet.folder.isReg];
      v.folderId = x[mainV.sheet.folder.id];
      if( v.folderId.length > 0 ){
        //フォルダ内のすべてのファイルを取得
        v.folder = DriveApp.getFolderById(v.folderId);
        v.files = v.folder.getFiles();
        while(v.files.hasNext()){

          v.file = v.files.next();
          // ファイル情報オブジェクトを生成
          v.obj = {
            isReg: v.isReg,
            name: v.file.getName(),
            created: v.file.getDateCreated().getTime(),  // UNIX時刻
            updated: v.file.getLastUpdated().getTime(),
            url: v.file.getUrl(),
          };
          v.id = v.file.getId();
          v.current.push(v.id);
      
          // 「説明」に設定されたJSONの全項目を追加
          v.desc = v.file.getDescription() || '';
          if( v.desc.length > 0 ){
            v.desc = JSON.parse(v.desc);
            v.obj = Object.assign(v.obj,v.desc);
          }
      
          // statusの判定
          //   説明欄に「status='delete'」が設定されている ⇒ status='delete'
          //     ※前回提出後、重複に気づいて削除した場合等を想定
          //   説明欄に「status='delete'」が設定されていない
          //     lastに同一IDが存在する
          //       最終更新日時がlastと一致 ⇒ status='steady'
          //       最終更新日時がlastと不一致 ⇒ status='update'
          //     lastに同一IDが存在しない ⇒ status='append'
          if( !v.obj.hasOwnProperty('status') || v.obj.status != 'delete' ){
            v.obj.status = !mainV.last.files.hasOwnProperty(v.id) ? 'append'
            : (v.obj.updated === mainV.last.files[v.id].updated ? 'steady' : 'update');
          }

          // ファイル情報オブジェクトを登録
          mainV.current.files.push(v.obj);
        }
      }
    });

    // 前回提出以降に削除されたファイル情報を追加
    for( v.lastId in mainV.last.files ){
      if( !v.current.includes(v.lastId) ){
        v.obj = Object.assign(mainV.last.files[v.lastId],{status:'delete'});
        mainV.current.files.push(v.obj);
      }
    }

    console.log('setFiles end.');
  } catch(e){throw e;}
}

/** setTransport: 交通費オブジェクトを取得 */
function setTransport(mainV){
  console.log('setTransport start.');
  const v = {current:[]};
  try {
    // 現在の交通費シートの行を順次処理
    mainV.transport.forEach(o => {
      v.fy = mainV.getFY(o[mainV.sheet.transport.map.date]);
      // 会計年度が異なる行は除外
      if( v.fy === mainV.current.fy ){
        // 行情報のMD5をIDとして使用
        v.md5 = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, o.join());
        v.current.push(v.md5);
        // 行情報(配列)をオブジェクト化
        v.obj = {};
        for( v.x in mainV.sheet.transport.map ){
          if( isNaN(v.x) ){
            v.obj[v.x] = o[mainV.sheet.transport.map[v.x]];
          }
        }
        v.obj.date = dateStr(v.obj.date);  // 日付は文字列化
        // statusの判定
        //   前回提出分に同一IDが存在 ⇒ 'steady'
        //   前回提出分に同一IDが不在 ⇒ 'append'
        v.obj.status = mainV.last.transport.hasOwnProperty(v.md5)
          ? 'steady' : 'append';
        
        // 交通費情報を登録
        mainV.current.transport.push(v.obj);
      }
    });

    // 前回提出以降に削除された交通費情報を追加
    for( v.lastId in mainV.last.transport ){
      if( !v.current.includes(v.lastId) ){
        v.obj = Object.assign(mainV.last.transport[v.lastId],{status:'delete'});
        mainV.current.transport.push(v.obj);
      }
    }

    console.log('setTransport end.');
  } catch(e){throw e;}
}