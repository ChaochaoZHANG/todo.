const template=await axios.get('/front/index.htm'); 
module.exports=
{
  template: template.data
};