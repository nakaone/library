/* コアスクリプト */
/**
 * @typedef {Object} gSpreadTabulizeArg
 * @prop {string} spreadId - スプレッド(ファイル)のID
 * @prop {string} spreadName - スプレッドの名前
 * @prop {number} sheetId - シートのID
 * @prop {string} sheetName - シート名
 * @prop {number} firstRow - 最上行。自然数
 * @prop {number} lastRow - 最下行
 * @prop {number} firstColumn - 左端列。自然数
 * @prop {number} lastColumn - 右端列
 * @prop {string[][]} value - セルの値
 * @prop {string[][]} type - データ型
 * @prop {string[][]} format - 表示形式
 * @prop {string[][]} formula - 数式
 * @prop {string[][]} R1C1 - R1C1形式の数式
 * @prop {string[][]} note - メモ
 * @prop {string[][]} background - 背景色
 * @prop {string[][]} fontColor - 文字色
 * @prop {string[][]} fontWeight - 太さ　[bold/normal]
 * @prop {string[][]} horizontalAlign - 水平位置
 * @prop {string[][]} verticalAlign - 垂直位置
 * @prop {number[]} width - 列の幅
 * @prop {number[]} height - 行の高さ
 * @prop {void} border - 罫線。未対応
 */

/**
 * GAS関数jsonRangeの出力からHTMLのテーブルを作成
 *
 * **使用方法**
 *
 * 1. Google SpreadでjsonRange()を準備
 *    1. Google Spreadのスクリプトに本ファイルのscript.GASの内容をコピー
 *    1. onOpen()を起動時トリガーに登録
 *    1. 権限を付与(jsonRangeを試行)
 *    1. Google Spreadを再起動
 * 1. Google SpreadからJSONを出力
 *    1. 出力したい範囲を選択
 *    1. メニューバーの「道具箱 > 選択範囲をJSON化」を実行
 *    1. ダイアログにJSONが表示されるのでコピー
 * 1. JSONをHTML化
 *    1. gSpreadTabulize.html(本ファイル)を開く
 *    1. 「GAS output」欄にコピーしたJSONを貼り付け
 *    1. 画面の表示内容で問題ないか確認
 *    1. 「HTML source」欄の内容をコピー
 *    1. JSDoc等、適切な部分にペースト
 *
 * @param {gSpreadTabulizeArg} data - GAS関数jsonRangeから出力されたJSON文字列
 * @returns {HTMLDivElement} 作成されたHTMLのテーブル
 */
function gSpreadTabulize(data){
  const v = {};
  console.log('gSpreadTabulize start.');

  // 変換元データをオブジェクト化
  v.data = JSON.parse(data);

  // CSS要素の定義
  v.css = {tag:'style',attr:{type:'text/css'},text:`
    .gSpreadTabulize div {
      display: grid;
      margin: 2px;
      padding: 0px 0.3rem;  /* test
      box-sizing: border-box; */
    }
    .gSpreadTabulize .table {
      display: grid;
    }
    .gSpreadTabulize .th {
      background: #ccc;
      font-weight: bold;
      text-align: center;
    }
    .gSpreadTabulize .td {
      border-bottom: solid 1px #ccc;
      border-right: solid 1px #ccc;
    }
  `.replaceAll('\n','')
  .replaceAll(/ +/g,' ')
  .replaceAll(/{\s+/g,'{').replaceAll(/\s+}/g,'}')
  .replaceAll(/\/\*.+?\*\//g,'')  // コメント削除
  .trim()};

  // テーブル要素の定義
  v.table = {style:{},
    //style:{display:'grid'},
    //attr:{class:"gSpreadTabulize"},
    children:[]
  };
  // テーブルの列数・幅を設定
  v.table.style.gridTemplateColumns
  = '4rem '  // 最初の項は行番号記号列の幅
  + v.data.width.join('fr ')+'fr';

  // 列記号行の生成
  v.columnSymbol = (()=>{
    let rv = [''];
    for( let i=0 ; i<702 ; i++ ){
      let l1 = i<26 ? '' : String.fromCharCode(64+Math.floor(i/26));
      let l2 = String.fromCharCode(65+(i%26));
      rv.push(l1+l2);
    }
    return rv;
  })();
  // 左上隅の行列記号欄(空白セル)
  v.table.children.push({attr:{class:'th'}});
  // 対象領域の列記号セル(必ずしもA列からではない)
  for( let c=v.data.firstColumn ; c<=v.data.lastColumn ; c++ ){
    v.table.children.push({attr:{class:'th'},text:v.columnSymbol[c]});
  }

  // データ領域の作成
  v.template = '<sup style="color:red"'
    + ' onclick="alert(\'_\')">※</sup>';
  v.formula = '=== formula ========\\n_\\n\\n';
  v.note = '=== note ========\\n_\\n\\n';
  for( let r=0 ; r<v.data.value.length ; r++ ){
    v.table.children.push(  // 行番号欄
      {attr:{class:'th'},text:r+v.data.firstRow});
    for( let c=0 ; c<v.data.value[r].length ; c++ ){
      v.cell = {  // データ欄
        attr: {class:'td'},
        html: v.data.value[r][c],
        style:{
          textAlign: v.data.horizontalAlign[r][c].replace('general-',''),
          background: v.data.background[r][c],
        },
      };
      // メモ、算式のポップアップ
      v.popup = '';
      if( v.data.formula[r][c].length > 0 ){
        v.popup += v.formula.replace('_',v.data.formula[r][c]);
      }
      if( v.data.note[r][c].length > 0 ){
        v.popup += v.note.replace('_',v.data.note[r][c]);
      }
      if( v.popup.length > 0 ){
        // GAS側出力時、エラー回避のため改行を<br>に変換しているので戻す
        v.popup = v.popup.replaceAll('<br>','\\n');
        v.cell.html += v.template.replace('_',v.popup);
      }

      // spanで囲まないとpopupがdiv内で縦並びになるので追加
      v.cell.html = '<span>'+v.cell.html+'</span>';
      v.table.children.push(v.cell);
    }
  }

  // 戻り値の作成
  v.rv = createElement({
    attr:{class:"gSpreadTabulize"},
    children:[v.css,v.table]
  });

  console.log('gSpreadTabulize end.');
  return v.rv;
}
