﻿// main.js

// Get the file paths of our questions and answers
const questionURL = './Data/questions.json';
const answerURL = './Data/answers.json';

// We'll store references to the buttons, correct answer, correctness, and questionID
let buttons = [];
let correctAnswer = '';
let correct = '';
let questionId = 0;

/**
 * Reads in the questions and answers from their respective files and assigns the answers to buttons on the game HMTL page
 */
async function loadQuestionAndAnswers() {
    try {
        // 1. Fetch question JSON
        const qResponse = await fetch(questionURL);
        const qData = await qResponse.json();
        const questionText = qData.question[questionId].questionText;

        // Put it in the <h1 id="questionText">
        document.getElementById('questionText').textContent = questionText;

        // 2. Fetch answer JSON
        const aResponse = await fetch(answerURL);
        const aData = await aResponse.json();
        const answerObj = aData.answer[questionId];

        correctAnswer = answerObj.correct;
        const answers = answerObj.answers;

        // 3. For each button, set the inner text to one of the answers
        for (let i = 0; i < answers.length; i++) {
            const btn = document.getElementById(`answer${i}`);
            if (btn) {
                btn.textContent = answers[i];
            }
        }
        
    } catch (err) {
        console.error('Error loading question or answers:', err);
    }
}

/**
 * Initializes the integer values that change between questions at the beginning of the game
 */
function initializeGameData() {
    // If we have never stored lives, set them to 3. Otherwise, keep what’s in storage
    if (!localStorage.getItem('lives')) {
        localStorage.setItem('lives', '3');
    }
    // If we have never stored consecutiveCorrect, set it to 0
    if (!localStorage.getItem('consecutiveCorrect')) {
        localStorage.setItem('consecutiveCorrect', '0');
    }
    // If we have never stored score, set it to 0
    if (!localStorage.getItem('score'))
    {
        localStorage.setItem('score', '0');
    }

}

/**
 * Used to store the answer selected and check its correctness.
 * 
 * @param {any} answerText - Text for the answer choice associated to the button clicked
 */
async function checkAnswer(answerText) {
    var gameScore = parseInt(localStorage.getItem('score'), 10)
    localStorage.setItem('selectedAnswer', answerText);
    
    if (answerText === correctAnswer)
    {
        correct = "Correct!";
        gameScore += 50;
    }
    else
    {
        correct = "Wrong!";
    }

    localStorage.setItem('correct', correct);
    localStorage.setItem('score', gameScore.toString());
    // Now update lives & consecutive correct count
    updateLivesAndConsecutive(correctAnswer === answerText);
}



/**
 * Increments or decrements the player's lives based on how they anwer questions
 * 
 * @param {any} isCorrect - Did the player answer the question correctly
 */
function updateLivesAndConsecutive(isCorrect) {
    let lives = parseInt(localStorage.getItem('lives'), 10);
    let consecutiveCorrect = parseInt(localStorage.getItem('consecutiveCorrect'), 10);

    if (isCorrect) {
        consecutiveCorrect++;
        // If the user hits 3 in a row, earn a life (max 5) and reset consecutive count
        if (consecutiveCorrect === 3) {
            if (lives < 5) {
                lives++;
            }
            consecutiveCorrect = 0; // reset after awarding the life
        }
    } else {
        // Wrong answer => lose 1 life
        lives--;
        // reset consecutive correct
        consecutiveCorrect = 0;
    }

    // Save updated values
    localStorage.setItem('lives', lives.toString());
    localStorage.setItem('consecutiveCorrect', consecutiveCorrect.toString());
}

/**
 * Allows for players to select answers with the arrow keys by moving up and down and
 * pressing the "ENTER" key to select an answer
 * 
 * @returns In case no buttons are found it immediately returns
 */
function setupNavigation() {
    // Grab all the answer buttons
    buttons = document.querySelectorAll('.answer-button');
    if (!buttons.length) return; // In case none are found

    let currentIndex = 0;
    // Focus the first button
    buttons[currentIndex].focus();

    // Listen for arrow keys to move focus & Enter to click
    document.addEventListener('keydown', (event) => {
        // Move selection down
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            currentIndex = (currentIndex + 1) % buttons.length;
            buttons[currentIndex].focus();
        }
        // Move selection up
        else if (event.key === 'ArrowUp') {
            event.preventDefault();
            currentIndex = (currentIndex - 1 + buttons.length) % buttons.length;
            buttons[currentIndex].focus();
        }
        // Press the "focused" button
        else if (event.key === 'Enter') {
            event.preventDefault();
            buttons[currentIndex].click();
        }
    });
}


/**
 * Calls all of the functions that do not run on answer selection to initialize all variables
 */
window.addEventListener('DOMContentLoaded', () => {
    // Make sure we have lives/consecutive in localStorage
    initializeGameData();

    // First, set up arrow key navigation
    setupNavigation();

    // Then load the question & answers data
    loadQuestionAndAnswers();
});
