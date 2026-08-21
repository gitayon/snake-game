"use strict";

// ============================================================
// SNAKE Game v0.1
// Lightweight browser version
// ============================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const statusElement = document.getElementById("status");
const startButton = document.getElementById("startButton");


// ============================================================
// GAME SETTINGS
// ============================================================

const GRID = 20;
const CELLS = 28;

const LCD = "#8bac0f";
const DARK = "#0f380f";

const BOARD_SIZE = GRID * CELLS;

canvas.width = BOARD_SIZE;
canvas.height = BOARD_SIZE;


// ============================================================
// GAME STATE
// ============================================================

let snake = [];
let food = {};

let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };

let score = 0;
let highScore = Number(
    localStorage.getItem("nokiaSnakeHighScore") || 0
);

let running = false;
let gameOver = false;

let speed = 110;

let lastUpdate = 0;
let animationFrame = 0;

let foodVisible = true;
let lastFoodBlink = 0;


// ============================================================
// SOUND
// Browser Web Audio API
// No external files needed.
// ============================================================

let audioContext = null;

function getAudio() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (AudioContext) {
            audioContext = new AudioContext();
        }
    }

    return audioContext;
}


function beep(frequency, duration) {

    const audio = getAudio();

    if (!audio) return;

    if (audio.state === "suspended") {
        audio.resume();
    }

    const oscillator =
        audio.createOscillator();

    const gain =
        audio.createGain();

    oscillator.frequency.value = frequency;
    oscillator.type = "square";

    gain.gain.setValueAtTime(
        0.035,
        audio.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audio.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audio.destination);

    oscillator.start();

    oscillator.stop(
        audio.currentTime + duration
    );
}


function startSound() {

    beep(880, 0.06);

    setTimeout(() => {
        beep(1175, 0.08);
    }, 70);
}


function eatSound() {
    beep(1000, 0.045);
}


function gameOverSound() {

    beep(600, 0.1);

    setTimeout(() => {
        beep(450, 0.1);
    }, 100);

    setTimeout(() => {
        beep(300, 0.16);
    }, 210);
}


// ============================================================
// RESET
// ============================================================

function resetGame() {

    snake = [
        {
            x: 14,
            y: 14
        }
    ];

    direction = {
        x: 0,
        y: 0
    };

    nextDirection = {
        x: 0,
        y: 0
    };

    score = 0;

    speed = 110;

    gameOver = false;

    placeFood();

    updateScore();

    statusElement.textContent = "READY";

    draw();
}


// ============================================================
// START
// ============================================================

function startGame() {

    if (running) return;

    if (gameOver) {
        resetGame();
    }

    running = true;

    statusElement.textContent = "PLAY";

    startSound();

    lastUpdate = performance.now();

    cancelAnimationFrame(animationFrame);

    animationFrame =
        requestAnimationFrame(gameLoop);
}


// ============================================================
// FOOD
// ============================================================

function placeFood() {

    let valid = false;

    while (!valid) {

        food = {
            x: Math.floor(
                Math.random() * CELLS
            ),

            y: Math.floor(
                Math.random() * CELLS
            )
        };

        valid = !snake.some(
            part =>
                part.x === food.x &&
                part.y === food.y
        );
    }
}


// ============================================================
// SCORE
// ============================================================

function updateScore() {

    scoreElement.textContent =
        String(score).padStart(5, "0");

    highScoreElement.textContent =
        String(highScore).padStart(5, "0");
}


// ============================================================
// DIRECTION
// ============================================================

function setDirection(name) {

    let newDirection;

    if (name === "up") {
        newDirection = { x: 0, y: -1 };
    }

    else if (name === "down") {
        newDirection = { x: 0, y: 1 };
    }

    else if (name === "left") {
        newDirection = { x: -1, y: 0 };
    }

    else {
        newDirection = { x: 1, y: 0 };
    }


    // Prevent immediate 180-degree turns
    if (
        direction.x !== 0 &&
        newDirection.x === -direction.x
    ) {
        return;
    }

    if (
        direction.y !== 0 &&
        newDirection.y === -direction.y
    ) {
        return;
    }


    nextDirection = newDirection;


    if (!running) {
        startGame();
    }
}


// ============================================================
// KEYBOARD
// ============================================================

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();

        if (
            key === "arrowup" ||
            key === "w"
        ) {

            event.preventDefault();

            setDirection("up");
        }

        else if (
            key === "arrowdown" ||
            key === "s"
        ) {

            event.preventDefault();

            setDirection("down");
        }

        else if (
            key === "arrowleft" ||
            key === "a"
        ) {

            event.preventDefault();

            setDirection("left");
        }

        else if (
            key === "arrowright" ||
            key === "d"
        ) {

            event.preventDefault();

            setDirection("right");
        }

        else if (
            key === " " ||
            key === "enter"
        ) {

            event.preventDefault();

            startGame();
        }
    },
    { passive: false }
);


// ============================================================
// TOUCH / MOBILE CONTROLS
// ============================================================

document.querySelectorAll(
    ".control[data-direction]"
).forEach(button => {

    const directionName =
        button.dataset.direction;

    button.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            setDirection(directionName);
        },
        { passive: false }
    );
});


startButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        startGame();
    },
    { passive: false }
);


// ============================================================
// GAME UPDATE
// ============================================================

function update() {

    direction = nextDirection;


    // No direction yet
    if (
        direction.x === 0 &&
        direction.y === 0
    ) {
        return;
    }


    const head = snake[0];

    let newX =
        head.x + direction.x;

    let newY =
        head.y + direction.y;


    // ========================================================
    // NOKIA WRAPPING
    // ========================================================

    if (newX < 0) {
        newX = CELLS - 1;
    }

    else if (newX >= CELLS) {
        newX = 0;
    }


    if (newY < 0) {
        newY = CELLS - 1;
    }

    else if (newY >= CELLS) {
        newY = 0;
    }


    const newHead = {
        x: newX,
        y: newY
    };


    // ========================================================
    // SELF COLLISION
    // ========================================================

    const hitSelf = snake.some(
        part =>
            part.x === newHead.x &&
            part.y === newHead.y
    );

    if (hitSelf) {

        endGame();

        return;
    }


    snake.unshift(newHead);


    // ========================================================
    // FOOD
    // ========================================================

    if (
        newHead.x === food.x &&
        newHead.y === food.y
    ) {

        eatSound();

        score += 10;


        if (score > highScore) {

            highScore = score;

            localStorage.setItem(
                "nokiaSnakeHighScore",
                highScore
            );
        }


        // Increase speed
        speed = Math.max(
            45,
            speed - 2
        );


        placeFood();

        updateScore();
    }

    else {

        // Remove tail
        snake.pop();
    }
}


// ============================================================
// GAME OVER
// ============================================================

function endGame() {

    running = false;
    gameOver = true;

    statusElement.textContent =
        "GAME OVER";

    gameOverSound();

    draw();

    // Draw game-over message
    ctx.fillStyle =
        "rgba(155, 188, 15, 0.85)";

    ctx.fillRect(
        0,
        BOARD_SIZE / 2 - 35,
        BOARD_SIZE,
        70
    );

    ctx.fillStyle = DARK;

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.font =
        "bold 26px Courier New";

    ctx.fillText(
        "GAME OVER",
        BOARD_SIZE / 2,
        BOARD_SIZE / 2
    );
}


// ============================================================
// DRAW
// ============================================================

function draw() {

    // Background
    ctx.fillStyle = LCD;

    ctx.fillRect(
        0,
        0,
        BOARD_SIZE,
        BOARD_SIZE
    );


    // ========================================================
    // VERY SUBTLE LCD GRID
    // ========================================================

    ctx.strokeStyle =
        "rgba(15, 56, 15, 0.055)";

    ctx.lineWidth = 1;

    for (
        let i = 0;
        i <= CELLS;
        i++
    ) {

        const position =
            i * GRID;

        ctx.beginPath();

        ctx.moveTo(
            position,
            0
        );

        ctx.lineTo(
            position,
            BOARD_SIZE
        );

        ctx.stroke();


        ctx.beginPath();

        ctx.moveTo(
            0,
            position
        );

        ctx.lineTo(
            BOARD_SIZE,
            position
        );

        ctx.stroke();
    }


    // ========================================================
    // FOOD
    // ========================================================

    if (foodVisible) {

        ctx.fillStyle = DARK;

        const padding = 4;

        ctx.fillRect(
            food.x * GRID + padding,
            food.y * GRID + padding,
            GRID - padding * 2,
            GRID - padding * 2
        );
    }


    // ========================================================
    // SNAKE
    // ========================================================

    snake.forEach(
        (part, index) => {

            ctx.fillStyle = DARK;

            const padding =
                index === 0 ? 1 : 3;

            ctx.fillRect(
                part.x * GRID + padding,
                part.y * GRID + padding,
                GRID - padding * 2,
                GRID - padding * 2
            );
        }
    );


    // ========================================================
    // SNAKE HEAD PIXEL DETAIL
    // ========================================================

    if (snake.length > 0) {

        const head = snake[0];

        ctx.fillStyle = LCD;

        const eyeSize = 3;

        if (direction.x >= 0) {

            ctx.fillRect(
                head.x * GRID + 12,
                head.y * GRID + 4,
                eyeSize,
                eyeSize
            );

            ctx.fillRect(
                head.x * GRID + 12,
                head.y * GRID + 13,
                eyeSize,
                eyeSize
            );

        } else {

            ctx.fillRect(
                head.x * GRID + 5,
                head.y * GRID + 4,
                eyeSize,
                eyeSize
            );

            ctx.fillRect(
                head.x * GRID + 5,
                head.y * GRID + 13,
                eyeSize,
                eyeSize
            );
        }
    }
}


// ============================================================
// MAIN LOOP
// ============================================================

function gameLoop(timestamp) {

    if (!running) return;


    if (
        timestamp - lastUpdate >= speed
    ) {

        update();

        lastUpdate = timestamp;
    }


    // Blink food
    if (
        timestamp - lastFoodBlink >= 350
    ) {

        foodVisible =
            !foodVisible;

        lastFoodBlink = timestamp;
    }


    draw();


    animationFrame =
        requestAnimationFrame(gameLoop);
}


// ============================================================
// INITIALIZE
// ============================================================

resetGame();

draw();