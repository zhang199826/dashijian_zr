$(function () {
  var form = layui.form;
  var laypage = layui.laypage;
  // 定义美化时间过滤器
  template.defaults.imports.dataFormat = function (data) {
    const dt = new Date(data);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss;
  };

  // 定义补零函数
  function padZero(n) {
    return n > 9 ? n : '0' + n;
  }

  // 定义查询参数对象，将请求参数对象移交到服务器
  var q = {
    pagenum: 1, //页码值
    pagesize: 2, // 每页显示几条数据
    cate_id: '', // 文章分类的 ID
    state: '' // 文章的状态
  };

  initTable();
  initCate();

  var layer = layui.layer;
  // 获取文章列表数据
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        };
        // 使用模板引擎渲染数据
        layer.msg(res.message);
        var htmlStr = template('tpl_table', res);
        $('tbody').html(htmlStr);
        // 调用渲染分页方法
        renderPage(res.total);
      }
    });
  };

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        };
        // 调用模板引擎渲染可选项
        var htmlStr = template('tpl_cate', res);
        $('[name=cate_id]').html(htmlStr);
        // 通知layui 重新渲染表单 UI 结构
        form.render();
      }
    });
  };

  // 筛选方法
  $('#form_search').on('submit', function (e) {
    e.preventDefault();
    var cate_id = $('[name=cate_id]').val();
    var state = $('[name=state]').val();
    q.cate_id = cate_id;
    q.state = state;
    initTable();
  });

  // 定义渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: 'pageBox',  //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, // 每页显示数据数
      curr: q.pagenum, // 默认选中分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [1, 2, 3, 4, 5, 6],
      // 分页发生切换时触发的函数
      jump: function (obj, first) {
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        if (!first) {
          initTable();
        }
      }
    });
  };

  // 删除按钮绑定事件
  $("tbody").on("click", ".btn_delete", function () {
    var id = $(this).attr("data_id");
    var len = $(".btn_delete").length;
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message);
          };
          layer.msg(res.message);
          // 数据完成后，判断当前页面是否还有剩余数据
          if (len === 1) {
            q.pagenum = q.pagenum - 1;
          };
          initTable();
          layer.close(index);
        }
      });
    });
  });
});