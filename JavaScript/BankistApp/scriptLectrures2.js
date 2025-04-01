'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-10-11T17:01:17.194Z',
    '2023-10-14T23:36:17.929Z',
    '2023-10-16T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};



const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, '0'); // add 0 when the day is 1 digit
  // const month = `${date.getMonth() + 1}`.padStart(2, '0');
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// .toFixed(2) - rounding decimals to 2 numbers after .
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// Logout timer
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0); // dividing with remainder

    // In each call, print the remaining time in UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Login to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Setting the time to 5 minutes
  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// // //////// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
///////
//
//
// ////// 176. Adding Dates to "Bankist" App
// //////       178. Internationalizing Dates (Intl)
// experimenting with API
// const now = new Date();
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month: 'long',
//   year: 'numeric',
//   weekday: 'long',
// };

// const locale = navigator.language; // get the format settings from the browser
// console.log(locale);

// labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);
// // creates object for the formatter and then pass the date with .format

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Creating the date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      //weekday: 'long',
    };

    // const locale = navigator.language; // get the format settings from the browser
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // creates object for the formatter and then pass the date with .format
    // const day = `${now.getDate()}`.padStart(2, '0'); // add 0 when the day is 1 digit
    // const month = `${now.getMonth() + 1}`.padStart(2, '0');
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, '0');
    // const min = `${now.getMinutes()}`.padStart(2, '0');
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  // rounding the loan amount
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // approval time for loan
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 2500);
  }
  // Reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//
//
//
// //////        12.170. CONVERTING AND CHECKING NUMBERS

// in JS all numbers are represented as internally as floating point numbers, basically always as decimals
// console.log(23 === 23.0); // true
// // represented internally in 64 base 2 format - always stored in binary format

// // base 10 - 0 to 9  1/10 = 0.1; 3/10 = 3.3333333(3)
// // Binary base 2 - 0 to 1
// console.log(0.1 + 0.2); // 0.30000000000000004 // we get an infinite fraction
// // cannot do any really specific financial and scientific calculations
// console.log(0.1 + 0.2 === 0.3); // false

// // CONVERTING STRINGS to NUMBERS
// console.log(Number('23')); // convert string to a number
// console.log(+'23'); // when it sees the + operator it will do type coercion to number, all operands converted to numbers

// // PARSING
// console.log(Number.parseInt('30px', 10)); // 30 as a number
// // gets rid of unnecessary symbols that are not numbers
// // for this to work, the string needs to start with a number
// console.log(Number.parseInt('e23', 10)); // NaN
// // .parseInt can receive a second argument radix - the base of the numeral system that we are using

// console.log(Number.parseFloat('2.5rem')); // 2.5
// // reads the floating point number, the decimal
// console.log(Number.parseInt('2.5rem')); // 2 - int will stop at the decimal point

// // parseInt and parseFloat are global functions, we do not need to call them on Number
// console.log(parseFloat('2.5rem')); // 2.5 also works
// // in modern JS it is encouraged to call them in the Number object, Number provides a namespace

// // isNaN check if a value is a NaN// not the perfect solution
// console.log(Number.isNaN(20)); // false
// console.log(Number.isNaN('20')); // false
// console.log(Number.isNaN(+'20X')); // true / not a number
// console.log(Number.isNaN(20 / 0)); // = Infinity => NaN = false

// // .isFinite - better way to check if something is a number
// // best when working with floating point numbers
// console.log(Number.isFinite(20)); //true
// console.log(Number.isFinite('20')); //false
// console.log(Number.isFinite('20X')); // false
// console.log(Number.isNaN(20 / 0)); // false

// // isInteger - if we need to check for integer
// console.log(Number.isInteger(23)); // true
// console.log(Number.isInteger(23.0)); //true
// console.log(Number.isInteger(23 / 0)); // false
// console.log(Number.isInteger(23.5)); // false

//
//
//
// //////        12.171. MATH and ROUNDING

// Square root

// console.log(Math.sqrt(25)); // 5
// console.log(25 ** (1 / 2)); //5
// console.log(8 ** (1 / 3)); // 2  -- cubic root

// // Maximal value
// console.log(Math.max(5, 18, '23', 11, 2)); // 23 - returns the max value,
// // it also does type coercion, but DOES NOT DO parsing
// console.log(Math.max(5, 18, '23px', 11, 2)); // NaN

// // Min value
// console.log(Math.min(5, 18, 23, 11, 2)); // 2

// //CONSTANTS
// console.log(Math.PI * Number.parseFloat('10px') ** 2); // 314.1592653589793 AREA OF A CIRCLE

// // RANDOM
// console.log(Math.random()); // random between 0 and 1
// console.log(Math.random() * 6); //random between 1 and 6
// console.log(Math.trunc(Math.random() * 6) + 1); // remove decimal point
// // +1 to ofset the truncation

