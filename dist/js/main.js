$(document).ready(function() {
  // 坐标画布
  var g_canvas_coord = document.getElementById("canvas_coord"); //普通 dom 元素
  var g_ctx_coord = new EasyCanvas('canvas_coord'); // EasyCanvas插件对象

  // 拼豆画布
  var g_canvas = document.getElementById("canvas");
  var g_ctx = EasyCanvas('canvas');

  var g_grid_data = []; //这个为画布的二维数组用来保存画布信息，初始化0为没有填充的，其他值为填充颜色的值
  var g_grid_width = 34; // 画布格子宽度
  var g_half_grid_width = g_grid_width / 2; // 画布格子宽度的一半
  var g_grid_color = $('.color_picker').val(); // 默认拼豆颜色
  var g_shape = $('.pindou_shape:checked').val(); // 拼豆形状：方形(默认)、圆形
  var g_pindou_tool = $('.pindou_tool:checked').val(); // 绘制工具：画笔（默认）、橡皮擦
  var g_col = $('.siser_col').val();
  var g_row = $('.siser_row').val(); // g_col:列数/长，g_row:行数/宽0
  var draw_tag = 0;

  /*
   *  初始化坐标画布
   */
  drawCanvasCoord();
  /**
   * 初始化数据模型
   */
  resetGridData();

  /*
   *  绘制坐标画布
   *  页面加载完毕调用函数，初始化画布
   */
  function drawCanvasCoord() {
    // 通过格子数目*格子宽度得到画布大小
    var x_width = g_col * g_grid_width;
    var y_width = g_row * g_grid_width;

    // 动态设置画布大小
    g_canvas_coord.width = x_width + 100;
    g_canvas_coord.height = y_width + 100;

    g_canvas.width = x_width + 100;
    g_canvas.height = y_width + 100;


    //TODO: 此处画线并没有修正，所以画出的格子线不是1px的线。如果想画1px的线，需要对线的坐标做0.5px的修正
    // i从20开始，是为了留位置显示坐标
    // 绘制行
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

  }

  //  初始化画布对应的二维数组
  // 0: 格子初始状态
  // 颜色值: 格子颜色值
  function resetGridData() {
    g_grid_data = [];
    for (var x = 0; x < g_col; x++) {
      g_grid_data[x] = [];
      for (var y = 0; y < g_row; y++) {
        g_grid_data[x][y] = undefined;
      }
    }
  }

  /*
   *  开始在画布上点击
   */
  // 用draw_tag标记现在是否mousedown
  // mousedown的时候再通过g_pindou_tool来画图或擦掉
  $("#canvas").mousedown(function(e) {
    draw_tag = 1;
    if (draw_tag == 1 && g_pindou_tool == 'pen') {
      drawPixler(e);
    }
    else if (draw_tag == 1 && g_pindou_tool == 'eraser') {
      clearPixl(e);
    }
  }).mouseup(function(){
    draw_tag = 0;
  }).mousemove(function(e){

    // 画图
    if (draw_tag == 1 && g_pindou_tool == 'pen') {
      drawPixler(e);
    }
    // 擦掉
    else if (draw_tag == 1 && g_pindou_tool == 'eraser') {
      clearPixl(e);
    }

  });

  /*
   *  寻找点击位置
   */
  function drawPixler(e) { //鼠标点击时发生
    // 这里的x y 从0开始，存放点击的位置所在的格子的标号（数组下标）
    var x = parseInt((e.offsetX - 20) / g_grid_width);
    var y = parseInt((e.offsetY - 20) / g_grid_width);
    if (x < g_col && y < g_row) {
      var grid = g_grid_data[x][y];
      var color = $('.color_picker').val();
      grid = new Grid(x, y, color, g_shape);
      g_grid_data[x][y] = grid;
      drawGrid(grid);

    } else {
      return false;
    }
  }


  /**
   * 重绘所有已经填充过颜色的格子
   */
  function redrawGrids() {
    for (var i = 0; i < g_grid_data.length; i++) {
      var item = g_grid_data[i]
      for (var j = 0; j < item.length; j++) {
        if (item[j]) {
          drawGrid(item[j]);
        }
      }
    }
  }

  /**
   * 绘制单个格子
   */
  function drawGrid(grid) {
    if(grid.shape == 'rectangle') {
      drawRect(grid.x, grid.y, grid.color);
    } else {
      drawCircle(grid.x, grid.y, grid.color);
    }
  }


  /*
   *  绘制圆形拼豆
   */
  function drawCircle(x, y, color) { //参数为：数组位置
    if (x >= 0 && x < g_col && y >= 0 && y < g_row) {
      // 所记录颜色
      g_ctx.arc({
        basic: [20 + g_half_grid_width * (1 + 2 * x), 20 + g_half_grid_width * (1 + 2 * y), g_half_grid_width - 4, 0, Math.PI * 2],
        strokeColor: color,
        fillColor: color
      });
    }
  }

  /*
   *  绘制方形拼豆
   */
  function drawRect(x, y, color) { //参数为：数组位置
    if (x >= 0 && x < g_col && y >= 0 && y < g_row) {
      g_ctx.rect({
        basic: [20 + g_grid_width * x + 2, 20 + g_grid_width * y + 2, g_grid_width - 4, g_grid_width - 4],
        strokeColor: "transparent",
        fillColor: color
      });
    }
  }

  /*
   *  清除拼豆
   */

  function clearPixl(e) {
    // 算出点击的位置是哪个格子（数组下标）
    var x = parseInt((e.offsetX - 20) / g_grid_width);
    var y = parseInt((e.offsetY - 20) / g_grid_width);

    // 通过格子的位置（数组下标）算出这个位置与画步（0,0）位置的距离
    g_ctx.cleanRect(20 + g_half_grid_width * (2 * x), 20 + g_half_grid_width * (2 * y), g_grid_width, g_grid_width);
    g_grid_data[x][y] = undefined;
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
    g_shape = $(".pindou_shape:checked").val();
  });

  /*
   *  更换工具
   */
  $(".pindou_tool").change(function() {
    g_pindou_tool = $(".pindou_tool:checked").val();
  });

  /*
   *  清除画布
   */
  function clearCanvas() {
    g_ctx.cleanRect(0, 0, g_canvas_coord.width, g_canvas_coord.height);
  }

  /*
   *  清空画布
   */
  $(".clear_canvas").click(function() {
    var conf = confirm("是否确定清空？");
    if (conf == true) {
      clearCanvas();
      resetGridData()
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
      g_ctx_coord.cleanRect(0, 0, g_canvas.width, g_canvas.height);
      drawCanvasCoord(g_col, g_row);
      resetGridData();
    } else {
      return false;
    }
  });

  /*
   *  保存成图片
   */
  $("#save_canvas").click(function() {
    g_ctx.toImg('save_canvas', $("#pic_name").val());
  });


  /**
   * 格子的数据模型
   * @param {Object} x 坐标，数组索引
   * @param {Object} y 坐标，数组索引
   * @param {Object} color 颜色
   * @param {Object} shape 形状
   */
  function Grid(x, y, color, shape) {
    this.x = x
    this.y = y
    this.color = color
    this.shape = shape
  }


});


