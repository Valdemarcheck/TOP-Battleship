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

  place(shipObj, isVertical, x, y) {
    if (
      this.#areCoordinatesOutOfBounds(x, y) ||
      this.#areEndCoordinatesOutOfBounds(shipObj.length, isVertical, x, y) ||
      this.isFilledPath(shipObj.length, isVertical, x, y)
    ) {
      throw new Error("Given coordinates are out of bounds of the gameboard");
    }

    const [startX, startY] = this.#convertCoordinates(x, y);

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

  isFilledPath(pathLength, isVertical, startX, startY) {
    const [actualStartX, actualStartY] = this.#convertCoordinates(
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
    const [actualX, actualY] = this.#convertCoordinates(x, y);
    return !!this.shipsOnBoardArray[actualY][actualX];
  }

  isHit(x, y) {
    const [actualX, actualY] = this.#convertCoordinates(x, y);
    return this.hitCellsBoardArray[actualY][actualX];
  }

  receiveAttack(x, y) {
    if (this.#areCoordinatesOutOfBounds(x, y) || this.isHit(x, y)) {
      throw new Error("Given coordinates are out of bounds of the gameboard");
    }
    const [actualX, actualY] = this.#convertCoordinates(x, y);
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

  #convertCoordinates(x, y) {
    return [x - 1, y - 1];
  }

  #areCoordinatesOutOfBounds(x, y) {
    return x < 0 || y < 0 || x > BOARD_SIZE || y > BOARD_SIZE;
  }

  #areEndCoordinatesOutOfBounds(shipLength, isVertical, x, y) {
    if (isVertical) {
      const endY = y - shipLength;
      return endY < 0;
    } else {
      const endX = x + shipLength - 1;
      return endX > BOARD_SIZE;
    }
  }
}
