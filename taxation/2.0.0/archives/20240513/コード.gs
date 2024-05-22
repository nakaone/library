function doGet(e) {
  return HtmlService.createTemplateFromFile("index.html").evaluate().setTitle("タイトル");
}

function GetBase64Image(fileId,param)
{
  var file = DriveApp.getFileById(fileId);
  //var blob = file.getBlob();
  //NG var blob = file.getAs('image/png');
  var blob = file.getAs('application/pdf');
  var contentType = 'application/pdf';
  //var contentType = blob.getContentType();
  var base64 = Utilities.base64Encode(blob.getBytes());
  var imageSrc = "data:" + contentType + ";base64, " + base64;

  return {"name":file.getName(),"id":fileId,"base64":imageSrc,"param":param};
}

function getList(){
  const v = {whois:'getList',rv:[],step:0};
  console.log(v.whois+' start.');
  try {

    v.step = 1; // 本スプレッドシートのIDを取得
    v.ssId = SpreadsheetApp.getActiveSpreadsheet().getId();
    console.log("%s step.%s : %s",v.whois,v.step,v.ssId);

    v.step = 2.1; // 親フォルダを取得
    v.parent = DriveApp.getFileById(v.ssId).getParents();
    console.log("%s step.%s : %s",v.whois,v.step,v.parent);
    v.step = 2.2;
    v.folderId = v.parent.next().getId();
    console.log("%s step.%s : %s",v.whois,v.step,v.folderId);
    v.step = 2.3;
    v.folder = DriveApp.getFolderById(v.folderId);
    console.log("%s step.%s : %s",v.whois,v.step,v.folder);

    v.step = 3; // フォルダ内のファイルを取得
    v.files = v.folder.getFiles();
    console.log("%s step.%s : %s",v.whois,v.step,v.files);

    v.step = 4; // 各ファイルの情報をオブジェクト化
    while( v.files.hasNext() ){
      v.file = v.files.next();
      v.obj = {
        name: v.file.getName(), // ファイル名
        //blob: v.file.getBlob(), // Blob
        desc: v.file.getDescription(),  // 説明
        dlURL : v.file.getDownloadUrl(),  // ダウンロードに使用するURL
        id: v.file.getId(), // ID
        lastUpdate: v.file.getLastUpdated(),
        mime: v.file.getMimeType(),
        size: v.file.getSize(), // バイト数。但しGoogle Doc/Spread等は0
        thumb: v.file.getThumbnail(), // サムネイル画像(Blob)
        url: v.file.getUrl(), // ファイルを開くURL
      };
      // GASでドライブの画像を表示する
      // https://blog.hikozaru.com/2022/05/gasdriveimage.html
      v.contentType = v.obj.thumb.getContentType();
      v.base64 = Utilities.base64Encode(v.obj.thumb.getBytes());
      v.obj.src = 'data:' + v.contentType + ';base64,' + v.base64;
      v.rv.push(v.obj);
    }

    v.step = 99; // 終了処理
    console.log(v.whois+' normal end.\n',v.rv);
    return v.rv;

  } catch(e){
    console.error(v.whois+' abnormal end(step.'+v.step+').',e,v);
    return e;
  }  
}