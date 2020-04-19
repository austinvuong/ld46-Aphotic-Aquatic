var stage;
var Scene = {
	NULL: 0,
	OFFICE: 1,
	
	img: {
		//1: new createjs.Bitmap("res/img/sample-office.png")
		1: new createjs.Bitmap("https://upload.wikimedia.org/wikipedia/commons/7/71/Pixelart-tv-iso-2.png")
	}
}

$(document).ready(function(){
	stage = new createjs.Stage("gameCanvas");
	
	// TEMP use a preloader. Will still do a timer somehow
	createjs.Ticker.on("tick", tick);
	function tick(event) {
		stage.update(event);
	}
	
	var img = Scene.img[Scene.OFFICE];
	
	img.x = 8;
	img.y = 0;
		
	stage.addChild(img);
	console.log(stage);

	stage.update();
});