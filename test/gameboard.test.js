import { Gameboard } from "../src/gameboard";

test("Gameboard places horizontal 1x1 ship at certain coordinates", () => {
  const ship = new Ship(1);
  const board = new Gameboard();
  board.place(ship, 10, 10);
  expect(board.isPlacedAtCoordinates(10, 10)).toBe(true);
});

test("Gameboard places horizontal 2x1 ship at certain coordinates", () => {
  const ship = new Ship(2);
  const board = new Gameboard();
  board.place(ship, 5, 5);
  expect(board.isPlacedAtCoordinates(5, 5)).toBe(true);
  expect(board.isPlacedAtCoordinates(5, 6)).toBe(true);
});

test("Gameboard places horizontal 3x1 ship at certain coordinates", () => {
  const ship = new Ship(3);
  const board = new Gameboard();
  board.place(ship, 5, 5);
  expect(board.isPlacedAtCoordinates(5, 5)).toBe(true);
  expect(board.isPlacedAtCoordinates(5, 6)).toBe(true);
  expect(board.isPlacedAtCoordinates(5, 7)).toBe(true);
});

test("Placing ships isn't allowed out of bounds", () => {
  const ship = new Ship(2);
  const board = new Gameboard();
  expect(() => {
    board.place(ship, 10, 10);
  }).toThrow();
});

test("Placing ships isn't allowed on a taken cell", () => {
  const ship1 = new Ship(1);
  const ship2 = new Ship(1);
  const board = new Gameboard();

  board.place(ship1, 3, 3);
  expect(() => {
    board.place(ship2, 3, 3);
  }).toThrow();
});

test("receiveAttack doesn't allow getting out of bound", () => {
  const board = new Gameboard();
  except(() => {
    board.isHit(10, 11);
  }).toThrow();
});

test("isHit detects cells that aren't hit", () => {
  const board = new Gameboard();
  except(board.isHit(1, 1)).toBe(false);
});

test("receiveAttack works on empty cells", () => {
  const board = new Gameboard();
  board.receiveAttack(1, 1);
  except(board.isHit(1, 1)).toBe(true);
});

test("receiveAttack works on ship cells", () => {
  const ship = new Ship(5);
  const board = new Gameboard();

  board.place(ship, 3, 3);
  board.receiveAttack(3, 5);

  expect(board.isHit(3, 5)).toBe(true);
  except(ship.timesHit).toBe(1);
});

test("areAllShipsSunk works well for 1 ship", () => {
  const ship = new Ship(1);

  const board = new Gameboard();
  expect(board.areAllShipsSunk).toBe(false);

  board.place(ship, 1, 1);
  board.receiveAttack(1, 1);
  expect(board.areAllShipsSunk).toBe(true);
});

test("areAllShipsSunk works well for 2 ships", () => {
  const ship1 = new Ship(1);
  const ship2 = new Ship(3);

  const board = new Gameboard();
  expect(board.areAllShipsSunk).toBe(false);

  board.place(ship1, 1, 1);
  board.receiveAttack(1, 1);
  expect(board.areAllShipsSunk).toBe(false);

  board.place(ship2, 3, 3);
  board.receiveAttack(3, 3);
  board.receiveAttack(3, 4);
  board.receiveAttack(3, 5);
  expect(board.areAllShipsSunk).toBe(true);
});
