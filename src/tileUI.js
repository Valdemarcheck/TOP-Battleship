import { MAX_VERTICAL, MAX_HORIZONTAL, TILE_SIZE_PX } from "./constants";
import { PubSub } from "./PubSub";
import { enemyGrid } from "./utilities/grid-handler";

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
export function getTilesUnderShip(shipUI) {
  return TileUI.allTiles.filter((tileUI) =>
    isShipOverTile(tileUI.tileElement, shipUI.shipElement)
  );
}

export class TileUI {
  static allTiles = [];
  constructor(tileElement, x, y) {
    TileUI.allTiles.push(this);
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
}
