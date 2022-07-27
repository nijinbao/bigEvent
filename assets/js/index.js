$(function(){
  // 获取用户信息
  getUserInfo();
  // 点击退出按钮清空localStorage中的token,跳转到登录页面
    $("#exit").on("click",function(){
      layer.confirm('确认退出?', {icon: 3, title:'提示'}, function(index){
        //do something
        // 清空localStorage中的token
        localStorage.removeItem("token");
        // 跳转到用户登录页面
        location.href="/login.html"
        // 关闭弹出框
        layer.close(index);
      })
    })

})

function getUserInfo(){
  $.ajax({
    type:"GET",
    url:'/my/userinfo',
    success:function(res){
      if(res.status!==0){
        return layui.layer.msg("获取用户信息失败!")
      }else{
        // 渲染用户头像
         renderAvatar(res.data);
      }
    },
  }
  

  
  )
}
// 渲染用户头像
function renderAvatar(data){
  // 获取用户的网名或者是账户名
  let name=data.nickname || data.username;
  // 将获取到的用户名渲染到页面上
  $("#welcome").html("欢迎&nbsp"+name);
  // 获取用户头像的地址如果没有上传就使用用户名的第一个大写后的作为头像
  let imgUrl=data.user_pic;
  if(imgUrl){
    $(".layui-nav-img").attr("src",imgUrl).show();
    // 将使用用户名的头像隐藏
    $(".text-avatar").hide()
  }else{
    let char=name[0].toUpperCase();
    $(".text-avatar").html(char).show();
    // 将用户默认头像隐藏
    $(".layui-nav-img").hide()
  }
}