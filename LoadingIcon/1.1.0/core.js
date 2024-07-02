/**
 * @classdesc 待機画面を表示する
 */
class LoadingIcon {
  /**
   * @constructor
   * @param {Object} [arg={}] - オプション
   * @param {HTMLElement} [arg.pattern='loading5'] - デザインパターン(CSSのクラス名)
   *
   * - [ローディングアイコン集](https://projects.lukehaas.me/css-loaders/)
   * - [CSSで全画面オーバーレイを実装する方法＆コード例](https://pisuke-code.com/css-fullscreen-overlay/)
   */
  constructor(arg={}){
    const v = {whois:this.constructor.name+'.constructor',rv:true,step:0,
      css: {
        loading5: `
          .LoadingIcon.act {
            position: absolute;
            left: 0; top: 0;
            width: 100%; height:100vh;
            background: #fff;
            z-index: 2147483647;
            display: grid;
            place-items: center;
          }
          .LoadingIcon {
            display: none;
          }
          .loading5 {
            --dot-size: 4rem;
            --R: 0;
            --G: 0;
            --B: 0;
            --back: rgba(var(--R),var(--G),var(--B),1);
            --pale: rgba(var(--R),var(--G),var(--B),0.2);
            --middle: rgba(var(--R),var(--G),var(--B),0.5);
            --dark: rgba(var(--R),var(--G),var(--B),0.7);
            --m0: calc(var(--dot-size) * 0.8); /* 軌道の大きさ */
            --m1: calc(var(--m0) * -2.6);
            --m2: calc(var(--m0) * -1.8);
            --m3: calc(var(--m0) * 1.75);
            --m4: calc(var(--m0) * 1.8);
            --m5: calc(var(--m0) * 2.5);

            margin: 100px auto;
            font-size: 25px;
            width: var(--dot-size);
            height: var(--dot-size);
            border-radius: 50%;
            position: relative;
            text-indent: -9999em;
            -webkit-animation: load5 1.1s infinite ease;
            animation: load5 1.1s infinite ease;
            -webkit-transform: translateZ(0);
            -ms-transform: translateZ(0);
            transform: translateZ(0);
          }
          @-webkit-keyframes load5 {
            0%,
            100% {box-shadow:
              0em var(--m1) 0em 0em var(--back),
              var(--m4) var(--m2) 0 0em var(--pale),
              var(--m5) 0em 0 0em var(--pale),
              var(--m3) var(--m3) 0 0em var(--pale),
              0em var(--m5) 0 0em var(--pale),
              var(--m2) var(--m4) 0 0em var(--pale),
              var(--m1) 0em 0 0em var(--middle),
              var(--m2) var(--m2) 0 0em var(--dark);
            }
            12.5% {
              box-shadow: 0em var(--m1) 0em 0em var(--dark), var(--m4) var(--m2) 0 0em var(--back), var(--m5) 0em 0 0em var(--pale), var(--m3) var(--m3) 0 0em var(--pale), 0em var(--m5) 0 0em var(--pale), var(--m2) var(--m4) 0 0em var(--pale), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--middle);
            }
            25% {
              box-shadow: 0em var(--m1) 0em 0em var(--middle), var(--m4) var(--m2) 0 0em var(--dark), var(--m5) 0em 0 0em var(--back), var(--m3) var(--m3) 0 0em var(--pale), 0em var(--m5) 0 0em var(--pale), var(--m2) var(--m4) 0 0em var(--pale), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--pale);
            }
            37.5% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--middle), var(--m5) 0em 0 0em var(--dark), var(--m3) var(--m3) 0 0em var(--back), 0em var(--m5) 0 0em var(--pale), var(--m2) var(--m4) 0 0em var(--pale), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--pale);
            }
            50% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--pale), var(--m5) 0em 0 0em var(--middle), var(--m3) var(--m3) 0 0em var(--dark), 0em var(--m5) 0 0em var(--back), var(--m2) var(--m4) 0 0em var(--pale), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--pale);
            }
            62.5% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--pale), var(--m5) 0em 0 0em var(--pale), var(--m3) var(--m3) 0 0em var(--middle), 0em var(--m5) 0 0em var(--dark), var(--m2) var(--m4) 0 0em var(--back), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--pale);
            }
            75% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--pale), var(--m5) 0em 0 0em var(--pale), var(--m3) var(--m3) 0 0em var(--pale), 0em var(--m5) 0 0em var(--middle), var(--m2) var(--m4) 0 0em var(--dark), var(--m1) 0em 0 0em var(--back), var(--m2) var(--m2) 0 0em var(--pale);
            }
            87.5% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--pale), var(--m5) 0em 0 0em var(--pale), var(--m3) var(--m3) 0 0em var(--pale), 0em var(--m5) 0 0em var(--pale), var(--m2) var(--m4) 0 0em var(--middle), var(--m1) 0em 0 0em var(--dark), var(--m2) var(--m2) 0 0em var(--back);
            }
          }
          @keyframes load5 {
            0%,
            100% {
              box-shadow: 0em var(--m1) 0em 0em var(--back), var(--m4) var(--m2) 0 0em var(--pale), var(--m5) 0em 0 0em var(--pale), var(--m3) var(--m3) 0 0em var(--pale), 0em var(--m5) 0 0em var(--pale), var(--m2) var(--m4) 0 0em var(--pale), var(--m1) 0em 0 0em var(--middle), var(--m2) var(--m2) 0 0em var(--dark);
            }
            12.5% {
              box-shadow: 0em var(--m1) 0em 0em var(--dark), var(--m4) var(--m2) 0 0em var(--back), var(--m5) 0em 0 0em var(--pale), var(--m3) var(--m3) 0 0em var(--pale), 0em var(--m5) 0 0em var(--pale), var(--m2) var(--m4) 0 0em var(--pale), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--middle);
            }
            25% {
              box-shadow: 0em var(--m1) 0em 0em var(--middle), var(--m4) var(--m2) 0 0em var(--dark), var(--m5) 0em 0 0em var(--back), var(--m3) var(--m3) 0 0em var(--pale), 0em var(--m5) 0 0em var(--pale), var(--m2) var(--m4) 0 0em var(--pale), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--pale);
            }
            37.5% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--middle), var(--m5) 0em 0 0em var(--dark), var(--m3) var(--m3) 0 0em var(--back), 0em var(--m5) 0 0em var(--pale), var(--m2) var(--m4) 0 0em var(--pale), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--pale);
            }
            50% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--pale), var(--m5) 0em 0 0em var(--middle), var(--m3) var(--m3) 0 0em var(--dark), 0em var(--m5) 0 0em var(--back), var(--m2) var(--m4) 0 0em var(--pale), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--pale);
            }
            62.5% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--pale), var(--m5) 0em 0 0em var(--pale), var(--m3) var(--m3) 0 0em var(--middle), 0em var(--m5) 0 0em var(--dark), var(--m2) var(--m4) 0 0em var(--back), var(--m1) 0em 0 0em var(--pale), var(--m2) var(--m2) 0 0em var(--pale);
            }
            75% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--pale), var(--m5) 0em 0 0em var(--pale), var(--m3) var(--m3) 0 0em var(--pale), 0em var(--m5) 0 0em var(--middle), var(--m2) var(--m4) 0 0em var(--dark), var(--m1) 0em 0 0em var(--back), var(--m2) var(--m2) 0 0em var(--pale);
            }
            87.5% {
              box-shadow: 0em var(--m1) 0em 0em var(--pale), var(--m4) var(--m2) 0 0em var(--pale), var(--m5) 0em 0 0em var(--pale), var(--m3) var(--m3) 0 0em var(--pale), 0em var(--m5) 0 0em var(--pale), var(--m2) var(--m4) 0 0em var(--middle), var(--m1) 0em 0 0em var(--dark), var(--m2) var(--m2) 0 0em var(--back);
            }
          }
        `,
      },
    };
    console.log(`${v.whois} start.\narg=${stringify(arg)}`);
  try {

      v.step = 1; // 事前準備：argの既定値設定
      if( !arg.hasOwnProperty('pattern') ) arg.pattern = 'loading5';

      v.step = 2; // 待機画面要素の準備
      this.screen = document.querySelector('.'+this.constructor.name);
      if( this.screen === null ){
        this.screen = createElement({attr:{class:this.constructor.name},children:[
          {attr:{class:arg.pattern},text:'loading...'}
        ]},'body');
        if( this.screen instanceof Error ) throw this.screen;
      }

      v.step = 3; // styleの準備
      if( document.querySelector(`style[name="${this.constructor.name}_${arg.pattern}"]`) === null ){
        v.r = createElement({
          tag: 'style',
          attr: {type:'text/css',name:`${this.constructor.name}_${arg.pattern}"]`},
          text: v.css[arg.pattern].replaceAll(/\n/g,'').replaceAll(/\s+/g,' '),
        },'head');
      }

      v.step = 9; // 終了処理
      this.hide();
      console.log(`${v.whois} normal end.\nv.rv=${stringify(v.rv)}`);
      return v.rv;
  
    } catch(e) {
      e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${stringify(v)}`);
      return e;
    }
  }

  /** 待機画面を表示する */
  show = () => {
    this.screen.classList.add('act');
  }

  /** 待機画面を隠蔽する */
  hide = () => {
    this.screen.classList.remove('act');
  }
}
