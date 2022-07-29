$(function(){
  let layer=layui.layer;
  let form=layui.form;
  function initCateList(){
    $.ajax({
      method:"GET",
      url:"/my/article/cates",
      success:function(res){
        if(res.status!==0){
          return layer.msg("获取文章分类列表失败!")
        }else{
          // 调用模版引擎渲染数据
      let htmlStr=    template("tmp-cate",res);
      $("[name='cate_id']").html(htmlStr);
      // 因为下拉框是后来才加上的所以需要重新渲染
      form.render()
        }
      }

    })
  }
  // 初始化富文本编辑器
initEditor()
  initCateList();
// 实现基本的裁剪效果
  // 1. 初始化图片裁剪器
  var $image = $('#image')
  
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  
  // 3. 初始化裁剪区域
  $image.cropper(options)
  // 点击选择封面手动触发文件文本框的点击
  $("#btn-choose").on("click",function(){
    $("#file").click()
  })

  // 监听文件是否被选择
  $("#file").on("change",function(e){
    let files=e.target.files;
    // 判断用户是否选择文件
    if(files.length==0){
      return layer.msg("请选择文件!")
    }
    let file = e.target.files[0];
    // 为选择的图片创建新的url地址
    var newImgURL = URL.createObjectURL(file);
    $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newImgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
  })
  let state="已发布";
  // 为存为草稿按钮绑定事件处理函数
  $("#resave").on("click",function(){
    state="草稿"
  })
  // 监听表单的提交事件
  $("#form-pub").on("submit",function(e){
    e.preventDefault();
    // 创建formData对象
    let fd=new FormData(this);
    fd.append("state",state);
    // 将图片转换为文件
    $image
  .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
    width: 400,
    height: 280
  })
  .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
    // 得到文件对象后，进行后续的操作
    fd.append("cover_img",blob)

  })
  // 发布文章
  publishArticle(fd)


  })
  function publishArticle(fd){
    $.ajax({
      method:"POST",
      url:"/my/article/add",
      // FormData格式的数据必须要加上
      contentType:false,
      processData:false,
      data:fd,
      success:function(res){
        if(res.status!==0){
          return layer.msg("发布文章失败!")
        }else {
          layer.msg("发布文章成功!");
          // 跳转到文章列表页
          location.href="/article/art_list.html"
  
        }
      }
    })
  }  
})