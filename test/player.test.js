import { Player } from "../src/player";

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

function Ship(length) {
  this.length = length;
  this.timesHit = 0;
  this.hit = function () {
    this.timesHit++;
  };
}

function Board() {
  this.boardSize = 10;
  this.attackedCells = getArrayOfSameValues(10, false);
  this.shipCells = getArrayOfSameValues(10, null);

  this.isCellHit = function (x, y) {
    return this.attackedCells[y - 1][x - 1];
  };
  this.areCoordinatesOutOfBounds = function (x, y) {
    return x > this.boardSize || y > this.boardSize || x < 0 || y < 0;
  };
  this.receiveAttack = function (x, y) {
    if (this.areCoordinatesOutOfBounds(x, y) || this.isCellHit(x, y))
      throw "Out of bounds";

    this.attackedCells[y - 1][x - 1] = true;
    if (this.shipCells[y - 1][x - 1]) {
      this.shipCells[y - 1][x - 1].hit();
    }
  };
  this.place = function ({ shipObj, isVertical, originX, originY }) {
    if (shipObj.length === 1) {
      this.shipCells[originY - 1][originX - 1] = shipObj;
      return;
    }
    if (isVertical) {
      for (let i = 0; i < shipObj.length; i++) {
        this.shipCells[originY - i - 1][originX - 1] = shipObj;
      }
    } else {
      for (let i = 0; i < shipObj.length; i++) {
        this.shipCells[originY - 1][originX + i - 1] = shipObj;
      }
    }
  };
}

describe("Player factory function", () => {
  test("Attacks enemy cell if coordinates are valid", () => {
    const enemyBoard = new Board();
    const player = Player(null, enemyBoard);

    player.takeTurn(2, 2);
    expect(enemyBoard.isCellHit(2, 2)).toBe(true);

    player.takeTurn(3, 5);
    expect(enemyBoard.isCellHit(3, 5)).toBe(true);
  });

  test("Doesn't throw if given coordinates are out of bounds", () => {
    const enemyBoard = new Board();
    const player = Player(null, enemyBoard);

    expect(() => {
      player.takeTurn(12, -7);
    }).not.toThrow();
  });

  test("Doesn't throw if cell was already hit", () => {
    const enemyBoard = new Board();
    const player = Player(null, enemyBoard);

    player.takeTurn(2, 2);
    expect(() => {
      player.takeTurn(2, 2);
    }).not.toThrow();
  });

  test("Attacks enemy ship if it's on given coordinates", () => {
    const enemyBoard = new Board();
    const enemyShip = new Ship(3);
    enemyBoard.place({
      shipObj: enemyShip,
      isVertical: true,
      originX: 5,
      originY: 5,
    });

    const player = Player(null, enemyBoard);
    player.takeTurn(5, 5);
    player.takeTurn(5, 4);
    player.takeTurn(5, 3);
    expect(enemyShip.timesHit).toBe(3);
  });
});
