/** QRコードをスキャン
 * なお縦横いずれでも汎用的に使えるよう、撮像領域(ファインダ)は正方形とする
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
 */
async function scanQR(parent,opt={}){
  const v = {whois:'scanQR',rv:null,
    max: opt.max || 90000, // 最大待機時間。単位：ミリ秒
    interval: opt.interval || 300, // 撮像間隔。ミリ秒
    minSize : opt.minSize || 640, // 最小撮像サイズ。px
    sleep: (sec) =>  // 指定時間待機
      {return new Promise(resolve => setTimeout(resolve,sec))},
  };
  console.log(`${v.whois} start.\nparent=${parent}\nopt=${stringify(opt)}`);
  try {

    v.step = 1; // 親要素のサイズ設定、取得
    // 親要素の幅を最大に、高さを幅に合わせる
    v.parent = document.querySelector(parent);
    v.parent.style.width = '100%';
    opt.size = opt.size || v.parent.clientWidth;
    v.szNum = opt.size < v.parent.clientWidth // 数値単位の撮像領域幅。ex.980
      ? opt.size : v.parent.clientWidth;
    v.szStr = v.parent.style.height = v.szNum + 'px'; // 文字列型の撮像領域幅。ex.980px

    v.step = 2; // video要素の生成
    v.video = createElement({tag:'video',style:{width:v.szStr,height:v.szStr}},v.parent);
    v.constraints = {
      audio: false, // 音声は使用しない
      video: {
        //facingMode: 'environment',
        width: v.szNum,
        height: v.szNum,
      },
    };
    const stream = await navigator.mediaDevices.getUserMedia(v.constraints);
    v.video.srcObject = stream;
    v.video.play();

    v.step = 3; // canvas要素の生成
    const { width, height } = v.constraints.video;
    v.canvas = new OffscreenCanvas(width, height);
    const context = v.canvas.getContext('2d');

    v.step = 4; // 定期的なスキャン実行
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