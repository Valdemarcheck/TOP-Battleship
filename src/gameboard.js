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
const BOARD_SIZE = 10;

export class Gameboard {
  hitCellsBoardArray = getArrayOfSameValues(BOARD_SIZE, false);
  shipsOnBoardArray = getArrayOfSameValues(BOARD_SIZE, null);
  listOfShips = [];

  constructor() {}

  place({ shipObj, isVertical, originX, originY }) {
    if (
      this.#areCoordinatesOutOfBounds(originX, originY) ||
      this.#areEndCoordinatesOutOfBounds({
        shipLength: shipObj.length,
        isVertical,
        startX: originX,
        startY: originY,
      }) ||
      this.isFilledPath({
        pathLength: shipObj.length,
        isVertical,
        startX: originX,
        startY: originY,
      })
    ) {
      throw new Error("Given coordinates are out of bounds of the gameboard");
    }

    const [startX, startY] = this.#convertBoardCoordsToArrayCoords(
      originX,
      originY
    );

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

  isFilledPath({ pathLength, isVertical, startX, startY }) {
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

  isFilledCell(x, y) {
    const [actualX, actualY] = this.#convertBoardCoordsToArrayCoords(x, y);
    return !!this.shipsOnBoardArray[actualY][actualX];
  }

  isHit(x, y) {
    const [actualX, actualY] = this.#convertBoardCoordsToArrayCoords(x, y);
    return this.hitCellsBoardArray[actualY][actualX];
  }

  receiveAttack(x, y) {
    if (this.#areCoordinatesOutOfBounds(x, y) || this.isHit(x, y)) {
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

  #addShipToListOfShips(shipObj) {
    this.listOfShips.push(shipObj);
  }

  #convertBoardCoordsToArrayCoords(x, y) {
    return [x - 1, y - 1];
  }

  #areCoordinatesOutOfBounds(x, y) {
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
