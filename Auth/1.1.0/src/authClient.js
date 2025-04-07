function authClient(option={}) {
  const pv = {whois:'authClient'}, v = {rv: null};
  const typedefs = {
    acMembers: [
      {name:'opt',type:'object',value:{},note:''},
      {name:'userId',type:'string',value:'',note:'ユーザ識別子'},
      {name:'email',type:'string',value:'',note:'ユーザのメールアドレス'},
      {name:'CSkey',type:'object',value:{},note:'クライアント側秘密鍵'},
      {name:'CPkey',type:'string',value:'',note:'クライアント側公開鍵'},
      {name:'SPkey',type:'string',value:'',note:'サーバ側公開鍵'},
    ],
    acMain_option:[
      {name:'saveUserId',type:'boolean',value:true,note:'userIdをlocalStorageに保存するか否か'},
      {name:'saveEmail',type:'boolean',value:false,note:'e-mailをlocalStorageに保存するか否か'},
      {name:'mirror',type:'object',value:[],note:'ローカル側にミラーを保持するテーブルの定義'},
      {name:'interval',type:'number',value:60000,note:'crondをチェックする間隔'},
    ],
    acRequest_query: [
      {name:'table',type:'string',value:'',note:'操作対象テーブル名'},
      {name:'command',type:'string',value:'',note:'操作名'},  // select,update,append,schema,regist
      {name:'where',type:'object|function|string',value:null,note:'対象レコードの判定条件'},
      {name:'set',type:'Object|Object[]|string|string[]|Function',value:null,note:'追加・更新する値'},
    ],
  };
  dev.start(pv.whois, [...arguments]);
  try { // 主処理(constructor)

    // -------------------------------------------------------------
    dev.step(1); // メンバ(pv)に引数を保存、未指定分には既定値を設定
    // -------------------------------------------------------------
    // メンバの初期値を設定
    v.r = createObject({defs:typedefs,root:'acMembers',addTo:pv});
    if( v.r instanceof Error ) throw v.r;
    // authClient/Server共通設定値
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
    try { v.url = new URL(window.location.href).searchParams; } catch { v.url = {} };
    try { v.ls = JSON.parse(localStorage.getItem(pv.opt.storageKey)) } catch { v.ls = {} };
    pv.opt = Object.assign(pv.opt,v.ls,v.url);
    if( pv.opt.userId === '' ) pv.opt.userId = Utilities.getUuid();

    // -------------------------------------------------------------
    dev.step(4);  // crond初期登録
    // -------------------------------------------------------------
    pv.opt.mirror.forEach(cron => {
      if( !cron.name ) cron.name = cron.table;
      if( cron.min !== 0 && !cron.min ) cron.min = cron.max * 0.6;
      cron.last = '1970-01-01T09:00:00.000+09:00';
    });
    //本番時解放：pv.crond = setInterval(request(),pv.opt.interval);
    dev.dump(pv,62);

    dev.end(); // 終了処理
    v.rv = {request:request};
    return v.rv;

  } catch (e) { dev.error(e); return e; }

  function request(query) {
    const v = { whois: `${pv.whois}.request`, rv: null, now: Date.now(), map:[
      {rex:/OK::schema/,func:createTable,loop:false},
      {rex:/OK::select/,func:updateTable,loop:false},
      {rex:/OK::update/,func:updateTable,loop:false},
      {rex:/OK::append/,func:updateTable,loop:false},
      {rex:/OK::regist/,func:null,loop:false},
      {rex:/NG/,func:v.alert,loop:false},
      {rex:/LR/,func:enterPasscode,loop:true},
      {rex:/RR::invalid SPkey/,func:enterUserId,loop:true},
      {rex:/RR::unregistered/,func:updateSPkey,loop:true},
    ]};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------
      dev.step(1.1);  // 引数の存否確認、データ型チェック
      if( !Array.isArray(query) ) query = [query];
      query.forEach(q => {
        q = createObject({defs:typedefs,root:'acRequest_query',val:q});
        if( q instanceof Error ) throw q;
      });

      dev.step(1.2);  // 定期実行ジョブのチェックと追加
      pv.opt.mirror.forEach(jObj => {
        v.last = new Date(jObj.last).getTime();
        if( (v.now - v.last) > v.min ){
          query.push({
            table: jObj.table,
            command: 'select',
            where: `o => {return new Date(o.updated).getTime() > ${v.last} ? true : false}`,
          });
        }
      });

      // -------------------------------------------------------------
      dev.step(2);  // authServerに処理要求、結果により分岐
      // -------------------------------------------------------------
      v.loop = query.length * 10; // ループの最大限はクエリ数×10とする
      while( v.loop > 0 ){

        dev.step(2.1);  // SPkeyがあればtoken作成(userIdを署名・暗号化した文字列)
        v.token = pv.SPkey ? cryptico.encrypt(pv.userId,pv.SPkey,pv.CSkey) : null;

        dev.step(2.2);  // authServerの呼び出し
        v.rv = authPost(query,v.token);
        if( v.rv instanceof Error ) throw v.rv;

        dev.step(2.3);  // 結果による分岐
        v.retry = []; // 再試行するJOB
        v.rv.forEach(query => {
          v.map.forEach(x => {
            // statusの値により分岐先を決定
            if( query.status.match(x.rex) ){
              // 分岐先処理を実行
              v.r = x.func(query);
              if( v.r instanceof Error ) throw v.r;
              if( x.loop ){
                v.retry.push(query);  // ループが必要な場合、再試行するJOBに追加
              } else {
                v.loop = 0; // ループが必要ない場合、ループを抜ける
              }
            }
          })
        });
        v.loop--;
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  function createTable(arg) {
    const v = { whois: `${pv.whois}.createTable`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------
      dev.dump(arg,11);

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  function updateTable(arg) {
    const v = { whois: `${pv.whois}.updateTable`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------
      dev.dump(arg,11);

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  function enterPasscode(arg) {
    const v = { whois: `${pv.whois}.enterPasscode`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------
      dev.dump(arg,11);

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  function enterUserId(arg) {
    const v = { whois: `${pv.whois}.enterUserId`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------
      dev.dump(arg,11);

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }

  function updateSPkey(arg) {
    const v = { whois: `${pv.whois}.updateSPkey`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
      // -------------------------------------------------------------
      dev.dump(arg,11);

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }
}