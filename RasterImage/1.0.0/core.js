class RasterImage extends BasePage {
  /**
   * @constructor
   * @param {*} opt
   * @returns {null|Error}
   *
   * #### 参考
   *
   * - GitHub [Compressor.js Options](https://github.com/fengyuanchen/compressorjs#options)
   * - [【JavaScript】ブラウザ画面にドラッグ＆ドロップされた画像をimg要素で表示する](https://www.softel.co.jp/blogs/tech/archives/5679)
   * - DnDで複数ファイルをアップロード [画像ファイルアップロード | プレビュー,DnD](https://amaraimusi.sakura.ne.jp/note_prg/JavaScript/file_note.html)
   */
  constructor(opt){
    const v = {whois:'RasterImage.constructor',rv:null,step:0,def:{
      parent: 'body',
      compressor: { // compressor.jsオプションの既定値
        maxWidth: 640,
        maxHeight: 640,
        quality: 0.80,
        mimeType: 'image/webp',
      },
      files: [],  // {File[]} - DnDされたファイルオブジェクトの配列
      thumbnail: '200px', // サムネイルの最大サイズ
      css: [
        /* preview用 */`
        .tooltip {
          position: absolute;
          z-index: 10;
          visibility: hidden;
          background-color: rgba(255,255,255,0.8);
          font-size: 0.7rem;
          padding: 0.5rem;
          line-height: 1rem;
        }
      `],
      html: [
        {tag:'div',attr:{class:'tooltip'}}
      ],
    }};
    console.log(v.whois+' start.',opt);
    try {
      super(v.def,opt);
      this.changeScreen('multi');

      v.step = 99; // 終了処理
      console.log(v.whois+' normal end.\n',v.rv);

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 画像(複数)がドロップされた際の処理
   * @param {ProgressEvent} files
   * @returns {null|Error}
   */
  onDrop = async (files,opt=this.compressor) => {
    const v = {whois:this.className+'.onDrop',rv:null,step:0};
    console.log(v.whois+' start.',files,opt);
    try {

      v.step = 1; // zipを生成
      this.zip = new JSZip();

      for( v.i=0 ; v.i<files.length ; v.i++ ){
        v.step = 2; // DnDされたファイルを順次処理
        // 変換前はthis.files[n].origin, 変換後はthis.files[n].compressで参照可
        v.step = 2.1; // 変換前をoriginに保存
        v.file = {origin:files[v.i]};
        v.step = 2.2; // 変換後をcompressに保存
        v.file.compress = await this.compress(files[v.i],opt);
        console.log(v.file);
        v.step = 2.3; // 圧縮比率計算
        v.file.compress.ratio = v.file.compress.size / v.file.origin.size;
        v.step = 2.4; // 元画像のサイズを取得
        v.size = await this.imagesize(v.file.origin);
        v.file.origin.width = v.size.width;
        v.file.origin.height = v.size.height;
        v.step = 2.5; // 変換結果をメンバ変数に格納
        this.files.push(v.file);

        v.step = 3;
        // 圧縮されたファイルをzipに保存
        this.zip.file(v.file.compress.name,v.file.compress,{binary:true});
      }

      v.step = 4; // 終了処理
      v.rv = this.files;
      console.log(v.whois+' normal end.\n',this.files);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 画像ファイルを圧縮
   * @param {File} file - 圧縮対象ファイル
   * @param {Object} opt - compressorのオプション
   * @returns
   *
   * #### 参考
   *
   * - GitHub [Compressor.js Options](https://github.com/fengyuanchen/compressorjs#options)
   * - [Callback to Async Await](https://stackoverflow.com/questions/49800374/callback-to-async-await)
   */
  compress = (file,opt) => {
    return new Promise((resolve,reject) => {
      opt.success = resolve;
      opt.error = reject;
      new Compressor(file,opt);
    });
  }

  /** 指定要素にプレビュー画像を追加
   * @param {string|HTMLElement} parent - プレビュー画像を追加する要素
   * @param {Object} files - this.onDropで作成された原本・圧縮後ファイル
   * @returns {null|Error}
   */
  preview = (parent=this.parent,files=this.files) => {
    const v = {whois:this.className+'.preview',rv:null,step:0};
    console.log(v.whois+' start.',parent,files);
    try {

      v.step = 1; // CSSセレクタで指定された場合、HTMLElementに変換
      if( typeof parent === 'string' ){
        parent = document.querySelector(parent);
      }

      v.step = 2; // wrapperの作成
      v.wrapper = this.createElement({attr:{class:'wrapper'},style:{
        width: '100%',
        margin: '1rem',
        display: 'inline-block',
      }});
      parent.appendChild(v.wrapper);

      files.forEach(x => {

        this.createElement({
          tag:'img',
          attr:{src:URL.createObjectURL(x.compress)},
          style:{
            margin: '1rem',
            'max-width':this.thumbnail,
            'max-height':this.thumbnail,
          },
          event:{
            'mouseenter':(e)=>{
              console.log('mouseenter',e);
              e.stopPropagation();
              const tooltip = this.parent.querySelector('.tooltip');
              tooltip.innerHTML = x.compress.name
              + '</br>' + x.origin.width + 'x' + x.origin.height
              + ' (' + x.origin.size.toLocaleString() + 'bytes)'
              + '</br>-> ' + e.target.naturalWidth + 'x' + e.target.naturalHeight
              + ' (' + x.compress.size.toLocaleString()
              + 'bytes / ' + Math.round(x.compress.ratio*10000)/100 + '%)';
              tooltip.style.top = e.pageY + 'px';
              tooltip.style.left = e.pageX + 'px';
              tooltip.style.visibility = "visible";
            },
            'mouseleave':(e)=>{
              console.log('mouseleave',e);
              e.stopPropagation();
              const tooltip = this.parent.querySelector('.tooltip');
              tooltip.style.visibility = "hidden";
            },
          },
        },v.wrapper);
      });
      
      v.step = 99; // 終了処理
      console.log(v.whois+' normal end.\\n',v.rv);
      return v.rv;
  
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** ファイル(Blob)のダウンロード
   * @param {Blob} blob - ダウンロード対象のBlob
   * @returns {null|Error}
   *
   * #### 参考
   *
   * - [ファイルをダウンロード保存する方法](https://javascript.keicode.com/newjs/download-files.php)
   */
  download = async () => {
    const v = {whois:this.className+'.download',rv:null,step:0};
    console.log(v.whois+' start.');
    try {

      v.step = 1;  // Blob の取得
      v.blob = await this.zip.generateAsync({type:'blob'});

      v.step = 2; // ダウンロード
      const url = URL.createObjectURL(v.blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.download = 'RasterImage.zip';
      a.href = url;
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      v.step = 3; // 終了処理
      console.log(v.whois+' normal end.\\n',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /**
   * 画像ファイルのサイズをチェックする
   */
  imagesize = async (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const size = {
          width: img.naturalWidth,
          height: img.naturalHeight,
        };

        URL.revokeObjectURL(img.src);
        resolve(size);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = URL.createObjectURL(file);
    });
  }

}