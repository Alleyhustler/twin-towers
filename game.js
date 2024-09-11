document.addEventListener('DOMContentLoaded', () => {
  const plane = document.getElementById('plane');
  const tower1 = document.getElementById('tower1');
  const tower2 = document.getElementById('tower2');
  const scoreElement = document.getElementById('score');
  const collisionSound = document.getElementById('collisionSound');
  const scoreSound = document.getElementById('scoreSound');
  const startButton = document.getElementById('start-button');
  const gameContainer = document.getElementById('game-container');
  const startScreen = document.getElementById('start-screen');
  
  let planeTop = window.innerHeight / 2 - plane.offsetHeight / 2;
  let planeSpeed = 10; // Increased speed
  let score = 0;
  let gameInterval;
  let difficultyInterval;
  
  // Set initial top position
  plane.style.top = `${planeTop}px`;
  
  // Function to update the plane's position
  function updatePlanePosition() {
    plane.style.top = `${planeTop}px`;
  }
  
  // Move the plane with arrow keys
  function handleKeyPress(event) {
    if (event.key === 'ArrowUp') {
      if (planeTop > 0) {
        planeTop -= planeSpeed;
      }
    } else if (event.key === 'ArrowDown') {
      if (planeTop + plane.offsetHeight < window.innerHeight) {
        planeTop += planeSpeed;
      }
    }
    updatePlanePosition();
  }
  
  // Collision detection
  function checkCollision() {
    const planeRect = plane.getBoundingClientRect();
    const tower1Rect = tower1.getBoundingClientRect();
    const tower2Rect = tower2.getBoundingClientRect();
    
    if (
      (planeRect.right > tower1Rect.left && planeRect.left < tower1Rect.right &&
        planeRect.bottom > tower1Rect.top && planeRect.top < tower1Rect.bottom) ||
      (planeRect.right > tower2Rect.left && planeRect.left < tower2Rect.right &&
        planeRect.bottom > tower2Rect.top && planeRect.top < tower2Rect.bottom)
    ) {
      collisionSound.play();
      endGame();
    }
  }
  
  // Set random vertical positions for both towers
  function setRandomTowerPositions() {
    const maxHeight = window.innerHeight;
    const towerHeight = tower1.offsetHeight;
    const offset = 50; // minimum distance from the edges
    const maxY = maxHeight - towerHeight - offset;
    
    const randomY = Math.random() * (maxY - offset) + offset; // Random position for both towers
    
    tower1.style.top = `${randomY}px`;
    tower2.style.top = `${randomY}px`;
  }
  
  // Increase difficulty by speeding up towers
  function increaseDifficulty() {
    if (tower1.style.animation) {
      const currentSpeed = parseFloat(tower1.style.animationDuration);
      if (currentSpeed > 1) {
        const newSpeed = currentSpeed - 0.1;
        tower1.style.animationDuration = `${newSpeed}s`;
        tower2.style.animationDuration = `${newSpeed}s`;
      }
    }
  }
  
  // Start or restart the game
  function startGame() {
    planeTop = window.innerHeight / 2 - plane.offsetHeight / 2;
    plane.style.top = `${planeTop}px`;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    
    gameContainer.classList.remove('hidden');
    startScreen.classList.add('hidden');
    
    tower1.style.animation = 'moveTowers 4s linear infinite';
    tower2.style.animation = 'moveTowers 4s linear infinite';
    setRandomTowerPositions(); // Set initial positions of towers
    
    if (gameInterval) clearInterval(gameInterval);
    if (difficultyInterval) clearInterval(difficultyInterval);
    
    gameInterval = setInterval(() => {
      checkCollision();
      score++;
      scoreElement.textContent = `Score: ${score}`;
      scoreSound.play();
    }, 100);
    
    difficultyInterval = setInterval(increaseDifficulty, 10000);
    
    // Update tower positions whenever they reach the end of the screen
    tower1.addEventListener('animationiteration', setRandomTowerPositions);
    tower2.addEventListener('animationiteration', setRandomTowerPositions);
  }
  
  // End the game
  function endGame() {
    clearInterval(gameInterval);
    clearInterval(difficultyInterval);
    gameContainer.classList.add('hidden');
    startScreen.classList.remove('hidden');
    alert(`Game Over! Your score was ${score}`);
  }
  
  // Event listeners
  document.addEventListener('keydown', handleKeyPress);
  
  startButton.addEventListener('click', () => {
    startGame();
  });
});
