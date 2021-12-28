class Car {
  /**
   * constructor of player car
   * @param {*} ctx : context of the canvas
   * @param {*} carWidth : width of the car
   * @param {*} carHeight : height of the car
   */
  constructor(ctx, carWidth, carHeight) {
    this.ctx = ctx;
    this.carWidth = carWidth;
    this.carHeight = carHeight;
  }

  /**
   * method to draw the car
   */
  draw() {
    this.carPosX = carIndex * laneWidth + offsetPos;
    this.carPosY = canvasHeight - CAR_HEIGHT - 10;
    let img = new Image();
    img.src = './images/player_car.png';
    img.onload = () => {
      this.ctx.drawImage(
        img,
        this.carPosX,
        this.carPosY,
        this.carWidth,
        this.carHeight
      );
    };
  }
}
