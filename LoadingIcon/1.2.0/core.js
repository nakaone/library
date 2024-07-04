/**
 * @classdesc 待機画面を表示する
 */
class LoadingIcon {
  /**
   * @constructor
   * @param {Object} [arg={}] - オプション
   * @param {HTMLElement} [arg.pattern='theSpinner23'] - デザインパターン(CSSのクラス名)
   *
   * - [CSS Loaders](https://css-loaders.com/bars/)
   */
  constructor(arg={}){
    const v = {whois:this.constructor.name+'.constructor',rv:true,step:0,
      css: { theSpinner23: `
        dialog.LoadingIcon {
          width: 400px; /* .loader width * 2 */
          aspect-ratio: 1;
          position: relative;
          outline: none;
          border: none;
        }
        dialog.LoadingIcon::backdrop {background:#fff}
        dialog.LoadingIcon > div {
          position: absolute;
          top: 50%;
          left: 50%;
          margin: -100px 0 0 -100px;
        }

        /* HTML: <div class="loader"></div> */
        .loader {
          width: 200px;   /* ここは修正 */
          aspect-ratio: 1;
          display: grid;
          border-radius: 50%;
          background:
            linear-gradient(0deg ,rgb(0 0 0/50%) 30%,#0000 0 70%,rgb(0 0 0/100%) 0) 50%/8% 100%,
            linear-gradient(90deg,rgb(0 0 0/25%) 30%,#0000 0 70%,rgb(0 0 0/75% ) 0) 50%/100% 8%;
          background-repeat: no-repeat;
          animation: l23 1s infinite steps(12);
        }
        .loader::before,
        .loader::after {
          content: "";
          grid-area: 1/1;
          border-radius: 50%;
          background: inherit;
          opacity: 0.915;
          transform: rotate(30deg);
        }
        .loader::after {
          opacity: 0.83;
          transform: rotate(60deg);
        }
        @keyframes l23 {
          100% {transform: rotate(1turn)}
        }
      `},
    };
    console.log(`${v.whois} start.\narg=${stringify(arg)}`);
  try {

      v.step = 1; // 事前準備：argの既定値設定
      if( !arg.hasOwnProperty('pattern') ) arg.pattern = 'theSpinner23';

      v.step = 2; // 待機画面要素の準備
      this.screen = document.querySelector('.'+this.constructor.name);
      if( this.screen === null ){
        this.screen = createElement({
          tag:'dialog',
          attr:{class:this.constructor.name},
          children:[{attr:{class:'loader '+arg.pattern}}],
        },'body');
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
  show = () => this.screen.showModal();

  /** 待機画面を隠蔽する */
  hide = () => this.screen.close();
}