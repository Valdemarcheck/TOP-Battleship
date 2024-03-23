import { TILE_SIZE_PX, PRESSED_MOUSE_BUTTON } from "./constants";
import { PubSub } from "./PubSub";
import { getTilesUnderShip } from "./tileUI";
import { doesShipCrossAnyShips } from "./gameplay/gameplay-objects-handler";

export class ShipUI {
  static movableShip = null;
  static allShips = [];
  static usedIDs = [];
  static ID_MAX_SIZE = 2;
  isRotated = false;
  onBoard = false;
  offsetX = 0;
  offsetY = 0;
  startX = null;
  startY = null;

  constructor(length) {
    ShipUI.allShips.push(this);
    this.id = ShipUI.#generateShipID();
    this.length = length;

    this.#setupShipElement();
    this.#setupShipImage();

    this.shipElement.addEventListener("mousedown", (e) => {
      switch (e.button) {
        case PRESSED_MOUSE_BUTTON.LEFT_CLICK:
          ShipUI.movableShip = this;
          this.#prepareShipForDragAndDrop(e);
          break;

        case PRESSED_MOUSE_BUTTON.MIDDLE_CLICK:
          if (this.length > 1) this.#rotateShip();
          break;
      }
    });
  }

  #setupShipImage() {
    const shipImage = new Image();
    shipImage.style.width = this.length * TILE_SIZE_PX + "px";
    shipImage.style.height = TILE_SIZE_PX + "px";
    shipImage.classList.add("ship-image");
    shipImage.draggable = false;
    shipImage.src = `images/${this.length}ship.png`;
    this.shipElement.append(shipImage);
  }

  #prepareShipForDragAndDrop(e) {
    const rect = this.shipElement.getBoundingClientRect();
    this.offsetY = e.clientY - rect.top;
    this.offsetX = e.clientX - rect.left;
    this.shipElement.style.position = "absolute";
  }

  #setupShipElement() {
    this.shipElement = document.createElement("div");
    this.shipElement.id = this.id;
    this.shipElement.classList.add("dock-ship");
    if (this.isRotated) {
      this.shipElement.classList.add("rotated");
      this.shipElement.style.width = TILE_SIZE_PX + "px";
      this.shipElement.style.height = this.length * TILE_SIZE_PX + "px";
    } else {
      this.shipElement.style.width = this.length * TILE_SIZE_PX + "px";
      this.shipElement.style.height = TILE_SIZE_PX + "px";
    }
  }

  #rotateShip() {
    if (!this.isRotated) {
      this.shipElement.style.height = TILE_SIZE_PX * this.length + "px";
      this.shipElement.style.width = TILE_SIZE_PX + "px";
    } else {
      this.shipElement.style.height = TILE_SIZE_PX + "px";
      this.shipElement.style.width = TILE_SIZE_PX * this.length + "px";
    }
    this.shipElement.classList.toggle("rotated");
    this.isRotated = !this.isRotated;
  }

  static #generateShipID() {
    let id = null;
    do {
      id = parseInt(Math.random() * 10 ** ShipUI.ID_MAX_SIZE);
    } while (ShipUI.usedIDs.includes(id));
    return id;
  }
}

function isShipPositionLegal(ShipUI, tilesUnderShip) {
  const isShipOverAnyTiles = tilesUnderShip.length > 0;
  const isShipOutOfBounds = tilesUnderShip.length !== ShipUI.movableShip.length;
  return (
    isShipOverAnyTiles &&
    !doesShipCrossAnyShips(tilesUnderShip) &&
    !isShipOutOfBounds
  );
}

function setShipStartCoordinates(shipUI, tilesUnderShip) {
  shipUI.startX = tilesUnderShip[0].x;
  shipUI.startY = tilesUnderShip[0].y;
}

function setShipOriginToTile(shipUI, tileUI) {
  const tileRect = tileUI.tileElement.getBoundingClientRect();
  shipUI.originX = tileRect.left + window.scrollX;
  shipUI.originY = tileRect.top + window.scrollY;
}

function move(e, ship) {
  ship.shipElement.style.top = e.pageY - ship.offsetY + "px";
  ship.shipElement.style.left = e.pageX - ship.offsetX + "px";
}

function reset(ship, isShipPositionLegal) {
  if (!isShipPositionLegal) {
    ship.shipElement.style.position = "relative";
  } else {
    ship.shipElement.style.top = ShipUI.movableShip.originY + "px";
    ship.shipElement.style.left = ShipUI.movableShip.originX + "px";
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
    const mayBePlacedOnBoard = isShipPositionLegal(ShipUI, tilesUnderShip);

    if (ShipUI.movableShip.onBoard) {
      PubSub.emit("removeShipFromBoard", ShipUI.movableShip);
      ShipUI.movableShip.onBoard = false;
    }
    if (mayBePlacedOnBoard) {
      setShipStartCoordinates(ShipUI.movableShip, tilesUnderShip);
      setShipOriginToTile(ShipUI.movableShip, tilesUnderShip[0]);
      ShipUI.movableShip.onBoard = true;

      PubSub.emit("placeShipUIOnBoard", ShipUI.movableShip);
    } else {
      console.warn("Such ship placement is illegal");
    }

    reset(ShipUI.movableShip, mayBePlacedOnBoard);
    ShipUI.movableShip = null;
  }
});
