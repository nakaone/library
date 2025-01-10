function vlog(x,l=null){
  console.log(
    vlog.caller.name
    + ( l === null ? '' : (' l.'+l+' ') )
    + '\n'
    + JSON.stringify(x,(key,val)=>typeof val==='function'?val.toString():val,2)
  );
}