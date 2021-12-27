const canvas = document.getElementById('myCanvas');
const canvasWidth = document.body.clientWidth;
const canvasHeight = document.body.clientHeight;

const BALL_COUNT = 1000;
let balls = [];

class BallCollision {
  /**
   * constructor of AntSmasher class
   * @param {*} canvas : canvas to render ant smasher
   * @param {*} canvasWidth : width of the canvas
   * @param {*} canvasHeight : height of the canvas
   * @param {*} BALL_COUNT : number of balls
   */
  constructor(canvas, canvasWidth, canvasHeight, BALL_COUNT) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.BALL_COUNT = BALL_COUNT;

    this.render();
  }

  /**
   * method to generate balls using Ball class
   */
  generateBalls() {
    for (let i = 0; i < BALL_COUNT; i++) {
      let radius = getRandomValue(5, 10);
      let posX = getRandomValue(radius, this.canvasWidth - radius);
      let posY = getRandomValue(radius, this.canvasHeight - radius);
      let vx = getRandomValue(1, 2);
      let vy = getRandomValue(1, 2);
      const ball = new Ball(this.ctx, posX, posY, radius, vx, vy);
      balls.push(ball);
    }
  }

  /**
   * method to update the canvas frame
   */
  update() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    balls.forEach((ball) => {
      ball.draw();
      ball.move();
    });

    requestAnimationFrame(this.update.bind(this));
  }

  /**
   * method to render the Ball Collision game
   */
  render() {
    this.generateBalls();
    this.update();
  }
}

let ballCollision = new BallCollision(
  canvas,
  canvasWidth,
  canvasHeight,
  BALL_COUNT
);
