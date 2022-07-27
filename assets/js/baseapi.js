$.ajaxPrefilter(function(options){
  options.url="http://www.liulongbin.top:3007"+options.url;
  // 优化网络请求在每一次发送ajax请求之前首先判断请求的url地址中是否包含/my，如果包含添加请求头headers
  if(options.url.indexOf("/my")!==-1){
    options.headers={
      Authorization:localStorage.getItem("token")
    };

};
   // 优化网络请求
options.complete=function(res){
    // 如果用户请求头中Authorition没有token值无法进入主页
if(res.responseJSON.status==1 && res.responseJSON.message=="身份认证失败！" ){
// 清空token
localStorage.removeItem("token");
// 跳转到登录页面
location.href="/login.html"
  }
}
})