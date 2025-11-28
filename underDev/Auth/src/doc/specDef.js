console.log(JSON.stringify({implements:{cl:'クライアント側',sv:'サーバ側'},classdef:{
  authAuditLog: {
    desc: 'authServerの監査ログ',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
      - 監査ログ出力が必要なメソッドの冒頭でインスタンス化、処理開始時刻等を記録
      - 出力時にlogメソッドを呼び出して処理時間を計算、シート出力
    `,	// {string} クラスとしての補足説明。概要欄に記載
    implement: ['sv'],  // 実装の有無

    members: {list:[  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'timestamp',type:'string',desc:'要求日時',note:'ISO8601拡張形式の文字列',default:'Date.now()'},
      {name:'duration',type:'number',desc:'処理時間',note:'ミリ秒単位'},
      {name:'memberId',type:'string',desc:'メンバの識別子',note:'メールアドレス'},
      {name:'deviceId',type:'string',desc:'デバイスの識別子',note:'',isOpt:true},
      {name:'func',type:'string',desc:'サーバ側関数名',note:''},
      {name:'result',type:'string',desc:'サーバ側処理結果',note:'"fatal","warning","normal"',default:'normal'},
      {name:'note',type:'string',desc:'備考',note:''},
    ]},

    methods: {list:[
      {
        name: 'constructor',
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        desc: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        rev: 1, // {number} 0:未着手 1:完了 0<n<1:作成途中

        params: {list:[
          {name:'config',type:'authServerConfig',desc:'authServerの動作設定変数',note:''},
        ]},

        process: `
          - メンバと引数両方にある項目は、引数の値をメンバとして設定
          - authServerConfig].[auditLog](authServerConfig.md#authserverconfig_members)シートが無ければ作成
          - 引数の内、authAuditLogと同一メンバ名があればthisに設定
          - 引数にnoteがあればthis.noteに設定
          - timestampに現在日時を設定
        `,

        returns: {list:[{type:'authAuditLog'}]},
      },{
        name: 'log', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: '監査ログシートに処理要求を追記', // {string} 端的な関数(メソッド)の説明
        note: ``, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 1, // {string} 本メソッド仕様書の版数

        params: {list:[
          {name:'request',type:'authRequest|string',desc:'処理要求オブジェクトまたは内発処理名',note:''},
          {name:'response',type:'authResponse',desc:'処理結果',note:''},
        ]},

        process: `
          - メンバに以下を設定
            %% this.cfTable({'type':'authAuditLog','default':{
              'timestamp':'"toLocale(this.timestamp)(ISO8601拡張形式)"',
              'duration':'"Date.now() - this.timestamp"',
              'memberId':'"request.memberId"',
              'deviceId':'"request.deviceId"',
              'func':'"request.func"',
              'result':'"response.result"',
              'note':'"this.note + response.message"',
            }}) %%
        `,

        returns: {list:[
          {type:'authAuditLog'}, // コンストラクタは自データ型名
        ]},
      }
    ]},
  },
  authConfig: {
    desc: 'authClient/authServer共通設定値',
    note: '[authClientConfig](authClientConfig.md), [authServerConfig](authServerConfig.md)の親クラス',
    implement: ['cl','sv'],  // 実装の有無

    members:{list:[
      {name:'systemName',type:'string',desc:'システム名',default:'auth'},
      {name:'adminMail',type:'string',desc:'管理者のメールアドレス'},
      {name:'adminName',type:'string',desc:'管理者氏名'},
      {name:'allowableTimeDifference',type:'number',desc:'クライアント・サーバ間通信時の許容時差',note:'既定値は2分',default:120000},
      {name:'RSAbits',type:'string',desc:'鍵ペアの鍵長',default:2048},
      {name:'underDev',type:'Object',desc:'テスト時の設定',isOpt:true},
      {name:'underDev.isTest',type:'boolean',desc:'開発モードならtrue',default:'false'},
    ]},

    methods: {list:[{
      name: 'constructor',
      type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
      desc: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
      rev: 1, // {number} 0:未着手 1:完了 0<n<1:作成途中

      params: {list:[  // {Params} ■メソッド引数の定義■
        {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:'{}'},
      ]},

      process: `
        - メンバと引数両方にある項目は、引数の値をメンバとして設定
      `,	// {string} 処理手順。markdownで記載

      returns: {list:[{type:'authConfig'}]},
    }]},
  },
  authClient: {
    extends: '', // {string} 親クラス名
    desc: 'クライアント側中核クラス', // {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
      authClientは、ローカル関数(ブラウザ内JavaScript)からの要求を受け、
      サーバ側(authServer)への暗号化通信リクエストを署名・暗号化、
      サーバ側処理を経てローカル側に戻された結果を復号・検証し、
      処理結果に応じてクライアント側処理を適切に振り分ける中核関数です。
    `, // {string} ✂️補足説明。概要欄に記載
    summary: `
      - クロージャ関数ではなくクラスとして作成
      - 内発処理はローカル関数からの処理要求に先行して行う

      ### 🧩 想定する実装

      constructorは非同期処理を行えないので、initializeを別途用意する。

      \`\`\`js
      class authClient {
        /**
         * コンストラクタは同期的に動作し、非同期処理は行わない
         */
        constructor(data){
          // 非同期処理の結果を使ってインスタンスのプロパティを初期化
          this.data = data;
          console.log("✅ インスタンスが初期化されました:", this.data);
        }

        /**
         * ⚡ 非同期でデータを取得し、インスタンスを生成・返す静的ファクトリ関数
         */
        static async initialize(){

          // --- IndexedDB等、初期化時に必要となる一連の非同期処理を実行 -----
          const rawData = await new Promise(resolve => {
            setTimeout(() => {
              resolve(”非同期で取得されたデータ:"+resourceId);
            }, 1000); // 1秒待機
          });
          // --- 非同期処理サンプルここまで -----

          // 取得したデータを使ってインスタンスを生成し、返す
          const instance = new authClient(rawData);
          return instance;
        }

        /**
         * 以降、その他メソッド
         */
        exec(){
          // 省略
        }
      }
      \`\`\`
      `,  // {string} ✂️概要(Markdown)。設計方針、想定する実装・使用例、等
    implement: ['cl'], // {string[]} 実装の有無(ex.['cl','sv'])
    template: ``, // {string} Markdown出力時のテンプレート

    members: {list:[
      {name:'cf',type:'authClientConfig',desc:'動作設定変数(config)',note:''},
      {name:'crypto',type:'cryptoClient',desc:'クライアント側暗号関係処理',note:''},
      {name:'idb',type:'authIndexedDB',desc:'IndexedDBの内容をauthClient内で共有',note:''},
    ]},

    methods: {list:[{
      name: 'constructor', // {string} 関数(メソッド)名
      type: 'private', // {string} 関数(メソッド)の分類
      desc: 'コンストラクタ', // {string} 端的な関数(メソッド)の説明
      note: ``, // {string} ✂️注意事項。Markdownで記載
      source: ``, // {string} ✂️想定するソースコード
      lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
      rev: 0, // {string} 本メソッド仕様書の版数

      params: {list:[
      ]},

      process: `
      `,
      /*
        - IndexedDBからメールアドレスを取得、存在しなければダイアログから入力
        - IndexedDBからメンバの氏名を取得、存在しなければダイアログから入力
        - deviceId未採番なら採番(UUID)
        - SPkey未取得ならサーバ側に要求
        - 更新した内容はIndexedDBに書き戻す
        - SPkey取得がエラーになった場合、SPkey以外は書き戻す
        - IndexedDBの内容はauthClient内共有用変数`pv`に保存
        - サーバ側から一定時間レスポンスが無い場合、`{result:'fatal',message:'No response'}`を返して終了
      */

      returns: {list:[
        {type:'authClient'}, // コンストラクタは自データ型名
      ]},
    },{
      name: 'initialize', // {string} 関数(メソッド)名
      type: 'async static', // {string} 関数(メソッド)の分類
      desc: 'コンストラクタ(非同期処理対応)', // {string} 端的な関数(メソッド)の説明
      note: ``, // {string} ✂️注意事項。Markdownで記載
      source: `
        static async initialize() {

          // 初期化時に必要な一連の非同期処理を実行
  
          // 取得したデータを使ってインスタンスを生成し、返す
          return new authClient();
        }
      `, // {string} ✂️想定するソースコード
      lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
      rev: 0, // {string} 本メソッド仕様書の版数

      params: {list:[
        {name:'config',type:'authClientConfig',desc:'authClientの動作設定変数',note:''},
      ]},

      process: `
        - メンバ変数の初期化
          - authClient内共有用変数を準備("cf = new [authClientConfig](authClientConfig.md#authclientconfig_constructor)()")
          - 鍵ペアを準備("crypto = new [cryptoClient](cryptoClient.md#cryptoclient_constructor)()")
          - IndexedDbを準備("idb = new [authIndexedDb](authIndexedDb.md#authindexeddb_constructor)()")
      `,

      returns: {list:[
        {type:'authClient'}, // コンストラクタは自データ型名
      ]},
    },{
      name: 'exec', // {string} 関数(メソッド)名
      type: 'public', // {string} 関数(メソッド)の分類
      desc: '', // {string} 端的な関数(メソッド)の説明
      note: ``, // {string} ✂️注意事項。Markdownで記載
      source: ``, // {string} ✂️想定するソースコード
      lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
      rev: 0, // {string} 本メソッド仕様書の版数

      params: {list:[
        {name:'',type:'string',desc:'',note:''},
      ]},

      process: ``,

      returns: {list:[
        {type:'authClient'}, // コンストラクタは自データ型名
      ]},
    }]},
  },
  authClientConfig: {
    desc: 'authClient専用の設定値',  // 端的なクラスの説明。ex.'authServer監査ログ'
    note: '[authConfig](authConfig.md)を継承', // クラスとしての補足説明
    extends: 'authConfig', // 親クラス名
    implement: ['cl'],  // 実装の有無

    members: {list:[
      {name:'api',type:'string',desc:'サーバ側WebアプリURLのID',note:'`https://script.google.com/macros/s/(この部分)/exec`'},
      {name:'timeout',type:'number',desc:'サーバからの応答待機時間',note:'これを超えた場合はサーバ側でfatalとなったと解釈する。既定値は5分',default:300000},
      {name:'CPkeyGraceTime',type:'number',desc:'CPkey期限切れまでの猶予時間',note:'CPkey有効期間がこれを切ったら更新処理実行。既定値は10分',default:600000},
    ]},

    methods: {list:[{
      name: 'constructor',
      type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
      desc: 'コンストラクタ',
      rev: 1, // {number} 0:未着手 1:完了 0<n<1:作成途中

      params: {list:[  // {Params} ■メソッド引数の定義■
        {name:'config',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
      ]},

      process: `
        - メンバと引数両方にある項目は、引数の値をメンバとして設定
      `,	// {string} 処理手順。markdownで記載(trimIndent対象)

      returns: {list:[{type:'authClientConfig'}]},
    }]},
  },
  authError: {
    desc: 'auth専用エラーオブジェクト',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement: ['cl','sv'],  // 実装の有無

    members: {list:[  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'responseTime',type:'number',desc:'エラー発生日時',note:'',default:'Date.now()'},
      {name:'errorType',type:'string',desc:'エラーの型(ex."ReferenceError")',note:'',default:'Error.name'},
      {name:'function',type:'string',desc:'エラーが起きたクラス・メソッド名',note:'',default:'v.whois'},
      {name:'step',type:'string',desc:'エラーが起きたメソッド内の位置',default:'v.step'},
      {name:'variable',type:'string',desc:'エラー時のメソッド内汎用変数(JSON文字列)',note:'',default:'JSON.stringify(v)'},
      {name:'message',type:'string',desc:'エラーメッセージ',default:'Error.message'},
      {name:'stack',type:'string',desc:'エラー時のスタックトレース',default:'Error.stack'},
    ]},

    methods: {list:[{
      name: 'constructor',
      type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
      desc: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
      rev: 1, // {number} 0:未着手 1:完了 0<n<1:作成途中

      params: {list:[  // {Params} ■メソッド引数の定義■
        {name:'e',type:'Error',note:'エラーオブジェクト'},
        {name:'v',type:'Object',note:'関数・メソッド内汎用変数',default:'{}'},
      ]},

      process: `
        - メンバと引数両方にある項目は、引数の値をメンバとして設定
        - variableはv.whois,v.stepを削除した上で、JSON化時150文字以上になる場合、以下のように処理
          - 配列は"{length:v.xxx.length,sample:v.xxx.slice(0,3)}"に変換
      `,	// {string} 処理手順。markdownで記載(trimIndent対象)

      returns: {list:[{type:'authError'}]},
    }]},
  },
  authErrorLog: {
    desc: 'authServerのエラーログ',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
      - 各メソッドの冒頭でインスタンス化、処理開始時刻等を記録
      - 出力時にlogメソッドを呼び出して処理時間を計算、シート出力
    `,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement: ['sv'],  // 実装の有無

    members: {list:[  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'',type:'string',desc:'',note:''},
    ]},

    methods: {list:[{
      name: 'constructor',
      type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
      desc: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
      rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

      params: {list:[  // {Params} ■メソッド引数の定義■
        {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:'{}'},
      ]},

      process: `
        - メンバと引数両方にある項目は、引数の値をメンバとして設定
      `,	// {string} 処理手順。markdownで記載(trimIndent対象)

      returns: {list:[{type:'authErrorLog'}]},
    }]},
  },
  authRequest: {
    desc: '暗号化前の処理要求',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
      - authClientからauthServerに送られる、暗号化前の処理要求オブジェクト
      - cryptoClient.[encrypt](cryptoClient.md#cryptoclient_encrypt)で暗号化し、authServerに送られる
      - サーバ側で受信後、cryptoServer.[decrypt](cryptoServer.md#cryptoserver_decrypt)でauthRequestに戻る
    `,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement: ['cl'],  // 実装の有無

    members: {list:[  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'memberId',type:'string',desc:'メンバの識別子',note:'=メールアドレス',default:'idb.memberId'},
      {name:'deviceId',type:'string',desc:'デバイスの識別子',note:'UUID',default:'idb.deviceId'},
      {name:'CPkey',type:'string',desc:'クライアント側署名',note:'',default:'idb.CPkey'},
      {name:'requestId',type:'string',desc:'要求の識別子',note:'UUID',default:'UUID'},
      {name:'requestTime',type:'number',desc:'要求日時',note:'UNIX時刻',default:'Date.now()'},
      {name:'func',type:'string',desc:'サーバ側関数名',note:''},
      {name:'arguments',type:'any[]',desc:'サーバ側関数に渡す引数の配列',note:'',default:'[]'},
    ]},

    methods: {list:[{
      name: 'constructor',
      type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
      desc: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
      rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

      params: {list:[  // {Params} ■メソッド引数の定義■
        {name:'request',type:'LocalRequest',note:'ローカル関数からの処理要求'},
      ]},

      process: `
        - メンバと引数両方にある項目は、引数の値をメンバとして設定
      `,	// {string} 処理手順。markdownで記載(trimIndent対象)

      returns: {list:[{type:'authRequest'}]},
    }]},
  },
  authResponse: {
    desc: 'サーバ側で復号された処理要求',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
    - サーバ側でauthClientから送られた[encryptedRequest](encryptedRequest.md#encryptedrequest_members)を復号して作成
    - サーバ側は本インスタンスに対して各種処理を行い、結果を付加していく
    - サーバ側処理終了後、cryptoServer.[encrypt](cryptoServer.md#encrypt)で暗号化してauthClientに戻す
    - authClientはcryptoClient.[decrypt](../cl/cryptoClient.md#cryptoclient_decrypt)で復号、後続処理を実行する
    `,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement: ['cl','sv'],  // 実装の有無

    members: {list:[  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'memberId',type:'string',desc:'メンバの識別子',note:'=メールアドレス'},
      {name:'deviceId',type:'string',desc:'デバイスの識別子',note:'UUID'},
      {name:'CPkey',type:'string',desc:'クライアント側署名',note:''},
      {name:'requestId',type:'string',desc:'要求の識別子',note:'UUID'},
      {name:'requestTime',type:'number',desc:'要求日時',note:'UNIX時刻'},
      {name:'func',type:'string',desc:'サーバ側関数名',note:''},
      {name:'arguments',type:'any[]',desc:'サーバ側関数に渡す引数の配列',note:''},
      {name:'SPkey',type:'string',desc:'サーバ側公開鍵',default:'SPkey'},
      {name:'response',type:'any',desc:'サーバ側関数の戻り値',note:'Errorオブジェクトを含む',default:'null'},
      {name:'receptTime',type:'number',desc:'サーバ側の処理要求受付日時',default:'Date.now()'},
      {name:'responseTime',type:'number',desc:'サーバ側処理終了日時',note:'エラーの場合は発生日時',default:'0'},
      {name:'status',type:'string',desc:'サーバ側処理結果',note:'authServerの処理結果。responseとは必ずしも一致しない',default:'"normal"'},
      {name:'decrypt',type:'string',desc:'クライアント側での復号処理結果',note:'"normal":正常、それ以外はエラーメッセージ',default:'"normal"'},
    ]},

    methods: {list:[{
      name: 'constructor',
      type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
      desc: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
      rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

      params: {list:[  // {Params} ■メソッド引数の定義■
        {name:'request',type:'encryptedRequest',note:'暗号化された処理要求'},
      ]},

      process: `
        - メンバと引数両方にある項目は、引数の値をメンバとして設定
      `,	// {string} 処理手順。markdownで記載(trimIndent対象)

      returns: {list:[{type:'authResponse'}]},
    }]},
  },
  authResult: {
    desc: 'auth内メソッドの標準的な戻り値',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `authServer内の処理等、"warning"(処理継続)時の使用を想定。`,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement: ['sv'],  // 実装の有無

    members: {list:[  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'responseTime',type:'number',desc:'処理終了日時',note:'',default:'Date.now()'},
      {name:'status',type:'string',desc:'終了状態',note:'"normal"or"fatal"or警告メッセージ(warning)',default:'"normal"'},
      {name:'response',type:'any|authError',desc:'処理結果',note:'@returns {void}ならundefined。fatal時はauthError',isOpt:true},
    ]},

    methods: {list:[{
      name: 'constructor',
      type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
      desc: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
      rev: 1, // {number} 0:未着手 1:完了 0<n<1:作成途中

      params: {list:[  // {Params} ■メソッド引数の定義■
        {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:'{}'},
      ]},

      process: `
        - メンバと引数両方にある項目は、引数の値をメンバとして設定
      `,	// {string} 処理手順。markdownで記載(trimIndent対象)

      returns: {list:[{type:'authResult'}]},
    }]},
  },
  authServerConfig: {
    desc: 'authServer専用の設定値',  // 端的なクラスの説明。ex.'authServer監査ログ'
    note: '[authConfig](authConfig.md)を継承した、authServerでのみ使用する設定値', // クラスとしての補足説明
    extends: 'authConfig', // 親クラス名
    implement: ['sv'],  // 実装の有無

    members: {list:[
      {name:'memberList',type:'string',desc:'memberListシート名',default:'memberList'},
      {name:'defaultAuthority',type:'number',desc:'新規加入メンバの権限の既定値',default:1},
      {name:'memberLifeTime',type:'number',desc:'加入有効期間',note:'メンバ加入承認後の有効期間。既定値は1年',default:31536000000},
      {name:'prohibitedToJoin',type:'number',desc:'加入禁止期間',note:'管理者による加入否認後、再加入申請が自動的に却下される期間。既定値は3日',default:259200000},
      {name:'loginLifeTime',type:'number',desc:'認証有効時間',note:'ログイン成功後の有効期間、CPkeyの有効期間。既定値は1日',default:86400000},
      {name:'loginFreeze',type:'number',desc:'認証凍結時間',note:'認証失敗後、再認証要求が禁止される期間。既定値は10分',default:600000},
      {name:'requestIdRetention',type:'number',desc:'重複リクエスト拒否となる時間',note:'既定値は5分',default:300000},
      {name:'errorLog',type:'string',desc:'エラーログのシート名',default:'errorLog'},
      {name:'storageDaysOfErrorLog',type:'number',desc:'監査ログの保存日数',note:'単位はミリ秒。既定値は7日分',default:604800000},
      {name:'auditLog',type:'string',desc:'監査ログのシート名',default:'auditLog'},
      {name:'storageDaysOfAuditLog',type:'number',desc:'監査ログの保存日数',note:'単位はミリ秒。既定値は7日分',default:604800000},

      {name:'func',type:'Object.<string,Object>',desc:'サーバ側の関数マップ',note:'例：{registerMember:{authority:0b001,do:m=>register(m)},approveMember:{authority:0b100,do:m=>approve(m)}}'},
      {name:'func.authority',type:'number',desc:'サーバ側関数の所要権限',note:'サーバ側関数毎に設定される当該関数実行のために必要となるユーザ権限。<br>' +
        '`authServerConfig.func.authority === 0 || (Member.profile.authority & authServerConfig.func.authority > 0)`なら実行可とする。',default:0},
      {name:'func.do',type:'Function',desc:'実行するサーバ側関数'},

      {name:'trial',type:'Object',desc:'ログイン試行関係の設定値'},
      {name:'trial.passcodeLength',type:'number',desc:'パスコードの桁数',default:6},
      {name:'trial.maxTrial',type:'number',desc:'パスコード入力の最大試行回数',default:3},
      {name:'trial.passcodeLifeTime',type:'number',desc:'パスコードの有効期間',note:'既定値は10分',default:600000},
      {name:'trial.generationMax',type:'number',desc:'ログイン試行履歴(MemberTrial)の最大保持数',note:'既定値は5世代',default:5},

      {name:'underDev.sendPasscode',type:'boolean',desc:'開発中識別フラグ',note:'パスコード通知メール送信を抑止するならtrue',default:'false'},
      {name:'underDev.sendInvitation',type:'boolean',desc:'開発中の加入承認通知メール送信',note:'開発中に加入承認通知メール送信を抑止するならtrue',default:'false'},
    ]},

    methods: {list:[{
      name: 'constructor',
      type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
      desc: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
      rev: 1,

      params: {list:[  // {Params} ■メソッド引数の定義■
        {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
      ]},

      process: `
        - メンバと引数両方にある項目は、引数の値をメンバとして設定
      `,	// {string} 処理手順。markdownで記載(trimIndent対象)

      returns: {list:[{type:'authServerConfig'}]},
    }]},
  },
  cryptoClient: {
    extends: '', // {string} 親クラス名
    desc: 'クライアント側の暗号化・復号処理', // {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``, // {string} ✂️補足説明。概要欄に記載
    summary: `
      ## 🔐 セキュリティ仕様

      ### 鍵種別と用途

      | 鍵名 | アルゴリズム | 用途 | 保存先 |
      | :-- | :-- | :-- | :-- |
      | CPkey-sign | RSA-PSS | 署名 | IndexedDB |
      | CPkey-enc | RSA-OAEP | 暗号化 | IndexedDB |

      ### 鍵生成時パラメータ

      \`\`\` js
      {
        name: "RSA-PSS",
        modulusLength: authConfig.RSAbits,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: "SHA-256",
        extractable: false,
        keyUsages: ["sign", "verify"]
      }
      \`\`\`

      暗号化鍵は'name:"RSA-OAEP"'、'keyUsages: ["encrypt", "decrypt"]'とする。

      ### 暗号・署名パラメータ

      | 区分 | アルゴリズム | ハッシュ | 鍵長 | 備考 |
      | :-- | :-- | :-- | :-- | :-- |
      | 署名 | RSA-PSS | SHA-256 | authConfig.RSAbits | 鍵用途:sign |
      | 暗号化 | RSA-OAEP | SHA-256 | authConfig.RSAbits | 鍵用途:encrypt |
    `,  // {string} ✂️概要(Markdown)。設計方針、想定する実装・使用例、等
    implement: ['cl'], // {string[]} 実装の有無(ex.['cl','sv'])
    template: ``, // {string} Markdown出力時のテンプレート

    members: {list:[
      {name:'CSkeySign',type:'CryptoKey',desc:'署名用秘密鍵',note:''},
      {name:'CPkeySign',type:'CryptoKey',desc:'署名用公開鍵',note:''},
      {name:'CSkeyEnc',type:'CryptoKey',desc:'暗号化用秘密鍵',note:''},
      {name:'CPkeyEnc',type:'CryptoKey',desc:'暗号化用公開鍵',note:''},
      {name:'SPkey',type:'string',desc:'サーバ側公開鍵',note:''},
    ]},

    methods: {list:[
      {
        name: 'constructor', // {string} 関数(メソッド)名
        type: 'private', // {string} 関数(メソッド)の分類
        desc: 'コンストラクタ', // {string} 端的な関数(メソッド)の説明
        note: ``, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          {name:'config',type:'authClientConfig',note:'authClientの動作設定変数'},
        ]},

        process: ``,

        returns: {list:[
          {type:'cryptoClient'}, // コンストラクタは自データ型名
        ]},
      },
      {
        name: 'decrypt', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: 'authServer->authClientのメッセージを復号＋署名検証', // {string} 端的な関数(メソッド)の説明
        note: ``, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          {name:'response',type:'encryptedResponse',desc:'暗号化された処理結果',note:''},
        ]},

        process: ``,

        returns: {list:[
          {type:'authResponse',desc:'復号された処理結果'},
        ]},
      },
      {
        name: 'encrypt', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: 'authClient->authServerのメッセージを暗号化＋署名', // {string} 端的な関数(メソッド)の説明
        note: ``, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          {name:'request',type:'authRequest',desc:'平文の処理要求',note:''},
        ]},

        process: ``,

        returns: {list:[
          {type:'encryptedRequest',desc:'暗号化された処理要求'}, // コンストラクタは自データ型名
        ]},
      },
      {
        name: 'generateKeys', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: '新たなクライアント側RSA鍵ペアを作成', // {string} 端的な関数(メソッド)の説明
        note: ``, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: ['createPassword'], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          //{name:'',type:'string',desc:'',note:''},
        ]},

        process: `
          - [createPassword](JSLib.md#createpassword)でパスワード生成
          - [cf.RSAbits](authConfig.md#authconfig_internal)を参照、新たな鍵ペア生成しメンバに保存
        `,

        returns: {list:[
          {type:'null', desc: '正常終了時',template:''},
          {type:'Error', desc: '異常終了時',note:'messageはシステムメッセージ',template:''},
        ]},
      },
    ]},
  },
  encryptedRequest: {
    desc: '暗号化された処理要求',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `authClientからauthServerに送られる、暗号化された処理要求オブジェクト。<br>
      ciphertextはauthRequestをJSON化、RSA-OAEP暗号化＋署名付与した文字列。<br>
      memberId,deviceIdは平文
      `,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement: ['cl','sv'],  // 実装の有無

    members: {list:[  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'memberId',type:'string',label:'メンバの識別子',note:'=メールアドレス'},
      {name:'deviceId',type:'string',label:'デバイスの識別子',note:''},
      {name:'ciphertext',type:'string',label:'暗号化した文字列',note:''},
    ]},

    methods: {list:[{
      name: 'constructor',
      type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
      desc: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
      rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

      params: {list:[  // {Params} ■メソッド引数の定義■
        {name:'request',type:'authRequest',note:'平文の処理要求'},
      ]},

      process: `
        - メンバと引数両方にある項目は、引数の値をメンバとして設定
      `,	// {string} 処理手順。markdownで記載(trimIndent対象)

      returns: {list:[{type:'encryptedRequest'}]},
    }]},
  },
  encryptedResponse: {
    desc: '暗号化された処理結果',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `authServerからauthClientに返される、暗号化された処理結果オブジェクト<br>
      ciphertextはauthResponseをJSON化、RSA-OAEP暗号化＋署名付与した文字列
      `,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement: ['cl','sv'],  // 実装の有無

    members: {list:[  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'ciphertext',type:'string',label:'暗号化した文字列',note:''},
    ]},

    methods: {list:[{
      name: 'constructor',
      type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
      desc: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
      rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

      params: {list:[  // {Params} ■メソッド引数の定義■
        {name:'response',type:'authResponse',note:'平文の処理結果'},
      ]},

      process: `
        - メンバと引数両方にある項目は、引数の値をメンバとして設定
      `,	// {string} 処理手順。markdownで記載(trimIndent対象)

      returns: {list:[{type:'encryptedRequest'}]},
    }]},
  },
  LocalRequest: {
    desc: 'ローカル関数からの処理要求',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `クライアント側関数からauthClientに渡す内容を確認、オブジェクト化する`,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement: ['cl'],  // 実装の有無

    members: {list:[  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'func',type:'string',desc:'サーバ側関数名',note:''},
      {name:'arguments',type:'any[]',desc:'サーバ側関数に渡す引数の配列',
        note:'プリミティブ値、及びプリミティブ値で構成された配列・オブジェクト',
        default:[]},
    ]},

    methods: {list:[{
      name: 'constructor',
      type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
      desc: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
      rev: 1, // {number} 0:未着手 1:完了 0<n<1:作成途中

      params: {list:[  // {Params} ■メソッド引数の定義■
        {name:'func',type:'string',desc:'サーバ側関数名',note:''},
        {name:'arguments',type:'any[]',desc:'サーバ側関数に渡す引数の配列',
          note:'引数が一つでも配列として指定',default:[]},
      ]},

      process: `
        - メンバと引数両方にある項目は、引数の値をメンバとして設定
        - "func"は関数名として使用可能な文字種であることを確認<br>
          \`^[A-Za-z_$][A-Za-z0-9_$]*$\`<br>
          上記正規表現にマッチしなければ戻り値「func不正」を返して終了
        - "arguments"は関数を排除するため、一度JSON化してからオブジェクト化<br>
          \`JSON.parse(JSON.stringify(arguments))\`
      `,	// {string} 処理手順。markdownで記載(trimIndent対象)
      // - テスト：[▼監査ログ](authAuditLog.md#authauditlog_constructor)インスタンス生成

      returns: {list:[
        {type:'LocalRequest',desc:'正常時の戻り値'},
        {type:'',desc:'エラー時の戻り値',template:`%% this.cfTable({type:'authError',patterns:{'func不正':{message:'"invalid func"'}}},{indent:2,header:{name:'項目名',type:'データ型',default:'要否/既定値',desc:'説明'}}) %%`},
      ]},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
    }]},
  },
}}));