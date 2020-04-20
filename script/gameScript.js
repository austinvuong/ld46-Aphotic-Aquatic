const fadeDelay = 400;
const swapTextDelay = 500;

let buttons = [];
let badResponse = "No.";

let activeCards = [];
let answeredCards = [];

let lastCard; // used to prevent immediate repeats

// Answer types
let AnswerType = {
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

let deck = [
	new Card("What did I need to feed Goldie?", AnswerType.FISH_FOOD, Image.GOLDIE),
	new Card("What did Steve's fish eat?", AnswerType.FISH_FOOD, Image.ANGEL),
	new Card("What nutrients does Dr. Q&#9608&#9608&#9608&#9608&#9608's fish require?", AnswerType.FISH_FOOD, Image.SEAHORSE),
  new Card("What jelly want?", AnswerType.FISH_FOOD, Image.JELLY),
	new Card("It wants me to imagine", AnswerType.THOUGHT, Image.NULL),
  new Card("It wants me to visualize", AnswerType.THOUGHT, Image.NULL),
	];

// Card object
function Card(questionText, answerType, scene, answer) {
	this.questionText = questionText;
	this.answerType = answerType;
	this.scene = scene;
	this.answer = answer;
}

// Init
$(document).ready(function(){
  
  buttons.push($(".answer-button"));
  
	newCards(3);
});

// count - the number of cards to init
function newCards(count) {

  // stop making new requests
  if (count <= 0) {
    return;
  }
  
  let b; // button
	let exclusion = []; // is empty
	
	let q = deck.shift();
  
	$("#question-text").html(q.questionText);
	setImageTo(q.scene);
  
  for (let i = 0; i < 4; i++) {
    
    b = buttons[0][i];

    let item = getRandomOfType(q.answerType, exclusion);
    exclusion.push(item);
    
    b.value = item;

    b.onclick = function() {
      // Store the response
      q.answer = this.value;
      activeCards.push(q);
      
      // TEMP? show the response
      $("#response-text").html(q.answer + " it is then.");
        
      // return to the going cards
      count--;
      if (count <= 0) {
        lastCard = q;
        nextCard();
      } else { // or add more
        newCards(count); // ensure this -- somewhere
      }
    };
  }
}

function nextDay() {
	answeredCards = [];
	
	setImageTo(Image.OFFICE);

	nextCard();
}

function nextCard() {

  let exclusion = [];
  exclusion.push(answeredCards, lastCard);
	let q = getRandomFrom(activeCards, exclusion);
	
	$("#question-text").html(q.questionText);
	setImageTo(q.scene);
  
  setButtonForNextCard(q);
}

// q - the question to build from
function setButtonForNextCard(q) {
  let b; // button
  let exclusion = [q.answer]; // for pop' the answers
  
  // set everything an incorrect answer
	for (let i = 0; i < 4; i++) {
		b = buttons[0][i];
		let item = getRandomOfType(q.answerType, exclusion);
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
		$("#response-text").html("Right it was " + q.answer);
		
		// add this q to the list
		answeredCards.push(q);
    lastCard = q;
    $("#lower").toggleClass("transparent");
		
		// if all active q's done, add a new one
		if (answeredCards.length == activeCards.length) {
			newCards(1);
		} else {
			nextCard();
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
	let item;
	
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