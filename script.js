// script.js

// Get the canvas and context
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

// Create a PerlinNoise instance
const perlin = new PerlinNoise();

// Variables for player movement and offset
let offsetX = 0;
let offsetY = 0;
const playerSpeed = 1;

// Load player image
const playerImage = new Image();
playerImage.src = 'lpc.png';  // Correct file path

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
  drawTilemap(ctx, perlin, mapWidth, mapHeight, tileSize, offsetX, offsetY);
  drawPlayer(ctx, playerImage, tileSize, canvas.width, canvas.height);
}

// Wait for the player image to load before drawing it
playerImage.onload = function() {
  // Draw the initial tilemap and player when the page loads
  drawTilemap(ctx, perlin, mapWidth, mapHeight, tileSize, offsetX, offsetY);
  drawPlayer(ctx, playerImage, tileSize, canvas.width, canvas.height);
};

// Attach event listener for keydown events
window.addEventListener('keydown', handleInput);
