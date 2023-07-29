
class Auth {
  constructor(parentSelector,opt={}){
    const v = {rv:null};
    console.log('Auth.constructor start.');
    try {
      this.#setProperties(this,{
        parentWindow: document.querySelector(parentSelector),
        parentSelector: parentSelector,
        keys:{
          passWord: null,
          secret: null,
          public: {
            self: null,
            gateway: null,
            front: null,
          }
        },
        entryNo:{
          element: null,
          value: null,
          header:'',
          msg1:'受付番号を入力してください',
          button:'送信',
          msg2:'',
          rex:/^[0-9]{1,4}$/,
        },
        passCode:{
          element: null,
          value: null,
          header:'',
          msg1:'確認のメールを送信しました。記載されているパスコード(数字6桁)を入力してください。<br>'
          + '※まれに迷惑メールと判定される場合があります。メールが来ない場合、そちらもご確認ください。',
          button:'送信',
          msg2: '※パスコードの有効期限は1時間です',
          rex:/^[0-9]{1,4}$/,
        },
      },opt);
      console.log('this:',this);
      this.#setWindows();
      this.#getEntryNo();
      console.log('Auth.constructor end.');
      return v.rv;
    } catch(e){
      console.error('Auth.constructor abnormal end.',e);
      throw e;
    }
  }
  #setProperties(dest,def,opt){
    const v = {rv:true};
    console.log('Auth.#setProperties start.');
    try {
      for( let key in def ){
        if( whichType(def[key]) !== 'Object' ){
          dest[key] = opt[key] || def[key];
        } else {
          if( !dest.hasOwnProperty(key) ) dest[key] = {};
          this.#setProperties(dest[key],def[key],opt[key]||{});
        }
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
      this.AuthWindow = createElement({
        style:{
          position: "absolute",
          left: 0, top: 0,
          width: "100%", height:"100%",
          background:"#fff",
          zIndex:2147483647,
        },
      });
      this.entryNo.element = createElement({
        children:[
          {html:this.entryNo.header},
          {tag:'p',html:this.entryNo.msg1},
          {
            tag:'input',
            attr:{type:'text',name:'entryNo'},
            event:{'input':()=>{}},
          },
          {
            tag:'input',
            attr:{
              type:'button',
              name:'entryNoButton',
              value:this.entryNo.button,disabled:true
            },
          },
          {tag:'p',html:this.entryNo.msg2},
        ],
      });
      this.loading = {element:createElement({
        style:{
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          height:"100%",
          width:"100%",
        },
        children:[
          {
            attr:{class:'loading5'},
            style:{
              "--dot-size":"2rem",
              "--R":0,
              "--G":0,
              "--B":0,
            },
            text:'loading...'
          },
        ],
      })};
      this.passCode.element = createElement({
        children:[
          {html:this.passCode.header},
          {tag:'p',html:this.passCode.msg1},
          {
            tag:'input',
            attr:{type:'text',name:'passCode'},
            event:{'input':()=>{}},
          },
          {
            tag:'input',
            attr:{
              type:'button',
              name:'passCodeButton',
              value:this.passCode.button,disabled:true
            },
          },
          {tag:'p',html:this.passCode.msg2},
        ],
      });
      this.parentWindow.appendChild(this.AuthWindow);
      this.AuthWindow.appendChild(this.entryNo.element);
      this.AuthWindow.appendChild(this.loading.element);
      this.AuthWindow.appendChild(this.passCode.element);
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
      ['entryNo','loading','passCode'].forEach(x => {
        this[x].element.style.display = x === screenId ? '' : 'none';
      });
      console.log('Auth.#changeScreen end.');
      return v.rv;
    } catch(e){
      console.error('Auth.#changeScreen abnormal end.',e);
      v.rv.stack = e.stack; return v.rv;
    }
  }
  #getEntryNo(){
    const v = {rv:null};
    console.log('Auth.#getEntryNo start.');
    try {
      this.#changeScreen('entryNo');
      console.log('Auth.#getEntryNo end.');
      return v.rv;
    } catch(e){
      console.error('Auth.#getEntryNo abnormal end.',e);
      if( typeof window !== 'undefined' ) alert(e.stack);
      v.rv.stack = e.stack; return v.rv;
    }
  }
}