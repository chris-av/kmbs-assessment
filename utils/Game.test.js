const Game = require('./Game');



describe("test the game", () => {

  const game = new Game();

  // make a few moves, then reset
  game.processTurn({ X: 0, Y: 0 });
  game.processTurn({ X: 0, Y: 1 });
  game.processTurn({ X: 0, Y: 2 });

  test("reset the game successfully", () => {
    game.reset();
    const game_state = game.past_moves;
    expect(game_state.length).toEqual(0);
    expect(game_state).toEqual([]);
  });

  test("calculate a valid horizontal line", () => {
    expect(game.describePath({ X: 0, Y: 4 }, { X: 2, Y: 4 })).toEqual([
      { X: 0, Y: 4 }, { X: 1, Y: 4 }, { X: 2, Y: 4 },
    ]);
    expect(game.describePath({ X: 0, Y: 2 }, { X: 3, Y: 2 })).toEqual([
      { X: 0, Y: 2 }, { X: 1, Y: 2 }, { X: 2, Y: 2 }, { X: 3, Y: 2 },
    ]);
    expect(game.describePath({ X: 0, Y: 0 }, { X: 0, Y: 0 })).toEqual([
      { X: 0, Y: 0 },
    ]);
  });

  test("calculate a valid vertical line", () => {
    expect(game.describePath({ X: 0, Y: 4 }, { X: 0, Y: 0 })).toEqual([
      { X: 0, Y: 0 }, { X: 0, Y: 1 }, { X: 0, Y: 2 }, { X: 0, Y: 3 }, { X: 0, Y: 4 },
    ]);
    expect(game.describePath({ X: 2, Y: 1 }, { X: 2, Y: 2 })).toEqual([
      { X: 2, Y: 1 }, { X: 2, Y: 2 },
    ]);
  });

  test("calculate a valid diagonal line, negative slope", () => {
    expect(game.describePath({ X: 0, Y: 2 }, { X: 2, Y: 0 })).toEqual([
      { X: 0, Y: 2 }, { X: 1, Y: 1 }, { X: 2, Y: 0 },
    ]);
    expect(game.describePath({ X: 2, Y: 0 }, { X: 0, Y: 2 })).toEqual([
      { X: 0, Y: 2 }, { X: 1, Y: 1 }, { X: 2, Y: 0 },
    ]);
  });

  test("calculate a valid diagonal line, positive slope", () => {
    expect(game.describePath({ X: 0, Y: 0 }, { X: 3, Y: 3 })).toEqual([
      { X: 0, Y: 0 }, { X: 1, Y: 1 }, { X: 2, Y: 2 }, { X: 3, Y: 3 }
    ]);
    expect(game.describePath({ X: 1, Y: 0 }, { X: 3, Y: 2 })).toEqual([
      { X: 1, Y: 0 }, { X: 2, Y: 1 }, { X: 3, Y: 2 },
    ]);
  });

  test("calculate slope", () => {
    expect(game.calculateSlope({ X: 0, Y: 0 }, { X: 1, Y: 1 })).toEqual(1);
    expect(game.calculateSlope({ X: 0, Y: 0 }, { X: 1, Y: 2 })).toEqual(2);
    expect(game.calculateSlope({ X: 2, Y: 3 }, { X: 5, Y: 13 })).toEqual(10 / 3);
  });

  test("determine if two points are octilinear to eachother", () => {
    expect(game.isOctilinear({ X: 0, Y: 0 }, { X: 1, Y: 1 })).toBe(true);
    expect(game.isOctilinear({ X: 0, Y: 0 }, { X: 2, Y: 2 })).toBe(true);
    expect(game.isOctilinear({ X: 0, Y: 3 }, { X: 3, Y: 0 })).toBe(true);
    expect(game.isOctilinear({ X: 1, Y: 2 }, { X: 0, Y: 1 })).toBe(true);

    expect(game.isOctilinear({ X: 0, Y: 0 }, { X: 2, Y: 3 })).toBe(false);
    expect(game.isOctilinear({ X: 1, Y: 2 }, { X: 3, Y: 1 })).toBe(false);

  });

});

