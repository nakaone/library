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
        label: '' ,	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: '' ,	// {string} 注意事項。markdownで記載
        process: ''  ,	// {string} 処理手順。markdownで記載
        source: '' ,	// {string} 想定するJavaScriptソース
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"

        param: [  // {Param[]} ■メソッド引数の定義■
          {name:'arg',isOpt:true,type:'Object',default:{},note:'ユーザ指定の設定値'},
          //name: '',	// 引数としての変数名
          //isOpt: false,  // 任意項目ならtrue
          //type: '',	// データ型
          //default: '—',	// 既定値
          //note: '',	// 項目の説明
        ],

        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'Object', // {string} データ型。authResponse等
          code: '',	// {string} エラーコード
          condition: '',	// {string} 該当条件
          note: '',	// {string} 備忘
          member = [{ // 値を設定する戻り値のメンバ。既定値項目は不要
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
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
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
        label: 'コンストラクタ',
        referrer: [],	// {string[]} 本メソッドを呼び出す"クラス.メソッド名"
        param: [{name:'arg',type:'Object',default:{},note:'必須項目および変更する設定値'}],
        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '正常終了時',	// {string} パターン名。ex.「正常時」「未認証時」等
          type: 'authIndexedDB', // {string} データ型。authResponse等
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
      this.process = arg.process || '';  // {string} 処理手順。markdownで記載
      this.source = arg.source || ''; // {string} 想定するJavaScriptソース
      this.referrer = arg.referrer || []; // {string[]} 本メソッドを呼び出す"クラス.メソッド名"

      this.param = [];  // 引数の定義
      if( typeof arg.param !== 'undefined' && Array.isArray(arg.param) ){
        arg.param.forEach(x => this.param.push(new Param(x)));
      }

      this.returns = [];  // 戻り値の定義(パターン別)
      if( typeof arg.returns !== 'undefined' && Array.isArray(arg.returns) ){
        arg.returns.forEach(x => this.returns.push(new Returns(x)));
      }

    }

    md(){/*
      ## <a name="authserver_constructor" href="#internal">🧱 constructor()</a>

        (概要＋注意事項)

      ### <a name="authserver_constructor_param">📥 引数</a>

        (引数の一覧)

      ### <a name="authserver_constructor_returns">📤 戻り値</a>

      [authResponse](authResponse.md) - authServerから返される暗号化前の処理結果オブジェクト

      - 正常時
        | 項目名 | 任意 | データ型 | 設定値 |
        | keyGeneratedDateTime | ❌ | number |  |
        | SPkey | ❌ | string |  |
        | SSkey | ❌ | string |  |
        | oldSPkey | ❌ | string |  |
        | oldSSkey | ❌ | string |  |
        | requestLog | ⭕ | authRequestLog[] |  |

      ### <a name="constructor-process">🧾 処理手順</a>

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
        `## <a name="${concatName}" href="#${className}_internal">🧱 ${this.methodName}()</a>`,'',
        this.label,'',this.note
      ];

      // 引数
      ['',`### <a name="${concatName}_param">📥 引数</a>`,'',
        '| 項目名 | 任意 | データ型 | 既定値 | 説明 |','| :-- | :--: | :-- | :-- | :-- |']
      .forEach(x => rv.push(x));
      this.param.forEach(x => rv.push(x.md()));

      // 戻り値
      ['',`### <a name="${concatName}_returns">📤 戻り値</a>`,''].forEach(x => rv.push(x));
      this.returns.forEach(x => {
        x.md().forEach(x => rv.push(x));
      });

      // 処理手順
      if( this.process !== '' ){
        ['',`### <a name="${concatName}_process">🧾 処理手順</a>`,'',this.process]
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

      ## <a name="authserver_summary">🧭 概要</a>

      authServerは、クライアント(authClient)からの暗号化通信リクエストを復号・検証し、
      メンバ状態と要求内容に応じてサーバ側処理を適切に振り分ける中核関数です。

      ### <a name="authserver_policy">設計方針</a>

      - staticメソッドを利用するため、クラスとする
      - doGetからは`authServer.exec`を呼び出す

      ### 🧩 <a name="authserver_internal">内部構成</a>

        (メンバの一覧)
        (メソッドの一覧)

      ※ 以降は Method.md() でメソッド毎に作成・追加
      */
      const cn = this.className.toLowerCase();
      // 概要
      const summary = [
        `# <a name="${cn}">${this.className} クラス仕様書</a>`,'',
        `## <a name="${cn}_summary">🧭 概要</a>`,'',
        this.label,'',this.note
      ];

      // 設計方針
      const policy = !this.policy || this.policy.length === 0 ? [] : [
        `### <a name="${cn}_policy">設計方針</a>`,'',
        ...this.policy
      ];

      // 内部構成：メンバ(一覧形式)
      const internal = [`### 🧩 <a name="${cn}_internal">内部構成</a>`,'',];
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
      ['','🧱 メソッド','','| メソッド名 | 型 | 内容 |','| :-- | :-- | :-- |'].forEach(x => internal.push(x));
      Object.keys(this.method).forEach(x => {
        internal.push(`| [${x}](#${x.toLowerCase()}) | ${this.method[x].type} | ${this.method[x].label}`)
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

  const classList = ['| クラス名 | 概要 |','| :-- | :-- |'];
  Object.keys(classdef).forEach(x => {
    // クラス別Markdown作成
    const cdef = new ClassDef(x,classdef[x]);
    fs.writeFileSync(`${arg.opt.o}/${x}.md`, cdef.md());

    // クラス一覧に追加
    classList.push(`| [${x}](${x}.md) | ${cdef.label} |`);
  });
  fs.writeFileSync(`${arg.opt.o}/classList.md`, classList.join('\n'));

})();