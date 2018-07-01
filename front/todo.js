const template = await axios.get('/front/todo.htm'); 

function createNewTask(arr)
{
  return { data: { content: null, orderNo: getOrderNo(arr) }, ui: {} };
}
function getOrderNo(arr)
{
  let orderNo = 1; if (arr && arr.length > 0) orderNo = arr[arr.length - 1].data.orderNo + 1; 
  console.log(arr); console.log(`get orderNo: ${orderNo}`); return orderNo;
}
function makeTask(data)
{
  return { data: data, ui: { data: Object.assign({}, data), focus: false, unsaved: false, showMenu:false } };
}

module.exports=
{
  data: () => ({ active: [], showActive:true, past: [], showPast:false, important: [], newTask: createNewTask() }),
  computed:
  {
    focusTask: 
    {
      get: function ()
      {
        return this.focusTask_;
      },
      set: function (newValue)
      {
        let cf = this.focusTask_; if (newValue == cf) return; if (cf)
        {
          cf.ui.focus = false; if (cf.data.content != cf.ui.data.content)
          {
            this.updateTaskContent(cf);
          }
        }
        this.focusTask_ = newValue; if (this.focusTask_)this.focusTask_.ui.focus = true;

      }
    }
  },
  template: template.data,   
  methods:
  {    
    getData()
    {
      axios.get('/api/db/get_all/todos').then(r =>
      {
        if (r.data == 'NEEDLOGIN') { location.href = '/login'; return;}
        let data = r.data.map(t => { if (!t.orderNo) t.orderNo = 99999; return t; });
        data = data.sort((t1, t2) => (t1.orderNo < t2.orderNo ? -1 : 1));
        data.map(t => this[t.status ? t.status : 'active'].push(makeTask(t)));
        this.active = this.active; this.past = this.past; this.newTask.data.orderNo = getOrderNo(this.active);
      });
    },
    createTask()
    {
      let taskObj = makeTask(this.newTask.data); this.active.push(taskObj); this.newTask = createNewTask(this.active);
      axios.post('/api/db/create/todos', taskObj.data).then(r =>
      {
        console.log('create task result: ');console.log(r.data);
        taskObj.data.id = r.data.id; taskObj.ui.data.id = r.data.id;
      });
    },
    updateTaskContent(taskObj)
    {
      let url = '/api/db/update/todos/' + taskObj.data.id, content = taskObj.data.content;
      console.log(`send update ${url} ${content}`);
      axios.post(url, { content}).then(r =>
      {
        taskObj.ui.data.content = taskObj.data.content;
      });
    },
    deleteTask(taskObj, arr)
    {
      arr.splice(arr.indexOf(taskObj), 1);
      let url = '/api/db/delete/todos/' + taskObj.data.id;  console.log(`send delete ${url}`);
      axios.get(url).then(r =>
      {
      });
    },
    completeTask(taskObj)
    {
      taskObj.status = 'past'; taskObj.ui.showMenu = false; this.focusTask = null;
      let arr = this.active; arr.splice(arr.indexOf(taskObj), 1); this.past.splice(0, 0, taskObj);
      let url = '/api/db/update/todos/' + taskObj.data.id; console.log(`send update ${url} ${taskObj.status}`);
      axios.post(url, { status: taskObj.status }).then(r =>
      {
      });
    },
    topTask(taskObj, arr)
    {
      let data = taskObj.data; data.orderNo = 1; taskObj.ui.showMenu = false; this.focusTask = null;
      arr.splice(arr.indexOf(taskObj), 1); arr.splice(0, 0, taskObj);
      let url = '/api/db/update/todos/' + data.id; console.log(`send update ${url} ${data.orderNo}`);
      axios.post(url, { orderNo: data.orderNo }).then(r =>
      {
      });
      arr.filter(t => t != taskObj).map(t =>
      {
        let data = t.data; data.orderNo++;
        let url = '/api/db/update/todos/' + data.id; console.log(`send update ${url} ${data.orderNo }`);
        axios.post(url, { orderNo: data.orderNo }).then(r =>
        {
        });
      });
    }
  },
  mounted()
  {
    if (this.tasks) return;    
    this.getData();
    setInterval(() =>
    {

    }, 2000);
  } 
};


