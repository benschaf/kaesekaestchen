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
 * Sets up event listeners for the gameboard.
 * Sets up an event listener if the window is resized.
 * 
 * @param {Array} grid - The gameboard grid of div elements.
 */
function setupEventListeners(grid, gridSize) {
    for (let div of grid) {
        if (div.className === 'border') {
            // Credit for arrow functions: https://www.w3schools.com/js/js_arrow_function.asp
            div.addEventListener('click', () => {
                //check if the border has already been drawn
                if (div.drawn || document.getElementById('player1').style.backgroundColor === 'initial') {
                    return;
                } else {
                    markBorder(div);
                    tick(grid);
                }
            });
        }
    }

    window.addEventListener('resize', () => {
        rescaleGameboard(grid, gridSize);
    });
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
    setupEventListeners(grid, gridSize);

    // if the player goes first, do nothing and wait for the player to click a border
    if (!goesFirst) {
        computerTurn(grid);
    }
}

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
    blurBackgroundElement.className = 'blur-background';

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
 * Switches the background color of the player and the AI on the scoreboard to indicate whose turn it is.
 */
function switchTurns() {
    if (document.getElementById('player1').style.backgroundColor === 'rgba(185, 252, 134, 0.2)') {
        document.getElementById('player1').style.backgroundColor = 'initial';
        document.getElementById('player2').style.backgroundColor = 'rgba(252, 134, 185, 0.2)';
    } else if (document.getElementById('player2').style.backgroundColor === 'rgba(252, 134, 185, 0.2)') {
        document.getElementById('player2').style.backgroundColor = 'initial';
        document.getElementById('player1').style.backgroundColor = 'rgba(185, 252, 134, 0.2)';
    }
}

/**
 * Sets the correct end game message based on the scores.
 * Displays 2 costum alert boxes with the end game message over the gameboard and in the scores card.
 * Removes the alert box over the gameboard after 3 seconds.
 */
