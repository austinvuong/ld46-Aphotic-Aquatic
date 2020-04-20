const PATH_AUDIO = "res/audio/"

let Audio = {
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

function play() {
  $("#ambient")[0].play();
}

function playRandomBloop() {
  $(".bloop")[randInt(0, 6)].play();
}