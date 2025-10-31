const classdef = {
  /*
  className: {  // {ClassDef} ■クラス定義■
    label: '',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: '',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {
        name: '',	// {string} メンバ名(変数名)。英数字表記
        type: 'string',	// {string} データ型
        label: '',	// {string} 端的な項目説明。ex."サーバ側処理結果"
        note: '',	// {string|string[]} 当該項目に関する補足説明。ex."fatal/warning/normal"
            // 配列の場合、箇条書きとして処理する。
        default: '—',	// {any} 関数の場合'=Date.now()'のように記述
        isOpt: false,	// {boolean} 任意項目はtrue。defaultが設定されたら強制的にtrue
      },
    ],

    method: { // {Method} ■メソッド定義■
      constructor: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: '',	// {string} 注意事項。markdownで記載
        source: '',	// {string} 想定するJavaScriptソース
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"

        param: [  // {Param[]} ■メソッド引数の定義■
          {name:'arg',isOpt:true,type:'Object',default:{},note:'ユーザ指定の設定値'},
          //name: '',	// 引数としての変数名
          //isOpt: false,  // 任意項目ならtrue
          //type: '',	// データ型
          //default: '—',	// 既定値
          //note: '',	// 項目の説明
        ],

        process: ``,	// {string} 処理手順。markdownで記載

        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '',	// {string} パターン名。ex.「正常終了」「未認証時」等
          type: 'Object', // {string} データ型。authResponse等
          code: '',	// {string} エラーコード
          condition: '',	// {string} 該当条件
          note: '',	// {string} 備忘
          member: [{ // 値を設定する戻り値のメンバ。既定値項目は不要
            name: '', // 設定するメンバ名
            value: '', // 設定する値または算式
            note: '', // メンバに関する備考
          }],
        }],
      },
    },
  },
  */
  authAuditLog: {
    label: 'authServerの監査ログ',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: '',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄
    inherit: '',	// {string} 親クラス名
    defaultVariableName: 'audit', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'timestamp',type:'string',label:'要求日時',note:'ISO8601拡張形式の文字列',default:'Date.now()'},
      {name:'duration',type:'number',label:'処理時間',note:'ミリ秒単位'},
      {name:'memberId',type:'string',label:'メンバの識別子',note:'=メールアドレス'},
      {name:'deviceId',type:'string',label:'デバイスの識別子',note:''},
      {name:'func',type:'string',label:'サーバ側関数名',note:''},
      {name:'result',type:'string',label:'サーバ側処理結果',note:'fatal/warning/normal',default:'normal'},
      {name:'note',type:'string',label:'備考',note:''},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'authAuditLog', // {string} データ型。authResponse等
        }],
      },
    },
  },
  authClientConfig: {
    label: 'authClient専用の設定値',  // 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authConfigを継承', // クラスとしての補足説明
    inherit: 'authConfig', // 親クラス名
    defaultVariableName: 'cf',  // 変数名の既定値。ex.(pv.)"audit"
    member: [
      {name:'api',type:'string',label:'サーバ側WebアプリURLのID',note:'`https://script.google.com/macros/s/(この部分)/exec`'},
      {name:'timeout',type:'number',label:'サーバからの応答待機時間',note:'これを超えた場合はサーバ側でfatalとなったと解釈する。既定値は5分',default:300000},
      {name:'CPkeyGraceTime',type:'number',label:'CPkey期限切れまでの猶予時間',note:'CPkey有効期間がこれを切ったら更新処理実行。既定値は10分',default:600000},
    ],
    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'authClientConfig', // {string} データ型。authResponse等
        }],
      },
    },
  },
  authClientKeys: {
    label: 'クライアント側鍵ペア',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: '',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"


    
    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'CSkeySign',type:'CryptoKey',label:'署名用秘密鍵',note:''},
      {name:'CPkeySign',type:'CryptoKey',label:'署名用公開鍵',note:''},
      {name:'CSkeyEnc',type:'CryptoKey',label:'暗号化用秘密鍵',note:''},
      {name:'CPkeyEnc',type:'CryptoKey',label:'暗号化用公開鍵',note:''},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        lib: ['createPassword'],
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"

        param: [
          {name:'config',type:'authClientConfig',note:'鍵生成用の設定(RSA鍵長等)'},
        ],

        process: `
          - [createPassword](library.md#createpassword)でパスワード生成
          - [authConfig](authConfig.md#authconfig_internal).RSAbitsを参照、新たな鍵ペア生成
        `,	// {string} 処理手順。markdownで記載

        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'authClientKeys', // {string} データ型。authResponse等
        }],
      },
    },
  },
  authConfig: { 
    label: 'authClient/authServer共通設定値',
    note: 'authClientConfig, authServerConfigの親クラス',
    policy: [],
    inherit: '', // 親クラス名
    defaultVariableName: '',

    member:[
      {name:'systemName',type:'string',label:'システム名',default:'auth'},
      {name:'adminMail',type:'string',label:'管理者のメールアドレス'},
      {name:'adminName',type:'string',label:'管理者氏名'},
      {name:'allowableTimeDifference',type:'number',label:'クライアント・サーバ間通信時の許容時差',note:'既定値は2分',default:120000},
      {name:'RSAbits',type:'string',label:'鍵ペアの鍵長',default:2048},
      {name:'underDev',type:'Object',label:'テスト時の設定'},
      {name:'underDev.isTest',type:'boolean',label:'開発モードならtrue',default:'false'},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'authConfig', // {string} データ型。authResponse等
        }],
      },
    },
  },
  authErrorLog: {
    label: 'authServerのエラーログ',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: '',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'timestamp',type:'string',label:'要求日時',note:'ISO8601拡張形式の文字列',default:'Date.now()'},
      {name:'memberId',type:'string',label:'メンバの識別子',note:'=メールアドレス'},
      {name:'deviceId',type:'string',label:'デバイスの識別子',note:''},
      {name:'result',type:'string',label:'サーバ側処理結果',note:'fatal/warning/normal',default:'fatal'},
      {name:'message',type:'string',label:'サーバ側からのエラーメッセージ',note:'normal時は`undefined`',isOpt:true},
      {name:'stackTrace',type:'string',label:'エラー発生時のスタックトレース',note:'本項目は管理者への通知メール等、シート以外には出力不可',isOpt:true},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'authErrorLog', // {string} データ型。authResponse等
        }],
      },
    },
  },
  authIndexedDB: {
    label: 'クライアントのIndexedDB',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authClientKeysを継承した、クライアントのIndexedDBに保存するオブジェクト<br>'
    + 'IndexedDB保存時のキー名は`authConfig.system.name`から取得',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: 'authClientKeys',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
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

    method: {
      constructor: {
        label: 'メイン処理(コンストラクタ相当)',

        param: [
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

        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'authIndexedDB', // {string} データ型。authResponse等
        }],
      },
      get: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'IndexedDBの値を取得',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        source: '',	// {string} 想定するJavaScriptソース
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        param: [  // {Param[]} ■メソッド引数の定義■
        ],

        process: `
          - 【要修正】authAuditLogに関する記述？？？
          - 引数がObjectの場合：func,result,noteがあればthisに上書き
          - 引数がstringの場合：this.funcにargをセット
          - this.duration = Date.now() - this.timestamp
          - timestampはISO8601拡張形式の文字列に変更
          - シートの末尾行にauthAuditLogオブジェクトを追加
          - メール通知：stackTraceは削除した上でauthConfig.adminMail宛にメール通知
        `,	// {string} 処理手順。markdownで記載

        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了',	// {string} パターン名。ex.「正常終了」「未認証時」等
          type: 'authIndexedDB', // {string} データ型。authResponse等
          code: '',	// {string} エラーコード
          condition: '',	// {string} 該当条件
          note: '',	// {string} 備忘
          member: [{ // 値を設定する戻り値のメンバ。既定値項目は不要
            name: '', // 設定するメンバ名
            value: '', // 設定する値または算式
            note: '', // メンバに関する備考
          }],
        }],
      },
      set: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'IndexedDBの値を更新(生成)',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        source: '',	// {string} 想定するJavaScriptソース
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        param: [  // {Param[]} ■メソッド引数の定義■
          {name:'arg',type:'authIndexedDB',default:{},note:'更新(生成)値(更新対象メンバのみで可)'},
        ],

        process: ``,	// {string} 処理手順。markdownで記載

        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了',	// {string} パターン名。ex.「正常終了」「未認証時」等
          type: 'authIndexedDB', // {string} データ型。authResponse等
          code: '',	// {string} エラーコード
          condition: '',	// {string} 該当条件
          note: 'IndexedDBに設定した値',	// {string} 備忘
          member: [{ // 値を設定する戻り値のメンバ。既定値項目は不要
            name: '', // 設定するメンバ名
            value: '', // 設定する値または算式
            note: '', // メンバに関する備考
          }],
        }],
      },
      reset: {
        type: 'private',	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: 'IndexedDBの値を更新(生成)',	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        source: '',	// {string} 想定するJavaScriptソース
        lib: [],  // {string[]} 本メソッドで使用するライブラリ。"library/xxxx/0.0.0/core.js"の"xxxx"のみ表記

        param: [  // {Param[]} ■メソッド引数の定義■
          {name:'arg',type:'authIndexedDB',default:{},note:'更新(生成)値(更新対象メンバのみで可)'},
        ],

        process: `
          - 【要修正】authAuditLogに関する記述？？？
          - authClientConfig.auditLogシートが無ければ作成
          - 引数の内、authAuditLogと同一メンバ名があればthisに設定
        `,	// {string} 処理手順。markdownで記載

        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了',	// {string} パターン名。ex.「正常終了」「未認証時」等
          type: 'authIndexedDB', // {string} データ型。authResponse等
          code: '',	// {string} エラーコード
          condition: '',	// {string} 該当条件
          note: 'IndexedDBに設定した値',	// {string} 備忘
          member: [{ // 値を設定する戻り値のメンバ。既定値項目は不要
            name: '', // 設定するメンバ名
            value: '', // 設定する値または算式
            note: '', // メンバに関する備考
          }],
        }],
      },
    },
  },
  authServerConfig: {
    label: 'authServer専用の設定値',  // 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authConfigを継承', // クラスとしての補足説明
    inherit: 'authConfig', // 親クラス名
    defaultVariableName: 'cf',  // 変数名の既定値。ex.(pv.)"audit"

    member: [
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
      {name:'func.authority',type:'number',label:'サーバ側関数の所要権限',note:[
        'サーバ側関数毎に設定される当該関数実行のために必要となるユーザ権限',
        '`authServerConfig.func.authority === 0 || (Member.profile.authority & authServerConfig.func.authority > 0)`なら実行可とする。'
      ],default:0},
      {name:'func.do',type:'Function',label:'実行するサーバ側関数'},

      {name:'trial',type:'Object',label:'ログイン試行関係の設定値'},
      {name:'trial.passcodeLength',type:'number',label:'パスコードの桁数',default:6},
      {name:'trial.maxTrial',type:'number',label:'パスコード入力の最大試行回数',default:3},
      {name:'trial.passcodeLifeTime',type:'number',label:'パスコードの有効期間',note:'既定値は10分',default:600000},
      {name:'trial.generationMax',type:'number',label:'ログイン試行履歴(MemberTrial)の最大保持数',note:'既定値は5世代',default:5},

      {name:'underDev.sendPasscode',type:'boolean',label:'開発中識別フラグ',note:'パスコード通知メール送信を抑止するならtrue',default:'false'},
      {name:'underDev.sendInvitation',type:'boolean',label:'開発中の加入承認通知メール送信',note:'開発中に加入承認通知メール送信を抑止するならtrue',default:'false'},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'authServerConfig', // {string} データ型。authResponse等
        }],
      },
    },
  },
  authRequest: {
    label: '暗号化前の処理要求',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authClientからauthServerに送られる、暗号化前の処理要求オブジェクト',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'memberId',type:'string',label:'メンバの識別子',note:'=メールアドレス'},
      {name:'deviceId',type:'string',label:'デバイスの識別子',note:''},
      {name:'signature',type:'string',label:'クライアント側署名',note:''},
      {name:'requestId',type:'string',label:'要求の識別子',note:'UUID'},
      {name:'timestamp',type:'number',label:'要求日時',note:'UNIX時刻'},
      {name:'func',type:'string',label:'サーバ側関数名',note:''},
      {name:'arguments',type:'any[]',label:'サーバ側関数に渡す引数の配列',note:''},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'authRequest', // {string} データ型。authResponse等
        }],
      },
    },
  },
  authRequestLog: {
    label: '重複チェック用のリクエスト履歴',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'ScriptPropertiesに保存',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'timestamp',type:'number',label:'リクエストを受けたサーバ側日時',note:'',default:'Date.now()'},
      {name:'requestId',type:'string',label:'クライアント側で採番されたリクエスト識別子',note:'UUID'},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'authRequestLog', // {string} データ型。authResponse等
        }],
      },
    },
  },
  authResponse: {
    label: '暗号化前の処理結果',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authServerからauthClientに返される、暗号化前の処理結果オブジェクト',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'timestamp',type:'number',label:'サーバ側処理日時',note:'UNIX時刻',default:'Date.now()'},
      {name:'result',type:'string',label:'サーバ側処理結果',note:'fatal/warning/normal',default:'normal'},
      {name:'message',type:'string',label:'サーバ側からの(エラー)メッセージ',note:'',isOpt:true},
      {name:'request',type:'authRequest',label:'処理要求オブジェクト',note:'',isOpt:true},
      {name:'response',type:'any',label:'要求されたサーバ側関数の戻り値',note:'fatal/warning時は`undefined`',isOpt:true},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'authResponse', // {string} データ型。authResponse等
        }],
      },
    },
  },
  authScriptProperties: {
    label: 'サーバ側のScriptProperties',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'キー名は`authConfig.system.name`',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'keyGeneratedDateTime',type:'number',label:'UNIX時刻',note:''},
      {name:'SPkey',type:'string',label:'PEM形式の公開鍵文字列',note:''},
      {name:'SSkey',type:'string',label:'PEM形式の秘密鍵文字列(暗号化済み)',note:''},
      {name:'oldSPkey',type:'string',label:'cryptoServer.reset実行前にバックアップした公開鍵',note:''},
      {name:'oldSSkey',type:'string',label:'cryptoServer.reset実行前にバックアップした秘密鍵',note:''},
      {name:'requestLog',type:'authRequestLog[]',label:'重複チェック用のリクエスト履歴',note:'',default:[]},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'authScriptProperties', // {string} データ型。authResponse等
        }],
      },
    },
  },
  authServerConfig: {
    label: 'サーバ側設定値',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authConfigを継承した、authServerでのみ使用する設定値',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: 'authConfig',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'memberList',type:'string',label:'memberListシート名',note:'',default:'memberList'},
      {name:'defaultAuthority',type:'number',label:'新規加入メンバの権限の既定値',note:'',default:1},
      {name:'memberLifeTime',type:'number',label:'加入有効期間',note:'メンバ加入承認後の有効期間。既定値は1年',default:31536000000},
      {name:'prohibitedToJoin',type:'number',label:'加入禁止期間',note:'管理者による加入否認後、再加入申請が自動的に却下される期間。既定値は3日',default:259200000},
      {name:'loginLifeTime',type:'number',label:'認証有効時間',note:'ログイン成功後の有効期間、CPkeyの有効期間。既定値は1日',default:86400000},
      {name:'loginFreeze',type:'number',label:'認証凍結時間',note:'認証失敗後、再認証要求が禁止される期間。既定値は10分',default:600000},
      {name:'requestIdRetention',type:'number',label:'重複リクエスト拒否となる時間',note:'既定値は5分',default:300000},
      {name:'errorLog',type:'string',label:'エラーログのシート名',note:'',default:'errorLog'},
      {name:'storageDaysOfErrorLog',type:'number',label:'監査ログの保存日数',note:'単位はミリ秒。既定値は7日分',default:604800000},
      {name:'auditLog',type:'string',label:'監査ログのシート名',note:'',default:'auditLog'},
      {name:'storageDaysOfAuditLog',type:'number',label:'監査ログの保存日数',note:'単位はミリ秒。既定値は7日分',default:604800000},

      {name:'func',type:'Object.<string,Object>',label:'サーバ側の関数マップ',note:'例：{registerMember:{authority:0b001,do:m=>register(m)},approveMember:{authority:0b100,do:m=>approve(m)}}'},
      {name:'func.authority',type:'number',label:'サーバ実行権限',note:
        'サーバ側関数毎に設定される当該関数実行のために必要となるユーザ権限。<br>' +
        '`authServerConfig.func.authority === 0 || (Member.profile.authority & authServerConfig.func.authority > 0)`なら実行可とする。'
      ,default:0},
      {name:'func.do',type:'Function',label:'実行するサーバ側関数',note:''},

      {name:'trial',type:'Object',label:'ログイン試行関係の設定値',note:''},
      {name:'trial.passcodeLength',type:'number',label:'パスコードの桁数',note:'',default:6},
      {name:'trial.maxTrial',type:'number',label:'パスコード入力の最大試行回数',note:'',default:3},
      {name:'trial.passcodeLifeTime',type:'number',label:'パスコードの有効期間',note:'既定値は10分',default:600000},
      {name:'trial.generationMax',type:'number',label:'ログイン試行履歴(MemberTrial)の最大保持数',note:'既定値は5世代',default:5},

      {name:'underDev.sendPasscode',type:'boolean',label:'開発中パスコード通知抑止',note:'開発中、パスコード通知メール送信を抑止するならtrue',default:'false'},
      {name:'underDev.sendInvitation',type:'boolean',label:'開発中加入承認通知抑止',note:'開発中、加入承認通知メール送信を抑止するならtrue',default:'false'},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'authServerConfig', // {string} データ型。authResponse等
        }],
      },
    },
  },
  decryptedRequest: {
    label: '復号済の処理要求',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'encryptedRequestをcryptoServerで復号した処理要求オブジェクト',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'result',type:'string',label:'処理結果',note:'"fatal"(後続処理不要なエラー), "warning"(後続処理が必要なエラー), "normal"'},
      {name:'message',type:'string',label:'エラーメッセージ',note:'result="normal"の場合`undefined`',isOpt:true},
      {name:'request',type:'authRequest',label:'ユーザから渡された処理要求',note:''},
      {name:'timestamp',type:'number',label:'復号処理実施日時',note:''},
      {name:'status',type:'string',label:'ユーザ・デバイス状態',note:'Member.deviceが空ならメンバの、空で無ければデバイスのstatus'},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'decryptedRequest', // {string} データ型。authResponse等
        }],
      },
    },
  },
  decryptedResponse: {
    label: '復号済の処理結果',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'encryptedResponseをcryptoClientで復号した処理結果オブジェクト',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
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

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'decryptedResponse', // {string} データ型。authResponse等
        }],
      },
    },
  },
  encryptedRequest: {
    label: '暗号化された処理要求',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authClientからauthServerに送られる、暗号化された処理要求オブジェクト。<br>'
      + 'ciphertextはauthRequestをJSON化、RSA-OAEP暗号化＋署名付与した文字列。<br>'
      + 'memberId,deviceIdは平文',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'memberId',type:'string',label:'メンバの識別子',note:'=メールアドレス'},
      {name:'deviceId',type:'string',label:'デバイスの識別子',note:''},
      {name:'ciphertext',type:'string',label:'暗号化した文字列',note:''},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'encryptedRequest', // {string} データ型。authResponse等
        }],
      },
    },
  },
  encryptedResponse: {
    label: '暗号化された処理結果',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authServerからauthClientに返される、暗号化された処理結果オブジェクト<br>'
      + 'ciphertextはauthResponseをJSON化、RSA-OAEP暗号化＋署名付与した文字列',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'ciphertext',type:'string',label:'暗号化した文字列',note:''},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'encryptedResponse', // {string} データ型。authResponse等
        }],
      },
    },
  },
  LocalRequest: {
    label: 'ローカル関数からの処理要求',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'クライアント側関数からauthClientに渡すオブジェクト。func,arg共、平文',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'func',type:'string',label:'サーバ側関数名',note:''},
      {name:'arguments',type:'any[]',label:'サーバ側関数に渡す引数の配列',note:''},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'LocalRequest', // {string} データ型。authResponse等
        }],
      },
    },
  },
  LocalResponse: {
    label: 'ローカル関数への処理結果',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authClientからクライアント側関数に返される処理結果オブジェクト',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'result',type:'string',label:'処理結果。fatal/warning/normal',note:''},
      {name:'message',type:'string',label:'エラーメッセージ',note:'normal時は`undefined`',isOpt:true},
      {name:'response',type:'any',label:'要求された関数の戻り値',note:'fatal/warning時は`undefined`。`JSON.parse(authResponse.response)`',isOpt:true},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'LocalResponse', // {string} データ型。authResponse等
        }],
      },
    },
  },
  Member: {
    label: 'メンバ単位の管理情報',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'メンバ一覧(アカウント管理表)上のメンバ単位の管理情報',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'memberId',type:'string',label:'メンバの識別子',note:'メールアドレス'},
      {name:'name',type:'string',label:'メンバの氏名',note:''},
      {name:'status',type:'string',label:'メンバの状態',note:'未加入,未審査,審査済,加入中,加入禁止',default:'未加入'},
      {name:'log',type:'MemberLog',label:'メンバの履歴情報',note:'シート上はJSON文字列',default:'new MemberLog()'},
      {name:'profile',type:'MemberProfile',label:'メンバの属性情報',note:'シート上はJSON文字列',default:'new MemberProfile()'},
      {name:'device',type:'MemberDevice[]',label:'デバイス情報',note:'マルチデバイス対応用。シート上はJSON文字列'},
      {name:'note',type:'string',label:'当該メンバに対する備考',note:'',isOpt:true},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'Member', // {string} データ型。authResponse等
        }],
      },
    },
  },
  MemberDevice: {
    label: 'デバイス情報',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'メンバが使用する通信機器の情報(マルチデバイス対応)',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'deviceId',type:'string',label:'デバイスの識別子。UUID',note:''},
      {name:'status',type:'string',label:'デバイスの状態',note:'未認証,認証中,試行中,凍結中',default:'未認証'},
      {name:'CPkey',type:'string',label:'メンバの公開鍵',note:''},
      {name:'CPkeyUpdated',type:'number',label:'最新のCPkeyが登録された日時',note:'',default:'Date.now()'},
      {name:'trial',type:'MemberTrial[]',label:'ログイン試行関連情報オブジェクト',note:'シート上はJSON文字列',default:[]},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'MemberDevice', // {string} データ型。authResponse等
        }],
      },
    },
  },
  MemberLog: {
    label: 'メンバの各種要求・状態変化の時刻',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: '',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'joiningRequest', type:'number', label:'加入要求日時',note:'加入要求をサーバ側で受信した日時', default:0},
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

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'MemberLog', // {string} データ型。authResponse等
        }],
      },
    },
  },
  MemberProfile: {
    label: 'メンバの属性情報',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: '',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'authority',type:'number',label:'メンバの持つ権限',note:'authServerConfig.func.authorityとの論理積>0なら当該関数実行権限ありと看做す',default:0},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'MemberProfile', // {string} データ型。authResponse等
        }],
      },
    },
  },
  MemberTrial: {
    label: 'ログイン試行単位の試行情報',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: '',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'passcode',type:'string',label:'設定されているパスコード',note:'最初の認証試行で作成',default:''},
      {name:'created',type:'number',label:'パスコード生成日時',note:'≒パスコード通知メール発信日時',default:'Date.now()'},
      {name:'log',type:'MemberTrialLog[]',label:'試行履歴',note:'常に最新が先頭(unshift()使用)。保持上限はauthServerConfig.trial.generationMaxに従い、上限超過時は末尾から削除する。',default:[]},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'MemberTrial', // {string} データ型。authResponse等
        }],
      },
    },
  },
  MemberTrialLog: {
    label: 'パスコード入力単位の試行記録',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'MemberTrial.logに記載',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄。箇条書き
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [  // {Member[]} ■メンバ(インスタンス変数)定義■
      {name:'entered',type:'string',label:'入力されたパスコード',note:''},
      {name:'result',type:'number',label:'試行結果',note:'-1:恒久的エラー(再試行不可), 0:要リトライ(再試行可), 1:成功(パスコード一致)'},
      {name:'message',type:'string',label:'エラーメッセージ',note:''},
      {name:'timestamp',type:'number',label:'判定処理日時',note:''},
    ],

    method: {
      constructor: {
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'MemberTrialLog', // {string} データ型。authResponse等
        }],
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
    const lines = str.replace(/^\s*\n+|\n+\s*$/g, '').split('\n');

    // 2. 各行の共通インデント（スペース・タブ）を取得
    const indents = lines
      .filter(line => line.trim() !== '')
      .map(line => line.match(/^[ \t]*/)[0].length);
    const minIndent = indents.length ? Math.min(...indents) : 0;

    // 3. 各行から共通インデント分を削除
    return lines.map(line => line.slice(minIndent)).join('\n');
  }

  class Member {  // メンバ(インスタンス変数)の定義
    constructor(arg){
      this.name = arg.name || ''; // {string} メンバ名(変数名)。英数字表記
      this.type = arg.type || 'string'; // {string} データ型
      this.label = arg.label || ''; // {string} 端的な項目説明。ex."サーバ側処理結果"
      this.note = arg.note || ''; // {string|string[]} 当該項目に関する補足説明。ex."fatal/warning/normal"
                  // 配列の場合、箇条書きとして処理する。
      this.default = arg.default || '—';  // {any} 関数の場合'=Date.now()'のように記述
      this.isOpt = this.default !== '—' ? true : ( arg.isOpt || false); // {boolean} 任意項目はtrue。defaultが設定されたら強制的にtrue
    }
    md(){
      // 項目名 任意 データ型 既定値 説明 備考
      return `| ${this.name} | ${this.isOpt?'⭕':'❌'} | ${this.type} | ${
        typeof this.default === 'object' && this.default !== null
        ? JSON.stringify(this.default) : this.default
      } | ${this.label} | ${this.note} | `;
    }
  }

  class Param { // メソッドの引数
    constructor(arg){
      this.name = arg.name || ''; // 引数としての変数名
      this.type = arg.type || ''; // データ型
      this.default = arg.default || '—'; // 既定値
      this.note = arg.note || ''; // 項目の説明
      this.isOpt = this.default !== '—' ? true : (arg.isOpt || false);  // 任意項目ならtrue
    }

    md(){
      // 項目名 任意 データ型 既定値 備考
      return `| ${this.name} | ${this.isOpt?'⭕':'❌'} | ${this.type} | ${
        typeof this.default === 'object' && this.default !== null
        ? JSON.stringify(this.default) : this.default
      } | ${this.note} | `;
    }
  }

  class Returns { // パターン毎のメソッドの戻り値(オブジェクト)
    // 本メソッドの戻り値。当該メソッドで正常時＋異常時の作成パターン毎にオブジェクト作成
    constructor(arg){
      this.label = arg.label || '';	// {string} パターン名。ex.「正常時」「未認証時」等
      this.type = arg.type || 'Object';
      this.code = arg.code || '';	// {string} エラーコード
      this.condition = arg.condition || '';	// {string} 該当条件
      this.note = arg.note || ''; // {string} メソッドに関する備忘

      this.member = []; // 値を設定する戻り値のメンバ
      if( typeof arg.member !== 'undefined' && Array.isArray(arg.member) ){
        arg.member.forEach(x => {
          this.member.push({
            name: x.name || '', // 設定するメンバ名
            value: x.value || '', // 設定する値または算式
            note: x.note || '', // メンバに関する備考
          });
        });
      }
    }

    md(){
      const rv = [`- ${this.label}: [${this.type}](${this.type}.md)`];
      if( this.member.length > 0 ){
        ['  | メンバ名 | 値 | 備考 |','  | :-- | :-- | :-- |'].forEach(x => rv.push(x));
      }
      this.member.forEach(x => {
        rv.push(`  | ${x.name} | ${x.value} | ${x.note} |`)
      });
      return rv;
    }
  }

  class Method {  // メソッド定義
    constructor(className,methodName='(未指定)',arg){
      this.className = className; // メソッドが所属するクラス名。引数から自動設定
      this.methodName = methodName; // メソッド名。引数から自動設定
      this.type = arg.type || 'private'; // {string} static:クラスメソッド、public:外部利用可、private:内部専用
      this.label = arg.label || ''; // {string} 端的なメソッドの説明。ex.'authServer監査ログ'
      this.note = arg.note || ''; // {string} 注意事項。markdownで記載
      this.source = arg.source || ''; // {string} 想定するJavaScriptソース
      this.lib = arg.lib || []; // {string[]} 本メソッドで使用するライブラリ
      this.referrer = arg.referrer || []; // {string[]} 本メソッドを呼び出す"クラス.メソッド名"

      this.param = [];  // 引数の定義
      if( typeof arg.param !== 'undefined' && Array.isArray(arg.param) ){
        arg.param.forEach(x => this.param.push(new Param(x)));
      }

      this.process = arg.process || '';  // {string} 処理手順。markdownで記載

      this.returns = [];  // 戻り値の定義(パターン別)
      if( typeof arg.returns !== 'undefined' && Array.isArray(arg.returns) ){
        arg.returns.forEach(x => this.returns.push(new Returns(x)));
      }

    }

    md(){/*
      ## <span id="authserver_constructor">🧱 <a href="#authserver_method">constructor()</a></span>

        (概要＋注意事項)

      ### <span id="authserver_constructor_param">📥 引数</span>

        (引数の一覧)

      ### <span id="authserver_constructor_returns">📤 戻り値</span>

      [authResponse](authResponse.md) - authServerから返される暗号化前の処理結果オブジェクト

      - 正常時
        | 項目名 | 任意 | データ型 | 設定値 |
        | keyGeneratedDateTime | ❌ | number |  |
        | SPkey | ❌ | string |  |
        | SSkey | ❌ | string |  |
        | oldSPkey | ❌ | string |  |
        | oldSSkey | ❌ | string |  |
        | requestLog | ⭕ | authRequestLog[] |  |

      ### <span id="constructor-process">🧾 処理手順</span>

      - authServer内共有用の変数`pv`オブジェクトを用意
      - `pv.crypto`にcryptoServerインスタンスを作成
      - 監査ログ用に`pv.audit`に[authAuditLog](typedef.md#authAuditLog)インスタンスを作成
      - エラーログ用に`pv.error`に[authErrorLog](typedef.md#authErrorLog)インスタンスを作成
      */
      const className = this.className.toLowerCase();
      const methodName = this.methodName.toLowerCase();
      const concatName = `${className}_${methodName}`;

      // 概要＋注意事項
      const rv = [
        `## <span id="${concatName}">🧱 <a href="#${className}_method">${this.methodName}()</a></span>`,'',
        this.label,'',this.note
      ];

      // 引数
      ['',`### <span id="${concatName}_param">📥 引数</span>`,''].forEach(x => rv.push(x));
      if( this.param.length === 0 ){
        rv.push(`- 無し(void)`);
      } else {
        ['| 項目名 | 任意 | データ型 | 既定値 | 説明 |','| :-- | :--: | :-- | :-- | :-- |']
        .forEach(x => rv.push(x));
        this.param.forEach(x => rv.push(x.md()));
      }

      // 戻り値
      ['',`### <span id="${concatName}_returns">📤 戻り値</span>`,''].forEach(x => rv.push(x));
      this.returns.forEach(x => {
        x.md().forEach(x => rv.push(x));
      });

      // 処理手順
      if( this.process !== '' ){
        ['',`### <span id="${concatName}_process">🧾 処理手順</span>`,'',trimIndent(this.process)]
        .forEach(x => rv.push(x));
      }

      return rv;
    }
  }

  class ClassDef {  // クラス定義
    constructor(className='(未指定)',arg){
      this.className = className;  // {string} クラス名
      this.label = arg.label || ''; // {string} 端的なクラスの説明。ex.'authServer監査ログ'
      this.note = arg.note || ''; // {string} クラスとしての補足説明。概要欄に記載
      this.policy = arg.policy || []; // {string[]} 設計方針欄
      this.inherit = arg.inherit || ''; // {string} 親クラス名
      this.defaultVariableName = arg.defaultVariableName || ''; // {string} 変数名の既定値。ex.(pv.)"audit"

      // メンバ(インスタンス変数)定義
      this.member = [];
      // 親クラスがあればメンバを追加
      if( this.inherit !== '' && typeof classdef[this.inherit] !== 'undefined' ){
        classdef[this.inherit].member.forEach(x => this.member.push(new Member(x)));
      }
      // 自クラスのメンバを追加
      if( typeof arg.member !== 'undefined' && Array.isArray(arg.member) ){
        arg.member.forEach(x => this.member.push(new Member(x)));
      }

      // メソッド定義
      this.method = {};
      if( typeof arg.method !== 'undefined' ){
        Object.keys(arg.method).forEach(x => {
          this.method[x] = new Method(this.className,x,arg.method[x]);
        });
      }
    }

    md(){
      /*
      # authServer クラス仕様書

      ## <span id="authserver_summary">🧭 概要</span>

      authServerは、クライアント(authClient)からの暗号化通信リクエストを復号・検証し、
      メンバ状態と要求内容に応じてサーバ側処理を適切に振り分ける中核関数です。

      ### <span id="authserver_policy">設計方針</span>

      - staticメソッドを利用するため、クラスとする
      - doGetからは`authServer.exec`を呼び出す

      ### 🧩 <span id="authserver_internal">内部構成</span>

        (メンバの一覧)
        (メソッドの一覧)

      ※ 以降は Method.md() でメソッド毎に作成・追加
      */
      const className = this.className.toLowerCase();
      // 概要
      const summary = [
        `# <span id="${className}">${this.className} クラス仕様書</span>`,'',
        `## <span id="${className}_summary">🧭 概要</span>`,'',
        this.label,'',this.note
      ];

      // 設計方針
      const policy = !this.policy || this.policy.length === 0 ? [] : [
        `### <span id="${className}_policy">設計方針</span>`,'',
        ...this.policy
      ];

      // 内部構成：メンバ(一覧形式)
      const internal = [`### 🧩 <span id="${className}_internal">内部構成</span>`,'',];
      // 親クラスへのリンク
      if( this.inherit.length > 0 ){
        [`- super class: [${this.inherit}](${this.inherit}.md)`,''].forEach(x => internal.push(x));        
      }
      ['🔢 メンバ',
        '| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |',
        '| :-- | :-- | :-- | :-- | :-- | :-- |'
      ].forEach(x => internal.push(x));
      this.member.forEach(x => internal.push(x.md()));

      // 内部構成：メソッド(一覧形式)
      ['',`🧱 <span id="${className}_method">メソッド</span>`,'',
        '| メソッド名 | 型 | 内容 |','| :-- | :-- | :-- |',
      ].forEach(x => internal.push(x));
      Object.keys(this.method).forEach(x => {
        internal.push(`| [${x}](#${className}_${x.toLowerCase()}) | ${this.method[x].type} | ${this.method[x].label}`)
      });

      // メソッド(詳細)
      let method = [];
      Object.keys(this.method).forEach(x => {
        method = [...method, ...this.method[x].md()];
      });

      return [...summary,'',...policy,'',...internal,'',...method].join('\n');
    }
  }

  /** メイン処理 */
  const fs = require("fs");
  const arg = analyzeArg();

  const classList = ['| No | クラス名 | 概要 |','| --: | :-- | :-- |'];
  let cnt = 1;
  Object.keys(classdef).forEach(x => {
    // クラス別Markdown作成
    const cdef = new ClassDef(x,classdef[x]);
    fs.writeFileSync(`${arg.opt.o}/${x}.md`, cdef.md());

    // クラス一覧に追加
    classList.push(`| ${cnt++} | [${x}](${x}.md) | ${cdef.label} |`);
  });
  fs.writeFileSync(`${arg.opt.o}/classList.md`, classList.join('\n'));

})();