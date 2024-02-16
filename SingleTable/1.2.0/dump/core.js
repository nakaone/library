  /** SingleTableクラスメンバの値をダンプ表示 */
  dump(av=null){
    const v = {whois:this.className+'.dump',rv:null,step:0,colNo:1};
    console.log(`${v.whois} start.`);
    try {

      v.step = 1; // メンバの値
      v.msg = `member's value ----------`
      + `\nclassName=${this.className}, name=${this.name}, type=${this.type}`
      + `\ntop=${this.top}, left=${this.left}, bottom=${this.bottom}, right=${this.right}`
      + `\nheader=${JSON.stringify(this.header)}`
      + `\ndata=${JSON.stringify(this.data)}`
      + `\nraw=${JSON.stringify(this.raw)}`;

      v.step = 2; // vの値
      if( av !== null ){
        v.msg += `\n\nvariable's value ----------`
        + `\ntop=${av.top}, left=${av.left}, bottom=${av.bottom}, right=${av.right}`;
      }

      v.step = 3; // ダンプ
      console.log(v.msg);

      v.step = 2; // 終了処理
      console.log(`${v.whois} normal end.`);
      return v.rv;

    } catch(e) {
      e.message = `\n${v.whois} abnormal end at step.${v.step}\n${e.message}`;
      console.error(`${e.message}\nv=${JSON.stringify(v)}`);
      return e;
    }
  }
