/**
 * - Qiita [html＋javascriptだけで実装したシンプルなQRコードリーダー](https://qiita.com/murasuke/items/c16e4f15ac4436ed2744)
 * 
 * @typedef scanQRopt
 * @prop {number} [size=500] - ファインダのサイズ
 */
async function scanQR(parent,opt={}){
  const v = {
    constraints:{
      audio: false,
      video: {
        facingMode: 'environment',
        width: opt.size || 500,
        height: opt.size || 500,
      },
    },
    cnt:0, max:300, interval:300, rv:null,
    sleep: (sec) => {return new Promise(resolve => setTimeout(resolve,sec))},
  };
  try {
    // ファインダ領域の作成
    v.parent = document.querySelector(parent);
    v.video = createElement('video');
    v.parent.append(v.video);
    console.log(v);

    const stream = await navigator.mediaDevices.getUserMedia(v.constraints);
    //const video = document.querySelector('video');
    v.video.srcObject = stream;
    v.video.play();

    const { width, height } = v.constraints.video;
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d');

    console.log(v);
    do {

      context.drawImage(v.video, 0, 0, width, height);
      const imageData = context.getImageData(0, 0, width, height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      console.log(code);
      if (code) {
        //document.querySelector('#result').textContent = code.data;
        console.log(v);
        v.rv = code.data;
        // 終了処理
        v.video.srcObject.getVideoTracks().forEach((track) => {
          track.stop();
        });
        v.parent.innerHTML = ''; // 作業用DIVを除去
        //} else {
        //document.querySelector('#result').textContent = '';
      }

      await v.sleep(v.interval);
      console.log(v.cnt);
      v.cnt += 1;
    } while( v.rv === null && v.cnt < v.max );
    console.log(v.rv);
    return v.rv;
  } catch(error) {
    console.log('load error', error);
  }
};