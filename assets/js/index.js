$(function () {
  // 调用函数，调用用户基本信息
  getUserInfo();

  var layer = layui.layer;
  $("#btnLogout").on("click", function () {
    // 提示用户是否确认退出
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
      //do something
      // 1.清空本地存储中的 token
      localStorage.removeItem('token');
      // 2.重新跳转到登录页面
      location.href = '/login.html';
      // 关闭弹出框
      layer.close(index);
    });
  });
});

// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: '/my/userinfo',
    // 是请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败!');
      };
      // 调用函数渲染用户头像
      renderAvater(res.data);
    },
    // 不论成功失败都会调用这个函数
    // complete: function (res) {
    //   // console.log(res);
    //   // complete中可以使用responseJSON拿到服务器响应回来的数据
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //     // 1.强制清空token
    //     localStorage.removeItem('token');
    //     // 2.强制跳转到登录页面
    //     location.href = '/login.html';
    //   }
    // }
  });
};

function renderAvater(user) {
  // 1.获取用户名称
  var name = user.nickname || user.username;
  // 2.设置欢迎文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
  // 3.按需渲染用户头像
  if (user.user_pic !== null) {
    // 3.1 渲染图片头像
    $(".layui-nav-img").attr('src', user.user_pic).show();
    $(".text_avatar").hide();
  } else {
    // 3.2 渲染文字头像
    $(".layui-nav-img").hide();
    var first = name[0].toUpperCase();
    $(".text_avatar").html(first).show();
  };
};