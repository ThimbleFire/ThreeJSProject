const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Tile size
const tileSize = 16;
// Map dimensions
const mapWidth = 17;
const mapHeight = 17;

// Set the canvas size based on tile size and map dimensions
canvas.width = tileSize * mapWidth;
canvas.height = tileSize * mapHeight;

// PerlinNoise Class (same as before)
class PerlinNoise {
  constructor() {
    this.gradients = {};
    this.permutation = [];
    this.initPermutation();
  }

  initPermutation() {
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i;
    }
    for (let i = 0; i < 256; i++) {
      const j = Math.floor(Math.random() * 256);
      [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
    }
    this.permutation = this.permutation.concat(this.permutation);
  }

  dotGridGradient(ix, iy, x, y) {
    const gradient = this.getGradient(ix, iy);
    const dx = x - ix;
    const dy = y - iy;
    return (dx * gradient[0] + dy * gradient[1]);
  }

  getGradient(ix, iy) {
    const key = `${ix},${iy}`;
    if (!this.gradients[key]) {
      const angle = Math.random() * 2 * Math.PI;
      this.gradients[key] = [Math.cos(angle), Math.sin(angle)];
    }
    return this.gradients[key];
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(a, b, t) {
    return a + t * (b - a);
  }

  noise(x, y) {
    const x0 = Math.floor(x);
    const x1 = x0 + 1;
    const y0 = Math.floor(y);
    const y1 = y0 + 1;

    const sx = this.fade(x - x0);
    const sy = this.fade(y - y0);

    const n0 = this.dotGridGradient(x0, y0, x, y);
    const n1 = this.dotGridGradient(x1, y0, x, y);
    const ix0 = this.lerp(n0, n1, sx);

    const n2 = this.dotGridGradient(x0, y1, x, y);
    const n3 = this.dotGridGradient(x1, y1, x, y);
    const ix1 = this.lerp(n2, n3, sx);

    return this.lerp(ix0, ix1, sy);
  }
}

// Create a PerlinNoise instance
const perlin = new PerlinNoise();

// Variables for player movement and offset
let offsetX = 0;
let offsetY = 0;
const playerSpeed = 1;

// Load player image
const playerImage = new Image();
playerImage.src = 'lpc.png';  // Correct file path

// Function to generate 2D noise with PerlinNoise
function generateNoise() {
  const noiseMap = [];
  for (let y = 0; y < mapHeight; y++) {
    noiseMap[y] = [];
    for (let x = 0; x < mapWidth; x++) {
      // Get noise value at each coordinate, using the current offsets
      const nx = (x + offsetX) * tileSize;
      const ny = (y + offsetY) * tileSize;
      const noiseValue = perlin.noise(nx / 100, ny / 100);  // Adjust scale by dividing by 100 for smoother noise
      noiseMap[y][x] = noiseValue;
    }
  }
  return noiseMap;
}

// Function to draw the tilemap with noise
function drawTilemap() {
  const noiseMap = generateNoise();
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      drawTile(x, y, noiseMap[y][x]);
    }
  }
}

// Function to draw a single tile
function drawTile(x, y, noiseValue) {
  const xPos = x * tileSize;
  const yPos = y * tileSize;

  // Map the noise value to a color range (map noise value from [-1, 1] to [0, 255])
  const colorValue = Math.floor((noiseValue + 1) * 127.5); // This will be between 0 and 255
  ctx.fillStyle = `rgb(${colorValue}, ${colorValue}, ${colorValue})`; // Grayscale color

  // Here you can adjust the colors for different terrain types (e.g., grass and water)
  // We map the grayscale value to specific color ranges for grass and water:
  if (colorValue < 128) {
    ctx.fillStyle = `rgb(0, ${colorValue}, 0)`;  // Grass (green)
  } else {
    ctx.fillStyle = `rgb(0, 0, ${colorValue})`;  // Water (blue)
  }

  ctx.fillRect(xPos, yPos, tileSize, tileSize);
}

// Function to draw the player sprite
function drawPlayer() {
  const playerX = (canvas.width / 2) - (tileSize / 2);  // Center X
  const playerY = (canvas.height / 2) - (tileSize / 2); // Center Y
  ctx.drawImage(playerImage, playerX, playerY, tileSize, tileSize);
}

// Handle keyboard input for movement
function handleInput(event) {
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
      offsetY -= playerSpeed;
      break;
    case 'ArrowDown':
    case 's':
      offsetY += playerSpeed;
      break;
    case 'ArrowLeft':
    case 'a':
      offsetX -= playerSpeed;
      break;
    case 'ArrowRight':
    case 'd':
      offsetX += playerSpeed;
      break;
  }
  // Redraw the map and player when the player moves
  drawTilemap();
  drawPlayer();
}

// Wait for the player image to load before drawing it
playerImage.onload = function() {
  // Draw the initial tilemap and player when the page loads
  drawTilemap();
  drawPlayer();
};

// Attach event listener for keydown events
window.addEventListener('keydown', handleInput);
