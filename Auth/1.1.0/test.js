const dev = devTools();
const authTest = () => doTest('dev',0,1); // 引数はscenario, start, num
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

// authClient/Server共通設定・関数集
const authCommon = {
  option: {
    tokenExpiry: 600000,  //(10分) トークンの有効期間(ミリ秒)
    passcodeDigit: 6, //  パスコードの桁数
    passcodeExpiry: 600000, // (10分) パスコードの有効期間(ミリ秒)
    maxTrial: 3, //パスコード入力の最大試行回数
    validityExpiry: 86400000, // (1日) ログイン有効期間(ミリ秒)
    maxDevices: 5,  // 単一アカウントで使用可能なデバイスの最大数
    freezing: 3600000,  // 連続失敗した場合の凍結期間。ミリ秒。既定値1時間
    bits: 2048, // RSA鍵ペアの鍵長
    adminMail: null,  // 管理者のメールアドレス
    adminName: null, //管理者名
  },
  typedefs: {
    acRequest_query: [  // アプリからac.requestへの引数"query"
      {name:'table',type:'string',value:'',note:''},
      {name:'command',type:'string',value:'',note:''},
      {name:'where',type:'object|function|string',value:'',note:''},
      {name:'set',type:'object|function|string',value:'',note:''},
    ],
    asMain_query: [ // ac.requestからas.mainへのquery。acRequest_queryに以下のメンバを追加
      {name:'queryId',type:'string',value:()=>Utilities.getUuid(),note:''},
      {name:'timestamp',type:'string',value:()=>toLocale(new Date()),note:''},
      {name:'userId',type:'string',value:'',note:''},
      {name:'CPkey',type:'string',value:'',note:''},
      {name:'email',type:'string',value:'',note:''},
      {name:'passcode',type:'number',value:-1,note:''},
    ],
    authServer: [ // authServerの戻り値。asMain_query(含acRequest_query)に以下のメンバを追加
      {name:'SPkey',type:'string',value:'',note:' サーバ側公開鍵'},
      {name:'qSts',type:'string',value:'OK',note:' クエリ単位の実行結果'},
      {name:'num',type:'number',value:-1,note:' 変更された行数。append:追加行数、update:変更行数、select:抽出行数、schema:0(固定)'},
      {name:'result',type:'object[]',value:[],note:' レコード単位の実行結果'},
      {name:'status',type:'string',value:'OK',note:' authServerの実行結果'},
    ],
  }
}

