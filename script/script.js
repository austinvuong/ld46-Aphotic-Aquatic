var buttons = [];
var response; // text

$(document).ready(function(){

	// append buttons
	for (var i = 0; i < 4; i++) {

		var button = document.createElement("button");
		button.type = "button";
		button.innerHTML = "Button #" + i;
		var cl = button.classList;
		cl.add("w3-btn");
		cl.add("w3-xlarge");
		
		button.onclick = function() {
			alert("I am " + this.innerHTML);
		};
		
		$("body").append(button);
		
		buttons.push(button);
	}
	
	// TEMP append response text
	response = document.createElement("h3");
	response.innerHTML = "Response Text";
	$("body").append(response);
	
	shuffle();
	
});

function shuffle() {
	
	var b; // button

	// make everything the incorrect answer
	for (var i = 0; i < 4; i++) {
		b = buttons[i];
		
		b.innerHTML = "Wrong";
		b.classList.add("w3-red");
		b.onclick = function() {
			response.innerHTML = "No.";
		};
	}
	
	// set one to the correct answer
	b = buttons[Math.floor((Math.random() * 4))];
	b.innerHTML = "CLICK ME!!!";
	b.classList.remove("w3-red");
	b.classList.add("w3-green");
	b.onclick = function() {
		response.innerHTML = "Hurray!";
		shuffle();
	};
}