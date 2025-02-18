function authServer(query,option={}) {
  const pv = { whois: 'authServer' };
  const v = { rv: null, now:toLocale(Date.now()) };
  dev.start(pv.whois, [...arguments]);
  try {

    // -------------------------------------------------------------
    dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
    // -------------------------------------------------------------
    constructor(query,option);

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
          accountsSheet: [
            {name:'userId',type:'string|number',note:'ユーザ識別子(primaryKey)',auto_increment:101,primaryKey:true},
            {name:'note',type:'string',note:'アカウント情報(備考)'},
            {name:'validityStart',type:'string',note:'有効期間開始日時(ISO8601文字列)',default:()=>toLocale(Date.now())},
            {name:'validityEnd',type:'string',note:'有効期間終了日時(ISO8601文字列)',default:()=>toLocale(Date.now()+pv.opt.validitySpan)},
            {name:'authority',type:'JSON',note:'シート毎のアクセス権限。{シート名:rwdos文字列} 形式。既定値は無し'},
            {name:'created',type:'string',note:'=Date.now() ユーザ登録日時(ISO8601拡張形式)',default:()=>toLocale(Date.now())},
            {name:'updated',type:'string',note:'=Date.now() 最終更新日時(ISO8601拡張形式)',default:()=>toLocale(Date.now())},
            {name:'deleted',type:'string',note:'論理削除日時'},
          ],
          devicesSheet: [
            {name:'userId',type:'string|number',note:'ユーザ識別子。not null'},
            {name:'email',type:'string',note:'ユーザのメールアドレス(primaryKey)',primaryKey:true},
            {name:'name',type:'string',note:'ユーザの氏名'},
            {name:'phone',type:'string',note:'ユーザの電話番号'},
            {name:'address',type:'string',note:'ユーザの住所'},
            {name:'note',type:'string',note:'ユーザ情報(備考)'},
            {name:'CPkey',type:'string',note:'クライアント側公開鍵'},
            {name:'CPkeyExpiry',type:'string',note:'CPkey有効期限'},
            {name:'trial',type:'authTrial',note:'ログイン試行情報'},
            {name:'created',type:'string',note:'=Date.now() ユーザ登録日時(ISO8601拡張形式)'},
            {name:'updated',type:'string',note:'=Date.now() 最終更新日時(ISO8601拡張形式)'},
            {name:'deleted',type:'string',note:'論理削除日時'},
          ],
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

  /** typedefObj: 指定された形式のオブジェクトを生成する
   * - 項目定義からオブジェクトを生成、指定オブジェクトでメンバを上書きする
   * - 階層のあるオブジェクトには非対応(メンバの属性はプリミティブ型限定)。必要な場合は事前に子階層をオブジェクト化し、overに指定のこと
   *
   * @param {sdbColumn[]} typedef - オブジェクトの形式定義
   * @param {Object} over={} - 上書きするオブジェクト。主に引数を想定
   * @returns {Object} 生成されたオブジェクト
   */
  function typedefObj(typedef,over={}) {
    const v = { whois: 'typedefObj', rv: {}};
    dev.start(v.whois, [...arguments]);
    try {

      for( v.i=0 ; v.i<typedef.length ; v.i++ ){
        v.rv[typedef[v.i].name] = null; // 既定値null
        if( Object.hasOwn(over,typedef[v.i].name) ){
          if( typeof over[typedef[v.i].name] !== 'function' ){
            dev.step(1); // overに値があり且つ関数では無い場合、その値を使用(関数は安全性確保のため不可)
            v.rv[typedef[v.i].name] = over[typedef[v.i].name];
          }
        } else {
          if( Object.hasOwn(typedef[v.i],'default') ){
            dev.step(2); // 項目定義にdefaultがある場合はその値を使用
            v.rv[typedef[v.i].name] = typeof typedef[v.i].default === 'function' ? typedef[v.i].default() : typedef[v.i].default
          }
        }
      }

      dev.end(); // 終了処理
      return v.rv;

    } catch (e) { dev.error(e); return e; }
  }
}