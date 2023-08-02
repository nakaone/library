
 function initMaster(){
  const s = szSheet('master');
  console.log(s.data.length);
  console.log(MailApp.getRemainingDailyQuota());
  MailApp.sendEmail("nakaone.kunihiro@gmail.com", "test", String(new Date()));
  console.log(MailApp.getRemainingDailyQuota());
}
function onFormSubmit(e){
  const v = {rv:null,form:{},
    whois:'管理局.onFormSubmit',
    formId:'1wsEtp-SdI0ypsoIzaWFXH6rPEn9G5ywL98OSUqJHCyQ',
    content: `<p>To: _name 様</p>
<p>下北沢小おやじの会です。<br>
この度は「校庭キャンプ2023」にお申し込みいただき、ありがとうございました。</p>
<p>昨年度大変多くの参加をいただいたため、今回定員オーバーの場合は申込締切日に抽選させていただき、結果はメールでご連絡差し上げることとしました。<br>
お申し込み即参加可能とはならず誠に恐縮ですが、何卒ご理解いただけますようお願い申し上げます。</p>
<p>参加要項を以下に掲載しています。持ち物や注意事項を記載しており、またイベント当日の受付で必要になりますので、事前にご確認いただけますようお願い申し上げます。<br>
_camp2023</p>
<p>なお申込〜イベント当日の間に何らかの事情でお申し込み内容に変更がある場合、またはお申し込み自体をキャンセルする場合、以下から申込内容を修正いただけますようお願いいたします。<br>
_editURL</p>
<p>尚ご不明な点がございましたら、以下までご連絡お願いいたします。<br>
shimokitasho.oyaji@gmail.com</p>`,
    button: 'style="'
      + 'display : inline-block;'
      + 'text-decoration: none;'
      + 'font-size : 18pt;'
      + 'text-align : center;'
      + 'cursor : pointer;'
      + 'padding : 12px 12px;'
      + 'background : #1a1aff;'
      + 'color : #ffffff;'
      + 'line-height : 1em;'
      + 'transition : .3s;'
      + 'box-shadow : 6px 6px 5px #666666;'
      + 'border : 2px solid #1a1aff;'
    + '" onMouseOver="'
      + 'box-shadow: none;'
      + 'color: #1a1aff;'
      + 'background: #ffffff;'
    + '" onMouseOut="'
      + 'box-shadow: 6px 6px 5px #666666;'
      + 'color: #ffffff;'
      + 'background: #1a1aff;'
    + '"',
  };
  try {
    console.log(v.whois+' start.',e.response);
    v.step = '1';
    v.lineNum = e.range.getRow();
    v.email = e.namedValues["メールアドレス"][0];
    console.log('lineNum:%s, email:%s',v.lineNum,v.email);
    v.step = '2';
    v.responses = FormApp.openById(v.formId).getResponses();
    for( v.i=0 ; v.i<v.responses.length ; v.i++ ){
      v.timestamp = v.responses[v.i].getTimestamp().getTime();
      console.log('2.1. timestamp='+v.timestamp);
      v.form[String(v.timestamp)] = {
        timestamp: v.timestamp,
        email: v.responses[v.i].getRespondentEmail(),
        editURL: v.responses[v.i].getEditResponseUrl()
      }
    }
    console.log('v.form='+JSON.stringify(v.form));
    v.step = '3';
    v.sheet = szSheet('master','タイムスタンプ');
    for( v.i=0 ; v.i<v.sheet.data.length ; v.i++ ){
      v.d = v.sheet.data[v.i];
      v.stamp = new Date(v.d['タイムスタンプ']).getTime();
      if( !v.d.entryNo || !v.d.editURL || !v.d.authority ){
        v.updateResult = v.sheet.update({
          entryNo: v.i+1,
          editURL: v.form[String(v.stamp)].editURL,
          authority: 1,
        },{num:v.i,append:false});
      }
      if( v.i === (v.lineNum - 2) ){
        v.entryData = v.sheet.data[v.i];
        console.log('entryData:'+JSON.stringify(v.entryData));
      }
    }
    v.step = '4';
    v.step = '4.1';
    v.content = v.content.replace('_name',v.entryData['申込者氏名']);
    v.camp2023 = 'https:
      + '/public/camp2023.html?id=' + v.entryData.entryNo;
    console.log('4.1 content='+v.content);
    v.step = '4.2';
    v.plane = v.content
      .replaceAll(/<.+?>/g,'')
      .replace('_camp2023',v.camp2023)
      .replace('_editURL',v.entryData.entryNo);
    console.log("4.2 plane="+v.plane);
    v.step = '4.3';
    v.html = v.content
      .replace('_camp2023','<a ' + v.button + ' href="'
        + v.camp2023 + '" class="button">参加案内</a>')
      .replace('_editURL','<a ' + v.button + ' href="'
        + v.entryData.editURL + '" class="button">回答を編集</a>');
    v.html = '<!DOCTYPE html><html xml:lang="ja" lang="ja">'
      + '<head></head><body>' + v.html + '</body></html>';
    console.log("4.3 html="+v.html);
    v.draft = GmailApp.createDraft(
      v.entryData['メールアドレス'],
      '[受付]校庭キャンプ2023 申込',
      v.plane,
      {
        htmlBody: v.html,
        name: '下北沢小おやじの会',
      }
    );
    v.draftId = v.draft.getId();
    GmailApp.getDraft(v.draftId).send();
    console.log('Mail Remaining Daily Quota:'+MailApp.getRemainingDailyQuota());
    console.log(v.whois+' end.');
  } catch(e) {
    console.error(v.whois+' abnormal end.\n',e,v);
  }
}
 function postMails(arg){
  const v = {whois:'GAS.postMails',arg:arg,rv:null,post:[],to:[]};
  try {
    console.log(v.whois+' start.\n',arg);
    v.step = '1.1';
    v.template = {
      recipient: undefined,
      subject: arg.subject,
      body: arg.body || undefined,
      options: {
        attachments: arg.attachments || undefined,
        bcc: arg.bcc || undefined,
        cc: arg.cc || undefined,
        htmlBody:	arg.html || undefined,
        inlineImages: arg.inlineImages || undefined,
        name: arg.from || undefined,
        noReply: arg.noReply || false,
        replyTo: arg.replyTo || undefined
      }
    }
    v.step = '1.2';
    if( typeof v.template.body === 'undefined' ){
      v.m = arg.html.match(/<body[^>]*>([\s\S]+?)<\/body>/);
      v.template.body = v.m ? v.m[1] : arg.html;
      v.template.body = v.template.body
      .replace(/<a href="([^"]+?)".*?>([^<]+?)<\/a>/g,'$2($1)')
      .replace(/<[^<>]+?>/g,'');
    }
    v.step = '1.3';
    v.template = JSON.stringify(v.template);
    v.step = '1.4';
    if( whichType(arg.to) === 'Array' ){
      if( typeof arg.to[0] === 'string' ){
        for( v.i=0 ; v.i<arg.to.length ; v.i++ ){
          v.to.push({address:arg.to[v.i],data:{}});
        }
      } else {
        v.to = arg.to;
      }
    } else {
      if( typeof arg.to === 'string' ){
        v.to = [{address:arg.to,data:{}}];
      } else {
        v.to = [arg.to];
      }
    }
    v.step = '1.5';
    v.merge = (p,str,data) => {
      const v = {whois:p.whois+'.v.merge',rv:null};
      try{
        v.rv = str;
        for( v.x in data ){
          v.rex = new RegExp('::' + v.x + '::','g');
          v.rv = v.rv.replaceAll(v.rex,String(data[v.x]));
        }
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n'+JSON.stringify(v));
        v.rv = e;
      } finally {
        return v.rv;
      }
    }
    v.step = '2';
    for( v.i=0 ; v.i<v.to.length ; v.i++ ){
      v.step = '2.1';
      v.mail = JSON.parse(v.template);
      v.step = '2.2';
      v.mail.recipient = v.to[v.i].address;
      v.step = '2.3';
      v,v.mail.subject = v.merge(v,v.mail.subject,v.to[v.i].data);
      if( v,v.mail.subject instanceof Error ) throw v,v.mail.subject;
      v.step = '2.4';
      v.mail.body = v.merge(v,v.mail.body,v.to[v.i].data);
      if( v.mail.body instanceof Error ) throw v.mail.body;
      v.step = '2.5';
      if( typeof v.mail.options.htmlBody !== 'undefined' ){
        v.mail.options.htmlBody = v.merge(v,v.mail.options.htmlBody,v.to[v.i].data);
        if( v.mail.options.htmlBody instanceof Error ) throw v.mail.options.htmlBody;
      }
      v.step = '2.6';
      v.post.push(v.mail);
    }
    v.step = '3';
    while( v.to.length > 0 ){
      v.step = '3.1';
      v.r = sendMails(v.post);
      if( v.r instanceof Error ) throw v.r;
      v.step = '3.2';
      v.to = v.r.NG;
      if( v.r.remain === 0 || v.r.NG.length > 0 ){
        v.step = '4.1';
        v.oldMail = config.mail;
        v.sheet = szSheet({spreadId:config.master.spreadId,sheetName:'config'});
        if( v.sheet instanceof Error ) throw v.sheet;
        v.step = '4.2';
        v.rowNumber = 'rowNumber' + Date.now();
        v.conf = v.sheet.objectize('lv01','lv03',['value',v.rowNumber]);
        if( v.conf instanceof Error ) throw v.conf;
        v.step = '4.3';
        for( v.x in v.conf.list ){
          if( v.conf.list[v.x].endpoint.value == config.mail.endpoint ){
            v.tNum = v.conf.list[v.x].sendOver[v.rowNumber] - 1;
            break;
          }
        }
        v.step = '4.4';
        v.r = v.sheet.update({value:getJPDateTime()},{num:v.tNum});
        if( v.r instanceof Error ) throw v.r;
        v.step = '4.5';
        config = setSzConf();
        v.step = '4.6';
        v.newMail = config.mail;
        MailApp.sendEmail(
          config.public.Administrator,
          '[おまつり奉行]メール通数制限超過に伴う配信局交代通知',
          getJPDateTime()
          + '\n\nold=' + JSON.stringify(v.oldMail)
          + '\n\nnew=' + JSON.stringify(v.newMail)
        );
      }
    }
    v.step = '5';
    console.log(v.whois+' normal end.\n',arg);
  } catch(e) {
    console.error(v.whois+' abnormal end.\n'+e.stack+'\n'+JSON.stringify(v));
    v.rv = e;
  } finally {
    return v.rv;
  }
}
function szSheet(arg,key=null){
  const v = {whois:'szSheet',rv:{}};
  try {
    console.log(v.whois+' start.\n',arg,key);
    if( typeof arg === 'string' ){
      v.step = '1a';
      v.rv.sheetName = arg;
      v.rv.spreadId = null;
      v.rv.sheet = SpreadsheetApp.getActive().getSheetByName(arg);
      v.rv.headerRow = 1;
    } else {
      v.step = '1b';
      v.rv.sheetName = arg.sheetName;
      v.rv.spreadId = null;
      if( 'spreadId' in arg ){
        v.step = '1ba';
        v.rv.spreadId = arg.spreadId;
        v.rv.sheet = SpreadsheetApp.openById(arg.spreadId).getSheetByName(arg.sheetName);
        if( v.rv.sheet instanceof Error ) throw v.rv.sheet;
      } else {
        v.step = '1bb';
        v.rv.sheet = SpreadsheetApp.getActive().getSheetByName(arg.sheetName);
      }
      v.rv.headerRow = arg.headerRow || 1;
      if( v.rv.headerRow < 1 ){
        throw new Error('ヘッダ行は自然数で指定してください');
      }
    }
    if( v.rv.sheet === null ) throw new Error('指定された"'+v.rv.sheetName+'"シートは存在しません');
    v.rv.key = key;
    v.step = '2.1';
    v.dRange = v.rv.sheet.getDataRange();
    v.rv.raw = v.dRange.getValues();
    const raw = JSON.parse(JSON.stringify(v.rv.raw));
    v.rv.keys = raw.splice(v.rv.headerRow-1,1)[0];
    if( v.rv.key !== null && v.rv.keys.findIndex(x => x === v.rv.key ) < 0 ){
      throw new Error('キーとして指定された項目が存在しません');
    }
    v.rv.colIdx = {};
    for( v.i=0 ; v.i<v.rv.keys.length ; v.i++ ){
      v.rv.colIdx[v.rv.keys[v.i]] = v.i + 1;
    }
    v.rv.data = raw.splice(v.rv.headerRow-1).map(row => {
      const obj = {};
      row.map((item, index) => {
        obj[String(v.rv.keys[index])] = String(item);
      });
      return obj;
    });
    v.rv.lastRow = v.rv.raw.length;
    v.step = '2.2';
    v.rv.default = {};
    v.dRange.getNotes()[v.rv.headerRow-1].forEach((x,i) => {
      if( x.match(/primary key/) && v.rv.key === null )
        v.rv.key = v.rv.keys[i];
      v.m = x.match(/default\s*:?\s*(\S+)/);
      if( v.m ) v.rv.default[v.rv.keys[i]] = v.m[1];
    });
    v.step = '2.3';
    v.rv.formObj = {m:[]};
    for( v.i in v.rv.default ){
      v.m = v.rv.default[v.i].match(/^=editFormId\((.+?)\)/);
      v.rv.formObj.m.push(v.m);
      if( v.m !== null ){
        v.step = '2.3a';
        v.formData = FormApp.openById(v.m[1]).getResponses();
        for( v.j=0 ; v.j<v.formData.length ; v.j++ ){
          v.rv.formObj[String(v.formData[v.j].getTimestamp().getTime())] = v.formData[v.j];
        }
      }
    }
    v.rv.isEqual = (a,b) => {
      return a == b || new Date(a).getTime() === new Date(b).getTime()
    }
    v.rv.complement = () => {return ((p)=>{
      const v = {whois:p.whois+'.complement',rv:[]};
      try {
        console.log(v.whois+' start.');
        v.step = '1';
        v.pMax = -999999;
        for( v.i=0 ; v.i<p.data.length ; v.i++ ){
          if( v.pMax < Number(p.data[v.i][p.key]) ){
            v.pMax = Number(p.data[v.i][p.key]);
          }
        }
        v.step = '2';
        v.dMap = Object.keys(p.default);
        for( v.i=0 ; v.i<p.data.length ; v.i++ ){
          v.step = '2.1';
          v.t = String(new Date(p.data[v.i]['タイムスタンプ']).getTime());
          v.obj = {};
          v.step = '2.2';
          if( p.data[v.i][p.key] == '' ){
            v.obj[p.key] = ++v.pMax;
          }
          v.step = '2.3';
          for( v.j=0 ; v.j<v.dMap.length ; v.j++ ){
            if( String(p.data[v.i][v.dMap[v.j]]).length === 0 ){
              v.step = '2.3a';
              v.m = p.default[v.dMap[v.j]].match(/^=editFormId\(.+?\)\.([a-z]+)/);
              if( v.m === null ){
                v.step = '2.3aa';
                v.obj[v.dMap[v.j]] = p.default[v.dMap[v.j]];
              } else {
                if( typeof p.formObj[v.t] === 'undefined' ){
                  v.step = '2.3aba';
                  v.obj[v.dMap[v.j]] = '';
                } else {
                  v.step = '2.3abb';
                  switch( v.m[1] ){
                    case 'url':
                      v.obj[v.dMap[v.j]] = p.formObj[v.t].getEditResponseUrl();
                      break;
                    case 'id':
                      v.obj[v.dMap[v.j]] = p.formObj[v.t].getId();
                      break;
                    case 'email':
                      v.obj[v.dMap[v.j]] = p.formObj[v.t].getRespondentEmail();
                      break;
                    case 'timestamp':
                      v.obj[v.dMap[v.j]] = p.formObj[v.t].getTimestamp();
                      break;
                  }
                }
              }
            }
          }
          v.step = '2.4';
          if( Object.keys(v.obj).length > 0 ){
            v.r = p.update(v.obj,{num:v.i});
            if( v.r instanceof Error ) throw v.r;
            v.rv.push({dataNum:v.i,changed:v.obj});
          }
        }
        v.step = '3';
        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members)};
    v.step = '4.1 search';
    v.rv.search = (value,key=v.rv.key) => {return ((p,value,key)=>{
      const v = {whois:p.whois+'.search',rv:[]};
      try {
        console.log(v.whois+' start. value='+value+', key='+key);
        if( p.keys.findIndex(x => x === key) < 0 ){
          throw new Error('指定された欄名がヘッダ行にありません');
        }
        for( v.i=0 ; v.i<p.data.length ; v.i++ ){
          if( p.isEqual(value,p.data[v.i][key]) ){
            v.rv.push({
              obj: p.data[v.i],
              dataNum: v.i,
              rawNum: v.i + p.headerRow,
              rowNum: v.i + p.headerRow + 1,
            });
          }
        }
        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,value,key)};
    v.step = '4.2 lookup';
    v.rv.lookup = (value,key) => {return ((p,value,key)=>{
      const v = {whois:p.whois+'.lookup',rv:{}};
      try {
        console.log(v.whois+' start. value='+value+', key='+key);
        v.searchResult = p.search(value,key);
        v.rv = v.searchResult.length > 0 ? v.searchResult[0].obj : null;
        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,value,key)};
    v.step = '4.3 update';
    v.rv.update = (data,opt) => {return ((p,data,opt)=>{
      const v = {whois:p.whois+'.update',rv:[]};
      try {
        console.log(v.whois+' start.\ndata='+JSON.stringify(data)+'\nopt='+JSON.stringify(opt));
        v.step = '1';
        if( whichType(opt).toLocaleLowerCase() === 'object' ){
          opt.key = typeof opt.key !== 'undefined' ? opt.key : p.key;
          opt.append = typeof opt.append === 'undefined' ? true : opt.append;
          opt.num = typeof opt.num === 'undefined' ? null : opt.num;
        } else {
          opt = {key:p.key,value:opt,append:true,num:null};
        }
        if( opt.num === null && (p.keys.findIndex(x => x === opt.key) < 0) )
          throw new Error('キー項目が不適切です');
        v.step = '2.1';
        v.maxRow = v.maxCol = -Infinity;
        v.minRow = v.minCol = Infinity;
        v.isExist = false;
        v.isUpdated = false;
        v.map = Object.keys(data);
        v.step = '2.2';
        for( v.i=0 ; v.i<p.data.length ; v.i++ ){
          v.step = '2.2.1';
          if( (opt.num === null && (!p.isEqual(p.data[v.i][opt.key],opt.value)))
           || (opt.num !== null && opt.num !== v.i )) continue;
          v.step = '2.2.2';
          v.isExist = true;
          v.l = p.headerRow + v.i;
          v.log = {func:'update',dataNum:v.i,rawNum:v.l,rowNum:v.l+1,changed:[]};
          v.step = '2.2.3';
          v.a = v.l + 1;
          v.maxRow = v.maxRow < v.a ? v.a : v.maxRow;
          v.minRow = v.minRow > v.a ? v.a : v.minRow;
          v.step = '2.2.4';
          for( v.j=0 ; v.j<v.map.length ; v.j++ ){
            v.step = '2.2.4.1';
            v.o = {colName: v.map[v.j]};
            v.o.colNum = p.colIdx[v.o.colName];
            v.o.before = p.data[v.i][v.o.colName];
            v.o.after = data[v.o.colName];
            if( v.o.before != v.o.after ){
              v.step = '2.2.4.2';
              p.raw[v.l][v.o.colNum-1] = v.o.after;
              p.data[v.i][v.o.colName] = v.o.after;
              v.maxCol = v.maxCol < v.o.colNum ? v.o.colNum : v.maxCol;
              v.minCol = v.minCol > v.o.colNum ? v.o.colNum : v.minCol;
              v.isUpdated = true;
              v.log.changed.push(v.o);
            }
          }
          v.step = '2.2.5';
          v.rv.push(v.log);
        }
        v.step = '2.3';
        if( v.isExist === false && opt.append ){
          opt.update = false;
          return p.append(data,opt);
        }
        v.step = '3';
        if( v.isUpdated ){
          v.range = p.sheet.getRange(v.minRow, v.minCol, (v.maxRow-v.minRow+1), (v.maxCol-v.minCol+1));
          v.sv = [];
          p.raw.slice(v.minRow-1,v.maxRow).forEach(x => v.sv.push(x.slice(v.minCol-1,v.maxCol)));
          v.range.setValues(v.sv);
        }
        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,data,opt)};
    v.step = '4.4 append';
    v.rv.append = (data,opt) => {return ((p,data,opt)=>{
      const v = {whois:p.whois+'.append',rv:[]};
      try {
        console.log(v.whois+' start.\n',data);
        v.step = '1.1';
        if( !opt || typeof opt === 'string' ){
          v.opt = {
            key: p.key,
            value: opt,
            update: true,
          }
        } else {
          v.opt = opt;
          v.opt.key = typeof opt.key === 'undefined' ? p.key : opt.key;
          v.opt.update = typeof opt.value === 'undefined' ? true : opt.update;
        }
        v.step = '1.2';
        switch(whichType(data)){
          case 'Object': v.data = [data]; break;
          case 'Array':
            v.type = whichType(data[0]);
            v.data = v.type !== 'Array' && v.type !== 'Object'? v.data = [data] : data;
            break;
          default: 
            throw new Error('行データの形式が不適切です');
        }
        v.step = '2';
        for( v.i=0 ; v.i<v.data.length ; v.i++ ){
          v.obj = v.data[v.i];
          if( whichType(v.obj) === 'Array' ){
            v.obj = {};
            for( v.j=0 ; v.j<v.data[v.i].length ; v.j++ ){
              if( v.data[v.i][v.j] ){
                v.obj[p.keys[v.j]] = v.data[v.i][v.j];
              }
            }
          }
          v.step = '3';
          v.dMap = Object.keys(p.default);
          for( v.j=0 ; v.j<v.dMap.length ; v.j++ ){
            if( typeof v.obj[v.dMap[v.j]] === 'undefined' ){
              v.obj[v.dMap[v.j]] = p.default[v.dMap[v.j]];
            }
          }
          v.step = '4';
          if( v.opt.key === null || typeof v.obj[v.opt.key] === 'undefined' ){
            v.step = '4a';
            if( v.opt.key !== null ){
              v.step = '4ab';
              v.obj[v.opt.key] = 0;
              for( v.j=0 ; v.j<p.data.length ; v.j++ ){
                v.n = Number(p.data[v.j][v.opt.key]);
                if( v.obj[v.opt.key] < v.n ){
                  v.obj[v.opt.key] = v.n;
                }
              }
              v.obj[v.opt.key] += 1;
            }
          } else {
            v.step = '4b';
            v.flag = false;
            for( v.j=0 ; v.j<p.data.length ; v.j++ ){
              if( v.obj[v.opt.key] == p.data[v.j][v.opt.key] ) v.flag = true;
            }
            if( v.flag ){
              v.step = '4bb';
              if( v.opt.update ){
                v.step = '4bba';
                v.opt.value = v.obj[v.opt.key];
                v.opt.append = false;
                if((v.r=p.update(v.obj,v.opt)) instanceof Error) throw v.r;
                v.rv.push(v.r);
                continue;
              } else {
                v.step = '4bbb';
                throw new Error('指定されたキーで既に登録されています');
              }
            }
          }
          v.step = '5.1';
          v.arr = [];
          for( v.j=0 ; v.j<p.keys.length ; v.j++ ){
            v.arr.push(v.obj[p.keys[v.j]] || null);
          }
          p.sheet.appendRow(v.arr);
          v.step = '5.2';
          v.rv.push({
            func: 'append',
            dataNum: p.data.length,
            rawNum: p.raw.length,
            rowNum: p.raw.length + p.headerRow + 1,
            changed: ((obj)=>{
              const rv = [];
              Object.keys(obj).forEach(x => {
                rv.push({
                  colName: x,
                  colNum: p.colIdx[x],
                  before: '',
                  after: obj[x],
                });
              });
              return rv;
            })(v.obj),
          });
          v.step = '5.3';
          p.lastRow += 1;
          p.raw.push(v.arr);
          p.data.push(v.obj);
        }
        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,data,opt)};
    v.step = '4.5 delete';
    v.rv.delete = (cond) => {return ((p,cond)=>{
      const v = {whois:p.whois+'.delete',rv:[]};
      try {
        console.log(v.whois+' start.\ncond='+JSON.stringify(cond));
        v.step = '1';
        v.cond = cond;
        v.map = Object.keys(v.cond);
        for( v.i=p.data.length-1 ; v.i>=0 ; v.i-- ){
          v.step = '2.1';
          v.flag = true;
          for( v.j=0 ; v.j<v.map.length ; v.j++ ){
            v.r = p.isEqual(v.cond[v.map[v.j]],p.data[v.i][v.map[v.j]]);
            if( v.r instanceof Error ) throw v.r;
            if( v.r === false ) v.flag = false;
          }
          if( v.flag === true ){
            v.step = '2.2';
            v.rObj = {
              func: 'delete',
              dataNum: v.i,
              rawNum: p.headerRow+v.i,
              rowNum: p.headerRow+v.i+1,
              changed: {...p.data[v.i]}
            }
            v.rv.push(v.rObj);
            p.sheet.deleteRow(v.rObj.rowNum);
            p.lastRow -= 1;
            p.raw.splice(v.rObj.rawNum,1);
            p.data.splice(v.rObj.dataNum,1);
          }
        }
        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,cond)};
    v.step = '4.6 objectize';
    v.rv.objectize = (stCol,edCol,valid) => {return ((p,stCol,edCol,valid)=>{
      const v = {whois:p.whois+'.objectize',rv:{}};
      try {
        console.log(v.whois+' start.\nstCol='+stCol+', edCol='+edCol+', valid='+valid);
        v.arr = [p.keys];
        for( v.i=p.headerRow ; v.i<p.raw.length ; v.i++ ){
          v.arr.push(p.raw[v.i]);
        }
        v.rv = objectize(v.arr,stCol,edCol,valid);
        if( v.rv instanceof Error ) throw v.rv;
        console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
      } catch(e) {
        console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
        v.rv = e;
      } finally {
        return v.rv;
      }
    })(v.rv.members,stCol,edCol,valid)};
    v.step = '5';
    const members = {whois:v.whois};
    Object.keys(v.rv).forEach(x => members[x] = v.rv[x]);
    v.rv.members = members;
    console.log(v.whois+' normal end.\n'+JSON.stringify(v.rv));
  } catch(e) {
    console.error(v.whois+' abnormal end.\n'+e.stack+'\n',v);
    v.rv = e;
  } finally {
    return v.rv;
  }
}