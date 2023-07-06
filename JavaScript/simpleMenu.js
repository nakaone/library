class simpleMenu {
  constructor(conf){
    console.log('simpleMenu constructor start.');
    const v = {};

  }

  #setDefault(arg){
    const df = {
      header: { // querySelector(.simpleMenu div[name="header"])
        style: { // Element.style.xxx。xxxはJavaScriptで指定する場合の名称
          backgroundColor: "#81d8d0",
          color: "#fff",
          fontSize: "1.6rem",
          fontWeight: 900,  // 文字の太さ
          zIndex: 1,
        },  // Element.xxx
        innerHTML: null,  // <img><span>等、htmlで指定の場合使用
      },
      menuIcon: {
        style: {
          backgroundColor: "#5bb3b5",  // ハンバーガーメニューの色

        }
      },
      nav: {
        backgroundColor: "#81d8d0",
        color: "#fff",
        size: "1rem",
        weight: 400, // normal
      }
    };

  }


  static toggle(){
    console.log('simpleMenu toggle start.');
  }
}
