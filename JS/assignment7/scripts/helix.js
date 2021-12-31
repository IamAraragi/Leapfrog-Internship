const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

CANVAS_WIDTH = 400;
CANVAS_HEIGHT = 400;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const NO_OF_ROWS = 10;
const NO_OF_COLUMNS = 15;
const SPEED = 0.02;
const MAX_RADIUS = 7;

let frame = 0;

/**
 * function to draw helix animation
 */
function drawHelix() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let strand1PosX = 70;
  let strand2PosX = 70;
  let posY = 0;
  frame++;
  let phase = frame * SPEED;

  // for first stand of circles
  for (let col = 0; col < NO_OF_COLUMNS; col++) {
    strand1PosX += 15;
    let colGap = (col * Math.PI) / 10;

    for (let row = 0; row < NO_OF_ROWS; row++) {
      // calculates the posY of the circles which depends on the row no and phase
      posY = 150 + row * 10 + Math.sin(phase + colGap) * 40;
      // calculates radius difference which changes the radius
      let radiusDifference = (Math.cos(phase - row * 0.1 + colGap) + 1) * 0.5;
      let radius = radiusDifference * MAX_RADIUS;
      drawCircle(strand1PosX, posY, radius, row);
    }
  }

  // for second strand of circles
  for (let col = 0; col < NO_OF_COLUMNS; col++) {
    strand2PosX += 15;
    let colGap = (col * Math.PI) / 10;

    for (let row = 0; row < NO_OF_ROWS; row++) {
      posY = 150 + row * 10 + Math.sin(phase + Math.PI + colGap) * 40;
      let radiusDifference =
        (Math.cos(phase + Math.PI - row * 0.1 + colGap) + 1) * 0.5;
      let radius = radiusDifference * MAX_RADIUS;
      drawCircle(strand2PosX, posY, radius, row);
    }
  }

  requestAnimationFrame(drawHelix);
}

/**
 * function to draw the circle
 * @param {*} posX : x position of the circle
 * @param {*} posY : y position of the circle
 * @param {*} radius : radius of the circle
 * @param {*} row : row number of the circle
 */
function drawCircle(posX, posY, radius, row) {
  ctx.beginPath();
  ctx.arc(posX, posY, radius, 0, Math.PI * 2);
  let greenValue = 140 - (row + 1) * 2;
  ctx.fillStyle = 'rgb(255, ' + greenValue + ', 0)';
  ctx.fill();
  ctx.closePath();
}

drawHelix();
