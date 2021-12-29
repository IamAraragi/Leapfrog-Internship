// let backgroundPosX = 0;
// let backGroundPosY = 0;

pipeList = [];

class Game {
  /**
   * constructor for game class
   * @param {*} ctx : context of canvas
   */
  constructor(ctx) {
    this.ctx = ctx;
    this.reset();
  }

  /**
   * method to reset background, pipe and bird object
   */
  reset() {
    this.background = new Background(
      this.ctx,
      BACKGROUND_WIDTH,
      BACKGROUND_HEIGHT,
      BACKGROUND_POSX,
      BACKGROUND_POSY
    );
    this.generatePipe();
    this.bird = new Bird(
      this.ctx,
      BIRD_WIDTH,
      BIRD_HEIGHT,
      BIRD_POSX,
      BIRD_POSY
    );
  }

  /**
   * method to generate pipe
   */
  generatePipe() {
    let pipePosX = 400;
    let pipeHeight = getRandomValue(200, 350);
    let pipe = new Pipe(
      this.ctx,
      PIPE_WIDTH,
      pipeHeight,
      pipePosX,
      PIPE_POSY,
      PIPE_GAP
    );
    pipePosX += 250;
    pipeList.push(pipe);
  }

  /**
   * method to draw the game
   */
  draw() {
    this.background.draw();
    // shows start screen if startState is true
    if (startState === true) {
      drawStartScreen();
    } else {
      // shows end screen if endState is true
      if (endState === true) {
        drawEndScreen();
      }

      frame++;
      if (frame > 30) {
        frame = 0;
      }

      pipeList.forEach((pipe) => {
        pipe.draw();
        pipe.move();
        pipe.checkCollision(this.bird);
        if (pipe.check === false) {
          //generates new pipe when the old pipe is at 200 position x
          if (pipe.posX < 200) {
            let pipeHeight = getRandomValue(200, 350);
            let newPipe = new Pipe(
              this.ctx,
              PIPE_WIDTH,
              pipeHeight,
              CANVAS_WIDTH,
              PIPE_POSY,
              PIPE_GAP
            );
            pipeList.push(newPipe);
            pipe.check = true;
          }
        }
      });
      this.drawScore();
      this.bird.draw();
      this.bird.detectCollisionBoundary();
      if (collision === false) {
        this.bird.fall();
      }
    }

    increaseSpeed();
  }

  /**
   * method to draw score
   */
  drawScore() {
    this.ctx.font = '40px Arial';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText('' + score, 250, 40);
  }
}
