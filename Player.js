// Physics constants
const MIN_JUMP_SPEED = 5;
const MAX_JUMP_SPEED = 22;
const MAX_JUMP_TIMER = 30;
const JUMP_SPEED_HORIZONTAL = 8;
const TERMINAL_VELOCITY = 20;
const GRAVITY = 0.6;
const RUN_SPEED = 4;

let lastActiveElement = null;
let gameIsFocused = true;

class Player {
  constructor() {
    this.width = 50;
    this.height = 65;

    this.currentPos = createVector(width / 2, height - 200); // Player hitbox's top left corner
    this.currentSpeed = createVector(0, 0);
    this.isOnGround = false;

    this.jumpHeld = false;
    this.jumpTimer = 0;
    this.leftHeld = false;
    this.rightHeld = false;

    this.facingRight = true;
    this.hasBumped = false;
    this.isRunning = false;
    this.currentRunIndex = 1;
    this.runCycle = [
      run1Image,
      run1Image,
      run1Image,
      run1Image,
      run1Image,
      run1Image,
      run1Image,
      run1Image,
      run1Image,
      run1Image,
      run1Image,
      run1Image,
      run1Image,
      run2Image,
      run2Image,
      run2Image,
      run2Image,
      run2Image,
      run2Image,
      run3Image,
      run3Image,
      run3Image,
      run3Image,
      run3Image,
      run3Image,
      run3Image,
      run3Image,
      run3Image,
      run3Image,
      run3Image,
      run3Image,
      run3Image,
      run2Image,
      run2Image,
      run2Image,
      run2Image,
      run2Image,
      run2Image,
    ];

    this.currentLevelNo = 0;

    this.jumpStartingHeight = 0;
    this.hasFallen = false;
    this.previousSpeed = createVector(0, 0);
  }

  update() {
    let currentLines = levels[this.currentLevelNo].lines;
    this.applyGravity();
    this.updatePlayerRun(currentLines);
    this.currentPos.add(this.currentSpeed);
    this.previousSpeed = this.currentSpeed.copy();
    this.checkCollisions(currentLines);
    this.updateJumpTimer();
    this.checkForLevelChange();
  }

  applyGravity() {
    if (!this.isOnGround) {
      this.currentSpeed.y = min(
        this.currentSpeed.y + GRAVITY,
        TERMINAL_VELOCITY
      );
    }
  }

  checkCollisions(currentLines) {
    let collidedLines = [];
    for (let i = 0; i < currentLines.length; i++) {
      if (this.isCollidingWithLine(currentLines[i])) {
        collidedLines.push(currentLines[i]);
      }
    }

    let chosenLine = this.getPriorityCollision(collidedLines);

    let potentialLanding = false;
    if (chosenLine == null) return;

    if (chosenLine.logLanding) console.log(chosenLine);

    // For marked platforms, temporarily add an activeField class
    // and unfocus the game so the player can fill out the forms
    if (chosenLine.linkedElement != null) {
      const element = chosenLine.linkedElement;
      if (chosenLine.logLanding) console.log(element);

      element.disabled = false;
      element.value = "";
      element.classList.add("activeField");
      element.focus();
      gameIsFocused = false;
      lastActiveElement = element;
      checkFocus();
    } else if (lastActiveElement != null) {
      lastActiveElement.disabled = true;
      lastActiveElement.classList.remove("activeField");
    }

    if (chosenLine.isHorizontal) {
      if (this.isMovingDown()) {
        // Snap us back and avoid clipping
        this.currentPos.y = chosenLine.y1 - this.height;

        if (collidedLines.length > 1) {
          potentialLanding = true;
          this.currentSpeed = createVector(0, 0);
        } else {
          this.playerLanded();
        }
      } else {
        // Player has hit a roof
        this.currentSpeed.y = 0 - this.currentSpeed.y / 2;
        // Snap us back and avoid clipping
        this.currentPos.y = chosenLine.y1;
        bumpSound.playMode("sustain");
        bumpSound.play();
      }
    } else if (chosenLine.isVertical) {
      if (this.isMovingRight()) {
        this.currentPos.x = chosenLine.x1 - this.width;
      } else if (this.isMovingLeft()) {
        this.currentPos.x = chosenLine.x1;
      } else {
        // If the player isn't moving left or right, there was likely
        // a ground they collided with first that stopped their horizontal movement.
        if (this.previousSpeed.x > 0) {
          this.currentPos.x = chosenLine.x1 - this.width;
        } else {
          this.currentPos.x = chosenLine.x1;
        }
      }
      this.currentSpeed.x = 0 - this.currentSpeed.x / 2;
      if (!this.isOnGround) {
        this.hasBumped = true;
        bumpSound.playMode("sustain");
        bumpSound.play();
      }
    }
    if (collidedLines.length > 1) {
      this.checkCollisions(currentLines);

      // Safety check in case the last line collided didn't ground the player
      if (potentialLanding) {
        if (this.isPlayerOnGround(currentLines)) {
          this.playerLanded();
        }
      }
    }
  }

