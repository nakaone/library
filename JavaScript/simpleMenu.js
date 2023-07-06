class simpleMenu {

  constructor(conf){
    console.log('----- simpleMenu.constructor start.');
    const v = {};
    try {
      this.changeScreen('loader');
      this.conf = this.#setDefault(conf);
      console.log('l.10',v.conf);
      //this.#setStyle();

      this.changeScreen('home');
      console.log('----- simpleMenu.constructor end.');
    } catch(e){
      console.error('----- simpleMenu.constructor abnormal end.\n',e);
      // ブラウザで実行する場合はアラート表示
      if( typeof window !== 'undefined' ) alert(e.stack); 
      throw e; //以降の処理を全て停止
      //v.rv.stack = e.stack; return v.rv; // 処理継続
    }


  }

  #setDefault(conf){
    console.log('----- simpleMenu.setDefault.');
    return mergeDeeply({
      style: {
        header: { // querySelector(.simpleMenu div[name="header"])
          backgroundColor: "#81d8d0", // Element.style.xxx。xxxはJavaScriptで指定する場合の名称
          color: "#fff",
          fontSize: "1.6rem",
          fontWeight: 900,  // 文字の太さ
          zIndex: 1,
        },
        menuIcon: {
          backgroundColor: "#5bb3b5",  // ハンバーガーメニューの色
        },
        navi: {
          backgroundColor: "#81d8d0",
          color: "#fff",
          size: "1rem",
          weight: 400, // normal  
        }
      },
      header: {
        innerHTML: null,  // <img><span>等、htmlで指定の場合使用
      },
    },conf);
  }

  #setStyle(){
    const v = {};
    for( v.x in this.conf.style ){
      v.o = document.querySelector('.simpleMenu div[name="'+v.x+'"]');
      for( v.y in this.conf.style[v.x] ){
        console.log('l.57: '+v.x+'.'+v.y+' = '+this.conf.style[v.x][v.y]);
        v.o.style[v.y] = this.conf.style[v.x][v.y];
      }
    }
  }

  static toggle(){
    const v = {toggleView: (element,force) => {
      console.log('toggleView classList="'+element.classList.value+'", force='+force);
      const f = typeof force === 'boolean' ? force : ( element.style.display === 'none' ? true : false);
      element.style.display = f ? '' : 'none';
    }};

    console.log('simpleMenu toggle start.');
    document.querySelectorAll('button span').forEach(x => {
      x.classList.toggle("is_active");
    });
    v.navi = document.querySelector('.simpleMenu div[name="navi"]')
    v.navi.classList.toggle("is_active");
    v.toggleView(v.navi);
  }

  changeScreen(scrId='loader'){
    console.log('----- simpleMenu.changeScreen start.\nscrId="'+scrId+'"');
    const v = {};
    // 指定scrIdとヘッダ以外を非表示
    document.querySelectorAll('body > div[name]').forEach(x => {
      v.name = x.getAttribute('name');
      x.style.display = (v.name === scrId || v.name === 'header' ) ? '' : 'none';
      //console.log('l.85',x,x.style.display);
    });
    // メニューを非表示
    document.querySelector('.simpleMenu div[name="navi"]').style.display = 'none';
    console.log('----- simpleMenu.changeScreen end.');
  }
}
