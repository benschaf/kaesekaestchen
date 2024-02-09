/* jshint esversion: 11 */
/*
functions for gameboard responsiveness
*/

/**
 * Resizes the gameboard grid.
 * 
 * @param {Array} grid - The gameboard grid of div elements.
 * @param {number} scale - The scale to resize the grid to.
 * @param {number} gridSize - The size of the gameboard.
 */
function resizeGrid(grid, scale, gridSize) {
    let originalScale = parseInt(grid[0].style.width);
    let gameboard = document.getElementById('gameboard');
    // Formula for determining grid width and height. Total width of the gameboard: width of all divs + 2px border on each side of each div
    let gameboardSideLength = scale * (gridSize * 2 + 1) + 2 * 2 * (gridSize + 1);

    gameboard.style.width = gameboardSideLength + 'px';
    gameboard.style.height = gameboardSideLength + 'px';

    for (let div of grid) {
        let newWidth = parseInt(div.style.width) * scale / originalScale + 'px';
        let newHeight = parseInt(div.style.height) * scale / originalScale + 'px';
        div.style.width = newWidth;
        div.style.height = newHeight;
        div.style.borderRadius = scale + 'px';

        if (div.className === 'corner') {
            let newBlurRadius = parseInt(div.style.width) / 2 + 'px';
            div.style.boxShadow = "inset 0 0 " + newBlurRadius + " rgba(255, 255, 255, 0.5)";
        }
    }
}

/**
 * Rescales the gameboard based on the size of the window and game-area div.
 * Since the gameboard is a square, the gameboard will always be the size of the dimension with less space (horizontal or vertical).
 * 
 * @param {Array} grid - The gameboard grid of div elements.
 * @param {number} gridSize - The size of the gameboard.
 */
function rescaleGameboard(grid, gridSize) {
    let scale;
    const verticalSpace = document.documentElement.clientHeight / 100 * 70;
    if (window.innerWidth >= 1440) {
        // 8/12th of the width of the game-area to allow space for the scores and options cards
        const largeHorizontalSpace = (document.getElementById('game-area').offsetWidth / 12 * 8);
        if (largeHorizontalSpace < verticalSpace) {
            scale = parseInt(largeHorizontalSpace / (gridSize * 2 + 1) - 2);
        } else {
            scale = parseInt(verticalSpace / (gridSize * 2 + 1) - 2);
        }
    } else {
        // Horizontal width - 32px (16px padding on each side)
        const smallHorizontalSpace = document.getElementById('game-area').offsetWidth - 32;
        if (smallHorizontalSpace < verticalSpace) {
            scale = parseInt(smallHorizontalSpace / (gridSize * 2 + 1) - 2);
        } else {
            scale = parseInt(verticalSpace / (gridSize * 2 + 1) - 2);
        }
    }
    resizeGrid(grid, scale, gridSize);
}

/*
functions for the AI. 
*/


/**
 * Determines which borders are available to draw.
 * 
 * @param {Array} grid - The gameboard grid of div elements.
 * @returns {Array} avaliableBorders - The available borders to draw.
 */
function determineAvaliableBorders(grid) {
    let availableBorders = [];
    for (let border of grid) {
        if (border.className === 'border') {
            if (!border.drawn) {
                availableBorders.push(border);
            }
        }
    }
    return availableBorders;
}

/**
 * Redraws the highlighted border so it looks like the rest of the drawn borders.
 * 
 * @param {Array} grid - The gameboard grid of div elements.
 */
function redrawHighlightedBorder(grid) {
    for (let border of grid) {
        if (border.highlighted) {
            border.style.boxShadow = "inset 0 0 15px rgba(3, 218, 198)";
            border.highlighted = false;
        }
    }
}

/**
 * Marks a border as drawn by applying an inset shadow.
 * Changes the drawn property of the border to true.
 * 
 * @param {HTMLDivElement} border - The border to mark as drawn.
 */
function markBorder(border, grid) {
    redrawHighlightedBorder(grid);
    border.style.boxShadow = "inset 0 0 200px rgba(3, 218, 198)";
    border.highlighted = true;
    border.drawn = true;
}

/**
 * Randomly selects a border to draw.
 * 
 * @param {Array} availableBorders - The available borders to choose from.
 */
