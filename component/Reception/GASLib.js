/**
 * @typedef {Object} token - doPostからpreProcessに渡されるオブジェクト
 * @prop {string} fm - 発信者名(gateway/master/受付番号)
 * @prop {string} to - 宛先名(gateway/master)
 * @prop {number} md - モード。0:平文、1:共通鍵、2:RSA署名無し、3:RSA署名有り
 * @prop {number} ts - 発信日時(new Date().getTime())
 * @prop {string} dt - 以下の要素をJSON化した上で暗号化した文字列(cipher)
 * @prop {string} dt.fc - 呼出先の処理名(ex."auth1A")
 * @prop {any} dt.arg - 呼出先の処理に渡す引数
 */

/**
 * @typedef {Object} AuthArg - preProcessからauth1A/1B/2A/2Bに渡されるオブジェクト
 * @prop {string} fm - 発信者名(gateway/master/受付番号)
 * @prop {string} to - 宛先名(gateway/master)
 * @prop {number} md - モード。0:平文、1:共通鍵、2:RSA署名無し、3:RSA署名有り
 * @prop {number} ts - 発信日時(new Date().getTime())
 * @prop {string} fc - 復号化済の呼出先の処理名(ex."auth1A")
 * @prop {any}    dt - 呼出先の処理に渡す引数。復号化済のtoken.dt.arg
 * @prop {string} signature - 以下はpreProcessでの追加項目。署名付き暗号化だった場合、"verified" or "undefined"
 * @prop {string} publicKey - 署名付き暗号化だった場合、署名検証で取得した発信者の公開鍵
 * @prop {Date}   lastAccess - 最終アクセス日時(RASシート再計算用再設定項目)
 * @prop {string} name - 自局名
 * @prop {string} passPhrase - 自局のパスワード
 * @prop {string} publicKey - 自局の公開鍵
 * @prop {string} masterAPI/gatewayAPI - 相手局のAPI
 * @prop {string} master/gateway - 相手局の公開鍵
 * @prop {string} common - 共通鍵(認証局のみ)
 * @prop {string} random - パスコード(管理局のみ)
 */

/**
 * @typedef {Object} fetchResponse - auth1A/1B/2A/2BからpreProcess経由で呼出元に返されるオブジェクト
 * @prop {boolean} isErr - エラーならtrue
 * @prop {string} message='' - 処理結果に対するメッセージ
 * @prop {string} stack='' - エラーオブジェクトのスタック
 * @prop {any} result - 処理結果。エラーの場合はnull
 */

/* ----------------------------------------------------
以降、各関数のparamはAuthArg.dtを指す。
同様にreturnsはfetchResponse.resultを指す。
---------------------------------------------------- */

/** 受け取った検索キーを管理局に転送、結果を問合せ元に返信
 * @param {string} arg - 検索キー文字列(受付番号または氏名)
 * @returns {Object[]} 該当者情報の配列
 */
function recept1A(arg){
  const v = {whois:'認証局.recept1A',
    rv:{isErr:false,message:'',stack:'',result:null}};
  try {
    console.log(v.whois+' start.',arg.dt);

    v.step = '1.1'; // recept1B問合せ用にデータを暗号化
    v.dt = JSON.stringify({
      fc : 'recept1B',
      arg: {  // recept1B()に渡す引数
        keyword  : arg.dt,    // 検索キー文字列
        entryNo  : arg.fm,    // クライアントの受付番号
        publicKey: arg.publicKey,  // 同公開鍵
      }
    });
    console.log('v.dt='+v.dt);
    
    v.step = '1.2'; // 暗号化
    v.dt = encodeURI(v.dt); // カナ漢字が入るのでencode
    v.dt = cryptico.encrypt(v.dt,arg.master,arg.RSAkey);
    if( v.dt.status !== 'success' )
      throw new Error("recept1A encrypt failed.\n"+JSON.stringify(v.dt));

    v.step = '2.1'; // recept1Bに問い合わせ
    v.res = UrlFetchApp.fetch(arg.masterAPI,{
      'method': 'post',
      'contentType': 'application/json',
      'muteHttpExceptions': true, // https://teratail.com/questions/64619
      'payload' : JSON.stringify({
        fm: 'gateway',
        to: 'master',
        md: 3,  // 署名付き暗号化
        ts: Date.now(),
        dt: v.dt.cipher,
      }),  
    }).getContentText();
    console.log('res='+v.res);
    v.step = '2.2';
    v.rv = JSON.parse(v.res);

    v.step = '3'; // 成功/不成功に関わらずrecept1Bの戻り値を返信
    console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
    return v.rv;

  } catch(e) {
    console.error(v.whois+' abnormal end.(step.'+v.step+')\n'
    + e.message + '\n' + e.stack);
    console.error(JSON.stringify(v));
    v.rv.isErr = true;
    v.rv.message = e.message;
    v.rv.stack = e.stack;
    return v.rv;
  }
}

