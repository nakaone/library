/** replaceHolders: テキストの置換指示文字列部分をデータで置換
 * 
 * @param {string} text - 置換対象テキスト
 * @param {string|RegExp} rex - 置換指示文字列を指定する正規表現。'g'不要、変数名部分を$1にする。ex.`::(.+?)::`
 * @param {Object.<string,string>} dObj - 置換データ
 * @param {boolean} minimize=false - 最小化するならtrue
 * @returns 
 */
function replaceHolders(text,rex,dObj,minimize=true){
  // 埋込指定文字列をリストアップ
  const map = {};
  text.match(new RegExp(rex,'g')).forEach(x => {
    let m = x.match(new RegExp(rex));
    map[m[1]] = new RegExp(m[0],'g');
  });
  
  // 埋込指定文字列を置換
  for( const p in map ){
    text = text.replaceAll(map[p],dObj[p]);
  }

  // 最小化
  if( minimize === true ){
    text = text.replaceAll(/\\n/g,' ').replaceAll(/ +/g,' ')
    .replaceAll(/\s*?\/\*+[\s\S]+?\*\/\s*?/g,'');
  }

  return text;
}
