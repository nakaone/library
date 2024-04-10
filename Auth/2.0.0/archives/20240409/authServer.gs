function test(){
  const v = {whois:'test',rv:null,step:0,
    list:['passphrase','public','secret']};
  console.log(`${v.whois} start.`);
  try {

    // ビット数とパスフレーズ
    v.bits = 2048;
    v.passphrase = 'the-passphrase';

    // 秘密鍵の生成
    v.sKey = cryptico.generateRSAKey(v.passphrase, v.bits);

    // 公開鍵
    v.pKey = cryptico.publicKeyString(v.sKey);

    // 秘密鍵
    v.secret = v.sKey;// JSON.stringify(v.sKey.toJSON());

    // プロパティサービスへの保存
    v.list.forEach(x => {
      PropertiesService.getDocumentProperties().setProperty(x,v[x]);
    });

    // 保存した鍵の読込
    v.list.forEach(x => {
      console.log(`${x} = ${PropertiesService.getDocumentProperties().getProperty(x)}`);
    });

    console.log('complete');


    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;  // 引数
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}

function stringify(variable,opt={addType:false}){
  const v = {whois:'stringify',rv:null,step:0};
  const conv = arg => {
    const w = {type:whichType(arg)};
    w.pre = opt.addType ? `[${w.type}]` : '';
    switch( w.type ){
      case 'Function': case 'Arrow': case 'Symbol':
        w.rv = w.pre + arg.toString(); break;
      case 'BigInt':
        w.rv = w.pre + parseInt(arg); break;
      case 'Undefined':
        w.rv = w.pre + 'undefined'; break;
      case 'Object':
        w.rv = {};
        for( w.i in arg ){
          // 自分自身(stringify)は出力対象外
          if( w.i === 'stringify' ) continue;
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      case 'Array':
        w.rv = [];
        for( w.i=0 ; w.i<arg.length ; w.i++ ){
          w.rv[w.i] = conv(arg[w.i]);
        }
        break;
      default:
        w.rv = w.pre + arg;
    }
    return w.rv;
  };
  //console.log(`${v.whois} start.\nvariable=${variable}\nopt=${JSON.stringify(opt)}`);
  try {

    v.step = 1; // 事前準備
    if( typeof opt === 'boolean' ) opt={addType:opt};

    v.step = 2; // 終了処理
    //console.log(`${v.whois} normal end.`);
    return JSON.stringify(conv(variable));

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}

function whichType(arg,is){
  let rv = String(Object.prototype.toString.call(arg).slice(8,-1));
  switch(rv){
    case 'Number': if(Number.isNaN(arg)) rv = 'NaN'; break;
    case 'Function': if(!('prototype' in arg)) rv = 'Arrow'; break;
  }
  if( typeof is === 'string' ){
    return rv.toLowerCase() === is.toLowerCase();
  } else {
    return rv;
  }
}