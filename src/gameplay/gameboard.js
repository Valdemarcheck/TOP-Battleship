import { BOARD_SIZE } from "../constants";

function getArrayOfSameValues(size, value) {
  const array = [];
  for (let i = 0; i < size; i++) {
    array.push([]);
    for (let j = 0; j < size; j++) {
      array[i].push(value);
    }
  }
  return array;
}

export class Gameboard {
  hitCellsBoardArray = getArrayOfSameValues(BOARD_SIZE, false);
  shipsOnBoardArray = getArrayOfSameValues(BOARD_SIZE, null);
  listOfShips = [];

  constructor() {}

  isPlacementLegal({ shipObj, isVertical, startX, startY }) {
    return (
      !this.#areStartCoordinatesOutOfBounds(startX, startY) &&
      !this.#areEndCoordinatesOutOfBounds({
        shipLength: shipObj.length,
        isVertical,
        startX,
        startY,
      }) &&
      !this.#isFilledPath({
        pathLength: shipObj.length,
        isVertical,
        startX,
        startY,
      })
    );
  }

  remove({ id, isVertical, length, startX, startY }) {
    const [actualStartX, actualStartY] = this.#convertBoardCoordsToArrayCoords(
      startX,
      startY
    );
    if (isVertical) {
      for (let currentY = 0; currentY < length; currentY++) {
        this.shipsOnBoardArray[actualStartY - currentY][actualStartX] = null;
      }
    } else {
      for (let currentX = 0; currentX < length; currentX++) {
        this.shipsOnBoardArray[actualStartY][actualStartX + currentX] = null;
      }
    }
    this.#removeShipFromListOfPlacedShips(id);
  }

  place({ shipObj, isVertical, startX, startY }) {
    if (!this.isPlacementLegal({ shipObj, isVertical, startX, startY })) {
      throw new Error("Given coordinates are out of bounds of the gameboard");
    }

    [startX, startY] = this.#convertBoardCoordsToArrayCoords(startX, startY);

    if (isVertical) {
      for (let currentY = 0; currentY < shipObj.length; currentY++) {
        this.shipsOnBoardArray[startY - currentY][startX] = shipObj;
      }
    } else {
      for (let currentX = 0; currentX < shipObj.length; currentX++) {
        this.shipsOnBoardArray[startY][startX + currentX] = shipObj;
      }
    }

    this.#addShipToListOfShips(shipObj);
  }

  isShipPlacedOnCoordinates(x, y) {
    const [actualX, actualY] = this.#convertBoardCoordsToArrayCoords(x, y);
    return !!this.shipsOnBoardArray[actualY][actualX];
  }

  receiveAttack(x, y) {
    if (this.#areStartCoordinatesOutOfBounds(x, y) || this.#isHit(x, y)) {
      throw new Error("Given coordinates are out of bounds of the gameboard");
    }
    const [actualX, actualY] = this.#convertBoardCoordsToArrayCoords(x, y);
    this.hitCellsBoardArray[actualY][actualX] = true;

    const hitShip = this.shipsOnBoardArray[actualY][actualX];
    if (hitShip) {
      hitShip.hit();
    }
  }

  get areAllShipsSunk() {
    return this.listOfShips.every((shipObj) => {
      return shipObj.isSunk;
    });
  }

  #removeShipFromListOfPlacedShips(id) {
    this.listOfShips = this.listOfShips.filter((ship) => ship.id != id);
  }

  #isHit(x, y) {
    const [actualX, actualY] = this.#convertBoardCoordsToArrayCoords(x, y);
    return this.hitCellsBoardArray[actualY][actualX];
  }

  #isFilledPath({ pathLength, isVertical, startX, startY }) {
    const [actualStartX, actualStartY] = this.#convertBoardCoordsToArrayCoords(
      startX,
      startY
    );

    if (isVertical) {
      for (let currentY = 0; currentY < pathLength; currentY++) {
        if (!!this.shipsOnBoardArray[actualStartY - currentY][actualStartX]) {
          return true;
        }
      }
    } else {
      for (let currentX = 0; currentX < pathLength; currentX++) {
        if (!!this.shipsOnBoardArray[actualStartY][actualStartX + currentX]) {
          return true;
        }
      }
    }

    return false;
  }

  #addShipToListOfShips(shipObj) {
    this.listOfShips.push(shipObj);
  }

  #convertBoardCoordsToArrayCoords(x, y) {
    return [x - 1, y - 1];
  }

  #areStartCoordinatesOutOfBounds(x, y) {
    return x < 0 || y < 0 || x > BOARD_SIZE || y > BOARD_SIZE;
  }

  #areEndCoordinatesOutOfBounds({ shipLength, isVertical, startX, startY }) {
    if (isVertical) {
      const endY = startY - shipLength;
      return endY < 0;
    } else {
      const endX = startX + shipLength - 1;
      return endX > BOARD_SIZE;
    }
  }
}
