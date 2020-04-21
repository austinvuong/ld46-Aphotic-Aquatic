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
  ROOM_WALL: 12,
  
  // Creatures second stage
	GOLDIE2: 13,
	ANGEL2: 14,
	SEAHORSE2: 15,
  JELLY2: 16,
  BETTA2: 17, 
  WALL: 18,
  
  // Fail
  FAIL_MINOR: 19,
  FAIL_MAJOR: 20,
  
  // Letters
  LETTER0: 21,
  LETTER1: 22,
  LETTER2: 23,
  LETTER3: 24,
  LETTER4: 25,
  
	path: {
		0: PATH + "testImg.png",
		1: PATH + "room.png",
    
		2: PATH + "goldie.gif",
    3: PATH + "angel.gif",
		4: PATH + "seahorse.gif",
		5: PATH + "jellies.gif",
    6: PATH + "betta.gif",
    
    7: PATH + "room-0.png",
		8: PATH + "room-1.png",
		9: PATH + "room-2.png",
    10: PATH + "room-3.png",
		11: PATH + "room-4.png",
		12: PATH + "room-final.png",
    
		13: PATH + "goldie-final.gif",
    14: PATH + "angel-final.gif",
		15: PATH + "seahorse-final.gif",
		16: PATH + "jellies-final.gif",
    17: PATH + "betta-final.gif",
    18: PATH + "finalfish.gif",
    
    19: PATH + "fired.png",
    20: PATH + "bigfired.gif",
    
    20: PATH + "letter-0.png",
    21: PATH + "letter-1.png",
    22: PATH + "letter-2.png",
    23: PATH + "letter-3.png",
    24: PATH + "letter-4.png",
	}
}

let currentPath;

$(document).ready(function(){
	currentPath = Image.path[Image.NULL];
});

function setImageTo(img) {

	$("#image").attr("src", Image.path[img]);
  
}