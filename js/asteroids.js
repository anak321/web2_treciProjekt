const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const stars = [];
const numStars = 100;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);

let numAsteroids = 10;

const playerImage = new Image();
playerImage.src = "images/spaceship.png";

const asteroidImage = new Image();
asteroidImage.src = "images/asteroid.png";

const gameState = {};

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 50,
};

const asteroids = [];
const asteroidSize = 70;
let animationFrameId;

// Inicijalizacija igre
function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    updateGameState(); // Ažuriranje stanja igre
    renderGameState(); // Prikaz stanja igre
    drawStars(); // Crtanje zvijezda

    if (!gameState.gameOver) {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

// Ažuriranje stanja igre
function updateGameState() {
    updatePlayerPosition(); // Ažuriranje položaja igrača
    updateAsteroids(); // Ažuriranje asteroida

    if (checkCollision()) {
        console.log("Detektirana kolizija!");
    }
}

// Prikaz stanja igre
function renderGameState() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.drawImage(playerImage, player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);

    asteroids.forEach(function(asteroid) {
        context.drawImage(asteroidImage, asteroid.x - asteroid.size / 2, asteroid.y - asteroid.size / 2, asteroid.size, asteroid.size);
    });
}

// Inicijalizacija elemenata igre
function initializeGameElements() {
    for (let i = 0; i < numAsteroids; i++) {
        asteroids.push({
            x: Math.random() * canvas.width,
            y: -asteroidSize,
            speedX: (Math.random() - 0.5) * 2,
            speedY: Math.random() + 1,
            size: asteroidSize
        });
    }
}

createStars();
initializeGameElements();

// Ažuriranje asteroida
function updateAsteroids() {
    asteroids.forEach(function(asteroid, index) {
        asteroid.x += asteroid.speedX;
        asteroid.y += asteroid.speedY;

        if (asteroid.y > canvas.height + asteroid.size) {
            asteroids.splice(index, 1);
            addAsteroid();
        }
    });
}

// Dodavanje asteroida
function addAsteroid() {
    const newAsteroid = {
        x: Math.random() * canvas.width,
        y: -asteroidSize,
        speedX: (Math.random() - 0.5) * 4,
        speedY: Math.random() * 3 + 1,
        size: asteroidSize
    };
    asteroids.push(newAsteroid);
}

setInterval(addAsteroid, 2000);

const keysPressed = {
    up: false,
    down: false,
    left: false,
    right: false
};

document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowUp':
        case 'w':
            keysPressed.up = true;
            break;
        case 'ArrowDown':
        case 's':
            keysPressed.down = true;
            break;
        case 'ArrowLeft':
        case 'a':
            keysPressed.left = true;
            break;
        case 'ArrowRight':
        case 'd':
            keysPressed.right = true;
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch(event.key) {
        case 'ArrowUp':
        case 'w':
            keysPressed.up = false;
            break;
        case 'ArrowDown':
        case 's':
            keysPressed.down = false;
            break;
        case 'ArrowLeft':
        case 'a':
            keysPressed.left = false;
            break;
        case 'ArrowRight':
        case 'd':
            keysPressed.right = false;
            break;
    }
});

// Ažuriranje položaja igrača
function updatePlayerPosition() {
    const playerSpeed = 5;
    if (keysPressed.up) {
        player.y -= playerSpeed;
    }
    if (keysPressed.down) {
        player.y += playerSpeed;
    }
    if (keysPressed.left) {
        player.x -= playerSpeed;
    }
    if (keysPressed.right) {
        player.x += playerSpeed;
    }

    if (player.x < 0) {
        player.x = canvas.width;
    } else if (player.x > canvas.width) {
        player.x = 0;
    }
    if (player.y < 0) {
        player.y = canvas.height;
    } else if (player.y > canvas.height) {
        player.y = 0;
    }
}

// Stvaranje zvijezda
function createStars() {
    stars.length = 0;
    for (let i = 0; i < numStars; i++) {
        const star = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        };
        stars.push(star);
    }
}

createStars();

// Crtanje zvijezda
function drawStars() {
    context.fillStyle = 'white';
    stars.forEach(function(star) {
        context.fillRect(star.x, star.y, 2, 2);
    });
}

let startTime;
let bestTime = parseFloat(localStorage.getItem('bestTime')) || 0;

// Početak igre s određenim brojem asteroida
function startGameWithParameters(numAsteroidsParam) {
    numAsteroids = numAsteroidsParam;
    resetGame();
}

// Resetiranje igre
function resetGame() {
    gameState.asteroids = [];
    gameState.player = { x: canvas.width / 2, y: canvas.height / 2, size: player.size };
    gameState.gameOver = false;
    startTime = Date.now();
    collisionDetected = false;

    initializeGameElements();

    requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', function () {
    var restartButton = document.getElementById('restartButton');
    if (restartButton) {
        restartButton.addEventListener('click', function() {
            startGameWithParameters(numAsteroids);
        });
    } else {
        console.error('Gumb za ponovno pokretanje nije pronađen u DOM-u');
    }

    console.log(`Najbolje vrijeme: ${bestTime} sekundi`);
    startGameWithParameters(10);
});

// Početak igre
function startGame() {
    createStars();
    requestAnimationFrame(gameLoop);
}

let collisionDetected = false;

// Završetak igre
function endGame() {
    gameState.gameOver = true;
    const endTime = Date.now();
    const gameTimeInSeconds = (endTime - startTime) / 1000;
    console.log(`Igra završena! Vrijeme: ${gameTimeInSeconds} sekundi`);

    if (gameTimeInSeconds > bestTime) {
        bestTime = gameTimeInSeconds;
        localStorage.setItem('bestTime', bestTime.toString());
        console.log(`Novo najbolje vrijeme: ${bestTime} sekundi`);
    }
}

// Provjera kolizije
function checkCollision() {
    // Provjeri koliziju s asteroidima
    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];
        const dx = player.x - asteroid.x;
        const dy = player.y - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.size / 2 + asteroid.size / 2) {
            collisionDetected = true;
            endGame();
            return true;
        }
    }

    return false;
}
