export class Ship {
  timesHit = 0;

  constructor(length, id) {
    this.length = length;
    this.id = id;
  }

  hit() {
    this.timesHit++;
  }

  get isSunk() {
    return this.timesHit >= this.length;
  }
}
