/**
 * @typedef {Object} colDef - 項目定義オブジェクト
 * @param {string} name - 行オブジェクト内のメンバ名
 * @param {string} [label] - テーブルに表示する項目名。省略時はnameを流用
 * @param {string} [align]="left" - セル内の表示位置
 */

/** createTable : オブジェクトの配列からHTMLテーブルを生成
 * @param {Object[]} data - 行オブジェクトの配列
 * @param {Object} opt - オプション
 * @param {colDef[]} [opt.cols] - 項目定義オブジェクトの配列
 * @param {HTMLElement|string} [opt.parent=null] - 本関数で親要素へ追加する場合に指定。文字列ならCSSセレクタと解釈
 * @returns {HTMLElement|Error}
 */
function createTable(data,opt=null) {
  const v = { whois: 'createTable', rv: null};
  dev.start(v.whois, [...arguments]);
  try {

    // -------------------------------------------------------------
    dev.step(1);  // 事前準備
    // -------------------------------------------------------------
    dev.step(1.1); // オプション既定値設定
    if( opt === null ){
      opt = {cols:[],parent:null};
    } else {
      switch( typeof opt ){
        case 'object': if( !opt.hasOwnProperty('cols') ) opt.cols = []; break;
        case 'string': opt = {cols:[],parent:opt}; break;
        default: throw new Error('"opt" must be object or string');
      }
    }
    dev.dump(opt);
    
    dev.step(1.2); // 項目未定義ならオブジェクトのメンバ名で代用
    if( opt.cols.length === 0 ){
      v.map = [];
      data.forEach(o => v.map = [...v.map, ...Object.keys(o)]);
      new Set(v.map).forEach(x => opt.cols.push({name:x,label:x}));
    }

    // -------------------------------------------------------------
    dev.step(2); // thead部の作成
    // -------------------------------------------------------------
    v.thead = [];
    opt.cols.forEach(col => {
      v.thead.push({
        tag: 'th',
        text: col.label || col.name,
      });
    });
    v.thead = [{tag:'tr', children:v.thead}];

    // -------------------------------------------------------------
    dev.step(3); // tbody部の作成
    // -------------------------------------------------------------
    v.tbody = [];
    data.forEach(row => {
      v.tr = [];
      opt.cols.forEach(col => {
        v.o = {
          tag: 'td',
          html: row[col.name] === undefined ? ''
          : (col.hasOwnProperty('func')
          ? col.func(row[col.name]) // 変換関数があれば適用
          : String(row[col.name])),
        };
        if( col.align && col.align !== "left" ){
          v.o.style = {"text-align": col.align };
        }
        v.tr.push(v.o);
      });
      v.tbody.push({tag:'tr',children:v.tr});
    });
    
    dev.end(); // 終了処理
    return createElement({
      tag:'table', children: [
        {tag:'thead', children:v.thead},
        {tag:'tbody', children:v.tbody},
      ],
    },(opt.parent || null));

  } catch (e) { dev.error(e); return e; }
}