function authClient(option={}) {
  const pv = {whois:'authClient'}, v = {rv: null};
  const typedefs = {
    acMembers: [  // pv(メンバ)
      {name:'opt',type:'object',value:{},note:''},
      {name:'userId',type:'string',value:'',note:'ユーザ識別子'},
      {name:'email',type:'string',value:'',note:'ユーザのメールアドレス'},
      {name:'CSkey',type:'object',value:{},note:'クライアント側秘密鍵'},
      {name:'CPkey',type:'string',value:'',note:'クライアント側公開鍵'},
      {name:'SPkey',type:'string',value:'',note:'サーバ側公開鍵'},
    ],
    acMain_option:[ // pv.optの内、authClient独自設定項目(引数により設定値の変更が可能な項目)
      {name:'storageKey',type:'string',value:'authClient',note:'localStorageのキー名'},
      {name:'saveUserId',type:'boolean',value:true,note:'userIdをlocalStorageに保存するか否か'},
      {name:'saveEmail',type:'boolean',value:false,note:'e-mailをlocalStorageに保存するか否か'},
      {name:'mirror',type:'object',value:[],note:'ローカル側にミラーを保持するテーブルの定義'},
    ],
    mirrorDef: [
      {name:'name',type:'string',value:'',note:'ミラーリングするテーブル名'}, // valueのデータ型はtypeに一致させる
      {name:'func',type:'function',value:()=>true,note:'定期実行ジョブ'},
      {name:'interval',type:'number',value:300000,note:'実行間隔(ミリ秒)'},
    ],
  };
  dev.start(pv.whois, [...arguments]);
  try { // 主処理(constructor)

    // -------------------------------------------------------------
    dev.step(1); // メンバ(pv)に引数を保存、未指定分には既定値を設定
    // -------------------------------------------------------------
    // authClient/Server共通データ型定義をtypedefsに追加
    Object.keys(authCommon.typedefs).forEach(x => typedefs[x] = authCommon.typedefs[x]);
    // メンバの初期値を設定
    v.r = createObject({defs:typedefs,root:'acMembers',addTo:pv});
    if( v.r instanceof Error ) throw v.r;
    // authClient/Server共通オプション設定値
    pv.opt = Object.assign({},authCommon.option);
    // authClient独自設定値
    v.r = createObject({defs:typedefs,root:'acMain_option',val:option,addTo:pv.opt});
    if( v.r instanceof Error ) throw v.r;
    dev.dump(pv,244);

    // -------------------------------------------------------------
    dev.step(2); // CSkey/CPkeyを準備
    // -------------------------------------------------------------
    pv.CSkey = cryptico.generateRSAKey(createPassword(),pv.opt.bits);
    pv.CPkey = cryptico.publicKeyString(pv.CSkey);

    // -------------------------------------------------------------
    dev.step(3);  // URLクエリ・localStorageからuserId/e-mail取得を試行
    // -------------------------------------------------------------
    // localStorageからの取得試行
    v.ls = JSON.parse(localStorage.getItem(pv.opt.storageKey));
    if( v.ls !== null ){
      pv.userId = v.ls.userId || '';
      pv.email = v.ls.email || '';
    }
    // URLクエリからの取得試行
    for (const [key, value] of new URLSearchParams(location.search).entries()) {
      if( key === 'userId' || key === 'email' ) pv[key] = value;
    }
    // userIdが何れにも存在しない場合、UUIDを設定(ゲスト)
    if( pv.userId === '' ) pv.userId = Utilities.getUuid();

    // -------------------------------------------------------------
    dev.step(4); // ミラーリングするテーブルの全件データ要求
    // -------------------------------------------------------------
    dev.dump(pv.opt.mirror,259);
    v.query = [];
    v.crond = [];
    pv.opt.mirror.forEach(mirror => {
      // ミラーするテーブルの構成情報とレコード全件の要求
      v.query.push({table:mirror.name,command:'schema'});
      v.query.push({table:mirror.name,command:'select',where:'()=>true'});
      // 差分取得のcron定義(crondの引数オブジェクト)を作成
      if( mirror.interval > 0 ){
        v.crond.push({name:mirror.name,interval:mirror.interval,func:()=>{
          v.r = alasql("select max(updated) as lastUpdate from "+mirror.name)[0].lastUpdate;
          this.request({table:mirror.name,command:'select',
            where:'o=>{return new Date(o.updated).getTime() > '+(new Date(v.r).getTime())+' ? true : false}'})
        }});
      }
    });
    dev.dump(v.query,266);
    v.r = request(v.query);
    if( v.r instanceof Error ) throw v.r;

    // crondのセット
    v.crond.forEach(x => crond.set(x));
    dev.dump(v.r,269);


    dev.end(); // 終了処理
    v.rv = {request:request};
    return v.rv;

  } catch (e) { dev.error(e); return e; }

  function request(query) {
    const v = { whois: `${pv.whois}.request`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------
      v.rv = authPost(query);

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }
}

function authServer(query,option={}) {
  const pv = { whois: 'authServer' }, v = { rv: null, now:toLocale(Date.now()) };
  const typedefs = {
    asMembers: [  // pv(メンバ)
      {name:'query',type:'object',value:{},note:''},
      {name:'opt',type:'object',value:{},note:''},
      {name:'SSkey',type:'object',value:{},note:'サーバ側秘密鍵'},
      {name:'SPkey',type:'string',value:'',note:'サーバ側公開鍵'},
      {name:'account',type:'object',value:{},note:'accountsシートから抽出したユーザ情報(行オブジェクト)'},
      {name:'device',type:'object',value:{},note:'devicesシートから抽出したユーザ情報(行オブジェクト)'},
    ],
    asMain_option:[ // pv.optの内、authServer独自設定項目(引数により設定値の変更が可能な項目)
      {name:'DocPropName',type:'string',value:"authServer",note:'DocumentPropertiesの項目名'},
      {name:'sdbOption',type:'object',value:{},note:'SpreadDbのオプション'},
      {name:'accountsTableName',type:'string',value:'accounts',note:'アカウント管理シートの名前'},
      {name:'devicesTableName',type:'string',value:'devices',note:'デバイス管理シートの名前'},
      {name:'guestAccount',type:'object',value:{},note:'ゲストのアカウント管理設定'},
      {name:'guestDevice',type:'object',value:{},note:'ゲストのデバイス管理設定'},
      {name:'newAccount',type:'object',value:{},note:'新規登録者のアカウント管理設定'},
      {name:'newDevice',type:'object',value:{},note:'新規登録者のデバイス管理設定'},
      {name:'validitySpan',type:'number',value:1209600000,note:'アカウントの有効期間(2週間)'},
    ],
    accountsSheet: [  // 「アカウント管理シート」の項目定義
      {name:'userId',type:'string|number',note:'ユーザ識別子(primaryKey)',auto_increment:101,primaryKey:true},
      {name:'email',type:'string',note:'ユーザのメールアドレス(primaryKey)',primaryKey:true},
      {name:'name',type:'string',note:'ユーザの氏名'},
      {name:'phone',type:'string',note:'ユーザの電話番号'},
      {name:'address',type:'string',note:'ユーザの住所'},
      {name:'note',type:'string',note:'アカウント情報(備考)'},
      {name:'validityStart',type:'string',note:'有効期間開始日時(ISO8601文字列)',default:()=>toLocale(Date.now())},
      {name:'validityEnd',type:'string',note:'有効期間終了日時(ISO8601文字列)',default:()=>toLocale(Date.now()+pv.opt.validitySpan)},
      {name:'authority',type:'JSON',note:'シート毎のアクセス権限。{シート名:rwdos文字列} 形式。既定値は無し'},
      {name:'created',type:'string',note:'=Date.now() ユーザ登録日時(ISO8601拡張形式)',default:()=>toLocale(Date.now())},
      {name:'updated',type:'string',note:'=Date.now() 最終更新日時(ISO8601拡張形式)',default:()=>toLocale(Date.now())},
      {name:'deleted',type:'string',note:'論理削除日時'},
    ],
    devicesSheet: [ // 「デバイス管理シート」の項目定義
      {name:'userId',type:'string|number',note:'ユーザ識別子。not null'},
      {name:'CPkey',type:'string',note:'クライアント側公開鍵'},
      {name:'CPkeyExpiry',type:'string',note:'CPkey有効期限'},
      {name:'note',type:'string',note:'ユーザ情報(備考)'},
      {name:'trial',type:'authTrial',note:'ログイン試行情報'},
      {name:'created',type:'string',note:'=Date.now() ユーザ登録日時(ISO8601拡張形式)'},
      {name:'updated',type:'string',note:'=Date.now() 最終更新日時(ISO8601拡張形式)'},
      {name:'deleted',type:'string',note:'論理削除日時'},
    ],
    authTrial: [  // ログイン試行関連情報
      {name:'passcode',type:'number',note:'設定されたパスコード',
        value:()=>{return Math.trunc(Math.random()*(10 ** pv.opt.passcodeDigit))}},
      {name:'datetime',type:'string',note:'パスコード通知メール送信日時',value:()=>toLocale(Date.now())},
      {name:'log',type:'authTrialLog',note:'試行履歴情報',value:{}},
      {name:'thawing',type:'string',note:'凍結解除日時',value:null},
    ],
    authTrialLog: [ // authTrial.logにセットするオブジェクト
      {name:'dt',type:'string',note:'パスコード検証日時',value:()=>toLocale(Date.now())},
      {name:'pc',type:'number',note:'ユーザが入力したパスコード',value:null},
      {name:'st',type:'number',note:'ステータス(連続失敗回数)。成功なら0',value:0},
    ],
  };
  dev.start(pv.whois, [...arguments]);
  try {

    // メンバ(pv)に引数を保存、未指定分には既定値を設定
    // SSkey/SPkeyをメンバ(pv)に準備＋DocumentPropertiesに保存
    // accounts/devicesシートが未作成なら追加＋ユーザ情報取得
    if( userIdがqueryに不存在) {

    } else {  // userIdが存在

    }
    // 処理要求を復元＋署名確認
    // 処理要求を実行、戻り値を作成
    // -------------------------------------------------------------
    dev.step(2); // メンバ(pv)に引数を保存、未指定分には既定値を設定
    // -------------------------------------------------------------
    // authClient/Server共通データ型定義をtypedefsに追加
    Object.keys(authCommon.typedefs).forEach(x => typedefs[x] = authCommon.typedefs[x]);
    // メンバの初期値を設定
    v.r = createObject({defs:typedefs,root:'asMembers',addTo:pv});
    if( v.r instanceof Error ) throw v.r;
    // authClient/Server共通設定値
    pv.opt = Object.assign({},authCommon.option);
    // authServer独自設定値
    v.r = createObject({defs:typedefs,root:'asMain_option',val:option,addTo:pv.opt});
    if( v.r instanceof Error ) throw v.r;

    // 引数queryをpv.queryにセット
    typedefs.asMain_query = typedefs.acRequest_query.concat(typedefs.asMain_query);
    v.r = createObject({defs:typedefs,root:'asMain_query',val:query,addTo:pv.query});
    if( v.r instanceof Error ) throw v.r;
    // pv.queryにauthServer内でセットすべき項目を追加
    v.r = createObject({defs:typedefs,root:'authServer',addTo:pv.query});
    if( v.r instanceof Error ) throw v.r;

    dev.dump(pv,394);


    // -------------------------------------------------------------
    dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
    // -------------------------------------------------------------
    //constructor(query,option);

    dev.end(); // 終了処理
    return pv.query;

  } catch (e) { dev.error(e); return e; }

  function constructor(query,option) {
    const v = { whois: `${pv.whois}.constructor`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1); // メンバ(pv)に引数を保存、未指定分には既定値を設定
      // -------------------------------------------------------------







      Object.assign(pv, {
        query: Object.assign({
          queryId: Utilities.getUuid(), // {string} クエリ・結果突合用文字列
          table: '', // {string} 操作対象テーブル名
          command: '', // {string} 操作名
          where: null, // {Object|Function|string} 対象レコードの判定条件
          set: null, // {Object|Object[]|string|string[]|Function} 追加・更新する値
          timestamp: toLocale(new Date()), // {string} 更新日時(ISO8601拡張形式)
          userId: null, // {string|number} ユーザ識別子(uuid等)
          email: '', // {string} ユーザのメールアドレス
          CPkey: '', // {string} ユーザの公開鍵
          passcode: null, // {number|string} 入力されたパスコード
          SPkey: null, // {string} サーバ側公開鍵
          qSts: 'OK', // {string} クエリ単位の実行結果
          num: 0, // {number} 変更された行数
          result: [], // {sdbResult[]} レコード単位の実行結果
          status: 'OK', // {string} authServerの実行結果
        },query),
        opt: Object.assign({
          DocPropName: 'authServer', // DocumentPropertiesの項目名
          sdbOption: {}, // SpreadDbのオプション
          accountsTableName: 'accounts', // アカウント管理シートの名前
          devicesTableName: 'devices', // デバイス管理シートの名前
          guestAccount: null, // ゲストのアカウント管理設定
          guestDevice: null, // ゲストのデバイス管理設定
          newAccount: null, // 新規登録者のアカウント管理設定
          newDevice: null, // 新規登録者のデバイス管理設定
          validitySpan: 1209600000, // アカウントの有効期間(2週間)
        },option,authCommon.option),
        SPkey: null,
        SSkey: null,
        account: null,
        device: null,
        typedefs: {
        },
        DocumentProperties: PropertiesService.getDocumentProperties(),
      });

      // -------------------------------------------------------------
      dev.step(2); // SSkey/SPkeyを準備
      // -------------------------------------------------------------
      v.prop = pv.DocumentProperties.getProperty(pv.opt.DocPropName);
      if( v.prop ){
        dev.step(2.1); // JSON化された秘密鍵は復元
        v.prop = JSON.parse(v.prop);
        v.prop.SSkey = RSAKey.parse(v.prop.SSkey);
      } else {
        v.prop = {};
        dev.step(2.21); // RSA鍵ペア生成
        v.prop.SSkey = cryptico.generateRSAKey(createPassword(),pv.opt.bits);
        v.prop.SPkey = cryptico.publicKeyString(v.prop.SSkey);
        dev.step(2.22); // JSON化してDocumentPropertyに保存
        pv.DocumentProperties.setProperty(pv.opt.DocPropName,
          JSON.stringify({SPkey:v.prop.SPkey,SSkey:v.prop.SSkey.toJSON()}));
      }
      dev.step(2.3); // メンバとして保存
      pv.query.SPkey = pv.SPkey = v.prop.SPkey;
      pv.SSkey = v.prop.SSkey;
      dev.dump(pv.DocumentProperties.getProperty(pv.opt.DocPropName),330)

      // -------------------------------------------------------------
      dev.step(3); // accounts/devicesシートが未作成なら追加＋ユーザ情報取得
      // -------------------------------------------------------------
      v.query = [
        {command: 'create',table:pv.opt.accountsTableName,cols:pv.typedefs.accountsSheet},
        {command: 'create',table:pv.opt.devicesTableName,cols:pv.typedefs.devicesSheet},
      ];
      if( pv.query.userId ){
        dev.step(3.1);
        v.query = [...v.query,[
          {command:'select',table:pv.opt.accountsTableName,where:{userId:pv.query.userId}},
          {command:'select',table:pv.opt.devicesTableName,where:{userId:pv.query.userId}},
        ]];
      }
      dev.step(3.2);
      v.r = SpreadDb(v.query, { userId: 'Administrator' });
      if( v.r instanceof Error ) throw v.r;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }
}

function authPost(arg) {
  const v = { whois: 'authPost', rv: null};
  dev.start(v.whois, [...arguments]);
  try {
    v.rv = authServer(arg);
    dev.end(); // 終了処理
    return v.rv;
  } catch (e) { dev.error(e); return e; }
}

/** crond: 定期的に実行するジョブを管理する
 * sessionが切れたらジョブを停止、管理情報も消去する
 * 
 * - crond.set({name:ジョブ名,func:ジョブ(関数),interval:実行間隔})
 * - crond.clear(取消ジョブ名 or null(全件取消))
 */
const crond = {

  /** set: 定期実行ジョブを設定
   * @param {Object} arg
   * @param {string} arg.name - ジョブを特定する名称
   * @param {function} arg.func - ジョブ本体
   * @param {number} arg.interval - 実行間隔。ミリ秒
   * @returns {void}
   */
  set: (arg) => {
    const v = {whois:'crond.set',step:0,rv:null};
    console.log(`${v.whois} start.\narg=${JSON.stringify(arg,null,2)}`);
    try {

      v.step = 1; // 初期設定
      if( !this.cron ){
        this.cron = {}; // {ジョブ名:ジョブ番号}形式のオブジェクト
        // ページ遷移時には登録された定期実行ジョブを全て抹消
        window.addEventListener("beforeunload", (event) => {
          // Cancel the event as stated by the standard.
          event.preventDefault();
          // Chrome requires returnValue to be set.
          event.returnValue = "";
          crond.clear();
        });
      }

      v.step = 2; // 定期実行ジョブの登録
      this.cron[arg.name] = setInterval(arg.func,arg.interval);

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  },

  /** clear: 設定済定期実行ジョブの取消
   * @param {string} arg=null - 
   * @param {string} arg.name - ジョブを特定する名称
   * @param {function} arg.func - ジョブ本体
   * @param {number} arg.interval - 実行間隔。ミリ秒
   * @returns {void}
   */
   clear: (arg=null) => {
    const v = {whois:'crond.clear',step:0,rv:null};
    console.log(`${v.whois} start.\narg=${arg}`);
    try {

      v.step = 1; // 取消対象ジョブのリストアップ
      v.arg = arg === null ? Object.keys(this.cron) : [arg];

      v.step = 2; // 登録取消の実行
      v.arg.forEach(x => {
        clearInterval(this.cron[x]);
        delete this.cron[x];
      })

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  },
};
/** createObject: 定義と所与のオブジェクトから新たなオブジェクトを作成
 * - arg.valに存在していてもarg.defsに存在しないメンバは廃棄される(余計なメンバ指定は許容しない)
 */
function createObject(arg,depth=16) {
  const v = { whois: 'createObject', typeofs:[  // typeofの戻り値となるデータ型
    'undefined','object','boolean','number','bigint','string','symbol','function','null']};
  dev.start(v.whois, [...arguments]);
  try {

    if( depth < 0 ) throw new Error('too deep recursive');

    arg = Object.assign({defs:{},root:'',val:{},addTo:null},arg);
    dev.step(1.1); // 処理対象となる項目定義名
    v.root = arg.root || Object.keys(arg.defs)[0];
    dev.step(1.2); // 戻り値を設定
    v.rv = arg.addTo || {};
    //dev.dump(arg,v.root,v.rv,35);

    for( v.i=0 ; v.i<arg.defs[v.root].length ; v.i++ ){

      dev.step(2);
      v.def = arg.defs[v.root][v.i];  // 単体の項目定義オブジェクト
      // 上書き指定が有ればそれを優先
      v.val = Object.hasOwn(arg.val,v.def.name) ? arg.val[v.def.name] : v.def.value;
      v.valType = v.val === null ? 'null' : typeof v.val; // nullはobjectとは別扱いにする
      if( !v.def.type ) v.def.type = v.valType;
      v.defTypes = v.def.type.replaceAll(/\s/g,'').split('|');
      //dev.dump(v.def,v.val,45);

      if( v.defTypes.includes(v.valType) ){
        dev.step(3); // typeで指定されたデータ型と設定値の型が一致 ⇒ 設定値を採用
        v.rv[v.def.name] = v.val;
      } else {
        dev.step(4); // typeで指定されたデータ型と設定値の型が不一致
        if( v.defTypes.length === 1 && !v.typeofs.includes(v.def.type) ){
          dev.step(6); // 独自データ型
          v.rv[v.def.name] = createObject({
            defs: arg.defs,
            root: v.def.type,
            val: arg.val[v.def.name] || {},
          },depth-1);
        } else {
          dev.step(5); // 独自データ型ではない(typeofで返されるデータ型の一つ)
          if( v.def.type === 'function' && v.valType !== 'function' ){
            dev.step(5.11); // type == 'function' && typeof value != 'function' ⇒ valueを関数化
            v.fx = arg.data.match(/^function\s*\w*\s*\(([\w\s,]*)\)\s*\{([\s\S]*?)\}$/); // function(){〜}
            v.ax = arg.data.match(/^\(?([\w\s,]*?)\)?\s*=>\s*\{?(.+?)\}?$/); // arrow関数
            dev.step(5.12);
            if (v.fx || v.ax) {
              dev.step(5.13); // function文字列
              v.a = (v.fx ? v.fx[1] : v.ax[1]).replaceAll(/\s/g, ''); // 引数部分
              v.a = v.a.length > 0 ? v.a.split(',') : [];
              v.b = (v.fx ? v.fx[2] : v.ax[2]).replaceAll(/\s+/g, ' ').trim(); // 論理部分
              v.rv[v.def.name] = new Function(...v.a, v.b);
            } else {
              dev.step(5.14);
              throw new Error('invalid function definition');
            }
          } else if( !v.defType.includes('function') && v.valType === 'function' ){
            dev.step(5.2); // type != 'function' && typeof value == 'function' ⇒ value(関数)の実行結果を設定
            v.rv[v.def.name] = v.val();
          } else {
            dev.step(5.3);
            throw new Error('data type of value unmatch type definition');
          }
        }
      }
    }

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }
}
/** 長さ・文字種指定に基づき、パスワードを生成
 *
 * @param {number} [len=16] - パスワードの長さ
 * @param {Object} opt
 * @param {boolean} [opt.lower=true] - 英小文字を使うならtrue
 * @param {boolean} [opt.upper=true] - 英大文字を使うならtrue
 * @param {boolean} [opt.symbol=true] - 記号を使うならtrue
 * @param {boolean} [opt.numeric=true] - 数字を使うならtrue
 * @returns {string}
 */
function createPassword(len=16,opt={lower:true,upper:true,symbol:true,numeric:true}){
  const v = {
    whois: 'createPassword',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    symbol: '!#$%&()=~|@[];:+-*<>?_>.,',
    numeric: '0123456789',
    base: '',
    rv: '',
  }
  try {
    Object.keys(opt).forEach(x => {
      if( opt[x] ) v.base += v[x];
    });
    for( v.i=0 ; v.i<len ; v.i++ ){
      v.rv += v.base.charAt(Math.floor(Math.random() * v.base.length));
    }
  } catch(e) {
    console.error(v.whois+' abnormal end.\n'+e.stack+'\n'+JSON.stringify(v));
    v.rv = e;
  } finally {
    return v.rv;
  }
}
/** devTools: 開発支援関係メソッド集
 * @param {Object} option
 * @param {boolean} option.start=true - 開始・終了メッセージの表示
 * @param {boolean} option.arg=true - 開始時に引数を表示
 * @param {boolean} option.step=false - step毎の進捗ログの出力
 */
function devTools(option) {
  let opt = Object.assign({ start: true, arg: true, step: false }, option);
  let seq = 0;  // 関数の呼出順
  let stack = []; // 呼出元関数情報のスタック
  return { changeOption: changeOption, check: check, dump: dump, end: end, error: error, start: start, step: step };

  /** オプションの変更 */
  function changeOption(option) {
    opt = Object.assign(opt, option);
    console.log(`devTools.changeOption result: ${JSON.stringify(opt)}`);
  }
  /** 実行結果の確認
   * - JSON文字列の場合、オブジェクト化した上でオブジェクトとして比較する
   * @param {Object} arg
   * @param {any} arg.asis - 実行結果
   * @param {any} arg.tobe - 確認すべきポイント(Check Point)。エラーの場合、エラーオブジェクトを渡す
   * @param {string} arg.title='' - テストのタイトル(ex. SpreadDbTest.delete.4)
   * @param {Object} [arg.opt] - isEqualに渡すオプション
   * @returns {boolean} - チェック結果OK:true, NG:false
   */
  function check(arg = {}) {
    /** recursive: 変数の内容を再帰的にチェック
     * @param {any} asis - 結果の値
     * @param {any} tobe - 有るべき値
     * @param {Object} opt - isEqualに渡すオプション
     * @param {number} depth=0 - 階層の深さ
     * @param {string} label - メンバ名または添字
     */
    const recursive = (asis, tobe, opt, depth = 0, label = '') => {
      let rv;
      // JSON文字列はオブジェクト化
      asis = (arg => { try { return JSON.parse(arg) } catch { return arg } })(asis);
      // データ型の判定
      let type = String(Object.prototype.toString.call(tobe).slice(8, -1));
      switch (type) {
        case 'Number': if (Number.isNaN(tobe)) type = 'NaN'; break;
        case 'Function': if (!('prototype' in tobe)) type = 'Arrow'; break;
      }
      let indent = '  '.repeat(depth);
      switch (type) {
        case 'Object':
          msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}{`);
          for (let mn in tobe) {
            rv = !Object.hasOwn(asis, mn) ? false // 該当要素が不在
              : recursive(asis[mn], tobe[mn], opt, depth + 1, mn);
          }
          msg.push(`${indent}}`);
          break;
        case 'Array':
          msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}[`);
          for (let i = 0; i < tobe.length; i++) {
            rv = (asis[i] === undefined && tobe[i] !== undefined) ? false // 該当要素が不在
              : recursive(asis[i], tobe[i], opt, depth + 1, String(i));
          }
          msg.push(`${indent}]`);
          break;
        case 'Function': case 'Arrow':
          rv = tobe(asis);  // 合格ならtrue, 不合格ならfalseを返す関数を定義
          msg.push(
            indent + (label.length > 0 ? (label + ': ') : '')
            + (rv ? asis : `[NG] (${tobe.toString()})(${asis}) -> false`)
          );
          break;
        default:
          if (tobe === undefined) {
            rv = true;
          } else {
            rv = isEqual(asis, tobe, opt);
            msg.push(
              indent + (label.length > 0 ? (label + ': ') : '')
              + (rv ? asis : `[NG] ToBe=${tobe}, AsIs=${asis}`)
            );
          }
      }
      return rv;
    }

    // 主処理
    let msg = [];
    let isOK = true;  // チェックOKならtrue

    arg = Object.assign({ msg: '', opt: {} }, arg);
    if (arg.tobe === undefined) {
      // check未指定の場合、チェック省略、結果表示のみ
      msg.push(`===== ${arg.title} Check Result : Not checked`);
    } else {
      // arg.asisとarg.tobeのデータ型が異なる場合、またはrecursiveで不一致が有った場合はエラーと判断
      if (String(Object.prototype.toString.call(arg.asis).slice(8, -1))
        !== String(Object.prototype.toString.call(arg.tobe).slice(8, -1))
        || recursive(arg.asis, arg.tobe, arg.opt) === false
      ) {
        isOK = false;
        msg.unshift(`===== ${arg.title} Check Result : Error`);
      } else {
        msg.unshift(`===== ${arg.title} Check Result : OK`);
      }
    }

    // 引数として渡されたmsgおよび結果(JSON)を先頭に追加後、コンソールに表示
    msg = `::::: Verified by devTools.check\n`
      + `===== ${arg.title} Returned Value\n`
      + JSON.stringify(arg.asis, (k, v) => typeof v === 'function' ? v.toString() : v, 2)
      + `\n\n\n${msg.join('\n')}`;
    if (isOK) console.log(msg); else console.error(msg);
    return isOK;
  }
  /** dump: 渡された変数の内容をコンソールに表示
   * - 引数には対象変数を列記。最後の引数が数値だった場合、行番号と看做す
   * @param {any|any[]} arg - 表示する変数および行番号
   * @returns {void}
   */
  function dump() {
    let arg = [...arguments];
    let line = typeof arg[arg.length - 1] === 'number' ? arg.pop() : null;
    const o = stack[stack.length - 1];
    let msg = (line === null ? '' : `l.${line} `) + `${o.label} step.${o.step}`;
    for (let i = 0; i < arg.length; i++) {
      // 対象変数が複数有る場合、Noを追記
      msg += '\n' + (arg.length > 0 ? `${i}: ` : '') + stringify(arg[i]);
    }
    console.log(msg);
  }
  /** end: 正常終了時の呼出元関数情報の抹消＋終了メッセージの表示 */
  function end() {
    const o = stack.pop();
    if (opt.start) console.log(`${o.label} normal end.`);
  }
  /** error: 異常終了時の呼出元関数情報の抹消＋終了メッセージの表示 */
  function error(e) {
    const o = stack.pop();
    // 参考 : e.lineNumber, e.columnNumber, e.causeを試したが、いずれもundefined
    e.message = `${o.label} abnormal end at step.${o.step}\n${e.message}`;
    console.error(e.message
      + `\n-- footprint\n${o.footprint}`
      + `\n-- arguments\n${o.arg}`
    );
  }
  /** start: 呼出元関数情報の登録＋開始メッセージの表示
   * @param {string} name - 関数名
   * @param {any[]} arg - start呼出元関数に渡された引数([...arguments]固定)
   */
  function start(name, arg = []) {
    const o = {
      class: '',  // nameがクラス名.メソッド名だった場合のクラス名
      name: name,
      seq: seq++,
      step: 0,
      footprint: [],
      arg: [],
    };
    o.sSeq = ('000' + o.seq).slice(-4);
    const caller = stack.length === 0 ? null : stack[stack.length - 1]; // 呼出元
    // nameがクラス名.メソッド名だった場合、クラス名をセット
    if (name.includes('.')) [o.class, o.name] = name.split('.');
    // ラベル作成。呼出元と同じクラスならクラス名は省略
    o.label = `[${o.sSeq}]` + (o.class && (!caller || caller.class !== o.class) ? o.class+'.' : '') + o.name;
    // footprintの作成
    stack.forEach(x => o.footprint.push(`${x.label}.${x.step}`));
    o.footprint = o.footprint.length === 0 ? '(root)' : o.footprint.join(' > ');
    // 引数情報の作成
    if (arg.length === 0) {
      o.arg = '(void)';
    } else {
      for (let i = 0; i < arg.length; i++) o.arg[i] = stringify(arg[i]);
      o.arg = o.arg.join('\n');
    }
    // 作成した呼出元関数情報を保存
    stack.push(o);

    if (opt.start) {  // 開始メッセージの表示指定が有った場合
      console.log(`${o.label} start.\n-- footprint\n${o.footprint}` + (opt.arg ? `\n-- arguments\n${o.arg}` : ''));
    }
  }
  /** step: 呼出元関数の進捗状況の登録＋メッセージの表示 */
  function step(step, msg = '') {
    const o = stack[stack.length - 1];
    o.step = step;
    if (opt.step) console.log(`${o.label} step.${o.step} ${msg}`);
  }
  /** stringify: 変数の内容をラベル＋データ型＋値の文字列として出力
   * @param {any} arg - 文字列化する変数
   * @returns {string}
   */
  function stringify(arg) {
    /** recursive: 変数の内容を再帰的にメッセージ化
     * @param {any} arg - 内容を表示する変数
     * @param {number} depth=0 - 階層の深さ
     * @param {string} label - メンバ名または添字
     */
    const recursive = (arg, depth = 0, label = '') => {
      // データ型の判定
      let type = String(Object.prototype.toString.call(arg).slice(8, -1));
      switch (type) {
        case 'Number': if (Number.isNaN(arg)) type = 'NaN'; break;
        case 'Function': if (!('prototype' in arg)) type = 'Arrow'; break;
      }
      // ラベル＋データ型＋値の出力
      let indent = '  '.repeat(depth);
      switch (type) {
        case 'Object':
          msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}{`);
          for (let mn in arg) recursive(arg[mn], depth + 1, mn);
          msg.push(`${indent}}`);
          break;
        case 'Array':
          msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}[`);
          for (let i = 0; i < arg.length; i++) recursive(arg[i], depth + 1, String(i));
          msg.push(`${indent}]`);
          break;
        default:
          let val = typeof arg === 'function' ? `"${arg.toString()}"` : (typeof arg === 'string' ? `"${arg}"` : arg);
          // Class Sheetのメソッドのように、toStringが効かないnative codeは出力しない
          if (typeof val !== 'string' || val.indexOf('[native code]') < 0) {
            msg.push(`${indent}${label.length > 0 ? label + ': ' : ''}${val}(${type})`);
          }
      }
    }
    const msg = [];
    recursive(arg);
    return msg.join('\n');
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
/** SpreadDb: Google Spreadに対してRDBのようなCRUDを行う
 * @param {Object[]} query=[] - 操作要求の内容
 * @param {Object} opt={} - オプション
 */
function SpreadDb(query = [], opt = {}) {
  /** main: SpreadDb主処理 */
  const pv = { whois: 'SpreadDb', rv: [], log: [] };  // 擬似メンバ変数としてSpreadDb内で共有する値
  const v = { whois: `${pv.whois}.main`, step: 0 };
  dev.start(v.whois, [...arguments]);
  try {

    dev.step(1.1);
    if (!Array.isArray(query)) query = [query];  // 配列可の引数は配列に統一

    dev.step(1.2); // メンバに引数・初期値をセット
    v.r = constructor(query, opt);
    if (v.r instanceof Error) throw v.r;

    dev.step(2); // スプレッドシートのロックを取得
    v.lock = LockService.getDocumentLock();

    for (v.tryNo = pv.opt.maxTrial; v.tryNo > 0; v.tryNo--) {

      dev.step(3); // スプレッドシートのロック
      if (v.lock.tryLock(pv.opt.interval)) {

        dev.step(4); // クエリを順次処理
        for (v.i = 0; v.i < pv.query.length; v.i++) {
          dev.step(5); // クエリのメンバに既定値設定
          v.r = objectizeColumn('sdbQuery');
          if (v.r instanceof Error) throw v.r;
          pv.query[v.i] = Object.assign(v.r, pv.query[v.i], { userId: pv.opt.userId });

          dev.step(6); // クエリの実行
          v.r = doQuery(pv.query[v.i]);
          if (v.r instanceof Error) throw v.r;
        }

        dev.step(7); // 一連のquery終了後、実行結果を変更履歴シートにまとめて追記
        v.r = objectizeColumn('sdbQuery');
        if (v.r instanceof Error) throw v.r;
        v.r = appendRow(Object.assign(v.r, {
          table: pv.opt.log,
          set: pv.log,
          result: [],
        }));
        if (v.r instanceof Error) throw v.r;

        dev.step(8); // ロック解除
        v.lock.releaseLock();
        v.tryNo = -1; // maxTrial回ロック失敗時(=0)と判別するため、負数をセット
      }
    }

    dev.step(9); // ロックができたか判定、不能時はエラー
    if (v.tryNo === 0) throw new Error("Could not Lock");

    dev.end(); // 終了処理
    return pv.rv;

  } catch (e) {
    dev.error(e);
    return e;
  }
  /** appendRow: 領域に新規行を追加
   * @param {sdbQuery|sdbQuery[]} query
   * @param {sdbTable} query.table - 操作対象のテーブル名
   * @param {Object|Object[]} query.set=[] - 追加する行オブジェクト
   * @returns {null|Error}
   *
   * - 重複エラーが発生した場合、ErrCD='Duplicate' + diffに{項目名：重複値}形式で記録
   */
  function appendRow(query) {
    const v = { whois: `${pv.whois}.appendRow`, step: 0, rv: null, target: [] };
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      // 1. 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------
      dev.step(1.1);  // v.tableに対象のテーブル管理情報をセット
      v.table = pv.table[query.table];

      dev.step(1.2); // query.setの存否判定
      if (!Object.hasOwn(query, 'set')) query.qSts = `No set`;  // query.setが不存在

      dev.step(1.3);
      // ①一行分のシートイメージ ⇒ any[] ⇒ 二次元配列化
      // ②一行分の行オブジェクト ⇒ Object ⇒ 配列化
      // ③複数行分のシートイメージ ⇒ any[][] ⇒ 行オブジェクトに変換
      // ④複数行分の行オブジェクト ⇒ Object[] ⇒ そのまま使用
      // ⑤上記以外 ⇒ エラー
      if (Array.isArray(query.set)) {
        dev.step(1.31); // 配列の長さ0
        if (query.set.length === 0) query.qSts = `Empty set`;
        if (whichType(query.set[0], 'Object')) {
          dev.step(1.32); // ④ ⇒ そのまま使用
        } else {
          if (Array.isArray(query.set[0])) {
            dev.step(1.33); // ③ ⇒ 行オブジェクトに変換
            v.r = convertRow(query.set);
            if (v.r instanceof Error) throw v.r;
            query.set = v.r.obj;
          } else {
            dev.step(1.34);  // ① ⇒ 二次元配列化
            query.set = [query.set];
          }
        }
      } else {
        if (whichType(query.set, 'Object')) {
          dev.step(1.35); // ② ⇒ 配列化
          query.set = [query.set];
        } else {
          dev.step(1.36); // ⑤ ⇒ エラー
          query.qSts = `Invalid set`;
        }
      }

      dev.step(2);
      if (query.qSts === 'OK') {
        // ------------------------------------------------
        // 2. 追加レコードをシートイメージに展開
        // ------------------------------------------------
        for (v.i = 0; v.i < query.set.length; v.i++) {

          dev.step(2.1); // 1レコード分のログを準備
          v.log = objectizeColumn('sdbResult');
          if (v.log instanceof Error) throw v.log;

          dev.step(2.2); // auto_increment項目に値を設定
          // ※ auto_increment設定はuniqueチェックに先行
          for (v.ai in v.table.schema.auto_increment) {
            if (!query.set[v.i][v.ai]) { // 値が未設定だった場合は採番実行
              v.table.schema.auto_increment[v.ai].current += v.table.schema.auto_increment[v.ai].step;
              query.set[v.i][v.ai] = v.table.schema.auto_increment[v.ai].current;
            }
          }

          dev.step(2.3); // 既定値の設定
          for (v.dv in v.table.schema.defaultRow) {
            if (!query.set[v.i][v.dv]) {
              query.set[v.i][v.dv] = v.table.schema.defaultRow[v.dv](query.set[v.i]);
            }
          }

          dev.step(2.4); // 追加レコードの正当性チェック(unique重複チェック)
          for (v.unique in v.table.schema.unique) {
            if (v.table.schema.unique[v.unique].indexOf(query.set[v.i][v.unique]) >= 0) {
              // 登録済の場合はエラーとして処理
              v.log.rSts = 'Duplicate';
              v.log.diff[v.unique] = query.set[v.i][v.unique]; // diffに{unique項目名:重複値}を保存
            } else {
              // 未登録の場合v.table.sdbSchema.uniqueに値を追加
              v.table.schema.unique[v.unique].push(query.set[v.i][v.unique]);
            }
          }

          dev.step(2.5); // 主キーの値をpKeyにセット
          // 主キーがauto_incrementまたはdefaultで設定される可能性があるため、pKeyセットはこれらの後工程
          v.log.pKey = query.set[v.i][v.table.schema.primaryKey];

          dev.step(2.6); // 正当性チェックOKの場合の処理
          if (v.log.rSts === 'OK') {

            dev.step(2.61); // シートイメージに展開して登録
            v.row = [];
            for (v.j = 0; v.j < v.table.header.length; v.j++) {
              v.a = query.set[v.i][v.table.header[v.j]];
              v.row[v.j] = v.a;
            }
            v.target.push(v.row);

            dev.step(2.62); // v.table.valuesへの追加
            v.table.values.push(query.set[v.i]);

            dev.step(2.63); // ログに追加レコード情報を記載
            v.log.diff = JSON.stringify(query.set[v.i]);
          }

          dev.step(2.7); // 成否に関わらず戻り値に保存
          query.result.push(v.log);
        }

        dev.step(2.8); // 追加成功行数をnumにセット
        query.num = query.result.filter(x => x.rSts === 'OK').length || 0;

        // ------------------------------------------------
        dev.step(3); // 対象シートへの展開
        // ------------------------------------------------
        dev.step(3.1); // 対象シートにsetValues
        if (v.target.length > 0) {
          v.table.sheet.getRange(
            v.table.rownum + 2,
            1,
            v.target.length,
            v.target[0].length
          ).setValues(v.target);
        }
        dev.step(3.2); // v.table.rownumの書き換え
        v.table.rownum += v.target.length;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** constructor: 擬似メンバの値設定、変更履歴テーブルの準備 */
  function constructor(query, opt) {
    const v = { whois: `${pv.whois}.constructor`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1); // 擬似メンバに値を設定
      Object.assign(pv, {
        query: query,
        opt: Object.assign({
          userId: 'guest', // {string} ユーザの識別子
          userAuth: {}, // {Object.<string,string>} テーブル毎のアクセス権限。{シート名:rwdos文字列} 形式
          log: 'log', // {string}='log' 更新履歴テーブル名
          maxTrial: 5, // number}=5 シート更新時、ロックされていた場合の最大試行回数
          interval: 10000, // number}=10000 シート更新時、ロックされていた場合の試行間隔(ミリ秒)
          guestAuth: {}, // {Object.<string,string>} ゲストに付与する権限。{シート名:rwdos文字列} 形式
          adminId: 'Administrator', // {string} 管理者として扱うuserId
          additionalPrimaryKey: // {string} createTableで主キー無指定時に追加設定される主キー項目名
            { name: 'rowId', type: 'UUID', note: '主キー', primaryKey: true, default: () => Utilities.getUuid() },
          sdbQuery: [
            { name: 'timestamp', type: 'string', note: '更新日時(ISO8601拡張形式)', default: () => toLocale(new Date()) },
            { name: 'userId', type: 'string|number', note: 'ユーザ識別子(uuid等)', default: () => pv.opt.userId },
            { name: 'queryId', type: 'string', note: 'SpreadDb呼出元で設定する、クエリ・結果突合用文字列。未設定の場合は主処理でUUIDを設定', default: () => Utilities.getUuid() },
            { name: 'table', type: 'string', note: '操作対象テーブル名', default: () => '' },
            { name: 'command', type: 'string', note: '操作名', default: () => '' },
            { name: 'cols', type: 'sdbColumn[]', note: '新規作成シートの項目定義オブジェクトの配列', default: () => [] },
            { name: 'where', type: 'Object|Function|string', note: '対象レコードの判定条件', default: () => null },
            { name: 'set', type: 'Object|string|Function', note: '追加・更新する値', default: () => [] },
            { name: 'qSts', type: 'string', note: 'クエリ単位の実行結果', default: () => 'OK' },
            { name: 'num', type: 'number', note: '変更された行数', default: () => 0 },
            { name: 'result', type: 'Object[]', note: 'レコード単位の実行結果', default: () => [] },
          ],
          sdbTable: [
            { name: 'name', type: 'string', note: 'テーブル名(範囲名)' },
            { name: 'account', type: 'string', note: '更新者のuserId(識別子)', default: () => pv.opt.userId },
            { name: 'sheet', type: 'Sheet', note: 'スプレッドシート内の操作対象シート(ex."master"シート)' },
            { name: 'schema', type: 'sdbSchema', note: 'シートの項目定義', default: () => objectizeColumn('sdbSchema') },
            { name: 'values', type: 'Object[]', note: '行オブジェクトの配列。{項目名:値,..} 形式', default: () => [] },
            { name: 'header', type: 'string[]', note: '項目名一覧(ヘッダ行)', default: () => [] },
            { name: 'notes', type: 'string[]', note: 'ヘッダ行のメモ', default: () => [] },
            { name: 'colnum', type: 'number', note: 'データ領域の列数', default: () => 0 },
            { name: 'rownum', type: 'number', note: 'データ領域の行数(ヘッダ行は含まず)', default: () => 0 },
          ],
          sdbSchema: [
            { name: 'cols', type: 'sdbColumn[]', note: '項目定義オブジェクトの配列', default: () => [] },
            { name: 'primaryKey', type: 'string', note: '一意キー項目名' },
            { name: 'unique', type: 'Object.<string, any[]>', note: 'primaryKeyおよびunique属性項目の管理情報。メンバ名はprimaryKey/uniqueの項目名', default: () => new Object() },
            { name: 'auto_increment', type: 'Object.<string,Object>', note: 'auto_increment属性項目の管理情報。メンバ名はauto_incrementの項目名', default: () => new Object() },
            { name: 'defaultRow', type: 'Object|function', note: '既定値項目で構成されたオブジェクト。appendの際のプロトタイプ', default: () => new Object() },
          ],
          sdbColumn: [ // sdbColumnの属性毎にname,type,noteを定義
            { name: 'name', type: 'string', note: '項目名' },
            { name: 'type', type: 'string', note: 'データ型。string,number,boolean,Date,JSON,UUID' },
            { name: 'format', type: 'string', note: '表示形式。type=Dateの場合のみ指定' },
            { name: 'options', type: 'number|string|boolean|Date', note: '取り得る選択肢(配列)のJSON表現。ex.["未入場","既収","未収","無料"]' },
            { name: 'default', type: 'number|string|boolean|Date', note: '既定値' },
            { name: 'primaryKey', type: 'boolean', note: '一意キー項目ならtrue' },
            { name: 'unique', type: 'boolean', note: 'primaryKey以外で一意な値を持つならtrue' },
            {
              name: 'auto_increment', type: 'null|bloolean|number|number[]', note: '自動採番項目'
                + '\n// null ⇒ 自動採番しない'
                + '\n// boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない'
                + '\n// number ⇒ 自動採番する(基数=指定値,増減値=1)'
                + '\n// number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)'
            },
            { name: 'suffix', type: 'string', note: '"not null"等、上記以外のSQLのcreate table文のフィールド制約' },
            { name: 'note', type: 'string', note: '本項目に関する備考。create table等では使用しない' },
          ],
          sdbLog: [
            { name: 'logId', type: 'UUID', primaryKey: true, default: () => Utilities.getUuid() },
            { name: 'timestamp', type: 'string', note: '更新日時' },
            { name: 'userId', type: 'string', note: 'ユーザ識別子' },
            { name: 'queryId', type: 'string', note: 'クエリ・結果突合用識別子' },
            { name: 'table', type: 'string', note: '対象テーブル名' },
            { name: 'command', type: 'string', note: '操作内容(コマンド名)' },
            { name: 'arg', type: 'JSON', note: '操作関数に渡された引数', default: () => null },
            { name: 'qSts', type: 'string', note: 'クエリ単位の実行結果' },
            { name: 'num', type: 'number', note: '変更された行数' },
            { name: 'pKey', type: 'string', note: '変更したレコードのprimaryKey' },
            { name: 'rSts', type: 'string', note: 'レコード単位の実行結果' },
            { name: 'diff', type: 'JSON', note: '差分情報。{項目名：[更新前,更新後]}形式' },
          ],
          sdbResult: [
            { name: 'pKey', type: 'string', note: '処理対象レコードの識別子' },
            { name: 'rSts', type: 'string', note: 'レコード単位の実行結果', default: () => 'OK' },
            { name: 'diff', type: 'Object', note: '当該レコードの変更点', default: () => new Object() },
          ],
          sdbMain: [
            { name: 'timestamp', type: 'string', note: '更新日時(ISO8601拡張形式)' },
            { name: 'queryId', type: 'string', note: 'SpreadDb呼出元で設定する、クエリ・結果突合用文字列' },
            { name: 'table', type: 'string|string[]', note: '操作対象テーブル名' },
            { name: 'command', type: 'string', note: '操作名' },
            { name: 'arg', type: 'JSON', note: '操作関数に渡された引数', default: () => null },
            { name: 'qSts', type: 'string', note: 'クエリ単位の実行結果' },
            { name: 'num', type: 'number', note: '変更された行数' },
            { name: 'result', type: 'Object[]', note: 'レコード単位の実行結果' },
          ],
        }, opt),
        spread: SpreadsheetApp.getActiveSpreadsheet(), // スプレッドシートオブジェクト
        table: {}, // スプレッドシート上の各テーブル(領域)の情報
      });

      // 変更履歴テーブルのsdbTable準備
      dev.step(2); // 変更履歴用のクエリを作成
      v.r = objectizeColumn('sdbQuery');
      if (v.r instanceof Error) throw v.r;
      v.query = Object.assign(v.r, {
        userId: pv.opt.adminId,
        table: pv.opt.log,
        command: 'create',
        cols: pv.opt.sdbLog,
      });

      dev.step(3); // 変更履歴のテーブル管理情報を作成
      v.r = genTable(v.query);
      if (v.r instanceof Error) throw v.r;

      dev.step(4); // 変更履歴のシートが不在なら作成
      if (pv.table[pv.opt.log].sheet === null) {
        v.r = createTable(v.query);
        if (v.r instanceof Error) throw v.r;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
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
  function convertRow(data = [], header = []) {
    const v = { whois: pv.whois + '.convertRow', step: 0, rv: { raw: [], obj: data, header: header } };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1, `data=${JSON.stringify(data.slice(0, 2))}\nheader=${JSON.stringify(header)}`);

      if (data.length > 0) {

        dev.step(1); // ヘッダ未定義の場合、dataがシートイメージなら先頭行、行オブジェクトならメンバ名から作成
        // シートイメージの先頭行を使用する場合、createで主キー項目を追加(unshift)する場合に元データの先頭行も変化してしまうのでシャローコピーする
        if (v.rv.header.length === 0) {
          v.rv.header = Array.isArray(data[0]) ? [...data[0]] : [...new Set(data.flatMap(d => Object.keys(d)))];
        }

        if (Array.isArray(data[0])) { // dataがシートイメージの場合
          dev.step(2); // シートイメージを一度行オブジェクトに変換(∵列の並びをheader指定に合わせる)
          v.rv.obj = [];
          for (v.i = 1; v.i < data.length; v.i++) {
            v.o = {};
            for (v.j = 0; v.j < data[v.i].length; v.j++) {
              if (data[v.i][v.j] || data[v.i][v.j] === 0 || data[v.i][v.j] === false) {
                v.o[data[0][v.j]] = data[v.i][v.j];
              }
            }
            v.rv.obj.push(v.o);
          }
        }

        dev.step(3); // ヘッダの項目名の並びに基づき、行オブジェクトからシートイメージを生成
        for (v.i = 0; v.i < v.rv.obj.length; v.i++) {
          v.arr = [];
          for (v.j = 0; v.j < v.rv.header.length; v.j++) {
            v.arr.push(v.rv.obj[v.i][v.rv.header[v.j]]);
          }
          v.rv.raw.push(v.arr);
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** createTable: 新規にシートを作成
   * @param {sdbQuery} query
   * @returns {null|Error}
   */
  function createTable(query) {
    const v = { whois: `${pv.whois}.createTable`, step: 0, rv: [], convertRow: null };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1.1);  // 既定値設定
      if (!query.set) query.set = [];
      dev.step(1.2);  // テーブル管理情報をv.tableに保存
      v.table = pv.table[query.table];
      dev.step(1.3);  // 引数を保存
      query.arg = toString({ cols: query.cols });
      dev.step(1.4);  // シートが既に存在
      if (v.table.sheet !== null) query.qSts = 'Already Exist';

      if (query.qSts === 'OK') {
        dev.step(2); // 主キーが存在しない場合は追加
        if (!v.table.schema.cols.find(x => x.primaryKey === true)) {
          v.unique = v.table.schema.cols.find(x => x.unique === true);
          if (v.unique) {
            // ユニーク項目が存在している場合、主キーに昇格
            v.unique.primaryKey = true;
            v.table.schema.primaryKey = v.unique.name;
          } else {
            // ユニーク項目が不存在の場合は追加
            // schema.colsにopt.additionalPrimaryKeyを追加
            v.table.schema.cols.unshift(pv.opt.additionalPrimaryKey);
            // schema.primaryKeyに主キー項目名を設定
            v.table.schema.primaryKey = pv.opt.additionalPrimaryKey.name;
            // schema.uniqueに主キー項目名の空配列を設定
            v.table.schema.unique[pv.opt.additionalPrimaryKey.name] = [];
            // schema.defaultRowに主キー項目を追加
            v.table.schema.defaultRow[pv.opt.additionalPrimaryKey.name] = pv.opt.additionalPrimaryKey.default;
            // table.header先頭に主キー項目名を追加
            v.table.header.unshift(pv.opt.additionalPrimaryKey.name);
            // table.notes先頭に設定内容を追加
            v.r = genColumn(pv.opt.additionalPrimaryKey);
            if (v.r instanceof Error) throw v.r;
            v.table.notes.unshift(v.r.note);
            // table.colnumを+1
            v.table.colnum++;
          }
        }

        // ----------------------------------------------
        dev.step(3); // シートが存在しない場合、新規追加
        // ----------------------------------------------
        dev.step(3.1); // シートの追加
        v.table.sheet = pv.spread.insertSheet();
        v.table.sheet.setName(query.table);

        dev.step(3.2); // ヘッダ行・メモのセット
        v.headerRange = v.table.sheet.getRange(1, 1, 1, v.table.colnum);
        v.headerRange.setValues([v.table.header]);  // 項目名のセット
        v.headerRange.setNotes([v.table.notes]);  // メモのセット
        v.table.sheet.autoResizeColumns(1, v.table.colnum);  // 各列の幅を項目名の幅に調整
        v.table.sheet.setFrozenRows(1); // 先頭1行を固定

        dev.step(3.3); // 初期データの追加
        if (query.set.length > 0) {
          v.rv = appendRow(query);  // 初期データを追加した場合、戻り値はappendRowの戻り値とする
          if (v.rv instanceof Error) throw v.rv;

          dev.step(3.4);  // 初期レコードに重複が有った場合、qStsも"Duplicate"セット
          if (query.result.map(x => x.rSts).includes('Duplicate')) query.qSts = 'Duplicate';
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** deleteRow: 領域から指定行を物理削除
   * @param {sdbQuery|sdbQuery[]} query
   * @param {sdbTable} query.table - 操作対象のテーブル名
   * @param {Object|Object[]} query.where - 削除対象の指定
   * @returns {null|Error}
   */
  function deleteRow(query) {
    const v = { whois: `${pv.whois}.deleteRow`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1.1);  // v.tableに対象のテーブル管理情報をセット
      v.table = pv.table[query.table];

      dev.step(1.2); // query.whereの存否判定
      if (!Object.hasOwn(query, 'where')) query.qSts = `No where`;  // query.whereが不存在

      dev.step(1.3); // 該当レコードかの判別用関数を作成
      query.arg = toString(query.where); // 更新履歴記録用にwhereを文字列化
      query.where = functionalyze({ table: query.table, data: query.where });
      if (query.where instanceof Error) throw query.where;

      if (query.qSts === 'OK') {
        dev.step(2); // 対象レコードか、後ろから一件ずつチェック
        // 削除対象行が複数の時、上の行を削除後に下の行を削除しようとすると添字や行番号が分かりづらくなる。
        // そこで対象となる行の添字(行番号)を洗い出した後、降順にソートし、下の行から順次削除を実行する
        for (v.i = v.table.values.length - 1; v.i >= 0; v.i--) {

          dev.step(2.1); // 対象外判定ならスキップ
          if (query.where(v.table.values[v.i]) === false) continue;

          dev.step(2.2); // 1レコード分のログオブジェクトを作成
          v.log = objectizeColumn('sdbResult');
          if (v.log instanceof Error) throw v.log;
          query.result.push(v.log);

          dev.step(2.3); // 削除レコードのunique項目をv.table.schema.uniqueから削除
          // v.table.schema.auto_incrementは削除の必要性が薄いので無視
          // ※必ずしも次回採番時に影響するとは限らず、影響したとしても欠番扱いで問題ないと判断
          for (v.unique in v.table.schema.unique) { // unique項目を順次チェック
            if (v.table.values[v.i][v.unique]) {  // 対象レコードの当該unique項目が有意な値
              // unique項目一覧(配列)から対象レコードの値の位置を探して削除
              v.idx = v.table.schema.unique[v.unique].indexOf(v.table.values[v.i][v.unique]);
              if (v.idx >= 0) v.table.schema.unique[v.unique].splice(v.idx, 1);
            }
          }

          dev.step(2.4); // diffに削除レコード情報を記載
          v.log.diff = JSON.stringify(v.table.values[v.i]);

          dev.step(2.5); // 主キーの値をpKeyにセット
          v.log.pKey = v.table.values[v.i][v.table.schema.primaryKey];

          dev.step(2.6); // 削除成功件数をインクリメント
          query.num++;

          dev.step(2.7); // v.table.valuesから削除
          v.table.values.splice(v.i, 1);

          dev.step(2.8); // シートのセルを削除
          v.range = v.table.sheet.deleteRow(v.i + 2); // 添字->行番号で+1、ヘッダ行分で+1

          dev.step(2.9); // v.table.rownumを書き換え
          v.table.rownum -= 1;

        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** doQuery: 単体クエリの実行、変更履歴の作成 */
  function doQuery(query) {
    const v = { whois: `${pv.whois}.doQuery`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------
      // 1. 事前準備
      // -------------------------------------------------
      if (!query.table || typeof query.table !== 'string') {
        dev.step(1.1);  // 必須パラメータの存否・形式確認：query.table
        query.qSts = 'No Table name';
      } else if (!query.command || ['create', 'select', 'update', 'append', 'delete', 'schema'].includes(query.command) !== true) {
        dev.step(1.2);  // 必須パラメータの存否・形式確認：query.command
        query.qSts = 'No command';
      } else {
        dev.step(1.3); // 操作対象のテーブル管理情報を準備
        if (!Object.hasOwn(pv.table, query.table)) {
          dev.step(1.4); // 未作成なら作成
          v.r = genTable(query);
          if (v.r instanceof Error) throw v.r;
        } else if (query.command !== 'create' && pv.table[query.table].sheet === null) {
          dev.step(1.5); // テーブル管理情報が存在しているがシートは不在の場合、create以外はエラー
          query.qSts = 'No Table';
        }
      }

      // -------------------------------------------------
      // 2. 実行権限の確認とcommand系メソッドの実行
      // -------------------------------------------------
      if (query.qSts === 'OK') { // エラーの場合は後続処理をスキップ

        // -------------------------------------------------
        dev.step(2.1); // ユーザの操作対象シートに対する権限を取得
        // -------------------------------------------------
        v.allow = (pv.opt.adminId === pv.opt.userId) ? 'rwdsc'  // 管理者は全部−'o'(自分のみ)＋テーブル作成
          : (pv.opt.userId === 'guest' ? (pv.opt.guestAuth[query.table] || '')  // ゲスト(userId指定無し)
            : (pv.opt.userAuth[query.table] || ''));  // 通常ユーザ

        // -------------------------------------------------
        dev.step(2.2); // 呼出先メソッド設定
        // -------------------------------------------------
        if (v.allow.includes('o')) {

          // o(=own set only)の指定は他の'rwdos'に優先、'o'のみの指定と看做す(rwds指定は有っても無視)。
          // また対象テーブルはprimaryKey要設定、検索条件もprimaryKeyの値のみ指定可
          // 自分のread/write(select,update)およびschemaのみ実行可。append/deleteは実行不可
          // ∵新規登録(append)はシステム管理者の判断が必要。また誤ってdeleteした場合はappendが必要なのでこれも不可
          // 'o'の場合、where句はuserId固定とする(Object,function,JSON他は不可)

          switch (query.command) {
            case 'scheme':
              dev.step(2.211);  // command=schema
              v.isOK = true;
              v.func = getSchema;
              break;
            case 'select':
            case 'update':
              dev.step(2.212);  // command=select/update
              if (!isEqual(pv.opt.userId, query.where)) {
                dev.step(2.213);  // where句はuserId固定、かつ要一致
                // 非プリミティブ型なら指定方法がNG、プリミティブ型なら無権限と判断
                query.qSts = (typeof query.where === 'object' || typeof query.where === 'function')
                  ? 'Invalid where clause' : 'No Authority';
                v.isOK = false;
              } else {
                dev.step(2.214);  // select/updateでプリミティブ型の値が一致しているならOKと判断
                query.where = pv.opt.userId;
                v.isOK = true;
              }
              v.func = query.command === 'select' ? selectRow : updateRow;
              break;
            default:
              dev.step(2.215);
              v.isOK = false;
          }

        } else {

          dev.step(2.22);  // 'o'以外の場合の呼出先メソッドを設定
          switch (query.command) {
            case 'create': v.isOK = v.allow.includes('c'); v.func = createTable; break;
            case 'select': v.isOK = v.allow.includes('r'); v.func = selectRow; break;
            case 'update': v.isOK = (v.allow.includes('r') && v.allow.includes('w')); v.func = updateRow; break;
            case 'append': case 'insert': v.isOK = v.allow.includes('w'); v.func = appendRow; break;
            case 'delete': v.isOK = v.allow.includes('d'); v.func = deleteRow; break;
            case 'schema': v.isOK = v.allow.includes('s'); v.func = getSchema; break;
            default: v.isOK = false;
          }
        }

        dev.step(2.3); // 無権限ならqStsにエラーコードをセット
        if (v.isOK === false && query.qSts === 'OK') query.qSts = 'No Authority';

        // -------------------------------------------------
        dev.step(2.4); // メソッドの実行
        // -------------------------------------------------
        // 権限確認の結果、OKなら操作対象テーブル情報を付加してcommand系メソッドを呼び出し
        if (query.qSts === 'OK') {

          dev.step(2.41);  // メソッド実行
          v.r = v.func(query);
          if (v.r instanceof Error) {
            dev.step(2.42); // command系メソッドからエラーオブジェクトが帰ってきた場合はqSts=message
            query.qSts = v.r.message;
            throw v.r;
          }
        }
      }

      // -------------------------------------------------
      // 3. 戻り値と変更履歴シート追記イメージの作成
      // -------------------------------------------------
      dev.step(3.1); // 戻り値オブジェクトを作成
      v.r = objectizeColumn('sdbMain');
      if (v.r instanceof Error) throw v.r;
      v.map = pv.opt.sdbMain.map(x => x.name);
      for (v.j = 0; v.j < v.map.length; v.j++) {
        v.r[v.map[v.j]] = query[v.map[v.j]];
      }
      pv.rv.push(v.r);

      // クエリ単位の実行結果を変更履歴シートへ追記
      dev.step(3.21); // クエリ単位の実行結果オブジェクトを作成
      v.r = objectizeColumn('sdbLog');
      if (v.r instanceof Error) throw v.r;
      v.map = pv.opt.sdbLog.map(x => x.name);
      for (v.j = 0; v.j < v.map.length; v.j++) {
        v.val = query[v.map[v.j]];
        if (v.val || v.val === 0 || v.val === false) {
          v.r[v.map[v.j]] = toString(v.val);
        }
      }
      dev.step(3.211); // ユーザIDをセット
      v.r.userId = pv.opt.userId;
      dev.step(3.213); // 配列に追加
      pv.log.push(v.r);

      dev.step(3.22); // レコード単位の実行結果を変更履歴シートへ追記
      if (['create', 'append', 'update', 'delete'].includes(query.command)) {
        for (v.j = 0; v.j < query.result.length; v.j++) {

          dev.step(9.1); // レコード単位の実行結果オブジェクトを作成
          v.r = objectizeColumn('sdbLog');
          if (v.r instanceof Error) throw v.r;

          dev.step(9.2); // 配列に追加
          pv.log.push(Object.assign(v.r, {
            queryId: query.queryId,
            pKey: query.result[v.j].pKey,
            rSts: query.result[v.j].rSts,
            diff: toString(query.result[v.j].diff),
          }));
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** functionalyze: オブジェクト・文字列を基にObject/stringを関数化
   * @param {Object} arg
   * @param {sdbTable} [arg.table] - 呼出元で処理対象としているテーブル
   * @param {Object|function|string} arg.data - 関数化するオブジェクトor文字列
   * @returns {function}
   *
   * - update/delete他、引数でdataを渡されるメソッドで使用
   * - 引数のデータ型により以下のように処理分岐
   *   - Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
   *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
   *   - string
   *     - 無名関数またはアロー関数のソース文字列 ⇒ new Functionで関数化
   *     - その他 ⇒ 項目定義で"primaryKey"を指定した項目の値   *   - Object ⇒ {キー項目名:キー項目の値}形式で、key:valueに該当するレコードを更新
   */
  function functionalyze(arg = null) {
    const v = { whois: `${pv.whois}.functionalyze`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1); // 引数の型チェック＋変換
      if (typeof arg === 'function') {
        dev.step(1.1); // 引数が関数ならそのまま使用
        dev.end();
        return arg;
      } else if (typeof arg === 'string') {
        arg = { data: arg, table: null };
      } else if (!whichType(arg, 'Object') || !Object.hasOwn(arg, 'data')) {
        throw new Error(`Invalid Argument`);
      }

      switch (typeof arg.data) {
        case 'function': dev.step(2);  // 関数指定ならそのまま利用
          v.rv = arg.data;
          break;
        case 'object': dev.step(3);
          v.keys = Object.keys(arg.data);
          if (v.keys.length === 2 && v.keys.includes('key') && v.keys.includes('value')) {
            dev.step(3.1); // {key:〜,value:〜}形式での指定の場合
            v.rv = new Function('o', `return isEqual(o['${arg.data.key}'],'${arg.data.value}')`);
          } else {
            dev.step(3.2); // {キー項目名:値}形式での指定の場合
            v.c = [];
            for (v.j = 0; v.j < v.keys.length; v.j++) {
              v.c.push(`isEqual(o['${v.keys[v.j]}'],'${arg.data[v.keys[v.j]]}')`);
            }
            v.rv = new Function('o', `return (${v.c.join(' && ')})`);
          }
          break;
        case 'string': dev.step(4);
          v.fx = arg.data.match(/^function\s*\w*\s*\(([\w\s,]*)\)\s*\{([\s\S]*?)\}$/); // function(){〜}
          v.ax = arg.data.match(/^\(?([\w\s,]*?)\)?\s*=>\s*\{?(.+?)\}?$/); // arrow関数
          if (v.fx || v.ax) {
            dev.step(4.1); // function文字列
            v.a = (v.fx ? v.fx[1] : v.ax[1]).replaceAll(/\s/g, ''); // 引数部分
            v.a = v.a.length > 0 ? v.a.split(',') : [];
            v.b = (v.fx ? v.fx[2] : v.ax[2]).replaceAll(/\s+/g, ' ').trim(); // 論理部分
            v.rv = new Function(...v.a, v.b);
            break;
          }
        // 関数では無い文字列の場合はdefaultで処理するため、breakの記述は省略
        default:
          dev.step(5); // 関数ではない文字列、またはfunction/object/string以外の型はprimaryKeyの値指定と看做す
          if (arg.table !== null && pv.table[arg.table].schema.primaryKey) {
            if (typeof arg.data === 'string') arg.data = `"${arg.data}"`;
            v.rv = new Function('o', `return isEqual(o['${pv.table[arg.table].schema.primaryKey}'],${arg.data})`);
          } else {
            throw new Error(`Invalid Argument`);
          }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** genColumn: sdbColumnオブジェクトを生成
   * @param arg {sdbColumn|string} - 項目定義オブジェクト、または項目定義メモまたは項目名
   * @returns {Object|Error}
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
  function genColumn(arg = {}) {
    const v = { whois: `${pv.whois}.genColumn`, step: 0, rv: {} };
    dev.start(v.whois, [...arguments]);
    try {

      // ------------------------------------------------
      dev.step(1); // 項目定義情報(rv.column)の準備
      // ------------------------------------------------
      if (typeof arg === 'object') {
        dev.step(1.1); // 引数がオブジェクト(=sdbColumn)ならそのまま採用
        v.rv.column = arg;
        v.rv.note = {};
      } else {  // 文字列で与えられたらオブジェクトに変換

        dev.step(1.2); // コメントの削除
        arg = arg.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');

        dev.step(1.3);
        // JSON文字列ならparse、それ以外はname属性と判断
        v.r = (arg => { try { return JSON.parse(arg) } catch { return null } })(arg);
        if (v.r === null) {
          // JSON文字列ではない場合、項目名と看做す
          v.rv.column = v.rv.note = { name: arg.trim() };
        } else {
          // JSON文字列ならオブジェクト化
          v.rv.column = v.r;
          v.rv.note = arg;  // コメントを削除しないよう、オリジナルを適用
        }
      }

      // ------------------------------------------------
      dev.step(2); // シートのメモに記載する文字列を作成
      // ------------------------------------------------
      if (typeof v.rv.note === 'object') {
        // 元々シート上にメモが存在していた場合、step.1.4でオリジナルが保存されているので'string'
        v.rv.note = JSON.stringify(v.rv.column, (k, v) => typeof v === 'function' ? v.toString() : v, 2);
      }

      // ------------------------------------------------
      // default,auto_increment項目の準備
      // ------------------------------------------------
      dev.step(3); // defaultを関数に変換
      if (v.rv.column.default) {
        dev.step(3.1);
        v.r = functionalyze(v.rv.column.default);
        if (v.r instanceof Error) throw v.r;
        v.rv.column.default = v.r;
      }
      if (v.rv.column.default instanceof Error) throw v.rv.column.default;

      dev.step(4); // auto_incrementをオブジェクトに変換
      v.ac = {
        Array: x => { return { obj: { start: x[0], step: (x[1] || 1) }, str: JSON.stringify(x) } },  // [start,step]形式
        Number: x => { return { obj: { start: x, step: 1 }, str: x } },  // startのみ数値で指定
        Object: x => { return { obj: x, str: JSON.stringify(x) } }, // {start:m,step:n}形式
        Null: x => { return { obj: false, str: 'false' } }, // auto_incrementしない
        Boolean: x => { return x ? { obj: { start: 1, step: 1 }, str: 'true' } : { obj: false, str: 'false' } }, // trueは[1,1],falseはauto_incrementしない
      };
      if (v.rv.column.auto_increment) {
        dev.step(3.1);
        if (typeof v.rv.column.auto_increment === 'string') {
          v.rv.column.auto_increment = JSON.parse(v.rv.column.auto_increment);
        }
        v.acObj = v.ac[whichType(v.rv.column.auto_increment)](v.rv.column.auto_increment);
        v.rv.column.auto_increment = v.acObj.obj;
        // 開始値はstart+stepになるので、予め-stepしておく
        v.rv.column.auto_increment.start -= v.rv.column.auto_increment.step;
        v.rv.note.auto_increment = v.acObj.str;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** genSchema: sdbSchemaオブジェクトを生成
   * @param table {sdbTable} - 対象テーブルのsdbTableオブジェクト
   * @returns {void}
   */
  function genSchema(table) {
    const v = { whois: `${pv.whois}.genSchema`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      // -----------------------------------------------
      dev.step(2); // 項目定義オブジェクト(cols)の作成
      // -----------------------------------------------
      if (table.schema.cols.length === 0) {
        if (table.notes.length > 0) {
          dev.step(2.1); // シートにメモが存在していた場合、その内容から作成
          for (v.i = 0; v.i < table.notes.length; v.i++) {
            v.r = genColumn(table.notes[v.i]);
            if (v.r instanceof Error) throw v.r;
            table.schema.cols.push(v.r.column);
          }
        } else {
          dev.step(2.2); // シートにメモが無かった場合、ヘッダ行の項目名から作成
          for (v.i = 0; v.i < table.header.length; v.i++) {
            v.r = genColumn(table.header[v.i]);
            if (v.r instanceof Error) throw v.r;
            table.schema.cols.push(v.r.column);
            table.notes.push(v.r.note);
          }
        }
      } else if (table.notes.length === 0) {
        dev.step(2.3); // 項目定義オブジェクトが渡された場合、notesのみを作成
        for (v.i = 0; v.i < table.schema.cols.length; v.i++) {
          v.r = genColumn(table.schema.cols[v.i]);
          if (v.r instanceof Error) throw v.r;
          table.notes.push(v.r.note);
        }
      }

      // -----------------------------------------------
      dev.step(3); // table.schema.cols以外のメンバ作成
      // -----------------------------------------------
      for (v.i = 0; v.i < table.schema.cols.length; v.i++) {
        dev.step(3.1); // primaryKey
        if (Object.hasOwn(table.schema.cols[v.i], 'primaryKey') && table.schema.cols[v.i].primaryKey === true) {
          table.schema.primaryKey = table.schema.cols[v.i].name;
          table.schema.unique[table.schema.cols[v.i].name] = [];
        }

        dev.step(3.2); // unique
        if (Object.hasOwn(table.schema.cols[v.i], 'unique') && table.schema.cols[v.i].unique === true) {
          table.schema.unique[table.schema.cols[v.i].name] = [];
        }

        dev.step(3.3); // auto_increment
        // ※sdbColumnでauto_incrementなら配列、違うならfalse設定済
        if (table.schema.cols[v.i].auto_increment && table.schema.cols[v.i].auto_increment !== false) {
          table.schema.auto_increment[table.schema.cols[v.i].name] = table.schema.cols[v.i].auto_increment;
          table.schema.auto_increment[table.schema.cols[v.i].name].current = table.schema.auto_increment[table.schema.cols[v.i].name].start;
        }

        dev.step(3.4); // defaultRowに既定値設定項目をセット。なおdefaultはgenColumnにて既に関数化済
        if (table.schema.cols[v.i].default) {
          table.schema.defaultRow[table.schema.cols[v.i].name] = table.schema.cols[v.i].default;
        }
      }

      // ------------------------------------------------
      dev.step(4); // unique,auto_incrementの洗い出し
      // ------------------------------------------------
      table.values.forEach(vObj => {
        dev.step(4.1); // unique項目の値を洗い出し
        Object.keys(table.schema.unique).forEach(unique => {
          if (vObj[unique]) {
            if (table.schema.unique[unique].indexOf(vObj[unique]) < 0) {
              table.schema.unique[unique].push(vObj[unique]);
            } else {
              throw new Error(`${v.whois}:「${unique}」欄の値"${vObj[unique]}"は重複しています`);
            }
          }
        });

        dev.step(4.2); // auto_increment項目の値を洗い出し
        Object.keys(table.schema.auto_increment).forEach(ai => {
          v.c = table.schema.auto_increment[ai].current;
          v.s = table.schema.auto_increment[ai].step;
          v.v = Number(vObj[ai]);
          if ((v.s > 0 && v.c < v.v) || (v.s < 0 && v.c > v.v)) {
            table.schema.auto_increment[ai].current = v.v;
          }
        });
      });

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** genTable: pv.table(sdbTable)を生成
   * @param query {sdbQuery}
   * @param query.table {string} - シート名
   * @param [query.cols] {sdbColumn[]} - 新規作成シートの項目定義オブジェクトの配列
   * @param [query.set] {Object[]|Array[]} - 新規作成シートに書き込む初期値
   * @returns {sdbTable|null} シート不存在ならnull
   */
  function genTable(query) {
    const v = { whois: `${pv.whois}.genTable`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(2); // テーブルのプロトタイプを作成、初期化＋既定値設定
      v.r = objectizeColumn('sdbTable');
      if (v.r instanceof Error) throw v.r;
      pv.table[query.table] = v.table = Object.assign(v.r, {
        name: query.table, // {string} テーブル名(範囲名)
        sheet: pv.spread.getSheetByName(query.table), // {Sheet} スプレッドシート内の操作対象シート(ex."master"シート)
      });

      dev.step(3); // シートの存否確認
      if (v.table.sheet === null) {

        if (query.command !== 'create') {
          // select, append, update, delete, schema の
          // create以外のコマンドの場合、対象テーブル未作成はエラー
          query.qSts = 'No Table';
        } else {

          dev.step(4); // シート不在なら引数から項目定義を作成
          if (query.cols && query.cols.length > 0) {
            dev.step(4.1); // 引数に項目定義オブジェクトが存在
            v.table.schema.cols = query.cols;
            v.table.header = query.cols.map(x => x.name);
          } else {
            if (query.set && query.set.length > 0) {
              dev.step(4.2); // 引数に項目定義オブジェクトが不存在だが初期データは存在
              v.r = convertRow(query.set);
              if (v.r instanceof Error) throw v.r;
              v.table.header = v.r.header;
            } else {
              dev.step(4.3); // 項目定義も初期データも無いならエラー
              query.qSts = 'No cols and data';
            }
          }

          dev.step(4.4); // 項目数・データ行数の設定
          v.table.colnum = v.table.header.length;
          v.table.rownum = 0;

          // 尚v.table.notes(項目定義メモ)は設定不要
          // ∵ step.6のgenSchema経由genColumnでcolsから作成される

        }
      } else {

        dev.step(5); // シートが存在するならシートから各種情報を取得
        dev.step(5.1); // シートイメージを読み込み
        v.getDataRange = v.table.sheet.getDataRange();
        v.getValues = v.getDataRange.getValues();

        dev.step(5.2); // シートイメージからヘッダ行・行オブジェクトを作成
        v.r = convertRow(v.getValues);
        if (v.r instanceof Error) throw v.r;

        dev.step(5.3); // ヘッダ・データの設定
        v.table.header = v.r.header;
        v.table.values = v.r.obj;
        v.table.colnum = v.table.header.length;
        v.table.rownum = v.table.values.length;

        dev.step(5.4); // ヘッダ行のメモ(項目定義メモ)を取得
        v.table.notes = v.getDataRange.getNotes()[0];

      }

      dev.step(6); // スキーマをインスタンス化
      if (query.qSts === 'OK') {
        v.r = genSchema(v.table);
        if (v.r instanceof Error) throw v.r;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** getSchema: 指定テーブルの項目定義情報を取得
   * @param {sdbQuery} query
   * @param {string} query.table - 取得対象テーブル名。テーブルと構造情報の対応を明確にするため、複数テーブル指定不可
   * @returns {null|Error}
   *
   * - sdbResult.pKeyは空欄、rStsはOK固定、diffにsdbColumnをセット
   */
  function getSchema(query) {
    const v = { whois: `${pv.whois}.getSchema`, step: 0, rv: [] };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1); // テーブル管理情報を項目毎にresultにセット
      v.cols = pv.table[query.table].schema.cols;
      for (v.i = 0; v.i < v.cols.length; v.i++) {
        query.result.push(v.cols[v.i]);
      }

      dev.step(2); // 項目数をnumにセット
      query.num = query.result.length;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** objectizeColumn: 項目定義メタ情報(JSDoc)からオブジェクトを生成
   * @param arg {Object[]|string} 文字列の場合、pv.opt以下に定義されているメンバ(typedef)と看做す
   * @param arg.name {string} 生成するオブジェクト内のメンバ名
   * @param arg.default {string|function} メンバ名にセットする値(functionalyzeの引数)
   * @returns {Object} 生成されたオブジェクト
   */
  function objectizeColumn(arg) {
    const v = { whois: `${pv.whois}.objectizeColumn`, step: 0, rv: {} };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // 文字列ならpv.opt以下に定義されているメンバ、それ以外は配列化
      v.arg = typeof arg === 'string' ? pv.opt[arg] : (Array.isArray(arg) ? arg : [arg]);

      dev.step(2);
      for (v.i = 0; v.i < v.arg.length; v.i++) {
        if (Object.hasOwn(v.arg[v.i], 'default') && v.arg[v.i].default) {
          dev.step(3);
          v.func = functionalyze(v.arg[v.i].default);
          if (v.func instanceof Error) throw v.func;
          v.rv[v.arg[v.i].name] = v.func();
        } else {
          dev.step(4); // 既定値の指定が無い場合はnullとする
          v.rv[v.arg[v.i].name] = null;
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** selectRow: テーブルから該当行を抽出
   * @param {sdbQuery|sdbQuery[]} query
   * @param {sdbTable} query.table - 操作対象のテーブル名
   * @param {Object|function} query.where - 対象レコード判定条件
   * @returns {null|Error}
   *
   * - where句の指定方法: functionalyze参照
   */
  function selectRow(query) {
    const v = { whois: `${pv.whois}.selectRow`, step: 0, rv: null };
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1);  // 抽出条件をquery.argにセット
      query.arg = toString(query.where);

      dev.step(2); // 判定条件を関数に統一
      v.where = functionalyze({ table: query.table, data: query.where });
      if (v.where instanceof Error) throw v.where;

      dev.step(3); // 行オブジェクトを順次走査、該当行を戻り値に追加
      v.table = pv.table[query.table];
      for (v.i = 0; v.i < v.table.values.length; v.i++) {
        if (v.where(v.table.values[v.i])) {
          query.result.push(v.table.values[v.i]);
        }
      }

      dev.step(4); // 抽出行数をnumにセット
      query.num = query.result.length;

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
  }
  /** 関数・オブジェクトを文字列化 */
  function toString(arg) {
    if (typeof arg === 'function') return arg.toString().replaceAll(/\n/g, '');
    if (arg !== null && typeof arg === 'object') return JSON.stringify(arg);
    return arg;
  }
  /** updateRow: テーブルの既存行の内容を更新
   * @param {Object} query
   * @param {sdbTable} query.table - 操作対象のテーブル管理情報
   * @param {Object|Function|string} query.where - 対象レコードの判定条件
   * @param {Object|Function|string} query.set - 更新する値
   * @returns {null|Error}
   */
  function updateRow(query) {
    const v = {
      whois: `${pv.whois}.updateRow`, step: 0, rv: null,
      top: Infinity, left: Infinity, right: 0, bottom: 0
    }; // 更新範囲の行列番号
    dev.start(v.whois, [...arguments]);
    try {

      dev.step(1.1);  // v.tableに対象のテーブル管理情報をセット
      v.table = pv.table[query.table];

      dev.step(1.2); // query.whereの存否判定
      if (!Object.hasOwn(query, 'where')) query.qSts = `No where`;  // query.whereが不存在
      query.arg = { where: toString(query.where) };  // 変更履歴シート記録用に文字列化
      v.where = functionalyze({ table: query.table, data: query.where });
      if (v.where instanceof Error) throw v.where;

      dev.step(1.3); // query.setの存否判定、引数setの処理
      if (Object.hasOwn(query, 'set') && query.set) {
        query.arg.set = toString(query.set);
        // functionalyzeはwhere句用に「オブジェクトはprimaryKey項目で値が一致するか」の関数を返すため、不適切
        // よってオブジェクトまたはJSON化できる場合はそれを使用し、関数の場合のみfunctionalyzeで関数化する
        v.r = (query => {
          if (whichType(query, 'Object')) return query;  // Objectならそのまま返す
          try { return JSON.parse(query) } catch { return null } // JSONならObjectを、それ以外の文字列はnullを返す
        })(query.set);
        if (v.r !== null) { // query.setがObjectかJSONだった場合
          v.set = () => { return v.r }; // Objectを返す関数とする
        } else { // query.setがObjectでもJSONでもない文字列だった場合
          // 更新する値を導出する関数を作成
          v.set = functionalyze({ table: query.table, data: query.set });
          if (v.set instanceof Error) throw v.set;
        }

        dev.step(1.4); // 更新履歴記録用に文字列化
        query.arg = JSON.stringify(query.arg);

        dev.step(1.5); // 配列a1がa2の部分集合かどうかを判断する関数を用意
        // 更新対象項目がテーブルの項目名リストに全て入っているかの判断で使用(step.3.2)
        v.isSubset = (a1, a2) => {
          for (let element of a1)
            if (!a2.includes(element)) return false;
          return true;
        };

      } else {
        query.qSts = `No set`;
      }

      if (query.qSts === 'OK') {
        // ------------------------------------------------
        dev.step(2); // table.valuesを更新、ログ作成
        // ------------------------------------------------
        for (v.i = 0; v.i < v.table.values.length; v.i++) {

          dev.step(2.1); // 対象外判定ならスキップ
          if (v.where(v.table.values[v.i]) === false) continue;

          dev.step(2.2); // v.rObj: 更新指定項目のみのオブジェクト
          v.rObj = v.set(v.table.values[v.i]);

          dev.step(2.3); // 更新対象項目が項目名リストに存在しない場合はエラー
          // 本来事前チェックを行うべき項目だが、setをfunctionで指定していた場合
          // レコード毎に更新対象項目が変動する可能性があるため、レコード毎にチェック
          if (!v.isSubset(Object.keys(v.rObj), v.table.header)) {
            query.qSts = `Undefined Column`;
            break;
          }

          dev.step(2.4); // レコード単位の更新履歴オブジェクトを作成
          v.log = objectizeColumn('sdbResult');
          if (v.log instanceof Error) throw v.log;
          v.log.pKey = v.table.values[v.i][v.table.schema.primaryKey];
          query.result.push(v.log);

          dev.step(2.5); // v.before(更新前の行オブジェクト),after,diffの初期値を用意
          [v.before, v.after] = [v.table.values[v.i], {}];

          dev.step(2.6); // 項目毎に値が変わるかチェック
          v.table.header.forEach(x => {
            if (Object.hasOwn(v.rObj, x) && !isEqual(v.before[x], v.rObj[x])) {
              dev.step(6.1); // 変更指定項目かつ値が変化していた場合
              v.after[x] = v.rObj[x]; // afterは変更後の値
              v.log.diff[x] = [v.before[x], v.rObj[x]];  // diffは[変更前,変更後]の配列
              dev.step(6.2); // 更新対象範囲の見直し
              v.colNo = v.table.header.findIndex(y => y === x);
              v.left = Math.min(v.left, v.colNo);
              v.right = Math.max(v.right, v.colNo);
            } else {
              dev.step(6.3); // 非変更指定項目または変更指定項目だが値の変化が無い場合、beforeの値をセット
              v.after[x] = v.before[x];
            }
          });

          dev.step(2.7); // 更新レコードの正当性チェック(unique重複チェック)
          for (v.unique in v.table.schema.unique) {
            if (Object.hasOwn(v.log.diff, v.unique)) {
              // 変更後の値がschema.uniqueに登録済の場合はDuplicate
              if (v.table.schema.unique[v.unique].indexOf(v.after[v.unique]) >= 0) {  // いまここ：全部Duplicate判定
                dev.step(7.1); // 登録済の場合はエラー
                v.log.rSts = 'Duplicate';
              } else {
                dev.step(7.2); // 未登録の場合、table.sdbSchema.uniqueから変更前の値を削除して変更後の値を追加
                v.idx = v.table.schema.unique[v.unique].findIndex(x => x === v.before[v.unique]);
                v.table.schema.unique[v.unique].splice(v.idx, 1);
                v.table.schema.unique[v.unique].push(v.after[v.unique]);
              }
            }
          }

          dev.step(2.8); // 正当性チェックOKの場合、修正後のレコードを保存して書換範囲(range)を修正
          if (v.log.rSts === 'OK') {
            query.num++;
            v.top = Math.min(v.top, v.i);
            v.bottom = Math.max(v.bottom, v.i);
            v.table.values[v.i] = v.after;
          }
        }

        // ------------------------------------------------
        dev.step(3); // 対象シート・更新履歴に展開
        // ------------------------------------------------
        dev.step(3.1); // シートイメージ(二次元配列)作成
        v.target = [];
        for (v.i = v.top; v.i <= v.bottom; v.i++) {
          v.row = [];
          for (v.j = v.left; v.j <= v.right; v.j++) {
            v.row.push(v.table.values[v.i][v.table.header[v.j]]);
          }
          v.target.push(v.row);
        }

        dev.step(3.2); // シートに展開
        // v.top,bottom: 最初と最後の行オブジェクトの添字(≠行番号) ⇒ top+1 ≦ row ≦ bottom+1
        // v.left,right: 左端と右端の行配列の添字(≠列番号) ⇒ left+1 ≦ col ≦ right+1
        if (v.target.length > 0) {
          v.table.sheet.getRange(
            v.top + 2,  // +1(添字->行番号)+1(ヘッダ行)
            v.left + 1,  // +1(添字->行番号)
            v.target.length,
            v.target[0].length
          ).setValues(v.target);
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) {
      dev.error(e);
      return e;
    }
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