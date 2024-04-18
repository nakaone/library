/** ユーザ情報をメンバに(再)設定する
 * @param {void}
 * @returns {void}
 */
#setUserInfo(){
  const str = sessionStorage.getItem(this.programId);
  this.user = JSON.parse(str);
}

async doGAS(func,...args){
  return await doGAS('authServer',this.user.userId,func,...args);
}
