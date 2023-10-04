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
 * @typedef {Object} AuthArg - preProcessからauth/recept1A/1B/2A/2Bに渡されるオブジェクト
 * @prop {string} fm - 発信者名(gateway/master/受付番号)
 * @prop {string} to - 宛先名(gateway/master)
 * @prop {number} md - モード。0:平文、1:共通鍵、2:RSA署名無し、3:RSA署名有り
 * @prop {number} ts - 発信日時(new Date().getTime())
 * @prop {string} fc - 復号化済の呼出先の処理名(ex."auth1A")
 * @prop {any}    dt - 呼出先の処理に渡す引数。復号化済のtoken.dt.arg
 * @prop {string} signature - 以下はpreProcessでの追加項目。署名付き暗号化だった場合、"verified" or "undefined"
 * @prop {string} pKey - 署名付き暗号化だった場合、署名検証で取得した発信者の公開鍵
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
 * @prop {any} result - 処理結果
 */

/** doPostの内容を受けて処理を分岐
 * @param {token} token - doPostから渡されたトークン
 * @returns {fetchResponse} 処理結果
 */
function preProcess(token){
  const v = {whois:'preProcess',step:'0',arg:{},rv:null};
  console.log(v.whois+' start.',whichType(token),token);
  try {
    v.arg = JSON.parse(token);

    v.step = '1'; // 発信から3分以内でないとエラー
    v.now = Date.now();
    if( v.arg.ts > v.now || (v.now - v.arg.ts) > 180000 ){
      throw new Error("Invalid Token: timeout");
    }

    v.step = '2'; // RSAシートの読み込み
    v.sheet = SpreadsheetApp.getActive().getSheetByName('RSA');
    v.step = '2.1'; // 再計算用にセル値を更新
    v.sheet.getRange('b1').setValue(new Date());
    SpreadsheetApp.flush();
    v.step = '2.2'; // RSAシートの値をv.argにセット
    v.values = v.sheet.getDataRange().getValues();
    for( v.i=0 ; v.i<v.values.length ; v.i++ ){
      if( String(v.values[v.i][0]).length > 0 ){
        v.arg[v.values[v.i][0]] = v.values[v.i][1];
      }
    }
    v.arg.RSAkey = cryptico.generateRSAKey(v.arg.passPhrase,1024);
    console.log(v.whois+'.'+v.step+': v.arg',v.arg);

    v.step = '3'; // 暗号化されていた場合は復号
    if( v.arg.md > 0 ){
      if( v.arg.md === 1 ){ // 共通鍵方式
        v.arg.dt = JSON.parse(decryptAES(v.arg.dt,v.arg.common));
      } else {
        v.decrypt = cryptico.decrypt(v.arg.dt,v.arg.RSAkey);
        if( v.decrypt.signature !== 'verified' ){
          throw new Error("Invalid Token: decrypt failed."
          + "\ndecrypt: " + JSON.stringify(v.decript)
          + "\nv.arg["+v.arg.fm+"]: " + v.arg[v.arg.fm]
          );
        }
        v.arg.signature = v.decrypt.signature;
        v.arg.pKey = v.decrypt.publicKeyString;
        v.arg.dt = JSON.parse(decodeURI(v.decrypt.plaintext));
      }
    }
    v.arg.fc = v.arg.dt.fc;
    v.arg.dt = v.arg.dt.arg;

    console.log(v.whois+'.'+v.step+': v.arg.dt',v.arg.dt);

    v.step = '4'; // 処理の振り分け
    if( v.arg.to === 'gateway' ){
      switch( v.arg.fc ){
        case 'auth1A'  : v.rv = auth1A(v.arg); break; // クライアントから認証局への接続要求
        case 'auth2A'  : v.rv = auth2A(v.arg); break; // クライアントから認証局にパスコード入力
        case 'recept1A': v.rv = recept1A(v.arg); break;
        case 'recept2A': v.rv = recept2A(v.arg); break;
        case 'delivery': v.rv = delivery(v.arg); break;
        case 'post'    : v.rv = post(v.arg); break;
      }
    } else if( v.arg.to === 'master' ){
      switch( v.arg.fc ){
        case 'auth1B'  : v.rv = auth1B(v.arg); break; // 認証局から管理局にパスコード通知依頼
        case 'auth2B'  : v.rv = auth2B(v.arg); break; // 認証局から管理局にパスコード連絡、管理局で判定
        case 'recept1B': v.rv = recept1B(v.arg); break;
        case 'recept2B': v.rv = recept2B(v.arg); break;
      }
    }

    v.step = '5';
    console.log(v.whois+' normal end.',v.rv);
    return v.rv;
  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e.stack,v);
  }
}

/* ----------------------------------------------------
以降、各関数のparamはAuthArg.dtを指す。
同様にreturnsはfetchResponse.resultを指す。
---------------------------------------------------- */

