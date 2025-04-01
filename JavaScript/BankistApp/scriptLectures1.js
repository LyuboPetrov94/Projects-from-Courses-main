'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

///////////////////////////////////////////////////////////

//
//
// ////////////////////   11.145. CREATING DOM ELEMENTS
const displayMovements = function (movements, sort = false) {
  //passing the data the function needs directly to it
  // second param used for sorting
  containerMovements.innerHTML = ''; // empty the entire html of the element

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  //                using slice to make a copy which will be sorted, we only want to sort the results, not chnage the uderlying array, since sort will mutate it
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html); // method accepts 2 strings // first is the position in which we want to attach the HTML // second argument is the string containig the html we want to insert
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

//
//
// ////////////////////   11.151. Computing USERNAMES
// the initials of each of the users in lowercase

const user = 'Steven Thomas Williams'; // should be stw

//from lecture for chaining
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1) // payout only if the interest on specific deposit is above 1
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  // not creating a new array, simply modifying/mutate the one that we receive as an input
  accs.forEach(function (acc) {
    // produce side effect by creating a new property   .acc is an object
    acc.username = acc.owner // create a new propery in the object .username
      .toLowerCase() // to lower case
      .split(' ') // transforms to array with each name as element
      .map(name => name[0]) // returns the first letter of the name
      .join(''); // join them by empty string
  });
};

createUsernames(accounts); // stw
//console.log(accounts);
//console.log(user); // stw

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// EVENT HANDLER
// ///////////// 11.158. Implementing LOGIN

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevetns the form from submitting and the page from reloading
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //optional chaining
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // the fields would lose the focus

    //update UI
    updateUI(currentAccount);
  }
});

// /////////////  11.159. Implementing Transfers

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
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
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //update UI
    updateUI(currentAccount);
  }
});

// request LOAN functionality
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    console.log('loan granted');
    // add the movement
    currentAccount.movements.push(amount);

    //update UI
    updateUI(currentAccount);
  }
  // clear input field
  inputLoanAmount.value = '';
});

//
// ////////////////////   11.160. The findIndex METHOD
// returns the index of the found element, not the element itself
// close account feature
// we will use the splice method to delete, and findIndex method to find the element which we want to delete

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    //find account
    const index = accounts.findIndex(
      // also has access to the current index and current entire array
      acc => acc.username === currentAccount.username
    ); // takes callback function, loops over the array and finds the index based on the condition
    console.log(index);

    //delete account
    accounts.splice(index, 1); // splice will mutate the array, no need to save the result

    //hide UI
    containerApp.style.opacity = 0;
  }

  //clear input fields
  inputCloseUsername.value = inputClosePin.value = '';
});

// SORTING // functionality is in displayMovements
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted; // allows to revert back to unsorted change; from true to false and reverse
});
//
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//
//
//
// ////////////////////   11.142. SIMPLE ARRAY METHODS

// let arr = ['a', 'b', 'c', 'd', 'e'];

// // SLICE METHOD
// //-- extract part of any array without changing the original array
// // 2 = the begin param start at C
// console.log(arr.slice(2)); // will return a new array( copy with the extracted parts) -- (3) ['c', 'd', 'e']
// console.log(arr.slice(2, 4)); // end param can also be defined  -- (2) ['c', 'd']
// console.log(arr.slice(-2)); // with - it will start to copy from the end (2) ['d', 'e'] -1 is the last element of the arr
// console.log(arr.slice(1, -2)); //(2) ['b', 'c'] starts at 1 and everything except the last 2

// // creating a SHALLOW COPY of an array
// console.log(arr.slice()); //(5) ['a', 'b', 'c', 'd', 'e'], when chaining multiple methods is needed
// console.log([...arr]); // same result, personal preference

// //
// //  SPLICE Method
// // - it changes, MUTATES the array
// // the extracted elements are gone from the original array
// //takes part of the array and returns ot, the original array loses the extracted parts
// //console.log(arr.splice(2)); // (3) ['c', 'd', 'e']
// //console.log(arr); // (2) ['a', 'b']

