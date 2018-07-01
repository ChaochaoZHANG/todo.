const mysql = require('mysql');
const defaultTable = 'todos';

function connect()
{
  const connection = mysql.createConnection({
    host: 'lefamin.xyz',
    user: 'lefa',
    password: 'Mar1adb!@#',
    database: 'lefamin'
  });
  connection.connect();
  return connection;
}

function makeObj(r)
{
  let r2 = JSON.parse(r.ps2); r2.id = r.id; return r2;
}

function makeObjs(rs)
{
  return rs.map(r => makeObj(r));
}

function getAll(callback = data => { }, table = defaultTable)
{
  let connection = connect();
  let sql = `SELECT COLUMN_JSON(ps) ps2, id from ?? where COLUMN_GET(ps, 'enabled' as INTEGER)=1`;
  console.log(`select all from ${table}`);
  connection.query(sql,[table], function (error, results, fields)
  {
    if (error) throw error; callback(makeObjs(results));
    //console.log(`results:`); console.log(results[0]); console.log(`fields:`); console.log(fields);
  });
  connection.end();
};
exports.getAll = getAll;

function get(id, callback = json => { }, table=defaultTable)
{
  let connection = connect();
  let sql = `SELECT COLUMN_JSON(ps) ps2, id from ?? where id=?`; console.log(`select ${id} from ${table}`);
  connection.query(sql, [table, id], function (error, results, fields)
  {
    if (error) throw error; let r = results && results.length > 0 ? makeObj(results[0]) : null; callback(r);
    //console.log(`results:`); console.log(results[0]); console.log(`fields:`); console.log(fields);
  });
  connection.end();
};
exports.get = get;


function getEqual(name, value, callback = rs => { }, table = defaultTable)
{
  let connection = connect();
  let sql = `SELECT COLUMN_JSON(ps) ps2, id from ?? where COLUMN_GET(ps, ? as char)=?`;
  console.log(`select equal ${name} = ${value} from ${table}`);
  connection.query(sql, [table, name, value], function (error, results, fields)
  {
    if (error) throw error; //console.log(`results:`); console.log(results); //console.log(`fields:`); console.log(fields);
    callback(makeObjs(results));
  });
  connection.end();
};
exports.getEqual = getEqual;


function create(callback = newId => { }, table = defaultTable)
{
  let connection = connect();
  let sql = `INSERT INTO ?? (ps) VALUES (COLUMN_CREATE('enabled',false))`; //console.log(sql);
  connection.query(sql, [table], function (error, results, fields)
  {
    if (error) throw error; let newId = results.insertId; console.log(`created newId=${newId}`); callback(newId);
  });
  connection.end();
};
exports.create = create;


function update(id, name, value, callback = () => { }, table = defaultTable)
{
  if (name == 'id') { callback(); return; } let connection = connect();
  let sql = `UPDATE ?? SET ps = COLUMN_ADD(ps,?,?) where id=?`; console.log(`update ${id} ${name} ${value} ${table}`);
  connection.query(sql,[table,name, value,id], function (error, results, fields)
  {
    if (error) throw error; callback();
    //console.log(`results:`); console.log(results); console.log(`fields:`); console.log(fields);
  });
  connection.end();
};
exports.update = update;


function disable(id, callback = () => { }, table = defaultTable)
{
  update(id, 'enabled', false, callback, table); console.log(`disabled ${id}`);
};
exports.disable = disable;


function enable(id, callback = () => { }, table = defaultTable)
{
  update(id, 'enabled', true, callback, table); console.log(`enabled ${id}`);
};
exports.enable = enable;

