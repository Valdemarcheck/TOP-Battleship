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

  isPlacementLegal({ shipUI, isVertical, startX, startY }) {
    return (
      !this.#areStartCoordinatesOutOfBounds(startX, startY) &&
      !this.#areEndCoordinatesOutOfBounds({
        shipLength: shipUI.length,
        isVertical,
        startX,
        startY,
      }) &&
      !this.#isFilledPath({
        pathLength: shipUI.length,
        isVertical,
        startX,
        startY,
      })
    );
  }

  remove({ id, isVertical, length, startX, startY }) {
    [startX, startY] = this.#convertBoardCoordsToArrayCoords(startX, startY);
    console.log(isVertical);
    if (isVertical) {
      for (let currentY = startY; currentY < startY + length; currentY++) {
        this.shipsOnBoardArray[currentY][startX] = null;
      }
    } else {
      for (let currentX = startX; currentX < startX + length; currentX++) {
        this.shipsOnBoardArray[startY][currentX] = null;
      }
    }
    this.#removeShipFromListOfPlacedShips(id);
  }

  place({ shipUI, isVertical, startX, startY }) {
    if (!this.isPlacementLegal({ shipUI, isVertical, startX, startY })) {
      throw new Error("Given coordinates are out of bounds of the gameboard");
    }

    [startX, startY] = this.#convertBoardCoordsToArrayCoords(startX, startY);

    if (isVertical) {
      for (
        let currentY = startY;
        currentY < startY + shipUI.length;
        currentY++
      ) {
        this.shipsOnBoardArray[currentY][startX] = shipUI;
      }
    } else {
      for (
        let currentX = startX;
        currentX < startX + shipUI.length;
        currentX++
      ) {
        this.shipsOnBoardArray[startY][currentX] = shipUI;
      }
    }

    this.#addShipToListOfShips(shipUI);
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
    return this.listOfShips.every((shipUI) => {
      return shipUI.isSunk;
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

  #addShipToListOfShips(shipUI) {
    this.listOfShips.push(shipUI);
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
