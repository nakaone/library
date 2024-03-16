/**
 * @classdesc ラスタ画像の操作
 * 
 * 起動時オプション(opt.func)により、①画像の一括変換・圧縮、②スマホカメラでの撮影(含間欠撮影)、③QRコードスキャンを行う
 */
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
      func: 'bulk',
        // bulk:ローカル(PC)上の画像ファイルを一括変換、
        // camera: スマホのカメラで撮影した画像を圧縮
        // scanQR: QRコードをスマホのカメラで認識
      files: [],  // {File[]} - DnDされたファイルオブジェクトの配列
      thumbnail: 200, // サムネイルの最大サイズ
      css: [
        // ①画像の一括変換・圧縮(bulk)
        `.bulk .dropArea {
          margin: 1rem;
          padding: 2rem;
          border: solid 5px #ccc;
          text-align:center;
        }
        .bulk table {
          margin: 1rem;
        }`,
        // プレビュー領域
        `.preview {
          margin: 1rem;
        }
        .preview .image {
          display: 'inline-block',
        }
        .preview .info {
          font-size: 0.6rem;
        }`,
        // preview用ツールチップ。parent直下に設定。
        `.tooltip {
          position: absolute;
          z-index: 10;
          visibility: hidden;
          background-color: rgba(255,255,255,0.8);
          font-size: 0.7rem;
          padding: 0.5rem;
          line-height: 1rem;
        }`,
        // 以下未作成
        // ②スマホカメラでの撮影(camera)
        // ③QRコードスキャン(scanQR)
      ],
      html: [
        {tag:'div',attr:{class:'tooltip'}}, // tooltip用
        // 1.画像の一括変換・圧縮(bulk)
        {name:'bulk',attr:{class:'bulk'},children:[
          // 1.1.ドロップ領域
          {attr:{class:'dropArea'},text:'画像ファイルをドロップ(複数可)',event:{
            drop:(e)=>{
              e.stopPropagation();
              e.preventDefault();
              this.bulkCompress(e.dataTransfer.files);        
            },
            dragover:(e)=>e.preventDefault(),
          }},
          // 1.2.圧縮仕様の指定領域
          {attr:{class:'specification'},children:[
            {tag:'table',children:[
              {tag:'tr',attr:{name:'mimeType'},children:[
                {tag:'th',text:'画像形式'},
                {tag:'td',children:[
                  {tag:'select',children:[
                    {tag:'option',attr:{value:'image/webp'},text:'webp'},
                    {tag:'option',attr:{value:'image/png'},text:'png'},
                    {tag:'option',attr:{value:'image/jpeg'},text:'jpeg'},
                    {tag:'option',attr:{value:'image/gif'},text:'gif'},
                  ]}
                ]},
                {tag:'td',text:''}
              ]},
              {tag:'tr',attr:{name:'standard'},children:[
                {tag:'th',text:'画像サイズ'},
                {tag:'td',children:[
                  {tag:'select',children:[
                    {tag:'option',attr:{value:'-1'},text:'原寸'},
                    {tag:'option',attr:{value:'7680'},text:'8K(7680)'},
                    {tag:'option',attr:{value:'3840'},text:'4K(3840)'},
                    {tag:'option',attr:{value:'1920'},text:'FullHD(1920)'},
                    {tag:'option',attr:{value:'1280'},text:'HDTV(1280)'},
                    {tag:'option',attr:{value:'1024'},text:'XGA(1024)'},
                    {tag:'option',attr:{value:'800'},text:'SVGA(800)'},
                    {tag:'option',attr:{value:'640'},logical:{selected:true},text:'VGA(640)'},
                    {tag:'option',attr:{value:'320'},text:'QuarterVGA(320)'},
                    {tag:'option',attr:{value:'-2'},text:'custom'},
                  ],event:{
                    change:(e)=>{
                      console.log(e.target.value);
                      let max = this.bulk.querySelector('[name="maxSize"]');
                      let maxi = max.querySelector('input');
                      let min = this.bulk.querySelector('[name="minSize"]');
                      let mini = min.querySelector('input');
                      if( e.target.value == -2 ){
                        // カスタム選択時
                        max.classList.remove('hide'); // 最大高/幅欄を表示
                        min.classList.remove('hide'); // 最小高/幅欄を表示
                        maxi.defaultValue = 640;  // 既定値を再セット
                        mini.defaultValue = 320;
                      } else {
                        // それ以外の選択肢
                        max.classList.add('hide'); // 最大高/幅欄を非表示
                        min.classList.add('hide'); // 最小高/幅欄を非表示
                        if( e.target.value == -1 ){
                          // 原寸大の場合
                          maxi.defaultValue = 999999; // "Infinity" cannot be parsed
                          mini.defaultValue = 0;
                        } else {
                          // 原寸大以外
                          maxi.defaultValue = e.target.value; // 選択された値をセット
                        }
                      }
                    }
                  }}
                ]},
                {tag:'td',text:'原画縦横比を保持するので規格名は目安'}
              ]},
              {tag:'tr',attr:{name:'maxSize',class:'hide'},children:[
                {tag:'th',text:'最大高/幅'},
                {tag:'td',children:[
                  {tag:'input',attr:{type:'number',value:640},style:{width:'50px'}}
                ]},
                {tag:'td',text:'無指定の場合は"-1"を入力'}
              ]},
              {tag:'tr',attr:{name:'minSize',class:'hide'},children:[
                {tag:'th',text:'最小高/幅'},
                {tag:'td',children:[
                  {tag:'input',attr:{type:'number',value:320},style:{width:'50px'}}
                ]},
                {tag:'td',text:'無指定の場合は"-1"を入力'}
              ]},
              {tag:'tr',attr:{name:'checkOrientation'},children:[
                {tag:'th',text:'画像の向き'},
                {tag:'td',children:[
                  {tag:'select',children:[
                    {tag:'option',attr:{value:true},text:'補正する'},
                    {tag:'option',attr:{value:false},text:'補正しない'},
                  ]}
                ]},
                {tag:'td',text:'Exif Orientationに基づく。Jpegのみ有効'}
              ]},
              {tag:'tr',attr:{name:'retainExif'},children:[
                {tag:'th',text:'Exif情報'},
                {tag:'td',children:[
                  {tag:'select',children:[
                    {tag:'option',attr:{value:false},text:'保持しない'},
                    {tag:'option',attr:{value:true},text:'保持する'},
                  ]}
                ]},
                {tag:'td',text:'圧縮後もExifを保持するかの指定'}
              ]},
              {tag:'tr',attr:{name:'quality'},children:[
                {tag:'th',text:'品質'},
                {tag:'td',children:[
                  {tag:'input',attr:{type:'number',value:0.8},style:{width:'50px'}}
                ]},
                {tag:'td',html:'0(圧縮大)〜1(無圧縮)の小数。推奨値は最低0.6。<br/>既定値はjpeg:0.92,webp:0.80。'}
              ]},
            ]}
          ]},
        ]},
        // 1.3.プレビュー領域
        {name:'preview',attr:{class:'preview'},children:[
          {attr:{name:'ctrl'},children:[
            {tag:'button',text:'download zip file'}
          ]},
          {attr:{name:'image'}},
        ]},

        // 以降未作成
        // 2.スマホカメラでの撮影(camera)
        // 3.QRコードスキャン(scanQR)
      ],
    }};
    console.log(v.whois+' start.',opt);
    try {
      super(v.def,opt);

      // プレビュー領域ダウンロードボタンの動作定義
      // ※ v.defで定義しようとすると以下のメッセージが出て不可
      // ReferenceError: Must call super constructor in derived class
      // before accessing 'this' or returning from derived constructor
      this.preview.querySelector('button').addEventListener('click',this.download);

      v.step = 1; // 終了処理
      this.changeScreen(this.func);
      console.log(v.whois+' normal end.\n',v.rv);

    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
      return e;
    }
  }

  /** 画像(複数)がドロップされた際の処理
   * 
   * ```
   * // ドロップ領域のイベントとして定義。以下は定義例
   * document.querySelector('div.dropArea').addEventListener('drop',(e)=>{
   *   e.stopPropagation();
   *   e.preventDefault();
   *   v.onDrop(e.dataTransfer.files);
   * });
   * document.querySelector('div.dropArea').addEventListener('dragover',(e)=>{
   *   e.preventDefault();
   * });
   * ```
   * 
   * #### 参考
   * 
   * - [ブラウザ上で HEIC/HEIF を PNG/JPEG に変換する方法](https://zenn.dev/seya/articles/5faa498604a63e)
   * 
   * @param {ProgressEvent} files
   * @returns {null|Error}
   */
  bulkCompress = async (files) => {
    const v = {whois:this.className+'.bulkCompress',rv:null,step:0};
    console.log(v.whois+' start.',files);
    try {

      // ------------------------------
      // 1. 前処理
      // ------------------------------
      v.step = 1;
      this.changeScreen('loading');
      this.zip = new JSZip(); // zipを生成

      // ------------------------------
      // 2. compress.jsのオプションを取得
      // ------------------------------
      v.step = 2;
      v.o = this.bulk.querySelector('.specification');
      v.opt = {
        mimeType: v.o.querySelector('[name="mimeType"] select').value,
        checkOrientation: v.o.querySelector('[name="checkOrientation"] select').value,
        retainExif: v.o.querySelector('[name="retainExif"] select').value,
        quality: v.o.querySelector('[name="quality"] input').value,
      }
      v.max = v.o.querySelector('[name="maxSize"] input').value;
      v.opt.maxHeight = v.opt.maxWidth = (v.max == -1 ? Infinity : v.max);
      v.min = v.o.querySelector('[name="minSize"] input').value;
      v.opt.minHeight = v.opt.minWidth = (v.min == -1 ? 0 : v.min);
      v.opt.error = (e) => {
        alert("'"+''+"'は非対応の画像形式です",e);
        console.error('l.244',e);
        return e;
      };

      for( v.i=0 ; v.i<files.length ; v.i++ ){
        // ------------------------------
        // 3. DnDされたファイルを順次圧縮
        // ------------------------------
        // 変換前はthis.files[n].origin, 変換後はthis.files[n].compressで参照可
        v.step = 3.1; // 変換前をoriginに保存
        v.file = {origin:files[v.i]};

        v.step = 3.2; // HEIC形式はjpegに変換
        if (v.file.origin.type === 'image/heif' || v.file.origin.type === 'image/heic') {
          v.name = v.file.origin.name;
          v.file.origin = await heic2any({
            blob: v.file.origin,
            toType: 'image/jpeg',
          });
          v.file.origin.name = v.name;
          console.log('%s step.%s',v.whois,v.step,v.file.origin);
        }

        v.step = 3.3; // 変換後をcompressに保存
        v.file.compress = await this.compress(v.file.origin,v.opt).catch(e=>{
          return e;
        });
        if( v.file.compress instanceof Error ){
          v.step = 3.4;
          // 圧縮に失敗した場合、エラー画像表示
          this.createElement({style:{
            display: 'inline-block',
            'vertical-align':'top',
            margin:'1rem',
            width: (this.thumbnail - 30) + 'px',
            height: (this.thumbnail * 0.75 - 30) + 'px',
            border: 'solid 5px #ccc',
            padding: '10px',
          },html:'Error: '+v.file.origin.name+'<br>'+'※画像形式非対応'}
          ,this.preview.querySelector('[name="image"]'));
          console.error(v.file.compress);
          continue;
        }
        v.step = 3.5; // 圧縮比率計算
        v.file.compress.ratio = v.file.compress.size / v.file.origin.size;
        v.step = 3.6; // 画像のサイズを取得
        v.size = await this.imagesize(v.file.origin);
        v.file.origin.width = v.size.width;
        v.file.origin.height = v.size.height;
        v.size = await this.imagesize(v.file.compress);
        v.file.compress.width = v.size.width;
        v.file.compress.height = v.size.height;
        v.step = 3.7; // 変換結果をメンバ変数に格納
        this.files.push(v.file);

        // ------------------------------
        // 4. 圧縮されたファイルをzipに保存
        // ------------------------------
        v.step = 4;
        this.zip.file(v.file.compress.name,v.file.compress,{binary:true});

        // ------------------------------
        // 5. プレビュー画像を追加
        // ------------------------------
        v.step = 5;
        console.log("%s step.%s",v.whois,v.step,v.file);
        this.createElement({
          style:{display:'inline-block','vertical-align':'top'},
          children:[{
            tag:'img',
            attr:{src:URL.createObjectURL(v.file.compress)},
            style:{
              margin: '1rem',
              'max-width':this.thumbnail + 'px',
              'max-height':this.thumbnail + 'px',
            },
            /* 不適切な内容が表示されるためペンディング
            event:{
              // tooltipに情報表示
              'mouseenter':(e)=>{
                console.log('mouseenter',e,v.file);
                e.stopPropagation();
                const tooltip = this.parent.querySelector('.tooltip');
                tooltip.innerHTML = v.file.compress.name
                + '</br>' + v.file.origin.width + 'x' + v.file.origin.height
                + ' (' + v.file.origin.size.toLocaleString() + 'bytes)'
                + '</br>-> ' + e.target.naturalWidth + 'x' + e.target.naturalHeight
                + ' (' + v.file.compress.size.toLocaleString()
                + 'bytes / ' + Math.round(v.file.compress.ratio*10000)/100 + '%)';
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
            */
          },
          {style:{margin:'1rem'},children:[
            {tag:'p',attr:{class:'info'},text:v.file.origin.name},
            {tag:'table',attr:{class:'info'},children:[
              {tag:'tr',children:[
                {tag:'th'},{tag:'th',text:'before'},{tag:'th',text:'after'}
              ]},
              {tag:'tr',children:[
                {tag:'th',text:'width'},
                {tag:'td',attr:{class:'num'},text:v.file.origin.width},
                {tag:'td',attr:{class:'num'},text:v.file.compress.width},
              ]},
              {tag:'tr',children:[
                {tag:'th',text:'height'},
                {tag:'td',attr:{class:'num'},text:v.file.origin.height},
                {tag:'td',attr:{class:'num'},text:v.file.compress.height},
              ]},
              {tag:'tr',children:[
                {tag:'th',text:'size'},
                {tag:'td',attr:{class:'num'},text:v.file.origin.size.toLocaleString()},
                {tag:'td',attr:{class:'num'},html:v.file.compress.size.toLocaleString()
                  + '<br/>' + Math.round(v.file.compress.ratio*10000)/100 + '%'
                },
              ]},
            ]},
          ]}
        ]},this.preview.querySelector('[name="image"]'));

      }

      // ------------------------------
      // 6. 終了処理
      // ------------------------------
      v.step = 6;
      this.changeScreen('preview');
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
   * @returns {null|Error}
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

  /** 画像ファイルのサイズをチェックする
   * @param {File} file - 画像ファイル
   * @returns {Promise} - width,heightをメンバとして持つオブジェクト
   * 
   * #### 参考
   * 
   * - [JavaScript で File オブジェクトの画像のサイズを取得する方法](https://gotohayato.com/content/519/)
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