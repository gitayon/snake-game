"use strict";

// ============================================================
// SNAKE GAME v0.3
// DOM ELEMENTS
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
let food = {
    x: 0,
    y: 0
};

let direction = {
    x: 0,
    y: 0
};

let nextDirection = {
    x: 0,
    y: 0
};

let score = 0;

let highScore = Number(
    localStorage.getItem("SnakeHighScore") || 0
);

let running = false;
let gameOver = false;

let speed = 110;

let lastUpdate = 0;
let animationFrame = 0;


// ============================================================
// FOOD BLINK
// ============================================================

let foodVisible = true;
let lastFoodBlink = 0;

const FOOD_BLINK_SPEED = 350;


// ============================================================
// INTRO
// ============================================================

let introActive = true;
let introStartTime = 0;

const INTRO_DURATION = 2200;


// ============================================================
// SOUND
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

    if (!audio) {
        return;
    }

    if (audio.state === "suspended") {
        audio.resume();
    }

    const oscillator =
        audio.createOscillator();

    const gain =
        audio.createGain();

    oscillator.frequency.value =
        frequency;

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
// RESET GAME
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

    running = false;
    gameOver = false;

    foodVisible = true;
    lastFoodBlink = performance.now();

    placeFood();

    updateScore();

    statusElement.textContent = "READY";

    draw();
}


// ============================================================
// INTRO
// ============================================================

function showIntro() {

    running = false;
    gameOver = false;
    introActive = true;

    introStartTime = performance.now();

    statusElement.textContent = "SNAKE";

    cancelAnimationFrame(animationFrame);

    animationFrame =
        requestAnimationFrame(introLoop);
}


function introLoop(timestamp) {

    drawIntro(timestamp);

    const elapsed =
        timestamp - introStartTime;

    if (elapsed >= INTRO_DURATION) {

        introActive = false;

        statusElement.textContent = "READY";

        draw();

        return;
    }

    animationFrame =
        requestAnimationFrame(introLoop);
}


// ============================================================
// PIXEL SNAKE GAME TITLE
// ============================================================

const titleLetters = {

    S: [
        "1111",
        "1000",
        "1000",
        "1111",
        "0001",
        "0001",
        "1111"
    ],

    N: [
        "1001",
        "1101",
        "1101",
        "1011",
        "1011",
        "1001",
        "1001"
    ],

    A: [
        "0110",
        "1001",
        "1001",
        "1111",
        "1001",
        "1001",
        "1001"
    ],

    K: [
        "1001",
        "1010",
        "1100",
        "1100",
        "1010",
        "1010",
        "1001"
    ],

    E: [
        "1111",
        "1000",
        "1000",
        "1110",
        "1000",
        "1000",
        "1111"
    ],

    G: [
        "0111",
        "1000",
        "1000",
        "1011",
        "1001",
        "1001",
        "0111"
    ],

    M: [
        "10001",
        "11011",
        "10101",
        "10101",
        "10001",
        "10001",
        "10001"
    ]
};


function drawPixelTitle(
    text,
    centerY,
    scale,
    visiblePixels
) {

    const spacing = 2;

    let totalWidth = 0;

    for (const char of text) {

        if (char === " ") {

            totalWidth += scale * 3;

        } else if (titleLetters[char]) {

            totalWidth +=
                titleLetters[char][0].length * scale +
                spacing * scale;
        }
    }


    let x =
        (BOARD_SIZE - totalWidth) / 2;

    let pixelCounter = 0;


    for (const char of text) {

        if (char === " ") {

            x += scale * 3;

            continue;
        }


        const pattern =
            titleLetters[char];

        if (!pattern) {
            continue;
        }


        for (
            let row = 0;
            row < pattern.length;
            row++
        ) {

            for (
                let col = 0;
                col < pattern[row].length;
                col++
            ) {

                if (pattern[row][col] !== "1") {
                    continue;
                }

                if (pixelCounter >= visiblePixels) {
                    continue;
                }


                ctx.fillRect(
                    x + col * scale,
                    centerY + row * scale,
                    scale,
                    scale
                );

                pixelCounter++;
            }
        }


        x +=
            pattern[0].length * scale +
            spacing * scale;
    }
}


// ============================================================
// INTRO DRAW
// ============================================================

