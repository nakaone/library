/** 二つの引数が同値か判断する
 * @param {any} v1 - 変数1
 * @param {any} v2 - 変数2
 * @param {Object|boolean} opt - オプション。v1,v2でデータ型が異なる場合の判定方法を指定
 * @param {string} opt.force=null - v1,v2に強制するデータ型(ex.v1='9-5-1965',v2='1965/9/5',opt.force='date'->true)
 *   'string','number','bigint','boolean','undefined','symbol','function','null','date','object','array'
 * @param {boolean} opt.string_number=true - trueなら文字列・数値型の相違を無視(ex.'10'=10と判断)
 * @param {boolean} opt.string_bigint=true - trueなら文字列・長整数型の相違を無視(ex.'10'=10nと判断)
 * @param {boolean} opt.string_boolean=true - trueなら文字列・真偽値の相違を無視(ex.'TruE'=trueと判断)
 * @param {boolean} opt.string_undefined=true - trueなら文字列・undefinedの相違を無視(ex.'undefined'=undefinedと判断)
 * @param {boolean} opt.string_function=true - trueなら文字列・関数の相違を無視(ex.'()=>true'と()=>trueは同値と判断)
 * @param {boolean} opt.string_null=true - trueなら文字列・nullの相違を無視(ex.'Null'=nullと判断)
 * @param {boolean} opt.string_date=true - trueなら文字列・Date型の相違を無視(ex.'1965/9/5'=new Date('1965-09-05')と判断)
 * @param {boolean} opt.number_bigint=true - trueなら数値・長整数型の相違を無視(ex.10=10nと判断)
 * @param {boolean} opt.number_date=true - trueなら数値・Date型の相違を無視(ex.-136458000000=new Date('1965-09-05')と判断)
 * @param {boolean} opt.bigint_date=true - trueなら長整数・Date型の相違を無視(ex.-136458000000n=new Date('1965-09-05')と判断)
 * @returns {boolean|Error}
 * 
 * - [等価性の比較と同一性](https://developer.mozilla.org/ja/docs/Web/JavaScript/Equality_comparisons_and_sameness)
 * - データ型が一致していないと、内容的に一致していても同値では無いと判断(Ex.Number 1 != BigInt 1)。
 * - 配列は、①長さが一致、かつ②順番に比較した個々の値が同値の場合のみ同値と看做す
 * - `opt.strict = false`はスプレッドシートに保存されていた内容との比較での利用を想定
 */
