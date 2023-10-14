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
      css: [`
        img {max-width:400px;max-height:400px}
        .multiInput {
          border: solid 5px #ccc;
          margin: 1rem;
          padding:2em;
          text-align:center;
        }
      `],
      html: [
        {attr:{class:'multi'},name:'multi',children:[
          {attr:{class:'multiInput'},text:'画像ファイルをドロップ(複数可)',event:{drop:(e)=>{
            e.stopPropagation();
            e.preventDefault();
            this.onDrop(e.dataTransfer.files);
          },dragover:(e)=>{
            e.preventDefault();
          }}},
        ]}
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
  onDrop = async (files) => {
    const v = {whois:this.className+'.onDrop',rv:null,step:0};
    console.log(v.whois+' start.',files);
    try {

      v.step = 1; // zipを生成
      this.zip = new JSZip();

      for( v.i=0 ; v.i<files.length ; v.i++ ){
        v.step = 2; // DnDされたファイルを順次処理
        // 変換前はthis.files[n].origin, 変換後はthis.files[n].compressで参照可
        v.step = 2.1; // 変換前をoriginに保存
        v.file = {origin:files[v.i]};
        v.step = 2.2; // 変換後をcompressに保存
        console.log(this.compressor);
        v.file.compress = await this.compress(files[v.i],this.compressor);
        console.log(v.file);
        v.step = 2.3; // 変換結果をメンバ変数に格納
        this.files.push(v.file);
        v.step = 2.4; // 圧縮比率計算
        v.file.compress.ratio = v.file.compress.size / v.file.origin.size;

        v.step = 3; // プレビュー表示
        this.createElement({style:{
          margin: '1rem',
          padding: '1rem',
          width:'80%',
          display:'grid',
          'grid-template-columns': '1fr 1fr',
          'grid-gap': '2rem',
        },children:[
          {style:{'font-size':'1.2rem'},text:v.file.origin.name},
          {style:{'font-size':'1.2rem'},text:v.file.compress.name},
          {tag:'img',attr:{src:URL.createObjectURL(v.file.origin)}},
          {tag:'img',attr:{src:URL.createObjectURL(v.file.compress)}},
          {style:{'text-align':'right'},text:v.file.origin.size+' bytes'},
          {style:{'text-align':'right'},text:v.file.compress.size+' bytes ('
          + Math.round(v.file.compress.ratio * 10000) / 100 + ' %)'},
          {text:v.file.origin.type},
          {text:v.file.compress.type},
        ]},this.multi);

        v.step = 4;
        // 圧縮されたファイルをzipに保存
        v.zip = this.zip.file(v.file.compress.name,v.file.compress,{binary:true});
      }

      v.step = 5; // zipファイルをダウンロード
      console.log(this.zip)
      v.blob = await this.zip.generateAsync({ type: 'blob' }); // Blob の取得
      v.rv = this.download(v.blob);
      if( v.rv instanceof Error ) throw v.rv;

      v.step = 6; // 終了処理
      console.log(v.whois+' normal end.\\n',this.files);
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

  /** ファイル(Blob)のダウンロード
   * @param {Blob} blob - ダウンロード対象のBlob
   * @returns {null|Error}
   *
   * #### 参考
   *
   * - [ファイルをダウンロード保存する方法](https://javascript.keicode.com/newjs/download-files.php)
   */
  download = (blob) => {
    const v = {whois:this.className+'.download',rv:null,step:0};
    console.log(v.whois+' start.');
    try {

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.download = 'RasterImage.zip';
      a.href = url;
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      v.step = 99; // 終了処理
      console.log(v.whois+' normal end.\\n',v.rv);
      return v.rv;

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }
}