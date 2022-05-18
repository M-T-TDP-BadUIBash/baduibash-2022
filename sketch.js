let width = 0;
let height = 0;
let canvas = null;
let showingGame = false;

let player = null;
let lines = [];
let backgroundImage = null;

let creatingLines = false;

let idleImage = null;
let squatImage = null;
let jumpImage = null;
let oofImage = null;
let run1Image = null;
let run2Image = null;
let run3Image = null;
let fallenImage = null;
let fallImage = null;
let showingLines = false;
let levelImages = [];

let placingPlayer = false;
let playerPlaced = false;

let fallSound = null;
let jumpSound = null;
let bumpSound = null;
let landSound = null;

let levelDrawn = false;
let levelNumber = 0;

const allElements = ["firstNameField", "lastNameField", "emailField", "phoneField", "addressField", "resumeFileField", "submitBtn"];

function preload() {
    backgroundImage = loadImage("images/levelImages/1.png");
    idleImage = loadImage("images/poses/idle.png");
    squatImage = loadImage("images/poses/squat.png");
    jumpImage = loadImage("images/poses/jump.png");
    oofImage = loadImage("images/poses/oof.png");
    run1Image = loadImage("images/poses/run1.png");
    run2Image = loadImage("images/poses/run2.png");
    run3Image = loadImage("images/poses/run3.png");
    fallenImage = loadImage("images/poses/fallen.png");
    fallImage = loadImage("images/poses/fall.png");

    for (let i = 1; i <= 5; i++) {
        levelImages.push(loadImage("images/levelImages/" + i + ".png"));
    }

    jumpSound = loadSound("sounds/jump.mp3");
    fallSound = loadSound("sounds/fall.mp3");
    bumpSound = loadSound("sounds/bump.mp3");
    landSound = loadSound("sounds/land.mp3");
}

function setup() {
    setupCanvas();
    player = new Player();
    setupLevels();
    jumpSound.playMode("sustain");
    fallSound.playMode("sustain");
    bumpSound.playMode("sustain");
    landSound.playMode("sustain");
}

function drawMousePosition() {
    let snappedX = mouseX - (mouseX % 20);
    let snappedY = mouseY - (mouseY % 20);
    push();

    fill(255, 0, 0);
    noStroke();
    ellipse(snappedX, snappedY, 5);

    if (mousePos1 != null) {
        stroke(255, 0, 0);
        strokeWeight(5);
        line(mousePos1.x, mousePos1.y, snappedX, snappedY);
    }

    pop();
}

function draw() {
    background(10);
    push();
    translate(0, 50);
    image(levels[player.currentLevelNo].levelImage, 0, 0);
    levels[player.currentLevelNo].show();
    player.update();
    player.show();

    if (showingLines || creatingLines) showLines();

    if (creatingLines) drawMousePosition();

    pop();

    fill(0);
    noStroke();
    rect(0, 0, width, 50);
}

function showLines() {
    if (creatingLines) {
        for (let l of lines) {
            l.show();
        }
    } else {
        for (let l of levels[player.currentLevelNo].lines) {
            l.show();
        }
    }
}

function setupCanvas() {
    canvas = createCanvas(1200, 950);
    canvas.parent("canvas");
    width = canvas.width;
    height = canvas.height - 50;
}

function keyPressed() {
    if (!checkFocus()) return;
    switch (key) {
        case " ":
            player.jumpHeld = true;
            break;
        case "S":
            bumpSound.stop();
            jumpSound.stop();
            landSound.stop();
            fallSound.stop();
            break;
    }

    switch (keyCode) {
        case LEFT_ARROW:
            player.leftHeld = true;
            break;
        case RIGHT_ARROW:
            player.rightHeld = true;
            break;
    }
}

function keyReleased() {
    if (!checkFocus()) return;

    switch (key) {
        case " ":
            if (!creatingLines) {
                player.jumpHeld = false;
                player.jump();
            }
            break;
        case "R":
            if (creatingLines) {
                lines = [];
                linesString = "";
                mousePos1 = null;
                mousePos2 = null;
            }
            break;
        case "N":
            if (creatingLines) {
                levelNumber += 1;
                linesString += "\nlevels.push(tempLevel);";
                linesString += "\ntempLevel = new Level();";
                print(linesString);
                lines = [];
                linesString = "";
                mousePos1 = null;
                mousePos2 = null;
            }
            break;
        case "D":
            if (creatingLines) {
                mousePos1 = null;
                mousePos2 = null;
            }
    }

    switch (keyCode) {
        case LEFT_ARROW:
            player.leftHeld = false;
            break;
        case RIGHT_ARROW:
            player.rightHeld = false;
            break;
    }
}

let mousePos1 = null;
let mousePos2 = null;
let linesString = "";

function mouseClicked() {
    if (!checkFocus()) return;
    if (creatingLines) {
        let snappedX = mouseX - (mouseX % 20);
        let snappedY = mouseY - (mouseY % 20);
        if (mousePos1 == null) {
            mousePos1 = createVector(snappedX, snappedY);
        } else {
            mousePos2 = createVector(snappedX, snappedY);
            lines.push(new Line(mousePos1.x, mousePos1.y, mousePos2.x, mousePos2.y));
            linesString +=
                "\ntempLevel.lines.push(new Line(" +
                mousePos1.x +
                "," +
                mousePos1.y +
                "," +
                mousePos2.x +
                "," +
                mousePos2.y +
                "));";
            mousePos1 = null;
            mousePos2 = null;
        }
    } else if (placingPlayer && !playerPlaced) {
        playerPlaced = true;
        player.currentPos = createVector(mouseX, mouseY);
    }
}

function checkFocus() {
    if (!gameIsFocused) {
        if (document.activeElement === lastActiveElement) {
            stopMoving();
            return false;
        }
        console.log("Game refocused!");
        gameIsFocused = true;
    }

    return true;
}

function stopMoving() {
    player.leftHeld = false;
    player.rightHeld = false;
}

function showGame() {
    if (showingGame) return;

    allElements.forEach(id => {
        element = document.getElementById(id);
        element.disabled = true;
    });
    document.getElementById("canvas").classList.remove("hidden");

    showingGame = true;
}

window.addEventListener('keydown', (event) => {
    if (event.code === "Space" && event.target == document.body) {
        event.preventDefault();
    }
})