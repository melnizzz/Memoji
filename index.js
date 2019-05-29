'use strict'
var cards = document.querySelector(".cards");
var timer = document.querySelector(".timer");
var cardImg, card, p_emoji, timerID;
var openCount = 0; 
var isStarted = false;
var isClicked = false;
var openCards = [];
var emoji = ['🦄', '🦄', '🐵', '🐵', '🐹', '🐹', '🐸', '🐸' , '🐼', '🐼', '🦀', '🦀'].sort(function(){return 0.5-Math.random()});

p_emoji = document.querySelectorAll(".card__img");
for (let i = 0; i < 12; i++) {
	p_emoji[i].innerHTML = emoji[i];
}

cards.addEventListener('click', function(event) {
	if (!isStarted) {
		isStarted = true;
		timerID = setInterval(timerDown, 1000);
	}
	card = null;
	cardImg = null;
	if (event.target.classList.contains('card')) {
		card = event.target;
		cardImg = card.firstChild;
	}
	else {
		if (event.target.classList.contains('card__img')) {
			cardImg = event.target;
			card = cardImg.parentNode;
		}
	}
	
	if (card.dataset.state == 'shirt' && !isClicked) {
		switch (openCards.length){
			case 0:
				isClicked = true;
				turnToFace(card);
				openCards = [card];
				isClicked = false;
				break;
			case 1:
				isClicked = true;
				turnToFace(card);
				setTimeout(checkPair, 200, openCards[0], card);
				break;
			case 2:
				isClicked = true;
				turnToShirt(openCards[0]);
				turnToShirt(openCards[1]);
				turnToFace(card);
				openCards = [card];
				break;
			default: break;
		}
	}
});

function turnToFace(card) {
	card.style.animation = "turnToFace .4s linear forwards";
	setTimeout(function(){card.dataset.state = 'face'}, 200);
	isClicked = false;	
}

function turnToShirt(card) {
	card.style.animation = "turnToShirt .4s linear forwards";
	setTimeout(function(){card.dataset.state = 'shirt'}, 200);
}

function checkPair(c1, c2) {
	if (c1 == c2) return;
	if (c1.firstChild.innerHTML == c2.firstChild.innerHTML) {
		c1.dataset.state = 'right';
		c2.dataset.state = 'right';
		openCount += 2;
		if (openCount == 12) {
			modal('Win');
		}
		openCards = [];
	}
	else {
		c1.dataset.state = 'wrong';
		c2.dataset.state = 'wrong';
		openCards = [c1, c2];
	}
}

function timerDown() {
	var time = timer.innerHTML.split(':');
	if (time[1] > 0) {
		time[1]--;
		time[1] = (time[1] > 9) ? time[1] : ('0' + time[1]);
	}
	else {
		if (time[0] > 0) {
			time[0]--;
			time[1] = 59;
		}
		else {
			modal('Lose');
		}
	}
	timer.innerHTML = time[0] + ':' + time[1];
}

function modal(res) {
	clearInterval(timerID);
	var layout = document.createElement('div');
	layout.classList.add('layout');
	var modal = document.createElement('div');
	modal.classList.add('modal');
	var result = document.createElement('p');
	result.classList.add('result');
	var result1 = document.createElement('span');
	result1.classList.add('results');
	result1.innerHTML = res[0];
	var result2 = document.createElement('span');
	result2.classList.add('results');
	result2.innerHTML = res[1];
	var result3 = document.createElement('span');
	result3.classList.add('results');
	result3.innerHTML = res[2];
	var result4 = document.createElement('span');
	result4.classList.add('results');
	result4.innerHTML = res[3] ? res[3] : ' ';
	result.appendChild(result1);
	result.appendChild(result2);
	result.appendChild(result3);
	result.appendChild(result4);
	var againBut = document.createElement('button');
	againBut.classList.add('again');
	againBut.innerHTML = (res == 'win') ? 'Play again' : 'Try again';
	layout.appendChild(modal);
	modal.appendChild(result);
	modal.appendChild(againBut);
	document.body.appendChild(layout);
	againBut.addEventListener('click', function() {
		var card = document.querySelectorAll(".card");
		for (let i = 0; i < 12; i++) {
			turnToShirt(card[i]);
		}
		emoji = emoji.sort(function(){return 0.5-Math.random()});
		for (let i = 0; i < 12; i++) {
			p_emoji[i].innerHTML = emoji[i];
		}
		layout.remove();
		isStarted = false;
		openCount = 0; 
		timer.innerHTML = "1:00";
	});
}
