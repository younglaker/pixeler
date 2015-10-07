    var g_canvas = document.getElementById("canvas");
    var g_ctx = g_canvas.getContext("2d");
    var g_circle_data = []; //这个为画布的二维数组用来保存画布信息，初始化0为没有填充的，1为已填充的
    var grid_width = 40; // 画布格子宽度
    var g_circle_color = $('.color_picker').val(); // 默认颜色为白色
    var g_col = $(".siser_col").val(), 
        g_row = $(".siser_row").val(); // g_col:列数/长，g_row:行数/宽0

    /*
     *  绘制画布
     *  页面加载完毕调用函数，初始化画布
     */
    function drawRect() {  
        var x_width = g_col * grid_width,
            y_width = g_row * grid_width;

        // i从20开始，是为了留位置显示坐标
        for (var i = 20; i <= y_width + 20; i += grid_width) {  //绘制行
            g_ctx.beginPath();
            g_ctx.fillStyle = "#000";
            g_ctx.fillText((i - 20 ) / grid_width, 0, i - 20);
            g_ctx.moveTo(20, i);
            g_ctx.lineTo(x_width + 20, i);
            g_ctx.closePath();
            g_ctx.stroke();
        }

        for (var i = 20; i <= x_width + 20; i += grid_width) {  //绘制列
            g_ctx.beginPath();
            g_ctx.fillText((i - 20 ) / grid_width, i - 20, 10);
            g_ctx.moveTo(i, 20);
            g_ctx.lineTo(i, y_width + 20);
            g_ctx.closePath();
            g_ctx.stroke();
        }


        // 设置与画布对应的二维数组
        g_circle_data = [];
        for (var x = 0; x < g_col; x++) {
            g_circle_data[x] = [];
            for (var y = 0; y < g_row; y++) {
                g_circle_data[x][y] = 0;
            }
        }

        // 把颜色计数全部清空
        O(".color_count").html("0");
    }

    /*
     *  寻找点击位置
     */
    function play(e) { //鼠标点击时发生
        var x = parseInt((e.offsetX-20) / 40);  //计算鼠标点击的区域，e.offsetX是鼠标点击处在元素内的位置。如果点击了（55，55），那么就是点击了（1，1）的位置
        var y = parseInt((e.offsetY-20) / 40);

        if (x < g_col && y < g_row) {
            if (g_circle_data[x][y] != 0) { //判断该位置是否被下过了
                clearCircle(x, y);
                return;
            }
            drawCircle(x, y);
        } else {
            return false;
        }
    }

    /*
     *  绘制拼豆
     */
    function drawCircle(x, y) { //参数为：数组位置
        var count;

        g_circle_color = $('.color_picker').val();

        if (x >= 0 && x < 15 && y >= 0 && y < 15) {
            g_ctx.fillStyle = g_circle_color;
            g_ctx.beginPath();
            g_ctx.arc((x + 1) * 40, (y + 1) * 40, 15, 0, Math.PI * 2, true);
            g_ctx.closePath();
            g_ctx.fill();
        }
    }

    /*
     *  清除拼豆
     */
    function clearCircle(x, y) {
        var count;
        var del_color = O("#" + g_circle_data[x][y]);
        // 清除拼豆
        g_ctx.fillStyle = "#ddd";
        g_ctx.beginPath();
        g_ctx.arc((x + 1) * 40, (y + 1) * 40, 16, 0, Math.PI * 2, true);
        g_ctx.closePath();
        g_ctx.fill();
        // 清除g_circle_data所记录的颜色计数标签id
        g_circle_data[x][y] = 0;
    }

    /*
     *  清除拼豆
     */
    function clearCanvas() {
        g_ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
    }

    /*
     *  获取新颜色
     */
/*    $('.color_picker').change(function(){
        g_circle_color = $('.color_picker').val();
        console.log(g_circle_color);
    });*/

    /*
     *  开始在画布上点击
     */
    O("#canvas").mousedown(function(e){
        play(e);
    });

    /*
     *  更换画布大小
     */
    O(".siser_ok").click(function(){
        var conf = confirm("更换画布会清空拼豆，是否确定？");
        if (conf == true) {
            g_col = $(".siser_col").val();
            g_row = $(".siser_row").val(); 
            g_ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
            drawRect(g_col, g_row);
        } else {
            return false;
        }
    });

    O(".clear_canvas").click(function(){
        var conf = confirm("是否确定清空？");
        if (conf == true) {
            clearCanvas();
            drawRect(g_col, g_row);
        } else {
            return false;
        }
    });

/*    $('.color_picker').colorPicker({
        color: '#FFFFFF'
    });*/

/*    $('.bg_color').colorPicker({
        animationSpeed: 100000,
        opacity: false,
        doRender: '.menu',
        renderCallback: function($elm, toggled) {
            console.log("message");
        var colors = this.color.colors,
            rgb = colors.RND.rgb;

        $('.cp-disp').css({
            backgroundColor: '#' + colors.HEX,
            color: colors.RGBLuminance > 0.22 ? '#222' : '#ddd'
        }).text('rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b +
            ', ' + (Math.round(colors.alpha * 100) / 100) + ')');

        }
    });*/
    
    $(".color_picker").minicolors({
        letterCase: 'uppercase'
    });

    $(".bg_color").minicolors({
        letterCase: 'uppercase',
        hide: function() {
            O("&body").setCss({'backgroundColor': $(this).val()});
        }
        // 下面代码是延时确定颜色，可以做到实时更新颜色，上面只是在取色器关闭时执行
        /*,
        changeDelay: 500,
        change: function(hex, opacity) {
            O("&body").setCss({'backgroundColor': $(this).val()});
        }*/
    });