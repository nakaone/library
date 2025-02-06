function authServer(query,option={}) {
  const sv = { whois: 'authServer' };
  const v = { rv: null };
  dev.start(sv.whois, [...arguments]);
  try {

    // -------------------------------------------------------------
    dev.step(1); // 引数の存否確認、データ型チェック ＋ ワークの準備
    // -------------------------------------------------------------
    constructor(query,option);

    dev.end(); // 終了処理
    return v.rv;

  } catch (e) { dev.error(e); return e; }

  function constructor(query,option) {
    const v = { whois: `${sv.whois}.constructor`, rv: null};
    dev.start(v.whois, [...arguments]);
    try {

      // -------------------------------------------------------------
      dev.step(1); // 引数の型チェック＋変換
      // -------------------------------------------------------------

      // -------------------------------------------------------------
      dev.step(1); // メンバ(sv)に引数を保存、未指定分には既定値を設定
      // -------------------------------------------------------------
      //::authClient/Server共通設定::$src/commonOption.js::
      Object.assign(sv, {
        query: Object.assign({
          queryId: Utilities.getUuid(), // {string} クエリ・結果突合用文字列
          table: '', // {string} 操作対象テーブル名
          command: '', // {string} 操作名
          where: null, // {Object|Function|string} 対象レコードの判定条件
          set: null, // {Object|Object[]|string|string[]|Function} 追加・更新する値
          timestamp: toLocale(new Date()), // {string} 更新日時(ISO8601拡張形式)
          userId: 'guest', // {string|number} ユーザ識別子(uuid等)
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
        },option,commonOption),
        SPkey: null,
        SSkey: null,
        account: null,
        device: null,
        typedefs: {},
        DocumentProperties: PropertiesService.getDocumentProperties(),
      })

      // sv.queryの作成
      sv.query = typedefObj(sv.typedefs.authQuery,query);
      if( sv.query instanceof Error ) throw sv.query;

      // sv.opt(authServer専用部分)に引数適用
      sv.opt = Object.assign(sv.opt,option);

      // sv.opt(authClient/Server共通部分)の作成
      sv.opt = Object.assign(sv.opt,commonOption);
      dev.dump(sv,65)

      // -------------------------------------------------------------
      dev.step(1); // authClient/authServer共通オプションは引数で上書きしない
      // -------------------------------------------------------------

      // -------------------------------------------------------------
      dev.step(1); // DocumentPropertiesからSS/SPkeyを取得
      // 未生成なら生成、DocumentPropertiesに保存
      // -------------------------------------------------------------

      // -------------------------------------------------------------
      dev.step(1); // accounts/devicesシートが未作成なら追加
      // -------------------------------------------------------------


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