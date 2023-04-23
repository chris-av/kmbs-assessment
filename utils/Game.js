const validateLine = require('./validateLine');
const createGrid = require('./create-grid');
const { makePayload, gameOver } = require('./generatePayload');

// game can be over when not all nodes are exhausted (when there are no other paths left)
// You have to determine if a given path intersects an already registered node
//     this means you have to keep track of all nodes in the game so far
//     also must write a function that can describe all the points along a given path
//     must also write a function that can determine whether a path intersects a node
// do I have to keep track of paths are valid at any given moment?

class Game {
  constructor() {
    this.beginNode = true;
    this.p1_turn = true;
    this.current_nodes = [];
    this.forbiddenNodes = [];
    this.valid_start_nodes = createGrid(4, 4);
  }

  reset() {
    this.beginNode = true;
    this.p1_turn = true;
    this.current_nodes = [];
    this.forbiddenNodes = [];
    this.valid_start_nodes = createGrid(4, 4);
    return this;
  }

  hasValidAdjacentNodes(point) {
    let adjs = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) { continue; }
        if (i < 0 || j < 0) { continue; }

        const newX = point.x + i;
        const newY = point.y + j;

        const filteredForbidden = this.forbiddenNodes.filter(p => p.x === newX && p.y === newY);
        if (filteredForbidden.length >= 1) { continue; }

        adjs.push({ x: point.x + i, y: point.y + j });
      }
    }

    // const f = this.forbiddenNodes;
    // console.log({ adjs, f });

    return adjs.length > 0;

  }

  // determines if two points are octilinear
  // i.e. line segment is oriented in phases of 45deg
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
   * @description determine all the points along a path
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

  isValidStartNode(point) {
    // first move should allow any node
    // second move, should be the start and end points
    // every subsequent move should be the first end point and the last end point
    return this.valid_start_nodes.filter(node => {
      return point.x === node.x && point.y === node.y;
    }).length >= 1;
  }

  isValidEndNode(point) {
    const startNode = this.current_nodes[0];
    const endNode = point;
    const path = this.describePath(startNode, endNode);
    const slope = this.calculateSlope(startNode, point);

    if (!this.isOctilinear(startNode, endNode)) { return false; }

    for (let i = 0; i < path.length; i++) {
      const check = this.forbiddenNodes.filter(n => n.x === path[i].x && n.y === path[i].y);
      if (check.length === 1) { return false; }
    }

    // if two nodes are along x axis, y axis, or along a diagonal, should be fair game
    if (startNode.x === endNode.x || startNode.y === endNode.y || Math.abs(slope) === 1) {
      return true;
    }

    return false;

  }

  processTurn(point) {
    try {
      let isValidMove;

      this.current_nodes.push(point);

      if (this.beginNode) {
        isValidMove = this.isValidStartNode(point);
      } else {
        isValidMove = this.isValidEndNode(point);
      }

      if (!isValidMove) {
        const payload = makePayload({
          is_p1_turn: this.p1_turn,
          isValidNode: false,
          isBeginNode: this.beginNode,
          nodes: null,
        });

        // reset
        this.current_nodes = [];
        this.beginNode = true;

        return payload;

      }


      // we are just getting the first node
      if (this.beginNode) {
        this.beginNode = !this.beginNode;
        return makePayload({
          is_p1_turn: this.p1_turn,
          isValidNode: true,
          isBeginNode: true,
        });
      }


      // if you are here, it is because it is the ending node
      const startNode = this.current_nodes[0];
      const endNode = this.current_nodes[1];
      const path = this.describePath(startNode, endNode);
      const forbidPath = path.filter(p => p.x !== endNode.x || p.y !== endNode.y);
      this.forbiddenNodes = this.forbiddenNodes.concat(forbidPath);

      // end the game, if there are no valid nodes left
      if (this.valid_start_nodes.length === 0) {
        return gameOver({
          is_p1_turn: this.p1_turn,
          nodes: this.current_nodes,
        });
      }

      const payload = makePayload({
        is_p1_turn: this.p1_turn,
        isValidNode: true,
        isBeginNode: false,
        nodes: this.current_nodes,
      });


      // reset everything
      this.current_nodes = [];
      this.p1_turn = !this.p1_turn;
      this.beginNode = !this.beginNode;

      return payload;

    } catch (err) {
      console.log(err);
      return {};
    }
  }

}

module.exports = Game;

