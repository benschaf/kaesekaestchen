function init() {
    document.getElementById('player1').style.backgroundColor = 'rgba(185, 252, 134, 0.2)';
    createGrid();
}

/**
 * Creates a grid of div elements and appends them to the gameboard div.
 * 
 * Adds a click event listener to each border div.
 * 
 * Runs the tick function when a border div is clicked.
 */
function createGrid() {
    let gameboard = document.getElementById('gameboard');
    const size = 6;
    const scale = 30;

    gameboard.style.width = scale * (size * 2 + 1) + size * 6 + 'px';
    gameboard.style.height = scale * (size * 2 + 1) + size * 6 + 'px';

    let grid = [];
    for (let i = 0; i <= size; i++) {
        for (let j = 0; j <= size; j++) {
            let div = createDiv(i, j, scale);
            grid.push(div);
            gameboard.appendChild(div);
        }
    }
    for (let div of grid) {
        if (div.gridElementType === 'border') {
            div.addEventListener('click', function () {
                this.style.backgroundColor = '#03DAC6';
                this.drawn = true;
                tick(grid);
            });

        }
    }
}


function tick(grid) {
    computeLastTurn(grid);
    let nextTurn;
    if (document.getElementById('player1').style.backgroundColor === 'rgba(185, 252, 134, 0.2)') {
        nextTurn = true;
    } else {
        nextTurn = false;
    }
    // if its the computer's turn, run the computer's turn function
    if (nextTurn) {
        console.log('player turn');
    } else {
        computerTurn(grid);
    }
}

