// 作りかけ
v.deepCopy = (value) => {
  if (typeof value === 'function') {
    return value.toString();  // 関数型は文字列化
  } else if (Array.isArray(value)) {
    return value.map(item => v.deepCopy(item));
  } else if (value !== null && typeof value === 'object') {
    const copy = {};
    for (let key in value) {
      if (value.hasOwnProperty(key)) {
        copy[key] = v.deepCopy(value[key]);
      }
    }
    return copy;
  } else {
    // プリミティブ型（number, string, boolean, null, undefined）はそのまま返す
    return value;
  }
};
