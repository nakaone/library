
/**
 * @typedef {Object} webScannerOpt
 * @prop {number} interval - 動画状態で撮像、読み込めなかった場合の間隔。ミリ秒
 * @prop {object} RegExp - QRコードスキャン時、内容が適切か判断
 * @prop {number} lifeTime - 一定時間操作がない場合の停止までのミリ秒。既定値60000
 * @prop {boolean} alert - 読み込み完了時に内容をalert表示するか
 */

/**
 * @classdesc 指定セレクタ以下にcanvas他の必要な要素を作成し、QRコードや文書をスキャン
 * 
 * **残課題**
 * 
 * 1. scanDoc稼働未確認
 * 
 * @example
 * 
 * ```
 * <div class="webScanner"></div>
 * 〜
 * const ws = new webScanner('.webScanner');
 * ws.scanQR();   // QRコードの読み込み
 * ws.scanDoc();  // 文書の撮影
 * ```
 */

class webScanner {
  /**
   * 指定セレクタ以下にcanvas他の必要な要素を作成してスキャン実行、指定の後続処理を呼び出す。
   * 
   * - [jsQRであっさりQRコードリーダ/メーカ](https://zenn.dev/sdkfz181tiger/articles/096dfb74d485db)
   * - [PCにおける内蔵/webカメラの切り替え](webScanner.html#switchCamera)
   * 
   * @constructor
   * @param {string|HTMLElement} parent - 親要素(ラッパー)。文字列ならCSSセレクタと解釈
   * @param {webScannerOpt} [opt={}] - オプション
   * @returns {void} なし
   */
  constructor(parent,opt){
    const v = {opt:{}};
    console.log('webScanner.constructor start.');

    // 親要素(ラッパー。HTMLElement)をthis.parentにセット
    this.parent = typeof parent !== 'string' ? parent
      : document.querySelector(parent);
    console.log(this.parent); 

    // デバイスがサポートされているか確認
    if (!('mediaDevices' in navigator) || !('getUserMedia' in navigator.mediaDevices)) {
      const msg = 'デバイス(カメラ)がサポートされていません';
      console.error('webScanner.constructor: '+msg);
      alert(msg);
      return;
    } else {
      console.log('device is supported.');
    }

    // メンバ(既定値)の設定
    v.opt = Object.assign({
      interval: 250,    // 動画状態で撮像、読み込めなかった場合の間隔。ミリ秒
      lifeTime: 60000,  // 一定時間操作がない場合の停止までのミリ秒。既定値60000
      lastGoing: 0,     // 前回カメラ起動したUNIX時刻。onGoingで状態制御に使用(一定時間操作無しなら停止)
    },opt);
    for( v.x in v.opt ){
      this[v.x] = v.opt[v.x];
      console.log(v.x+' = '+this[v.x]);
    }

    console.log('webScanner.constructor end.');
  }

  /** scanQR: QRコードスキャン
   * @param {Function} callback - 後続処理
   * @param {object} [opt={}] - オプション
   * @param {RegExp} [opt.RegExp=/.+/] - スキャン結果が適切か判断
   * @param {boolean} [opt.alert=false] - true:読み込み完了時に内容をalert表示
   * @returns {void} なし
   * callbackにはQRコードの文字列が渡される。
   */
  scanQR(callback,opt={}){
    console.log('webScanner.scanQR start. opt='+JSON.stringify(opt)+'\n',callback);

    // 1.既定値の設定
    this.RegExp = opt.RegExp || /.+/;
    this.alert = opt.alert || false;
    this.callback = callback; // 後続処理をメンバとして保存

    // 2.カメラやファインダ等の作業用DIVを追加
    this.parent.innerHTML = '';
    this.canvas = createElement({tag:'canvas'});
    this.parent.appendChild(this.canvas);
    this.video = createElement('video');
    this.ctx = this.canvas.getContext('2d');

    // 3.カメラ操作ボタン関係の定義
    // QRコードスキャンでは操作ボタンは無いので定義不要

    // 4.動画を1フレーム読み込んだ際の処理を定義
    this.scanned = this.#drawFrame;

    // 5.動画撮影用Webカメラを起動
    this.#start();
  }

  /** start: カメラを起動する(private関数)
   * @param {void} - なし
   * @returns {void} なし
   */
  #start(){
    console.log('webScanner.start start.');

