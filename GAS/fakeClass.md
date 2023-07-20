# Tips

## GASでの擬似クラス

GASではclassが使用できないので「メンバ相当とメソッド相当から構成されるオブジェクトを返す」ことで代用する(擬似クラス)。

```
const testObj = dummyClass(constructorArg); // 擬似クラス生成
if((a=testObj.hoge(null)) instanceof Error) throw a;  // hogeメソッドの使用
```

定義の際、メソッドは内部関数になるため、標準パターンでvを使い回すと不慮の動作を惹起するリスクが高い。
よって「(自動的にメンバが渡される)即時実行関数」ような構成にして回避する。

  rv.fuga = (arg) => {  // 外部から呼ばれる時の引数がarg
    // メンバの値も渡される即時関数の実行結果を返すという形で定義
    return ((m,a)=>{ // bに内部で参照されるrvの値をセット
      return a * m.b;
    })({b:rv.b},arg);  // 外部からの引数に加え、メンバ変数を別途渡す
    // 外部からの引数を可変長対応可能にしておくため、メンバ変数は先頭・オブジェクトで渡す

```
function dummyClass(constructorArg){
  const v = {whois:'dummyClass',rv:{}};
  try {
    szLib.szLog([v.whois,szConf.log.start],constructorArg); // dummyClass開始ログ
    // メンバの設定
    if( typeof constructorArg !== 'number' )
      throw new Error('constructorArg is not a number.');
    v.rv.a = constructorArg;  // メンバは「v.rvオブジェクトの要素」として定義
    
    // hogeメソッドの定義ここから
    v.rv.hoge = (hogeArg) => {return ((p,b)=>{
      const v = {whois:'hoge',rv:{}};
      try {
        szLib.szLog([v.whois,szConf.log.start],hogeArg); // hoge開始ログ
        if( typeof b !== 'number' )
          throw new Error('b is not a number.');
        v.rv = p.a + b;
        szLib.szLog([v.whois,szConf.log.normal],v.rv);  // hoge正常終了ログ
      } catch(e) {
        v.rv = szLib.szCatch(e,v);
      } finally {
        return szLib.szFinally(v);
      }
    })({a:v.rv.a},hogeArg)};
    // 第一引数(オブジェクト): hogeメソッドで使用する擬似クラスのメンバ
    // hogeArg:外部から呼ばれる時の引数
    // hogeメソッドの定義ここまで

    szLib.szLog([v.whois,szConf.log.normal],v.rv);  // dummyClass正常終了ログ
  } catch(e) {
    v.rv = szLib.szCatch(e,v);  // szCatch: catch節の標準処理
  } finally {
    return szLib.szFinally(v);
  }
}
const dummyClassTest = () => {
  const r1 = dummyClass(10);
  console.log('r1='+JSON.stringify(r1));  // -> r1={"a":10}
  console.log('r1.hoge='+r1.hoge(20));  // -> r1.hoge=30
  const r2 = dummyClass(null);
  console.log('r2='+JSON.stringify(r2));
  // -> dummyClass abnormal end. Error: constructorArg is not a number.
  const r3 = dummyClass(30);
  const r3hoge = r3.hoge(true);
  console.log('r3.hoge['+(szLib.whichType(r3hoge))+']='+r3hoge);
  // -> r3.hoge[Error]=Error: b is not a number.
}
/*
function dummyClass(arg){
  const rv = {member:{}};
  rv.member.a = arg.a;
  rv.b = arg.b;
  rv.hoge = (arg) => {
    return hoge(arg,rv.member);
  };
  // 標準パターンでvを使い回すと壊れやすい。特にv.rvの使い回しが危険
  // ⇒以下のように回避
  rv.fuga = (arg) => {  // 外部から呼ばれる時の引数がarg
    // メンバの値も渡される即時関数の実行結果を返すという形で定義
    return ((m,a)=>{ // bに内部で参照されるrvの値をセット
      return a * m.b;
    })({b:rv.b},arg);  // 外部からの引数に加え、メンバ変数を別途渡す
    // 外部からの引数を可変長対応可能にしておくため、メンバ変数は先頭・オブジェクトで渡す
  };
  return rv;
}
function hoge(arg,member){
  const rv = arg + member.a;
  console.log('hoge',arg,member,typeof member.a,rv,typeof rv);
  return rv;
}
*/
```