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

    members: [  // {Members} ■メンバ(インスタンス変数)定義■
      //{name:'',type:'string',label:'',note:''}, // default,isOpt
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

        params: [],

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
      \`\`\`js
      class authClient {
        constructor(){
          this.pv = {
            member: new Member(),
            audit: new authAuditLog(),
            error: new authErrorLog(),
          };
        }
      }
      \`\`\`

      \`\`\`html
      <script type="text/javascript">
        function devTools(){
          // (中略)
        }
        // その他ライブラリ

        const dev = devTools();
        window.addEventListener('DOMContentLoaded', () => {
          const v = { whois: 'DOMContentLoaded', rv: null };
          dev.start(v.whois, [...arguments]);
          try {

            const ac = authClient();
            // (中略)

            dev.end(); // 終了処理
            return v.rv;
          } catch (e) { dev.error(e); return e; }
        });
      </script>
      \`\`\`
    `,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'cf',type:'authClientConfig',label:'動作設定変数(config)',note:''}, // default,isOpt
      {name:'crypto',type:'cryptoClient',label:'暗号化・復号用インスタンス',note:''}, // default,isOpt
      {name:'idb',type:'authIndexedDB',label:'IndexedDB共有用',note:'IndexedDBの内容をauthClient内で共有'}, // default,isOpt
    ],

    methods: { // {Method} ■メソッド定義■
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Param[]} ■メソッド引数の定義■
          {name:'config',type:'authClientConfig',note:'authClientの動作設定変数'},
        ],

        process: `
          - 本クラスのメンバとして存在する引数のメンバはauthClient内共有用の変数"cf"に保存(存在しない引数のメンバは廃棄)
          - "crypto"に[cryptoClient](cryptoClient.md#cryptoclient_constructor)を生成、鍵ペアを準備
          - "idb"に[authIndexedDB](authIndexedDB.md#authindexeddb_constructor)を生成、IndexedDBの内容を取得
          - idb.deviceId未採番なら採番(UUID)
          - idb.SPkey未取得ならサーバ側に要求
          - 更新した内容はIndexedDBに書き戻す
          - SPkey取得がエラーになった場合、SPkey以外は書き戻す
          - IndexedDBの内容はauthClient内共有用変数"pv"に保存
          - サーバ側から一定時間レスポンスが無い場合、{result:'fatal',message:'No response'}を返して終了

          \`\`\`mermaid
          sequenceDiagram

            actor user
            participant localFunc
            %%participant clientMail
            %%participant cryptoClient
            participant IndexedDB
            participant authClient
            participant authServer
            %%participant memberList
            %%participant cryptoServer
            %%participant serverFunc
            %%actor admin

            %% IndexedDB格納項目のメンバ変数化 ----------
            alt IndexedDBのメンバ変数化が未了
              IndexedDB->>+authClient: 既存設定値の読み込み(authIndexedDB)
              authClient->>authClient: メンバ変数に保存、鍵ペア未生成なら再生成
              alt 鍵ペア未生成
                authClient->>IndexedDB: authIndexedDB
              end
              alt メールアドレス(memberId)未設定
                authClient->>user: ダイアログ表示
                user->>authClient: メールアドレス
              end
              alt メンバの氏名(memberName)未設定
                authClient->>user: ダイアログ表示
                user->>authClient: メンバ氏名
              end
              alt SPkey未入手
                authClient->>+authServer: CPkey(平文の文字列)

                %% 以下2行はauthServer.responseSPkey()の処理内容
                authServer->>authServer: 公開鍵か形式チェック、SPkeyをCPkeyで暗号化
                authServer->>authClient: encryptedResponse(CPkeyで暗号化されたSPkey)

                alt 待機時間内にauthServerから返信有り
                  authClient->>authClient: encryptedResponseをCSkeyで復号、メンバ変数に平文で保存
                else 待機時間内にauthServerから返信無し
                  authClient->>localFunc: エラーオブジェクトを返して終了
                end
              end
              authClient->>-IndexedDB: メンバ変数を元に書き換え
            end
          \`\`\`
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

        returns: [{  // {ReturnValues} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'authClientKeys', // {string} データ型。authResponse等
        }],
      },
    },
  },
  authConfig: { 
    label: 'authClient/authServer共通設定値',
    note: 'authClientConfig, authServerConfigの親クラス',
    policy: ``,
    inherit: '', // 親クラス名
    defaultVariableName: '',

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

        params: [],

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
          - SPkey未設定の場合、authServerにauthRequestを要求、SPkeyをセット
            - 

          - authClientConfig.auditLogシートが無ければ作成
          - 引数の内、authIndexedDBと同一メンバ名があればthisに設定
          - 引数にnoteがあればthis.noteに設定
          - timestampに現在日時を設定
        `,	// {string} 処理手順。markdownで記載

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

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'memberId',type:'string',label:'メンバの識別子',note:'=メールアドレス'},
      {name:'deviceId',type:'string',label:'デバイスの識別子',note:''},
      {name:'signature',type:'string',label:'クライアント側署名',note:''},
      {name:'requestId',type:'string',label:'要求の識別子',note:'UUID'},
      {name:'timestamp',type:'number',label:'要求日時',note:'UNIX時刻'},
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

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {authScriptProperties:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  authServer: {
    label: 'サーバ側auth中核クラス',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

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

        returns: {authServer:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  authServerConfig: {
    label: 'authServer専用の設定値',  // 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authConfigを継承した、authServerでのみ使用する設定値', // クラスとしての補足説明
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: 'authConfig', // 親クラス名
    defaultVariableName: 'cf',  // 変数名の既定値。ex.(pv.)"audit"

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
      cOnstructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: ``,	// {string} 注意事項。markdownで記載
        source: ``,	// {string} 想定するJavaScriptソース(trimIndent対象)
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {cryptoClient:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  cryptoServer: {
    label: 'サーバ側の暗号化・復号処理',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

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

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{},isOpt:true},
        ],

        process: ``,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {cryptoServer:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  decryptedRequest: {
    label: '復号済の処理要求',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'encryptedRequestをcryptoServerで復号した処理要求オブジェクト',	// {string} クラスとしての補足説明。概要欄に記載
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'result',type:'string',label:'処理結果',note:'"fatal"(後続処理不要なエラー), "warning"(後続処理が必要なエラー), "normal"'},
      {name:'message',type:'string',label:'エラーメッセージ',note:'result="normal"の場合`undefined`',isOpt:true},
      {name:'request',type:'authRequest',label:'ユーザから渡された処理要求',note:''},
      {name:'timestamp',type:'number',label:'復号処理実施日時',note:''},
      {name:'status',type:'string',label:'ユーザ・デバイス状態',note:'Member.deviceが空ならメンバの、空で無ければデバイスのstatus'},
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

      - [クラス図](classes.md#member_classdiagram)
      `,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'memberId',type:'string',label:'メンバの識別子',note:'メールアドレス',default:'UUID'},
      {name:'name',type:'string',label:'メンバの氏名',note:'',default:'"dummy"'},
      {name:'status',type:'string',label:'メンバの状態',note:'未加入,未審査,審査済,加入中,加入禁止',default:'"未加入"'},
      {name:'log',type:'MemberLog',label:'メンバの履歴情報',note:'シート上はJSON文字列',default:'new MemberLog()'},
      {name:'profile',type:'MemberProfile',label:'メンバの属性情報',note:'シート上はJSON文字列',default:'new MemberProfile()'},
      {name:'device',type:'MemberDevice[]',label:'デバイス情報',note:'マルチデバイス対応のため配列。シート上はJSON文字列',default:'空配列'},
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
      removeMember: {
        type: 'public',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
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
            - 監査ログに「物理削除」を記録
            - 戻り値「物理削除」を返して終了
          - 論理削除の場合("physical === false")
            - 既に「加入禁止」なら戻り値「加入禁止」を返して終了
            - シート上に確認のダイアログを表示、キャンセルが選択されたら戻り値「キャンセル」を返して終了
            - [MemberLog.prohibitJoining](MemberLog.md#memberlog_prohibitjoining)で加入禁止状態に変更
            - [setMember](#member_setmember)にMemberを渡してmemberListを更新
            - 監査ログに「論理削除」を記録
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

    members: [  // {Member} ■メンバ(インスタンス変数)定義■
      {name:'joiningRequest', type:'number', label:'加入要求日時',note:'加入要求をサーバ側で受信した日時', default:'Date.new()'},
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

    // 4. evaluateタグ内部を評価
    const replaced = lines.map(line => line.slice(minIndent)).join('\n').replace(
      /^([ \t]*)<evaluate>([\s\S]*?)<\/evaluate>/gm,
      (_, indent, code) => {
        try {
          // その場で評価（comparisonTableが使えるスコープ）
          const result = eval(code);
          return typeof result === 'string' ? result : result.join('\n');
        } catch (e) {
          console.error('Error evaluating block:', e);
          return `${indent}[EVAL ERROR: ${e.message}]`;
        }
      }
    );

    return replaced;
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
          ...dataLabels.map(label => arg.pattern[label].assign[x] ?? arg.default[x] ?? '—')
        ];
        rv.push(`${indent+'  '}| ${cells.join(' | ')} |`);
      });
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
    }

    /** Markdownの作成 */
    md(){
      const rv = [];
      const cn = this.className.toLowerCase();

      // 1.概要
      [
        `# <span id="${cn}">${this.className} クラス仕様書</span>`,'',
        `## <span id="${cn}_summary">🧭 概要</span>`,'',
        this.label
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
      /*
      ## <span id="authserver_constructor">🧱 <a href="#authserver_method">constructor()</a></span>

        (概要＋注意事項)

      ### <span id="authserver_constructor_param">📥 引数</span>
      ※ Params.list()で作成

      ### <span id="authserver_constructor_returns">📤 戻り値</span>
      ※ Returns.md()で作成

      ### <span id="constructor-process">🧾 処理手順</span>

      - authServer内共有用の変数`pv`オブジェクトを用意
      - `pv.crypto`にcryptoServerインスタンスを作成
      - 監査ログ用に`pv.audit`に[authAuditLog](typedef.md#authAuditLog)インスタンスを作成
      - エラーログ用に`pv.error`に[authErrorLog](typedef.md#authErrorLog)インスタンスを作成
      */

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

      if( links.length > 0 ){
        links.forEach(link => {
          const methods = cdef[link.className].methods; // 参照先クラスのメソッド(集合)
          if( typeof methods._map[link.methodName] !== 'undefined' ){
            const methodName = methods._map[link.methodName]; // 大文字含むメソッド名に変換
            const caller = cdef[link.className].methods[methodName].caller;
            caller.push({class:this.className,method:this.methodName}); // callerに追加
          }
        });
      }
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
        types.push(typeof cdef[type] === 'undefined' ? type
          // 定義済のデータ型ならそのメンバ一覧へのリンクを設定
          : `[${type}](${type}.md#${type.toLowerCase()}_internal)`);
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
        } else {
          // パターン特有の設定値は強調表示 ⇒ comparisonTableに機能移管
          //Object.keys(arg.pattern[x].assign).forEach(key =>
          //  arg.pattern[x].assign[key] = `**${arg.pattern[x].assign[key]}**`);
          // 「パターン特有設定値 > データ型共通設定値 > 基となるデータ型の引用項目」を設定
          arg.pattern[x].assign = Object.assign({},org,this.default,arg.pattern[x].assign);
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
      /* 出力サンプル
      - [authResponse](authResponse.md): 暗号化前の処理結果
        | 項目名 | データ型 | 生成時 | 正常終了 | 異常終了 |
        | :-- | :-- | :-- | :-- | :-- |
        | timestamp | number | Date.now() | — | — |
        | result | string | "normal" | "**normal**" | "**fatal**" |
        | message | string　| ⭕ | — | "Invalid request" |
        | request | authRequest | ⭕ | request | request |
        | response | string | ⭕ | true | false |

        "className": "MemberTrial",
        "methodName": "loginAttempt",
        "typeName": "authResponse",
        "default": {
          "request": "引数\"request\"",
          "value": "MemberTrialオブジェクト"
        },
        "condition": "",
        "note": "",
        "pattern": {
          "正答時": {
            "patternName": "正答時",
            "assign": {
              "request": "引数\"request\"",
              "value": "MemberTrialオブジェクト",
              "result": "**normal**"
            },
            "condition": "",
            "note": ""
          },
          "誤答・再挑戦可": {
            (中略)
          }
        }
      }
      */
      /*const rv = ['',`- [${this.typeName}](${this.typeName}.md#internal): ${
        cdef[this.className].label}`];

      comparisonTable(this,'  ').forEach(x => rv.push(x));

      return rv;*/
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
    //fs.writeFileSync(`${arg.opt.o}/${x}.md`, JSON.stringify(cdef[x],null,2));
    fs.writeFileSync(`${arg.opt.o}/${x}.md`, cdef[x].md());

    // クラス一覧に追加
    classList.push(`| ${cnt++} | [${x}](${x}.md) | ${cdef[x].label} |`);
  });
  fs.writeFileSync(`${arg.opt.o}/classList.md`, classList.join('\n'));

})();