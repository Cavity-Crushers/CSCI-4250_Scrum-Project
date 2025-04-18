// gameover.js

/**
 * Quits the game: send user back to home page (index.html) and clears the local storage
 */
function goToHome() {
    localStorage.clear();

    window.location.href = './index.html';
}

/**
 * Play Again: reset data and go back to the game page.
 */
function playAgain() {
    //Clear everything
    localStorage.clear();

    window.location.href = './game.html';
}

/**
 * Used to play the game over sound effect when a user looses the game
 * 
 * @param {any} gameOverAudio - Audio for user feedback
 */

let gameOverAudio;

function playGameOverSoundEffect() {
    // Only create the audio element once

    if (!gameOverAudio) {
        gameOverAudio = new Audio("https://cdn.freesound.org/previews/173/173859_1074082-lq.mp3");
        gameOverAudio.type = "audio/mpeg";
    }

    gameOverAudio.play().catch(e => {
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
    playGameOverSoundEffect();
    setupNavigation();
});