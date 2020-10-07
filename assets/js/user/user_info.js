$(function () {
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    nickName: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在1 ~ 6个字符'
      };
    }
  });

  // 初始化用户信息
  initUserInfo();
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取公户信息失败')
        };
        // 快速给表单赋值
        form.val('formUserInfo', res.data)
      }
    });
  };

  // 重置表单数据
  $("#btnReset").on("click", function (e) {
    // 阻止表单默认重置
    e.preventDefault();
    initUserInfo();
  })

  $(".layui-form").submit(function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败');
        };
        layer.msg('更新用户信息成功');
        // 调用夫页面中的方法，重新渲染用户头像和昵称
        window.parent.getUserInfo();
      }
    })
  })


});