// Variables for HTML elements
var topContainer = document.querySelector("#topContainer");
var enterword = document.querySelector("#inputword");
var submitbtn = document.querySelector("#submitbtn");
var wordsToFind = document.querySelector("#wordsToFind");
var start = document.querySelector("#startGame");
var board = document.querySelector("#board");
var row = document.querySelectorAll(".row");
var newGame = document.querySelector("#newGame");
var wordList = document.querySelectorAll(".wordList");


// *** This area is where all the words to find will be added and displayed ***

var totalLetters = ""; //String to add and count all the letters for words to find to make sure all words can fit.
submitbtn.addEventListener("click", function () {
  if(enterword.value == "") {
    alert("You need to type a word to add");
  }
  else {
    var wordValue = enterword.value.toUpperCase().replace(" ", "");
    totalLetters = totalLetters.concat(wordValue); //Add each word to this string
    
    if (totalLetters.length < 25) {
      wordArray.push(wordValue); //Add each word to the array of words
      
      //Add each word to HTML to be displayed
      var addWord = document.createElement("h3");
      addWord.classList.add("wordList");
      addWord.innerHTML = wordValue;
      wordsToFind.appendChild(addWord);
      enterword.value = "";
    } else { // Once the limit has been reach don't allow more words to be added
      enterword.value = "Can't fit more words in this puzzle";
      enterword.style.color = "red";
      submitbtn.style.display = "none";
    }
  } 
});

// *** End words to find area ***


var wordArray = []; //Contains all the words for the puzzle
var totalSlots; //Total slots on the board.  Used in the placeWords() function

var wordVar; //Variable to hold each word from the array
var lettersVar;  //Variable to hold each letter from each word from the array
var wordObjects = []; //Array to hold object for each word

var positionsArray = [];

// Alphabet array to fill in all the open slots
var alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];

//All rows on the board
var rows = document.getElementsByClassName("row");
//Get all the letter slots
var slots = document.getElementsByClassName("slot");

//Create the board. Create and add all the rows. Create and add divs/slots for all letters
function createBoard() {
  for (var r = 0; r < 7; r++) {
    var slotRow = document.createElement("div");
    slotRow.classList.add("row");
    slotRow.setAttribute("id", "r" + r);
    board.appendChild(slotRow);
  }
  for (var s = 0; s < 49; s++) {
    var divs = document.createElement("div");
    divs.classList.add("slot");
    divs.setAttribute("id", s + 1);

    if (divs.id <= 7) {
      rows[0].appendChild(divs);
    }
    if (divs.id > 7 && divs.id <= 14) {
      rows[1].appendChild(divs);
    }
    if (divs.id > 14 && divs.id <= 21) {
      rows[2].appendChild(divs);
    }
    if (divs.id > 21 && divs.id <= 28) {
      rows[3].appendChild(divs);
    }
    if (divs.id > 28 && divs.id <= 35) {
      rows[4].appendChild(divs);
    }
    if (divs.id > 35 && divs.id <= 42) {
      rows[5].appendChild(divs);
    }
    if (divs.id > 42 && divs.id <= 49) {
      rows[6].appendChild(divs);
    }
  }
}
//Ends the createBoard function

//Loop through the words in the array and create an object and push into the word objects array
function createWordsObject() {
  for (w of wordArray) {
    wordVar = w;
    lettersVar = w.split("");
    wordObjects.push({
      word: wordVar,
      letters: lettersVar,
      found: false,
      positions: [],
      direction: "across"
    });
  }
}
//Ends createWordsObject

// Get each word from the object and display on the webpage
function displayWordList() {
  for (w of wordObjects) {
    var displayWord = document.createElement('h3');
    displayWord.classList.add('wordList');
    displayWord.setAttribute("id", w.word); //Set the id to be the same as the word so it can be easily accessed it later
    displayWord.innerHTML = w.word;
    wordsToFind.appendChild(displayWord);
  }
}

