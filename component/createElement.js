/* コアスクリプト */
/**
 * @typedef {Object} createElementDef
 * @prop {string} tag='div' - タグ名
 * @prop {Object.<string,string>} [attr] - タグに設定する属性。ex.attr:{name:'hoge'}
 * @prop {Object.<string,string>} [style] - 〃スタイル。ex.style:{display:'none'}
 * @prop {Object.<string,string>} [event] - 〃イベント。ex.event:{onclick:()=>{〜}}
 * @prop {string} [text] - タグ内にセットする文字列
 * @prop {string} [html] - タグ内にセットするhtml文字列
 * @prop {createElementDef[]} [children] - 子要素の配列
 */

/**
 * HTMLの要素を生成
 * @param {createElementDef|string} arg - 生成する要素の定義
 * @returns {HTMLElement} 生成された要素
 */
function createElement(arg={}){
  const v = {rv:null,arg:{}};
  //console.log('createElement start.');

  // 既定値の設定
  v.arg = mergeDeeply(
    {tag: 'div',attr: {},style:{},event:{},text: '',html:'',children:[]},
    (typeof arg === 'string' ? {tag:arg} : arg));
  //console.log(v.arg);

  v.rv = document.createElement(v.arg.tag);
  for( v.i in v.arg.attr ){ // 属性の設定
    v.rv.setAttribute(v.i,v.x = v.arg.attr[v.i]);
  }
  for( v.i in v.arg.style ){ // スタイルの設定
    v.rv.style[v.i] = v.arg.style[v.i];
    //console.log(v.i,v.arg.style[v.i],v.rv.style);
  }
  for( v.i in v.arg.event ){ // イベントの設定
    v.rv.addEventListener(v.i,v.arg.event[v.i],false);
    //console.log(v.i,v.arg.event[v.i],v.rv);
  }
  if( v.arg.html.length > 0 ){
    v.rv.innerHTML = v.arg.html;
  } else {
    v.rv.innerText = v.arg.text;  // 内部文字列
  }
  for( v.i=0 ; v.i<v.arg.children.length ; v.i++ ){
    // 子要素の追加
    v.rv.appendChild(createElement(v.arg.children[v.i]));
  }
  //console.log('createElement end.',v.rv);
  return v.rv;
}
