function setupCanvas(boxesWide, boxesTall, boxSize) {
    canvas = document.createElement('canvas');
    canvas.width = boxesWide * boxSize;
    canvas.height = boxesTall * boxSize;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.body.append(canvas);

    grid = getRandomGrid(boxesWide, boxesTall);

    updateCanvas(canvas, grid, boxesWide, boxesTall, boxSize, ['#fff', '#00f']);

    window.setInterval(function() {
        grid = step(grid);
        updateCanvas(canvas, grid, boxesWide, boxesTall, boxSize, ['#fff', '#00f']);
    }, 100);

}

function drawLines(canvas, boxesCount, boxSize, direction) {
    ctx = canvas.getContext('2d');

    for (var i = 1; i < boxesCount; i++) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();

        if (direction === 'vertical') {
            ctx.moveTo(i*boxSize, 0);
            ctx.lineTo(i*boxSize, canvas.height);
        } else {
            ctx.moveTo(0, i*boxSize);
            ctx.lineTo(canvas.width, i*boxSize);
        }

        ctx.stroke();
    }
}

function fillBox(ctx, x, y, boxSize, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x*boxSize, y*boxSize, boxSize, boxSize);
}

function updateCanvas(canvas, grid, boxesWide, boxesTall, boxSize, colors) {
    var ctx = canvas.getContext('2d');

    grid.forEach(function(row, rowNumber) {
        row.forEach(function(cell, columnNumber) {
            var color = colors[cell];
            fillBox(ctx, columnNumber, rowNumber, boxSize, color);
        });
    });

    drawLines(canvas, boxesWide, boxSize, 'vertical');
    drawLines(canvas, boxesTall, boxSize, 'horizontal');
}

function getRandomGrid(width, height) {
    var grid = [];

    for (var rowCount = 0; rowCount < height; rowCount++) {
        var row = [];

        for (var columnCount = 0; columnCount < width; columnCount++) {
            var cell = Math.random() >= 0.5 ? 1 : 0;
            row.push(cell);
        }

        grid.push(row);
    }

    return grid;
}

function getBlankGrid(width, height) {
    var grid = [];

    for (var rowCount = 0; rowCount < height; rowCount++) {
        var row = [];

        for (var columnCount = 0; columnCount < width; columnCount++) {
            row.push(0);
        }

        grid.push(row);
    }

    return grid;
}

function step(grid) {

    // var newGrid = getBlankGrid(grid.length, grid[0].length);
    var newGrid = JSON.parse(JSON.stringify(grid));

    grid.forEach(function(row, rowNumber) {
        row.forEach(function(cell, columnNumber) {
            var liveNeighbors = countLiveNeighbors(rowNumber, columnNumber, grid);
            var gridStr = grid.toString();
            if (cell === 1) {
                if (liveNeighbors < 2) {
                    // 1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.
                    cell = 0;
                } else if (liveNeighbors === 2 || liveNeighbors === 3) {
                    // 2. Any live cell with two or three live neighbours lives on to the next generation.
                    cell = 1;
                } else if (liveNeighbors > 3) {
                    // 3. Any live cell with more than three live neighbours dies, as if by over-population.
                    cell = 0;
                }
            } else if (cell === 0) {
                if (liveNeighbors === 3) {
                    // 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
                    cell = 1;
                }
            }

            if (rowNumber === 4 && columnNumber === 3) {
            }

            newGrid[rowNumber][columnNumber] = cell;
        });
    });

    return newGrid;
}

function countLiveNeighbors(rowNumber, columnNumber, grid) {
    var count = 0;

    var gridWidth = grid[0].length;
    var gridHeight = grid.length;

    var toCheck = [
        [0, -1],
        [0, 1],
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ];

    toCheck.forEach(function(dir) {
        var neighborY = rowNumber+dir[0];
        var neighborX = columnNumber+dir[1];

        if (neighborX < 0 || neighborY < 0 || neighborX >= gridWidth || neighborY >= gridHeight) {
            return;
        }

        var cell = grid[neighborY][neighborX];

        count += cell;
    });

    return count;
}

setupCanvas(50, 50, 20);
