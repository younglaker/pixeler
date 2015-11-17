$(document).ready(function() {
    var a = new CanvasObj("canvas");
    a.drawLine({
    	color: "#f00",
    	startPoint: {x: 20,	y: 20}
    });
    var b = new CanvasObj("canvas2");
    b.drawLine({
    	color: "#0000ff",
    	startPoint: {x: 20,	y: 20}
    });
});