/** typedef.js : オブジェクトとして指定されたtypedefをMarkdown/JSDocとして出力
 * @exsample
 * node typedef.js -o:$tmp/typedef
 * node typedef.js authScriptProperties > ~/Desktop/tmp/authScriptProperties.md
 */

/**
 * @typedef {Object} Item - 各項目の定義
 * @prop {string} name - 項目名
 * @prop {string} type - JavaScriptのデータ型
 * @prop {string} [note] - 当該項目の説明
 * @prop {string} [default] - 既定値。クォーテーションも付加のこと。
 * @prop {boolean} [isOpt=true] - 任意項目ならfalse。defaultが設定されたら強制的にfalseに設定
 */

/**
 * @typedef {Object} DataType - データ型の定義
 * @prop {string} [type='Object'] - JavaScriptのデータ型
 * @prop {string|string[]} [note] - 当該項目の説明、補足。配列なら箇条書きする
 * @prop {Item[]} prop - 項目
 */
const typedef = {
  authClientConfig: {note:'authConfigを継承した、authClientで使用する設定値',
    type: 'Object',
    prop: [
      {name:'x',type:'string',note:'サーバ側WebアプリURLのID(`https://script.google.com/macros/s/(この部分)/exec`)'},
    ],
  },
  authConfig: {note:['authClient/authServer共通で使用される設定値。',
      'authClientConfig, authServerConfigの親クラス',
    ],
    type: 'Object',
    prop: [
      {name:'systemName',type:'string',note:'システム名',default:'auth'},
      {name:'adminMail',type:'string',note:'管理者のメールアドレス'},
      {name:'adminName',type:'string',note:'管理者名'},
      {name:'allowableTimeDifference',type:'string',note:'クライアント・サーバ間通信時の許容時差。既定値：2分',default:120000},
      {name:'RSAbits',type:'string',note:'鍵ペアの鍵長',default:2048},
    ],
  },
  authIndexedDB: {note:['クライアントのIndexedDBに保存するオブジェクト',
      'IndexedDB保存時のキー名は`authConfig.system.name`から取得'
    ],
    type: 'Object',
    prop: [
      {name:'keyGeneratedDateTime',type:'number',note:[
        '鍵ペア生成日時。UNIX時刻(new Date().getTime())',
        'なおサーバ側でCPkey更新中にクライアント側で新たなCPkeyが生成されるのを避けるため、鍵ペア生成は30分以上の間隔を置く。'
      ]},
      {name:'memberId',type:'string',note:'メンバの識別子(=メールアドレス)'},
      {name:'profile',type:'Object',note:'メンバの属性'},
      {name:'profile.memberName',type:'string',note:'メンバ(ユーザ)の氏名(ex."田中　太郎")。加入要求確認時に管理者が申請者を識別する他で使用。'},
      {name:'CSkeySign',type:'CryptoKey',note:'署名用秘密鍵'},
      {name:'CPkeySign',type:'CryptoKey',note:'署名用公開鍵'},
      {name:'CSkeyEnc',type:'CryptoKey',note:'暗号化用秘密鍵'},
      {name:'CPkeyEnc',type:'CryptoKey',note:'暗号化用公開鍵'},
      {name:'SPkey',type:'string',note:'サーバ公開鍵(Base64)'},
      {name:'ApplicationForMembership',type:'number',note:'加入申請実行日時。未申請時は-1',default:-1},
      {name:'expireAccount',type:'number',note:'加入承認の有効期間が切れる日時。未加入時は-1',default:-1},
      {name:'expireCPkey',type:'number',note:'CPkeyの有効期限。未ログイン時は-1',default:-1},
    ]
  },
  authRequest: {note:'authClientからauthServerに送られる処理要求オブジェクト',
    type: 'Object',
    prop: [
      {name:'memberId',type:'string',note:'メンバの識別子(=メールアドレス)'},
      {name:'deviceId',type:'string',note:'デバイスの識別子'},
      {name:'requestId',type:'string',note:'要求の識別子。UUID'},
      {name:'timestamp',type:'number',note:'要求日時。UNIX時刻'},
      {name:'func',type:'string',note:'サーバ側関数名'},
      {name:'arguments',type:'any[]',note:'サーバ側関数に渡す引数の配列'},
      {name:'signature',type:'string',note:'クライアント側署名'},
    ],
  },
  authResponse: {note:'authServerからauthClientに返される処理結果オブジェクト',
    type: 'Object',
    prop: [
      {name:'requestId',type:'string',note:'要求の識別子。UUID'},
      {name:'timestamp',type:'number',note:'処理日時。UNIX時刻'},
      {name:'result',type:'string',note:'処理結果。fatal/warning/normal'},
      {name:'message',type:'string',note:'エラーメッセージ。fatal/warning時に適宜セット',isOpt:true},
      {name:'response',type:'string|Object',note:'要求された関数の戻り値をJSON化した文字列。適宜オブジェクトのまま返す。'},
    ],
  },
  authScriptProperties: {note:'キー名は`authConfig.system.name`、データは以下のオブジェクトをJSON化した文字列。',
    type: 'Object',
    prop:[
      {name:'keyGeneratedDateTime',type:'number',note:'UNIX時刻'},
      {name:'SPkey',type:'string',note:'PEM形式の公開鍵文字列'},
      {name:'SSkey',type:'string',note:'PEM形式の秘密鍵文字列（暗号化済み）'},
    ],
  },
  authServerConfig: {note:'authConfigを継承した、authServerで使用する設定値',
    type: 'Object',
    prop: [
      {name:'memberList',type:'string',note:'memberListシート名',default:'memberList'},
      {name:'defaultAuthority',type:'number',note:'新規加入メンバの権限の既定値',default:0},
      {name:'memberLifeTime',type:'number',note:'メンバ加入承認後の有効期間。既定値：1年',default:31536000000},
      {name:'loginLifeTime',type:'number',note:'ログイン成功後の有効期間(=CPkeyの有効期間)。既定値：1日',default:86400000},

      {name:'func',type:'Object.<string,Object>',note:'サーバ側の関数マップ'},
      {name:'func.authority',type:'number',note:[
        '当該関数実行のために必要となるユーザ権限',
        '`Member.profile.authority & authServerConfig.func.authrity > 0`なら実行可とする。'
      ]},
      {name:'func.do',type:'Function|Arrow',note:'実行するサーバ側関数'},

      {name:'trial',type:'Object',note:'ログイン試行関係の設定値'},
      {name:'trial.passcodeLength',type:'number',note:'パスコードの桁数',default:6},
      {name:'trial.freezing',type:'number',note:'連続失敗した場合の凍結期間。既定値：1時間',default:3600000},
      {name:'trial.maxTrial',type:'number',note:'パスコード入力の最大試行回数',default:3},
      {name:'trial.passcodeLifeTime',type:'number',note:'パスコードの有効期間。既定値：10分',default:600000},
      {name:'trial.generationMax',type:'number',note:'ログイン試行履歴(MemberTrial)の最大保持数。既定値：5世代',default:5},
    ],
  },
  LocalRequest: {note:['クライアント側関数からauthClientに渡すオブジェクト',
      'func,arg共、平文',
    ],
    type: 'Object',
    prop: [
      {name:'func',type:'string',note:'サーバ側関数名'},
      {name:'arguments',type:'any[]',note:'サーバ側関数に渡す引数の配列'},
    ],
  },
  LocalResponse: {note:'authClientからクライアント側関数に返される処理結果オブジェクト',
    type: 'Object',
    prop: [
      {name:'result',type:'string',note:'処理結果。fatal/warning/normal'},
      {name:'message',type:'string',note:'エラーメッセージ。normal時は`undefined`。',isOpt:true},
      {name:'response',type:'any',note:'要求された関数の戻り値。fatal/warning時は`undefined`。`JSON.parse(authResponse.response)`',isOpt:true},
    ],
  },
  MemberDevice: {note:'メンバが使用する通信機器の情報(マルチデバイス対応)',
    type: 'Object',
    prop: [
      {name:'deviceId',type:'string',note:'デバイスの識別子。UUID'},
      {name:'CPkey',type:'string',note:'メンバの公開鍵'},
      {name:'CPkeyUpdated',type:'string',note:'最新のCPkeyが登録された日時'},
      {name:'trial',type:'string',note:'ログイン試行関連情報オブジェクト(MemberTrial[])のJSON文字列'},
    ],
  },
  MemberTrial: {note:'ログイン試行単位の試行情報(Member.trial)',
    type: 'Object',
    prop: [
      {name:'passcode',type:'string',note:'設定されているパスコード'},
      {name:'created',type:'number',note:'パスコード生成日時(≒パスコード通知メール発信日時)'},
      {name:'freezingUntil',type:'number',note:'凍結解除日時。最大試行回数を超えたら現在日時を設定',default:0},
      {name:'CPkeyUpdateUntil',type:'number',note:'CPkey更新処理中の場合、更新期限をUNIX時刻でセット',default:0},
      {name:'log',type:'MemberTrialLog[]',note:'試行履歴。常に最新が先頭(unshift()使用)',default:[]},
    ],
  },
  MemberTrialLog: {note:'MemberTrial.logに記載される、パスコード入力単位の試行記録',
    type: 'Object',
    prop: [
      {name:'entered',type:'string',note:'入力されたパスコード'},
      {name:'result',type:'number',note:'-1:恒久的エラー, 0:要リトライ, 1:パスコード一致'},
      {name:'message',type:'string',note:'エラーメッセージ'},
      {name:'timestamp',type:'number',note:'判定処理日時'},
    ],
  },
  decryptedRequest: {note:'cryptoServerで復号された処理要求オブジェクト',
    type: 'Object',
    prop: [
      {name:'result',type:'string',note:'処理結果。"fatal"(後続処理不要なエラー), "warning"(後続処理が必要なエラー), "success"'},
      {name:'message',type:'string',note:'エラーメッセージ'},
      {name:'detail',type:'string|Object',note:'詳細情報。ログイン試行した場合、その結果'},
      {name:'request',type:'authRequest',note:'ユーザから渡された処理要求'},
      {name:'timestamp',type:'string',note:'復号処理実施日時。メール・ログでの閲覧が容易になるよう、文字列で保存'},
    ],
  },
  encryptedRequest: {note:['authClientからauthServerに渡す暗号化された処理要求オブジェクト',
      'ciphertextはauthRequestをJSON化、RSA-OAEP暗号化＋署名付与した文字列'
    ],
    type: 'Object',
    prop: [
      {name:'memberId',type:'string',note:'メンバの識別子(=メールアドレス)'},
      {name:'deviceId',type:'string',note:'デバイスの識別子'},
      {name:'ciphertext',type:'string',note:'暗号化した文字列'},
    ],
  },
  Member: {note:'メンバ一覧(アカウント管理表)上のメンバ単位の管理情報',
    type: 'Object',
    prop: [
      {name:'memberId',type:'string',note:'メンバの識別子(=メールアドレス)'},
      {name:'name',type:'string',note:'メンバの氏名'},
      {name:'accepted',type:'string',note:'加入が承認されたメンバには承認日時を設定'},
      {name:'reportResult',type:'string',note:'「加入登録」処理中で結果連絡メールを送信した日時'},
      {name:'expire',type:'string',note:'加入承認の有効期間が切れる日時'},
      {name:'profile',type:'string',note:'メンバの属性情報(MemberProfile)を保持するJSON文字列'},
      {name:'device',type:'string',note:'マルチデバイス対応のためのデバイス情報(MemberDevice)を保持するJSON文字列'},
      {name:'note',type:'string',note:'当該メンバに対する備考',isOpt:true},
    ],
  },
  MemberProfile: {note:'メンバの属性情報(Member.profile)',
    type: 'Object',
    prop: [
      {name:'',type:'string',note:''},
    ],
  },
  /*
  : {note:'',
    type: 'Object',
    prop: [
      {name:'',type:'string',note:''},
    ],
  },
  */
}

