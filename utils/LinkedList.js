const Point = require('./Point');

/**
 * Linked List
 * @constructor
 * @param {any} point - a point with properties x and y
 * @param {any} next - a point with properties x and y
 * @param {LinkedList} next - the next node of the LinkedList
 *
 */
class LinkedList {
  constructor(point, next) {
    this.point = new Point(point.x, point.y);
    this.point.next = (next === undefined ? null : next);
    this.head = new Point(point.x, point.y);
    this.tail = new Point(point.x, point.y);
  }

  /**
   * add node to the list
   * @param {any} point - a point with properties x and y
   * @return {LinkedList} - returns linked list so that you can chain your methods
   */
  add(point) {
    if (this.point == undefined) { this.point = new Point(point); return this; }
    let currNode = this.point;
    const _point = new Point(point.x, point.y);

    while (currNode.next) {
      if (currNode !== undefined && currNode.stringify() === _point.stringify()) {
        throw "cannot add the same node";
      }
      currNode = currNode.next;
    }

    currNode.next = new Point(point.x, point.y);
    this.tail = currNode.next;

    return this;

  }

}

module.exports = LinkedList;
