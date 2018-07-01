const path = require('path');
const fs = require('fs');
const os=require('os');

global.lefamin=new Object(); const lefa=global.lefamin; 
lefa.path=__dirname; //console.log(`path: ${lefa.path}`);
require('./common/settings.js');

//------------server--------------//
lefa.serverName=os.hostname().toLowerCase(); //console.log(`server name: ${lefa.serverName}`);
lefa.host = '0.0.0.0';


lefa.commonPath=path.join(lefa.path,"common");
lefa.frontPath=path.join(lefa.path,"front");
lefa.serverPath=path.join(lefa.path,"server");
lefa.layoutPath=path.join(lefa.frontPath,"layout.htm");
lefa.layout = fs.readFileSync(lefa.layoutPath, 'utf8');

lefa.sessions = {};
lefa.checkRole = (req) =>
{
  let cookie = req.headers.cookie, r = {}; console.log(cookie); if (cookie)
  {
    cookie.split(';').map(item => item.trim()).filter(item => item).map(item =>
    {
      if (item.indexOf('email=') == 0) r.email = item.substr('email='.length);
      if (item.indexOf('token=') == 0) r.token = item.substr('token='.length);
      return item;
    });
    if (r.email && r.token)
    {
      console.log(`${r.email} && ${r.token}`);
      let session = lefa.sessions[r.email]; if (session && session.token == r.token)
      {
        r.isLogin = true; if (r.email == 'jinmin.si@outlook.com') r.isSuper = true;
      } 
    }
  }
  console.log(r);return r;
}
lefa.requireLogin = role =>
{
  let r = { isLogin : role.isLogin };
  return r;  
}


//------------file types--------------//
lefa.attachmentFileType="application/octet-stream";
lefa.mimes=
{
  "htm":"text/html",
  "css":"text/css",
  "js":"application/javascript",
  "jpg":"image/jpeg",
  "jpeg":"image/jpeg",
  "png":"image/png",
  "gif":"image/gif",
  "ico":"image/x-icon",
  "svg": "image/svg+xml",
  "mp4": "video/mp4"
  

};
