const createGrid = require('./create-grid');
const { makePayload, gameOver } = require('./generatePayload');


class Game {
  constructor() {
    this.beginNode = true;
    this.isP1Turn = true;
    this.currentNodes = [];
    this.forbiddenNodes = [];
    this.validStartNodes = createGrid(4, 4);
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
    this.validStartNodes = createGrid(4, 4);
    this.round = 0;
    return this;
  }

  /** 
   * @description determine whether a given point has available adjacent nodes given the game's current state
   * @param point - an object describing a point, with props x and y
   * @returns {boolean}
   */
  hasValidAdjacentNodes(point) {
    let adjs = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) { continue; }
        if (i < 0 || j < 0) { continue; }

        const newX = point.x + i;
        const newY = point.y + j;

        const filteredForbidden = this.forbiddenNodes.filter(p => p.x === newX && p.y === newY);
        if (newX > 3 || newY > 3) { continue; }
        if (filteredForbidden.length >= 1) { continue; }

        adjs.push({ x: point.x + i, y: point.y + j });
      }
    }

    return adjs.length > 0;

  }

  /** 
   * @description determine all the points along a path
   * @param p1 - an object describing a point, with props x and y
   * @param p2 - an object describing a point, with props x and y
   * @returns {boolean}
   */
  isOctilinear(p1, p2) {
    const slope = this.calculateSlope(p1, p2);
    if (slope === 0 || Math.abs(slope) === 1 || !(isFinite(slope))) {
      return true;
    }
    return false;
  }

  calculateSlope(p1, p2) {
    return (
      (p2.y - p1.y) / (p2.x - p1.x)
    )
  }

  /** 
   * @description create an array containing all the points along a path, p1 to p2
   * @param p1 - an object describing a point, with props X and Y
   * @param p2 - an object describing a point, with props X and Y
   * @return an array of points that are along the path of p1, p2
   */
  describePath(p1, p2) {
    let path = [];

    // path is horizontal, get all the Y's in between
    if (p1.x === p2.x) {
      const x = p1.x;
      const from_y = Math.min(p1.y, p2.y);
      const to_y = Math.max(p1.y, p2.y);
      for (let i = 0; i <= (to_y - from_y); i++) {
        path.push({ x: x, y: from_y + i });
      }
      return path;
    }

    // path is vertical, get all the X's in between
    if (p1.y === p2.y) {
      const y = p1.y;
      const from_x = Math.min(p1.x, p2.x);
      const to_x = Math.max(p1.x, p2.x);
      for (let i = 0; i <= (to_x - from_x); i++) {
        path.push({ x: from_x + i, y: y });
      }
      return path;
    }

    const slope = this.calculateSlope(p1, p2);

    if (slope === -1) {
      const from_x = Math.min(p1.x, p2.x);
      const to_x = Math.max(p1.x, p2.x);
      const from_y = Math.max(p1.y, p2.y);

      for (let i = 0; i <= (to_x - from_x); i++) {
        path.push({ x: (from_x + i), y: (from_y - i) });
      }

      return path;

    }

    if (slope === 1) {
      const from_x = Math.min(p1.x, p2.x);
      const to_x = Math.max(p1.x, p2.x);
      const from_y = Math.min(p1.y, p2.y);

      for (let i = 0; i <= (to_x - from_x); i++) {
        path.push({ x: from_x + i, y: (from_y + i) });
      }

      return path;

    }

    // return new Error("not a valid line");

  }

  /** 
   * @description determines whether a given point is a valid start for a line segment given the game's current state
   * @param point - an object containing point.x and point.y
   * @returns {boolean}
   */
  isValidStartNode(point) {
    // check that the point in question is listed in valid_start_nodes
    return this.validStartNodes.filter(node => {
      return point.x === node.x && point.y === node.y;
    }).length >= 1;
  }

  /** 
   * @description determines whether a given point is a valid end for a line segment given the game's current state
   * @param point - an object containing point.x and point.y
   * @returns {boolean}
   */
  isValidEndNode(point) {
    const startNode = this.currentNodes[0];
    const endNode = point;
    const path = this.describePath(startNode, endNode);

    if (!this.isOctilinear(startNode, endNode)) { return false; }

    for (let i = 0; i < path.length; i++) {
      const check = this.forbiddenNodes.filter(n => n.x === path[i].x && n.y === path[i].y);
      if (check.length === 1) { return false; }
    }

    return true;

  }

  /** 
   * @description runs a process that implements game logic
   * @param point - an object containing point.x and point.y
   * @returns a payload expected by the client
   */
  processTurn(point) {
    try {
      let isValidMove;

      this.currentNodes.push(point);

      if (this.beginNode) {
        isValidMove = this.isValidStartNode(point);
      } else {
        isValidMove = this.isValidEndNode(point);
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

        const forbidPath = path.filter(p => p.x !== endNode.x || p.y !== endNode.y);
        this.forbiddenNodes = this.forbiddenNodes.concat(forbidPath);

        // replace the current start with the end node
        const indx = this.validStartNodes.findIndex(node => node.x === startNode.x && node.y === startNode.y)
        this.validStartNodes[indx] = endNode;

        if (this.hasValidAdjacentNodes(this.validStartNodes[0]) === false) {
          this.validStartNodes.shift();
        } 

        if (this.validStartNodes.length >= 2 && this.hasValidAdjacentNodes(this.validStartNodes[1]) === false) {
          this.validStartNodes.pop();
        }

      }

      // end the game, if there are no valid nodes left
      if (this.validStartNodes.length === 0) {
        return gameOver({
          is_p1_turn: this.isP1Turn,
          nodes: this.currentNodes,
        });
      }

      const payload = makePayload({
        is_p1_turn: this.isP1Turn,
        isValidNode: true,
        isBeginNode: false,
        nodes: this.currentNodes,
      });


      // reset everything
      this.currentNodes = [];
      this.isP1Turn = !this.isP1Turn;
      this.beginNode = !this.beginNode;
      this.round += 1;

      return payload;

    } catch (err) {
      console.log(err);
      return {};
    }
  }

}

module.exports = Game;

