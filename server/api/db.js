const mysql = require('../mysql.js');
const lefa=global.lefamin;

exports.get_all = (parts,ps, callback, role)=>
{
  if (!role.isLogin)
  {
    callback(null, 'NEEDLOGIN');
  }
  else
  {
    let table = parts[3]; mysql.getAll(data => callback(null, JSON.stringify(data)), table);  
  }
}

exports.get = (parts, ps, callback, role) =>
{
  let table = parts[3]; mysql.get(data => callback(null, JSON.stringify(data)), table);
}

exports.create = (parts, ps, callback, role) =>
{
  let table = parts[3]; mysql.create(newId =>
  {
    for (let key in ps)
    {
      if(key!='id') mysql.update(newId, key, ps[key], () => { }, table);
    }
    mysql.enable(newId, () =>
    {
      mysql.get(newId, data => { callback(null, JSON.stringify(data)); }, table);
    }, table);
  }, table);
}

exports.update = (parts, ps, callback, role) =>
{
  let table = parts[3], id = parseInt(parts[4]);
  for (let key in ps)
  {
    if (key != 'id') mysql.update(id, key, ps[key], () => { }, table);
  }
  callback(null, "updated");
}

exports.delete = (parts, ps, callback, role) =>
{
  let table = parts[3], id = parseInt(parts[4]);
  mysql.disable(id, () => { callback(null, "deleted");}, table);  
}