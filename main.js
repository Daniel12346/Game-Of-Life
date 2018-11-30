//the canvas variable is declared in order to resize it
//using the size slider
const canvas = document.querySelector(".game__canvas");
//the canvas context
const ctx = canvas.getContext("2d");
//the color all the live cells will be
ctx.fillStyle = "rgba(255,255,0,1)";
const genCounter = document.querySelector(".game__genCount");
const sizeSlider = document.querySelector(".slider--size");
const cellSlider = document.querySelector(".slider--cells");

//instantiating the game
//using "let" because its value will change on restart
let game = new Game();

//this flag is used to pause or continue to simulation
let isRunning = false;
let simulate = Game.prototype.simulate.bind(game);
//initiating the array
game.init(true);
game.nextGen();
game.paint(ctx);

if (isRunning) {
  const myReq = requestAnimationFrame(() => game.simulate());
}

document.querySelector(".button--continue").addEventListener("click", () => {
  //changing the flag to pause if running or continue if paused
  isRunning = !isRunning;
  if (isRunning) {
    requestAnimationFrame(simulate);
  }
});

//restarting the game(entering the simulation loop with new parameters)
document.querySelector(".button--restart").addEventListener("click", () => {
  game = new Game(canvas.clientWidth, game.cellSize);
  //size and cellSize were changed in the previous line
  game.init(true, game.size, game.cellSize);
  game.paint(ctx);
  requestAnimationFrame(simulate);
});

//resizing the field
sizeSlider.addEventListener("input", function() {
  canvas.style.setProperty("width", this.value + "px");
  canvas.style.setProperty("height", this.value + "px");
});

//changing the number of cells in each row (or column)
cellSlider.addEventListener("input", function() {
  game.cellSize = Math.round(canvas.clientWidth / this.valueAsNumber);
  game.paint();
});
