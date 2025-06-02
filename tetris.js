import BLOCKS from "./block.js";

// DOM Elements
const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game-text > button");

// Game Configuration
const GAME_CONFIG = {
    ROWS: 20,
    COLS: 10,
    INITIAL_DURATION: 500,
    SPEED_INCREASE_INTERVAL: 10, // Points needed for speed increase
    SPEED_INCREASE_AMOUNT: 50,   // How much to decrease duration
    INITIAL_BLOCK_POSITION: 3    // Starting position for new blocks
};

// Game State
let gameState = {
    score: 0,
    duration: GAME_CONFIG.INITIAL_DURATION,
    downInterval: null
};

// Moving Block State
const movingItem = {
    type: "tree",
    direction: 1,
    top: 0,
    left: 0
};

let tempMovingItem;

// Game Initialization
function init() {
    tempMovingItem = { ...movingItem };
    initializePlayground();
    generateNewBlock();
}

function initializePlayground() {
    for(let i = 0; i < GAME_CONFIG.ROWS; i++) {
        prependNewLine();
    }
}

// Playground Management
function prependNewLine() {
    const li = document.createElement("li");
    const ul = document.createElement("ul");

    for(let j = 0; j < GAME_CONFIG.COLS; j++) {
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }

    li.prepend(ul);
    playground.prepend(li);
}

// Block Management
function renderBlocks(moveType = "") {
    const { type, direction, top, left } = tempMovingItem;
    
    // Remove previous block position
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    });

    // Render new block position
    const isCollision = BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y]?.childNodes[0].childNodes[x];
        const isAvailable = checkEmpty(target);

        if (isAvailable) {
            target.classList.add(type, "moving");
            return false;
        }
        
        handleCollision(moveType);
        return true;
    });

    if (!isCollision) {
        updateMovingItemPosition(left, top, direction);
    }
}

function handleCollision(moveType) {
    tempMovingItem = { ...movingItem };
    
    if (moveType === 'retry') {
        clearInterval(gameState.downInterval);
        showGameOverText();
    }

    setTimeout(() => {
        renderBlocks('retry');
        if (moveType === "top") {
            seizeBlock();
        }
    }, 0);
}

function updateMovingItemPosition(left, top, direction) {
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}

// Block Actions
function seizeBlock() {
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    });
    checkMatch();
}

function checkMatch() {
    const childNodes = playground.childNodes;
    childNodes.forEach(child => {
        if (isRowComplete(child)) {
            handleCompletedRow(child);
        }
    });
    generateNewBlock();
}

function isRowComplete(row) {
    let matched = true;
    row.children[0].childNodes.forEach(li => {
        if (!li.classList.contains("seized")) {
            matched = false;
        }
    });
    return matched;
}

function handleCompletedRow(row) {
    row.remove();
    prependNewLine();
    updateScore();
}

function updateScore() {
    gameState.score++;
    scoreDisplay.innerText = gameState.score;
}

function generateNewBlock() {
    clearInterval(gameState.downInterval);
    updateGameSpeed();
    
    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length);

    // Reset block position
    movingItem.type = blockArray[randomIndex][0];
    movingItem.top = 0;
    movingItem.left = GAME_CONFIG.INITIAL_BLOCK_POSITION;
    movingItem.direction = 0;

    tempMovingItem = { ...movingItem };
    renderBlocks();
}

function updateGameSpeed() {
    if (gameState.score > 0 && gameState.score % GAME_CONFIG.SPEED_INCREASE_INTERVAL === 0) {
        gameState.duration -= GAME_CONFIG.SPEED_INCREASE_AMOUNT;
    }

    gameState.downInterval = setInterval(() => {
        moveBlock('top', 1);
    }, gameState.duration);
}

// Utility Functions
function checkEmpty(target) {
    return target && !target.classList.contains("seized");
}

function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
}

function changeDirection() {
    const direction = tempMovingItem.direction;
    tempMovingItem.direction = direction === 3 ? 0 : direction + 1;
    renderBlocks();
}

function dropBlock() {
    clearInterval(gameState.downInterval);
    gameState.downInterval = setInterval(() => {
        moveBlock("top", 1);
    }, 10);
}

function showGameOverText() {
    gameText.style.display = "flex";
}

// Event Handlers
document.addEventListener("keydown", e => {
    const keyActions = {
        39: () => moveBlock("left", 1),    // Right Arrow
        37: () => moveBlock("left", -1),   // Left Arrow
        40: () => moveBlock("top", 1),     // Down Arrow
        38: () => changeDirection(),        // Up Arrow
        16: () => dropBlock()              // Shift
    };

    const action = keyActions[e.keyCode];
    if (action) action();
});

restartButton.addEventListener("click", () => {
    playground.innerHTML = "";
    gameText.style.display = "none";
    gameState.score = 0;
    gameState.duration = GAME_CONFIG.INITIAL_DURATION;
    init();
});

// Initialize game
init(); 