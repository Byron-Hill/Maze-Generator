const WIDTH = 600;
const HEIGHT = 900;
const CELL_SIZE = 10;
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const START_POINT = '#00FF00';
const END_POINT = '#FFFFFF';

const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;

const rows = Math.floor(HEIGHT / CELL_SIZE);
const cols = Math.floor(WIDTH / CELL_SIZE);

let start_pos = null;
let end_pos = null;
let mazeGenerated = false;

function generateMaze(rows, cols, start_pos, end_pos) {
    // Initialize the maze with all cells as walls
    const maze = Array.from({ length: rows }, () => Array(cols).fill(1));

    function dfs(x, y) {
        const directions = [
            [0, 1], [0, -1],
            [1, 0], [-1, 0]
        ];
        directions.sort(() => Math.random() - 0.5);

        for (const [dx, dy] of directions) {
            const nx = x + dx * 2;
            const ny = y + dy * 2;
            if (nx > 0 && nx < rows - 1 && ny > 0 && ny < cols - 1 && maze[nx][ny] === 1) {
                maze[nx][ny] = 0;
                maze[x + dx][y + dy] = 0;
                dfs(nx, ny);
            }
        }
    }

    maze[start_pos[0]][start_pos[1]] = 0;
    maze[end_pos[0]][end_pos[1]] = 0;

    dfs(start_pos[0], start_pos[1]);

    // Keep the edges of the maze as walls
    for (let i = 0; i < rows; i++) {
        maze[i][0] = 1;
        maze[i][cols - 1] = 1;
    }
    for (let j = 0; j < cols; j++) {
        maze[0][j] = 1;
        maze[rows - 1][j] = 1;
    }

    return maze;
}

function drawMaze(maze, start_pos, end_pos) {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[0].length; col++) {
            const color = maze[row][col] === 0 ? WHITE : BLACK;
            ctx.fillStyle = color;
            ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }

    ctx.fillStyle = START_POINT;
    ctx.fillRect(start_pos[1] * CELL_SIZE, start_pos[0] * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    ctx.fillStyle = END_POINT;
    ctx.fillRect(end_pos[1] * CELL_SIZE, end_pos[0] * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

canvas.addEventListener('click', function(event) {
    if (!mazeGenerated) {
        const col = Math.floor(event.offsetX / CELL_SIZE);
        const row = Math.floor(event.offsetY / CELL_SIZE);

        if (!start_pos) {
            start_pos = [row, col];
            ctx.fillStyle = START_POINT;
            ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        } else if (!end_pos) {
            end_pos = [row, col];
            const maze = generateMaze(rows, cols, start_pos, end_pos);
            mazeGenerated = true;
            drawMaze(maze, start_pos, end_pos);
        }
    }
});