function easyComputerTurn(availableBorders, grid) {
    let randomBorder = Math.floor(Math.random() * availableBorders.length);
    markBorder(availableBorders[randomBorder], grid);
}

// Credit for return JSdoc syntax: https://stackoverflow.com/questions/65196251/javascript-documentation-returns-null-or-type
/**
 * Gets a div element from the gameboard grid based on its x and y values.
 * 
 * @param {number} x - The x value of the div element.
 * @param {number} y - The y value of the div element.
 * @param {Array} grid - The gameboard grid of div elements.
 * @returns {HTMLDivElement | null} The div element with the specified x and y values. Null if no div element is found.
 */
function getDivByXY(x, y, grid) {
    for (let div of grid) {
        if (div.xVal === x && div.yVal === y) {
            return div;
        }
    }
    return null;
}

/**
 * Returns an array of the cells adjacent to a border.
 * If the border is horizontal, returns the cell above and below the border.
 * If the border is vertical, returns the cell to the left and right of the border.
 * 
 * @param {HTMLDivElement} availableBorder - The border to get the adjacent cells of.
 * @param {Array} grid - The gameboard grid of div elements.
 * @returns {Array} - The cells adjacent to the border.
 */
function getAdjacentCells(availableBorder, grid) {
    let cellAboveOrLeft;
    let cellBelowOrRight;
    if (availableBorder.xVal % 2 === 1 && availableBorder.yVal % 2 === 0) { // border is horizontal
        cellAboveOrLeft = getDivByXY(availableBorder.xVal, availableBorder.yVal - 1, grid);
        cellBelowOrRight = getDivByXY(availableBorder.xVal, availableBorder.yVal + 1, grid);
    } else if (availableBorder.xVal % 2 === 0 && availableBorder.yVal % 2 === 1) { // border is vertical
        cellAboveOrLeft = getDivByXY(availableBorder.xVal - 1, availableBorder.yVal, grid);
        cellBelowOrRight = getDivByXY(availableBorder.xVal + 1, availableBorder.yVal, grid);
    }
    return [cellAboveOrLeft, cellBelowOrRight];
}

/**
 * Counts the number of drawn borders around an Array of cells.
 * 
 * @param {Array} cells - The cells to count the drawn borders around.
 * @param {Array} grid - The gameboard grid of div elements.
 * @returns {Array} - The number of drawn borders around each cell.
 */
function getBorderCounts(cells, grid) {
    let adjacentCellsBorderCount = [0, 0];

    for (let i in cells) {
        if (cells[i] !== null) {
            let borderCount = countDrawnBorders(cells[i], grid);
            adjacentCellsBorderCount[i] = borderCount;
        }
    }

    return adjacentCellsBorderCount;
}

/**
 * Determines which border to draw based on the number of drawn borders around adjacent cells.
 * If a cell has 3 drawn borders, draws the 4th border.
 * If a cell has 2 drawn borders, removes that border from the available borders Array.
 * Draws a random border if no cell has 3 or 2 drawn borders around them.
 * If there are only borders with 2 drawn borders around them, draws one of them (randomly).
 * 
 * @param {Array} availableBorders - The available borders to choose from.
 * @param {Array} grid - The gameboard grid of div elements.
 */
function mediumComputerTurn(availableBorders, grid) {
    // Create a separate copy of the avaliable borders array as opposed to just a reference to it, so they can be treated separately. 
    //Credit: https://stackoverflow.com/questions/6612385/why-does-changing-an-array-in-javascript-affect-copies-of-the-array
    let leftOverBorders = availableBorders.slice();

    //cycle through avaliable borders
    for (let availableBorder of availableBorders) {
        //check for border count in each adjacent cell
        let adjacentCells = getAdjacentCells(availableBorder, grid);
        let adjacentCellsBorderCount = getBorderCounts(adjacentCells, grid);

        //if one of the adjacent cells has 3 drawn borders, draw the 4th border
        if (adjacentCellsBorderCount.includes(3)) {
            markBorder(availableBorder, grid);
            return;
        }

        //if one of the adjacent cells has 2 drawn borders, remove that border from the available borders
        if (adjacentCellsBorderCount.includes(2)) {
            let index;
            index = leftOverBorders.indexOf(availableBorder);
            leftOverBorders.splice(index, 1);
        }
    }

    //if no cell has 3 or two drawn borders, randomly select a border to draw
    if (leftOverBorders.length === 0) { // if there are only borders with 2 drawn borders around them, draw one of them
        let randomBorder = Math.floor(Math.random() * availableBorders.length);

        markBorder(availableBorders[randomBorder], grid);
    } else {
        let randomBorder = Math.floor(Math.random() * leftOverBorders.length);

        markBorder(leftOverBorders[randomBorder], grid);
    }
}

