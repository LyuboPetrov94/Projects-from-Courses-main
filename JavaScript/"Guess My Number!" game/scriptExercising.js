'use strict';
/*
console.log(document.querySelector('.message').textContent);
document.querySelector('.message').textContent = 'Correct Number!';

document.querySelector('.number').textContent = 13;
document.querySelector('.score').textContent = 10;

document.querySelector('.guess').value = 23;
console.log(document.querySelector('.guess').value); // getting the  actual value from the input
*/

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;

const displayMessage = function (message) {
  document.querySelector('.message').textContent = message; // refactor from course
};

const changeTextContent = function (item, text) {
  document.querySelector(item).textContent = text; // further refactoring individually
};

document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value); // takes the value from the input and converts to number

  // when there is no input
  if (!guess) {
    // !guess would be 0 which is a falsy value
    //document.querySelector('.message').textContent = 'No Number!';
    //displayMessage('No Number!');
    changeTextContent('.message', 'No Number!');
    // When Player wins
  } else if (guess === secretNumber) {
    //document.querySelector('.message').textContent = 'Correct Number!';
    //displayMessage('Correct Number!');
    changeTextContent('.message', 'Correct Number!');
    //document.querySelector('.number').textContent = secretNumber;
    changeTextContent('.number', secretNumber);

    // changing the css
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';

    if (score > highscore) {
      highscore = score;
      //document.querySelector('.highscore').textContent = highscore;
      changeTextContent('.highscore', highscore);
    }
    // when guess is wrong - refactor code
  } else if (guess !== secretNumber) {
    if (score > 1) {
      //document.querySelector('.message').textContent =
      //guess > secretNumber ? 'Too high!' : 'Too low!';
      score--;
      changeTextContent(
        '.message',
        guess > secretNumber ? 'Too high!' : 'Too low!'
      );
      //document.querySelector('.score').textContent = score;
      changeTextContent('.score', score);
    } else {
      changeTextContent('.message', 'You lost the game!');
      //document.querySelector('.message').textContent = 'You lost the game!';
      changeTextContent('.score', 0);
      //document.querySelector('.score').textContent = 0;
    }
  }
  // when guess is too high
  //   } else if (guess > secretNumber) {
  //     if (score > 1) {
  //       document.querySelector('.message').textContent = 'Too high!';
  //       score--;
  //       document.querySelector('.score').textContent = score;
  //     } else {
  //       document.querySelector('.message').textContent = 'You lost the game!';
  //       document.querySelector('.score').textContent = 0;
  //     }

  //     // when guess is too low
  //   } else if (guess < secretNumber) {
  //     if (score > 1) {
  //       document.querySelector('.message').textContent = 'Too low!';
  //       score--;
  //       document.querySelector('.score').textContent = score;
  //     } else {
  //       document.querySelector('.message').textContent = 'You lost the game!';
  //       document.querySelector('.score').textContent = 0;
  //     }
  //   }
});

///////////////////////////////////////
// Coding Challenge #1

/* 
Implement a game rest functionality, so that the player can make a new guess! Here is how:

1. Select the element with the 'again' class and attach a click event handler
2. In the handler function, restore initial values of the score and secretNumber variables
3. Restore the initial conditions of the message, number, score and guess input field
4. Also restore the original background color (#222) and number width (15rem)

GOOD LUCK 😀
*/

document.querySelector('.again').addEventListener('click', function () {
  score = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;

  //document.querySelector('.message').textContent = 'Start guessing...';
  changeTextContent('.message', 'Start guessing...');
  //document.querySelector('.score').textContent = score;
  changeTextContent('.score', score);
  //document.querySelector('.number').textContent = '?';
  changeTextContent('.number', '?');
  document.querySelector('.guess').value = ' ';
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
});
