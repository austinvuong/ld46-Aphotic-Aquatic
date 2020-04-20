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
  ACCEPT: 4,
	
	properties: {
		1: {items: ["Goldfish", "Carp", "Betta", "Catfish", "Cod", "Bass", "Pike", "Mackerel", "Sun Fish", "Guppie", "Tilapia", "M̶̻̓̄̐̏͝h̸̞̪̅͌̓̓ͅ'̶̨̬̤̽̈́█̷̢̜̱̞͑█̵̡̩̩̰̉͑͂͝█̷̖͔̣̮͗̌͜█̷̧͇͙͓̉͌ͅ'̶̣̼͓̮̜͊̀̊͌̀█̴̝͍̯̀̐̕█̴̜̤̭̣̟́█̷̨͚͇̻͔̇̾͌B̴̲̱̠̭̓"]},
		
		2: {items: ["Flakes", "Stick-on tablets", "Sinking pellets", "Bloodwoorms", "Water fleas", "Brine shrimp", "Peas", "Floating pellets", "Crisps", ]},
		
		3: {items: ["Tranquility", "Calamity", "Serenity", "Ruin", "Annihilation", "Bliss"]},
    
    4: {items: ["Okay.", "Okay..", "Okay...", "Okay....",]}
	}
};

let deck = [
  new Card(Image.OFFICE, AnswerType.ACCEPT, "Oh bother I've been give some fish to care for"),
	new Card(Image.GOLDIE, AnswerType.FISH_FOOD, "What did I need to feed Goldie?"),
	new Card(Image.ANGEL, AnswerType.FISH_FOOD, "What did Steve's fish eat?"),
	new Card(Image.SEAHORSE, AnswerType.FISH_FOOD, "What nutrients does Dr. Q&#9608&#9608&#9608&#9608&#9608's fish require?"),
  
  new Card(Image.OFFICE, AnswerType.ACCEPT, "Someone just dropped off another one"),
  new Card(Image.JELLY, AnswerType.FISH_FOOD, "What jelly want?"),
  
  new Card(Image.OFFICE, AnswerType.ACCEPT, "Oh another one"),
  new Card(Image.BETTA, AnswerType.FISH_FOOD, "Hrmm .. what did the betta want?"),
  
  new Card(Image.OFFICE, AnswerType.ACCEPT,"This one seems ... different"),
	new Card(Image.NULL, AnswerType.THOUGHT, "It wants me to imagine"),
  
  new Card(Image.OFFICE, AnswerType.ACCEPT, "It wants more"),
  new Card(Image.NULL, AnswerType.THOUGHT, "It wants me to visualize"),
	];

// Card object
function Card(scene, answerType, cardText) {
  this.scene = scene;
  this.answerType = answerType;
	this.cardText = cardText;

	this.answer = "";
}

// Init
$(document).ready(function(){
  
  buttons.push($(".answer-button"));
  
	newCards(4); // welcome card + 3 fish
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
  
	$("#question-text").html("Oh this is new . . . " + q.cardText);
	setImageTo(q.scene);
  
  for (let i = 0; i < 4; i++) {
    
    b = buttons[0][i];

    let item = getRandomOfType(q.answerType, exclusion);
    exclusion.push(item);
    
    b.value = item;

    b.onclick = function() {
      // Store the response
      q.answer = this.value;
      
      // ignore ACCEPT cards, they're for story stuffs
      if (q.answerType != AnswerType.ACCEPT) {
        activeCards.push(q);
      }
      
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
  
  // every time a new card is added, reset the hand
  answeredCards = [];
}

function nextCard() {

  let exclusion = [];
  exclusion.push(answeredCards, lastCard);
	let q = getRandomFrom(activeCards, exclusion);
	
	$("#question-text").html(q.cardText);
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
			newCards(2); // the "new fish" + the actual fish
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