/** 認証局での認証の第一段階
 * @param {AuthArg} arg - クライアントの受付番号、公開鍵他
 * @returns {string} 認証局の公開鍵(fetchResponse.result)
 */
function auth1A(arg){
  const v = {whois:'認証局.auth1A',
    rv:{isErr:false,message:'',stack:'',result:null}};
  try {
    console.log(v.whois+' start.',arg);

    v.step = '1.1'; // auth1B問合せ用にデータを暗号化
    v.dt = JSON.stringify({
      fc : 'auth1B',
      arg: {  // auth1B()に渡す引数
        entryNo  : arg.dt.entryNo,    // クライアントの受付番号
        publicKey: arg.dt.publicKey,  // 同公開鍵
      }
    });
    console.log(v.whois+'.'+v.step+': v.dt='+v.dt);
    
    v.step = '1.2'; // 暗号化。受付番号＋公開鍵なのでencodeURIは省略
    v.dt = cryptico.encrypt(v.dt,arg.master,arg.RSAkey);
    if( v.dt.status !== 'success' )
      throw new Error("auth1A encrypt failed.\n"+JSON.stringify(v.dt));

    v.step = '2.1'; // auth1Bに問い合わせ
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
    console.log(v.whois+'.'+v.step+': res='+v.res);
    v.step = '2.2';
    v.rv = JSON.parse(v.res);

    if( !v.rv.isErr ){
      v.step = '3'; // auth1B正常終了なら認証局の公開鍵を返信
      v.rv.result = arg.publicKey;
    }

    v.step = '4';
    console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
    return v.rv;

  } catch(e) {
    console.error(v.whois+' abnormal end.(at step.'+v.step+')\n'
    + e.message + '\n' + e.stack);
    console.error(JSON.stringify(v));
    v.rv.isErr = true;
    v.rv.message = e.message;
    v.rv.stack = e.stack;
    return v.rv;
  }
}

/** 管理局での認証の第一段階
 * @param {AuthArg} arg - クライアントの受付番号、公開鍵他
 * @returns {void} 特に無し(fetchResponse.isErrのみ必要)
 */
function auth1B(arg){
  const v = {whois:'管理局.auth1B',
    rv:{isErr:false,message:'',stack:'',result:null}};
  try {
    console.log(v.whois+' start.',arg);

    v.step = '1'; // クライアント情報を抽出
    v.master = szSheet('master');
    v.client = v.master.lookup(arg.dt.entryNo,'entryNo');

    v.step = '2'; // 3回連続失敗後1時間以内ならチャレンジ不可判定
    if( String(v.client.NG2).length > 0 &&
      (Date.now() - v.client.NG2) < 3600000 ){
      v.rv = {
        isErr: true,
        message:'3回連続ログイン失敗後、1時間経過していません',
      };
      return v.rv;
    }

    v.step = '3'; // 該当受付番号にpassCode,publicKey登録
    v.master.update({
      publicKey: arg.dt.publicKey,  // クライアントの公開鍵
      passCode: arg.random, // パスコード
      genPassCode: new Date(),  // パスコード生成日時
      NG1:'',NG2:'',            // 不適切パスコード入力時刻をクリア
      certificate: '',  // 認証正常終了日時はクリア
    },{key:'entryNo',value:arg.dt.entryNo});

    v.step = '4'; // 申請者にpassCode連絡メール送信
    v.draft = GmailApp.createDraft(
      v.client['メールアドレス'],
      '[連絡]校庭キャンプ2023 パスコード',
      "パスコードは以下の通りです。\n\n" + arg.random,
      {
        //htmlBody: v.html,
        name: '下北沢小おやじの会',
      }
    );
    v.step = '4.1';
    GmailApp.getDraft(v.draft.getId()).send();
    console.log(v.whois+'.'+v.step+': Mail Remaining Daily Quota:'
      + MailApp.getRemainingDailyQuota());

    v.step = '5';
    console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
    return v.rv;

  } catch(e) {
    console.error(v.whois+' abnormal end.(at step.'+v.step+')\n'
    + e.message + '\n' + e.stack);
    console.error(JSON.stringify(v));
    v.rv.isErr = true;
    v.rv.message = e.message;
    v.rv.stack = e.stack;
    return v.rv;
  }
}

/** 認証局での認証の第二段階
 * @param {AuthArg} arg - クライアントの受付番号、公開鍵他
 * @returns {Object} - fetchResponse.result={common:共通鍵,info:クライアント情報}
 * 
 * ## 注意事項
 * 
 * clientからのtokenは署名されているが、認証局はclientのpublicKeyを
 * 持たないので検証は省略し、そのまま管理局に送って管理局側で検証する。
 */
