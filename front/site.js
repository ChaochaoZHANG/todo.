const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
async function require2(url) 
{
  if(!url || typeof url !='string' || url.length==0) return;
  let u=url, rs=global.modules; if (!rs[u]) 
  {      
    rs[u]={exports:{}}; let x = await axios.get(u); if (x.statusText === 'OK') 
    { 
      let fnBody = x.data; console.log(url);
      await new AsyncFunction('exports','module',fnBody)(rs[u].exports,rs[u]); 
    } 
    else throw new Error(`require ${u} failed: ${x.statusText}`);
  }
  return rs[u].exports;
};

function require(url) 
{
  if(!url || typeof url !='string' || url.length==0) return;
  let u=url, rs=global.modules; if (!rs[u]) 
  {        
    rs[u]={exports:{}}; let x = new XMLHttpRequest(); x.open('get', u, false); x.send(); 
    if (x.status === 200 && x.readyState == XMLHttpRequest.DONE) 
    {
      let fnBody = x.responseText; 
      new Function('exports','module',fnBody)(rs[u].exports,rs[u]); 
    }
    else throw new Error(`require ${u} failed: ${x.status}`);
  }
  return rs[u].exports;
};


$(function()
{
  document.title=lefamin.name;
  getData();
});

function getData()
{
  axios.all(['head','foot'].map(p=>axios.get(`/front/${p}.htm`)))
  .then(axios.spread((head, foot)=>
  {    
    let ts=[head, foot]; if(!ts.every(t=>t.statusText==="OK"))
    {console.log('get templates failed');return;}
    VueComponents(ts.map(t=>t.data));
    startVue();
  }));
}


function startVue()
{  
  const routes = lefamin.routes.map(r=>
  {return { path: r.path, component: ()=> require2(`/front/${r.name}.js`) }}); //console.log(routes);
  const router = new VueRouter({ mode: 'history', routes });
  const app = new Vue(
  { 
    el:'#pageCr',
    data:
    {
      site:lefamin, 
      ui:{width:$(window).width(), height:$(window).height(), fontSize:16, showSiteMenu:false}
    },
    router,
    methods: 
    {
      goBack() { history.length > 1 ? this.$router.go(-1) : this.$router.push('/'); }
    },
    mounted:function()
    {
      
    }
  });
}


lefamin.setLoginCookies=function(email, pd, token,autoLogin)
{
  Cookies.set("email", email); Cookies.set("pd", pd); Cookies.set("token", token);
  Cookies.set("autoLogin",autoLogin?"1":"");
};
lefamin.login=function(email, pd, done)
{
  if(!done) done=msg=>{};
  if(!email || !pd)
  {
    if(Cookies.get("autoLogin")=='1')
    { email = Cookies.get("email"); pd = Cookies.get("pd"); }
  }  
  if(email && pd)
  {
    axios.post('/api/user/login',{email, pd}).then(r=>
    {
      console.log(r.data); done(r.data);
    });
  }
  else 
  {
    done("缺少登录账号");
  }
};


function VueComponents([head, foot])
{  
  Vue.component('LefaminHead', 
  {
    props: { 'site': Object, 'ui': Object },
    data:function(){return {siteNameCrMarginLeft:"0",siteMenuCrWidth:"0"}},
    template: head, 
    methods:
    {
      setupUI()
      {
        if(this.siteNameCrMarginLeft!=0) return;
        let userCrWidth= $("#userCr").outerWidth()+1;
        let menuEntryCrWidth= $("#menuEntryCr").outerWidth()+1;
        let siteNameCrWidth= $("#siteNameCr").outerWidth()+1; 
        let r= this.ui.width-userCrWidth-menuEntryCrWidth-siteNameCrWidth; r=r/2-this.ui.fontSize*1.2;
        if(r==0) r=1; this.siteNameCrMarginLeft = r+"px";   
        this.siteMenuCrWidth=(this.ui.width-this.ui.fontSize*2.3)+"px";        
      },
      menuItemClick() { this.ui.showSiteMenu = false;}
    }, 
    mounted:function()
    {
      this.setupUI();
    }
  });
  Vue.component('LefaminFoot', 
  {
    props: { 'site': Object, 'ui': Object},
    template: foot, 
    methods:
    {
    
    }, 
    mounted:function()
    {    

    }
  }); 
  Vue.component('LefaminErrors', 
  {
    props: { 'errors': Array },
    template: '<div v-if="errors.length>0" class="errors"><div v-for="error in errors">{{error}}</div></div>'
  });
}