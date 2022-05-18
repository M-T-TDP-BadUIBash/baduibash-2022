class Line {
  constructor(x1, y1, x2, y2, logLanding = false, linkedElement = null) {
      this.x1 = min(x1, x2);
      this.x2 = max(x1, x2);
      this.y1 = min(y1, y2);
      this.y2 = max(y1, y2);
      this.logLanding = logLanding;
      this.linkedElement = linkedElement;
      this.isHorizontal = y1 === y2;
      this.isVertical = x1 === x2;

      this.midPoint = createVector((x1 + x2) / 2, (y1 + y2) / 2);
  }

  show() {
      push();
      stroke(255, 0, 0);
      strokeWeight(3);
      line(this.x1, this.y1, this.x2, this.y2);
      ellipse(this.midPoint.x, this.midPoint.y, 10, 10);
      pop();
  }
}