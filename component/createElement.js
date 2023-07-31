
function createElement(arg={}){
  const v = {rv:null,arg:{}};
  v.arg = mergeDeeply(
    {tag: 'div',attr: {},style:{},event:{},text: '',html:'',children:[]},
    (typeof arg === 'string' ? {tag:arg} : arg));
  v.rv = document.createElement(v.arg.tag);
  for( v.i in v.arg.attr ){
    v.rv.setAttribute(v.i,v.x = v.arg.attr[v.i]);
  }
  for( v.i in v.arg.logical ){
    if( v.arg.logical[v.i] ){
      v.rv.setAttribute(v.i);
    }
  }
  for( v.i in v.arg.style ){
    if( v.i.match(/^\-\-/) ){
      v.rv.style.setProperty(v.i,v.arg.style[v.i]);
    } else {
      v.rv.style[v.i] = v.arg.style[v.i];
    }
  }
  for( v.i in v.arg.event ){
    v.rv.addEventListener(v.i,v.arg.event[v.i],false);
  }
  if( v.arg.html.length > 0 ){
    v.rv.innerHTML = v.arg.html;
  } else {
    v.rv.innerText = v.arg.text;
  }
  for( v.i=0 ; v.i<v.arg.children.length ; v.i++ ){
    v.rv.appendChild(createElement(v.arg.children[v.i]));
  }
  return v.rv;
}