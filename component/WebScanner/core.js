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
   */
  constructor(parent='body',opt={}){
    const v = {whois:'WebScanner.constructor',rv:null,step:0};
    console.log(v.whois+' start.');
    try {

      v.step = 1; // 引数(opt)・既定値を基にメンバの値を設定
      if( !opt.hasOwnProperty('parent') ) opt.parent = parent;
      v.rv = setupInstance(this,opt,{
        constraints:{
          audio: false,
          video: {
            facingMode: 'environment',
          },
        },
        size: null,  // 撮像領域(ファインダ)のサイズ。px。nullなら親要素の大きさから判断
        max: 90000, // 最大待機時間。単位：ミリ秒
        interval: 300, // 動画撮像間隔。ミリ秒
        minSize : 500, // 最小撮像サイズ。px
        sleep: (sec) =>  // 指定時間待機
          {return new Promise(resolve => setTimeout(resolve,sec))},
        wrapper: null,  // {HTMLElement} - 親直下のラッパー
        video: null,  // {HTMLElement} - videoで撮影している画像領域
        canvas: null, // {HTMLElement} - 撮影画像を描画する領域
        switches: null,  // {HTMLElement} - 各種ボタンのラッパー
        retake: null,  // {HTMLElement} - 再撮影ボタン
        shutter: null, // {HTMLElement} - シャッターボタン
        adopt: null,  // {HTMLElement} - 撮影OK、次へボタン
        css: [{
          sel: '.WebScanner',
          prop: {
            '--videoSize': '300px',
            '--buttonSize': '100px',
          }
        },{
          sel: '.WebScanner .video',
          prop: {
            'width': 'var(--videoSize)',
            'height': 'var(--videoSize)',
            'margin': '0 auto',
          }
        },{
          sel: '.WebScanner .canvas',
          prop: {}
        },{
          sel: '.WebScanner .switches',
          prop: {
            'display': 'none',
          }
        },{
          sel: '.WebScanner .switches.is_active',
          prop: {
            'display': 'grid',
            'grid-template-columns': 'repeat(3, 1fr)',
            'width': '80%',
            'margin': 'calc(var(--videoSize) * 0.2) 10%',
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
      console.log("%s step.%s\n",v.whois,v.step,this);

      v.step = 2; // HTML要素の作成
      this.wrapper = createElement({attr:{class:'WebScanner'}});
      this.parent.element.appendChild(this.wrapper);
      ['video','canvas','switches'].forEach(x => {
        this[x] = createElement({attr:{class:x}});
        this.wrapper.appendChild(this[x]);
      });
      ['retake','shutter','adopt'].forEach(x => {
        this[x] = createElement({tab:'button',attr:{name:x}});
        this.switches.appendChild(this[x]);
      });

      v.step = 3; // 撮像(video)領域のサイズ変更
      // 親要素の高さを最大に変更
      this.parent.element.style.width
      = this.parent.element.style.height = '100%';
      // 撮像領域を親要素の幅・高さ、いずれか小さい方の正方形に設定
      if( this.size !== null ){
        // 指定があれば指定優先
        v.ps = this.size;
      } else {
        v.pw = this.parent.element.clientWidth;
        v.ph = this.parent.element.clientHeight;
        if( v.pw < v.ph ){
          v.ps = v.pw < this.minSize ? this.minSize : v.pw;
          this.parent.element.style.height = v.ps + 'px';
        } else {
          v.ps = v.ph < this.minSize ? this.minSize : v.ph;
          this.parent.element.style.width = v.ps + 'px';
        }
      }
      console.log("w=%s, h=%s, s=%s",v.pw,v.ph,v.ps);
      this.wrapper.style.setProperty('--videoSize',v.ps+'px');

      console.log(v.whois+' normal end.\n',v.rv);
      return v.rv;
      
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  scanQR = async () => {
    const v = {whois:'prototype',rv:null,step:0};
    console.log(v.whois+' start.');
    try {


      v.step = '2';
      const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
      v.video.srcObject = stream;
      v.video.play();

      v.step = '3';
      const { width, height } = this.constraints.video;
      v.canvas = new OffscreenCanvas(width, height);
      const context = v.canvas.getContext('2d');


  
      console.log(v.whois+' normal end.\n',v.rv);
      return v.rv;
  
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  start = () => {

  }

  stop = () => {

  }
}