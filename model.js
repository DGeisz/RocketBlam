/**
 * Model of Rocket Blam.  Holds information about clouds,
 * rockets, gun tower, and projectiles
 * @author Danny Geisz
 * */

/** List with all clouds in the view. */
let clouds = [];

/** List of all projectiles in the air currently. */
let bullets = [];

/** List of all enemy rockets in the air currently. */
let rockets = [];

/** List of all explosion objects that occur. */
let splosions = [];

/** Tells whether the game has actually begun. */
let gameInitialized = false;

/** Starts the game initialization sequence.  The initialization
 * sequence includes the main menu disappearing and the cannon rising
 * from beneath the screen */
let beginInitSequence = false;

/** Main counter that dictates when initialization events should occur. */
let initCounter = 0;

/** Indicates whether the start button has disappeared. */
let startGone  = false;

/** Indicates whether the cannon is ready to be used. */
let cannonInit = false;

/** Indicates whether you have lost the game. */
let youLost = false;

/** Main counter that keeps track of time as the 
 * game progresses. */
let gameCounter = 0;

/** Variable that keeps track of when the next Rocket
 * should appear. */
let nextRocketCount = 0;

/** Variable that tracks the number of rockets destroyed. */
let missilesDestroyed = 0;

/** Keeps track of changes to missilesDestroyed. */
let lastMissileCount = 1;

/** Indicates whether the end game message should
 * be displayed. */
let failureDisplay = true;

/** Stores the highest score achieved by the user. */
let highScore = 0;


/** Function that initializes the frame. */
function beginFrame() {
    initClouds();
}

/** Starts the Initialization Sequence. */
function gameInit() {
    beginInitSequence = true;
}

/** Initializes the actual game.*/
function initialize(){
    if (!startGone) {
        var opac = 100 - initCounter;
        var startButton = document.getElementById("start");
        startButton.style.opacity = opac / 100;
        if (opac <= 0) {
            startGone = true;
        }
    } else {
        if (initCounter > 300) {
            if (!cannonInit) {
                cannonInit = true;
                makeCannon();
            }
            if (cannonInit) {
                var cannon = document.getElementById("Cannon");
                var log = document.getElementById('Log');
                cannon.style.top = cannon.offsetTop - 2 +  'px';
                log.style.top = log.offsetTop - 2 + 'px';
                if (cannon.offsetTop < windowHeight - 150) {
                    beginInitSequence = false;
                    document.getElementById('start').remove();
                    document.getElementById('restart').style.visibility = 'visible';
                    gameInitialized = true; //Change this to add other initialization features
                }
            }
        }
    }
    initCounter++;
}

/** Updates the frame to add functionality. This
 * is the method that updates the view, and therefore
 * is the view portion of the informal MVC layout  */
function updateFrame() {
    updateClouds();
    missileContact();
    updateExplosions();
    updateBullets();
    updateRockets();

    if (failureDisplay && youLost) {
        let fail = document.getElementById("failure");
        fail.style.visibility = "visible";
        document.getElementById("finalScore").innerHTML = "Score: " + lastMissileCount;
        if (lastMissileCount > highScore) {
            highScore = lastMissileCount;
        }
        document.getElementById("highScore").innerHTML = "High Score: " + highScore;
        failureDisplay = false;
    }

    if (!youLost) {
        if (beginInitSequence) {
            initialize();
        }

        updateCannon();
        if (gameInitialized) {
            updateScore();
            let random = getRndInteger(0, 200);
            let period = 10 + (1400 / (5 + gameCounter ** 0.33));
            if (gameCounter > nextRocketCount) {
                nextRocketCount = gameCounter + period + random;
                newRocket((1 + (gameCounter / 5000)));
            }
            gameCounter++;
        }
    }
}

function restart() {
    gameCounter = 0;
    nextRocketCount = -1;
    missilesDestroyed = 0;
    let fail = document.getElementById("failure");
    fail.style.visibility = "hidden";
    youLost = false;
    failureDisplay = true;
}

/** This initializes the background clouds.*/
function initClouds() {
    for (let i = 0; i < 16; i++) {
        let width = getRndInteger(150, 300);
        let height = getRndInteger(80, 150);
        let dx = getRndInteger(-windowWidth, windowWidth);
        let dy = getRndInteger(0, windowHeight / 2);
        let vel = getRndInteger(10, 50);
        newCloud(dx, dy, width, height, vel);
    }
}

