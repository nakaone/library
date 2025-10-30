const classdef = {
  /*
  className: {  // {ClassDef} ■クラス定義■
    label: '',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: '',	// {string} クラスとしての補足説明。概要欄に記載
    policy: [],	// {string[]} 設計方針欄
    inherit: '',	// {string} 親クラス名
    defaultVariableName: '', // {string} 変数名の既定値。ex.(pv.)"audit"

    member: [{  // {Member[]} ■メンバ(インスタンス変数)定義■
      name: '',	// {string} メンバ名(変数名)。英数字表記
      type: 'string',	// {string} データ型
      label: '',	// {string} 端的な項目説明。ex."サーバ側処理結果"
      note: '',	// {string|string[]} 当該項目に関する補足説明。ex."fatal/warning/normal"
          // 配列の場合、箇条書きとして処理する。
      default: '—',	// {any} 関数の場合'=Date.now()'のように記述
      opt: false,	// {boolean} 任意項目はtrue。defaultが設定されたら強制的にtrue
    }];

    method: { // {Method} ■メソッド定義■
      methodName: {
        type: 'private'; ,	// {string} static:クラスメソッド、public:外部利用可、private:内部専用
        label: '' ,	// {string} 端的なメソッドの説明。ex.'authServer監査ログ'
        note: '' ,	// {string} 注意事項。markdownで記載
        process: ''  ,	// {string} 処理手順。markdownで記載
        source: '' ,	// {string} 想定するJavaScriptソース

        param = [{  // {Param[]} ■メソッド引数の定義■
          name: '',	// 引数としての変数名
          isOpt: false,  // 任意項目ならtrue
          type: '',	// データ型
          default: '—',	// 既定値
          note: '',	// 項目の説明
        }],

        returns: [{  // {Returns} ■(パターン別)メソッド戻り値の定義■
          label: '',	// {string} パターン名。ex.「正常時」「未認証時」等
          code: '',	// {string} エラーコード
          condition: '',	// {string} 該当条件
          note: '',	// {string} メソッドに関する備忘
          referrer: []; ,	// {string[]} 戻り値をCRUDするメソッド
          obj: {  // 戻り値として返されるオブジェクト
            type: 'Object'; // {string} データ型
            member = [{ // 戻り値オブジェクトのメンバ
                // 要設定項目のみ。typeの既定値のままとする項目は記載しない
              name: '', // 設定するメンバ名
              value: '', // 設定する値または算式
              note: '', // メンバに関する備考
            }],
          },
        }],
      },
    },
  },
  */
  authConfig: { 
    label: 'authClient/authServer共通設定値',
    note: 'authClientConfig, authServerConfigの親クラス',
    policy: '',
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
        param: [{
          name: 'arg',
          type: 'Object',
          default: {},
          note: '必須項目および変更する設定値',
        }],
        returns: [{
          obj: {type: 'authConfig'},
          referrer: [],
        }],
      },
    },
  },
  authClientConfig: { // メンバ名はクラス名
    label: 'authClient専用の設定値',  // 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authConfigを継承', // クラスとしての補足説明
    inherit: 'authConfig', // 親クラス名
    member: [
      {name:'api',type:'string',label:'サーバ側WebアプリURLのID',note:'`https://script.google.com/macros/s/(この部分)/exec`'},
      {name:'timeout',type:'number',label:'サーバからの応答待機時間',note:'これを超えた場合はサーバ側でfatalとなったと解釈する。既定値は5分',default:300000},
      {name:'CPkeyGraceTime',type:'number',label:'CPkey期限切れまでの猶予時間',note:'CPkey有効期間がこれを切ったら更新処理実行。既定値は10分',default:600000},
    ],
    defaultVariableName: 'cf',  // 変数名の既定値。ex.(pv.)"audit"
    method: {
      constructor: {
        label: 'コンストラクタ',
        param: [{
          name: 'arg',
          type: 'Object',
          default: {},
          note: '必須項目および変更する設定値',
        }],
        returns: [{
          obj: {type: 'authClientConfig'},
          referrer: [],
        }],
        process: ``,  // 処理手順。markdownで記載
        note: ``, // 注意事項。markdownで記載
        source: ``, // 想定するソース
      },
    },
  },
  authServerConfig: { // メンバ名はクラス名
    label: 'authServer専用の設定値',  // 端的なクラスの説明。ex.'authServer監査ログ'
    note: 'authConfigを継承', // クラスとしての補足説明
    inherit: 'authConfig', // 親クラス名
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
    defaultVariableName: 'cf',  // 変数名の既定値。ex.(pv.)"audit"
    method: {
      constructor: {
        label: 'コンストラクタ',
        param: [{
          name: 'arg',
          type: 'Object',
          default: {},
          note: '必須項目および変更する設定値',
        }],
        returns: [{
          obj: {type: 'authServerConfig'},
          referrer: [],
        }],
        process: ``,  // 処理手順。markdownで記載
        note: ``, // 注意事項。markdownで記載
        source: ``, // 想定するソース
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
      this.opt = this.default !== '—' ? true : ( arg.opt || false); // {boolean} 任意項目はtrue。defaultが設定されたら強制的にtrue
    }
    md(){
      // 項目名 任意 データ型 既定値 説明 備考
      return `| ${this.name} | ${this.opt?'⭕':'❌'} | ${this.type} | ${JSON.stringify(this.default)} | ${this.label} | ${this.note} | `;
    }
  }

  class Param { // メソッドの引数
    constructor(arg){
      this.name = arg.name || ''; // 引数としての変数名
      this.isOpt = arg.isOpt || false;  // 任意項目ならtrue
      this.type = arg.type || ''; // データ型
      this.default = arg.default || '—'; // 既定値
      this.note = arg.note || ''; // 項目の説明
    }

    md(){
      // 項目名 任意 データ型 既定値 備考
      return `| ${this.name} | ${this.opt?'⭕':'❌'} | ${this.type} | ${JSON.stringify(this.default)} | ${this.note} | `;
    }
  }

  class Returns { // メソッドの戻り値(オブジェクト)
    // 本メソッドの戻り値。当該メソッドで正常時＋異常時の作成パターン毎にオブジェクト作成
    constructor(arg){
      this.label = arg.label || ''	// {string} パターン名。ex.「正常時」「未認証時」等
      this.code = arg.code || ''	// {string} エラーコード
      this.condition = arg.condition || ''	// {string} 該当条件
      this.note = arg.note || '', // {string} メソッドに関する備忘
      this.referrer = arg.referrer || []; // {string[]} 戻り値をCRUDするメソッド
      // 戻り値オブジェクト(this.obj)をインスタンス化したり(インスタンス化はconstructor限定)
      // 引数として参照しているメソッド名の配列

      this.obj = {};  // 戻り値として返されるオブジェクト
      if( typeof arg.obj !== 'undefined' ){
        this.obj.type = arg.obj.type || 'Object'; // {string} データ型
        this.obj.member = []; // 戻り値オブジェクトのメンバ
            // 要設定項目のみ。typeの既定値のままとする項目は記載しない
        if( typeof arg.obj.member !== 'undefined' && Array.isArray(arg.obj.member) ){
          arg.obj.member.forEach(x => {
            this.obj.member.push({
              name: x.name || '', // 設定するメンバ名
              value: x.value || '', // 設定する値または算式
              note: x.note || '', // メンバに関する備考
            });
          });
        }
      }
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
        rv.push(`- [${x.obj.type}](${x.obj.type}.md)`)
      });
      // 処理手順

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
      const policy = !this.policy ? [] : [
        `### <a name="${cn}_policy">設計方針</a>`,'',
        ...this.policy
      ];

      // 内部構成：メンバ(一覧形式)
      const internal = [
        `### 🧩 <a name="${cn}_internal">内部構成</a>`,'','🔢 メンバ',
        '| 項目名 | 任意 | データ型 | 既定値 | 説明 | 備考 |',
        '| :-- | :-- | :-- | :-- | :-- | :-- |'
      ];
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