// const randomInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min) + 1) + min;
// // 0...1 -> 0...(max-min)-> min...max
// console.log(randomInt(10, 20));

// const randomInt2 = (
//   min,
//   max // will work even with negative numbers
// ) => Math.floor(Math.random() * (max - min) + 1) + min;
// // 0...1 -> 0...(max-min)-> min...max
// console.log(randomInt2(10, 20));

// // ROUNDING

// // Rounding integers -- all methods do type coercion
// console.log(Math.trunc(23.3)); // 23 removes decimal part

// console.log(Math.round(23.3)); // 23
// console.log(Math.round(23.9)); // 24 - rounds to the neares integer

// console.log(Math.ceil(23.3)); // 24 - rounds up
// console.log(Math.ceil(23.9)); // 24

// console.log(Math.floor(23.3)); // 23 - rounds down
// console.log(Math.floor('23.9')); // 23

// // with negative numbers rounding works the other way around
// console.log(Math.trunc(-23.3)); // -23
// console.log(Math.floor(-23.3)); // -24
// // floor works in all situations ( negative and positive numbers)

// // Rounding  decimals
// console.log((2.7).toFixed(0)); // converted to 3// RETURNS A STRING
// console.log((2.7).toFixed(3)); //2.700 (adds 3 decimal parts)
// console.log((2.345).toFixed(2)); // 2.35
// console.log(+(2.345).toFixed(2)); // converting back to a number

//
//
//
// //////        12.172. The REMAINDER operator

// // returns the remainder of a divison
// console.log(5 % 2); // 1
// console.log(5 / 2); // 5 = 2 * 2 + 1
// console.log(8 % 3); // 2
// console.log(8 / 3); // 8 = 2 * 3 + 2
// // useful to check if an number is EVEN or ODD
// // EVEN if it is divisible by 2
// console.log(6 % 2); // 0
// console.log(6 / 2); // 3 integer number

// // ODD if it is not divisible by 2
// console.log(7 % 2); // 1
// console.log(7 / 2); // 3,5 decimal number

// const isEven = n => n % 2 === 0; // return true or false

// console.log(isEven(8)); // true
// console.log(isEven(23)); // false
// console.log(isEven(514)); // true

// // check if any number is divisible by any other number

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     // 0,2,4,6
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//     // 0,3,6,9...
//     if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   });
// });

//
//
//
// //////        12.173. NUMERIC SEPARATORS
// for easier readability
// // 287,460,000,000
// const diameterNoSeparator = 287460000000;
// const diameter = 287_460_000_000;
// console.log(diameter); // 287460000000 the engine ignores the _ separator

// const priceCents = 345_99;
// console.log(priceCents); //34599

// const transferFee1 = 15_00;
// const transferFee2 = 1_500;

// // We can only place undersores(_) between numbers, in the beginning or the end of a number
// // const PI = 3._14115 // script.js:426 Uncaught SyntaxError:
// const PI = 3.1_4115;
// console.log(PI); //3.14115

// //does not work in a string -  cannot parse correctly
// console.log(Number('23000')); //23000
// console.log(Number('230_00')); // NaN
// console.log(parseInt('230_00')); // 230

//
//
//
// //////        12.174 Working with BigInt
// primitive data type introduced in ES 2020

// console.log(2 ** 53 - 1); // 9007199254740991 - biggest number that JS can safely represent
// console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
// console.log(2 ** 53 + 1); // not exact always

// // used to store large numbers

// console.log(4838430248342043823408394839483204); // 4.8384302483420437e+33
// console.log(4838430248342043823408394839483204n); // 4838430248342043823408394839483204n transformed to BigInt number
// console.log(BigInt(4838430248342043823408394839483204)); //4838430248342043683707135006343168n
// // should be used with smaller numbers
// console.log(BigInt(48384302)); //48384302n

// // Operations

// console.log(10000n + 10000n); // 20000n
// console.log(36286372637263726376237263726372632n * 10000000n); //362863726372637263762372637263726320000000n
// //console.log(Math.sqrt(16n));//Uncaught TypeError: Cannot convert a BigInt value to a number at Math.sqrt

// // not possible to mix BigInt with regular number
// const huge = 20289830237283728378237n;
// const num = 23;
// //console.log(huge * num); // Uncaught TypeError: Cannot mix BigInt and other types, use explicit conversions
// console.log(huge * BigInt(num)); //466666095457525752699451n

// //Exception - logical operators
// console.log(20n > 15); // true
// console.log(20n === 20); // false, since === does not do type coercion
// console.log(typeof 20n); //bigint
// console.log(20n == '20'); // true

// // Exception -- string concatenations

// console.log(huge + ' is REALLY big!!!'); //20289830237283728378237 is REALLY big!!!

