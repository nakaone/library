const fs = require('fs');
const v = {rex:[
  {m:/^(20\d{2})(\d{2})\.pdf$/,f:x=>{return {type:'AMEX',year:x[1],month:x[2]};}},
  {m:/^(20\d{2})(\d{2})(\d{2})_400_000\.pdf$/,f:x=>{return {type:'YFP税務顧問報酬',year:x[1],month:x[2]};}},
  {m:/^(20\d{2})(\d{2})(\d{2})_400_003\.pdf$/,f:x=>{return {type:'YFP記帳代行報酬',year:x[1],month:x[2]};}},
  {m:/^Amazon.+ 注文番号 (\d{3}\-\d{7}\-\d{7})\.pdf$/,f:x=>{return {type:'Amazon',orderId:x[1]}}},
  {m:/^EF(20\d{2})(\d{2})\.pdf$/,f:x=>{return {type:'恵比寿',year:x[1],month:x[2]}}},
  {m:/^CK(20\d{2})(\d{2})\.pdf$/,f:x=>{return {type:'上池袋',year:x[1],month:x[2]}}},
  {m:/^HS(20\d{2})(\d{2})\.pdf$/,f:x=>{return {type:'羽沢',year:x[1],month:x[2]}}},
  {m:/^MUFG(\d{2})(\d{2})\.pdf$/,f:x=>{return {type:'MUFG',noteNumber:x[1],page:x[2]}}},
  {m:/^SMBC(\d{2})(\d{2})\.pdf$/,f:x=>{return {type:'SMBC',noteNumber:x[1],page:x[2]}}},
  {m:/^note(20\d{2})(\d{2})\.pdf$/,f:x=>{return {type:'確証貼付ノート',fy:x[1],page:x[2]}}},
  {m:/^pension(20\d{2})(\d{2})\.pdf$$/,f:x=>{return {type:'健保・年金',year:x[1],month:x[2]}}},
  {m:/^RC\d{9}\.pdf$/,f:x=>{return {type:'モノタロウ'}}},
],unmatch:[]};

// 前世代のマスタ(old.json)を読み込み、v.masterとしてオブジェクト化
v.text = fs.readFileSync("current.json","utf-8");
v.master = JSON.parse(v.text);

for( v.x in v.master ){
  v.o = v.master[v.x];
  v.o.analysis = null;
  for( v.i=0 ; v.i<v.rex.length && v.o.analysis === null ; v.i++ ){
    v.m = v.o.name.match(v.rex[v.i].m);
    if( v.m ){
      v.o.analysis = v.rex[v.i].f(v.m);
    }
  }
  //console.log(`${v.o.name} -> ${JSON.stringify(v.o.analysis)}`);
  if( v.o.analysis === null ) v.unmatch.push(v.o.name);
}

console.log(v.unmatch.join('\n'));