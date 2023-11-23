export class Ship {
  timesHit = 0;

  constructor(length) {
    this.length = length;
  }

  hit() {
    this.timesHit++;
  }

  isSunk() {
    return this.timesHit >= this.length;
  }
}