  show() {
    push();

    translate(this.currentPos.x, this.currentPos.y);

    let imageToUse = this.getImageToUseBasedOnState();

    if (!this.facingRight) {
      push();
      scale(-1, 1);
      if (this.hasBumped) {
        image(imageToUse, -70, -30);
      } else if (imageToUse == jumpImage || imageToUse == fallImage) {
        image(imageToUse, -70, -28);
      } else {
        image(imageToUse, -70, -35);
      }
      pop();
    } else {
      if (this.hasBumped) {
        image(imageToUse, -20, -30);
      } else if (imageToUse == jumpImage || imageToUse == fallImage) {
        image(imageToUse, -20, -28);
      } else {
        image(imageToUse, -20, -35);
      }
    }
    pop();
  }

  jump() {
    if (!this.isOnGround) {
      return;
    }

    let verticalJumpSpeed = map(
      this.jumpTimer,
      0,
      MAX_JUMP_TIMER,
      MIN_JUMP_SPEED,
      MAX_JUMP_SPEED
    );
    if (this.leftHeld) {
      this.currentSpeed = createVector(
        -JUMP_SPEED_HORIZONTAL,
        -verticalJumpSpeed
      );
      this.facingRight = false;
    } else if (this.rightHeld) {
      this.currentSpeed = createVector(
        JUMP_SPEED_HORIZONTAL,
        -verticalJumpSpeed
      );
      this.facingRight = true;
    } else {
      this.currentSpeed = createVector(0, -verticalJumpSpeed);
    }
    this.hasFallen = false;
    this.isOnGround = false;
    this.jumpTimer = 0;
    this.jumpStartingHeight =
      height - this.currentPos.y + height * this.currentLevelNo;
    jumpSound.playMode("sustain");
    jumpSound.play();
  }

  isCollidingWithLine(l) {
    if (l.isHorizontal) {
      var isRectWithinLineX =
        (l.x1 < this.currentPos.x && this.currentPos.x < l.x2) ||
        (l.x1 < this.currentPos.x + this.width &&
          this.currentPos.x + this.width < l.x2) ||
        (this.currentPos.x < l.x1 && l.x1 < this.currentPos.x + this.width) ||
        (this.currentPos.x < l.x2 && l.x2 < this.currentPos.x + this.width);
      var isRectWithinLineY =
        this.currentPos.y < l.y1 && l.y1 < this.currentPos.y + this.height;
      return isRectWithinLineX && isRectWithinLineY;
    } else if (l.isVertical) {
      isRectWithinLineY =
        (l.y1 < this.currentPos.y && this.currentPos.y < l.y2) ||
        (l.y1 < this.currentPos.y + this.height &&
          this.currentPos.y + this.height < l.y2) ||
        (this.currentPos.y < l.y1 && l.y1 < this.currentPos.y + this.height) ||
        (this.currentPos.y < l.y2 && l.y2 < this.currentPos.y + this.height);
      isRectWithinLineX =
        this.currentPos.x < l.x1 && l.x1 < this.currentPos.x + this.width;
      return isRectWithinLineX && isRectWithinLineY;
    }
  }

  updateJumpTimer() {
    if (this.isOnGround && this.jumpHeld && this.jumpTimer < MAX_JUMP_TIMER) {
      this.jumpTimer += 1;
    }
  }

  isMovingUp() {
    return this.currentSpeed.y < 0;
  }

  isMovingDown() {
    return this.currentSpeed.y > 0;
  }

  isMovingLeft() {
    return this.currentSpeed.x < 0;
  }

  isMovingRight() {
    return this.currentSpeed.x > 0;
  }

  getImageToUseBasedOnState() {
    if (this.jumpHeld && this.isOnGround) return squatImage;
    if (this.hasFallen) return fallenImage;
    if (this.hasBumped) return oofImage;
    if (this.currentSpeed.y < 0) return jumpImage;
    if (this.isRunning) {
      this.currentRunIndex += 1;
      if (this.currentRunIndex >= this.runCycle.length)
        this.currentRunIndex = 0;
      return this.runCycle[this.currentRunIndex];
    }

    if (this.isOnGround) return idleImage;
    return fallImage;
  }

