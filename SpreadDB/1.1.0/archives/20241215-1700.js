function SpreadDbTest(){
  const v = {whois:'SpreadDbTest',step:0,rv:null,
    // ----- 定数・ユーティリティ関数群
    spread: SpreadsheetApp.getActiveSpreadsheet(),
    deleteSheet: (sheetName) => {  // テスト用シートの削除関数
      v.sheet = v.spread.getSheetByName(sheetName);
      if( v.sheet !== null ) v.spread.deleteSheet(v.sheet);
    },
    raw2obj: sheet => { // シートイメージ(二次元配列)を行オブジェクトに変換
      v.data = JSON.parse(JSON.stringify(v.src[sheet].values));
      v.src[sheet].values = [];
      for( v.i=1 ; v.i<v.data.length ; v.i++ ){
        v.o = {};
        for( v.j=0 ; v.j<v.data[v.i].length ; v.j++ ){
          if( v.data[v.i][v.j] ) v.o[v.data[0][v.j]] = v.data[v.i][v.j];
        }
        v.src[sheet].values.push(v.o);
      }
    },
    // ----- テスト用ソース(サンプルデータ)
    src: {
      PL: {
        name: 'PL',
        values: [
          ['大','中','勘定科目','一覧存否','L1','L2','SQ','本籍'],
          ['売上高','','','',1,'','',''],
          ['','売上高','','',1,1,'',''],
          ['','','売上高',22,1,1,1,'貸'],
          ['','売上原価','','',1,2,'',''],
          ['','','仕入高',-1,1,2,1,'借'],
          ['','','仕入値引高',-1,1,2,2,'借'],
          ['','','仕入割戻し高',-1,1,2,3,'借'],
          ['売上総利益','','','',2,'','',''],
          ['','販売費および一般管理費','','',2,1,'',''],
          ['','','役員報酬',35,2,1,1,'借'],
          ['','','給料',-1,2,1,2,'借'],
          ['','','賞与',-1,2,1,3,'借'],
          ['','','退職金',-1,2,1,4,'借'],
          ['','','法定福利費',52,2,1,5,'借'],
          ['','','福利厚生費',57,2,1,6,'借'],
          ['','','販売促進費',-1,2,1,7,'借'],
          ['','','外注費',24,2,1,8,'借'],
          ['','','広告宣伝費',29,2,1,9,'借'],
          ['','','荷造運賃',-1,2,1,10,'借'],
          ['','','会議費',9,2,1,11,'借'],
          ['','','交際費',8,2,1,12,'借'],
          ['','','寄附金',25,2,1,13,'借'],
          ['','','旅費交通費',40,2,1,14,'借'],
          ['','','通信費',63,2,1,15,'借'],
          ['','','新聞図書費',39,2,1,16,'借'],
          ['','','地代家賃',21,2,1,17,'借'],
          ['','','水道光熱費',48,2,1,18,'借'],
          ['','','修繕費',12,2,1,19,'借'],
          ['','','消耗品費',53,2,1,20,'借'],
          ['','','事務用品費',7,2,1,21,'借'],
          ['','','賃借料',-1,2,1,22,'借'],
          ['','','支払報酬料',37,2,1,22,'借'],
          ['','','支払手数料',38,2,1,22,'借'],
          ['','','保険料',11,2,1,23,'借'],
          ['','','租税公課',58,2,1,24,'借'],
          ['','','諸会費',60,2,1,26,'借'],
          ['','','雑費',70,2,1,27,'借'],
          ['','','減価償却費',55,2,1,25,'借'],
          ['','','長期前払費用償却',66,2,1,25,'借'],
          ['営業利益','','','',3,'','',''],
          ['','営業外収益','','',3,1,'',''],
          ['','','受取利息',18,3,1,1,'貸'],
          ['','','受取配当金',-1,3,1,2,'貸'],
          ['','','有価証券売却益',-1,3,1,3,'貸'],
          ['','','有価証券評価益',-1,3,1,4,'貸'],
          ['','','為替差益',-1,3,1,5,'貸'],
          ['','','雑収入',33,3,1,6,'貸'],
          ['','営業外費用','','',3,2,'',''],
          ['','','支払利息',36,3,2,1,'借'],
          ['','','有価証券評価損',-1,3,2,2,'借'],
          ['','','創立費償却',-1,3,2,3,'借'],
          ['','','開業費償却',-1,3,2,4,'借'],
          ['','','貸倒損失',6,3,2,5,'借'],
          ['','','雑損失',69,3,2,6,'借'],
          ['経常利益','','','',4,'','',''],
          ['','特別利益','','',4,1,'',''],
          ['','','固定資産売却益',19,4,1,1,'貸'],
          ['','','投資有価証券売却益',-1,4,1,2,'貸'],
          ['','','貸倒引当金戻入額',-1,4,1,3,'貸'],
          ['','特別損失','','',4,2,'',''],
          ['','','固定資産売却損',-1,4,2,1,'借'],
          ['','','固定資産除却損',-1,4,2,2,'借'],
          ['','','投資有価証券売却損',-1,4,2,3,'借'],
          ['税前利益','','','',5,'','',''],
          ['','法人税・住民税及び事業税','','',5,1,'',''],
          ['','','法人税',-1,5,1,1,'借'],
          ['','','住民税',-1,5,1,2,'借'],
          ['','','事業税',-1,5,1,3,'借'],
          ['','','法人税等',49,5,1,4,'借'],
          ['当期利益','','','',6,'','',''],
          ['','','当期利益',32,6,'',1,'借'],
        ],
      },
      master: { // "master"シート
        name: 'master',
        account: 'hoge',
        values: [
          ['タイムスタンプ','メールアドレス','申込者氏名','申込者カナ','申込者の参加','宿泊、テント','引取者氏名','参加者01氏名','参加者01カナ','参加者01所属','参加者02氏名','参加者02カナ','参加者02所属','参加者03氏名','参加者03カナ','参加者03所属','参加者04氏名','参加者04カナ','参加者04所属','参加者05カナ','参加者05氏名','参加者05所属','緊急連絡先','ボランティア募集','備考','キャンセル','authority','CPkey','entryNo','trial','editURL','entryTime','receptionist','fee00','fee01','fee02','fee03','fee04','fee05','memo'],
          ['2024/10/06 19:51:06','nakaone.kunihiro@gmail.com','島津　邦浩','シマヅ　クニヒロ','スタッフとして申込者のみ参加(おやじの会メンバ)','宿泊しない','','','','','','','','','','','','','','','','','','','','','2','jZiM1isJ+1AZoVZ9NnWTvCoeghCm+FY05eb6jhz8wpT3DwqJbNnszW8PWDd3sq0N5mjN/Nshh+RGGrdkm7CC+sO32js+wm1YmYGr0FMaFxvMBDrWzyJ7qrPI4unbx2IkrPkXSmSEbw91n/LOu0x7br106XeJ9TXJbJS16rV0nzs=','1','{"passcode":920782,"created":1728874149915,"result":0,"log":[{"timestamp":1728874165893,"enterd":920782,"status":1}]}','https://docs.google.com/forms/d/e/ULQ/viewform?edit2=2_ePpXliGgMlVVUYiSKgwX6SXBNrnwozwTMF09Ml1py7Ocp1N7_w5F7uqf52Ak63zBE','','','','','','','','',''],
          ['2024/09/15 12:47:04','via1315r@yahoo.co.jp','前田　素直','マエダ　スナオ','参加予定(宿泊なし)','宿泊しない','宿泊予定なので不要','前田　若菜','マエダ　ワカナ','1年生','','','','','','','','','','','','','9013357002','できる','食事以外でも、お手伝い出来る事があれば。','','1','','2','','https://docs.google.com/forms/d/e/ULQ/viewform?edit2=2_dWLvuoT6Wq0Hu-4tqFl5OyTK-Z7EwdMDEQGS1jKJVIa41Dh8nNJPtpFyPu8cyZYGo','','','','','','','','',''],
          ['2024/09/15 13:51:37','kousuke.murata4690@gmail.com','小早川　晃祐','コバヤカワ　コウスケ','参加予定(宿泊あり)','宿泊する(テントあり)','宿泊予定なので不要','小早川　涼','コバヤカワ　リョウ','6年生','','','','','','','','','','','','','','できる','','','1','','3','','https://docs.google.com/forms/d/e/ULQ/viewform?edit2=2_fKjD-xj5FN0GnTNIILVeJVwYJajCP8bZphy1zyleVl8UDLWqzUjDDFWZf7uMA0qtk','','','','','','','','',''],
          ['2024/09/15 14:18:02','nakaone2001@gmail.com','島津　弘子','シマヅ　ヒロコ','参加予定(宿泊なし)','宿泊しない','','島津　悠奈','シマヅ　ユウナ','4年生','','','','','','','','','','','','','','','','','2','k5lfKMj3ybfMF6jocHPln98lLJIBIxKrrpLc4RhPenBIEg6OfgdXYQAVh907SoCg0MEBazhWic2oFaKNFJu9pa4prXWvTzYjRWw5XkmC9a7AdNQ0judVMATii7Xqp6drowisY6+Rul2zwrF2UKY8epoYP8ZkX9RyH6OFyglYQL8=','4','{"passcode":65698,"created":1729076868102,"result":0,"log":[{"timestamp":1728729400367,"enterd":119192,"status":1}]}','https://docs.google.com/forms/d/e/ULQ/viewform?edit2=2_eGXR29gyuz_kc4UMghOrIa_iNPhrkHdrW4zVI8KFW5aB2jsVCtjq79aasCFBWgTvI','','','','','','','','',''],
        ],
        cols: [
          {name:'タイムスタンプ',type:'Date'},
          {name:'メールアドレス',type:'string',unique:true},
          {name:'申込者氏名',type:'string'},
          {name:'申込者カナ',type:'string'},
          {name:'申込者の参加',type:'string'},
          {name:'宿泊、テント',type:'string'},
          {name:'引取者氏名',type:'string'},
          {name:'参加者01氏名',type:'string'},
          {name:'参加者01カナ',type:'string'},
          {name:'参加者01所属',type:'string'},
          {name:'参加者02氏名',type:'string'},
          {name:'参加者02カナ',type:'string'},
          {name:'参加者02所属',type:'string'},
          {name:'参加者03氏名',type:'string'},
          {name:'参加者03カナ',type:'string'},
          {name:'参加者03所属',type:'string'},
          {name:'参加者04氏名',type:'string'},
          {name:'参加者04カナ',type:'string'},
          {name:'参加者04所属',type:'string'},
          {name:'参加者05カナ',type:'string'},
          {name:'参加者05氏名',type:'string'},
          {name:'参加者05所属',type:'string'},
          {name:'緊急連絡先',type:'string'},
          {name:'ボランティア募集',type:'string'},
          {name:'備考',type:'string'},
          {name:'キャンセル',type:'string'},
          {name:'authority',type:'number'},
          {name:'CPkey',type:'string'},
          {name:'entryNo',type:'number',primaryKey:true,auto_increment:[10,1]},
          {name:'trial',type:'JSON'},
          {name:'editURL',type:'string'},
          {name:'entryTime',type:'string'},
          {name:'receptionist',type:'string'},
          {name:'fee00',type:'string'},
          {name:'fee01',type:'string'},
          {name:'fee02',type:'string'},
          {name:'fee03',type:'string'},
          {name:'fee04',type:'string'},
          {name:'fee05',type:'string'},
          {name:'memo',type:'string'},
        ],
      },
    },
  };
  const pattern = { // テストパターン(関数)の定義
    constructor: [  // constructor関係のテスト
      () => { // "target"シートをシートイメージから新規作成
        v.deleteSheet('log');  // 既存なら削除
        v.deleteSheet('PL');  // 既存なら削除
        return SpreadDb(null,{tables:v.src.PL});
      },
    ],
  };
  console.log(`${v.whois} start.`);
  try {

    // テスト対象を絞る場合、以下のv.st,numの値を書き換え
    v.p = 'constructor'; v.st = 0; v.num = 1 || pattern[v.p].length;

    for( v.i=v.st ; v.i<v.st+v.num ; v.i++ ){
      v.rv = pattern[v.p][v.i]();
      if( v.rv instanceof Error ) throw v.rv;
      console.log(`===== pattern.${v.i} end.\n${stringify(v.rv)}`);
    }

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}

/** SpreadDb: Google Spreadに対してRDBのようなCRUDを行う
 * @param {Object[]} query=[] - 操作要求の内容
 * @param {Object} opt={} - オプション
 * 
 * - rev.1.0.0 -> rev.1.1.0 変更点
 *   - 上・左余白不可、複数テーブル/シート不可に変更(∵ロジックが複雑で保守性低下)
 *     - テーブル名とシート名が一致
 *     - 左上隅のセルはA1に固定
 *   - 「更新履歴」の各項目の並び・属性他について、シート上の変更は反映されない(システム側で固定)
 *   - 各シートの権限チェックロジックを追加(opt.account)
 *   - クロージャを採用(append/update/deleteをprivate関数化)
 *     - select文を追加(従来のclass方式ではインスタンスから直接取得)
 *     - インスタンスを返す方式から、指定された操作(query)の結果オブジェクトを返すように変更
 *   - getSchemaメソッドを追加
 *   - 旧版のgetLogは廃止(select文で代替)
 * - 仕様の詳細は[workflowy](https://workflowy.com/#/4e03d2d2c266)参照
 */
function SpreadDb(query=[],opt={}){
  const v = {step:0,rv:null};
  const pv = {whois:'SpreadDb'};  // private values: 擬似メンバ変数としてSpreadDb内で共有する値
  console.log(`${pv.whois} start.`);
  try {

    v.step = 1.1; // メンバ登録：起動時オプション
    pv.opt = Object.assign({
      user: null, // {number|string}=null ユーザのアカウント情報。nullの場合、権限のチェックは行わない
      account: null, // {string}=null アカウント一覧のテーブル名
      log: 'log', // {string}='log' 更新履歴テーブル名
      maxTrial: null, // number}=5 シート更新時、ロックされていた場合の最大試行回数
      interval: null, // number}=10000 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
    },opt);

    v.step = 1.2; // メンバ登録：内部設定項目
    Object.assign(pv,{
      spread: SpreadsheetApp.getActiveSpreadsheet(), // Spread} スプレッドシートオブジェクト
      sheet: {}, // Object.<string,Sheet>} スプレッドシート上の各シート
      table: {}, // sdbTable[]} スプレッドシート上の各テーブル(領域)の情報
      log: [], // {sdbLog[]}=null 更新履歴シートオブジェクト
    });

    v.step = 2; // 変更履歴出力指定ありなら「変更履歴」テーブル情報の既定値をpv.tableに追加
    if( pv.opt.log ){
      pv.table[pv.opt.log] = genTable({
        name: pv.opt.log,
        cols: [
          {name:'id',type:'UUID',note:'ログの一意キー項目',primaryKey:true,default:()=>Utilities.getUuid()},
          {name:'timestamp',type:'string',note:'更新日時。yyyy-MM-ddThh:mm:ss.nnn+hh:mm形式',default:()=>toLocale(new Date())},
          {name:'account',type:'string|number',note:'更新者の識別子',default:(o={})=>o.account||null},
          {name:'range',type:'string',note:'更新対象となった範囲名(テーブル名)',default:(o={})=>o.range||null},
          {name:'action',type:'string',note:'操作内容。append/update/delete/getLogのいずれか',default:(o={})=>o.action||null},
          {name:'argument',type:'string',note:'操作関数に渡された引数',default:(o={})=>
            o.hasOwnProperty('argument')?(typeof o.argument === 'string' ? o.argument : JSON.stringify(o.argument)):null},
          {name:'result',type:'boolean',note:'true:追加・更新が成功',default:(o={})=>o.hasOwnProperty('result')?o.result:true},
          {name:'message',type:'string',note:'エラーメッセージ',default:(o={})=>o.message||null},
          {name:'before',type:'JSON',note:'更新前の行データオブジェクト',default:(o={})=>o.hasOwnProperty('before')?JSON.stringify(o.before):null},
          {name:'after',type:'JSON',note:'更新後の行データオブジェクト',default:(o={})=>o.hasOwnProperty('after')?JSON.stringify(o.after):null},
          {name:'diff',type:'JSON',note:'追加の場合は行オブジェクト、更新の場合は差分情報。{項目名：[更新前,更新後],...}形式',
            default:(o={})=>o.hasOwnProperty('diff')?JSON.stringify(o.diff):null},
        ],
      });
      if( pv.table[pv.opt.log] instanceof Error ) throw pv.table[pv.opt.log];
    }

    v.step = 9; // 終了処理
    console.log(`${pv.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${pv.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }

  /** transact: シートの操作
   *
   * @param trans {Object|Object[]} - 以下のメンバを持つオブジェクト(の配列)
   * @param trans.name {string} - 更新対象範囲名
   * @param trans.action {string} - 操作内容。"append", "update", "delete"のいずれか
   * @param trans.arg {Object|Object[]} - append/update/deleteの引数
   * @param opt={} {Object} - オプション
   * @param opt.getLogFrom=null {string|number|Date} - 取得する更新履歴オブジェクトの時刻指定
   * @param opt.getLogOption={} {Object} - getLogFrom≠nullの場合、getLogメソッドのオプション
   * @returns {Object|Object[]} opt.getLogForm=nullの場合、更新履歴オブジェクトの配列。≠nullの場合、{result:更新履歴オブジェクトの配列,data:getLogの戻り値}
   *
   * - GAS公式 Class LockService [getDocumentLock()](https://developers.google.com/apps-script/reference/lock/lock-service?hl=ja#getDocumentLock())
   * - Qiita [GASの排他制御（ロック）の利用方法を調べた](https://qiita.com/kyamadahoge/items/f5d3fafb2eea97af42fe)
   */
  function transact(trans,opt={}){
    const v = {whois:pv.whois+'.transact',step:0,rv:[]};
    console.log(`${v.whois} start.\ntrans(${whichType(trans)})=${stringify(trans)}\nopt=${stringify(opt)}`);
    try {

      v.step = 1; // 事前準備
      v.step = 1.1; // 引数transを配列化
      if( !Array.isArray(trans) ) trans = [trans];
      v.step = 1.2; // オプションに既定値を設定
      v.opt = Object.assign({
        getLogFrom: null,
        getLogOption: {},
      },opt);

      v.step = 2; // スプレッドシートをロックして更新処理
      v.lock = LockService.getDocumentLock();

      for( v.tryNo=pv.maxTrial ; v.tryNo > 0 ; v.tryNo-- ){
        if( v.lock.tryLock(pv.interval) ){
    
          v.step = 2.1; // シートの更新処理
          for( v.i=0 ; v.i<trans.length ; v.i++ ){
            if( ['append','update','delete'].find(x => x === trans[v.i].action) ){
              v.r = pv.tables[trans[v.i].name][trans[v.i].action](trans[v.i].arg);
              if( v.r instanceof Error ) throw v.r;
              v.rv = [...v.rv, ...v.r];
            }
          }
    
          v.step = 2.2; // 更新履歴の取得
          if( v.opt.getLogFrom !== null ){
            v.r = pv.getLog(v.opt.getLogFrom,v.opt.getLogOption);
            if( v.r instanceof Error ) throw v.r;
            v.rv = {result:v.rv,data:v.r};
          }
    
          v.step = 2.3; // ロック解除
          v.lock.releaseLock();
          v.tryNo = 0;
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

  /** genTable: sdbTableオブジェクトを生成
   * @param arg {Object}
   * @param arg.name {string} - シート名
   * @param [arg.cols] {sdbColumn[]} - 新規作成シートの項目定義オブジェクトの配列
   * @param [arg.values] {Object[]|Array[]} - 新規作成シートに書き込む初期値
   * @returns {sdbTable|Error}
   */
  function genTable(arg){
    const v = {whois:`${pv.whois}.genTable`,step:0,rv:null};
    console.log(`${v.whois} start.\narg=${JSON.stringify(arg)}`);
    try {
  
      // ----------------------------------------------
      v.step = 1; // メンバの初期化、既定値設定
      // ----------------------------------------------
      v.rv = {
        name: arg.name, // {string} テーブル名(範囲名)
        account: pv.opt.user ? pv.opt.user.id : null, // {string} 更新者のアカウント
        sheet: pv.spread.getSheetByName(arg.name), // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
        schema: null, // {sdbSchema} シートの項目定義
        values: [], // {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
        header: [], // {string[]} 項目名一覧(ヘッダ行)
        notes: [], // {string[]} ヘッダ行のメモ
        colnum: 0, // {number} データ領域の列数
        rownum: 0, // {number} データ領域の行数
      };
  
  
      if( v.rv.sheet !== null ){
        // ----------------------------------------------
        v.step = 2; // シートが存在する場合の戻り値作成処理
        // ----------------------------------------------
  
        v.step = 2.1; // シートイメージから各種情報を取得
        v.getDataRange = v.rv.sheet.getDataRange();
        v.getValues = v.getDataRange.getValues();
        v.rv.header = JSON.parse(JSON.stringify(v.getValues[0]));
        v.r = convertRow(v.getValues);
        if( v.r instanceof Error ) throw v.r;
        v.rv.values = v.r.obj;
        v.rv.notes = v.getDataRange.getNotes()[0];
        v.rv.colnum = v.rv.header.length;
        v.rv.rownum = v.rv.values.length;
  
        v.step = 2.3; // スキーマをインスタンス化
        v.r = genSchema({
          cols: [], // notesを優先するので空配列を指定
          header: v.rv.header,
          notes: v.rv.notes,
          values: v.rv.values,
        });
        if( v.r instanceof Error ) throw v.r;
        v.rv.schema = v.r.schema;
  
      } else {
        // ----------------------------------------------
        // シートが存在しない場合の戻り値作成処理
        // ----------------------------------------------
  
        if( arg.cols ){
  
          v.step = 3; // 項目定義が存在する場合
          v.rv.header = arg.cols.map(x => x.name);
          v.rv.colnum = v.rv.header.length;
          if( arg.values ){
            // 項目定義と初期データの両方存在 ⇒ 項目の並びを指定してconvertRow
            v.convertRow = convertRow(arg.values,v.rv.header);
            if( v.convertRow instanceof Error ) throw v.convertRow;
            v.rv.values = v.convertRow.obj;
            v.rv.rownum = v.convertRow.raw.length;
          } else {
            // 項目定義のみ存在 ⇒ values, rownumは取得不能なので既定値のまま
            v.convertRow = null;
          }
  
        } else {
          if( arg.values ){
            v.step = 4; // 項目定義不在で初期データのみ存在の場合
            v.convertRow = convertRow(arg.values);
            if( v.convertRow instanceof Error ) throw v.convertRow;
            v.rv.values = v.convertRow.obj;
            v.rv.header = v.convertRow.header;
            v.rv.colnum = v.rv.header.length;
            v.rv.rownum = v.convertRow.raw.length;  
          } else {
            // シートも項目定義も初期データも無いならエラー
            throw new Error(`シートも項目定義も初期データも存在しません`);            
          }
        }
  
        v.step = 5; // スキーマをインスタンス化
        v.r = genSchema({
          cols: arg.cols || null,
          header: v.rv.header,
          notes: v.rv.notes,
          values: v.rv.values,
        });
        if( v.r instanceof Error ) throw v.r;
        v.rv.schema = v.r.schema;
        v.rv.notes = v.r.notes;
  
        // ----------------------------------------------
        v.step = 6; // シートが存在しない場合、新規追加
        // ----------------------------------------------
        v.step = 6.1; // シートの追加
        v.rv.sheet = pv.spread.insertSheet();
        v.rv.sheet.setName(arg.name);
  
        v.step = 6.2; // シートイメージのセット
        v.data = [v.rv.header, ...(v.convertRow === null ? [] : v.convertRow.raw)];
        v.rv.sheet.getRange(1,1,v.data.length,v.rv.colnum).setValues(v.data);
  
        v.step = 6.3; // 項目定義メモの追加
        console.log(`l.391 v.rv.column=${JSON.stringify(v.rv.column)}\nv.rv.notes=${JSON.stringify(v.rv.notes)}`)
        v.rv.sheet.getRange(1,1,1,v.rv.colnum).setNotes([v.rv.notes]);
      }
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** genSchema: sdbSchemaオブジェクトを生成
   * @param arg {Object} - 対象テーブルのschemaオブジェクト
   * @param [arg.cols] {sdbColumn[]} - 項目定義オブジェクトの配列
   * @param [arg.header] {string[]} - ヘッダ行のシートイメージ(=項目名一覧)
   * @param [arg.notes] {string[]} - 項目定義メモの配列
   * @param [arg.values] {Object[]} - 初期データとなる行オブジェクトの配列
   * @returns {Object|Error}
   * 
   * - 戻り値のオブジェクト
   *   - schema {sdbSchema}
   *   - notes {string[]} ヘッダ行に対応したメモ
   */
  function genSchema(arg){
    const v = {whois:`${pv.whois}.genSchema`,step:0,rv:null};
    console.log(`${v.whois} start.`);
    try {
  
      // ----------------------------------------------
      v.step = 1; // メンバの初期化、既定値設定
      // ----------------------------------------------
      v.rv = {
        schema: {
          cols: arg.cols || [], // {sdbColumn[]} 項目定義オブジェクトの配列
          primaryKey: 'id', // {string}='id' 一意キー項目名
          unique: {}, // {Object.<string, any[]>} primaryKeyおよびunique属性項目の管理情報。メンバ名はprimaryKey/uniqueの項目名
          auto_increment: {}, // {Object.<string,Object>} auto_increment属性項目の管理情報。メンバ名はauto_incrementの項目名
            // auto_incrementのメンバ : base {number} 基数, step {number} 増減値, current {number} 現在の最大(小)値
          defaultRow: {}, // {Object.<string,function>} 既定値項目で構成されたオブジェクト。appendの際のプロトタイプ
        },
        notes: arg.notes || [], // ヘッダ行に対応したメモ
      };
  
  
      // -----------------------------------------------
      v.step = 2; // 項目定義オブジェクト(cols)の作成
      // -----------------------------------------------
      if( v.rv.schema.cols.length === 0 ){
        if( v.rv.notes.length > 0 ){
          v.step = 2.1; // シートにメモが存在していた場合、その内容から作成
          for( v.i=0 ; v.i<v.rv.notes.length ; v.i++ ){
            v.r = genColumn(v.rv.notes[v.i]);
            if( v.r instanceof Error ) throw v.r;
            v.rv.schema.cols.push(v.r.column);
          }
        } else {
          v.step = 2.2; // シートにメモが無かった場合、ヘッダ行の項目名から作成
          for( v.i=0 ; v.i<arg.header.length ; v.i++ ){
            v.r = genColumn(arg.header[v.i]);
            if( v.r instanceof Error ) throw v.r;
            v.rv.schema.cols.push(v.r.column);
            v.rv.notes.push(v.r.note);
          }
        }
      } else if( v.rv.notes.length === 0 ){
        v.step = 2.3; // 項目定義オブジェクトが渡された場合、notesのみを作成
        for( v.i=0 ; v.i<arg.cols.length ; v.i++ ){
          v.r = genColumn(arg.cols[v.i]);
          if( v.r instanceof Error ) throw v.r;
          v.rv.notes.push(v.r.note);
        }
      }
  
      // -----------------------------------------------
      v.step = 3; // v.rv.schema.cols以外のメンバ作成
      // -----------------------------------------------
      v.bool = arg => {  // 引数を真偽値として評価。真偽値として評価不能ならnull
        let rv={"true":true,"false":false}[String(arg).toLowerCase()];
        return typeof rv === 'boolean' ? rv : null
      };
      for( v.i=0 ; v.i<v.rv.schema.cols.length ; v.i++ ){
        v.step = 3.1; // primaryKey
        if( v.bool(v.rv.schema.cols[v.i].primaryKey) === true ){
          v.rv.schema.primaryKey = v.rv.schema.cols[v.i].name;
          v.rv.schema.unique[v.rv.schema.cols[v.i].name] = [];
        }
  
        v.step = 3.2; // unique
        if( v.bool(v.rv.schema.cols[v.i].unique) === true ){
          v.rv.schema.unique[v.rv.schema.cols[v.i].name] = [];
        }
  
        v.step = 3.3; // auto_increment
        // ※sdbColumnでauto_incrementなら配列、違うならfalse設定済
        if( v.rv.schema.cols[v.i].auto_increment && v.rv.schema.cols[v.i].auto_increment !== false ){
          v.rv.schema.auto_increment[v.rv.schema.cols[v.i].name] = v.rv.schema.cols[v.i].auto_increment;
          v.rv.schema.auto_increment[v.rv.schema.cols[v.i].name].current = v.rv.schema.auto_increment[v.rv.schema.cols[v.i].name].base;
        }
  
        v.step = 3.4; // default
        if( String(v.rv.schema.cols[v.i].default).toLowerCase() !== 'null' ){
          v.rv.schema.defaultRow[v.rv.schema.cols[v.i].name] = v.rv.schema.cols[v.i].default;
        }
      }
  
      // ------------------------------------------------
      v.step = 4; // unique,auto_incrementの洗い出し
      // ------------------------------------------------
      arg.values.forEach(vObj => {
        v.step = 4.1; // unique項目の値を洗い出し
        Object.keys(v.rv.schema.unique).forEach(unique => {
          if( vObj[unique] ){
            if( v.rv.schema.unique[unique].indexOf(vObj[unique]) < 0 ){
              v.rv.schema.unique[unique].push(vObj[unique]);
            } else {
              throw new Error(`${v.whois}:「${unique}」欄の値"${vObj[unique]}"は重複しています`);
            }
          }
        });
  
        v.step = 4.2; // auto_increment項目の値を洗い出し
        Object.keys(v.rv.schema.auto_increment).forEach(ai => {
          v.c = v.rv.schema.auto_increment[ai].current;
          v.s = v.rv.schema.auto_increment[ai].step;
          v.v = Number(vObj[ai]);
          if( (v.s > 0 && v.c < v.v) || (v.s < 0 && v.c > v.v) ){
            v.rv.schema.auto_increment[ai].current = v.v;
          }
        });
      });
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv=${JSON.stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** genColumn: sdbColumnオブジェクトを生成
   * @param arg {sdbColumn|string} - 項目定義オブジェクト、または項目定義メモまたは項目名
   * @returns {sdbColumn|Error}
   * 
   * - auto_incrementの記載ルール
   *   - null ⇒ 自動採番しない
   *   - boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない
   *   - number ⇒ 自動採番する(基数=指定値,増減値=1)
   *   - number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)
   * 
   * - 戻り値のオブジェクト
   *   - column {sdbColumn}
   *   - note {string[]} メモ用の文字列
   */
  function genColumn(arg={}){
    const v = {whois:'SpreadDb.genColumn',step:0,rv:{column:{},note:null},
      typedef:[ // sdbColumnの属性毎にname,type,noteを定義
        {name:'name',type:'string',note:'項目名'},
        {name:'type',type:'string',note:'データ型。string,number,boolean,Date,JSON,UUID'},
        {name:'format',type:'string',note:'表示形式。type=Dateの場合のみ指定'},
        {name:'options',type:'number|string|boolean|Date',note:'取り得る選択肢(配列)のJSON表現。ex.["未入場","既収","未収","無料"]'},
        {name:'default',type:'number|string|boolean|Date',note:'既定値'},
        {name:'primaryKey',type:'boolean',note:'一意キー項目ならtrue'},
        {name:'unique',type:'boolean',note:'primaryKey以外で一意な値を持つならtrue'},
        {name:'auto_increment',type:'null|bloolean|number|number[]',note:'自動採番項目'
          + '\n// null ⇒ 自動採番しない'
          + '\n// boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない'
          + '\n// number ⇒ 自動採番する(基数=指定値,増減値=1)'
          + '\n// number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)'
        },
        {name:'suffix',type:'string',note:'"not null"等、上記以外のSQLのcreate table文のフィールド制約'},
        {name:'note',type:'string',note:'本項目に関する備考。create table等では使用しない'},
      ],
      str2obj: (arg) => {
        const v = {whois:`${pv.whois}.genColumn.str2obj`,step:0,rv:null,
          rex: /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, // コメント削除の正規表現
          isJSON: (str) => {let r;try{r=JSON.parse(str)}catch(e){r=null} return r},
        };
        try {
    
          v.step = 1; // コメントの削除
          arg = arg.replace(v.rex,'');
    
          v.step = 2; // JSONで定義されていたらそのまま採用
          v.rv = v.isJSON(arg);
    
          if( v.rv === null ){
            v.step = 3; // 非JSON文字列だった場合、改行で分割
            v.lines = arg.split('\n');
    
            v.step = 4; // 一行毎に属性の表記かを判定
            v.rv = {};
            v.lines.forEach(prop => {
              v.m = prop.trim().match(/^["']?(.+?)["']?\s*:\s*["']?(.+)["']?$/);
              if( v.m ) v.rv[v.m[1]] = v.m[2];
            });
    
            v.step = 5; // 属性項目が無ければ項目名と看做す
            if( Object.keys(v.rv).length === 0 ){
              v.rv = {name:arg.trim()};
            }
          }
    
          v.step = 9; // 終了処理
          return v.rv;
    
        } catch(e) {
          e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
          console.error(`${e.message}\nv=${stringify(v)}`);
          return e;
        }
      },
    };
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {
  
      v.step = 1; // 引数が項目定義メモまたは項目名の場合、オブジェクトに変換
      if( whichType(arg,'String') ){
        arg = v.str2obj(arg);
        if( arg instanceof Error ) throw arg;
        v.rv.note = arg;
      }
  
      v.step = 2; // メンバに格納
      v.typedef.map(x => x.name).forEach(x => {
        v.rv.column[x] = arg.hasOwnProperty(x) ? arg[x] : null;
      });
  
      v.step = 3; // auto_incrementをオブジェクトに変換
      if( v.rv.column.auto_increment !== null && String(v.rv.column.auto_increment).toLowerCase() !== 'false' ){
        switch( whichType(v.rv.column.auto_increment) ){
          case 'Array': v.rv.column.auto_increment = {
            base: v.rv.column.auto_increment[0],
            step: v.rv.column.auto_increment[1],
          }; break;
          case 'Number': v.rv.column.auto_increment = {
            base: Number(v.rv.column.auto_increment),
            step: 1,
          }; break;
          default: v.rv.column.auto_increment = {
            base: 1,
            step: 1,
          };
        }
      } else {
        v.rv.column.auto_increment = false;
      }
  
      v.step = 4; // メモの文字列を作成
      if( v.rv.note === null ){
        v.x = [];
        for( v.a in v.rv.column ){
          v.l = `${v.a}: "${v.rv.column[v.a]}"`;
          v.c = v.typedef.find(x => x.name === v.a);
          if( v.c.hasOwnProperty('note') ) v.l += ` // ${v.c.note}`;
          v.x.push(v.l);
        }
        v.rv.note = v.x.join('\n');
      }
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv=${JSON.stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** convertRow: シートイメージと行オブジェクトの相互変換
   * @param {any[][]|Object[]} data - 行データ。シートイメージか行オブジェクトの配列
   * @param {string[]} [header]=[] - ヘッダ行。rowが行オブジェクトで項目の並びを指定したい場合に使用
   * @returns {Object}
   * 
   * - 戻り値のオブジェクト
   *   - raw {any[][]} シートイメージ
   *   - obj {Object[]} 行オブジェクトの配列
   *   - header {string} ヘッダ行
   */
  function convertRow(data,header=[]){
    const v = {whois:pv.whois+'.convertRow',step:0,rv:{}};
    console.log(`${v.whois} start.`);
    try {
  
      if( Array.isArray(data)[0] ){
        v.step = 1; // シートイメージ -> 行オブジェクト
        v.rv.raw = data;
        v.rv.obj = [];
        v.rv.header = data[0];
        for( v.i=0 ; v.i<data.length ; v.i++ ){
          v.o = {};
          for( v.j=0 ; v.j<data[v.i].length ; v.j++ ){
            if( data[v.i][v.j] ){
              v.o[data[0][v.j]] = data[v.i][v.j];
            }
          }
          v.rv.obj.push(v.o);
        }
      } else {
        v.step = 2; // 行オブジェクト -> シートイメージ
        v.rv.raw = [];
        v.rv.obj = data;
        v.rv.header = Object.keys(data[0]);
        for( v.map={},v.i=0 ; v.i<v.rv.header ; v.i++ ){
          v.map[v.rv.header[v.i]] = v.i;
        }
        for( v.i=0 ; v.i<data.length ; v.i++ ){
          v.arr = [];
          for( v.j in data[v.i] ){
            if( v.map[v.j] === undefined ){
              // 未登録の項目があれば追加
              v.map[v.j] = v.rv.header.length;
              v.rv.header.push(v.j);
            }
            v.arr[v.map[v.j]] = data[v.i][v.j];
          }
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
  /** selectRow: テーブルから該当行を抽出
   * @param {Object|Object[]} record=[] - 追加するオブジェクトの配列
   * @returns {sdbLog[]}
   */
  function selectRow(record){
    const v = {whois:`${pv.whois}.selectRow`,step:0,rv:[],argument:JSON.stringify(record)};
    console.log(`${v.whois} start.\nrecord(${whichType(record)})=${stringify(record)}`);
    try {
  
      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------
  
  
      v.step = 9; // 終了処理
      v.rv = v.log;
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** appendRow: 領域に新規行を追加
   * @param {Object|Object[]} record=[] - 追加するオブジェクトの配列
   * @returns {sdbLog[]}
   */
  function appendRow(record){
    const v = {whois:`${pv.whois}.appendRow`,step:0,rv:[],argument:JSON.stringify(record)};
    console.log(`${v.whois} start.\nrecord(${whichType(record)})=${stringify(record)}`);
    try {
  
      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------
      if( !Array.isArray(record)) record = [record];
      v.target = [];  // 対象領域のシートイメージを準備
      v.log = []; // 更新履歴のシートイメージを準備
  
      // ------------------------------------------------
      v.step = 2; // 追加レコードをシートイメージに展開
      // ------------------------------------------------
      v.header = pv.schema.cols.map(x => x.name);
      for( v.i=0 ; v.i<record.length ; v.i++ ){
  
        v.logObj = new sdbLog({account: pv.account,range: pv.name,
          action:'append',argument:v.argument});
  
        v.step = 2.1; // auto_increment項目の設定
        // ※ auto_increment設定はuniqueチェックに先行
        for( v.ai in pv.schema.auto_increment ){
          if( !record[v.i][v.ai] ){
            pv.schema.auto_increment[v.ai].current += pv.schema.auto_increment[v.ai].step;
            record[v.i][v.ai] = pv.schema.auto_increment[v.ai].current;
          }
        }
  
        v.step = 2.2; // 既定値の設定
        record[v.i] = Object.assign({},pv.schema.defaultRow,record[v.i]);
  
        v.step = 2.3; // 追加レコードの正当性チェック(unique重複チェック)
        for( v.unique in pv.schema.unique ){
          if( pv.schema.unique[v.unique].indexOf(record[v.i][v.unique]) >= 0 ){
            // 登録済の場合はエラーとして処理
            v.logObj.result = false;
            // 複数項目のエラーメッセージに対応するため配列化を介在させる
            v.logObj.message = v.logObj.message === null ? [] : v.logObj.message.split('\n');
            v.logObj.message.push(`${v.unique}欄の値「${record[v.i][v.unique]}」が重複しています`);
            v.logObj.message = v.logObj.message.join('\n');
          } else {
            // 未登録の場合pv.sdbSchema.uniqueに値を追加
            pv.schema.unique[v.unique].push(record[v.i][v.unique]);
          }
        }
  
        v.step = 2.4; // 正当性チェックOKの場合の処理
        if( v.logObj.result ){
          v.step = 2.41; // シートイメージに展開して登録
          v.row = [];
          for( v.j=0 ; v.j<v.header.length ; v.j++ ){
            v.row[v.j] = record[v.i][v.header[v.j]];
          }
          v.target.push(v.row);
  
          v.step = 2.42; // pv.valuesへの追加
          pv.values.push(record[v.i]);
  
          v.step = 2.43; // ログに追加レコード情報を記載
          v.logObj.after = v.logObj.diff = JSON.stringify(record[v.i]);
        }
  
        v.step = 2.5; // 成否に関わらずログ出力対象に保存
        v.log.push(v.logObj);
      }
  
      // ------------------------------------------------
      v.step = 3; // 対象シート・更新履歴に展開
      // ------------------------------------------------
      v.step = 3.1; // 対象シートへの展開
      if( v.target.length > 0 ){
        pv.sheet.getRange(
          pv.bottom+1,
          pv.left,
          v.target.length,
          v.target[0].length
        ).setValues(v.target);
      }
      // pv.sdbTable.bottomの書き換え
      pv.bottom += v.target.length;
  
      v.step = 3.2; // 変更履歴追記対象なら追記(変更履歴シートは追記対象外)
      if( pv.log !== null ){
        v.r = pv.log.append(v.log);
        if( v.r instanceof Error ) throw v.r;
      }
  
      v.step = 9; // 終了処理
      v.rv = v.log;
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** updateRow: 領域に新規行を追加
   * @param {Object|Object[]} trans=[] - 更新するオブジェクトの配列
   * @param {Object|Function|any} trans.where - 対象レコードの判定条件
   * @param {Object|Function} trans.record - 更新する値
   * @returns {sdbLog[]}
   *
   * - where句の指定方法
   *   - Object ⇒ {key:キー項目名, value: キー項目の値}形式で、key:valueに該当するレコードを更新
   *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
   *   - その他 ⇒ 項目定義で"primaryKey"指定された項目の値で、primaryKey項目が指定値なら更新
   * - record句の指定方法
   *   - Object ⇒ {更新対象項目名:セットする値}
   *   - Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
   *     【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
   */
  function updateRow(trans=[]){
    const v = {whois:'sdbTable.updateRow',step:0,rv:[],log:[],target:[],
      top:Infinity,left:Infinity,right:0,bottom:0,argument:JSON.stringify(trans),
      header: pv.schema.cols.map(x => x.name), // 項目一覧
    };
    console.log(`${v.whois} start.\ntrans(${whichType(trans)})=${stringify(trans)}`);
    try {
  
      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------
  
      if( !Array.isArray(trans)) trans = [trans];
  
      // 対象となる行オブジェクト判定式の作成
      for( v.i=0 ; v.i<trans.length ; v.i++ ){
  
        v.step = 1.1; // where,recordの存否確認
        v.msg = `${v.whois}: _が指定されていません(${JSON.stringify(trans[v.i])})`;
        if( !trans[v.i].where ) throw new Error(v.msg.replace('_','位置指定(where)'));
        if( !trans[v.i].record ) throw new Error(v.msg.replace('_','更新データ(record)'));
  
        v.step = 1.2; // whereがオブジェクトまたは文字列指定なら関数化
        v.where = pv.functionalize(trans[v.i].where);
        if( v.where instanceof Error ) throw v.where;
  
        v.step = 1.3; // recordがオブジェクトなら関数化
        v.record = typeof trans[v.i].record === 'function' ? trans[v.i].record
        : new Function('o',`return ${JSON.stringify(trans[v.i].record)}`);
  
        // 対象レコードか一件ずつチェック
        for( v.j=0 ; v.j<pv.values.length ; v.j++ ){
  
          v.step = 2.1; // 対象外判定ならスキップ
          if( v.where(pv.values[v.j]) === false ) continue;
  
          v.step = 2.2; // v.before: 更新前の行オブジェクトのコピー
          [v.before,v.after,v.diff] = [Object.assign({},pv.values[v.j]),{},{}];
  
          v.step = 2.3; // v.rObj: 更新指定項目のみのオブジェクト
          v.rObj = v.record(pv.values[v.j]);
  
          v.step = 2.4; // シート上の項目毎にチェック
          v.header.forEach(x => {
            if( v.rObj.hasOwnProperty(x) && !isEqual(v.before[x],v.rObj[x]) ){
              v.step = 2.41; // 変更指定項目かつ値が変化していた場合、afterとdiffに新しい値を設定
              v.after[x] = v.diff[x] = v.rObj[x];
              v.colNo = v.header.findIndex(y => y === x);
              v.left = Math.min(v.left,v.colNo);
              v.right = Math.max(v.right,v.colNo);
            } else {
              v.step = 2.42; // 非変更指定項目または変更指定項目だが値の変化が無い場合、beforeの値をセット
              v.after[x] = v.before[x];
            }
          })
  
          v.step = 2.5; // 更新履歴オブジェクトを作成
          v.logObj = new sdbLog({account:pv.account,range:pv.name,
            action:'update',argument:v.argument,before:v.before,after:v.after,diff:v.diff});
  
          v.step = 2.6; // 更新レコードの正当性チェック(unique重複チェック)
          for( v.unique in pv.schema.unique ){
            if( pv.schema.unique[v.unique].indexOf(trans[v.i][v.unique]) >= 0 ){
              v.step = 2.61; // 登録済の場合はエラーとして処理
              v.logObj.result = false;
              // 複数項目のエラーメッセージに対応するため場合分け
              v.logObj.message = (v.logObj.message === null ? '' : '\n')
              + `${v.unique}欄の値「${trans[v.i][v.unique]}」が重複しています`;
            } else {
              v.step = 2.62; // 未登録の場合pv.sdbSchema.uniqueに値を追加
              pv.schema.unique[v.unique].push(trans[v.i][v.unique]);
            }
          }
  
          v.step = 2.7; // 正当性チェックOKの場合の処理
          if( v.logObj.result === true ){
            v.top = Math.min(v.top, v.j);
            v.bottom = Math.max(v.bottom, v.j);
            pv.values[v.j] = v.after;
          }
  
          v.step = 2.8; // 成否に関わらずログ出力対象に保存
          v.log.push(v.logObj);
        }
      }
  
      // ------------------------------------------------
      v.step = 3; // 対象シート・更新履歴に展開
      // ------------------------------------------------
      v.step = 3.1; // シートイメージ(二次元配列)作成
      for( v.i=v.top ; v.i<=v.bottom ; v.i++ ){
        v.row = [];
        for( v.j=v.left ; v.j<=v.right ; v.j++ ){
          v.row.push(pv.values[v.i][v.header[v.j]] || null);
        }
        v.target.push(v.row);
      }
      vlog(v,['target','top','left'],1022)
  
      v.step = 3.2; // シートに展開
      // v.top,bottom: 最初と最後の行オブジェクトの添字(≠行番号) ⇒ top+1 ≦ row ≦ bottom+1
      // v.left,right: 左端と右端の行配列の添字(≠列番号) ⇒ left+1 ≦ col ≦ right+1
      if( v.target.length > 0 ){
        pv.sheet.getRange(
          pv.top + v.top +1,  // +1(添字->行番号)
          pv.left + v.left,
          v.target.length,
          v.target[0].length
        ).setValues(v.target);
      }
  
      v.step = 3.3; // 変更履歴追記対象なら追記(変更履歴シートは追記対象外)
      if( pv.log !== null && v.log.length > 0 ){
        v.r = pv.log.append(v.log);
        if( v.r instanceof Error ) throw v.r;
      }
  
      v.step = 9; // 終了処理
      v.rv = v.log;
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** deleteRow: 領域から指定行を物理削除
   * @param {Object|Function|any} where=[] - 対象レコードの判定条件
   * @returns {sdbLog[]}
   *
   * - where句の指定方法
   *   - Object ⇒ {key:キー項目名, value: キー項目の値}形式で、key:valueに該当するレコードを更新
   *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
   *   - その他 ⇒ 項目定義で"primaryKey"指定された項目の値で、primaryKey項目が指定値なら更新
   */
  function deleteRow(where){
    const v = {whois:'sdbTable.deleteRow',step:0,rv:[],log:[],where:[],argument:JSON.stringify(where)};
    console.log(`${v.whois} start.\nwhere(${whichType(where)})=${stringify(where)}`);
    try {
  
      // 削除指定が複数の時、上の行を削除後に下の行を削除しようとすると添字や行番号が分かりづらくなる。
      // そこで対象となる行の添字(行番号)を洗い出した後、降順にソートし、下の行から順次削除を実行する
  
      v.step = 1.1; // 事前準備 : 引数を配列化
      if( !Array.isArray(where)) where = [where];
  
      v.step = 1.2; // 該当レコードかの判別用関数を作成
      for( v.i=0 ; v.i<where.length ; v.i++ ){
        where[v.i] = pv.functionalize(where[v.i]);
        if( where[v.i] instanceof Error ) throw where[v.i];
      }
      v.step = 1.3; // 引数argのいずれかに該当する場合trueを返す関数を作成
      v.cond = o => {let rv = false;where.forEach(w => {if(w(o)) rv=true});return rv};
  
      v.step = 2; // 対象レコードか一件ずつチェック
      for( v.i=pv.values.length-1 ; v.i>=0 ; v.i-- ){
  
        v.step = 2.1; // 対象外判定ならスキップ
        if( v.cond(pv.values[v.i]) === false ) continue;
  
        v.step = 2.2; // 更新履歴オブジェクトを作成
        v.logObj = new sdbLog({account:pv.account,range:pv.name,
          action:'delete',argument:v.argument,before:pv.values[v.i]});
        v.logObj.diff = v.logObj.before;
        v.log.push(v.logObj);
  
        v.step = 2.3; // 削除レコードのunique項目をpv.schema.uniqueから削除
        // pv.schema.auto_incrementは削除の必要性が薄いので無視
        // ※必ずしも次回採番時に影響するとは限らず、影響したとしても欠番扱いで問題ないと判断
        for( v.unique in pv.schema.unique ){
          if( pv.values[v.i][v.unique] ){
            v.idx = pv.schema.unique[v.unique].indexOf(pv.values[v.i][v.unique]);
            if( v.idx >= 0 ) pv.schema.unique[v.unique].splice(v.idx,1);
          }
        }
  
        v.step = 2.4; // pv.valuesから削除
        pv.values.splice(v.i,1);
  
        v.step = 2.5; // シートのセルを削除
        v.range = pv.sheet.getRange(
          pv.top + v.i + 1,  // +1(添字->行番号)
          pv.left,
          1,
          pv.right - pv.left + 1,
        );
        v.range.deleteCells(SpreadsheetApp.Dimension.ROWS);
  
        v.step = 2.6; // pv.bottomを書き換え
        pv.bottom = pv.bottom - 1;
  
      }
  
      v.step = 3; // 変更履歴追記対象なら追記(変更履歴シートは追記対象外)
      if( pv.log !== null && v.log.length > 0 ){
        v.r = pv.log.append(v.log);
        if( v.r instanceof Error ) throw v.r;
      }
  
      v.step = 9; // 終了処理
      v.rv = v.log;
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  /** getSchema: 指定テーブルの項目定義情報を取得
   * @param {string|string[]} where=[] - 対象レコードの判定条件
   * @returns {sdbLog[]}
   */
  function getSchema(where){
    const v = {whois:'sdbTable.getSchema',step:0,rv:[],log:[],where:[],argument:JSON.stringify(where)};
    console.log(`${v.whois} start.\nwhere(${whichType(where)})=${stringify(where)}`);
    try {
  
  
      v.step = 9; // 終了処理
      v.rv = v.log;
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
}



/** 二つの引数が同値か判断する
 * @param {any} v1 - 変数1
 * @param {any} v2 - 変数2
 * @param {Object|boolean} opt - オプション。v1,v2でデータ型が異なる場合の判定方法を指定
 * @param {string} opt.force=null - v1,v2に強制するデータ型(ex.v1='9-5-1965',v2='1965/9/5',opt.force='date'->true)
 *   'string','number','bigint','boolean','undefined','symbol','function','null','date','object','array'
 * @param {boolean} opt.string_number=true - trueなら文字列・数値型の相違を無視(ex.'10'=10と判断)
 * @param {boolean} opt.string_bigint=true - trueなら文字列・長整数型の相違を無視(ex.'10'=10nと判断)
 * @param {boolean} opt.string_boolean=true - trueなら文字列・真偽値の相違を無視(ex.'TruE'=trueと判断)
 * @param {boolean} opt.string_undefined=true - trueなら文字列・undefinedの相違を無視(ex.'undefined'=undefinedと判断)
 * @param {boolean} opt.string_function=true - trueなら文字列・関数の相違を無視(ex.'()=>true'と()=>trueは同値と判断)
 * @param {boolean} opt.string_null=true - trueなら文字列・nullの相違を無視(ex.'Null'=nullと判断)
 * @param {boolean} opt.string_date=true - trueなら文字列・Date型の相違を無視(ex.'1965/9/5'=new Date('1965-09-05')と判断)
 * @param {boolean} opt.number_bigint=true - trueなら数値・長整数型の相違を無視(ex.10=10nと判断)
 * @param {boolean} opt.number_date=true - trueなら数値・Date型の相違を無視(ex.-136458000000=new Date('1965-09-05')と判断)
 * @param {boolean} opt.bigint_date=true - trueなら長整数・Date型の相違を無視(ex.-136458000000n=new Date('1965-09-05')と判断)
 * @returns {boolean|Error}
 * 
 * - [等価性の比較と同一性](https://developer.mozilla.org/ja/docs/Web/JavaScript/Equality_comparisons_and_sameness)
 * - データ型が一致していないと、内容的に一致していても同値では無いと判断(Ex.Number 1 != BigInt 1)。
 * - 配列は、①長さが一致、かつ②順番に比較した個々の値が同値の場合のみ同値と看做す
 * - `opt.strict = false`はスプレッドシートに保存されていた内容との比較での利用を想定
 */
function isEqual(v1=undefined,v2=undefined,opt={}){
  const v = {whois:'isEqual',rv:true,step:0,
  };
  try {

    // -------------------------------------------
    // 1. 事前準備
    // -------------------------------------------
    v.step = 1.1; // v.types: typeofの戻り値の内、objectを除いたもの
    v.types = ['string','number','bigint','boolean','undefined','symbol','function'];
    v.typeAll = [...v.types,'null','date','object','array'];

    v.step = 1.2; // データ型判定関数の定義
    // typeofの戻り値の内 string,number,bigint,boolean,undefined,symbol,function はそのまま
    // objectは null,date,array,objectに分けて文字列として返す
    // 引数:データ型判定対象変数、戻り値:v.typeallに列挙された文字列
    v.which = x => {
      if( x === null ) return 'null';
      if( v.types.indexOf(typeof x) >= 0 ) return typeof x;
      if( Array.isArray(x) ) return 'array';
      return isNaN(new Date(x)) ? 'object' : 'date';
    };

    v.step = 1.3; // オプションに既定値を設定
    v.opt = Object.assign({
      force: null,
      string_number: true, // trueなら文字列・数値型の相違を無視(ex.'10'=10と判断)
      string_bigint: true, // trueなら文字列・長整数型の相違を無視(ex.'10'=10nと判断)
      string_boolean: true, // trueなら文字列・真偽値の相違を無視(ex.'TruE'=trueと判断)
      string_undefined: true, // trueなら文字列・undefinedの相違を無視(ex.'undefined'=undefinedと判断)
      string_function: true, // trueなら文字列・関数の相違を無視(ex.'()=>true'と()=>trueは同値と判断)
      string_null: true, // trueなら文字列・nullの相違を無視(ex.'Null'=nullと判断)
      string_date: true, // trueなら文字列・Date型の相違を無視(ex.'1965/9/5'=new Date('1965-09-05')と判断)
      number_bigint: true, // trueなら数値・長整数型の相違を無視(ex.10=10nと判断)
      number_date: true, // trueなら数値・Date型の相違を無視(ex.-136458000000=new Date('1965-09-05')と判断)
      bigint_date: true, // trueなら長整数・Date型の相違を無視(ex.-136458000000n=new Date('1965-09-05')と判断)
    },opt);

    v.step = 1.4; // オプションの適用マップ(v.map)を作成
    // v1,v2でデータ型が異なる場合の判定方法として、次項(step.1.5)で定義する判定式を
    // 適用する場合はtrueを、適用しない場合(=厳密比較する場合)はfalseを設定する。
    // なおデータ型がv1,v2で不一致の場合はオプションの真偽値をセットするが、
    // 一致する場合は必ず判定式が適用されるようtrueをセットしておく。
    v.map = {};
    v.typeAll.forEach(x => {
      v.map[x] = {};
      // `x === y` ⇒ データ型が一致する場合はtrue、不一致はfalseをセット
      v.typeAll.forEach(y => v.map[x][y] = x === y);
    });
    // オプションの指定値をセット
    for( v.prop in v.opt ){
      v.m = v.prop.match(/^([a-z]+)_([a-z]+)$/);
      if( v.m ) v.map[v.m[1]][v.m[2]] = v.map[v.m[2]][v.m[1]] = v.opt[v.prop];
    }

    v.step = 1.5; // 比較対象のデータ型に基づいた判定式の定義
    v.f01 = (x,y) => x === y;  // ①厳密比較
    v.f02 = (x,y) => x == y;   // ②緩い比較
    v.f03 = (x,y) => {try{return BigInt(x) === BigInt(y)}catch{return false}};  // ③BigInt
      // BigInt(Infinity) -> The number Infinity cannot be converted to a BigInt because it is not an integer
      // これを回避するためtry〜catchとする
    v.f04 = (x,y) => String(x).toLowerCase() === String(y).toLowerCase(); //Boolean(x) === Boolean(y),  // ④Boolean
    v.f05 = (x,y) => String(x) === String(y);  // ⑤String
    v.f06 = (x,y) => x.toString() === y.toString();  // ⑥toString()
    v.f07 = (x,y) => {try{return new Date(x).getTime() === new Date(y).getTime()}catch{return false}};  // ⑦getTime()
      // new Date(Infinity) -> Invalid Date
      // これを回避するためtry〜catchとする
    v.f08 = (x,y) => new Date(Number(x)).getTime() === new Date(Number(y)).getTime();  // ⑧getTime(num)

    v.step = 1.6; // デシジョンテーブルの定義
    // 比較対象のデータ型毎に、どの比較方法を採用するかを定義する
    // ex. v.dt['string','number'] ⇒ v.f02(②緩い比較)で同一かを判定
    v.dt = {
      "string":{"string":v.f01,"number":v.f02,"bigint":v.f03,"boolean":v.f04,"undefined":v.f05,"function":v.f06,"null":v.f04,"date":v.f07},
      "number":{"string":v.f02,"number":v.f01,"bigint":v.f03,"date":v.f07},
      "bigint":{"string":v.f03,"number":v.f03,"bigint":v.f01,"date":v.f07},
      "boolean":{"string":v.f04,"boolean":v.f01},
      "undefined":{"string":v.f05,"undefined":v.f01},
      "symbol":{"symbol":v.f06},
      "function":{"string":v.f06,"function":v.f06},
      "null": {"string":v.f04,"null":v.f01},
      "date": {"string":v.f07,"number":v.f07,"bigint":v.f08,"date":v.f07},
      "object": {"object":(x,y)=>{
        // 直下のメンバが不一致ならfalseを返す(孫要素以降は不問)
        if(JSON.stringify(Object.keys(x).sort()) !== JSON.stringify(Object.keys(y).sort())) return false;
        // 個々のメンバを再帰呼出
        for( let m in x ) if( isEqual(x[m],y[m],v.opt) === false ) return false;
        return true;
      }},
      "array": {"array":(x,y)=>{
        // 要素の個数が不一致ならfalseを返す(孫要素以降は不問)
        if( x.length !== y.length ) return false;
        // 個々のメンバを再帰呼出
        for( let i=0 ; i<x.length ; i++ ) if( isEqual(x[i],y[i],v.opt) === false ) return false;
        return true;
      }},
    };

    // -------------------------------------------
    v.step = 2; // 判定式を選択、結果を返す
    // -------------------------------------------
    // データ型の組み合わせパターンで判定式が定義されていればそれに基づき判定。
    // 未定義なら「false固定」としてfalseを返す。
    v.t1 = v.opt.force || v.which(v1); v.t2 = v.opt.force || v.which(v2);
    v.f = v.map[v.t1][v.t2] ? v.dt[v.t1][v.t2] : v.f01;
    //console.log(`t1:${v.t1}, t2:${v.t2}, f: ${v.f}`);
    return v.f(v1,v2);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nv1(${typeof v1})=${typeof v1 === 'object' ? JSON.stringify(v1) : v1}`
    + `\nv2(${typeof v2})=${typeof v2 === 'object' ? JSON.stringify(v2) : v2}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
/** 渡された変数内のオブジェクト・配列を再帰的にマージ
 * - pri,subともデータ型は不問。次項のデシジョンテーブルに基づき、結果を返す
 *
 * @param {any} pri - 優先される変数(priority)
 * @param {any} sub - 劣後する変数(subordinary)
 * @param {Object} opt - オプション
 * @returns {any|Error}
 *
 * #### デシジョンテーブル
 *
 * | 優先(pri) | 劣後(sub) | 結果 | 備考 |
 * | :--: | :--: | :--: | :-- |
 * |  A  |  -  |  A  | 優先(A)のみ存在するメンバはそのまま |
 * |  A  |  B  |  A  | |
 * |  A  | [B] |  A  | |
 * |  A  | {B} |  A  | |
 * | [A] |  -  | [A] | |
 * | [A] |  B  | [A] | |
 * | [A] | [B] | [X] | 配列はopt.arrayによる |
 * | [A] | {B} | [A] | |
 * | {A} |  -  | {A} | |
 * | {A} |  B  | {A} | |
 * | {A} | [B] | {A} | |
 * | {A} | {B} | {A+B} | オブジェクトも置換ではなく結合する |
 * |  -  |  -  |  -  | |
 * |  -  |  B  |  B  | |
 * |  -  | [B] | [B] | |
 * |  -  | {B} | {B} | |
 *
 * #### opt.array : pri,sub双方配列の場合の処理方法を指定
 *
 * 例 pri:[1,2,{x:'a'},{a:10,b:20}], sub:[1,3,{x:'a'},{a:30,c:40}]
 *
 * - pri(priority): 単純にpriをセット。subは全て廃棄 ⇒ [1,2,{x:'a'},{a:10,b:20}]
 * - add: 値の重複に拘わらず、pri+subを返す ⇒ [1,2,{x:'a'},{a:10,b:20},1,3,{x:'a'},{a:30,c:40}]
 * - set(既定値): priに無いsubの要素をpriに追加 ⇒ [1,2,3,{x:'a'},{x:'a'},{a:10,b:20},{a:30,c:40}]
 *   ※`{x:'a'}`は別オブジェクトなので、重複排除されない事に注意。関数、Date等のオブジェクトも同様。
 * - str(strict): priに無いsubの要素をpriに追加。setと異なり、内容が同値なら重複排除<br>
 *   ⇒ [1,2,3,{x:'a'},{a:10,b:20},{a:30,c:40}]
 * - cmp(未実装): pri[n]とsub[n]を比較(comparison)。原則pri優先だが、例外として両方がObj or Arrならマージ<br>
 *   ⇒ [1,2,{x:'a'},{a:10,b:20,c:40}]
 */
function mergeDeeply(pri,sub,opt={}){
  const v = {whois:'mergeDeeply',rv:null,step:0,
    isObj: arg => arg && String(Object.prototype.toString.call(arg).slice(8,-1)) === 'Object',
    isArr: arg => arg && Array.isArray(arg),
  };
  //console.log(`${v.whois} start.`+`\npri=${stringify(pri)}`+`\nsub=${stringify(sub)}`+`\nopt=${stringify(opt)}`);
  try {

    v.step = 1; // 既定値の設定
    if( !opt.hasOwnProperty('array') ) opt.array = 'set';

    if( v.isObj(pri) && v.isObj(sub) ){
      v.step = 2; // sub,pri共にハッシュの場合
      v.rv = {};
      v.step = 2.1; // 優先・劣後Obj両方のハッシュキー(文字列)を、重複しない形でv.keysに保存
      v.keys = new Set([...Object.keys(pri),...Object.keys(sub)]);
      for( v.key of v.keys ){
        if( pri.hasOwnProperty(v.key) && sub.hasOwnProperty(v.key) ){
          v.step = 2.2; // pri,sub両方がキーを持つ
          if( v.isObj(pri[v.key]) && v.isObj(sub[v.key]) || v.isArr(pri[v.key]) && v.isArr(sub[v.key]) ){
            v.step = 2.21; // 配列またはオブジェクトの場合は再帰呼出
            v.rv[v.key] = mergeDeeply(pri[v.key],sub[v.key],opt);
          } else {
            v.step = 2.22; // 配列でもオブジェクトでもない場合は優先変数の値をセット
            v.rv[v.key] = pri[v.key];
          }
        } else {
          v.step = 2.3; // pri,subいずれか片方しかキーを持っていない
          v.rv[v.key] = pri.hasOwnProperty(v.key) ? pri[v.key] : sub[v.key];
        }
      }
    } else if( v.isArr(pri) && v.isArr(sub) ){
      v.step = '3 '+opt.array; // sub,pri共に配列の場合
      switch( opt.array ){
        case 'pri':
          // pri: 単純にpriをセット。subは全て廃棄 ⇒ [1,2,{x:'a'},{a:10,b:20}]
          v.rv = pri;
          break;
        case 'add':
          // add: 値の重複に拘わらず、pri+subを返す ⇒ [1,2,{x:'a'},{a:10,b:20},1,3,{x:'a'},{a:30,c:40}]
          v.rv = [...pri, ...sub];
          break;
        case 'str':
          // str(strict): priに無いsubの要素をpriに追加。setと異なり、内容が同値なら重複排除<br>
          // ⇒ [1,2,3,{x:'a'},{a:10,b:20},{a:30,c:40}]
          v.rv = [];
          pri.forEach(x => v.rv.push(x));
          sub.forEach(s => {
            v.flag = false;
            pri.forEach(p => v.flag = v.flag || isEqual(s,p));
            if( v.flag === false ) v.rv.push(s);
          });
          break;
        default:
          // set(既定値): priに無いsubの要素をpriに追加 ⇒ [1,2,{x:'a'},{a:10,b:20},3,{x:'a'},{a:30,c:40}]
          v.rv = [...new Set([...pri,...sub])];
      }
    } else {
      v.step = 4; // subとpriのデータ型が異なる ⇒ priを優先してセット
      v.rv = whichType(pri,'Undefined') ? sub : pri;
      //console.log(`l.228 pri=${stringify(pri)}, sub=${stringify(sub)} -> rv=${stringify(v.rv)}`)
    }
    v.step = 5;
    //console.log(`${v.whois} normal end.`+`\npri=${stringify(pri)}`+`\nsub=${stringify(sub)}`+`\nopt=${stringify(opt)}`+`\nv.rv=${stringify(v.rv)}`)
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`
    + `\npri=${JSON.stringify(pri)}`
    + `\nsub=${JSON.stringify(sub)}`
    + `\nopt=${JSON.stringify(opt)}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
/** 関数他を含め、変数を文字列化
 * - JSON.stringifyでは文字列化されない関数、シンボル、undefinedも文字列化して表示
 * - 関数はtoString()で文字列化
 * - シンボルは`Symbol(xxx)`という文字列とする
 * - undefinedは'undefined'(文字列)とする
 *
 * @param {Object} variable - 文字列化対象変数
 * @param {Object|boolean} opt - booleanの場合、opt.addTypeの値とする
 * @param {boolean} opt.addType=false - 文字列化の際、元のデータ型を追記
 * @returns {string}
 * @example
 *
 * ```
 * console.log(`l.424 v.td=${stringify(v.td,true)}`)
 * ⇒ l.424 v.td={
 *   "children":[{
 *     "attr":{"class":"[String]th"}, // opt.addType=trueなら[データ型名]がつく
 *     "text":"[String]タグ"
 *   },{
 *     "attr":{"class":"[String]td"},
 *     "text":"[String]#md"
 *   }],
 *   "style":{"gridColumn":"[String]1/13"},
 *   "attr":{"name":"[String]tag"}
 * }
 * ```
 */
function stringify(variable,opt={addType:false}){
  const v = {whois:'stringify',rv:null,step:0};
  const conv = arg => {
    const w = {type:whichType(arg)};
    w.pre = opt.addType ? `[${w.type}]` : '';
    switch( w.type ){
      case 'Function': case 'Arrow': case 'Symbol':
        w.rv = w.pre + arg.toString(); break;
      case 'BigInt':
        w.rv = w.pre + parseInt(arg); break;
      case 'Undefined':
        w.rv = w.pre + 'undefined'; break;
      case 'Object':
        w.rv = {};
        for( w.i in arg ){
          // 自分自身(stringify)は出力対象外
          if( w.i === 'stringify' ) continue;
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      case 'Array':
        w.rv = [];
        for( w.i=0 ; w.i<arg.length ; w.i++ ){
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      default:
        w.rv = w.pre + arg;
    }
    return w.rv;
  };
  //console.log(`${v.whois} start.\nvariable=${variable}\nopt=${JSON.stringify(opt)}`);
  try {

    v.step = 1; // 事前準備
    if( typeof opt === 'boolean' ) opt={addType:opt};

    v.step = 2; // 終了処理
    //console.log(`${v.whois} normal end.`);
    return JSON.stringify(conv(variable));

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
/** 日時を指定形式の文字列にして返す
 * @param {string|Date} arg - 変換元の日時
 * @param {string} [format='yyyy-MM-ddThh:mm:ss.nnnZ'] - 日時を指定する文字列。年:y,月:M,日:d,時:h,分:m,秒:s,ミリ秒:n,タイムゾーン:Z
 * @returns {string} 指定形式に変換された文字列。無効な日付なら長さ0の文字列
 *
 * @example
 * ```
 * "1965/9/5"[yy/MM/dd hh:mm:ss.nnn] ⇒ "65/09/05 00:00:00.000"
 * "1965/9/5"[yyyy-MM-dd] ⇒ "1965-09-05"
 * "1965/9/5"[hh:mm] ⇒ "00:00"
 * "1977-03-04"[yy/MM/dd hh:mm:ss.nnn] ⇒ "77/03/04 09:00:00.000"
 * "1977-03-04"[yyyy-MM-dd] ⇒ "1977-03-04"
 * "1977-03-04"[hh:mm] ⇒ "09:00"
 * 1688189258262[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:27:38.262"
 * 1688189258262[yyyy-MM-dd] ⇒ "2023-07-01"
 * 1688189258262[hh:mm] ⇒ "14:27"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:16:30.000"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yyyy-MM-dd] ⇒ "2023-07-01"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[hh:mm] ⇒ "14:16"
 * "12:34"[yy/MM/dd hh:mm:ss.nnn] ⇒ ""
 * "12:34"[yyyy-MM-dd] ⇒ ""
 * "12:34"[hh:mm] ⇒ ""
 * ```
 */

function toLocale(arg,format='yyyy-MM-ddThh:mm:ss.nnnZ'){
  const v = {rv:format};
  try {

    let dObj = whichType(arg,'Date') ? arg : new Date(arg);
    //dObj = String(Object.prototype.toString.call(arg).slice(8,-1)) !== 'Date' ? arg : new Date(arg);

    v.step = 1; // 無効な日付なら空文字列を返して終了
    if( isNaN(dObj.getTime()) ) return '';

    v.local = { // 地方時ベース
      y: dObj.getFullYear(),
      M: dObj.getMonth()+1,
      d: dObj.getDate(),
      h: dObj.getHours(),
      m: dObj.getMinutes(),
      s: dObj.getSeconds(),
      n: dObj.getMilliseconds(),
      Z: Math.abs(dObj.getTimezoneOffset())
    }
    // タイムゾーン文字列の作成
    v.local.Z = v.local.Z === 0 ? 'Z'
    : ((dObj.getTimezoneOffset() < 0 ? '+' : '-')
    + ('0' + Math.floor(v.local.Z / 60)).slice(-2)
    + ':' + ('0' + (v.local.Z % 60)).slice(-2));

    v.step = 2; // 日付文字列作成
    for( v.x in v.local ){
      v.m = v.rv.match(new RegExp(v.x+'+'));
      if( v.m ){
        v.str = v.m[0].length > 1
          ? ('000'+v.local[v.x]).slice(-v.m[0].length)
          : String(v.local[v.x]);
        v.rv = v.rv.replace(v.m[0],v.str);
      }
    }

    v.step = 3; // 終了処理
    return v.rv;

  } catch(e){
    console.error(e,v);
    return e;
  }
}
/** vlog: デバッグ用コンソール出力
 * @param {Object} o - 出力対象Object
 * @param {string|string[]} m - メンバ名
 * @param {number|Object} l=null - 数値なら行番号、Objectならwhois,stepをメンバに持つ変数('v'を想定)
 * @returns {void}
 * 
 * - ver.1.1.0 2024/09/12
 *   - v以外の変数(ex.this)でもstep表示を可能に(lにObjectを追加)
 *   - 階層化オブジェクトメンバの指定を可能に(v.convの追加)
 */
const vlog = (o,m,l=null) => {
  // return; // デバッグ用。本番時はコメントを外す
  const v = {
    lType: whichType(l),  // 引数lのデータ型
    conv: (o,s) => {s.split('.').forEach(x => o = o[x]);return o},
  };

  switch( v.lType ){
    case 'Object': v.whois = l.whois; v.step = l.step; v.line = null; break;
    case 'Null'  : // Numberと同じ
    case 'Number': v.whois = o.whois; v.step = o.step; v.line = l; break;
  }
  v.msg = new Date().toLocaleTimeString()
    + (v.whois ? ` ${v.whois}` : '')
    + (v.step ? ` step.${v.step}` : '')
    + (v.line ? ` l.${v.line}` : '');

  if( whichType(m,'string') ) m = [m];
  m.forEach(str => {
    v.val = v.conv(o,str);
    v.msg += `\n${str}(${whichType(v.val)})=${stringify(v.val)}`
  });

  console.log(v.msg);
}
/** 変数の型を判定
 * 
 * - 引数"is"が指定された場合、判定対象が"is"と等しいかの真偽値を返す。
 *
 * @param {any} arg - 判定対象の変数
 * @param {string} [is] - 想定される型(型名の大文字小文字は意識不要)
 * @returns {string|boolean} - 型の名前。is指定有りなら判定対象が想定型かの真偽値
 *
 * @example
 * ```
 * let a = 10;
 * whichType(a);  // 'Number'
 * whichType(a,'string'); // false
 * ```
 *
 * <b>確認済戻り値一覧</b>
 *
 * オブジェクトは型名が返るので、限定列挙は困難。以下は確認済みの戻り値のみ記載。
 *
 * | 型名 | 戻り値 | 備考 |
 * | :-- | :-- | :-- |
 * | 文字列 | String |  |
 * | 数値 | Number |  |
 * | NaN | NaN |  |
 * | 長整数 | BigInt |  |
 * | 論理値 | Boolean |  |
 * | シンボル | Symbol |  |
 * | undefined | Undefined | 先頭大文字 |
 * | Null | Null |  |
 * | オブジェクト | Object |  |
 * | 配列 | Array |  |
 * | 関数 | Function |  |
 * | アロー関数 | Arrow |  |
 * | エラー | Error | RangeError等も'Error' |
 * | Date型 | Date |  |
 * | Promise型 | Promise |  |
 *
 * - Qiita [JavaScriptの型などの判定いろいろ](https://qiita.com/amamamaou/items/ef0b797156b324bb4ef3)
 *
 */
function whichType(arg,is){
  let rv = String(Object.prototype.toString.call(arg).slice(8,-1));
  switch(rv){
    case 'Number': if(Number.isNaN(arg)) rv = 'NaN'; break;
    case 'Function': if(!('prototype' in arg)) rv = 'Arrow'; break;
  }
  if( typeof is === 'string' ){
    return rv.toLowerCase() === is.toLowerCase();
  } else {
    return rv;
  }
}