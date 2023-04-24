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
    expect(game.describePath("04", "24")).toEqual([
      "04", "14", "24",
    ]);
    expect(game.describePath("02", "32")).toEqual([
      "02", "12", "22", "32",
    ]);
    expect(game.describePath("00", "00")).toEqual([
      "00",
    ]);
  });

  test("calculate a valid vertical line", () => {
    expect(game.describePath("04", "00")).toEqual([
      "00", "01", "02", "03", "04",
    ]);
    expect(game.describePath("21", "22")).toEqual([
      "21", "22",
    ]);
  });

  test("calculate a valid diagonal line, negative slope", () => {
    expect(game.describePath("02", "20")).toEqual([
      "02", "11", "20",
    ]);
    expect(game.describePath("20", "02")).toEqual([
      "02", "11", "20",
    ]);
  });

  test("calculate a valid diagonal line, positive slope", () => {
    expect(game.describePath("00", "33")).toEqual([
      "00", "11", "22", "33",
    ]);
    expect(game.describePath("10", "32")).toEqual([
      "10", "21", "32",
    ]);
    expect(game.describePath("23", "12")).toEqual([
      "12", "23",
    ]);
  });

  test("determine whether point has valid adjacent slopes", () => {
    // corner has no more valid adjacent nodes
    game.forbiddenNodes.push("10", "11", "01");
    expect(game.hasValidAdjacentNodes("00")).toEqual(false);
    game.reset();

    // corner only has one valid adjacent node left to use
    game.forbiddenNodes.push("10", "11");
    expect(game.hasValidAdjacentNodes("00")).toEqual(true);

    game.forbiddenNodes.push("01", "11", "12", "13");
    expect(game.hasValidAdjacentNodes("02")).toEqual(true);

  });

  test("calculate slope", () => {
    expect(game.calculateSlope("00", "11", { x: 0, y: 0 }, { x: 1, y: 1 })).toEqual(1);
    expect(game.calculateSlope("00", "12", { x: 0, y: 0 }, { x: 1, y: 2 })).toEqual(2);
  });

  test("determine if two points are octilinear to eachother", () => {
    expect(game.isOctilinear("00", "11")).toBe(true);
    expect(game.isOctilinear("00", "22")).toBe(true);
    expect(game.isOctilinear("03", "30")).toBe(true);
    expect(game.isOctilinear("12", "01")).toBe(true);

    expect(game.isOctilinear("00", "23")).toBe(false);
    expect(game.isOctilinear("12", "31")).toBe(false);

  });

  test("any first move should be valid", () => {
    expect(game.isValidStartNode("00")).toEqual(true);
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

