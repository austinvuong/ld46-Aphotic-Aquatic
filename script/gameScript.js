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
let timerRate = 0.01;
let timerRateInc = 0.0025;

// Answer types
let AnswerType = {
	NULL: 0,
	FISH: 1,
	FISH_FOOD: 2,
	THOUGHT: 3,
  STORY: 4,
  OOPS: 5, // for dead fish
  MUSIC_MODES: 6,
	
	properties: {
		1: {items: ["Goldfish", "Carp", "Betta", "Catfish", "Cod", "Bass", "Pike", "Mackerel", "Sun Fish", "Guppie", "Tilapia", "M̶̻̓̄̐̏͝h̸̞̪̅͌̓̓ͅ'̶̨̬̤̽̈́█̷̢̜̱̞͑█̵̡̩̩̰̉͑͂͝█̷̖͔̣̮͗̌͜█̷̧͇͙͓̉͌ͅ'̶̣̼͓̮̜͊̀̊͌̀█̴̝͍̯̀̐̕█̴̜̤̭̣̟́█̷̨͚͇̻͔̇̾͌B̴̲̱̠̭̓"]},
		
		2: {items: ["Tropical flakes", "Stick-on tablets", "Sinking pellets", "Bloodwoorms", "Water fleas", "Brine shrimp", "Peas", "Floating pellets", "Larvae", "Beef heart flakes", "Leafy greens"]},
		
		3: {items: [
          // positive
          "Tranquility", "Bliss", "Serenity", "Harmony", "Coherence", "Triumph", "Relief", "Magnificence", "Achievement", "Transcendence", 
          
          // negative
          "Ruin", "Annihilation", "Calamity", "Turmoil", "Dissonance", "Loathing", "Pandemonium", "Burden", "Regret"
          
          ]},
    
    4: {items: ["Okay.", "Okay..", "Okay...", "Okay....",]},
    
    5: {items: ["Oops.", "Oops..", "Oops...", "Oops....",]},
    
    6: {items: ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"]}
	}
};

let deck = [
  new Card(Image.ROOM0, AnswerType.STORY, "Welcome to your internship at TODO FISHYFISHFISH LABS. As a welcoming gift here's a goldfish! I'm not sure what it eats, but whatever you <b>feed</b> it <b>REMEMBER</b> and <b>BE CONSISTENT</b>.", "<i>\"I think I'll name you Goldie\"</i>"),
	new Card(Image.GOLDIE, AnswerType.FISH_FOOD, "What do I need to feed Goldie?"),

  new Card(Image.ROOM1, AnswerType.STORY, "Some of our team is going on vacation. If you could just take care of their pets while their gone that'd be great. Not sure what they <b>eat</b> but <b>REMEMBER</b> and <b>BE CONSISTENT</b>.", "<i>\"What an exciting internship this is looking to be . . .\"</i>"),
  new Card(Image.ANGEL, AnswerType.FISH_FOOD, "What does Steve's fish eat?"),
  
  new Card(Image.ROOM1, AnswerType.STORY, "Have you tried playing some <b>music</b> for your fish? Our own internal studies show that music can improve a fish's mood! Somehow they can distingish <b>muscal modes</b> and latch onto them. Just <b>REMEMBER</b> and <b>BE CONSISTENT</b>.", "<i>\". . .\"</i>"),
  new Card(Image.GOLDIE, AnswerType.MUSIC_MODES, "What does Goldie like to <span class=\"w3-white\">hear</span>?"),
  new Card(Image.ANGEL, AnswerType.MUSIC_MODES, "What does Steve's fish like to listen to?"),
  
  new Card(Image.ROOM2, AnswerType.STORY, "Here's another one for you!", "<i>\". . .\"</i>"),
	new Card(Image.SEAHORSE, AnswerType.FISH_FOOD, "What did I need to feed the seahorse?"),
  //new Card(Image.SEAHORSE, AnswerType.MUSIC_MODES, "What does the seahorse listen to?"),
  
  new Card(Image.ROOM3, AnswerType.STORY, "Dr. Qtaro is on leave for the next while. Please keep his jellies alive. <b>REMEMBER</b> and <b>BE CONSISTENT</b>.", "<i>. . .</i>"),
  new Card(Image.JELLY, AnswerType.FISH_FOOD, "What do I feed the jellies?"),
  //new Card(Image.JELLY, AnswerType.MUSIC_MODES, "What the jellies listen to?"),
  
  new Card(Image.ROOM4, AnswerType.STORY, "From Director K&#9608&#9608&#9608&#9608&#9608&#9608&#9608&#9608&#9608&#9608, <br> Please tend to the needs of my betta fish. You must play &#9608&#9608&#9608&#9608&#9608&#9608&#9608&#9608&#9608 for it and feed it &#9608&#9608&#9608&#9608&#9608&#9608&#9608&#9608&#9608&#9608&#9608."),
  new Card(Image.BETTA, AnswerType.FISH_FOOD, "The betta. What does it eat?"),
  //new Card(Image.BETTA, AnswerType.MUSIC_MODES, "The betta. What does it like to hear?"),
  
  new Card(Image.ROOM_WALL, AnswerType.STORY,"This one seems ... different"),
	new Card(Image.WALL, AnswerType.THOUGHT, "It wants me to imagine"),
  
  new Card(Image.ROOM_WALL, AnswerType.STORY, "It wants more"),
  new Card(Image.WALL, AnswerType.THOUGHT, "It wants me to visualize"),
	];

// Card object
function Card(img, answerType, cardText, responseText) {
  this.img = img;
  this.answerType = answerType;
	this.cardText = cardText;
  this.responseText = responseText;

	this.answer = "";
}

// Init
$(document).ready(function(){
  
  buttons.push($(".answer-button"));
  
	newCards(2);
});

// count - the number of cards to init
// This will keep drawing cards until it has shown {count} non-story cards
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
	setImageTo(q.img);
  
  let rate;
  if (q.answerType == AnswerType.STORY) {
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

      playAmbient();

      // handle story cards
      if (q.answerType == AnswerType.STORY) {
        $("#response-text").html(q.responseText);
        // don't put them in the hand
      } else {
        $("#response-text").html(`<i>${q.answer} it is then.</i>`);
        playRandomBloop();
        activeCards.push(q);
        count--; // only if the card is not story
      }
      
      if (q.answerType == AnswerType.THOUGHT) {
        hasReachedDarkness = true;
        
        convertCards();
      }

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

// Convert cards to their final forms
// At this point no new sea creatures should be added
function convertCards() {
  for (let i = 0 ; i < activeCards.length ; i++) {
    
    let img = activeCards[i];
    
    if (img == Image.GOLDIE) {
      activeCards[i].img = Image.GOLDIE2;
    }
  }
}

function nextCard() {

  let exclusion = [];
  exclusion.push(answeredCards, lastCard);
	let q = getRandomFrom(activeCards, exclusion);
	
	$("#question-text").html(q.cardText);
	setImageTo(q.img);
  
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
      let ansLower = this.value.toLowerCase();
			$("#response-text").html(`<i>\"Hmm, it wasn't ${ansLower}.\"<\i>`);
      shake($("#response-text"), 50);
      shake($("#timerBarContainer"), 100);
      progress /= 1.4; // the less time, the less the penalty
      
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
      let ansLower = q.answer.toLowerCase();
      $("#response-text").html(`<i>"Right, it was ${ansLower}."</i>`);
      playRandomBloop();
      
      // add this q to the list
      answeredCards.push(q);
      lastCard = q;
      $("#lower").toggleClass("transparent");
      
      // if all active q's done, add a new one
      if (answeredCards.length == activeCards.length) {
        newCards(1); // one non-story card
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
  stopFalling();
  interval = setInterval(frame, 10);
  function frame() {
    if (progress < -5) { // a little coyote time
      $("#timerBar").width(progress + "%"); // force it (in case of progress jumps)
      clearInterval(interval);
      // TODO
      console.log("You are fired and/or fried!");
    } else if (progress < 10) {
      playFalling(); // play a Shepherd's tone
    } else {
      progress -= rate;
      $("#timerText").css("opacity", (-(progress / 40) + 1) + "");
      $("#timerBar").width(progress + "%");
    }
  }
}

// Animation
// el - the jquery selection to shake
function shake(el, duration) {
  el.addClass("shake");
  setTimeout(function() {el.removeClass("shake");}, duration)
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