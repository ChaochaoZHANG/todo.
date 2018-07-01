if(typeof global === 'undefined' || !global) 
{ global=window; global.modules={}; global.lefamin={}; }

(function()
{
  const lefa=global.lefamin;  

  lefa.domain='lefamin.xyz'; lefa.port = 80; lefa.sport = 443; 
  lefa.name='TODO'; lefa.desc=`让生活井井有条`;lefa.startYear=2014;
  lefa.email = '1564016175@qq.com'; lefa.wechat = '1564016175'; lefa.qq = '1564016175'; lefa.qqg ='1564016175';  
  lefa.siteUrl=`https://${lefa.domain}${lefa.sport==443?'':':'+lefa.sport}`; 

  lefa.emailMin=6; lefa.passwordMin=6; lefa.emailMax=100; lefa.passwordMax=100;

  lefa.routes = [{ path: '/', name: 'index' }, { path: '/login', name: 'login' }, { path: '/todo', name: 'todo' }];
  lefa.menuPath=m=>{let r= lefa.routes.find(r=>r.name==m.route); return r?r.path:'/'};
  lefa.menu = [{ text: '任务表', route: 'todo' }].map(m=>{return {text:m.text, path:lefa.menuPath(m)};});


  lefamin.user = {};

  lefa.debug='';
  
})();
