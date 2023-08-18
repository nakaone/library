class BurgerMenu {
  constructor(opt={}){
    const v = {whois:'BurgerMenu.constructor',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      setupInstance(this,opt,{
        parent: 'body', // 親要素のCSSセレクタ
        map: [],      // 親要素配下要素のBurgerMenuマップ
        navi: null,   // ナビゲーション要素
      });
      this.navi = createElement({tag:'nav'}); // nav
      this.parent.element.appendChild(this.navi);
      this.#genNavi();
  
      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
      
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  #genNavi = (parent=this.parent.element,navi=this.navi) => {
    const v = {whois:'BurgerMenu.#genNavi',step:0,rv:null};
    try {
      for( let i=0 ; i<parent.childElementCount ; i++ ){
        let d = parent.children[i];
        console.log(d)
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

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

}