/** サーバ側GASの指定関数を実行、結果を取得
 * 
 * - [GASのgoogle.script.runをPromise化する](https://www.330k.info/essay/gas_google_script_run_convert_promise/)
 * 
 * @exsample
 * 
 * <pre><code>
 * (async ()=> {
 *   const result1 = await doGAS('doSomething1');
 *   const result2 = await doGAS('doSomething2');
 *   const result3 = await doGAS('doSomething3');
 * })();
 * </code></pre>
 * 
 * doSomething(arg1, arg2, ...)のように引数を渡す時は以下のようにdoGASの第2引数以下に指定する。
 * ```
 * doGAS('doSomething', arg1, arg2);
 * ```
 */
function doGAS(func, ...args){
  console.log('doGAS start. func=%s',func,...args);
  return new Promise(function(resolve, reject){
    google.script.run.withSuccessHandler(function(...e){
      resolve(...e);
    }).withFailureHandler(function(...e){
      reject(...e);
    })[func](...args);
  });
}