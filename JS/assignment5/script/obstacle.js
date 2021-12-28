class Obstacle {
  /**
   * constructor of obstacle class
   * @param {*} ctx : context of the canvas
   * @param {*} obstacleWidth : width of the obstacle
   * @param {*} obstacleHeight : height of the obstacle
   * @param {*} index : index to determine which lane the car will be
   */
  constructor(ctx, obstacleWidth, obstacleHeight, index) {
    this.ctx = ctx;
    this.obstacleWidth = obstacleWidth;
    this.obstacleHeight = obstacleHeight;
    this.index = index;
    // this.speed = 5;
    this.obstaclePosY = getRandomValue(-100, -1200);
    console.log(obstacleList);
    obstacleList.forEach((obstacle) => {
      if (this !== obstacle) {
        if (this.index === obstacle.index) {
          this.index++;
        }
        if (
          Math.abs(this.obstaclePosY - obstacle.obstaclePosY) <
          2 * this.obstacleWidth
        ) {
          this.index++;
          this.obstaclePosY -= 2 * this.obstacleWidth;
        }
      }
    });
  }

  /**
   * method to draw the obstacle
   */
  draw() {
    this.obstaclePosX = this.index * laneWidth + offsetPos;

    let img = new Image();
    img.src = './images/obstacle_car.png';
    img.onload = () => {
      this.ctx.drawImage(
        img,
        this.obstaclePosX,
        this.obstaclePosY,
        this.obstacleWidth,
        this.obstacleHeight
      );
    };
  }

  /**method to move the obstacle */
  move() {
    this.obstaclePosY += speed;

    if (this.obstaclePosY > canvasHeight) {
      this.obstaclePosY = getRandomValue(-100, -800);
      this.index = getRandomValue(0, 2);
      obstacleList.forEach((obstacle) => {
        if (this !== obstacle) {
          if (this.index === obstacle.index) {
            this.index++;
          }
          if (
            Math.abs(this.obstaclePosY - obstacle.obstaclePosY) <
            2 * this.obstacleWidth
          ) {
            this.index++;
            this.obstaclePosY -= 2 * this.obstacleWidth;
          }
        }
      });

      score += 5;
    }
  }

  /**
   * methodt to detect collision with player car
   * @param {*} car : player car object
   */
  detectCollision(car) {
    if (
      this.obstaclePosX < car.carPosX + car.carWidth &&
      this.obstaclePosX + this.obstacleWidth > car.carPosX &&
      this.obstaclePosY < car.carPosY + car.carHeight &&
      this.obstacleHeight + this.obstaclePosY > car.carPosY
    ) {
      collision = true;
      speed = 0;
    }
  }

  /**
   * method to detect collision with bullets
   * @param {*} bullet : bullet object
   * @param {*} bulletPosX : x position of bullet object
   * @param {*} bulletPosY : y position of bullet object
   */
  detectBulletCollision(bullet, bulletPosX, bulletPosY) {
    if (
      this.obstaclePosX < bulletPosX + BULLET_WIDTH &&
      this.obstaclePosX + this.obstacleWidth > bulletPosX &&
      this.obstaclePosY < bulletPosY + BULLET_HEIGHT &&
      this.obstacleHeight + this.obstaclePosY > bulletPosY
    ) {
      console.log('collision detected');
      this.obstaclePosY = getRandomValue(-100, -500);
      throwBullet = false;
      bullet.setBulletPosY(canvasHeight - CAR_HEIGHT - BULLET_HEIGHT - 10);
    }
  }
}