// // removing the last element
// arr.splice(-1);
// console.log(arr); // (4) ['a', 'b', 'c', 'd']
// // second param - deleteCount - the number of elements to remove from the start
// arr.splice(1, 2);
// console.log(arr); // (2) ['a', 'd']

// //
// //
// //  REVERSE - the original array is also reversed
// // -- MUTATES the array
// arr = ['a', 'b', 'c', 'd', 'e']; // restore the array
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse()); //(5) ['f', 'g', 'h', 'i', 'j']
// console.log(arr2); //(5) ['f', 'g', 'h', 'i', 'j']

// //
// //
// // CONCAT -
// // DOES NOT MUTATE
// const letters = arr.concat(arr2);
// console.log(letters); //(10) ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
// console.log([...arr, ...arr2]); // same result, matter of personal preference

// //
// //
// // JOIN
// console.log(letters.join(' - ')); //a - b - c - d - e - f - g - h - i - j
// // joins with a specified symbol in the param

// //
// //
//
//
// ////////////////////   11.143. THE NEW AT Method

// const arr = [23, 11, 64];
// console.log(arr[0]); //23
// console.log(arr.at(0)); //23
// // replacing the [] notation with more modern looking
// //
// // getting the last element without knowing the array lenght
// console.log(arr[arr.length - 1]); // 64
// console.log(arr.slice(-1)); //[64] - copy of the array with the last element
// console.log(arr.slice(-1)[0]); // 64 - takes out only the value

// console.log(arr.at(-1)); // 64 - negative index starts counting from the end
// // usage depends
// // prefered for METHOD CHAINING
// // ALSO WORKS ON STRINGS

// console.log('jonas'.at(0)); //j
// console.log('jonas'.at(-1)); //s

//
//
//
//
// ////////////////////   11.144. LOOPING ARRAYS : forEach

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// //for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   // ACCESSING COUNTER VARIABLE [i]
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log('-----------forEach--------------'); // CLEANER, EASIER TO WRITE AND READ
// // forEach is a higher-order function, requires a callback function to tell it what to do
// // the forEach method will call the callback function
// movements.forEach(function (mov, i, arr) {// EASIER TO GET THE CURRENT INDEX IN forEach
//   // pass the current element of the array as argument
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
//   }
// });
// 0:function(200)
// 1:function(450)
// 2:function(400)
//...
// the instructions for what the method to do are within the callback function

// forEach passes the current element, the index and the entire array that we are looping
// the first param is the current element
// the second param is the current index
// third param is the entire array that we are looping of

// WE CANNOT BREAK OUT OF forEach LOOP, continue and break statements do not work for it
// ALWAYS LOOPS OVER THE ENTIRE ARRAY

//
//
//
//
// ////////////////////   11.145. forEach with MAPS and SETS

// with a MAP
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// // with a SET
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique); //Set(3) {'USD', 'GBP', 'EUR'}
// currenciesUnique.forEach(function (value, _, map) {
//   // _ instead of key // _ is a throwaway variable that iscompletely unnecessary one
//   console.log(`${value}: ${value}`); // USD: USD
//   // the key is exactly the same as the value
// });
// a set does NOT have KEYS and NO INDEXES

//
//
//
//

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const dogsJulia1 = [3, 5, 2, 12, 7];
// const dogsKate1 = [4, 1, 15, 8, 3];

// const dogsJulia2 = [9, 16, 6, 8, 3];
// const dogsKate2 = [10, 5, 6, 1, 4];

// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCorrected = dogsJulia.slice(1, -2);
//   const dogs = dogsJuliaCorrected.concat(dogsKate);

//   dogs.forEach(function (dog, i) {
//     if (dog > 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
//     } else {
//       console.log(`"Dog number ${i + 1} is still a puppy 🐶"`);
//     }
//   });
// };

// checkDogs(dogsJulia1, dogsKate1);
// checkDogs(dogsJulia2, dogsKate2);

