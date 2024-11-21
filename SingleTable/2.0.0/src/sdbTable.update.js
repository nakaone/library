/** update: 領域に新規行を追加
 * @param {Object|Object[]} trans=[] - 更新するオブジェクトの配列
 * @param {Object|Function|any} where - 対象レコードの判定条件
 * @param {Object|Function} data - 更新する値
 * @returns {sdbLog[]}
 * 
 * - where句の指定方法
 *   - Object ⇒ {key:キー項目名, value: キー項目の値}形式で、key:valueに該当するレコードを更新
 *   - Function ⇒ 行オブジェクトを引数に対象ならtrueを返す関数で、trueが返されたレコードを更新
 *   - その他 ⇒ 項目定義で"primaryKey"指定された項目の値で、primaryKey項目が指定値なら更新
 * - data句の指定方法
 *   - Object ⇒ {更新対象項目名:セットする値}
 *   - Function ⇒ 行オブジェクトを引数に、上記Objectを返す関数
 *     【例】abc欄にfuga+hogeの値をセットする : {func: o=>{return {abc:(o.fuga||0)+(o.hoge||0)}}}
 */
update(trans=[]){
  const v = {whois:'sdbTable.update',step:0,rv:[],log:[],target:[],
    top:Infinity,left:Infinity,right:0,bottom:0,
    header: this.schema.cols.map(x => x.name), // 項目一覧
  };
  console.log(`${v.whois} start.\ntrans(${whichType(trans)})=${stringify(trans)}`);
  try {

    // ------------------------------------------------
    v.step = 1; // 事前準備
    // ------------------------------------------------

    if( !Array.isArray(trans)) trans = [trans];

    // 対象となる行オブジェクト判定式の作成
    for( v.i=0 ; v.i<trans.length ; v.i++ ){

      v.step = 1.1; // where,dataの存否確認
      v.msg = `${v.whois}: _が指定されていません(${JSON.stringify(trans[v.i])})`;
      if( !trans[v.i].where ) throw new Error(v.msg.replace('_','位置指定(where)'));
      if( !trans[v.i].data ) throw new Error(v.msg.replace('_','更新データ(data)'));

      v.step = 1.2; // whereがオブジェクトまたは文字列指定なら関数化
      v.where = typeof trans[v.i].where === 'function' ? trans[v.i].where
      : new Function('o','return isEqual(' + ( typeof trans[v.i].where === 'object'
        ? `o['${trans[v.i].where.key}'],'${trans[v.i].where.value}'`
        : `o['${this.schema.primaryKey}'],'${trans[v.i].where}'`
      ) + ');');

      v.step = 1.3; // dataがオブジェクトなら関数化
      v.data = typeof trans[v.i].data === 'function' ? trans[v.i].data
      : new Function('o',`return ${JSON.stringify(trans[v.i].data)}`);
      vlog(v,['where','data'],670);

      // 対象レコードか一件ずつチェック
      for( v.j=0 ; v.j<this.values.length ; v.j++ ){

        v.step = 2.1; // 対象外判定ならスキップ
        if( v.where(this.values[v.j]) === false ) continue;

        v.step = 2.2; // 更新履歴オブジェクトを作成
        v.logObj = new sdbLog({account:this.account,range:this.name,
          before:JSON.parse(JSON.stringify(this.values[v.j])),after:{},diff:{}});

        v.step = 2.3; // v.after: 更新指定項目のみのオブジェクト
        v.after = v.data(this.values[v.j]);
        vlog(v,['logObj','after'],684)

        v.step = 2.4; // シート上の項目毎にチェック
        v.header.forEach(x => {
          //console.log(`l.688 x=${x},v.after=${JSON.stringify(v.after)}\nv.logObj.before[${x}]=${v.logObj.before[x]}\nv.after[${x}]=${v.after[x]}\nisEqual=${isEqual(v.logObj.before[x],v.after[x])}`)
          if( v.after.hasOwnProperty(x) && !isEqual(v.logObj.before[x],v.after[x]) ){
            v.step = 2.41; // 変更指定項目かつ値が変化していた場合、afterとdiffに新しい値を設定
            v.logObj.after[x] = v.logObj.diff[x] = v.after[x];
            v.colNo = v.header.findIndex(y => y === x);
            v.left = Math.min(v.left,v.colNo);
            v.right = Math.max(v.right,v.colNo);
          } else {
            v.step = 2.42; // 非変更指定項目または変更指定項目だが値の変化が無い場合、beforeの値をセット
            v.logObj.after[x] = v.logObj.before[x];
          }
        })

        v.step = 2.5; // 更新レコードの正当性チェック(unique重複チェック)
        for( v.unique in this.schema.unique ){
          if( this.schema.unique[v.unique].indexOf(trans[v.i][v.unique]) >= 0 ){
            v.step = 2.51; // 登録済の場合はエラーとして処理
            v.logObj.result = false;
            // 複数項目のエラーメッセージに対応するため場合分け
            v.logObj.message = (v.logObj.message === null ? '' : '\n')
            + `${v.unique}欄の値「${trans[v.i][v.unique]}」が重複しています`;
          } else {
            v.step = 2.52; // 未登録の場合this.sdbSchema.uniqueに値を追加
            this.schema.unique[v.unique].push(trans[v.i][v.unique]);
          }
        }
  
        v.step = 2.6; // 正当性チェックOKの場合の処理
        if( v.logObj.result ){
          v.top = Math.min(v.top, v.j);
          v.bottom = Math.max(v.bottom, v.j);
          this.values[v.j] = v.logObj.after;          
        }
  
        v.step = 2.7; // 成否に関わらずログ出力対象に保存
        v.log.push(v.logObj);
      }
    }

    // ------------------------------------------------
    v.step = 3; // 対象シート・更新履歴に展開
    // ------------------------------------------------
    vlog(v,['top','left','right','bottom'])
    v.step = 3.1; // シートイメージ(二次元配列)作成
    for( v.i=v.top ; v.i<=v.bottom ; v.i++ ){
      console.log(`l.733 this.values[${v.i}]=${JSON.stringify(this.values[v.i])}`)
      v.row = [];
      for( v.j=v.left ; v.j<=v.right ; v.j++ ){
        v.row.push(this.values[v.i][v.header[v.j]] || null);
      }
      v.target.push(v.row);
    }
    vlog(v,'target')

    v.step = 3.2; // シートに展開
    // v.top,bottom: 最初と最後の行オブジェクトの添字(≠行番号) ⇒ top+1 ≦ row ≦ bottom+1
    // v.left,right: 左端と右端の行配列の添字(≠列番号) ⇒ left+1 ≦ col ≦ right+1
    if( v.target.length > 0 ){
      this.sheet.getRange(
        v.top + 2,  // +1(添字->行番号) +1(ヘッダ行分)
        v.left + 1,  // +1(添字->行番号)
        v.target.length,
        v.target[0].length
      ).setValues(v.target);
    }

    v.step = 3.3; // 変更履歴追記対象なら追記(変更履歴シートは追記対象外)
    if( this.log !== null ){
      v.r = this.log.append(v.log);
      if( v.r instanceof Error ) throw v.r;
    }

    v.step = 9; // 終了処理
    console.log(`${v.whois} normal end.\nv.rv(${whichType(v.rv)})=${stringify(v.rv)}`);
    return v.rv;

  } catch(e) {
    e.message = `${v.whois} abnormal end at step.${v.step}\n${e.message}`;
    console.error(`${e.message}\nv=${stringify(v)}`);
    return e;
  }
}
