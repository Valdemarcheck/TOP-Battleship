import { BOARD_SIZE } from "./constants";

export default function fillGridWithCells(grid) {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      grid.appendChild(cell);
    }
  }
}
