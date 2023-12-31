class TabMenu {

  /**
   * @constructor
   * @param {string} [opt={}] - オプション
   * @returns {void}
   */
  constructor(opt={}){
    console.log('TabMenu.constructor start.');
    const v = {};
    this.option = mergeDeeply({
      name: null, // {string} 対象となるページ全体のname属性。nullなら単一で特定不要と解釈
      initial: null,  // {string} 初期表示ページの名前
      direction: 'x', // {string} タブを並べる方向。x:横並び, y:縦並び
      style: {  // {Object} CSSスタイル定義
        tabs: {
          selector: ".TabMenu .tabs",
          css: {
            width: "100%",
            height: "100%",
            margin: "0px 0px 1rem 0px",
            padding: "0px",
            boxSizing: "border-box",
            display: "grid",
            fontSize: "1rem",
          },
        },
        tab: {
          selector: ".TabMenu .tabs div",
          css: {
            paddingLeft: "1rem",
            borderBottom: "solid 4px #ccc",
          },
        },
        act: {
          //selector: ".TabMenu .tabs div.act",
          css: {
            paddingLeft: "1rem",
            borderBottom: "solid 4px #000",
          },
        }
      },
    },opt);
    //console.log(this.option);

    // 全体の親要素をthis.wrapper、タブ表示領域をthis.tabsに保存
    this.wrapperSelector = '.TabMenu'
      +( this.option.name === null ? '' : '[name="' + this.option.name + '"]');
    this.wrapper = document.querySelector(this.wrapperSelector);

    // タブ表示領域を生成
    this.tabs = document.createElement('div');
    this.tabs.classList.add('tabs');
    this.wrapper.querySelectorAll(this.wrapperSelector+' > div[name]').forEach(x => {
      v.item = document.createElement('div');
      v.name = x.getAttribute('name');
      v.item.setAttribute('name',v.name);
      v.item.innerText = v.name;
      this.tabs.appendChild(v.item);
    });
    this.wrapper.prepend(this.tabs);
    //console.log(this.wrapper);

    // スタイルの適用
    for( v.x of ['tabs','tab'] ){ // actは不要
      this.wrapper.querySelectorAll(this.option.style[v.x].selector).forEach(element => {
        for( v.y in this.option.style[v.x].css ){
          element.style[v.y] = this.option.style[v.x].css[v.y];
        }
      });
    }

    // ページ名のリストを作成
    this.pageList = [];
    this.tabs.querySelectorAll('[name]')
    .forEach(x => this.pageList.push(x.getAttribute('name')));
    //console.log(this.pageList);

    // 各タブ・ページの要素をthis.tab/pageに保存
    this.tab = {};
    this.page = {};
    this.tabNum = 0;
    this.pageList.forEach(x => {
      this.tab[x] = this.wrapper.querySelector('.tabs [name="'+x+'"]');
      // ページは「TabMenuクラス直下のDIV」に限定
      this.page[x] = this.wrapper.querySelector('.TabMenu > div[name="'+x+'"]');
      //console.log(x,this.tab[x],this.page[x]);
      this.tab[x].addEventListener('click',()=>this.changePage(x));
      this.tabNum++;
    });
    // タブの数をタブ領域に設定
    this.tabs.style.gridTemplateColumns = 'repeat('+this.tabNum+',1fr)';

    // 特に指定がない場合、初期ページは最初の要素とする
    if( this.option.initial === null ) this.option.initial = this.pageList[0];
    this.changePage(this.option.initial); // 初期ページ
    console.log('TabMenu.constructor end.');
  }

  changePage(page){
    console.log('TabMenu.changePage start. page='+page);
    this.pageList.forEach(x => {
      if( x === page ){
        for( let y in this.option.style.act.css ){
          this.tab[x].style[y] = this.option.style.act.css[y];
        }
        this.page[x].style.display = '';
      } else {
        for( let y in this.option.style.tab.css ){
          this.tab[x].style[y] = this.option.style.tab.css[y];
        }
        this.page[x].style.display = 'none';
      }
    })
    console.log('TabMenu.changePage end.');
  }
}