const fs = require('fs');
const path = require('path');
const text2=require("../common/text.js");
const lefa=global.lefamin;

function sendDefault(req, res)
{
  sendFile('/front/layout.htm',req, res);
};
exports.sendDefault=sendDefault;

function sendHtml(html, req, res)
{
  res.setHeader('Content-Type', 'text/html');
  res.statusCode = 200; res.end(html);
};
exports.sendHtml=sendHtml;

function sendText(text, req, res)
{
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = 200; res.end(text);
};
exports.sendText=sendText;

function sendApi(apiCollection, apiName, req, res, parts)
{
  let role=lefa.checkRole(req);
  let process_error=err=>{sendUnusual(req, res);};
  let process=(parts, ps)=>
  {
    try
    {
      let collection=require(`./api/${apiCollection}.js`); collection[apiName](parts, ps,(err, r)=>
      {
        if(err) {process_error(err);return;} sendText(r, req, res);
      }, role);
    }
    catch(err) { process_error(err); }
  };
  if (req.method === 'POST') 
  {
    let body = ''; req.on('data', chunk => {  body += chunk.toString(); });req.on('end', () => 
    {
      let ps=JSON.parse(body);process(parts, ps);
    });
  }
  else process(parts);  
};
exports.sendApi=sendApi;

function sendFile(url, req, res)
{  
  let filePath=path.join(lefa.path,url);fs.stat(filePath, (err, stat) => 
  {
    if (err) 
    {
      sendUnusual(req, res);return;
    }  
    res.setHeader('Content-Length', stat.size); 
    let type=lefa.attachmentFileType, fn=path.basename(filePath), ext=path.extname(filePath); 
    if(ext && ext.length>1)
    {
      ext=ext.substr(1); let t=lefa.mimes[ext]; if(t) type=t; 
    }
    res.setHeader('Content-Type', type); let isAtt=(type==lefa.attachmentFileType); if(isAtt) 
    {
      res.setHeader('Content-Disposition', "attachment; filename=" + fn);
    }
    res.statusCode = 200; fs.createReadStream(filePath).pipe(res);
  });
}
exports.sendFile=sendFile;

function sendUnusual(req, res)
{
  res.setHeader('Content-Type', 'text/plain'); res.statusCode = 200; res.end('');
};
exports.sendUnusual=sendUnusual;
