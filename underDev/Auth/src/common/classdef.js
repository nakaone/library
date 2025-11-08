const classdef = {
  /*
  className: {  // {ClassDef} ■クラス定義■
    // className {string} クラス名
    label: '',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)
    navi: '', // {string} クラス内ナビ

    members: [  // {Members} ■メンバ(インスタンス変数)定義■
      //{name:'',type:'string',label:'',note:''},
      {
        name: '',	// {string} メンバ名(変数名)。英数字表記
        type: 'string',	// {string} データ型
        label: '',	// {string} 端的な項目説明。ex."サーバ側処理結果"
        note: '',	// {string|string[]} 当該項目に関する補足説明。ex."fatal/warning/normal"
        default: '—',	// {any} 関数の場合'=Date.now()'のように記述
        isOpt: false,	// {boolean} 任意項目はtrue。defaultが設定されたら強制的にtrue
      },
    ],

    methods: { // {Methods} ■メソッド定義■
      constructor: {
        // className {string} クラス名
        // methodName {string} メソッド(関数)名
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記
        // caller {Object[]} 本メソッドを呼び出す{class:クラス名,method:メソッド名}の配列

        params: [  // {Params} ■メソッド引数の定義■
          // 将来的にオブジェクト化、引数チェックロジックもここに記載
          // list {string[]} 定義順の引数名一覧
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
          //name: '',	// 引数としての変数名
          //type: '',	// データ型
          //note: '',	// 項目の説明
          //default: '—',	// 既定値
          //isOpt: false,  // 任意項目ならtrue
        ],

        process: `
          - 手順の中で自他クラスのメソッドを呼ぶ場合、caller対応のため以下のように記述すること。<br>
            [メソッド名](クラス名.md#クラス名(小文字表記)_メソッド名(小文字表記))
          - <evaluate>〜</evaluate>内部はMarkdown作成時に評価され、結果で置換される
          - 物理削除 ※comparisonTableサンプル
            <evaluate>comparisonTable({ // 原本となるクラスの各要素と、それぞれに設定する値の対比表を作成
              typeName:'authAuditLog',  // 対象元(投入先)となるclassdef(cdef)上のクラス名
              default: {request:'{memberId, physical}'},  // 各パターンの共通設定値。表記方法はassignと同じ
              pattern:{ // 設定パターン集
                '物理削除':{  // パターン名
                  assign: { // {Object.<string,string>} 当該パターンの設定値
                    func:'physical remove',
                    note:'削除対象メンバのMember(JSON)'
                  },
                  condition: '',  // 該当条件(trimIndent対象)
                  note: '',  // 備忘(trimIndent対象)
                }
              }
            },'  ')</evaluate>
            ※comparisonTable最小構成サンプル
            <evaluate>comparisonTable({typeName:'MemberLog',default:{},pattern:{'更新内容':{assign: {
              approval: 'examined === true ? Date.now() : 0',
              denial: 0,
              joiningExpiration: '現在日時(UNIX時刻)＋authServerConfig.memberLifeTime',
              unfreezeDenial: 0,
            }}}},'  ')</evaluate>
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        //returns: {authResponse:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
        returns: {  // 戻り値が複数のデータ型・パターンに分かれる場合
          authResponse: { // メンバ名は戻り値のデータ型名
            default: {request:'引数"request"',value:'MemberTrialオブジェクト'},
              // {Object.<string,string>} 各パターンの共通設定値
            condition: ``,	// {string} データ型が複数の場合の選択条件指定(trimIndent対象)
            note: ``,	// {string} 備忘(trimIndent対象)
            pattern: {
              '正答時': {
                assign: {result:'normal'}, // {Object.<string,string>} 当該パターンの設定値
                condition: ``,	// {string} 該当条件(trimIndent対象)
                note: ``,	// {string} 備忘(trimIndent対象)
              },
              '誤答・再挑戦可': {assign: {result:'warning'}},
              '誤答・再挑戦不可': {assign: {result:'fatal'}},
            }
          }
        },

        error: {  // エラー時処理
        },
      },
    },
  },
  */
  authAuditLog: {
    label: 'authServerの監査ログ',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
      クラスとして定義、authServer内でインスタンス化(∵authServerConfigを参照するため)<br>
      暗号化前encryptedRequest.memberId/deviceIdを基にインスタンス作成、その後resetメソッドで暗号化成功時に確定したauthRequest.memberId/deviceIdで上書きする想定。
    `,	// {string} クラスとしての補足説明。概要欄に記載
    policy: ``,   // {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: 'audit', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'timestamp',type:'string',label:'要求日時',note:'ISO8601拡張形式の文字列',default:'Date.now()'},
      {name:'duration',type:'number',label:'処理時間',note:'ミリ秒単位'},
      {name:'memberId',type:'string',label:'メンバの識別子',note:'=メールアドレス'},
      {name:'deviceId',type:'string',label:'デバイスの識別子',note:'',isOpt:true},
      {name:'func',type:'string',label:'サーバ側関数名',note:''},
      {name:'result',type:'string',label:'サーバ側処理結果',note:'fatal/warning/normal',default:'normal'},
      {name:'note',type:'string',label:'備考',note:''},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [
          {name:'config',type:'authServerConfig',note:'authServerの動作設定変数'},
        ],

        process: `
          - "[authServerConfig](authServerConfig.md#authserverconfig_internal).auditLog"シートが無ければ作成
          - 引数の内、authAuditLogと同一メンバ名があればthisに設定
          - 引数にnoteがあればthis.noteに設定
          - timestampに現在日時を設定
        `,

        returns: {authAuditLog:{}},
      },
      log: {
        type: 'public',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '監査ログシートに処理要求を追記',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: '',	// {string} 想定するJavaScriptソース
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Param[]} ■メソッド引数の定義■
          {name:'arg',type:'authRequest|string',note:'処理要求オブジェクトまたは内発処理名'},
        ],

        process: `
          - 引数がObjectの場合：func,result,noteがあればthisに上書き
          - 引数がstringの場合：this.funcにargをセット
          - 所要時間の計算(this.duration = Date.now() - this.timestamp)
          - timestampはISO8601拡張形式の文字列に変更
          - シートの末尾行にauthAuditLogオブジェクトを追加
        `,	// {string} 処理手順。markdownで記載

        returns: {authAuditLog:{
          note: `シートに出力したauthAuditLogオブジェクト`,	// {string} 備忘
        }},
      },
      reset: {
        type: 'public',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'authAuditLogインスタンス変数の値を再設定',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: '',	// {string} 想定するJavaScriptソース
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Param[]} ■メソッド引数の定義■
          {name:'request',isOpt:true,type:'authRequest',default:{},note:'変更する設定値'},
        ],

        process: `
          - 【要修正】用途を明確化、不要なら削除
          - [authServerConfig](authServerConfig.md#authserverconfig_internal).auditLogシートが無ければ作成
          - 引数の内、authAuditLogと同一メンバ名があればthisに設定
        `,	// {string} 処理手順。markdownで記載

        returns: {authAuditLog:{
          note: `修正後のauthAuditLogオブジェクト`,	// {string} 備忘
        }},
      },
    },
  },
  authClient: {
    label: 'クライアント側auth中核クラス',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
      authClientは、ローカル関数(ブラウザ内JavaScript)からの要求を受け、
      サーバ側(authServer)への暗号化通信リクエストを署名・暗号化、
      サーバ側処理を経てローカル側に戻された結果を復号・検証し、
      処理結果に応じてクライアント側処理を適切に振り分ける中核関数です。
    `,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    policy: `
      - クロージャ関数ではなくクラスとして作成
      - 内発処理はローカル関数からの処理要求に先行して行う
    `,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: `
      \`\`\`html
      <script type="text/javascript">
        // ライブラリ関数定義
        function devTools(){...}; // (中略)

        // authClient関係クラス定義
        class authClient{...}
        class authConfig{...}
        class authClientConfig{...} // (中略)

        // グローバル変数定義
        const dev = devTools();
        const acl = authClient({ // HTML要素のイベント対応のためグローバル領域でインスタンス化
          // プロジェクト毎の独自パラメータ
        });

        window.addEventListener('DOMContentLoaded', () => {
          const v = { whois: 'DOMContentLoaded', rv: null };
          dev.start(v.whois, [...arguments]);
          try {


            dev.end(); // 終了処理
            return v.rv;
          } catch (e) { dev.error(e); return e; }
        });
      </script>
      \`\`\`
    `,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'cf',type:'authClientConfig',label:'動作設定変数(config)',note:''},
      {name:'crypto',type:'cryptoClient',label:'暗号化・復号用インスタンス',note:''},
      {name:'idb',type:'authIndexedDB',label:'IndexedDB共有用',note:'IndexedDBの内容をauthClient内で共有'},
      {name:'pv',type:'Object',label:'authClient内共通変数',note:''},
    ],

    methods: { // {Method} ■メソッド定義■
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Param[]} ■メソッド引数の定義■
          {name:'config',type:'authClientConfig',note:'authClientの動作設定変数',default:'{}(空オブジェクト)'},
        ],

        process: `
          - インスタンス変数の設定
            <evaluate>comparisonTable({typeName:'authClient',pattern:{'設定内容':{assign: {
              cf: 'new [authClientConfig](authClientConfig.md#authclientconfig_constructor)(config)',
              crypto: 'new [cryptoClient](cryptoClient.md#cryptoclient_constructor)(config)',
              idb: 'new [authIndexedDB](authIndexedDB.md#authindexeddb_constructor)(config)',
              pv: '空オブジェクト',
            }}}},'  ')</evaluate>
        `,	// {string} 処理手順。markdownで記載

        returns: {authClient:{}},
      },
      checkCPkey: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'CPkey残有効期間をチェック',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Param[]} ■メソッド引数の定義■
          {name:'arg',isOpt:true,type:'Object',default:{},note:'ユーザ指定の設定値'},
        ],

        process: ``,	// {string} 処理手順。markdownで記載

        returns: {authResponse:{}},
      },
      enterPasscode: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'パスコード入力ダイアログを表示',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Param[]} ■メソッド引数の定義■
          {name:'arg',isOpt:true,type:'Object',default:{},note:'ユーザ指定の設定値'},
          //name: '',	// 引数としての変数名
          //isOpt: false,  // 任意項目ならtrue
          //type: '',	// データ型
          //default: '—',	// 既定値
          //note: '',	// 項目の説明
        ],

        process: ``,	// {string} 処理手順。markdownで記載

        returns: {authResponse:{}},
      },
      exec: {
        type: 'public',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'ローカル関数からの要求受付',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: `ローカル関数からの要求を受けてauthServerに問合せを行う`,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Param[]} ■メソッド引数の定義■
          {name:'request',isOpt:true,type:'authRequest[]|LocalRequest[]',default:'[]',note:'処理要求(スタック)'},
        ],

        process: `
          - requestから先頭の要素をpopし、処理対象とする
          - 処理対象がLocalRequest型だった場合、[authRequest](authRequest.md#authrequest_constructor)型に変換
            <evaluate>comparisonTable({typeName:'authRequest',default:{},pattern:{'項目対応':{assign: {
              func: 'LocalRequest.func',
              arguments: 'LocalRequest.arguments',
            }}}},'  ')</evaluate>
          - [crypto.fetch](cryptoClient.md#cryptoclient_fetch)に処理対象を渡して呼び出し
          - 以降、処理分岐。authServerの回答種別整理を待って記載
        `,	// {string} 処理手順。markdownで記載

        returns: {LocalResponse:{}},
      },
      setupEnvironment: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'SPkey入手等、authClient動作環境整備',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Param[]} ■メソッド引数の定義■
          {name:'arg',isOpt:true,type:'Object',default:{},note:'ユーザ指定の設定値'},
          //name: '',	// 引数としての変数名
          //isOpt: false,  // 任意項目ならtrue
          //type: '',	// データ型
          //default: '—',	// 既定値
          //note: '',	// 項目の説明
        ],

        process: ``,	// {string} 処理手順。markdownで記載

        returns: {authResponse:{}},
      },
      showMessage: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'メッセージをダイアログで表示',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Param[]} ■メソッド引数の定義■
          {name:'arg',isOpt:true,type:'Object',default:{},note:'ユーザ指定の設定値'},
          //name: '',	// 引数としての変数名
          //isOpt: false,  // 任意項目ならtrue
          //type: '',	// データ型
          //default: '—',	// 既定値
          //note: '',	// 項目の説明
        ],

        process: ``,	// {string} 処理手順。markdownで記載

        returns: {authResponse:{}},
      },
    },
  },
  authClientConfig: {
    label: 'authClient専用の設定値',  // 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authConfigを継承', // クラスとしての補足説明
    inherit: 'authConfig', // 親クラス名
    defaultVariableName: 'cf',  // 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)
    members: [
      {name:'api',type:'string',label:'サーバ側WebアプリURLのID',note:'`https://script.google.com/macros/s/(この部分)/exec`'},
      {name:'timeout',type:'number',label:'サーバからの応答待機時間',note:'これを超えた場合はサーバ側でfatalとなったと解釈する。既定値は5分',default:300000},
      {name:'CPkeyGraceTime',type:'number',label:'CPkey期限切れまでの猶予時間',note:'CPkey有効期間がこれを切ったら更新処理実行。既定値は10分',default:600000},
    ],
    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
        ],

        process: ``,	// {string} 処理手順。markdownで記載

        returns: {authClientConfig:{}},
      },
    },
  },
  authClientKeys: {
    label: 'クライアント側鍵ペア',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: '',	// {string} クラスとしての補足説明。概要欄に記載
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'CSkeySign',type:'CryptoKey',label:'署名用秘密鍵',note:''},
      {name:'CPkeySign',type:'CryptoKey',label:'署名用公開鍵',note:''},
      {name:'CSkeyEnc',type:'CryptoKey',label:'暗号化用秘密鍵',note:''},
      {name:'CPkeyEnc',type:'CryptoKey',label:'暗号化用公開鍵',note:''},
    ],

    methods: {
      constructor: {
        label: 'コンストラクタ',
        lib: ['createPassword'],

        params: [
          {name:'config',type:'authClientConfig',note:'鍵生成用の設定(RSA鍵長等)'},
        ],

        process: `
          - [createPassword](JSLib.md#createpassword)でパスワード生成
          - [authConfig](authConfig.md#authconfig_internal).RSAbitsを参照、新たな鍵ペア生成
        `,	// {string} 処理手順。markdownで記載

        returns: {authClientKeys:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  authConfig: {
    label: 'authClient/authServer共通設定値',
    note: 'authClientConfig, authServerConfigの親クラス',
    policy: ``,
    inherit: '', // 親クラス名
    defaultVariableName: '',
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members:[
      {name:'systemName',type:'string',label:'システム名',default:'auth'},
      {name:'adminMail',type:'string',label:'管理者のメールアドレス'},
      {name:'adminName',type:'string',label:'管理者氏名'},
      {name:'allowableTimeDifference',type:'number',label:'クライアント・サーバ間通信時の許容時差',note:'既定値は2分',default:120000},
      {name:'RSAbits',type:'string',label:'鍵ペアの鍵長',default:2048},
      {name:'underDev',type:'Object',label:'テスト時の設定'},
      {name:'underDev.isTest',type:'boolean',label:'開発モードならtrue',default:'false'},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
        ],

        process: ``,	// {string} 処理手順。markdownで記載

        returns: {authConfig:{}},
      },
    },
  },
  authErrorLog: {
    label: 'authServerのエラーログ',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
      クラスとして定義、authServer内でインスタンス化(∵authServerConfigを参照するため)<br>
      暗号化前encryptedRequest.memberId/deviceIdを基にインスタンス作成、その後resetメソッドで暗号化成功時に確定したauthRequest.memberId/deviceIdで上書きする想定。`,	// {string} クラスとしての補足説明。概要欄に記載
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'timestamp',type:'string',label:'要求日時',note:'ISO8601拡張形式の文字列',default:'Date.now()'},
      {name:'memberId',type:'string',label:'メンバの識別子',note:'=メールアドレス'},
      {name:'deviceId',type:'string',label:'デバイスの識別子',note:''},
      {name:'result',type:'string',label:'サーバ側処理結果',note:'fatal/warning/normal',default:'fatal'},
      {name:'message',type:'string',label:'サーバ側からのエラーメッセージ',note:'normal時は`undefined`',isOpt:true},
      {name:'stackTrace',type:'string',label:'エラー発生時のスタックトレース',note:'本項目は管理者への通知メール等、シート以外には出力不可',isOpt:true},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [
          {name:'config',type:'authServerConfig',note:'authServerの動作設定変数'},
        ],

        process: `
          - [authServerConfig](authServerConfig.md#authserverconfig_internal).auditLogシートが無ければ作成
        `,	// {string} 処理手順。markdownで記載

        returns: {authErrorLog:{}},
      },
      log: {
        type: 'public',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'エラーログをシートに出力',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Param[]} ■メソッド引数の定義■
          {name:'e',type:'Error',note:'エラーオブジェクト'},
        ],

        process: `
          - this.message = e.message
          - this.stackTrace = e.stack
          - e.messageがJSON化可能な場合
            - e.messageをオブジェクト化してobjに代入
            - this.result = obj.result
            - this.message = obj.message
          - シートの末尾行にauthErrorLogオブジェクトを追加
        `,	// {string} 処理手順。markdownで記載

        returns: {authErrorLog:{
          note: `シートに出力したauthErrorLogオブジェクト`,	// {string} 備忘
        }},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
      reset: {
        type: 'public',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'authErrorLogインスタンス変数の値を再設定',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
        ],

        process: `
          - 引数の内、authErrorLogと同一メンバ名があればthisに設定
          - 📤 戻り値：変更後のauthErrorLogオブジェクト
        `,	// {string} 処理手順。markdownで記載

        returns: {authErrorLog:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  authIndexedDB: {
    label: 'クライアントのIndexedDB',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authClientKeysを継承した、クライアントのIndexedDBを操作するクロージャ関数<br>'
    + 'メイン処理を同期的に行うため、クラスでは無くasyncクロージャ関数として定義。'
    + 'IndexedDB保存時のキー名は`authConfig.system.name`から取得',	// {string} クラスとしての補足説明。概要欄に記載
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: 'authClientKeys',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'memberId',type:'string',label:'メンバの識別子',note:'=メールアドレス'},
      {name:'memberName',type:'string',label:'メンバ(ユーザ)の氏名',note:'例："田中　太郎"。加入要求確認時に管理者が申請者を識別する他で使用。'},
      {name:'deviceId',type:'string',label:'デバイスの識別子',note:'',default:'UUID'},
      {name:'keyGeneratedDateTime',type:'number',label:`鍵ペア生成日時`,
        note: 'サーバ側でCPkey更新中にクライアント側で新たなCPkeyが生成されるのを避けるため、鍵ペア生成は30分以上の間隔を置く'
      ,default:'Date.now()'},
      {name:'SPkey',type:'string',label:'サーバ公開鍵',note:'Base64',default:null},
      //{name:'ApplicationForMembership',type:'number',label:'加入申請実行日時。未申請時は0',note:'',default:0},
      //{name:'expireAccount',type:'number',label:'加入承認の有効期間が切れる日時。未加入時は0',note:'',default:0},
      {name:'expireCPkey',type:'number',label:'CPkeyの有効期限(無効になる日時)',note:'未ログイン時は0',default:0},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'メイン処理(コンストラクタ相当)',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'config',type:'authClientConfig',note:'設定情報'},
        ],

        process: `
          - IndexedDBに[authClientConfig](authClientConfig.md#authclientconfig_internal).systemNameを持つキーがあれば取得、メンバ変数に格納。
          - 無ければ新規に生成し、IndexedDBに格納。
          - authClientConfig.auditLogシートが無ければ作成
          - 引数の内、authIndexedDBと同一メンバ名があればthisに設定
          - 引数にnoteがあればthis.noteに設定
          - timestampに現在日時を設定
        `,	// {string} 処理手順。markdownで記載
        // なおSPkeyは初回処理要求時に取得する予定なので、ここでは要求しない

        returns: {authIndexedDB:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
      get: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'IndexedDBの値を取得',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
        ],

        process: `
          - 【要修正】authAuditLogに関する記述？？？
          - 引数がObjectの場合：func,result,noteがあればthisに上書き
          - 引数がstringの場合：this.funcにargをセット
          - this.duration = Date.now() - this.timestamp
          - timestampはISO8601拡張形式の文字列に変更
          - シートの末尾行にauthAuditLogオブジェクトを追加
          - メール通知：stackTraceは削除した上でauthConfig.adminMail宛にメール通知
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {authIndexedDB:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
      set: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'IndexedDBの値を更新(生成)',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'authIndexedDB',default:{},note:'更新(生成)値(更新対象メンバのみで可)'},
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {authIndexedDB:{
          note: 'IndexedDBに設定した値',	// {string} 備忘
        }},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
      reset: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'IndexedDBの値を更新(生成)',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'authIndexedDB',default:{},note:'更新(生成)値(更新対象メンバのみで可)'},
        ],

        process: `
          - 【要修正】authAuditLogに関する記述？？？
          - authClientConfig.auditLogシートが無ければ作成
          - 引数の内、authAuditLogと同一メンバ名があればthisに設定
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {authIndexedDB:{
          note: 'IndexedDBに設定した値',	// {string} 備忘
        }},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  authRequest: {
    label: '暗号化前の処理要求',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authClientからauthServerに送られる、暗号化前の処理要求オブジェクト',	// {string} クラスとしての補足説明。概要欄に記載
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'memberId',type:'string',label:'メンバの識別子',note:'=メールアドレス',default:'idb.memberId'},
      {name:'deviceId',type:'string',label:'デバイスの識別子',note:'',default:'idb.deviceId'},
      {name:'signature',type:'string',label:'クライアント側署名',note:'',default:'idb.CPkey'},
      {name:'requestId',type:'string',label:'要求の識別子',note:'UUID',default:'UUID'},
      {name:'timestamp',type:'number',label:'要求日時',note:'UNIX時刻',default:'Date.now()'},
      {name:'func',type:'string',label:'サーバ側関数名',note:''},
      {name:'arguments',type:'any[]',label:'サーバ側関数に渡す引数の配列',note:''},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {authRequest:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  authRequestLog: {
    label: '重複チェック用のリクエスト履歴',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'ScriptPropertiesに保存',	// {string} クラスとしての補足説明。概要欄に記載
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'timestamp',type:'number',label:'リクエストを受けたサーバ側日時',note:'',default:'Date.now()'},
      {name:'requestId',type:'string',label:'クライアント側で採番されたリクエスト識別子',note:'UUID'},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {authRequestLog:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  authResponse: {
    label: '暗号化前の処理結果',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authServerからauthClientに返される、暗号化前の処理結果オブジェクト',	// {string} クラスとしての補足説明。概要欄に記載
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'timestamp',type:'number',label:'サーバ側処理日時',note:'UNIX時刻',default:'Date.now()'},
      {name:'result',type:'string',label:'サーバ側処理結果',note:'fatal/warning/normal',default:'normal'},
      {name:'message',type:'string',label:'サーバ側からの(エラー)メッセージ',note:'',isOpt:true},
      {name:'request',type:'authRequest',label:'処理要求オブジェクト',note:'',isOpt:true},
      {name:'response',type:'any',label:'要求されたサーバ側関数の戻り値',note:'fatal/warning時は`undefined`',isOpt:true},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {authResponse:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  authScriptProperties: {
    label: 'サーバ側のScriptProperties',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'キー名は`authConfig.system.name`',	// {string} クラスとしての補足説明。概要欄に記載
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'keyGeneratedDateTime',type:'number',label:'UNIX時刻',note:''},
      {name:'SPkey',type:'string',label:'PEM形式の公開鍵文字列',note:''},
      {name:'SSkey',type:'string',label:'PEM形式の秘密鍵文字列(暗号化済み)',note:''},
      {name:'oldSPkey',type:'string',label:'cryptoServer.reset実行前にバックアップした公開鍵',note:''},
      {name:'oldSSkey',type:'string',label:'cryptoServer.reset実行前にバックアップした秘密鍵',note:''},
      {name:'requestLog',type:'authRequestLog[]',label:'重複チェック用のリクエスト履歴',note:'',default:[]},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
        ],

        process: `
          - 鍵ペア未作成なら[createPassword](JSLib.md#createpassword)を使用して作成
            <evaluate>comparisonTable({typeName:'authScriptProperties',pattern:{'更新内容':{assign: {
              keyGeneratedDateTime: 'Date.now()',
              SPkey: '新規作成',
              SSkey: '新規作成',
            }}}},'  ')</evaluate>
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {authScriptProperties:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
      requestLog: {},
    },
  },
  authServer: {
    label: 'サーバ側auth中核クラス',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
      authServerは、クライアント(authClient)からの暗号化通信リクエストを復号・検証し、
      メンバ状態と要求内容に応じてサーバ側処理を適切に振り分ける中核関数です。
    `,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    policy: `
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
    `,	// {string} 設計方針欄(trimIndent対象)
    // | **requestLog** | decrypt 開始時 | 重複チェック(リプレイ防止)用。ScriptPropertiesに短期保存 |
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: `
      \`\`\`js
      // ライブラリ関数定義
      function devTools(){...}; // (中略)

      // authServer関係クラス定義
      class authServer{...};
      class cryptoServer{...};
      class Member{...};  // (中略)

      // グローバル変数定義
      const dev = devTools();
      const asv = authServer({
        // プロジェクト毎の独自パラメータ
      });

      // Webアプリ定義
      function doPost(e) {
        const rv = asv.exec(e.postData.contents); // 受け取った本文(文字列)
        if( rv !== null ){ // fatal(無応答)の場合はnullを返す
          return ContentService
            .createTextOutput(rv);
        }
      }

      // スプレッドシートメニュー定義
      const ui = SpreadsheetApp.getUi();
      ui.createMenu('追加したメニュー')
        .addItem('加入認否入力', 'menu10')
        .addSeparator()
        .addSubMenu(ui.createMenu("システム関係")
          .addItem('実行環境の初期化', 'menu21')
          .addItem("【緊急】鍵ペアの更新", "menu22")
        )
        .addToUi();
      const menu10 = () => asv.listNotYetDecided();
      const menu21 = () => asv.setupEnvironment();
      const menu22 = () => asv.resetSPkey();
      \`\`\`
    `,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)
    navi: `<div style="text-align:right">\n\n[設計方針](#authserver_policy) | [実装・使用例](#authserver_example) | [メンバ一覧](#authserver_internal) | [メソッド一覧](#authserver_method)\n\n</div>`,

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'cf',type:'authServerConfig',label:'動作設定変数(config)',note:''},
      {name:'prop',type:'authScriptProperties',label:'鍵ペア等を格納',note:''},
      {name:'crypto',type:'cryptoServer',label:'暗号化・復号用インスタンス',note:''},
      {name:'member',type:'Member',label:'対象メンバのインスタンス',note:''},
      {name:'audit',type:'authAuditLog',label:'監査ログのインスタンス',note:''},
      {name:'error',type:'authErrorLog',label:'エラーログのインスタンス',note:''},
      {name:'pv',type:'Object',label:'authServer内共通変数',note:''},
    ],

    methods: { // {Method} ■メソッド定義■
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Param[]} ■メソッド引数の定義■
          {name:'config',type:'authServerConfig',note:'authClientの動作設定変数',default:'{}(空オブジェクト)'},
        ],

        process: `
          - インスタンス変数の設定
            <evaluate>comparisonTable({typeName:'authServer',pattern:{'設定内容':{assign: {
              cf: 'new [authServerConfig](authServerConfig.md#authserverconfig_constructor)(config)',
              prop: 'new [authScriptProperties](authScriptProperties.md#authscriptproperties_constructor)(config)',
              crypto: 'new [cryptoServer](cryptoServer.md#cryptoserver_constructor)(config)',
              member: 'new [Member](Member.md#member_constructor)(config)',
              auditLog: 'new [authAuditLog](authAuditLog.md#authauditlog_constructor)()',
              errorLog: 'new [authErrorLog](authErrorLog.md#autherrorlog_constructor)()',
              pv: '空オブジェクト',
            }}}},'  ')</evaluate>
        `,	// {string} 処理手順。markdownで記載

        returns: {authServer:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
      exec: {
        type: 'public',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'doPostから呼ばれ、authClientからの要求を処理',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: `
          - authClientからの処理要求を受け、復号後サーバ内関数に処理を依頼、結果がfatalでなければ暗号化してauthClientに返す。
          - 結果がfatalの場合はログに出力して何も返さない。
        `,	// {string} 注意事項。markdownで記載
        source: `
          \`\`\`js
          exec(request){
            const v = {whois:pv.whois+'exec',rv:null,
              request: null,  // {authRequest} 平文の処理要求
              response:null,  // {authResponse} 平文の処理結果
            }
            try {
              core: { // 中核処理
                v.dr = crypto.decrypt(request);
                if( v.dr instanceof Error ) throw v.dr; // 復号された要求
                if( v.dr.result === 'warning' && v.dr.message === 'maybe CPkey' ){
                  // CPkeyが平文で要求された場合
                  v.response = responseSPkey(v.dr.request); // SPkeyを返す
                  if ( v.response.result === 'normal' ){
                    break core; // 中核処理を抜ける
                  } else {
                    throw new Error(v.response.message);
                  }
                }
                // 中略
              }

              // 正常終了時処理
              v.rv = crypto.encrypt(v.response);  // 処理結果を暗号化
              audit.log(v.response);  // 監査ログ出力
              return v.rv;

            } catch(e) {
              // 異常終了時処理
              error.log(e); // エラーログを出力し、何も返さない
            }
          }
          \`\`\`
        `,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'request',type:'string',note:'CPkeyまたは暗号化された処理要求'},
        ],

        process: `
          ■ 中核処理(coreブロック)

          - 復号・署名検証
            - "v.dr = [crypto.decrypt](cryptoServer.md#cryptoserver_decrypt)(request)"を実行
            - "v.dr.result === 'normal'の場合、"v.request = v.dr.request"を実行
            - "v.dr.result === 'fatal'"の場合、'throw new Error(v.dr.message)'を実行
            - "v.dr.result === 'warning' && v.dr.message === 'maybe CPkey'"の場合、SPkey発行処理を実行
              - 'v.response = [responseSPkey](#authserver_responsespkey)'を実行
              - "v.response.result === 'normal'"の場合、中核処理を抜ける
              - "v.response.result === 'fatal'"の場合、'throw new Error(v.response.message)'を実行

          - 重複リクエストチェック
            - authScriptProperties.requestLogで重複リクエストをチェック いまここ
            - エラーならエラーログに出力
              - authErrorLog.result = 'fatal'
              - authErrorLog.message = 'Duplicate requestId'
            - authServerConfig.requestIdRetention以上経過したリクエスト履歴は削除
            - Errorをthrowして終了
          - 3. authClient内発処理判定
            - authRequest.funcが以下に該当するなら内発処理としてメソッドを呼び出し、その戻り値をpv.rvにセット
              |  | authRequest.func | authServer.method |
              | :-- | :-- | :-- |
              | CPkey更新 | ::updateCPkey:: | updateCPkey() |
              | パスコード入力 | ::passcode:: | loginTrial() |
              | 新規登録要求 | ::newMember:: | Member.setMember() |
              | パスコード再発行 | ::reissue:: | Member.reissuePasscode() |
          - 4. サーバ側関数の存否チェック
            - authServerConfig.funcのメンバ名に処理要求関数名(authRequest.func)が無ければError('no func:'+authRequest.func)をthrow
          - 5. サーバ側関数の権限要否を判定
            - authServerConfig.func[処理要求関数名].authority === 0ならcallFunctionメソッドを呼び出し、その戻り値をpv.rvにセット
          - 6. メンバ・デバイスの状態により処理分岐
            - 当該メンバの状態を確認(Member.getStatus())
            - 以下の表に従って処理分岐、呼出先メソッドの戻り値をpv.rvにセット
              No | 状態 | 動作
              :-- | :-- | :--
              1 | 未加入 | memberList未登録<br>⇒ membershipRequest()メソッドを呼び出し
              2 | 未審査 | memberList登録済だが、管理者による加入認否が未決定(=加入審査状況の問合せ)<br>⇒ notifyAcceptance()メソッドを呼び出し
              3 | 審査済 | 管理者による加入認否が決定済<br>⇒ notifyAcceptance()メソッドを呼び出し
              4.1 | 未認証 | 認証(ログイン)不要の処理しか行えない状態。<br>無権限で行える処理 ⇒ callFunction()メソッドを呼び出し<br>無権限では行えない処理 ⇒ loginTrial()メソッドを呼び出し
              4.2 | 試行中 | パスコードによる認証を試行している状態<br>⇒ loginTrial()メソッドを呼び出し
              4.3 | 認証中 | 認証が通り、ログインして認証が必要な処理も行える状態<br>⇒ callFunction()メソッドを呼び出し
              4.4 | 凍結中 | 規定の試行回数連続して認証に失敗し、再認証要求が禁止された状態<br>⇒ loginTrial()メソッドを呼び出し
              5 | 加入禁止 | 管理者により加入が否認された状態<br>⇒ notifyAcceptance()メソッドを呼び出し




          ■ 正常終了時処理

          ■ 異常終了時処理(catch句内の処理)
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {encryptedResponse:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
        // エラー時はnullを返す
      },
      // execの戻り値(処理結果)一覧を作成、authClient.execの処理分岐と対応させること!!
      // SPkey再設定はresetSPkeyとしてここに記述
      // - SPkey/SSkeyを更新、ScriptPropertiesに保存
      // - 本メソッドはシステム管理者がGAS編集画面から実行することを想定

      decodeRequest: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'クライアントからの要求を解読',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'str',type:'string',note:'クライアント側から送られたCPkey'},
        ],

        process: `
          - SPkey要求判定：引数"str"のオブジェクト化を試行
            - オブジェクト化失敗の場合
              - strがCPkey文字列として適切か判定
                - 不適切なら戻り値「不正文字列」を返して終了 -> Error
                - 適切ならMember.addMember(仮登録要求)を行い、それを戻り値とする -> authResponse
            - オブジェクト化成功の場合
              - encryptedRequest形式でないなら「形式不正」
              - memberIdから対象者のMemberインスタンスを取得<br>
                 "member = member.[getMember](Member.md#member_getmember)(memberId)"
              - 取得不能なら「未登録メンバ」
              - cryptoServer.decrypt -> authRequest
              - 

                 
            <evaluate>comparisonTable({typeName:'MemberLog',default:{},pattern:{'更新内容':{assign: {
              approval: 'examined === true ? Date.now() : 0',
              denial: 0,
              joiningExpiration: '現在日時(UNIX時刻)＋authServerConfig.memberLifeTime',
              unfreezeDenial: 0,
            }}}},'  ')</evaluate>
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        //returns: {authResponse:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
        returns: {  // 戻り値が複数のデータ型・パターンに分かれる場合
          authResponse: { // メンバ名は戻り値のデータ型名
            default: {request:'引数"request"',value:'MemberTrialオブジェクト'},
              // {Object.<string,string>} 各パターンの共通設定値
            condition: ``,	// {string} データ型が複数の場合の選択条件指定(trimIndent対象)
            note: ``,	// {string} 備忘(trimIndent対象)
            pattern: {
              '正答時': {
                assign: {result:'normal'}, // {Object.<string,string>} 当該パターンの設定値
                condition: ``,	// {string} 該当条件(trimIndent対象)
                note: ``,	// {string} 備忘(trimIndent対象)
              },
              '誤答・再挑戦可': {assign: {result:'warning'}},
              '誤答・再挑戦不可': {assign: {result:'fatal'}},
            }
          }
        },

        error: {  // エラー時処理
        },
      },
    },
  },
  authServerConfig: {
    label: 'authServer専用の設定値',  // 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authConfigを継承した、authServerでのみ使用する設定値', // クラスとしての補足説明
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: 'authConfig', // 親クラス名
    defaultVariableName: 'cf',  // 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [
      {name:'memberList',type:'string',label:'memberListシート名',default:'memberList'},
      {name:'defaultAuthority',type:'number',label:'新規加入メンバの権限の既定値',default:1},
      {name:'memberLifeTime',type:'number',label:'加入有効期間',note:'メンバ加入承認後の有効期間。既定値は1年',default:31536000000},
      {name:'prohibitedToJoin',type:'number',label:'加入禁止期間',note:'管理者による加入否認後、再加入申請が自動的に却下される期間。既定値は3日',default:259200000},
      {name:'loginLifeTime',type:'number',label:'認証有効時間',note:'ログイン成功後の有効期間、CPkeyの有効期間。既定値は1日',default:86400000},
      {name:'loginFreeze',type:'number',label:'認証凍結時間',note:'認証失敗後、再認証要求が禁止される期間。既定値は10分',default:600000},
      {name:'requestIdRetention',type:'number',label:'重複リクエスト拒否となる時間',note:'既定値は5分',default:300000},
      {name:'errorLog',type:'string',label:'エラーログのシート名',default:'errorLog'},
      {name:'storageDaysOfErrorLog',type:'number',label:'監査ログの保存日数',note:'単位はミリ秒。既定値は7日分',default:604800000},
      {name:'auditLog',type:'string',label:'監査ログのシート名',default:'auditLog'},
      {name:'storageDaysOfAuditLog',type:'number',label:'監査ログの保存日数',note:'単位はミリ秒。既定値は7日分',default:604800000},

      {name:'func',type:'Object.<string,Object>',label:'サーバ側の関数マップ',note:'例：{registerMember:{authority:0b001,do:m=>register(m)},approveMember:{authority:0b100,do:m=>approve(m)}}'},
      {name:'func.authority',type:'number',label:'サーバ側関数の所要権限',note:'サーバ側関数毎に設定される当該関数実行のために必要となるユーザ権限。<br>' +
        '`authServerConfig.func.authority === 0 || (Member.profile.authority & authServerConfig.func.authority > 0)`なら実行可とする。',default:0},
      {name:'func.do',type:'Function',label:'実行するサーバ側関数'},

      {name:'trial',type:'Object',label:'ログイン試行関係の設定値'},
      {name:'trial.passcodeLength',type:'number',label:'パスコードの桁数',default:6},
      {name:'trial.maxTrial',type:'number',label:'パスコード入力の最大試行回数',default:3},
      {name:'trial.passcodeLifeTime',type:'number',label:'パスコードの有効期間',note:'既定値は10分',default:600000},
      {name:'trial.generationMax',type:'number',label:'ログイン試行履歴(MemberTrial)の最大保持数',note:'既定値は5世代',default:5},

      {name:'underDev.sendPasscode',type:'boolean',label:'開発中識別フラグ',note:'パスコード通知メール送信を抑止するならtrue',default:'false'},
      {name:'underDev.sendInvitation',type:'boolean',label:'開発中の加入承認通知メール送信',note:'開発中に加入承認通知メール送信を抑止するならtrue',default:'false'},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          // list {string[]} 定義順の引数名一覧
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
          //name: '',	// 引数としての変数名
          //type: '',	// データ型
          //note: '',	// 項目の説明
          //default: '—',	// 既定値
          //isOpt: false,  // 任意項目ならtrue
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {authServerConfig:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  cryptoClient: {
    label: 'クライアント側の暗号化・復号処理',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {
        name: '',	// {string} メンバ名(変数名)。英数字表記
        type: 'string',	// {string} データ型
        label: '',	// {string} 端的な項目説明。ex."サーバ側処理結果"
        note: '',	// {string|string[]} 当該項目に関する補足説明。ex."fatal/warning/normal"
        default: '—',	// {any} 関数の場合'=Date.now()'のように記述
        isOpt: false,	// {boolean} 任意項目はtrue。defaultが設定されたら強制的にtrue
      },
    ],

    methods: { // {Method} ■メソッド定義■
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [
          {name:'config',type:'authClientConfig',note:'authClientの動作設定変数'},
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {cryptoClient:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
      fetch: {
        type: 'public',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '処理要求を署名・暗号化し、サーバ側に問合せを行う',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'request',type:'authRequest',note:'処理要求'},
        ],

        process: `
          - requestを[encryptメソッド](#cryptoclient_encrypt)で署名・暗号化
          - サーバ側に問合せを実行
          - 一定時間経っても無応答の場合、戻り値「無応答」を返して終了
          - サーバ側からの応答が有った場合、[decryptメソッド](#cryptoclient_decrypt)で復号・署名検証
          - 復号・署名検証の結果をそのまま戻り値として返して終了
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {  // 戻り値が複数のデータ型・パターンに分かれる場合
          authResponse: { // メンバ名は戻り値のデータ型名
            pattern: {
              '無応答': {assign:{
                request:'request',
                result:'"fatal"',
                message: '"no response"'
              }},
            }
          }
        },
      },    },
  },
  cryptoServer: {
    label: 'サーバ側の暗号化・復号処理',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
      - 認証サーバ ([authServer](authServer.md)) から独立した復号・署名検証処理モジュール。
      - クライアント側仕様書([cryptoClient](cryptoClient.md))と対になる設計であり、署名・暗号化・鍵管理を統一方針で運用する。
      - 暗号化ライブラリは"jsrsasign"を使用
      - 以下"cf","prop","crypto","member","auditLog","errorLog","pv"はauthServer内共通のインスタンス変数

    `,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    policy: `
      - 署名→暗号化(Sign-then-Encrypt)方式に準拠
      - 鍵ペアは[ScriptProperties](authScriptProperties.md)に保存("SSkey", "SPkey")
      - ScriptPropertiesのキー名は"[authServerConfig](authServerConfig.md#authserverconfig_internal).system.name"に基づく
      - 復号処理は副作用のない純関数構造を目指す(stateを持たない)
      - 可能な範囲で「外部ライブラリ」を使用する
      - timestamp検証は整数化・絶対値化してから比較する

      #### <a name="security">🔐 セキュリティ仕様</a>

      | 項目 | 対策 |
      |------|------|
      | **リプレイ攻撃** | requestIdキャッシュ(TTL付き)で検出・拒否 |
      | **タイミング攻撃** | 定数時間比較(署名・ハッシュ照合)を採用 |
      | **ログ漏えい防止** | 復号データは一切記録しない |
      | **エラー通知スパム** | メンバ単位で送信間隔を制御 |
      | **鍵管理** | SSkey/SPkey は ScriptProperties に格納し、Apps Script内でのみ参照可 |
    `,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
    ],

    methods: { // {Method} ■メソッド定義■
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'config',type:'authServerConfig',note:'authServerの動作設定変数'},
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {cryptoServer:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
      decrypt: {
        type: 'public',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'authClientからのメッセージを復号＋署名検証',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
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
        `,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記
        // caller {Object[]} 本メソッドを呼び出す{class:クラス名,method:メソッド名}の配列

        params: [  // {Params} ■メソッド引数の定義■
          {name:'request',type:'string|encryptedRequest',note:'クライアント側からの暗号化された処理要求'},
        ],

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
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {  // 戻り値が複数のデータ型・パターンに分かれる場合
          decryptedRequest: { // メンバ名は戻り値のデータ型名
            default: {},
            pattern: {
              '不正文字列': {assign:{
                result: '"fatal"',
                message: '"invalid string"',
              }},
              'CPkey': {assign:{
                result: '"warning"',
                request: 'request',
                message: '"maybe CPkey"',
              }},
              '対象者不在': {assign:{
                result: '"fatal"',
                message: '"not exists"',
              }},
              '機器未登録': {assign:{
                result: '"fatal"',
                message: '"device not registered"',
              }},
              '復号失敗': {assign:{
                result: '"fatal"',
                message: '"decrypt failed"',
              }},
              '指定項目不足': {assign:{
                result: '"fatal"',
                message: '"missing fields"',
              }},
              '不正署名': {assign:{
                result: '"fatal"',
                message: '"invalid signature"',
              }},
              '時差超過': {assign:{
                result: '"fatal"',
                message: '"timestamp difference too large"',
              }},
              '正常終了': {assign:{
                request: '[authRequest](authRequest.md#authrequest_internal)',
                status: '[member.device\[n\]](MemberDevice.md#memberdevice_internal).status or [member](Member.md#member_internal).status'
              }},
            }
          }
        },
      },
      encrypt: {
        type: 'public',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'authClientへのメッセージを署名＋暗号化',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: `
          - [authResponse](authResponse.md#authresponse_internal).signatureは省略せず明示的に含める
          - 暗号化順序は Sign-then-Encrypt
          - 復号側([cryptoClient](cryptoClient.md))では「Decrypt-then-Verify」
          - 本メソッドはauthServerから呼ばれるため、fatalエラーでも戻り値を返す
        `,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'response',type:'authResponse',note:'暗号化対象オブジェクト'},
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {encryptedResponse:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  decryptedRequest: {
    label: '復号済の処理要求',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'encryptedRequestをcryptoServerで復号した処理要求オブジェクト',	// {string} クラスとしての補足説明。概要欄に記載
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'result',type:'string',label:'処理結果',note:'"fatal"(後続処理不要なエラー), "warning"(後続処理が必要なエラー), "normal"',default:'"normal"'},
      {name:'message',type:'string',label:'エラーメッセージ',note:'',isOpt:true},
      {name:'request',type:'authRequest',label:'ユーザから渡された処理要求',note:'',isOpt:true},
      {name:'timestamp',type:'number',label:'復号処理実施日時',note:'',default:'Date.now()'},
      {name:'status',type:'string',label:'ユーザ・デバイス状態',note:'Member.deviceが空ならメンバの、空で無ければデバイスのstatus',isOpt:true},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {decryptedRequest:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  decryptedResponse: {
    label: '復号済の処理結果',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'encryptedResponseをcryptoClientで復号した処理結果オブジェクト',	// {string} クラスとしての補足説明。概要欄に記載
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'timestamp',type:'number',label:'cryptoClient処理日時',note:'UNIX時刻'},
      {name:'result',type:'string',label:'cryptoClient処理結果',note:'fatal/warning/normal'},
      {name:'message',type:'string',label:'cryptoClientからのエラーメッセージ',note:'normal時は`undefined`',isOpt:true},

      {name:'request',type:'authRequest',label:'処理要求オブジェクト(authResponse.request)',note:''},
      {name:'response',type:'any',label:'要求されたサーバ側関数の戻り値(authResponse.response)',note:'fatal/warning時は`undefined`',isOpt:true},
      {name:'sv',type:'Object'},
      {name:'sv.timestamp',type:'number',label:'サーバ側処理日時',note:'UNIX時刻'},
      {name:'sv.result',type:'string',label:'サーバ側処理結果',note:'fatal/warning/normal'},
      {name:'sv.message',type:'string',label:'サーバ側からのエラーメッセージ',note:'normal時は`undefined`',isOpt:true},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {decryptedResponse:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  encryptedRequest: {
    label: '暗号化された処理要求',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authClientからauthServerに送られる、暗号化された処理要求オブジェクト。<br>'
      + 'ciphertextはauthRequestをJSON化、RSA-OAEP暗号化＋署名付与した文字列。<br>'
      + 'memberId,deviceIdは平文',	// {string} クラスとしての補足説明。概要欄に記載
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'memberId',type:'string',label:'メンバの識別子',note:'=メールアドレス'},
      {name:'deviceId',type:'string',label:'デバイスの識別子',note:''},
      {name:'ciphertext',type:'string',label:'暗号化した文字列',note:''},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {encryptedRequest:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  encryptedResponse: {
    label: '暗号化された処理結果',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authServerからauthClientに返される、暗号化された処理結果オブジェクト<br>'
      + 'ciphertextはauthResponseをJSON化、RSA-OAEP暗号化＋署名付与した文字列',	// {string} クラスとしての補足説明。概要欄に記載
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'ciphertext',type:'string',label:'暗号化した文字列',note:''},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {encryptedResponse:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  LocalRequest: {
    label: 'ローカル関数からの処理要求',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'クライアント側関数からauthClientに渡すオブジェクト。func,arg共、平文',	// {string} クラスとしての補足説明。概要欄に記載
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'func',type:'string',label:'サーバ側関数名',note:''},
      {name:'arguments',type:'any[]',label:'サーバ側関数に渡す引数の配列',note:'',default:'[](空配列)'},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {LocalRequest:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  LocalResponse: {
    label: 'ローカル関数への処理結果',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authClientからクライアント側関数に返される処理結果オブジェクト',	// {string} クラスとしての補足説明。概要欄に記載
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'result',type:'string',label:'処理結果。fatal/warning/normal',note:''},
      {name:'message',type:'string',label:'エラーメッセージ',note:'normal時は`undefined`',isOpt:true},
      {name:'response',type:'any',label:'要求された関数の戻り値',note:'fatal/warning時は`undefined`。`JSON.parse(authResponse.response)`',isOpt:true},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {LocalResponse:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  Member: {
    label: 'メンバ一覧シートに対応したメンバ単位の管理情報',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
      - 'Member'はGoogle SpreadSheet上でメンバ(アカウント)情報・状態を一元的に管理するためのクラスです。
      - 加入・ログイン・パスコード試行・デバイス別公開鍵(CPkey)管理などの状態を統一的に扱います。
      - マルチデバイス利用を前提とし、memberListスプレッドシートの1行を1メンバとして管理します。
    `,	// {string} クラスとしての補足説明。概要欄に記載
    policy: `
      - [クラス図](classes.md#member_classdiagram)

      #### <span id="member_policy_statediagram">状態遷移図</span>

      \`\`\`mermaid
      %% メンバ状態遷移図

      stateDiagram-v2
        [*] --> 不使用
        不使用 --> 未加入 : 処理要求
        不使用 --> 未審査 : 処理要求
        不使用 --> 加入禁止 : 処理要求
        不使用 --> 加入中 : 処理要求
        未加入 --> 未審査 : 加入要求
        未審査 --> 加入中 : 加入承認
        加入中 --> 未審査 : 加入失効
        未審査 --> 加入禁止: 加入否認
        加入禁止 --> 未審査 : 加入解禁
        state 加入中 {
          [*] --> 未認証
          未認証 --> 試行中 : 認証要求
          試行中 --> 未認証 : CPkey更新
          試行中 --> 認証中 : 認証成功
          試行中 --> 試行中 : 再試行
          認証中 --> 未認証 : 認証失効 or CPkey更新
          試行中 --> 凍結中 : 認証失敗
          凍結中 --> 凍結中 : CPkey更新
          凍結中 --> 未認証 : 凍結解除
        }
      \`\`\`

      #### <span id="member_policy_statelist">状態一覧</span>

      | No | 状態 | 説明 | SPkey | CPkey | memberId/メンバ名 | 無権限関数 | 要権限関数 |
      | --: | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
      | 1 | 不使用 | Auth不使用のコンテンツのみ表示 | 未取得 | 未生成(※1) | 未登録(※1) | 実行不可 | 実行不可 |
      | 2 | 未加入 | memberListにUUIDのmemberId/メンバ名で仮登録 | 取得済 | 生成済 | 仮登録(UUID) | 実行可 | 実行不可 |
      | 3 | 未審査 | memberListに本来のmemberId/メンバ名で登録済だが管理者による加入認否が未決定 | 取得済 | 生成済 | 本登録 | 実行可 | 実行不可 |
      | 4 | 加入中 | 管理者により加入が承認された状態 | 取得済 | 生成済 | 本登録 | 実行可 | 実行不可 |
      | 4.1 | 未認証 | 未認証(未ログイン)で権限が必要な処理は行えない状態 | 取得済 | 生成済 | 本登録 | 実行可 | 実行不可 |
      | 4.2 | 試行中 | パスコードによる認証を試行している状態 | 取得済 | 生成済 | 本登録 | 実行可 | 実行不可 |
      | 4.3 | 認証中 | 認証が通り、ログインして認証が必要な処理も行える状態 | 取得済 | 生成済 | 本登録 | 実行可 | 実行可 |
      | 4.4 | 凍結中 | 規定の試行回数連続して認証に失敗し、再認証要求が禁止された状態 | 取得済 | 生成済 | 本登録 | 実行可 | 実行不可 |
      | 5 | 加入禁止 | 管理者により加入が否認された状態 | 取得済 | 生成済 | 本登録 | 実行可 | 実行不可 |

      #### <span id="member_policy_decisiontable">状態決定表</span>

      | ①シート | ②memberId | ③加入禁止 | ④未審査 | **メンバ状態** | ⑤認証中 | ⑥凍結中 | ⑦未認証 | **デバイス状態** |
      | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
      | 未登録 | — | — | — | **不使用** |  |  |  |  |
      | 登録済 | UUID | — | — | **未加入** |  |  |  |  |
      | 登録済 | e-mail | 該当 | — | **加入禁止** |  |  |  |  |
      | 登録済 | e-mail | 非該当 | 該当 | **未審査** |  |  |  |  |
      | 登録済 | e-mail | 非該当 | 非該当 | **加入中** | 該当 | — | — | **認証中** |
      |  |  |  |  | **加入中** | 非該当 | 該当 | — | **凍結中** |
      |  |  |  |  | **加入中** | 非該当 | 非該当 | 該当 | **未認証** |
      |  |  |  |  | **加入中** | 非該当 | 非該当 | 非該当 | **試行中** |

      ※下表内の変数名はMemberLogのメンバ名

      - ①シート：memberListシートに登録されているか
      - ②memberId：メンバ識別子(文字列)の形式
      - ③加入禁止：加入禁止されている<br>
        \`0 < denial && Date.now() <= unfreezeDenial\`
      - ④未審査：管理者の認否が未決定<br>
        \`approval === 0 && denial === 0\`
      - ⑤認証中：パスコード認証に成功し認証有効期間内<br>
        \`0 < approval && Date.now() ≦ loginExpiration\`
      - ⑥凍結中：凍結期間内<br>
        \`0 < approval && 0 < loginFailure && loginFailure < Date.now() && Date.now() <= unfreezeLogin\`
      - ⑦未認証：加入承認後認証要求されたことが無い<br>
        \`0 < approval && loginRequest === 0\`
    `,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)
    navi: `<div style="text-align:right">\n\n[状態遷移図](#member_policy_statediagram) | [状態一覧](#member_policy_statelist) | [状態決定表](#member_policy_decisiontable) | [メンバ一覧](#member_internal) | [メソッド一覧](#member_method)\n\n</div>`,

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'memberId',type:'string',label:'メンバの識別子',note:'メールアドレス',default:'UUID'},
      {name:'name',type:'string',label:'メンバの氏名',note:'',default:'"dummy"'},
      {name:'status',type:'string',label:'メンバの状態',note:'未加入,未審査,審査済,加入中,加入禁止',default:'"未加入"'},
      {name:'log',type:'MemberLog',label:'メンバの履歴情報',note:'シート上はJSON文字列',default:'new MemberLog()'},
      {name:'profile',type:'MemberProfile',label:'メンバの属性情報',note:'シート上はJSON文字列',default:'new MemberProfile()'},
      {name:'device',type:'[MemberDevice](MemberDevice.md#memberdevice_internal)[]',label:'デバイス情報',note:'マルチデバイス対応のため配列。シート上はJSON文字列',default:'空配列'},
      {name:'note',type:'string',label:'当該メンバに対する備考',note:'',default:'空文字列'},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'config',type:'authServerConfig',note:'ユーザ指定の設定値'},
        ],

        process: `
          - [authServerConfig.memberList](authServerConfig.md#internal)シートが存在しなければシートを新規作成
            - シート上の項目名はMemberクラスのメンバ名
            - 各項目の「説明」を項目名セルのメモとしてセット
          - this.log = new [MemberLog()](MemberLog.md#memberlog_constructor)
          - this.profile = new [MemberProfile()](MemberProfile.md#memberprofile_constructor)
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {Member:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
      addTrial: {
        type: 'public',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '新しい試行を登録し、メンバにパスコード通知メールを発信',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記
        // caller {Object[]} 本メソッドを呼び出す{class:クラス名,method:メソッド名}の配列

        params: [  // {Params} ■メソッド引数の定義■
          {name:'request',type:'authRequest',note:'処理要求'},
        ],

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
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {  // 戻り値が複数のデータ型・パターンに分かれる場合
          authResponse: { // メンバ名は戻り値のデータ型名
            default: {request:'引数"request"'},
            pattern: {
              '不適格': {assign: {
                result:'"fatal"',
                message: '"invalid status"',
                response: 'Member(更新前)',
              }},
              '正常終了': {assign: {
                response: 'Member(更新後)',
              }},
            }
          }
        },
      },
      checkPasscode: {
        type: 'public',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '認証時のパスコードチェック',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: `入力されたパスコードをチェック、Member内部の各種メンバの値を更新の上、チェック結果を返す。`,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'request',type:'authRequest',note:'処理要求オブジェクト'},
        ],

        process: `
          - 引数チェック。"func"が指定以外、またはパスコードの形式不正の場合、戻り値「不正形式」を返して終了
            <evaluate>comparisonTable({typeName:'authRequest',default:{},pattern:{'確認内容':{assign: {
              func: '"::passcode::"',
              arguments: '入力されたパスコード'
            }}}},'  ')</evaluate>
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
              <evaluate>comparisonTable({typeName:'MemberLog',default:{},pattern:{
                '一致時':{assign: {
                  loginSuccess: '現在日時(UNIX時刻)',
                  loginExpiration: '現在日時＋[loginLifeTime](authServerConfig.md#authserverconfig_internal)'
                }},
                '上限到達':{assign: {
                  loginFailure: '現在日時(UNIX時刻)',
                  unfreezeLogin: '現在日時＋[loginFreeze](authServerConfig.md#authserverconfig_internal)'
                }},
              }},'  ')</evaluate>
          - 更新後のMemberを引数に[setMemberメソッド](#member_setmember)を呼び出し、memberListシートを更新<br>
            ※ setMember内でjudgeStatusメソッドを呼び出しているので、状態の最新化は担保
          - 戻り値「正常終了」を返して終了(後続処理は戻り値(authResponse.message)で分岐先処理を判断)
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {  // 戻り値が複数のデータ型・パターンに分かれる場合
          authResponse: { // メンバ名は戻り値のデータ型名
            default: {request:'request'},
            condition: ``,	// {string} データ型が複数の場合の選択条件指定(trimIndent対象)
            note: ``,	// {string} 備忘(trimIndent対象)
            pattern: {
              '不正形式':{assign:{
                result:'"fatal"',
                message: '"invalid request"',
              }},
              '非試行中':{assign:{
                result:'"fatal"',
                message: '"invalid status"',
              }},
              '正常終了':{assign:{
                message: 'デバイスの状態(MemberDevice.status)',
                response: '更新後のMember',
              }},
            }
          }
        },
      },
      getMember: {
        type: 'public',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '指定メンバの情報をmemberListシートから取得',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'memberId',type:'string',note:'ユーザ識別子(メールアドレス)'},
        ],

        process: `
          - JSON文字列の項目はオブジェクト化(Member.log, Member.profile, Member.device)
          - memberIdがmemberListシート登録済なら「登録済」、未登録なら「未登録」パターンを返す
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {authResponse:{
          default: {
            request: `{memberId:引数のmemberId}`,
          },
          pattern: {
            '登録済': {
              assign: {
                result: '"normal"',
                response: `Member(シート)`,
              },
            },
            '未登録': {
              assign: {
                result: '"fatal"',
                message:'not exists',
              }
            }
          }
        }},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
      judgeMember: {
        type: 'static',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '加入審査画面から審査結果入力＋結果通知',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: `
          - 加入審査画面を呼び出し、管理者が記入した結果をmemberListに登録、審査結果をメンバに通知する。
          - memberListシートのGoogle Spreadのメニューから管理者が実行することを想定。
        `,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'memberId',type:'string',note:'メンバ識別子'},
        ],

        process: `
          - [getMemberメソッド](#member_getmember)で当該メンバのMemberを取得
          - memberListシート上に存在しないなら、戻り値「不存在」を返して終了
          - 状態が「未審査」ではないなら、戻り値「対象外」を返して終了
          - シート上にmemberId・氏名と「承認」「否認」「取消」ボタンを備えたダイアログ表示
          - 取消が選択されたら戻り値「キャンセル」を返して終了
          - MemberLogの以下項目を更新
            <evaluate>comparisonTable({typeName:'MemberLog',default:{},pattern:{
              '承認時':{assign: {
                approval: '現在日時(Date.now())',
                denial: 0,
                joiningExpiration: '現在日時＋[memberLifeTime](authServerConfig.md#authserverconfig_internal)',
                unfreezeDenial: 0,
              }},
              '否認時':{assign: {
                approval: 0,
                denial: '現在日時',
                joiningExpiration: 0,
                unfreezeDenial: '現在日時＋[prohibitedToJoin](authServerConfig.md#authserverconfig_internal)',
              }},
            }},'  ')</evaluate>
          - [setMemberメソッド](#member_setmember)にMemberを渡してmemberListを更新
          - 戻り値「正常終了」を返して終了
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {  // 戻り値が複数のデータ型・パターンに分かれる場合
          authResponse: { // メンバ名は戻り値のデータ型名
            default: {request:'memberId'},
              // {Object.<string,string>} 各パターンの共通設定値
            condition: ``,	// {string} データ型が複数の場合の選択条件指定(trimIndent対象)
            note: ``,	// {string} 備忘(trimIndent対象)
            pattern: {
              '不存在': {assign:{result:'"fatal"',message:'"not exists"'}},
              '対象外': {assign:{result:'"warning"',message:'"not unexamined"',response:'更新前のMember'}},
              'キャンセル': {assign:{result:'"warning"',message:'"examin canceled"',response:'更新前のMember'}},
              '正常終了': {assign:{result:'"normal"',response:'更新<span style="color:red">後</span>のMember'}},
            }
          }
        },
      },
      judgeStatus: {
        type: 'public',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '指定メンバ・デバイスの状態を[状態決定表](#member_policy_decisiontable)により判定',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記
        // caller {Object[]} 本メソッドを呼び出す{class:クラス名,method:メソッド名}の配列

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Member|string',note:'Memberオブジェクトまたはユーザ識別子'},
        ],

        process: `
          - 引数がargが文字列(memberId)だった場合[getMemberメソッド](#member_getmember)でMemberを取得、戻り値の"request"にセット
          - [状態決定表](#member_policy_decisiontable)に基づき、引数で指定されたメンバおよびデバイス全ての状態を判断・更新
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        //returns: {authResponse:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
        returns: {  // 戻り値が複数のデータ型・パターンに分かれる場合
          authResponse: { // メンバ名は戻り値のデータ型名
            pattern: {
              '正常終了': {
                assign: {
                  request: 'Member(更新前)',
                  response: 'Member(更新後)',
                }, // {Object.<string,string>} 当該パターンの設定値
              },
            }
          }
        },
      },
      reissuePasscode: {
        type: 'public',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'パスコードを再発行する',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'request',type:'authRequest',note:'処理要求オブジェクト'},
        ],

        process: `
          - 引数チェック。"func"が指定以外の場合、戻り値「不正形式」を返して終了
            <evaluate>comparisonTable({typeName:'authRequest',default:{},pattern:{'確認内容':{assign: {
              func: '"::reissue::"',
            }}}},'  ')</evaluate>
          - デバイス状態チェック
            - request.memberIdを基に[getMemberメソッド](#member_getmember)でMemberインスタンスを取得
            - request.deviceIdで対象デバイスを特定、「試行中」以外は戻り値「非試行中」を返して終了
          - 現在試行中のMemberTrialについて、パスコードを書き換え<br>
            ※ 試行回数他、状態管理変数は書き換えない(MemberDevice.status,MemberTrial.log,MemberLog.loginRequest)
            <evaluate>comparisonTable({typeName:'MemberTrial',default:{},pattern:{'設定内容':{assign: {
              passcode: '新パスコード',
              created: '現在日時',
            }}}},'  ')</evaluate>
          - 更新後のMemberを引数に[setMemberメソッド](#member_setmember)を呼び出し、memberListシートを更新<br>
            ※ setMember内でjudgeStatusメソッドを呼び出しているので、状態の最新化は担保
          - メンバにパスコード通知メールを発信<br>
            但し[authServerConfig](authServerConfig.md#authserverconfig_internal).underDev.sendPasscode === falseなら発信を抑止(∵開発中)
          - パスコード再発行を監査ログに記録([authAuditLog.log](authAuditLog.md#authauditlog_log))
            <evaluate>comparisonTable({typeName:'authAuditLog',default:{},pattern:{'設定内容':{assign: {
              func: '"reissuePasscode"',
              note: '旧パスコード -> 新パスコード',
            }}}},'  ')</evaluate>
          - 戻り値「正常終了」を返して終了(後続処理は戻り値(authResponse.message)で分岐先処理を判断)
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {  // 戻り値が複数のデータ型・パターンに分かれる場合
          authResponse: { // メンバ名は戻り値のデータ型名
            default: {request:'request'},
            condition: ``,	// {string} データ型が複数の場合の選択条件指定(trimIndent対象)
            note: ``,	// {string} 備忘(trimIndent対象)
            pattern: {
              '不正形式':{assign:{
                result:'"fatal"',
                message: '"invalid request"',
              }},
              '非試行中':{assign:{
                result:'"fatal"',
                message: '"invalid status"',
              }},
              '正常終了':{assign:{
                response: '更新後のMember',
              }},
            }
          }
        },
      },
      removeMember: {
        type: 'static',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '登録中メンバをアカウント削除、または加入禁止にする',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: `
          - memberListシートのGoogle Spreadのメニューから管理者が実行することを想定
        `,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'memberId',type:'string',note:'ユーザ識別子'},
          {name:'physical',type:'boolean',note:'物理削除ならtrue、論理削除ならfalse',default:'false'},
        ],

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
            <evaluate>comparisonTable({
              typeName:'authAuditLog',  // 対象元(投入先)となるclassdef(cdef)上のクラス名
              default: {
                duration: 'Date.now() - start',
                memberId: 'this.memberId',
                note:'削除前Member(JSON)'
              },
              pattern:{ // 設定パターン集
                '物理削除':{assign: {func:'"remove(physical)"'}},
                '論理削除':{assign: {func:'"remove(logical)"'}},
              }
            },'  ')</evaluate>
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        //returns: {authResponse:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
        returns: {  // 戻り値が複数のデータ型・パターンに分かれる場合
          authResponse: { // メンバ名は戻り値のデータ型名
            default: {request:'{memberId, physical}'},
              // {Object.<string,string>} 各パターンの共通設定値
            condition: ``,	// {string} データ型が複数の場合の選択条件指定(trimIndent対象)
            note: ``,	// {string} 備忘(trimIndent対象)
            pattern: {
              '物理削除': {assign: {
                result: '"normal"',
                message: '"physically removed"',
              }},
              '加入禁止': {assign: {
                result:'"warning"',
                message: '"already banned from joining"',
                response: '更新前のMember'
              }},
              'キャンセル': {assign: {
                result:'"warning"',
                message: '"logical remove canceled"',
                response: '更新前のMember'
              }},
              '論理削除': {assign: {
                result:'"normal"',
                message: '"logically removed"',
                response: '更新<span style="color:red">後</span>のMember'
              }},
            }
          }
        },
      },
      restoreMember: {
        type: 'static',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '加入禁止(論理削除)されているメンバを復活させる',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: `memberListシートのGoogle Spreadのメニューから管理者が実行することを想定`,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'memberId',type:'string',note:'ユーザ識別子'},
          {name:'examined',type:'boolean',note:'「(審査済)未認証」にするならtrue、「未審査」にするならfalse。なお未審査にするなら改めて審査登録が必要',default:true},
        ],

        process: `
          - [getMemberメソッド](#member_getmember)で当該メンバのMemberを取得
          - memberListシート上に存在しないなら、戻り値「不存在」を返して終了
          - 状態が「加入禁止」ではないなら、戻り値「対象外」を返して終了
          - シート上に確認のダイアログを表示、キャンセルが選択されたら「キャンセル」を返して終了
          - Memberの以下項目を更新
            <evaluate>comparisonTable({typeName:'MemberLog',pattern:{'更新内容':{assign: {
              approval: 'examined === true ? Date.now() : 0',
              denial: 0,
              joiningExpiration: '現在日時(UNIX時刻)＋authServerConfig.memberLifeTime',
              unfreezeDenial: 0,
            }}}},'  ')</evaluate>
          - [setMember](#member_setmember)にMemberを渡してmemberListを更新
          - 戻り値「正常終了」を返して終了
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {  // 戻り値が複数のデータ型・パターンに分かれる場合
          authResponse: { // メンバ名は戻り値のデータ型名
            default: {request:'{memberId, examined}'},
              // {Object.<string,string>} 各パターンの共通設定値
            condition: ``,	// {string} データ型が複数の場合の選択条件指定(trimIndent対象)
            note: ``,	// {string} 備忘(trimIndent対象)
            pattern: {
              '不存在': {assign:{result:'"fatal"',message:'"not exists"'}},
              '対象外': {assign:{result:'"warning"',message:'"not logically removed"',response:'更新前のMember'}},
              'キャンセル': {assign:{result:'"warning"',message:'"restore canceled"',response:'更新前のMember'}},
              '正常終了': {assign:{result:'"normal"',response:'更新<span style="color:red">後</span>のMember'}},
            }
          }
        },
      },
      setMember: {
        type: 'public',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '指定メンバ情報をmemberListシートに保存',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: `登録済メンバの場合は更新、未登録の場合は新規登録(追加)を行う`,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記
        // caller {Object[]} 本メソッドを呼び出す{class:クラス名,method:メソッド名}の配列

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Member|authRequest',note:'既存メンバ(Member)または新規登録要求'},
        ],

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
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {  // 戻り値が複数のデータ型・パターンに分かれる場合
          authResponse: { // メンバ名は戻り値のデータ型名
            default: {request:'arg'},
              // {Object.<string,string>} 各パターンの共通設定値
            condition: ``,	// {string} データ型が複数の場合の選択条件指定(trimIndent対象)
            note: ``,	// {string} 備忘(trimIndent対象)
            pattern: {
              '①':{assign:{
                result: '"fatal"',
                message: '"not exist"',
              }},
              '②':{assign:{
                result: '"normal"',
                message: '"updated"',
                response: 'Member(更新済)',
              }},
              '③':{assign:{
                result: '"fatal"',
                message: '"already exist"',
              }},
              '④':{assign:{
                result: '"fatal"',
                message: '"Invalid registration request"',
              }},
              '⑤':{assign:{
                result: '"normal"',
                message: '"appended"',
                response: 'Member(新規作成)',
              }},
            }
          }
        },
      },
      unfreeze: {
        type: 'static',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '指定されたメンバ・デバイスの「凍結中」状態を強制的に解除',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: `
          - 引数でmemberIdが指定されなかった場合、**凍結中デバイス一覧の要求**と看做す
          - deviceIdの指定が無い場合、memberIdが使用する凍結中デバイス全てを対象とする
          - memberListシートのGoogle Spreadのメニューから管理者が実行することを想定
        `,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記
        // caller {Object[]} 本メソッドを呼び出す{class:クラス名,method:メソッド名}の配列

        params: [  // {Params} ■メソッド引数の定義■
          {name:'memberId',type:'string',note:'メンバ識別子',default:'null'},
          {name:'deviceId',type:'string',note:'デバイス識別子',isOpt:true},
        ],

        process: `
          - memberListシート全件を読み込み、\`[MemberDevice.status](MemberDevice.md#memberdevice_internal) === '凍結中'\`のデバイス一覧を作成
          - memberId無指定(=null)の場合、戻り値「一覧」を返して終了
          - 引数で渡されたmemberId, deviceIdがマッチするメンバ・デバイスを検索
          - 対象デバイスが存在しない場合、戻り値「該当無し」を返して終了
          - 凍結解除：対象デバイスそれぞれについて以下項目を更新
            <evaluate>comparisonTable({typeName:'MemberDevice',default:{},pattern:{'更新内容':{assign: {
              status: '"未認証"',
              trial: '空配列',
            }}}},'  ')</evaluate>

            <evaluate>comparisonTable({typeName:'MemberLog',default:{},pattern:{'更新内容':{assign: {
              unfreezeLogin: '現在日時',
            }}}},'  ')</evaluate>
          - [setMemberメソッド](#member_setmember)にMemberを渡してmemberListを更新
          - 戻り値「正常終了」を返して終了
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {  // 戻り値が複数のデータ型・パターンに分かれる場合
          authResponse: { // メンバ名は戻り値のデータ型名
            pattern: {
              '一覧': {assign:{
                result: '"normal"',
                request: 'list freezing',
                response: 'MemberDevice.status=="凍結中"とそのMember',
              }},
              '該当無し': {assign:{
                result: '"warning"',
                message: 'no frozen devices',
                request: '{memberId,deviceId:[引数で渡されたdeviceId]}',
                response: '更新前のMember',
              }},
              '正常終了': {assign:{
                result: '"normal"',
                message: 'no frozen devices',
                request: '{memberId,deviceId:[凍結解除したdeviceId]}',
                response: '更新<span style="color:red">後</span>のMember',
              }},
            }
          }
        },
      },
      updateCPkey: {
        type: 'public',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '対象メンバ・デバイスの公開鍵を更新する',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'request',type:'authRequest',note:'処理要求オブジェクト'},
        ],

        process: `
          - 引数チェック
            <evaluate>comparisonTable({typeName:'authRequest',default:{},pattern:{'確認内容':{assign: {
              func: '"::updateCPkey::"',
              arguments: '更新後CPkey',
            }}}},'  ')</evaluate>
            - 更新後CPkeyがRSAの公開鍵形式か(PEMフォーマットなど)チェック、不適合なら戻り値「鍵形式不正」を返して終了
          - メンバの状態チェック
            - request.memberIdを基に[getMemberメソッド](#member_getmember)を実行
            - メンバの状態が「不使用("result === fatal")」だった場合、[getMemberの戻り値](#member_getmember_returns)をそのまま戻り値として返して終了
            - **取得したMemberインスタンスをupdateCPkey内部のみのローカル変数**に格納。以下操作はローカル変数のMemberに対して行う。
          - デバイス存否チェック<br>
            request.deviceId(=現在登録済のCPkey)で対象デバイスを特定。特定不能なら戻り値「機器未登録」を返して終了
          - 管理情報の書き換え
            - CPkeyは書き換え
              <evaluate>comparisonTable({typeName:'MemberDevice',
                default:{CPkey:'更新後CPkey',CPkeyUpdated:'現在日時'},
                pattern:{
                  '更新項目':{assign: {}},
              }},'    ')</evaluate>
            - デバイスの状態は、未認証・凍結中はそのまま、試行中・認証中は未認証に戻す
              <evaluate>comparisonTable({typeName:'MemberLog',
                pattern:{
                  '未認証':{assign: {}},
                  '試行中':{assign: {
                    loginExpiration: 0,
                    loginRequest: 0,
                  }},
                  '認証中':{assign: {
                    loginExpiration: 0,
                    loginRequest: 0,
                  }},
                  '凍結中':{assign: {}},
              }},'    ')</evaluate>
          - 更新後のMemberを引数に[setMemberメソッド](#member_setmember)を呼び出し、memberListシートを更新<br>
            ※ setMember内でjudgeStatusメソッドを呼び出しているので、状態の最新化は担保
          - **CPkeyを更新するのはmemberListシートのみ**。インスタンス化された'Member.device'以下は更新しない<br>
            ※ authServer->authClientに送るencryptedResponseの暗号化は旧CPkeyで行い、authClient側ではauthServer側での処理結果を確認の上、新CPkeyへの置換を行うため
          - CPkey更新を監査ログに記録([authAuditLog.log](authAuditLog.md#authauditlog_log))
            <evaluate>comparisonTable({typeName:'authAuditLog',default:{},pattern:{'設定内容':{assign: {
              func: '"updateCPkey"',
              note: '旧CPkey -> 新CPkey',
            }}}},'  ')</evaluate>
          - 戻り値「正常終了」を返して終了(後続処理は戻り値(authResponse.message)で分岐先処理を判断)
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {  // 戻り値が複数のデータ型・パターンに分かれる場合
          authResponse: { // メンバ名は戻り値のデータ型名
            default: {request:'request'},
            condition: ``,	// {string} データ型が複数の場合の選択条件指定(trimIndent対象)
            note: ``,	// {string} 備忘(trimIndent対象)
            pattern: {
              '鍵形式不正':{assign:{
                result:'"fatal"',
                message: '"invalid public key"',
              }},
              '機器未登録':{assign:{
                result:'"fatal"',
                message: '"no matching key"',
              }},
              '正常終了':{assign:{
                response: '更新<span style="color:red">前</span>のMember',
              }},
            }
          }
        },
      },
    },
  },
  MemberDevice: {
    label: 'メンバのデバイス情報',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'メンバが使用する通信機器の情報(マルチデバイス対応)',	// {string} クラスとしての補足説明。概要欄に記載
    policy: `
      - [状態遷移図](Member.md#member_policy_statediagram)
      - [クラス図](classes.md#member_classdiagram)
    `,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'deviceId',type:'string',label:'デバイスの識別子。UUID',note:''},
      {name:'status',type:'string',label:'デバイスの状態',note:'未認証,認証中,試行中,凍結中',default:'未認証'},
      {name:'CPkey',type:'string',label:'メンバの公開鍵',note:''},
      {name:'CPkeyUpdated',type:'number',label:'最新のCPkeyが登録された日時',note:'',default:'Date.now()'},
      {name:'trial',type:'MemberTrial[]',label:'ログイン試行関連情報オブジェクト',note:'シート上はJSON文字列',default:[]},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {MemberDevice:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  MemberLog: {
    label: 'メンバの各種要求・状態変化の時刻',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: '',	// {string} クラスとしての補足説明。概要欄に記載
    policy: `
      - [状態遷移図](Member.md#member_policy_statediagram)
      - [クラス図](classes.md#member_classdiagram)
    `,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'joiningRequest', type:'number', label:'仮登録要求日時',note:'仮登録要求をサーバ側で受信した日時', default:'Date.now()'},
      {name:'approval', type:'number', label:'加入承認日時',note:'管理者がmemberList上で加入承認処理を行った日時。値設定は加入否認日時と択一', default:0},
      {name:'denial', type:'number', label:'加入否認日時',note:'管理者がmemberList上で加入否認処理を行った日時。値設定は加入承認日時と択一', default:0},
      {name:'loginRequest', type:'number', label:'認証要求日時',note:'未認証メンバからの処理要求をサーバ側で受信した日時', default:0},
      {name:'loginSuccess', type:'number', label:'認証成功日時',note:'未認証メンバの認証要求が成功した最新日時', default:0},
      {name:'loginExpiration', type:'number', label:'認証有効期限',note:'認証成功日時＋認証有効時間', default:0},
      {name:'loginFailure', type:'number', label:'認証失敗日時',note:'未認証メンバの認証要求失敗が確定した最新日時', default:0},
      {name:'unfreezeLogin', type:'number', label:'認証無効期限',note:'認証失敗日時＋認証凍結時間', default:0},
      {name:'joiningExpiration', type:'number', label:'加入有効期限',note:'加入承認日時＋加入有効期間', default:0},
      {name:'unfreezeDenial', type:'number', label:'加入禁止期限',note:'加入否認日時＋加入禁止期間', default:0},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {MemberLog:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
      prohibitJoining: {
        type: 'public',
        label: '「加入禁止」状態に変更する',
        params: [],

        process: `
          - joiningExpiration = 現在日時(UNIX時刻)
          - unfreezeDenial = 現在日時(UNIX時刻)＋[authServerConfig](authServerConfig.md#authserverconfig_internal).prohibitedToJoin
        `,

        returns: {MemberLog:{}},
      }
    },
  },
  MemberProfile: {
    label: 'メンバの属性情報',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: '',	// {string} クラスとしての補足説明。概要欄に記載
    policy: `
      - [状態遷移図](Member.md#member_policy_statediagram)
      - [クラス図](classes.md#member_classdiagram)
    `,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'authority',type:'number',label:'メンバの持つ権限',note:'authServerConfig.func.authorityとの論理積>0なら当該関数実行権限ありと看做す',default:0},
    ],

    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {MemberProfile:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  MemberTrial: {
    label: 'ログイン試行情報の管理・判定',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: '',	// {string} クラスとしての補足説明。概要欄に記載
    policy: `
      - [状態遷移図](Member.md#member_policy_statediagram)
      - [クラス図](classes.md#member_classdiagram)
    `,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'passcode',type:'string',label:'設定されているパスコード',note:'最初の認証試行で作成'},
      {name:'created',type:'number',label:'パスコード生成日時',note:'≒パスコード通知メール発信日時',default:'Date.now()'},
      {name:'log',type:'MemberTrialLog[]',label:'試行履歴',note:'常に最新が先頭(unshift()使用)。保持上限はauthServerConfig.trial.generationMaxに従い、上限超過時は末尾から削除する。',default:[]},
    ],

    methods: {
      constructor: {
        label: 'コンストラクタ',

        params: [
          {name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}
        ],

        process: `
          - this.passcode = [authServerConfig.trial.passcodeLength](authServerConfig.md#authserverconfig_internal)で設定された桁数の乱数
          - this.created = Date.now()
          - this.log = []
        `,

        returns: {  // {ReturnValues} ■(パターン別)メソッド戻り値の定義■
          MemberTrial: {}
        },
      },
      loginAttempt: {
        type: 'public',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '入力されたパスコードの判定',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Param[]} ■メソッド引数の定義■
          {name:'request',type:'authRequest',note:'ユーザが入力したパスコードを含む処理要求'},
        ],

        process: `
          - [MemberTrialLog](MemberTrialLog.md#membertriallog_constructor)を生成、this.logの先頭に保存(unshift())
          - \`this.log[0].result === true\`なら「正答時」を返す
          - \`this.log[0].result === false\`で最大試行回数([maxTrial](authServerConfig.md#authserverconfig_internal))未満なら「誤答・再挑戦可」を返す
          - \`this.log[0].result === false\`で最大試行回数以上なら「誤答・再挑戦不可」を返す
          - なお、シートへの保存は呼出元で行う
        `,	// {string} 処理手順。markdownで記載

        returns: {  // {ReturnValues} ■(パターン別)メソッド戻り値の定義■
          authResponse: { // メンバ名は戻り値のデータ型名
            default: {request:'引数"request"',value:'MemberTrialオブジェクト'},
            note: ``,	// {string} 備忘(trimIndent対象)
            pattern: {
              '正答時': {assign: {result:'normal'}},
              '誤答・再挑戦可': {assign: {result:'warning'}},
              '誤答・再挑戦不可': {assign: {result:'fatal'}},
            }
          }
        },
      },
    },
  },
  MemberTrialLog: {
    label: 'パスコード入力単位の試行記録',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: '',	// {string} クラスとしての補足説明。概要欄に記載
    policy: `
      - [状態遷移図](Member.md#member_policy_statediagram)
      - [クラス図](classes.md#member_classdiagram)
    `,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'entered',type:'string',label:'入力されたパスコード',note:''},
      {name:'result',type:'boolean',label:'試行結果',note:'正答：true、誤答：false'},
      {name:'timestamp',type:'number',label:'判定処理日時',note:'',default:'Date.now()'},
    ],
    methods: {
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'entered',type:'string',note:'入力されたパスコード'},
          {name:'result',type:'boolean',note:'試行結果'},
        ],

        process: `
          - this.entered = entered
          - this.result = result
          - this.timestamp = Date.now()
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {MemberTrialLog:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
};

(()=>{  // クラス別Markdown＋クラス一覧作成
  function analyzeArg(){
    const v = {whois:'analyzeArg',rv:{opt:{},val:[]}};
    try {
      for( v.i=2 ; v.i<process.argv.length ; v.i++ ){
        v.m = process.argv[v.i].match(/^(\-*)([0-9a-zA-Z]+):*(.*)$/);
        if( v.m && v.m[1].length > 0 ){
          v.rv.opt[v.m[2]] = v.m[3];
        } else {
          v.rv.val.push(process.argv[v.i]);
        }
      }
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /**
   * 与えられた文字列から、先頭末尾の空白行と共通インデントを削除する
   * @param {string} str - 対象文字列（複数行）
   * @returns {string} 加工後の文字列
   */
  function trimIndent(str) {
    // 1. 先頭・末尾の空白行削除
    if( !str ) return '';
    const lines = str.replace(/^\s*\n+|\n+\s*$/g, '').split('\n');
    if( lines.length === 0 ) return '';

    // 2. 1行だけの場合、先頭のスペースを削除して終了
    if( lines.length === 1 ) return lines[0].trim();

    // 3. 複数行の場合、各行の共通インデント(スペース・タブ)を取得
    const indents = lines
      .filter(line => line.trim() !== '')
      .map(line => line.match(/^[ \t]*/)[0].length);
    const minIndent = indents.length ? Math.min(...indents) : 0;

    // 4. 共通インデントを削除、各行を結合した文字列を返す
    return lines.map(line => line.slice(minIndent)).join('\n');
  }

  /**
   * 文字列の中にevaluateタグがあれば、evalの評価結果で置換
   * @param {string} str 
   */
  function evaluate(str){

    return str.replace(
      /^([ \t]*)<evaluate>([\s\S]*?)<\/evaluate>/gm,
      (_, indent, code) => {
        try {
          // その場で評価（comparisonTableが使えるスコープ）
          const result = eval(code);  // 戻り値は{string[]}
          return (typeof result === 'string' ? result : result.join('\n'));
        } catch (e) {
          console.error('Error evaluating block:', e);
          return `[EVAL ERROR: ${e.message}]`;
        }
      }
    );

  }

  /**
   * @typedef {Object} classDef
   * @prop {string} typeName - 対象元(投入先)となるclassdef(cdef)上のクラス名
   * @prop {Object.<string,string>} [default] - 各パターンの共通設定値。表記方法はassignと同じ
   * @prop {Object} pattern - 設定パターン集
   * @prop {Object.<string,string>} pattern.assign - 当該パターンの設定値
   *   // ex. pattern: {'正常時':{assign:{result:'normal'}},'異常時':{assign:{result:'fatal'}}}
   *   //     patternの孫要素に'assign'が無い場合、子要素=assignでcondition/noteは省略と看做す。
   *   // ex. pattern: {'正常時':{result:'normal'},'異常時':{result:'fatal'}}
   * @prop {string} [pattern.condition] - 該当条件(trimIndent対象)
   * @prop {string} [pattern.note] - 備忘(trimIndent対象)
   */
  /** comparisonTable: 原本となるクラスの各要素と、それぞれに設定する値の対比表を作成
   * @param {classDef} arg - 原本となるデータ型(クラス)の情報オブジェクト
   * @param {string} [indent=''] - 各行の先頭に付加するインデント文字列
   */
  function comparisonTable(arg,indent=''){
    const rv = [];
    const dataLabels = Object.keys(arg.pattern);
    const header = ['項目名','データ型','生成時', ...dataLabels];

    if( typeof cdef[arg.typeName] !== 'undefined' ){
      ['',  // ヘッダー行
        `${indent}- [${arg.typeName}](${arg.typeName}.md#${arg.typeName.toLowerCase()}_internal): ${cdef[arg.typeName].label}`,
        `${indent+'  '}| ${header.join(' | ')} |`,
        `${indent+'  '}| ${header.map(() => ':--').join(' | ')} |`,
      ].forEach(x => rv.push(x));

      // 各メンバ行
      cdef[arg.typeName].members._list.forEach(x => {  // 戻り値データ型のメンバ名を順次呼出
        const m = cdef[arg.typeName].members[x];
        const cells = [
          m.name,
          m.type,
          m.default !== '—' ? m.default : (m.isOpt ? '【任意】' : '【必須】'),
          ...dataLabels.map(label => typeof arg.pattern[label].assign[x] === 'undefined'
            ? ( typeof arg.default !== 'undefined' && typeof arg.default[x] !== 'undefined'
            ? arg.default[x] : '—' ) : `**${arg.pattern[label].assign[x]}**`)
        ];
        rv.push(`${indent+'  '}| ${cells.join(' | ')} |`);
      });
    } else {
      console.error(`l.1911 cdef=${JSON.stringify(Object.keys(cdef))}`);
      console.error(`comparisonTable error: cdef[arg.typeName]=${cdef[arg.typeName]}\narg=${JSON.stringify(arg,null,2)}`);
    }

    return rv;

  }

  /**  */
  class ClassDef {
    constructor(className,arg){
      this.className = className;  // {string} クラス名
      this.label = arg.label || ''; // {string} 端的なクラスの説明。ex.'authServer監査ログ'
      this.note = trimIndent(arg.note || ''); // {string} クラスとしての補足説明。概要欄に記載
      this.policy = trimIndent(arg.policy || ``); // {string} 設計方針欄(trimIndent対象)
      this.inherit = arg.inherit || ''; // {string} 親クラス名
      this.defaultVariableName = arg.defaultVariableName || ''; // {string} 変数名の既定値。ex.(pv.)"audit"
      this.example = trimIndent(arg.example || ''); // {string} 想定する実装・使用例(Markdown,trimIndent対象)
      this.members = new Members(className,arg.members); // メンバ(インスタンス変数)定義
      this.methods = new Methods(className,arg.methods); // メソッド定義
      this.navi = arg.navi || ''; // {string} クラス内ナビ
    }

    /** Markdownの作成 */
    md(){
      const rv = [];
      const cn = this.className.toLowerCase();

      // 1.概要
      [
        `# <span id="${cn}">${this.className} クラス仕様書</span>`,
        ...(this.navi.length > 0 ? ['',this.navi] : []),
        '',`## <span id="${cn}_summary">🧭 概要</span>`,
        '',this.label
      ].forEach(x => rv.push(x));
      if( this.note.length > 0 ){
        ['',this.note].forEach(x => rv.push(x));
      }

      // 1.1 設計方針
      if( this.policy.length > 0 ){
        [
          '',`### <span id="${cn}_policy">設計方針</span>`,'',
          this.policy
        ].forEach(x => rv.push(x));
      }

      // 1.2 実装例
      if( this.example.length > 0 ){
        [
          '',`### <span id="${cn}_example">実装・使用例</span>`,'',
          this.example
        ].forEach(x => rv.push(x));
      }

      // 1.3 内部構成
      // 1.3.1 メンバ一覧
      ['',`### 🧩 <span id="${cn}_internal">内部構成</span>`,
        ...this.members.md()].forEach(x => rv.push(x));

      // 1.3.2 メソッド一覧
      this.methods.list().forEach(x => rv.push(x));

      // 2.メソッド
      this.methods.md().forEach(x => rv.push(x));

      // 3.メンテナンス処理
      // 4.セキュリティ仕様
      // 5.エラーハンドリング仕様
      // 6.ログ出力仕様

      return rv.join('\n');
    }

    /** 二次設定項目 */
    secondary(){
      this.methods.secondary();
    }
  }

  /** メンバ(集合)の定義 */
  class Members {
    constructor(className,arg){
      this.className = className;
      this._list = []; // {string[]} 定義順のメンバ名一覧
      arg.forEach(x => {
        this._list.push(x.name);
        this[x.name] = new Member(className,x);
      });
    }

    /** Markdown形式のメンバ一覧作成 */
    md(){
      /*
      ### 🧩 <span="membertrial_internal">内部構成</span>

      🔢 メンバ一覧

      🧱 <span id="membertrial_method">メソッド一覧</span>
      */
      const rv = [];
      if( this._list.length > 0 ){
        ['',`🔢 ${this.className} メンバ一覧`,'',
          '| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |',
          '| :-- | :-- | :-- | :-- | :-- | :-- |'
        ].forEach(x => rv.push(x));
        this._list.forEach(x => rv.push(this[x].md()));
      }
      rv.push('');
      return rv;
    }
  }

  /** メンバ(単体)の定義 */
  class Member {
    constructor(className,arg){
      this.className = className;
      this.name = arg.name || ''; // {string} メンバ名(変数名)。英数字表記
      this.type = arg.type || 'string'; // {string} データ型
      this.label = arg.label || ''; // {string} 端的な項目説明。ex."サーバ側処理結果"
      this.note = arg.note || '';
        // {string|string[]} 当該項目に関する補足説明。ex."fatal/warning/normal"
      this.default = arg.default || '—';
        // {any} 関数の場合'=Date.now()'のように記述
      this.isOpt = this.default !== '—' ? true  : (arg.isOpt || false);
        // {boolean} 任意項目はtrue。defaultが設定されたら強制的にtrue
    }

    /** Markdownの作成 */
    md(){
      // 項目名 任意 データ型 既定値 説明 備考
      // データ型が本仕様書内のデータ型の場合はリンクを作成
      return `| ${this.name} | ${this.isOpt?'⭕':'❌'} | ${
        typeof cdef[this.type] === 'undefined'
        ? this.type : `[${this.type}](${this.type}.md#${this.type.toLowerCase()}_internal)`
      } | ${
        typeof this.default === 'object' && this.default !== null
        ? JSON.stringify(this.default) : this.default
      } | ${this.label} | ${this.note} | `;
    }
  }

  /** メソッド(集合)の定義 */
  class Methods {
    constructor(className,arg){
      this.className = className;
      this._list = [];
      this._map = {}; // リンクで使用する小文字のメソッド名から、大文字を含めたメソッド名に変換
      Object.keys(arg).forEach(x => {
        this._list.push(x);
        this._map[x.toLowerCase()] = x;
        this[x] = new Method(className,x,arg[x])
      });
    }

    /** Markdownの作成 */
    md(){
      // メソッドオブジェクト(Method)を順次呼び出し、md()の結果を戻り値に追加
      const rv = [];
      this._list.forEach(x => this[x].md().forEach(l => rv.push(l)));
      return rv;
    }

    /** Markdown形式の一覧作成 */
    list(){
      const rv = ['',`🧱 <span id="${this.className.toLowerCase()}_method">${this.className} メソッド一覧</span>`,''];
      if( this._list.length === 0 ){
        rv.push(`- メソッド無し`);
      } else {
        ['| メソッド名 | 型 | 内容 |','| :-- | :-- | :-- |'].forEach(x => rv.push(x));
        this._list.forEach(x => rv.push(this[x].list()));
      }
      return rv;
    }

    /** 二次設定項目 */
    secondary(){
      this._list.forEach(x => this[x].secondary());
    }
  }

  /** メソッド(単体)の定義 */
  class Method {
    constructor(className,methodName,arg){
      this.className = className; // メソッドが所属するクラス名。引数から自動設定
      this.methodName = methodName; // メソッド名。引数から自動設定
      this.type = arg.type || 'private'; // {string} static:クラスメソッド、public:外部利用可、private:内部専用
      this.label = arg.label || ''; // {string} 端的なメソッドの説明。ex.'authServer監査ログ'
      this.note = trimIndent(arg.note || ''); // {string} 注意事項。markdownで記載
      this.source = trimIndent(arg.source || ''); // {string} 想定するJavaScriptソース
      this.lib = arg.lib || []; // {string[]} 本メソッドで使用するライブラリ
      this.caller = arg.caller || []; // {string[]} 本メソッドを呼び出す"クラス.メソッド名"

      this.params = new Params(className,methodName,arg.params); // 引数
      this.process = trimIndent(arg.process || '');  // {string} 処理手順。markdownで記載
      this.returns = new Returns(className,methodName,arg.returns);  // 戻り値の定義(パターン別)
    }

    /** Markdownの作成 */
    md(){
      const cn = this.className.toLowerCase();
      const mn = this.methodName.toLowerCase();
      const cc = `${cn}_${mn}`;

      // 概要＋注意事項
      const rv = ['',
        `## <span id="${cc}">🧱 <a href="#${cn}_method">${this.className}.${this.methodName}()</a></span>`,
        '', this.label
      ];
      if( this.note ){
        ['', this.note].forEach(x => rv.push(x));
      }

      // 実装例
      if( this.source ){
        ['',`### <span id="{cc}_source">📄 実装例</span>`,'',this.source].forEach(x => rv.push(x));
      }

      // 引数
      this.params.list().forEach(x => rv.push(x));

      // 処理手順
      ['',`### <span id="${cc}_process">🧾 処理手順</span>`,'',this.process].forEach(x => rv.push(x));

      // 戻り値
      this.returns.md().forEach(x => rv.push(x));

      return rv;
    }

    /** Markdown形式の一覧(行)作成 */
    list(){
      return `| [${this.methodName}](#${this.className.toLowerCase()}_${this.methodName.toLowerCase()
        }) | ${this.type} | ${this.label} |`;
    }

    /** 二次設定項目 */
    secondary(){
      const links = [];

      // 外部リンク
      const rexF = /\[([^\]]+)\]\(([^)]+)\.md#([a-z0-9]+)_([a-z0-9]+)\)/gi;
      let m;
      while ((m = rexF.exec(this.process)) !== null) {
        // m[1]=①, m[2]=②, m[3]=③, m[4]=④
        //links.push([m[1], m[2], m[3], m[4]]);
        links.push({
          linkText: m[1],
          className: m[2],  // 参照先のクラス名(大文字含む)
          lowerCase: m[3],  // 参照先のクラス名(小文字のみ)
          methodName: m[4], // 当該クラスのメソッド名(小文字のみ)
        })
      }

      // ローカルリンク
      const rexL = /\[([^\]]+)\]\(#([a-z0-9]+)_([a-z0-9]+)\)/gi;
      while ((m = rexL.exec(this.process)) !== null) {
        // m[1]=①, m[2]=②, m[3]=③, m[4]=④
        //links.push([m[1], m[2], m[3], m[4]]);
        links.push({
          linkText: m[1],
          className: this.className,  // 参照先のクラス名(大文字含む)
          lowerCase: m[2],  // 参照先のクラス名(小文字のみ)
          methodName: m[3], // 当該クラスのメソッド名(小文字のみ)
        })
      }

      // 参照先メソッドのcallerにリンク元メソッドを追加
      if( links.length > 0 ){
        links.forEach(link => {
          const methods = cdef[link.className].methods; // 参照先クラスのメソッド(集合)
          if( typeof methods._map[link.methodName] !== 'undefined' ){
            const methodName = methods._map[link.methodName]; // 大文字含むメソッド名に変換
            const caller = cdef[link.className].methods[methodName].caller;
            if( !(caller.find(x => x.class === this.className && x.method === this.methodName))){
              // caller未登録なら追加登録
              caller.push({class:this.className,method:this.methodName});
            }
          }
        });
      }

      // evaluateタグの処理
      this.process = evaluate(this.process);
    }
  }

  /** メソッドの引数(集合)定義 */
  class Params {
    constructor(className,methodName,arg){
      this.className = className;
      this.methodName = methodName;
      this._list = []; // 定義順の引数名一覧
      arg.forEach(o => {
        this._list.push(o.name);
        this[o.name] = new Param(className,methodName,o)
      });
    }

    /** Markdown形式の引数一覧作成 */
    list(){
      const rv = [];
      const cn = this.className.toLowerCase();
      const mn = this.methodName.toLowerCase();
      const cc = `${cn}_${mn}`;

      // 呼出元関数(メソッド)へのリンク
      if( cdef[this.className].methods[this.methodName].caller.length > 0 ){
        ['',`### <span id="${cc}_caller">📞 呼出元</span>`,''].forEach(x => rv.push(x));
        cdef[this.className].methods[this.methodName].caller.forEach(x => {
          //console.log(JSON.stringify({caller:{class:x.class,method:x.method},callee:{class:this.className,method:this.methodName}},null,2));
          rv.push(`- [${x.class}.${x.method}()](${x.class}.md#${cc})`);
        })
      }

      // 引数一覧
      ['',`### <span id="${cc}_param">📥 引数</span>`,''].forEach(x => rv.push(x));

      if( this._list.length === 0 ){
        ['',`- 無し(void)`].forEach(x => rv.push(x));
      } else {
        ['','| 項目名 | 任意 | データ型 | 既定値 | 説明 |','| :-- | :--: | :-- | :-- | :-- |']
        .forEach(x => rv.push(x));
        this._list.forEach(x => this[x].list().forEach(l => rv.push(l)));
      }
      return rv;
    }
  }

  /** メソッドの引数(単体)定義 */
  class Param {
    constructor(className,methodName,arg){
      this.className = className;
      this.methodName = methodName;
      this.name = arg.name || ''; // 引数としての変数名
      this.type = arg.type || ''; // データ型
      this.default = arg.default || '—'; // 既定値
      this.note = arg.note || ''; // 項目の説明
      this.isOpt = this.default !== '—' ? true : (arg.isOpt || false);  // 任意項目ならtrue
    }

    /** Markdown形式の一覧作成 */
    list(){
      // 引数が複数のデータ型の場合、分割して個別に作成(ex.{Member|authRequest})
      const types = [];
      this.type.split('|').forEach(type => {
        type = type.trim();
        const typeName = type.replace(/\[\]/g, ''); // 配列を示す'[]'は削除
        types.push(typeof cdef[typeName] === 'undefined' ? type
          // 定義済のデータ型ならそのメンバ一覧へのリンクを設定
          : `[${type}](${typeName}.md#${typeName.toLowerCase()}_internal)`);
      });

      // 項目名 任意 データ型 既定値 備考
      return [`| ${this.name} | ${this.isOpt?'⭕':'❌'} | ${types.join(' \\| ')} | ${
        typeof this.default === 'object' && this.default !== null
        ? JSON.stringify(this.default) : this.default
      } | ${this.note} | `];
    }
  }

  /** メソッドの戻り値(集合)定義 */
  class Returns {
    constructor(className,methodName,arg){
      this.className = className;
      this.methodName = methodName;
      this._list = [];

      Object.keys(arg).forEach(typeName => {
        this._list.push(typeName);
        this[typeName] = new Return(className,methodName,typeName,arg[typeName]);
      });
    }

    /** Markdownの作成 */
    md(){
      /* 出力サンプル
      ### <span id="authserver_constructor_returns">📤 戻り値</span>
      ※ Return.md()の結果を追加
      */
      const cn = this.className.toLowerCase();
      const mn = this.methodName.toLowerCase();
      const cc = `${cn}_${mn}`;
      const rv = ['',`### <span id="${cc}_returns">📤 戻り値</span>`];

      this._list.forEach(x => this[x].md().forEach(l => rv.push(l)));
      return rv;
    }
  }

  /** メソッドの戻り値定義(データ型別) */
  class Return {
    constructor(className,methodName,typeName,arg){
      this.className = className;
      this.methodName = methodName;
      this.typeName = typeName; // 戻り値のデータ型

      this.default = arg.default || {}; // {Object.<string,string>} 各パターンの共通設定値
      this.condition = trimIndent(arg.condition || '');
        // {string} データ型が複数の場合の選択条件指定(trimIndent対象)
      this.note = trimIndent(arg.note || ''); // {string} 備忘(trimIndent対象)

      const org = {}; // 基となるデータ型からの引用項目として、全項目「—」設定
      if( typeof classdef[typeName] !== 'undefined' ){
        classdef[typeName].members.forEach(x => org[x.name] = '—');
      }

      // パターン指定が無い場合「正常終了」を追加
      if( Object.keys(arg.pattern || {}).length === 0 ){
        arg.pattern = {'正常終了':{assign:{}}};
      }

      // パターン別のオブジェクト作成
      this.pattern = {};
      Object.keys(arg.pattern).forEach(x => {
        if( typeof arg.pattern[x].assign === 'undefined' ){
          arg.pattern[x].assign = {};
        }

        this.pattern[x] = {
          patternName: x,  // パターン名
          assign: arg.pattern[x].assign,
          condition: trimIndent(arg.pattern[x].condition || ''),
          note: trimIndent(arg.pattern[x].note || ''),
        };
      });
    }

    /** Markdownの作成 */
    md(){
      return comparisonTable(this,'  ');
    }
  }

  /** メイン処理 */
  const fs = require("fs");
  const arg = analyzeArg();
  const cdef = {};

  // データ(cdef)生成
  Object.keys(classdef).forEach(x => cdef[x] = new ClassDef(x,classdef[x]));

  // 二次設定項目(caller)のセット
  //   cdef生成を一次設定としたとき、生成後の状態での検索・設定が必要になる項目のセット
  Object.keys(cdef).forEach(x => cdef[x].secondary());

  // Markdown作成
  const classList = ['| No | クラス名 | 概要 |','| --: | :-- | :-- |'];
  let cnt = 1;
  Object.keys(cdef).forEach(x => {
    // jsonはデバッグ用に出力、割愛可
    fs.writeFileSync(`${arg.opt.o}/${x}.json`, JSON.stringify(cdef[x],null,2));
    fs.writeFileSync(`${arg.opt.o}/${x}.md`, cdef[x].md());

    // クラス一覧に追加
    classList.push(`| ${cnt++} | [${x}](${x}.md) | ${cdef[x].label} |`);
  });
  fs.writeFileSync(`${arg.opt.o}/classList.md`, classList.join('\n'));

})();