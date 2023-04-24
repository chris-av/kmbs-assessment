class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  objectify() {
    return { x: this.x, y: this.y }
  }

  stringify() {
    return `${this.x},${this.y}`;
  }

  static objectifyFromString(str) {
    const spltstr = str.split(',');
    return { x: parseInt(spltstr[0]), y: parseInt(spltstr[1]) }
  }

}


module.exports = Point;