/** 問合せの正当性を確認、問題なければ検索キーに該当する参加者情報を返す
 * @param {Object} arg 
 * @param {string} arg.keyword - 検索キー文字列(受付番号または氏名)
 * @param {string} arg.entryNo - 問合せ元の受付番号
 * @param {string} arg.publicKey - 問合せ元の公開鍵
 * @returns {Object[]} 該当者情報の配列
 * 
 * ## 正当性のチェックポイント
 * 
 * 1. 問合せ元のentryNoはauthrityを持つ
 * 1. 問合せ元の公開鍵が登録されているpublicKeyと一致
 * 1. 検索キー文字列が①数字のみ②カナ漢字のみのいずれか
 */
function recept1B(arg){
  const v = {whois:'管理局.recept1B',
    rv:{isErr:false,message:'',stack:'',result:null}};
  try {
    console.log(v.whois+' start.',arg.dt);

    v.step = '1'; // クライアント情報を抽出
    v.master = szSheet('master');
    v.client = v.master.lookup(arg.dt.entryNo,'entryNo');

    // 正当性チェック
    v.step = '2.1'; // 問合せ元のentryNoはauthrityを持つ
    if( (v.client.authority & 2) === 0 ){
      v.rv.isErr = true;
      v.rv.message = '検索権限がありません';
    }
    v.step = '2.2'; // 問合せ元の公開鍵が登録されているpublicKeyと一致
    if( v.client.publicKey !== arg.dt.publicKey ){
      v.rv.isErr = true;
      v.rv.message = '問合せ元が不適切です';
    }
    v.step = '2.3'; // 検索キー文字列が①数字のみ②カナ漢字のみのいずれか
    v.ja = /^[\p{scx=Hiragana}\p{scx=Katakana}\p{scx=Han}]+$/u;
    v.num = /^[0-9]+$/;
    if( !v.ja.test(arg.dt.keyword) && !v.num.test(arg.dt.keyword) ){
      v.rv.isErr = true;
      v.rv.message = '検索キー文字列が不適切です';
    }
    v.step = '2.4';
    if( v.rv.isErr ) return v.rv;

    v.step = '3'; // 検索キーに合致する参加者情報を抽出
    v.rv.result = [];
    v.master.data.forEach(d => {
      if(
        Number(d.entryNo) === Number(arg.dt.keyword)
        || d['申込者氏名'].indexOf(arg.dt.keyword) >= 0
        || d['申込者カナ'].indexOf(arg.dt.keyword) >= 0
        || d['参加者01氏名'].indexOf(arg.dt.keyword) >= 0
        || d['参加者01カナ'].indexOf(arg.dt.keyword) >= 0
        || d['参加者02氏名'].indexOf(arg.dt.keyword) >= 0
        || d['参加者02カナ'].indexOf(arg.dt.keyword) >= 0
        || d['参加者03氏名'].indexOf(arg.dt.keyword) >= 0
        || d['参加者03カナ'].indexOf(arg.dt.keyword) >= 0
        || d['参加者04氏名'].indexOf(arg.dt.keyword) >= 0
        || d['参加者04カナ'].indexOf(arg.dt.keyword) >= 0
        || d['参加者05氏名'].indexOf(arg.dt.keyword) >= 0
        || d['参加者05カナ'].indexOf(arg.dt.keyword) >= 0
      ) v.rv.push(d);
    });

    v.step = '4';
    console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
    return v.rv;

  } catch(e) {
    console.error(v.whois+' abnormal end.(step.'+v.step+')\n'
    + e.message + '\n' + e.stack);
    console.error(JSON.stringify(v));
    v.rv.isErr = true;
    v.rv.message = e.message;
    v.rv.stack = e.stack;
    return v.rv;
  }
}

