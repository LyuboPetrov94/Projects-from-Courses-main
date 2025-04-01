'use strict';

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;

const changeTextContent = function (item, text) {
  document.querySelector(item).textContent = text;
};

document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);

  // when there is no input
  if (!guess) {
    changeTextContent('.message', 'No Number!');
    // When Player wins
  } else if (guess === secretNumber) {
    changeTextContent('.message', 'Correct Number!');
    changeTextContent('.number', secretNumber);
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';

    if (score > highscore) {
      highscore = score;
      changeTextContent('.highscore', highscore);
    }
    // when guess is wrong
  } else if (guess !== secretNumber) {
    if (score > 1) {
      score--;
      changeTextContent(
        '.message',
        guess > secretNumber ? 'Too high!' : 'Too low!'
      );
      changeTextContent('.score', score);
    } else {
      changeTextContent('.message', 'You lost the game!');
      changeTextContent('.score', 0);
    }
  }
});

document.querySelector('.again').addEventListener('click', function () {
  score = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  changeTextContent('.message', 'Start guessing...');
  changeTextContent('.score', score);
  changeTextContent('.number', '?');
  document.querySelector('.guess').value = ' ';
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
});
