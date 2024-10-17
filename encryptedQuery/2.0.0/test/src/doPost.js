/* doPost Test
- dev環境だとアクセス権を求められるのでNG
- `curl -X`だと"Moved Temporarily"になる。`curl -L`で実行すること。

curl -L POST -H "Content-Type: application/json" -d '{"name":"太郎", "age":"30"}' https://script.google.com/macros/s/AKfycbzpcUibHetr8cOExObZUz8ukJ8bm6CAQSYoysgICX6AxtaGzwRXZfIR6YmvgOoEIILD/exec > test.html
*/
function doPost(e) {
  const v = {whois:'doPost',step:0,rv:{}};
  console.log(`${v.whois} start.`);
  try {

    v.params = JSON.parse(e.postData.getDataAsString());
    console.log(v.params);

    v.rv = {
      method: "POST",
      message: `doPost関数が呼ばれました(${toLocale(new Date())})`,
    };
    console.log(JSON.stringify(v.rv));

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    v.rv = {status:-1,message:e.message};
  } finally {
    return ContentService
    .createTextOutput(JSON.stringify(v.rv,null,2))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

//::$lib/createPassword/1.0.1/core.js::
//::$prj/encryptedQuery.js::
//::$prj/encryptedQueryServer.js::
//::$lib/SingleTable/1.2.1/core.js::
//::$lib/stringify/1.1.1/core.js::
//::$lib/toLocale/1.1.0/core.js::
//::$lib/vlog/1.1.0/core.js::
//::$lib/whichType/1.0.1/core.js::
//::$lib/cryptico/1.1.0/cryptico.min.gs::
