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
    dev.step(1);  // URLクエリ・localStorageからuserId/e-mail取得を試行
    // -------------------------------------------------------------
    v.userId = null;
    v.email = null;

    // -------------------------------------------------------------
    dev.step(2); // メンバ(pv)に引数を保存、未指定分には既定値を設定
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
    dev.step(3); // CSkey/CPkeyを準備
    // -------------------------------------------------------------
    pv.CSkey = cryptico.generateRSAKey(createPassword(),pv.opt.bits);
    pv.CPkey = cryptico.publicKeyString(pv.CSkey);

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
      pv.query = {table:'accounts',command:'append'};
      v.rv = authPost(pv.query);


      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }
}