$(document).ready(function() {
  // 坐标画布
  var g_canvas_coord = document.getElementById("canvas_coord"); //普通 dom 元素
  var g_ctx_coord = new EasyCanvas('canvas_coord'); // EasyCanvas插件对象

  // 拼豆画布
  var g_canvas = document.getElementById("canvas");
  var g_ctx = EasyCanvas('canvas');

  var g_circle_data = []; //这个为画布的二维数组用来保存画布信息，初始化0为没有填充的，1为已填充的
  var g_grid_width = 34; // 画布格子宽度
  var g_half_grid_width = g_grid_width / 2; // 画布格子宽度的一半
  var g_circle_color = $('.color_picker').val(); // 默认拼豆颜色
  var g_pindou_shape = $('.pindou_shape:checked').val();
  var g_col = $('.siser_col').val(),
    g_row = $('.siser_row').val(); // g_col:列数/长，g_row:行数/宽0

  /*
   *  初始化坐标画布
   */
  drawCanvasCoord();

  /*
   *  绘制坐标画布
   *  页面加载完毕调用函数，初始化画布
   */
  function drawCanvasCoord() {
    // 通过格子数目*格子宽度得到画布大小
    var x_width = g_col * g_grid_width,
      y_width = g_row * g_grid_width;

    // 动态设置画布大小
    g_canvas_coord.width = x_width + 100;
    g_canvas_coord.height = y_width + 100;

    g_canvas.width = x_width + 100;
    g_canvas.height = y_width + 100;

    // i从20开始，是为了留位置显示坐标
    //绘制行
    for (var i = 20; i <= y_width + 20; i += g_grid_width) {
      g_ctx_coord.text({ // 写行序号
        basic: [0, i - 20, (i - 20) / g_grid_width]
      }).line({ //画行线
        basic: [
          [20, i],
          [x_width + 20, i]
        ],
        strokeColor: "#000"
      });
    }

    //绘制列
    for (var i = 20; i <= x_width + 20; i += g_grid_width) {

      g_ctx_coord.text({ // 写列序号
        basic: [i - 20, 12, (i - 20) / g_grid_width]
      }).line({ //画列线
        basic: [
          [i, 20],
          [i, y_width + 20]
        ]
      });
    }

    //  初始化画布对应的二维数组
    // 0: 未下过
    // 1: 被清除过
    // 颜色值: 此处颜色值
    g_circle_data = [];
    for (var x = 0; x < g_col; x++) {
      g_circle_data[x] = [];
      for (var y = 0; y < g_row; y++) {
        g_circle_data[x][y] = 0;
      }
    }

    // 把颜色计数全部清空
    $(".color_count").html("0");
  }

  /*
   *  开始在画布上点击
   */
  $("#canvas").mousedown(function(e) {
    drawPixler(e);
  });



  /*
   *  寻找点击位置
   */
  function drawPixler(e) { //鼠标点击时发生
    var x = parseInt((e.offsetX - g_half_grid_width) / g_grid_width); //计算鼠标点击的区域，e.offsetX是鼠标点击处在元素内的位置。如果点击了（55，55），那么就是点击了（1，1）的位置
    var y = parseInt((e.offsetY - g_half_grid_width) / g_grid_width);
    if (x < g_col && y < g_row) {
      if (g_pindou_shape == "rectangle") {
        if (g_circle_data[x][y] != 0 && g_circle_data[x][y] != 1) { //判断该位置是否被下过了
          clearPixl(x, y);
          return;
        }
        drawRect(x, y);
      } else {
        if (g_circle_data[x][y] != 0 && g_circle_data[x][y] != 1) { //判断该位置是否被下过了
          clearPixl(x, y);
          return;
        }
        drawCircle(x, y);
      }
    } else {
      return false;
    }
  }


  /*
   *  绘制圆形拼豆
   */
  function drawCircle(x, y) { //参数为：数组位置
    var count;

    g_circle_color = $('.color_picker').val();

    if (x >= 0 && x < g_col && y >= 0 && y < g_row) {
      // 所记录颜色
      g_ctx.arc({
        basic: [20 + g_half_grid_width * (1 + 2 * x), 20 + g_half_grid_width * (1 + 2 * y), g_half_grid_width - 4, 0, Math.PI * 2],
        strokeColor: g_circle_color,
        fillColor: g_circle_color
      });
      g_circle_data[x][y] = g_circle_color;
    }
  }

  /*
   *  绘制方形拼豆
   */
  function drawRect(x, y) { //参数为：数组位置
    var count;

    g_circle_color = $('.color_picker').val();

    if (x >= 0 && x < g_col && y >= 0 && y < g_row) {
      g_ctx.rect({
        basic: [20 + g_grid_width * x + 2, 20 + g_grid_width * y + 2, g_grid_width - 4, g_grid_width - 4],
        strokeColor: "transparent",
        fillColor: g_circle_color
      });
      // 所记录颜色
      g_circle_data[x][y] = g_circle_color;
    }
  }

  /*
   *  清除拼豆
   */
  function clearPixl(x, y) {
    var count;
    g_ctx.clean(20 + g_grid_width * x + 1, 20 + g_grid_width * y + 1, g_grid_width - 2, g_grid_width - 2);
    // 1表示标记为已覆盖过颜色
    g_circle_data[x][y] = 1;
  }


  /*
   *  调色盘插件，更换拼豆颜色
   */
  $(".color_picker").minicolors({
    letterCase: 'uppercase'
  });


  /*
   *  更换拼豆形状
   */
  $(".pindou_shape").change(function() {
    g_pindou_shape = $(".pindou_shape:checked").val();
  });

  /*
   *  清除画布
   */
  function clearCanvas() {
    g_ctx.clean(0, 0, g_canvas_coord.width, g_canvas_coord.height);
  }

  /*
   *  清空画布
   */
  $(".clear_canvas").click(function() {
    var conf = confirm("是否确定清空？");
    if (conf == true) {
      clearCanvas();
    } else {
      return false;
    }
  });


  /*
   *  更换画布大小
   */
  $(".siser_ok").click(function() {
    var conf = confirm("更换画布会清空拼豆，是否确定？");
    if (conf == true) {
      g_col = $(".siser_col").val();
      g_row = $(".siser_row").val();
      g_ctx_coord.clean(0, 0, g_canvas.width, g_canvas.height);
      drawCanvasCoord(g_col, g_row);
    } else {
      return false;
    }
  });



});