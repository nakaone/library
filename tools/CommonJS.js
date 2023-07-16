/**
 * @typedef {object} AnalyzeArg - コマンドライン引数の分析結果
 * @prop {Object.<string, number>} opt - スイッチを持つ引数について、スイッチ：値形式にしたオブジェクト
 * @prop {string[]} val - スイッチを持たない引数の配列
 */
/**
 * @desc コマンドラインから`node xxx.js aa bb`を実行した場合の引数(`aa`,`bb`)を取得し、オブジェクトにして返す。<br>
 * 
 * @example
 * 
 * ```
 * node xxx.js -i:aaa.html bbb -o:ccc.json ddd eee
 * ⇒ {opt:{i:"aaa.html",o:"ccc.json"},val:["bbb","ddd","eee"]}
 * ```
 * 
 * <caution>注意</caution>
 * 
 * - スイッチは`(\-*)([0-9a-zA-Z]+):*(.*)$`形式であること
 * - スイッチに該当しないものは配列`val`にそのまま格納される
 * 
 * @param {void} - なし
 * @returns {AnalyzeArg} 分析結果のオブジェクト
 */

function analyzeArg(){
  console.log('===== analyzeArg start.');
  const v = {rv:{opt:{},val:[]}};
  try {

    for( v.i=2 ; v.i<process.argv.length ; v.i++ ){
      // process.argv:コマンドライン引数の配列
      v.m = process.argv[v.i].match(/^(\-*)([0-9a-zA-Z]+):*(.*)$/);
      if( v.m && v.m[1].length > 0 ){
        v.rv.opt[v.m[2]] = v.m[3];
      } else {
        v.rv.val.push(process.argv[v.i]);
      }
    }

    console.log('v.rv='+JSON.stringify(v.rv));
    console.log('===== analyzeArg end.');
    return v.rv;
  } catch(e){
    console.error('===== analyzeArg abnormal end.\n',e);
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}


/**
 * @typedef {object} AnalyzePath - パス文字列から構成要素を抽出したオブジェクト
 * @prop {string} full - 引数の文字列(フルパス)
 * @prop {string} path - ファイル名を除いたパス文字列
 * @prop {string} file - ファイル名
 * @prop {string} base - 拡張子を除いたベースファイル名
 * @prop {string} suffix - 拡張子
 */
/**
 * @desc パス名文字列から構成要素を抽出
 * @param {string} arg - パス文字列
 * @returns {AnalyzePath}　構成要素を抽出したオブジェクト
 * @example
 * 
 * ```
 * "/Users/ena.kaon/Desktop/GitHub/library/JavaScript/analyzePath.html" ⇒ {
 *   "path":"/Users/ena.kaon/Desktop/GitHub/library/JavaScript/",
 *   "file":"analyzePath.html",
 *   "base":"analyzePath",
 *   "suffix":"html"
 * }
 * 
 * "/Users/ena.kaon/Desktop/GitHub/library/JavaScript" ⇒ {
 *   "path":"/Users/ena.kaon/Desktop/GitHub/library/",
 *   "file":"JavaScript",
 *   "base":"JavaScript",
 *   "suffix":""
 * }
 * 
 * "./analyzePath.html" ⇒ {
 *   "path":"./",
 *   "file":"analyzePath.html",
 *   "base":"analyzePath",
 *   "suffix":"html"
 * }
 * 
 * "analyzePath.html" ⇒ {
 *   "path":"",
 *   "file":"analyzePath.html",
 *   "base":"analyzePath",
 *   "suffix":"html"
 * }
 * 
 * "analyzePath.hoge.html" ⇒ {
 *   "path":"",
 *   "file":"analyzePath.hoge.html",
 *   "base":"analyzePath.hoge",
 *   "suffix":"html"
 * }
 * 
 * "analyzePath.fuga" ⇒ {
 *   "path":"",
 *   "file":"analyzePath.fuga",
 *   "base":"analyzePath",
 *   "suffix":"fuga"
 * }
 * 
 * "https://qiita.com/analyzePath.html" ⇒ {
 *   "path":"https://qiita.com/",
 *   "file":"analyzePath.html",
 *   "base":"analyzePath",
 *   "suffix":"html"
 * }
 * 
 * ```
 */

function analyzePath(arg){
  console.log('===== analyzePath start.');
  const v = {rv:{}};
  try {

    v.m1 = arg.match(/^(.*)\/([^\/]+)$/);
    if( v.m1 ){
      v.rv.path = v.m1[1] + '/';
      v.rv.file = v.m1[2];
    } else {
      v.rv.path = '';
      v.rv.file = arg;
    }
    v.m2 = v.rv.file.match(/^(.+)\.([^\.]+?)$/);
    if( v.m2 ){
      v.rv.base = v.m2[1];
      v.rv.suffix = v.m2[2];
    } else {
      v.rv.base = v.rv.file;
      v.rv.suffix = '';
    }

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('===== analyzePath end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}

/* コアスクリプト */

/**
 * @classdesc HTMLにメニューを作成する
 * 
 * - [画面分割のレイアウト](BurgerMenu.grid.md)
 */

class BurgerMenu {

  /**
   * @constructor
   * @param {string} conf
   * @returns {void}
   */

  constructor(conf){
    console.log('----- BurgerMenu.constructor start.');
    const v = {};
    try {
      this.conf = this.#setDefault(conf);
      this.#setStyle();
      BurgerMenu.setTitle(this.conf.Title);
      this.#setMenu(document.querySelector('.BurgerMenu .Navi div ul'),this.conf.menu);

      BurgerMenu.changeScreen('home');
      console.log('----- BurgerMenu.constructor end.');
    } catch(e){
      console.error('----- BurgerMenu.constructor abnormal end.\n',e);
      // ブラウザで実行する場合はアラート表示
      if( typeof window !== 'undefined' ) alert(e.stack); 
      throw e; //以降の処理を全て停止
      //v.rv.stack = e.stack; return v.rv; // 処理継続
    }


  }

  /** オブジェクトの構造が複雑なため、constructorから分離 */
  #setDefault(conf){
    const rv = mergeDeeply({
      Title: '(未設定)',
      authority: null,  // 全メニューを表示
      style: {
        header: { // querySelector(.BurgerMenu div[name="header"])
          backgroundColor: "#81d8d0", // Element.style.xxx。xxxはJavaScriptで指定する場合の名称
          color: "#fff",
          fontSize: "1.6rem",
          fontWeight: 900,  // 文字の太さ
          zIndex: 1,
        },
        Navicon: {
          backgroundColor: "#5bb3b5",  // ハンバーガーメニューの色
        },
        navi: {
          backgroundColor: "#81d8d0",
          color: "#fff",
          size: "1rem",
          weight: 400, // normal  
        }
      },
      header: {
        innerHTML: null,  // <img><span>等、htmlで指定の場合使用
      },
    },conf);
    console.log('----- BurgerMenu.setDefault.\n',rv);
    return rv;
  }

  #setMenu(parent,list){
    const v = {};
    for( v.o of list ){
      console.log('l.59',v.o);

      // authority指定のないメニュー項目、または権限がない場合はスキップ
      if( !('authority' in v.o) 
      || this.conf.authority !== null && (this.conf.authority & v.o.authority) === 0
      ) continue;

      v.li = document.createElement('li');
      v.li.textContent = v.o.label;

      if( 'children' in v.o ){
        v.p = document.createElement('ul');
        this.#setMenu(v.p,v.o.children);
        v.li.appendChild(v.p);
      } else {
        console.log('l.74',v.o);
        if( 'href' in v.o ){
          console.log('l.76',v.o.href)
          v.func = new Function('window.open("'+v.o.href+'")');
        } else {
          v.func = new Function(`
          // メニューを非表示
          document.querySelector('.BurgerMenu .Navi div').classList.remove('is_active');
          document.querySelector('.BurgerMenu .NaviBack div').classList.remove('is_active');
          document.querySelectorAll('.BurgerMenu .Navicon button span')
          .forEach(x => x.classList.remove("is_active"));

          // loading画面を表示
          BurgerMenu.changeScreen('loading');

          // 指定された処理を実行
          `+v.o.func);
        }
        v.li.addEventListener('click',v.func);
      }
      parent.appendChild(v.li);
    }
  }

  #setStyle(){
    const v = {};
    for( v.sel in this.conf.style ){
      v.elements = document.querySelectorAll(v.sel);
      for( v.element of v.elements ){
        for( v.prop in this.conf.style[v.sel] ){
          if( v.prop.match(/^--/) ){
            // CSS変数の設定
            v.element.style.setProperty(v.prop,this.conf.style[v.sel][v.prop]);
          } else {
            // CSS変数以外の設定
            v.element.style[v.prop] = this.conf.style[v.sel][v.prop];
          }
        }
      }
    }
  }

  static setTitle(title){
    document.querySelector('.BurgerMenu .Title').innerHTML = title;
  }

  static toggle(){
    document.querySelector('.BurgerMenu .Navi div').classList.toggle("is_active");
    document.querySelector('.BurgerMenu .NaviBack div').classList.toggle("is_active");
    document.querySelectorAll('.BurgerMenu .Navicon button span')
    .forEach(x => x.classList.toggle("is_active"));
  }

  static changeScreen(scrId='loading'){
    console.log('----- BurgerMenu.changeScreen start.\nscrId="'+scrId+'"');
    const v = {};

    if( scrId === 'loading' ){
      document.querySelectorAll('body > div:not(.BurgerMenu)').forEach(x => x.style.display = 'none');
      // 待機画面を表示
      document.querySelector('.BurgerMenu .loading').style.display = '';
    } else {
      // 指定画面を表示、それ以外は非表示
      document.querySelectorAll('body > div:not(.BurgerMenu)').forEach(x => {
        v.name = x.getAttribute('name');
        x.style.display = v.name === scrId ? '' : 'none';
      });
      // 待機画面を非表示
      document.querySelector('.BurgerMenu .loading').style.display = 'none';
    }

    // メニューを非表示
    document.querySelector('.BurgerMenu .Navi div').classList.remove('is_active');
    document.querySelector('.BurgerMenu .NaviBack div').classList.remove('is_active');
    document.querySelectorAll('.BurgerMenu .Navicon button span')
    .forEach(x => x.classList.remove("is_active"));
    //console.log('----- BurgerMenu.changeScreen end.');
  }
}


/**
 * Array型の変数に2次元配列からHTMLの表を作成してtable要素として返すメソッドを追加する。
 * 
 * 使用前`Array.prototype.tabulize = Array_tabulize;`実行のこと。
 * 
 * @param {Object} [opt]
 * @param {string} opt.dateFormat {string} - 配列内のDateを表示する日時形式指定文字列(yMdhms.n)
 * @returns {HTMLTableObject}
 */

function Array_tabulize(opt){
 console.log('tabulize start.');
  const v = {
    table: document.createElement('table'),
    thead: document.createElement('thead'),
    tbody: document.createElement('tbody'),
    createElement: (tag,text='',opt={}) => {
      let rv = document.createElement(tag);
      rv.innerHTML = text;
      for( let x in opt ){
        rv.setAttribute(x,opt[x]);
      }
      return rv;
    },
  };
  console.log('tabulize end.');

  v.tr = v.createElement('tr');
  console.log(this[0]);
  for( v.i=0 ; v.i<this[0].length ; v.i++ ){
    v.tr.appendChild(v.createElement('th',this[0][v.i]));
  }
  v.thead.appendChild(v.tr);

  for( v.r=1 ; v.r<this.length ; v.r++ ){
    v.tr = v.createElement('tr');
    console.log(this[v.r]);
    for( v.c=0 ; v.c<this[v.r].length ; v.c++ ){
      v.raw = this[v.r][v.c];
      v.opt = {};
      switch( whichType(v.raw) ){
        case 'BigInt':
        case 'Number':
          v.text = Number(v.raw).toLocaleString();
          v.opt.style = 'text-align:right';
          break;
        case 'Date':
          v.text = v.raw.toLocale(opt.dateFormat);
        default:
          v.text = String(v.raw);
      }
      v.tr.appendChild(v.createElement('td',v.text,v.opt));
    }
    v.tbody.appendChild(v.tr);
  }

  v.table.appendChild(v.thead);
  v.table.appendChild(v.tbody);
  console.log(v.table)
  return v.table;
}


/**
 * @typedef {object} DateCalcArg
 * @prop {number} [y] - 年
 * @prop {number} [M] - 月
 * @prop {number} [d] - 日
 * @prop {number} [h] - 時
 * @prop {number} [m] - 分
 * @prop {number} [s] - 秒
 * @prop {number} [n] - ミリ秒
 */

/** 指定日に年/月/日/時/分/秒/ミリ秒数を加減した日時を計算する"calc()"メソッドをDate型に追加する。
 * @param {string|number[]|DateCalcArg} arg - 加減する年/月/日/時/分/秒/ミリ秒数の指定
 * @returns {string} 加減したDateオブジェクト(新規、非破壊)。無効な指定ならNull
 * 
 * arg = string -> "+1M"(1ヶ月後)のように、加減する値＋単位で指定
 * arg = number[] -> [年,月,日,時,分,秒,ミリ秒]で複数単位での加減を一括指定
 * arg = DateCalcArg -> 単位を指定した複数単位での加減。例：1時間10分後なら{h:1,m:10}
 * 
 * @example
 * ```
 * base: 2001/01/01 00:00:00.000
 * "+3y" ⇒ 2004/01/01 00:00:00.000
 * "2M" ⇒ 2001/03/01 00:00:00.000
 * "1d" ⇒ 2001/01/02 00:00:00.000
 * "-1h" ⇒ 2000/12/31 23:00:00.000
 * "-2m" ⇒ 2000/12/31 23:58:00.000
 * "-3s" ⇒ 2000/12/31 23:59:57.000
 * "-4n" ⇒ 2000/12/31 23:59:59.996
 * [3,2,1,-1,-2,-3,-4] ⇒ 2004/03/01 22:57:56.996
 * [3,2,1] ⇒ 2004/03/02 00:00:00.000
 * {"y":3,"M":2,"d":1} ⇒ 2004/03/02 00:00:00.000
 * ```
 * 
 * 
 * <details><summary>作成中：日付が存在しない場合の対処案</summary>
 * 
 * - 参考：[CSSで三角形を作ろう！](https://spicaweblog.com/2022/05/triangle/)
 * 
 * # 日付が存在しない場合の対処案
 * 
 * ## 問題点と対処案
 * 
 * **問題点**
 * 
 * 「2022年12月29日の2ヶ月後(⇒2/29)」「5月31日の1ヶ月前(⇒4/31)」等、日付をそのまま適用すると存在しない日付になる場合、何日にすべきか？
 * 
 * **対処案**
 * 
 * 1. 単純に加減算(算出日ベース)
 *     2022/12/29 + 2M = 2022/14/29 = 2023/02/29 = 2023/03/01
 * 1. 存在しない日は月末日と解釈(月末日ベース)
 *     2022/12/29 + 2M = 2022/14/29 = 2023/02/29 = 2023/03/00 = 2023/02/28
 * 1. 月末日から逆算(逆算日ベース)
 *     2022/12/29 = 2023/01/-2 + 2M = 2023/03/-2 = 2023/02/26
 * 
 * **前提、注意事項**
 * 
 * - JavaScriptでの日付は自然数(1〜31)だけでなく、0や負数も受け付ける。
 * - "0"は前月末日、"-1"は前月末日の前日、以降遡及して考える。
 *   ```
 *   new Date(2023,6,0) ⇒ 2023/06/30
 *   new Date(2023,6,-1) ⇒ 2023/06/29
 *   new Date(2023,6,-2) ⇒ 2023/06/28
 *   ```
 * 
 * なおこの問題は「開始月の日数＞終了月の日数」の場合のみ発生する(開始月の全ての日が終了月に存在場合は発生しない)。
 * 
 * <details><summary>計算手順</summary>
 * 
 * 1. Dateオブジェクトに単純に指定期間を加減算した日付を作成
 *     - ex. 2023/01/29 + 1M = 2023/02/29(a) ⇒ 2023/03/01(b)
 * 1. 単純に加減算した月(a)と、算出された月(b)を比較、一致した場合は終了
 * 1. a≠bの場合、対処案により以下のように分岐させる
 *     - ①算出日 ⇒ そのまま2023/03/01
 *     - ②月末日 ⇒ 有り得ない日付は「翌月0日」と解釈 ⇒ 2023/03/00 ⇒ 2023/02/28
 *     - ③月末からの逆算日 ⇒ 1月29日は2月-2日なので、+1Mで3月-2日 ⇒ 2023/02/26
 * 
 * </details>
 * 
 * # 引数が日付型
 * 
 * Dateオブジェクトから引数までの期間を返す
 * 
 * ```
 * typedef {object} DateCalc
 * prop {boolean} sign=true - Dateオブジェクト≦引数ならtrue
 * prop {number} y=null - 年
 * prop {number} M=null - 月
 * prop {number} d=null - 日
 * prop {number} h=null - 時
 * prop {number} m=null - 分
 * prop {number} s=null - 秒
 * prop {number} n=null - ミリ秒
 * ```
 * 
 * ## 開始(S)≦終了(E)
 * 
 * 注：以降、以下の変数を使用する。
 * 
 * | 変数名 | 意味 | 備考 |
 * | :-- | :-- | :-- |
 * | S | 開始日 | 算出の基点となる日付 |
 * | E | 終了日 | 算出の終点となる日付 |
 * | Sy | 開始年 | 開始日の年 |
 * | Ey | 終了年 | 終了日の年 |
 * | Sm | 開始月 |
 * | Em | 終了月 |
 * | Sd | 開始日 | 開始日の日付(Start | date) |
 * | Ed | 終了日 | 終了日の日付(End | date) |
 * | Sym | 開始年月 | 開始月のシリアル値(serial number of Start Year and Month) |
 * | Eym | 終了年月 | 終了月のシリアル値(serial number of End Year and Month) |
 * 
 * ### 開始(S)≦終了(E) and 開始日(Sd)≦終了日(Ed)
 * 
 * Sd<Ed例：「2022/12/21(Sd=21) -> 2023/02/28(Ed=28)」 ⇒ `{sign:true,M:2,d:8}`
 * 
 * <div class="axis" style="grid-template-columns:1fr 2rem">
 *   <div class="cols" style="grid-template-columns:2fr 2fr 1fr">
 *     <div class="col"><div>12/21</div><div>[1M]</div><div>1/20</div></div>
 *     <div class="col"><div>1/21</div><div>[1M]</div><div>2/20</div></div>
 *     <div class="col"><div>2/21</div><div>[8D]</div><div>2/28</div></div>
 *   </div>
 *   <div class="arrow" style="border-left: 2rem solid #aaa;"></div>
 * </div>
 * 
 * - 上図は時刻指定無しのサンプル。灰色矢印は「開始日▶️終了日」を示す
 * - 「1ヶ月後」は翌月同日同時刻
 * 
 * Sd=Ed例：「2022/12/28(Sd=28) -> 2023/02/28(Ed=28)」 ⇒ `{sign:true,M:2,d:1}`
 * 
 * <div class="axis" style="grid-template-columns:1fr 2rem">
 *   <div class="cols" style="grid-template-columns:2fr 2fr 1fr">
 *     <div class="col"><div>12/28</div><div>[1M]</div><div>1/27</div></div>
 *     <div class="col"><div>1/28</div><div>[1M]</div><div>2/27</div></div>
 *     <div class="col"><div>2/28</div><div>[1D]</div><div>2/28</div></div>
 *   </div>
 *   <div class="arrow" style="border-left: 2rem solid #aaa;"></div>
 * </div>
 * 
 * ```
 * diffM = Eym - Sym = 2
 * diffD = Ed - (Sd - 1)
 * ```
 * 
 * ### 開始(S)≦終了(E) and 開始日(Sd)＞終了日(Ed)
 * 
 * Sd>Ed例：「2022/12/31(Sd=31) -> 2023/02/26(Ed=26)」 ⇒ `{sign:true,M:1,d:27}`
 * 
 *   <div class="axis" style="grid-template-columns:1fr 2rem">
 *     <div class="cols" style="grid-template-columns:1fr 1fr">
 *       <div class="col"><div>12/31</div><div>[1M]</div><div>1/30</div></div>
 *       <div class="col"><div>1/31</div><div>[1+26D]</div><div>2/26</div></div>
 *     </div>
 *     <div class="arrow" style="border-left: 2rem solid #aaa;"></div>
 *   </div>
 * 
 * ```
 * diffM = Eym - Sym - 1
 * diffD = (Smの日数 - Sd + 1) + Ed
 * ```
 * 
 * ## 開始(S)＞終了(E)
 * 
 * ### 開始(S)＞終了(E) and 開始日(Sd)＜終了日(Ed)
 * 
 * Sd<Ed例：「2023/02/28(Sd=28) -> 2022/12/30(Ed=30)」
 * 
 * **2/28から逆算する場合** ⇒ `{sign:false,M:1,d:30}`
 * 
 * <div class="axis" style="grid-template-columns:2rem 1fr">
 *   <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
 *   <div class="cols" style="grid-template-columns:1fr 2fr">
 *     <div class="col"><div>12/30</div><div>[2+28D]</div><div>1/28</div></div>
 *     <div class="col"><div>1/29</div><div>[1M]</div><div>2/28</div></div>
 *   </div>
 * </div>
 * 
 * **12/30から算出する場合** ⇒ `{sign:false,M:1,d:30}`
 * 
 * <div class="axis" style="grid-template-columns:2rem 1fr">
 *   <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
 *   <div class="cols" style="grid-template-columns:2fr 1fr">
 *     <div class="col"><div>12/30</div><div>[1M]</div><div>1/29</div></div>
 *     <div class="col"><div>1/30</div><div>[2+28D]</div><div>2/28</div></div>
 *   </div>
 * </div>
 * 
 * ```
 * diffM = Sym - Eym - 1
 * diffD = ( Emの日数 - Ed + 1 ) + Sd
 * ```
 * 
 * ### 開始(S)＞終了(E) and 開始日(Sd)＝終了日(Ed)
 * 
 * Sd=Ed例：「2022/12/28(Sd=28) -> 2023/02/28(Ed=28)」 ⇒ `{sign:false,M:2,d:1}`
 * 
 * **2/28から逆算する場合** ⇒ `{sign:false,M:2,d:1}`
 * 
 * <div class="axis" style="grid-template-columns:2rem 1fr">
 *   <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
 *   <div class="cols" style="grid-template-columns:1fr 2fr 2fr">
 *     <div class="col"><div>12/28</div><div>[1D]</div><div>12/28</div></div>
 *     <div class="col"><div>12/29</div><div>[1M]</div><div>1/28</div></div>
 *     <div class="col"><div>1/29</div><div>[1M]</div><div>2/28</div></div>
 *   </div>
 * </div>
 * 
 * **12/28から算出する場合** ⇒ `{sign:false,M:2,d:1}`
 * 
 * <div class="axis" style="grid-template-columns:2rem 1fr">
 *   <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
 *   <div class="cols" style="grid-template-columns:2fr 2fr 1fr">
 *     <div class="col"><div>12/28</div><div>[1M]</div><div>1/27</div></div>
 *     <div class="col"><div>1/28</div><div>[1M]</div><div>2/27</div></div>
 *     <div class="col"><div>2/28</div><div>[1D]</div><div>2/28</div></div>
 *   </div>
 * </div>
 * 
 * ```
 * diffM = Sym - Eym
 * diffD = 1
 * ```
 * 
 * ### 開始(S)＞終了(E) and 開始日(Sd)＞終了日(Ed)
 * 
 * Sd=Ed例：「2023/02/28(Sd=28) -> 2022/12/21(Ed=21) -> 」 ⇒ `{sign:false,M:2,d:1}`
 * 
 * **2/28から逆算する場合** ⇒ `{sign:false,M:2,d:8}`
 * 
 * <div class="axis" style="grid-template-columns:2rem 1fr">
 *   <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
 *   <div class="cols" style="grid-template-columns:1fr 2fr 2fr">
 *     <div class="col"><div>12/21</div><div>[8D]</div><div>12/28</div></div>
 *     <div class="col"><div>12/29</div><div>[1M]</div><div>1/28</div></div>
 *     <div class="col"><div>1/29</div><div>[1M]</div><div>2/28</div></div>
 *   </div>
 * </div>
 * 
 * **12/28から算出する場合** ⇒ `{sign:false,M:2,d:8}`
 * 
 * <div class="axis" style="grid-template-columns:2rem 1fr">
 *   <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
 *   <div class="cols" style="grid-template-columns:2fr 2fr 1fr">
 *     <div class="col"><div>12/21</div><div>[1M]</div><div>1/20</div></div>
 *     <div class="col"><div>1/21</div><div>[1M]</div><div>2/20</div></div>
 *     <div class="col"><div>2/21</div><div>[8D]</div><div>2/28</div></div>
 *   </div>
 * </div>
 * 
 * ```
 * diffM = Sym - Eym
 * diffD = 1
 * ```
 * 
 * Sd>Ed例：「2023/04/30(Sd=30) -> 2023/02/28(Ed=28) -> 」 ⇒ `{sign:false,M:2,d:1}`
 * 
 * **4/30から逆算する場合** ⇒ `{sign:true,M:2,d:8}`
 * 
 * <div class="axis" style="grid-template-columns:2rem 1fr">
 *   <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
 *   <div class="cols" style="grid-template-columns:1fr 2fr 2fr">
 *     <div class="col"><div>12/21</div><div>[8D]</div><div>12/28</div></div>
 *     <div class="col"><div>2/31</div><div>[1M]</div><div>3/30</div></div>
 *     <div class="col"><div>3/31</div><div>[1M]</div><div>4/30</div></div>
 *   </div>
 * </div>
 * 
 * **いまここ：2/28から算出する場合** ⇒ `{sign:false,M:2,d:8}`
 * 
 * <div class="axis" style="grid-template-columns:2rem 1fr">
 *   <div class="arrow" style="border-right: 2rem solid #aaa;"></div>
 *   <div class="cols" style="grid-template-columns:2fr 2fr 1fr">
 *     <div class="col"><div>2/28</div><div>[1M]</div><div>3/27</div></div>
 *     <div class="col"><div>3/28</div><div>[1M]</div><div>4/27</div></div>
 *     <div class="col"><div>4/28</div><div>[3D]</div><div>4/30</div></div>
 *   </div>
 * </div>
 * 
 * 開始月の日数>終了月の日数 となるパターンはある？
 * 
 * ```
 * diffM = Sym - Eym
 * diffD = 1
 * ```
 * 
 * # 引数が非日付型
 * 
 * Dateオブジェクトに指定期間を加減算したDateオブジェクトを返す
 * 
 * # 注意事項
 * 
 * 1. 時刻が指定されていない場合、開始日・終了日とも終日範囲内と見做す
 *     ex. 「2023/01/01 -> 2023/12/31」 ⇒ 2023/01/01 00:00:00 ≦ n ＜ 2023/12/31 24:00:00
 *     - 「時刻が指定されていない」とは、開始日・終了日とも時刻が00:00:00であることを示す
 *     - 時刻指定があれば、それに従って計算する(終日範囲内とは見做さない)
 * 
 * 1. 「1ヶ月＋1日」後と「1ヶ月後」の「1日後」とは結果が異なる場合がある
 * 
 * # Date.serial: 内部用シリアル月・シリアル日の計算
 * 
 * ```
 * typedef {object} DateSerial
 * prop {number} month - シリアル月の値
 * prop {number} date - シリアル日の値
 * prop {number} fam - シリアル月朔日0:00以降の経過ミリ秒数(fraction after month)
 * prop {number} fad - シリアル日0:00以降の経過ミリ秒数(fraction after date)
 * 
 * desc 2つの日付の間隔を算出するための一連番号を計算する。シリアル月は`(Date.getFullYear()-1970)×12ヶ月＋Date.getMonth()`、シリアル日は`Math.floor(Date.getTime()÷(24×60×60×1000))`で計算する。
 * 
 * なお内部用を念頭に開発し、かつ互換性確保のロジックが煩雑なため、Excelで使用されるシリアル日との互換性はない。
 * 
 * param {any} [arg=this] - 計算対象となる日付情報(ex."2023/07/02")。Date型に変換できないならエラー。指定無しなら本体
 * returns {DateSerial} シリアル化された日付情報
 * ```
 * 
 * # Date.numberOfDays: 指定月の日数を取得
 * 
 * ```
 * param {any} [arg=this] - 計算対象となる日付情報(ex."2023/07/02")。Date型に変換できないならエラー。指定無しなら本体
 * returns {number} 指定月の日数(1〜31)
 * ```
 * 
 * <style type="text/css">
 *   .axis, .cols, .col {display:grid;}
 *   .axis {
 *     width:80%;
 *     margin: 0.5rem 2rem;
 *   }
 *   .cols {
 *     padding: 0.5rem;
 *     background-color:#aaa;
 *   }
 *   .col {
 *     padding: 0.1rem;
 *     border: solid 1px #000;
 *     background-color:#fff;
 *     grid-template-columns:repeat(3, 1fr);
 *   }
 *   .col div:nth-child(1) {text-align:left;}
 *   .col div:nth-child(2) {text-align:center;}
 *   .col div:nth-child(3) {text-align:right;}
 *   .arrow {
 *     width:0; height:0;
 *     border-top: 1.4rem solid transparent;
 *     border-bottom: 1.4rem solid transparent;
 *   }
 * </style>
 * 
 * </details>
 * 
 */

function Date_calc(arg){
  console.log('===== Date.calc start.');
  const v = {rv:null,
    diff:{y:0,M:0,d:0,h:0,m:0,s:0,n:0},
    seq:['y','M','d','h','m','s','n']
  };
  try {

    // 加減する値を計算
    switch( whichType(arg) ){
      case 'String':
        v.m = arg.match(/^([+-]?[0-9]+)([yMdhmsn])$/);
        if( !v.m ) throw new Error('加減する値の指定が不適切です');
        v.diff[v.m[2]] = Number(v.m[1]);
        break;
      case 'Array' :
        for( v.i=0 ; v.i<arg.length ; v.i++ ){
          v.diff[v.seq[v.i]] = arg[v.i];
        }
        break;
      case 'Object' :
        for( v.x in arg ){
          v.diff[v.x] = arg[v.x];
        }
        break;
      default:
        throw new Error('Date.calc()の引数の型が不適切です');
    }
    //console.log(v);

    v.rv = new Date(
      this.getFullYear() + v.diff.y,
      this.getMonth() + v.diff.M,
      this.getDate() + v.diff.d,
      this.getHours() + v.diff.h,
      this.getMinutes() + v.diff.m,
      this.getSeconds() + v.diff.s,
      this.getMilliseconds() + v.diff.n
    );

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('===== Date.calc end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}


/** 日時を指定形式の文字列にして返す"toLocale()"メソッドをDate型に追加する。
 * @param {string} [format='yyyy/MM/dd'] - 日時を指定する文字列。年:y,月:M,日:d,時:h,分:m,秒:s,ミリ秒:n
 * @returns {string} 指定形式に変換された文字列。無効な日付なら長さ0の文字列
 * 
 * @example
 * ```
 * "1965/9/5"[yy/MM/dd hh:mm:ss.nnn] ⇒ "65/09/05 00:00:00.000"
 * "1965/9/5"[yyyy-MM-dd] ⇒ "1965-09-05"
 * "1965/9/5"[hh:mm] ⇒ "00:00"
 * "1977-03-04"[yy/MM/dd hh:mm:ss.nnn] ⇒ "77/03/04 09:00:00.000"
 * "1977-03-04"[yyyy-MM-dd] ⇒ "1977-03-04"
 * "1977-03-04"[hh:mm] ⇒ "09:00"
 * 1688189258262[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:27:38.262"
 * 1688189258262[yyyy-MM-dd] ⇒ "2023-07-01"
 * 1688189258262[hh:mm] ⇒ "14:27"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yy/MM/dd hh:mm:ss.nnn] ⇒ "23/07/01 14:16:30.000"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[yyyy-MM-dd] ⇒ "2023-07-01"
 * "Sat Jul 01 2023 14:16:30 GMT+0900"[hh:mm] ⇒ "14:16"
 * "12:34"[yy/MM/dd hh:mm:ss.nnn] ⇒ ""
 * "12:34"[yyyy-MM-dd] ⇒ ""
 * "12:34"[hh:mm] ⇒ ""
 * ```
 */

function Date_toLocale(format='yyyy/MM/dd'){
  console.log('===== Date.toLocale start.');
  const v = {rv:format};
  try {

    // 無効な日付なら空文字列を返して終了
    if( isNaN(this.getTime()) ) return '';

    v.l = { // 地方時ベース
      y: this.getFullYear(),
      M: this.getMonth()+1,
      d: this.getDate(),
      h: this.getHours(),
      m: this.getMinutes(),
      s: this.getSeconds(),
      n: this.getMilliseconds()
    };

    //v.rv = typeof format === 'undefined' ? 'yyyy/MM/dd' : format;
    for( v.x in v.l ){
      v.m = v.rv.match(new RegExp(v.x+'+'));
      if( v.m ){
        v.str = v.m[0].length > 1
          ? ('000'+v.l[v.x]).slice(-v.m[0].length)
          : String(v.l[v.x]);
        v.rv = v.rv.replace(v.m[0],v.str);
      }
    }

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('===== Date.toLocale end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack); 
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}
Date.prototype.toLocale = Date_toLocale;

/* コアスクリプト */
/**
 * @desc テンプレート(HTML)のタグに含まれる'data-embed'属性に基づき、他文書から該当箇所を挿入する。
 * 
 * JavaScriptのライブラリ等、テンプレートが非HTMLの場合は処理できない。<br>
 * この場合、テンプレートを強引にHTML化して処理後、querySelector.jsで必要な部分を抽出するか、grep等で不要な部分を削除する。
 * 
 * - [JSDOMを利用し、HTML + JavaScriptのプログラムをNode.jsで動作させる](https://symfoware.blog.fc2.com/blog-entry-2685.html)
 * 
 * @param {Document} doc - 編集対象となるDocumentオブジェクト
 * @returns {Document} 挿入済みのDocumentオブジェクト
 * 
 * @example テンプレートのdata-embed書式
 * 
 * 1. JSON.parseするので、メンバ名もダブルクォーテーションで囲む
 * 1. 属性値全体はシングルクォーテーションで囲む
 * 
 * ```
 * data-embed="{
 *   from: {
 *     filename: {string} - 参照先のファイル名
 *     selector: {string} - CSSセレクタ文字列。省略時はファイル全文と解釈
 *   },
 *   to: {string} [innerHTML|innerText|xxx|child],
 *     innerHTML : data-embedが記載された要素のinnerHTMLとする
 *     innerText : data-embedが記載された要素のinnerTextとする
 *     xxx : 属性名xxxの値とする
 *     replace : data-embedを持つ要素を置換する
 *   type: {string} [html,pu,md,mmd,text]
 *     html : テンプレート(HTML)同様、HTMLとして出力(既定値)
 *     pu : PlantUMLとして子要素を生成して追加
 *     md : MarkDownとして子要素を生成して追加
 *     mmd : Mermaidとして子要素を生成して追加
 *     text : bodyの中のみを、テキストとして出力
 * }"
 * 
 * 例：
 * <div data-embed='{"from":{"filename":"../../component/analyzeArg.html","selector":"script.core"},"to":"replace"}'></div>
 * ```
 * 
 */

const fs = require('fs'); // ファイル操作
const { JSDOM } = require("jsdom");
function embedComponent(doc){
  const v = {
    /**
     * 内部関数extract: 指定ファイルの指定箇所から文字列を抽出
     * @param {string} filename 
     * @param {string} selector 
     * @returns {string}
     */
    extract: (filename,selector) => {
      v.refText = fs.readFileSync(filename,'utf-8').trim();
      // HTMLでなければbodyタグを付加
      v.isHTML = v.refText.toLowerCase()
      .match(/^<!doctype html.*?>|^<html.*?>[\s\S]+<\/html>/);
      if( !v.isHTML ){
        v.refText = '<!DOCTYPE html><html xml:lang="ja" lang="ja"><body>'
          + v.refText + '</body></html>';
      }
      v.refDoc = new JSDOM(v.refText).window.document;
      v.extracted = '';
      // 複数ある場合があるので、querySelectorAllで順次追加
      v.refDoc.querySelectorAll(selector).forEach(element => {
        v.extracted += element.innerHTML;
      });
      return v.extracted;
    },
  };

  console.log('embedComponent start.');

  // data-embed属性を持つ要素をリスト化、順次処理
  doc.querySelectorAll('[data-embed]').forEach(element => {
    v.embed = JSON.parse(element.getAttribute('data-embed'));
    v.content = v.extract(v.embed.from.filename,v.embed.from.selector);

    // 置換ルールに従って処理
    switch( v.embed.to ){
      case 'innerHTML':
        element.innerHTML = v.content; break;
      case 'innerText':
        element.innerText = v.content; break;
      case 'replace':
        element.replaceWith(doc.createTextNode(v.content));
        break;
      default:
        element.setAttribute(v.embed.to,v.content);
        break;
    }
    // テンプレートのembed属性は削除
    element.removeAttribute('data-embed');
  });

  console.log('embedComponent end.');
  return doc;
}


/**
 * @desc オブジェクトのプロパティを再帰的にマージ
 * - Qiita [JavaScriptでオブジェクトをマージ（結合）する方法、JSONのマージをする方法](https://qiita.com/riversun/items/60307d58f9b2f461082a)
 * 
 * @param {Object} target - 結合対象のオブジェクト1
 * @param {Object} source - 結合対象のオブジェクト2。同名のプロパティはこちらで上書き
 * @param {Object} opts - オプション
 * @param {boolean} [opts.concatArray=false] - プロパティの値が配列だった場合、結合するならtrue
 * @returns {Object} 結合されたオブジェクト
 */

function mergeDeeply(target, source, opts) {
  const isObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj);
  const isConcatArray = opts && opts.concatArray;
  let result = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    for (const [sourceKey, sourceValue] of Object.entries(source)) {
      const targetValue = target[sourceKey];
      if (isConcatArray && Array.isArray(sourceValue) && Array.isArray(targetValue)) {
        result[sourceKey] = targetValue.concat(...sourceValue);
      }
      else if (isObject(sourceValue) && target.hasOwnProperty(sourceKey)) {
        result[sourceKey] = mergeDeeply(targetValue, sourceValue, opts);
      }
      else {
        Object.assign(result, {[sourceKey]: sourceValue});
      }
    }
  }
  return result;
}



/**
 * @typedef {object} QuerySelector
 * @prop {string} tag - タグ名
 * @prop {Object.<string, string>} attr=Null - 属性名：属性値となるオブジェクト
 * @prop {string} inner='' - 子要素タグも含む、タグ内のテキスト
 */

/**
 * @desc HTMLの指定CSSセレクタの内容を抽出
 * @param {string} content - エレメント(HTML)の全ソース
 * @param {string|string[]} selectors - 抽出対象となるCSSセレクタ
 * @returns {QuerySelector[]} 抽出された指定CSSセレクタ内のテキスト
 */

function querySelector(content,selectors){
  console.log('===== querySelector start.');
  const v = {rv:[],
    selectors: [],
    extract: (document,selector) => {
      console.log('----- extract start.');
      v.elements = document.querySelectorAll(selector);
      v.elements.forEach(element => {
        const o = {
          tag: element.tagName.toLowerCase(),
          attr: null,
          inner: '',
        };
        if( element.hasAttributes() ){
          o.attr = {};
          v.attr = element.attributes;
          for( v.i=0 ; v.i<v.attr.length ; v.i++ ){
            o.attr[v.attr[v.i].name] = v.attr[v.i].value;
          }
        }
        v.inner = String(element.innerHTML).trim();
        if( v.inner.length > 0 )  o.inner = v.inner;
        v.rv.push(o);
      });
      console.log('----- extract end.');
    }
  };
  try {

    // 指定CSSセレクタが単一なら配列化
    v.selectors = typeof selectors === 'string' ? [selectors] : selectors;

    if( typeof window === 'undefined' ){
      const { JSDOM } = require("jsdom");
      const { document } = new JSDOM(content).window;
      v.selectors.forEach(x => v.extract(document,x));
    } else {
      v.source = document.createElement('div');
      v.source.innerHTML = content;
      v.selectors.forEach(x => {
        v.extract(v.source,x);
      });
    }

    //console.log('v.rv='+JSON.stringify(v.rv));
    console.log('===== querySelector end.');
    return v.rv;
  } catch(e){
    // ブラウザで実行する場合はアラート表示
    if( typeof window !== 'undefined' ) alert(e.stack);
    console.error(e.stack);
    //throw e; //以降の処理を全て停止
    v.rv.stack = e.stack; return v.rv; // 処理継続
  }
}

/* コアスクリプト */
/**
 * @classdesc タブ切り替えのHTMLページを作成する
 */

class TabMenu {

  /**
   * @constructor
   * @param {string} [opt={}] - オプション
   * @returns {void}
   */
  constructor(opt={}){
    console.log('TabMenu.constructor start.');
    const v = {};
    this.option = mergeDeeply({
      name: null, // 対象となるページ全体のname属性。nullなら単一で特定不要と解釈
      initial: null,  // 初期表示ページの名前
      direction: 'x', // タブを並べる方向。x:横並び, y:縦並び
      style: {
        tabs: {
          selector: ".TabMenu .tabs",
          css: {
            width: "100%",
            height: "100%",
            margin: "0px",
            padding: "0px",
            boxSizing: "border-box",
            display: "grid",
          },
        },
        tab: {
          selector: ".TabMenu .tabs div",
          css: {
            paddingLeft: "1rem",
            borderBottom: "solid 4px #ccc",
          },
        },
        act: {
          //selector: ".TabMenu .tabs div.act",
          css: {
            paddingLeft: "1rem",
            borderBottom: "solid 4px #000",
          },
        }
      },
    },opt);
    //console.log(this.option);

    // 全体の親要素をthis.wrapper、タブ表示領域をthis.tabsに保存
    this.wrapperSelector = '.TabMenu'
      +( this.option.name === null ? '' : '[name="' + this.option.name + '"]');
    this.wrapper = document.querySelector(this.wrapperSelector);
    this.tabs = document.querySelector(this.wrapperSelector+' > .tabs');
    //console.log(this.wrapper);

    // スタイルの適用
    for( v.x of ['tabs','tab'] ){ // actは不要
      document.querySelectorAll(this.option.style[v.x].selector).forEach(element => {
        for( v.y in this.option.style[v.x].css ){
          element.style[v.y] = this.option.style[v.x].css[v.y];
        }
      });
    }

    // ページ名のリストを作成
    this.pageList = [];
    this.tabs.querySelectorAll('[name]')
    .forEach(x => this.pageList.push(x.getAttribute('name')));
    //console.log(this.pageList);

    // 各タブ・ページの要素をthis.tab/pageに保存
    this.tab = {};
    this.page = {};
    this.tabNum = 0;
    this.pageList.forEach(x => {
      this.tab[x] = this.wrapper.querySelector('.tabs [name="'+x+'"]');
      // ページは「TabMenuクラス直下のDIV」に限定
      this.page[x] = this.wrapper.querySelector('.TabMenu > div[name="'+x+'"]');
      //console.log(x,this.tab[x],this.page[x]);
      this.tab[x].addEventListener('click',()=>this.changePage(x));
      this.tabNum++;
    });
    // タブの数をタブ領域に設定
    this.tabs.style.gridTemplateColumns = 'repeat('+this.tabNum+',1fr)';

    this.changePage(this.option.initial); // 初期ページ
    console.log('TabMenu.constructor end.');
  }

  changePage(page=null){
    console.log('TabMenu.changePage start.');
    this.activePage = page === null ? this.pageList[0] : page;
    console.log(this.activePage,this.pageList,this.tab)
    this.pageList.forEach(x => {
      if( x === this.activePage ){
        for( let y in this.option.style.act.css ){
          this.tab[x].style[y] = this.option.style.act.css[y];
        }
        this.page[x].style.display = '';
      } else {
        for( let y in this.option.style.tab.css ){
          this.tab[x].style[y] = this.option.style.tab.css[y];
        }
        this.page[x].style.display = 'none';
      }
    })
    console.log('TabMenu.changePage end.');
  }
}

/* コアスクリプト */
/**
 * @typedef {Object} opt
 * @prop {string} datatype - データのタイプ。sheet:シートデータ
 */

/**
 * @classdesc HTMLにタイムテーブルを描画する
 */

class TimeTable {
  
  /**
   * @constructor
   * @param {string} selector - タイムテーブルを描画する要素のCSSセレクタ
   * @param {Object} data - タイムテーブル用のデータ
   * @param {Object} opt - オプションを指定するオブジェクト
   * @returns {void}
   * 
   * @desc 既定値の設定、タスクデータ他のデータ加工を行い、タイムテーブルを描画する
   * 
   * <details><summary>入力シートイメージ</summary>
   * 
   * - start/endが赤字：マイルストーン(非導出項目、要手動設定)
   * - 背景色群青：セクション・タスク共通の必須項目
   * - 薄青：同任意項目
   * - 濃緑：タスクのみの必須項目
   * - 薄緑：同任意項目
   * - 赤：算式が設定された項目
   * 
   * <h3>timetable</h3>
   * <table calss="tt"><tr>
   * <th style="background:#ff0000;color:white">id</th>
   * <th style="background:#0000ff;color:white;">pId</th>
   * <th style="background:#0000ff;color:white;">name</th>
   * <th style="background:#cfe2f3;">summary</th>
   * <th style="background:#cfe2f3;">pending</th>
   * <th style="background:#cfe2f3;">note</th>
   * <th style="background:#38761d;color:white;">start</th>
   * <th style="background:#d9ead3;">lasts</th>
   * <th style="background:#38761d;color:white;">end</th>
   * <th style="background:#d9ead3;">location</th>
   * <th style="background:#d9ead3;">ideal</th>
   * <th style="background:#d9ead3;">fixed</th>
   * <th style="background:#d9ead3;">output</th>
   * <th style="background:#d9ead3;">style</th>
   * </tr><tr>
   * <td>2</td><td>0</td><td>イベント(大線表)</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
   * </tr><tr>
   * <td>3</td><td>2</td><td>受付</td><td></td><td></td><td></td><td style="color:#f00;">9/30 13:30</td><td>30</td><td>9/30 14:00</td><td>正門</td><td></td><td></td><td></td><td></td>
   * </tr><tr>
   * <td>4</td><td>2</td><td>テント設営</td><td></td><td></td><td>子供達は体育館で遊ぶ</td><td>9/30 14:00</td><td></td><td>9/30 17:00</td><td>校庭</td><td></td><td></td><td></td><td></td>
   * </tr><tr>
   * <td>5</td><td>2</td><td>夕食</td><td></td><td></td><td></td><td style="color:#f00;">9/30 17:00</td><td>90</td><td>9/30 18:30</td><td>テントor喫食コーナ</td><td></td><td></td><td></td><td></td>
   * </tr><tr>
   * <td>6</td><td>2</td><td>肝試し</td><td></td><td></td><td></td><td>9/30 18:30</td><td>120</td><td>9/30 20:30</td><td>校内</td><td></td><td></td><td></td><td></td>
   * </tr><tr>
   * <td>7</td><td>2</td><td>宿泊</td><td></td><td></td><td></td><td>9/30 20:30</td><td></td><td style="color:#f00;">10/01 07:30</td><td>テントor体育館</td><td></td><td></td><td></td><td></td>
   * </tr><tr>
   * <td>8</td><td>2</td><td>朝食</td><td>素麺提供</td><td></td><td></td><td>10/01 07:30</td><td>30</td><td>10/01 08:00</td><td>テントor体育館</td><td></td><td></td><td></td><td></td>
   * </tr><tr>
   * <td>9</td><td>2</td><td>テント撤去</td><td></td><td></td><td></td><td>10/01 08:00</td><td>60</td><td>10/01 09:00</td><td>校庭</td><td></td><td></td><td></td><td></td>
   * </tr></table>
   * 
   * <h3>resources</h3>
   * <table><tr>
   * <th style="background:#0000ff;color:white;">tId</th>
   * <th style="background:#ff0000;color:white;">tName</th>
   * <th style="background:#ff0000;color:white;">id</th>
   * <th style="background:#0000ff;color:white;">name</th>
   * <th style="background:#cfe2f3;">quantity</th>
   * <th style="background:#cfe2f3;">unit</th>
   * <th style="background:#cfe2f3;">procure</th>
   * <th style="background:#cfe2f3;">budget</th>
   * <th style="background:#cfe2f3;">note</th>
   * </tr>
   * <tr><td>17</td><td>参加者受付</td><td>2</td><td>参加者名簿</td><td>3</td><td>冊</td><td>嶋津作成</td><td>0</td><td></td></tr>
   * <tr><td>17</td><td>参加者受付</td><td>3</td><td>文鎮</td><td>3</td><td>個</td><td></td><td></td><td></td></tr>
   * <tr><td>17</td><td>参加者受付</td><td>4</td><td>貯金箱</td><td>1</td><td>個</td><td></td><td></td><td></td></tr>
   * <tr><td>17</td><td>参加者受付</td><td>5</td><td>トレイ</td><td>3</td><td>個</td><td></td><td></td><td></td></tr>
   * <tr><td>17</td><td>参加者受付</td><td>6</td><td>ガムテープ</td><td>2</td><td>個</td><td></td><td></td><td>テントの有無で色を変える</td></tr>
   * <tr><td>17</td><td>参加者受付</td><td>7</td><td>おやじの会入会申込書</td><td>20</td><td>枚</td><td></td><td></td><td></td></tr>
   * </table>
   * </details>
   * 
   */

  constructor(selector,data,opt){
    this.rootElement = document.querySelector(selector);
    // オプションの既定値設定
    this.opt = mergeDeeply({
      datatype: null, // dataが加工済ならnull
      unit: 5,
      design: {
        default: {
          color: "#000",
          backgroundColor: "rgba(196,196,196,0.6)",
          border: "solid 1px #aaa",
        },
        critical: {
          color: "#fff",
          backgroundColor: "rgba(255,96,96,0.6)",
          border: "solid 1px #f00",
        },
      },
      detailDateFormat: 'M/dd hh:mm', // 詳細画面に表示する日時の形式
      dataSheet: null,  // 元データを格納したGoogle SpreadのURL
    },opt);
    console.log(this.opt);

    // シート形式のデータだった場合、加工してthis.tasksにセット
    this.tasks = this.opt.datatype === null ? data : this.#process(data);
    console.log(this.tasks);

    // map(id->タスク)の作成
    this.map = {};
    this.#makeMap(this.tasks);

    // タイムテーブルを描画
    this.draw();
  }

  /** div.tasks領域にタスク(単体)を追加する
   * (本関数はdrawから呼ばれるプライベート関数)
   */
  #appendTask(task,pId=''){ // ガントチャートの作成
    const v = {
      tasksElement: this.rootElement.querySelector('.main .tasks'),
    };
    /*
    // taskのIDを採番、マップに追加
    task.id = pId + (seq+1) + '.';
    this.data.map[task.id] = task;
    */

    if( 'children' in task ){
      // childrenが存在⇒セクション(ラベル)行
      v.labelElement = this.createElement({class:'label'});
      //v.labelSpan = this.createElement({tag:'span',text:task.name});
      //v.labelSpan.onclick = () => this.showDetail(task.id);
      v.labelSpan = this.createElement('span');
      v.labelSpan.innerText = '▼'+task.name;
      v.labelSpan.onclick = () => this.toggleChildren(task.id,v.labelSpan);
      v.labelElement.appendChild(v.labelSpan);
      v.tasksElement.appendChild(v.labelElement);
      for( let i=0 ; i<task.children.length ; i++ ){
        this.#appendTask(task.children[i],task.id);
      }
    } else {
      // childrenが不存在⇒タスク行
      v.barElement = this.createElement({class:'bar pId'+pId});
      v.barElement.style.gridTemplateColumns
        = 'repeat('+(this.numHour*12)+', 1fr)';
      // barSpan: 棒状の部分
      v.barSpan = this.createElement(
        {tag:'span',name:task.id,text:task.name});
      v.barStart = ((new Date(task.start).getTime())
        - this.startHour) / (this.opt.unit*60000) + 1;
      v.barEnd = ((new Date(task.end).getTime())
        - this.startHour) / (this.opt.unit*60000) + 1;
      this.applyStyle({
        element: v.barSpan,
        apply: task.style,
        addition: {gridColumn:v.barStart + '/' + v.barEnd},
      });
      v.barSpan.onclick = () => this.showDetail(task.id);
      v.barElement.appendChild(v.barSpan);
      v.tasksElement.appendChild(v.barElement);
    }
  }

  /** 要素にスタイルを設定する
   * @param {Object} arg
   * @param {string} arg.apply - 適用するスタイル名
   * @param {Object.<string, string>} arg.addition - 追加適用する属性名：属性値
   * @returns {void}
   */
  applyStyle(arg){
    // apply,additionの既定値設定
    if( arg.apply.length === 0 ) arg.apply = 'default';
    const v = Object.assign({apply:'default',addition:{}},arg);
    // 適用するスタイルのオブジェクトを作成
    v.style = Object.assign(this.opt.design[v.apply],v.addition);
    for( let a in v.style ){
      arg.element.style[a] = v.style[a];
    }
  }

  /** DIV要素を生成、属性を指定する
   * @param {string} tag='div' - タグ名
   * @param {string} [text] - 生成された要素のinnerHTML
   * @param {Object.<string, string>} xxx - 生成された要素に設定するスタイルシート属性名：属性値
   */
  createElement(arg='div'){
    const v = {tag:'div',opt:arg};
    if( typeof arg === 'string' ){
      v.tag = arg;
      v.opt = {};
    } else {
      if( 'tag' in arg ){
        v.tag = arg.tag;
      } 
    }
    let rv = document.createElement(v.tag);
    for( let x in v.opt ){
      switch(x) {
        case 'tag': break;
        case 'text': rv.innerHTML = arg.text; break;
        default: rv.setAttribute(x,arg[x]);
      }
    }
    return rv;
  }

  /** タイムテーブルを(再)描画する */
  draw(){
    console.log("draw start.");

    const v = {};
    this.minTime = Infinity; // task.startの最小値。UNIX時刻
    this.maxTime = -Infinity;
    this.startHour = Infinity; // minTime以下の正時となるUNIX時刻。表示領域の左端
    this.endHour = -Infinity;  // maxTime以上の正時となるUNIX時刻。表示領域の右端
    this.numHour = 0;          // startHour〜endHourまでの時間数    console.log(this.data);

    // 描画範囲を計算
    this.timeRange(this.tasks);  // minTime, v.maxTimeの取得
    this.startHour = Math.floor(this.minTime / 3600000) * 3600000;
    this.endHour = Math.ceil(this.maxTime / 3600000) * 3600000;

    // 1.controllerの要素を作成

    // 2.mainの要素を作成

    // 2.1.main.headerの要素を作成
    v.headerElement = this.rootElement.querySelector('.main .header');
    v.headerElement.innerHTML = '';
    for( v.i=this.startHour ; v.i<=this.endHour ; v.i+=3600000 ){
      v.o = this.createElement();
      v.o.innerText = new Date(v.i).getHours() + ':00';
      v.headerElement.appendChild(v.o);
      this.numHour++;
    }
    v.headerElement.style.gridTemplateColumns = 'repeat('+this.numHour+', 1fr)';

    // 2.2.main.timelineの要素を作成
    v.timelineElement = this.rootElement.querySelector('.main .timeline');
    v.timelineElement.innerHTML = '';
    v.timelineElement.innerHTML = '<div></div>'.repeat(this.numHour*4);
    v.timelineElement.style.gridTemplateColumns = 'repeat('+(this.numHour*4)+', 1fr)';

    // 2.2.main.tasksの要素を作成
    v.tasksElement = this.rootElement.querySelector('.main .tasks');
    v.tasksElement.innerHTML = '';
    for( let i=0 ; i<this.tasks.length ; i++ ){
      this.#appendTask(this.tasks[i],'');
    }

    // 3.detailの要素を作成


    console.log("draw end.");
  }

  /** タスクID->タスク取得用のthis.mapを作成 */
  #makeMap(tasks){
    console.log('makeMap start.');
    const v = {};
    for( v.i=0 ; v.i<tasks.length ; v.i++ ){
      this.map[tasks[v.i].id] = tasks[v.i];
      if( 'children' in tasks[v.i] ){
        this.#makeMap(tasks[v.i].children );
      }
    }
    console.log('makeMap end.');
  }

  #process(raw){
    const v = {sheet:[{children:[]}],idmap:{0:0}};
    console.log('process start.');

    this.tasks = [];
    // 01.configシート
    this.opt.sheetDef = {};
    v.header = raw.config[0]; // ヘッダ行
    for( v.i=1 ; v.i<raw.config.length ; v.i++ ){
      v.l = raw.config[v.i];
      if( String(v.l[0]).length > 0 ){ // 空白行スキップ
        v.o = {};
        for( v.j=1 ; v.j<v.l.length ; v.j++ ){
          v.o[v.header[v.j]] = v.l[v.j];
        }
        if( !(v.l[0] in this.opt.sheetDef) ){
          // シートのオブジェクトが未定義なら追加
          this.opt.sheetDef[v.l[0]] = {};
        }
        this.opt.sheetDef[v.l[0]][v.l[1]] = v.o;
      }
    }
    console.log(this.opt.sheetDef);

    // 02.timetableシート
    v.header = raw.timetable[0]; // ヘッダ行
    v.idmapIndex = 0; // v.idmapの添字
    console.log(v.header)
    // 02.1. v.sheetにリニアに追加する
    for( v.i=1 ; v.i<raw.timetable.length ; v.i++ ){
      v.l = raw.timetable[v.i];
      // 有効な行データをオブジェクト化する
      if( Number(v.l[0]) > 0 ){ // 空白行スキップ
        v.o = {resources:[]}; // 必要資機材のみtimetableシート上にないので足しておく
        for( v.j=0 ; v.j<v.l.length ; v.j++ ){
          v.colType = this.opt.sheetDef.timetable[v.header[v.j]].type.toLowerCase();
          switch( v.colType ){
            case 'Date':
              v.o[v.header[v.j]] = new Date(v.l[v.j]).getTime();
              break;
            default:
              v.o[v.header[v.j]] = v.l[v.j];
          }
        }
        // 戻り値用のデータをセット
        v.idmapIndex++;
        v.idmap[v.o.id] = v.idmapIndex;
        v.sheet.push(v.o);
      }
    }
    console.log(v.sheet);
    console.log(v.idmap);

    // 02.2.親子関係を設定
    for( v.i=1 ; v.i<v.sheet.length ; v.i++ ){ // 0はrootなので飛ばす
      //console.log('v.sheet[v.i]=',v.sheet[v.i])
      //console.log('v.sheet[v.i].pId='+v.sheet[v.i].pId);
      //console.log('v.idmap[v.sheet[v.i].pId]='+v.idmap[v.sheet[v.i].pId]);
      //console.log('v.sheet['+v.idmap[v.sheet[v.i].pId]+']=',v.sheet[v.idmap[v.sheet[v.i].pId]]);
      v.parent = v.sheet[v.idmap[v.sheet[v.i].pId]];
      if( !('children' in v.parent) ) v.parent.children = [];
      v.parent.children.push(v.sheet[v.i]);
      console.log('v.sheet['+v.i+']=',v.sheet[v.i],'\nv.parent=',v.parent);
    }
    console.log(v.sheet);

    // [03] resourcesシート
    v.header = raw.resources[0];  // ヘッダ行
    for( v.i=1 ; v.i<raw.resources.length ; v.i++ ){
      v.o = {};
      for( v.j=0 ; v.j<v.header.length ; v.j++ ){
        v.o[v.header[v.j]] = raw.resources[v.i][v.j];
      }
      console.log('v.o=',v.o);
      console.log('v.idmap[v.o.tId]=',v.idmap[v.o.tId]);
      console.log('v.sheet[v.idmap[v.o.tId]]=',v.sheet[v.idmap[v.o.tId]]);
      v.parent = v.sheet[v.idmap[v.o.tId]];
      if( !('resources' in v.parent) ) v.parent.resources = [];
      v.parent.resources.push(v.o);
    }

    console.log('process end.');
    return v.sheet[0].children;
  }

  /** ダイアログに詳細情報を表示
   * @prop {string} id - 表示するタスクのID
   */
  showDetail(id){
    console.log('showDetail start. id='+id);
    const v = {
      task:this.map[id],  // 表示するタスクのオブジェクト
      detail: this.rootElement.querySelector('.detail'),  // 詳細領域の要素
      /** 非表示項目を排除しながら表示順に項目をソート
       * - [オブジェクトをdateでソートする例](https://keizokuma.com/js-array-object-sort/)
       * @param {Object} columnDef - 欄名:{column,label,type,memo,must,display,note}をメンバとするオブジェクト
       */
      listColumns: (columnDef) => { // 
        const list = [];
        Object.keys(columnDef).forEach(x => {
          if( columnDef[x].display > 0 ) list.push(columnDef[x]);
        });
        list.sort((a,b) => a.display < b.display ? -1 : 1);
        return list;
      },
    };

    // 前回の表示結果をクリア
    v.detail.querySelector('tbody').innerHTML = '';

    // 非表示項目を排除しながら表示順に項目をソート
    v.list = v.listColumns(this.opt.sheetDef.timetable);
    console.log(v.list);

    // 表示順にタスクの項目をtbodyに追加
    for( v.i=0 ; v.i<v.list.length ; v.i++ ){
      v.tr = this.createElement('tr');

      // 項目ラベル欄
      v.o = {tag:'td',text:v.list[v.i].label};
      v.tr.appendChild(this.createElement(v.o));
      // 値・備考欄
      v.value =  v.task[v.list[v.i].column] || '';
      if( v.list[v.i].type !== 'Resource'){
        // Resource(表内表)以外
        switch( v.list[v.i].type ){
          case 'Number':  // number : toLocaleして右寄せ
            v.o.class = 'right';
            v.o.text = v.value.toLocaleString();
            break;
          case 'Date':  // 表示形式を整形
            console.log(new Date(v.value));
            v.o.text = new Date(v.value).toLocale(this.opt.detailDateFormat);
            break;
          default:
            v.o.text = String(v.value);
        }
        v.tr.appendChild(this.createElement(v.o));
        // 備考欄
        v.o.text = v.task[v.list[v.i].memo] || '';
        v.tr.appendChild(this.createElement(v.o));
      } else {
        // Resource
        v.rList = v.listColumns(this.opt.sheetDef.resources);
        console.log(v.rList)
        v.rData = [v.rList.map(x => x.label)];
        for( v.r=0 ; v.r<v.task.resources.length ; v.r++ ){
          v.a = [];
          v.l = v.task.resources[v.r];
          console.log(v.l);
          for( v.c=0 ; v.c<v.rList.length ; v.c++ ){
            v.a.push(v.rList[v.c].type === 'Date'
            ? new Date(v.l[v.rList[v.c].column])
            : v.l[v.rList[v.c].column]);
          }
          v.rData.push(v.a);
        }
        console.log(v.rData);
        v.td = this.createElement({tag:'td',colspan:"2"});
        v.td.appendChild(v.rData.tabulize({dateFormat:this.opt.detailDateFormat}));
        v.tr.appendChild(v.td);
      }
      console.log(v.tr);

      v.detail.querySelector('tbody').appendChild(v.tr);
    }
    
    // 詳細画面の「閉じる」ボタン動作設定
    v.detail.querySelector('button[name="close"]').onclick
    = () => v.detail.style.display = 'none';
    // 「編集」ボタン動作設定
    if( this.opt.dataSheet !== null ){
      v.detail.querySelector('button[name="edit"]').onclick
      = () => window.open(this.opt.dataSheet,'_blank');
    }

    // 詳細画面表示
    v.detail.style.display = 'block';
    console.log('showDetail end.');

  }

  /** v.minTime, v.maxTimeの取得 */
  timeRange(tasks){
    const v = {};
    for( let task of tasks ){
      if( 'children' in task ){
        this.timeRange(task.children);
      } else {
        v.st = new Date(task.start).getTime();
        v.ed = new Date(task.end).getTime();
        if( this.minTime > v.st ) this.minTime = v.st;
        if( this.maxTime < v.ed ) this.maxTime = v.ed;
      }
    }
  }

  /** セクション名クリックで配下のタスクの表示/非表示切り替え */
  toggleChildren(id,label){
    this.rootElement.querySelectorAll('.pId'+id).forEach(x => 
      x.style.display = x.style.display === 'none' ? '' : 'none');
    // ラベルの前の三角を交換
    let m = label.innerText.match(/^([▶️|▼])(.+)$/);
    console.log(m)
    label.innerText = (( m[1] === '▼' ) ? '▶️' : '▼') + m[2];
  }

}


/**
 * @classdesc 指定セレクタ以下にcanvas他の必要な要素を作成し、QRコードや文書をスキャン
 */

class webScanner {
  /**
   * 指定セレクタ以下にcanvas他の必要な要素を作成してスキャン実行、指定の後続処理を呼び出す。
   * 
   * 参考：[jsQRであっさりQRコードリーダ/メーカ](https://zenn.dev/sdkfz181tiger/articles/096dfb74d485db)
   * 
   * @constructor
   * @param {object|HTMLElement} arg - HTMLElementなら親要素のみ指定と解釈
   * @param {object} arg.parent - 親要素(DOM object)
   * @param {number} arg.interval - 動画状態で撮像、読み込めなかった場合の間隔。ミリ秒
   * @param {object} arg.RegExp - QRコードスキャン時、内容が適切か判断
   * @param {number} arg.lifeTime - 一定時間操作がない場合の停止までのミリ秒。既定値60000
   * @param {boolean} arg.alert - 読み込み完了時に内容をalert表示するか
   * @returns {void} なし
   */
  constructor(arg={}){
    console.log('webScanner.constructor start. opt='+JSON.stringify(arg));

    // デバイスがサポートされているか確認
    if (!('mediaDevices' in navigator) || !('getUserMedia' in navigator.mediaDevices)) {
      const msg = 'デバイス(カメラ)がサポートされていません';
      console.error('webScanner.constructor: '+msg);
      alert(msg);
      return;
    }

    // メンバ(既定値)の設定
    if( whichType(arg) === 'HTMLElement' ){
      this.parent = arg;
      this.interval = 250;
      this.RegExp = /.+/;
      this.alert = false;
    } else {
      this.parent = arg.parent;
      this.interval = arg.interval || 250;
      this.RegExp = arg.RegExp || /.+/;
      this.alert = arg.alert || false;
    }
    this.lastGoing = 0;   // 前回カメラ起動した時刻(Date.now())
    this.lifeTime = arg.lifeTime || 60000;
    this.scanned = null;  // 動画を読み込んだ際の処理
    this.callback = null; // 適切な画像が選択された際、それを使用して行う後続処理

    // 親要素をwebScannerクラスとして指定
    this.parent.classList.add('webScanner');
    console.log('webScanner.constructor end.');
  }

  /** start: カメラを起動する(private関数)
   * @param {void} - なし
   * @returns {void} なし
   */
  start(){
    console.log('webScanner start start.');

    // 動画撮影用Webカメラを起動
    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
      },
      audio: false
    }).then((stream) => {
      this.video.srcObject = stream;
      this.video.setAttribute("playsinline", true);
      this.video.play();
      this.onGoing(true);  // カメラ動作中フラグを立てる
      this.drawFinder();  // キャンパスへの描画をスタート
    }).catch(e => {
      alert('カメラを使用できません\n'+e.message);
    });
  }

  /** stop: カメラを停止する(private関数)
   * @param {void} - なし
   * @returns {void} なし
   */
  stop(){
    console.log('webScanner.stop',this.video);
    this.video.srcObject.getVideoTracks().forEach((track) => {
      track.stop();
    });
    this.parent.innerHTML = ''; // 作業用DIVを除去
    this.lastGoing = 0;
  }

  /** onGoing: カメラの起動・停止の制御と状態参照
   * @param {boolean} - true:起動、false:停止、undefind:状態参照
   * @returns {boolean} true:起動中、false:停止中
   */
  onGoing(arg){
    console.log('webScanner.onGoing: typeof arg='+(typeof arg)+', arg='+arg);
    let rv = null;
    const now = Date.now();
    if( typeof arg === 'boolean' ){  // 引数あり ⇒ 状態制御
      this.lastGoing = arg ? now : 0;
      rv = arg;
    } else {    // 引数無し ⇒ 状態参照
      if( (now - this.lastGoing) < this.lifeTime ){
        // 指定時間(lifeTime)内ならtrue
        rv = true;
      } else {
        // 指定時間を超えていたらfalse
        rv = false;
        // 一定時間以上操作がなかった場合(システムで停止された場合を除く)
        if( this.lastGoing > 0 ){
          alert((this.lifeTime/1000)+'秒以上操作がなかったためカメラを停止しました');
          this.stop();
        }
      }
    }
    return rv;
  }

  /** scanDoc: 文書のスキャン
   * @param {function} callback - 後続処理
   * @param {object} opt - オプション指定
   * @param {number} opt.maxImageSize - 画像をbase64化した後の最大文字長。既定値500K
   * @returns {void} 無し
   * callbackにはbase64化したpng(文字列)が渡される。
  */
  scanDoc(callback,opt={maxImageSize:500000}){

    // 1.既定値の設定
    this.callback = callback; // 後続処理をメンバとして保存

    // 2.カメラやファインダ等の作業用DIVを追加
    this.parent.innerHTML
    = '<video autoplay class="hide"></video>'
    + '<canvas></canvas>'  // 撮影結果
    + '<div class="buttons hide">'  // カメラ操作ボタン
    + '<div><input type="button" name="undo" value="◀" /></div>'
    + '<div><input type="button" name="shutter" value="[ ● ]" /></div>'
    + '<div><input type="button" name="adopt" value="▶" /></div>'
    + '</div>';
    this.video = this.parent.querySelector('video');
    this.canvas = this.parent.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

    // 3.カメラ操作ボタン関係の定義
    this.buttons = this.parent.querySelector('div.buttons');
    this.undo = this.buttons.querySelector('input[name="undo"]');
    this.undo.disabled = true;  // 再撮影
    this.shutter = this.buttons.querySelector('input[name="shutter"]');
    this.shutter.disabled = false;  // シャッター
    this.adopt = this.buttons.querySelector('input[name="adopt"]');
    this.adopt.disabled = true;  // 採用

    // (1) 再撮影ボタンクリック時
    this.undo.addEventListener('click',() => {
      console.log('webScanner.scanDoc undo clicked.');
      this.onGoing(true);  // カメラ動作中フラグを立てる
      this.drawFinder();  // キャンパスへの描画をスタート
      this.undo.disabled = true;
      this.shutter.disabled = false;
      this.adopt.disabled = true;
    });
    // (2) シャッタークリック時
    this.shutter.addEventListener('click',() => {
      console.log('webScanner.scanDoc shutter clicked.');
      this.onGoing(false);  // カメラを一時停止
      this.undo.disabled = false;
      this.shutter.disabled = true;
      this.adopt.disabled = false;
    });
    // (3) 採用ボタンクリック時
    this.adopt.addEventListener('click',() => {
      console.log('webScanner.scanDoc adopt clicked.');
      // canvasからイメージをBASE64で取得
      // なお圧縮はpng不可なので、jpegとする
      let imageData = '';
      for( let i=0.9 ; i>0 ; i -= 0.1 ){
        imageData = this.canvas.toDataURL('image/jpeg',i);
        if( imageData.length < opt.maxImageSize ){
          i = -1;
        }
      }
      //console.log('l.181\n'+imageData);
      this.callback(imageData);  // base64化したpngを後続処理に渡す
      this.stop();  // スキャナを停止
    })

    // 4.動画を1フレーム読み込んだ際の処理を指定
    this.scanned = () => {};  // フレームごとの処理は無し

    // 5.カメラ操作ボタンを表示してカメラを起動
    this.buttons.classList.remove('hide');
    this.start();
  }

  /** scanQR: QRコードスキャン
   * @param {function} callback - 後続処理
   * @param {object} opt - オプション
   * @param {object} opt.RegExp - スキャン結果が適切か判断。RegExpオブジェクト
   * @param {boolean} opt.alert - true:読み込み完了時に内容をalert表示
   * @returns {void} なし
   * callbackにはQRコードの文字列が渡される。
   */
  scanQR(callback,opt={}){
    console.log('webScanner.scanQR start. opt='+JSON.stringify(opt)+'\n',callback);

    // 1.既定値の設定
    this.RegExp = opt.RegExp || this.RegExp;
    this.alert = opt.alert || this.alert;
    this.callback = callback; // 後続処理をメンバとして保存

    // 2.カメラやファインダ等の作業用DIVを追加
    this.parent.innerHTML = '<canvas></canvas>';
    this.video = document.createElement('video');
    this.canvas = this.parent.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

    // 3.カメラ操作ボタン関係の定義
    // QRコードスキャンでは操作ボタンは無いので定義不要

    // 4.動画を1フレーム読み込んだ際の処理を定義
    this.scanned = this.drawFrame;

    // 5.動画撮影用Webカメラを起動
    this.start();
  }

  /** drawFinder: 動画をキャンバスに描画する
   * @param {void} - 無し
   * @returns {void} 無し
   * 1フレーム読み込むごとにthis.scannedに読み込んだイメージを渡す。
  */
  drawFinder(){
    const onGoing = this.onGoing();
    console.log('webScanner.drawFinder start.',onGoing,this.video);

    // スキャン実行フラグが立っていなかったら終了
    if( !onGoing ) return;

    if(this.video.readyState === this.video.HAVE_ENOUGH_DATA){

      // 親要素の横幅に合わせて表示する
      const ratio = this.parent.clientWidth / this.video.videoWidth;
      //console.log('l.196 this.parent.clientWidth='+this.parent.clientWidth+', this.video.videoWidth='+this.video.videoWidth+' -> ratio='+ratio);
      const w = this.video.videoWidth * ratio;
      const h = this.video.videoHeight * ratio;
      //console.log('l.199 w ='+w+', h='+h);
      this.video.width = this.canvas.width = w;
      this.video.height = this.canvas.height = h;

      this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
      let img;
      try { // canvasを含む要素が削除済の場合にエラーとなるので回避
        img = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      } catch(e) {
        console.error(e.message);
        this.stop();
        return;
      }
      // 1フレーム読み込み時の処理
      // 　※scanQRならdrawFrame, scanDocならなにもしない
      this.scanned(img);
    }
    setTimeout(()=>this.drawFinder(), this.interval);
  }

  /** drawFrame: 動画の1フレームからQRコードを抽出、後続処理に渡す
   * @param {object} img - 読み込んだ画像
   * @returns {void} なし
   */
  drawFrame(img){
    console.log('webScanner.drawFrame start. img=',img);
    try {
      // スキャン実行フラグが立っていなかったら終了
      if( !this.onGoing() ) return;

      // このタイミングでQRコードを判定
      let code = jsQR(img.data, img.width, img.height, {inversionAttempts: "dontInvert"});
			if(code){
        //console.log('drawFinder: code='+JSON.stringify(code));
        // QRコード読み取り成功
				this.drawRect(code.location);// ファインダ上のQRコードに枠を表示
        if( this.alert ) alert(code.data);  // alert出力指定があれば出力
        if( code.data.match(this.RegExp) ){  // 正しい内容が読み込まれた場合
          this.stop();
          this.callback(code.data); // 読み込んだQRコードを引数にコールバック
        } else {
          // 不適切な、別のQRコードが読み込まれた場合
          alert('不適切なQRコードです。再読込してください。');
          console.error('webScanner.drawFinder: not match pattern. code='+code.data);
          // 再読込。drawFinderはクラス内のメソッドなのでアロー関数で呼び出す
          // MDN setTimeout() thisの問題
          // https://developer.mozilla.org/ja/docs/Web/API/setTimeout#this_%E3%81%AE%E5%95%8F%E9%A1%8C
        }
      }
    } catch(e) {
      console.error('webScanner.drawFrame: '+e.message);
    }
  }

  /** drawRect: ファインダ上のQRコードに枠を表示
   * @param {object} location - QRコード位置情報
   * @returns {void} なし
   */
  drawRect(location){
    console.log('webScanner.drawRect location='+JSON.stringifylocation);
    this.drawLine(location.topLeftCorner,     location.topRightCorner);
		this.drawLine(location.topRightCorner,    location.bottomRightCorner);
		this.drawLine(location.bottomRightCorner, location.bottomLeftCorner);
		this.drawLine(location.bottomLeftCorner,  location.topLeftCorner);
  }

  /** drawLine: ファインダ上に線を描画
   * @param {object} begin - 始点の位置
   * @param {object} end - 終点の位置
   * @returns {void} なし
   */
  drawLine(begin, end){
    console.log('webScanner.drawLine begin='
      + JSON.stringify(begin) + ', end=' + JSON.stringify(end));
		this.ctx.lineWidth = 4;
		this.ctx.strokeStyle = "#FF3B58";
		this.ctx.beginPath();
		this.ctx.moveTo(begin.x, begin.y);
		this.ctx.lineTo(end.x, end.y);
		this.ctx.stroke();
	}
}


