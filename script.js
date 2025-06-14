const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let snake = [{ x: 9 * box, y: 9 * box }];
let direction = null;
let food = randomFood();
let score = 0;
let level = 1;
let speed = 100;
let game;
let audioInitialized = false;
const bgMusic = document.getElementById('bgMusic');
const eatSound = document.getElementById('eatSound');
const levelUpSound = document.getElementById('levelUpSound');
const gameOverSound = document.getElementById('gameOverSound');


document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
  
  const key = event.key;
  if (key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  if (key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? 'lime' : 'green';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);

  // Get current head position
  let headX = snake[0].x;
  let headY = snake[0].y;

  // Move in direction
  if (direction === 'LEFT') headX -= box;
  if (direction === 'RIGHT') headX += box;
  if (direction === 'UP') headY -= box;
  if (direction === 'DOWN') headY += box;

  // Wrap around edges
  if (headX < 0) headX = canvas.width - box;
  if (headX >= canvas.width) headX = 0;
  if (headY < 0) headY = canvas.height - box;
  if (headY >= canvas.height) headY = 0;

  // Check collision with tail (excluding the head)
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === headX && snake[i].y === headY) {
     clearInterval(game);
     // alert('Game Over! Your Score: ' + score);
     gameOver();
      return;
    }
  }

  // If food is eaten
  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById('scoreDisplay').textContent = 'Score: ' + score;
    document.getElementById('levelDisplay').textContent = 'Level: ' + level;

    // Increase level every 5 points
    if (score % 5 === 0) {
       level++;
       speed = Math.max(50, speed - 10); // Don't go below 50ms
       startGame(); // Restart interval with new speed
      }
    
    food = randomFood();
    
  }else {
    snake.pop(); // Remove tail if no food eaten
  }

  // Add new head
  snake.unshift({ x: headX, y: headY });
}

function gameOver() {
  clearInterval(game);
  document.getElementById('modalMessage').textContent = `Game Over! Your Score: ${score}`;
  document.getElementById('gameOverModal').style.display = 'flex';
  document.getElementById('restartBtn').addEventListener('click', () => {
    location.reload(); // simple page reload for reset
  })
}

// let game = setInterval(draw, 100);
function startGame() {

  clearInterval(game);
  game = setInterval(draw, speed);
  }

startGame(); // call initially
// Mobile button control
document.querySelectorAll('.arrow').forEach(button => {
  // Respond instantly on mobile with touchstart, fallback to click
  const handleDirection = () => {
    const dir = button.getAttribute('data-dir');
    if (dir === 'LEFT' && direction !== 'RIGHT') direction = 'LEFT';
    if (dir === 'RIGHT' && direction !== 'LEFT') direction = 'RIGHT';
    if (dir === 'UP' && direction !== 'DOWN') direction = 'UP';
    if (dir === 'DOWN' && direction !== 'UP') direction = 'DOWN';

    initializeAudio(); // optional audio init
  };

  button.addEventListener('touchstart', handleDirection);
  button.addEventListener('click', handleDirection); // fallback for desktop
});
