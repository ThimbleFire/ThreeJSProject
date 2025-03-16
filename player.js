// player.js

// Function to draw the player sprite
function drawPlayer(ctx, playerImage, tileSize, canvasWidth, canvasHeight) {
  const playerX = (canvasWidth / 2) - (tileSize / 2);  // Center X
  const playerY = (canvasHeight / 2) - (tileSize / 2); // Center Y
  ctx.drawImage(playerImage, playerX, playerY, tileSize, tileSize);
}
