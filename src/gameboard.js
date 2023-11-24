const BOARD_SIZE = 10;

export class Gameboard {
  hitCellsBoardArray = [];
  shipsOnBoardArray = [];
  listOfShips = [];

  constructor() {
    this.#fillHitCellsBoardArray();
  }

  place(shipObj, x, y) {
    this.#addShipToListOfShips(shipObj);
  }

  isHit(x, y) {}

  receiveAttack(x, y) {}

  get areAllShipsSunk() {}

  #fillHitCellsBoardArray() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      this.hitCellsBoardArray.push([]);
      for (let j = 0; j < BOARD_SIZE; j++) {
        this.hitCellsBoardArray[i].push(false);
      }
    }
  }

  #addShipToListOfShips(shipObj) {
    this.shipsOnBoardArray.push(shipObj);
  }
}
