var stage;
var Scene = {
	NULL: 0,
	OFFICE: 1,
	FISH00: 2,
	FISH01: 3,
	FISH02: 4,
	
	img: {
		0: new createjs.Bitmap("res/img/testimg.png"),
		1: new createjs.Bitmap("res/img/room.png"),
		2: new createjs.Bitmap("res/img/fish00.png"),
		3: new createjs.Bitmap("res/img/fish01.png"),
		4: new createjs.Bitmap("res/img/fish02.png")
	}
}

var currentImage;
var prevImage;

$(document).ready(function(){
	stage = new createjs.Stage("gameCanvas");
	
	// TEMP use a preloader. Will still do a timer somehow
	createjs.Ticker.on("tick", tick);
	function tick(event) {
		stage.update(event);
	}
	
	currentImage = Scene.img[Scene.NULL];
	stage.addChild(currentImage);
	
	stage.update();
});

function setSceneTo(scene) {
	// TEMP
	if (currentImage == Scene.img[scene]) {
		return;
	}
	
	// TODO nicer ease
	prevImage = currentImage;
	createjs.Tween.get(prevImage).to({alpha: 0}, 300).call(removePrev, {}, this);
	
	currentImage = Scene.img[scene];
	stage.addChildAt(currentImage, 1);
	currentImage.alpha = 1;
}

function removePrev(tween) {
	stage.removeChild(prevImage);
}