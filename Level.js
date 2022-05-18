class Level {
  constructor() {
      this.levelImage = null;
      this.lines = [];
      this.levelNo = 0;
  }

  show() {
      push();
      image(this.levelImage, 0, 0);
      if (showingLines) {
          for (let l of lines) {
              l.show();
          }
      }

      pop();
  }
}