function computerTurn(grid) {
    //let difficulty = document.getElementById('difficulty').value;
    let difficulty = 'medium';
    console.log('computer turn');
    let availableBorders = [];
    let drawnBorders = [];
    for (let border of grid) {
        if (border.gridElementType === 'border') {
            if (!border.drawn) {
                availableBorders.push(border);
            } else {
                drawnBorders.push(border);
            }
        }
    }
    if (difficulty === 'easy') {
        let randomBorder = Math.floor(Math.random() * availableBorders.length);
        availableBorders[randomBorder].style.backgroundColor = '#03DAC6';
        availableBorders[randomBorder].drawn = true;
    } else if (difficulty === 'medium') {
        let turnMade = false;
        while (!turnMade) {
            for (let avaliableBorder of availableBorders) {
                let topCellBorderCount = 0;
                let bottomCellBorderCount = 0;
                if (avaliableBorder.xVal % 2 === 1 && avaliableBorder.yVal % 2 === 0) { // border is horizontal
                    for (let drawnBorder of grid) {
                        if (drawnBorder.drawn) {
                            if (drawnBorder.yVal === avaliableBorder.yVal + 2 && drawnBorder.xVal === avaliableBorder.xVal) { // checks if the border is above the cell
                                topCellBorderCount++;
                            } else if (drawnBorder.yVal === avaliableBorder.yVal + 1 && drawnBorder.xVal === avaliableBorder.xVal - 1) { // checks if the border is to the right of the top cell
                                topCellBorderCount++;
                            } else if (drawnBorder.yVal === avaliableBorder.yVal + 1 && drawnBorder.xVal === avaliableBorder.xVal + 1) { // checks if the border is to the left of the top cell
                                topCellBorderCount++;
                            } else if (drawnBorder.yVal === avaliableBorder.yVal - 2 && drawnBorder.xVal === avaliableBorder.xVal) { // checks if the border is below the cell
                                bottomCellBorderCount++;
                            } else if (drawnBorder.yVal === avaliableBorder.yVal - 1 && drawnBorder.xVal === avaliableBorder.xVal - 1) { // checks if the border is to the right of the bottom cell
                                bottomCellBorderCount++;
                            } else if (drawnBorder.yVal === avaliableBorder.yVal - 1 && drawnBorder.xVal === avaliableBorder.xVal + 1) { // checks if the border is to the left of the bottom cell
                                bottomCellBorderCount++;
                            }
                        }
                    }
                } else if (avaliableBorder.xVal % 2 === 0 && avaliableBorder.yVal % 2 === 1) { // border is vertical
                    for (let drawnBorder of grid) {
                        if (drawnBorder.drawn) {
                            if (drawnBorder.xVal === avaliableBorder.xVal + 2 && drawnBorder.yVal === avaliableBorder.yVal) { // checks if the border is to the right of the cell
                                topCellBorderCount++;
                            } else if (drawnBorder.xVal === avaliableBorder.xVal + 1 && drawnBorder.yVal === avaliableBorder.yVal - 1) { // checks if the border is above the right cell
                                topCellBorderCount++;
                            } else if (drawnBorder.xVal === avaliableBorder.xVal + 1 && drawnBorder.yVal === avaliableBorder.yVal + 1) { // checks if the border is below the right cell
                                topCellBorderCount++;
                            } else if (drawnBorder.xVal === avaliableBorder.xVal - 2 && drawnBorder.yVal === avaliableBorder.yVal) { // checks if the border is to the left of the cell
                                bottomCellBorderCount++;
                            } else if (drawnBorder.xVal === avaliableBorder.xVal - 1 && drawnBorder.yVal === avaliableBorder.yVal - 1) { // checks if the border is above the left cell
                                bottomCellBorderCount++;
                            } else if (drawnBorder.xVal === avaliableBorder.xVal - 1 && drawnBorder.yVal === avaliableBorder.yVal + 1) { // checks if the border is below the left cell
                                bottomCellBorderCount++;
                            }
                        }
                    }
                }
                if (topCellBorderCount === 3 || bottomCellBorderCount === 3) {
                    avaliableBorder.style.backgroundColor = '#03DAC6';
                    avaliableBorder.drawn = true;
                    turnMade = true;
                    break;
                } else if (topCellBorderCount === 2 || bottomCellBorderCount === 2) {
                    let index = availableBorders.indexOf(avaliableBorder);
                    availableBorders.splice(index, 1);
                }
            }
            if (!turnMade) {
                let randomBorder = Math.floor(Math.random() * availableBorders.length);
                availableBorders[randomBorder].style.backgroundColor = '#03DAC6';
                availableBorders[randomBorder].drawn = true;
                turnMade = true;
            }
        }
    }
    tick(grid);
}

/**
 * Checks if any cell has 4 (or more) drawn borders around it. 
 * If it does, it changes the background color of the cell to green.
 * 
 * @param {Array} grid - The gameboard grid of div elements.
 */