function auth2A(arg){
  const v = {whois:'認証局.auth2A',
    rv:{isErr:false,message:'',stack:'',result:null}};
  try {
    console.log(v.whois+' start.',arg);

    v.step = '1.1'; // auth2B問合せ用にデータを暗号化
    v.dt = JSON.stringify({
      fc : 'auth2B',
      arg: {  // auth2B()に渡す引数
        entryNo  : arg.dt.entryNo,  // クライアントから送られた受付番号
        passCode : arg.dt.passCode, // 同パスコード
        timestamp: arg.ts,    // 同送付日時
        publicKey: arg.pKey,  // 同公開鍵
      }
    });
    v.step = '1.2'; // 暗号化。受付番号＋パスコードなのでencodeURIは省略
    v.dt = cryptico.encrypt(v.dt,arg.master,arg.RSAkey);
    if( v.dt.status !== 'success' )
      throw new Error("auth2A encrypt failed.\n"+JSON.stringify(v.dt));

    v.step = '2.1'; // auth2Bに問い合わせ
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
    console.log(v.whois+'.'+v.step+': res='+v.res);
    v.step = '2.2';
    v.res = JSON.parse(v.res);

    v.step = '3'; // 問合せ結果により処理分岐
    if( v.res.isErr ){
      v.step = '3.1'; // auth2Bでエラー発生ならそのまま返す
      return v.res;
    } else {
      v.step = '3.2'; // auth2B正常終了なら情報提供
      v.rv.result = {
        common: arg.common, // 共通鍵
        info  : v.res.result, // クライアントの登録情報
      }
    }

    v.step = '4';
    console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
    return v.rv;

  } catch(e) {
    console.error(v.whois+' abnormal end.(at step.'+v.step+')\n'
    + e.message + '\n' + e.stack);
    console.error(JSON.stringify(v));
    v.rv.isErr = true;
    v.rv.message = e.message;
    v.rv.stack = e.stack;
    return v.rv;
  }
}

/** 管理局での認証の第二段階
 * @param {AuthArg} arg - クライアントの受付番号、パスコード、送信日時、公開鍵他
 * @returns {Object} - fetchResponse.result=クライアントの登録情報
 */
function auth2B(arg){
  const v = {whois:'管理局.auth2B',
  rv:{isErr:true,message:'',stack:'',result:null}};
  try {
    console.log(v.whois+' start.',arg);

    v.step = '1'; // クライアント情報を抽出
    v.master = szSheet('master');
    v.client = v.master.lookup(arg.dt.entryNo,'entryNo');
    console.log(v.whois+'.'+v.step+': v.client',v.client);

    // 正しいパスコードが入力されたか判定
    v.update = null;
    if( (Date.now() - new Date(v.client.genPassCode).getTime()) > 3600000 ){
      v.step = '2.1'; // 有効期限切れ
      v.rv.message = 'パスコードの有効期限(発行後1時間)を過ぎています。';
      v.rv.result = true;  // クライアント側のパスコード入力画面を閉じ、受付番号入力画面に遷移
    } else if( ('000000'+v.client.passCode).slice(-6) !== arg.dt.passCode ){
      v.step = '2.2'; // パスコード不一致
      if( String(v.client.NG2).length > 0 ){
        v.step = '2.2.1'; // 連続3回不適切
        v.rv.message = '3回連続で不適切なパスコードが入力されました。1時間ロックアウトされます';
        v.rv.result = true;  // クライアント側のパスコード入力画面を閉じ、受付番号入力画面に遷移
      } else {
        v.step = '2.2.2'; // 連続3回未満
        v.rv.message = 'パスコードが不適切です';
        v.rv.result = false;
        if( String(v.client.NG1).length === 0 ){
          v.update = {NG1: Date.now()};
        } else {
          v.update = {NG2: Date.now()};
        }
      }
    } else if( v.client.publicKey !== arg.dt.publicKey ){
      v.step = '2.3'; // 公開鍵不一致
      v.rv.message = '不適切な公開鍵です';
      v.rv.result = true;
    } else {
      v.step = '2.4'; // 全条件をクリア
      v.rv.isErr = false;
      // クライアントの情報を提供
      v.rv.result = v.client;
      v.rv.message = '正常に認証されました';
      // パスコード確認日時を更新、NGnをクリア
      v.update = {certificate: new Date()};
    }
    v.step = '2.5'; // masterシートの更新
    if( v.master !== null ){
      v.master.update(v.update,{key:'entryNo',value:arg.dt.entryNo});
    }

    v.step = '3';
    console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
    return v.rv;

  } catch(e) {
    console.error(v.whois+' abnormal end.(at step.'+v.step+')\n'
    + e.message + '\n' + e.stack);
    console.error(JSON.stringify(v));
    v.rv.isErr = true;
    v.rv.message = e.message;
    v.rv.stack = e.stack;
    return v.rv;
  }
}