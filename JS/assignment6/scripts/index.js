let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let startState = true;
let endState = false;

let collision = false;
let gameSpeed = 2;
let frame = 0;
let prevScore = 0;
let score = 0;
let highScore = 0;

let game = new Game(ctx);

/**
 * function to draw start screen
 */
function drawStartScreen() {
  let gameTitle = new Image();
  gameTitle.src = './images/game-title.png';

  let playButton = new Image();
  playButton.src = './images/play-button.png';

  ctx.drawImage(gameTitle, 90, 200, 300, 100);

  ctx.drawImage(
    playButton,
    PLAY_BUTTON_POSX,
    PLAY_BUTTON_POSY,
    PLAY_BUTTON_WIDTH,
    PLAY_BUTTON_HEIGHT
  );

  //even listener that starts the game when play button is clicked
  canvas.addEventListener('click', (event) => {
    let mouseX = event.clientX - canvas.getBoundingClientRect().x;
    let mouseY = event.clientY - canvas.getBoundingClientRect().y;

    if (
      mouseX <= PLAY_BUTTON_POSX + PLAY_BUTTON_WIDTH &&
      mouseX >= PLAY_BUTTON_POSX &&
      mouseY <= PLAY_BUTTON_POSY + PLAY_BUTTON_HEIGHT &&
      mouseY >= PLAY_BUTTON_POSY
    ) {
      startState = false;
    }
  });
}

/**
 * function to draw end screen
 */
function drawEndScreen() {
  let highScore = localStorage.getItem('highScore');

  if (highScore !== null) {
    if (score > highScore) {
      localStorage.setItem('highScore', score);
    }
  } else {
    localStorage.setItem('highScore', score);
  }

  let gameOver = new Image();
  gameOver.src = './images/game-over.png';

  let scoreTable = new Image();
  scoreTable.src = './images/score-table.png';

  let replayButton = new Image();
  replayButton.src = './images/play-button.png';

  ctx.drawImage(gameOver, 90, 150, 300, 100);

  ctx.drawImage(scoreTable, 90, 300, 300, 150);

  ctx.font = '32px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('' + score, 325, 370);

  ctx.drawImage(
    replayButton,
    REPLAY_BUTTON_POSX,
    REPLAY_BUTTON_POSY,
    REPLAY_BUTTON_WIDTH,
    REPLAY_BUTTON_HEIGHT
  );

  ctx.font = '32px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('' + highScore, 325, 425);

  drawMedal();

  //resets the game when replay button is clicked
  canvas.addEventListener('click', (event) => {
    let mouseX = event.clientX - canvas.getBoundingClientRect().x;
    let mouseY = event.clientY - canvas.getBoundingClientRect().y;

    if (
      mouseX <= REPLAY_BUTTON_POSX + REPLAY_BUTTON_WIDTH &&
      mouseX >= REPLAY_BUTTON_POSX &&
      mouseY <= REPLAY_BUTTON_POSY + REPLAY_BUTTON_HEIGHT &&
      mouseY >= REPLAY_BUTTON_POSY
    ) {
      gameSpeed = 2;
      score = 0;
      prevScore = 0;
      pipeList = [];
      game.reset();
      endState = false;
      collision = false;
    }
  });
}

// function to show medal in end screen
function drawMedal() {
  if (score <= 5) {
    let medalImg = new Image();
    medalImg.src = './images/no-medal.png';
    ctx.drawImage(medalImg, 125, 355, 60, 60);
  } else if (score <= 10) {
    let bronzeImg = new Image();
    bronzeImg.src = './images/bronze-medal.png';
    ctx.drawImage(bronzeImg, 125, 355, 60, 60);
  } else if (score <= 15) {
    let silverImg = new Image();
    silverImg.src = './images/silver-medal.png';
    ctx.drawImage(silverImg, 125, 355, 60, 60);
  } else {
    let goldImg = new Image();
    goldImg.src = './images/gold-medal.png';
    ctx.drawImage(goldImg, 125, 355, 60, 60);
  }
}

/**
 * function to increase the spedd for every 5 score increase
 */
function increaseSpeed() {
  if (score - prevScore > 5) {
    gameSpeed += 0.5;
    prevScore = score;
  }
}

/**
 * main game loop
 */
function gameLoop() {
  game.draw();

  requestAnimationFrame(gameLoop);
}

/**
 * event listener to make the bird jump when space is clicked
 */
document.addEventListener('keydown', (event) => {
  console.log('a');
  if (event.code == 'Space') {
    game.bird.jump();
  }
});

gameLoop();
