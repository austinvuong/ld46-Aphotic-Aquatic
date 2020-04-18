var buttons = [];

$(document).ready(function(){

	// append buttons
	for (var i = 0; i < 4; i++) {

		var button = document.createElement("button");
		button.type = "button";
		button.innerHTML = "Button #" + i;
		
		button.onclick = function() {
			alert("I am " + this.innerHTML);
		};
		
		$("body").append(button);
		
		buttons.push(button);
	}
	
	shuffle();
	
});

function shuffle() {
	
	var b; // button

	// make everything the incorrect answer
	for (var i = 0; i < 4; i++) {
		b = buttons[i];
		
		b.innerHTML = "Wrong";
		b.onclick = function() {
			alert("But ... I said \"wrong\"!");
		};
	}
	
	// set one to the correct answer
	b = buttons[Math.floor((Math.random() * 4))];
	b.innerHTML = "CLICK ME!!!"
	b.onclick = function() {
		alert("Hurray!");
		shuffle();
	};
}