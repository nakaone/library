console.log(JSON.stringify({classdef:{
  authAuditLog: {
    desc: 'authServerの監査ログ',	// {string} 端的なクラスの説明。ex.'authServer監査ログ'
    note: `
      - 監査ログ出力が必要なメソッドの冒頭でインスタンス化、処理開始時刻等を記録
      - 出力時にlogメソッドを呼び出して処理時間を計算、シート出力
    `,	// {string} クラスとしての補足説明。概要欄に記載
    summary: `
      これはサマリ(クラス概要)です。
    `,
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

      params: {list:[]},

      process: `
        - メンバと引数両方にある項目は、引数の値をメンバとして設定
      `,

      returns: {list:[{type:'authAuditLog'},{type:'authAuditLog'}]},
    }]},
  },

}}));