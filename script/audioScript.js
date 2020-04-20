function playAmbient() {
  $("#ambient")[0].play();
}

function playRandomBloop() {
  $(".bloop")[randInt(0, 6)].play();
}

let isPlayingFalling = false;

function playFalling() {
  if (!isPlayingFalling) {
    $("#falling").prop("currentTime", 2);
    $("#falling").prop("volume", 0.01);
    $("#falling")[0].play();
    isPlayingFalling = true;
  }
}

function stopFalling() {
  isPlayingFalling = false;
  $("#falling")[0].pause();
  $("#falling").prop("currentTime", 2);
}