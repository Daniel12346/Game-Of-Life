class Game {
  constructor(size = canvas.clientWidth, cellSize = canvas.clientWidth / 150) {
    //the size of the canvas
    this.size = size;
    //the size of each cell
    this.cellSize = cellSize;
    //the array representing all the cells before the generation shift
    this.oldGen = [];
    //the array representing all the cells before the generation shift
    this.newGen = [];
    this.genCount = 0;
    //the part of the UI where the generation count is displayed
    this.genCounter = document.querySelector(".game__genCount");
  }
  //initiating the current game's defining arrays(oldGen and newGen)
  //TODO: add different types of random generation
  init(random = true, size = this.size, cellSize = this.cellSize) {
    let count = Math.round(size / cellSize);
    //iterating through the oldGen array
    for (let i = 0; i < count; i++) {
      this.oldGen[i] = [];
      //iterating through each row of the oldGen array
      for (let j = 0; j < count; j++) {
        //randomly assigning 0 or 1 to each cell
        this.oldGen[i].push(random ? Math.round(Math.random()) : 0);
      }
    }
    //resetting the generation counter
    this.genCounter.textContent = 0;
  }
  //displaying the current game's oldGen array on the canvas
  paint(canvasContext = ctx, cellSize = this.cellSize, size = this.size) {
    //iterating through the array
    for (let i = 0; i < this.oldGen.length; i++) {
      //iterating through the rows
      for (let j = 0; j < this.oldGen.length; j++) {
        //painting only if the element's value is 1 (true)
        if (this.oldGen[i][j]) {
          canvasContext.fillRect(
            j * cellSize,
            i * cellSize,
            cellSize,
            cellSize
          );
        } else {
          canvasContext.clearRect(
            j * cellSize,
            i * cellSize,
            cellSize,
            cellSize
          );
        }
      }
    }
  }
  //performing the generation switch by mapping the oldGen
  //to the newGen with the conditions determinining the state
  //of each cell
  nextGen() {
    this.genCount++;
    if (this.newGen.length > 0) {
      this.oldGen = this.newGen;
    }

    this.newGen = this.oldGen.map((row, rowIndex) =>
      row.map((el, elIndex) =>
        Game.isCellAlive(this.oldGen, rowIndex, elIndex) ? 1 : 0
      )
    );
    this.genCounter.textContent++;
  }

  //checking if the cell is alive or dead
  static isCellAlive(arr, row, el) {
    //the position of the cell
    //whose state is determined by this function
    let currentCell = arr[row][el];
    //if the neighboring cell does not exist,
    //it is equivalent to a dead one (0);
    //the array is hardcoded but the number of
    //neghboring cells will never be above 8
    let neighbors = [
      //the current row (excluding the current cell)
      arr[row][el - 1] || 0,
      arr[row][el + 1] || 0
    ];
    //starting from the second row and ending before the last
    // to avoid undefined values

    if (row >= 1) {
      neighbors = neighbors.concat([
        arr[row - 1][el - 1] || 0,
        arr[row - 1][el] || 0,
        arr[row - 1][el + 1] || 0
      ]);
    }

    if (row < arr.length - 1) {
      neighbors = neighbors.concat([
        arr[row + 1][el - 1] || 0,
        arr[row + 1][el] || 0,
        arr[row + 1][el + 1] || 0
      ]);
    }

    //looking for the sum of all the neighboring cells' values
    // (alive=1, dead=0)
    let neighborsSum = neighbors.reduce((a, b) => a + b);
    //1. Any live cell with fewer than two live neighbors dies, as if by underpopulation.
    if (currentCell && neighborsSum < 2) {
      return false;
    }
    //2.Any live cell with two or three live neighbors lives on to the next generation.
    if (currentCell && (neighborsSum === 2 || neighborsSum === 3)) {
      return true;
    }
    //3. Any live cell with more than three live neighbors dies, as if by overpopulation.
    if (currentCell && neighborsSum > 3) {
      return false;
    }
    //4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction
    if (!currentCell && neighborsSum === 3) {
      return true;
    }

    //if nothing changed, the boolean of the initial cell value is returned (0 or 1)
    return Boolean(currentCell);
  }
  //simulates the generation switch and displays it on the canvas,
  //made this function static because "this" was too confusing
  simulate() {
    if (!isRunning) {
      return;
    }
    this.nextGen();
    this.paint(ctx);
    requestAnimationFrame(simulate);
  }
}