  updatePlayerRun(currentLines) {
    this.isRunning = false;
    if (this.isOnGround) {
      if (!this.isPlayerOnGround(currentLines)) {
        this.isOnGround = false;
        return;
      }
      if (!this.jumpHeld) {
        if (this.rightHeld) {
          this.hasFallen = false;
          this.isRunning = true;
          this.facingRight = true;
          this.currentSpeed = createVector(RUN_SPEED, 0);
        } else if (this.leftHeld) {
          this.hasFallen = false;
          this.isRunning = true;
          this.facingRight = false;
          this.currentSpeed = createVector(-RUN_SPEED, 0);
        } else {
          this.currentSpeed = createVector(0, 0);
        }
      } else {
        this.currentSpeed = createVector(0, 0);
      }
    }
  }

  isPlayerOnGround(currentLines) {
    this.currentPos.y += 1;
    for (let i = 0; i < currentLines.length; i++) {
      if (
        currentLines[i].isHorizontal &&
        this.isCollidingWithLine(currentLines[i])
      ) {
        this.currentPos.y -= 1;
        return true;
      }
    }
    this.currentPos.y -= 1;
    return false;
  }

  getPriorityCollision(collidedLines) {
    if (collidedLines.length === 2) {
      // Check that we're actually colliding with BOTH a horizontal and a vertical line
      // (a single line cannot be both in this implementation)
      let vert = null;
      let horiz = null;
      if (collidedLines[0].isVertical) vert = collidedLines[0];
      if (collidedLines[0].isHorizontal) horiz = collidedLines[0];
      if (collidedLines[1].isVertical) vert = collidedLines[1];
      if (collidedLines[1].isHorizontal) horiz = collidedLines[1];

      // Prioritize vertical line when the midpoint of it is lower.
      // If its midpoint is lower, then our character hasn't actually made it on top of the horizontal line.
      if (vert != null && horiz != null) {
        if (this.isMovingUp()) {
          if (vert.midPoint.y > horiz.midPoint.y) {
            return vert;
          }
        }
      }
    }

    // check the inverse of the velocity to see if the corrections fit in the range
    let maxAllowedXCorrection = 0 - this.currentSpeed.x;
    let maxAllowedYCorrection = 0 - this.currentSpeed.y;

    //if multiple collisions detected use the one that requires the least correction

    let minCorrection = 10000;

    let chosenLine = null;
    if (collidedLines.length === 0) return null;

    chosenLine = collidedLines[0];

    if (collidedLines.length > 1) {
      for (let l of collidedLines) {
        let directedCorrection = createVector(0, 0);
        let correction = 10000;
        if (l.isHorizontal) {
          if (this.isMovingDown()) {
            directedCorrection.y = l.y1 - (this.currentPos.y + this.height);

            correction = abs(directedCorrection);
            correction = abs(this.currentPos.y - (l.y1 - this.height));
          } else {
            // if moving up then we've hit a roof and we bounce off
            directedCorrection.y = l.y1 - this.currentPos.y;
            correction = abs(this.currentPos.y - l.y1);
          }
        } else if (l.isVertical) {
          if (this.isMovingRight()) {
            directedCorrection.x = l.x1 - (this.currentPos.x + this.width);
            correction = abs(this.currentPos.x - (l.x1 - this.width));
          } else {
            directedCorrection.x = l.x1 - this.currentPos.x;

            correction = abs(this.currentPos.x - l.x1);
          }
        }

        if (
          isBetween(directedCorrection.x, 0, maxAllowedXCorrection) &&
          isBetween(directedCorrection.y, 0, maxAllowedYCorrection)
        ) {
          if (correction < minCorrection) {
            minCorrection = correction;
            chosenLine = l;
          }
        }
      }
    }
    return chosenLine;
  }

  // If the player's position is off the screen, we've changed levels
  checkForLevelChange() {
    if (this.currentPos.y < -this.height) {
      this.currentLevelNo += 1;
      this.currentPos.y += height;
    } else if (this.currentPos.y > height - this.height) {
      this.currentLevelNo -= 1;
      this.currentPos.y -= height;
    }
  }

  playerLanded() {
    this.isOnGround = true;
    this.currentSpeed = createVector(0, 0);

    this.hasBumped = false;

    if (
      this.jumpStartingHeight - height / 2 >
      height - this.currentPos.y + height * this.currentLevelNo
    ) {
      this.hasFallen = true;
    }

    if (this.hasFallen) {
      fallSound.playMode("sustain");
      fallSound.play();
    } else {
      landSound.playMode("sustain");
      landSound.play();
    }
  }
}

function checkLinesColliding(x1, y1, x2, y2, x3, y3, x4, y4) {
  let uA =
    ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  let uB =
    ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    let intersectionX = x1 + uA * (x2 - x1);
    let intersectionY = y1 + uA * (y2 - y1);
    return [true, intersectionX, intersectionY];
  }
  return [false, 0, 0];
}

function isBetween(a, b1, b2) {
  return (b1 <= a && a <= b2) || (b2 <= a && a <= b1);
}
