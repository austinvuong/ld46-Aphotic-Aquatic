const fadeDelay = 400;
const swapTextDelay = 500;

var buttons = [];
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
  
  buttons.push($(".answer-button"));
  
	newQuestion();

});

function newQuestion() {
	var b; // button
	var exclusion = [];
	
	var q = QUESTION_ARRAY[currentDay-1];
  
	$("#question-text").html(q.questionText);
	setSceneTo(q.scene);
  
  for (var i = 0; i < 4; i++) {
    
    b = buttons[0][i];

    var item = getRandomOfType(q.answerType, exclusion);
    exclusion.push(item);
    
    b.value = item;

    b.onclick = function() {
      // Store the response
      q.answer = this.value;
      activeQuestions.push(q);
      
      // TEMP? show the response
      $("#response-text").html(q.answer + " it is then. On to the next day. Day " + currentDay);
      
      // Advance to the next day
      nextDay();
    };
  }
}

function nextDay() {
	currentDay++;
	$("#day-display").text("Day " + currentDay);
	answeredQuestions = [];
	
	setSceneTo(Scene.OFFICE);

	nextQuestion();
}

function nextQuestion() {

	var q = getRandomFrom(activeQuestions, answeredQuestions);
	
	$("#question-text").html(q.questionText);
	setSceneTo(q.scene);
  
  setButtonForNextQuestion(q);
}

// q - the question to build from
function setButtonForNextQuestion(q) {
  var b; // button
  var exclusion = [q.answer]; // for pop' the answers
  
  // set everything an incorrect answer
	for (var i = 0; i < 4; i++) {
		b = buttons[0][i];
		var item = getRandomOfType(q.answerType, exclusion);
		exclusion.push(item);
		
		b.value = item;

		b.onclick = function() {
			// TEMP
			badResponse += "&#9608";
			$("#response-text").html(badResponse);
		};
	}
	
	// set one to the correct answer
	b = buttons[0][randInt(0, 4)];
	b.value = q.answer;

	b.onclick = function() {
		$("#response-text").html("Hurray!");
		
		// add this q to the list
		answeredQuestions.push(q);
    $("#lower").toggleClass("transparent");
		
		// if all active q's done, add a new one
		if (answeredQuestions.length == activeQuestions.length) {
			newQuestion();
		} else {
			nextQuestion();
		}
	}
  
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