//
//
//
// ////////////////////   11.149. DATA TRANSFORMATIONS: MAP, FILTER, REDUCE
//
// MAP - takes an array, loops over it and at each itteration applies a callback function to the current array element and puts it into a new array
// its MAPS the values of the original array to a new array
// RETURNS a NEW ARRAY containing the results of applying an operation on all original elements

// FILTER METHOD - filters elements from the original array which satisfy certain condition
// only elements that pass the condition will make it into a new filtered array
// RETURNS a NEW ARRAY containing the array elemenents that passed a specific test condition

// REDUCE - boils ("reduces") all array elemenents down to one single value (e.g. adding all elements together)
// reduces the original array to one single value, which is the sum of all the elements
// RETURNS the single value, no new array in this case, only the reduced one

//
//
//
// ////////////////////   11.150. The MAP Method

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;

// // const movementsUSD = movements.map(function (mov) { // more in line with functional programming
// //   return mov * eurToUsd;
// // });
// const movementsUSD = movements.map(mov => mov * eurToUsd); // as an arrow function
// // may lead to bad readability, and may be more difficult to understand BUT it is smaller and cleaner

// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
// console.log(movementsUSDfor);

// //3 params - value, index and the array

// const movementsDescriptions = movements.map((mov, i) =>

//   `Movement ${i + 1}: You ${mov>0 ? `deposited` : `withdrew`} ${Math.abs(mov)}`

//   // if (mov > 0) {
//   //   return `Movement ${i + 1}: You deposited ${mov}`;
//   // } else {
//   //   return `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`;
//   // }// acceptable to have 2 return statements in a function, as long as only 1 is executed
// );

// console.log(movementsDescriptions);

//
//
//
//
// ////////////////////   11.150. The FILTER Method

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const deposits = movements.filter(function (mov, i, arr) {
//   // callback function also has access to the index and whole array
//   //more functional programming
//   // can chain methods together
//   return mov > 0; // returns a boolen value- true/false
// });

// console.log(movements);
// console.log(deposits);

// // with forOf loop  // cannot chain
// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

//
//
//
// ////////////////////   11.150. The REDUCE Method
// reduce/boil down all the elements of an array to ONE SINGLE VALUE

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);

//accumulator -> SNOWBALL -> SUM
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   // accumulator, current value(element), index, entire array
//   // cur - the first param is accumulator - keeps accumulating the value we want to return
//   return acc + cur;
// }, 0); // 0 is the initial value of the accumulator, specified as second param, as starting point can be different than 0

// const balance = movements.reduce((acc, cur) => acc + cur, 0);

// console.log(balance);

// // with forOf loop
// let balance2 = 0; // .reduce avoids the external variable
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// // MAXIMUM VALUE from the movements array
// // the reduced value can be whatever we want, can be multiplication, string, object

// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]); // first value of the array
// console.log(max);

// const maxArrow = movements.reduce(
//   (acc, mov) => (acc > mov ? acc : mov),
//   movements[0]
// );
// console.log(maxArrow);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]
*/

// const calcAverageHumanAge = function (ages) {
//   const humanAge = ages.map(age => (age <= 2 ? age * 2 : 16 + age * 4));
//   const adult = humanAge.filter(age => age >= 18);
//   //console.log(`Human age of dogs is ${humanAge}`);
//   //console.log(`Adults are ${adult}`);

//   const average = adult.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
//   return average;
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

// const average1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const average2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(average1, average2);
// console.log(
//   `Average human age of first group is ${calcAverageHumanAge([
//     5, 2, 4, 1, 15, 8, 3,
//   ])} years`
// );

// console.log(
//   `Average human age of first group is ${calcAverageHumanAge([
//     16, 6, 10, 5, 6, 1, 4,
//   ])} years`
// );

//
//
//
//
// ////////////////////   11.155. The Magic of CHAINING METHODS

// const eurToUsd = 1.1;

// // PIPELINE
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0) //returns array
//   .map(mov => mov * eurToUsd) //returns array
//   .reduce((acc, mov) => acc + mov, 0); //returns value
// console.log(totalDepositsUSD);
// we can only chain a method after another one, if the first returns an array
// in the above example, we cannot chain further after .reduce
// it is hard to debug, need to check out the array(result) in each of these steps
// do not overuse chaining , must be optimized
// can cause performance issues of the array is huge
// we can compress the functionaliti of the chain in as little methods as possible
// a BAD PRACTICE  is to chain methods that MUTATE THE ORIGINAL ARRAY, such as the splice method
// avoid chaining splice and reverse methods
// GOOD PRACTICE IS TO AVOID MUTATING ARRAYS

