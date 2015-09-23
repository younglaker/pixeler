    var canvascanvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var circleData = []; //这个为画布的二维数组用来保存画布信息，初始化0为没有填充的，1为已填充的
    var grid_width = 40; // 画布格子宽度
    var circleColor = "#fff"; // 默认颜色为白色
    var curr_color_box = O("#color_cnt_white");
    var curr_color_id = O("#color_cnt_white").getAttr("id");


    /*
     *  绘制画布
     *  页面加载完毕调用函数，初始化画布
     */
    function drawRect(col, row) {  // row:行数，col:列数
        var x_width = col * grid_width,
            y_width = row * grid_width;

        // i从20开始，是为了留位置显示坐标
        for (var i = 20; i <= y_width + 20; i += grid_width) {  //绘制行
            ctx.beginPath();
            ctx.fillText((i - 20 ) / grid_width, 0, i - 20);
            ctx.moveTo(20, i);
            ctx.lineTo(x_width + 20, i);
            ctx.closePath();
            ctx.stroke();
        }

        for (var i = 20; i <= x_width + 20; i += grid_width) {  //绘制列
            ctx.beginPath();
            ctx.fillText((i - 20 ) / grid_width, i - 20, 10);
            ctx.moveTo(i, 20);
            ctx.lineTo(i, y_width + 20);
            ctx.closePath();
            ctx.stroke();
        }


        // 设置与画布对应的二维数组
        circleData = [];
        for (var x = 0; x < row; x++) {
            circleData[x] = [];
            for (var y = 0; y < col; y++) {
                circleData[x][y] = 0;
            }
        }
    }

    /*
     *  寻找点击位置
     */
    function play(e) { //鼠标点击时发生
        var x = parseInt(e.offsetX / 40);  //计算鼠标点击的区域，e.offsetX是鼠标点击处在元素内的位置。如果点击了（55，55），那么就是点击了（1，1）的位置
        var y = parseInt(e.offsetY / 40);

        if (circleData[x][y] != 0) { //判断该位置是否被下过了
            clearCircle(x, y);
            return;
        }

        drawCircle(x, y);
    }

    /*
     *  绘制拼豆
     */
    function drawCircle(x, y) { //参数为：数组位置
        var count;

        if (x >= 0 && x < 15 && y >= 0 && y < 15) {
            ctx.fillStyle = circleColor;
            ctx.beginPath();
            ctx.arc(x * 40 + 20, y * 40 + 20, 15, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
            // 所记录的颜色计数标签id
            circleData[x][y] = curr_color_id;
        }
        // 计数加1
        count = parseInt(curr_color_box.html()) + 1;
        curr_color_box.html(count);
    }

    /*
     *  清除拼豆
     */
    function clearCircle(x, y) {
        var count;
        var del_color = O("#" + circleData[x][y]);
        // 清除拼豆
        ctx.fillStyle="#ddd";
        ctx.fillRect(x * 40  + 1, y * 40 + 1, 38, 38);
        // 计数减1
        count = parseInt(del_color.html()) - 1;
        del_color.html(count);
        // 清除circleData所记录的颜色计数标签id
        circleData[x][y] = 0;
    }

    /*
     *  获取新颜色
     */
    O(".colors").click(function(){
        circleColor = Oct.rgbToHex(O(this).getCss("background-color"));
        curr_color_box = O(this).parent().son(".color_count");
        curr_color_id = curr_color_box.getAttr("id");
    });

    /*
     *  开始在画布上点击
     */
    O("#canvas").mousedown(function(e){
        play(e);
    });
