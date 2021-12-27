class Ball {
  /**
   *
   * @param {*} ctx : context of the canvas
   * @param {*} x : x position of ball object
   * @param {*} y : y position of ball object
   * @param {*} radius : radius of the ball object
   * @param {*} vx : speed of the ball object along x direction
   * @param {*} vy : speed of the ball object along y direction
   */
  constructor(ctx, x, y, radius, vx, vy) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = getRandomDirection();
    this.dy = getRandomDirection();
    this.vx = vx;
    this.vy = vy;
    this.colors = ['black', 'blue', 'pink'];
    this.color = this.getRandomColor();
  }

  /**
   * method to draw the ball object to the canvas
   */
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  /**
   * method to move the ball object
   */
  move() {
    this.checkCollisonBoundary();
    this.x += this.vx * this.dx;
    this.y += this.vy * this.dy;
    this.checkCollisionBalls();
  }

  /**
   * method to check collison of the ball to the boundary
   */
  checkCollisonBoundary() {
    if (this.x < this.radius || this.x > canvasWidth - this.radius) {
      this.dx = -this.dx;
      this.x += this.dx;
    }
    if (this.y < this.radius || this.y > canvasHeight - this.radius) {
      this.dy = -this.dy;
      this.y += this.dy;
    }
  }

  /**
   * method to check collison of ant object with other ant objects
   */
  checkCollisionBalls() {
    balls.forEach((ball) => {
      if (ball !== this) {
        let vectorCollision = { x: this.x - ball.x, y: this.y - ball.y };
        let distance = Math.sqrt(
          Math.pow(vectorCollision.x, 2) + Math.pow(vectorCollision.y, 2)
        );
        let length = this.radius + ball.radius;

        if (distance < this.radius + ball.radius) {
          this.dx = -this.dx;
          this.dy = -this.dy;
          this.x += (length - distance) * this.dx;
          this.y += (length - distance) * this.dy;
        }
      }
    });
  }

  /**
   * method to generate random colors
   */
  getRandomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }
}