/** Determines if the game score has changed and changes
 * the HTML accordingly. */
function updateScore() {
    if (missilesDestroyed !== lastMissileCount) {
        lastMissileCount = missilesDestroyed;
        document.getElementById("score").innerHTML = "Score: " + missilesDestroyed;
    }

}

/** Creates a new cloud that starts at position X, Y
 * and has width WIDTH and height HEIGHT, measured as
 * percentages of the total game window dimensions.
 * Vel is actually vel ** -1, and has units of
 * microseconds per pixel*/
function newCloud(x, y, width, height, vel) {
    let img = document.createElement("img");
    img.src = 'images/cloud.png';
    img.width = width;
    img.height = height;
    img.style.position = "absolute";
    img.style.top = y + "px";
    img.style.left = x + "px";
    document.getElementById('mainbody').appendChild(img);
    let currCloud = {html: img, x: x, y: y, vel: vel};
    clouds.push(currCloud);
}

/** Updates the positions of the clouds, destroys clouds no
 * longer in sight, and creates new clouds to keep a constant
 * stream in the background. */
function updateClouds() {
    for (i = 0; i < clouds.length; i++) {
        clouds[i].x += (1 / clouds[i].vel);
        clouds[i].html.style.left = clouds[i].x + "px";
        if (clouds[i].x > windowWidth) {
            clouds[i].html.remove();
            clouds.splice(i, 1);
            var width = getRndInteger(150, 300);
            var height = getRndInteger(80, 150);
            var y = getRndInteger(0, windowHeight / 2);
            var vel = getRndInteger(10, 50);
            newCloud(-windowWidth, y, width, height, vel);
        }
    }
}

/** Initializes the cannon. */
function makeCannon() {
    let img = document.createElement("img");
    img.id = "Cannon";
    img.style.position = "absolute";
    img.style.zIndex = '4';
    img.src = 'images/cannon1.png';
    var cannonLeft = 40 + 'px';
    var cannonTop = windowHeight + 50 + 'px';//windowHeight - 150  + 'px';
    img.style.left = cannonLeft;
    img.style.top = cannonTop;
    document.getElementById('mainbody').appendChild(img);

    let img3 = document.createElement("img");
    img3.id = "Log";
    img3.style.position = "absolute";
    img3.style.zIndex = '2';
    img3.src = 'images/log.png';
    var logTop = windowHeight + 70 + 'px';//windowHeight - 150  + 'px';
    img3.style.width = '50px';
    img3.style.height = '200px'
    img3.style.left = '100px';
    img3.style.top = logTop;
    document.getElementById('mainbody').appendChild(img3);
}

/** Updates the position of the cannon based on the position
 * of the mouse in the display. */
function updateCannon() {
    var cannon = document.getElementById("Cannon");
    var tempX = x - cannon.offsetLeft - 95;
    var tempY = y - cannon.offsetTop - 32;
    if (tempY > 0) {
        cannon.style.transform = "rotate(0rad)";
    } else if (tempX < 0) {
        cannon.style.transform = "rotate(-90deg)";
    } else {
        cannon.style.transform = "rotate(" + Math.atan(-Math.abs(tempY / tempX)) + "rad)";
    }
}

/** Creates a new bullet in the barrel of the cannon. */
function newBullet(){
    if (!youLost) {

        var cannon = document.getElementById("Cannon");
        var tempX = x - cannon.offsetLeft - 95;
        var tempY = y - cannon.offsetTop - 32;
        var theta;
        if (tempY > 0) {
            theta = 0;
        } else if (tempX < 0) {
            theta = -Math.PI / 2;
        } else {
            theta = Math.atan(-Math.abs(tempY / tempX));
        }

        let bull = document.createElement('img');
        bull.src = 'images/bullet.png';
        bull.style.position = 'absolute';
        bull.style.transform = "rotate(" + theta + "rad)";
        let bullLeft = cannon.offsetLeft + 45;
        let bullTop = cannon.offsetTop + 10;
        bull.style.left = bullLeft + 'px';
        bull.style.top = bullTop + 'px';


        let vX = (7) * Math.cos(-theta);
        let vY = (7) * Math.sin(theta);

        let currBull = {html: bull, X: bullLeft, Y: bullTop, velX: vX, vY: vY, theta: theta}
        document.getElementById('mainbody').appendChild(bull);
        bullets.push(currBull);
    }

}


