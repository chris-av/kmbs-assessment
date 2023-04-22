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
    this.past_moves = [];
    this.valid_start_nodes = createGrid(4, 4);
  }

  reset() {
    this.beginNode = true;
    this.p1_turn = true;
    this.current_nodes = [];
    this.past_moves = [];
    this.valid_start_nodes = createGrid(4, 4);
    return this;
  }

  // determines if two points are octilinear
  // i.e. line segment is oriented in phases of 45deg
  isOctilinear(p1, p2) {
    const deltaX = Math.abs(p1.x - p2.x);
    const deltaY = Math.abs(p1.y - p2.y);
    return deltaX === deltaY;
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

  isValidMove(point) {
    return this.valid_start_nodes.filter(node => {
      return point.x === node.x && point.y === node.y;
    }).length >= 1;
  }

  // use this every time we POST to /node-clicked
  processTurn(point) {
    const isValidMove = this.isValidMove(point);
    if (!isValidMove) { throw new Error("not a valid move"); }

    // if on second move, check to see that new node is valid

    this.current_nodes.push(point);

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
    this.past_moves.push([...this.current_nodes]);
    const tmp_nodes = [...this.current_nodes];
    this.current_nodes = [];

    const curr_turn = this.p1_turn;
    this.p1_turn = !this.p1_turn;
    this.beginNode = !this.beginNode;

    // TODO: recaluclate new available nodes

    // end the game, if there are no valid nodes left
    if (this.valid_start_nodes.length === 0) {
      return gameOver({
        is_p1_turn: this.p1_turn,
        nodes: tmp_nodes,
      });
    }

    return makePayload({
      is_p1_turn: curr_turn,
      isValidNode: true,
      isBeginNode: false,
      nodes: tmp_nodes,
    });

  }

}

module.exports = Game;

