class Road {
  constructor(ctx, roadWidth, roadHeight) {
    this.ctx = ctx;
    this.roadWidth = roadWidth;
    this.roadHeight = roadHeight;
    this.roadPosX = 0;
    this.roadPosY = 0;
    this.speed = 5;
  }

  draw() {
    let img = new Image();
    img.src = './images/road_vertical.png';
    img.onload = () => {
      this.ctx.drawImage(
        img,
        this.roadPosX,
        this.roadPosY,
        this.roadWidth,
        this.roadHeight
      );
      this.ctx.drawImage(
        img,
        this.roadPosX,
        this.roadPosY - this.roadHeight,
        this.roadWidth,
        this.roadHeight
      );
    };
    this.roadPosY += speed;

    if (this.roadPosY > this.roadHeight) {
      this.roadPosY = 0;
    }
  }
}