function drawIntro(timestamp) {

    // --------------------------------------------------------
    // Background
    // --------------------------------------------------------

    ctx.fillStyle = LCD;

    ctx.fillRect(
        0,
        0,
        BOARD_SIZE,
        BOARD_SIZE
    );


    // --------------------------------------------------------
    // Subtle LCD grid
    // --------------------------------------------------------

    ctx.strokeStyle =
        "rgba(15, 56, 15, 0.045)";

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


    // --------------------------------------------------------
    // Title
    // --------------------------------------------------------

    ctx.fillStyle = DARK;

    const elapsed =
        timestamp - introStartTime;


    const progress =
        Math.min(
            1,
            elapsed / 1300
        );


    const title =
        "SNAKE GAME";


    // Count title pixels

    let totalPixels = 0;


    for (const char of title) {

        if (!titleLetters[char]) {
            continue;
        }


        const pattern =
            titleLetters[char];


        for (const row of pattern) {

            for (const pixel of row) {

                if (pixel === "1") {
                    totalPixels++;
                }
            }
        }
    }


    const visiblePixels =
        Math.floor(
            totalPixels * progress
        );


    drawPixelTitle(
        title,
        225,
        5,
        visiblePixels
    );


    // --------------------------------------------------------
    // Small animated snake
    // --------------------------------------------------------

    if (elapsed > 700) {

        const snakeProgress =
            Math.min(
                1,
                (elapsed - 700) / 900
            );


        const snakeLength =
            Math.floor(
                12 * snakeProgress
            );


        ctx.fillStyle = DARK;


        for (
            let i = 0;
            i < snakeLength;
            i++
        ) {

            const snakeX =
                130 + i * 17;


            const wave =
                Math.sin(i * 0.8) * 8;


            const snakeY =
                315 + wave;


            ctx.fillRect(
                snakeX,
                snakeY,
                14,
                14
            );
        }


        // ----------------------------------------------------
        // Snake head
        // ----------------------------------------------------

        if (snakeLength > 0) {

            const headX =
                130 +
                (snakeLength - 1) * 17;


            const headY =
                315 +
                Math.sin(
                    (snakeLength - 1) * 0.8
                ) * 8;


            ctx.fillStyle = DARK;


            ctx.fillRect(
                headX,
                headY,
                18,
                18
            );


            // Eye

            ctx.fillStyle = LCD;


            ctx.fillRect(
                headX + 12,
                headY + 4,
                3,
                3
            );
        }
    }


    // --------------------------------------------------------
    // PRESS START
    // --------------------------------------------------------

    if (elapsed > 1500) {

        const blink =
            Math.floor(
                elapsed / 350
            ) % 2;


        if (blink === 0) {

            ctx.fillStyle = DARK;

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.font =
                "bold 16px Courier New";


            ctx.fillText(
                "PRESS START",
                BOARD_SIZE / 2,
                390
            );
        }
    }
}


// ============================================================
// START GAME
// ============================================================

function startGame() {

    // Already playing
    if (running) {
        return;
    }


    // Intro is still running
    if (introActive) {
        return;
    }


    // Start a fresh game after game over
    if (gameOver) {
        resetGame();
    }


    running = true;

    gameOver = false;

    statusElement.textContent = "PLAY";

    startSound();


    lastUpdate =
        performance.now();


    lastFoodBlink =
        performance.now();


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


        valid =
            !snake.some(
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

    // Don't accept input during intro
    if (introActive) {
        return;
    }


    let newDirection;


    if (name === "up") {

        newDirection = {
            x: 0,
            y: -1
        };

    } else if (name === "down") {

        newDirection = {
            x: 0,
            y: 1
        };

    } else if (name === "left") {

        newDirection = {
            x: -1,
            y: 0
        };

    } else {

        newDirection = {
            x: 1,
            y: 0
        };
    }


    // --------------------------------------------------------
    // Prevent immediate 180-degree turns
    // --------------------------------------------------------

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


    nextDirection =
        newDirection;


    // First movement starts the game
    if (!running) {
        startGame();
    }
}


// ============================================================
// KEYBOARD CONTROLS
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

        } else if (
            key === "arrowdown" ||
            key === "s"
        ) {

            event.preventDefault();

            setDirection("down");

        } else if (
            key === "arrowleft" ||
            key === "a"
        ) {

            event.preventDefault();

            setDirection("left");

        } else if (
            key === "arrowright" ||
            key === "d"
        ) {

            event.preventDefault();

            setDirection("right");

        } else if (
            key === " " ||
            key === "enter"
        ) {

            event.preventDefault();

            startGame();
        }
    },
    {
        passive: false
    }
);


