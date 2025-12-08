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
      {name:'idb',type:'static',desc:'IndexedDBの内容をauthClient内で共有',note:''},
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
  authConfig: {
    desc: 'authClient/authServer共通設定値',
    note: '[authClientConfig](authClientConfig.md), [authServerConfig](authServerConfig.md)の親クラス',
    implement: ['cl','sv'],  // 実装の有無

    members:{list:[
      {name:'systemName',type:'string',desc:'システム名',default:'Auth'},
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
  authErrorLog: {
    desc: 'authServerのエラーログ',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
      - 各メソッドの冒頭でインスタンス化、処理開始時刻等を記録
      - 出力時にlogメソッドを呼び出して処理時間を計算、シート出力
    `,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement: ['sv'],  // 実装の有無

    members: {list:[  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'timestamp',type:'string',desc:'要求日時',note:'ISO8601拡張形式の文字列',default:'Date.now()'},
      {name:'memberId',type:'string',desc:'メンバの識別子',note:'=メールアドレス'},
      {name:'deviceId',type:'string',desc:'デバイスの識別子',note:''},
      {name:'result',type:'string',desc:'サーバ側処理結果',note:'fatal/warning/normal',default:'fatal'},
      {name:'message',type:'string',desc:'サーバ側からのエラーメッセージ',note:'normal時は`undefined`',isOpt:true},
      {name:'stack',type:'string',desc:'エラー発生時のスタックトレース',note:'本項目は管理者への通知メール等、シート以外には出力不可',isOpt:true},
    ]},

    methods: {list:[
      {
        name: 'constructor',
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        desc: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

        params: {list:[  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:'{}'},
        ]},

        process: `
          - メンバと引数両方にある項目は、引数の値をメンバとして設定
          - authServerConfig.[errorLog](authServerConfig.md#authserverconfig_members)シートが無ければ作成
          - timestampに現在日時を設定
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {list:[{type:'authErrorLog'}]},
      },
      {
        name: 'log', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: 'エラーログシートにエラー情報を追記', // {string} 端的な関数(メソッド)の説明
        note: ``, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          {name:'e',type:'Error',note:'エラーオブジェクト'},
          {name:'response',type:'authResponse',note:'処理結果'},
          //{name:'arg',type:'Object',note:'ユーザ指定の設定値',default:'{}'},
          //{name:'',type:'string',desc:'',note:''},
        ]},

        process: `
          - メンバに以下を設定
            %% this.cfTable({
              type:'authErrorLog',
              patterns:{
                '設定内容':{
                  timestamp: 'toLocale(this.timestamp)(ISO8601拡張形式)',
                  memberId: 'response.request.memberId',
                  deviceId: 'response.request.deviceId',
                  result: 'response.result',
                  message: 'response.message',
                  stack: 'e.stack',
                }
              }
            },{
              indent:2,
              header:{name:'項目名',type:'データ型',default:'要否/既定値',desc:'説明'}
            }) %%
        `,

        returns: {list:[
          {type:'authErrorLog',desc:'シートに出力したauthErrorLogオブジェクト',template:''},
        ]},
      },
    ]},
  },
  authIndexedDB: {
    extends: '', // {string} 親クラス名
    desc: 'クライアントのIndexedDB', // {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `IndexedDBの作成・入出力は[authClient](authClient.md)で行うため、ここでは格納する値の定義にとどめる。`, // {string} ✂️補足説明。概要欄に記載
    summary: ``,  // {string} ✂️概要(Markdown)。設計方針、想定する実装・使用例、等
    implement: ['cl'], // {string[]} 実装の有無(ex.['cl','sv'])
    template: ``, // {string} Markdown出力時のテンプレート

    members: {list:[
      {name:'memberId',type:'string',desc:'メンバの識別子',note:'メールアドレス。仮登録時はUUID'},
      {name:'memberName',type:'string',desc:'メンバ(ユーザ)の氏名',note:'例："田中　太郎"。加入要求確認時に管理者が申請者を識別する他で使用。'},
      {name:'deviceId',type:'string',desc:'デバイスの識別子',note:'',default:'UUID'},
      {name:'keyGeneratedDateTime',type:'number',desc:`鍵ペア生成日時`,
        note: 'サーバ側でCPkey更新中にクライアント側で新たなCPkeyが生成されるのを避けるため、鍵ペア生成は30分以上の間隔を置く'
      ,default:'Date.now()'},
      {name:'SPkey',type:'string',desc:'サーバ公開鍵',note:'Base64',default:null},
      //{name:'ApplicationForMembership',type:'number',desc:'加入申請実行日時。未申請時は0',note:'',default:0},
      //{name:'expireAccount',type:'number',desc:'加入承認の有効期間が切れる日時。未加入時は0',note:'',default:0},
      {name:'expireCPkey',type:'number',desc:'CPkeyの有効期限(無効になる日時)',note:'未ログイン時は0',default:0},
    ]},

    methods: {list:[
      {
        name: 'constructor', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: 'private', // {string} 端的な関数(メソッド)の説明
        note: `コンストラクタ`, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          {name:'config',type:'authClientConfig',note:'設定情報'},
        ]},

        process: `
          - IndexedDBに[authClientConfig](authClientConfig.md#authclientconfig_internal).systemNameを持つキーがあれば取得、メンバ変数に格納。
          - 無ければ新規に生成し、IndexedDBに格納。
          - 引数の内、authIndexedDBと同一メンバ名があればthisに設定
          - 引数にnoteがあればthis.noteに設定
          - timestampに現在日時を設定
        `,

        returns: {list:[
          {type:'authIndexedDB'}, // コンストラクタは自データ型名
        ]},
      },
    ]},
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
      {name:'memberName',type:'string',desc:'メンバの氏名',note:'管理者が加入認否判断のため使用',default:'idb.memberName'},
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
  authRequestLog: {
    extends: '', // {string} 親クラス名
    desc: '重複チェック用のリクエスト履歴', // {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
      - ScriptPropertiesに保存
    `, // {string} ✂️補足説明。概要欄に記載
    summary: ``,  // {string} ✂️概要(Markdown)。設計方針、想定する実装・使用例、等
    implement: ['sv'], // {string[]} 実装の有無(ex.['cl','sv'])
    template: ``, // {string} Markdown出力時のテンプレート

    members: {list:[
      {name:'timestamp',type:'number',desc:'リクエストを受けたサーバ側日時',note:'',default:'Date.now()'},
      {name:'requestId',type:'string',desc:'クライアント側で採番されたリクエスト識別子',note:'UUID'},
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
          {name:'arg',type:'Object',desc:'ユーザ指定の設定値',default:{}},
        ]},

        process: ``,

        returns: {list:[
          {type:'authRequestLog'}, // コンストラクタは自データ型名
        ]},
      },
    ]},
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
      {name:'response',type:'any|dtError',desc:'処理結果',note:'@returns {void}ならundefined。fatal時はauthError',isOpt:true},
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
  authScriptProperties: {
    extends: '', // {string} 親クラス名
    desc: 'サーバ側のScriptProperties', // {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `キー名は[authConfig.system.name](authConfig.md#authconfig_members)(既定値"auth")を使用`, // {string} ✂️補足説明。概要欄に記載
    summary: ``,  // {string} ✂️概要(Markdown)。設計方針、想定する実装・使用例、等
    implement: ['sv'], // {string[]} 実装の有無(ex.['cl','sv'])
    template: ``, // {string} Markdown出力時のテンプレート

    members: {list:[
      {name:'keyGeneratedDateTime',type:'number',desc:'UNIX時刻',note:''},
      {name:'SPkey',type:'string',desc:'PEM形式の公開鍵文字列',note:''},
      {name:'SSkey',type:'string',desc:'PEM形式の秘密鍵文字列(暗号化済み)',note:''},
      {name:'oldSPkey',type:'string',desc:'cryptoServer.reset実行前にバックアップした公開鍵',note:''},
      {name:'oldSSkey',type:'string',desc:'cryptoServer.reset実行前にバックアップした秘密鍵',note:''},
      {name:'requestLog',type:'authRequestLog[]',desc:'重複チェック用のリクエスト履歴',note:'',default:'[]'},
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
          {name:'arg',type:'Object',desc:'ユーザ指定の設定値',default:'{}'},
        ]},

        process: `
          - 鍵ペア未作成なら[createPassword](JSLib.md#createpassword)を使用して作成
        `,

        returns: {list:[
          {type:'authScriptProperties'}, // コンストラクタは自データ型名
        ]},
      },
      {
        name: 'checkDuplicate', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: 'クライアントからの重複リクエストチェック', // {string} 端的な関数(メソッド)の説明
        note: ``, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          {name:'requestId',type:'string',desc:'処理要求識別子(UUID)',note:''},
        ]},

        process: ``,

        returns: {list:[
          {type:'null', desc:'正常終了時',template:''},
          {type:'Error', desc:'異常終了時',note:'messageはシステムメッセージ',template:''},
        ]},
      },
      {
        name: 'deleteProp', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: 'ScriptPropertiesを消去', // {string} 端的な関数(メソッド)の説明
        note: `
          - キー名[authConfig.system.name](authConfig.md#authconfig_members)を削除
        `, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          //{name:'',type:'string',desc:'',note:''},
        ]},

        process: ``,

        returns: {list:[
          {type:'null', desc:'正常終了時',template:''},
          {type:'Error', desc:'異常終了時',note:'messageはシステムメッセージ',template:''},
        ]},
      },
      {
        name: 'getProp', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: 'ScriptPropertiesをインスタンス変数に格納', // {string} 端的な関数(メソッド)の説明
        note: ``, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          //{name:'',type:'string',desc:'',note:''},
        ]},

        process: ``,

        returns: {list:[
          {type:'null', desc:'正常終了時',template:''},
          {type:'Error', desc:'異常終了時',note:'messageはシステムメッセージ',template:''},
        ]},
      },
      {
        name: 'resetSPkey', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: 'SPkeyを更新、ScriptPropertiesに保存', // {string} 端的な関数(メソッド)の説明
        note: `- 緊急対応時のみ使用を想定`, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          //{name:'',type:'string',desc:'',note:''},
        ]},

        process: `
        `,

        returns: {list:[
          {type:'null', desc:'正常終了時',template:''},
          {type:'Error', desc:'異常終了時',note:'messageはシステムメッセージ',template:''},
        ]},
      },
      {
        name: 'setProp', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: 'インスタンス変数をScriptPropertiesに格納', // {string} 端的な関数(メソッド)の説明
        note: ``, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          //{name:'',type:'string',desc:'',note:''},
        ]},

        process: ``,

        returns: {list:[
          {type:'null', desc:'正常終了時',template:''},
          {type:'Error', desc:'異常終了時',note:'messageはシステムメッセージ',template:''},
        ]},
      },
    ]},
  },
  authServer: {
    extends: '', // {string} 親クラス名
    desc: 'サーバ側auth中核クラス', // {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
      authServerは、クライアント(authClient)からの暗号化通信リクエストを復号・検証し、
      メンバ状態と要求内容に応じてサーバ側処理を適切に振り分ける中核関数です。
    `, // {string} ✂️補足説明。概要欄に記載
    summary: `
      - staticメソッドを利用するため、クラスとする
      - doPostからはauthServer.execを呼び出す

      #### <a name="outputLog">🗒️ ログ出力仕様</a>

      | 種別 | 保存先 | 内容 |
      | :-- | :-- | :-- |
      | requestLog | ScriptProperties (TTL短期) | [authRequestLog](typedef.md#authrequestlog)記載項目 |
      | errorLog | Spreadsheet(authServerConfig.errorLog) | [authErrorLog](typedef.md#autherrorlog)記載項目 |
      | auditLog | Spreadsheet(authServerConfig.auditLog) | [authAuditLog](typedef.md#authauditlog)記載項目 |

      ■ ログ出力のタイミング

      | ログ種別 | タイミング | 理由 |
      | :-- | :-- | :-- |
      | **auditLog** | authServer各メソッド完了時 | イベントとして記録。finallyまたはreturn前に出力 |
      | **errorLog** | authServer各メソッドからの戻り値がfatal、または予期せぬエラー発生時 | 原因箇所特定用。catch句内に記載 |
    `,  // {string} ✂️概要(Markdown)。設計方針、想定する実装・使用例、等
    implement: ['sv'], // {string[]} 実装の有無(ex.['cl','sv'])
    template: ``, // {string} Markdown出力時のテンプレート

    members: {list:[
      {name:'cf',type:'authServerConfig',desc:'動作設定変数(config)',note:'',default:'null'},
      {name:'prop',type:'authScriptProperties',desc:'鍵ペア等を格納',note:'',default:'null'},
      {name:'crypto',type:'cryptoServer',desc:'暗号化・復号用インスタンス',note:'',default:'null'},
      {name:'member',type:'Member',desc:'対象メンバのインスタンス',note:'',default:'null'},
      {name:'audit',type:'authAuditLog',desc:'監査ログのインスタンス',note:'',default:'null'},
      {name:'error',type:'authErrorLog',desc:'エラーログのインスタンス',note:'',default:'null'},
      {name:'pv',type:'Object',desc:'authServer内共通変数',note:'',default:'{}'},
    ]},

    methods: {list:[  // 残課題：未定義。Member関係クラス作成後に対応
      {
        name: 'constructor', // {string} 関数(メソッド)名
        type: 'private', // {string} 関数(メソッド)の分類
        desc: '', // {string} 端的な関数(メソッド)の説明
        note: ``, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          //{name:'',type:'string',desc:'',note:''},
        ]},

        process: ``,

        returns: {list:[
          {type:'authServer'}, // コンストラクタは自データ型名
        ]},
      },
    ]},
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
        '`authServerConfig.func.authority === 0 || (Member.profile.authority & authServerConfig.func.authority > 0)`なら実行可とする。',default:'0'},
      {name:'func.do',type:'Function',desc:'実行するサーバ側関数'},

      {name:'trial',type:'Object',desc:'ログイン試行関係の設定値',default:'{}'},
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
        {name:'arg',type:'Object',desc:'ユーザ指定の設定値',default:{}},
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
  cryptoServer: {
    extends: '', // {string} 親クラス名
    desc: 'サーバ側の暗号化・復号処理', // {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
      - 認証サーバ ([authServer](authServer.md)) から独立した復号・署名検証処理モジュール。
      - クライアント側仕様書([cryptoClient](../cl/cryptoClient.md))と対になる設計であり、署名・暗号化・鍵管理を統一方針で運用する。
      - 暗号化ライブラリは"jsrsasign"を使用
      - 以下"cf","prop","crypto","member","audit","error","pv"は[authServer](authServer.md#authserver_members)内共通のインスタンス変数
    `, // {string} ✂️補足説明。概要欄に記載
    summary: `
      #### <a name="security">🔐 セキュリティ仕様</a>

      - 署名→暗号化(Sign-then-Encrypt)方式に準拠
      - 鍵ペアは[ScriptProperties](authScriptProperties.md)に保存("SSkey", "SPkey")
      - ScriptPropertiesのキー名は"[authServerConfig](authServerConfig.md#authserverconfig_internal).system.name"に基づく
      - 復号処理は副作用のない純関数構造を目指す(stateを持たない)
      - 可能な範囲で「外部ライブラリ」を使用する
      - timestamp検証は整数化・絶対値化してから比較する

      | 項目 | 対策 |
      |------|------|
      | **リプレイ攻撃** | requestIdキャッシュ(TTL付き)で検出・拒否 |
      | **タイミング攻撃** | 定数時間比較(署名・ハッシュ照合)を採用 |
      | **ログ漏えい防止** | 復号データは一切記録しない |
      | **エラー通知スパム** | メンバ単位で送信間隔を制御 |
      | **鍵管理** | SSkey/SPkey は ScriptProperties に格納し、Apps Script内でのみ参照可 |
    `,  // {string} ✂️概要(Markdown)。設計方針、想定する実装・使用例、等
    implement: ['sv'], // {string[]} 実装の有無(ex.['cl','sv'])
    template: ``, // {string} Markdown出力時のテンプレート

    members: {list:[
      //{name:'',type:'string',desc:'',note:''},
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
          {name:'config',type:'authServerConfig',note:'authServerの動作設定変数'},
        ]},

        process: `
        `,

        returns: {list:[
          {type:'cryptoServer'}, // コンストラクタは自データ型名
        ]},
      },
      {
        name: 'decrypt', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: 'authClientからのメッセージを復号＋署名検証', // {string} 端的な関数(メソッド)の説明
        note: `
          - 本メソッドはauthServerから呼ばれるため、fatalエラーでも戻り値を返す
          - fatal/warning分岐を軽量化するため、Signature検証統一関数を導入(以下は実装例)
            \`\`\`js
            const verifySignature = (data, signature, pubkey) => {
              try {
                const sig = new KJUR.crypto.Signature({ alg: 'SHA256withRSA' });
                sig.init(pubkey);
                sig.updateString(data);
                return sig.verify(signature);
              } catch (e) { return false; }
            }
            \`\`\`
        `, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          {name:'request',type:'string|encryptedRequest',note:'クライアント側からの暗号化された処理要求'},
        ]},

        process: `
          1. 入力データ型判定：引数(JSON文字列)のオブジェクト化を試行
             - オブジェクト化成功の場合：次ステップへ
             - オブジェクト化失敗の場合：requestがCPkey文字列として適切か判断
               - 不適切なら戻り値「不正文字列」を返して終了
               - 適切なら戻り値「CPkey」を返して終了
          2. CPkeyをシートから取得
             - memberId, deviceId, cipherText に欠落があれば戻り値「指定項目不足」を返して終了
             - memberIdから対象者のMemberインスタンスを取得、シートに無かった場合は戻り値「対象者不在」を返して終了<br>
               "member = member.[getMember](Member.md#member_getmember)(memberId)"
             - deviceIdから対象機器のCPkeyを取得。未登録なら戻り値「機器未登録」を返して終了
          3. 復号
             - 復号失敗なら戻り値「復号失敗」を返して終了
          4. 署名検証
             - 以下が全部一致しなかったなら戻り値「不正署名」を返して終了
               - 復号により現れた署名
               - [decryptedRequest](decryptedRequest.md#decryptedrequest_internal).[request](authRequest.md#authrequest_internal).signature
               - member.[device](MemberDevice.md#memberdevice_internal)\[n\].CPkey<br>
                ※ "n"はdeviceIdから特定
          5. 時差判定
             - 復号・署名検証直後に timestamp と Date.now() の差を算出し、
               [authServerConfig](authServerConfig.md#authserverconfig_internal).allowableTimeDifference を超過した場合、戻り値「時差超過」を返して終了
          6. 戻り値「正常終了」を返して終了
             - "request"には復号した[encryptedRequest](encryptedRequest.md#encryptedrequest_internal).ciphertext(=JSON化したauthRequest)をオブジェクト化してセット
             - "status"にはdeviceId[n].statusを、deviceIdが見つからない場合はmember.statusをセット
        `,

        returns: {list:[
          {
            type: 'authResponse',  // 自クラスの場合、省略
            desc: '', // {string} 本データ型に関する説明。「正常終了時」等
            default: {},  // {Object.<string,string>} 全パターンの共通設定値
            patterns: { // 特定パターンへの設定値。patterns:{'パターン名':{項目名:値}}形式,
              '不正文字列': {status: 'dev.error("invalid string")'},
              'CPkey': {status:'"CPkey"'},
              '対象者不在': {status: 'dev.error("not exists")'},
              '機器未登録': {status: 'dev.error("device not registered")'},
              '復号失敗': {status: 'dev.error("decrypt failed")'},
              '指定項目不足': {status: 'dev.error("missing fields")'},
              '不正署名': {status: 'dev.error("invalid signature")'},
              '時差超過': {status: 'dev.error("timestamp difference too large")'},
              '正常終了': {status: '[member.device\[n\]](MemberDevice.md#memberdevice_internal).status or [member](Member.md#member_internal).status'},
            },
          },
        ]},
      },
      {
        name: 'encrypt', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: 'authClientへのメッセージを署名＋暗号化', // {string} 端的な関数(メソッド)の説明
        note: `
          - [authResponse](authResponse.md#authresponse_internal).signatureは省略せず明示的に含める
          - 暗号化順序は Sign-then-Encrypt
          - 復号側([cryptoClient](../cl/cryptoClient.md))では「Decrypt-then-Verify」
          - 本メソッドはauthServerから呼ばれるため、fatalエラーでも戻り値を返す
        `, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          {name:'response',type:'authResponse',note:'暗号化対象オブジェクト'},
        ]},

        process: `
        `,

        returns: {list:[
          {type:'encryptedResponse'}, // コンストラクタは自データ型名
        ]},
      },
      {
        name: 'generateKeys', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: '新たなサーバ側鍵ペアを作成', // {string} 端的な関数(メソッド)の説明
        note: ``, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          //{name:'arg',type:'Object',note:'ユーザ指定の設定値',default:'{}'},
          //{name:'',type:'string',desc:'',note:''},
        ]},

        process: `
        `,

        returns: {list:[
          {type:'null', desc:'正常終了時',template:''},
          {type:'Error', desc:'異常終了時',note:'messageはシステムメッセージ',template:''},
        ]},
      },
    ]},
  },
  dtError: {
    extends: 'Error', // {string} 親クラス名
    desc: '標準Errorの独自拡張', // {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
      - [devTools](JSLib.md#devtools)内で定義
      - \`devTools.error()\`でインスタンス作成
    `, // {string} ✂️補足説明。概要欄に記載
    summary: ``,  // {string} ✂️概要(Markdown)。設計方針、想定する実装・使用例、等
    implement: ['cl','sv'], // {string[]} 実装の有無(ex.['cl','sv'])
    template: ``, // {string} Markdown出力時のテンプレート

    members: {list:[
      {name:'caller',type:'string',desc:'呼出元関数の足跡リスト',note:''},
      {name:'whois',type:'string',desc:'関数名またはクラス名.メソッド名',note:''},
      {name:'step',type:'string',desc:'関数内の位置(step)',note:''},
      {name:'seq',type:'number',desc:'実行順序',note:''},
      {name:'arg',type:'string',desc:'引数',note:''},
      {name:'rv',type:'string',desc:'戻り値',note:''},
      {name:'start',type:'string',desc:'開始日時',note:''},
      {name:'end',type:'string',desc:'終了日時',note:''},
      {name:'elaps',type:'number',desc:'所要時間(ミリ秒)',note:''},
      {name:'log',type:'string',desc:'実行順に並べたdev.step',note:''},
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
          {name:'e',type:'Error',note:'エラーオブジェクト'},
          {name:'v',type:'Object',note:'関数・メソッド内汎用変数',default:'{}'},
        ]},

        process: `
          - メンバと引数両方にある項目は、引数の値をメンバとして設定
          - variableはv.whois,v.stepを削除した上で、JSON化時150文字以上になる場合、以下のように処理
            - 配列は"{length:v.xxx.length,sample:v.xxx.slice(0,3)}"に変換
        `,

        returns: {list:[
          {type:'dtError'}, // コンストラクタは自データ型名
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
      {name:'memberId',type:'string',desc:'メンバの識別子',note:'=メールアドレス'},
      {name:'deviceId',type:'string',desc:'デバイスの識別子',note:''},
      {name:'ciphertext',type:'string',desc:'暗号化した文字列',note:''},
    ]},

    methods: {list:[{
      name: 'constructor',
      type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
      desc: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
      rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

      params: {list:[  // {Params} ■メソッド引数の定義■
        {name:'request',type:'authRequest',desc:'平文の処理要求'},
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
      {name:'ciphertext',type:'string',desc:'暗号化した文字列',note:''},
    ]},

    methods: {list:[{
      name: 'constructor',
      type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
      desc: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
      rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

      params: {list:[  // {Params} ■メソッド引数の定義■
        {name:'response',type:'authResponse',desc:'平文の処理結果'},
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
        {type:'',desc:'エラー時の戻り値',template:`%% this.cfTable({type:'dtError',patterns:{'func不正':{message:'"invalid func"'}}},{indent:2,header:{name:'項目名',type:'データ型',default:'要否/既定値',desc:'説明'}}) %%`},
      ]},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
    }]},
  },
  LocalResponse: {
    desc: 'ローカル関数への処理結果',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `authClientからクライアント側関数に返される処理結果オブジェクト`,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement: ['cl'],  // 実装の有無

    members: {list:[  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'result',type:'string',desc:'処理結果。fatal/warning/normal',note:''},
      {name:'message',type:'string',desc:'エラーメッセージ',note:'normal時は`undefined`',isOpt:true},
      {name:'response',type:'any',desc:'要求された関数の戻り値',note:'fatal/warning時は`undefined`。`JSON.parse(authResponse.response)`',isOpt:true},
    ]},

    methods: {list:[{
      name: 'constructor',
      type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
      desc: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
      rev: 1, // {number} 0:未着手 1:完了 0<n<1:作成途中

      params: {list:[  // {Params} ■メソッド引数の定義■
        {name:'response',type:'authResponse|Error',desc:'サーバ側処理結果',note:'ErrorはauthClient.[exec](authClient.md#authclient_exec)で設定'},
      ]},

      process: `
        - メンバと引数両方にある項目は、引数の値をメンバとして設定
      `,	// {string} 処理手順。markdownで記載(trimIndent対象)
      // - テスト：[▼監査ログ](authAuditLog.md#authauditlog_constructor)インスタンス生成

      returns: {list:[
        {type:'LocalResponse',desc:'正常時の戻り値'},
        {type:'Error',desc:'正常時の戻り値',note:'messageはauthClientで設定'},
      ]},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
    }]},
  },
  Member: {
    extends: '', // {string} 親クラス名
    desc: 'メンバ情報をGoogle Spread上で管理', // {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
      - 'Member'はGoogle SpreadSheet上でメンバ(アカウント)情報・状態を一元的に管理するためのクラスです。
      - 加入・ログイン・パスコード試行・デバイス別公開鍵(CPkey)管理などの状態を統一的に扱います。
      - マルチデバイス利用を前提とし、memberListスプレッドシートの1行を1メンバとして管理します。
    `, // {string} ✂️補足説明。概要欄に記載
    summary: `
      - 参考：auth総説 [メンバの状態遷移](../specification.md#member)
    `,  // {string} ✂️概要(Markdown)。設計方針、想定する実装・使用例、等
    implement: ['sv'], // {string[]} 実装の有無(ex.['cl','sv'])
    template: ``, // {string} Markdown出力時のテンプレート

    members: {list:[
      {name:'memberId',type:'string',desc:'メンバの識別子',note:'メールアドレス',default:'UUID'},
      {name:'name',type:'string',desc:'メンバの氏名',note:'',default:'"dummy"'},
      {name:'status',type:'string',desc:'メンバの状態',note:'未加入,未審査,審査済,加入中,加入禁止',default:'"未加入"'},
      {name:'log',type:'MemberLog',desc:'メンバの履歴情報',note:'シート上はJSON文字列',default:'new MemberLog()'},
      {name:'profile',type:'MemberProfile',desc:'メンバの属性情報',note:'シート上はJSON文字列',default:'new MemberProfile()'},
      {name:'device',type:'[MemberDevice](MemberDevice.md#memberdevice_internal)[]',desc:'デバイス情報',note:'マルチデバイス対応のため配列。シート上はJSON文字列',default:'空配列'},
      {name:'note',type:'string',desc:'当該メンバに対する備考',note:'',default:'空文字列'},
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
          {name:'config',type:'authServerConfig',desc:'ユーザ指定の設定値'},
        ]},

        process: `
          - [memberList](authServerConfig.md#authserverconfig_members)シートが存在しなければシートを新規作成
            - シート上の項目名はMemberクラスのメンバ名
            - 各項目の「説明」を項目名セルのメモとしてセット
          - this.log = new [MemberLog()](MemberLog.md#memberlog_constructor)
          - this.profile = new [MemberProfile()](MemberProfile.md#memberprofile_constructor)
        `,

        returns: {list:[
          {type:'Member'}, // コンストラクタは自データ型名
        ]},
      },
      {
        name: 'addTrial', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: '新しい試行を登録し、メンバにパスコード通知メールを発信', // {string} 端的な関数(メソッド)の説明
        note: ``, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          {name:'request',type:'authRequest',desc:'処理要求'},
        ]},

        process: `
          - 状態チェック
            - request.memberIdを基に[getMemberメソッド](#member_getmember)でMemberインスタンスを取得
            - request.deviceIdで指定されたデバイスの状態が「未認証」でなければ戻り値「不適格」を返して終了
          - 新しい試行を生成、Member.trialの先頭に追加<br>
            ("Member.trial.unshift(new [MemberTrial](MemberTrial.md#membertrial_internal)())")
          - MemberLog.loginRequestに現在日時(UNIX時刻)を設定
          - ログイン試行履歴の最大保持数を超えた場合、古い世代を削除<br>
            (Member.trial.length >= [authServerConfig](authServerConfig.md#authserverconfig_internal).generationMax)
          - 更新後のMemberを引数に[setMember](#member_setmember)を呼び出し、memberListシートを更新
          - メンバに[sendmail](JSLib.md#sendmail)でパスコード通知メールを発信<br>
            但し[authServerConfig](authServerConfig.md#authserverconfig_internal).underDev.sendPasscode === falseなら発信を抑止(∵開発中)
          - 戻り値「正常終了」を返して終了
        `,

        returns: {list:[
          { // 対比表形式
            type: 'authResponse',  // 自クラスの場合、省略
            desc: '', // {string} 本データ型に関する説明。「正常終了時」等
            default: {},  // {Object.<string,string>} 全パターンの共通設定値
            patterns: {
              '不適格': {
                status:'dev.error("invalid status")',
                response: 'Member(更新前)',
              },
              '正常終了': {
                status:'"success"',
                response: 'Member(更新後)',
              },
            },
          },
        ]},
      },
      {
        name: 'checkPasscode', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: '認証時のパスコードチェック', // {string} 端的な関数(メソッド)の説明
        note: `入力されたパスコードをチェック、Member内部の各種メンバの値を更新`, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          {name:'request',type:'authRequest',desc:'処理要求オブジェクト'},
        ]},

        process: `
          - 引数チェック。"func"が指定以外、またはパスコードの形式不正の場合、戻り値「不正形式」を返して終了
            %% this.cfTable({type:'authRequest',patterns:{'確認内容':{
              func: '"::passcode::"',
              arguments: '入力されたパスコード'
            }}},{
              indent:2,
              header:{name:'項目名',type:'データ型',default:'要否/既定値',desc:'説明'}
            }) %%
          - デバイス状態チェック
            - request.memberIdを基に[getMemberメソッド](#member_getmember)でMemberインスタンスを取得
            - request.deviceIdで対象デバイスを特定、「試行中」以外は戻り値「非試行中」を返して終了
          - パスコードをチェック、結果を先頭に追加(Member.trial.unshift(new [MemberTrialLog](MemberTrialLog.md#membertriallog_constructor)()))
          - パスコードチェック
            - パスコードが一致 ⇒ 「一致時」をセット
            - パスコードが不一致
              - 試行回数が上限未満(\`MemberTrial.log.length < [authServerConfig](authServerConfig.md#authserverconfig_internal).trial.maxTrial\`)<br>
                ⇒ 変更すべき項目無し
              - 試行回数が上限以上(\`MemberTrial.log.length >= [authServerConfig](authServerConfig.md#authserverconfig_internal).trial.maxTrial\`)<br>
                ⇒ 「凍結時」をセット
            - 設定項目と値は以下の通り。
              %% this.cfTable({type:'authRequest',patterns:{
                '一致時':{
                  loginSuccess: '現在日時(UNIX時刻)',
                  loginExpiration: '現在日時＋[loginLifeTime](authServerConfig.md#authserverconfig_internal)'
                },
                '上限到達':{
                  loginFailure: '現在日時(UNIX時刻)',
                  unfreezeLogin: '現在日時＋[loginFreeze](authServerConfig.md#authserverconfig_internal)'
                }
              }},{
                indent:4,
                header:{name:'項目名',type:'データ型',default:'要否/既定値',desc:'説明'}
              }) %%
          - 更新後のMemberを引数に[setMemberメソッド](#member_setmember)を呼び出し、memberListシートを更新<br>
            ※ setMember内でjudgeStatusメソッドを呼び出しているので、状態の最新化は担保
          - 戻り値「正常終了」を返して終了(後続処理は戻り値(authResponse.message)で分岐先処理を判断)
        `,

        returns: {list:[
          { // 対比表形式
            type: 'authResponse',  // 自クラスの場合、省略
            desc: '', // {string} 本データ型に関する説明。「正常終了時」等
            default: {request:'request'},  // {Object.<string,string>} 全パターンの共通設定値
            patterns: { // 特定パターンへの設定値。patterns:{'パターン名':{項目名:値}}形式,
              '不正形式':{status: 'dev.error("invalid request")'},
              '非試行中':{status: 'dev.error("invalid status")'},
              '正常終了':{
                status: '"success"',
                response: '更新後のMember',
              },
            },
          },
        ]},
      },
      {
        name: 'getMember', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: '指定メンバの情報をmemberListシートから取得', // {string} 端的な関数(メソッド)の説明
        note: ``, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          {name:'memberId',type:'string',desc:'ユーザ識別子(メールアドレス)'},
        ]},

        process: `
          - JSON文字列の項目はオブジェクト化(Member.log, Member.profile, Member.device)
          - memberIdがmemberListシート登録済なら「登録済」、未登録なら「未登録」パターンを返す
        `,

        returns: {list:[
          { // 対比表形式
            type: 'authResponse',  // 自クラスの場合、省略
            desc: '', // {string} 本データ型に関する説明。「正常終了時」等
            default: {request:`{memberId:引数のmemberId}`},
            patterns: { // 特定パターンへの設定値。patterns:{'パターン名':{項目名:値}}形式,
              '登録済': {
                status: '"success"',
                response: `Member(シート)`,
              },
              '未登録': {
                status: 'dev.error("not exists")',
              }
            },
          },
        ]},
      },
      {
        name: 'judgeMember', // {string} 関数(メソッド)名
        type: 'static', // {string} 関数(メソッド)の分類
        desc: '加入審査画面から審査結果入力＋結果通知', // {string} 端的な関数(メソッド)の説明
        note: `
          加入審査画面を呼び出し、管理者が記入した結果をmemberListに登録、審査結果をメンバに通知する。<br>memberListシートのGoogle Spreadのメニューから管理者が実行することを想定。
        `, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          {name:'memberId',type:'string',desc:'メンバ識別子'},
        ]},

        process: `
          - [getMemberメソッド](#member_getmember)で当該メンバのMemberを取得
          - memberListシート上に存在しないなら、戻り値「不存在」を返して終了
          - 状態が「未審査」ではないなら、戻り値「対象外」を返して終了
          - シート上にmemberId・氏名と「承認」「否認」「取消」ボタンを備えたダイアログ表示
          - 取消が選択されたら戻り値「キャンセル」を返して終了
          - MemberLogの以下項目を更新
            %% this.cfTable({
              type:'MemberLog',
              patterns:{
                '承認時':{
                  approval: '現在日時(Date.now())',
                  denial: 0,
                  joiningExpiration: '現在日時＋[memberLifeTime](authServerConfig.md#authserverconfig_members)',
                  unfreezeDenial: 0,
                },
                '否認時':{
                  approval: 0,
                  denial: '現在日時',
                  joiningExpiration: 0,
                  unfreezeDenial: '現在日時＋[prohibitedToJoin](authServerConfig.md#authserverconfig_members)',
                },
              }
            },{
              indent:2,
              header:{name:'項目名',type:'データ型',default:'要否/既定値',desc:'説明'}
            }) %%
          - [setMemberメソッド](#member_setmember)にMemberを渡してmemberListを更新
          - 戻り値「正常終了」を返して終了
        `,

        returns: {list:[
          { // 対比表形式
            type: 'authResponse',  // 自クラスの場合、省略
            desc: '', // {string} 本データ型に関する説明。「正常終了時」等
            default: {request:'memberId'},  // {Object.<string,string>} 全パターンの共通設定値
            patterns: { // 特定パターンへの設定値。patterns:{'パターン名':{項目名:値}}形式,
              '不存在': {status:'dev.error("not exists")'},
              '対象外': {status:'"not unexamined"',response:'更新前のMember'},
              'キャンセル': {status:'"examin canceled"',response:'更新前のMember'},
              '正常終了': {status:'"success"',response:'更新<span style="color:red">後</span>のMember'},
            },
          },
        ]},
      },
      {
        name: 'judgeStatus', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: '指定メンバ・デバイスの状態を[状態決定表](../specification.md#member)により判定',
        note: ``, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          {name:'arg',type:'Member|string',desc:'Memberオブジェクトまたはユーザ識別子'},
        ]},

        process: `
          - 引数がargが文字列(memberId)だった場合[getMemberメソッド](#member_getmember)でMemberを取得、戻り値の"request"にセット
          - [状態決定表](../specification.md#member)に基づき、引数で指定されたメンバおよびデバイス全ての状態を判断・更新
        `,

        returns: {list:[
          { // 対比表形式
            type: 'authResponse',  // 自クラスの場合、省略
            desc: '', // {string} 本データ型に関する説明。「正常終了時」等
            default: {},  // {Object.<string,string>} 全パターンの共通設定値
            patterns: { // 特定パターンへの設定値。patterns:{'パターン名':{項目名:値}}形式,
              '正常終了': {
                request: 'Member(更新前)',
                response: 'Member(更新後)',
              },
            },
          },
        ]},
      },
      {
        name: 'reissuePasscode', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: 'パスコードを再発行する', // {string} 端的な関数(メソッド)の説明
        note: ``, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          {name:'request',type:'authRequest',desc:'処理要求オブジェクト'},
        ]},

        process: `
          - 引数チェック。"func"が指定以外の場合、戻り値「不正形式」を返して終了
            %% this.cfTable({
              type:'authRequest',
              patterns:{'確認内容':{func:'"::reissue::"'}}
            },{
              indent:2,
              header:{name:'項目名',type:'データ型',default:'要否/既定値',desc:'説明'}
            }) %%
          - デバイス状態チェック
            - request.memberIdを基に[getMemberメソッド](#member_getmember)でMemberインスタンスを取得
            - request.deviceIdで対象デバイスを特定、「試行中」以外は戻り値「非試行中」を返して終了
          - 現在試行中のMemberTrialについて、パスコードを書き換え<br>
            ※ 試行回数他、状態管理変数は書き換えない(MemberDevice.status,MemberTrial.log,MemberLog.loginRequest)
            %% this.cfTable({type:'MemberTrial',patterns:{'設定内容':{
              passcode: '新パスコード',
              created: '現在日時',
            }}},{
              indent:2,
              header:{name:'項目名',type:'データ型',default:'要否/既定値',desc:'説明'}
            }) %%
          - 更新後のMemberを引数に[setMemberメソッド](#member_setmember)を呼び出し、memberListシートを更新<br>
            ※ setMember内でjudgeStatusメソッドを呼び出しているので、状態の最新化は担保
          - メンバにパスコード通知メールを発信<br>
            但し[authServerConfig](authServerConfig.md#authserverconfig_members).underDev.sendPasscode === falseなら発信を抑止(∵開発中)
          - パスコード再発行を監査ログに記録([authAuditLog.log](authAuditLog.md#authauditlog_log))
            %% this.cfTable({type:'authAuditLog',patterns:{'設定内容':{
              func: '"reissuePasscode"',
              note: '旧パスコード -> 新パスコード',
            }}},{
              indent:2,
              header:{name:'項目名',type:'データ型',default:'要否/既定値',desc:'説明'}
            }) %%
          - 戻り値「正常終了」を返して終了(後続処理は戻り値(authResponse.message)で分岐先処理を判断)
        `,

        returns: {list:[
          { // 対比表形式
            type: 'authResponse',  // 自クラスの場合、省略
            desc: '', // {string} 本データ型に関する説明。「正常終了時」等
            default: {request:'request'},  // {Object.<string,string>} 全パターンの共通設定値
            patterns: { // 特定パターンへの設定値。patterns:{'パターン名':{項目名:値}}形式,
              '不正形式':{status:'dev.error("invalid request")'},
              '非試行中':{status:'dev.error("invalid status")'},
              '正常終了':{status:'"success"',response: '更新後のMember'},
            },
          },
        ]},
      },
      {
        name: 'removeMember', // {string} 関数(メソッド)名
        type: 'static', // {string} 関数(メソッド)の分類
        desc: '登録中メンバをアカウント削除、または加入禁止にする', // {string} 端的な関数(メソッド)の説明
        note: `memberListシートのGoogle Spreadのメニューから管理者が実行することを想定`, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          {name:'memberId',type:'string',note:'ユーザ識別子'},
          {name:'physical',type:'boolean',note:'物理削除ならtrue、論理削除ならfalse',default:'false'},
        ]},

        process: `
          - 処理開始日時を記録("const start = Date.now()")
          - [getMember](#member_getmember)で当該メンバのMemberを取得
          - 物理削除の場合("physical === true")
            - シート上に確認のダイアログを表示、OKが選択されたら当該メンバの行をmemberListから削除
            - 監査ログに「物理削除」を記録([authAuditLog.log](authAuditLog.md#authauditlog_log))
            - 戻り値「物理削除」を返して終了
          - 論理削除の場合("physical === false")
            - 既に「加入禁止」なら戻り値「加入禁止」を返して終了
            - シート上に確認のダイアログを表示、キャンセルが選択されたら戻り値「キャンセル」を返して終了
            - [MemberLog.prohibitJoining](MemberLog.md#memberlog_prohibitjoining)で加入禁止状態に変更
            - [setMember](#member_setmember)にMemberを渡してmemberListを更新
            - 監査ログに「論理削除」を記録([authAuditLog.log](authAuditLog.md#authauditlog_log))
            - 戻り値「論理削除」を返して終了
          - 監査ログ出力項目
            %% this.cfTable({type:'authAuditLog',default:{
              duration: 'Date.now() - start',
              memberId: 'this.memberId',
              note:'削除前Member(JSON)'
            },patterns:{
              '物理削除':{func:'"remove(physical)"'},
              '論理削除':{func:'"remove(logical)"'},
            }},{
              indent:2,
              header:{name:'項目名',type:'データ型',default:'要否/既定値',desc:'説明'}
            }) %%
        `,

        returns: {list:[
          { // 対比表形式
            type: 'authResponse',  // 自クラスの場合、省略
            desc: '', // {string} 本データ型に関する説明。「正常終了時」等
            default: {request:'{memberId, physical}'},  // {Object.<string,string>} 全パターンの共通設定値
            patterns: { // 特定パターンへの設定値。patterns:{'パターン名':{項目名:値}}形式,
              '物理削除': {status: '"success"'},
              '加入禁止': {
                status: '"already banned from joining"',
                response: '更新前のMember'
              },
              'キャンセル': {
                status: '"logical remove canceled"',
                response: '更新前のMember'
              },
              '論理削除': {
                status: '"success"',
                response: '更新<span style="color:red">後</span>のMember'
              },
            },
          },
          // null/Error等、定義外のデータ型の場合"template:''"を追加
          // 定義外以外でも一覧不要なら"template:''"を追加
          //{type:'null', desc:'正常終了時',template:''},
          //{type:'Error', desc:'異常終了時',note:'messageはシステムメッセージ',template:''},
        ]},
      },
      {
        name: 'restoreMember', // {string} 関数(メソッド)名
        type: 'static', // {string} 関数(メソッド)の分類
        desc: '加入禁止(論理削除)されているメンバを復活させる', // {string} 端的な関数(メソッド)の説明
        note: `memberListシートのGoogle Spreadのメニューから管理者が実行することを想定`, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          {name:'memberId',type:'string',desc:'ユーザ識別子'},
          {name:'examined',type:'boolean',desc:'修正内容',note:'「(審査済)未認証」にするならtrue、「未審査」にするならfalse。なお未審査にするなら改めて審査登録が必要',default:true},
        ]},

        process: `
          - [getMemberメソッド](#member_getmember)で当該メンバのMemberを取得
          - memberListシート上に存在しないなら、戻り値「不存在」を返して終了
          - 状態が「加入禁止」ではないなら、戻り値「対象外」を返して終了
          - シート上に確認のダイアログを表示、キャンセルが選択されたら「キャンセル」を返して終了
          - Memberの以下項目を更新
            %% this.cfTable({type:'MemberLog',patterns:{'更新内容':{
              approval: 'examined === true ? Date.now() : 0',
              denial: 0,
              joiningExpiration: '現在日時(UNIX時刻)＋authServerConfig.memberLifeTime',
              unfreezeDenial: 0,
            }}},{
              indent:2,
              header:{name:'項目名',type:'データ型',default:'要否/既定値',desc:'説明'}
            }) %%
          - [setMember](#member_setmember)にMemberを渡してmemberListを更新
          - 戻り値「正常終了」を返して終了
        `,

        returns: {list:[
          { // 対比表形式
            type: 'authResponse',  // 自クラスの場合、省略
            desc: '', // {string} 本データ型に関する説明。「正常終了時」等
            default: {request:'{memberId, examined}'},  // {Object.<string,string>} 全パターンの共通設定値
            patterns: { // 特定パターンへの設定値。patterns:{'パターン名':{項目名:値}}形式,
              '不存在': {status:'dev.error("not exists")'},
              '対象外': {status:'"not logically removed"',response:'更新前のMember'},
              'キャンセル': {status:'"restore canceled"',response:'更新前のMember'},
              '正常終了': {status:'"success"',response:'更新<span style="color:red">後</span>のMember'},
            },
          },
        ]},
      },
      {
        name: 'setMember', // {string} 関数(メソッド)名
        type: 'public', // {string} 関数(メソッド)の分類
        desc: '指定メンバ情報をmemberListシートに保存', // {string} 端的な関数(メソッド)の説明
        note: `登録済メンバの場合は更新、未登録の場合は新規登録(追加)を行う`, // {string} ✂️注意事項。Markdownで記載
        source: ``, // {string} ✂️想定するソースコード🧩
        lib: [], // {string} 本関数(メソッド)で使用する外部ライブラリ
        rev: 0, // {string} 本メソッド仕様書の版数

        params: {list:[
          {name:'arg',type:'Member|authRequest',desc:'既存メンバ(Member)または新規登録要求'},
        ]},

        process: `
          いまここ：Member.log/profile/deviceのメソッドにリンクが張られるよう修正
          - 引数がMember型の場合、既存メンバの更新と看做して以下の処理を行う
            1. memberListシートに存在しない場合(エラー)、以下の戻り値①を返して終了
            2. [judgeStatus](Member.md#member_judgestatus)でstatusを最新にしておく
            3. JSON文字列の項目は文字列化した上でmemberListシートの該当者を更新(Member.log/profile/device)
            4. 戻り値②を返して終了
          - 引数がauthRequestの場合、新規登録要求と看做して以下の処理を行う
            1. memberListシートに存在する場合(エラー)、戻り値③を返して終了
            2. authRequestが新規登録要求か確認
              - 確認項目
                - authRequest.func ==== '::newMember::'
                - authRequest.arguments[0]にメンバの氏名(文字列)が入っている
                - memberId, deviceId, signatureが全て設定されている
              - 確認項目の全条件が満たされ無かった場合(エラー)、戻り値④を返して終了
            3. Memberの新規作成
              - Member.memberId = authRequest.memberId
              - Member.name = authRequest.arguments[0]
              - Member.device = [new MemberDevice](MemberDevice.md#memberdevice_constructor)({deviceId:authRequest.deviceId, CPkey:authRequest.signature})
              - Member.log = [new MemberLog](MemberLog.md#memberlog_constructor)()
              - [judgeStatus](Member.md#member_judgestatus)にMemberを渡し、状態を設定
            4. JSON文字列の項目は文字列化した上でmemberListシートに追加(Member.log/profile/device)
            5. 本番運用中なら加入要請メンバへの通知<br>
              [authServerConfig.underDev.sendInvitation](authServerConfig.md#authserverconfig_internal) === falseなら開発中なので通知しない
            6. 戻り値⑤を返して終了
        `,

        returns: {list:[
          { // 対比表形式
            type: 'authResponse',  // 自クラスの場合、省略
            desc: '', // {string} 本データ型に関する説明。「正常終了時」等
            default: {},  // {Object.<string,string>} 全パターンの共通設定値
            patterns: { // 特定パターンへの設定値。patterns:{'パターン名':{項目名:値}}形式,
              '①':{status:'dev.error("not exist")'},
              '②':{status:'"success"',response: 'Member(更新済)'},
              '③':{status:'dev.error("already exist")'},
              '④':{status:'dev.error("Invalid registration request")'},
              '⑤':{status:'"success"',response: 'Member(新規作成)'},
            },
          },
        ]},
      },
    ]},
  },
}}));