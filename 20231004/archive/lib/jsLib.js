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
exports.webScanner = webScanner


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
exports.analyzeArg = analyzeArg


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
exports.analyzePath = analyzePath


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
exports.mergeDeeply = mergeDeeply


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
exports.querySelector = querySelector


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
exports.whichType = whichType


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
Date.prototype.calc = Date_calc;

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
