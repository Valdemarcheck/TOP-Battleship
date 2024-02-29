import { Gameboard } from "../src/gameplay/gameboard";

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
  board.place({ shipObj: ship, isVertical: false, startX: 10, startY: 10 });
  expect(board.isShipPlacedOnCoordinates(10, 10)).toBe(true);
});

test("Gameboard places horizontal 2x1 ship at certain coordinates", () => {
  const ship = new Ship(2);
  const board = new Gameboard();
  board.place({ shipObj: ship, isVertical: false, startX: 5, startY: 5 });
  expect(board.isShipPlacedOnCoordinates(5, 5)).toBe(true);
  expect(board.isShipPlacedOnCoordinates(6, 5)).toBe(true);
});

test("Gameboard places horizontal 3x1 ship at certain coordinates", () => {
  const ship = new Ship(3);
  const board = new Gameboard();
  board.place({ shipObj: ship, isVertical: false, startX: 5, startY: 5 });
  expect(board.isShipPlacedOnCoordinates(5, 5)).toBe(true);
  expect(board.isShipPlacedOnCoordinates(6, 5)).toBe(true);
  expect(board.isShipPlacedOnCoordinates(7, 5)).toBe(true);
});

test("Gameboard places vertical 2x1 ship at certain coordinates", () => {
  const ship = new Ship(2);
  const board = new Gameboard();
  board.place({ shipObj: ship, isVertical: true, startX: 5, startY: 5 });
  expect(board.isShipPlacedOnCoordinates(5, 5)).toBe(true);
  expect(board.isShipPlacedOnCoordinates(5, 4)).toBe(true);
});

test("Gameboard places vertical 3x1 ship at certain coordinates", () => {
  const ship = new Ship(3);
  const board = new Gameboard();
  board.place({ shipObj: ship, isVertical: true, startX: 5, startY: 5 });
  expect(board.isShipPlacedOnCoordinates(5, 3)).toBe(true);
  expect(board.isShipPlacedOnCoordinates(5, 4)).toBe(true);
  expect(board.isShipPlacedOnCoordinates(5, 5)).toBe(true);
});

test("Placing ships isn't allowed out of bounds (1)", () => {
  const ship = new Ship(2);
  const board = new Gameboard();
  expect(() => {
    board.place({ shipObj: ship, isVertical: true, startX: 15, startY: 15 });
  }).toThrow();
});

test("Placing ships isn't allowed out of bounds (2)", () => {
  const ship = new Ship(2);
  const board = new Gameboard();
  expect(() => {
    board.place({ shipObj: ship, isVertical: false, startX: 10, startY: 10 });
  }).toThrow();
});

test("Placing ships isn't allowed on a taken cell (1)", () => {
  const ship1 = new Ship(1);
  const ship2 = new Ship(1);
  const board = new Gameboard();

  board.place({ shipObj: ship1, isVertical: false, startX: 3, startY: 3 });
  expect(() => {
    board.place({ shipObj: ship2, isVertical: true, startX: 3, startY: 3 });
  }).toThrow();
});

test("Placing ships isn't allowed on a taken cell (2)", () => {
  const ship1 = new Ship(1);
  const ship2 = new Ship(3);
  const board = new Gameboard();

  board.place({ shipObj: ship1, isVertical: false, startX: 3, startY: 3 });
  expect(() => {
    board.place({ shipObj: ship2, isVertical: false, startX: 2, startY: 3 });
  }).toThrow();
});

test("receiveAttack works on ship cells", () => {
  const ship = new Ship(5);
  const board = new Gameboard();

  board.place({ shipObj: ship, isVertical: false, startX: 3, startY: 3 });
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
  board.place({ shipObj: ship, isVertical: false, startX: 1, startY: 1 });
  expect(board.areAllShipsSunk).toBe(false);

  board.receiveAttack(1, 1);
  expect(board.areAllShipsSunk).toBe(true);
});

test("areAllShipsSunk works for 2 ships", () => {
  const ship1 = new Ship(1);
  const ship2 = new Ship(3);

  const board = new Gameboard();
  board.place({ shipObj: ship1, isVertical: false, startX: 1, startY: 1 });
  board.place({ shipObj: ship2, isVertical: true, startX: 3, startY: 3 });

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
  board.place({ shipObj: ship1, isVertical: false, startX: 3, startY: 5 });
  board.place({ shipObj: ship2, isVertical: true, startX: 2, startY: 3 });
  board.place({ shipObj: ship3, isVertical: true, startX: 9, startY: 5 });
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

test("isPlacementLegal correctly detects placement out of bounds", () => {
  const board = new Gameboard();
  const ship = new Ship(4);

  // out of bounds at the front
  expect(
    board.isPlacementLegal({
      shipObj: ship,
      isVertical: false,
      startX: -2,
      startY: 1,
    })
  ).toBe(false);

  // out of bounds from behind
  expect(
    board.isPlacementLegal({
      shipObj: ship,
      isVertical: false,
      startX: 9,
      startY: 1,
    })
  ).toBe(false);
});

test("isPlacementLegal correctly detects placements over other ships", () => {
  const board = new Gameboard();
  const ship1 = new Ship(3);
  const ship2 = new Ship(4);
  board.place({ shipObj: ship1, isVertical: false, startX: 1, startY: 1 });
  expect(
    board.isPlacementLegal({
      shipObj: ship2,
      isVertical: false,
      startX: 2,
      startY: 1,
    })
  ).toBe(false);
});
