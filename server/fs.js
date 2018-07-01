const path = require("path");
const fs = require("fs");
const text2 = require("../common/text.js");

function isInFolder(diPath, filePath)
{
  let r=path.relative(diPath, filePath); 
  return !!r && !r.startsWith('.') && !path.isAbsolute(r);
};
exports.isInFolder = isInFolder;

function getFolders(diPath, callback)
{
  let ps = []; fs.readdir(diPath, (err, files) =>
  {
    if (err) { callback(err, null); return;}
    files.forEach(f =>
    {
      let p = new Promise((resolve, reject) =>
      {
        let f2 = path.join(diPath, f); fs.stat(f2, (err2, stats) =>
        {
          if (err2 || !stats.isDirectory()) { resolve(null); } else resolve(f2);
        });
      }); ps.push(p);
    });
    Promise.all(ps).then(values => callback(null, values.filter(v => v && v.length >= 1).sort(text2.strToIntSortFunc)));
  });
}
exports.getFolders = getFolders;