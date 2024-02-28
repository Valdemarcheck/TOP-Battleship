export class Ship {
  timesHit = 0;

  constructor(length, uniqueID) {
    this.length = length;
    this.uniqueID = uniqueID;
  }

  hit() {
    this.timesHit++;
  }

  get isSunk() {
    return this.timesHit >= this.length;
  }
}
