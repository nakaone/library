class PrivateDB {
  constructor(){
    this.tables = [new pdbTable(),new pdbTable()];
  }
  transact(table,arg){
    this.tables[table].append(arg);
    return this.tables[this.tables].prop01;
  }
}

class pdbTable {
  constructor(){
    this.prop01 = 10;
  }
  append(arg){
    this.prop01 += arg;
  }
}

const test = () => {
  const v = {};
  v.pdb = new PrivateDB();
  console.log(JSON.stringify(v.pdb));

  v.r = v.pdb.tables[0].append(10);
  v.pdb.tables.forEach(t => console.log(t.prop01));

  v.r = v.pdb.transact(0,20);
  console.log(`v.r=${v.r}`)
  v.pdb.tables.forEach(t => console.log(t.prop01));
}