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

function createDiv(x, y) {

}