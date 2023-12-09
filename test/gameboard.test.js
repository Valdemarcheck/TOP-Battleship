import { Gameboard } from "../src/gameboard";

function Ship(length) {
  this.length = length;
  this.timesHit = 0;
  this.hit = () => {
    this.timesHit++;
  };
  Object.defineProperty(this, "isSunk", {
    get: () => {
      return this.timesHit >= this.length;
    },
  });
}

test("Gameboard places horizontal 1x1 ship at certain coordinates", () => {
  const ship = new Ship(1);
  const board = new Gameboard();
  board.place({ shipObj: ship, isVertical: false, originX: 10, originY: 10 });
  expect(board.isFilledCell(10, 10)).toBe(true);
});

test("Gameboard places horizontal 2x1 ship at certain coordinates", () => {
  const ship = new Ship(2);
  const board = new Gameboard();
  board.place({ shipObj: ship, isVertical: false, originX: 5, originY: 5 });
  expect(board.isFilledCell(5, 5)).toBe(true);
  expect(board.isFilledCell(6, 5)).toBe(true);
});

test("Gameboard places horizontal 3x1 ship at certain coordinates", () => {
  const ship = new Ship(3);
  const board = new Gameboard();
  board.place({ shipObj: ship, isVertical: false, originX: 5, originY: 5 });
  expect(board.isFilledCell(5, 5)).toBe(true);
  expect(board.isFilledCell(6, 5)).toBe(true);
  expect(board.isFilledCell(7, 5)).toBe(true);
});

test("Gameboard places vertical 2x1 ship at certain coordinates", () => {
  const ship = new Ship(2);
  const board = new Gameboard();
  board.place({ shipObj: ship, isVertical: true, originX: 5, originY: 5 });
  expect(board.isFilledCell(5, 5)).toBe(true);
  expect(board.isFilledCell(5, 4)).toBe(true);
});

test("Gameboard places vertical 3x1 ship at certain coordinates", () => {
  const ship = new Ship(3);
  const board = new Gameboard();
  board.place({ shipObj: ship, isVertical: true, originX: 5, originY: 5 });
  expect(board.isFilledCell(5, 3)).toBe(true);
  expect(board.isFilledCell(5, 4)).toBe(true);
  expect(board.isFilledCell(5, 5)).toBe(true);
});

test("Placing ships isn't allowed out of bounds (1)", () => {
  const ship = new Ship(2);
  const board = new Gameboard();
  expect(() => {
    board.place({ shipObj: ship, isVertical: true, originX: 15, originY: 15 });
  }).toThrow();
});

test("Placing ships isn't allowed out of bounds (2)", () => {
  const ship = new Ship(2);
  const board = new Gameboard();
  expect(() => {
    board.place({ shipObj: ship, isVertical: false, originX: 10, originY: 10 });
  }).toThrow();
});

test("Placing ships isn't allowed on a taken cell (1)", () => {
  const ship1 = new Ship(1);
  const ship2 = new Ship(1);
  const board = new Gameboard();

  board.place({ shipObj: ship1, isVertical: false, originX: 3, originY: 3 });
  expect(() => {
    board.place({ shipObj: ship2, isVertical: true, originX: 3, originY: 3 });
  }).toThrow();
});

test("Placing ships isn't allowed on a taken cell (2)", () => {
  const ship1 = new Ship(1);
  const ship2 = new Ship(3);
  const board = new Gameboard();

  board.place({ shipObj: ship1, isVertical: false, originX: 3, originY: 3 });
  expect(() => {
    board.place({ shipObj: ship2, isVertical: false, originX: 2, originY: 3 });
  }).toThrow();
});

test("receiveAttack works on ship cells", () => {
  const ship = new Ship(5);
  const board = new Gameboard();

  board.place({ shipObj: ship, isVertical: false, originX: 3, originY: 3 });
  board.receiveAttack(5, 3);

  expect(ship.timesHit).toBe(1);
});

test("receiveAttack doesn't allow getting out of bound", () => {
  const board = new Gameboard();
  expect(() => {
    board.isHit(10, 11);
  }).toThrow();
});

test("receiveAttack doesn't allow hitting same cell twice", () => {
  const board = new Gameboard();
  board.receiveAttack(1, 1);
  expect(() => {
    board.receiveAttack(1, 1);
  }).toThrow();
});

test("areAllShipsSunk works for 1 ship", () => {
  const ship = new Ship(1);

  const board = new Gameboard();
  board.place({ shipObj: ship, isVertical: false, originX: 1, originY: 1 });
  expect(board.areAllShipsSunk).toBe(false);

  board.receiveAttack(1, 1);
  expect(board.areAllShipsSunk).toBe(true);
});

test("areAllShipsSunk works for 2 ships", () => {
  const ship1 = new Ship(1);
  const ship2 = new Ship(3);

  const board = new Gameboard();
  board.place({ shipObj: ship1, isVertical: false, originX: 1, originY: 1 });
  board.place({ shipObj: ship2, isVertical: true, originX: 3, originY: 3 });

  board.receiveAttack(1, 1);
  expect(board.areAllShipsSunk).toBe(false);

  board.receiveAttack(3, 1);
  board.receiveAttack(3, 2);
  board.receiveAttack(3, 3);
  expect(board.areAllShipsSunk).toBe(true);
});

test("Passes mockup game session complex test", () => {
  const ship1 = new Ship(1);
  const ship2 = new Ship(3);
  const ship3 = new Ship(5);

  const board = new Gameboard();
  board.place({ shipObj: ship1, isVertical: false, originX: 3, originY: 5 });
  board.place({ shipObj: ship2, isVertical: true, originX: 2, originY: 3 });
  board.place({ shipObj: ship3, isVertical: true, originX: 9, originY: 5 });
  expect(board.areAllShipsSunk).toBe(false);

  // ship1
  board.receiveAttack(3, 5);
  expect(board.areAllShipsSunk).toBe(false);

  // ship2
  board.receiveAttack(2, 1);
  board.receiveAttack(2, 2);
  board.receiveAttack(2, 3);
  expect(board.areAllShipsSunk).toBe(false);

  // ship3
  board.receiveAttack(9, 1);
  board.receiveAttack(9, 2);
  board.receiveAttack(9, 3);
  board.receiveAttack(9, 4);
  board.receiveAttack(9, 5);
  expect(board.areAllShipsSunk).toBe(true);
});
