module.exports = function(p1, p2) {
  // they are the same point
  if (p1.x === p2.x && p1.y === p2.y) return false;

  // otherwise, ensure that either the x coordinate is the same or the y coordinate is the same
  if (p1.x !== p2.x && p1.y !== p2.y) return false;

  return true;

}
