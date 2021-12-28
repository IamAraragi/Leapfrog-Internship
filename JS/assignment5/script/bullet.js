class Bullet {
  /**
   * constructor of bullet class
   * @param {*} ctx : context of the canvas
   * @param {*} bulletWidth : width of the bullet
   * @param {*} bulletHeight : height of the bullet
   */
  constructor(ctx, bulletWidth, bulletHeight) {
    this.ctx = ctx;
    this.bulletWidth = bulletWidth;
    this.bulletHeight = bulletHeight;
    this.bulletPosX = 0;
    this.bulletPosY = canvasHeight - CAR_HEIGHT - this.bulletHeight - 10;
  }

  /**
   * method to draw the bullet
   */
  draw() {
    this.bulletPosX = carIndex * laneWidth + offsetPos + CAR_WIDTH / 2;
    let img = new Image();
    img.src = './images/bullet.png';
    img.onload = () => {
      this.ctx.drawImage(
        img,
        this.bulletPosX,
        this.bulletPosY,
        this.bulletWidth,
        this.bulletHeight
      );
    };
  }

  /**
   * method to move the bullet
   */
  move() {
    this.bulletPosY -= speed;
    if (this.bulletPosY < 0) {
      throwBullet = false;
      this.setBulletPosY(canvasHeight - CAR_HEIGHT - BULLET_HEIGHT - 10);
    }
  }

  //getters
  getBulletPosX() {
    return this.bulletPosX;
  }

  getBulletPosY() {
    return this.bulletPosY;
  }

  // setters
  setBulletPosY(value) {
    this.bulletPosY = value;
  }
}