/** Updates the position and velocity of the bullets to
 * create the effect of gravity acting on the bullets. */
function updateBullets(){
    let html;
    for (i = 0; i < bullets.length; i++) {
        bullets[i].X += bullets[i].velX;
        bullets[i].Y += bullets[i].vY;
        bullets[i].vY += 2/50;
        bullets[i].theta = Math.atan(bullets[i].vY / bullets[i].velX);
        html = bullets[i].html;
        html.style.left = bullets[i].X + 'px';
        html.style.top = bullets[i].Y + 'px';
        html.style.transform = 'rotate(' + bullets[i].theta + 'rad)';
        if (html.offsetLeft > windowWidth + 30 || html.offsetTop > windowHeight + 30) {
            html.remove();
            bullets.splice(i, 1);
        }
    }
}

/** Creates a new rocket on the right hand side of the screen. */
function newRocket(vel){
    let rocket = document.createElement('img');
    rocket.src = 'images/lilrock.png';
    rocket.style.position = 'absolute';
    let rocketLeft = windowWidth + 10;
    let rocketTop = getRndInteger(0, 0.8 * windowHeight);
    rocket.width = 150;
    rocket.style.left = rocketLeft + 'px';
    rocket.style.top = rocketTop + 'px';
    let currRock = {html: rocket, X: rocketLeft, Y: rocketTop, velX: vel}
    document.getElementById('mainbody').appendChild(rocket);
    rockets.push(currRock);
}

/** Moves the rockets across the screen according at rates
 * corresponding to their respective velocities. */
function updateRockets() {
    let html;
    for (let i = 0; i < rockets.length; i++) {
        rockets[i].X -= rockets[i].velX;
        html = rockets[i].html;
        html.style.left = rockets[i].X + 'px';
        if (html.offsetLeft < -30) {
            youLost = true;
            xplodeAll();
        }
    }

}

/** Checks if any bullets make contact with any rockets,
 * and if so annihilates both objects.  */
function missileContact() {
    let bull;
    let rock;
    let dist;
    for (let i = 0; i < rockets.length; i++) {
        for (let j = 0; j < bullets.length; j++) {
            rock = rockets[i];
            bull = bullets[j];
            dist = getDistance(rock.X + 50, rock.Y + 50, bull.X, bull.Y);
            if (dist < 50) {
                rock.html.remove();
                bull.html.remove();
                bullets.splice(j, 1);
                rockets.splice(i, 1);
                missilesDestroyed++;
                newExplosion(rock.X - 50, rock.Y - 30);
            }
        }
    }
}

/** Destroys all rockets on screen. This occurs after the
 * user has lost the game */
function xplodeAll() {
    let rock;
    for (let i = 0; i < rockets.length; i++) {
        rock = rockets[i];
        rock.html.remove();
        newExplosion(rock.X - 50, rock.Y - 30);
    }
    rockets = [];
}

/** Creates a new explosion at the location where a
 * rocket was just annihilated. */
function newExplosion(x, y) {
    let splode = document.createElement('img');
    splode.src = 'images/boom.png';
    splode.style.position = 'absolute';
    splode.width = 200;
    splode.style.left = x + 'px';
    splode.style.top = y + 'px';
    let currSplo = {html: splode, count: 0};
    document.getElementById('mainbody').appendChild(splode);
    splosions.push(currSplo);
}

/** Removes explosion images after 20 milliseconds. */
function updateExplosions() {
    let splo;
    for (let i = 0; i < splosions.length; i++) {
        splo = splosions[i];
        splo.count++;
        if (splo.count > 20) {
            splo.html.remove();
            splosions.splice(i, 1);
        }
    }
}

/** Gets the distance between two points in pixels.*/
function getDistance(x1, y1, x2, y2) {
    return ((x1 - x2)**2 + (y1 - y2)**2)**0.5;
}
