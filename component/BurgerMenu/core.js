class BurgerMenu {
  constructor(opt={}){
    const v = {whois:'BurgerMenu.#analyze',step:0,rv:null};
    console.log(v.whois+' start.');
    try {

      setupInstance(this,opt,{
        parent: 'body', // 親要素のCSSセレクタ
        map: [],      // 親要素配下要素のBurgerMenuマップ
      });
  
      this.#analyze(this.parent.element);

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
      
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  #analyze = () => {
    const v = {whois:'BurgerMenu.#analyze',step:0,rv:null,
      recursive: (parent,map) => {
        for( let i=0 ; i<parent.childElementCount ; i++ ){
          let d = parent.children[i];
          let attr = d.getAttribute('data-BurgerMenu');
          console.log('attr='+attr);
          if( attr ){
            let obj = (new Function('return {'+attr+'}'))();
            obj.children = [];
            map.push(obj);
            v.recursive(d,obj.children);
          }
        }
      },
    };
    console.log(v.whois+' start.');
    try {

      v.max = 1000;
      v.recursive(this.parent.element,this.map);

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }
}