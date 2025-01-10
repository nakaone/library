/** constructor: 擬似メンバの値設定、変更履歴テーブルの準備 */
function constructor(query,opt){
  const v = {whois:`${pv.whois}.constructor`,step:0,rv:null};
  try {
    console.log(`${v.whois} start`);

    v.step = 1; // 擬似メンバに値を設定
    Object.assign(pv,{
      query: query,
      opt: Object.assign({
        userId: 'guest', // {string} ユーザの識別子
        userAuth: {}, // {Object.<string,string>} テーブル毎のアクセス権限。{シート名:rwdos文字列} 形式
        log: 'log', // {string}='log' 更新履歴テーブル名
        maxTrial: 5, // number}=5 シート更新時、ロックされていた場合の最大試行回数
        interval: 10000, // number}=10000 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
        guestAuth: {}, // {Object.<string,string>} ゲストに付与する権限。{シート名:rwdos文字列} 形式
        adminId: 'Administrator', // {string} 管理者として扱うuserId
        sdbQuery: [
          {name:'timestamp',type:'string',note:'更新日時(ISO8601拡張形式)',default:()=>{return toLocale(new Date())}},
          {name:'userId',type:'string|number',note:'ユーザ識別子(uuid等)',default:()=>{return pv.opt.userId}},
          {name:'queryId',type:'string',note:'SpreadDb呼出元で設定する、クエリ・結果突合用文字列。未設定の場合は主処理でUUIDを設定',default:()=>{return Utilities.getUuid()}},
          {name:'table',type:'string',note:'操作対象テーブル名',default:()=>''},
          {name:'command',type:'string',note:'操作名',default:()=>''},
          {name:'cols',type:'sdbColumn[]',note:'新規作成シートの項目定義オブジェクトの配列',default:()=>[]},
          {name:'where',type:'Object|Function|string',note:'対象レコードの判定条件',default:()=>null},
          {name:'set',type:'Object|string|Function',note:'追加・更新する値',default:()=>[]},
          {name:'qSts',type:'string',note:'クエリ単位の実行結果',default:()=>'OK'},
          {name:'result',type:'Object[]',note:'レコード単位の実行結果',default:()=>[]},
        ],
        sdbTable: [
          {name:'name',type:'string',note:'テーブル名(範囲名)'},
          {name:'account',type:'string',note:'更新者のuserId(識別子)',default:()=>{return pv.opt.userId}},
          {name:'sheet',type:'Sheet',note:'スプレッドシート内の操作対象シート(ex."master"シート)'},
          {name:'schema',type:'sdbSchema',note:'シートの項目定義',default:()=>objectizeColumn('sdbSchema')},
          {name:'values',type:'Object[]',note:'行オブジェクトの配列。{項目名:値,..} 形式',default:()=>[]},
          {name:'header',type:'string[]',note:'項目名一覧(ヘッダ行)',default:()=>[]},
          {name:'notes',type:'string[]',note:'ヘッダ行のメモ',default:()=>[]},
          {name:'colnum',type:'number',note:'データ領域の列数',default:()=>0},
          {name:'rownum',type:'number',note:'データ領域の行数(ヘッダ行は含まず)',default:()=>0},
        ],
        sdbSchema: [
          {name:'cols',type:'sdbColumn[]',note:'項目定義オブジェクトの配列',default:()=>[]},
          {name:'primaryKey',type:'string',note:'一意キー項目名'},
          {name:'unique',type:'Object.<string, any[]>',note:'primaryKeyおよびunique属性項目の管理情報。メンバ名はprimaryKey/uniqueの項目名',default:()=>new Object()},
          {name:'auto_increment',type:'Object.<string,Object>',note:'auto_increment属性項目の管理情報。メンバ名はauto_incrementの項目名',default:()=>new Object()},
          {name:'defaultRow',type:'Object|function',note:'既定値項目で構成されたオブジェクト。appendの際のプロトタイプ',default:()=>new Object()},
        ],
        sdbColumn: [ // sdbColumnの属性毎にname,type,noteを定義
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
        sdbLog: [
          {name:'logId',type:'UUID',primaryKey:true,default:()=>{return Utilities.getUuid()}},
          {name:'timestamp',type:'string',note:'更新日時'},
          {name:'userId',type:'string',note:'ユーザ識別子',default:()=>{return pv.opt.userId}},
          {name:'queryId',type:'string',note:'クエリ・結果突合用識別子'},
          {name:'table',type:'string',note:'対象テーブル名'},
          {name:'command',type:'string',note:'操作内容(コマンド名)'},
          {name:'data',type:'JSON',note:'操作関数に渡された引数'},
          {name:'qSts',type:'string',note:'クエリ単位の実行結果'},
          {name:'pKey',type:'string',note:'変更したレコードのprimaryKey'},
          {name:'rSts',type:'string',note:'レコード単位の実行結果'},
          {name:'diff',type:'JSON',note:'差分情報。{項目名：[更新前,更新後]}形式'},
        ],
        sdbResult: [
          {name:'pKey',type:'string',note:'処理対象レコードの識別子'},
          {name:'rSts',type:'string',note:'レコード単位の実行結果',default:()=>'OK'},
          {name:'diff',type:'Object',note:'当該レコードの変更点',default:()=>new Object()},
        ],
      },opt),
      spread: SpreadsheetApp.getActiveSpreadsheet(), // スプレッドシートオブジェクト
      table: {}, // スプレッドシート上の各テーブル(領域)の情報
    });

    v.step = 2; // 変更履歴テーブルのsdbTable準備
    v.r = genTable({name:pv.opt.log,cols:pv.opt.sdbLog});
    if( v.r instanceof Error ) throw v.r;

    v.step = 4; // 変更履歴のシートが不在なら作成
    if( pv.table[pv.opt.log].sheet === null ){
      v.r = objectizeColumn('sdbQuery');
      if( v.r instanceof Error ) throw v.r;
      v.query = Object.assign(v.r,{
        userId: pv.opt.adminId,
        table: pv.opt.log,
        command: 'create',
        cols: pv.opt.sdbLog,
      });

      v.r = createTable(v.query);
      if( v.r instanceof Error ) throw v.r;
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v,(key,val)=>typeof val==='function'?val.toString():val,2)}`);
    return e;
  }
}