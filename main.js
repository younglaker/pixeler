    var canvas, ctx;
    var circleData = new Array(15); //这个为画布的二维数组用来保存画布信息，初始化0为没有填充的，1为已填充的
    var circleColor = "#fff"; // 默认颜色为白色
    var curr_color_box = O("#colors_white").parent().son(".color_count");

    /*
     *  设置与画布对应的二维数组
     */
    for (var x = 0; x < 15; x++) {
        circleData[x] = new Array(15);
        for (var y = 0; y < 15; y++) {
            circleData[x][y] = 0;
        }
    }

    /*
     *  绘制画布
     */
    function drawRect() {  //页面加载完毕调用函数，初始化画布
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        for (var i = 0; i <= 600; i += 40) {  //绘制画布的线
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(600, i);
            ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 600);
            ctx.closePath();
            ctx.stroke();
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
            circleData[x][y] = 1;
        }

        count = parseInt(curr_color_box.html()) + 1;
        curr_color_box.html(count);
    }

    /*
     *  清除拼豆
     */
    function clearCircle(x, y) {
        var count;

        ctx.fillStyle="#ddd";
        ctx.fillRect(x * 40  + 1, y * 40 + 1, 38, 38);
        circleData[x][y] = 0;

        count = parseInt(curr_color_box.html()) - 1;
        curr_color_box.html(count);
    }

    /*
     *  获取新颜色
     */
    O(".colors").click(function(){
        circleColor = Oct.rgbToHex(O(this).getCss("background-color"));
        curr_color_box = O(this).parent().son(".color_count");
    });

    /*
     *  开始在画布上点击
     */
    O("#canvas").mousedown(function(e){
        play(e);
    });
