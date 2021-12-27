const canvas = document.getElementById('myCanvas');
const canvasWidth = document.body.clientWidth;
const canvasHeight = document.body.clientHeight;

const ANT_COUNT = 15;
let score = 0;
let ants = [];

class AntSmasher {
  /**
   * constructor of AntSmasher class
   * @param {*} canvas : canvas to render ant smasher
   * @param {*} canvasWidth : width of the canvas
   * @param {*} canvasHeight : height of the canvas
   * @param {*} ANT_COUNT : number of ants
   */
  constructor(canvas, canvasWidth, canvasHeight, ANT_COUNT) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.ANT_COUNT = ANT_COUNT;

    this.render();
  }

  /**
   * method to generate ants using Ant class
   */
  generateAnts() {
    for (let i = 0; i < ANT_COUNT; i++) {
      let radius = getRandomValue(15, 25);
      let posX = getRandomValue(2 * radius, this.canvasWidth - 2 * radius);
      let posY = getRandomValue(2 * radius, this.canvasHeight - 2 * radius);
      let speed = getRandomValue(1, 2);
      const ant = new Ant(this.ctx, posX, posY, radius, speed);
      ants.push(ant);
    }
  }

  /**
   * method to update the canvas frame
   */
  update() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawScore();
    ants.forEach((ant) => {
      ant.draw();
      ant.move();
      ant.checkCollisionAnts();
    });

    requestAnimationFrame(this.update.bind(this));
  }

  /**
   * method to keep track of the score
   */
  drawScore() {
    this.ctx.font = '16px Arial';
    this.ctx.fillStyle = '#0095DD';
    this.ctx.fillText('Score: ' + score, 8, 20);
  }

  /**
   * method to render the Ant smasher game
   */
  render() {
    this.generateAnts();
    this.update();
    this.drawScore();
  }
}

let antSmasher = new AntSmasher(canvas, canvasWidth, canvasHeight, ANT_COUNT);

/**
 * on click event handler to smash the ants
 * @param {*} event : click event
 */
canvas.onclick = (event) => {
  mousePosX = event.clientX;
  mousePosY = event.clientY;

  ants.forEach((ant, index) => {
    if (
      mousePosX <= ant.x + ant.width &&
      mousePosX >= ant.x &&
      mousePosY <= ant.y + ant.height &&
      mousePosY >= ant.y
    ) {
      ants.splice(index, 1);
      score++;
    }
  });
};
