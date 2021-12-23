// Box for ball to bounce

let container = document.createElement("div");
document.body.appendChild(container);
container.setAttribute("id", "container");
container.style.width = "400px";
container.style.height = "400px";
container.style.border = "2px solid red";
container.style.position = "relative";

//Ball
let ball = document.createElement("div");
container.appendChild(ball);
ball.style.width = "40px";
ball.style.height = "40px";
ball.style.backgroundColor = "#49c";
ball.style.borderRadius = "50%";
ball.style.position = "absolute";
ball.style.left = "50%";
ball.style.transform = "translate(-50%, 0)";

let y = 0;
let speed = 2;
let containerHeight = container.clientHeight;
let ballHeight = ball.clientHeight;

// Collison mechanism
setInterval(() => {
  y = y + speed;
  const topValue = y + "px";
  ball.style.top = topValue;
  if (y <= 0 || y > containerHeight - ballHeight) {
    speed = -speed;
  }
}, 10);
