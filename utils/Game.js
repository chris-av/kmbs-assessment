const createGrid = require('./create-grid');
const Point = require('./Point');
const { makePayload, gameOver } = require('./generatePayload');


class Game {
  constructor(sizeX, sizeY) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.beginNode = true;
    this.isP1Turn = true;
    this.currentNodes = [];
    this.forbiddenNodes = [];
    this.validStartNodes = createGrid(sizeX, sizeY);
    this.round = 0;
  }

  /** 
   * @description resets the game to its initial parameters
   * @returns this object instance itself
   */
  reset() {
    this.beginNode = true;
    this.isP1Turn = true;
    this.currentNodes = [];
    this.forbiddenNodes = [];
    this.validStartNodes = createGrid(this.sizeX, this.sizeY);
    this.round = 0;
    return this;
  }

  /** 
   * @description determine whether a given point has available adjacent nodes given the game's current state
   * @param point - an string describing a Point in format "x,y"
   * @returns {boolean}
   */
  hasValidAdjacentNodes(point) {
    const _point = Point.objectifyFromString(point);
    let adjs = [];

    // for a given point, look around it and determine whether there are nodes adjacent to it that are valid to traverse
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) { continue; }

        const newX = _point.x + i;
        const newY = _point.y + j;

        // check that new point is within bounds of the grid
        if (newX < 0 || newY < 0) { continue; }
        if (newX > this.sizeX - 1 || newY > this.sizeY - 1) { continue; }

        const newPoint = new Point(newX, newY);

        if (this.forbiddenNodes.includes(newPoint.stringify())) {
          continue;
        };

        adjs.push(newPoint.stringify());
      }
    }

    return adjs.length > 0;

  }

  /** 
   * @description determine all the points along a path
   * @param p1 - a string describing a point in format "x,y"
   * @param p2 - a string describing a point in format "x,y"
   * @returns {boolean}
   */
  isOctilinear(p1, p2) {
    const slope = this.calculateSlope(p1, p2);
    if (slope === 0 || Math.abs(slope) === 1 || !(isFinite(slope))) {
      return true;
    }
    return false;
  }

  /** 
   * @description calculates slope given two points
   * @param p1 - a string describing a point in format "x,y"
   * @param p2 - a string describing a point in format "x,y"
   * @returns {number}
   */
  calculateSlope(p1, p2) {
    const _p1 = Point.objectifyFromString(p1);
    const _p2 = Point.objectifyFromString(p2);
    return (
      (_p2.y - _p1.y) / (_p2.x - _p1.x)
    );
  }

  /** 
   * @description create an array containing all the points along a path, p1 to p2
   * @param p1 - an object describing a point, with props X and Y
   * @param p2 - an object describing a point, with props X and Y
   * @return an array of points that are along the path of p1, p2
   */
  describePath(p1, p2) {
    const _p1 = Point.objectifyFromString(p1);
    const _p2 = Point.objectifyFromString(p2);
    let path = [];

    // path is horizontal, get all the Y's in between
    if (_p1.x === _p2.x) {
      const x = _p1.x;
      const from_y = Math.min(_p1.y, _p2.y);
      const to_y = Math.max(_p1.y, _p2.y);
      for (let i = 0; i <= (to_y - from_y); i++) {
        const point = new Point(x, from_y + i);
        path.push(point.stringify());
      }
      return path;
    }

    // path is vertical, get all the X's in between
    if (_p1.y === _p2.y) {
      const y = _p1.y;
      const from_x = Math.min(_p1.x, _p2.x);
      const to_x = Math.max(_p1.x, _p2.x);
      for (let i = 0; i <= (to_x - from_x); i++) {
        const point = new Point(from_x + i, y);
        path.push(point.stringify());
      }
      return path;
    }

    const slope = this.calculateSlope(p1, p2);

    if (slope === -1) {
      const from_x = Math.min(_p1.x, _p2.x);
      const to_x = Math.max(_p1.x, _p2.x);
      const from_y = Math.max(_p1.y, _p2.y);

      for (let i = 0; i <= (to_x - from_x); i++) {
        const point = new Point(from_x + i, from_y - i);
        path.push(point.stringify());
      }

      return path;

    }

    if (slope === 1) {
      const from_x = Math.min(_p1.x, _p2.x);
      const to_x = Math.max(_p1.x, _p2.x);
      const from_y = Math.min(_p1.y, _p2.y);

      for (let i = 0; i <= (to_x - from_x); i++) {
        const point = new Point(from_x + i, from_y + i);
        path.push(point.stringify());
      }

      return path;

    }

  }

  /** 
   * @description determines whether a given point is a valid start for a line segment given the game's current state
   * @param point - a string describing a point in format "x,y"
   * @returns {boolean}
   */
  isValidStartNode(point) {
    // check that the point in question is listed in valid_start_nodes
    return this.validStartNodes.includes(point);
  }

  /** 
   * @description determines whether a given point is a valid end for a line segment given the game's current state
   * @param point - a string describing a point in format "x,y"
   * @returns {boolean}
   */
  isValidEndNode(point) {
    const startNode = this.currentNodes[0];
    const endNode = point;
    const path = this.describePath(startNode, endNode);

    if (!this.isOctilinear(startNode, endNode)) { return false; }

    for (let i = 0; i < path.length; i++) {
      if (this.forbiddenNodes.includes(path[i])) {
        return false;
      }
    }

    return true;

  }

  /** 
   * @description runs a process that implements game logic
   * @param point - an object containing point.x and point.y, payload direct from the client
   * @returns a payload expected by the client
   */
  processTurn(point) {
    try {
      const _point = new Point(point.x, point.y);
      let isValidMove;

      this.currentNodes.push(_point.stringify());

      if (this.beginNode) {
        isValidMove = this.isValidStartNode(_point.stringify());
      } else {
        isValidMove = this.isValidEndNode(_point.stringify());
      }

      if (!isValidMove) {
        const payload = makePayload({
          is_p1_turn: this.isP1Turn,
          isValidNode: false,
          isBeginNode: this.beginNode,
          nodes: null,
        });

        // reset
        this.currentNodes = [];
        this.beginNode = true;

        return payload;

      }


      // we are just getting the first node
      if (this.beginNode) {
        this.beginNode = !this.beginNode;
        return makePayload({
          is_p1_turn: this.isP1Turn,
          isValidNode: true,
          isBeginNode: true,
        });
      }


      // if you are here, it is because it is the ending node
      const startNode = this.currentNodes[0];
      const endNode = this.currentNodes[1];
      const path = this.describePath(startNode, endNode);

      // recalculate valid start and end nodes
      if (this.round === 0) {
        this.validStartNodes = [startNode, endNode];
      } else {

        const forbidPath = path.filter(p => p !== endNode);
        this.forbiddenNodes = this.forbiddenNodes.concat(forbidPath);

        // replace the current start with the end node
        const indx = this.validStartNodes.findIndex(node => node === startNode);
        this.validStartNodes[indx] = endNode;

        if (this.hasValidAdjacentNodes(this.validStartNodes[0]) === false) {
          this.validStartNodes.shift();
        }

        if (this.validStartNodes.length >= 2 && this.hasValidAdjacentNodes(this.validStartNodes[1]) === false) {
          this.validStartNodes.pop();
        }

      }

      this.isP1Turn = !this.isP1Turn;

      // end the game, if there are no valid nodes left
      if (this.validStartNodes.length === 0) {
        return gameOver({
          is_p1_turn: this.isP1Turn,
          nodes: this.currentNodes.map(node => Point.objectifyFromString(node)),
        });
      }

      const payload = makePayload({
        is_p1_turn: this.isP1Turn,
        isValidNode: true,
        isBeginNode: false,
        nodes: this.currentNodes.map(node => Point.objectifyFromString(node)),
      });


      // reset everything
      this.currentNodes = [];
      this.beginNode = !this.beginNode;
      this.round += 1;

      return payload;

    } catch (err) {
      console.log(err);
      return { err };
    }
  }

}

module.exports = Game;

