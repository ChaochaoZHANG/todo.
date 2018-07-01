const template=await axios.get('/front/login.htm'); 
module.exports=
{
  data: () =>
  {
    return {
      user: { data: { email: '', pd: '' }, ui: { autoLogin: false } },
      errors: []
    };
  },
  methods:
  {
    login()
    {
      if(this.checkInputs()) 
      {
        let email = this.user.data.email, pd = this.user.data.pd;
        lefamin.login(email, pd, r=>
        {
          if (r.msg == 'OK')
          {
            lefamin.setLoginCookies(email, pd, r.token, this.user.ui.autoLogin);
            lefamin.user.email = email; lefamin.user.pd = pd; lefamin.user.token = r.token;
            location.href = '/todo';
          }
          else this.errors.push(r.msg);
        });
      }
    },
    checkInputs()
    {
      let errors = [], u=this.user.data, email=u.email, pd=u.pd, lefa=lefamin;
      if (email.indexOf("@") == -1) errors.push('请输入正确的email');
      else if (email.length<lefa.emailMin) errors.push(`email至少为${lefa.emailMin}位`);
      else if (email.length>lefa.emailMav) errors.push(`email最多为${lefa.emailMax}位`);
      else if (pd.length<lefa.passwordMin) errors.push(`password至少为${lefa.passwordMin}位`);
      else if (pd.length>lefa.passwordMav) errors.push(`password最多为${lefa.passwordMax}位`);
      this.errors = errors; if (errors.length) return false; else return true;
    }
  },
  template: template.data
};

