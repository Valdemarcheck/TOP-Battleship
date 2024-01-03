import { BOARD_SIZE } from "./constants";

function fillGridWithCells(grid) {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      grid.appendChild(cell);
    }
  }
}

const [gridLeft, gridRight] = document.getElementsByClassName("grid");
console.log(gridLeft, gridRight);
fillGridWithCells(gridLeft);
fillGridWithCells(gridRight);
