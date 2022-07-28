$(function(){
  let layer=layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
      // 纵横比
      aspectRatio: 1,
      // 指定预览区域
      preview: '.img-preview'
    }
  
    // 1.3 创建裁剪区域
    $image.cropper(options);
  /* 点击上传模拟input文件上传的点击事件 */
  $("#upload").on("click",function(){
    $("#file").click()
  })

  // 给上传文件的input绑定事件处理函数
  $("#file").on("change",function(e){
    // 判断是否上传文件
    if(e.target.files.length==0){
      return layer.msg("上传文件为空!")
    }else {
      var file = e.target.files[0];
      var newImgURL = URL.createObjectURL(file);
      $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newImgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
    }
  })
// 给确定按钮绑定点击事件处理函数
$("#sureUpload").on("click",function(){
  // 拿到用户上传的头像裁剪后将其转换为base64格式的字符串
  var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
// 发送请求，将数据上传到服务器
$.ajax({
  method:"POST",
  url:"/my/update/avatar",
  data:{avatar:dataURL},
  success:function(res){
    if(res.status!==0){
      return layer.msg("头像更新失败!")
    }else {
      // 更新页面
      // 调用父页面的方法重新渲染头像
      window.parent.getUserInfo()
    }
  }
})
    })


})
