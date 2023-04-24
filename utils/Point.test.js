const Point = require('./Point');

describe("test methods of Point", () => {
  test("check that we can stringify", () => {
    const point = new Point(2, 4);
    expect(point.stringify()).toEqual("2,4");
  });
  test("check that we can convert a Point class to a generic object", () => {
    const point = new Point(2, 4);
    expect(point.objectify()).toEqual({ x: 2, y: 4 });
  });
  test("translate a string to its object equivalent", () => {
    expect(Point.objectifyFromString("2,3")).toEqual({ x: 2, y: 3 });
    expect(Point.objectifyFromString("1,1")).toEqual({ x: 1, y: 1 });
  });
});