/** 変更された参加者情報を管理局に転送、問題なければ変更結果を返す
 * @param {Object.<string, any>} arg - 変更された{項目名：値}。受付番号は必須
 * @returns {fetchResponse} 変更結果
 */
function recept2A(arg){
  const v = {whois:'認証局.recept2A',
    rv:{isErr:false,message:'',stack:'',result:null}};
  try {
    console.log(v.whois+' start.',arg.dt);

    v.step = '1.1'; // recept2B問合せ用にデータを暗号化
    v.dt = JSON.stringify({
      fc : 'recept2B',
      arg: {  // recept2B()に渡す引数
        entryNo  : arg.fm,    // クライアントの受付番号
        publicKey: arg.publicKey,  // 同公開鍵
        data     : arg.dt,    // 変更された参加者情報
      }
    });
    console.log('v.dt='+v.dt);
    
    v.step = '1.2'; // 暗号化
    v.dt = encodeURI(v.dt); // カナ漢字が入るのでencode
    v.dt = cryptico.encrypt(v.dt,arg.master,arg.RSAkey);
    if( v.dt.status !== 'success' )
      throw new Error("recept2A encrypt failed.\n"+JSON.stringify(v.dt));

    v.step = '2.1'; // recept1Bに問い合わせ
    v.res = UrlFetchApp.fetch(arg.masterAPI,{
      'method': 'post',
      'contentType': 'application/json',
      'muteHttpExceptions': true, // https://teratail.com/questions/64619
      'payload' : JSON.stringify({
        fm: 'gateway',
        to: 'master',
        md: 3,  // 署名付き暗号化
        ts: Date.now(),
        dt: v.dt.cipher,
      }),  
    }).getContentText();
    console.log('res='+v.res);
    v.step = '2.2';
    v.rv = JSON.parse(v.res);

    v.step = '3'; // 成功/不成功に関わらずrecept1Bの戻り値を返信
    console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
    return v.rv;

  } catch(e) {
    console.error(v.whois+' abnormal end.(step.'+v.step+')\n'
    + e.message + '\n' + e.stack);
    console.error(JSON.stringify(v));
    v.rv.isErr = true;
    v.rv.message = e.message;
    v.rv.stack = e.stack;
    return v.rv;
  }
}

/** 変更要求の正当性を確認、問題なければ変更結果を返す
 * 
 * @param {Object} arg 
 * @param {string} arg.entryNo - 問合せ元の受付番号
 * @param {string} arg.publicKey - 問合せ元の公開鍵
 * @param {Object} arg.data - 変更された参加者情報(recept2Aの引数)
 * @returns {fetchResponse} 変更結果
 * 
 * ## 正当性のチェックポイント
 * 
 * 1. 問合せ元のentryNoはauthrityを持つ
 * 1. 問合せ元の公開鍵が登録されているpublicKeyと一致
 */
function recept2B(arg){
  const v = {whois:'管理局.recept2B',
    rv:{isErr:false,message:'',stack:'',result:null}};
  try {
    console.log(v.whois+' start.',arg.dt);

    v.step = '1'; // クライアント情報を抽出
    v.master = szSheet('master');
    v.client = v.master.lookup(arg.dt.entryNo,'entryNo');

    // 正当性チェック
    v.step = '2.1'; // 問合せ元のentryNoはauthrityを持つ
    if( (v.client.authority & 2) === 0 ){
      v.rv.isErr = true;
      v.rv.message = '検索権限がありません';
    }
    v.step = '2.2'; // 問合せ元の公開鍵が登録されているpublicKeyと一致
    if( v.client.publicKey !== arg.dt.publicKey ){
      v.rv.isErr = true;
      v.rv.message = '問合せ元が不適切です';
    }
    v.step = '2.3';
    if( v.rv.isErr ) return v.rv;

    v.step = '3'; // 検索キーに合致する参加者情報を抽出
    v.rv.result = v.master.update(arg.dt,
      {key:'entryNo',value:arg.data.entryNo});

    v.step = '4';
    console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
    return v.rv;

  } catch(e) {
    console.error(v.whois+' abnormal end.(step.'+v.step+')\n'
    + e.message + '\n' + e.stack);
    console.error(JSON.stringify(v));
    v.rv.isErr = true;
    v.rv.message = e.message;
    v.rv.stack = e.stack;
    return v.rv;
  }
}
