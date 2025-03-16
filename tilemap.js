// tilemap.js

// Function to generate 2D noise with PerlinNoise
function generateNoise(perlin, mapWidth, mapHeight, tileSize, offsetX, offsetY) {
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
function drawTilemap(ctx, perlin, mapWidth, mapHeight, tileSize, offsetX, offsetY) {
  const noiseMap = generateNoise(perlin, mapWidth, mapHeight, tileSize, offsetX, offsetY);
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      drawTile(ctx, x, y, tileSize, noiseMap[y][x]);
    }
  }
}

// Function to draw a single tile
function drawTile(ctx, x, y, tileSize, noiseValue) {
  const xPos = x * tileSize;
  const yPos = y * tileSize;

  // Map the noise value to a color range (map noise value from [-1, 1] to [0, 255])
  const colorValue = Math.floor((noiseValue + 1) * 127.5); // This will be between 0 and 255
  ctx.fillStyle = `rgb(${colorValue}, ${colorValue}, ${colorValue})`; // Grayscale color

  // Here you can adjust the colors for different terrain types (e.g., grass and water)
  if (colorValue < 128) {
    ctx.fillStyle = `rgb(0, ${colorValue}, 0)`;  // Grass (green)
  } else {
    ctx.fillStyle = `rgb(0, 0, ${colorValue})`;  // Water (blue)
  }

  ctx.fillRect(xPos, yPos, tileSize, tileSize);
}
