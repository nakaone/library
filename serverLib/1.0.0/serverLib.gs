function getActiveCellInfo(){
  const v = {whois:'getCellInfo',rv:{},step:0};
  console.log(v.whois+' start.');
  try {
    v.spread = SpreadsheetApp.getActiveSpreadsheet();
    v.sheet = v.spread.getActiveSheet();
    v.active = v.sheet.getActiveRange();
    v.rv = {
      spreadId: v.spread.getId(),
      spreadName: v.spread.getName(),
      sheetId: v.sheet.getSheetId(),
      sheetName: v.sheet.getSheetName(),
      firstRow: v.active.getRow(),
      lastRow: v.active.getLastRow(),
      firstColumn: v.active.getColumn(),
      lastColumn: v.active.getLastColumn(),
      value: v.active.getValues(),
      type: [],
      format: v.active.getNumberFormats(),
      formula: v.active.getFormulas(),
      R1C1: v.active.getFormulasR1C1(),
      note: v.active.getNotes(),
      background: v.active.getBackgrounds(),
      fontColor: v.active.getFontColors(),
      fontWeight: v.active.getFontWeights(),
      horizontalAlign: v.active.getHorizontalAlignments(),
      verticalAlign: v.active.getVerticalAlignments(),
      width: [],
      height: [],
      border: [],
    };
    for( v.r=0 ; v.r<v.rv.value.length ; v.r++ ){
      v.l = [];
      for( v.c=0 ; v.c<v.rv.value[v.r].length ; v.c++ ){
        v.l.push(whichType(v.rv.value[v.r][v.c]));
      }
      v.rv.type.push(v.l);
    }
    for( v.c=v.rv.firstColumn ; v.c<=v.rv.lastColumn ; v.c++ ){
      v.rv.width.push(v.sheet.getColumnWidth(v.c));
    }
    for( v.r = v.rv.firstRow ; v.r<=v.rv.lastRow ; v.r++ ){
      v.rv.height.push(v.sheet.getRowHeight(v.r));
    }
    console.log(v.whois+' normal end.\n',v.rv);
    return JSON.stringify(v.rv);
  } catch(e) {
    console.error(e);
    return e;
  }
}
class SingleTable {
  constructor(name,opt={}){
    this.className = 'SingleTable';
    this.logMode = 7;
    const v = {whois:this.className+'.constructor',
      default:{
        sheet: SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name),
        name: name,
        header: [],
        top:1, left:1, bottom:Infinity, right:Infinity,
        data: [],
      },
      dataRange: null,
    };
    this.clog(1,v.whois+' start.');
    try {
      v.step = 1.1;
      v.rv = this.deepcopy(this,v.default);
      if( v.rv instanceof Error ) throw v.rv;
      v.step = 1.2;
      v.rv = this.deepcopy(this,opt);
      if( v.rv instanceof Error ) throw v.rv;
      v.step = 1.3;
      v.dataRange = this.sheet.getDataRange();
      v.top = v.dataRange.getRow();
      v.bottom = v.dataRange.getLastRow();
      v.left = v.dataRange.getColumn();
      v.right = v.dataRange.getLastColumn();
      this.clog(4,"v.top=%s, v.bottom=%s, v.left=%s, v.right=%s",v.top,v.bottom,v.left,v.right);
      this.top = this.top < v.top ? v.top : this.top;
      this.bottom = this.bottom > v.bottom ? v.bottom : this.bottom;
      this.left = this.left < v.left ? v.left : this.left;
      this.right = this.right > v.right ? v.right : this.right;
      v.step = 2;
      v.range = [this.top, this.left, this.bottom - this.top + 1, this.right - this.left + 1];
      this.clog(4,'v.range=%s',JSON.stringify(v.range));
      v.raw = this.sheet.getRange(...v.range).getValues();
      v.left = -1; v.colNo = 1;
      for( v.i=0 ; v.i<v.raw[0].length ; v.i++ ){
        if( v.raw[0][v.i] !== '' ){
          if( v.left < 0 ) v.left = v.i;
          v.right = v.i;
        } else if( v.left > -1 ){
          v.raw[0][v.i] = 'Col' + v.colNo;
          v.colNo++;
        }
      }
      this.left = v.left + 1;
      this.right = v.right + 1;
      this.clog(4,"this.top=%s, this.bottom=%s, this.left=%s, this.right=%s",this.top,this.bottom,this.left,this.right);
      v.step = 3;
      this.raw = [];
      v.bottom = -1;
      for( v.r=(this.bottom-this.top) ; v.r>=0 ; v.r-- ){
        [v.arr, v.obj] = [[],{}];
        for( v.c=this.left-1 ; v.c<this.right ; v.c++ ){
          v.arr.push(v.raw[v.r][v.c]);
          if( v.raw[v.r][v.c] !== '' ){
            if( v.bottom < 0 ) v.bottom = v.r;
            v.obj[v.raw[0][v.c]] = v.raw[v.r][v.c];
          }
        }
        if( v.bottom > -1 ){
          this.raw.unshift(v.arr);
          if( v.r > 0 ) this.data.unshift(v.obj);
        }
      }
      this.header = this.raw[0];
      this.bottom = this.top + v.bottom;
      this.clog(2,v.whois+' normal end.');
    } catch(e) {
      console.error(v.whois+' abnormal end(step=%s).\n%s\nv=%s',v.step,e.message,JSON.stringify(v));
      return e;
    }
  }
  clog(type=3,...msg){
    if( !Array.isArray(msg) ) msg = [msg];
    if( (this.logMode & type) > 0 ) console.log(...msg);
  }
  deepcopy(dest,opt){
    const v = {whois:this.className+'.deepcopy',rv:null,step:0};
    this.clog(1,v.whois+' start.');
    try {
      Object.keys(opt).forEach(x => {
        v.step = 1;
        if( !dest.hasOwnProperty(x) ){
          v.step = 2;
          dest[x] = opt[x];
        } else {
          if( whichType(dest[x]) === 'Object' && whichType(opt[x]) === 'Object' ){
            v.step = 3;
            v.rv = this.deepcopy(dest[x],opt[x]);
            if( v.rv instanceof Error ) throw v.rv;
          } else if( whichType(dest[x]) === 'Array' && whichType(opt[x]) === 'Array'  ){
            v.step = 4;
            dest[x] = [...new Set([...dest[x],...opt[x]])];
          } else {
            v.step = 5;
            dest[x] = opt[x];
          }
        }
      });
      v.step = 6;
      this.clog(2,v.whois+' normal end. result=%s',v.rv);
      return v.rv;
    } catch(e){
      console.error(v.whois+' abnormal end(step.'+v.step+').\n',e,v);
      return e;
    }
  }
  convertNotation(arg){
    const v = {rv:null,map: new Map([
      ['0','A'],['1','B'],['2','C'],['3','D'],['4','E'],
      ['5','F'],['6','G'],['7','H'],['8','I'],['9','J'],
      ['a','K'],['b','L'],['c','M'],['d','N'],['e','O'],
      ['f','P'],['g','Q'],['h','R'],['i','S'],['j','T'],
      ['k','U'],['l','V'],['m','W'],['n','X'],['o','Y'],
      ['p','Z'],
      ['A',1],['B',2],['C',3],['D',4],['E',5],
      ['F',6],['G',7],['H',8],['I',9],['J',10],
      ['K',11],['L',12],['M',13],['N',14],['O',15],
      ['P',16],['Q',17],['R',18],['S',19],['T',20],
      ['U',21],['V',22],['W',23],['X',24],['Y',25],
      ['Z',26],
    ])};
    try {
      if( typeof arg === 'number' ){
        v.step = 1;
        if( arg < 1 ) throw new Error('"'+arg+'" is lower than 1.');
        v.rv = '';
        v.str = (arg-1).toString(26);
        for( v.i=0 ; v.i<v.str.length ; v.i++ ){
          v.rv += v.map.get(v.str.slice(v.i,v.i+1));
        }
      } else if( typeof arg === 'string' ){
        v.step = 2;
        arg = arg.toUpperCase();
        v.rv = 0;
        for( v.i=0 ; v.i<arg.length ; v.i++ )
          v.rv = v.rv * 26 + v.map.get(arg.slice(v.i,v.i+1));
      } else {
        v.step = 3;
        throw new Error('"'+JSON.stringify(arg)+'" is invalid argument.');
      }
      v.step = 4;
      return v.rv;
    } catch(e) {
      e.message = 'convertNotation: ' + e.message;
      return e;
    }
  }
  select(opt={}){
    const v = {whois:this.className+'.select',step:0,rv:[]};
    this.clog(1,v.whois+' start.');
    try {
      v.step = 1;
      if( !opt.hasOwnProperty('where') )
        opt.where = () => true;
      if( !opt.hasOwnProperty('orderBy') )
        opt.orderBy = [];
      v.step = 2;
      for( v.i=0 ; v.i<this.data.length ; v.i++ ){
        if( Object.keys(this.data[v.i]).length > 0
           && opt.where(this.data[v.i]) )
          v.rv.push(this.data[v.i]);
      }
      v.step = 3;
      v.rv.sort((a,b) => {
        for( v.i=0 ; v.i<opt.orderBy.length ; v.i++ ){
          [v.p, v.q] = opt.orderBy[v.i][1]
          && opt.orderBy[v.i][1].toLowerCase() === 'desc' ? [1,-1] : [-1,1];
          if( a[opt.orderBy[v.i][0]] < b[opt.orderBy[v.i][0]] ) return v.p;
          if( a[opt.orderBy[v.i][0]] > b[opt.orderBy[v.i][0]] ) return v.q;
        }
        return 0;
      });
      v.step = 4;
      this.clog(2,v.whois+' normal end. num=%s',v.rv.length);
      return v.rv;
    } catch(e) {
      console.error(v.whois+' abnormal end(step=%s).\n%s\nv=%s',v.step,e.message,JSON.stringify(v));
      return e;
    }
  }
  update(src,opt={}){
    const v = {whois:this.className+'.update',step:0,rv:[],
      top:Infinity, left:Infinity, bottom:-Infinity, right:-Infinity};
    this.clog(1,v.whois+' start.');
    try {
      v.step = 1;
      if( !opt.hasOwnProperty('where') )
        opt.where = () => true;
      for( v.i=0 ; v.i<this.data.length ; v.i++ ){
        v.step = 2;
        if( Object.keys(this.data[v.i]).length > 0 && opt.where(this.data[v.i]) ){
          v.step = 2.1;
          v.r = {
            old: Object.assign({},this.data[v.i]),
            new: this.data[v.i],
            diff: {},
            row: this.top + 1 + v.i,
            left: 99999999, right: -99999999,
          };
          v.step = 2.2;
          v.diff = whichType(src) === 'Object' ? src : src(this.data[v.i]);
          v.step = 2.3;
          v.exist = false;
          this.header.forEach(x => {
            v.step = 2.4;
            if( v.diff.hasOwnProperty(x) && v.r.old[x] !== v.diff[x] ){
              v.step = 2.5;
              v.exist = true;
              v.r.new[x] = v.diff[x];
              v.r.diff[x] = [v.r.old[x]||'', v.r.new[x]];
              v.col = this.left + this.header.findIndex(i=>i==x);
              v.r.left = v.r.left > v.col ? v.col : v.r.left;
              v.r.right = v.r.right < v.col ? v.col : v.r.right;
            }
          });
          if( v.exist ){
            v.step = 3.1;
            v.top = v.top > v.r.row ? v.r.row : v.top;
            v.bottom = v.bottom < v.r.row ? v.r.row : v.bottom;
            v.left = v.left > v.r.left ? v.r.left : v.left;
            v.right = v.right < v.r.right ? v.r.right : v.right;
            v.step = 3.2;
            this.raw[v.r.row-this.top] = (o=>{
              const rv = [];
              this.header.forEach(x => rv.push(o[x]||''));
              return rv;
            })(v.r.new);
            v.step = 3.3;
            v.rv.push(v.r);
          }
        }
      }
      v.step = 5;
      v.data = (()=>{
        let rv = [];
        this.raw.slice(v.top-this.top,v.bottom-this.top+1).forEach(l => {
          rv.push(l.slice(v.left-this.left,v.right-this.left+1));
        });
        return rv;
      })();
      this.sheet.getRange(
        v.top,
        v.left,
        v.bottom-v.top+1,
        v.right-v.left+1
      ).setValues(v.data);
      v.step = 6;
      this.clog(2,v.whois+' normal end. num=%s',v.rv.length);
      return v.rv;
    } catch(e) {
      console.error(v.whois+' abnormal end(step=%s).\n%s\nv=%s',v.step,e.message,JSON.stringify(v));
      return e;
    }
  }
  insert(records=[]){
    const v = {whois:this.className+'.insert',step:0,rv:[],
      r:[],left:99999999,right:-99999999};
    this.clog(1,v.whois+' start.');
    try {
      v.step = 1;
      if( !Array.isArray(records) ) records = [records];
      for( v.i=0 ; v.i<records.length ; v.i++ ){
        v.step = 2;
        v.arr = [];
        for( v.j=0 ; v.j<this.header.length ; v.j++ ){
          v.step = 3;
          v.cVal = records[v.i][this.header[v.j]] || '';
          if( v.cVal !== '' ){
            v.step = 4;
            v.left = v.left > v.j ? v.j : v.left;
            v.right = v.right < v.j ? v.j : v.right;
          }
          v.step = 5;
          v.arr.push(v.cVal);
        }
        v.step = 6;
        this.clog(4,'l.428 v.arr=%s',JSON.stringify(v.arr));
        this.raw.push(v.arr);
        this.data.push(records[v.i]);
        v.rv.push(v.arr);
      }
      this.clog(4,"l.443 v.r=%s\nv.top=%s, v.bottom=%s, v.left=%s, v.right=%s",JSON.stringify(v.r),v.top,v.bottom,v.left,v.right)
      v.step = 7;
      v.rv.forEach(x => v.r.push(x.slice(v.left,v.right-v.left+1)));
      v.step = 8;
      this.sheet.getRange(
        this.bottom+1,
        this.left+v.left,
        v.r.length,
        v.r[0].length
      ).setValues(v.r);
      v.step = 9;
      this.clog(2,v.whois+' normal end. num=%s',v.rv.length);
      return v.rv;
    } catch(e) {
      console.error(v.whois+' abnormal end(step=%s).\n%s\nv=%s',v.step,e.message,JSON.stringify(v));
      return e;
    }
  }
  delete(opt={}){
    const v = {whois:this.className+'.delete',step:0,rv:[]};
    this.clog(1,v.whois+' start.');
    try {
      v.step = 1;
      if( !opt.hasOwnProperty('where') )
        opt.where = () => true;
      for( v.i=this.data.length-1 ; v.i>=0 ; v.i-- ){
        v.step = 2;
        if( Object.keys(this.data[v.i]).length>0 && opt.where(this.data[v.i]) ){
          v.step = 3;
          v.rowNum = this.top + v.i + 1;
          this.sheet.getRange(v.rowNum,this.left,1,this.right-this.left+1)
          .deleteCells(SpreadsheetApp.Dimension.ROWS);
        }
      }
      v.step = 4;
      this.clog(2,v.whois+' normal end. num=%s',v.rv.length);
      return v.rv;
    } catch(e) {
      console.error(v.whois+' abnormal end(step=%s).\n%s\nv=%s',v.step,e.message,JSON.stringify(v));
      return e;
    }
  }
}
function whichType(arg,is){
  let rv = String(Object.prototype.toString.call(arg).slice(8,-1));
  switch(rv){
    case 'Number': if(Number.isNaN(arg)) rv = 'NaN'; break;
    case 'Function': if(!('prototype' in arg)) rv = 'Arrow'; break;
  }
  if( typeof is === 'string' ){
    return rv.toLowerCase() === is.toLowerCase();
  } else {
    return rv;
  }
}