function endGame() {
    let playerScore = document.getElementById('player-score').innerHTML;
    let aiScore = document.getElementById('ai-score').innerHTML;
    let endGameMessage;

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
    setTimeout( () => {
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
    if (switchTurn) {
        switchTurns();
    }
    let totalCells = document.getElementsByClassName('cell').length;
    if (filledCells === totalCells && filledCells !== 0) {
        endGame();
    }
}

/**
 * Parent function for the "gameloop" logic
 * Calls computeLastTurn.
 * If it is the AI's turn, calls computerTurn. Else, does nothing (waits for the player to click a border).
 * 
 * @param {Array} grid - The gameboard grid of div elements.
 */
function tick(grid) {
    computeLastTurn(grid);

    let nextTurn;
    if (document.getElementById('player1').style.backgroundColor === 'rgba(185, 252, 134, 0.2)') {
        nextTurn = true;
    } else {
        nextTurn = false;
    }
    if (!nextTurn) {
        computerTurn(grid);
    } else {
        //wait for the player to click a border
    }
}

//only maybe keep this thinking animation function - looks kinda cheap - maybe make it a loading bar below the gameboard or something
/**
 * Creates an AI is playing animation.
 * Removes the animation after 1 second.
 */
function thinkingAnimation() {
    let thinkingAnimationElement = document.createElement('div');
    thinkingAnimationElement.id = 'thinking-animation';
    // Credit for centering the element: https://www.w3schools.com/css/tryit.asp?filename=trycss_align_transform
    thinkingAnimationElement.style.position = 'absolute';
    thinkingAnimationElement.style.top = '50%';
    thinkingAnimationElement.style.left = '50%';
    thinkingAnimationElement.style.transform = 'translate(-50%, -50%)';
    thinkingAnimationElement.style.width = '150px';
    thinkingAnimationElement.style.height = '150px';
    thinkingAnimationElement.style.backgroundColor = 'rgba(252, 134, 185, 0.2)';
    thinkingAnimationElement.style.display = 'flex';
    thinkingAnimationElement.style.justifyContent = 'center';
    thinkingAnimationElement.style.alignItems = 'center';
    thinkingAnimationElement.style.fontSize = '1rem';
    thinkingAnimationElement.style.borderRadius = '50%';
    thinkingAnimationElement.innerHTML = 'AI is playing...';
    document.getElementById('gameboard').appendChild(thinkingAnimationElement);
    setTimeout(function () {
        thinkingAnimationElement.remove();
    }, 1000);
}

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
 * Marks a border as drawn by applying an inset shadow.
 * Changes the drawn property of the border to true.
 * 
 * @param {HTMLDivElement} border - The border to mark as drawn.
 */
function markBorder(border) {
    border.style.boxShadow = "inset 0 0 15px rgba(3, 218, 198)";
    border.drawn = true;
}

/**
 * Randomly selects a border to draw.
 * 
 * @param {Array} availableBorders - The available borders to choose from.
 */
function easyComputerTurn(availableBorders) {
    let randomBorder = Math.floor(Math.random() * availableBorders.length);
    markBorder(availableBorders[randomBorder]);
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
 * Determines which border to draw based on the number of drawn borders around adjacent cells.
 * If a cell has 3 drawn borders, draws the 4th border.
 * If a cell has 2 drawn borders, removes that border from the available borders.
 * If no cell has 3 or 2 drawn borders, randomly selects a border to draw.
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

            markBorder(availableBorder);
            return;
        }
        //if a cell has 2 drawn borders, remove that border from the available borders
        if (adjacentCellsBorderCount[0] === 2 || adjacentCellsBorderCount[1] === 2) {
            let index;
            index = leftOverBorders.indexOf(availableBorder);
            leftOverBorders.splice(index, 1);
        }
    }
    //if no cell has 3 or two drawn borders, randomly select a border to draw
    if (leftOverBorders.length === 0) { // if there are only borders with 2 drawn borders around them, draw one of them
        let randomBorder = Math.floor(Math.random() * availableBorders.length);

        markBorder(availableBorders[randomBorder]);
    } else {
        let randomBorder = Math.floor(Math.random() * leftOverBorders.length);

        markBorder(leftOverBorders[randomBorder]);
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
    thinkingAnimation();

    let difficulty = document.getElementById('ai-difficulty').value;
    let availableBorders = determineAvaliableBorders(grid);

    setTimeout(() => {
        if (difficulty === 'easy') {
            easyComputerTurn(availableBorders);
        } else if (difficulty === 'medium') {
            mediumComputerTurn(availableBorders, grid);
        }
        tick(grid);
    }, 1000); // Delay of 1 second
}

/**
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
        const largeHorizontalSpace = (document.getElementById('game-area').offsetWidth / 12 * 8);
        if (largeHorizontalSpace < verticalSpace) {
            scale = parseInt(largeHorizontalSpace / (gridSize * 2 + 1) - 2);
        } else {
            scale = parseInt(verticalSpace / (gridSize * 2 + 1) - 2);
        }
    } else {
        const smallHorizontalSpace = (document.getElementById('game-area').offsetWidth);
        if (smallHorizontalSpace < verticalSpace) {
            scale = parseInt(smallHorizontalSpace / (gridSize * 2 + 1) - 2);
        } else {
            scale = parseInt(verticalSpace / (gridSize * 2 + 1) - 2);
        }
    }
    resizeGrid(grid, scale, gridSize);
}


/**
 * Initializes the game when the DOM is loaded.
 * Adds event listeners to the start game button and the grid size input.
 * Starts a game with default settings.
 */
function contentLoaded() {
    // Get references to the elements
    const gridSizeInput = document.getElementById('grid-size');
    const gridSizeLabel = document.getElementById('grid-size-value');
    const startGameButton = document.getElementById('start-game');

    gridSizeInput.addEventListener('input', () => {
        gridSizeLabel.textContent = gridSizeInput.value + ' x ' + gridSizeInput.value;
    });

    startGameButton.addEventListener('click', () => {
        const playerNameInput = document.getElementById('player-name');
        const playerTurnRadio = document.getElementById('player-turn');
        const difficultySelect = document.getElementById('ai-difficulty');

        const playerName = playerNameInput.value;
        const goesFirst = playerTurnRadio.checked;
        const difficulty = difficultySelect.value;
        const gridSize = gridSizeInput.value * 2;

        init(playerName, goesFirst, difficulty, gridSize);
    });

    init('Player', true, 'medium', 6);
}

document.addEventListener('DOMContentLoaded', contentLoaded);