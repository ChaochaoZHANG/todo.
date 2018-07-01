function checkPhone(value)
{
  if (!value || value.length < 2) return "号码不能少于2个字符";
  if (value.length > 30) return "号码不能多于30个字符";
  if (!/^[\d\s\+\.\(\)]+$/.test(value)) return "只能包含数字，空格，+, -, ., ()";
  return null;
}
exports.checkPhone = checkPhone;


exports.strToIntSortFunc = (v1, v2) => { return parseInt(v1) > parseInt(v2) ? 1 : -1 };

function toFix(value, totalLength = 2, prefix = '0')
{
  let r=value.toString(); if(r.length<totalLength)
  {
    r=prefix.repeat((totalLength-r.length)/prefix.length)+r;
  }
  return r;
}
exports.toFix=toFix;

function randomText(count)
{
  let r=''; for(let i=0;i<count;i++) r+= Math.floor(Math.random()*10).toString(); return r;
}
exports.randomText=randomText;

function parseRequest(text)
{
  if(!text || (typeof text) !="string" || text.length<1) return null;
  let r = {}; let ps = text.split(['&', '?']); ps.forEach(element => 
  {
    let parts=element.split("="); if(parts.length===2) r[parts[0]]=decodeURIComponent(parts[1]);
  });
  return r;
}
exports.parseRequest=parseRequest;

function json(obj, level=0)
{  
  if(!obj || typeof(obj)!="object" || level>1) return "";
  
  if(!level) level=0;
  let content=`<div style='margin-left:${level*1}em;'>`;
  let simples="",complexs="";
  for(let key in obj)  
  {
    let value=obj[key]; if(key.substr(0,1)=="_"||!value||value=="") continue; let type=typeof(value); 
    if(type=="function"){continue;}
    let keyclass="json-primitive-key", valueclass="json-primitive-value";
    let key2=`<span class='${keyclass}'>${key}(${type})</span>`;
    if(type=="number"||type=="string"||type=="boolean")
    { 
      let value2=`<span class='${valueclass}'>${value}</span>`;
      simples+=(`<div>${key2}: ${value2}</div>`);      
    }
    else if(type=="object")
    {
      let content2=exports.json(value,level+1);
      complexs+=(`<div>${key2}: ${content2}</div>`);  
    }
    else
    {
      complexs+=(`<div>${key2}</div>`);
    }          
  }  
  content+=(simples+complexs+"</div>");
  return content;
};
exports.json=json;

function printObject(req)
{
  for(let key in req)
  {
    let v=req[key]; let t=typeof v; 
    if(t=='string') console.log(`key=${key}, type=${t}, v=${v}`);
    else console.log(`key=${key}, type=${t}`);
    if(t=="object") 
    {
      for(let key2 in v)
      {
        let v2=v[key2]; let t2=typeof v2; 
        if(t2=='string') console.log(`  key2=${key2}, type2=${t2}, v2=${v2}`);
        else if(t2=="object") 
        {
          console.log(`  key2=${key2}, type2=${t2}`);
          for(let key3 in v2)
          {
            let v3=v2[key3]; let t3=typeof v3; 
            if(t3=='string') console.log(`    key3=${key3}, type3=${t3}, v3=${v3}`);
          }
        }
      }
    }
  }
}
exports.printObject=printObject;