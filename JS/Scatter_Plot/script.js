let points = [
  { x: 10, y: 20 },
  { x: 40, y: 40 },
  { x: 60, y: 20 },
  { x: 100, y: 100 },
  { x: 200, y: 140 },
  { x: 300, y: 210 },
  { x: 115, y: 240 },
];

// Container for the points
let container = document.createElement("div");
document.body.appendChild(container);
container.style.width = "400px";
container.style.height = "400px";
container.style.border = "2px solid blue";
container.style.position = "relative";

points.forEach(function (value) {
  // Point element
  let point = document.createElement("div");
  container.appendChild(point);
  point.style.width = "10px";
  point.style.height = "10px";
  point.style.backgroundColor = "red";
  point.style.borderRadius = "50%";
  point.style.position = "absolute";
  point.style.bottom = value.y + "px";
  point.style.left = value.x + "px";

  // Delete points on click
  point.addEventListener("click", function (e) {
    container.removeChild(e.target);
  });
});
