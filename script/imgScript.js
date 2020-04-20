const PATH = "res/img/"

let Image = {
	NULL: 0,
	OFFICE: 1,
	GOLDIE: 2,
	ANGEL: 3,
	SEAHORSE: 4,
  JELLY: 5,
  BETTA: 6,
	
	path: {
		0: PATH + "testImg.png",
		1: PATH + "room.png",
		2: PATH + "goldie.gif",
    3: PATH + "angel.gif",
		4: PATH + "seahorse.gif",
		5: PATH + "jellies.gif",
    6: PATH + "betta.gif",
	}
}

let currentPath;

$(document).ready(function(){
	currentPath = Image.path[Image.NULL];
});

function setImageTo(img) {

	$("#image").attr("src", Image.path[img]);
  
}