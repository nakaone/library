/** sdbColumn: 項目定義オブジェクト */
class sdbColumn {

  static typedef(){return [
    {name:'name',type:'string',note:'項目名'},
    {name:'type',type:'string',note:'データ型。string,number,boolean,Date,JSON,UUID'},
    {name:'format',type:'string',note:'表示形式。type=Dateの場合のみ指定'},
    {name:'options',type:'number|string|boolean|Date',note:'取り得る選択肢(配列)のJSON表現。ex.["未入場","既収","未収","無料"]'},
    {name:'default',type:'number|string|boolean|Date',note:'既定値'},
    {name:'primaryKey',type:'boolean',note:'一意キー項目ならtrue'},
    {name:'unique',type:'boolean',note:'primaryKey以外で一意な値を持つならtrue'},
    {name:'auto_increment',type:'null|bloolean|number|number[]',note:'自動採番項目'
      + '\n// null ⇒ 自動採番しない'
      + '\n// boolean ⇒ true:自動採番する(基数=1,増減値=1)、false:自動採番しない'
      + '\n// number ⇒ 自動採番する(基数=指定値,増減値=1)'
      + '\n// number[] ⇒ 自動採番する(基数=添字0,増減値=添字1)'
    },
    {name:'suffix',type:'string',note:'"not null"等、上記以外のSQLのcreate table文のフィールド制約'},
    {name:'note',type:'string',note:'本項目に関する備考。create table等では使用しない'},
  ]};

  /** @constructor
   * @param arg {sdbColumn|string} - 項目定義オブジェクト、または項目定義メモまたは項目名
   * @returns {sdbColumn|Error}
   */
  constructor(arg={}){
    const v = {whois:'sdbColumn.constructor',step:0,rv:null};
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 1; // 引数が項目定義メモまたは項目名の場合、オブジェクトに変換
      if( whichType(arg,'String') ) arg = this.str2obj(arg);
      if( arg instanceof Error ) throw arg;

      v.step = 2; // メンバに格納
      sdbColumn.typedef().map(x => x.name).forEach(x => {
        this[x] = arg.hasOwnProperty(x) ? arg[x] : null;
      });

      v.step = 3; // auto_incrementをオブジェクトに変換
      if( this.auto_increment !== null && String(this.auto_increment).toLowerCase() !== 'false' ){
        switch( whichType(this.auto_increment) ){
          case 'Array': this.auto_increment = {
            base: this.auto_increment[0],
            step: this.auto_increment[1],
          }; break;
          case 'Number': this.auto_increment = {
            base: Number(this.auto_increment),
            step: 1,
          }; break;
          default: this.auto_increment = {
            base: 1,
            step: 1,
          };
        }
      } else {
        this.auto_increment = false;
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.`);

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** str2obj: 項目定義メモの文字列(または項目名)から項目定義オブジェクトを作成
   * @param arg {string} 項目定義メモの文字列、または項目名
   * @returns {Object} 項目定義オブジェクト
   */
  str2obj(arg){
    const v = {whois:'sdbColumn.str2obj',step:0,rv:null,
      rex: /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, // コメント削除の正規表現
      isJSON: (str) => {let r;try{r=JSON.parse(str)}catch(e){r=null} return r},
    };
    console.log(`${v.whois} start.\narg(${whichType(arg)})=${stringify(arg)}`);
    try {

      v.step = 1; // コメントの削除
      arg = arg.replace(v.rex,'');

      v.step = 2; // JSONで定義されていたらそのまま採用
      v.rv = v.isJSON(arg);

      if( v.rv === null ){
        v.step = 3; // 非JSON文字列だった場合、改行で分割
        v.lines = arg.split('\n');

        v.step = 4; // 一行毎に属性の表記かを判定
        v.rv = {};
        v.lines.forEach(prop => {
          v.m = prop.trim().match(/^["']?(.+?)["']?\s*:\s*["']?(.+)["']?$/);
          if( v.m ) v.rv[v.m[1]] = v.m[2];
        });

        v.step = 5; // 属性項目が無ければ項目名と看做す
        if( Object.keys(v.rv).length === 0 ){
          v.rv = {name:arg.trim()};
        }
      }

      v.step = 9; // 終了処理
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** getNote: 項目定義メモの文字列を作成
   * @param opt {Object}
   * @param opt.undef=true {boolean} - 未定義の項目もコメントとして記載
   * @param opt.defined=false {boolean} - 定義済項目もデータ型・説明文をコメントとして記載
   * @returns {string} 項目定義メモの文字列
   */
  getNote(opt={}){
    const v = {whois:'sdbColumn.getNote',step:0,rv:[],prop:{}};
    console.log(`${v.whois} start.\nthis=${stringify(this)}\nopt(${whichType(opt)})=${stringify(opt)}`);
    try {

      v.step = 1; // オプションの既定値を設定
      v.opt = Object.assign({undef:true,defined:false},opt);

      v.step = 2; // 項目定義の属性を順次チェック
      v.typedef = sdbColumn.typedef();
      for( v.i=0 ; v.i<v.typedef.length ; v.i++ ){
        v.typedef[v.i] = Object.assign({type:'',note:''},v.typedef[v.i]);
        if( this[v.typedef[v.i].name] !== null ){
          // auto_incrementは配列型で記載されるよう変換
          v.val = v.typedef[v.i].name === 'auto_increment' && whichType(this.auto_increment,'Object')
          ? JSON.stringify([this.auto_increment.base,this.auto_increment.step]) : this[v.typedef[v.i].name];
          v.l = `${v.typedef[v.i].name}: ${v.val}`
            + ( v.opt.defined ? ` // {${v.typedef[v.i].type}} - ${v.typedef[v.i].note}` : '');
        } else if( v.opt.undef ){
          // 説明文をコメントとして出力する場合
          v.l = `// ${v.typedef[v.i].name}:undefined {${v.typedef[v.i].type}} - ${v.typedef[v.i].note}`;
        }
        v.rv.push(v.l);
      }

      v.step = 9; // 終了処理
      v.rv = v.rv.join('\n');
      console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
      return v.rv;

    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }
}