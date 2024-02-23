import { TILE_SIZE_PX } from "../constants";
import { TileUI } from "../tileUI";
import { BOARD_SIZE } from "../constants";
import { PubSub } from "../PubSub";

const [gridLeft, gridRight] = document.getElementsByClassName("grid");
fillGridWithCells(gridLeft);
fillGridWithCells(gridRight);
setGridTileSize(gridLeft);
setGridTileSize(gridRight);

function fillGridWithCells(grid) {
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const tile = new TileUI(document.createElement("div"), x + 1, y + 1);
      grid.appendChild(tile.tileElement);
    }
  }
}

function setGridTileSize(grid) {
  grid.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, ${
    TILE_SIZE_PX + "px"
  })`;
  grid.style.gridTemplateRows = `repeat(${BOARD_SIZE}, ${TILE_SIZE_PX + "px"})`;
}

PubSub.on("fillGridWithCells", fillGridWithCells);
PubSub.on("setGridTileSize", setGridTileSize);
