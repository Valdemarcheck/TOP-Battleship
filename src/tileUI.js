import { TILE_SIZE_PX } from "./constants";
import { PubSub } from "./PubSub";

function shipIsOverTile(tile, ship, length, isRotated, baseLength) {
  const tileRect = tile.getBoundingClientRect();
  const shipRect = ship.getBoundingClientRect();
  console.log(tile, ship);
  for (let i = 0; i < length; i++) {
    const differenceTop = Math.abs(tileRect.top - shipRect.top);
    const differenceLeft = Math.abs(tileRect.left - shipRect.left);
    const differenceBottom = isRotated
      ? Math.abs(tileRect.bottom - (shipRect.bottom - baseLength * i))
      : Math.abs(tileRect.bottom - shipRect.bottom);
    const differenceRight = isRotated
      ? Math.abs(tileRect.right - shipRect.right)
      : Math.abs(tileRect.right - (shipRect.right - baseLength * i));

    if (
      (differenceTop < tileRect.height / 2 ||
        differenceLeft < tileRect.width / 2) &&
      differenceBottom < tileRect.height / 2 &&
      differenceRight < tileRect.width / 2 &&
      differenceTop < tileRect.height / 2
    ) {
      return true;
    }
  }

  return false;
}

export class TileUI {
  filled = false;
  constructor(tileElement, x, y) {
    this.tileElement = tileElement;
    this.tileElement.classList.add("tile");
    this.tileElement.dataset.x = x;
    this.tileElement.dataset.y = y;
    this.tileElement.width = TILE_SIZE_PX + "px";

    PubSub.on("shipIsMoving", (ship) => {
      if (
        shipIsOverTile(
          this.tileElement,
          ship.shipElement,
          ship.length,
          false,
          TILE_SIZE_PX
        )
      ) {
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
