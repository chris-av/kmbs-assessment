class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  objectify() {
    return { x: this.x, y: this.y }
  }

  stringify() {
    return `${this.x}${this.y}`;
  }

}


module.exports = Point;

