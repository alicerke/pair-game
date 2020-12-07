'use strict';

let numOfDivs = 10; // Kártya divek száma.
const cardsDivs = [];
const frontDivs = [];
const backDivs = [];

// Lérehozza a diveket
(function () {  
    function createDiv(number) {
      let boardDiv = document.createElement('div');     
      boardDiv.className = 'card'; 
      return boardDiv;
    }

    function createChildDiv(clName) {
      let childDiv = document.createElement('div');      
      childDiv.className = clName;  
      return childDiv;
    }
  
    function drawDivs() {
      let board = document.getElementById('board');  
      for (let i = 0; i < numOfDivs; i += 1) {
        cardsDivs.push(createDiv(`${i}`));
        board.appendChild(cardsDivs[i]);
        frontDivs.push(createChildDiv('card__face card__face--front'));
        cardsDivs[i].appendChild(frontDivs[i]);
        backDivs.push(createChildDiv('card__face card__face--back'));
        cardsDivs[i].appendChild(backDivs[i]);
      }
    }  
    drawDivs();  
}());

const cards = document.querySelectorAll('.card');
const backOfCards = ['elementalist', 'guardian', 'mesmer', 'necromancer', 'thief'];
const doubleBackOfCards = backOfCards.concat(backOfCards);
let pairs = [];
let pairsDiv = [];
let counter = 0;

// Játék indítása
const startGame = () => {
  addImgCards();
  flipped();
  startTimer();
}

// A kapott tömb elemeinek váletlenszerű keverése
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// A kártákhoz hozzárendeli a hátérképeket, és megkeveri a kártáykat
const addImgCards = () => {
  const cardImgs = shuffle(doubleBackOfCards);
  cardImgs.forEach((item, index) => backDivs[index].classList.add(item));
};

// Kártyalapok forgatása
const flipped = () => {
  cards.forEach( card => {
    card.addEventListener( 'click', addFlip );
  });
};

const backRotation = () => {
  cards.forEach(item => item.classList.toggle('is-flipped'));
};

const addFlip = (event) => {
  const cardFlipedDiv = event.target.parentElement;
  cardFlipedDiv.classList.toggle('is-flipped');
  const cardFlipedDivValue = cardFlipedDiv.lastElementChild.classList.value;
  testPair(cardFlipedDivValue, cardFlipedDiv);
};

// Két kártya teszteláse ( Hogy egyeznek vagy sem)
const testPair = (cardValue, cardDiv) => {
  pairs.push(cardValue);
  pairsDiv.push(cardDiv);

  if ( pairs.length === 2) {
    blockClick();
    setTimeout((blockClick), 800);
    if (pairs.every((item, index, pairs) => item === pairs[0])) {
      pairs = [];
      pairsDiv = [];
      counter += 1;
      ifWinGame();
      console.log(counter);
    } else {
      wrongFlip();
    }   
  }
};

// Klikkelés letiltása
const blockClick = () => {
  cards.forEach( card => { card.classList.toggle('noclick');
  });
}

// Han nem egyezznek a kártyák
const wrongFlip = () => {
  setTimeout(function(){
      pairsDiv.forEach(item => item.classList.toggle('is-flipped'));
      pairsDiv = [];
  }, 800)
  pairs = [];
};

// Stopper
const clockFace = document.querySelector('.time');
clockFace.textContent = '00:00:00';
let time;

// Tíznél kisebb számok kiegészítése 0-val.
const padNumbers = (number) => { 
  return number < 10 ? `0${number}` : `${number}`;
};

const timer = () => {
  let stopperTime = 0;
  time = setInterval(() => {
    stopperTime++;
    const seconds = padNumbers(stopperTime % 60);
    const minutes = padNumbers(Math.floor(stopperTime / 60) % 60);
    const hours = padNumbers(Math.floor(stopperTime / 3600));
    const time = `${[hours, minutes, seconds].join(':')}`
    clockFace.textContent = time;
  }, 1000 );
  removeTimerListener();
  return time;
}

const startTimer = () => {
  cards.forEach( card => {
    card.addEventListener( 'click', timer );
  });
}

const removeTimerListener = () => {
  cards.forEach( card => {
    card.removeEventListener( 'click', timer );
  });
}

const ifWinGame = () => {
  counter === 5 ? clearInterval(time) : '';
  counter === 5 ? setTimeout((restartGame), 5000) : '';
}

const restartGame = () => {
  clockFace.textContent = '00:00:00';
  clearInterval(time);
  backRotation();
  startGame();  
}

startGame();