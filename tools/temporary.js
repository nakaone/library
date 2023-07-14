/* コアスクリプト */

/**
 * @classdesc HTMLにメニューを作成する
 * 
 * - [画面分割のレイアウト](simpleMenu.grid.md)
 */

class simpleMenu {

  /**
   * @constructor
   * @param {string} conf
   * @returns {void}
   */

  constructor(conf){
    console.log('----- simpleMenu.constructor start.');
    const v = {};
    try {
      this.conf = this.#setDefault(conf);
      this.#setStyle();
      simpleMenu.setTitle(this.conf.Title);
      this.#setMenu(document.querySelector('.simpleMenu .Navi div ul'),this.conf.menu);

      simpleMenu.changeScreen('home');
      console.log('----- simpleMenu.constructor end.');
    } catch(e){
      console.error('----- simpleMenu.constructor abnormal end.\n',e);
      // ブラウザで実行する場合はアラート表示
      if( typeof window !== 'undefined' ) alert(e.stack); 
      throw e; //以降の処理を全て停止
      //v.rv.stack = e.stack; return v.rv; // 処理継続
    }


  }

  /** オブジェクトの構造が複雑なため、constructorから分離 */
  #setDefault(conf){
    const rv = mergeDeeply({
      Title: '(未設定)',
      authority: null,  // 全メニューを表示
      style: {
        header: { // querySelector(.simpleMenu div[name="header"])
          backgroundColor: "#81d8d0", // Element.style.xxx。xxxはJavaScriptで指定する場合の名称
          color: "#fff",
          fontSize: "1.6rem",
          fontWeight: 900,  // 文字の太さ
          zIndex: 1,
        },
        Navicon: {
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
    console.log('----- simpleMenu.setDefault.\n',rv);
    return rv;
  }

  #setMenu(parent,list){
    const v = {};
    for( v.o of list ){
      console.log('l.59',v.o);

      // authority指定のないメニュー項目、または権限がない場合はスキップ
      if( !('authority' in v.o) 
      || this.conf.authority !== null && (this.conf.authority & v.o.authority) === 0
      ) continue;

      v.li = document.createElement('li');
      v.li.textContent = v.o.label;

      if( 'children' in v.o ){
        v.p = document.createElement('ul');
        this.#setMenu(v.p,v.o.children);
        v.li.appendChild(v.p);
      } else {
        console.log('l.74',v.o);
        if( 'href' in v.o ){
          console.log('l.76',v.o.href)
          v.func = new Function('window.open("'+v.o.href+'")');
        } else {
          v.func = new Function(`
          // メニューを非表示
          document.querySelector('.simpleMenu .Navi div').classList.remove('is_active');
          document.querySelector('.simpleMenu .NaviBack div').classList.remove('is_active');
          document.querySelectorAll('.simpleMenu .Navicon button span')
          .forEach(x => x.classList.remove("is_active"));

          // loading画面を表示
          simpleMenu.changeScreen('loading');

          // 指定された処理を実行
          `+v.o.func);
        }
        v.li.addEventListener('click',v.func);
      }
      parent.appendChild(v.li);
    }
  }

  #setStyle(){
    const v = {};
    for( v.sel in this.conf.style ){
      v.elements = document.querySelectorAll(v.sel);
      for( v.element of v.elements ){
        for( v.prop in this.conf.style[v.sel] ){
          if( v.prop.match(/^--/) ){
            // CSS変数の設定
            v.element.style.setProperty(v.prop,this.conf.style[v.sel][v.prop]);
          } else {
            // CSS変数以外の設定
            v.element.style[v.prop] = this.conf.style[v.sel][v.prop];
          }
        }
      }
    }
  }

  static setTitle(title){
    document.querySelector('.simpleMenu .Title').innerHTML = title;
  }

  static toggle(){
    document.querySelector('.simpleMenu .Navi div').classList.toggle("is_active");
    document.querySelector('.simpleMenu .NaviBack div').classList.toggle("is_active");
    document.querySelectorAll('.simpleMenu .Navicon button span')
    .forEach(x => x.classList.toggle("is_active"));
  }

  static changeScreen(scrId='loading'){
    console.log('----- simpleMenu.changeScreen start.\nscrId="'+scrId+'"');
    const v = {};

    if( scrId === 'loading' ){
      document.querySelectorAll('body > div:not(.simpleMenu)').forEach(x => x.style.display = 'none');
      // 待機画面を表示
      document.querySelector('.simpleMenu .loading').style.display = '';
    } else {
      // 指定画面を表示、それ以外は非表示
      document.querySelectorAll('body > div:not(.simpleMenu)').forEach(x => {
        v.name = x.getAttribute('name');
        x.style.display = v.name === scrId ? '' : 'none';
      });
      // 待機画面を非表示
      document.querySelector('.simpleMenu .loading').style.display = 'none';
    }

    // メニューを非表示
    document.querySelector('.simpleMenu .Navi div').classList.remove('is_active');
    document.querySelector('.simpleMenu .NaviBack div').classList.remove('is_active');
    document.querySelectorAll('.simpleMenu .Navicon button span')
    .forEach(x => x.classList.remove("is_active"));
    //console.log('----- simpleMenu.changeScreen end.');
  }
}
