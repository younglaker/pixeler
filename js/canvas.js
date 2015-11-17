var CanvasObj = function (canvasId) {
    var canvas = document.getElementById(canvasId);
    this.ctx = canvas.getContext("2d");
};

CanvasObj.baseSettings = {
	color: "#000",
	startPoint: {x: 0, y: 0},
	endPoint: {x: 0, y: 0}
};

CanvasObj.prototype = {
	drawLine: function(settings) {
		var opt = $.extend(CanvasObj.baseSettings, settings);
		this.ctx.beginPath();
		this.ctx.moveTo(opt.startPoint.x, opt.startPoint.y);
		this.ctx.lineTo(opt.endPoint.x, opt.endPoint.y);
		this.ctx.strokeStyle = opt.color;
		this.ctx.stroke();
		this.ctx.closePath();
	},

	drawRect: function (argument) {
		// body...
	}
}