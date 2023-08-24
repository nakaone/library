/**
 * @classdesc デバイスのカメラで文書/コードのスキャンを行う
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
 * ws.scanQR(r=>console.log('scanned QR Code = '+r));   // QRコードの読み込み
 * ws.scanDoc();  // 文書の撮影
 * ```
 */
class WebScanner {
  /**
   * @constructor
   * @param {string} [parent='body'] - 親要素のCSSセレクタ
   * @param {Object} [opt={}] - オプション
   * 
   * - [Promiseでsleep機能を作る](https://www.sejuku.net/blog/24629#index_id5)
   */
  constructor(parent='body',opt={}){
    const v = {whois:'WebScanner.constructor',rv:null,step:0};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // 引数(opt)・既定値を基にメンバの値を設定
      if( !opt.hasOwnProperty('parent') ) opt.parent = parent;
      v.rv = setupInstance(this,opt,{
        constraints:{ // video.getUserMediaで指定するオプション
          audio: false,
          video: {
            facingMode: 'environment',
            width: {min: 500},
            height: {min: 500},
          },
        },
        showVideo: false, // scanQR実行時、video領域を表示するならtrue
        showCanvas: true, // scanQR実行時、canvas領域を表示するならtrue
        closeFinder: true, // scanQR実行後、video/canvas領域を残すならfalse
        RegExp: /.+/, // scanQR実行時、読込結果を評価する正規表現
        maxWaiting: 90000, // 最大待機時間。単位：ミリ秒
        interval: 300, // 動画撮像間隔。ミリ秒
        size: null,  // 撮像領域(ファインダ)のサイズ。px。nullなら親要素の大きさから判断
        minSize : 500, // 最小撮像サイズ。px
        sleep: (sec) =>  // 指定時間待機
          {return new Promise(resolve => setTimeout(resolve,sec))},
        wrapper: null,  // {HTMLElement} - 親直下のラッパー
        video: null,  // {HTMLElement} - videoで撮影している画像領域
        canvas: null, // {HTMLElement} - 撮影画像を描画する領域
        context: null, // {CanvasRenderingContext2D} - 描画コンテキスト
        switches: null,  // {HTMLElement} - 各種ボタンのラッパー
        retake: null,  // {HTMLElement} - 再撮影ボタン
        shutter: null, // {HTMLElement} - シャッターボタン
        adopt: null,  // {HTMLElement} - 撮影OK、次へボタン
        css: [{
          sel: '.WebScanner',
          prop: {
            'display': 'none',
          }
        },{
          sel: '.WebScanner.act',
          prop: {
            '--videoSize': '300px',
            '--buttonSize': '100px',
            'display': 'grid',
            'grid-template-rows': 'var(--videoSize) var(--videoSize) var(--buttonSize)',
            'row-gap': '1rem',
            'justify-items': 'center',
            'align-items': 'center',
          }
        },{
          sel: '.WebScanner video',
          prop: {
            'display': 'none',
          }
        },{
          sel: '.WebScanner video.act',
          prop: {
            'display': 'block',
            'width': 'var(--videoSize)',
            'height': 'var(--videoSize)',
          }
        },{
          sel: '.WebScanner canvas',
          prop: {
            'display': 'none',
          }
        },{
          sel: '.WebScanner canvas.act',
          prop: {
            'display': 'block',
          }
        },{
          sel: '.WebScanner .switches',
          prop: {
            'display': 'none',
          }
        },{
          sel: '.WebScanner .switches.act',
          prop: {
            'width': '80%',
            'display': 'grid',
            'grid-template-columns': 'repeat(3, 1fr)',
            'column-gap': 'calc((100% - var(--buttonSize) * 3) / 2)',
          }
        },{
          sel: '.WebScanner .switches button',
          prop: {
            'width': 'var(--buttonSize)',
            'height': 'var(--buttonSize)',
            'text-align': 'center',
            'vertical-align': 'middle',
            'font-size': 'calc(var(--buttonSize) * 0.7)',
          }
        }],
      });
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 2; // HTML要素の作成
      this.wrapper = createElement({attr:{class:'WebScanner'}});
      this.parent.element.appendChild(this.wrapper);
      ['video','canvas'].forEach(x => {
        this[x] = createElement({tag:x});
        this.wrapper.appendChild(this[x]);
      });
      ['switches'].forEach(x => {
        this[x] = createElement({attr:{class:x}});
        this.wrapper.appendChild(this[x]);
      });
      ['retake','shutter','adopt'].forEach(x => {
        this[x] = createElement({tab:'button',attr:{name:x}});
        this.switches.appendChild(this[x]);
      });

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
      // 親要素の高さを最大に変更
      this.parent.element.style.width
      = this.parent.element.style.height = '100%';
      // 撮像領域を親要素の幅・高さ、いずれか小さい方の正方形に設定
      if( this.size === null ){
        v.pw = this.parent.element.clientWidth;
        v.ph = this.parent.element.clientHeight;
        if( v.pw < v.ph ){
          this.size = v.pw < this.minSize ? this.minSize : v.pw;
          this.parent.element.style.height = this.size + 'px';
        } else {
          this.size = v.ph < this.minSize ? this.minSize : v.ph;
          this.parent.element.style.width = this.size + 'px';
        }
      }
      this.wrapper.style.setProperty('--videoSize',this.size+'px');

      // 以下の手順はawaitが必要なので、scanQRで実行

      console.log(v.whois+' normal end.\n',this);
      return v.rv;
      
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** QRコードをスキャン
   * @param {void}
   * @returns {string} スキャンしたQRコードの文字列
   * 
   * - Qiita [html＋javascriptだけで実装したシンプルなQRコードリーダー](https://qiita.com/murasuke/items/c16e4f15ac4436ed2744)
   */
  scanQR = async () => {
    const v = {whois:'WebScanner.scanQR',rv:null,step:0};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // カメラの準備(videoタグに表示)
      this.video.srcObject = await navigator.mediaDevices
      .getUserMedia(this.constraints);
      this.video.onloadedmetadata = () => {
        this.video.play();
      };

      v.step = 2; // video,canvasの表示
      this.wrapper.classList.add('act');
      if( this.showVideo ){
        this.video.classList.add('act');
      } else {
        this.video.classList.remove('act');
      };
      if( this.showCanvas ){
        this.canvas.classList.add('act');
      } else {
        this.canvas.classList.remove('act');
      };

      v.step = 3; // 定期的にスキャン実行
      v.cnt = 0;
      do {
        await this.sleep(this.interval);
        if(this.video.readyState === this.video.HAVE_ENOUGH_DATA){

          v.step = 3.1; // canvasのサイズを撮像サイズに合わせて変更
          v.vw = this.video.videoWidth;
          v.vh = this.video.videoHeight;
          this.canvas.width = v.cw
          = this.size * (v.vw > v.vh ? 1 : (v.vw / v.vh));
          this.canvas.height = v.ch
          = this.size * (v.vh > v.vw ? 1 : (v.vh / v.vw));
  
          v.step = 3.2; // キャンバスへの描画
          this.context.drawImage(this.video, 0, 0, v.cw, v.ch);
          v.imageData = this.context.getImageData(0, 0, v.cw, v.ch);
          v.code = jsQR(v.imageData.data, v.imageData.width, v.imageData.height);
          if ( v.code ) {
            v.step = 3.3;
            console.log(v.code);
            // スキャン結果の判定
            if( typeof v.code.data === 'string' && v.code.data.match(this.RegExp) ){
              v.rv = v.code.data;
            }
          }
        }
        console.log(v.cnt);
        v.cnt += this.interval;
      } while( v.rv === null && v.cnt < this.maxWaiting );

      // 終了処理
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
      this.video.classList.remove('act');
      this.canvas.classList.remove('act');
    }
  }
}