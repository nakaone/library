<a name="RasterImage"></a>

## RasterImage
ラスタ画像の操作

起動時オプション(opt.func)により、①画像の一括変換・圧縮、②スマホカメラでの撮影(含間欠撮影)、③QRコードスキャンを行う

**Kind**: global class  

* [RasterImage](#RasterImage)
    * [new RasterImage(opt)](#new_RasterImage_new)
    * [.bulkCompress](#RasterImage+bulkCompress) ⇒ <code>null</code> \| <code>Error</code>
    * [.compress](#RasterImage+compress) ⇒
    * [.download](#RasterImage+download) ⇒ <code>null</code> \| <code>Error</code>
    * [.imagesize](#RasterImage+imagesize) ⇒ <code>Promise</code>

<a name="new_RasterImage_new"></a>

### new RasterImage(opt)
**Returns**: <code>null</code> \| <code>Error</code> - #### 参考

- GitHub [Compressor.js Options](https://github.com/fengyuanchen/compressorjs#options)
- [【JavaScript】ブラウザ画面にドラッグ＆ドロップされた画像をimg要素で表示する](https://www.softel.co.jp/blogs/tech/archives/5679)
- DnDで複数ファイルをアップロード [画像ファイルアップロード | プレビュー,DnD](https://amaraimusi.sakura.ne.jp/note_prg/JavaScript/file_note.html)  

| Param | Type |
| --- | --- |
| opt | <code>\*</code> | 

<a name="RasterImage+bulkCompress"></a>

### rasterImage.bulkCompress ⇒ <code>null</code> \| <code>Error</code>
画像(複数)がドロップされた際の処理

```
// ドロップ領域のイベントとして定義。以下は定義例
document.querySelector('div.dropArea').addEventListener('drop',(e)=>{
  e.stopPropagation();
  e.preventDefault();
  v.onDrop(e.dataTransfer.files);
});
document.querySelector('div.dropArea').addEventListener('dragover',(e)=>{
  e.preventDefault();
});
```

#### 参考

- [ブラウザ上で HEIC/HEIF を PNG/JPEG に変換する方法](https://zenn.dev/seya/articles/5faa498604a63e)

**Kind**: instance property of [<code>RasterImage</code>](#RasterImage)  

| Param | Type |
| --- | --- |
| files | <code>ProgressEvent</code> | 

<a name="RasterImage+compress"></a>

### rasterImage.compress ⇒
画像ファイルを圧縮

**Kind**: instance property of [<code>RasterImage</code>](#RasterImage)  
**Returns**: #### 参考

- GitHub [Compressor.js Options](https://github.com/fengyuanchen/compressorjs#options)
- [Callback to Async Await](https://stackoverflow.com/questions/49800374/callback-to-async-await)  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>File</code> | 圧縮対象ファイル |
| opt | <code>Object</code> | compressorのオプション |

<a name="RasterImage+download"></a>

### rasterImage.download ⇒ <code>null</code> \| <code>Error</code>
ファイル(Blob)のダウンロード

**Kind**: instance property of [<code>RasterImage</code>](#RasterImage)  
**Returns**: <code>null</code> \| <code>Error</code> - #### 参考

- [ファイルをダウンロード保存する方法](https://javascript.keicode.com/newjs/download-files.php)  

| Param | Type | Description |
| --- | --- | --- |
| blob | <code>Blob</code> | ダウンロード対象のBlob |

<a name="RasterImage+imagesize"></a>

### rasterImage.imagesize ⇒ <code>Promise</code>
画像ファイルのサイズをチェックする

**Kind**: instance property of [<code>RasterImage</code>](#RasterImage)  
**Returns**: <code>Promise</code> - - width,heightをメンバとして持つオブジェクト

#### 参考

- [JavaScript で File オブジェクトの画像のサイズを取得する方法](https://gotohayato.com/content/519/)  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>File</code> | 画像ファイル |

