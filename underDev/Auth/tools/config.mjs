import fs from 'node:fs';

/** config.mjs: config.jsonを読み込み、client/serverConfig.mjsを作成
 * -v:出力する変数名
 * -s:config.json内のセクション名
 * 
 * @example
 * ```config.json
 * {
 *   "common":{
 *     "adminMail":"ena.kaon@gmail.com",
 *     "adminName":"あどみ"
 *   },
 *   "client":{
 *     "api":"AKfycbw-n_isgCLvAEntGEX5Lpn4AUNaqpp3r1W0nVIGXFjNlEdsRB_ue4b9NRmNH_Em5IxT"
 *   },
 *   "server":{}
 * }
 * ```
 * 
 * cat $src/common/config.json | \
 * node config.mjs -v:config -s:common -s:client > $tmp/clientConfig.mjs
 * ```clientConfig.mjs
 * const clconfig = {
 *   "adminMail":"ena.kaon@gmail.com",
 *   "adminName":"あどみ"
 *   "api":"AKfycbw-n_isgCLvAEntGEX5Lpn4AUNaqpp3r1W0nVIGXFjNlEdsRB_ue4b9NRmNH_Em5IxT"
 * }
 * ```
 * 
 * cat $src/common/config.json | \
 * node config.mjs -v:config -s:common -s:server > $tmp/serverConfig.mjs
 * ```serverConfig.mjs
 * const svconfig = {
 *   "adminMail":"ena.kaon@gmail.com",
 *   "adminName":"あどみ"
 * }
 * ```
 */
const args = process.argv.slice(2);
let variableName = 'config';
const sections = [];

args.forEach(arg => {
  if (arg.startsWith('-v:')) {
    variableName = arg.split(':')[1];
  } else if (arg.startsWith('-s:')) {
    sections.push(arg.split(':')[1]);
  }
});

// 標準入力からデータを読み込む
async function main() {
  try {
    const input = fs.readFileSync(0, 'utf-8');
    if (!input.trim()) return;

    const fullConfig = JSON.parse(input);
    let resultConfig = {};

    // 指定されたセクションを順番にマージ
    sections.forEach(section => {
      if (fullConfig[section]) {
        resultConfig = { ...resultConfig, ...fullConfig[section] };
      }
    });

    // JavaScript形式で出力
    const jsonString = JSON.stringify(resultConfig, null, 2);
    process.stdout.write(`const ${variableName} = ${jsonString};\n`);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();