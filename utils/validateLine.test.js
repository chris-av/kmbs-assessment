const validateLine = require('./validateLine');

describe("test validateLine", () => {
  test("test same points fails", () => {
    const p1 = { x: 2, y: 2 };
    const p2 = { x: 2, y: 2 };
    expect(validateLine(p1, p2)).toEqual(false);
  });
  test("test points along x axis", () => {
    const p1 = { x: 2, y: 2 };
    const p2 = { x: 2, y: 7 };
    expect(validateLine(p1, p2)).toBe(true);
  });
  test("test points along y axis", () => {
    const p1 = { x: 4, y: 2 };
    const p2 = { x: 2, y: 2 };
    expect(validateLine(p1, p2)).toBe(true);
  });
  test("test points orthoganal", () => {
    const p1 = { x: 2, y: 2 };
    const p2 = { x: 3, y: 3 };
    expect(validateLine(p1, p2)).toBe(false);
  });
})
