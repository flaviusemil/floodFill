var cols, rows;
var w = 20;
var grid = [];

var current;
var enableColorBacktracking = false;
let enableMazeGenerationAnimation = false;

let generating;

var stack = [];

function setup() {
  initCanvas();
  initMaze();

  if (!enableMazeGenerationAnimation) {
    generating = !enableMazeGenerationAnimation;
    while(generating || stack.length !== 0)
      generateMaze();
  }

  background(51);
  showMaze();

  floodFill(grid[0], grid[grid.length - 1]);
}

function draw() {
  // background(51);
  // showMaze();

  if (enableMazeGenerationAnimation)
    generateMaze();
}

function initCanvas() {
  background(51);
  createCanvas(400, 400);
  // frameRate(2);
}

function floodFill(ref, end, index = 0) {
  console.log(ref.text);
  if ((ref !== end || !isCoordonateOutOfBounds(ref.j, ref.i)) && index != parseInt(ref.text)) {
    for (var i = 0; i < ref.walls.length; i++) {
      if (!ref.walls[i]) {
        let x = ref.i;
        let y = ref.j;

        ref.text = index;
        ref.displayText = true;

        noStroke();
        fill(255, 0, 0, 100);
        rect(x * w, y * w, w, w);

        if (i === 0)
          x--;
        else if (i === 1)
          y++;
        else if (i === 2)
          x++;
        else if (i === 3)
          y--;

        console.log(ref);
        ref = grid[getIndexOfCell(x, y)];
        console.log("ref: ",i, getIndexOfCell(y, x));
        console.log(ref);
        floodFill(ref, end, index++);
      }
    }
  } else {
    console.log("Done!");
  }
}

function initMaze() {

  cols = floor(width / w);
  rows = floor(height / w);

  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  current = grid[0];
}

function showMaze() {
  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
  }
}

function generateMaze() {
  current.visited = true;
  current.highlight();
  // STEP 1
  var next = current.checkNeighbors();
  if (next) {
    next.visited = true;

    // STEP 2

    stack.push(current);

    // STEP 3
    removeWall(current, next);

    // STEP 4
    current = next;
  } else if (stack.length > 0) {
    current.backtracked = true;
    current = stack.pop();
    generating = false;
  }
}

function isCoordonateOutOfBounds(i, j) {
  return (i < 0 || j < 0 || i > cols - 1 || j > rows - 1);
}

function getIndexOfCell(i, j) {
  if (isCoordonateOutOfBounds(i, j)) {
    return -1;
  }
  return i + j * cols;
}

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true];
  this.visited = false;
  this.displayText = false;
  this.text = ""
  this.backtracked = false;

  this.checkNeighbors = function() {
    var neighbors = [];

    var top = grid[getIndexOfCell(i, j - 1)];
    var right = grid[getIndexOfCell(i + 1, j)];
    var bottom = grid[getIndexOfCell(i, j + 1)]
    var left = grid[getIndexOfCell(i - 1, j)];

    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      var r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }


  }

  this.highlight = function() {
    var x = this.i * w;
    var y = this.j * w;
    noStroke();
    fill(0, 255, 0, 100);
    rect(x, y, w, w);
  }

  this.show = function() {
    var x = this.i * w;
    var y = this.j * w;
    stroke(255);

    if (this.walls[0]) {
      line(x, y, x + w, y);
    }
    if (this.walls[1]) {
      line(x + w, y, x + w, y + w);
    }
    if (this.walls[2]) {
      line(x + w, y + w, x, y + w);
    }
    if (this.walls[3]) {
      line(x, y + w, x, y)
    }

    if (this.visited) {
      noStroke();
      if (this.backtracked && enableColorBacktracking) {
        fill(255, 200, 0, 100);
      } else {
        fill(0, 0, 255, 100);
      }
      rect(x, y, w, w);
    }

    fill(255, 255, 255, 255);

    if (this.displayText)
      text(this.text, x + w * 50 / 100 - 2, y + w * 50 / 100 + 5);
  }

}

function removeWall(a, b) {
  var x = a.i - b.i;

  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }

  var y = a.j - b.j;

  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}
