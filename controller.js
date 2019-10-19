/**
* File that gets the X and Y position of the mouse on
 * the screen.
 *
 * @author: Danny Geisz
* */

/** X position of mouse on screen.*/
let x;

/** Y position of mouse on screen. */
let y;

/** Gets the position of the mouse on the screen. */
function getCoords(e){
    var elm = document.getElementById('mainbody');
    x = e.pageX - elm.offsetLeft;
    y = e.pageY - elm.offsetTop;
}