//
//
//
///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!
  TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]
*/
// const calcAverageHumanAge = function (ages) {
//   const humanAge = ages.map(age => (age <= 2 ? age * 2 : 16 + age * 4));
//   const adult = humanAge.filter(age => age >= 18);
//   //console.log(`Human age of dogs is ${humanAge}`);
//   //console.log(`Adults are ${adult}`);

//   const average = adult.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
//   return average;
// };

// const calcAverageHumanAge2 = ages =>
//   ages
//     .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// const average1 = calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]);
// const average2 = calcAverageHumanAge2([16, 6, 10, 5, 6, 1, 4]);
// console.log(average1, average2);
// console.log(
//   `Average human age of the group is ${calcAverageHumanAge2([
//     5, 2, 4, 1, 15, 8, 3,
//   ])} years`
// );

// console.log(
//   `Average human age of the group is ${calcAverageHumanAge2([
//     16, 6, 10, 5, 6, 1, 4,
//   ])} years`
// );

//
//
//
//
// ////////////////////   11.157. The FIND METHOD
// to retrieve one element of an array based on a condition
// also accepts a callback function which will be called as the method loops over the array
// DOES NOT RETURN A NEW ARRAY
// RETURNS ONLY THE FIRST ELEMENT OF THAT PASSES THE CONDITION
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal); //-400

// console.log(accounts);
// // we can find an object inside an array, based on a propery of the object
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

//
//
//
//
// ////////////////////   11.161. SOME and EVERY

// // SOME
// console.log(movements);
// console.log(movements.includes(-130)); // true // checks if array a certain value, TESTING FOR EQUALITY

// // SOME TESTS FOR CONDITION
// console.log(movements.some(mov => mov === -130)); // true

// const anyDeposits = movements.some(mov => mov > 1500); // accepts callback function with condition
// console.log(anyDeposits); // true or false

// //
// // EVERY
// // only returns true if ALL the ELEMENTS in the array SATISFY the CONDITION
// console.log(movements.every(mov => mov > 0)); // check if all movements are deposits // false

// console.log(account4.movements.every(mov => mov > 0)); // TRUE, account has only deposits

// // SEPARATE CALLBACK - no need to write the callback function in the method directly
// // can reuse the condition, callback function better for the DRY PRINCIPLE (no repetition)
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit)); // true
// console.log(movements.every(deposit)); // false
// console.log(movements.filter(deposit)); //(5) [200, 450, 3000, 70, 1300]

// //
// //
// //
// // ////////////////////   11.162. FLAT and FLATMAP METHODS
// // methods introduced in 2019
// //nested array
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8]; // this has one level of nesting
// console.log(arr.flat()); //8) [1, 2, 3, 4, 5, 6, 7, 8]
// // removes the nested arrays, flattens the array

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8]; // second level of nesting
// console.log(arrDeep.flat()); // [Array(2), 3, 4, Array(2), 7, 8] still contains the two inner arrays
// // accepts arguments for depth - 1 is the default
// console.log(arrDeep.flat(2)); // [1, 2, 3, 4, 5, 6, 7, 8] takes the element ouf the the second level of nesting

// const accountMovements = accounts.map(acc => acc.movements); // create an array with arrays of the movements
// console.log(accountMovements);

// const allMovements = accountMovements.flat(); // one array with all movements
// console.log(allMovements);
// const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0); // total bank balance
// console.log(overalBalance); // 17840

// const overalBalance2 = accounts // with chaining
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance2); // 17840

