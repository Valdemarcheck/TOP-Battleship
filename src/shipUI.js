import {
  SHIP_PLACEMENT_ON_TILE_X_OFFSET,
  SHIP_PLACEMENT_ON_TILE_Y_OFFSET,
  TILE_SIZE_PX,
} from "./constants";
import { PubSub } from "./PubSub";
import { SHIP_WIDTH_COEFFICIENT, SHIP_HEIGHT_COEFFICIENT } from "./constants";
import { getTilesUnderShip } from "./tileUI";
export class ShipUI {
  static movableShip = null;
  static allShips = [];
  static usedIDs = [];
  static ID_MAX_SIZE = 2;
  offsetX = 0;
  offsetY = 0;
  tilesPlaced = [];

  constructor(shipElement, length) {
    ShipUI.allShips.push(this);
    const ID = ShipUI.#generateShipID();
    this.id = ID;
    this.length = length;

    this.shipElement = shipElement;
    this.shipElement.id = ID;
    this.shipElement.classList.add("dock-ship");
    this.shipElement.classList.add(`length-${length}`);
    this.shipElement.style.width =
      length * TILE_SIZE_PX + SHIP_WIDTH_COEFFICIENT + "px";
    this.shipElement.style.height =
      TILE_SIZE_PX + SHIP_HEIGHT_COEFFICIENT + "px";

    const rect = this.shipElement.getBoundingClientRect();
    this.originY = rect.top;
    this.originX = rect.left;

    shipElement.addEventListener("mousedown", (e) => {
      ShipUI.movableShip = this;

      const rect = this.shipElement.getBoundingClientRect();
      this.offsetY = e.clientY - rect.top;
      this.offsetX = e.clientX - rect.left;
      console.log(e.clientY, rect.top, this.offsetY);
      this.shipElement.style.position = "absolute";
    });
  }

  static #generateShipID() {
    let id = null;
    do {
      id = parseInt(Math.random() * 10 ** ShipUI.ID_MAX_SIZE);
    } while (ShipUI.usedIDs.includes(id));
    return id;
  }
}

function setShipOriginToTile(shipUI, tileUI) {
  const tileRect = tileUI.tileElement.getBoundingClientRect();
  shipUI.originY =
    tileRect.top +
    document.documentElement.scrollTop +
    SHIP_PLACEMENT_ON_TILE_Y_OFFSET;
  shipUI.originX = tileRect.left + SHIP_PLACEMENT_ON_TILE_X_OFFSET;
}

function move(e, ship) {
  ship.shipElement.style.top = e.pageY - ship.offsetY + "px";
  ship.shipElement.style.left = e.pageX - ship.offsetX + "px";
}

function reset(ship, isShipOverAnyTiles) {
  ship.shipElement.style.top = ShipUI.movableShip.originY + "px";
  ship.shipElement.style.left = ShipUI.movableShip.originX + "px";
  if (!isShipOverAnyTiles) {
    ship.shipElement.style.position = "static";
  }
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
    const tilesUnderShip = getTilesUnderShip(ShipUI.movableShip);
    const isShipOverAnyTiles = tilesUnderShip.length > 0;

    if (isShipOverAnyTiles) {
      setShipOriginToTile(ShipUI.movableShip, tilesUnderShip[0]);
      ShipUI.movableShip.tilesPlaced = [...tilesUnderShip];
    }
    reset(ShipUI.movableShip, isShipOverAnyTiles);
    ShipUI.movableShip = null;
  }
});
