var buttons = [];
var questionTextHTML;
var responseTextHTML;
var badResponse = "No.";

var activeQuestions = []; // active questions
var answeredQuestions = []; // questions answered today

var currentDay = 1; // also the max tasks per day

// Answer types
var AnswerType = {
	NULL: 0,
	FISH: 1,
	FISH_FOOD: 2,
	THOUGHT: 3,
	
	properties: {
		1: {items: ["Goldfish", "Carp", "Betta", "Catfish", "Cod", "Bass", "Pike", "Mackerel", "Sun Fish", "Guppie", "Tilapia", "M̶̻̓̄̐̏͝h̸̞̪̅͌̓̓ͅ'̶̨̬̤̽̈́█̷̢̜̱̞͑█̵̡̩̩̰̉͑͂͝█̷̖͔̣̮͗̌͜█̷̧͇͙͓̉͌ͅ'̶̣̼͓̮̜͊̀̊͌̀█̴̝͍̯̀̐̕█̴̜̤̭̣̟́█̷̨͚͇̻͔̇̾͌B̴̲̱̠̭̓"]},
		
		2: {items: ["Flakes", "Stick-on tablets", "Sinking pellets", "Bloodwoorms", "Water fleas", "Brine shrimp", "Peas", "Floating pellets", "Crisps", ]},
		
		3: {items: ["Tranquility", "Calamity", "Serenity", "Ruin", "Annihilation", "Bliss"]}
	}
};

const QUESTION_ARRAY = [
	new Question("What did I need to feed Goldie?", AnswerType.FISH_FOOD, Scene.FISH00),
	new Question("What did Steve's fish eat?", AnswerType.FISH_FOOD, Scene.FISH01),
	new Question("What nutrients does Dr. Q&#9608&#9608&#9608&#9608&#9608's fish require?", AnswerType.FISH_FOOD, Scene.FISH02),
	new Question("Imagine", AnswerType.THOUGHT, Scene.NULL),
	];

// Question object
function Question(questionText, answerType, scene, answer) {
	this.questionText = questionText;
	this.answerType = answerType;
	this.scene = scene;
	this.answer = answer;
}

// Init
$(document).ready(function(){
	
	// TEMP question text
	questionTextHTML = document.createElement("h2");
	questionTextHTML.innerHTML = "Question Text";
	questionTextHTML.id = "question-text"; 
	questionTextHTML.classList.add("horizontal-center");
	$("#button-grid").before(questionTextHTML);

	// append buttons	
	for (var i = 0; i < 4; i++) {
		var gridItem = document.createElement("div");
		gridItem.classList.add("grid-item");

		var button = document.createElement("button");
		button.type = "button";
		
		var cl = button.classList;
		cl.add("w3-btn");
		cl.add("w3-xlarge");
		cl.add("w3-light-gray");
		cl.add("answer-button");
		
		gridItem.append(button);
		$("#button-grid").append(gridItem);
		
		buttons.push(button);
	}
	
	// TEMP append response text
	responseTextHTML = document.createElement("h3");
	responseTextHTML.innerHTML = "Response Text";
	$("#button-grid").after(responseTextHTML);
	
	newQuestion();

});

function newQuestion() {
	var b; // button
	var exclusion = [];
	
	var q = QUESTION_ARRAY[currentDay-1];
	var questionText = q.questionText;
	var answer; // to be selected
	var answerType = q.answerType;

	questionTextHTML.innerHTML = questionText;
	setSceneTo(q.scene);
	
	for (var i = 0; i < 4; i++) {
		b = buttons[i];
		
		var item = getRandomOfType(answerType, exclusion);
		exclusion.push(item);
		
		b.innerHTML = item;

		b.onclick = function() {
			// Store the response
			q.answer = this.innerHTML;
			activeQuestions.push(q);
			
			// TEMP? show the response
			responseTextHTML.innerHTML = q.answer + " it is then. On to the next day. Day " + currentDay;
			
			// Advance to the next day
			currentDay++;
			$("#idDay").text("The day " + currentDay);
			answeredQuestions = [];
			
			nextQuestion();
		};
	}
}

function nextQuestion() {
	var b; // button
	var q = getRandomFrom(activeQuestions, answeredQuestions); // TEMP
	
	var exclusion = [q.answer]; // for pop' the answers
	
	questionTextHTML.innerHTML = q.questionText;
	setSceneTo(q.scene);

	// set everything an incorrect answer
	for (var i = 0; i < 4; i++) {
		b = buttons[i];
		var item = getRandomOfType(q.answerType, exclusion);
		exclusion.push(item);
		
		b.innerHTML = item;

		b.onclick = function() {
			// TEMP
			badResponse += "&#9608";
			responseTextHTML.innerHTML = badResponse;
		};
	}
	
	// set one to the correct answer
	b = buttons[randInt(0, 4)];
	b.innerHTML = q.answer;

	b.onclick = function() {
		responseTextHTML.innerHTML = "Hurray!";
		
		// add this q to the list
		answeredQuestions.push(q);
		
		// if all active q's done, add a new one
		if (answeredQuestions.length == activeQuestions.length) {
			newQuestion();
		} else {
			nextQuestion();
		}
	};
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