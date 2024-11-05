function test(){
  const v = {whois:'test',step:0,rv:null};
  console.log(`${v.whois} start.`);
  try {

    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.sheet = v.spread.getSheetByName('target');
    v.sheet.getRange(3,3,1,1).setNote('type: UUID');

    // ①constructor: シートイメージで生成、シート≠範囲
    v.rv = new SingleTable('target!C3:F',{
      primaryKey: 'D3',
      values: [
        ['string','boolean','date','number'],
        ['a',undefined,'1965/9/5',-1],
        ['tRue',null,'12:34',Infinity],
        ['{"a":10}',false,Date.now(),0],
        ['d',true,new Date(),1.23e+4],
      ]
    });

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}

/*
    // メールアドレスの重複 : {name:'メールアドレス',type:'string',unique:true},
    //v.rv = v.st.append({'タイムスタンプ':toLocale(new Date()),'メールアドレス':'nakaone.kunihiro@gmail.com'});

    // 複数レコードの一括追加 : {name:'entryNo',type:'number',auto_increment:[1,2]},

    // シートまたはログが使用中

    // --------------------------------------------------------------------
    // ①テスト用シートの削除
    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.sheet = v.spread.getSheetByName('target');
    if( v.sheet !== null ) v.spread.deleteSheet(v.sheet);
    v.sheet = v.spread.getSheetByName('log');
    if( v.sheet !== null ) v.spread.deleteSheet(v.sheet);

    // --------------------------------------------------------------------
    // ③appendテスト　※テスト②を先行、シート生成のこと
    v.st = new SingleTable('master',{
      primaryKey: 'entryNo',
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
        {name:'entryNo',type:'number',auto_increment:[1,2]},
        {name:'trial',type:'string'},
        {name:'editURL',type:'string'},
        {name:'entryTime',type:'Date'},
        {name:'receptionist',type:'number'},
        {name:'fee00',type:'string',default:'未入場'},
        {name:'fee01',type:'string',default:'未入場'},
        {name:'fee02',type:'string',default:'未入場'},
        {name:'fee03',type:'string',default:'未入場'},
        {name:'fee04',type:'string',default:'未入場'},
        {name:'fee05',type:'string',default:'未入場'},
        {name:'memo',type:'string'},
      ],
    });
    // 単純な追加(自動採番、既定値の設定)
    v.rv = v.st.append({'タイムスタンプ':toLocale(new Date())});

    // ②テスト用シートの削除
    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.sheet = v.spread.getSheetByName('master');
    if( v.sheet !== null ) v.spread.deleteSheet(v.sheet);

    // --------------------------------------------------------------------

    // ②constructor: dataにてテストデータ生成
    v.rv = new SingleTable('master',{
      primaryKey: 'entryNo',
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
        {name:'entryNo',type:'number',auto_increment:[1,2]},
        {name:'trial',type:'string'},
        {name:'editURL',type:'string'},
        {name:'entryTime',type:'Date'},
        {name:'receptionist',type:'number'},
        {name:'fee00',type:'string',default:'未入場'},
        {name:'fee01',type:'string',default:'未入場'},
        {name:'fee02',type:'string',default:'未入場'},
        {name:'fee03',type:'string',default:'未入場'},
        {name:'fee04',type:'string',default:'未入場'},
        {name:'fee05',type:'string',default:'未入場'},
        {name:'memo',type:'string'},
      ],
      data: [{"タイムスタンプ":"2024-10-06T10:51:06.427Z","メールアドレス":"nakaone.kunihiro@gmail.com","申込者氏名":"島津　邦浩","申込者カナ":"シマヅ　クニヒロ","申込者の参加":"スタッフとして申込者のみ参加(おやじの会メンバ)","宿泊、テント":"宿泊しない","authority":2,"CPkey":"jZiM1isJ+1AZoVZ9NnWTvCoeghCm+FY05eb6jhz8wpT3DwqJbNnszW8PWDd3sq0N5mjN/Nshh+RGGrdkm7CC+sO32js+wm1YmYGr0FMaFxvMBDrWzyJ7qrPI4unbx2IkrPkXSmSEbw91n/LOu0x7br106XeJ9TXJbJS16rV0nzs=","entryNo":1,"trial":"{\"passcode\":920782,\"created\":1728874149915,\"result\":0,\"log\":[{\"timestamp\":1728874165893,\"enterd\":920782,\"status\":1},{\"timestamp\":1728768131564,\"enterd\":46757,\"status\":1},{\"timestamp\":1728768105236,\"enterd\":46747,\"status\":0},{\"timestamp\":1728731037700,\"enterd\":456044,\"status\":1},{\"timestamp\":1728711888082,\"enterd\":485785,\"status\":1},{\"timestamp\":1728709250994,\"enterd\":425862,\"status\":1},{\"timestamp\":1728701179073,\"enterd\":259177,\"status\":1},{\"timestamp\":1728646863938,\"enterd\":530072,\"status\":1},{\"timestamp\":1728646839729,\"enterd\":null,\"status\":1}]}","editURL":"https://docs.google.com/forms/d/e/1FAIpQLSfKJ5aUz4h6lTGlz6c3NjPyWMnViVQxHqwRkCnzJsRKfz9ULQ/viewform?edit2=2_ABaOnuePpXliGgMlVVUYiSKgwX6SXBNrnwozwTMF09Ml1py7Ocp1N7_w5F7uqf52Ak63zBE"},{"タイムスタンプ":"2024-09-15T03:47:03.578Z","メールアドレス":"via1315r@yahoo.co.jp","申込者氏名":"檜垣　素直","申込者カナ":"ヒガキ　スナオ","申込者の参加":"参加予定(宿泊なし)","宿泊、テント":"宿泊しない","引取者氏名":"宿泊予定なので不要","参加者01氏名":"檜垣　若菜","参加者01カナ":"ヒガキ　ワカナ","参加者01所属":"1年生","緊急連絡先":"09013357002","ボランティア募集":"できる","備考":"食事以外でも、お手伝い出来る事があれば。","authority":1,"entryNo":2,"editURL":"https://docs.google.com/forms/d/e/1FAIpQLSfKJ5aUz4h6lTGlz6c3NjPyWMnViVQxHqwRkCnzJsRKfz9ULQ/viewform?edit2=2_ABaOnudWLvuoT6Wq0Hu-4tqFl5OyTK-Z7EwdMDEQGS1jKJVIa41Dh8nNJPtpFyPu8cyZYGo"},{"タイムスタンプ":"2024-09-15T04:51:37.346Z","メールアドレス":"kousuke.murata4690@gmail.com","申込者氏名":"阿部　晃祐","申込者カナ":"アベ　コウスケ","申込者の参加":"参加予定(宿泊あり)","宿泊、テント":"宿泊する(テントあり)","引取者氏名":"宿泊予定なので不要","参加者01氏名":"阿部　涼","参加者01カナ":"アベ　リョウ","参加者01所属":"6年生","ボランティア募集":"できる","authority":1,"entryNo":3,"editURL":"https://docs.google.com/forms/d/e/1FAIpQLSfKJ5aUz4h6lTGlz6c3NjPyWMnViVQxHqwRkCnzJsRKfz9ULQ/viewform?edit2=2_ABaOnufKjD-xj5FN0GnTNIILVeJVwYJajCP8bZphy1zyleVl8UDLWqzUjDDFWZf7uMA0qtk"},{"タイムスタンプ":"2024-09-15T05:18:01.813Z","メールアドレス":"nakaone2001@gmail.com","申込者氏名":"島津　弘子","申込者カナ":"シマヅ　ヒロコ","申込者の参加":"参加予定(宿泊なし)","宿泊、テント":"宿泊しない","参加者01氏名":"島津　悠奈","参加者01カナ":"シマヅ　ユウナ","参加者01所属":"4年生","authority":2,"CPkey":"k5lfKMj3ybfMF6jocHPln98lLJIBIxKrrpLc4RhPenBIEg6OfgdXYQAVh907SoCg0MEBazhWic2oFaKNFJu9pa4prXWvTzYjRWw5XkmC9a7AdNQ0judVMATii7Xqp6drowisY6+Rul2zwrF2UKY8epoYP8ZkX9RyH6OFyglYQL8=","entryNo":4,"trial":"{\"passcode\":65698,\"created\":1729076868102,\"result\":0,\"log\":[{\"timestamp\":1728729400367,\"enterd\":119192,\"status\":1},{\"timestamp\":1728708771586,\"enterd\":254267,\"status\":1},{\"timestamp\":1728708701693,\"enterd\":254263,\"status\":0},{\"timestamp\":1728708634458,\"enterd\":null,\"status\":1}]}","editURL":"https://docs.google.com/forms/d/e/1FAIpQLSfKJ5aUz4h6lTGlz6c3NjPyWMnViVQxHqwRkCnzJsRKfz9ULQ/viewform?edit2=2_ABaOnueGXR29gyuz_kc4UMghOrIa_iNPhrkHdrW4zVI8KFW5aB2jsVCtjq79aasCFBWgTvI"}],
    });

    // --------------------------------------------------------------------
    // ①テスト用シートの削除
    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.sheet = v.spread.getSheetByName('target');
    if( v.sheet !== null ) v.spread.deleteSheet(v.sheet);

    // ①constructor: シートイメージで生成、シート≠範囲
    v.rv = new SingleTable('target!C3:F',{
      primaryKey: 'D3',
      raw: [
        ['','','タイトル','','','','',''],
        ['','','','','','','',''],
        ['','','C3','D3','E3','F3','',''],
        ['','','','','','','',''],
        ['','','5','4','','','',''],
        ['','','5','6','7','8','',''],
        ['','','4','3','hoge','fuga','',''],
        ['','','','','','','',''],
        ['','','','','','','','dummy'],
        ['','','','','','','',''],
      ]
    });
*/

/** 単一スプレッドシートまたはデータオブジェクト配列のCRUDを行う
 * - [仕様書](https://workflowy.com/#/91d73fc35411)
 */
class SingleTable {
  /** @constructor
   * @param range {string} 対象データ範囲のA1記法。1シート1テーブルとなっていない場合、範囲を特定するために使用。1シート1テーブルならシート名
   * @param opt {Object}={}
   * @param opt.outputLog {boolean}=true ログ出力しないならfalse
   * @param opt.logSheetName {string}='log' 更新履歴シート名
   * @param opt.account {number|string}=null 更新者のアカウント
   * @param opt.maxTrial {number}=5 シート更新時、ロックされていた場合の最大試行回数
   * @param opt.interval {number}=2500 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
   * @param opt.values {number|string|boolean|Date[][]} - 初期シートイメージ
   * @param opt.primaryKey {string} - 初期データの一意キー項目名
   * @returns {Object} setupSheet()のv.rv参照
   */
  constructor(range,opt){
    const v = {whois:this.constructor.name+'.constructor',step:0,rv:null};
    console.log(`${v.whois} start.`);
    try {
  
      this.stSheet = class {
        constructor(parent,range,opt={}){
          const v = {whois:'stSheet.constructor',step:0,rv:null};
          console.log(`${v.whois} start.\nrange=${range}\nopt=${stringify(opt)}`);
          try {
  
            v.step = 1; // メンバの初期化、既定値設定
            this.range = null; // {string} A1記法の範囲指定
            this.sheetName = null; // {string} シート名。this.rangeから導出
            this.sheet = null; // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
            this.schema = null; // {stSchema[]} シートの項目定義
            this.values = null; // {Object[]} 行オブジェクトの配列。{項目名:値,..} 形式
            this.header = null; // {number} ヘッダ行の行番号(自然数)
            this.top = null; // {number} データ領域先頭の行番号(自然数)。通常header+1
            this.left = null; // {number} データ領域左端の列番号(自然数)
            this.right = null; // {number} データ領域右端の列番号(自然数)
            this.bottom = null; // {number} データ領域下端の行番号(自然数)
            this.primaryKey = null; // {string}='id' 一意キー項目名
            this.unique = null; // {Object} primaryKeyおよびunique属性が付いた項目の一覧
            this.cols = null; // {string[]} 項目名のリスト
            this.map = null; // {Object} {項目名:値リスト配列}形式
            this.auto_increment = null; // {Object} auto_increment属性が付いた項目の最大値を管理するオブジェクト
            this.cols = null; // {string[]} 項目名のリスト
            this.map = null; // {Object} 項目名をラベルとし、以下形式のオブジェクトを値とするオブジェクト
            this.max = null; // {number} 最大値
            this.val = null; // {number} 増減値
            this.defaultObj = null; // {Object} 既定値項目で構成されたオブジェクト。appendの際のプロトタイプ
  
            v.step = 2; // 引数'range'から対象範囲絞り込み
            // range(対象データ範囲のA1記法)から指定範囲を特定、メンバに保存
            // ※ この段階では"a2:c"(⇒bottom不明)等、未確定部分が残る可能性あり
            v.m = range.match(/^'?(.+?)'?!([A-Za-z]*)([0-9]*):?([A-Za-z]*)([0-9]*)$/);
            if( v.m ){  // rangeがA1記法で指定された場合
              this.sheetName = v.m[1];
              this.left = v.m[2] ? this.colNo(v.m[2]) : 1;
              this.top = v.m[3] ? Number(v.m[3]) : 1;
              this.right = v.m[4] ? this.colNo(v.m[4]) : Infinity;
              this.bottom = v.m[5] ? Number(v.m[5]) : Infinity;
              if( this.left > this.right ) [this.left, this.right] = [this.right, this.left];
              if( this.top > this.bottom ) [this.top, this.bottom] = [this.bottom, this.top];
            } else {    // rangeが非A1記法 ⇒ range=シート名
              this.sheetName = range;
              this.top = this.left = 1;
              this.bottom = this.right = Infinity;
            }
  
            v.step = 3; // spread読み込みテスト
            this.sheet = parent.spread.getSheetByName(this.sheetName);
  
            v.step = 9; // 終了処理
            console.log(`${v.whois} normal end.`);
        
          } catch(e) {
            e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
            console.error(`${e.message}\nv=${stringify(v)}`);
            return e;
          }
        }
  
        /** colNo: 列記号を列番号に変換
         * @param {string} arg - 列番号
         * @returns {number} 列番号。自然数
         */
        colNo(arg){
          let rv=0;
          for( let b='a'.charCodeAt(0)-1,s=arg.toLowerCase(),i=0 ; i<arg.length ; i++ ){
            rv *= 26;
            rv += s.charCodeAt(i) - b;
          }
          return rv;
        }
      };
  
      this.stSchema = class {
        constructor(arg){
          const v = {whois:'stSchema.constructor',step:0,rv:null};
          console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
          try {
  
            this.name = null; // {string} 項目名
            this.type = null; // {string} データ型。string,number,boolean,Date,JSON,UUID
            this.format = null; // {string} 表示形式。type=Dateの場合のみ指定
            this.options = null; // {string} 取り得る選択肢(配列)のJSON表現。ex.["未入場","既収","未収","無料"]
            this.default = null; // {any} 既定値
            this.primaryKey = null; // {boolean}=false 一意キー項目ならtrue
            this.unique = null; // {boolean}=false primaryKey以外で一意な値を持つならtrue
            this.auto_increment = null; // {bloolean|null|number|number[]}=false 自動採番項目
              // null ⇒ 自動採番しない
              // boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない
              // number ⇒ 自動採番する(基数=指定値,増減値=1)
              // number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)
            this.suffix = null; // {string} "not null"等、上記以外のSQLのcreate table文のフィールド制約
            this.note = null; // {string} 本項目に関する備考。create table等では使用しない
  
            v.step = 9; // 終了処理
            console.log(`${v.whois} normal end.`);
        
          } catch(e) {
            e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
            console.error(`${e.message}\nv=${stringify(v)}`);
            return e;
          }
        }
      };
  
      v.step = 1; // メンバの初期化、既定値設定
      this.spread = SpreadsheetApp.getActiveSpreadsheet(); // {Spreadsheet} スプレッドシートオブジェクト(=ファイル。シートの集合)
      this.target = new this.stSheet(this,range);
      this.log = new this.stSheet(this,(opt.logSheetName||'log'));
      this.notesOnEditingNote = [
        '項目定義以外の部分は「//」をつける(単一行コメントのみ、複数行の「/* 〜 */」は非対応)',
        '各項目はカンマでは無く改行で区切る(∵視認性の向上)',
        '項目名・値のクォーテーションは不要',
      ];
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** insertSheet: シートの新規作成＋項目定義メモのセット
   * @param arg {Object}
   * @param arg.sheetName {string} - 作成するシート名
   * @param arg.left=1 {number} - 左端列番号(自然数)
   * @param arg.top=1 {number} - 上端行番号(自然数)
   * @param arg.cols {Object[]} - 項目定義オブジェクトの配列
   * @param [arg.rows] {Array[]|Object[]} - 行データ
   * @returns {Sheet} 作成されたシートオブジェクト
   */
  insertSheet(arg){
    const v = {whois:this.constructor.name+'.insertSheet',step:0,rv:null,range:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {
  
      v.step = 1; // 既定値の設定
      v.arg = mergeDeeply(arg,{sheetName:null,left:1,top:1,cols:null,rows:null});
      if( v.arg instanceof Error ) throw v.arg;
  
      v.step = 2; // シートの存否確認、不在なら追加
      v.rv = this.spread.getSheetByName(v.arg.sheetName);
      v.addNew = v.rv === null ? true : false;
      if( v.addNew ){
        v.step = 2.1; // 新規シートを追加
        v.rv = this.spread.insertSheet();
        v.rv.setName(v.arg.sheetName);
  
        v.step = 2.2; // ヘッダ行の範囲をrangeとして設定
        v.range = v.rv.getRange(v.arg.top,v.arg.left,1,v.arg.cols.length);
  
        v.step = 2.3; // ヘッダ行に項目名をセット
        v.range.setValues([v.arg.cols.map(x => x.name)]);
      }
  
      v.step = 3; // 項目定義メモの存否確認、不在なら追加
      // v.range: 項目定義メモを貼付する領域(=ヘッダ行の範囲)
      v.range = v.rv.getRange(v.arg.top,v.arg.left,1,v.arg.cols.length);
      // v.notes: setNotes()用のメモの配列
      v.notes = v.addNew ? [] : v.range.getNotes();
      // v.colsDefNote: 項目定義編集時の注意事項
      v.colsDefNote = [''];
      this.colsDefNote.forEach(l => v.colsDefNote.push('// '+l));
      v.colsDefNote = v.colsDefNote.join('\n');
  
      v.step = 3.1; // 列毎にメモを作成
      for( v.i=0 ; v.i<v.arg.cols.length ; v.i++ ){
        v.step = 3.2; // 作成済みならスキップ
        if( v.notes[v.i] !== undefined ) continue;
  
        v.step = 3.3; // 項目定義メモの内容(文字列)を作成
        v.note = [];
        for( v.j=0 ; v.j<this.colsDef.length ; v.j++ ){
          v.step = 3.4; // nameはヘッダ行のセルから取得可能なので省略
          if( this.colsDef[v.j].name === 'name' ) continue;
  
          if( v.arg.cols[v.i].hasOwnProperty(this.colsDef[v.j].name) ){
            v.step = 3.5; // 対象シートの項目定義(arg.cols)に該当定義内容が存在する場合、「定義項目名：値」
            v.note.push(`${this.colsDef[v.j].name}: ${v.arg.cols[v.i][this.colsDef[v.j].name]}`);
          } else {
            v.step = 3.6; // 存在しない場合、「// 定義項目名：{データ型} - 説明」
            v.note.push(`// ${this.colsDef[v.j].name}: {${(this.colsDef[v.j].type || '')}} - ${(this.colsDef[v.j].note || '')}`)
          }
        }
  
        v.step = 3.7; // 注意事項を追加して行を結合
        v.note.push(v.colsDefNote);
        v.notes[v.i] = v.note.join('\n');
      }
  
      v.step = 3.8; // メモを貼付
      v.range.setNotes([v.notes]);
  
      v.step = 4; // 新規作成シートの場合、データを追加
      if( v.addNew && v.arg.rows !== null ){
        v.sheet = []; // シートイメージ
        v.header = v.arg.cols.map(x => x.name); // ヘッダ行
  
        v.step = 4.1; // 項目の並びが異なる可能性があるので、シートイメージの場合は行オブジェクト化
        if( whichType(v.arg.rows[0],'Object') ){
          v.step = 4.11;
          v.data = v.arg.rows;
        } else {
          v.step = 4.12;
          v.data = [];
          for( v.i=1 ; v.i<v.arg.rows.length ; v.i++ ){
            v.row = {};
            for( v.j=0 ; v.j<v.arg.rows[v.i].length ; v.j++ ){
              if( v.arg.rows[v.i].hasOwnProperty(v.header[v.j]) ){
                v.row[v.header[v.j]] = v.arg.rows[v.i][v.j];
              }
            }
            v.data.push(v.row);
          }
        }
  
        v.step = 4.2; // 行オブジェクトをシートイメージに変換
        v.data.forEach(row => {
          v.row = [];
          Object.keys(row).forEach(key => {
            v.row[v.header.indexOf(key)] = row[key];
          });
          v.sheet.push(v.row);
        });
  
        v.step = 4.3; // 作成したシートイメージをセット
        v.rv.getRange(v.arg.top+1,v.arg.left,v.sheet.length,v.sheet[0].length).setValues(v.sheet);
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
  
  /** objectizeNote: 項目定義メモをオブジェクト化
   * @param arg {string} 項目定義メモの文字列
   * @returns {Object} 項目定義オブジェクト
   */
  objectizeNote(arg){
    const v = {whois:this.constructor.name+'.objectizeNote',step:0,rv:[]};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {
  
      v.step = 1; // JSON化する際、クォーテーションで囲む必要が無い項目のマップを作成
      v.quote = {};
      this.colsDef.forEach(x => {
        v.type = (x.type || '').toLowerCase();
        v.quote[x.name] = (v.type === 'number' || v.type === 'boolean') ? false : true;
      })
  
      v.step = 2; // 改行で分割、一行毎にチェック
      arg.split('\n').forEach(line => {
        // コメントの削除
        v.l = line.indexOf('//');
        v.line = v.l < 0 ? line : line.slice(0,v.l);
        
        // 「項目名：値」形式の行はメンバとして追加
        v.m = v.line.trim().match(/^["']?([a-zA-Z0-9_\$]+)["']?\s*:\s*["']?(.+)["']?$/);
        if( v.m ){
          v.rv.push(`"${v.m[1]}":`+(v.quote[v.m[1]] ? `"${v.m[2]}"` : v.m[2]))
        }
      });
  
      v.step = 3; // オブジェクト化
      v.rv = v.rv.length === 0 ? {} : JSON.parse(`{${v.rv.join(',')}}`);
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
  
  /** append: 領域に新規行を追加
   * @param {Object|Object[]} records=[] - 追加するオブジェクトの配列
   * @returns {Object} {success:[],failure:[]}形式
   */
  append(records){
    const v = {whois:this.constructor.name+'.append',step:0,rv:{success:[],failure:[],log:[]},
      cols:[],sheet:[]};
    console.log(`${v.whois} start.\nrecords(${whichType(records)})=${stringify(records)}`);
    try {
  
      // ------------------------------------------------
      v.step = 1; // 事前準備
      // ------------------------------------------------
      // 引数がオブジェクトなら配列に変換
      if( !Array.isArray(records) ) records = [records];
  
      // ------------------------------------------------
      v.step = 2; // 追加レコードを順次チェック
      // ------------------------------------------------
      for( v.i=0 ; v.i<records.length ; v.i++ ){
  
        v.step = 2.1; // ログオブジェクトのプロトタイプ生成
        v.log = {
          uuid: Utilities.getUuid(),
          timestamp: toLocale(new Date()),
          account: this.account,
          range: this.range,
          result: true,
          message: [],
          diff: JSON.stringify(records[v.i]),
        };
        vlog(v,['log'],v);
  
        v.step = 2.2; // pkey or uniqueの単一値チェック
        this.unique.cols.forEach(col => {
          console.log(`l.399 this.unique.map[${col}]=${stringify(this.unique.map[col])}, records[${v.i}]=${stringify(records[v.i])}`);
          if( records[v.i].hasOwnProperty(col) ){
            if( this.unique.map[col].indexOf(records[v.i][col]) >= 0 ){
              v.log.message.push(`unique error: col="${col}", value="${records[v.i][col]}"`);
            }
          }
        });
        vlog(v,['log'],v);
  
        v.step = 2.3; // auto_increment属性の項目について採番
        this.auto_increment.cols.forEach(col => {
          // あるべき値を計算
          v.tobe = this.auto_increment.map[col].max + this.auto_increment.map[col].val;
          if( records[v.i].hasOwnProperty(col) ){
            // 引数で指定されていた場合、計算値と引数が不一致ならエラー
            if( records[v.i][col] !== v.tobe ){
              v.log.message.push(`auto increment error: col="${col}", arg="${records[v.i][col]}", tobe="${v.tobe}"`);
            } else {
              // 計算値と引数が一致していた場合、this.auto_incrementを更新
              this.auto_increment.map[col].max = v.tobe;
            }
          } else {
            // 引数で指定されていなかった場合、項目とthis.auto_incrementを更新
            records[v.i][col] = v.tobe;
            this.auto_increment.map[col].max = v.tobe;
          }
        });
  
        v.step = 2.4; // エラー有無によって変わる値の設定
        if( v.log.message.length === 0 ){ // エラーが無かった場合
  
          v.step = 2.41; // 追加する行オブジェクトに既定値を補足(this.defaultObjの値をセット)
          Object.assign(records[v.i],this.defaultObj);
  
          v.step = 2.42; // ログオブジェクトに結果設定
          v.log.result = true;
          v.log.after = JSON.stringify(records[v.i]);
  
          v.step = 2.43; // 追加するレコードをシートイメージ(二次元配列)に追加
          for( v.j=0,v.row=[] ; v.j<this.header.length ; v.j++ ){
            v.row.push(records[v.i][this.header[v.j]] || null);
          }
          v.sheet.push(v.row);
  
          v.step = 2.44; // 戻り値への格納
          v.rv.success.push(records[v.i]);
  
        } else { // エラーが有った場合
  
          v.step = 2.45; // ログオブジェクトに結果設定
          v.log.result = false;
  
          v.step = 2.46; // 戻り値への格納
          v.rv.failure.push(records[v.i]);
        }
  
        v.step = 2.5; // エラーの有無にかかわらず、ログに追加
        v.rv.log.push(v.log);
      }
      vlog(v,['rv','log'],v);
  
      // ------------------------------------------------
      v.step = 3; // 正常レコードのシートへの追加
      // ------------------------------------------------
      if( v.sheet.length > 0 ){
        v.step = 3.1; // テーブルに排他制御をかける
        v.lock = LockService.getDocumentLock();
        v.cnt = this.maxTrial;
        while( v.cnt > 0 ){
          if( v.lock.tryLock(this.interval) ){
  
            v.step = 3.2; // 追加実行
            vlog(v,['cnt','sheet'],v);
            this.sheet.getRange(
              this.bottom + 1,
              this.left,
              v.rv.success.length,
              this.header.length
            ).setValues(v.sheet);
  
            v.step = 3.3; // テーブルの排他制御を解除、末端行番号を書き換え
            v.lock.releaseLock();
            this.bottom += v.sheet.length;
            v.cnt = -1;
          } else {
            v.step = 3.4; // 排他できなかった場合、試行回数を-1
            v.cnt--;
          }
        }
  
        v.step = 3.5; // リトライしても排他不能だった場合の処理
        if( v.cnt === 0 ){
          // 成功レコードを全て失敗に変更
          v.rv.failure = [...v.rv.success,...v.rv.failure];
          v.rv.success = [];
  
          v.rv.log.forEach(log => {
            log.result = false;
            log.message.push(`lock error`);
            delete log.after;
          });
          throw new Error(`could not get lock ${this.maxTrial} times.`);
        }
  
        v.step = 3.6; // this.data/rawに追加
        // ※シートへの書き込み後に実行のこと
        this.data = [...this.data,...v.rv.success];
        this.raw = [...this.raw,...v.sheet];
      }
  
  
      // ------------------------------------------------
      v.step = 4; // ログに記録
      // ------------------------------------------------
      v.rv.log.forEach(log => {
  
        v.step = 4.1; // エラーメッセージを配列から文字列に変換
        if( log.message.length === 0 ){
          delete log.message;
        } else {
          log.message = log.message.join('\n');
        }
        log.result = log.result ? 'OK' : 'NG';
  
        v.step = 4.2; // オブジェクトからシートイメージに変換
        v.row = [];
        this.log.header.forEach(col => {
          // log.result(boolean) === false だと空欄になる。∵falseと判定されているため
          // [falsyな値](https://mosa-architect.gitlab.io/frontend-techs/js/variable/falsy-values.html)
          // 0: 数字のゼロ
          // "": 長さゼロの文字列
          // false: booleanのfalse
          // null: null(明示的なnull)
          // undefined: 未定義(または何も代入されていない状態)
          // NaN: 数字ではない
          if( log[col] ){
            v.value = log[col];
          } else {
            if( log[col] === 0 ) v.value = '0';
            else if( log[col] === '' ) v.value = '';
            else if( log[col] === false ) v.value = 'false';
            else if( log[col] === null ) v.value = 'null';
            else if( log[col] === undefined ) v.value = 'undefined';
            else if( isNaN(log[col]) ) v.value = 'NaN';
            else v.value = null;
          }
          v.row.push(v.value);
        });
        v.tmp = log; vlog(v,['tmp','row'],v);
  
        v.step = 4.3; // ログに行追加
        this.log.sheet.appendRow(v.row);
      });
  
      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
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

