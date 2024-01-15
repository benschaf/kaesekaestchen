let gameboard = document.getElementById('gameboard');

const size = 6;

gameboard.style.width = '390px';
gameboard.style.height = '390px';

//creates a grid with all the different corners, borders and cells and populates the divs variable with them
let grid = [];
for (let i = 0; i <= size; i++) {
    for (let j = 0; j <= size; j++) {
        let div = createDiv(i, j);
        grid.push(div);
        gameboard.appendChild(div);
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
function createDiv(x, y) {
    let div = document.createElement('div');
    div.xVal = x;
    div.yVal = y;
    div.innerHTML = "" + x + " / " + y;

    if (x % 2 === 0 && y % 2 === 1) { // div is a horizontal border
        div.style.backgroundColor = 'red';
        div.style.width = '90px';
        div.style.height = '30px';
        return div;
    } else if (x % 2 === 1 && y % 2 === 1) { // div is a cell
        div.style.backgroundColor = 'blue';
        div.style.width = '90px';
        div.style.height = '90px';
        return div;
    } else if (x % 2 === 1 && y % 2 === 0) { // div is a vertical border
        div.style.backgroundColor = 'red';
        div.style.width = '30px';
        div.style.height = '90px';
        return div;
    } else { // div is a corner
        div.style.backgroundColor = 'gray';
        div.style.width = '30px';
        div.style.height = '30px';
        return div;
    }
}