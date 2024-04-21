/** 親要素を走査してナビゲーションを作成
 * @param {HTMLElement} wrapper - body等の親要素。
 * @param {HTMLElement} navi - nav等のナビゲーション領域
 * @returns {null|Error}
 */
genNavi(wrapper=this.wrapper,navi=this.navi,depth=0){
  const v = {whois:this.constructor.name+'.genNavi',rv:null,step:0,now:Date.now()};
  console.log(`${v.whois} start.`);
  try {

    v.step = 1.1; // sessionStorageからユーザ権限を読み取り
    v.r = sessionStorage.getItem(g.programId);
    if( !v.r ) throw new Error(`sessionStorageに${g.programId}キーが存在しません`);
    this.auth = JSON.parse(v.r).auth;
    v.step = 1.2; // navi領域をクリア
    if( depth === 0 ) navi.innerHTML = '';
    v.step = 1.3; // auth毎にホームを変更する場合、変更
    if( this.homeForEachAuth !== null ){
      this.home = this.homeForEachAuth[this.auth];
    }

    // 子要素を順次走査し、data-menuを持つ要素をnaviに追加
    for( v.i=0 ; v.i<wrapper.childElementCount ; v.i++ ){
      v.d = wrapper.children[v.i];

      // wrapper内のdata-menu属性を持つ要素に対する処理
      v.step = 2.1; // data-menuを持たない要素はスキップ
      v.attr = this.#objectize(v.d.getAttribute(`data-${this.constructor.name}`));
      if( v.attr instanceof Error ) throw v.attr;
      if( v.attr === null ) continue;

      v.step = 2.2; // screenクラスが無ければ追加
      v.class = v.d.className.match(/screen/);
      if( !v.class ) v.d.classList.add('screen'); 
      v.step = 2.3; // nameが無ければ追加
      v.name = v.d.getAttribute('name');
      if( !v.name ){
        v.name = v.attr.id;
        v.d.setAttribute('name',v.name);
      }

      // navi領域への追加が必要か、判断
      v.step = 3.1; // 実行権限がない機能・画面はnavi領域に追加しない
      if( (this.auth & v.attr.allow) === 0 ) continue;
      v.step = 3.2; // 有効期間外の場合はnavi領域に追加しない
      if( v.now < v.attr.from || v.attr.to < v.now ) continue;

      v.step = 4; // navi領域にul未設定なら追加
      if( navi.tagName !== 'UL' ){
        v.r = createElement({tag:'ul',attr:{class:this.constructor.name}},navi);
        if( v.r instanceof Error ) throw v.r;
        navi = v.r;
      }

      v.step = 5; // メニュー項目(li)の追加
      v.li = {tag:'li',children:[{
        tag:'a',
        text:v.attr.label,
        attr:{class:this.constructor.name,name:v.attr.id},
      }]};
      v.hasChild = false;
      if( v.attr.hasOwnProperty('func') ){
        v.step = 5.1; // 指定関数実行の場合
        Object.assign(v.li.children[0],{
          attr:{href:'#',name:v.attr.func},
          event:{click:(event)=>{
            this.toggle();  // メニューを閉じる
            this.func[event.target.name](event); // 指定関数の実行
            this.genNavi(); // メニュー再描画
          }},
        });
      } else if( v.attr.hasOwnProperty('href') ){
        v.step = 5.2; // 他サイトへの遷移指定の場合
        Object.assign(v.li.children[0].attr,{href:v.attr.href,target:'_blank'});
        Object.assign(v.li.children[0],{event:{click:this.toggle}}); // 遷移後メニューを閉じる
      } else {
        v.step = 5.3; // その他(=画面切替)の場合
        // 子孫メニューがあるか確認
        if( v.d.querySelector(`[data-${this.constructor.name}]`) ){
          v.step = 5.33; // 子孫メニューが存在する場合
          v.hasChild = true; // 再帰呼出用のフラグを立てる
          Object.assign(v.li.children[0],{
            // 初期がサブメニュー表示ならclassにis_openを追加
            attr:{class:(this.initialSubMenu ? 'is_open' : '')},
            // '▼'または'▶︎'をメニューの前につける
            text: (this.initialSubMenu ? '▶︎' : '▼') + v.li.children[0].text,
            event: {click:this.showChildren}
          });
        } else { // 子孫メニューが存在しない場合
          v.step = 5.33; // nameを指定して画面切替
          Object.assign(v.li.children[0],{
            event:{click:(event)=>{
              changeScreen(event.target.getAttribute('name'));
              this.toggle();
            }}
          });
        }
      }

      v.step = 5.4; // navi領域にliを追加
      v.r = createElement(v.li,navi);
      if( v.r instanceof Error ) throw v.r;

      v.step = 5.5; // 子要素にdata-menuが存在する場合、再帰呼出
      if( v.hasChild ){
        v.r = this.genNavi(v.d,v.r,depth+1);
        if( v.r instanceof Error ) throw v.r;
      }
    }

    v.step = 6; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
