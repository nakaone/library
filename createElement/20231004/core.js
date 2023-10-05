/**
 * @typedef CEDefObj
 * @prop {string} [tag='div'] - タグ
 * @prop {Object.<string, string>} [attr={}] - タグの属性(ex.src, class)
 * @prop {Object.<string, string>} [style={}] - 適用するCSS。ラベルは通常のCSSと同じ。
 * @prop {Object.<string, string>} [event={}] - イベント名：関数Objのオブジェクト。ex. {click:()=>{〜}}
 * @prop {string} [text=''] - innerTextにセットする文字列
 * @prop {string} [html=''] - innerHTMLにセットする文字列
 * @prop {CEDefObj[]} [children=[]] - 子要素
 */

/** HTMLElementを生成する
 * @param {CEDefObj|CEDefObj[]} arg - 生成するHTMLElementの定義
 * @param {HTMLElement|string} [parent=null] - 本関数内部で親要素への追加まで行う場合に指定
 * @returns {HTMLElement|Error}
 */
function createElement(arg,parent=null){
  const v = {whois:'createElement',rv:[],step:0,isArr:Array.isArray(arg)};
  console.log(v.whois+' start.',arg);
  try {
    v.step = 1.1; // 引数を強制的に配列化
    if( !v.isArr ) arg = [arg];
    v.step = 1.2; // 親要素の特定
    if( parent !== null ){
      v.parent = typeof parent === 'string' ? document.querySelector(parent) : parent;
    }


    for( v.i = 0 ; v.i<arg.length ; v.i++ ){
      v.step = 2; // 既定値の設定
      v.def = {tag: 'div',attr: {},style:{},event:{},text: '',html:'',children:[]};
      Object.assign(v.def,(typeof arg[v.i] === 'string' ? {tag:arg} : arg[v.i]))

      v.step = 3; // HTMLElementを生成、v.objとする
      v.obj = document.createElement(v.def.tag);

      v.step = 4; // HTMLElementの属性を定義
      for( v.j in v.def.attr ){
        v.obj.setAttribute(v.j,v.x = v.def.attr[v.j]);
      }

      v.step = 5; // 論理属性を定義(ex.checked)
      for( v.j in v.def.logical ){
        if( v.def.logical[v.j] ){
          v.obj.setAttribute(v.j,true);
        }
      }

      v.step = 6; // style属性の定義
      for( v.j in v.def.style ){
        if( v.j.match(/^\-\-/) ){ // CSS変数
          v.obj.style.setProperty(v.j,v.def.style[v.j]);
        } else {
          v.obj.style[v.j] = v.def.style[v.j];
        }
      }

      v.step = 7; // イベントの定義
      for( v.j in v.def.event ){
        v.obj.addEventListener(v.j,v.def.event[v.j],false);
      }

      v.step = 8; // 内部文字列(html or text)
      if( v.def.html.length > 0 ){
        v.obj.innerHTML = v.def.html;
      } else {
        v.obj.innerText = v.def.text;
      }

      v.step = 9; // 子要素の追加(parentは指定しない)
      for( v.j=0 ; v.j<v.def.children.length ; v.j++ ){
        v.obj.appendChild(createElement(v.def.children[v.j]));
      }

      v.step = 10; // 戻り値への登録
      v.rv.push(v.obj);

      v.step = 11; // 親要素への追加
      if( parent !== null ){
        v.parent.appendChild(v.obj);
      }
    }

    v.step = 12; // 配列で渡されたら配列で、オブジェクトならオブジェクトを返す
    v.rv = v.isArr ? v.rv : v.rv[0];
    console.log(v.whois+' normal end.\n',v.rv);
    return v.rv;

  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }
}
