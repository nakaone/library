async doGAS(func,...args){
  return await doGAS('authServer',this.userId,func,...args);
}