// //FLATMAP
// // combines flat and map - better for performance

// const overalBalance3 = accounts
//   .flatMap(acc => acc.movements)// ONLY GOES 1 LEVEL DEEP
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance3); // 17840

//
//
//
// ////////////////////   11.163. SORTING ARRAYS

// // JS built in sorting

// //strings
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha']; // mutates the array
// console.log(owners.sort()); //(4) ['Adam', 'Jonas', 'Martha', 'Zach'] - sorted A to Z
// console.log(owners); //(4) ['Adam', 'Jonas', 'Martha', 'Zach']

// // numbers
// console.log(movements); //(8) [200, 450, -400, 3000, -650, -130, 70, 1300]
// console.log(movements.sort()); //(8) [-130, -400, -650, 1300, 200, 3000, 450, 70]
// //makes the sorting based on strings, converts everything to string and then sorts
// // - first, after that alphabetically based on the first number

// // passing compare callback function, two arguments
// //return < 0  = A will be before B (keep order)
// //return > 0 = B will be before A (switch order)
// //ASCENDING
// // movements.sort((a, b) => {
// //   // imagine a and b as two consecutinve numbers in the array
// //   //assending order from small to big
// //   if (a > b) return 1;
// //   if (a < b) return -1;
// // });

// movements.sort((a, b) => a - b);// if A >B it will return a positive number, otherwise it will be negative
// console.log(movements); //(8) [-650, -400, -130, 70, 200, 450, 1300, 3000]

// // DESCENDING
// // movements.sort((a, b) => {
// //   //descending  order from big to small
// //   if (a > b) return -1;
// //   if (a < b) return 1;
// // });
// movements.sort((a, b) => b - a)
// console.log(movements); //(8) [3000, 1300, 450, 200, 70, -130, -400, -650]

//
//
// ////////////////////   11.165. More Ways of Creating and Filling Arrays

// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// // Empty arrays + fill method
// const x = new Array(7);
// console.log(x); // array with 7 empty elements (7) [empty × 7] - contains nothing
// // not really useful
// //cannot call the .map method to fill the array

// // The FILL method
// //x.fill(1);// mutates the entire array //(7) [1, 1, 1, 1, 1, 1, 1]
// console.log(x);
// // similar to the slice method
// // we can specify where we want it to fill
// //x.fill(1, 3);//(7) [empty × 3, 1, 1, 1, 1]

// x.fill(1, 3, 5); //(7) [empty × 3, 1, 1, empty × 2]
// console.log(x);

// arr.fill(23, 4, 6); // (7) [1, 2, 3, 4, 23, 23, 7]
// console.log(arr);
// //first argument - from which position
// // second argument - to which position

// // ARRAY.FROM
// // from is not a method on an array, but on array constructor Array is a function object
// const y = Array.from({ length: 7 }, () => 1); // second argument is a callback fn
// console.log(y); //(7) [1, 1, 1, 1, 1, 1, 1]
// // cleaner and nicer

// const z = Array.from({ length: 7 }, (cur, i) => i + 1);
// // same callback function as the map method
// console.log(z); //(7) [1, 2, 3, 4, 5, 6, 7]
// // _throwaway variable, when we do not need it, but we still need to define it as param,
// // a param that is not used, but the method requires to define something

// const movementsUI = Array.from(document.querySelectorAll('.movements__value'));

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'), // returns an Array-like structure, which can be converted to an array
//     el => Number(el.textContent.replace('€', ''))
//   ); // map method will not work here, on QuerySelector, because it is not yet an array
//   // we can use the mapping callback of Array.from to fill in the array
//   // placing the whole callback as a second argument
//   //console.log(movementsUI.map(el => Number(el.textContent.replace('€', ''))));
//   // works because we use it on an array (movementsUI)
//   console.log(movementsUI);

//   const movementsUI2 = [...document.querySelectorAll('.movements__value')]; // also creates an array, but mapping must be done separately // it is raw data
//   console.log(movementsUI2);
// });

//

