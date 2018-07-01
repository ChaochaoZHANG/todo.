const http = require('http');
require("../settings.js");
const time2 = require("../common/time.js");
const sender = require("./sender.js");
const lefa = global.lefamin;

function processRequest(req, res)
{
  let u = req.url;  if (u && u.length>1) 
  { 
    let ur = u.substr(1), ps=ur.split('/'), p0=ps[0]; 
    if(['front','files','common'].includes(p0))
    {
      sender.sendFile(ur,req,res);return;
    }
    else if(p0=='api' && ps.length>=3)
    {
      sender.sendApi(ps[1],ps[2], req, res ,ps);return;
    }
  }
   sender.sendDefault(req,res);
};

const http_server = http.createServer(processRequest);
http_server.listen(lefa.port, lefa.host, () => 
{
  console.log(`Http server running at http://${lefa.host}:${lefa.port}`);
});