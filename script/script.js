var buttons = [];
var response; // text
var badResponse = "No.";

var items = ["Goldfish", "Carp", "Betta", "Catfish", "Cod", "Bass", "Pike", "Mackerel", "Sun Fish", "Guppie", "Tilapia", "M̶̻̓̄̐̏͝h̸̞̪̅͌̓̓ͅ'̶̨̬̤̽̈́█̷̢̜̱̞͑█̵̡̩̩̰̉͑͂͝█̷̖͔̣̮͗̌͜█̷̧͇͙͓̉͌ͅ'̶̣̼͓̮̜͊̀̊͌̀█̴̝͍̯̀̐̕█̴̜̤̭̣̟́█̷̨͚͇̻͔̇̾͌B̴̲̱̠̭̓"];
var chosenItem; // Should be in items

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
	
	firstTime();
	
});

function firstTime() {
	var b; // button
	var exclusion = [];
	
	for (var i = 0; i < 4; i++) {
		b = buttons[i];
		
		var item = getRandomFrom(items, exclusion);
		exclusion.push(item);
		
		b.innerHTML = item;
		b.classList.add("w3-blue");
		
		b.onclick = function() {
			chosenItem = this.innerHTML;
			response.innerHTML = chosenItem + " it is then.";
			shuffle();
		};
	}
}

function shuffle() {
	
	var b; // button
	var item;
	var exclusion = [chosenItem];

	// make everything the incorrect answer
	for (var i = 0; i < 4; i++) {
		b = buttons[i];
		item = getRandomFrom(items, exclusion);
		exclusion.push(item);
		
		b.innerHTML = item;

		b.onclick = function() {
			badResponse += "&#9608";
			response.innerHTML = badResponse;
		};
	}
	
	// set one to the correct answer
	b = buttons[randInt(0, 4)];
	b.innerHTML = chosenItem;

	b.onclick = function() {
		response.innerHTML = "Hurray!";
		shuffle();
	};
}

// Helpers

// Returns a random item from the list not in exclusion
// Precon: the list must contain an item not in the exclusion
function getRandomFrom(list, exclude) {
	var item;
	
	// DEBUG
	if (exclude.length >= list.length) {
		console.log("Warning: given list is not smaller than the exclusion");
		console.log(exclude);
		console.log(list);
	}
	
	do {
		item = list[randInt(0, list.length)];
	} while (exclude.includes(item));
	
	return item;
}

// Returns an integer in [min, max)
function randInt(min, max) {
	return Math.floor((Math.random() * max)) + min;
}