//
//
// ////////////////////   11.165. Summary: Which Array Method to Use?

// MUTATE ORIGINAL ARRAY

// = ADD to ORIGINAL :
// - .push (end)
// - .unshift(start)

// = REMOVE from ORIGINAL
// - .pop(end)
// - .shift(start)
// - .splice(any)

// = OTHERS
// - .reverse
// - .sort
// - .fill
//--------------------------------------------------------------------------

// A NEW ARRAY

// = Computed from original
// - .map (loop)

// = Filtered using condition
// - .filter

// = Portion of original
// - .slice

// = Adding original to other
// - .concat

// = Flattening the original
// - .flat
// - .flatMap
//--------------------------------------------------------------------------

// AN ARRAY INDEX

// = Based on value
// - .indexOf

// = Based on test condition
// - .findIndex
//--------------------------------------------------------------------------

// AN ARRAY ELEMENT

// = Based on test condition
// - .find
//--------------------------------------------------------------------------

// KNOW IF ARRAY INCLUDES

// = Based on value
// - .includes // return boolean value

// = Based on test condition
// - .some // return boolean value
// - .every // return boolean value
//--------------------------------------------------------------------------

// A NEW STRING
// = Based on separate string
// - .join
//--------------------------------------------------------------------------

// TO TRANSFORM TO VALUE

// = Based on accumulator
// - .reduce - boil down array to single value of any type:number, string, boolean, or even new array or object
//--------------------------------------------------------------------------

// TO LOOP OVER ARRAY
// = Based on callback
// - .forEach - does not create a new array, just loops over it

//

//
//
// ////////////////////   11.166.  Array Methods Practice

// // 1. check the sum of all deposits
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((sum, cur) => sum + cur, 0);

// console.log(bankDepositSum); // 25180

// // 2. Count how many deposits there are with atleast 1000 usd

// // const numDeposits1000 = accounts
// //   .flatMap(acc => acc.movements)
// //   .filter(mov => mov >= 1000).length;

// // console.log(numDeposits1000); // 6

// //    same thing with reduce

// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   //.reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0)
//   //.reduce((count, cur) => (cur >= 1000 ? count++ : count), 0); // returns 0
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0); // returns 6

// console.log(numDeposits1000); // 6

// // ++ operator increments the value, but returns the previous value

// let a = 10;
// console.log(a++); //10
// console.log(a); //11

// //using the prefixed ++ operator - writing it before the operand
// console.log(++a); //12

// // 3. The REDUCE METHOD
// // - create a new object with it
// // that will contain the sum of the deposit and the withdrawals

// const { deposits, withdrawals } = accounts // creating a brand new object
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       //cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur; // using brackets instead of dot notation
//       return sums; // must be returned in this case
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// //console.log(sums); //{deposits: 25180, withdrawals: -7340}
// console.log(deposits, withdrawals); //25180 -7340

// // 4. CONVERT a STRING to a TITTLE CASE
// // all the words in a text to be capitalized with some exceptions
// // this is a nice title -> This Is a Nice Title

// const convertTitleCase = function (title) {
//   const capitalize = str=> str[0].toUpperCase() + str.slice(1)

//   const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word =>
//       exceptions.includes(word) ? word : capitalize(word)
//     )
//     .join(' ');
//   return capitalize(titleCase); //capitalize the first letter from the sentence, so it does not start with a lower case in case the first word is an exception
// };

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs); //

// 2.
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
  } `
);

// 3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

// 4.
console.log(`${ownersEatTooMuch.join(' and ')}s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}s dogs eat too little!`);

// 5.
console.log(dogs.some(dog => dog.curFood === dog.recFood)); // false

// 6.
// console.log(
//   dogs.some(
//     dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
//   )
// ); // true

const dogEatingOk = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
console.log(dogs.some(dogEatingOk)); // true

// 7.
const arrDogOK = dogs.filter(dogEatingOk);
console.log(arrDogOK);

// 8.
// sort it by recommended food portion in an ascending order [1,2,3]
const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsSorted);
