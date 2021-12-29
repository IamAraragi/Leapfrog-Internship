class Background {
  /**
   * constructor of background class
   * @param {*} ctx : context of canvas
   * @param {*} width : background width
   * @param {*} height : background height
   * @param {*} posX : x position of background in canvas
   * @param {*} posY : y position of background in canvas
   */
  constructor(ctx, width, height, posX, posY) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.posX = posX;
    this.posY = posY;
  }

  /**
   * method to draw the background
   */
  draw() {
    let img = new Image();
    img.src = './images/background.png';
    img.onload = () => {
      this.ctx.drawImage(img, this.posX, this.posY, this.width, this.height);
    };

    let groundImg = new Image();
    groundImg.src = './images/ground.png';
    groundImg.onload = () => {
      this.ctx.drawImage(
        groundImg,
        this.posX,
        BACKGROUND_HEIGHT,
        GROUND_WIDTH,
        GROUND_HEIGHT
      );
    };
  }
}