function isEqual(v1=undefined,v2=undefined,opt={}){
  const v = {whois:'isEqual',rv:true,step:0,
  };
  try {

    // -------------------------------------------
    // 1. 事前準備
    // -------------------------------------------
    v.step = 1.1; // v.types: typeofの戻り値の内、objectを除いたもの
    v.types = ['string','number','bigint','boolean','undefined','symbol','function'];
    v.typeAll = [...v.types,'null','date','object','array'];

    v.step = 1.2; // データ型判定関数の定義
    // typeofの戻り値の内 string,number,bigint,boolean,undefined,symbol,function はそのまま
    // objectは null,date,array,objectに分けて文字列として返す
    // 引数:データ型判定対象変数、戻り値:v.typeallに列挙された文字列
    v.which = x => {
      if( x === null ) return 'null';
      if( v.types.indexOf(typeof x) >= 0 ) return typeof x;
      if( Array.isArray(x) ) return 'array';
      return isNaN(new Date(x)) ? 'object' : 'date';
    };

    v.step = 1.3; // オプションに既定値を設定
    v.opt = Object.assign({
      force: null,
      string_number: true, // trueなら文字列・数値型の相違を無視(ex.'10'=10と判断)
      string_bigint: true, // trueなら文字列・長整数型の相違を無視(ex.'10'=10nと判断)
      string_boolean: true, // trueなら文字列・真偽値の相違を無視(ex.'TruE'=trueと判断)
      string_undefined: true, // trueなら文字列・undefinedの相違を無視(ex.'undefined'=undefinedと判断)
      string_function: true, // trueなら文字列・関数の相違を無視(ex.'()=>true'と()=>trueは同値と判断)
      string_null: true, // trueなら文字列・nullの相違を無視(ex.'Null'=nullと判断)
      string_date: true, // trueなら文字列・Date型の相違を無視(ex.'1965/9/5'=new Date('1965-09-05')と判断)
      number_bigint: true, // trueなら数値・長整数型の相違を無視(ex.10=10nと判断)
      number_date: true, // trueなら数値・Date型の相違を無視(ex.-136458000000=new Date('1965-09-05')と判断)
      bigint_date: true, // trueなら長整数・Date型の相違を無視(ex.-136458000000n=new Date('1965-09-05')と判断)
    },opt);

    v.step = 1.4; // オプションの適用マップ(v.map)を作成
    // v1,v2でデータ型が異なる場合の判定方法として、次項(step.1.5)で定義する判定式を
    // 適用する場合はtrueを、適用しない場合(=厳密比較する場合)はfalseを設定する。
    // なおデータ型がv1,v2で不一致の場合はオプションの真偽値をセットするが、
    // 一致する場合は必ず判定式が適用されるようtrueをセットしておく。
    v.map = {};
    v.typeAll.forEach(x => {
      v.map[x] = {};
      // `x === y` ⇒ データ型が一致する場合はtrue、不一致はfalseをセット
      v.typeAll.forEach(y => v.map[x][y] = x === y);
    });
    // オプションの指定値をセット
    for( v.prop in v.opt ){
      v.m = v.prop.match(/^([a-z]+)_([a-z]+)$/);
      if( v.m ) v.map[v.m[1]][v.m[2]] = v.map[v.m[2]][v.m[1]] = v.opt[v.prop];
    }

    v.step = 1.5; // 比較対象のデータ型に基づいた判定式の定義
    v.f01 = (x,y) => x === y;  // ①厳密比較
    v.f02 = (x,y) => x == y;   // ②緩い比較
    v.f03 = (x,y) => {try{return BigInt(x) === BigInt(y)}catch{return false}};  // ③BigInt
      // BigInt(Infinity) -> The number Infinity cannot be converted to a BigInt because it is not an integer
      // これを回避するためtry〜catchとする
    v.f04 = (x,y) => String(x).toLowerCase() === String(y).toLowerCase(); //Boolean(x) === Boolean(y),  // ④Boolean
    v.f05 = (x,y) => String(x) === String(y);  // ⑤String
    v.f06 = (x,y) => x.toString() === y.toString();  // ⑥toString()
    v.f07 = (x,y) => {try{return new Date(x).getTime() === new Date(y).getTime()}catch{return false}};  // ⑦getTime()
      // new Date(Infinity) -> Invalid Date
      // これを回避するためtry〜catchとする
    v.f08 = (x,y) => new Date(Number(x)).getTime() === new Date(Number(y)).getTime();  // ⑧getTime(num)

    v.step = 1.6; // デシジョンテーブルの定義
    // 比較対象のデータ型毎に、どの比較方法を採用するかを定義する
    // ex. v.dt['string','number'] ⇒ v.f02(②緩い比較)で同一かを判定
    v.dt = {
      "string":{"string":v.f01,"number":v.f02,"bigint":v.f03,"boolean":v.f04,"undefined":v.f05,"function":v.f06,"null":v.f04,"date":v.f07},
      "number":{"string":v.f02,"number":v.f01,"bigint":v.f03,"date":v.f07},
      "bigint":{"string":v.f03,"number":v.f03,"bigint":v.f01,"date":v.f07},
      "boolean":{"string":v.f04,"boolean":v.f01},
      "undefined":{"string":v.f05,"undefined":v.f01},
      "symbol":{"symbol":v.f06},
      "function":{"string":v.f06,"function":v.f06},
      "null": {"string":v.f04,"null":v.f01},
      "date": {"string":v.f07,"number":v.f07,"bigint":v.f08,"date":v.f07},
      "object": {"object":(x,y)=>{
        // 直下のメンバが不一致ならfalseを返す(孫要素以降は不問)
        if(JSON.stringify(Object.keys(x).sort()) !== JSON.stringify(Object.keys(y).sort())) return false;
        // 個々のメンバを再帰呼出
        for( let m in x ) if( isEqual(x[m],y[m],v.opt) === false ) return false;
        return true;
      }},
      "array": {"array":(x,y)=>{
        // 要素の個数が不一致ならfalseを返す(孫要素以降は不問)
        if( x.length !== y.length ) return false;
        // 個々のメンバを再帰呼出
        for( let i=0 ; i<x.length ; i++ ) if( isEqual(x[i],y[i],v.opt) === false ) return false;
        return true;
      }},
    };

    // -------------------------------------------
    v.step = 2; // 判定式を選択、結果を返す
    // -------------------------------------------
    // データ型の組み合わせパターンで判定式が定義されていればそれに基づき判定。
    // 未定義なら「false固定」としてfalseを返す。
    v.t1 = v.opt.force || v.which(v1); v.t2 = v.opt.force || v.which(v2);
    v.f = v.map[v.t1][v.t2] ? v.dt[v.t1][v.t2] : v.f01;
    //console.log(`t1:${v.t1}, t2:${v.t2}, f: ${v.f}`);
    return v.f(v1,v2);

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}`
    + `\n${e.message}\nv1(${typeof v1})=${typeof v1 === 'object' ? JSON.stringify(v1) : v1}`
    + `\nv2(${typeof v2})=${typeof v2 === 'object' ? JSON.stringify(v2) : v2}`;
    console.error(`${e.message}\nv=${JSON.stringify(v)}`);
    return e;
  }
}