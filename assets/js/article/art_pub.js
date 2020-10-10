$(function () {
  var layer = layui.layer;
  var form = layui.form;

  initCate();
  // 初始化富文本编辑器
  initEditor();

  // 1. 初始化图片裁剪器
  var $image = $('#image');
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  };
  // 3. 初始化裁剪区域
  $image.cropper(options);

  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        };
        // 调用模板引擎
        var htmlStr = template('tpl_cate', res);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      }
    });
  };

  // 选择封面绑定事件
  $("#btnChooseImage").on("click", function () {
    $("#coverFile").click();
  });

  $("#coverFile").on("change", function (e) {
    var files = e.target.files;
    if (files.length === 0) {
      return;
    };
    var file = e.target.files[0];
    var newImgURL = URL.createObjectURL(file);
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options);        // 重新初始化裁剪区域
  });


  var art_state = '已发布';
  $("#btnSave2").on("click", function () {
    art_state = '草稿';
  });

  $("#form_pub").on("submit", function (e) {
    e.preventDefault();
    var fd = new FormData($(this)[0]);
    fd.append('state', art_state);

    // 将封面裁剪过后的文件，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append('cover_img', blob);
        publishArticle(fd);
      });
  });

  // 发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 如果向服务器提交的是 FormData格式数据，要添加两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        };
        layer.msg(res.message);
        // 发布文章成功后跳转到文章列表页面
        location.href = '/article/art_list.html';
      }
    });
  };

});