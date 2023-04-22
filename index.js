const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const cors = require('cors');
const PORT = process.env.PORT || 8000;

const Game = require('./utils/Game');

// allow testing on localhost
app.use(cors({
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
}));

// make sure we can parse JSON
app.use(express.json());

const game = new Game();


app.get("/initialize", (_, response) => {
  // initialize state of the game
  game.reset();
  return response.status(200).send({
    msg: "INITIALIZE",
    body: {
      newLine: null,
      heading: "Player 1",
      message: "Awaiting Player 1's Move"
    },
  });
});


app.post("/node-clicked", (request, response) => {
  const { statusCode, body, query, params } = request;

  console.log({ statusCode, query, body, params });

  return response.status(200).send({
    msg: "VALID_START_NODE",
    body: {
      newLine: body,
      heading: "Player 1",
      message: "Select a second node to complete the line.",
    },
  });

});

app.post("/error", (request, response) => {
  return response.statusCode(400).send({
    error: request.body,
  });
});


server.listen(PORT, () => {
  console.log('launching http server on port ' + PORT);
});