/**
 * Displays an AI is playing animation.
 * Determines the difficulty of the AI and calls the appropriate function.
 * Delays the AI's turn by 1 second.
 * Calls tick to update the gameboard.
 * 
 * @param {Array} grid - The gameboard grid of div elements.
 */
function computerTurn(grid) {
    let difficulty = document.getElementById('ai-difficulty').value;
    let availableBorders = determineAvaliableBorders(grid);

    setTimeout(() => {
        if (difficulty === 'easy') {
            easyComputerTurn(availableBorders, grid);
        } else if (difficulty === 'medium') {
            mediumComputerTurn(availableBorders, grid);
        }
        tick(grid);
    }, 1000); // Delay of 1 second
}

/*
gameloop functions. tick() is the main gameloop function that is called every time a border is drawn
*/

/**
 * Determines whose turn it is by checking the background color of the player on the scoreboard.
 * 
 * @returns {boolean} - True if it is the player's turn, false if it is the AI's turn.
 */
function determineTurn() {
    let turn; //true = player, false = AI Opponent
    if (document.getElementById('player1').style.backgroundColor === 'rgba(185, 252, 134, 0.2)') {
        turn = true;
    } else {
        turn = false;
    }
    return turn;
}

// Credit for HTMLDivELement Parameter: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction#dom_interfaces
/**
 * Counts the number of drawn borders around a cell.
 * 
 * @param {HTMLDivElement} cell - The cell to count the drawn borders around.
 * @param {Array} grid - The gameboard grid of div elements.
 * @returns {number} - The number of drawn borders around the cell.
 */
