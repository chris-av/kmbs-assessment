const { describe, test, expect, afterEach } = require('@jest/globals');
const { makePayload, gameOver } = require('./generatePayload');


describe("test if our reducers produce the appropriate payload", () => {
  test("test first move", () => {
    expect(makePayload({
      is_p1_turn: true,
      isValidNode: true,
      isBeginNode: true,
    })).toEqual({
      msg: "VALID_START_NODE",
      body: {
        newLine: null,
        heading: "Player 1",
        message: "Select a second node to complete the line.",
      },
    });
  });
  test("player 1, making valid ending node", () => {
    expect(makePayload({
      is_p1_turn: true,
      isValidNode: true,
      isBeginNode: false,
      nodes: [
        { X: 0, Y: 0 },
        { X: 1, Y: 1 },
      ],
    })).toEqual({
      msg: "VALID_END_NODE",
      body: {
        newLine: {
          start: { X: 0, Y: 0 },
          end: { X: 1, Y: 1 },
        },
        heading: "Player 1",
        message: null,
      },
    });
  });
  test("player 2, making first node", () => {
    expect(makePayload({
      is_p1_turn: false,
      isValidNode: true,
      isBeginNode: true,
      nodes: [ // should be an unused argument
        { X: 0, Y: 0 },
        { X: 1, Y: 1 },
      ],
    })).toEqual({
      msg: "VALID_START_NODE",
      body: {
        newLine: null,
        heading: "Player 2",
        message: "Select a second node to complete the line.",
      },
    });
  });
  test("end the game, player 1 wins", () => {
    expect(gameOver({
      is_p1_turn: true,
      nodes: [
        { X: 0, Y: 0 },
        { X: 1, Y: 1 },
      ],
    })).toEqual({
      msg: "GAME_OVER",
      body: {
        newLine: {
          start: { X: 0, Y: 0 },
          end: { X: 1, Y: 1 },
        },
        heading: "Game Over",
        message: "Player 1 Wins!",
      },
    });
  });
});


