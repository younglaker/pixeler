;
(function(window) {

  window.EasyCanvas = EasyCanvas = function(selector, root_id, tag) {
    return new CanvasObj(selector, root_id, tag);
  };

  var CanvasObj = function(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.defaults = {
      basic: false,
      ccw: false,
      closed: false,
      endAngle: 2 * Math.PI,
      fillColor: "transparent",
      font: "14px Arial Black 500",
      fontColor: "#000",
      fontStroke: false,
      lineCap: "butt",
      lineJoin: "miter",
      lineMiterLimit: 100,
      lineWidth: 1,
      fillLinerGradient: false,
      fillRradialGradient: false,
      points: [
        [0, 0],
        [0, 0]
      ],
      shadow: false,
      shadowX: false,
      shadowY: false,
      shadowBlur: false,
      shadowColor: false,
      startAngle: 0,
      strokeColor: "#000",
      strokeLinerGradient: false,
      strokeRradialGradient: false,
      stop: [
        [0, "black"],
        [1, "white"]
      ],
      text: null,
      textBaseline: "alphabetic",
      textAlign: "start"
    };

    /*
     *  Draw
     */
    this._draw = function() {
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.closePath();
    }

    /*
     *  Renew defaults with original defaults
     */
    this._renewDefaults = function() {
      this.defaults = JSON.parse(JSON.stringify(g_defaults));
    }
  };

  var g_defaults = {
    basic: false,
    ccw: false,
    closed: false,
    endAngle: 2 * Math.PI,
    fillColor: "transparent",
    font: "14px Arial Black 500",
    fontColor: "#000",
    fontStroke: false,
    lineCap: "butt",
    lineJoin: "miter",
    lineMiterLimit: 100,
    lineWidth: 1,
    fillLinerGradient: false,
    fillRradialGradient: false,
    points: [
      [0, 0],
      [0, 0]
    ],
    shadow: false,
    shadowX: false,
    shadowY: false,
    shadowBlur: false,
    shadowColor: false,
    startAngle: 0,
    strokeColor: "#000",
    strokeLinerGradient: false,
    strokeRradialGradient: false,
    stop: [
      [0, "black"],
      [1, "white"]
    ],
    text: null,
    textBaseline: "alphabetic",
    textAlign: "start"
  };

  /*
   *  Extend defaults with user options
   */
  function _extendDefaults(source, settings) {
    var property;
    for (property in settings) {
      if (settings.hasOwnProperty(property)) {
        source[property] = settings[property];
      }
    }
    return source;
  }

  /*
   *  Deal with fillStyle for color/gridient/patten
   */
  function _fillStyle(ctx, opt) {
    if (opt.fillLinerGradient) {
      var parameter = opt.fillLinerGradient;
      var liner_grd = ctx.createLinearGradient(parameter[0], parameter[1], parameter[2], parameter[3]);

      for (var i = 0; i < opt.stop.length; i++) {
        liner_grd.addColorStop(opt.stop[i][0], opt.stop[i][1]);
      }

      return liner_grd;

    } else if (opt.fillRradialGradient) {
      var parameter = opt.fillRradialGradient;
      var radial_grd = ctx.createRadialGradient(parameter[0], parameter[1], parameter[2], parameter[3], parameter[4], parameter[5]);

      for (var i = 0; i < opt.stop.length; i++) {
        radial_grd.addColorStop(opt.stop[i][0], opt.stop[i][1]);
      }

      return radial_grd;

    } else {
      return opt.fillColor;
    }
  }

  /*
   *  Deal with strokeStyle for color/gridient/patten
   */
  function _strokeStyle(ctx, opt) {
    if (opt.strokeLinerGradient) {
      var parameter = opt.strokeLinerGradient;
      var liner_grd = ctx.createLinearGradient(parameter[0], parameter[1], parameter[2], parameter[3]);

      for (var i = 0; i < opt.stop.length; i++) {
        liner_grd.addColorStop(opt.stop[i][0], opt.stop[i][1]);
      }

      return liner_grd;

    } else if (opt.strokeRradialGradient) {
      var parameter = opt.strokeRradialGradient;
      var radial_grd = ctx.createRadialGradient(parameter[0], parameter[1], parameter[2], parameter[3], parameter[4], parameter[5]);

      for (var i = 0; i < opt.stop.length; i++) {
        radial_grd.addColorStop(opt.stop[i][0], opt.stop[i][1]);
      }

      return radial_grd;

    } else {
      return opt.strokeColor;
    }
  }

  /*
   *  Set basic style
   */
  function _setOpt(ctx, opt) {
    if (opt.shadowX) opt.shadow[0] = opt.shadowX;
    if (opt.shadowY) opt.shadow[1] = opt.shadowY;
    if (opt.shadowBlur) opt.shadow[2] = opt.shadowBlur;
    if (opt.shadowColor) opt.shadow[3] = opt.shadowColor;

    ctx.fillStyle = _fillStyle(ctx, opt);
    ctx.strokeStyle = _strokeStyle(ctx, opt);
    ctx.lineWidth = opt.lineWidth;
    ctx.lineCap = opt.lineCap;
    ctx.lineJoin = opt.lineJoin;
    ctx.miterLimit = opt.lineMiterLimit;
    ctx.shadowOffsetX = opt.shadow[0];
    ctx.shadowOffsetY = opt.shadow[1];
    ctx.shadowBlur = opt.shadow[2];
    ctx.shadowColor = opt.shadow[3];
    ctx.beginPath();
  }

  /*
   *  Set basic style
   */
  function _dealBasic(opt, enhance) {
    var bs = {};

    // 遍历所有设置
    for (var i in opt) {
      // 把 basic 设置放入 bs
      if (!!i.match(/basic/)) {
        // 给 “baisc” 填充成 “baisc0”，方便后续遍历
        bs[!!i.match(/basic\d+/) ? i : i + "0"] = opt[i];
      }
    }

    if (enhance) {
      bs = _enhanceBasic(bs);
    }

    return bs;
  }

  /*
   *  Set basic=[ ] to basic=[ [ ] ]
   */
  function _enhanceBasic(bs) {
    for (var i = 0; i < Object.keys(bs).length; i++) {

      // 把画单一图形形式的 basic=[ ] 处理为画多个图形形式的  basic=[ [ ] ]
      if (typeof bs["basic" + i][0] === "number") {
        var tmp = bs["basic" + i];
        bs["basic" + i] = [];
        bs["basic" + i][0] = tmp;
      }
    }
    return bs;
  }

  CanvasObj.prototype = {
    /*
     *  Draw line
     */
    line: function(settings) {
      var opt = _extendDefaults(this.defaults, settings);
      var bs = _dealBasic(opt);

      _setOpt(this.ctx, opt);

      for (var i = 0; i < Object.keys(bs).length; i++) {
        var basic = bs["basic" + i];

        this.ctx.moveTo(basic[0][0], basic[0][1]);

        for (var j = 1; j < basic.length; j++) {
          this.ctx.lineTo(basic[j][0], basic[j][1]);
        }

        if (opt.closed) {
          this.ctx.lineTo(basic[0][0], basic[0][1]);
        }
      }

      this._draw();
      this._renewDefaults();

      return this;
    },

    /*
     *  Draw arc
     */
    arc: function(settings) {
      var opt = _extendDefaults(this.defaults, settings);
      var bs = _dealBasic(opt);

      _setOpt(this.ctx, opt);

      for (var i = 0; i < Object.keys(bs).length; i++) {
        var basic = bs["basic" + i];

        // Counterclockwise
        if (basic[5] === undefined) {
          basic[5] = false;
        }

        this.ctx.beginPath();
        this.ctx.arc(basic[0], basic[1], basic[2], basic[3], basic[4], basic[5]);

        if (opt.closed) {
          this.ctx.lineTo(basic[0][0], basic[0][1]);
        }
        this._draw();

      }

      this._renewDefaults();

      return this;
    },

    /*
     *  Draw quadratic curve
     */
    quadratic: function(settings) {
      var opt = _extendDefaults(this.defaults, settings);
      var bs = _dealBasic(opt, true);

      _setOpt(this.ctx, opt);

      for (var i = 0; i < Object.keys(bs).length; i++) {
        var basic = bs["basic" + i];

        this.ctx.beginPath();

        for (var j = 0; j < basic.length; j++) {

          if (j === 0) { // basic0
            this.ctx.moveTo(basic[j][0], basic[j][1]);
            this.ctx.quadraticCurveTo(basic[j][2], basic[j][3], basic[j][4], basic[j][5]);

          } else { // 其他basic使用上一笔画的结束点作为此笔画的起始点
            this.ctx.moveTo(basic[j - 1][4], basic[j - 1][5]);
            this.ctx.quadraticCurveTo(basic[j][0], basic[j][1], basic[j][2], basic[j][3]);
          }
        }

        if (opt.closed) {
          this.ctx.lineTo(basic[0][0], basic[0][1]);
        }
        this._draw();
      }

      this._renewDefaults();

      return this;
    },

    /*
     *  Draw bezier curve
     */
    bezier: function(settings) {
      var opt = _extendDefaults(this.defaults, settings);
      var bs = _dealBasic(opt, true);

      _setOpt(this.ctx, opt);

      for (var i = 0; i < Object.keys(bs).length; i++) {
        var basic = bs["basic" + i];

        this.ctx.beginPath();

        for (var j = 0; j < basic.length; j++) {

          if (j === 0) { // basic0
            this.ctx.moveTo(basic[j][0], basic[j][1]);
            this.ctx.bezierCurveTo(basic[j][2], basic[j][3], basic[j][4], basic[j][5], basic[j][6], basic[j][7]);

          } else { // 其他basic使用上一笔画的结束点作为此笔画的起始点
            this.ctx.moveTo(basic[j - 1][6], basic[j - 1][7]);
            this.ctx.bezierCurveTo(basic[j][0], basic[j][1], basic[j][2], basic[j][3], basic[j][4], basic[j][5]);
          }
        }

        if (opt.closed) {
          this.ctx.lineTo(basic[0][0], basic[0][1]);
        }

        this._draw();
      }

      this._renewDefaults();

      return this;
    },

    /*
     *  Draw rectangle
     */
    rect: function(settings) {
      var opt = _extendDefaults(this.defaults, settings);
      var bs = _dealBasic(opt);

      _setOpt(this.ctx, opt);

      for (var i = 0; i < Object.keys(bs).length; i++) {
        var basic = bs["basic" + i];

        this.ctx.beginPath();
        this.ctx.rect(basic[0], basic[1], basic[2], basic[3]);

        this._draw();
      }

      this._draw();
      this._renewDefaults();

      return this;
    },

    /*
     *  Draw rectangle
     */
    square: function(settings) {
      var opt = _extendDefaults(this.defaults, settings);
      // var bs = _dealBasic(opt);
      var sqOpt;

      _setOpt(this.ctx, opt);

      // 遍历所有设置
      for (var i in opt) {
        if (!!i.match(/basic/)) {
          // 把正方形的边长赋值为矩形方法的高
          opt[i][3] = opt[i][2];
        }
      }

      this.rect(opt);

      this._renewDefaults();

      return this;
    },

    /*
     *  Draw text
     */
    text: function(settings) {
      this.defaults.fillColor = "#000";
      this.defaults.strokeColor = "transparent";

      var opt = _extendDefaults(this.defaults, settings);
      var bs = _dealBasic(opt);

      _setOpt(this.ctx, opt);

      for (var i = 0; i < Object.keys(bs).length; i++) {
        var basic = bs["basic" + i];

        this.ctx.beginPath();
        this.ctx.font = opt.font;
        this.ctx.textBaseline = opt.textBaseline;
        this.ctx.textAlign = opt.textAlign;

        if (basic[3] === undefined) {

          this.ctx.fillText(basic[2], basic[0], basic[1]);
          this.ctx.strokeText(basic[2], basic[0], basic[1]);
        } else {
          this.ctx.fillText(basic[2], basic[0], basic[1], basic[3]);
          this.ctx.strokeText(basic[2], basic[0], basic[1], basic[3]);
        }

        this._draw();

      }

      this.ctx.closePath();

      this._renewDefaults();

      return this;
    },

    /*
     *  Draw layer grids
     */
    coordinates: function(grid_width, coodiful, color) {
      grid_width = grid_width || 50;
      coodiful = coodiful || false;
      color = color || "#000";

      var cs_width = this.canvas.width;
      var cs_height = this.canvas.height;
      var x = cs_width / grid_width;
      var y = cs_height / grid_width;

      if (coodiful) {
        for (var i = 0; i <= x; i++) { //绘制列
          this.line({
            basic: [
              [i * grid_width, 0],
              [i * grid_width, y * grid_width]
            ]
          }).text({
            basic: [i * grid_width, 10, i * grid_width],
            fontColor: color
          });
        }

        for (var i = 0; i <= y; i++) { //绘制行
          this.line({
            basic: [
              [0, i * grid_width],
              [x * grid_width, i * grid_width]
            ]
          }).text({
            basic: [10, i * grid_width, i * grid_width],
          });
        }

      } else {
        for (var i = 0; i <= x; i++) { //绘制列
          this.line({
            basic: [
              [i * grid_width, 0],
              [i * grid_width, y * grid_width]
            ]
          });
        }

        for (var i = 0; i <= y; i++) { //绘制行
          this.line({
            basic: [
              [0, i * grid_width],
              [x * grid_width, i * grid_width]
            ]
          });
        }
      }

      return this;
    },

    /*
     *  Clean the whole or a part of canvas
     */
    clean: function() {
      if (arguments[0]) {
        this.ctx.clearRect(arguments[0], arguments[1], arguments[2], arguments[3]);
      } else {
        this.ctx.clearRect(0, 0, this.width, this.height);
      }

      return this;
    },

    /*
     *  Sav canvas to image
     */
    toImg: function(save_btn_id, img_name) {
      var button = document.getElementById(save_btn_id);
      img_name = img_name || "mypainting";
      canvas = this.canvas;
      button.href = canvas.toDataURL("image/png", 1.0);
      button.download = img_name;

      return this;
    }
  };

}(window));