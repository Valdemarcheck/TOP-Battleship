import { TILE_SIZE_PX } from "./constants";
import { PubSub } from "./PubSub";
import { SHIP_WIDTH_COEFFICIENT, SHIP_HEIGHT_COEFFICIENT } from "./constants";
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
    this.shipElement.style.width =
      length * TILE_SIZE_PX + SHIP_WIDTH_COEFFICIENT + "px";
    this.shipElement.style.height =
      TILE_SIZE_PX + SHIP_HEIGHT_COEFFICIENT + "px";

    const rect = this.shipElement.getBoundingClientRect();
    this.startY = rect.top;
    this.startX = rect.left;

    shipElement.addEventListener("mousedown", (e) => {
      ShipUI.movableShip = this;

      const rect = this.shipElement.getBoundingClientRect();
      this.offsetY = e.clientY - rect.top;
      this.offsetX = e.clientX - rect.left;
      console.log(e.clientY, rect.top, this.offsetY);
      this.shipElement.style.position = "absolute";
    });
  }
}

function move(e, ship) {
  ship.shipElement.style.top = e.pageY - ship.offsetY + "px";
  ship.shipElement.style.left = e.pageX - ship.offsetX + "px";
}

function reset(ship) {
  ship.shipElement.style.top = ShipUI.movableShip.startY + "px";
  ship.shipElement.style.left = ShipUI.movableShip.startX + "px";
  ship.shipElement.style.position = "static";
}

document.addEventListener("mousemove", (e) => {
  if (ShipUI.movableShip) {
    move(e, ShipUI.movableShip);
    PubSub.emit("shipIsMoving", ShipUI.movableShip);
  }
});

document.addEventListener("mouseup", () => {
  if (ShipUI.movableShip) {
    PubSub.emit("noShipMovement", ShipUI.movableShip);
    reset(ShipUI.movableShip);
    ShipUI.movableShip = null;
  }
});
