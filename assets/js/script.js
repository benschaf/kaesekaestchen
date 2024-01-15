let gameboard = document.getElementById('gameboard');

const size = 6;
const scale = 40;

gameboard.style.width = scale * (size * 2 + 1) + 'px';
gameboard.style.height = scale * (size * 2 + 1) + 'px';

//creates a grid with all the different corners, borders and cells and populates the divs variable with them
let grid = [];
for (let i = 0; i <= size; i++) {
    for (let j = 0; j <= size; j++) {
        let div = createDiv(i, j);
        grid.push(div);
        gameboard.appendChild(div);
    }
}

// adds event listeners to all the divs in the grid
for (let div of grid) {
    if (div.gridElementType === 'border') {
        div.addEventListener('click', borderClick);
    }
}

/**
 * Changes the background color of the border div that was clicked to orange.
 */
function borderClick() {
    this.style.backgroundColor = 'orange';
    this.drawn = true;
    tick();
}

/**
 * Checks if any cell has 4 (or more) drawn borders around it. 
 * If it does, it changes the background color of the cell to green.
 */
function tick() {
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
                cell.style.backgroundColor = 'green';
            }
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
 * @returns {HTMLDivElement} - The created div element.
 */
function createDiv(y, x) {
    let div = document.createElement('div');
    div.xVal = x;
    div.yVal = y;
    div.innerHTML = "" + x + " / " + y;

    if (x % 2 === 0 && y % 2 === 1) { // div is a horizontal border
        div.style.backgroundColor = 'red';
        div.gridElementType = 'border';
        div.style.width = scale + "px";
        div.style.height = scale * 3 + "px";
        return div;
    } else if (x % 2 === 1 && y % 2 === 1) { // div is a cell
        div.style.backgroundColor = 'blue';
        div.gridElementType = 'cell';
        div.style.width = scale * 3 + "px";
        div.style.height = scale * 3 + "px";
        return div;
    } else if (x % 2 === 1 && y % 2 === 0) { // div is a vertical border
        div.style.backgroundColor = 'red';
        div.gridElementType = 'border';

        div.style.width = scale * 3 + "px";
        div.style.height = scale + "px";
        return div;
    } else { // div is a corner
        div.style.backgroundColor = 'gray';
        div.gridElementType = 'corner';
        div.style.width = scale + "px";
        div.style.height = scale + "px";
        return div;
    }
}