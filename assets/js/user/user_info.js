$(function(){
let form=layui.form;
let layer=layui.layer;
  // 自定义数据校验规则
  form.verify({
    nickname:function(value){
      
      if(value.length>6){
        return "用户昵称不能大于6位"
      }
    }
  })
  // 自定义函数获取用户基本信息
  function initUserInfo(){
    $.ajax({
      method:"GET",
      url:"/my/userinfo",
      success:function(res){
        if(res.status!==0){
          return layer.msg("获取用户基本信息失败!")
        }else{
          // 快速的为表单赋值
          form.val("form-user-info",res.data)
        }
      }
    })
  }
  initUserInfo();
  // 给重置按钮绑定事件处理函数
  $("#btnReset").on("click",function(e){
    // 阻止重置按钮的默认行为
    e.preventDefault();
    // 再次发起获取用户基本信息的ajax请求
    initUserInfo()
  })
// 监听表单的提交事件
$(".layui-form").on("submit",function(e){
  // 阻止表单的默认提交事件
  e.preventDefault();
  // 发起数据请求，进行数据更新
  $.ajax({
    method:"POST",
    url:"/my/userinfo",
    data:$(".layui-form").serialize(),
    success:function(res){
      if(res.status!==0){
        return layer.msg("数据更新失败!")
      }else{
        // 在子页面中调用父页面中的方法重新渲染页面
        window.parent.getUserInfo();
      }
    }
  })
})
})