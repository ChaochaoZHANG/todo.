const fs = require('fs');
const path = require('path');
const text2 = require("../../common/text.js");
const mysql = require('../mysql.js');
const lefa=global.lefamin;


function checkEmail(email)
{
  return (!email || (typeof email)!="string" || !email.includes("@") || email.length<lefa.emailMin|| email.length>lefa.emailMax); 
}
function processEmail(email)
{
  return email.toLowerCase().trim(); 
}
function checkPassword(password)
{
  return (!password || (typeof password)!="string" || password.length<lefa.passwordMin || password.length>lefa.passwordMax); 
}


function getUserByEmail(email, callback = rs => {})
{
  if(checkEmail(email)) return null; email=processEmail(email);
  return mysql.getEqual('email', email, callback, 'us');// users.all.find(u=>u.email==email);
};

exports.login = (parts, ps, callback, role)=>
{  
  let email = ps.email, pd = ps.pd;
  getUserByEmail(email, rs =>
  {
    let r = {}; if (rs && rs.length>0)
    {
      let u = rs[0]; if (u.pd == pd)
      {
        //console.log(u);
        let token = text2.randomText(20); lefa.sessions[email] = {token: token};
        r.msg = `OK`; r.token = token;
      }
      else
      {
        r.msg = `密码不正确`
      }
    }
    else
    {
      r.msg = `email"${email}"尚未被注册`;
    }
    callback(null, JSON.stringify(r));
  });
}

