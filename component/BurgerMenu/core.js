class BurgerMenu {

  constructor(opt={}){
    const v = {whois:'BurgerMenu.constructor',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // メンバの設定
      setupInstance(this,opt,{
        parent: 'body',   // 親要素のCSSセレクタ
        //menu: null,       // メニュー全体のラッパー
        func: {},         // funcで指定された名称と実関数の紐付けマップ
        icon: null,       // {HTMLElement} ハンバーガーアイコン要素
        navi: null,       // {HTMLElement} ナビゲーション要素
        back: null,       // {HTMLElement} ナビゲーション背景要素
        home: null,       // ホーム画面のID
        authority: 4294967295,  // 実行権限。既定値2^32-1
        css: [
          { sel : '.BurgerMenu',
            prop: {
              '--text' : '#000',  // テキストおよびハンバーガーアイコンの線の色
              '--fore' : '#fff',
              '--back' : '#ddd',
              '--debug' : 'rgba(255,0,0,1)',
              '--iconSize' : '100px',
              // ローディング画面優先なので、最大値2147483647-1
              '--maxIndex' : '2147483646',
              '--navWidth' : '0.7',
            }
          },
          // ハンバーガーアイコン --------------------
          {
            sel:'.BurgerMenu.icon',
            prop: {
              'display' : 'flex',
              'justify-content' : 'flex-end',
              'place-items' : 'center',
              'position' : 'absolute',
              // icon周囲にiconSizeの40%の余白が必要
              'top' : 'calc(var(--iconSize) * 0.4)',//'0',
              'right' : 'calc(var(--iconSize) * 0.4)',//'0',
              'width' : 'var(--iconSize)',
              'height' : 'var(--iconSize)',
              'z-index' : 'var(--maxIndex)',
            },
          },
          {
            sel:'.BurgerMenu.icon > button',
            prop: {
              'place-content' : 'center center',
              'display' : 'block',
              'margin' : '0',
              'padding' : '0px',
              'box-sizing' : 'border-box',
              'width' : 'calc(var(--iconSize) * 0.7)',
              'height' : 'calc(var(--iconSize) * 0.7)',
              'border' : 'none',
              'background' : 'rgba(0,0,0,0)',  // 透明
              //'z-index' : '4', // navより上に
              'position' : 'relative', // 横棒の位置をtop/left指定可能に
              // 以下button標準無効化用
              'box-shadow' : 'none',
            },
          },
          {
            sel:'.BurgerMenu.icon button span',
            prop: {
              'display' : 'block',
              'width' : '100%',
              'height' : 'calc(var(--iconSize) * 0.12)',
              'border-radius' : 'calc(var(--iconSize) * 0.06)',
              'position' : 'absolute',
              'left' : '0',
              'background' : 'var(--text)',
              'transition' : 'top 0.24s, transform 0.24s, opacity 0.24s',
            },
          },
          {
            sel:'.BurgerMenu.icon button span:nth-child(1)',
            prop: {
            'top' : '0',
            },
          },
          {
            sel:'.BurgerMenu.icon button span:nth-child(2)',
            prop: {
              'top' : '50%',
              'transform' : 'translateY(-50%)',
            },
          },
          {
            sel:'.BurgerMenu.icon button span:nth-child(3)',
            prop: {
              'top' : '100%',
              'transform' : 'translateY(-100%)',
            },
          },
          {
            sel:'.BurgerMenu.icon button span.is_active:nth-child(1)',
            prop: {
              'top' : '50%',
              'transform' : 'translateY(-50%) rotate(135deg)',
            },
          },
          {
            sel:'.BurgerMenu.icon button span.is_active:nth-child(2)',
            prop: {
              'transform' : 'translate(50%, -50%)',
              'opacity' : '0',
            },
          },
          {
            sel:'.BurgerMenu.icon button span.is_active:nth-child(3)',
            prop: {
              'top' : '50%',
              'transform' : 'translateY(-50%) rotate(-135deg)',
            },
          },
          // ナビゲーション領域 ---------------------
          {
            sel:'nav.BurgerMenu',
            prop: {
              'display' : 'none',
            },
          },
          {
            sel:'nav.BurgerMenu.is_active',
            prop: {
              'display' : 'block',
              'margin' : '0 0 0 auto',
              'font-size' : '1rem',
              'position' : 'absolute',
              'top' : 'calc(var(--iconSize) * 1.8)',
              'right' : '0',
              'width' : 'calc(100% * var(--navWidth))',
              'height' : 'var(--iconSize)',
              'z-index' : 'var(--maxIndex)',
            },
          },
          {
            sel:'nav.BurgerMenu ul',
            prop: {
              'margin' : '0rem 0rem 1rem 0rem',
              'padding' : '0rem 0rem 0rem 0rem',
              'background-color' : 'var(--back)',
            },
          },
          { // 2階層以降のulにのみ適用
            sel:'nav.BurgerMenu ul ul',
            prop: {
              'display' : 'none',
            },
          },
          { // 2階層以降のulにのみ適用
            sel:'nav.BurgerMenu ul ul.is_open',
            prop: {
              'display' : 'block',
              'border-top' : 'solid 0.2rem var(--fore)',
              'border-left' : 'solid 0.7rem var(--fore)',
            },
          },
          {
            sel:'nav.BurgerMenu li',
            prop: {
              'margin' : '0.3rem 0rem 0.3rem 0.5rem',
              'padding' : '0.2rem 0rem 0rem 0rem',
              'list-style' : 'none',
              'background-color' : 'var(--back)',
            },
          },
          {
            sel:'nav.BurgerMenu li a',
            prop: {
              'color' : 'var(--text)',
              'text-decoration' : 'none',
            },
          },
          // 背景 ---------------------
          {
            sel:'.BurgerMenu.back',
            prop: {
              'display' : 'none',
            },
          },
          {
            sel:'.BurgerMenu.back.is_active',
            prop: {
              'display' : 'block',
              'position' : 'absolute',
              'top' : '0',
              'right' : '0',
              'width' : '100vw',
              'height' : '100vh',
              'z-index' : 'calc(var(--maxIndex) - 1)',
              'background' : 'rgba(100,100,100,0.8)',
            },
          },
        ],
      });

      v.step = 2.1; // アイコンの作成
      this.icon = createElement({
        attr:{class:'BurgerMenu icon'},
        event:{click:this.toggle},
        children:[{
          tag:'button',
          children:[
            {tag:'span'},{tag:'span'},{tag:'span'}
          ]
        }]
      });
      this.parent.element.appendChild(this.icon);
      v.step = 2.2; // ナビゲータの作成
      this.navi = createElement({
        tag:'nav',
        attr:{class:'BurgerMenu'},
      });
      this.parent.element.appendChild(this.navi);
      v.step = 2.3; // ナビゲータ背景の作成
      this.back = createElement({
        attr:{class:'BurgerMenu back'},
        event:{click:this.toggle},
      });
      this.parent.element.appendChild(this.back);

      v.step = 3; // 親要素を走査してナビゲーションを作成
      v.rv = this.#genNavi();
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 4; // ホーム画面表示
      this.change(this.home);

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
    const v = {whois:'BurgerMenu.#genNavi',step:0,rv:null,idnum:1000,
      tree:(parent,navi) => { // メニューのツリーを作成
        console.log(v.whois+' tree start:',parent,navi);
        for( let i=0 ; i<parent.childElementCount ; i++ ){
          v.step = 1; // 子要素を順次走査
          let d = parent.children[i];
          let attr = d.getAttribute('data-BurgerMenu');
          if( attr ){
            // data-BurgerMenuをもつ要素のみ以下の処理を実施

            v.step = 2; // IDを採番、クラスに保存
            v.id = 'c'+String(++v.idnum);
            d.classList.add(v.id);

            v.step = 3; // data-BurgerMenuの文字列をオブジェクト化
            let obj = (new Function('return {'+attr+'}'))();

            v.step = 4; // 実行権限がない機能・画面はナビに追加しない
            if( obj.hasOwnProperty('authority')
             && (this.authority & Number(obj.authority)) === 0 ){
              continue;
            }

            v.step = 5; // 1階層上のliタグがまだulを持っていなければ追加しておく
            let ul = navi.querySelector('ul');
            if( ul === null ){
              ul = createElement('ul');
              navi.appendChild(ul);
            }

            v.step = 6; // 1階層上のliが持つulに追加登録
            let li = null;
            if( obj.hasOwnProperty('href') ){
              v.step = 6.1;
              // 他サイトへの遷移指定の場合
              li = createElement({tag:'li',children:[{
                tag:'a',
                text: obj.label,
                attr:{name:obj.func,href:obj.href,target:'_blank'},
                event:{click:this.toggle},  // 遷移後メニューを閉じる
              }]});
            } else if( obj.hasOwnProperty('func') ){
              v.step = 6.2;
              // 指定関数実行の場合
              li = createElement({tag:'li',children:[{
                tag:'a',
                text: obj.label,
                attr: {name:obj.func},
                event:{click:this.dispatch}
              }]});
            } else {
              v.step = 6.3;
              // 指定画面表示のリーフ or 子階層を持つブランチ
              // 暫定的に前者とみなし、全部作成後に子階層有無で修正
              v.step = 2.6;
              li = createElement({tag:'li',children:[{
                tag:'a',
                text: obj.label,
                // 暫定とわかるよう、nameには'_'をつける
                attr: {name:'_'+v.id},
                //event:{click:this.change},
              }]});
            }

            v.step = 7; // ulに自分を追加後、自分を親として再帰呼出
            ul.appendChild(li);
            v.tree(d,li);
          }
        }
      },
      branch: (li) => {  // tree内のブランチはshowChildrenに変更
        v.step = 10; // 自分自身がブランチかを判定
        // 「子要素としてul(下位階層)を持つ ⇒ ブランチ」
        // 尚「自分はulを持たないが子孫はulを持つ」は有り得ない。
        // ∵子はulが無いと保持できない
        let ul = li.querySelector(':scope > ul');
        let a = li.querySelector(':scope > a');

        let m = a.getAttribute('name').match(/^_(.+)$/);
        if( m ){
          // nameが'_'で始まる ⇒ v.treeのstep.6.3で「暫定」と判別された
          // 指定画面表示のリーフ or 子階層を持つブランチ
          // ※暫定では無い場合は処理不要(=遷移指定/指定関数実行)
          a.setAttribute('name',m[1]);
          if( ul ){
            v.step = 11;
            // ulを持つ ⇒ 子孫あり ⇒ ブランチ
            a.innerText = '▶︎' + a.innerText;
            a.addEventListener('click',this.showChildren);
            // 子要素にもブランチがないか再帰呼出
            // ※直下の要素のみ対象なので':scope >'を付加
            ul.querySelectorAll(':scope > li').forEach(x => v.branch(x));
          } else {
            v.step = 12;
            // ulを持たない ⇒ 子孫なし ⇒ リーフ
            a.addEventListener('click',this.change);
            if( this.home === null ){
              v.step = 13;
              // ホーム画面未定の場合、最初のリーフをホーム画面とする
              this.home = a.getAttribute('name');
            }
          }
        }
      },
    };
    console.log(v.whois+'start.');
    try {

      // とりあえずツリー全体を作成
      v.tree(parent,navi);

      // ブランチを検出し、イベントを設定
      this.parent.element.querySelectorAll('nav.BurgerMenu > ul > li')
      .forEach(x => v.branch(x));

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 表示画面の変更 */
  change = (event) => {
    const v = {whois:'BurgerMenu.change',step:0,rv:null,
      showElement: (d) => { // 対象領域を表示
        d.style.display = '';
        if( d.parentElement.tagName.toLowerCase() !== 'body' )
          v.showElement(d.parentElement);
      },
    };
    console.log(v.whois+' start.');
    try {
      console.log(event,typeof event);

      // data-BurgerMenu属性を持つ要素を全て非表示に
      v.selector = '[data-BurgerMenu]';
      this.parent.element.querySelectorAll(v.selector)
      .forEach(x => x.style.display = 'none');

      // 対象領域を特定
      v.selector = '.'
      + (typeof event === 'string' ? event : event.target.name)
      + v.selector;
      v.target = this.parent.element.querySelector(v.selector);
      // 対象領域〜body迄を表示
      v.showElement(v.target);

      // ナビゲーションを非表示
      if( typeof event !== 'string' ){
        this.toggle();
      }

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 選択された関数の実行
   * @param {PointerEvent} event - ナビ領域で発生したイベントオブジェクト
   */
  dispatch = (event) => {
    const v = {whois:'BurgerMenu.dispatch',step:0,rv:null};
    console.log(v.whois+' start.');
    try {
      console.log(event);

      // 選択された関数名を取得
      v.funcName = event.target.getAttribute('name');
      console.log('v.funcName='+v.funcName);

      // 選択された関数を実行
      console.log(this.func);
      this.func[v.funcName]();

      // ナビゲーションを非表示
      this.toggle();

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** ナビゲーション領域の表示/非表示切り替え
   * @param {void}
   * @returns {void}
   */
  toggle = () => {
    const v = {whois:'BurgerMenu.toggle',step:0,rv:null};
    console.log(v.whois+' start.');
    try {
      document.querySelector('nav.BurgerMenu').classList.toggle('is_active');
      document.querySelector('.BurgerMenu.back').classList.toggle('is_active');
      document.querySelectorAll('.BurgerMenu.icon button span')
      .forEach(x => x.classList.toggle('is_active'));

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** ブランチの下位階層メニュー表示/非表示切り替え */
  showChildren = (event) => {
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