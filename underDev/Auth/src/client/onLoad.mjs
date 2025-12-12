export async function onLoad(){
  auth = authClient.initialize({
    adminMail: 'ena.kaon@gmail.com',
    adminName: 'あどみ',
    api: 'abcdefghijklmnopqrstuvwxyz',
  });
  console.log('onLoad running');
}