/** 
 * 変数の型を判定し、型名を文字列で返す。なお引数"is"が指定された場合、判定対象が"is"と等しいかの真偽値を返す。
 * 
 * @param {any} arg - 判定対象の変数
 * @param {string} [is] - 想定される型(型名の大文字小文字は意識不要)
 * @returns {string|boolean} - 型の名前。is指定有りなら判定対象が想定型かの真偽値
 * 
 * @example
 * ```
 * let a = 10;
 * whichType(a);  // 'Number'
 * whichType(a,'string'); // false
 * ```
 * 
 * <b>確認済戻り値一覧</b>
 * 
 * オブジェクトは型名が返るので、限定列挙は困難。以下は確認済みの戻り値のみ記載。
 * 
 * | 型名 | 戻り値 | 備考 |
 * | :-- | :-- | :-- |
 * | 文字列 | String |  |
 * | 数値 | Number |  |
 * | NaN | NaN |  |
 * | 長整数 | BigInt |  |
 * | 論理値 | Boolean |  |
 * | シンボル | Symbol |  |
 * | undefined | Undefined | 先頭大文字 |
 * | Null | Null |  |
 * | オブジェクト | Object |  |
 * | 配列 | Array |  |
 * | 関数 | Function |  |
 * | アロー関数 | Arrow |  |
 * | エラー | Error | RangeError等も'Error' |
 * | Date型 | Date |  |
 * | Promise型 | Promise |  |
 *  
 * - Qiita [JavaScriptの型などの判定いろいろ](https://qiita.com/amamamaou/items/ef0b797156b324bb4ef3)
 * 
 */

function whichType(arg,is){
  let rv = String(Object.prototype.toString.call(arg).slice(8,-1));
  switch(rv){
    case 'Number': if(Number.isNaN(arg)) rv = 'NaN'; break;
    case 'Function': if(!('prototype' in arg)) rv = 'Arrow'; break;
  }
  if( typeof is === 'string' ){
    return rv.toLowerCase() === is.toLowerCase();
  } else {
    return rv;
  }
}


exports.analyzeArg = analyzeArg;
exports.analyzePath = analyzePath;
exports.BurgerMenu = BurgerMenu;
Array.prototype.tabulize = Array_tabulize;
Date.prototype.calc = Date_calc;
Date.prototype.toLocale = Date_toLocale;
exports.embedComponent = embedComponent;
exports.mergeDeeply = mergeDeeply;
exports.querySelector = querySelector;
exports.TabMenu = TabMenu;
exports.TimeTable = TimeTable;
exports.webScanner = webScanner;
exports.whichType = whichType;