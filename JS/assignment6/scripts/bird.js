class Bird {
  /**
   * constructor of bird class
   * @param {*} ctx : context of canvas
   * @param {*} width : bird width
   * @param {*} height : bird height
   * @param {*} posX : x position of bird in canvas
   * @param {*} posY : y position of bird in canvas
   */
  constructor(ctx, width, height, posX, posY) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.posX = posX;
    this.posY = posY;
    this.rotation = 45;
    this.birdList = [];
    this.fallSpeed = 0;
    this.index = 0;
  }

  /**
   * method to draw the bird object
   */
  draw() {
    let bird1 = new Image();
    bird1.src = './images/bird-1.png';
    this.birdList.push(bird1);

    let bird2 = new Image();
    bird2.src = './images/bird-2.png';
    this.birdList.push(bird2);

    let bird3 = new Image();
    bird3.src = './images/bird-3.png';
    this.birdList.push(bird3);

    if (frame % 10 == 0) {
      this.index++;
      if (this.index > 2) {
        this.index = 0;
      }
    }

    this.ctx.drawImage(
      this.birdList[this.index],
      this.posX,
      this.posY,
      this.width,
      this.height
    );
  }

  /**
   * method that makes the bird fall downward
   */
  fall() {
    this.fallSpeed += GRAVITY;
    this.posY += this.fallSpeed;
  }

  /**
   * method to make the bird jump
   */
  jump() {
    this.fallSpeed = ANTIGRAVITY;
  }

  /**
   * method to detect collision witn the top and bottom boundary
   */
  detectCollisionBoundary() {
    if (this.posY > BACKGROUND_HEIGHT - BIRD_HEIGHT || this.posY < 0) {
      collision = true;
      gameSpeed = 0;
      endState = true;
    }
  }
}
