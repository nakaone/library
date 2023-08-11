/**
 * - Qiita [html＋javascriptだけで実装したシンプルなQRコードリーダー](https://qiita.com/murasuke/items/c16e4f15ac4436ed2744)
 */
async function scanQR(){
  const v = {
    constraints:{
      audio: false,
      video: {
        facingMode: 'environment',
        width: 500,
        height: 500,
      },
    },
    cnt:0, max:300, interval:300, rv:null,
    sleep: (sec) => {return new Promise(resolve => setTimeout(resolve,sec))},
  };
  try {
    const stream = await navigator.mediaDevices.getUserMedia(v.constraints);
    const video = document.querySelector('video');
    video.srcObject = stream;
    video.play();

    const { width, height } = v.constraints.video;
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d');

    console.log(v);
    do {

      context.drawImage(video, 0, 0, width, height);
      const imageData = context.getImageData(0, 0, width, height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      console.log(code);
      if (code) {
        document.querySelector('#result').textContent = code.data;
        console.log(v);
        v.rv = code.data;
      } else {
        document.querySelector('#result').textContent = '';
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