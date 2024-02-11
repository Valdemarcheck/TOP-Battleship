class ShipUI {
  static movableShip = null;
  offsetX = 0;
  offsetY = 0;
  tilesPlaced = [];

  constructor(shipElement, length, isRotated) {
    this.isRotated = isRotated;
    this.length = length;
    this.shipElement = shipElement;

    const rect = this.shipElement.getBoundingClientRect();
    this.startY = rect.top;
    this.startX = rect.left;
  }
}
