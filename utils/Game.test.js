const { describe, test, expect, afterEach } = require('@jest/globals');
const Point = require('./Point');
const { makePayload, gameOver } = require('./generatePayload');
const Game = require('./Game');


describe("test each individual method", () => {
  const game = new Game(4, 4);
  afterEach(() => {
    game.reset();
  });

  test("reset the game successfully", () => {
    // make a few moves, then reset
    game.processTurn({ x: 0, y: 0 });
    game.processTurn({ x: 0, y: 1 });
    game.processTurn({ x: 0, y: 2 });
    game.reset();
    const game_state = game.forbiddenNodes;
    expect(game_state.length).toEqual(0);
    expect(game_state).toEqual([]);
  });


  test("calculate a valid horizontal line", () => {
    expect(game.describePath("0,4", "2,4")).toEqual([
      "0,4", "1,4", "2,4",
    ]);
    expect(game.describePath("0,2", "3,2")).toEqual([
      "0,2", "1,2", "2,2", "3,2",
    ]);
    expect(game.describePath("0,0", "0,0")).toEqual([
      "0,0",
    ]);
  });

  test("calculate a valid vertical line", () => {
    expect(game.describePath("0,4", "0,0")).toEqual([
      "0,0", "0,1", "0,2", "0,3", "0,4",
    ]);
    expect(game.describePath("2,1", "2,2")).toEqual([
      "2,1", "2,2",
    ]);
  });

  test("calculate a valid diagonal line, negative slope", () => {
    expect(game.describePath("0,2", "2,0")).toEqual([
      "0,2", "1,1", "2,0",
    ]);
    expect(game.describePath("2,0", "0,2")).toEqual([
      "0,2", "1,1", "2,0",
    ]);
  });

  test("calculate a valid diagonal line, positive slope", () => {
    expect(game.describePath("0,0", "3,3")).toEqual([
      "0,0", "1,1", "2,2", "3,3",
    ]);
    expect(game.describePath("1,0", "3,2")).toEqual([
      "1,0", "2,1", "3,2",
    ]);
    expect(game.describePath("2,3", "1,2")).toEqual([
      "1,2", "2,3",
    ]);
  });

  test("determine whether point has valid adjacent slopes", () => {
    // corner has no more valid adjacent nodes
    game.forbiddenNodes.push("1,0", "1,1", "0,1");
    expect(game.hasValidAdjacentNodes("0,0")).toEqual(false);
    game.reset();

    // corner only has one valid adjacent node left to use
    game.forbiddenNodes.push("1,0", "1,1");
    expect(game.hasValidAdjacentNodes("0,0")).toEqual(true);

    game.forbiddenNodes.push("0,1", "1,1", "1,2", "1,3");
    expect(game.hasValidAdjacentNodes("0,2")).toEqual(true);

  });

  test("calculate slope", () => {
    expect(game.calculateSlope("0,0", "1,1")).toEqual(1);
    expect(game.calculateSlope("0,0", "1,2")).toEqual(2);
  });

  test("determine if two points are octilinear to eachother", () => {
    expect(game.isOctilinear("0,0", "1,1")).toBe(true);
    expect(game.isOctilinear("0,0", "2,2")).toBe(true);
    expect(game.isOctilinear("0,3", "3,0")).toBe(true);
    expect(game.isOctilinear("1,2", "0,1")).toBe(true);

    expect(game.isOctilinear("0,0", "2,3")).toBe(false);
    expect(game.isOctilinear("1,2", "3,1")).toBe(false);

  });

  test("any first move should be valid", () => {
    expect(game.isValidStartNode("0,0")).toEqual(true);
  });


});


describe("test the game", () => {

  const game = new Game(4, 4);

  afterEach(() => {
    game.reset();
  });

  test("check progress of game", () => {

    // PLAYER 1
    expect(game.processTurn({
      x: 0, y: 2,
    })).toEqual(makePayload({
      is_p1_turn: true,
      isValidNode: true,
      isBeginNode: true,
    }));

    expect(game.processTurn({
      x: 0, y: 3,
    })).toEqual(makePayload({
      is_p1_turn: true,
      isValidNode: true,
      isBeginNode: false,
      nodes: [{ x: 0, y: 2 }, { x: 0, y: 3 }],
    }));


    // PLAYER 2
    expect(game.processTurn({
      x: 0, y: 3,
    })).toEqual(makePayload({
      is_p1_turn: false,
      isValidNode: true,
      isBeginNode: true,
    }));

    expect(game.processTurn({
      x: 1, y: 2,
    })).toEqual(makePayload({
      is_p1_turn: false,
      isValidNode: true,
      isBeginNode: false,
      nodes: [{ x: 0, y: 3 }, { x: 1, y: 2 }],
    }));

    // PLAYER 1
    expect(game.processTurn({
      x: 1, y: 2,
    })).toEqual(makePayload({
      is_p1_turn: true,
      isValidNode: true,
      isBeginNode: true,
    }));

    expect(game.processTurn({
      x: 1, y: 0,
    })).toEqual(makePayload({
      is_p1_turn: true,
      isValidNode: true,
      isBeginNode: false,
      nodes: [{ x: 1, y: 2 }, { x: 1, y: 0 }],
    }));

    // PLAYER 2
    expect(game.processTurn({
      x: 1, y: 0,
    })).toEqual(makePayload({
      is_p1_turn: false,
      isValidNode: true,
      isBeginNode: true,
    }));

    expect(game.processTurn({
      x: 0, y: 1,
    })).toEqual(makePayload({
      is_p1_turn: false,
      isValidNode: true,
      isBeginNode: false,
      nodes: [{ x: 1, y: 0 }, { x: 0, y: 1 }],
    }));

    // PLAYER 1
    expect(game.processTurn({
      x: 0, y: 1,
    })).toEqual(makePayload({
      is_p1_turn: true,
      isValidNode: true,
      isBeginNode: true,
    }));

    expect(game.processTurn({
      x: 0, y: 0,
    })).toEqual(makePayload({
      is_p1_turn: true,
      isValidNode: true,
      isBeginNode: false,
      nodes: [{ x: 0, y: 1 }, { x: 0, y: 0 }],
    }));

  });

});