// // Divisions
// console.log(11n / 3n); // 3n - returns the closest bigint
// console.log(10 / 3); // 3.3333333333333335

//
//
//
// //////        12.175 Creating Dates

// // Create a date
// const now = new Date(); // current date and time
// console.log(now); // Thu Oct 12 2023 16:49:31 GMT+0300 (Eastern European Summer Time)

// // parse the date from a string
// console.log(new Date('Oct 12 2023 16:50:29')); // Thu Oct 12 2023 16:50:29 GMT+0300 (Eastern European Summer Time)

// console.log(new Date('december 24, 2015')); // Thu Dec 24 2015 00:00:00 GMT+0200 (Eastern European Standard Time)
// // not reliable, unless the string is created by JS itself

// console.log(new Date(account1.movementsDates[0])); // Mon Nov 18 2019 23:31:17 GMT+0200 (Eastern European Standard Time)

// console.log(new Date(2037, 10, 19, 15, 23, 5)); // Thu Nov 19 2037 15:23:05 GMT+0200 (Eastern European Standard Time)
// // the MONTH is JS is ZERO BASED

// console.log(new Date(2037, 10, 31)); // Tue Dec 01 2037 00:00:00 GMT+0200 (Eastern European Standard Time) // AUTOCORRECTS TO THE NEXT DAY
// console.log(new Date(2037, 10, 33)); // Thu Dec 03 2037 00:00:00 GMT+0200 (Eastern European Standard Time)

// // amount of milliseconds passed since Unix time 01.01.1970
// console.log(new Date(0)); // Thu Jan 01 1970 02:00:00 GMT+0200 (Eastern European Standard Time)
// // conversion from days to milliseconds
// console.log(new Date(3 * 24 * 60 * 60 * 1000)); //Sun Jan 04 1970 02:00:00 GMT+0200 (Eastern European Standard Time)
// // TIMESTAMP

// Working with dates

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future); // Thu Nov 19 2037 15:23:00 GMT+0200 (Eastern European Standard Time)
// console.log(future.getFullYear()); // 2037

// console.log(future.getMonth()); // 10 months are zero based

// console.log(future.getDate()); // 19 th DAY of the month

// console.log(future.getDay()); // 4 th day of the WEEK

// console.log(future.getHours());

// console.log(future.getMinutes());

// console.log(future.getSeconds());

// console.log(future.toISOString()); // 2037-11-19T13:23:00.000Z

// console.log(future.getTime()); // 2142249780000 milliseconds timestamp

// console.log(new Date(2142249780000)); //Thu Nov 19 2037 15:23:00 GMT+0200 (Eastern European Standard Time)

// // current timestamp
// console.log(Date.now()); // 1697119477557

// future.setFullYear(2040);
// console.log(future); // Mon Nov 19 2040 15:23:00 GMT+0200 (Eastern European Standard Time)

//
//
//
// ////// 176. Adding Dates to "Bankist" App

//
//
//
// //////              177. Operations With Dates

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(Number(future)); // 2142249780000 timestamp in milliseconds
// console.log(+future);

// // function that takes two date and return the number of days passed between
// const calcDaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

// const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
// console.log(days1);

//
//
//
// //////       178. Internationalizing Dates (Intl)

//
//
//
// //////       179. Internationalizing Numbers (Intl)

// const num = 3884764.23;

// const options = {
//   // for more options, check MDN documentation
//   style: 'currency',
//   unit: 'celsius',
//   currency: 'EUR',
//   //useGrouping: false,
// };

// console.log('UK:   ', new Intl.NumberFormat('en-GB', options).format(num));
// console.log(
//   'Germany    :',
//   new Intl.NumberFormat('de-DE', options).format(num)
// );
// console.log('Syria    :', new Intl.NumberFormat('ar-SY', options).format(num));
// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language, options).format(num)
// );

//
//
//
// //////    180. Timers: setTimeout and setInterval

// setTimeout
//- execute code in the future when time runs out
// calback fn is only executed ONLY ONCE
// first argument is callback fn, second is the time
// arguments after the delay will be arguments for the callback

// const ingredients = ['olives', 'spinach'];

// const pizzaTimer = setTimeout(
//   // store the result to name the timeOut fn
//   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
//   3000,
//   ...ingredients
//   // 'olives', // ing1
//   // 'spinach' // ing2
// ); //will wait 3 seconds
// console.log('Waiting...'); // will execute first
// // asynchronous JS

// // cancelling the timeOut
// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// //
// setInterval

// // setInterval
// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 1000);

// const now = new Date();
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   seconds: 'numeric',
//   timeStyle: 'long',
// };

// setInterval(function () {
//   const now = new Date();

//   console.log(new Intl.DateTimeFormat('en-US', {timeStyle: 'long'}).format(now));
// }, 1000);

//
//
//
// //////    181. Implementing a Countdown Timer
