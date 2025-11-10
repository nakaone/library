/*  classdefメンバの書き方
  className: {  // {ClassDef} ■クラス定義■
    // className {string} クラス名
    label: '',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    policy: ``,	// {string} 設計方針欄(trimIndent対象)
    inherit: '',	// {string} 親クラス名
    example: ``,	// {string} 想定する実装・使用例(Markdown,trimIndent対象)
    navi: '', // {string} クラス内ナビ
    implement:{client:false,server:false},  // 実装の有無

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
        rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

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
          - メンバと引数両方にある項目は、引数の値をメンバとして設定

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
/*  classコア
  className: {
    label: '',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement:{client:false,server:false},  // 実装の有無

    members: [  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'',type:'string',label:'',note:''},
    ],

    methods: { // {Methods} ■メソッド定義■
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:'{}'},
        ],

        process: `
          - メンバと引数両方にある項目は、引数の値をメンバとして設定
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {authResponse:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
*/
console.log(JSON.stringify({
  authAuditLog: {
    label: 'authServerの監査ログ',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
      - 監査ログ出力が必要なメソッドの冒頭でインスタンス化、処理開始時刻等を記録
      - 出力時にlogメソッドを呼び出して処理時間を計算、シート出力
    `,	// {string} クラスとしての補足説明。概要欄に記載
    implement:{client:false,server:true},  // 実装の有無

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

        params: [
        ],

        process: `
        `,

        returns: {authAuditLog:{}},
      },
    },
  },
  authConfig: {
    label: 'authClient/authServer共通設定値',
    note: 'authClientConfig, authServerConfigの親クラス',
    implement:{client:true,server:true},  // 実装の有無

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
        rev: 1, // {number} 0:未着手 1:完了 0<n<1:作成途中

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:{}},
        ],

        process: `
          - メンバと引数両方にある項目は、引数の値をメンバとして設定
        `,	// {string} 処理手順。markdownで記載

        returns: {authConfig:{}},
      },
    },
  },
  authClientConfig: {
    label: '',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement:{client:false,server:false},  // 実装の有無

    members: [  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'',type:'string',label:'',note:''},
    ],

    methods: { // {Methods} ■メソッド定義■
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:'{}'},
        ],

        process: `
          - メンバと引数両方にある項目は、引数の値をメンバとして設定
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {authClientConfig:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  authError: {
    label: 'auth専用エラーオブジェクト',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement:{client:true,server:true},  // 実装の有無

    members: [  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'responseTime',type:'number',label:'エラー発生日時',note:'',default:'Date.now()'},
      {name:'errorType',type:'string',label:'エラーの型(ex."ReferenceError")',note:'',default:'Error.name'},
      {name:'function',type:'string',label:'エラーが起きたクラス・メソッド名',note:'',default:'v.whoisの値'},
      {name:'step',type:'string',label:'エラーが起きたメソッド内の位置',default:'v.step'},
      {name:'variable',type:'string',label:'エラー時のメソッド内汎用変数(JSON文字列)',note:'',default:'JSON.stringify(v)'},
      {name:'message',type:'string',label:'エラーメッセージ',default:'Error.message'},
      {name:'stack',type:'string',label:'エラー時のスタックトレース',default:'Error.stack'},
    ],

    methods: { // {Methods} ■メソッド定義■
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        rev: 1, // {number} 0:未着手 1:完了 0<n<1:作成途中

        params: [  // {Params} ■メソッド引数の定義■
          {name:'e',type:'Error',note:'エラーオブジェクト'},
          {name:'v',type:'Object',note:'関数・メソッド内汎用変数',default:'{}'},
        ],

        process: `
          - メンバと引数両方にある項目は、引数の値をメンバとして設定
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {authError:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  authErrorLog: {
    label: '',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement:{client:false,server:false},  // 実装の有無

    members: [  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'',type:'string',label:'',note:''},
    ],

    methods: { // {Methods} ■メソッド定義■
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:'{}'},
        ],

        process: `
          - メンバと引数両方にある項目は、引数の値をメンバとして設定
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {authErrorLog:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  authRequest: {
    label: '',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement:{client:false,server:false},  // 実装の有無

    members: [  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'',type:'string',label:'',note:''},
    ],

    methods: { // {Methods} ■メソッド定義■
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:'{}'},
        ],

        process: `
          - メンバと引数両方にある項目は、引数の値をメンバとして設定
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {authRequest:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  authResult: {
    label: 'auth内メソッドの標準的な戻り値',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement:{client:false,server:false},  // 実装の有無

    members: [  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'responseTime',type:'number',label:'処理終了日時',note:'',default:'Date.now()'},
      {name:'status',type:'string',label:'終了状態',note:'"normal"or"fatal"or警告メッセージ(warning)',default:'"normal"'},
      {name:'response',type:'any|authError',label:'処理結果',note:'@returns {void}ならundefined。fatal時はauthError',isOpt:true},
    ],

    methods: { // {Methods} ■メソッド定義■
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        rev: 1, // {number} 0:未着手 1:完了 0<n<1:作成途中

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:'{}'},
        ],

        process: `
          - メンバと引数両方にある項目は、引数の値をメンバとして設定
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {authResult:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  authServerConfig: {
    label: '',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement:{client:false,server:false},  // 実装の有無

    members: [  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'',type:'string',label:'',note:''},
    ],

    methods: { // {Methods} ■メソッド定義■
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:'{}'},
        ],

        process: `
          - メンバと引数両方にある項目は、引数の値をメンバとして設定
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {authServerConfig:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  encryptedRequest: {
    label: '',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement:{client:false,server:false},  // 実装の有無

    members: [  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'',type:'string',label:'',note:''},
    ],

    methods: { // {Methods} ■メソッド定義■
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:'{}'},
        ],

        process: `
          - メンバと引数両方にある項目は、引数の値をメンバとして設定
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {encryptedRequest:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  encryptedResponse: {
    label: '',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement:{client:false,server:false},  // 実装の有無

    members: [  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'',type:'string',label:'',note:''},
    ],

    methods: { // {Methods} ■メソッド定義■
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:'{}'},
        ],

        process: `
          - メンバと引数両方にある項目は、引数の値をメンバとして設定
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {encryptedResponse:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  LocalRequest: {
    label: 'ローカル関数からの処理要求',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `クライアント側関数からauthClientに渡す内容を確認、オブジェクト化する`,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement:{client:true,server:false},  // 実装の有無

    members: [  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'',type:'string',label:'',note:''},
    ],

    methods: { // {Methods} ■メソッド定義■
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:'{}'},
        ],

        process: `
          - メンバと引数両方にある項目は、引数の値をメンバとして設定
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {LocalRequest:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
  LocalResponse: {
    label: '',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement:{client:false,server:false},  // 実装の有無

    members: [  // {Members} ■メンバ(インスタンス変数)定義■
      {name:'',type:'string',label:'',note:''},
    ],

    methods: { // {Methods} ■メソッド定義■
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        rev: 0, // {number} 0:未着手 1:完了 0<n<1:作成途中

        params: [  // {Params} ■メソッド引数の定義■
          {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:'{}'},
        ],

        process: `
          - メンバと引数両方にある項目は、引数の値をメンバとして設定
        `,	// {string} 処理手順。markdownで記載(trimIndent対象)

        returns: {LocalResponse:{}},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
      },
    },
  },
}));
