var Basic = require("./BasicCard.js");
var Cloze = require("./ClozeCard.js");
var inquirer = require("inquirer");
var fs = require("fs");
// global variable for ammount correct
var correct = 0;
// global variable for amount guessed wrong
var wrong = 0;
// global array to hold the questions
var answerArray = [];

// function list prompts user will see first when they run node and what each one's assigned method is
var flashcards = function() {

    inquirer.prompt([
		{
            type: "list",
            name: "userType",
            message: "What do you want to do?",
            choices: ["Create-Basic-Cards","Trial-Run-with-user-cards", "Create-Cloze-Cards", "Use-Basic-Cards", 
            "Use-Cloze-Cards","Cloze-Run-with-user-cards", "Quit"]
        }

    ]).then(function(choice) {
        // choice for creating basic cards into json file
        if (choice.userType === "Create-Basic-Cards") {
            readCards("user.json");
            createCards(basicPrompt, "user.json");
        }
        // choice for using pre-made cards by user
        else if (choice.userType === "Use-Basic-Cards") {
            quiz("log.txt", 0);
        }
        // choice for taking quiz user just created
        else if (choice.userType === "Trial-Run-with-user-cards") {
        	quiz("user.json",0);
        }
        // choice for creating closed cards
        //  else if (choice.userType === "Create-Cloze-Cards") {
        //     readCards("user-cloze.json");
        //     createCards(clozePrompt, "user-cloze.json");
        // }

        // use pre-made cloze cards
         else if (choice.userType === "Use-Cloze-Cards") {
            quiz("cloze-log.txt", 0);
        }
        // use cloze-cards user just created
        else if (choice.userType === "Cloze-Run-with-user-cards") {
        	quiz("user-cloze.json", 0);
        }
        // quit if user wants to quit
         else if (choice.userType === "Quit") {
            console.log("Come back when you'ready!");

        }

    });

};

// readcard function that reads the json file and parses the data into appropriate style JSON and 
// loops through it and pushes to the array

var readCards = function(logFile) {
    answerArray = [];

    fs.readFile(logFile, "utf8", function(err, data) {

        console.log(data);
        var jsonContent = JSON.parse(data);
        
    
        for (var i = 0; i < jsonContent.length; i++) {
            answerArray.push(jsonContent[i]);
        }
    });
};

// createcards function taking the arguments prompttype which corresponds to clozetype or basictype
var createCards = function(promptType, logFile) {

    inquirer.prompt(promptType).then(function(answers) {

        answerArray.push(answers);

        if (answers.makeMore) {
            console.log(answers);
            createCards(promptType, logFile);

        } else {

            writeToLog(logFile, JSON.stringify(answerArray));
            flashcards();
        }
    });
};
// function for taking the basic and cloze quizes. these are pre made cards or cards you created
var quiz = function(logFile, x) {

    fs.readFile(logFile, "utf8", function(err, data) {

			console.log(data);
            // parseing the data into JSON format
        var jsonContent = JSON.parse(data);
        	
        // x should equal zero so if the json content is less than zero
        if (x < jsonContent.length) {
            // data at a certain index will have property of front which was specified
            // in the basiccard file
            if (jsonContent[x].hasOwnProperty("front")) {
                // create new flash card contructor with front and back
                var flashCard = new BasicCard(jsonContent[x].front, jsonContent[x].back);
                var flashQuestion = flashCard.front;
                var flashAnswer = flashCard.back.toLowerCase();

                console.log(flashQuestion);
           }
            //  else {

            //     var flashCard = new Cloze(jsonContent[x].text, jsonContent[x].cloze);
            //     var flashQuestion = flashCard.message;
            //     var flashAnswer = flashCard.cloze.toLowerCase();
            // }


            // inquirer will ask in the terminal the front card of the question and if you don't
            // do anything it will let you know to enter something in
            inquirer.prompt([
            	{
                    name: "question",
                    message: flashQuestion,
                    validate: function(value) {

                        if (value.length > 0) {
                            return true;
                        }
                        return "Please do something";
                    }
                }

                // after you answer it will let you know if your answer corresponds to
                // the one within the array of the txt file or the json file
            ]).then(function(answers) {
                // the correct ammount will increase or the wrong amount will increase
                if (answers.question.toLowerCase().indexOf(flashAnswer) > -1) {
                    console.log("Correct");
                    correct++;
                    x++;
                    quiz(logFile, x);
                } else {
                    flashCard.printAnswer();
                    wrong++;
                    x++;
                    quiz(logFile, x);
                }
            });
            // once the array is done let's you know how many you got correct and wrong
        } else {
            console.log('Here\'s how you did: ');
            console.log('Correct: ' + correct);
            console.log('Wrong: ' + wrong);
            correct = 0;
            wrong = 0;
            flashcards();
        }
    });
};
// function for writing to txt file or json file within the createcard function.
// info is the JSON.stringify(answerArray)
var writeToLog = function(logFile, info)  {

    fs.writeFile(logFile, info, function(err) {
        if (err)
            console.error(err);
    });
};

// defines our basicprompt for the argument inside create cards function for basc cards
var basicPrompt =  [{
	
    name: "Front",
    message: "\nEnter Front of Card: "
}, {
    name: "Back",
    message: "\nEnter Back of Card: "

}, {
    type: 'confirm',
    name: 'makeMore',
    message: 'Create another card (hit enter for YES)?',
    default: true
	}];
// defines cloze prompt function for arguments inside create cards function for cloze cards
var clozePrompt = [{

    name: "text",
    message: "Enter a sentence, putting the word you want to hide in parentheses, like this: 'I cannot tell a (lie)'",
    	validate: function(value) {
        var parentheses = /\(\w.+\)/;
        if (value.search(parentheses) > -1) {
            return true;
        }
        return 'Please put a word in your sentence in parentheses';
	  
    	}
	}, {
    type: 'confirm',
    name: 'makeMore',
    message: 'Create another card (hit enter for YES)?',
    default: true

	}];


// defines if the user wants to make more cards when they are creating them. the default is always 
// set to true meaning they should always want to make more
var makeMore =  {
	
    //Prompt to find out if user wants to make more cards (default is yes)
    type: 'confirm',
    name: 'makeMore',
    message: 'Create another card (hit enter for YES)?',
    default: true

};

// calling the whole flashcard function at then once all the script has run
flashcards();

