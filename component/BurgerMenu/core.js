class BurgerMenu {

  constructor(opt={}){
    const v = {whois:'BurgerMenu.constructor',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // メンバの設定
      setupInstance(this,opt,{
        parent: 'body', // 親要素のCSSセレクタ
        menu: null,     // メニュー全体のラッパー
        map: [],      // 親要素配下要素のBurgerMenuマップ
        navi: null,   // ナビゲーション要素
        css: [
          // 親要素(ラッパー) ---------------------
          {
            sel:'.BurgerMenu',
            prop: {
              '--text' : '#000',
              '--fore' : '#fff',
              '--back' : '#ddd',
              '--debug' : 'rgba(255,0,0,1)',
              '--height' : '50px',
              '--zIndex' : '2147483647',
              '--navWidth' : '0.7',
              'position' : 'absolute',
              'top' : '0',
              'right' : '0',
              'width' : '100vw',
              'height' : '100vh',
              'z-index' : 'var(--zIndex)',
            },
          },
          // ハンバーガーアイコン --------------------
          { 
            sel:'.BurgerMenu .icon',
            prop: {
              'display' : 'flex',
              'justify-content' : 'flex-end',
              'place-items' : 'center',
            },
          },
          {
            sel:'.BurgerMenu .icon > button',
            prop: {
              'place-content' : 'center center',
              'display' : 'block',
              'margin' : 'calc(var(--height) * 0.4)',
              'padding' : '0px',
              'box-sizing' : 'border-box',
              'width' : 'calc(var(--height) * 0.7)',
              'height' : 'calc(var(--height) * 0.7)',
              'border' : 'none',
              'background' : 'rgba(0,0,0,0)',  // 透明
              'z-index' : '4', // navより上に
              'position' : 'relative', // 横棒の位置をtop/left指定可能に
              // 以下button標準無効化用
              'box-shadow' : 'none',
            },
          },
          {
            sel:'.BurgerMenu .icon button span',
            prop: {
              'display' : 'block',
              'width' : '100%',
              'height' : 'calc(var(--height) * 0.12)',
              'border-radius' : 'calc(var(--height) * 0.06)',
              'position' : 'absolute',
              'left' : '0',
              'background' : 'var(--text)',
              'transition' : 'top 0.24s, transform 0.24s, opacity 0.24s',
            },
          },
          {
            sel:'.BurgerMenu .icon button span:nth-child(1)',
            prop: {
            'top' : '0',
            },
          },
          {
            sel:'.BurgerMenu .icon button span:nth-child(2)',
            prop: {
              'top' : '50%',
              'transform' : 'translateY(-50%)',
            },
          },
          {
            sel:'.BurgerMenu .icon button span:nth-child(3)',
            prop: {
              'top' : '100%',
              'transform' : 'translateY(-100%)',
            },
          },
          {
            sel:'.BurgerMenu .icon button span.is_active:nth-child(1)',
            prop: {
              'top' : '50%',
              'transform' : 'translateY(-50%) rotate(135deg)',
            },
          },
          {
            sel:'.BurgerMenu .icon button span.is_active:nth-child(2)',
            prop: {
              'transform' : 'translate(50%, -50%)',
              'opacity' : '0',
            },
          },
          {
            sel:'.BurgerMenu .icon button span.is_active:nth-child(3)',
            prop: {
              'top' : '50%',
              'transform' : 'translateY(-50%) rotate(-135deg)',
            },
          },
          // ナビゲーション領域 ---------------------
          {
            sel:'.BurgerMenu nav',
            prop: {
              'display' : 'none',
            },
          },
          {
            sel:'.BurgerMenu nav.is_active',
            prop: {
              'display' : 'block',
              'margin' : '0 0 0 auto',
              'font-size' : '1rem',
              'width' : 'calc(100% * var(--navWidth))',
            },
          },
          {
            sel:'.BurgerMenu nav ul',
            prop: {
              'margin' : '0rem 0rem 1rem 0rem',
              'padding' : '0rem 0rem 0rem 0rem',
              'background-color' : 'var(--back)',
            },
          },
          { // 2階層以降のulにのみ適用
            sel:'.BurgerMenu nav ul ul',
            prop: {
              'display' : 'none',
            },
          },
          { // 2階層以降のulにのみ適用
            sel:'.BurgerMenu nav ul ul.is_open',
            prop: {
              'display' : 'block',
              'border-top' : 'solid 0.2rem var(--fore)',
              'border-left' : 'solid 0.7rem var(--fore)',
            },
          },
          {
            sel:'.BurgerMenu nav li',
            prop: {
              'margin' : '0.3rem 0rem 0.3rem 0.5rem',
              'padding' : '0.2rem 0rem 0rem 0rem',
              'list-style' : 'none',
              'background-color' : 'var(--back)',
            },
          },
        ],
      });

      v.step = 2; // ラッパーおよび必須要素の作成
      this.menu = createElement({
        attr:{class:'BurgerMenu'},
        children:[{
          attr:{class:'icon'},
          event:{click:this.toggle},
          children:[{
            tag:'button',
            children:[
              {tag:'span'},{tag:'span'},{tag:'span'}
            ]
          }]
        }]
      });
      this.navi = createElement({tag:'nav'}); // nav
      this.menu.appendChild(this.navi);
      this.parent.element.appendChild(this.menu);

      v.step = 3; // 親要素を走査してナビゲーションを作成
      this.#genNavi();

  
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
      
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 親要素を走査してナビゲーションを作成
   * @param {*} parent 
   * @param {*} navi 
   * @returns 
   */
  #genNavi = (parent=this.parent.element,navi=this.navi) => {
    const v = {whois:'BurgerMenu.#genNavi',step:0,rv:null};
    try {
      for( let i=0 ; i<parent.childElementCount ; i++ ){
        let d = parent.children[i];
        //console.log(d)
        let attr = d.getAttribute('data-BurgerMenu');
        if( attr ){
          let obj = (new Function('return {'+attr+'}'))();
          let ul = navi.querySelector('ul');
          if( ul === null ){
            ul = createElement('ul');
            navi.appendChild(ul);
          }
          let li = createElement({
            tag:'li',
            text: obj.label,
          });
          ul.appendChild(li);
          this.#genNavi(d,li);
        }
      }

      //console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  dispatch = (arg) => {
    const v = {whois:'BurgerMenu.toggle',step:0,rv:null};
    console.log(v.whois+' start.');
    try {
      console.log(arg,event)
      const funcMap = {
        annai: test,
      }
      funcMap[arg](event);

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  toggle = () => {
    const v = {whois:'BurgerMenu.toggle',step:0,rv:null};
    console.log(v.whois+' start.');
    try {
      document.querySelector('.BurgerMenu nav').classList.toggle('is_active');
      document.querySelectorAll('.BurgerMenu button span')
      .forEach(x => x.classList.toggle('is_active'));

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  showChildren = () => {
    const v = {whois:'BurgerMenu.showChildren',step:0,rv:null};
    console.log(v.whois+' start.');
    try {
      console.log(event.target);
      event.target.parentNode.querySelector('ul').classList.toggle('is_open');
      let m = event.target.innerText.match(/^([▶️▼])(.+)/);
      console.log(m);
      const text = ((m[1] === '▼') ? '▶️' : '▼') + m[2];
      console.log(m[1],m[1] === '▼',text);
      event.target.innerText = text;

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }
}