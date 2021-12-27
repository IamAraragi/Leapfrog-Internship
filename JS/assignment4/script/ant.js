class Ant {
  /**
   *
   * @param {*} ctx : context of the canvas
   * @param {*} x : x position of ant object
   * @param {*} y : y position of ant object
   * @param {*} radius : radius of the ant object
   * @param {*} speed : speed of the ant object
   */
  constructor(ctx, x, y, radius, speed) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.width = 2 * this.radius;
    this.height = 2 * this.radius;
    this.dx = getRandomDirection();
    this.dy = getRandomDirection();
    this.speed = speed;
  }

  /**
   * method to draw the ant object to the canvas
   */
  draw() {
    let img = new Image();
    img.src = './images/ant.png';
    this.ctx.drawImage(img, this.x, this.y, this.width, this.height);
  }

  /**
   * method to move the ant object
   */
  move() {
    this.x += this.speed * this.dx;
    this.y += this.speed * this.dy;
    this.checkCollisonBoundary();
  }

  /**
   * method to check collison of the ant to the boundary
   */
  checkCollisonBoundary() {
    if (this.x < 0 || this.x > canvasWidth - this.width) {
      this.dx = -this.dx;
      this.x += this.speed * this.dx;
    }
    if (this.y < 0 || this.y > canvasHeight - this.height) {
      this.dy = -this.dy;
      this.y += this.speed * this.dy;
    }
  }

  /**
   * method to check collison of ant object with other ant objects
   */
  checkCollisionAnts() {
    ants.forEach((ant) => {
      if (ant !== this) {
        let vectorCollision = { x: this.x - ant.x, y: this.y - ant.y };
        let distance = Math.sqrt(
          Math.pow(vectorCollision.x, 2) + Math.pow(vectorCollision.y, 2)
        );
        let length = this.radius + ant.radius;

        if (distance < this.radius + ant.radius) {
          this.dx = -this.dx;
          this.dy = -this.dy;
          this.x += (length - distance) * this.dx;
          this.y += (length - distance) * this.dy;
        }
      }
    });
  }
}
