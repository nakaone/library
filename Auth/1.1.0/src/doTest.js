/*
  authClient/Server 統合テスト
    「authClient -> authPost(テスト用doGet) -> authServer」のテストを行う。
    authClientへの戻り値はオブジェクトとし、alaSQL(create table)は割愛。
    GASの専用シートを用意、本ソースをコピペしてauthTest()を実行
*/
function doTest(sce='dev',start=0,num=1) { // sce='all'->全パターン、num=0->start以降全部、num<0->start無視して後ろから
  const v = { whois: 'doTest', rv: null, counter: 0};
  const sample = { // テスト用サンプルデータ
    '掲示板': {
      set: [
        ['timestamp', 'from', 'to', 'message'],
        ['2022-10-27T06:23:43.168Z', 'パパ', '本部', 'ご本部様\nご機嫌麗しく...'],
        ['2022-10-27T07:24:24.216Z', '嶋津パパ', '嶋津ママ', '追加のテスト'],
        ['2022-10-27T07:34:46.564Z', 'パパ', 'スタッフ全員', 'ぼけ'],
        ['2022-10-27T07:57:16.144Z', '(未定義)', 'スタッフ全員', 'ほれほれ'],
        ['2022-10-27T08:05:03.631Z', 'パパ', '金魚すくい担当', 'by みゆきさま'],
        ['2022-10-27T08:49:32.196Z', '屋上テラス', '射的担当', '今日も都庁がよく見える。\n特に意味はない。\nホントだよ'],
        ['2022-10-27T10:09:54.791Z', '右に空白', 'スタッフ全員', 'textareaの幅がおかしい\n'],
        ['2022-10-27T16:02:50.217Z', 'ぱぱ', '校内探検担当', '目が覚めた…\nもっかい寝よ'],
        ['2022-10-28T03:03:10.982Z', 'まま', 'カレー担当', '玉ねぎは薄切り希望'],
        ['2022-10-28T08:35:49.937Z', '嶋津', 'スタッフ全員', 'さて、名前が保存されてるかな？'],
        ['2022-10-28T08:36:15.515Z', '嶋津', 'スタッフ全員', 'されてた❤'],
        ['2022-11-01T06:15:23.668Z', '嶋津ぱぱ', '受付担当', 'トイレ行きたい\n誰か来て'],
        ['2022-11-09T04:48:51.137Z', 'ぱぱ', '校内探検担当', '下校中の小学生、\n元気だなぁ'],
        ['2022-12-06T07:11:41.330Z', 'しまづパパ', 'スタッフ全員', 'てすと'],
        ['2022-12-23T07:21:21.888Z', '嶋津ぱぱ', '校内探検担当', 'わるいごは　いねが〜\nカチャトーラには ビネガ〜'],
        ['2023-01-20T08:41:22.368Z', 'shimazu', 'スタッフ全員', 'Hello, world.'],
        ['2023-01-25T23:46:08.402Z', '半弗　値絵夢', 'スタッフ全員', 'たちつてと'],
        ['2023-01-30T06:13:30.312Z', '水戸黄門', 'スタッフ全員', '控えおろうっ！'],
        ['2023-01-31T05:42:42.836Z', '手簾戸', 'スタッフ全員', '投稿140'],
      ],
    },
  };
  const scenario = {
    dev: [{ // dev.01: 掲示板から全件取得。ローカルDB用のデータは取得するが、生成は無い
      setup: {'掲示板':'ifnot'},
      query: 'くえり',
      opt: {},
      check: [],
    }],
  }
  function setupSheet(arg,src=sample) {  // setupSheet: テストに必要なシートを準備
    /**
     * @param {Object.<string, string>} arg - {シート名：措置}形式のオブジェクト
     * @param {Object} src=sample - シート定義情報をまとめたオブジェクト
     * なお「シート名='default'」は、メンバ名が存在しないシートに対して行う措置。
     * またreadmeシートは必ず残す。
     *
     * 【措置の種類】
     * - force : 強制的に再作成
     * - ifnot : 不在なら作成、存在なら再作成しない(不在時作成。if not exist)
     * - delete: 強制削除(defaultの既定値)。存在していれば削除、再作成はしない
     * - asis  : そのまま何もしない
     */
    const v = { whois: 'doTest.setupSheet', rv: null, spread: SpreadsheetApp.getActiveSpreadsheet()};
    dev.start(v.whois, [...arguments]);
    try {

      // コンソールへの出力を抑止
      dev.changeOption({start:false,arg:false,step:false});

      dev.step(1); // 指定が有るシートのリストアップ
      v.specified = Object.keys(arg);
      v.i = v.specified.findIndex(x => x === 'default');
      if (v.i >= 0) v.specified.splice(v.i, 1);

      dev.step(2); // 既定値の設定
      v.arg = Object.assign({'default':'delete'},arg);

      dev.step(3); // 存在する全シートのリストアップ
      v.list = v.spread.getSheets().map(x => x.getName());

      dev.step(4); // readmeは削除対象から外す
      v.i = v.list.findIndex(x => x === 'readme');
      if (v.i >= 0) v.list.splice(v.i, 1);

      for( v.i=0 ; v.i<v.list.length ; v.i++ ){
        dev.step(5.1); // シートに対する措置を特定
        v.command = v.specified.includes(v.list[v.i]) ? v.arg[v.list[v.i]] : v.arg.default;

        dev.step(5.2); // 強制的に再作成(force)、または強制削除(delete)ならシートを削除
        if( v.command === 'force' || v.command === 'delete' ){
          v.spread.deleteSheet(v.spread.getSheetByName(v.list[v.i]));
        }
      }

      for( v.i=0 ; v.i<v.specified.length ; v.i++ ){
        dev.step(6.1); // シートに対する措置を特定
        v.command = v.arg[v.specified[v.i]];

        dev.step(6.2); // 強制的に再作成(force)、またはシート不存在で不在時作成(ifnot)ならシートを作成
        if( v.command === 'force' || (v.list.includes(v.specified[v.i]) === false && v.command === 'ifnot' )){
          v.r = SpreadDb({  // 対象シート作成
            command: 'create',
            table: v.specified[v.i],
            cols: (src[v.specified[v.i]].cols || null),
            set: (src[v.specified[v.i]].set || null),
          }, { userId: 'Administrator' });
          if (v.r instanceof Error) return v.r;
        }
      }

      // コンソールへの出力を再開
      dev.changeOption({start:true,arg:true,step:true});

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  // doTest主処理
  dev.start(v.whois, [...arguments]);
  try {

    dev.step(1);  // v.scenarioListに対象シナリオ群を格納
    if (sce === 'all') {
      v.scenarioList = Object.keys(scenario);
      start = 0;
      num = 0;
      dev.changeOption({ start: false, step: false });
    } else {
      v.scenarioList = Array.isArray(sce) ? sce : [sce];
    }

    for (v.sno = 0; v.sno < v.scenarioList.length; v.sno++) {

      dev.step(2); // v.st, v.edを計算
      if (num < 0) {
        dev.step(2.1); // 指定テストパターン群の後ろからnum個
        v.st = scenario[v.scenarioList[v.sno]].length - num;
        v.ed = scenario[v.scenarioList[v.sno]].length;
      } else if (num === 0) {
        dev.step(2.2); // 指定テストパターン群全部実行
        v.st = start;
        v.ed = scenario[v.scenarioList[v.sno]].length;
      } else {
        dev.step(2.3); // startからnum個
        v.st = start;
        v.ed = start + num;
      }

      dev.step(3);
      for (v.idx = v.st; v.idx < v.ed; v.idx++) {
        v.scenario = scenario[v.scenarioList[v.sno]][v.idx];

        dev.step(3.1); // シートの準備。テスト開始時はlogシートを削除、それ以外は追記にする
        v.r = setupSheet(Object.assign(v.scenario.setup,{'log':(v.counter === 0 ? 'delete' : 'asis')}));
        if (v.r instanceof Error) throw v.r;

        dev.step(3.2); // scenarioからqueryとoptをセットしてテスト実施、NG時は中断
        if (false === dev.check({
          asis: authClient(v.scenario.query,v.scenario.opt),
          tobe: (v.scenario.check || undefined),
          title: `${v.whois}.${v.scenarioList[v.sno]}.${v.idx}`,
        })) throw new Error(`check NG`);
      }
    }

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}