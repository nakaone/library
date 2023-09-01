/**
 * @classdesc デバイスのカメラで文書/コードのスキャンを行う
 * 
 * 指定セレクタ以下にcanvas他の必要な要素を作成し、QRコードや文書をスキャンする。
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
 * ws.scanQR(r=>console.log('scanned QR Code = '+r));   // QRコードの読み込み
 * ws.scanDoc();  // 文書の撮影
 * ```
 */
class WebScanner {
  /**
   * @constructor
   * @param {HTMLElement|string} parent - 親要素またはそのCSSセレクタ
   * @param {Object} [opt={}] - オプション
   * @returns {true|Error}
   */
  constructor(parent,opt={}){
    const v = {whois:'WebScanner.constructor',rv:true,step:0,
      default:{
        // === メンバとして持つHTMLElementの定義 ==============
        parent: typeof parent !== 'string' ? parent :
          document.querySelector(parent), // {HTMLElement} 親要素(ラッパー)
        parentSelector: typeof parent === 'string' ? parent : null,
        style: null,  // {HTMLStyleElement} CSS定義
        wrapper: null,  // {HTMLElement} - 親直下のラッパー
        video: null,  // {HTMLElement} - videoで撮影している画像領域
        canvas: null, // {HTMLElement} - 撮影画像を描画する領域
        context: null, // {CanvasRenderingContext2D} - 描画コンテキスト
        switches: null,  // {HTMLElement} - 各種ボタンのラッパー
        retake: null,  // {HTMLElement} - 再撮影ボタン
        shutter: null, // {HTMLElement} - シャッターボタン
        adopt: null,  // {HTMLElement} - 撮影OK、次へボタン

        // === scanQR専用パラメータ ==========================
        constraints:{ // video.getUserMediaで指定するオプション
          audio: false,
          video: {
            facingMode: 'environment',
            width: {min: 300},
            height: {min: 300},
          },
        },
        showVideo: false, // scanQR実行時、video領域を表示するならtrue
        closeFinder: true, // scanQR実行後、video/canvas領域を残すならfalse
        RegExp: /.+/, // scanQR実行時、読込結果を評価する正規表現
        maxWaiting: 90000, // 最大待機時間。単位：ミリ秒
        interval: 300, // 動画撮像間隔。ミリ秒
        size: null,  // 撮像領域(ファインダ)のサイズ。px。nullなら親要素の大きさから判断
        minSize : 300, // 最小撮像サイズ。px

        // === CSS/HTML定義 ================================
        css:[
          /* WebScanner共通部分(wrapper) */ `
          .WebScanner {
            display: none;
          }
          .WebScanner.act {
            width: 100%;
            display: grid;
            place-items: center;
          }`,
          /* video */`
          .WebScanner .video {
            display: none;
          }
          .WebScanner .video.act {
            display: block;
          }`,
        ],
        html:[  // イベント定義を複数回行わないようにするため、eventで定義
          {attr:{class:'WebScanner'},children:[
            {attr:{class:'video'},children:[
              {tag:'video'}
            ]},
            {tag:'canvas'},
          ]},
        ],
      },
    };
    console.log(v.whois+' start.',opt);
    try {

      v.step = 1; // メンバの値セット、HTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 2; // 各領域をメンバとして保存
      this.wrapper = this.parent.querySelector('.WebScanner');
      this.video = this.parent.querySelector('video');
      this.canvas = this.parent.querySelector('canvas');
      this.retake = this.parent.querySelector('button[name="retake"]');
      this.shutter = this.parent.querySelector('button[name="shutter"]');
      this.adopt = this.parent.querySelector('button[name="adopt"]');

      v.step = 3; // デバイスがサポートされているか確認
      if (!('mediaDevices' in navigator) || !('getUserMedia' in navigator.mediaDevices)) {
        throw new Error('デバイス(カメラ)がサポートされていません');
      } else {
        console.log("%s step.%s: device supported.",v.whois,v.step);
      }

      v.step = 4; // 描画コンテキストの取得とクリア
      this.context = this.canvas.getContext('2d');
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      v.step = 5; // 撮像(video)領域のサイズ変更
      // wrapper縦横の小さい方をthis.sizeに格納
      if( this.size === null ){
        v.w = this.parent.clientWidth;
        this.size = v.w < this.minSize ? this.minSize : v.w;
      }
      console.log("w=%s, size=%s",v.w,this.size);

      // 以下の手順はawaitが必要なので、scanQRで実行

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 指定時間待機 */
  sleep = (sec) =>
    {return new Promise(resolve => setTimeout(resolve,sec))};

  /** QRコードをスキャン
   * @param {Object} opt - scanQR専用パラメータ。詳細はconstructor参照
   * @returns {string|null} スキャンしたQRコードの文字列。読込失敗ならnull
   * 
   * - Qiita [html＋javascriptだけで実装したシンプルなQRコードリーダー](https://qiita.com/murasuke/items/c16e4f15ac4436ed2744)
   */
  scanQR = async (opt={}) => {
    const v = {whois:'WebScanner.scanQR',rv:null,step:0};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // パラメータの設定
      Object.keys(opt).forEach(x => this[x] = opt[x]);

      v.step = 2; // カメラの準備(videoタグに表示)
      this.constraints.video.width =
      this.constraints.video.height = this.size;
      this.video.srcObject = await navigator.mediaDevices
      .getUserMedia(this.constraints);
      this.video.onloadedmetadata = () => {
        this.video.play();
      };

      v.step = 3; // video,canvasの表示
      this.wrapper.classList.add('act');
      if( this.showVideo ){
        this.wrapper.querySelector('.video').classList.add('act');
      }
      this.canvas.width  = v.cw = 
      this.canvas.height = v.ch = this.size;

      v.step = 4; // 定期的にスキャン実行
      v.cnt = 0;
      do {
        if(this.video.readyState === this.video.HAVE_ENOUGH_DATA){
          
          v.step = 4.1; // キャンバスへの描画
          this.context.drawImage(this.video, 0, 0, v.cw, v.ch);
          v.imageData = this.context.getImageData(0, 0, v.cw, v.ch);
          v.code = jsQR(v.imageData.data, v.imageData.width, v.imageData.height);
          if ( v.code ) {
            v.step = 4.2;
            console.log(v.code);
            // スキャン結果の判定
            if( typeof v.code.data === 'string' && v.code.data.match(this.RegExp) ){
              v.rv = v.code.data;
            }
          }
        }
        console.log(v.cnt);
        v.cnt += this.interval;
        await this.sleep(this.interval);
      } while( v.rv === null && v.cnt < this.maxWaiting );

      v.step = 5; // 終了処理
      this.stop(v.rv === null);

      console.log(v.whois+' normal end.\n',v.rv);
      return v.rv;
  
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 終了処理
   * @param {boolean} [endStatus=false] - 終了時のステータス。異常終了ならtrue
   * @returns {void}
   */
  stop = (endStatus=false) => {
    if( endStatus ){
      alert('一定時間('+(this.maxWaiting/1000)+'秒)経過に伴いスキャナを停止しました')
    }
    this.video.srcObject.getVideoTracks().forEach((track) => {
      track.stop();
    });
    if( this.closeFinder ){
      this.wrapper.classList.remove('act');
      this.wrapper.querySelector('.video').classList.remove('act');
    }
  }
}