/** mdBody: Markdown文書の作成 */
function mdBody(dName,obj){
  const dObj = JSON.parse(JSON.stringify(obj));
  const rv = [`\n<a name="${dName}"></a>\n`];  // 先頭の空白行

  // データ型定義に関する説明文
  if( dObj.note ){
    if( typeof dObj.note === 'string' ){
      rv.push(dObj.note);
    } else {
      dObj.note.forEach(x => rv.push(`- ${x}`));
    }
    rv.push('');
  }

  // 項目一覧の出力
  const rows = [
    ['No','項目名','任意','データ型','既定値','説明'],
    ['--:',':--',':--:',':--',':--',':--'],
  ];
  dObj.prop.forEach(o => {
    o.isOpt = o.isOpt ? '⭕' : '❌';
    o.default = o.default ? String(o.default) : '—';
    rows.push([o.num,o.name,o.isOpt,o.type,o.default,o.note]);
  });
  rows.forEach(o => {
    rv.push(`| ${o.join(' | ')} |`);
  });

  rv.push('');  // 末尾の空白行
  return rv.join('\n');
}

/** jsdBody: JSDocの作成 */
function jsdBody(dName,obj){
  const dObj = JSON.parse(JSON.stringify(obj));
  const rv = ['/**'];

  // データ型定義に関する説明文
  dObj.type = dObj.type || 'Object';
  dObj.note = dObj.note ? ' - ' + [dObj.note].join('\n * ') : '';
  dObj.prop = dObj.prop || [],
  rv.push(` * @typedef {${dObj.type}} ${dName}${dObj.note}`);

  // 項目一覧の出力
  dObj.prop.forEach(o => {
    o.default = o.default === '' ? ''
      : (typeof o.default === 'string' ? `"${o.default}"` : String(o.default));
    o.name = o.default ? `${o.name}=${o.default}` : o.name;
    o.name = o.isOpt ? `[${o.name}]` : o.name;
    o.note = o.note ? ` - ${o.note}` : o.note;
    rv.push(` * @prop {${o.type}} ${o.name}${o.note}`);
  });
  rv.push(' */');

  return rv.join('\n');
}
/** メイン処理 */
const fs = require("fs");
function main(){
  const arg = analyzeArg();
  //console.log(JSON.stringify(arg,null,2));

  Object.keys(typedef).forEach(x => {
    // 各項目の既定値設定
    for( let i=0 ; i<typedef[x].prop.length ; i++ ){
      typedef[x].prop[i] = Object.assign({
        num : i+1,
        isOpt: typedef[x].prop[i].default ? true : (typedef[x].prop[i].isOpt || false),
        default: '',
        note: '',
      },typedef[x].prop[i]);
    }

    try {
      fs.writeFileSync(`${arg.opt.o}/${x}.md`, mdBody(x,typedef[x]));
      fs.writeFileSync(`${arg.opt.o}/${x}.js`, jsdBody(x,typedef[x]));
      console.log(`write end : ${x}`);
    }catch(e){
      console.log(e);
    }
  });
}
main();

/**
 * @typedef {object} AnalyzeArg - コマンドライン引数の分析結果
 * @prop {Object.<string, number>} opt - スイッチを持つ引数について、スイッチ：値形式にしたオブジェクト
 * @prop {string[]} val - スイッチを持たない引数の配列
 */
/**
 * @desc コマンドラインから`node xxx.js aa bb`を実行した場合の引数(`aa`,`bb`)を取得し、オブジェクトにして返す。<br>
 *
 * @example
 *
 * ```
 * node xxx.js -i:aaa.html bbb -o:ccc.json ddd eee
 * ⇒ {opt:{i:"aaa.html",o:"ccc.json"},val:["bbb","ddd","eee"]}
 * ```
 *
 * <caution>注意</caution>
 *
 * - スイッチは`(\-*)([0-9a-zA-Z]+):*(.*)$`形式であること
 * - スイッチに該当しないものは配列`val`にそのまま格納される
 *
 * @param {void} - なし
 * @returns {AnalyzeArg} 分析結果のオブジェクト
 */
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