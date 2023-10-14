/**
 * @desc オブジェクトのプロパティを再帰的にマージ
 * - Qiita [JavaScriptでオブジェクトをマージ（結合）する方法、JSONのマージをする方法](https://qiita.com/riversun/items/60307d58f9b2f461082a)
 *
 * @param {Object} target - 結合対象のオブジェクト1
 * @param {Object} source - 結合対象のオブジェクト2。同名のプロパティはこちらで上書き
 * @param {Object} opts - オプション
 * @param {boolean} [opts.concatArray=false] - プロパティの値が配列だった場合、結合するならtrue
 * @returns {Object} 結合されたオブジェクト
 */

function mergeDeeply(target, source, opts) {
  const isObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj);
  const isConcatArray = opts && opts.concatArray;
  let result = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    for (const [sourceKey, sourceValue] of Object.entries(source)) {
      const targetValue = target[sourceKey];
      if (isConcatArray && Array.isArray(sourceValue) && Array.isArray(targetValue)) {
        result[sourceKey] = targetValue.concat(...sourceValue);
      }
      else if (isObject(sourceValue) && target.hasOwnProperty(sourceKey)) {
        result[sourceKey] = mergeDeeply(targetValue, sourceValue, opts);
      }
      else {
        Object.assign(result, {[sourceKey]: sourceValue});
      }
    }
  }
  return result;
}
