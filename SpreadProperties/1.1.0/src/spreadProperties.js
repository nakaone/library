/** spreadProperties: フォルダ・ファイル関連、スプレッドシート関連の属性情報取得
 * @param {void}
 * @returns {Object.<string,string>} 属性名：値形式
 */
spreadProperties(){
  const v = {whois:this.constructor.name+'.spreadProperties',step:0,rv:null};
  console.log(`${v.whois} start.`);
  try {

    this.srcFile = DriveApp.getFileById(this.spread.getId());
    v.rv = {
      // フォルダ・ファイル関連情報
      Ancestors: (()=>{ // マイドライブ〜所属するフォルダまでのツリー
        v.folderNames = [];
        v.folder = this.srcFile.getParents().next();
        while (v.folder) {
          v.folderNames.unshift(v.folder.getName());
          v.parents = v.folder.getParents();
          v.folder = v.parents.hasNext() ? v.parents.next() : null;
        }
        return v.folderNames;
      })(),
      Description: this.srcFile.getDescription(), // ファイルの説明文
      DateCreated: toLocale(this.srcFile.getDateCreated()), // ファイル作成日時
      LastUpdated: toLocale(this.srcFile.getLastUpdated()),
      Size: this.srcFile.getSize(),

      // スプレッドシート関連情報
      Id: this.spread.getId(),
      Name: this.spread.getName(),
      NamedRange: (()=>{  // 名前付き範囲
        v.a = []; this.spread.getNamedRanges().forEach(o => {
          v.r = o.getRange();
          v.a.push({
            Name: o.getName(),
            sheetName: v.r.getSheet().getName(),
            Range: v.r.getA1Notation(),
          });
        }); return v.a;
      })(),
      Owner: this.spread.getOwner().getEmail(),
      SpreadsheetLocale: this.spread.getSpreadsheetLocale(), // 言語/地域
      SpreadsheetTimeZone: this.spread.getSpreadsheetTimeZone(), // スプレッドシートのタイムゾーン
      Url: this.spread.getUrl(),
      Viewers: (()=>{  // 閲覧者とコメント投稿者のリスト
        v.a = [];
        this.spread.getViewers().forEach(x => v.a.push(x.getEmail()));
        return v.a;
      })(),

      SavedDateTime: toLocale(new Date(this.conf.start)),  // 本メソッド実行日時
      Sheets: [], // シート情報
    };

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
