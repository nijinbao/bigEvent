$(function(){
  // 获取提交到服务器的查询参数的信息
  let q={
    pagenum:1,//第几页
    pagesize:2,//每页显示多少条数据
    cate_id:'',//文章分类的Id
    state:""//文章的状态
  }
  let layer=layui.layer;
  let form=layui.form;
  let laypage=layui.laypage;

  // 定义一个初始化文章列表的函数
  function initTable(){
    $.ajax({
      method:"GET",
      url:"/my/article/list",
      data:q,
      success:function(res){
        if(res.status!==0){
          return layer.msg("获取文章列表失败")
        }else{
         let htmlStr= template("tmp-table",res);
        //  将模版字符串渲染到指定的容器之中
        $("tbody").html(htmlStr)
        // 渲染分页数据
        renderPage(res.total)
        }
      }
    })
  }
  initTable();
  // 定义一个美化时间的过滤器
  template.defaults.imports.dateFormat=function(date){
    // 将时间格式的字符串转换为时间对象
    date=new Date(date);
    let y=padZero(date.getFullYear());
    let m=padZero(date.getFullMonth()+1);
    let d=padZero(date.getDate());
    let hh=padZero(date.getHours());
    let mm=padZero(date.getMinutes());
    let ss=padZero(date.getSeconds());
    return y+"-"+m+"-"+"d"+"-"+hh+"-"+mm+"-"+ss
  }
  // 定义一个补零函数
  function padZero(time){
    return time>10?time:"0"+time;
  }
  // 定义一个渲染分类下拉框的函数
  function initCate(){
    $.ajax({
      method:"GET",
      url:"/my/article/cates",
      success:function(res){
        if(res.status!==0){
          return layer.msg("获取文章分类列表失败!")
        }else{
          // 调用模版引擎渲染页面
          console.log(res);
       let htmlStr=template("tmp-Cate",res);
       $("[name='cate_id']").html(htmlStr);
       form.render()
        }
      }
    })
  }
  initCate();
  // 监听表单的提交按钮事件
  $("#form-search").on("submit",function(e){
    e.preventDefault();
    // 获取cate_id和state的值
    let cate_id=$('[name="cate_id"]').val();
    let state=$('[name="state"]').val();
    q.cate_id=cate_id;
    q.state=state;

    // 重新渲染表格数据
  initTable();
  })  

  // 定义渲染分页的方法
  function renderPage(total){
    laypage.render({
      elem: 'page' //注意，这里的 test1 是 ID，不用加 # 号
      ,count: total, //数据总数，从服务端得到
      limit:q.pagesize,
      curr:q.pagenum,
      // 自定义排版
      layout:['count','limit','prev', 'page', 'next','skip'],
      limits:[1,2,3,4,5],
      // jump函数被触发的两种情况
      // 1 点击页码值发生切换时,切换每页显示数据条目时也会触发
      // 2 调用laypage.render方法时会被触发
      jump:function(obj,first){
        // 将查询参数中的pagenum赋值为最新的数值
        q.pagenum=obj.curr;
        q.pagesize=obj.limit
        // first是一个boolean类型的值
        // 如果不是第一次调用render函数触发，first值为undefined
        if(!first){
          initTable()
        }
        
      }
    });
  }

  // 通过事件代理为删除按钮绑定事件处理函数
  $("tbody").on("click",$("#btn-del"),function(){
    // 获取删除按钮的Id
    let Id=$(this).attr("data-Id");
    // 获取当前页面的个数通过删除按钮的个数进行判断
    let length=$("#btn-del").length;
    layer.confirm('是否删除?', {icon: 3, title:'提示'}, function(index){
      //do something
      // 发送请求删除数据
      $.ajax({
        method:"GET",
        url:"/my/article/deletecate/:id"+Id,
        success:function(res){
          if(res.status!==0){
            return layer.msg("删除失败!")
          }else{
            // 删除数据成功
            // 数据删除成功之后判断当前页是否还有剩余的数据，如果没有将当前页-1重新渲染页面
            // 如果当前页面的数据为1
            layer.msg("删除成功!")
            if(length==1){
              // 判断当前页面的页数是否为1，不为1就-1
              q.pagenum=q.pagenum==1?1:q.pagenum-1;
            }
            // 重新渲染表格数据
            initTable()
          }
        }
      })
      layer.close(index);
    });
  })
})