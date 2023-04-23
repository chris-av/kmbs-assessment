const makePayload = ({ is_p1_turn, isValidNode, isBeginNode, nodes }) => {

  if (isBeginNode) {

    if (isValidNode) {
      return {
        msg: "VALID_START_NODE",
        body: {
          heading: is_p1_turn ? "Player 1" : "Player 2",
          message: "Select a second node to complete the line.",
          newLine: null,
        }
      }
    } else {
      return {
        msg: "INVALID_START_NODE",
        body: {
          heading: is_p1_turn ? "Player 1" : "Player 2",
          message: "Not a valid starting position",
          newLine: null,
        }
      }
    }

  } else {
    if (isValidNode) {
      return {
        msg: "VALID_END_NODE",
        body: {
          heading: is_p1_turn ? "Player 1" : "Player 2",
          message: null,
          newLine: {
            start: nodes[0],
            end: nodes[1],
          },
        }
      }
    } else {
      return {
        msg: "INVALID_END_NODE",
        body: {
          heading: is_p1_turn ? "Player 1" : "Player 2",
          message: "Invalid move!",
          newLine: null,
        }
      }
    }
  }

}

const gameOver = ({ is_p1_turn, nodes }) => {
  return {
    msg: "GAME_OVER",
    body: {
      heading: "Game Over",
      message: `${is_p1_turn ? "Player 1" : "Player 2"} Wins!`,
      newLine: {
        start: nodes[0],
        end: nodes[1],
      }
    }
  }
}



module.exports = {
  makePayload,
  gameOver,
}
