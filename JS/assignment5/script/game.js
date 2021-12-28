const canvas = document.getElementById('myCanvas');
const startScreenWrapper = document.getElementById('startScreenWrapper');
const playButton = document.getElementById('playButton');
const startScreen = document.getElementById('startScreen');
const endScreen = document.getElementById('endScreen');
const scorePragraph = document.getElementById('scorePragraph');

const canvasWidth = '500';
const canvasHeight = '748';
const laneWidth = canvasWidth / 3;
const offsetPos = 50;
let carIndex = 0;
let obstacleIndex = 0;
let obstacleList = [];

let speed = 5;
let prevScore = 0;
let score = 0;

const CAR_WIDTH = 70;
const CAR_HEIGHT = 100;

const BULLET_WIDTH = 30;
const BULLET_HEIGHT = 30;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let collision = false;
let throwBullet = false;

let counter = 0;

class Game {
  /**
   * constructor of Game class
   * @param {*} canvas : canvas to draw
   */
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.road = new Road(this.ctx, canvasWidth, canvasHeight);
    this.player = new Car(this.ctx, CAR_WIDTH, CAR_HEIGHT);
    this.bullet = new Bullet(this.ctx, BULLET_WIDTH, BULLET_HEIGHT);
    this.render();
  }

  /**
   * method to generate obstacles
   */
  generateObstacles() {
    for (let i = 0; i < 2; i++) {
      obstacleIndex = getRandomValue(0, 2);
      this.obstacle = new Obstacle(
        this.ctx,
        CAR_WIDTH,
        CAR_HEIGHT,
        obstacleIndex
      );

      obstacleList.push(this.obstacle);
    }
  }

  /**
   * method to update each component of the game
   */
  update() {
    this.road.draw();
    this.player.draw();
    obstacleList.forEach((obstacle) => {
      obstacle.draw();
      obstacle.move();
      obstacle.detectCollision(this.player);
    });
    this.drawScore();
    this.drawTimer();

    //increases the speed for every 20 score increase
    if (score - prevScore > 20) {
      speed += 2;
      prevScore = score;
    }

    //shows end screen if the collision between car has happened
    if (collision === true) {
      cancelAnimationFrame(this.update.bind(this));
      this.showEndScreen();
    }

    // throws bullet if throwBullet variable is true
    if (throwBullet === true) {
      let bulletPosX = this.bullet.getBulletPosX();
      let bulletPosY = this.bullet.getBulletPosY();
      obstacleList.forEach((obstacle) => {
        obstacle.detectBulletCollision(this.bullet, bulletPosX, bulletPosY);
      });
      this.bullet.draw();
      this.bullet.move();
    }

    requestAnimationFrame(this.update.bind(this));
  }

  /**
   * method to show score in screen
   */
  drawScore() {
    this.ctx.font = '40px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('' + score, canvasWidth / 2, 60);
  }

  /**
   * method to show timer of bullet cooldown
   */
  drawTimer() {
    if (counter !== 0) {
      this.ctx.font = '20px Arial';
      this.ctx.fillStyle = 'white';
      this.ctx.fillText('Cooldown: ' + counter, canvasWidth / 2 - 50, 90);
    }
  }

  /**
   * method to show end screen
   */
  showEndScreen() {
    startScreenWrapper.style.display = 'block';
    canvas.style.display = 'none';
    startScreen.style.display = 'none';
    endScreen.style.display = 'block';
    scorePragraph.innerHTML = 'Score: ' + score;
  }

  /**
   * method to render the game
   */
  render() {
    this.generateObstacles();
    this.update();
  }
}

/**
 * starts the game when play button is clicked
 */
playButton.addEventListener('click', () => {
  startScreenWrapper.style.display = 'none';
  canvas.style.display = 'block';
  new Game(canvas);
});
