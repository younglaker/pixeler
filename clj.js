    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var circleData = []; //这个为画布的二维数组用来保存画布信息，初始化0为没有填充的，1为已填充的
    var grid_width = 40; // 画布格子宽度
    var circleColor = "#fff"; // 默认颜色为白色
    var curr_color_box = O("#color_cnt_white");
    var curr_color_id = O("#color_cnt_white").getAttr("id");
    var row = 9, col = 11;

    /*
     *  绘制画布
     *  页面加载完毕调用函数，初始化画布
     */
    function drawRect() {  // row:行数，col:列数
        var x_width = col * grid_width,
            y_width = row * grid_width;

        // i从20开始，是为了留位置显示坐标
        for (var i = 20; i <= y_width + 20; i += grid_width) {  //绘制行
            ctx.beginPath();
            ctx.fillStyle = "#000";
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
        for (var x = 0; x < col; x++) {
            circleData[x] = [];
            for (var y = 0; y < row; y++) {
                circleData[x][y] = 0;
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
            ctx.arc((x + 1) * 40, (y + 1) * 40, 15, 0, Math.PI * 2, true);
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
        ctx.fillStyle = "#ddd";
        ctx.beginPath();
        ctx.arc((x + 1) * 40, (y + 1) * 40, 16, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        // 计数减1
        count = parseInt(del_color.html()) - 1;
        del_color.html(count);
        // 清除circleData所记录的颜色计数标签id
        circleData[x][y] = 0;
    }

    /*
     *  清除拼豆
     */
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);   
    }

    /*
     *  获取新颜色
     */
    O(".colors").click(function(){
        circleColor = Oct.rgbToHex(O(this).getCss("background-color"));
        curr_color_box = O(this).parent().son(".color_count");
        curr_color_id = curr_color_box.getAttr("id");

        var ds = this;
        console.log("message");
        console.log(ds);
        // 清除原来含有.act的按钮
        O(this).parent().parent().parent().son("&li").son(".color_box").remove(".act");
        // 给当前大小按钮加.act
        O(ds).parent().add(".act");
    });

    /*
     *  开始在画布上点击
     */
    O("#canvas").mousedown(function(e){
        play(e);
    });

    /*
     *  更换画布大小
     */
    O(".siser_btn").click(function(){
        // size:按钮的文字; row:行数; col:列数
        var size;
        var ds = this;
        // 清除原来含有.act的按钮
        O(this).parent().parent().son("&li").son(".siser_btn").remove(".act");
        // 给当前大小按钮加.act
        O(ds).add(".act");
        // 获取行列大小
        size = O(ds).html().match(/\d+/g);
        col = parseInt(size[0]);
        row = parseInt(size[1]);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRect(col, row);
    });

    O(".clear_canvas").click(function(){
        clearCanvas();
        drawRect(col, row);
    });