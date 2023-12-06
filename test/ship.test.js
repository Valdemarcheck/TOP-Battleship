import { Ship } from "../src/ship";

describe("Ship class", () => {
  test("Hit functionality works (1)", () => {
    const ship = new Ship(1);
    ship.hit();
    expect(ship.timesHit).toBe(1);
  });

  test("Hit functionality works (2)", () => {
    const ship = new Ship(4);
    ship.hit();
    expect(ship.timesHit).toBe(1);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.timesHit).toBe(4);
  });

  test("Sinking detection works", () => {
    const ship = new Ship(2);
    ship.hit();
    ship.hit();
    expect(ship.isSunk).toBe(true);
  });
});
