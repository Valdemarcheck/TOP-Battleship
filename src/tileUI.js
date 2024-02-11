import { TILE_SIZE_PX } from "./constants";
import { PubSub } from "./PubSub";

function elementIsInside(inner, outer, length, isRotated, baseLength) {
  const innerRect = inner.getBoundingClientRect();
  const outerRect = outer.getBoundingClientRect();

  for (let i = 0; i < length; i++) {
    const differenceTop = Math.abs(innerRect.top - outerRect.top);
    const differenceLeft = Math.abs(innerRect.left - outerRect.left);
    const differenceBottom = isRotated
      ? Math.abs(innerRect.bottom - (outerRect.bottom - baseLength * i))
      : Math.abs(innerRect.bottom - outerRect.bottom);
    const differenceRight = isRotated
      ? Math.abs(innerRect.right - outerRect.right)
      : Math.abs(innerRect.right - (outerRect.right - baseLength * i));

    if (
      (differenceTop < innerRect.height / 2 ||
        differenceLeft < innerRect.width / 2) &&
      differenceBottom < innerRect.height / 2 &&
      differenceRight < innerRect.width / 2 &&
      differenceTop < innerRect.height / 2
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
        elementIsInside(
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
