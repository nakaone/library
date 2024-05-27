/** sendPasscode: 指定ユーザにパスコード連絡メールを発信する
 * 
 * @param {number} userId=null - ユーザID
 * @returns {null|Error}
 */
w.func.sendPasscode = function(userId=null){
  const v = {whois:w.whois+'.sendPasscode',step:0,rv:null};
  console.log(`${v.whois} start. userId(${typeof userId})=${userId}`);
  try {

    v.step = 1; // パスコード生成、trialを更新
    v.passcode = ('0'.repeat(w.prop.passcodeDigits)
      + Math.floor(Math.random() * (10 ** w.prop.passcodeDigits))).slice(-w.prop.passcodeDigits);
    v.r = w.master.update({trial:JSON.stringify({
      passcode: v.passcode,
      created: Date.now(),
      log: [],
    })},{where:x => x[w.prop.primatyKeyColumn] === userId});

    
    v.step = 2; // マスタ(SingleTable)からユーザ情報を特定
    v.user = w.master.select({where: x => x[w.prop.primatyKeyColumn] === userId})[0];
    if( v.user instanceof Error ) throw v.user;
    if( !v.user ) throw new Error('userId nomatch');


    v.step = 3; // パスコード連絡メールを発信
    v.rv = sendmail(
      v.user.email,
      w.prop.notificatePasscodeMail.subject,
      w.prop.notificatePasscodeMail.body.replace('::passcode::',v.passcode),
      w.prop.notificatePasscodeMail.options,
    );
    if( v.rv instanceof Error ) throw v.rv;


    v.step = 4; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
