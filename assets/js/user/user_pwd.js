$(function(){
  let form=layui.form;
  // 设置表单的验证规则
  form.verify({
    // 原密码和旧密码不能相同
    samePwd:function(value){
      if(value==$("[name='oldPwd']").val()){
        return "新密码和原密码不能相同"
      }
    },
    // 新密码和确认的新密码必须相同
    rePwd:function(value){
      if(value!==$("[name='newPwd']").val()){
        return "两次密码不相同"
      }
    }
  })
  // 发起请求更新密码
  $(".layui-form").on("submit",function(e){
    e.preventDefault();
    $.ajax({
      method:"POST",
      url:"/my/updatepwd",
      // 获取表单的提交信息
      data:$(".layui-form").serialize(),
      success:function(res){
        if(res.status!==0){
          return layui.layer.msg("更新密码失败")
        }else{
          // 重置表单
          $(".layui-form")[0].reset();
          layui.layer.msg("更新密码成功")
        }
      }
    })
  })
})