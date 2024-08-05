/** QRコードをスキャン
 * @param {string} parent - 親要素のCSSセレクタ
 * @param {Object} [opt={}] - オプション
 * @param {number} opt.size - ファインダ領域のサイズ
 * @param {number} opt.interval=300 - 撮像間隔。ミリ秒
 * @param {number} opt.max=90000 - 最大待機時間。単位：ミリ秒
 * @param {Function} opt.field - 入力欄を併用する場合、入力欄の値を返す関数
 * @returns {string} スキャンしたQRコードの文字列
 *
 * - Qiita [html＋javascriptだけで実装したシンプルなQRコードリーダー](https://qiita.com/murasuke/items/c16e4f15ac4436ed2744)
 * - [Promiseでsleep機能を作る](https://www.sejuku.net/blog/24629#index_id5)
 *
 * @typedef scanQRopt
 * @prop {number} [size=500] - ファインダのサイズ
 */
async function scanQR(parent,opt={}){
  const v = {whois:'scanQR',rv:null,
    constraints:{
      audio: false,
      video: {
        facingMode: 'environment',
        //width: opt.size || 500,
        //height: opt.size || 500,
      },
    },
    max: opt.max || 90000, // 最大待機時間。単位：ミリ秒
    interval: opt.interval || 300, // 撮像間隔。ミリ秒
    minSize : opt.minSize || 640, // 最小撮像サイズ。px
    sleep: (sec) =>  // 指定時間待機
      {return new Promise(resolve => setTimeout(resolve,sec))},
  };
  console.log(`${v.whois} start.\nparent=${parent}\nopt=${stringify(opt)}`);
  try {

    // ファインダ領域の作成
    v.step = '1.1'; // 親要素の高さを最大に
    v.parent = document.querySelector(parent);
    v.parent.style.width = v.parent.style.height = '100%';
    v.step = '1.2'; // 撮像領域を親要素の幅・高さ、いずれか小さい方の正方形に設定
    if( opt.hasOwnProperty('size') ){
      v.ps = opt.size;
    } else {
      v.pw = v.parent.clientWidth;
      v.ph = v.parent.clientHeight;
      if( v.pw < v.ph ){
        v.ps = v.pw < v.minSize ? v.minSize : v.pw;
        v.parent.style.height = v.ps + 'px';
      } else {
        v.ps = v.ph < v.minSize ? v.minSize : v.ph;
        v.parent.style.width = v.ps + 'px';
      }
    }
    v.constraints.video.width = v.constraints.video.height = v.ps;
    v.step = '1.3'; // video要素の生成
    v.video = createElement({tag:'video',style:{margin:'auto'}},v.video);

    v.step = '2';
    const stream = await navigator.mediaDevices.getUserMedia(v.constraints);
    v.video.srcObject = stream;
    v.video.play();

    v.step = '3';
    const { width, height } = v.constraints.video;
    v.canvas = new OffscreenCanvas(width, height);
    const context = v.canvas.getContext('2d');

    v.step = '4'; // 定期的にスキャン実行
    v.cnt = 0;
    do {
      context.drawImage(v.video, 0, 0, width, height);
      const imageData = context.getImageData(0, 0, width, height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      v.field = opt.field();  // 入力欄に入力されていれば!null
      if (code || v.field) {
        v.rv = v.field || code.data;
      } else {
        await v.sleep(v.interval);
        console.log(v.cnt);
        v.cnt += v.interval;
      }
    } while( v.rv === null && v.cnt < v.max );

    // 終了処理
    v.video.srcObject.getVideoTracks().forEach((track) => {
      track.stop();
    });
    v.parent.innerHTML = ''; // 作業用DIVを除去

    console.log(v.whois+' normal end.\n'+v.rv);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
