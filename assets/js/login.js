$(function(){
  // 给去登录这个链接绑定点击事件
  $("#link-login").on("click",function(){
    $(".login-box").show();
    $(".reg-box").hide()
  })
  // 给去注册账号这个超链接绑定点击事件
  $("#link-reg").on("click",function(){
    $(".login-box").hide();
    $(".reg-box").show()
  })
  // 从layui中引入form模块
  let form=layui.form;
  // 引入layer模块
  let layer=layui.layer;
  // 设置自定义验证规则
form.verify({
  pwd: [
    /^[\S]{6,12}$/
    ,'密码必须6到12位，且不能出现空格'
  ] ,
  repwd:function(value){
    // value是确认密码的时候获取到的文本输入
    // 校验value值与上次输入的密码是否一致不一致return文本提示即可
    let preval=$(".reg-box [name=password]").val();
    if(preval!==value){
      return "两次密码输入不一致!"
    }
  }
})
// 给注册表单绑定提交的事件处理函数
$("#form-reg").on("submit",function(e){
  // 阻止表单提交的对默认行为
  e.preventDefault();
  // 获取用户注册表单的数据
  let uname=$(".reg-box #username").val();
  let pwd=$(".reg-box #password").val();
  let data={username:uname,password:pwd}
  // 发起ajax请求
  $.post("/api/reguser",data,function(res){
    if(res.status!==0){
    return layer.msg(res.message)
    }else {
     layer.msg("注册成功，请登录!");
    //  模拟人的点击事件使得跳转到登录页面
    $("#link-login").click()
    }
  })
})
// 给登录表单绑定提交事件处理函数
$(".login-box").submit(function(e){
  // 阻止表单提交的默认行为
  e.preventDefault()
  // 获取表单数据
  let data=$("#form-login").serialize();
  // 发起ajax请求提交表单数据
  $.post("/api/login",data,function(res){
  if(res.status!==0){
    return layer.msg("登录失败!")
  }else {
    // 将服务器发送给我们的token存储在本地localStorage中
    localStorage.setItem("token",res.token);
    layer.msg("登录成功!");
    location.href="./index.html"
  }
  })
})

})