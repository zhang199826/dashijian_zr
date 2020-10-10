$(function () {
  // 获取文章分类列表
  var layer = layui.layer;
  var form = layui.form;
  initArtCateList();
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        var htmlStr = template('tpl_table', res);
        $('tbody').html(htmlStr);
      }
    });
  };

  // 为添加类别按扭绑定事件
  var indexAdd = null;
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog_add').html()
    });
  });

  // 通过代理形式为表单绑定submit事件
  $('body').on('submit', '#form_add', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        };
        layer.msg('新增分类成功');
        initArtCateList();
        // 根据索引关闭对应弹出层
        layer.close(indexAdd);
      }
    });
  });

  // 通过代理给编辑绑定事件
  var indexEdit = null;
  $('tbody').on('click', '.btn_edit', function () {
    //弹出修改文章分类的层
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog_edit').html()
    });
    var id = $(this).attr('data_id');
    // 发起请求 获取对应数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        form.val('form-edit', res.data);
      }
    })
  });

  // 通过代理为修改分类表单绑定submit事件
  $("body").on('submit', '#form_edit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        };
        layer.msg(res.message);
        layer.close(indexEdit);
        initArtCateList();
      }
    });
  });

  // 通过代理为删除按钮绑定事件
  $('tbody').on('click', '.btn_delete', function () {
    var id = $(this).attr('data_id');
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        mrthod: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message);
          };
          layer.msg(res.message);
          layer.close(index);
          initArtCateList();
        }
      });
    });
  })







});
