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
   *
   * オプション「description」は起動時は説明文(html)として渡され、
   * 処理中にそれを内容とするHTMLElementに変換される(constructor step 1.2)
   */
  constructor(parent,opt={}){
    const v = {whois:'WebScanner.constructor',rv:true,step:0,
      default:{
        display:{ // entry実行時に表示する領域
          wrapper: true,  // 常時true
          video: false,
          canvas: true,
          description: true,
          input: true,
          button: true,
          link: false,
          qrcode: false,
        },
        closeWhenFinished: true,  // スキャン・入力終了時、領域を閉じるならtrue
        // === メンバとして持つHTMLElementの定義 ==============
        parent: parent, // {HTMLElement} 親要素
        parentSelector: null, // {string} 親要素のCSSセレクタ
        style: null,  // {HTMLStyleElement} CSS定義
        wrapper: null,  // {HTMLElement} - 親直下のラッパー
        video: null,  // {HTMLElement} - videoで撮影している画像領域
        canvas: null, // {HTMLElement} - 撮影画像を描画する領域
        context: null, // {CanvasRenderingContext2D} - 描画コンテキスト
        description: null, // {HTMLElement} - 説明文
        input: null, // {HTMLElement} - 入力欄
        button: null, // {HTMLElement} - 決定ボタン
        link: null, // {HTMLElement} - 入力された内容(リンク)
        qrcode: null, // {HTMLElement} - QRコード生成用領域

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
            grid-template-columns: 1fr;
            place-items: center;
            gap: 2rem;
          }`,
          /* video, canvas */`
          .WebScanner video {
            display: none;
          }
          .WebScanner video.act {
            display: block;
            width: 100%;
          }
          .WebScanner canvas {
            display: none;
          }
          .WebScanner canvas.act {
            display: block;
            width: 100%;
          }`,
          /* keyword */`
          .WebScanner .description {
            display: none;
          }
          .WebScanner .description.act {
            display: block;
          }
          .WebScanner input {
            display: none;
          }
          .WebScanner input.act {
            display: block;
            width: 80%;
            margin: 0 auto;
            height: 7vw;
            font-size: 5vw;
          }
          .WebScanner button {
            display: none;
          }
          .WebScanner button.act {
            display: block;
            width: 80%;
            height: 15vw;
            font-size: 5vw;
            margin: 0 auto;
          }
          .WebScanner .value {
            display: none;
          }
          .WebScanner .link {
            display: none;
          }
          .WebScanner .link.act {
            display: block;
            width: 80%;
          }`,
          /* qrcode */`
          .WebScanner .qrcode {
            display: none;
          }
          .WebScanner .qrcode.act {
            display: block;
            width: 40%;
            height: 300px;
            margin: 0 auto;
          }
          .WebScanner .qrcode.act canvas {
            display: block;
          }`,
        ],
        html:[  // イベント定義を複数回行わないようにするため、eventで定義
          {attr:{class:'WebScanner'},children:[
            {tag:'video'},
            {tag:'canvas'},
            {attr:{class:'description'}},
            {tag:'input',attr:{type:'text'}},
            {tag:'button',text:'検索',event:{click:(event)=>{
              event.target.parentNode.querySelector('.value').innerText
              = event.target.parentNode.querySelector('input').value;
            }}},
            {attr:{class:'value'}},
            {attr:{class:'link'}},
            {attr:{class:'qrcode'}},
          ]},
        ],
      },
    };
    console.log(v.whois+' start.',opt);
    try {

      v.step = 1.1; // メンバの値セット、HTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;
      v.step = 1.2; // 説明文の処理
      v.description = this.description;
      this.wrapper = this.parent.querySelector('.WebScanner');
      this.description = this.wrapper.querySelector('.description');
      this.description.innerHTML = v.description;

      v.step = 2; // 各領域をメンバとして保存
      this.video = this.wrapper.querySelector('video');
      this.canvas = this.wrapper.querySelector('canvas');
      this.input = this.wrapper.querySelector('input');
      this.button = this.wrapper.querySelector('button');
      this.value = this.wrapper.querySelector('.value');
      this.link = this.wrapper.querySelector('.link');
      this.qrcode = this.wrapper.querySelector('.qrcode');

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

  /** スキャンまたは入力欄への手入力で文字列を取得
   * @param {Object} opt - scanQR専用パラメータ。詳細はconstructor参照
   * @returns {string|null} 取得した文字列。読込失敗ならnull
   */
  entry = async (opt={}) => {
    const v = {whois:'WebScanner.entry',rv:null,step:0};
    console.log(v.whois+' start.');
    try {

      v.step = 1.1; // パラメータの設定
      Object.keys(opt).forEach(x => this[x] = opt[x]);
      v.step = 1.2; // 作業用要素の内容を初期化
      this.input.value = '';
      this.value.innerText = '';

      v.step = 2; // カメラの準備(videoタグに表示)
      this.constraints.video.width =
      this.constraints.video.height = this.size;
      this.video.srcObject = await navigator.mediaDevices
      .getUserMedia(this.constraints);
      this.video.onloadedmetadata = () => {
        this.video.play();
      };

      v.step = 3; // video,canvas他要素の表示
      Object.keys(this.display).forEach(x => {
        if( this.display[x] ){
          this[x].classList.add('act');
        }
      });
      this.canvas.width  = v.cw =
      this.canvas.height = v.ch = this.size;

      v.step = 4; // 定期的にスキャン実行
      v.cnt = 0;
      do {
        v.rv = this.scanQR();
        // div.valueをチェック、入力されていたらそれを利用
        if( v.rv === null && this.value.innerText !== '' ){
          v.rv =  this.value.innerText;
        }
        console.log(v.cnt);
        v.cnt += this.interval;
        await this.sleep(this.interval);
      } while( v.rv === null && v.cnt < this.maxWaiting );

      v.step = 5; // スキャンまたは入力結果の処理
      if( v.rv !== null ){
        v.step = 5.1; // 入力欄・ボタンを非表示
        ['input','button','description'].forEach(x => {
          this[x].classList.remove('act');
        });

        v.step = 5.2; // スキャンした文字列の表示
        if( this.display.link ){
          this.link.innerHTML = '<a target="_blank" href="'
          + v.rv + '">' + v.rv + '</a>';
        }

        v.step = 5.3; // QRコードの表示
        if( this.display.qrcode ){
          this.qrcode.innerHTML = '';
          v.qrSize = this.qrcode.clientWidth;
          console.log(this.qrcode);
          //v.qr = new QRCode(this.qrcode,v.rv);
          v.qr = new QRCode(this.qrcode,{
            text: v.rv,
            width: v.qrSize, height: v.qrSize,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
          });
        }
      }

      v.step = 6.1; // 終了処理
      if( this.closeWhenFinished ){
        this.stop();
      } else {
        // videoの撮影停止(closeWhenFinishedならthis.close内で実行)
        this.video.srcObject.getVideoTracks().forEach((track) => {
          track.stop();
        });
      }
      console.log(v.whois+' normal end.\n',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** QRコードをスキャン
   * @param {Object} opt - scanQR専用パラメータ。詳細はconstructor参照
   * @returns {string|null} スキャンしたQRコードの文字列。読込失敗ならnull
   *
   * ※このメソッドは一コマ分の撮影および解析(jsQR)しか行わない。
   *
   * - Qiita [html＋javascriptだけで実装したシンプルなQRコードリーダー](https://qiita.com/murasuke/items/c16e4f15ac4436ed2744)
   */
  scanQR = () => {
    const v = {whois:'WebScanner.scanQR',rv:null,step:0};
    //console.log(v.whois+' start.');
    try {

      if(this.video.readyState !== this.video.HAVE_ENOUGH_DATA)
        return null;

      v.cw = v.ch = this.size;

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

      //console.log(v.whois+' normal end.\n',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 指定時間待機 */
  sleep = (sec) =>
    {return new Promise(resolve => setTimeout(resolve,sec))};

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
      Object.keys(this.display).forEach(x => {
        this[x].classList.remove('act');
      })
    }
  }
}