function countDrawnBorders(cell, grid) {
    let currentX = cell.xVal;
    let currentY = cell.yVal;
    let drawnBorders = 0;
    // iterates through all the elements in the grid and counts the number of drawn borders around the cell
    for (let border of grid) {
        if (border.className === 'border') {
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
    return drawnBorders;
}

// Credit for Blur Backgrounds: https://www.w3schools.com/howto/howto_css_blurred_background.asp
/**
 * Creates a blur background element behind a cell.
 * 
 * @param {string} color - The color of the blur background element.
 * @param {HTMLDivElement} cell - The cell to create the blur background element behind.
 * @returns {HTMLDivElement} - The created blur background element.
 */
function createBlurBackgroundElement(color, cell) {
    let gameboard = document.getElementById('gameboard');
    let blurBackgroundElement = document.createElement('div');
    blurBackgroundElement.className = 'blur-background gameboard-blur-background';

    let rect = cell.getBoundingClientRect();
    let gameboardRect = gameboard.getBoundingClientRect();
    blurBackgroundElement.style.top = (rect.top - gameboardRect.top) + 'px';
    blurBackgroundElement.style.left = (rect.left - gameboardRect.left) + 'px';
    blurBackgroundElement.style.width = rect.width + 'px';
    blurBackgroundElement.style.height = rect.height + 'px';
    blurBackgroundElement.style.borderRadius = cell.style.borderRadius;
    blurBackgroundElement.style.backgroundColor = color;
    gameboard.appendChild(blurBackgroundElement);
}

/**
 * Fills a cell with the correct color (boxShadow) based on whose turn it is.
 * Calls createBlurBackgroundElement to create a blur background element behind the cell.
 * 
 * @param {HTMLDivElement} cell - The cell to fill.
 * @param {boolean} turn - True if it is the player's turn, false if it is the AI's turn.
 */
function fillCell(cell, turn) {
    cell.style.backgroundColor = 'unset';
    if (turn) {
        cell.style.boxShadow = 'inset 0 0 60px rgba(185, 252, 134)';
        createBlurBackgroundElement('rgba(185, 252, 134)', cell);
    } else {
        cell.style.boxShadow = 'inset 0 0 60px rgba(252, 134, 185)';
        createBlurBackgroundElement('rgba(252, 134, 185)', cell);
    }
}

/**
 * Adds 1 to the score of the player or the AI on the scoreboard, depending on whose turn it is.
 * 
 * @param {boolean} turn - True if it is the player's turn, false if it is the AI's turn.
 */
function updateScoreboard(turn) {
    if (turn) {
        let playerScore = document.getElementById('player-score').innerHTML;
        playerScore++;
        document.getElementById('player-score').innerHTML = playerScore;
    } else {
        let aiScore = document.getElementById('ai-score').innerHTML;
        aiScore++;
        document.getElementById('ai-score').innerHTML = aiScore;
    }

}

/**
 * Switches the background color of the player and the AI on the scoreboard.
 * Switches the slider indicator to the right or left and changes it's color.
 * Does all of this based on whose turn it is. 
 */
function switchTurns() {
    if (document.getElementById('player1').style.backgroundColor === 'rgba(185, 252, 134, 0.2)') {
        document.getElementById('player1').style.backgroundColor = 'initial';
        document.getElementById('player2').style.backgroundColor = 'rgba(252, 134, 185, 0.2)';
        document.getElementById('slider-indicator').style.animation = 'slideRight 1s forwards';
        document.getElementById('blur-slider-indicator').style.animation = 'slideRight 1s forwards';
    } else if (document.getElementById('player2').style.backgroundColor === 'rgba(252, 134, 185, 0.2)') {
        document.getElementById('player2').style.backgroundColor = 'initial';
        document.getElementById('player1').style.backgroundColor = 'rgba(185, 252, 134, 0.2)';
        document.getElementById('slider-indicator').style.animation = 'slideLeft 1s forwards';
        document.getElementById('blur-slider-indicator').style.animation = 'slideLeft 1s forwards';
    }
}

// Credit for animation: https://www.w3schools.com/cssref/css3_pr_animation.php
/**
 * Creates a light up animation on the player or the AI on the scoreboard to indicate whose turn it is.
 * 
 * @param {boolean} turn - True if it is the player's turn, false if it is the AI's turn.
 */
function indicateTurn(turn) {
    let element;
    if (turn) {
        element = document.getElementById('player1');
    } else {
        element = document.getElementById('player2');
    }
    element.style.animation = `lightUp 1s`;

    setTimeout(function () {
        element.style.animation = 'none';
    }, 1000);
}

/**
 * Removes all highlights from the borders
 * Sets the correct end game message based on the scores.
 * Displays 2 costum alert boxes with the end game message over the gameboard and in the scores card.
 * Removes the alert box over the gameboard after 3 seconds.
 */
function endGame(grid) {
    let playerScore = parseInt(document.getElementById('player-score').innerHTML);
    let aiScore = parseInt(document.getElementById('ai-score').innerHTML);
    let endGameMessage;

    redrawHighlightedBorder(grid);

    if (playerScore > aiScore) {
        endGameMessage = 'You Win!';
    } else if (aiScore > playerScore) {
        endGameMessage = 'You Lose!';
    } else {
        endGameMessage = 'Tie!';
    }
    document.getElementById('game-end-message').innerHTML = endGameMessage;

    let endMessageAlertBox = document.createElement('div');
    endMessageAlertBox.id = 'end-message-alert-box';
    endMessageAlertBox.innerHTML = endGameMessage;
    document.getElementById('gameboard').appendChild(endMessageAlertBox);

    // Credit for setTimeout: https://www.w3schools.com/jsref/met_win_settimeout.asp
    setTimeout(() => {
        endMessageAlertBox.remove();
    }, 3000);
}

/**
 * Fills and counts the cells that have 4 drawn borders around them.
 * Picks the right color to fill each cell with based on whose turn it is.
 * Updates the scores on the scoreboard.
 * Switches turns if no new cells have been filled.
 * Ends game if all cells have been filled.
 * 
 * @param {Array} grid - The gameboard grid of div elements.
 * @returns {boolean} - True if the game is over, false if the game is not over.
 */
function computeLastTurn(grid) {
    let turn = determineTurn();
    let switchTurn = true;
    let filledCells = 0;

    // iterates through all the elements in the grid and only checks the cells
    for (let cell of grid) {
        if (cell.className === 'cell') {
            let drawnBorderCount = countDrawnBorders(cell, grid);
            if (drawnBorderCount > 3) {
                filledCells++;
                if (cell.style.backgroundColor === 'rgb(30, 30, 30)') {
                    fillCell(cell, turn);
                    updateScoreboard(turn);
                    switchTurn = false;
                }
            }
        }
    }

    let totalCells = document.getElementsByClassName('cell').length;
    if (filledCells === totalCells && filledCells !== 0) {
        endGame(grid);
        return true;
    }

    if (switchTurn) {
        switchTurns();
    }
    return false;
}

/**
 * Parent function for the "gameloop" logic
 * Calls computeLastTurn.
 * calls indicateTurn to indicate whose turn it is.
 * If it is the AI's turn, calls computerTurn. Else, does nothing (waits for the player to click a border).
 * 
 * @param {Array} grid - The gameboard grid of div elements.
 */
function tick(grid) {
    let gameOver = computeLastTurn(grid);

    if (gameOver) {
        return;
    }

    let nextTurn;
    if (document.getElementById('player1').style.backgroundColor === 'rgba(185, 252, 134, 0.2)') {
        nextTurn = true;
    } else {
        nextTurn = false;
    }

    indicateTurn(nextTurn);

    if (!nextTurn) {
        computerTurn(grid);
    } else {
        //wait for the player to click a border
    }
}

/*
initializiation functions
*/

/**
 * This will create the gameboard grid.
 * Creates a div element with specified x and y values. 
 * Depending on if the x and y values are even or odd, 
 * the div will have a different color and size.
 * 
 * @param {number} x - The x value.
 * @param {number} y - The y value.
 * @returns {HTMLDivElement} The created div element.
 */
function createDiv(y, x) {
    let scale = 10; //this scale value is only temporary and will be overriden by the rescaleGameboard function
    let div = document.createElement('div');
    div.xVal = x;
    div.yVal = y;

    div.style.margin = 2 + 'px';

    if (x % 2 === 0 && y % 2 === 1) { // div is a horizontal border
        div.style.backgroundColor = '#444444';
        // set the class name. Credit: https://www.w3schools.com/jsref/prop_html_classname.asp
        div.className = 'border';
        div.style.width = scale + "px";
        div.style.height = scale * 3 + "px";
        return div;
    } else if (x % 2 === 1 && y % 2 === 1) { // div is a cell
        div.style.backgroundColor = '#1E1E1E';
        div.className = 'cell';
        div.style.width = scale * 3 + "px";
        div.style.height = scale * 3 + "px";
        return div;
    } else if (x % 2 === 1 && y % 2 === 0) { // div is a vertical border
        div.style.backgroundColor = '#444444';
        div.className = 'border';
        div.style.width = scale * 3 + "px";
        div.style.height = scale + "px";
        return div;
    } else { // div is a corner
        div.style.backgroundColor = '#101010';
        div.className = 'corner';
        div.style.width = scale + "px";
        div.style.height = scale + "px";
        return div;
    }
}

// Credit for JSdoc syntax: https://medium.com/@martink_rsa/js-docs-a-quickstart-guide-da6ce5df4a73
/**
 * Resets all scores on the scores card to 0.
 * Sets the background color of the player or the AI to indicate who goes first.
 * Sets the player name label to the specified name.
 * Sets the difficulty indicator to the specified difficulty.
 * Sets the game end message to an empty string.
 * 
 * @param {string} playerName - The name of the player.
 * @param {boolean} goesFirst - True if the player goes first, false if the AI goes first.
 * @param {string} difficulty - The difficulty of the AI.
 */
function resetScoresCard(playerName, goesFirst, difficulty) {
    document.getElementById('player-score').innerHTML = 0;
    document.getElementById('ai-score').innerHTML = 0;

    if (goesFirst) {
        let playerColor = 'rgba(185, 252, 134, 0.2)';
        document.getElementById('player1').style.backgroundColor = playerColor;
        document.getElementById('player2').style.backgroundColor = 'initial';
    } else if (!goesFirst) {
        let aiColor = 'rgba(252, 134, 185, 0.2)';
        document.getElementById('player2').style.backgroundColor = aiColor;
        document.getElementById('player1').style.backgroundColor = 'initial';
    } // should I write an else statement here to catch any errors?

    if (playerName === '') {
        playerName = 'Player';
    }
    document.getElementById('player-name-label').innerHTML = playerName;
    // Credit: https://flexiple.com/javascript/javascript-capitalize-first-letter
    const difficultyUppercase = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    document.getElementById('difficulty-indicator').innerHTML = difficultyUppercase + ' Difficulty';

    document.getElementById('game-end-message').innerHTML = '';
}
/**
 * Creates a slider indicator to indicate whose turn it is.
 * 
 * @param {boolean} goesFirst - True if the player goes first, false if the AI goes first.  
 */
function createSliderIndicator(goesFirst) {
    let sliderIndicator = document.createElement('div');
    let blurSliderIndicator = document.createElement('div');
    sliderIndicator.id = 'slider-indicator';
    sliderIndicator.className = 'slider';
    blurSliderIndicator.id = 'blur-slider-indicator';
    blurSliderIndicator.className = 'slider';
    if (goesFirst) {
        sliderIndicator.style.backgroundColor = 'var(--player-color-transparent)';
        sliderIndicator.style.left = '1rem';
        blurSliderIndicator.style.backgroundColor = 'var(--player-color-transparent)';
        blurSliderIndicator.style.left = '1rem';
    } else {
        sliderIndicator.style.backgroundColor = 'var(--ai-color-transparent)';
        sliderIndicator.style.left = 'calc(50% - 1rem)';
        blurSliderIndicator.style.backgroundColor = 'var(--ai-color-transparent)';
        blurSliderIndicator.style.left = 'calc(50% - 1rem)';
    }
    document.getElementById('gameboard').appendChild(sliderIndicator);
    document.getElementById('gameboard').appendChild(blurSliderIndicator);
}

/**
 * Initializes the game.
 * 
 * @param {string} playerName - The name of the player.
 * @param {boolean} goesFirst - True if the player goes first, false if the AI goes first.
 * @param {string} difficulty - The difficulty of the AI.
 * @param {number} gridSize - The size of the gameboard.
 */
function init(playerName, goesFirst, difficulty, gridSize) {
    resetScoresCard(playerName, goesFirst, difficulty);
    let grid = createGameboard(gridSize);
    createSliderIndicator(goesFirst);
    setupEventListeners(grid, gridSize);

    // if the player goes first, do nothing and wait for the player to click a border
    if (!goesFirst) {
        computerTurn(grid);
    }
}

/*
Event Listeners and DOMContentLoaded
*/

function updateCopyrightNotice() {
    let getYear = new Date().getFullYear();
    let yearID = document.getElementById("year");
    if (getYear == 2024) {
        yearID.innerHTML = getYear;
    } else {
        yearID.innerHTML = `2024 - ${getYear}`;
    }
}

/**
 * Clears the gameboard and creates a new gameboard with the specified grid size.
 * 
 * @param {number} gridSize - The size of the gameboard.
 * @returns {Array} The gameboard grid of div elements.
 */
function createGameboard(gridSize) {
    document.getElementById('gameboard').innerHTML = '';
    let gameboard = document.getElementById('gameboard');
    const size = gridSize;

    let grid = [];
    for (let i = 0; i <= size; i++) {
        for (let j = 0; j <= size; j++) {
            let div = createDiv(i, j);
            grid.push(div);
            gameboard.appendChild(div);
        }
    }
    rescaleGameboard(grid, gridSize);
    return grid;
}

/**
 * Checks if a border has already been drawn.
 * If it hasn't, marks the border as drawn and calls tick to update the gameboard.
 * 
 * @param {HTMLDivElement} div - The border to add an event listener to.
 * @param {Array} grid - The gameboard grid of div elements.
 */
function borderClickListener(div, grid) {
    div.style.backgroundColor = "#444444";
    //check if the border has already been drawn
    if (div.drawn || document.getElementById('player1').style.backgroundColor === 'initial') {
        return;
    } else {
        markBorder(div, grid);
        tick(grid);
    }
}

/**
 * Highlights a border when the mouse hovers over it.
 * Only highlights the border if it hasn't been drawn yet and if it is the player's turn.
 * 
 * @param {HTMLDivElement} div - The border to highlight.
 */
function borderMouseoverListener(div) {
    if (div.drawn || document.getElementById('player1').style.backgroundColor === 'initial') {
        return;
    } else {
        div.style.backgroundColor = "#8a8a8a";
    }
}

/**
 * Removes the highlight from a border when the mouse leaves it.
 * 
 * @param {HTMLDivElement} div - The border to remove the highlight from.
 */
function borderMouseoutListener(div) {
    div.style.backgroundColor = "#444444";
}

// Credit for anonymous functions: https://medium.com/@andrewasmit/passing-arguments-to-your-event-listeners-callback-function-d9d8369cc3a4
/**
 * Sets up event listeners for the gameboard.
 * Sets up an event listener if the window is resized.
 * 
 * @param {Array} grid - The gameboard grid of div elements.
 */
function setupEventListeners(grid, gridSize) {
    for (let div of grid) {
        if (div.className === 'border') {
            div.addEventListener('click', () => {
                borderClickListener(div, grid);
            });
            div.addEventListener('mouseenter', () => {
                borderMouseoverListener(div);
            });
            div.addEventListener('mouseout', () => {
                borderMouseoutListener(div);
            });
        }
    }

    window.addEventListener('resize', () => {
        rescaleGameboard(grid, gridSize);
        // set the CSS rule for the background-blur elements to hidden if the window is resized
        let blurBackgrounds = document.getElementsByClassName('gameboard-blur-background');
        for (let blurBackground of blurBackgrounds) {
            blurBackground.style.display = 'none';
        }
    });
}

/**
 * Initializes the game when the DOM is loaded.
 * Adds event listeners to the start game button and the grid size input.
 * Starts a game with default settings.
 */
function contentLoaded() {
    updateCopyrightNotice();
    // Get references to the elements
    const playerNameInput = document.getElementById('player-name');
    const playerTurnRadio = document.getElementById('player-turn');
    const difficultySelect = document.getElementById('ai-difficulty');
    const gridSizeInput = document.getElementById('grid-size');
    const gridSizeLabel = document.getElementById('grid-size-value');
    const gridSizeWarning = document.getElementById('grid-size-warning');
    const startGameButton = document.getElementById('start-game');
    // Get references to the dialog elements
    const textInputDialog = document.getElementById('text-input-dialog');
    const textInputButton = document.getElementById('modal-ok-button');
    const restartDialog = document.getElementById('confirm-restart-dialog');
    const restartConfirmButton = document.getElementById('restart-confirm-button');
    const restartCancelButton = document.getElementById('restart-cancel-button');

    // Update the grid size label and display size warning
    gridSizeInput.addEventListener('input', () => {
        gridSizeLabel.textContent = gridSizeInput.value + ' x ' + gridSizeInput.value;
        if (gridSizeInput.value > 4 && window.innerWidth <= 425) {
            gridSizeWarning.innerHTML = "Please use a larger device for a better experience.";
        } else {
            gridSizeWarning.innerHTML = "";
        }
    });

    // Add event listeners to the dialog buttons
    textInputButton.addEventListener('click', () => {
        textInputDialog.close();
    });

    restartConfirmButton.addEventListener('click', () => {
        restartDialog.close();
        const goesFirst = playerTurnRadio.checked;
        const difficulty = difficultySelect.value;
        const gridSize = gridSizeInput.value * 2;
        const playerName = playerNameInput.value.trim();

        // Check if the player's name is too long or just a space Credit: https://stackoverflow.com/questions/10261986/how-to-detect-string-which-contains-only-spaces#:~:text=trim().,string%20that%20contains%20only%20spaces.&text=You%20can%20read%20more%20about%20trim%20here.
        if (playerName.length > 15) {
            textInputDialog.showModal();
            return;
        }
        init(playerName, goesFirst, difficulty, gridSize);
    });

    restartCancelButton.addEventListener('click', () => {
        restartDialog.close();
    });

    startGameButton.addEventListener('click', () => {
        restartDialog.showModal();
    });

    init('Player', true, 'medium', 6);
}

document.addEventListener('DOMContentLoaded', contentLoaded);