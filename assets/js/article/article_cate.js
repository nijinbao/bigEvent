$(function(){
  let layer=layui.layer;
  let form=layui.form;
  function initCateList(){
    $.ajax({
      method:"GET",
      url:"/my/article/cates",
      success:function(res){
if(res.status!==0){
  return layer.msg("获取分类信息失败!")
}else {

  // 渲染模版
 let htmlStr= template("tmp-table",res);
  // 将模版字符串渲染到指定容器之中
  $("tbody").html(htmlStr);
}
      }
    })
  }
  initCateList();
  let index=null;
  // 点击添加分类设置对应的事件处理函数
  $("#addCate").on('click',function(){
  index=  layer.open({
      title: '添加文章分类'
      ,content: $("#form-addCate").html(),
      type:1,
      area: ['500px', '300px']
    });     
      
  })
// 给确认添加按钮绑定事件处理函数
// 因为当事件绑定时，对应的结构还没有被创建所以使用事务代理
// 通过代理的形式，为 form-add 表单绑定 submit 事件
$('body').on('submit', '#form-add', function(e) {
  e.preventDefault()
  $.ajax({
    method: 'POST',
    url: '/my/article/addcates',
    data: $(this).serialize(),
    success: function(res) {
      if (res.status !== 0) {
        return layer.msg('新增分类失败！')
      }
      initCateList()
      layer.msg('新增分类成功！')
      // 根据索引，关闭对应的弹出层
      layer.close(index)
    }
  })
})
let editIndex=null;
// 通过事件代理给修改按钮添加事件处理函数
$("tbody").on("click","#btn-edit",function(){
  // 弹出修改类别对话框
editIndex= layer.open({
  title: '修改文章分类'
  ,content: $("#form-editCate").html(),
  type:1,
  area: ['500px', '300px']
});   
// 获取点击的Id值
let Id=$(this).attr("data-Id");
// 发送ajax请求获取文章分类数据
$.ajax({
  method:"GET",
  url:"/my/article/cates/"+Id,
  success:function(res){
  //  进行数据填充
form.val("form-edit",res.data)
  }
})
})
$("body").on("submit","#form-edit",function(e){
  e.preventDefault();
  // 发起ajax数据请求更新数据
  $.ajax({
    method:"POST",
    url:"/my/article/updatecate",
    data:$(this).serialize(),
    success:function(res){
      if(res.status!==0){
        return layer.msg("数据更新失败!")
      }else {
        // 关闭对话框
        layer.close(editIndex);
        layer.msg("数据更新成功!");
        // 重新渲染页面
        initCateList()
      }
    }
  })
})
// 通过事件代理给删除按钮绑定事件处理函数
$("tbody").on("click","#btn-delete",function(){
//  弹出对话框
layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
  //do something
  // 发起ajax请求删除表单元素
  let id=$(this).attr("data-Id");
  $.ajax({
    method:"GET",
    url:"/my/article/deletecate/"+id,
    success:function(res){
      if(res.status!==0){
        return layer.msg("删除数据失败!")
      }else {
        // 关闭对话框
        layer.close(index);
        layer.msg("删除数据成功!");
        // 重新渲染页面
        initCateList();


      }
    }
  })
});
})
})