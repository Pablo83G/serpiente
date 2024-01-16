// definir los elementos HTML
const board = document.getElementById("game-board");
const instructionText = document.getElementById
    ("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

// definir las variables del juego
const gridSize = 20;
let snake = [{ x: 10, y: 10 }]; // la posición de la serpiente en el tablero de juego
let food = generateFood();
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200; //200 milisegundos
let gameStarted = false;

// dibujar el mapa de juego, la serpiente y la comida
function draw() {
    board.innerHTML = " ";
    // dibujamos el tablero con cadenas vacias para que se reinicie cada vez que jugamos
    drawSnake();
    drawFood();
    updateScore();
}

// dibujar la serpiente
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement("div", "snake");
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}


// Crear una serpiente o comida cubo/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// establecer la posición de la serpiente o la comida
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// probando la función draw
//draw();

// función para pintar la comida
function drawFood() {
    if(gameStarted) {
        const foodElement = createGameElement("div", "food");
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    } 
}

// generar aleatoriamente la comida en el tablero
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

// Mover la serpiente
function move() {
    const head = { ...snake[0] };
    switch (direction) {
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
        case "left":
            head.x--;
            break;
        case "right":
            head.x++;
            break;
    }

    snake.unshift(head);

    // snake.pop();

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); // método para evitar errores, se borrará el intervalo anterior
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}


//Test de movimiento
// setInterval(() => {
//     move(); //Primer movimiento
//     draw(); // cuando se pinta una nueva posición
// }, 200);

// Función para iniciar el juego
function startGame() {
    gameStarted = true; //seguimiento de la ejecución del juego
    instructionText.style.display = "none";
    logo.style.display = "none";
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//detector de eventos al pulsar una tecla
function handleKeyPress(event) {
    if (
        (!gameStarted && event.code === "Space") ||
        (!gameStarted && event.key === " ")
    ) {
        startGame();
    } else {
        switch (event.key) {
            case "ArrowUp":
                direction = "up";
                break;
            case "ArrowDown":
                direction = "down";
                break;
            case "ArrowLeft":
                direction = "left";
                break;
            case "ArrowRight":
                direction = "right";
                break;
        }
    }
}

document.addEventListener("keydown", handleKeyPress);

// función para incrementar la velocidad a medida que se come comida
function increaseSpeed() {
    console.log(gameSpeedDelay);
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

//Función para definir cuando choca la cabeza con paredes o cuerpo
function checkCollision() {
    const head = snake[0];

    if (head.x < 1 || head.x > gridSize || head.y < 1 ||
        head.y > gridSize) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            // si el cuerpo de la serpiente choca con la cabeza, reiniciamos el juego
            resetGame();
        }
    }
}

//Función para finalizar el juego
function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = "right";
    gameSpeedDelay = 200;
    updateScore();
}

//Función para reestablecer la puntuación a 0
function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().
    padStart(3, '0');
}

// función para parar el juego
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = "block";
    logo.style.display = "block";
}

//Record de puntuación
function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().
        padStart(3, '0');
    }
    highScoreText.style.display = "block";
}