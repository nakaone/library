/** オブジェクトの配列からシートイメージを作成
  * - シートイメージで渡された場合(raw)
  *   - headerは指定の有無に拘わらず先頭行で置換<br>
  *     ∵ rawとheaderで内容に齟齬が有った場合、dataが適切に作成されない
  *   - 先頭行に空欄が有った場合、ColNで自動的に命名
  * - オブジェクトの配列が渡された場合(data)
  *   - headerの指定なし：メンバ名を抽出してheaderを作成
  *   - headerの指定あり：データとしてのオブジェクトにheaderに無いメンバが有っても無視
  * - rawとdata両方が渡された場合、いずれも変更しない(齟齬の有無はノーチェック)
  * - 以下の条件をすべて満たす場合、新規にシートを作成
  *   - シート名がthis.nameのシートが存在しない
  *   - 操作対象がシートではない(this.type === 'data')
  *   - シート名(this.name)が指定されている
  * - シートはthis.nameで指定された名前になるが、左上のセル位置も併せて指定可能<br>
  *   ex. 'testsheet'!B2<br>
  *   なおセル位置は左上の単一セル指定のみ有効、他は有っても無視(ex.B2:C5ならC5は無視)
  * 
  * 1. オブジェクトの配列(this.data.length > 0) ※択一
  *    1. headerの作成
  *    1. rawの作成
  * 1. シートイメージ(this.raw.length > 0) ※択一
  *    1. headerの作成 : 1行目をヘッダと看做す(添字:0)
  *    1. dataの作成
  * 1. シートの作成(this.type=='data' && this.name!=null)
  *    1. 既存のシートがないか確認(存在すればエラー)
  *    1. this.rawをシートに出力
  * 
  * @param {void}
  * @returns {void}
  */
prepData(){
  const v = {whois:this.className+'.prepData',rv:null,step:0,colNo:1};
  console.log(`${v.whois} start.`);
  try {

    if( this.data.length > 0 ){
      v.step = 1; // オブジェクトの配列でデータを渡された場合
      v.step = 1.1; // headerの作成
      if( this.header.length === 0 ){
        v.members = new Set();
        this.data.forEach(x => {
          Object.keys(x).forEach(y => v.members.add(y));
        });
        this.header = Array.from(v.members);
      }
      v.step = 1.2; // rawの作成
      this.raw[0] = this.header;
      for( v.r=0 ; v.r<this.data.length ; v.r++ ){
        this.raw[v.r+1] = [];
        for( v.c=0 ; v.c<this.header.length ; v.c++ ){
          v.val = this.data[v.r][this.header[v.c]];
          this.raw[v.r+1][v.c] = v.val ? v.val : '';
        }
      }
    } else {
      v.step = 2; // シートイメージでデータを渡された場合
      v.step = 2.1; // headerの作成
      this.header = JSON.parse(JSON.stringify(this.raw[0]));
      for( v.c=0 ; v.c<this.header.length ; v.c++ ){
        if( this.header[v.c] === '' ) this.header[v.c] = 'Col' + v.colNo++;
      }
      v.step = 2.2; // dataの作成
      if( this.data.length === 0 ){
        for( v.r=1 ; v.r<this.raw.length ; v.r++ ){
          v.o = {};
          for( v.c=0 ; v.c<this.header.length ; v.c++ ){
            v.o[this.header[v.c]] = this.raw[v.r][v.c];
          }
          this.data.push(v.o);
        }
      }
    }

    v.step = 3; // raw/data以外のメンバの設定
    this.bottom = this.top + this.raw.length - 1;
    this.right = this.left + this.raw[0].length - 1;

    v.step = 4; // シートの作成
    v.ass = SpreadsheetApp.getActiveSpreadsheet();
    if( this.type==='data' && this.name!=='' && v.ass.getSheetByName(this.name)===null ){
      this.sheet = v.ass.insertSheet();
      this.sheet.setName(this.name);
      this.sheet.getRange(this.top,this.left,this.raw.length,this.raw[0].length)
      .setValues(this.raw);
    }

    v.step = 5; // 終了処理
    console.log(`${v.whois} normal end.`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}
