import { Ship } from "../src/ship";

describe("Ship class", () => {
  test("Hit functionality works", () => {
    const ship = new Ship(1);
    ship.hit();
    expect(ship.timesHit).toBe(1);
  });

  test("Sinking detection works", () => {
    const ship = new Ship(2);
    ship.hit();
    ship.hit();
    expect(ship.isSunk).toBe(true);
  });
});
