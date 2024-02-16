function SingleTableTestDump(obj){
  console.log(`Result: className=${obj.className}, name=${obj.name}, type=${obj.type}`
  + `\ntop=${obj.top}, left=${obj.left}, bottom=${obj.bottom}, right=${obj.right}`
  + `\nheader=${JSON.stringify(obj.header)}`
  + `\ndata=${JSON.stringify(obj.data)}`
  + `\nraw=${JSON.stringify(obj.raw)}`);
}