    // 動画撮影用Webカメラを起動
    navigator.mediaDevices.getUserMedia({
      video: true,
      /*video: {  PCだと内蔵カメラではなくwebカメラを呼び出してしまう
        facingMode: "environment",
        //facingMode: "user",
        //facingMode: {exact:"environment"},
      },*/
      audio: false
    }).then((stream) => {
      this.video.srcObject = stream;
      this.video.setAttribute("playsinline", true);
      this.video.play();
      this.#onGoing(true);  // カメラ動作中フラグを立てる
      this.#drawFinder();  // キャンパスへの描画をスタート
    }).catch(e => {
      alert('カメラを使用できません\n'+e.message);
    });
  }

  /** onGoing: カメラの起動・停止の制御と状態参照
   * @param {boolean} - true:起動、false:停止、undefind:状態参照
   * @returns {boolean} true:起動中、false:停止中
   */
  #onGoing(arg){
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
          this.#stop();
        }
      }
    }
    return rv;
  }

  /** stop: カメラを停止する(private関数)
   * @param {void} - なし
   * @returns {void} なし
   */
  #stop(){
    console.log('webScanner.stop',this.video);
    this.video.srcObject.getVideoTracks().forEach((track) => {
      track.stop();
    });
    this.parent.innerHTML = ''; // 作業用DIVを除去
    this.lastGoing = 0;
  }

  /** drawFinder: 動画をキャンバスに描画する
   * @param {void} - 無し
   * @returns {void} 無し
   * 1フレーム読み込むごとにthis.scannedに読み込んだイメージを渡す。
  */
  #drawFinder(){
    console.log('webScanner.drawFinder start.',this.video);

    // スキャン実行フラグが立っていなかったら終了
    if( !this.#onGoing() ) return;

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
        this.#stop();
        return;
      }
      // 1フレーム読み込み時の処理
      // 　※scanQRならdrawFrame, scanDocならなにもしない
      this.scanned(img);
    }
    setTimeout(()=>this.#drawFinder(), this.interval);
  }

  /** drawFrame: 動画の1フレームからQRコードを抽出、後続処理に渡す
   * @param {object} img - 読み込んだ画像
   * @returns {void} なし
   */
  #drawFrame(img){
    console.log('webScanner.drawFrame start. img=',img);
    try {
      // スキャン実行フラグが立っていなかったら終了
      if( !this.#onGoing() ) return;

      // このタイミングでQRコードを判定
      let code = jsQR(img.data, img.width, img.height, {inversionAttempts: "dontInvert"});
			if(code){
        //console.log('drawFinder: code='+JSON.stringify(code));
        // QRコード読み取り成功
				this.#drawRect(code.location);// ファインダ上のQRコードに枠を表示
        if( this.alert ) alert(code.data);  // alert出力指定があれば出力
        if( code.data.match(this.RegExp) ){  // 正しい内容が読み込まれた場合
          this.#stop();
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
  #drawRect(location){
    console.log('webScanner.drawRect location='+JSON.stringifylocation);
    this.#drawLine(location.topLeftCorner,     location.topRightCorner);
		this.#drawLine(location.topRightCorner,    location.bottomRightCorner);
		this.#drawLine(location.bottomRightCorner, location.bottomLeftCorner);
		this.#drawLine(location.bottomLeftCorner,  location.topLeftCorner);
  }

  /** drawLine: ファインダ上に線を描画
   * @param {object} begin - 始点の位置
   * @param {object} end - 終点の位置
   * @returns {void} なし
   */
  #drawLine(begin, end){
    console.log('webScanner.drawLine begin='
      + JSON.stringify(begin) + ', end=' + JSON.stringify(end));
		this.ctx.lineWidth = 4;
		this.ctx.strokeStyle = "#FF3B58";
		this.ctx.beginPath();
		this.ctx.moveTo(begin.x, begin.y);
		this.ctx.lineTo(end.x, end.y);
		this.ctx.stroke();
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
      this.#onGoing(true);  // カメラ動作中フラグを立てる
      this.drawFinder();  // キャンパスへの描画をスタート
      this.undo.disabled = true;
      this.shutter.disabled = false;
      this.adopt.disabled = true;
    });
    // (2) シャッタークリック時
    this.shutter.addEventListener('click',() => {
      console.log('webScanner.scanDoc shutter clicked.');
      this.#onGoing(false);  // カメラを一時停止
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
    this.#start();
  }
}
