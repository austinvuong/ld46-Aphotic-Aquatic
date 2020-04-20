const fadeDelay = 400;
const swapTextDelay = 500;

let buttons = [];
let badResponse = "No.";

let activeCards = [];
let answeredCards = [];

let lastCard; // used to prevent immediate repeats

let hasReachedDarkness = false; // has gotten to any THOUGHT card

// Timer bar
let progress;
let interval;
let timerStoryRate = 0.001;
let timerRate = 0.02;
let timerRateInc = 0.005;

// Answer types
let AnswerType = {
	NULL: 0,
	FISH: 1,
	FISH_FOOD: 2,
	THOUGHT: 3,
  ACCEPT: 4,
  OOPS: 5, // for dead fish
	
	properties: {
		1: {items: ["Goldfish", "Carp", "Betta", "Catfish", "Cod", "Bass", "Pike", "Mackerel", "Sun Fish", "Guppie", "Tilapia", "M̶̻̓̄̐̏͝h̸̞̪̅͌̓̓ͅ'̶̨̬̤̽̈́█̷̢̜̱̞͑█̵̡̩̩̰̉͑͂͝█̷̖͔̣̮͗̌͜█̷̧͇͙͓̉͌ͅ'̶̣̼͓̮̜͊̀̊͌̀█̴̝͍̯̀̐̕█̴̜̤̭̣̟́█̷̨͚͇̻͔̇̾͌B̴̲̱̠̭̓"]},
		
		2: {items: ["Flakes", "Stick-on tablets", "Sinking pellets", "Bloodwoorms", "Water fleas", "Brine shrimp", "Peas", "Floating pellets", "Crisps", ]},
		
		3: {items: ["Tranquility", "Calamity", "Serenity", "Ruin", "Annihilation", "Bliss"]},
    
    4: {items: ["Okay.", "Okay..", "Okay...", "Okay....",]},
    
    5: {items: ["Oops.", "Oops..", "Oops...", "Oops....",]}
	}
};

let deck = [
  new Card(Image.OFFICE, AnswerType.ACCEPT, "Welcome to your internship at TODO FISHYFISHFISH LABS. Some of our team is on vacation, so we need you to take care of their pets. I don't remember what they eat, but whatever feed them <b>BE CONSISTENT</b>.", "<i>What an exciting internship this is looking to be . . .</i>"),
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
function Card(scene, answerType, cardText, responseText) {
  this.scene = scene;
  this.answerType = answerType;
	this.cardText = cardText;
  this.responseText = responseText;

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
  
  // TEMP
	$("#question-text").html("%NEWCARD " + q.cardText);
	setImageTo(q.scene);
  
  let rate;
  if (q.answerType == AnswerType.ACCEPT) {
    rate = timerStoryRate;
  } else {
    timerRate += timerRateInc;
    rate = timerRate;
  }
  
  startTimer(rate);
  
  for (let i = 0; i < 4; i++) {
    
    b = buttons[0][i];

    let item = getRandomOfType(q.answerType, exclusion);
    exclusion.push(item);
    
    b.value = item;

    b.onclick = function() {
      // Store the response
      q.answer = this.value;
      
      // handle story cards
      if (q.answerType == AnswerType.ACCEPT) {
        $("#response-text").html(q.responseText);
        // don't put them in the hand
      } else {
        $("#response-text").html(`<i>${q.answer} it is then.</i>`);
        activeCards.push(q);
      }
      
      if (q.answerType == AnswerType.THOUGHT) {
        hasReachedDarkness = true;
      }
      
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
  
  timerRate += timerRateInc;
  startTimer(timerRate);
  
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
			$("#response-text").html(`<i>No, ${this.value} wasn't it<\i>`);
      progress -= 15;
      
      // If seen the wall, allow fish to be killed
      if (hasReachedDarkness) {
        q.cardText = "Oh . . . it's dead."
        q.answerType = AnswerType.OOPS;
        // TODO dimmed static image?
        
        $("#response-text").html("I fed it " + this.value + ". . . I forgot it only eats " + q.answer + " . . . did I kill it?");
        nextCard();
      } else {
        // TEMP you're fired!
        console.log("You fed it " + this.value + "?! It only eats " + q.answer + "!! You're fired!");
      }
      
		};
	}
	
  if (q.answerType != AnswerType.OOPS) {
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

  
}

// Timer bar
function startTimer(rate) {
  clearInterval(interval);

  progress = 100;
  interval = setInterval(frame, 10);
  function frame() {
    if (progress < -5) { // a little coyote time
      $("#timerBar").width(progress + "%"); // force it (in case of progress jumps)
      clearInterval(interval);
      // TODO
      alert("You are fired and/or fried!");
    } else {
      progress -= rate;
      $("#timerText").css("opacity", (-(progress / 40) + 1) + "");
      $("#timerBar").width(progress + "%");
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