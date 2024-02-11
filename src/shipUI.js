import { TILE_SIZE_PX } from "./constants";

export class ShipUI {
  static movableShip = null;
  offsetX = 0;
  offsetY = 0;
  tilesPlaced = [];

  constructor(shipElement, length) {
    this.length = length;
    this.shipElement = shipElement;
    this.shipElement.classList.add("dock-ship");
    this.shipElement.classList.add(`length-${length}`);
    this.shipElement.style.width = length * TILE_SIZE_PX + "px";
    this.shipElement.style.height = TILE_SIZE_PX + "px";

    const rect = this.shipElement.getBoundingClientRect();
    this.startY = rect.top;
    this.startX = rect.left;
  }
}
