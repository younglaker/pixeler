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
    console.log('11');
    // 通过格子数目*格子宽度得到画布大小
    var x_width = g_col * g_grid_width,
      y_width = g_row * g_grid_width;

    // 动态设置画布大小
    g_canvas_coord.width = x_width + 100;
    g_canvas_coord.height = y_width + 100;

    g_canvas.width = x_width + 100;
    g_canvas.height = y_width + 100;

    // i从20开始，是为了留位置显示坐标
    for (var i = 20; i <= y_width + 20; i += g_grid_width) { //绘制行
      g_ctx_coord.text({ // 写行序号
        basic: [0, i - 20, (i - 20) / g_grid_width],
      }).line({ //画行线
        basic: [
          [20, i],
          [x_width + 20, i]
        ]
      });
    }

    for (var i = 20; i <= x_width + 20; i += g_grid_width) { //绘制列
      /*g_ctx_coord.beginPath();
      g_ctx_coord.fillText((i - 20) / g_grid_width, i - 20, 10);
      g_ctx_coord.moveTo(i, 20);
      g_ctx_coord.lineTo(i, y_width + 20);
      g_ctx_coord.closePath();
      g_ctx_coord.stroke();*/

      g_ctx_coord.text({ // 写列序号
        basic: [i - 20, 12, (i - 20) / g_grid_width],
      }).line({ //画列线
        basic: [
          [i, 20],
          [i, y_width + 20]
        ]
      });


    }

  }


});