/** 親要素を走査してナビゲーションを作成
 * @param {HTMLElement} wrapper - body等の親要素。
 * @param {HTMLElement} navi - nav等のナビゲーション領域
 * @param {number} depth=0 - 再帰呼出の階層
 * @param {boolean} addMenu=true - 再帰呼出で呼出元(親要素)がメニュー化対象ならtrue
 * @returns {null|Error}
 */
genNavi(wrapper=this.wrapper,navi=this.navi,depth=0,addMenu=true){
  const v = {whois:this.constructor.name+'.genNavi',rv:null,step:0,now:Date.now()};
  console.log(`${v.whois} start. depth=${depth}`);
  try {

    v.step = 1; // navi領域および画面・要素対応マップをクリア
    // 本作業は呼出後の最初の一回のみ実行、再帰呼出の場合は実施しない
    if( depth === 0 ){
      navi.innerHTML = '';
      this.screenAttr = {};
    }

    v.childDom = wrapper.querySelectorAll(':scope > [data-menu]');
    for( v.i=0 ; v.i < v.childDom.length ; v.i++ ){
      v.d = v.childDom[v.i];

      // ----------------------------------------------
      // wrapper内のdata-menu属性を持つ全要素に対する処理
      // ----------------------------------------------
      v.step = 2.1; // data-menu属性をthis.screenAttrに登録
      v.attr = this.#objectize(v.d.getAttribute(`data-menu`));
      if( v.attr instanceof Error ) throw v.attr;

      v.step = 2.2; // screenクラスが無ければ追加
      v.class = v.d.className.match(/screen/);
      if( !v.class ) v.d.classList.add('screen'); 

      v.step = 2.3; // nameが無ければ追加
      v.name = v.d.getAttribute('name');
      if( !v.name ){
        v.name = v.attr.id;
        v.d.setAttribute('name',v.name);
      }

      v.step = 2.4; // 画面・要素対応マップ(this.screenAttr)に登録
      this.screenAttr[v.name] = v.attr;

      // ----------------------------------------------
      // メニュー化対象か判断、対象ならナビ領域に追加
      // ----------------------------------------------

      v.step = 3; // navi領域への追加が必要か、判断
      v.addMenu = false;
      if( addMenu // 再帰呼出で呼出元(親要素)がメニュー化対象
        && (this.user.auth & v.attr.allow) > 0 // 実行権限が存在
        && v.attr.from <= v.now && v.now <= v.attr.to // かつ有効期間内
      ){
        v.addMenu = true;

        v.step = 3.1; // navi領域にul未設定なら追加
        if( navi.tagName !== 'UL' ){
          v.r = createElement({tag:'ul',attr:{class:this.constructor.name}},navi);
          if( v.r instanceof Error ) throw v.r;
          navi = v.r;
        }

        v.step = 3.2; // メニュー項目(li)の追加
        v.li = {tag:'li',children:[{
          tag:'a',
          text:v.attr.label,
          attr:{class:this.constructor.name,name:v.attr.id},
        }]};

        // 動作別にメニュー項目の内容を設定
        if( v.attr.hasOwnProperty('func') ){
          v.step = 3.3; // 指定関数実行の場合
          Object.assign(v.li.children[0],{
            attr:{href:'#',name:v.attr.func},
            event:{click:(event)=>{
              this.toggle();  // メニューを閉じる
              this.func[event.target.name](event); // 指定関数の実行
              this.genNavi(); // メニュー再描画
            }},
          });
        } else if( v.attr.hasOwnProperty('href') ){
          v.step = 3.4; // 他サイトへの遷移指定の場合
          Object.assign(v.li.children[0].attr,{href:v.attr.href,target:'_blank'});
          Object.assign(v.li.children[0],{event:{click:this.toggle}}); // 遷移後メニューを閉じる
        } else {
          // その他(=画面切替)の場合、子孫メニューがあるか確認
          if( v.d.querySelector(`[data-menu]`) ){
            v.step = 3.5; // 子孫メニューが存在する場合
            Object.assign(v.li.children[0],{
              // 初期がサブメニュー表示ならclassにis_openを追加
              attr:{class:(this.initialSubMenu ? 'is_open' : '')},
              // '▼'または'▶︎'をメニューの前につける
              text: (this.initialSubMenu ? '▶︎' : '▼') + v.li.children[0].text,
              event: {click:this.showChildren}
            });
          } else { // 子孫メニューが存在しない場合
            v.step = 3.6; // nameを指定して画面切替
            Object.assign(v.li.children[0],{
              event:{click:(event)=>{
                this.changeScreen(this.screenAttr[event.target.getAttribute('name')].screen);
                this.toggle();
              }}
            });
          }
        }

        v.step = 3.7; // navi領域にliを追加
        v.r = createElement(v.li,navi);
        if( v.r instanceof Error ) throw v.r;
      }

      // ----------------------------------------------
      // 子孫階層を持つか判断、子孫有りなら再帰呼出
      // ----------------------------------------------
      v.step = 4;
      if( v.d.querySelector('[data-menu]') !== null ){
        console.log('l.729',v.d,v.r,depth+1,(addMenu && v.addMenu))
        v.r = this.genNavi(v.d,v.r,depth+1,(addMenu && v.addMenu));
        if( v.r instanceof Error ) throw v.r;
      }
    }

    v.step = 5; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}