// results.js

// Gets these 4 values that were stored in main.js
var selectedAnswer = localStorage.getItem('selectedAnswer');
var correctness = localStorage.getItem('correct');
var score = localStorage.getItem('score');
const lives = localStorage.getItem('lives');

// Sets <h2 id="selectedAnswer"> to the answer selected on the game page
document.getElementById('selectedAnswer').textContent = selectedAnswer;

// Sets <h1 id="correct"> to "Correct!" or "Wrong!" based on correctness of answer selected
document.getElementById('correct').textContent = correctness;

// Show current lives as well
document.getElementById('lives').textContent = `Lives: ${lives}`;

// If lives <= 0, go to game over
if (parseInt(lives, 10) <= 0) {
    window.location.href = './gameover.html';
}

// Sets <h1 id="score"> to the score
document.getElementById('score').textContent = score;

/**
 * Takes the player back to the game page
 */
async function goToGame()
{
    window.location.href = './game.html';
}

/**
 * Takes the player back to the home page and clears the
 */
async function goToHome()
{
    window.location.href = './index.html';
    localStorage.clear();
}

/**
 * Used to play the game over sound effect when a user selects a answer
 * 
 * @param {any} resultAudio - Audio for user feedback
 */
let resultAudio;

function playResultSoundEffects() {
    // Only create the audio element once

    if (!resultAudio && correctness == "Correct!") {
        resultAudio = new Audio("https://cdn.freesound.org/previews/644/644953_8358230-lq.mp3");
        resultAudio.type = "audio/mpeg";
    }
    else {
        resultAudio = new Audio("https://cdn.freesound.org/previews/253/253886_3169537-lq.mp3");
        resultAudio.type = "audio/mpeg";
    }

    resultAudio.play().catch(e => {
        console.error("Playback failed:", e);
    });
}

/**
 * Allows for players to select answers with the arrow keys by moving right and left and
 * pressing the "ENTER" key to select an answer
 * 
 * @returns In case no buttons are found it immediately returns
 */
function setupNavigation() {
    // Grab all the answer buttons
    buttons = document.querySelectorAll('.redirection-button');
    if (!buttons.length) return; // In case none are found

    let currentIndex = 0;
    // Focus the first button
    buttons[currentIndex].focus();

    // Listen for arrow keys to move focus & Enter to click
    document.addEventListener('keydown', (event) => {
        // Move selection down
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            currentIndex = (currentIndex + 1) % buttons.length;
            buttons[currentIndex].focus();
        }
        // Move selection up
        else if (event.key === 'ArrowLeft') {
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

//This waits for the content to fully load before the sound effect is played
window.addEventListener("DOMContentLoaded", () => {       
    playResultSoundEffects();
    setupNavigation();
});