
class Auth {
  constructor(gatewayUrl,opt={}){
    const v = {rv:null};
    console.log('Auth.constructor start.');
    try {
      this.constructorStart = Date.now();
      this.#setProperties(this,null,opt);
      console.log('this:',this);
      console.log(Date.now()-this.constructorStart);
      this.gateway.url = gatewayUrl;
      console.log(Date.now()-this.constructorStart);
      this.#setWindows();
      this.#changeScreen('loading');
      console.log(Date.now()-this.constructorStart);
      this.#setupKeys();
      console.log(Date.now()-this.constructorStart);
      this.#changeScreen('entryNo');
      console.log('Auth.constructor end.');
      return v.rv;
    } catch(e){
      console.error('Auth.constructor abnormal end.',e);
      throw e;
    }
  }
  #setProperties(dest,def,opt){
    const v = {rv:true,def:{
      parentSelector: "body",
      RSA:{
        bits: 1024,
        passWord: null,
        pwLength: 32,
        sKey: null,
        pKey: null,
      },
      info: null,
      gateway:{
        url: null,
        pKey: null,
      },
      front: {
        url: null,
        pKey: null,
      },
      AuthWindow: {
        element: null,
        zIndex: 2147483646,
      },
      entryNo:{
        element: null,
        value: '',
        header:'',
        msg1:'受付番号を入力してください',
        button:'送信',
        msg2:'',
        rex:/^[0-9]{1,4}$/,
      },
      loading: {
        element: null,
        zIndex: 2147483647,
      },
      passCode:{
        element: null,
        header:'',
        msg1:'確認のメールを送信しました。記載されているパスコード(数字6桁)を入力してください。<br>'
        + '※まれに迷惑メールと判定される場合があります。メールが来ない場合、そちらもご確認ください。',
        button:'送信',
        msg2: '※パスコードの有効期限は1時間です',
        rex:/^[0-9]{6}$/,
      },
    }};
    console.log('Auth.#setProperties start.');
    try {
      if( def !== null ){
        v.def = def;
      }
      for( let key in v.def ){
        if( whichType(v.def[key]) !== 'Object' ){
          dest[key] = opt[key] || v.def[key];
        } else {
          if( !dest.hasOwnProperty(key) ) dest[key] = {};
          this.#setProperties(dest[key],v.def[key],opt[key]||{});
        }
      }
      if( def === null ){
        this.parentWindow = document.querySelector(this.parentSelector);
      }
      console.log('Auth.#setProperties end.');
      return v.rv;
    } catch(e){
      console.error('Auth.#setProperties abnormal end.',e);
      v.rv.stack = e.stack; return v.rv;
    }
  }
  #setupKeys(){
    const v = {rv:null};
    console.log('Auth.#setupKeys start.');
    try {
      if( this.RSA.passWord === null ){
        this.RSA.passWord = createPassword(this.RSA.pwLength);
      }
      this.RSA.sKey = cryptico.generateRSAKey(this.RSA.passWord, this.RSA.bits);
      this.RSA.pKey = cryptico.publicKeyString(this.RSA.sKey);
      console.log('Auth.#setupKeys end.');
      return v.rv;
    } catch(e){
      console.error('Auth.#setupKeys abnormal end.',e);
      if( typeof window !== 'undefined' ) alert(e.stack);
      v.rv.stack = e.stack; return v.rv;
    }
  }
  #setWindows(){
    const v = {rv:null};
    console.log('Auth.#setWindows start.');
    try {
      this.AuthWindow.element = createElement({
        attr:{name:"AuthWindow"},
        style:{
          position: "absolute",
          left: 0, top: 0,
          width: "100%", height:"100%",
          background:"#fff",
          zIndex:this.AuthWindow.zIndex,
        },
      });
      this.entryNo.element = createElement({
        children:[
          {html:this.entryNo.header},
          {tag:'p',html:this.entryNo.msg1},
          {
            tag:'input',
            attr:{type:'text',name:'entryNo',value:this.entryNo.value},
            event:{'input':(event)=>{
              const m = event.target.value.match(this.entryNo.rex);
              console.log('m',m);
              const b = document.querySelector('div[name="AuthWindow"] input[name="entryNoButton"]');
              if( m ){
                b.removeAttribute('disabled');
              } else {
                b.setAttribute('disabled',true);
              }
            }},
          },
          {
            tag:'input',
            attr:{
              type:'button',
              name:'entryNoButton',
              value:this.entryNo.button,
            },
            logical:{
              disabled: this.entryNo.value.match(this.entryNo.rex) ? false : true,
            },
            event:{'click':()=>this.getEntryNo()},
          },
          {tag:'p',html:this.entryNo.msg2},
        ],
      });
      this.loading = {element:createElement({
        style:{
          position: "absolute",
          left: 0, top: 0,
          width: "100%", height:"100%",
          background:"#fff",
          zIndex:this.loading.zIndex,
        },
        children:[
          {
            style:{
              display:"flex",
              width:"100%",
              height:"100%",
              background:"#fff",
              justifyContent:"center",
              alignItems:"center",
            },
            children:[
              {
                attr:{class:'loading5'},
                style:{
                  "--R":0,
                  "--G":0,
                  "--B":0,
                },
                text:'loading...'
              },
            ],
          }
        ],
      })};
      this.passCode.element = createElement({
        children:[
          {html:this.passCode.header},
          {tag:'p',html:this.passCode.msg1},
          {
            tag:'input',
            attr:{type:'text',name:'passCode',value:''},
            event:{'input':(event)=>{
              const m = event.target.value.match(this.passCode.rex);
              console.log('m',m);
              const b = document.querySelector('div[name="AuthWindow"] input[name="passCodeButton"]');
              if( m ){
                b.removeAttribute('disabled');
              } else {
                b.setAttribute('disabled',true);
              }
            }},
          },
          {
            tag:'input',
            attr:{
              type:'button',
              name:'passCodeButton',
              value:this.passCode.button,disabled:true
            },
            event:{'click':()=>this.getPassCode()},
          },
          {tag:'p',html:this.passCode.msg2},
        ],
      });
      this.parentWindow.appendChild(this.AuthWindow.element);
      this.AuthWindow.element.appendChild(this.entryNo.element);
      this.AuthWindow.element.appendChild(this.loading.element);
      this.AuthWindow.element.appendChild(this.passCode.element);
      console.log('Auth.#setWindows end.');
      return v.rv;
    } catch(e){
      console.error('Auth.#setWindows abnormal end.',e);
      v.rv.stack = e.stack; return v.rv;
    }
  }
  #changeScreen(screenId){
    const v = {rv:true};
    console.log('Auth.#changeScreen start.');
    try {
      if( screenId === 'close' ){
        this.AuthWindow.element.style.display = 'none';
      } else if( screenId === 'open' ){
        this.AuthWindow.element.style.display = '';
      } else {
        ['entryNo','loading','passCode'].forEach(x => {
          this[x].element.style.display = x === screenId ? '' : 'none';
        });
      }
      console.log('Auth.#changeScreen end.');
      return v.rv;
    } catch(e){
      console.error('Auth.#changeScreen abnormal end.',e);
      v.rv.stack = e.stack; return v.rv;
    }
  }
  async getEntryNo(){
    const v = {rv:null,data:{cp:this.RSA.pKey}};
    console.log('Auth.getEntryNo start.');
    try {
      this.#changeScreen('loading');
      v.rv = await this.#fetchFromClient('auth1A',this.RSA.pKey,0);
      if( v.rv instanceof Error ) throw v.rv;
      this.gateway.pKey = v.rv;
      this.#changeScreen('passCode');
      console.log('this.gateway.pKey='+JSON.stringify(this.gateway.pKey));
      console.log('Auth.getEntryNo end.');
      return v.rv;
    } catch(e){
      console.error('Auth.getEntryNo abnormal end.',e);
      if( typeof window !== 'undefined' ) alert(e.stack);
      v.rv.stack = e.stack; return v.rv;
    }
  }
  async getPassCode(){
    const v = {rv:null,data:{cp:this.RSA.pKey}};
    console.log('Auth.getPassCode start.');
    try {
      this.#changeScreen('loading');
      v.arg = {
        entryNo: this.entryNo.value,
        passCode: this.passCode.element.querySelector('input').value,
      }
      console.log('arg',v.arg);
      v.rv = await this.#fetchFromClient('auth2A',v.arg,3);
      if( v.rv instanceof Error ) throw v.rv;
      if( v.rv.isErr ){
        throw new Error(v.rv.message);
      } else {
        this.info = v.rv.info;
        console.log('info',this.info);
        this.#changeScreen('close');
      }
      console.log('Auth.getPassCode end.');
      return v.rv;
    } catch(e){
      console.error('Auth.getPassCode abnormal end.',e);
      if( typeof window !== 'undefined' ) alert(e.stack);
      v.rv.stack = e.stack; return v.rv;
    }
  }
  async #fetchFromClient(fc,arg,md=0){
    const v = {rv:null,data:{cp:this.RSA.pKey}};
    console.log('Auth.#fetchFromClient start.');
    try {
      v.token = {
        fm: this.entryNo.value,
        to: 'gateway',
        md: md,
        ts: Date.now(),
        dt: {
          fc: fc,
          arg: arg,
        }
      };
      if( this.gateway.pKey !== null ){
        v.plaintext = JSON.stringify(v.token.dt);
        v.encode = encodeURI(v.plaintext);
        v.encrypt = cryptico.encrypt(v.encode,this.gateway.pKey,this.RSA.sKey);
        console.log('encrypt',v.encrypt);
        if( v.encrypt.status !== 'success' )
          throw new Error(JSON.stringify(v.encrypt));
        v.token.dt = v.encrypt.cipher;
        v.token.md = 3;
      }
      v.fetch = await fetch(this.gateway.url,{
        "method": "POST",
        "body": JSON.stringify(v.token),
        "Accept": "application/json",
        "Content-Type": "application/json",
      });
      v.rv = await v.fetch.json();
      if( v.rv instanceof Error ) throw v.rv;
      console.log('Auth.#fetchFromClient end.');
      return v.rv;
    } catch(e){
      console.error('Auth.#fetchFromClient abnormal end.',e);
      if( typeof window !== 'undefined' ) alert(e.stack);
      v.rv.stack = e.stack; return v.rv;
    }
  }
}