// Randomly place all the words on the board
function placeWords() {
  totalSlots = document.querySelectorAll(".slot").length;
  var arrayAll = []; //Create array to hold all the slots and letters.  Also make sure it starts empty each time the function is run
  for (x of wordObjects) {
    x.positions = []; //Make sure the positions array for each word is empty each time the function runs
  }
  for (w of wordObjects) {
    var randNum = Math.ceil(Math.random() * totalSlots); //Get a randum number and use ceil so the lowest number is 1
    var startSlot = document.getElementById(randNum); //Slot id's are numbers that matchup with the possible random numbers

    //Randomly choose across or down position
    var upDown = Math.round(Math.random());
    if (upDown === 0) {
      w.direction = "across";
    }
    if (upDown === 1) {
      w.direction = "down";
    }

    //Across variables
    var endOfRow = startSlot.parentNode.lastElementChild.id; //Get the id/number of the last slot in the row
    var checkLengthAcross = w.letters.length - 1 + randNum; //Get the length across by adding the startSlot number to the length of the word

    //Down variables
    var startRow = parseInt(startSlot.parentNode.id.replace("r", "")); //Id's have to be unique so the rows are "r#".  Remove the "r" to just get a number
    var checkLengthDown = w.letters.length + startRow;
    var acrossLength = rows[0].children.length; //Count how many numbers between each letter going down by getting the length of a row

    //If ACROSS
    if (w.direction == "across" && checkLengthAcross <= endOfRow) {  //Check if the word fits across
      w.letters.forEach(function (value, index) { //Loop through the letters array
        var slotNum = randNum + index; //The slot number will be equal to the randNum/startSlot + the index so it will increase by 1 for each letter
        w.positions.push({ position: slotNum, letter: value }); //Add a slot and its letter to the positions array for the whole word
      });
    }

    //If DOWN
    else if (w.direction == "down" && checkLengthDown <= rows.length) {
      w.letters.forEach(function (value, index) {
        var slotNum = randNum + index * acrossLength; //Get slot for each letter. Order of Operations-multiply, then add
        w.positions.push({ position: slotNum, letter: value }); //Add a slot and its letter to the positions array for the whole word
      });
    }

    //Doesn't fit across or down
    else {
      placeWords();  //Try the placeWords function again 
      return;  //Need return statement to exit the function when it fails
    }

    arrayAll.push(w.positions);  //Push the slots and letters for all words into the arrayAll array
  }
  
  var flatArray = arrayAll.flat(Infinity); //Flatten array to make it easier to loop through

  for (var a = 0; a < flatArray.length; a++) {
    for (var b = 0; b < flatArray.length; b++) {
      //Skips itself when looping through.  Skips over when the word in both arrays is the same.  
      if (flatArray[a] == flatArray[b]) {
        continue;
      }

      if (flatArray[a].position == flatArray[b].position) { //Check if the same slot appears more than once
        console.log("DUPES");
        if (flatArray[a].letter !== flatArray[b].letter) { //If the letters for the same slot are different then there it doesn't work
          console.log("PROBELM--different letters");
          placeWords(); //Try the placeWords function again
          return;  //Need return statement to exit the function when it fails
        } else {
          console.log("SAME LETTER--all good"); //If the letters for the same spot are the same then it is ok
        }
      } //End of same position
      else { //If the same slot does not appear more than once then it is ok
        console.log("different pos--totally fine");
      }
    } //End of 'b' for loop
  } //End of 'a' for loop
  console.log(flatArray);

  for (f of flatArray) {
    var thisSlot = document.getElementById(f.position); //Get each slot that is used
    thisSlot.innerHTML = f.letter; //Fill that slot's HTML with its letter
  }
} //END OF PLACEWORDS FUNCTION

//Fill the rest of the board with random letters
function fillBoard() {
  for (s of slots) {
    if (s.innerHTML == "") { 
      var randLetter = Math.floor(Math.random() * 26);
      s.innerHTML = alphabet[randLetter];
    }
  }
}

//Click Start button
start.addEventListener("click", function () {
  if (wordArray.length == 0) {
    alert("You haven't added any words");
  }
  else {
    createBoard();
    createWordsObject();
    try { //Try to execute the placeWords function
      placeWords();
    }
    catch(error) { //If it can't then show an error alert and reload the page
      alert("Couldn't fit all these words. Try again");
      setTimeout(function() {
        location.replace("./index.html");
      }, 2000);
    }
    fillBoard();
    findWords();
    start.style.display="none";
    var cover = document.querySelector('#cover');
    cover.style.display="none";
    wordsToFind.innerHTML=""; //Remove the words that had been added as they were entered
    displayWordList(); //Display words from the words object to make them easier to work with in the game
    enterword.value = ""; //Clear red warning message if it's there
  } 
});

//Click New Game button
newGame.addEventListener("click", function() {
  location.replace("./index.html")
})

//Change color of the word after you find it
function foundWords() {
  for (w of wordObjects) {
    if (w.found == true) {
      var foundIt = document.getElementById(w.word);
      foundIt.style.color = "blue";
    }
  }
}

//Check to see if the correct slots are clicked to find each word
function findWords() {
  for (var s = 0; s < slots.length; s++) {
    slots[s].addEventListener("click", function () {
      this.classList.toggle("clickedOn"); //Add or remove new class when slot is clicked
      
      var selectedArray = []; //Array to store all the clicked slots and letters
      var selected = document.querySelectorAll(".clickedOn"); 
      for (var i = 0; i < selected.length; i++) {
        selectedArray.push({
          position: parseInt(selected[i].id),
          letter: selected[i].innerHTML
        });
      }
      selectedArray.sort(function (a, b) { //Sort the array by slot position low to high to its in the same order as the word
        a.position - b.position;
      });

      //Check to see if the clicked on slots and letters match a word
      for (w of wordObjects) {
        if (JSON.stringify(w.positions) == JSON.stringify(selectedArray)) {
          console.log("MATCH");
          w.found = true;
          var foundIt = document.getElementById(w.word);
          foundIt.style.color = "#C7D3DC";
          selectedArray = []; //Clear the array so it can check for the next word
          
          //Check if any of the words still have found as false.  If no more have false then game is over.
          function anyleft(f) {
            return f.found == false;
          }
          if (wordObjects.some(anyleft) == false) {
            console.log("FOUND ALL!");
            var win = document.querySelector('#win');
            cover.style.display="block";
            win.style.display="block";
            newGame.style.display="block";
          }
          //Change color of the letters in the puzzle to show the words has been found by changing class from clickedOn to found
          for (x of w.positions) {
            var thisId = document.getElementById(x.position);
            thisId.classList.remove("clickedOn");
            thisId.classList.add("found");
          }
          return;
        }
      }
    }); //End click on slot event
  }
}