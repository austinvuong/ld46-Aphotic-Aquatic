function play() {
  $("#ambient")[0].play();
}

function playRandomBloop() {
  $(".bloop")[randInt(0, 6)].play();
}