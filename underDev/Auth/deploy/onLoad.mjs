async function onLoad(){
  auth = new authClient();
  console.log('onLoad running');
}

export {devTools,authClient,authClientConfig,authConfig,localFunc};
