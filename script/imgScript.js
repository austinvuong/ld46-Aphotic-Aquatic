const PATH = "res/img/"

let Image = {
	NULL: 0,
	OFFICE: 1,
  
  // Creatures
	GOLDIE: 2,
	ANGEL: 3,
	SEAHORSE: 4,
  JELLY: 5,
  BETTA: 6,
  
  // Room
  ROOM0: 7,
  ROOM1: 8,
	ROOM2: 9,
  ROOM3: 10,
  ROOM4: 11,
  ROOM5: 12
  
  // Creatures second stage
	GOLDIE2: 13,
	ANGEL2: 14,
	SEAHORSE2: 15,
  JELLY2: 16,
  BETTA2: 17, 
  WALL: 18,
  
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