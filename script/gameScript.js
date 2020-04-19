var buttons = [];
var questionText;
var responseText; // text
var badResponse = "No.";

var questions = []; // Only contain Question objects

// TEMPs
var tempflag = true;
var qCounter = 0;
var fixedQ = ["What am I?", "Who am I?", "What was I?", "What will I become?", "What will create me?"];
var lastQuestion;

// Answer types
var AnswerType = {
	NULL: 0,
	FISH: 1,
	
	properties: {
		1: {items: ["Goldfish", "Carp", "Betta", "Catfish", "Cod", "Bass", "Pike", "Mackerel", "Sun Fish", "Guppie", "Tilapia", "M̶̻̓̄̐̏͝h̸̞̪̅͌̓̓ͅ'̶̨̬̤̽̈́█̷̢̜̱̞͑█̵̡̩̩̰̉͑͂͝█̷̖͔̣̮͗̌͜█̷̧͇͙͓̉͌ͅ'̶̣̼͓̮̜͊̀̊͌̀█̴̝͍̯̀̐̕█̴̜̤̭̣̟́█̷̨͚͇̻͔̇̾͌B̴̲̱̠̭̓"]}
	}
};

// Question object
function Question(question, answer, answerType) {
	this.question = question;
	this.answer = answer;
	this.answerType = answerType;
}

// Init
$(document).ready(function(){
	
	// TEMP question text
	questionText = document.createElement("h2");
	questionText.innerHTML = "Question Text";
	$("#button-grid").before(questionText);

	// append buttons	
	for (var i = 0; i < 4; i++) {
		var gridItem = document.createElement("div");
		gridItem.classList.add("grid-item");

		var button = document.createElement("button");
		button.type = "button";
		
		var cl = button.classList;
		cl.add("w3-btn");
		cl.add("w3-xlarge");
		cl.add("w3-gray");
		cl.add("answer-button");
		
		gridItem.append(button);
		$("#button-grid").append(gridItem);
		
		buttons.push(button);
	}
	
	// TEMP append response text
	responseText = document.createElement("h3");
	responseText.innerHTML = "Response Text";
	$("#button-grid").after(responseText);
	
	firstTime();
	
});

function firstTime() {
	var b; // button
	var exclusion = [];
	var question = fixedQ[qCounter];
	var answer; // to be selected
	var answerType = AnswerType.FISH;

	questionText.innerHTML = question;
	
	for (var i = 0; i < 4; i++) {
		b = buttons[i];
		
		var item = getRandomOfType(answerType, exclusion);
		exclusion.push(item);
		
		b.innerHTML = item;

		b.onclick = function() {
			answer = this.innerHTML;
			responseText.innerHTML = answer + " it is then.";
			questions.push(new Question(question, answer, answerType));
			if (tempflag && qCounter < fixedQ.length)
			{
				tempflag = false;
				console.log("New question");
				firstTime();
			} else {
				tempflag = true;
				shuffle();
			}
		};
	}
	
	qCounter++;
}

function shuffle() {
	
	var b; // button
	var question = getRandomFrom(questions, [lastQuestion]); // TEMP
	var exclusion = [question.answer];
	
	questionText.innerHTML = question.question;

	// set everything an incorrect answer
	for (var i = 0; i < 4; i++) {
		b = buttons[i];
		var item = getRandomOfType(question.answerType, exclusion);
		exclusion.push(item);
		
		b.innerHTML = item;

		b.onclick = function() {
			// TEMP
			badResponse += "&#9608";
			responseText.innerHTML = badResponse;
		};
	}
	
	// set one to the correct answer
	b = buttons[randInt(0, 4)];
	b.innerHTML = question.answer;

	b.onclick = function() {
		responseText.innerHTML = "Hurray!";
		if (tempflag && qCounter < fixedQ.length) {
			tempflag = false;
			console.log("New question");
			firstTime();
		} else {
			tempflag = true;
			shuffle();
		}
		
	};
	
	lastQuestion = question;
	console.log(lastQuestion);
}

// Helpers

// Returns a random item from the AnswerType enum
// Precon: the list must contain an item not in the exclusion
function getRandomOfType(type, exclude) {
	return getRandomFrom(AnswerType.properties[type].items, exclude);
}

// Returns a random item from the list not in exclusion
// Precon: the list must contain an item not in the exclusion
function getRandomFrom(list, exclude) {
	var item;
	
	// DEBUG
	if (exclude.length >= list.length) {
		console.log("Warning: given list is not smaller than the exclusion");
		console.log(list);
		console.log(exclude);
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