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

test("IsFilledPath detects filled cells properly (1)", () => {
  const ship = new Ship(1);
  const board = new Gameboard();
  board.place(ship, false, 1, 1);
  expect(board.isFilledPath(1, false, 1, 1)).toBe(true);
});

test("IsFilledPath detects filled cells properly (2)", () => {
  const ship = new Ship(2);
  const board = new Gameboard();
  board.place(ship, false, 5, 5);
  expect(board.isFilledPath(2, false, 5, 5)).toBe(true);
});

test("IsFilledPath detects filled cells properly (3)", () => {
  const ship = new Ship(5);
  const board = new Gameboard();
  board.place(ship, true, 5, 7);
  expect(board.isFilledPath(3, false, 3, 5)).toBe(true);
});

test("Gameboard places horizontal 1x1 ship at certain coordinates", () => {
  const ship = new Ship(1);
  const board = new Gameboard();
  board.place(ship, false, 10, 10);
  expect(board.isFilledCell(10, 10)).toBe(true);
});

test("Gameboard places horizontal 2x1 ship at certain coordinates", () => {
  const ship = new Ship(2);
  const board = new Gameboard();
  board.place(ship, false, 5, 5);
  expect(board.isFilledCell(5, 5)).toBe(true);
  expect(board.isFilledCell(6, 5)).toBe(true);
});

test("Gameboard places horizontal 3x1 ship at certain coordinates", () => {
  const ship = new Ship(3);
  const board = new Gameboard();
  board.place(ship, false, 5, 5);
  expect(board.isFilledCell(5, 5)).toBe(true);
  expect(board.isFilledCell(6, 5)).toBe(true);
  expect(board.isFilledCell(7, 5)).toBe(true);
});

test("Gameboard places vertical 2x1 ship at certain coordinates", () => {
  const ship = new Ship(2);
  const board = new Gameboard();
  board.place(ship, true, 5, 5);
  expect(board.isFilledCell(5, 5)).toBe(true);
  expect(board.isFilledCell(5, 4)).toBe(true);
});

test("Gameboard places vertical 3x1 ship at certain coordinates", () => {
  const ship = new Ship(3);
  const board = new Gameboard();
  board.place(ship, true, 5, 5);
  expect(board.isFilledCell(5, 5)).toBe(true);
  expect(board.isFilledCell(5, 4)).toBe(true);
  expect(board.isFilledCell(5, 3)).toBe(true);
});

test("Placing ships isn't allowed out of bounds", () => {
  const ship = new Ship(2);
  const board = new Gameboard();
  expect(() => {
    board.place(ship, false, 10, 10);
  }).toThrow();
});

test("Placing ships isn't allowed on a taken cell (1)", () => {
  const ship1 = new Ship(1);
  const ship2 = new Ship(1);
  const board = new Gameboard();

  board.place(ship1, true, 3, 3);
  expect(() => {
    board.place(ship2, true, 3, 3);
  }).toThrow();
});

test("Placing ships isn't allowed on a taken cell (2)", () => {
  const ship1 = new Ship(1);
  const ship2 = new Ship(3);
  const board = new Gameboard();

  board.place(ship1, false, 3, 3);
  expect(() => {
    board.place(ship2, false, 2, 3);
  }).toThrow();
});

test("isHit detects cells that aren't hit", () => {
  const board = new Gameboard();
  expect(board.isHit(1, 1)).toBe(false);
});

test("receiveAttack works on empty cells", () => {
  const board = new Gameboard();
  board.receiveAttack(1, 1);
  expect(board.isHit(1, 1)).toBe(true);
});

test("receiveAttack works on ship cells", () => {
  const ship = new Ship(5);
  const board = new Gameboard();

  board.place(ship, false, 3, 3);
  board.receiveAttack(5, 3);

  expect(board.isHit(5, 3)).toBe(true);
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
  board.place(ship, false, 1, 1);
  expect(board.areAllShipsSunk).toBe(false);

  board.receiveAttack(1, 1);
  expect(board.areAllShipsSunk).toBe(true);
});

test("areAllShipsSunk works for 2 ships", () => {
  const ship1 = new Ship(1);
  const ship2 = new Ship(3);

  const board = new Gameboard();
  board.place(ship1, false, 1, 1);
  board.place(ship2, true, 3, 3);

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
  board.place(ship1, false, 3, 5);
  board.place(ship2, true, 2, 3);
  board.place(ship3, true, 9, 5);
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
