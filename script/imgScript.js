var Scene = {
	NULL: 0,
	OFFICE: 1,
	FISH00: 2,
	FISH01: 3,
	FISH02: 4,
	
	path: {
		0: "res/img/testimg.png",
		1: "res/img/room.png",
		2: "res/img/fish00.png",
		3: "res/img/fish01.png",
		4: "res/img/fish02.png"
	}
}

var currentImage;
var prevImage;

$(document).ready(function(){
	
  prevImage = Scene.path[Scene.NULL];
	currentImage = Scene.path[Scene.NULL];
  
  //$("#image-top").toggleClass("transparent");

});

function setSceneTo(scene) {
	// TEMP
	if (currentImage == Scene.path[scene]) {
		return;
	}
  
	prevImage = currentImage;
  
  // TODO cross fade
	
	currentImage = Scene.path[scene];
}