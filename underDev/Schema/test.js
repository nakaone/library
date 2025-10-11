//::$lib/devTools/1.0.1/core.js::
//::$lib/mergeDeeply/1.2.0/core.js::
//::$lib/toLocale/1.2.0/core.js::
//::$lib/whichType/1.0.1/core.js::

const config = {
  schema: {
    dbName: 'camp2025',
    tableDef: {
      master: {
        colDef:[
          {name:'タイムスタンプ',type:'string'},
          {name:'メールアドレス',type:'string'},
          {name:'申込者氏名',type:'string'},
          {name:'申込者カナ',type:'string'},
          {name:'申込者の参加',type:'string'},
          {name:'宿泊、テント',type:'string'},
          {name:'引取者氏名',type:'string'},
          {name:'参加者01氏名',type:'string'},
          {name:'参加者01カナ',type:'string'},
          {name:'参加者01所属',type:'string'},
          {name:'参加者02氏名',type:'string'},
          {name:'参加者02カナ',type:'string'},
          {name:'参加者02所属',type:'string'},
          {name:'参加者03氏名',type:'string'},
          {name:'参加者03カナ',type:'string'},
          {name:'参加者03所属',type:'string'},
          {name:'参加者04氏名',type:'string'},
          {name:'参加者04カナ',type:'string'},
          {name:'参加者04所属',type:'string'},
          {name:'参加者05氏名',type:'string'},
          {name:'参加者05カナ',type:'string'},
          {name:'参加者05所属',type:'string'},
          {name:'緊急連絡先',type:'string'},
          {name:'ボランティア募集',type:'string'},
          {name:'備考',type:'string'},
          {name:'キャンセル',type:'string'},
        ],
      },
    },
    tableMap: {master:{def:'master'}},
    custom: {},
  },
};

//::$prj/core.js::

const dev = devTools();
const test = () => {
  const r = Schema(config.schema);
  console.log(JSON.stringify(r,null,2));
}