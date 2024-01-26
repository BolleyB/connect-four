const gameBoardEl = document.querySelector("#board-wrapper");
const colEls = [...gameBoardEl.children];
const winMsgEl = document.querySelector("#win-message");
const startBtn = document.querySelector("#start-btn");
const resetBtn = document.querySelector("#reset-btn");

// State
let gameOngoing = false;
const gameBoard = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null]
];

const players = [1, 2];
let playerTurn = 1;
let winner = null;
let moves = 0;

// Events
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);

function startGame() {
    gameOngoing = true;
    winner = null;
    moves = 0;
    clearBoard();
    render();
    winMsgEl.textContent = "";
}

function resetGame() {
    console.log("Reset button clicked");
    gameOngoing = false;
    winner = null;
    moves = 0;
    clearBoard();
    winMsgEl.textContent = "";
    // Show the start button and hide the reset button
    startBtn.style.display = "block";
    resetBtn.style.display = "none";
}


gameBoardEl.addEventListener("click", function (e) {
    if (!gameOngoing) return; // Stop making moves if the game is not ongoing
    if (e.target.className !== 'cell') return;

    const col = e.target.parentElement;
    addChipToBoard(col.getAttribute("data-num"));
});

function addChipToBoard(colNum) {
    const gameBoardCol = gameBoard[colNum];
    let counter = 0;

    for (let cell of gameBoardCol) {
        if (cell === null) {
            gameBoardCol[counter] = playerTurn;
            moves++;
            checkWinner(colNum, counter);
            togglePlayer();
            render();

            if (winner) {
                gameOngoing = false;
                winMsgEl.textContent = `Player ${winner} wins!`;
            }

            break;
        }
        counter++;
    }

    if (moves === gameBoard.length * gameBoard[0].length && !winner) {
        gameOngoing = false;
        winMsgEl.textContent = 'It\'s a tie!';
    }
}

function togglePlayer() {
    playerTurn = (playerTurn === players[0]) ? players[1] : players[0];
}

function checkWinner(col, row) {
    const currentPlayer = gameBoard[col][row];

    // Check horizontally
    let count = 1;

    // Check to the left
    for (let i = col - 1; i >= 0 && gameBoard[i][row] === currentPlayer; i--) {
        count++;
    }

    // Check to the right
    for (let i = col + 1; i < gameBoard.length && gameBoard[i] && gameBoard[i][row] === currentPlayer; i++) {
        count++;
    }

    if (count >= 4) {
        winner = currentPlayer;
        return;
    }

    // Check vertically
    count = 1;

    // Check downward
    for (let i = row + 1; i < gameBoard[col].length && gameBoard[col][i] === currentPlayer; i++) {
        count++;
    }

    if (count >= 4) {
        winner = currentPlayer;
        return;
    }

    // Check diagonally (from top-left to bottom-right)
    count = 1;

    // Check upward-left
    for (let i = col - 1, j = row - 1; i >= 0 && j >= 0 && gameBoard[i] && gameBoard[i][j] === currentPlayer; i--, j--) {
        count++;
    }

    // Check downward-right
    for (let i = col + 1, j = row + 1; i < gameBoard.length && gameBoard[i] && gameBoard[i][j] === currentPlayer; i++, j++) {
        count++;
    }

    if (count >= 4) {
        winner = currentPlayer;
        return;
    }

    // Check diagonally (from top-right to bottom-left)
    count = 1;

    // Check upward-right
    for (let i = col + 1, j = row - 1; i < gameBoard.length && gameBoard[i] && gameBoard[i][j] === currentPlayer; i++, j--) {
        count++;
    }

    // Check downward-left
    for (let i = col - 1, j = row + 1; i >= 0 && gameBoard[i] && gameBoard[i][j] === currentPlayer; i--, j++) {
        count++;
    }

    if (count >= 4) {
        winner = currentPlayer;
        return;
    }
}


function render() {
    colEls.forEach(function (col, colIdx) {
        const colArr = [...col.children];

        colArr.forEach(function (cell, cellIdx) {
            const currentRow = colArr.length - 1 - cellIdx;

            if (gameBoard[colIdx][currentRow] !== null) {
                const color = gameBoard[colIdx][currentRow] === 1 ? "red" : "yellow";
                cell.style.backgroundColor = color;
            } else {
                // Clear the cell color if it's null
                cell.style.backgroundColor = "";
            }
        });
    });
}

function clearBoard() {
    gameBoard.forEach((col) => col.fill(null));
    render();
}
