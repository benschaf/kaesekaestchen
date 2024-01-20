/**
 * Creates a grid of div elements and appends them to the gameboard div.
 * 
 * Adds a click event listener to each border div.
 * 
 * Runs the tick function when a border div is clicked.
 */
function init(playerName, goesFirst, gridSize) {
    document.getElementById('gameboard').innerHTML = '';
    if (goesFirst) {
        document.getElementById('player1').style.backgroundColor = 'rgba(185, 252, 134, 0.2)';
        document.getElementById('player2').style.backgroundColor = 'initial';
    } else {
        document.getElementById('player2').style.backgroundColor = 'rgba(252, 134, 185, 0.2)';
        document.getElementById('player1').style.backgroundColor = 'initial';
    }
    if (playerName === '') {
        playerName = 'Player';
    }
    document.getElementById('player-name-label').innerHTML = playerName;

    let gameboard = document.getElementById('gameboard');
    const size = gridSize;
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
                //check if the border has already been drawn
                if (div.drawn || document.getElementById('player1').style.backgroundColor === 'initial') {
                    return;
                } else {
                    drawBorder(div);
                    tick(grid);
                }
            });

        }
    }
}

function drawBorder(border) {
    //mark the border as drawn with inset shadow
    border.style.boxShadow = "inset 0 0 15px rgba(3, 218, 198)";
    border.drawn = true;
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculates the computer's next move based on the difficulty.
 * 
 * easy:   randomly selects a border to draw
 * medium: checks if any cell has 3 drawn borders around it. If it does, it draws the 4th border.
 *         if a celll has 2 drawn borders around it, it removes that border from the available borders (so it doesn't draw it)
 *         if no cell has 3 drawn borders around it, it randomly selects a border to draw.
 * 
 * Credits for async/await functionality: https://www.sitepoint.com/delay-sleep-pause-wait/
 * 
 * @param {Array} grid
 */
async function computerTurn(grid) {
    //let difficulty = document.getElementById('difficulty').value;
    let difficulty = 'medium';
    console.log('computer turn');
    let availableBorders = [];
    for (let border of grid) {
        if (border.gridElementType === 'border') {
            if (!border.drawn) {
                availableBorders.push(border);
            }
        }
    }

    if (difficulty === 'easy') {
        let randomBorder = Math.floor(Math.random() * availableBorders.length);
        drawBorder(availableBorders[randomBorder]);
    } else if (difficulty === 'medium') block1: {
        //cycle through avaliable borders
        let leftOverBorders = availableBorders.slice(); // Create a separate copy of the avaliable borders array as opposed to just a reference to it, so they can be treated separately. Cretits to https://stackoverflow.com/questions/6612385/why-does-changing-an-array-in-javascript-affect-copies-of-the-array
        for (let availableBorder of availableBorders) {
            let adjacentCellsBorderCount = [0, 0];
            //check if the border is horizontal or vertical
            if (availableBorder.xVal % 2 === 1 && availableBorder.yVal % 2 === 0) { // border is horizontal
                //check for adjacent cells
                let cellAbove;
                let cellBelow;
                cellAbove = getDivByXY(availableBorder.xVal, availableBorder.yVal - 1, grid);
                cellBelow = getDivByXY(availableBorder.xVal, availableBorder.yVal + 1, grid);
                if (cellAbove !== null) {
                    let borderCount = countDrawnBorders(cellAbove, grid);
                    adjacentCellsBorderCount[0] = borderCount;
                }
                if (cellBelow !== null) {
                    let borderCount = countDrawnBorders(cellBelow, grid);
                    adjacentCellsBorderCount[1] = borderCount;
                }
            } else if (availableBorder.xVal % 2 === 0 && availableBorder.yVal % 2 === 1) { // border is vertical
                //check for adjacent cells
                let cellLeft;
                let cellRight;
                cellLeft = getDivByXY(availableBorder.xVal - 1, availableBorder.yVal, grid);
                cellRight = getDivByXY(availableBorder.xVal + 1, availableBorder.yVal, grid);
                //check how many borders are drawn around each adjacent cell
                if (cellLeft !== null) {
                    let borderCount = countDrawnBorders(cellLeft, grid);
                    adjacentCellsBorderCount[0] = borderCount;
                }
                if (cellRight !== null) {
                    let borderCount = countDrawnBorders(cellRight, grid);
                    adjacentCellsBorderCount[1] = borderCount;
                }
            }
            //if a cell has 3 drawn borders, draw the 4th border
            if (adjacentCellsBorderCount[0] === 3 || adjacentCellsBorderCount[1] === 3) {
                await sleep(1000);
                drawBorder(availableBorder);
                break block1;
            }
            //if a cell has 2 drawn borders, remove that border from the available borders
            if (adjacentCellsBorderCount[0] === 2 || adjacentCellsBorderCount[1] === 2) {
                let index;
                index = leftOverBorders.indexOf(availableBorder);
                leftOverBorders.splice(index, 1);
                console.log('removed');
            }
        }
        //if no cell has 3 or two drawn borders, randomly select a border to draw
        if (leftOverBorders.length === 0) { // if there are only borders with 2 drawn borders around them, draw one of them
            let randomBorder = Math.floor(Math.random() * availableBorders.length);
            await sleep(1000);
            drawBorder(availableBorders[randomBorder]);
        } else {
            let randomBorder = Math.floor(Math.random() * leftOverBorders.length);
            await sleep(1000);
            drawBorder(leftOverBorders[randomBorder]);
        }
    }
    tick(grid);
}

function getDivByXY(x, y, grid) {
    for (let div of grid) {
        if (div.xVal === x && div.yVal === y) {
            return div;
        }
    }
    return null;
}

function countDrawnBorders(cell, grid) {
    let drawnBorders = 0;
    for (let border of grid) {
        if (border.gridElementType === 'border') {
            if (border.xVal + 1 === cell.xVal && border.yVal === cell.yVal) { // checks if the border is to the right of the cell
                if (border.drawn) {
                    drawnBorders++;
                }
            } else if (border.xVal - 1 === cell.xVal && border.yVal === cell.yVal) { // checks if the border is to the left of the cell
                if (border.drawn) {
                    drawnBorders++;
                }
            } else if (border.xVal === cell.xVal && border.yVal + 1 === cell.yVal) { // checks if the border is below the cell
                if (border.drawn) {
                    drawnBorders++;
                }
            } else if (border.xVal === cell.xVal && border.yVal - 1 === cell.yVal) { // checks if the border is above the cell
                if (border.drawn) {
                    drawnBorders++;
                }
            }
        }
    }
    return drawnBorders;
}

/**
 * Checks if any cell has 4 (or more) drawn borders around it. 
 * If it does, it changes the background color of the cell to green.
 * 
 * @param {Array} grid - The gameboard grid of div elements.
 */
function computeLastTurn(grid) {
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
                if (cell.style.backgroundColor === 'rgb(30, 30, 30)') {
                    if (turn) {
                        cell.style.backgroundColor = 'unset';
                        cell.style.boxShadow = 'inset 0 0 60px rgba(185, 252, 134)';

                        let blurBackgroundElement = document.createElement('div');
                        blurBackgroundElement.style.position = 'absolute';

                        let rect = cell.getBoundingClientRect();
                        blurBackgroundElement.style.top = rect.top + 'px';
                        blurBackgroundElement.style.left = rect.left + 'px';

                        blurBackgroundElement.style.width = 30 * 3 + 'px';
                        blurBackgroundElement.style.height = 30 * 3 + 'px';
                        blurBackgroundElement.style.borderRadius = 'cell.style.borderRadius';
                        blurBackgroundElement.style.backgroundColor = 'rgba(185, 252, 134)';
                        blurBackgroundElement.style.zIndex = '-1';
                        blurBackgroundElement.style.filter = 'blur(100px)';
                        document.getElementById('gameboard').appendChild(blurBackgroundElement);

                        let playerScore = document.getElementById('player-score').innerHTML;
                        playerScore++;
                        document.getElementById('player-score').innerHTML = playerScore;
                        switchTurn = false;
                    } else {
                        cell.style.backgroundColor = 'unset';
                        cell.style.boxShadow = 'inset 0 0 60px rgba(252, 134, 185)';

                        let blurBackgroundElement = document.createElement('div');
                        blurBackgroundElement.style.position = 'absolute';

                        let rect = cell.getBoundingClientRect();
                        blurBackgroundElement.style.top = rect.top + 'px';
                        blurBackgroundElement.style.left = rect.left + 'px';

                        blurBackgroundElement.style.width = 30 * 3 + 'px';
                        blurBackgroundElement.style.height = 30 * 3 + 'px';
                        blurBackgroundElement.style.borderRadius = 'cell.style.borderRadius';
                        blurBackgroundElement.style.backgroundColor = 'rgba(252, 134, 185)';
                        blurBackgroundElement.style.zIndex = '-1';
                        blurBackgroundElement.style.filter = 'blur(100px)';
                        document.getElementById('gameboard').appendChild(blurBackgroundElement);

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
            document.getElementById('player2').style.backgroundColor = 'rgba(252, 134, 185, 0.2)';
        } else if (document.getElementById('player2').style.backgroundColor === 'rgba(252, 134, 185, 0.2)') {
            document.getElementById('player2').style.backgroundColor = 'initial';
            document.getElementById('player1').style.backgroundColor = 'rgba(185, 252, 134, 0.2)';
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



document.addEventListener('DOMContentLoaded', function () {
    // Get references to the elements
    let playerNameInput = document.getElementById('player-name');
    let playerTurnRadio = document.getElementById('player-turn');
    let aiTurnRadio = document.getElementById('ai-turn');
    let gridSizeInput = document.getElementById('grid-size');
    let gridSizeValueSpan = document.getElementById('grid-size-value');
    let startGameButton = document.getElementById('start-game');

    // Update the grid size value display when the grid size input changes
    gridSizeInput.addEventListener('input', function () {
        gridSizeValueSpan.textContent = gridSizeInput.value + ' x ' + gridSizeInput.value;
    });

    // Start a new game when the start game button is clicked
    startGameButton.addEventListener('click', function () {
        let playerName = playerNameInput.value;
        let goesFirst = playerTurnRadio.checked;
        let gridSize = gridSizeInput.value * 2;

        init(playerName, goesFirst, gridSize);
    });

    init('Player', true, 6);
});