const Point = require('./Point');

describe("test methods of Point", () => {
  test("check that we can stringify", () => {
    const point = new Point(2, 4);
    expect(point.stringify()).toEqual("24");
  });
  test("check that we can convert a Point class to a generic object", () => {
    const point = new Point(2, 4);
    expect(point.objectify()).toEqual({ x: 2, y: 4 });
  });
});