function computeLastTurn(grid) {
    let cellCount = 0;
    let filledCells = 0;
    let turn; //true = player, false = AI Opponent
    if (document.getElementById('player1').style.backgroundColor === 'rgba(185, 252, 134, 0.2)') {
        turn = true;
    } else {
        turn = false;
    }
    let switchTurn = true;
    // iterates through all the elements in the grid and only checks the cells
    for (let cell of grid) {
        if (cell.gridElementType === 'cell') {
            cellCount++;
            let currentX = cell.xVal;
            let currentY = cell.yVal;
            let drawnBorders = 0;
            // iterates through all the elements in the grid and counts the number of drawn borders around the cell
            for (let border of grid) {
                if (border.gridElementType === 'border') {
                    if (border.xVal + 1 === currentX && border.yVal === currentY) { // checks if the border is to the right of the cell
                        if (border.drawn) {
                            drawnBorders++;
                        }
                    } else if (border.xVal - 1 === currentX && border.yVal === currentY) { // checks if the border is to the left of the cell
                        if (border.drawn) {
                            drawnBorders++;
                        }
                    } else if (border.xVal === currentX && border.yVal + 1 === currentY) { // checks if the border is above the cell
                        if (border.drawn) {
                            drawnBorders++;
                        }
                    } else if (border.xVal === currentX && border.yVal - 1 === currentY) { // checks if the border is below the cell
                        if (border.drawn) {
                            drawnBorders++;
                        }
                    }
                }
            }
            if (drawnBorders > 3) {
                filledCells++;
                if (cell.style.backgroundColor === 'rgb(30, 30, 30)') {
                    if (turn) {
                        cell.style.backgroundColor = 'rgba(185, 252, 134, 0.7)';
                        let playerScore = document.getElementById('player-score').innerHTML;
                        playerScore++;
                        document.getElementById('player-score').innerHTML = playerScore;
                        switchTurn = false;
                    } else {
                        cell.style.backgroundColor = 'rgba(252, 134, 185, 0.7)';
                        let aiScore = document.getElementById('ai-score').innerHTML;
                        aiScore++;
                        document.getElementById('ai-score').innerHTML = aiScore;
                        switchTurn = false;
                    }
                }
            }
        }
    }
    if (switchTurn) {
        trun = !turn;
        if (document.getElementById('player1').style.backgroundColor === 'rgba(185, 252, 134, 0.2)') {
            document.getElementById('player1').style.backgroundColor = 'initial';
            document.getElementById('player2').style.backgroundColor = 'rgba(185, 252, 134, 0.2)';
        } else if (document.getElementById('player2').style.backgroundColor === 'rgba(185, 252, 134, 0.2)') {
            document.getElementById('player2').style.backgroundColor = 'initial';
            document.getElementById('player1').style.backgroundColor = 'rgba(185, 252, 134, 0.2)';
        }
    }
    if (filledCells === cellCount) {
        if (document.getElementById('player-score').innerHTML > document.getElementById('ai-score').innerHTML) {
            alert('Player Wins!');
        } else if (document.getElementById('player-score').innerHTML < document.getElementById('ai-score').innerHTML) {
            alert('AI Wins!');
        } else {
            alert('Tie!');
        }
    }
}

/**
 * Creates a div element with specified x and y values. 
 * Depending on if the x and y values are even or odd, 
 * the div will have a different color and size.
 * 
 * @param {number} x - The x value.
 * @param {number} y - The y value.
 * @param {number} scale - The scale of the gameboard.
 * @returns {HTMLDivElement} - The created div element.
 */
function createDiv(y, x, scale) {
    let div = document.createElement('div');
    div.xVal = x;
    div.yVal = y;

    div.style.margin = '2px';

    if (x % 2 === 0 && y % 2 === 1) { // div is a horizontal border
        div.style.backgroundColor = '#444444';
        div.style.borderRadius = scale + 'px';
        div.style.boxShadow = "inset 0 0 10px rgba(255, 255, 255, 0.5)";
        div.gridElementType = 'border';
        div.style.width = scale + "px";
        div.style.height = scale * 3 + "px";
        return div;
    } else if (x % 2 === 1 && y % 2 === 1) { // div is a cell
        div.style.backgroundColor = '#1E1E1E';
        div.style.borderRadius = scale + 'px';
        div.gridElementType = 'cell';
        div.style.width = scale * 3 + "px";
        div.style.height = scale * 3 + "px";
        return div;
    } else if (x % 2 === 1 && y % 2 === 0) { // div is a vertical border
        div.style.backgroundColor = '#444444';
        div.style.borderRadius = scale + 'px';
        div.style.boxShadow = "inset 0 0 10px rgba(255, 255, 255, 0.5)";
        div.gridElementType = 'border';
        div.style.width = scale * 3 + "px";
        div.style.height = scale + "px";
        return div;
    } else { // div is a corner
        div.style.backgroundColor = '#101010';
        div.style.borderRadius = '50%';
        div.style.boxShadow = "inset 0 0 10px rgba(255, 255, 255, 0.5)";
        div.gridElementType = 'corner';
        div.style.width = scale + "px";
        div.style.height = scale + "px";
        return div;
    }
}

init();