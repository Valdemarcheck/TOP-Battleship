import { MAX_VERTICAL, MAX_HORIZONTAL, TILE_SIZE_PX } from "./constants";
import { PubSub } from "./PubSub";
import { enemyGrid, playerGrid } from "./utilities/grid-handler";

function tileBelongsToEnemyGrid(tile, enemyGrid) {
  return tile.parentElement == enemyGrid;
}

function getElementCoords(element) {
  return [
    element.left + window.scrollX,
    element.top + window.scrollY,
    element.right + window.scrollX,
    element.bottom + window.scrollY,
  ];
}

function getDifferencesInCoordsBetweenTileAndShip(tileRect, shipRect) {
  const [tileLeft, tileTop, tileRight, tileBottom] = getElementCoords(tileRect);
  const [shipLeft, shipTop, shipRight, shipBottom] = getElementCoords(shipRect);
  return [
    shipLeft - tileLeft,
    shipTop - tileTop,
    tileRight - shipRight,
    tileBottom - shipBottom,
  ];
}

function isShipInsideByHorizontal(differenceLeft, differenceRight) {
  return (
    (differenceLeft < MAX_HORIZONTAL && differenceRight <= 0) ||
    (differenceRight < MAX_HORIZONTAL && differenceLeft <= 0)
  );
}

function isShipInsideByVertical(differenceTop, differenceBottom) {
  return (
    (differenceTop < MAX_VERTICAL && differenceBottom <= 0) ||
    (differenceBottom < MAX_VERTICAL && differenceTop <= 0)
  );
}

function isShipOverTile(tile, ship) {
  if (tileBelongsToEnemyGrid(tile, enemyGrid)) return false;
  const shipRect = ship.getBoundingClientRect();
  const tileRect = tile.getBoundingClientRect();

  const [differenceLeft, differenceTop, differenceRight, differenceBottom] =
    getDifferencesInCoordsBetweenTileAndShip(tileRect, shipRect);

  return (
    isShipInsideByHorizontal(differenceLeft, differenceRight) &&
    isShipInsideByVertical(differenceTop, differenceBottom)
  );
}

export function getTilesForRotation(startX, startY, length, isVertical) {
  const tilesThatShipWillTake = [];
  const [actualX, actualY] = [startX - 1, startY - 1];
  if (isVertical) {
    for (let x = actualX; x < actualX + length; x++) {
      tilesThatShipWillTake.push(TileUI.playerTiles[actualY][x]);
    }
  } else {
    for (let y = actualY; y < actualY + length; y++) {
      tilesThatShipWillTake.push(TileUI.playerTiles[y][actualX]);
    }
  }
  return tilesThatShipWillTake;
}

export function getTilesUnderShip(shipUI) {
  return TileUI.allTiles.filter((tileUI) =>
    isShipOverTile(tileUI.tileElement, shipUI.shipElement)
  );
}

export class TileUI {
  static allTiles = [];
  static playerTiles = [[]];
  static enemyTiles = [[]];
  constructor(tileElement, x, y, gridObj) {
    TileUI.allTiles.push(this);
    if (gridObj === playerGrid) {
      this.#pushTileToArray(TileUI.playerTiles);
    } else {
      this.#pushTileToArray(TileUI.enemyTiles);
    }
    this.x = x;
    this.y = y;
    this.tileElement = tileElement;
    this.tileElement.classList.add("tile");
    this.tileElement.dataset.x = x;
    this.tileElement.dataset.y = y;
    this.tileElement.width = TILE_SIZE_PX + "px";

    PubSub.on("shipIsMoving", (ship) => {
      if (isShipOverTile(this.tileElement, ship.shipElement)) {
        this.tileElement.classList.add("hoveredWithShip");
      } else {
        this.tileElement.classList.remove("hoveredWithShip");
      }
    });
    PubSub.on("noShipMovement", () => {
      this.tileElement.classList.remove("hoveredWithShip");
    });
  }

  #pushTileToArray(gridObj) {
    const lastRowIndex = gridObj.length - 1;
    if (gridObj[lastRowIndex].length < 10) {
      gridObj[lastRowIndex].push(this);
    } else {
      gridObj.push([]);
      gridObj[lastRowIndex + 1].push(this);
    }
  }
}
