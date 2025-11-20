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
      {name:'memberId',type:'string',desc:'メンバの識別子',note:''},
      {name:'deviceId',type:'string',desc:'デバイスの識別子',note:'',isOpt:true},
      {name:'func',type:'string',desc:'サーバ側関数名',note:''},
      {name:'result',type:'string',desc:'サーバ側処理結果',note:'"fatal","warning","normal"',default:'normal'},
      {name:'note',type:'string',desc:'備考',note:''},
    ]},

    methods: {list:[{
      name: 'constructor',
      type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
      desc: 'コンストラクタ',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'

      params: {list:[
      ]},

      process: `
        - メンバと引数両方にある項目は、引数の値をメンバとして設定
        - テスト：[authConfig](authConfig.md#authconfig_constructor)をインスタンス化
        %% cfTable({type:'authError',patterns:{'異常テスト':{message:'テスト'}}},{indent:2}) %%
      `,

      returns: {list:[{type:'authAuditLog'}]},
    }]},
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
        {name:'arg',type:'Object',note:'ユーザ指定の設定値',default:'{}'},
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
    desc: '',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
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
    desc: 'サーバ側で復号されたクライアントからの処理要求',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
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

      returns: {list:[{type:'authRequest'}]},
    }]},
  },
  authResponse: {
    desc: 'クライアント側で復号されたサーバからの処理結果',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement: ['cl'],  // 実装の有無

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
  encryptedRequest: {
    desc: '',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: ``,	// {string} クラスとしての補足説明(Markdown)。概要欄に記載(trimIndent対象)
    implement: ['cl','sv'],  // 実装の有無

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
        {type:'',desc:'エラー時の戻り値',template:`%% cfTable({type:'authError',patterns:{'func不正':{message:'"invalid func"'}}},{indent:2,header:{name:'項目名',type:'データ型',default:'要否/既定値',desc:'説明'}}) %%`},
      ]},  // コンストラクタ等、生成時のインスタンスをそのまま返す場合
    }]},
  },
}}));