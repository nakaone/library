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
    dp :  // DocumentPropertiesにセットするSPkey,SSkey
      '{"SPkey":"aktC48wZPjYAhKlQKSLAqUg9Lipf9UPFylWu67Uhk1x+g8jjbisFIoQplCDAwRPpFMsgaZ4vScth5wlJJSJgQULvl/G5nsll+PZv/ao2sESQjmbCciVXT8YGzchd9bdmjyl8+TECZQr2YDku62UGZ/+ipSOiMfnI3zeZ0i78vvXLsn6xD+6tRN0qNLhVid2f8HoFeFG8vKxwAtrFqiDVeza18iuCpxWVqJJJp4LLqX6yJbgX29mRgRcTh5lzvzbTl6vU+PpZvoX7YHwB5X3vjfeiRl1feqWWXjHHJ/hy3kI6zbzhqsfRPlbGUm5W95CzwVTVajXH76jTBWmhh4tBtw==","SSkey":{"coeff":"69da777c3c7a4a341ec75689cbe3ba4217a219beb6f796bacca84efb5ff13e4e73ddb744526b660fce73cce64b59d3c001d89386101c9a2e60743afe81288259d1ca5a184ce78b56b78b9e2c36d43897fd5450705d40bc0a3b5099dd030b83acbd1efd188875715ae9a2706ae8ea87b602c9e70704882bc8166b36c1b792802b","d":"46dcd7428810d424005870e01b6c8070dad3741c3ff8d7d9318e749d236bb792ff0285ecf41cae1702c662c08080b7f0b8876af1141f8687969a0630c36c402b81f50ff67bbf30eea5f99ffe7179cad8605eef2c4c18e4dfd959de8593f924ef0a1ba8a620ac435ca440261f4798aeefffc1c36d16cbfbdb3f7a668c1f5329f85301d0fb9e8cefe4d4ab5a04cd2447df9fea8d63fa3be3a958ec3d50a77344093669cd33615807dba7f7ca84bbb06f540030ff798316aeae1858bed739eefafca78d582df49c01e74a8c203ff5ef0e1a03b70d74c7715e365e54882f18b4500851492d7b79aa8758165aac1964f74ba47b75f2f9f198a945e721bfd890ea29eb","dmp1":"837697c14116c81610f3161d1908377a79cdd18093e324fd586557a41ab430cdbc330c175a2f15c12c3e94fa5ffa919ae887983c24fba3059fab7666b1b3628224d34e9e04508ff29087a4439bd15684665ec590eb36c243c46048af3fd379d5d581bb5674d021f67c9fd0de09e321de1fcea7549a3f1621cac0afc5695bdcaf","dmq1":"5bfe9663d5a610ddadd30858fd84bf108698fa1653097521995afce459ee6ed08731c8279b92f0c6f1807c45e6321abae3608daf952964a2575e25286187c70e43673c84adf9ed2a21d738d3073e3b1590565be337a9a33f716c5e91a26f74f8ab139519d8b53785a6df0f522075484a9049494d9802e05e30212c230ac17a8b","e":"3","n":"6a4b42e3cc193e360084a9502922c0a9483d2e2a5ff543c5ca55aeebb521935c7e83c8e36e2b052284299420c0c113e914cb20699e2f49cb61e709492522604142ef97f1b99ec965f8f66ffdaa36b044908e66c27225574fc606cdc85df5b7668f297cf93102650af660392eeb650667ffa2a523a231f9c8df3799d22efcbef5cbb27eb10feead44dd2a34b85589dd9ff07a057851bcbcac7002dac5aa20d57b36b5f22b82a71595a89249a782cba97eb225b817dbd991811713879973bf36d397abd4f8fa59be85fb607c01e57def8df7a2465d5f7aa5965e31c727f872de423acdbce1aac7d13e56c6526e56f790b3c154d56a35c7efa8d30569a1878b41b7","p":"c531e3a1e1a22c21196ca12ba58c5337b6b4ba40ddd4b77c04980376280e49349a4c92230746a0a1c25ddf778ff7da685ccb645a377974886f81319a0a8d13c3373cf5ed0678d7ebd8cb766569ba01c6998e285960d22365a6906d06dfbd36c0c0429901af3832f1baefb94d0ed4b2cd2fb5fafee75ea132b02107a81e09cb07","q":"89fde195c079194c84bc8c857c471e98c9e577217c8e2fb266087b5686e5a638cacaac3b695c692a6a40ba68d94b28185510d4875fbe16f3830d37bc924baa95651adac704f6e3bf32c2d53c8add58a0588189d4d37e74df2a228dda73a72f75009d5fa6c50fd3487a4e96fb30afec6fd86dedf46404508d4831c234902237d1"}}',
  };
  const scenario = {
    dev: [{ // dev.01: 掲示板から全件取得。ローカルDB用のデータは取得するが、生成は無い
      setup: {obj:{'掲示板':'ifnot'},dp:'delete'},
      query: {table:'掲示板',command:'append',set:'authTest.dev.0'},
      opt: {mirror:[{name:'掲示板',interval:60000,func:()=>true}]},
      check: {status:'OK'},
    }],
  }
  function setupEnvironment(arg,src=sample) {  // setupEnvironment: テストに必要なシートを準備
    /**
     * @param {Object} arg
     * @param {Object.<string, string>} arg.obj - {シート名：措置}形式のオブジェクト
     * @param {Object} arg.src=sample - シート定義情報をまとめたオブジェクト
     * @param {string} arg.dp='asis' - DocumentPropertiesに対する措置
     * @param {string} arg.dpName='authServer' - DocumentPropertyのキー名
     * なお「シート名='default'」は、メンバ名が存在しないシートに対して行う措置。
     * またreadmeシートは必ず残す。
     *
     * 【措置の種類】
     * - force : 強制的に再作成
     * - ifnot : 不在なら作成、存在なら再作成しない(不在時作成。if not exist)
     * - delete: 強制削除(defaultの既定値)。存在していれば削除、再作成はしない
     * - asis  : そのまま何もしない
     */
    const v = { whois: 'doTest.setupEnvironment', rv: null,
      spread: SpreadsheetApp.getActiveSpreadsheet(), dp:PropertiesService.getDocumentProperties()};
    dev.start(v.whois, [...arguments]);
    try {

      // 引数に既定値を設定
      arg = Object.assign({src: sample,dp: 'asis',dpName: 'authServer'},arg);

      // DocumentPropertyを措置
      if( arg.dp === 'force' || arg.dp === 'delete' ){
        v.dp.deleteProperty(arg.dpName);
      }
      if( arg.dp === 'force' || (arg.dp === 'ifnot' && !v.dp.getProperty(arg.dpName))){
        v.dp.setProperty(arg.dpName,arg.src.dp);
      }

      // コンソールへの出力を抑止
      dev.changeOption({start:false,arg:false,step:false});

      dev.step(1); // 指定が有るシートのリストアップ
      v.specified = Object.keys(arg.obj);
      v.i = v.specified.findIndex(x => x === 'default');
      if (v.i >= 0) v.specified.splice(v.i, 1);

      dev.step(2); // 既定値の設定
      v.obj = Object.assign({'default':'delete'},arg.obj);

      dev.step(3); // 存在する全シートのリストアップ
      v.list = v.spread.getSheets().map(x => x.getName());

      dev.step(4); // readmeは削除対象から外す
      v.i = v.list.findIndex(x => x === 'readme');
      if (v.i >= 0) v.list.splice(v.i, 1);

      for( v.i=0 ; v.i<v.list.length ; v.i++ ){
        dev.step(5.1); // シートに対する措置を特定
        v.command = v.specified.includes(v.list[v.i]) ? v.obj[v.list[v.i]] : v.obj.default;

        dev.step(5.2); // 強制的に再作成(force)、または強制削除(delete)ならシートを削除
        if( v.command === 'force' || v.command === 'delete' ){
          v.spread.deleteSheet(v.spread.getSheetByName(v.list[v.i]));
        }
      }

      for( v.i=0 ; v.i<v.specified.length ; v.i++ ){
        dev.step(6.1); // シートに対する措置を特定
        v.command = v.obj[v.specified[v.i]];

        dev.step(6.2); // 強制的に再作成(force)、またはシート不存在で不在時作成(ifnot)ならシートを作成
        if( v.command === 'force' || (v.list.includes(v.specified[v.i]) === false && v.command === 'ifnot' )){
          v.r = SpreadDb({  // 対象シート作成
            command: 'create',
            table: v.specified[v.i],
            cols: (arg.src[v.specified[v.i]].cols || null),
            set: (arg.src[v.specified[v.i]].set || null),
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

    // -------------------------------------------------------------
    // 対象シナリオ群の特定
    // -------------------------------------------------------------
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

      // -------------------------------------------------------------
      dev.step(2); // v.st, v.edを計算
      // -------------------------------------------------------------
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

      // -------------------------------------------------------------
      dev.step(3); // シナリオを順次実行
      // -------------------------------------------------------------
      for (v.idx = v.st; v.idx < v.ed; v.idx++) {
        v.scenario = scenario[v.scenarioList[v.sno]][v.idx];

        dev.step(3.1); // シートの準備。テスト開始時はlogシートを削除、それ以外は追記にする
        v.r = setupEnvironment(Object.assign(v.scenario.setup,{'log':(v.counter === 0 ? 'delete' : 'asis')}));
        if (v.r instanceof Error) throw v.r;

        dev.step(3.2); // authClientのインスタンス化
        v.ac = authClient(v.scenario.opt);

        dev.step(3.3); // scenarioからqueryとoptをセットしてテスト実施、NG時は中断
        if (false === dev.check({
          asis: v.ac.request(v.scenario.query),
          tobe: (v.scenario.check || undefined),
          title: `${v.whois}.${v.scenarioList[v.sno]}.${v.idx}`,
        })) throw new Error(`check NG`);
      }
    }

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}