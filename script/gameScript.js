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
let timerRateInc = 0.003;

// Answer types
let AnswerType = {
	NULL: 0,
	FISH: 1,
	FISH_FOOD: 2,
	THOUGHT: 3,
  STORY: 4,
  OOPS: 5, // for dead fish
  MUSIC_MODES: 6,
  RETRY: 7,
	
	properties: {
		1: {items: ["Goldfish", "Carp", "Betta", "Catfish", "Cod", "Bass", "Pike", "Mackerel", "Sun Fish", "Guppie", "Tilapia", "M̶̻̓̄̐̏͝h̸̞̪̅͌̓̓ͅ'̶̨̬̤̽̈́█̷̢̜̱̞͑█̵̡̩̩̰̉͑͂͝█̷̖͔̣̮͗̌͜█̷̧͇͙͓̉͌ͅ'̶̣̼͓̮̜͊̀̊͌̀█̴̝͍̯̀̐̕█̴̜̤̭̣̟́█̷̨͚͇̻͔̇̾͌B̴̲̱̠̭̓"]},
		
		2: {items: ["Tropical flakes", "Stick-on tablets", "Sinking pellets", "Bloodwoorms", "Water fleas", "Brine shrimp", "Peas", "Floating pellets", "Larvae", "Beef heart flakes", "Leafy greens", "Steak", "Chicken nugget"]},
		
		3: {items: [
          // positive
          "Tranquility", "Bliss", "Serenity", "Harmony", "Coherence", "Triumph", "Relief", "Magnificence", "Achievement", "Transcendence", 
          
          // negative
          "Ruin", "Annihilation", "Calamity", "Turmoil", "Dissonance", "Loathing", "Pandemonium", "Burden", "Regret"
          
          ]},
    
    4: {items: ["Okay.", "Okay..", "Okay...", "Okay....", "Yikes.", "Sounds good.", "Can do!", "This sounds fun.",]},
    
    5: {items: ["Oops.", "Oops..", "Oops...", "Oops....",]},
    
    6: {items: ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"]},
    
    7: {items: ["Try again?", "Refresh the page.", "F5", "Look for new internship",]}
	}
};

let deck = [
  new Card(Image.LETTER0, AnswerType.STORY, "Warm salutations to our newest intern at Aphotic Aquatic! Caring for fish is a big part of the job - To start, we'll test how you care for your very own goldfish!<br><br>Based on our research fish only care about one thing: consistency. <b>Remember</b> what you feed them, and always feed them the <b>same thing</b>!<br><br>- Dr. Abby \"Abyss\" Evans, Senior Researcher"),
  new Card(Image.ROOM0, AnswerType.STORY, "<i>\"My office. I think I'll name you Goldie.\"</i>"),
	new Card(Image.GOLDIE, AnswerType.FISH_FOOD, "What do I need to feed Goldie?"),

  new Card(Image.LETTER1, AnswerType.STORY, "Looks like you've managed to keep your goldfish alive, so onto better and bigger things! Dr. Stevens is headed out this week, so here's his Angelfish, <b>Angel</b>. Dr. Stevens studies music, and he wants you to sing for Angel every day. Well, just follow the Aphotic Aquatic slogan: \"Pick something and be consistent\"!<br><br>- Dr. Abby \"Abyss\" Evans, Senior Researcher"),
  new Card(Image.ROOM1, AnswerType.STORY, "<i>\"I spent seven years getting PhD in marine biology, not music.\"</i>"),
  new Card(Image.ANGEL, AnswerType.FISH_FOOD, "What does Steve's fish eat?"),
  new Card(Image.GOLDIE, AnswerType.MUSIC_MODES, "What does Goldie like to hear?"),
  new Card(Image.ANGEL, AnswerType.MUSIC_MODES, "What does Steve's fish like to listen to?"),
 
 
  new Card(Image.LETTER2, AnswerType.STORY, "One more for you, Intern!<br><br>You’re doing amazing - even the Director’s heard your name around the building by now! Dr. Qtaro's headed out today, so take care of his seahorse, all right?<br><br>- Dr. Abby \"Abyss\" Evans, Senior Researcher<br><br>"),
  new Card(Image.ROOM2, AnswerType.STORY, "They're kind of cute."),
	new Card(Image.SEAHORSE, AnswerType.FISH_FOOD, "What did I need to feed the seahorse?"),
  //new Card(Image.SEAHORSE, AnswerType.MUSIC_MODES, "What does the seahorse listen to?"),
  
  new Card(Image.LETTER3, AnswerType.STORY, "I’m about to get on a plane!<br>Take care of my jellyfish.<br><br>- Dr. Abyss"),
  new Card(Image.ROOM3, AnswerType.STORY, "Where exactly am I supposed to keep putting all these tanks?"),
  new Card(Image.JELLY, AnswerType.FISH_FOOD, "What do I feed the jellies?"),
  //new Card(Image.JELLY, AnswerType.MUSIC_MODES, "What the jellies listen to?"),
  
  new Card(Image.LETTER4, AnswerType.STORY, "Great work so far, Intern. You’ll go far.<br>Headed to █̷̘̳͇ͦ̏̚█̣̉█͕͙̘̪̫̖͇̈́̌̏̔́̉̚͟█̶̖̱͈͎̝̘͓█̤͉̥̬̋͐̽ͯ█̣̹̰͔͘█͎͇̯̭̉͑͗͒ with the family. Here’s my betta. <br><br>- Director Dr. K█ͤ͒̐█̅̔ͭ█̤̹̳̘͈̪̽ͨ̏ͧ͂̐█̬̲͎̭́̄̒͒█ͬ͊̓ͩ͒̾͗█̪̺͔̞͍̊͆͂̂̓, C.E.O."),
  new Card(Image.ROOM4, AnswerType.STORY, "That. Is not a betta."),
  new Card(Image.BETTA, AnswerType.FISH_FOOD, "The betta. What does it eat?"),
  //new Card(Image.BETTA, AnswerType.MUSIC_MODES, "The betta. What does it like to hear?"),
 
  new Card(Image.ROOM_WALL, AnswerType.STORY,"What’s this? The office wall has crumbled. It looks like there’s something… inside?"),
	new Card(Image.WALL, AnswerType.THOUGHT, "I̺͑͌m̨ȁ̕g͕ͮin̓e̎̃̕.͑̅͛҉̝̮͎"),
  
  new Card(Image.ROOM_WALL, AnswerType.STORY, "It wants more?"),
  new Card(Image.WALL, AnswerType.THOUGHT, "E̫͎̲n͂̓̓v̧͈̬is̬̓i̳ͩo̭͌n̂҉.͒"),
  
  new Card(Image.ROOM_WALL, AnswerType.STORY, "It wants more?"),
  new Card(Image.WALL, AnswerType.THOUGHT, "V͈̔͒î̌̅sͤ̅͘uaͨ͘l͔͊i̔͒̍z̸̀ͣeͥͫ͜.҉"),
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
  
	$("#question-text").html(q.cardText);
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
        $("#response-text").html(`\"<i>${q.answer} it is then.</i>\"`);
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
    
    let img = activeCards[i].img;
    
    if (img == Image.GOLDIE) {
      activeCards[i].img = Image.GOLDIE2;
    } else if (img == Image.ANGEL) {
      activeCards[i].img = Image.ANGEL2;
    } else if (img == Image.SEAHORSE) {
      activeCards[i].img = Image.SEAHORSE2;
    } else if (img == Image.JELLY) {
      activeCards[i].img = Image.JELLY2;
    } else if (img == Image.BETTA) {
      activeCards[i].img = Image.BETTA2;
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
      progress -= 40; // the less time, the less the penalty
      
      // If seen the wall, allow fish to be killed
      /*
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
      */
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
      
      if (hasReachedDarkness) {
        showFriedCard();
      } else {
        showFiredCard();
      }
    } else {
      if (progress < 10) {
        playFalling(); // play a Shepherd's tone
      }
      progress -= rate;
      $("#timerText").css("opacity", (-(progress / 40) + 1) + "");
      $("#timerBar").width(progress + "%");
    }
  }
}

// Fail cards
function showFiredCard() {
  let exclusion = [];
  
  setImageTo(Image.FAIL_MINOR);
	$("#question-text").html("");
  $("#response-text").html("");

  for (let i = 0; i < 4; i++) {
    
    b = buttons[0][i];

    let item = getRandomOfType(AnswerType.RETRY, exclusion);
    exclusion.push(item);
    
    b.value = item;
    
    console.log(b.value);

    b.onclick = function() {
      playRandomBloop();
    };
  }
}

function showFriedCard() {
  let exclusion = [];
  
  setImageTo(Image.FAIL_MAJOR);
	$("#question-text").html("");
  $("#response-text").html("");

  for (let i = 0; i < 4; i++) {
    
    b = buttons[0][i];

    let item = getRandomOfType(AnswerType.RETRY, exclusion);
    exclusion.push(item);
    
    b.value = item;
    
    console.log(b.value);

    b.onclick = function() {
      playRandomBloop();
    };
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