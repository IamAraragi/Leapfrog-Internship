class Pipe {
  /**
   * constructor of pipe class
   * @param {*} ctx : context of canvas
   * @param {*} width : pipe width
   * @param {*} height : pipe height
   * @param {*} posX : x position of pipe in canvas
   * @param {*} posY : y position of pipe in canvas
   */
  constructor(ctx, width, height, posX, posY, gap) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.posX = posX;
    this.posY = posY;
    this.gap = gap;
    this.check = false;
  }

  /**
   * method to draw top and bottom pipes
   */
  draw() {
    let topPipeImg = new Image();
    topPipeImg.src = './images/pipe-top.png';
    topPipeImg.onload = () => {
      this.ctx.drawImage(
        topPipeImg,
        this.posX,
        this.posY,
        this.width,
        this.height
      );
    };

    let bottomPipeImg = new Image();
    bottomPipeImg.src = './images/pipe-bottom.png';
    bottomPipeImg.onload = () => {
      this.ctx.drawImage(
        bottomPipeImg,
        this.posX,
        this.height + this.gap,
        this.width,
        BACKGROUND_HEIGHT - this.height - this.gap
      );
    };
  }

  /**
   * method to move the pipes
   */
  move() {
    this.posX -= gameSpeed;

    if (this.posX + this.width < 0) {
      pipeList.shift();
      score++;
    }
  }

  /**
   * method to check collision with bird
   * @param {*} bird : bird object
   */
  checkCollision(bird) {
    if (
      bird.posX + bird.width >= this.posX &&
      bird.posX <= this.posX + this.width &&
      (bird.posY <= this.posY + this.height ||
        bird.posY + bird.height >= this.posY + this.height + this.gap)
    ) {
      collision = true;
      gameSpeed = 0;
      endState = true;
    }
  }
}
