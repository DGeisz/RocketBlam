/**
 * Main file that holds the game driver and other utilities
 *
 * @author Danny Geisz
 */

/** Variables that store the size of the game window. */
const windowHeight = 600;
const windowWidth = 900;

/** This initiates all dynamic parts of the game.*/
window.onload = function () {
    gameDriver()
    document.getElementById("mainbody").onmousemove = getCoords;
    document.body.onkeyup = function (e) {
        if (e.keyCode == 32) {
            newBullet();
        }
    }
}


/** Function that drives the game.*/
function gameDriver() {
    beginFrame();
    var drivingInterval = setInterval(gameFrame, 1);
    function gameFrame() {
        updateFrame();
    }
}

/** Random Number Generator between MIN and MAX.*/
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}