// ============================================================
// MOBILE CONTROLS
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
        {
            passive: false
        }
    );
});


startButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        startGame();
    },
    {
        passive: false
    }
);


// ============================================================
// GAME UPDATE
// ============================================================

function update() {

    // --------------------------------------------------------
    // Apply requested direction
    // --------------------------------------------------------

    direction =
        nextDirection;


    // No movement yet
    if (
        direction.x === 0 &&
        direction.y === 0
    ) {
        return;
    }


    const head =
        snake[0];


    let newX =
        head.x + direction.x;


    let newY =
        head.y + direction.y;


    // --------------------------------------------------------
    // SCREEN WRAPPING
    // --------------------------------------------------------

    if (newX < 0) {
        newX = CELLS - 1;

    } else if (newX >= CELLS) {
        newX = 0;
    }


    if (newY < 0) {
        newY = CELLS - 1;

    } else if (newY >= CELLS) {
        newY = 0;
    }


    const newHead = {
        x: newX,
        y: newY
    };


    // --------------------------------------------------------
    // FOOD CHECK
    // --------------------------------------------------------

    const eatingFood =
        newHead.x === food.x &&
        newHead.y === food.y;


    // --------------------------------------------------------
    // SELF COLLISION
    // --------------------------------------------------------

    const bodyToCheck =
        eatingFood
            ? snake
            : snake.slice(0, -1);


    const hitSelf =
        bodyToCheck.some(
            part =>
                part.x === newHead.x &&
                part.y === newHead.y
        );


    if (hitSelf) {

        endGame();

        return;
    }


    // --------------------------------------------------------
    // Add new head
    // --------------------------------------------------------

    snake.unshift(newHead);


    // --------------------------------------------------------
    // FOOD
    // --------------------------------------------------------

    if (eatingFood) {

        eatSound();

        score += 10;


        // New high score

        if (score > highScore) {

            highScore = score;

            localStorage.setItem(
                "SnakeHighScore",
                String(highScore)
            );
        }


        // Increase speed gradually

        speed =
            Math.max(
                45,
                speed - 2
            );


        placeFood();

        updateScore();

    } else {

        // Normal movement:
        // remove the last body segment

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


    // --------------------------------------------------------
    // Game-over overlay
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // Background
    // --------------------------------------------------------

    ctx.fillStyle = LCD;


    ctx.fillRect(
        0,
        0,
        BOARD_SIZE,
        BOARD_SIZE
    );


    // --------------------------------------------------------
    // LCD GRID
    // --------------------------------------------------------

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


        // Vertical line

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


        // Horizontal line

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


    // --------------------------------------------------------
    // FOOD
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // SNAKE
    // --------------------------------------------------------

    snake.forEach(
        (part, index) => {

            ctx.fillStyle = DARK;


            const padding =
                index === 0
                    ? 1
                    : 3;


            ctx.fillRect(
                part.x * GRID + padding,
                part.y * GRID + padding,
                GRID - padding * 2,
                GRID - padding * 2
            );
        }
    );


    // --------------------------------------------------------
    // SNAKE HEAD / EYES
    // --------------------------------------------------------

    if (snake.length > 0) {

        const head =
            snake[0];


        ctx.fillStyle = LCD;


        const eyeSize = 3;


        // Moving right or standing still
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

            // Moving left

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
// MAIN GAME LOOP
// ============================================================

function gameLoop(timestamp) {

    if (!running) {
        return;
    }


    // --------------------------------------------------------
    // Update game at the current speed
    // --------------------------------------------------------

    if (
        timestamp - lastUpdate >= speed
    ) {

        update();

        lastUpdate =
            timestamp;
    }


    // --------------------------------------------------------
    // Blink food
    // --------------------------------------------------------

    if (
        timestamp - lastFoodBlink >= FOOD_BLINK_SPEED
    ) {

        foodVisible =
            !foodVisible;

        lastFoodBlink =
            timestamp;
    }


    // --------------------------------------------------------
    // Draw
    // --------------------------------------------------------

    draw();


    // --------------------------------------------------------
    // Continue animation
    // --------------------------------------------------------

    animationFrame =
        requestAnimationFrame(gameLoop);
}


// ============================================================
// INITIALIZE
// ============================================================

resetGame();

showIntro();
