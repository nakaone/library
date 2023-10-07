/**
 * @classdesc 待機画面を表示する
 */
class LoadingIcon {
  /**
   * @constructor
   * @param {HTMLElement|string} parent - 親要素またはそのCSSセレクタ
   * @param {Object} [opt={}] - オプション
   * @returns {true|Error}
   * 
   * - [ローディングアイコン集](https://projects.lukehaas.me/css-loaders/)
   * - [CSSで全画面オーバーレイを実装する方法＆コード例](https://pisuke-code.com/css-fullscreen-overlay/)
   */
  constructor(parent,opt={}){
    const v = {whois:'LoadingIcon.constructor',rv:true,step:0,
      default:{ // メンバ一覧、各種オプションの既定値、CSS/HTML定義
        parent: parent, // {HTMLElement} 親要素(ラッパー)
        parentSelector: null, // {string} 親要素(ラッパー)のCSSセレクタ
        screen: null, // 待機画面
        // CSS/HTML定義
        css:[
          /* LoadingIcon共通部分 */ `
          .LoadingIcon .LoadingIcon.act {
            position: absolute;
            left: 0; top: 0;
            width: 100%; height:100vh;
            background: #fff;
            z-index: 2147483647;
            display: grid;
            place-items: center;
          }
          .LoadingIcon .LoadingIcon {
            display: none;
          }`,
          /* pattern.5 */`
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
          }`,
        ],
        html:[  // イベント定義を複数回行わないようにするため、eventで定義
          {attr:{class:'LoadingIcon'},children:[
            {attr:{class:'loading5'},text:'loading...'}
          ]}
        ],
      },
    };
    console.log(v.whois+' start.',parent,opt);
    try {

      v.step = 1; // メンバの値セット、HTML/CSSの生成
      v.rv = setupInstance(this,opt,v.default);
      if( v.rv instanceof Error ) throw v.rv;

      // 待機画面をセット
      this.screen = this.wrapper.querySelector('.LoadingIcon');

      console.log(v.whois+' normal end.',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
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