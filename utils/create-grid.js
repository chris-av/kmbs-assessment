const Point = require('./Point');
module.exports = function(x_n, y_n) {
  let board = [];
  for (let i = 0; i < x_n; i++) {
    for (let j = 0; j < y_n; j++) {
      const point = new Point(i, j).stringify();
      board.push(point);
    }
  }
  return board;
}
